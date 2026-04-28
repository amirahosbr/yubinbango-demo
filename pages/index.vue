<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <!-- Hero -->
    <div class="text-center mb-14">
      <div class="text-5xl mb-4">〒</div>
      <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ $t('postal.title') }}</h1>
      <p class="text-gray-500 text-lg max-w-xl mx-auto">{{ $t('postal.subtitle') }}</p>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLinkLocale
        v-for="page in pages"
        :key="page.path"
        :to="page.path"
        class="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
      >
        <div class="flex items-start gap-4">
          <span class="text-3xl">{{ page.icon }}</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <h2 class="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                {{ page.title }}
              </h2>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full" :class="page.badgeClass">
                {{ page.badge }}
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
        <div class="mt-4 flex items-center text-blue-600 text-sm font-medium gap-1 group-hover:gap-2 transition-all">
          {{ $t('common.seeDemo') }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </NuxtLinkLocale>
    </div>

    <!-- Tip -->
    <div class="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
      <strong class="block mb-1">{{ $t('postal.testTitle') }}</strong>
      <div class="flex flex-wrap gap-x-6 gap-y-1 mt-2 font-mono">
        <span v-for="item in ($tm('postal.testItems') as string[])" :key="item">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, tm } = useI18n()

useHead(computed(() => ({ title: t('postal.title') })))

const pages = computed(() => [
  {
    path: '/yubinbango-core',
    icon: '📦',
    title: 'yubinbango-core',
    badge: t('postal.core.badge'),
    badgeClass: 'badge-npm',
    description: t('postal.core.desc'),
    tags: [
      { text: t('postal.core.tag1'), class: 'bg-green-100 text-green-700' },
      { text: t('postal.core.tag2'), class: 'bg-blue-100 text-blue-700' },
      { text: t('postal.core.tag3'), class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/yubinbango-core2',
    icon: '📦',
    title: 'yubinbango-core2',
    badge: t('postal.core2.badge'),
    badgeClass: 'bg-indigo-100 text-indigo-700',
    description: t('postal.core2.desc'),
    tags: [
      { text: t('postal.core2.tag1'), class: 'bg-green-100 text-green-700' },
      { text: t('postal.core2.tag2'), class: 'bg-indigo-100 text-indigo-700' },
      { text: t('postal.core2.tag3'), class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/zipcloud',
    icon: '🌐',
    title: 'zipcloud API',
    badge: t('postal.zipcloud.badge'),
    badgeClass: 'badge-api',
    description: t('postal.zipcloud.desc'),
    tags: [
      { text: t('postal.zipcloud.tag1'), class: 'bg-green-100 text-green-700' },
      { text: t('postal.zipcloud.tag2'), class: 'bg-yellow-100 text-yellow-700' },
      { text: t('postal.zipcloud.tag3'), class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/yubinbango-script',
    icon: '🏷️',
    title: 'yubinbango.js',
    badge: t('postal.script.badge'),
    badgeClass: 'badge-dom',
    description: t('postal.script.desc'),
    tags: [
      { text: t('postal.script.tag1'), class: 'bg-yellow-100 text-yellow-700' },
      { text: t('postal.script.tag2'), class: 'bg-red-100 text-red-700' },
      { text: t('postal.script.tag3'), class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/composable',
    icon: '🔧',
    title: 'usePostalCode Composable',
    badge: t('postal.composable.badge'),
    badgeClass: 'badge-pattern',
    description: t('postal.composable.desc'),
    tags: [
      { text: t('postal.composable.tag1'), class: 'bg-purple-100 text-purple-700' },
      { text: t('postal.composable.tag2'), class: 'bg-blue-100 text-blue-700' },
      { text: t('postal.composable.tag3'), class: 'bg-green-100 text-green-700' },
    ],
  },
])
</script>
