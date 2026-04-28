<template>
  <div class="max-w-2xl mx-auto px-4 py-10">
    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2 flex-wrap">
        <span class="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">❌ 非推奨</span>
        <h1 class="text-2xl font-bold text-gray-900">ナイーブコピー</h1>
      </div>
      <p class="text-gray-500 text-sm">
        <code class="bg-gray-100 px-1 rounded text-xs">@input</code> で値をそのままコピーする誤ったアプローチ。
        漢字確定後の文字をコピーするため、ふりがなフィールドに漢字が入ります。
        なぜ <code class="bg-gray-100 px-1 rounded text-xs">compositionupdate</code> が必要かを確認するための逆説デモ。
      </p>
    </div>

    <div class="bg-red-50 border border-red-200 rounded-xl px-5 py-3 mb-5 text-sm text-red-800">
      <strong>意図的に壊れています。</strong> 氏名フィールドに「田中太郎」と入力してください — ふりがなに「田中太郎」（漢字）がコピーされます。これが compositionupdate なしの限界です。
    </div>

    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
      <div class="bg-gray-100 rounded-2xl p-8">
        <div class="space-y-6">
          <div class="grid grid-cols-[5rem_1fr] items-center gap-4">
            <label class="font-bold text-gray-900 text-sm">氏名</label>
            <input
              v-model="name"
              type="text"
              placeholder="田中　太郎"
              class="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition"
            />
          </div>
          <div class="grid grid-cols-[5rem_1fr] items-center gap-4">
            <label class="font-bold text-gray-900 text-sm">ふりがな</label>
            <div class="relative">
              <input
                :value="name"
                type="text"
                placeholder="（氏名と同じになります）"
                readonly
                class="w-full border rounded-xl px-4 py-3.5 text-base transition"
                :class="name ? 'bg-red-50 border-red-400 text-red-900' : 'bg-white border-gray-200'"
              />
              <span v-if="name" class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-400">← 漢字がコピーされる</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="name" class="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
        ❌ ふりがなに「{{ name }}」がそのまま入力されました。IME の読みを取得していないためです。
      </div>
    </div>

    <details class="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <summary class="px-6 py-4 cursor-pointer font-semibold text-gray-700 hover:bg-gray-50 select-none">
        なぜ壊れるのか
      </summary>
      <div class="px-6 pb-6">
        <p class="mt-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">このページのコード（壊れた実装）</p>
        <CodeBlock :code="codeBroken" />

        <div class="mt-5 bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-3">
          <p class="font-semibold">なぜこれが動かないのか</p>
          <p>
            日本語 IME は「ローマ字入力 → ひらがな変換 → 漢字候補選択」の3ステップで文字を確定します。
            <code class="bg-gray-200 px-1 rounded">v-model</code> / <code class="bg-gray-200 px-1 rounded">@input</code> が値を受け取るのは<strong>漢字確定後</strong>なので、
            この時点ではもう読み（ひらがな）の情報はありません。
          </p>
          <p>
            IME の各ステップのイベント:
          </p>
          <ul class="space-y-1 pl-4">
            <li><code class="bg-gray-200 px-1 rounded">compositionstart</code> — IME 入力開始</li>
            <li><code class="bg-gray-200 px-1 rounded">compositionupdate</code> — <strong>ひらがな読みがここにある</strong>（例: "たなか"）</li>
            <li><code class="bg-gray-200 px-1 rounded">compositionend</code> — 漢字確定（例: "田中"）</li>
            <li><code class="bg-gray-200 px-1 rounded">input</code> — ← v-model / @input はここ。もう漢字しかない</li>
          </ul>
          <p class="mt-2">
            解決策: <code class="bg-gray-200 px-1 rounded">compositionupdate</code> のイベントデータがひらがなの間だけ読みを記録する。これが <strong>useAutoKana Composable</strong> が行っていること。
          </p>
        </div>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'ナイーブコピー（非推奨）| ふりがな自動入力' })

const name = ref('')

const codeBroken = `// ❌ これは動かない — 漢字確定後の値しか取れない
const name = ref('')

// v-model は compositionend + input 後にしか更新されない
// その時点で IME の読み（ひらがな）は失われている

// <input v-model="name" placeholder="田中　太郎" />
// <input :value="name" readonly />  ← 「田中太郎」がコピーされる（ひらがなにならない）`
</script>
