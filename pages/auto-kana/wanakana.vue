<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">{{ $t('common.npm') }}</span>
        <h1 class="text-2xl font-bold text-gray-900">wanakana</h1>
      </div>
      <p class="text-gray-500 text-sm">{{ $t('autoKana.wanakana.desc') }}</p>
    </div>

    <div class="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 mb-5 text-sm text-amber-800">
      {{ $t('autoKana.wanakana.warning') }}
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div class="bg-gray-100 rounded-2xl p-8">
        <div class="space-y-6">
          <div class="grid grid-cols-[5rem_1fr] items-center gap-4">
            <label class="font-bold text-gray-900 text-sm">{{ $t('common.name') }}</label>
            <input
              v-model="name"
              type="text"
              :placeholder="$t('common.namePlaceholder')"
              class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition"
            />
          </div>
          <div class="grid grid-cols-[5rem_1fr] items-center gap-4">
            <label class="font-bold text-gray-900 text-sm">{{ $t('common.furigana') }}</label>
            <div class="relative">
              <input
                ref="furiganaRef"
                type="text"
                :placeholder="$t('autoKana.wanakana.furiganaHint')"
                class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">wanakana</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <details class="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <summary class="px-6 py-4 cursor-pointer font-semibold text-gray-700 hover:bg-gray-50 select-none">
        {{ $t('common.implCode') }}
      </summary>
      <div class="px-6 pb-6">
        <p class="mt-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">pages/auto-kana/wanakana.vue</p>
        <CodeBlock :code="code" />

        <ul class="mt-4 text-sm text-gray-600 space-y-1">
          <li v-for="pro in ($tm('autoKana.wanakana.pros') as string[])" :key="pro">{{ pro }}</li>
        </ul>

        <div class="mt-4 bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
          <p class="font-semibold mb-1">{{ $t('autoKana.wanakana.diffTitle') }}</p>
          <p>{{ $t('autoKana.wanakana.diff1') }}</p>
          <p class="mt-1">{{ $t('autoKana.wanakana.diff2') }}</p>
          <p class="mt-1">{{ $t('autoKana.wanakana.diff3') }}</p>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import * as wanakana from 'wanakana'

const { t, tm } = useI18n()
useHead(computed(() => ({ title: t('autoKana.wanakana.pageTitle') })))

const name = ref('')
const furiganaRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (furiganaRef.value) {
    wanakana.bind(furiganaRef.value, { IMEMode: true })
  }
})

onUnmounted(() => {
  if (furiganaRef.value) {
    wanakana.unbind(furiganaRef.value)
  }
})

const code = `import * as wanakana from 'wanakana'

const furiganaRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (furiganaRef.value) {
    wanakana.bind(furiganaRef.value, { IMEMode: true })
  }
})

onUnmounted(() => {
  if (furiganaRef.value) {
    wanakana.unbind(furiganaRef.value)
  }
})

// <input ref="furiganaRef" type="text" />`
</script>
