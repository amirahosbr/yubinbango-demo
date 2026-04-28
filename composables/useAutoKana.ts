export interface AutoKanaOptions {
  output?: MaybeRef<'hiragana' | 'katakana'>
}

export function useAutoKana(
  inputRef: Ref<HTMLInputElement | null>,
  options: AutoKanaOptions = {},
) {
  const kana = ref('')

  let segments: string[] = []
  let currentSegment = ''

  function toHiragana(s: string) {
    return s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
  }

  function toKatakana(s: string) {
    return s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60))
  }

  function convert(s: string) {
    const mode = toValue(options.output) ?? 'hiragana'
    return mode === 'katakana' ? toKatakana(s) : toHiragana(s)
  }

  // Only trust the IME reading while it's still kana (before candidate selection switches to kanji)
  function isKana(s: string) {
    return /^[぀-ゟ゠-ヿㇰ-ㇿー\s　]*$/.test(s)
  }

  function flush() {
    kana.value = convert([...segments, currentSegment].join(''))
  }

  // Re-convert when output mode changes
  watch(() => toValue(options.output), flush)

  const handlers = {
    compositionstart: () => {
      currentSegment = ''
    },
    compositionupdate: (e: CompositionEvent) => {
      // Stop updating once IME switches to candidate mode (kanji appears in e.data)
      if (isKana(e.data ?? '')) {
        currentSegment = e.data ?? ''
        flush()
      }
    },
    compositionend: () => {
      segments.push(currentSegment)
      currentSegment = ''
      flush()
    },
    input: (e: Event) => {
      if ((e as InputEvent).isComposing) return
      if (!(e.target as HTMLInputElement).value) {
        segments = []
        currentSegment = ''
        kana.value = ''
      }
    },
  }

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

  onMounted(() => {
    if (inputRef.value) attach(inputRef.value)
  })

  watch(inputRef, (next, prev) => {
    if (prev) detach(prev)
    if (next) attach(next)
  })

  onUnmounted(() => {
    if (inputRef.value) detach(inputRef.value)
  })

  return { kana: readonly(kana) }
}
