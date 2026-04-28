<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-5xl mx-auto px-4">
        <!-- Main nav row -->
        <div class="py-3 flex items-center gap-2 flex-wrap">
          <NuxtLinkLocale to="/" class="text-blue-600 font-bold text-base mr-2 whitespace-nowrap">
            {{ $t('nav.postal') }}
          </NuxtLinkLocale>
          <NuxtLinkLocale to="/yubinbango-core" class="nav-link" :class="{ 'nav-link-active': route.path.endsWith('/yubinbango-core') }">
            yubinbango-core
          </NuxtLinkLocale>
          <NuxtLinkLocale to="/yubinbango-core2" class="nav-link" :class="{ 'nav-link-active': route.path.endsWith('/yubinbango-core2') }">
            yubinbango-core2
          </NuxtLinkLocale>
          <NuxtLinkLocale to="/zipcloud" class="nav-link" :class="{ 'nav-link-active': route.path.endsWith('/zipcloud') }">
            zipcloud API
          </NuxtLinkLocale>
          <NuxtLinkLocale to="/yubinbango-script" class="nav-link" :class="{ 'nav-link-active': route.path.endsWith('/yubinbango-script') }">
            yubinbango.js
          </NuxtLinkLocale>
          <NuxtLinkLocale to="/composable" class="nav-link" :class="{ 'nav-link-active': route.path.endsWith('/composable') }">
            Composable
          </NuxtLinkLocale>

          <span class="text-gray-200 mx-1 select-none">|</span>

          <NuxtLinkLocale
            to="/auto-kana"
            class="nav-link font-semibold"
            :class="{ 'nav-link-active': route.path.includes('/auto-kana') }"
          >
            {{ $t('nav.furigana') }}
          </NuxtLinkLocale>

          <!-- Language switcher -->
          <div class="ml-auto flex items-center gap-1">
            <button
              v-for="loc in locales"
              :key="loc.code"
              @click="setLocale(loc.code as 'ja' | 'en' | 'ms')"
              class="text-xs px-2 py-1 rounded-md font-medium transition-colors"
              :class="locale === loc.code
                ? 'bg-gray-800 text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'"
            >
              {{ loc.name }}
            </button>
          </div>
        </div>

        <!-- Auto-kana sub-nav row -->
        <div
          v-if="route.path.includes('/auto-kana') && !route.path.endsWith('/auto-kana')"
          class="border-t border-gray-100 py-2 flex items-center gap-1 flex-wrap"
        >
          <NuxtLinkLocale to="/auto-kana" class="text-xs text-gray-400 hover:text-gray-600 mr-2 py-1">
            {{ $t('nav.back') }}
          </NuxtLinkLocale>
          <NuxtLinkLocale to="/auto-kana/composable" class="nav-link text-xs" :class="{ 'nav-link-active': route.path.endsWith('/auto-kana/composable') }">
            useAutoKana
          </NuxtLinkLocale>
          <NuxtLinkLocale to="/auto-kana/wanakana" class="nav-link text-xs" :class="{ 'nav-link-active': route.path.endsWith('/auto-kana/wanakana') }">
            wanakana
          </NuxtLinkLocale>
          <NuxtLinkLocale to="/auto-kana/inline" class="nav-link text-xs" :class="{ 'nav-link-active': route.path.endsWith('/auto-kana/inline') }">
            {{ $t('common.inline') }}
          </NuxtLinkLocale>
          <NuxtLinkLocale to="/auto-kana/naive" class="nav-link text-xs" :class="{ 'nav-link-active': route.path.endsWith('/auto-kana/naive') }">
            Naive
          </NuxtLinkLocale>
        </div>
      </div>
    </nav>
    <main class="pb-16">
      <slot />
    </main>
    <footer class="border-t border-gray-100 py-4 text-center">
      <NuxtLinkLocale to="/docs" class="text-xs text-gray-300 hover:text-gray-500 transition-colors">
        docs
      </NuxtLinkLocale>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { locale, locales, setLocale } = useI18n()
</script>
