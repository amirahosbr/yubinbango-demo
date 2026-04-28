# useAutoKana — How It Works (Beginner Friendly)

> **Who is this for?** Junior developers who want to understand every line of `composables/useAutoKana.ts` — including what Vue Composables are, what the Composition API is, and how Japanese IME input works.

---

## Table of Contents

1. [What is a Composable?](#1-what-is-a-composable)
2. [What is the Vue Composition API?](#2-what-is-the-vue-composition-api)
3. [How Japanese IME works (the hard problem we're solving)](#3-how-japanese-ime-works)
4. [The full code, explained line by line](#4-the-full-code-explained-line-by-line)
5. [How the pieces fit together — the full flow](#5-how-the-pieces-fit-together)
6. [How to use it in your component](#6-how-to-use-it-in-your-component)
7. [TypeScript concepts used](#7-typescript-concepts-used)
8. [Common questions](#8-common-questions)

---

## 1. What is a Composable?

A **Composable** is just a regular function that starts with `use` and contains Vue reactive logic inside it.

Think of it like a **plug-in box** you can drop into any component:

```
Your Component
┌─────────────────────────────────┐
│                                 │
│   const { kana } = useAutoKana(nameRef)   ← plug in the box
│                                 │
│   // kana auto-fills as user types       ← use what comes out
│                                 │
└─────────────────────────────────┘
```

Before composables existed, you had to copy-paste the same logic (event listeners, state, cleanup) into every component. Now you write it once in a `composables/` file and reuse it everywhere.

**The rule:** A composable must be called inside `<script setup>` (or inside `setup()`). Not in a button click handler, not in a timeout.

---

## 2. What is the Vue Composition API?

The **Composition API** is the modern way to write Vue logic. It gives you functions like `ref`, `watch`, `onMounted`, etc. that you call directly in `<script setup>`.

The key building blocks used in `useAutoKana`:

| Function | What it does |
|---|---|
| `ref(value)` | Creates a **reactive variable**. When you change `.value`, Vue automatically re-renders anything using it |
| `readonly(ref)` | Makes a ref that others can read but cannot change |
| `watch(source, callback)` | Runs a function whenever a reactive value changes |
| `onMounted(callback)` | Runs code after the component appears on the page |
| `onUnmounted(callback)` | Runs code just before the component disappears |
| `toValue(maybeRef)` | Safely reads a value whether it is a plain value or a `ref` |

---

## 3. How Japanese IME Works

This is the most important thing to understand before reading the code.

### What is an IME?

**IME (Input Method Editor)** is a helper program that sits between your keyboard and the text field. When typing Japanese, you cannot type kanji directly — your keyboard only has romaji (latin alphabet). The IME converts your keystrokes into Japanese text.

### The 3-step conversion process

When a user types 田中 (Tanaka), this is what happens:

```
Step 1: User types romaji
        t → a → n → a → k → a
                          ↓
Step 2: IME shows hiragana (pre-conversion)
        た → たな → たなか
                          ↓
Step 3: User presses Space → kanji candidates appear
        User selects 田中 → presses Enter
                          ↓
Step 4: 田中 is committed to the input field
```

### The problem

**Auto-kana needs the hiragana reading from Step 2** (たなか), not the final kanji from Step 4 (田中).

By the time the `input` event fires (which is what `v-model` uses), we are already at Step 4 — the hiragana reading is gone. That is why naive copy (`v-model` copy) doesn't work.

### The solution: IME events

The browser fires special events during the IME process:

```
User starts typing
       ↓
compositionstart  ← "IME opened"
       ↓
compositionupdate ← fires on EVERY keystroke
                    e.data = "た" → "たな" → "たなか"  ← the reading is HERE
       ↓
(user presses Space for candidates)
compositionupdate ← e.data = "田中" (now it's kanji, not kana)
       ↓
compositionend    ← "IME closed, kanji committed"
       ↓
input             ← v-model fires here, only kanji remains
```

### The three IME events (what they actually are)

All three are [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent) instances — a special event type that extends the normal `Event`. The most important property is **`e.data`**: a string holding whatever text the IME is currently working on.

#### `compositionstart` — [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event)

> *"Fired when a text composition session begins."*

This fires the moment the user starts composing through the IME — i.e., the instant the first romaji key is pressed and the IME takes over. At this point `e.data` is an empty string (nothing composed yet).

In our code this is where we reset `currentSegment = ''` so we start fresh for each new word.

#### `compositionupdate` — [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event)

> *"Fired when a new character is received in the context of a text composition session."*

This is the most important event. It fires on **every keystroke** while the IME is active. `e.data` holds the **full current candidate string** — not just the new character, but everything being composed right now.

```
User types: t → a → n → a → k → a
e.data:    "t"→"ta"→"た"→"たな"→"たな"→"たなか"
                 ↑ romaji switches to hiragana mid-composition
```

When the user presses Space to open the kanji candidate list, `e.data` changes to kanji (e.g. `"田中"`). This is when our `isKana()` guard kicks in and we stop recording.

#### `compositionend` — [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event)

> *"Fired when a text composition session ends."*

This fires when the user **confirms** their selection — presses Enter or picks a kanji from the candidate list. At this point the kanji is committed to the input field and the IME session is closed. `e.data` holds the final committed string (e.g. `"田中"`).

In our code we push `currentSegment` (the hiragana reading we saved) into `segments` here — not the `e.data` kanji.

---

**Our strategy:** Listen to `compositionupdate`. While `e.data` is still hiragana (before kanji candidates appear), save it. Stop saving when kanji appears.

---

## 4. The Full Code, Explained Line by Line

Here is the full composable:

```typescript
export interface AutoKanaOptions {
  output?: MaybeRef<'hiragana' | 'katakana'>
}
```

**What this is:** A TypeScript interface (a "shape" definition) for the options you can pass in.

`output` is optional (`?`). It controls whether ふりがな comes out as hiragana (たなか) or katakana (タナカ).

`MaybeRef<...>` means it can be either a plain string `'hiragana'` OR a Vue `ref('hiragana')`. This lets the option react to changes — if you have a radio button that changes the mode, the composable updates automatically.

---

```typescript
export function useAutoKana(
  inputRef: Ref<HTMLInputElement | null>,
  options: AutoKanaOptions = {},
) {
```

**The function signature.** It takes:
- `inputRef` — a Vue ref pointing to the **name input element** (the DOM element, not the value). We need the element itself so we can attach event listeners to it.
- `options` — the options object (defaults to `{}` = empty = use defaults)

`Ref<HTMLInputElement | null>` means "a Vue ref that holds either an HTML input element OR null (when the component hasn't mounted yet)".

---

```typescript
  const kana = ref('')
```

**The output.** This is the reactive string that will hold the furigana reading as it builds up. When this changes, any template binding `{{ kana }}` or `:value="kana"` updates automatically.

---

```typescript
  let segments: string[] = []
  let currentSegment = ''
```

**Why two variables?** Because a name like 田中太郎 has two kanji groups — the user types 田中 in one composition session, then 太郎 in another.

- `currentSegment` = what the IME is currently building (in-progress, temporary)
- `segments` = array of **completed** readings, one per kanji group

Example after typing 田中太郎:

```
After 田中 committed:  segments = ['たなか'],  currentSegment = ''
During 太郎 typing:    segments = ['たなか'],  currentSegment = 'たろう'
After 太郎 committed:  segments = ['たなか', 'たろう'],  currentSegment = ''
Final kana = 'たなかたろう'
```

These are plain `let` variables (not `ref`) because we don't need Vue to track them for re-rendering. Only `kana` (the output) needs to be reactive.

---

```typescript
  function toHiragana(s: string) {
    return s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
  }

  function toKatakana(s: string) {
    return s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60))
  }
```

**Unicode math magic.** In Unicode, hiragana and katakana characters are exactly 0x60 (96) apart:

```
Hiragana: あ = U+3042
Katakana: ア = U+30A2
Difference: 0x30A2 - 0x3042 = 0x60
```

So to convert:
- Katakana → Hiragana: subtract 0x60 from the character code
- Hiragana → Katakana: add 0x60 to the character code

The regex `/[ァ-ヶ]/g` matches all katakana characters (range from ァ to ヶ).
The `.replace()` runs the function on each matched character and replaces it with the converted one.

---

```typescript
  function convert(s: string) {
    const mode = toValue(options.output) ?? 'hiragana'
    return mode === 'katakana' ? toKatakana(s) : toHiragana(s)
  }
```

**Decides which conversion to apply.** `toValue()` safely unwraps a ref OR returns a plain value as-is. The `?? 'hiragana'` means "if the result is null or undefined, use 'hiragana' as default".

IME composition events always give us kana (usually hiragana or katakana depending on the system). We normalize to hiragana first (via `toHiragana`), or to katakana if the user chose that mode.

---

```typescript
  function isKana(s: string) {
    return /^[぀-ゟ゠-ヿㇰ-ㇿー\s　]*$/.test(s)
  }
```

**The guard that protects us from kanji.** This regex returns `true` only if the string contains ONLY kana characters (hiragana + katakana ranges), spaces, and the long vowel mark ー.

When the IME switches from hiragana mode to kanji candidate mode, `compositionupdate`'s `e.data` changes from `"たなか"` (passes `isKana`) to `"田中"` (fails `isKana`).

We use this to stop recording — we keep the last hiragana reading and ignore the kanji.

---

```typescript
  function flush() {
    kana.value = convert([...segments, currentSegment].join(''))
  }
```

**Updates the output `kana` ref.** It:
1. Spreads all completed segments into an array: `['たなか']`
2. Adds the in-progress current segment: `['たなか', 'たろう']`  
3. Joins them into one string: `'たなかたろう'`
4. Converts to the right kana type
5. Sets `kana.value` — this triggers Vue to re-render the furigana field

`flush()` is called every time something changes, like a "recalculate" button.

---

```typescript
  watch(() => toValue(options.output), flush)
```

**Reacts to output mode changes.** If the user switches from ひらがな to カタカナ (using the radio buttons), this `watch` calls `flush()` again — it re-converts the already-captured kana string to the new format.

Without this, switching modes would only affect new input, not what you've already typed.

---

```typescript
  const handlers = {
    compositionstart: () => {
      currentSegment = ''
    },
```

**When IME opens:** Reset `currentSegment` to empty. We're starting a fresh composition session (e.g., user is about to type another word).

---

```typescript
    compositionupdate: (e: CompositionEvent) => {
      if (isKana(e.data ?? '')) {
        currentSegment = e.data ?? ''
        flush()
      }
    },
```

**The heart of the composable.** This fires on every keystroke while IME is active.

- `e.data` = the current in-progress IME string
- `e.data ?? ''` = use empty string if `e.data` is null (safety)
- `isKana(...)` = only record if it's still hiragana/katakana (not kanji yet)
- `currentSegment = e.data` = save the reading
- `flush()` = update the furigana field in real time

---

```typescript
    compositionend: () => {
      segments.push(currentSegment)
      currentSegment = ''
      flush()
    },
```

**When user commits the kanji (presses Enter/Space to confirm).** We:
1. Save `currentSegment` into the `segments` array (it's now "done")
2. Reset `currentSegment` to empty (ready for next word)
3. Call `flush()` to update the output

---

```typescript
    input: (e: Event) => {
      if ((e as InputEvent).isComposing) return
      if (!(e.target as HTMLInputElement).value) {
        segments = []
        currentSegment = ''
        kana.value = ''
      }
    },
```

**Handles the case where the user clears the input.** 

- `isComposing` = if the input event fired during IME composition, ignore it (the composition events handle that)
- If the input field is now empty (user deleted everything), clear all our state too — reset `segments`, `currentSegment`, and `kana`

Without this, if you type 田中 → clear the field → type again, you'd see the old reading mixed in.

---

```typescript
  function attach(el: HTMLInputElement) {
    for (const [event, handler] of Object.entries(handlers)) {
      el.addEventListener(event, handler as EventListener)
    }
  }

  function detach(el: HTMLInputElement) {
    for (const [event, handler] of Object.entries(handlers)) {
      el.removeEventListener(event, handler as EventListener)
    }
  }
```

**Helper functions to add/remove all event listeners at once.**

`Object.entries(handlers)` converts the object into pairs: `[['compositionstart', fn], ['compositionupdate', fn], ...]`

We loop through and call `addEventListener`/`removeEventListener` for each one.

**Why do we need to remove listeners?** If you don't remove event listeners when a component unmounts, they keep running in the background — causing memory leaks and bugs. Always clean up.

---

```typescript
  onMounted(() => {
    if (inputRef.value) attach(inputRef.value)
  })
```

**When the component mounts (appears on screen):** If the ref is pointing at an element, attach the event listeners.

`inputRef.value` is null before the component mounts (the element doesn't exist yet). After mounting, it holds the actual `<input>` DOM element.

---

```typescript
  watch(inputRef, (next, prev) => {
    if (prev) detach(prev)
    if (next) attach(next)
  })
```

**Handles the ref changing.** In Vue, sometimes a `ref` can point to a different element — for example, if you use `v-if` on the input. This `watch` detaches from the old element and attaches to the new one.

`next` = the new element, `prev` = the old element (both could be null).

---

```typescript
  onUnmounted(() => {
    if (inputRef.value) detach(inputRef.value)
  })
```

**Cleanup when the component disappears.** Remove all event listeners to prevent memory leaks.

---

```typescript
  return { kana: readonly(kana) }
}
```

**What the composable gives back.** 

`readonly(kana)` wraps the ref so that whoever calls `useAutoKana()` can **read** `kana.value` but cannot **set** `kana.value` from outside. Only `useAutoKana` itself can update it (via `flush()`). This prevents accidental bugs where the parent component overwrites the kana.

---

## 5. How the Pieces Fit Together

Here is the full flow when a user types 田中太郎:

```
User clicks input field
         │
         ▼
User types: t-a-n-a-k-a (romaji)
         │
         ├── compositionstart fires
         │   → currentSegment = ''
         │
         ├── compositionupdate: e.data = "た"
         │   → isKana("た") = true
         │   → currentSegment = "た"
         │   → flush() → kana = "た"
         │
         ├── compositionupdate: e.data = "たな"
         │   → currentSegment = "たな"
         │   → flush() → kana = "たな"
         │
         ├── compositionupdate: e.data = "たなか"
         │   → currentSegment = "たなか"
         │   → flush() → kana = "たなか"
         │
         ├── User presses Space (candidate list opens)
         │
         ├── compositionupdate: e.data = "田中"
         │   → isKana("田中") = FALSE  ← kanji! stop updating
         │   → currentSegment stays "たなか"
         │
         ├── User selects 田中, presses Enter
         │
         ├── compositionend fires
         │   → segments.push("たなか") → segments = ["たなか"]
         │   → currentSegment = ''
         │   → flush() → kana = "たなか"
         │
         ├── User continues typing: t-a-r-o
         │
         ├── compositionstart fires
         │   → currentSegment = ''
         │
         ├── compositionupdate: e.data = "たろう" (builds up)
         │   → currentSegment = "たろう"
         │   → flush() → kana = "たなか" + "たろう" = "たなかたろう"
         │
         ├── compositionend fires
         │   → segments.push("たろう") → segments = ["たなか", "たろう"]
         │   → flush() → kana = "たなかたろう" ✅
         │
         ▼
Final furigana: たなかたろう
```

---

## 6. How to Use It in Your Component

### Basic usage

```vue
<template>
  <input ref="nameRef" type="text" placeholder="田中太郎" />
  <input :value="kana" readonly placeholder="たなかたろう" />
</template>

<script setup lang="ts">
const nameRef = ref<HTMLInputElement | null>(null)
const { kana } = useAutoKana(nameRef)
</script>
```

That's it. Two lines of setup code.

### With katakana output

```vue
<script setup lang="ts">
const nameRef = ref<HTMLInputElement | null>(null)
const { kana } = useAutoKana(nameRef, { output: 'katakana' })
// kana will be タナカタロウ instead of たなかたろう
</script>
```

### With reactive output mode (toggle button)

```vue
<script setup lang="ts">
const nameRef = ref<HTMLInputElement | null>(null)
const outputMode = ref<'hiragana' | 'katakana'>('hiragana')

// Pass the ref itself — composable watches it and re-converts automatically
const { kana } = useAutoKana(nameRef, { output: outputMode })
</script>
```

### Important: use `ref` on the input, NOT `v-model`

```vue
<!-- ✅ Correct: ref points to the DOM element -->
<input ref="nameRef" type="text" />

<!-- The furigana field uses :value (one-way), NOT v-model (two-way) -->
<!-- because it's readonly — only the composable should write to it -->
<input :value="kana" readonly />
```

---

## 7. TypeScript Concepts Used

### `Ref<HTMLInputElement | null>`

```typescript
const nameRef = ref<HTMLInputElement | null>(null)
//               ^─ starts as null
//   after mount: holds the actual <input> DOM element
```

`Ref<T>` is a Vue type — it means "a reactive box holding a value of type T".  
`HTMLInputElement | null` means "either an input element OR null". We start with null because the element doesn't exist before the component mounts.

### `MaybeRef<T>`

```typescript
output?: MaybeRef<'hiragana' | 'katakana'>
```

`MaybeRef<T>` is a Vue utility type meaning "either `T` or `Ref<T>`".  
So `MaybeRef<'hiragana' | 'katakana'>` means the option can be:
- A plain string: `'hiragana'`
- A Vue ref: `ref('hiragana')` (reactive, can change)

Use `toValue(maybeRef)` to safely read it either way.

### `readonly(kana)`

```typescript
return { kana: readonly(kana) }
```

`readonly()` returns a read-only version of a ref. The type becomes `Readonly<Ref<string>>`. If the caller tries to do `kana.value = 'something'`, TypeScript will show an error at compile time.

### `Object.entries(handlers)`

```typescript
for (const [event, handler] of Object.entries(handlers)) { ... }
```

`Object.entries({ a: 1, b: 2 })` returns `[['a', 1], ['b', 2]]`.  
Destructuring `[event, handler]` unpacks each pair. This is a clean way to loop over an object's keys and values together.

---

## 8. Common Questions

**Q: Why use `let segments` instead of `ref([])`?**

Because we don't need Vue to re-render when `segments` changes — only the final `kana` ref needs to be reactive. Using plain `let` is simpler and faster.

**Q: Why does `isKana` use character ranges like `[぀-ゟ゠-ヿ]`?**

These are Unicode code point ranges:
- `぀–ゟ` = hiragana block (ぁ あ ぃ い ... ん ゞ)
- `゠–ヿ` = katakana block (ァ ア ィ イ ... ン ヾ)
- `ー` = the long vowel mark (used in both)
- `\s　` = space and Japanese full-width space

If the IME data contains anything outside these ranges (like 田中 which are in the CJK block), `isKana` returns `false`.

**Q: Why do we need both `onMounted` and `watch(inputRef, ...)`?**

- `onMounted` handles the first time (initial element attachment)
- `watch(inputRef, ...)` handles if the element changes later (e.g., `v-if` toggles the input)

Together they cover all cases.

**Q: What if the user types without IME (e.g., already in hiragana mode)?**

On macOS and most mobile devices, even direct hiragana input goes through the IME layer and fires composition events. So `useAutoKana` still captures it correctly.

**Q: What happens if I paste text into the name field?**

Paste does NOT fire composition events — it fires a plain `paste` event, then `input`. So pasting bypasses `useAutoKana` and the furigana field won't auto-fill. This is a known limitation of all IME-based auto-kana. The only fix would be to also listen to the `paste` event and use a separate reading API (like MeCab/kuromoji morphological analysis), which is much more complex.

**Q: Can I use this with `v-model` on the name field?**

Yes — `v-model` on the name field works fine. `useAutoKana` attaches its own separate event listeners. The only thing is, don't put `v-model` on the **furigana** field — it's `readonly`, so use `:value="kana"` instead.

---

## Further Reading

| Topic | Link |
|---|---|
| `compositionstart` event | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event) |
| `compositionupdate` event | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event) |
| `compositionend` event | [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event) |
| Vue `ref` | [Vue Docs](https://vuejs.org/api/reactivity-core#ref) |
| Vue `watch` | [Vue Docs](https://vuejs.org/api/reactivity-core#watch) |
| Vue `onMounted` / `onUnmounted` | [Vue Docs](https://vuejs.org/api/composition-api-lifecycle) |
| Vue Composables guide | [Vue Docs](https://vuejs.org/guide/reusability/composables) |
| `MaybeRef` / `toValue` | [Vue Docs](https://vuejs.org/api/reactivity-utilities#tovalue) |

---

## File Location

```
composables/
└── useAutoKana.ts   ← this composable

pages/
└── auto-kana/
    ├── composable.vue   ← demo: uses useAutoKana (one-liner)
    ├── inline.vue       ← demo: same logic without composable
    ├── wanakana.vue     ← demo: different approach (wanakana.bind)
    └── naive.vue        ← demo: broken approach (shows why IME events matter)
```
