# PROJECT_LOG

## Phase 1（雛形）
- Next.js(App Router) + TypeScript
- 共通レイアウト / ナビ / 5ページ
- Tailwind（CSS-first）で最低限のタイポ・カード・ボタン

## Phase 2（content/ + MDX）
- `content/` 配下の MDX + frontmatter から一覧/詳細を自動生成
- frontmatter は zod でビルド時バリデーション
- `draft: true` は本番で非表示


## 引き継ぎログ（最新）

### 現在地
- Phase 1（雛形）完了
- Phase 2（content/ + MDX運用）完了
- 全ページが開けて、MDX編集が即反映される状態まで到達

### 技術スタック/前提
- Next.js 15.5.0（App Router）+ TypeScript
- Tailwind CSS（※ v3 構成で固定）
- MDX: next-mdx-remote（RSC） + gray-matter + zod

### 重要な決定事項（ブレないよう固定）
- content管理は `content/` 配下のMDX + frontmatter
  - `content/projects/*.mdx`（status必須：ongoing/completed）
  - `content/showcase/*.mdx`
  - `content/playroom/*.mdx`
- frontmatter 必須：title / date(YYYY-MM-DD) / summary / tags（projectsは status）
- draft: true は本番で非表示（devでは表示してOK）
- pinned: true はHomeのPinned枠に優先表示（なければ最新3件）

### つまづいた点と解決
1) `shadow-soft` が unknown utility
- Tailwind v4記法（@theme）に寄せたことで混乱
- 結論：Tailwindはv3構成に固定し、`tailwind.config.ts` で shadow-soft を定義して解決

2) `@/lib/site` が見つからず全ファイル赤
- `tsconfig.json` の `baseUrl` / `paths` を整備して解決
  - baseUrl: "."
  - paths: { "@/*": ["src/*"] }
- VSCode側のTS Server再起動が効く場合あり

3) showcaseで frontmatter が undefined
- 1行目が `---` ではない/閉じ `---` が無い/キー名違い などでgray-matterが読めない
- frontmatterは「先頭から --- 開始」「--- で閉じる」を厳守して解決

### Tailwind v3 最終設定（固定）
- `postcss.config.mjs`:
  - tailwindcss + autoprefixer
- `globals.css`:
  - `@tailwind base; @tailwind components; @tailwind utilities;`
- `tailwind.config.ts`:
  - boxShadow.soft を定義（shadow-softを利用）

### 実装済みの主要構造
- src/lib/content/
  - `_fs.ts`: ファイル読み込み/gray-matter解析/バリデーション/ソート
  - `schemas.ts`: zodスキーマ（projectsはstatus必須）
  - `projects.ts`, `showcase.ts`, `playroom.ts`: 一覧/詳細取得
- ルーティング（SSG）
  - `/projects`（ongoing/completed）
  - `/projects/[slug]`（generateStaticParams）
  - `/showcase`, `/showcase/[slug]`
  - `/playroom`, `/playroom/[slug]`
- MDXレンダリング
  - `src/components/MDX.tsx`（next-mdx-remote/rsc）
  - `globals.css` にMDX用の軽量スタイル追加

### 開発コマンド
- dev: `npm run dev`
- build: `npm run build`
- lint: `npm run lint`
- typecheck: `npm run typecheck`

### 次やること（優先順）
1) Phase 3（見た目調整：余白/タイポ/カード密度、HomeのLP感）
2) READMEに「更新フロー（MDX追加→確認→push→Vercel）」を明文化
3) Phase 5（Vercelデプロイ → Xserver独自ドメイン接続）


/**** 引き継ぐプロンプト ****/
【引き継ぎ】
Next.js(App Router)+TSのポートフォリオ。Vercel運用、Xserver独自ドメイン接続予定。
構成は Home / Projects / Showcase / Playroom / Contact。雰囲気はcatnose.meっぽく軽く見やすい。

【現状】
- Phase1完了（共通レイアウト/ナビ/最低限スタイル/5ページ）
- Phase2完了（content/配下のMDX+frontmatterでProjects/Showcase/Playroomの一覧/詳細がSSG生成、全ページ表示OK）
- Homeは pinned があれば優先、なければ最新3件表示

【技術】
- Next.js 15.5.0 + TS
- Tailwindは v3 構成で固定（@tailwind base/components/utilities、postcssは tailwindcss+autoprefixer）
- MDX: next-mdx-remote/rsc + gray-matter + zod

