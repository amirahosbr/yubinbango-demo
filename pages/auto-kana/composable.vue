<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-700">{{ $t('common.custom') }}</span>
        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-700">{{ $t('common.recommended') }}</span>
        <h1 class="text-2xl font-bold text-gray-900">useAutoKana Composable</h1>
      </div>
      <p class="text-gray-500 text-sm">
        <code class="bg-gray-100 px-1 rounded text-xs">composables/useAutoKana.ts</code>
        {{ $t('autoKana.composable.desc') }}
      </p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div class="flex items-center gap-3 mb-6">
        <span class="text-sm font-semibold text-gray-500">{{ $t('common.outputLabel') }}:</span>
        <label class="flex items-center gap-1.5 cursor-pointer">
          <input v-model="outputMode" type="radio" value="hiragana" class="accent-teal-600" />
          <span class="text-sm">{{ $t('common.hiragana') }}</span>
        </label>
        <label class="flex items-center gap-1.5 cursor-pointer">
          <input v-model="outputMode" type="radio" value="katakana" class="accent-teal-600" />
          <span class="text-sm">{{ $t('common.katakana') }}</span>
        </label>
      </div>

      <div class="bg-gray-100 rounded-2xl p-8">
        <div class="space-y-6">
          <div class="grid grid-cols-[5rem_1fr] items-center gap-4">
            <label class="font-bold text-gray-900 text-sm">{{ $t('common.name') }}</label>
            <input
              ref="nameRef"
              type="text"
              :placeholder="$t('common.namePlaceholder')"
              class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            />
          </div>
          <div class="grid grid-cols-[5rem_1fr] items-center gap-4">
            <label class="font-bold text-gray-900 text-sm">{{ $t('common.furigana') }}</label>
            <input
              :value="kana"
              type="text"
              :placeholder="outputMode === 'hiragana' ? $t('common.furiganaPlaceholderHira') : $t('common.furiganaPlaceholderKata')"
              readonly
              class="w-full border rounded-xl px-4 py-3.5 text-base transition"
              :class="kana ? 'bg-teal-50 border-teal-400 text-teal-900 autofilled' : 'bg-white border-gray-200'"
            />
          </div>
        </div>
      </div>
    </div>

    <details class="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <summary class="px-6 py-4 cursor-pointer font-semibold text-gray-700 hover:bg-gray-50 select-none">
        {{ $t('common.implCode') }}
      </summary>
      <div class="px-6 pb-6">
        <p class="mt-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">composables/useAutoKana.ts</p>
        <CodeBlock :code="codeComposable" />

        <p class="mt-5 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">pages/auto-kana/composable.vue</p>
        <CodeBlock :code="codeUsage" />

        <ul class="mt-4 text-sm text-gray-600 space-y-1">
          <li v-for="pro in ($tm('autoKana.composable.pros') as string[])" :key="pro">{{ pro }}</li>
        </ul>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
const { t, tm } = useI18n()
useHead(computed(() => ({ title: t('autoKana.composable.pageTitle') })))

const outputMode = ref<'hiragana' | 'katakana'>('hiragana')
const nameRef = ref<HTMLInputElement | null>(null)

const { kana } = useAutoKana(nameRef, { output: outputMode })

const codeComposable = `export function useAutoKana(
  inputRef: Ref<HTMLInputElement | null>,
  options: { output?: MaybeRef<'hiragana' | 'katakana'> } = {}
) {
  const kana = ref('')
  const isKana = (s: string) => /^[぀-ゟ゠-ヿㇰ-ㇿー\\s　]*$/.test(s)

  let segments: string[] = []
  let currentSegment = ''

  const handlers = {
    compositionstart: () => { currentSegment = '' },
    compositionupdate: (e: CompositionEvent) => {
      if (isKana(e.data ?? '')) { currentSegment = e.data ?? ''; flush() }
    },
    compositionend: () => { segments.push(currentSegment); currentSegment = ''; flush() },
    input: (e: Event) => {
      if ((e as InputEvent).isComposing) return
      if (!(e.target as HTMLInputElement).value) {
        segments = []; currentSegment = ''; kana.value = ''
      }
    },
  }

  onMounted(() => { if (inputRef.value) attach(inputRef.value) })
  onUnmounted(() => { if (inputRef.value) detach(inputRef.value) })

  return { kana: readonly(kana) }
}`

const codeUsage = `const outputMode = ref<'hiragana' | 'katakana'>('hiragana')
const nameRef = ref<HTMLInputElement | null>(null)

const { kana } = useAutoKana(nameRef, { output: outputMode })

// <input ref="nameRef" type="text" />
// <input :value="kana" readonly />`
</script>
