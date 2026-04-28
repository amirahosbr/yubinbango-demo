<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">{{ $t('common.inline') }}</span>
        <h1 class="text-2xl font-bold text-gray-900">Inline Events</h1>
      </div>
      <p class="text-gray-500 text-sm">{{ $t('autoKana.inline.desc') }}</p>
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div class="bg-gray-100 rounded-2xl p-8">
        <div class="space-y-6">
          <div class="grid grid-cols-[5rem_1fr] items-center gap-4">
            <label class="font-bold text-gray-900 text-sm">{{ $t('common.name') }}</label>
            <input
              ref="nameRef"
              type="text"
              :placeholder="$t('common.namePlaceholder')"
              class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
          <div class="grid grid-cols-[5rem_1fr] items-center gap-4">
            <label class="font-bold text-gray-900 text-sm">{{ $t('common.furigana') }}</label>
            <input
              :value="furigana"
              type="text"
              :placeholder="$t('common.furiganaPlaceholderHira')"
              readonly
              class="w-full border rounded-xl px-4 py-3.5 text-base transition"
              :class="furigana ? 'bg-blue-50 border-blue-400 text-blue-900 autofilled' : 'bg-white border-gray-200'"
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
        <p class="mt-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">pages/auto-kana/inline.vue</p>
        <CodeBlock :code="code" />

        <ul class="mt-4 text-sm text-gray-600 space-y-1">
          <li v-for="pro in ($tm('autoKana.inline.pros') as string[])" :key="pro">{{ pro }}</li>
        </ul>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
const { t, tm } = useI18n()
useHead(computed(() => ({ title: t('autoKana.inline.pageTitle') })))

const nameRef = ref<HTMLInputElement | null>(null)
const furigana = ref('')

let segments: string[] = []
let currentSegment = ''

function isKana(s: string) {
  return /^[぀-ゟ゠-ヿㇰ-ㇿー\s　]*$/.test(s)
}

function flush() {
  furigana.value = [...segments, currentSegment].join('')
}

onMounted(() => {
  const el = nameRef.value
  if (!el) return

  el.addEventListener('compositionstart', () => {
    currentSegment = ''
  })

  el.addEventListener('compositionupdate', (e: CompositionEvent) => {
    if (isKana(e.data ?? '')) {
      currentSegment = e.data ?? ''
      flush()
    }
  })

  el.addEventListener('compositionend', () => {
    segments.push(currentSegment)
    currentSegment = ''
    flush()
  })

  el.addEventListener('input', (e) => {
    if ((e as InputEvent).isComposing) return
    if (!el.value) {
      segments = []
      currentSegment = ''
      furigana.value = ''
    }
  })
})

const code = `const nameRef = ref<HTMLInputElement | null>(null)
const furigana = ref('')

let segments: string[] = []
let currentSegment = ''

const isKana = (s: string) => /^[぀-ゟ゠-ヿㇰ-ㇿー\\s　]*$/.test(s)
const flush = () => (furigana.value = [...segments, currentSegment].join(''))

onMounted(() => {
  const el = nameRef.value
  if (!el) return

  el.addEventListener('compositionstart', () => { currentSegment = '' })

  el.addEventListener('compositionupdate', (e: CompositionEvent) => {
    if (isKana(e.data ?? '')) { currentSegment = e.data ?? ''; flush() }
  })

  el.addEventListener('compositionend', () => {
    segments.push(currentSegment); currentSegment = ''; flush()
  })

  el.addEventListener('input', (e) => {
    if ((e as InputEvent).isComposing) return
    if (!el.value) { segments = []; currentSegment = ''; furigana.value = '' }
  })
})

// ↑ composables/useAutoKana.ts に移動したのが Composable 版`
</script>