【重要決定】
- content/
  - projectsは status(ongoing|completed) 必須
  - title/date(YYYY-MM-DD)/summary/tags 必須（links/draft/pinnedは任意）
- draft:true は本番非表示
- generateStaticParamsで静的生成

【過去にハマった点】
- Tailwind v4記法(@import "tailwindcss"/@theme)にして壊れた→v3に戻して解決
- @/lib/site が全赤→tsconfig baseUrl/pathsの調整で解決
- frontmatterが読めずundefined→MDXは先頭から --- を厳守で解決

【次にやりたい】
- Phase3（余白/タイポ/カード密度、HomeのLP感、MDX本文の読みやすさ）
- READMEに更新フロー
- Phase5（Vercel deploy→Xserverドメイン接続、www/apex方針）


# PROJECT_LOG

## Overview
Next.js(App Router)+TypeScript のポートフォリオ。Vercel運用、Xserver独自ドメイン接続予定。
構成：Home / Projects / Showcase / Playroom / Contact（※現状、上部ナビは非表示方針）。

## Stack / Tooling
- Next.js 15.5.0 + TypeScript
- Tailwind CSS v3（@tailwind base/components/utilities, postcss: tailwindcss+autoprefixer）
- MDX: next-mdx-remote/rsc + gray-matter + zod
- SSG: generateStaticParams で静的生成
- content/ 配下の MDX + frontmatter で一覧/詳細を生成

## Content Model (frontmatter rules)
- 共通必須：title / date(YYYY-MM-DD) / summary / tags
- Projects必須：status("ongoing" | "completed")
- 任意：links / draft / pinned
- draft: true は本番非表示
- MDXは先頭から `---` を厳守（frontmatterがundefinedになる対策）

## Phases
- Phase1 完了：共通レイアウト / ナビ / 最低限スタイル / 5ページ
- Phase2 完了：content/MDXから Projects/Showcase/Playroom の一覧/詳細をSSG生成、全ページ表示OK
- Phase3 進行中：余白/タイポ/カード密度、HomeのLP感、MDX本文の読みやすさ

## Phase3 Work Log (UI/UX)
### Typography / MDX
- @tailwindcss/typography を導入
- MDX詳細ページの本文を `<Prose>` で包み、読みやすさを統一
- Tailwindの `content` パスを `./src/**` に合わせてJITが効くように修正

### Styling Fixes
- Build Error: `shadow-soft` はTailwind標準に存在しないため、`shadow-sm` に置換して解決

### Home (LP-like)
- ファーストビュー（Hero）を段落表示（introを配列に）して行間/段落間の余白を確保
- Heroの上下余白は `Hero.tsx` の外側で管理（layout側には余白なし）
- HeroのCTAは「miyabi.comとは（/about）」と「Contact（/contact）」に変更
- Projectsは将来的に使うが、現時点では実績が少ないため集客は Showcase / Playroom に寄せる方針

### Navigation / Header Policy
- 上部ナビ（ヘッダー）は非表示方針（ファーストビューのみで回遊）
- `site.ui.showHeader = false` で SiteHeader を return null
- navアイテムには `enabled:false` を付けて表示制御（Projectsは非表示）

## Current Key Files
- src/lib/site.ts
  - name/title/intro（配列）
  - ui.showHeader（false）
  - nav（Projectsはenabled:false）
- src/components/Hero.tsx
  - intro段落表示（space-y）
  - Hero余白（pt/pb）を調整
  - CTA: /about, /contact
- SiteHeader（コンポーネント）
  - showHeader=falseで非表示（Inner分割でhooksルール回避）

## Decisions (Important)
- Tailwind v3固定（v4記法にして壊れた経験あり → v3に戻して解決）
- @/lib/site のパス問題は tsconfig baseUrl/paths 調整で解決
- Projectsは今は前面に出さない（Home/ナビから外す）。Showcase/Playroomで集客。

## Next TODO
- 下層ページで迷子防止：最小フッター導線（Home / Contact）を追加するか検討
- HomeのExplore（Showcase/Playroom）文言/カード密度を最終調整
- README に更新フロー追記（mdx追加→ローカル確認→push→Vercel自動デプロイ）
- Phase5：Vercel deploy → Xserver独自ドメイン接続（www/apex方針）


次回会話開始

