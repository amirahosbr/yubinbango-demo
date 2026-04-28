<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <div class="text-center mb-14">
      <div class="text-5xl mb-4">あ</div>
      <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ $t('autoKana.index.title') }}</h1>
      <p class="text-gray-500 text-lg max-w-xl mx-auto">{{ $t('autoKana.index.subtitle') }}</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <NuxtLinkLocale
        v-for="page in pages"
        :key="page.path"
        :to="page.path"
        class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all duration-200 group"
      >
        <div class="flex items-start gap-4">
          <span class="text-3xl">{{ page.icon }}</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <h2 class="font-bold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
                {{ page.title }}
              </h2>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full" :class="page.badgeClass">
                {{ page.badge }}
              </span>
              <span v-if="page.recommended" class="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700">
                {{ $t('common.recommended') }}
              </span>
            </div>
            <p class="text-gray-500 text-sm leading-relaxed mb-3">{{ page.description }}</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in page.tags"
                :key="tag.text"
                class="text-xs px-2 py-0.5 rounded"
                :class="tag.class"
              >
                {{ tag.text }}
              </span>
            </div>
          </div>
        </div>
        <div class="mt-4 flex items-center text-teal-600 text-sm font-medium gap-1 group-hover:gap-2 transition-all">
          {{ $t('common.seeDemo') }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </NuxtLinkLocale>
    </div>

    <div class="mt-12 bg-teal-50 border border-teal-200 rounded-xl p-5 text-sm text-teal-800">
      <strong class="block mb-1">{{ $t('autoKana.index.howToTest') }}</strong>
      <p class="mt-1">{{ $t('autoKana.index.howToTestBody') }}</p>
      <p class="mt-1 text-teal-600">{{ $t('autoKana.index.howToTestNote') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

useHead(computed(() => ({ title: t('autoKana.index.title') })))

const pages = computed(() => [
  {
    path: '/auto-kana/composable',
    icon: '🔧',
    title: 'useAutoKana Composable',
    badge: t('autoKana.index.composable.badge'),
    badgeClass: 'bg-teal-100 text-teal-700',
    recommended: true,
    description: t('autoKana.index.composable.desc'),
    tags: [
      { text: t('autoKana.index.composable.tag1'), class: 'bg-green-100 text-green-700' },
      { text: t('autoKana.index.composable.tag2'), class: 'bg-teal-100 text-teal-700' },
      { text: t('autoKana.index.composable.tag3'), class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/auto-kana/wanakana',
    icon: '📦',
    title: 'wanakana',
    badge: t('autoKana.index.wanakana.badge'),
    badgeClass: 'bg-red-100 text-red-700',
    recommended: false,
    description: t('autoKana.index.wanakana.desc'),
    tags: [
      { text: t('autoKana.index.wanakana.tag1'), class: 'bg-red-100 text-red-700' },
      { text: t('autoKana.index.wanakana.tag2'), class: 'bg-orange-100 text-orange-700' },
      { text: t('autoKana.index.wanakana.tag3'), class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/auto-kana/inline',
    icon: '📝',
    title: 'Inline',
    badge: t('autoKana.index.inline.badge'),
    badgeClass: 'bg-blue-100 text-blue-700',
    recommended: false,
    description: t('autoKana.index.inline.desc'),
    tags: [
      { text: t('autoKana.index.inline.tag1'), class: 'bg-yellow-100 text-yellow-700' },
      { text: t('autoKana.index.inline.tag2'), class: 'bg-blue-100 text-blue-700' },
      { text: t('autoKana.index.inline.tag3'), class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/auto-kana/naive',
    icon: '❌',
    title: 'Naive',
    badge: t('autoKana.index.naive.badge'),
    badgeClass: 'bg-red-100 text-red-700',
    recommended: false,
    description: t('autoKana.index.naive.desc'),
    tags: [
      { text: t('autoKana.index.naive.tag1'), class: 'bg-red-100 text-red-700' },
      { text: t('autoKana.index.naive.tag2'), class: 'bg-red-100 text-red-700' },
      { text: t('autoKana.index.naive.tag3'), class: 'bg-gray-100 text-gray-600' },
    ],
  },
])
</script>
