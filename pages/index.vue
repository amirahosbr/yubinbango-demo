<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <!-- Hero -->
    <div class="text-center mb-14">
      <div class="text-5xl mb-4">〒</div>
      <h1 class="text-3xl font-bold text-gray-900 mb-3">郵便番号自動入力デモ</h1>
      <p class="text-gray-500 text-lg max-w-xl mx-auto">
        7桁の郵便番号を入力すると都道府県・市区町村が自動入力される、4つの実装方法を比較するデモです。
      </p>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink
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
          デモを見る
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </NuxtLink>
    </div>

    <!-- Tip -->
    <div class="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
      <strong class="block mb-1">テスト用の郵便番号</strong>
      <div class="flex flex-wrap gap-x-6 gap-y-1 mt-2 font-mono">
        <span>1000001 → 東京都 千代田区 千代田</span>
        <span>1600022 → 東京都 新宿区 新宿</span>
        <span>5300001 → 大阪府 大阪市北区 梅田</span>
        <span>4600008 → 愛知県 名古屋市中区 栄</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: '郵便番号自動入力デモ' })

const pages = [
  {
    path: '/yubinbango-core',
    icon: '📦',
    title: 'yubinbango-core',
    badge: 'npm パッケージ',
    badgeClass: 'badge-npm',
    description: 'npm でインストールできる TypeScript 対応パッケージ。JSONP でデータを取得しセッション内にキャッシュ。Pinia / Nuxt 3 と最も相性が良い。',
    tags: [
      { text: 'セッションキャッシュ', class: 'bg-green-100 text-green-700' },
      { text: 'TypeScript対応', class: 'bg-blue-100 text-blue-700' },
      { text: 'watch ベース', class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/yubinbango-core2',
    icon: '📦',
    title: 'yubinbango-core2',
    badge: 'npm パッケージ v2',
    badgeClass: 'bg-indigo-100 text-indigo-700',
    description: 'yubinbango-core のフォーク。末尾に module.exports = YubinBango が追加され CommonJS として正しくエクスポート。Vite プラグインなしでそのまま動作する。API は完全互換。',
    tags: [
      { text: 'module.exports あり', class: 'bg-green-100 text-green-700' },
      { text: 'Viteプラグイン不要', class: 'bg-indigo-100 text-indigo-700' },
      { text: 'core1と互換', class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/zipcloud',
    icon: '🌐',
    title: 'zipcloud API',
    badge: 'REST API',
    badgeClass: 'badge-api',
    description: '無料の郵便番号検索 API（zipcloud.ibsnet.co.jp）を $fetch で呼び出す方法。npm インストール不要。ネットワーク依存だが、構造がシンプルで理解しやすい。',
    tags: [
      { text: 'npm不要', class: 'bg-green-100 text-green-700' },
      { text: 'ネットワーク必須', class: 'bg-yellow-100 text-yellow-700' },
      { text: '$fetch', class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/yubinbango-script',
    icon: '🏷️',
    title: 'yubinbango.js',
    badge: 'スクリプトタグ版',
    badgeClass: 'badge-dom',
    description: 'CDN のスクリプトタグ版。p-postal-code / p-region などのクラス名で DOM を直接書き換えるため Vue のリアクティビティと競合する。DOM 読み取りで同期する回避策を実装。',
    tags: [
      { text: 'DOM操作', class: 'bg-yellow-100 text-yellow-700' },
      { text: 'Vue非推奨', class: 'bg-red-100 text-red-700' },
      { text: '比較用', class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/composable',
    icon: '🔧',
    title: 'usePostalCode Composable',
    badge: 'パターン',
    badgeClass: 'badge-pattern',
    description: 'yubinbango-core2 を Nuxt 3 の Composable に包んで再利用可能にしたパターン。複数のフォームページや複数プロジェクトで同じロジックを共有できる。',
    tags: [
      { text: '再利用可能', class: 'bg-purple-100 text-purple-700' },
      { text: 'Composable', class: 'bg-blue-100 text-blue-700' },
      { text: 'ベストプラクティス', class: 'bg-green-100 text-green-700' },
    ],
  },
]
</script>
