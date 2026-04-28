<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-5xl mx-auto px-4">
        <!-- Main nav row -->
        <div class="py-3 flex items-center gap-2 flex-wrap">
          <NuxtLink to="/" class="text-blue-600 font-bold text-base mr-2 whitespace-nowrap">
            〒 郵便番号
          </NuxtLink>
          <NuxtLink to="/yubinbango-core" class="nav-link" :class="{ 'nav-link-active': route.path === '/yubinbango-core' }">
            yubinbango-core
          </NuxtLink>
          <NuxtLink to="/yubinbango-core2" class="nav-link" :class="{ 'nav-link-active': route.path === '/yubinbango-core2' }">
            yubinbango-core2
          </NuxtLink>
          <NuxtLink to="/zipcloud" class="nav-link" :class="{ 'nav-link-active': route.path === '/zipcloud' }">
            zipcloud API
          </NuxtLink>
          <NuxtLink to="/yubinbango-script" class="nav-link" :class="{ 'nav-link-active': route.path === '/yubinbango-script' }">
            yubinbango.js
          </NuxtLink>
          <NuxtLink to="/composable" class="nav-link" :class="{ 'nav-link-active': route.path === '/composable' }">
            Composable
          </NuxtLink>

          <span class="text-gray-200 mx-1 select-none">|</span>

          <NuxtLink
            to="/auto-kana"
            class="nav-link font-semibold"
            :class="{ 'nav-link-active': route.path.startsWith('/auto-kana') }"
          >
            あ ふりがな
          </NuxtLink>
        </div>

        <!-- Auto-kana sub-nav row (only on individual auto-kana pages) -->
        <div
          v-if="route.path.startsWith('/auto-kana') && route.path !== '/auto-kana'"
          class="border-t border-gray-100 py-2 flex items-center gap-1 flex-wrap"
        >
          <NuxtLink to="/auto-kana" class="text-xs text-gray-400 hover:text-gray-600 mr-2 py-1">← 一覧</NuxtLink>
          <NuxtLink to="/auto-kana/composable" class="nav-link text-xs" :class="{ 'nav-link-active': route.path === '/auto-kana/composable' }">
            useAutoKana
          </NuxtLink>
          <NuxtLink to="/auto-kana/wanakana" class="nav-link text-xs" :class="{ 'nav-link-active': route.path === '/auto-kana/wanakana' }">
            wanakana
          </NuxtLink>
          <NuxtLink to="/auto-kana/inline" class="nav-link text-xs" :class="{ 'nav-link-active': route.path === '/auto-kana/inline' }">
            インライン
          </NuxtLink>
          <NuxtLink to="/auto-kana/naive" class="nav-link text-xs" :class="{ 'nav-link-active': route.path === '/auto-kana/naive' }">
            ナイーブ
          </NuxtLink>
        </div>
      </div>
    </nav>
    <main class="pb-16">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>
