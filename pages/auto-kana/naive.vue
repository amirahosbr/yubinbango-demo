<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">{{ $t('common.notRecommended') }}</span>
        <h1 class="text-2xl font-bold text-gray-900">Naive Copy</h1>
      </div>
      <p class="text-gray-500 text-sm">{{ $t('autoKana.naive.desc') }}</p>
    </div>

    <div class="bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-5 text-sm text-red-800">
      {{ $t('autoKana.naive.warning') }}
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
                :value="name"
                type="text"
                placeholder="—"
                readonly
                class="w-full border rounded-xl px-4 py-3.5 text-base transition"
                :class="name ? 'bg-red-50 border-red-400 text-red-900' : 'bg-white border-gray-200'"
              />
              <span v-if="name" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-400">← ❌</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="name" class="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
        {{ $t('autoKana.naive.errorMsg', { value: name }) }}
      </div>
    </div>

    <details class="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <summary class="px-6 py-4 cursor-pointer font-semibold text-gray-700 hover:bg-gray-50 select-none">
        {{ $t('autoKana.naive.whyTitle') }}
      </summary>
      <div class="px-6 pb-6">
        <p class="mt-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{{ $t('autoKana.naive.whyTitle') }}</p>
        <CodeBlock :code="codeBroken" />

        <div class="mt-5 bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-3">
          <p>{{ $t('autoKana.naive.why.body') }}</p>
          <p class="font-semibold">{{ $t('autoKana.naive.why.eventsTitle') }}</p>
          <ul class="space-y-1 pl-4">
            <li v-for="(ev, i) in ($tm('autoKana.naive.why.events') as string[])" :key="i">
              <code class="bg-gray-200 px-1 rounded text-xs">{{ ev }}</code>
            </li>
          </ul>
          <p class="mt-2">{{ $t('autoKana.naive.why.solution') }}</p>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
const { t, tm } = useI18n()
useHead(computed(() => ({ title: t('autoKana.naive.pageTitle') })))

const name = ref('')

const codeBroken = `// ❌ broken — gets kanji, not the kana reading
const name = ref('')

// v-model fires AFTER kanji is committed — reading is already gone
// <input v-model="name" />
// <input :value="name" readonly />  ← copies 田中太郎, not たなかたろう`
</script>
