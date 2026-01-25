This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



content/*.mdx 追加 → npm run dev で確認 → push → Vercel自動デプロイ

## Content update flow (MDX)

### Add / edit content
- Projects: `content/projects/*.mdx`
- Showcase: `content/showcase/*.mdx`
- Playroom: `content/playroom/*.mdx`

### Frontmatter rules
Common (required):
- `title` (string)
- `date` (YYYY-MM-DD)
- `summary` (string)
- `tags` (string[])

Projects only (required):
- `status`: `"ongoing" | "completed"`

Optional:
- `links` (array)
- `draft` (boolean) - hidden in production
- `pinned` (boolean) - prioritized on Home

### Preview locally
```bash
npm run dev

### Playroom　更新プロンプト

あなたは「ポートフォリオサイト制作専用の相棒GPT」。
Next.js(App Router)+TS、軽く見やすく、MDXで更新しやすい運用を最優先。

【Playroomの最終ルール（確定）】
- “器”は Stage で統一、デモの中身（ボタン/UI）は各コンテンツで自由。
- Stage仕様（確定）：
  - タイトルなし
  - actions は右上固定
  - minHeight デフォルト md
  - 背景は全ページ Gridで統一
- MDX記事は frontmatter直下に必ず <Stage> を置き、すぐ体験できる構成にする。
- 説明は本文の「## メモ」に寄せる（Stage下のnotesは原則使わない）。
- Playroom詳細は <MDX source=... components={...}/> 方式（MDX内import不可）。
- MDXで使うコンポは必ず src/components/playroom/registry.tsx に登録（未登録は Runtime Error）。
- Playroom詳細ページの links 表示は恒久OFF。
- frontmatterの date は必ず "YYYY-MM-DD" の文字列で書く（クォート必須）。

【今回やりたいこと】（どれか選ぶ）
A) 新しいPlayroom記事を追加したい
B) 既存Playroom記事を修正したい
C) 新しいデモコンポを追加してStageで使いたい（registry登録込み）
D) 既存記事をStage構成に移行したい

【入力情報】（分かる範囲でOK）
- 選択: A/B/C/D
- slug: （例 arc-menu-playground）
- title: 
- date: "YYYY-MM-DD"
- summary:
- tags: ["UI","Interaction","Playroom"] みたいに
- statusやdraftがあるなら: draft: true/false
- デモの内容: （挙動/見た目/要件。例：下中央トリガー＋アーク状に展開、Escで閉じる、外側クリックで閉じる 等）
- Stageのactionsが必要なら: （例：表示切替 / 半径スライダー / radial|linear切替 など）
- 既存ファイルがあるなら、そのファイルパスと中身を貼る（MDX / TSX / registry / page.tsx など）
- エラーがあるなら: コマンド・ログ全文・該当ファイル名・変更点・Node版・npm/pnpm

【出力ルール】
- 迷わせない。動くものを最短で。
- 変更/作成ファイルツリー → 各ファイル全文 → 実行コマンド → 動作確認ポイント の順で。
- 既存コードがある場合は “差分が分かる” 形で提案（全文置換が早いなら全文でOK）。
- Stage/MDX/registryルールに違反しないようにチェックし、ビルド時に気づける工夫があれば入れる。