【引き継ぎ】
Next.js(App Router)+TSのポートフォリオ。Next 15.5.0 / Tailwind v3 / MDX(next-mdx-remote/rsc + gray-matter + zod)。
Phase1・Phase2完了。Phase3（見た目）を進行中。

【現状】
- content/ 配下MDXから Projects/Showcase/Playroom をSSG生成（draft:trueは本番非表示）
- MDX詳細本文は <Prose> で統一
- Tailwindは src/ 配下のcontentパスに合わせて修正済み
- shadow-softエラーは shadow-sm へ置換して解決

【方針変更】
- Projectsは将来的に使うが、今は実績が少ないので集客は Showcase/Playroom へ寄せたい
- 上部ナビ（ヘッダー）は撤去して、ファーストビュー中心で回遊させたい
  - site.ui.showHeader=falseでSiteHeaderは非表示
  - navのProjectsは enabled:false

【Home】
- Heroは intro配列で段落表示（行間/段落間余白あり）
- ファーストビューCTAは「miyabi.comとは（/about）」と「Contact（/contact）」
- Hero余白は Hero.tsx の pt/pb で調整済み（layout側には余白なし）

【次にやりたい】
- 下層ページで迷子防止の最小導線（フッターにHome/Contact）を入れるか決めて実装
- HomeのExplore（Showcase/Playroom）文言・カード密度を最終調整
- READMEに更新フロー追記
- Phase5：Vercelデプロイ→Xserver独自ドメイン接続（www/apex方針）


# PROJECT_LOG（miyabi portfolio）

## 概要
- Next.js（App Router）+ TypeScript + Tailwind v3 のポートフォリオ
- 目的：シンプル / 軽い / 見やすい / 更新しやすい / Vercel運用
- 現在：Phase3（見た目）進行中、Home回遊最適化中

## 技術スタック
- Next.js 15.5.0（App Router）
- TypeScript
- Tailwind CSS v3 + @tailwindcss/typography
- MDX（next-mdx-remote/rsc + gray-matter + zod）
- SSG中心（content/ から生成）
- フォント：next/font（Noto Sans JP）を `--font-sans` 経由で `font-sans` に適用

## ルーティング（固定）
- /（Home）
- /projects（将来的に使用、現状は集客導線弱め）
- /projects/[slug]
- /showcase
- /playroom
- /contact
- /about（追加・文章固定ページ）
- （追加機能）Home下部に Updates（更新ログ）タイムライン表示

## コンテンツ管理（更新しやすさ最優先）
- `src/content/` 配下の MDX を読み込み→zodでバリデーション→ソート→一覧/詳細生成
- draft運用：`draft: true` は本番（production）で非表示
- MDX本文は `<Prose>` で統一して読みやすさと整形を統一

### ディレクトリ
- `src/content/projects/*.mdx`
- `src/content/showcase/*.mdx`
- `src/content/playroom/*.mdx`
- `src/content/updates/*.mdx`（追加：更新ログ）

## UI方針（ヘッダー撤去＋回遊）
- 上部ナビ（ヘッダー）は撤去
  - `site.ui.showHeader=false` で `SiteHeader` 非表示（DOMから外す）
  - navの Projects は `enabled:false`
- 集客導線は Showcase / Playroom 寄せ（Projectsは将来用）

## Home
- Heroは `site.intro` 配列を段落表示（space-y で段落間余白）
- CTA：`/about`（miyabi.comとは） と `/contact`
- Explore：Showcase/Playroom導線（文言・カード密度を最終調整中）

## Footer
- 下層の迷子防止としてフッター導線を採用（中央寄せ）
- 表示：Home（家アイコン） / Showcase / Playroom / X（Xアイコン）
- Xリンク：`https://x.com/miyabi_1998_`（外部、target=_blank + rel）
- フッター下部余白は `pb-*` を増やして調整（例：pb-24 md:pb-28）

## FloatingMenu（下部固定のポップアップ導線）
- ヘッダー無し運用のメイン導線として採用
- 仕様：
  - 下部固定のトリガー
  - 開くと弧状にアイコンが展開（半円プレートは最終的に削除）
  - アイコン間に「・」セパレータ
  - open時：トリガーは ×（XIcon）のみになる
  - overlay / 外側クリック / Esc / ルート変更で閉じる
  - アニメは軽量（CSS transition、reduced-motion対応）
- メニュー項目（例）：Home / About / Showcase / Playroom / Contact（※必要に応じて調整）

