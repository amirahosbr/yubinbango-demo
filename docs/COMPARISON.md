# What's actually different between the 5

## Data source & mechanism

| Page | How it gets the address |
|---|---|
| **yubinbango-core** | JSONP — appends `<script>` tag to `document.head`, fetches from `yubinbango.github.io` |
| **yubinbango-core2** | Same JSONP, same URL, same data |
| **yubinbango.js** | Same JSONP, same URL — just the script tag is loaded from CDN instead of npm |
| **zipcloud** | REST API — `$fetch` to `zipcloud.ibsnet.co.jp`, different server, different org |
| **Composable** | Same JSONP as core1 — just wrapped in `usePostalCode()` |

**Actual different data sources: 2** — yubinbango's GitHub Pages, and zipcloud.

---

## What each page actually demonstrates

| Page | The real point |
|---|---|
| **yubinbango-core** | Direct npm usage in a component. Requires a Vite plugin to fix the missing `module.exports`. |
| **yubinbango-core2** | Same package, fork that added `module.exports`. In this project we still normalize it to ESM at build time for Cloudflare/browser runtime stability. |
| **yubinbango.js** | The DOM-class-name version (`p-region`, `p-locality`). Fights Vue reactivity, needs a `setTimeout` hack to sync DOM → state. Shows why you shouldn't use this in Vue. |
| **zipcloud** | A completely different provider. Pure `$fetch` REST call. Requires `{ parseResponse: JSON.parse }` because they send `Content-Type: text/plain`. |
| **Composable** | Not a different library — it's a code organisation pattern. Shows how to wrap core1 into `usePostalCode()` so the page component becomes one line. |

---

## The actually meaningful comparisons

**core1 vs core2** — only `module.exports` exists in core2. Same code, same data, same API. In this project both are normalized to ESM in Vite for consistent behavior on Cloudflare runtime.

**yubinbango (any) vs zipcloud** — the real fork. Different server, different maintainer, different failure modes. Yubinbango goes down if GitHub Pages goes down; zipcloud goes down if ibsnet goes down.

**yubinbango.js vs core1/core2** — same underlying library, packaged differently. Script tag = DOM manipulation = not Vue-compatible. npm = callback API = Vue-compatible.

**Composable vs core1** — identical behavior. Only shows where to put the code.

---

## Why `module.exports` matters

JavaScript has two module systems that don't naturally understand each other:

**CommonJS (Node.js, old)** — uses `module.exports` to say "here's what I'm exporting":
```js
module.exports = YubinBango  // "take this object when you require me"
```

**ES Modules (modern browsers, Vite, TypeScript)** — uses `export`:
```js
export default YubinBango
```

### What yubinbango-core does

The compiled output just sets a variable and stops:
```js
var YubinBango = {}
;(function(YubinBango) {
  YubinBango.Core = class Core { ... }
})(YubinBango)

// ← nothing exported. file ends here.
```

That was fine in 2015 — you'd load it via `<script>` tag and `window.YubinBango` would exist globally in the browser. No import system involved.

### Why that breaks in Vite/Nuxt

When you write `import YubinBango from 'yubinbango-core'`, Vite (Rollup under the hood) reads the file, looks for something to call the "default export", finds **nothing**, and throws:

```
"default" is not exported by yubinbango-core.js
```

The variable `YubinBango` exists inside the file's scope — Vite just has no way to know you want it as the export.

### What yubinbango-core2 added

One line at the very end:
```js
module.exports = YubinBango
```

Now Vite's CommonJS interop kicks in, sees `module.exports`, wraps it as `{ default: YubinBango }`, and `import YubinBango from 'yubinbango-core2'` works with no hacks.

### In short

`module.exports` is the bridge between "old browser global variable" code and "modern import/require" code. Without it, the package only works as a `<script>` tag. With it, bundlers (Vite, Webpack, etc.) can treat it as a proper module.

---

## Runtime issue we hit on Cloudflare

### Symptom

- `/yubinbango-core2` and `/composable` returned `500`
- message: `module is not defined`

### Cause

`module.exports` from `yubinbango-core2` leaked into browser-executed runtime code in the Cloudflare bundle path. In browser runtime, `module` does not exist.

### Fix applied in this project

In `nuxt.config.ts`, the Vite transform for `yubinbango-core2`:

1. Removes `module.exports = YubinBango`
2. Appends `export default YubinBango`

This keeps app code on `yubinbango-core2` while producing stable ESM output in both local and Cloudflare deploy builds.
