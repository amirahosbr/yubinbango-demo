<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <div class="text-center mb-14">
      <div class="text-5xl mb-4">あ</div>
      <h1 class="text-3xl font-bold text-gray-900 mb-3">ふりがな自動入力デモ</h1>
      <p class="text-gray-500 text-lg max-w-xl mx-auto">
        氏名フィールドに入力すると、IME の変換イベントからふりがなを自動取得する4つの実装方法を比較するデモです。
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <NuxtLink
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
                ★ 推奨
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
          デモを見る
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </NuxtLink>
    </div>

    <div class="mt-12 bg-teal-50 border border-teal-200 rounded-xl p-5 text-sm text-teal-800">
      <strong class="block mb-1">テスト方法</strong>
      <p class="mt-1">氏名フィールドをクリックして日本語 IME で入力してください（例: 田中太郎）。ふりがなフィールドにひらがなが自動入力されます。</p>
      <p class="mt-1 text-teal-600">IME で変換前のひらがな読みを <code class="bg-teal-100 px-1 rounded">compositionupdate</code> イベントで取得し、変換後のふりがなを自動入力します。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'ふりがな自動入力デモ' })

const pages = [
  {
    path: '/auto-kana/composable',
    icon: '🔧',
    title: 'useAutoKana Composable',
    badge: 'カスタム',
    badgeClass: 'bg-teal-100 text-teal-700',
    recommended: true,
    description: 'composables/useAutoKana.ts に IME イベントをラップしたカスタム Composable。依存ゼロで Vue に完全対応。使う側はたった1行。',
    tags: [
      { text: '依存ゼロ', class: 'bg-green-100 text-green-700' },
      { text: 'IMEイベント', class: 'bg-teal-100 text-teal-700' },
      { text: 'ひらがな / カタカナ切替', class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/auto-kana/wanakana',
    icon: '📦',
    title: 'wanakana',
    badge: 'npm',
    badgeClass: 'bg-red-100 text-red-700',
    recommended: false,
    description: 'wanakana.bind() でふりがなフィールドにバインド。ローマ字→ひらがなをリアルタイム変換。氏名からの自動取得ではなく「ふりがな入力補助」用途。',
    tags: [
      { text: 'wanakana@5', class: 'bg-red-100 text-red-700' },
      { text: 'ローマ字→ひらがな', class: 'bg-orange-100 text-orange-700' },
      { text: 'IMEとは別', class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/auto-kana/inline',
    icon: '📝',
    title: 'Inline イベント',
    badge: 'インライン',
    badgeClass: 'bg-blue-100 text-blue-700',
    recommended: false,
    description: 'useAutoKana と同じロジックを Composable に分離せず、コンポーネント内に直接書いた版。動作は同じ、コードの冗長性が増す。Composable の必要性を確認するための比較。',
    tags: [
      { text: 'Composable なし', class: 'bg-yellow-100 text-yellow-700' },
      { text: 'IMEイベント', class: 'bg-blue-100 text-blue-700' },
      { text: '比較用', class: 'bg-gray-100 text-gray-600' },
    ],
  },
  {
    path: '/auto-kana/naive',
    icon: '❌',
    title: 'ナイーブコピー',
    badge: '非推奨',
    badgeClass: 'bg-red-100 text-red-700',
    recommended: false,
    description: '@input で値をそのままコピーする誤ったアプローチ。漢字確定後の文字をコピーするため、ふりがなフィールドに「田中太郎」が入ってしまう。なぜ compositionupdate が必要かを確認するための逆説デモ。',
    tags: [
      { text: '動作しない', class: 'bg-red-100 text-red-700' },
      { text: '漢字がコピーされる', class: 'bg-red-100 text-red-700' },
      { text: '教育目的', class: 'bg-gray-100 text-gray-600' },
    ],
  },
]
</script>