## ページ遷移アニメ
- `PageTransition` で軽いフェード/スライド（CSS keyframes）
- prefers-reduced-motion で抑制

## レイアウト（重要）
- `min-h-dvh flex flex-col` は空divではなく全体ラッパーに付ける（空白の原因になるため）
- `main` の上下余白は状況により調整：
  - ヘッダーOFF時の上余白：`site.ui.showHeader` を見て main に `pt-*` を付与（変数のスコープに注意）
  - 下余白：FloatingMenuと干渉しないよう `pb-*` を付与（Tailwind標準の値を使用）

## Aboutページ
- `src/app/about/page.tsx`
- 提供文章を `<Prose>` で整形
- 下部ボタンは「Homeに戻る」だけ

## Updates（更新ログ）タイムライン
- `src/content/updates/*.mdx` を追加するだけで Home下部に表示
- `src/lib/updates.ts` で読み込み・zodバリデーション・draftフィルタ・日付降順ソート
- frontmatter 例：
  - title, date(YYYY-MM-DD), summary, draft?, links?（label/url）
  - type（種別）：
    - release / feature / fix / design / content / update（未指定は update）
- `UpdatesTimeline` で typeごとにアイコン切替

## Tailwind
- `content` パスは src 配下 + `src/content` を含める
- typography カスタム済み（リンク下線、コード背景、pre背景など）
- fontFamily.sans を `--font-sans` に差し替え（Noto Sans JPをnext/fontで読み込み）

## 直近で解決したこと（メモ）
- Tailwindのcontentパスを src/ 構成に合わせて修正
- `shadow-soft` エラーは `shadow-sm` へ置換
- layoutで空div（min-h-dvh）が上部巨大余白の原因だったのを修正
- Homeで updates の `slice()` エラーは `await getAllUpdates()` に修正（Homeは server component）

## 次やること（TODO）
- Home Explore（文言・カード密度）を最終調整
- READMEに「更新フロー（MDX追加→確認→push→Vercel）」を追記
- Phase5：Vercelデプロイ → Xserver独自ドメイン接続（apex/www方針含めチェックリスト化）

あなたは「ポートフォリオサイト制作専用の相棒GPT」です。以下のプロジェクトを引き継いでください。

## プロジェクト概要
- Next.js(App Router)+TS、Next 15.5.0、Tailwind v3、MDX（next-mdx-remote/rsc + gray-matter + zod）
- Phase1/2完了、Phase3（見た目）進行中。軽く・見やすく・更新しやすいが最優先。
- ヘッダー撤去運用：site.ui.showHeader=false。回遊は下部固定FloatingMenuとフッターで担保。
- 集客導線はShowcase/Playroom寄せ。Projectsは将来用（nav enabled:false）。

## できていること（重要）
- content/ MDXから Projects/Showcase/Playroom をSSG生成（draft:trueは本番非表示）
- MDX本文は <Prose> 統一
- Homeに更新ログ（Updatesタイムライン）を追加：src/content/updates/*.mdx を追加するだけで増える
  - type（release/feature/fix/design/content/update）でタイムラインのアイコン切替
- FloatingMenu：弧状にアイコン展開＋セパレータ「・」、半円プレートは削除、開いたら×アイコンのみになる
- Footer：中央揃え。Home(家アイコン)/Showcase/Playroom/X（Xアイコン外部リンク https://x.com/miyabi_1998_）
- Aboutページ：指定文章をProseで整形。下部ボタンは「Homeに戻る」だけ
- フォント：next/font（Noto Sans JP）を --font-sans 経由で font-sans に適用
- PageTransition：軽いフェード。reduced-motion対応

## コード上の注意
- layoutで空の min-h-dvh div を作ると上部余白が爆増するのでNG（全体ラッパーに付ける）
- Homeは server component のまま。updates取得は `const updates = await getAllUpdates()`（"use client" は付けない）
- Tailwindの pb-22 のような非標準値は使わず、標準の pb-28 等で調整する

## いまやりたいこと
- Home Exploreの文言・カード密度の最終調整
- 余白（上/下）の最終調整（崩れない範囲で）
- READMEに更新フロー追記
- Phase5：Vercel→Xserver独自ドメイン（apex/www方針含めてチェックリスト化）

※ まずは現状を把握して、次にVSCodeでやることを短いチェックリストで出して。エラーがあれば原因仮説→最短検証→修正案の順で。
