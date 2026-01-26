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


## 2026-01-24 — Deploy準備〜Vercel公開〜独自ドメイン接続（途中）

### 技術/構成（現状）
- Next.js(App Router) + TypeScript / Tailwind v3
- Next 15.5.x 系（Vercel脆弱性検知対応で 15.5.9 まで更新）
- MDX：next-mdx-remote/rsc + gray-matter + zod
- SSG中心（content/ から Projects / Showcase / Playroom 生成、draft:trueは本番非表示）
- Home Updates：src/content/updates/*.mdx を追加するだけで増える（typeでアイコン切替）
- Header撤去運用：site.ui.showHeader=false
  - 回遊は FloatingMenu + Footer
- PageTransition：軽いフェード、reduced-motion対応
- フォント：next/font（Noto Sans JP → --font-sans → font-sans）

### 直近で解決したこと
- Next.js 15.5.0 の脆弱性（Vercelがビルドを止める）
  - 最初は 15.5.7 へ更新したが、Vercel側でさらに 15.5.9 を要求/推奨
  - Vercelの "Vulnerable Dependencies"（fix-react2shell-next） がPR生成→適用で
    - Detected Next.js version: 15.5.9 を確認
    - ビルド/デプロイ成功

- GitHub push / Vercel が古いコミットを見ている問題
  - ローカルは進んでいたが、Vercelが 807e0cb をビルドしていた
  - `git ls-remote origin refs/heads/main` で main 更新を確認
  - `git commit --allow-empty -m "chore: trigger vercel"` でVercelの新デプロイを強制
  - 以降、Vercelが最新コミットでビルドするのを確認

### 独自ドメイン接続（Xserver → Vercel）
- 対象ドメイン：miyabi2020.com（※綴り注意：miaybiではなく miyabi）
- Vercel Domains の指示に従い、Xserver DNSへ設定：
  - A（@ / apex）: 216.198.79.1
  - CNAME（www）: 3c71ebac29e1ba7b.vercel-dns-017.com
- 現在：Xserver側のレコード入力は完了。Vercel側が Verified になるのを待機中。

### 次にやること
- Vercel → Project → Settings → Domains
  - miyabi2020.com / www.miyabi2020.com のステータスが Verified になったか確認（Refresh）
  - apex を Primary にし、www → apex リダイレクト（推見る）
- Verifiedにならない場合の優先チェック：
  - Xserver側に AAAA（IPv6）や衝突する A/CNAME が残っていないか（@ と www）
- 公開前最終：
  - README に「更新フロー」「デプロイ手順」「ドメイン設定」を追記


あなたは「ポートフォリオサイト制作専用の相棒GPT」です。以下の状態から作業を再開してください。

## プロジェクト概要
- Next.js(App Router)+TS / Tailwind v3 / MDX（next-mdx-remote/rsc + gray-matter + zod）
- SSG中心：content/ から Projects / Showcase / Playroom を生成（draft:trueは本番非表示）
- Home Updates：src/content/updates/*.mdx 追加で更新ログが増える（typeでアイコン）
- Header撤去運用：site.ui.showHeader=false（回遊はFloatingMenu + Footer）
- フォント：Noto Sans JP（--font-sans 経由）
- PageTransition：軽いフェード、reduced-motion対応

## 直近ログ（重要）
- Vercelの "Vulnerable Dependencies" 修正（fix-react2shell-next）適用で Next.js 15.5.9 になり、ビルド/デプロイ成功
- GitHub/Vercelのコミット同期問題は解決済み（最新コミットでビルドされる）

## いまの状況（独自ドメイン）
- ドメイン：miyabi2020.com（綴り注意：miaybiではない）
- Xserver DNS 設定済み：
  - A @ = 216.198.79.1
  - CNAME www = 3c71ebac29e1ba7b.vercel-dns-017.com
- VercelのDomainsが Verified になるのを待っている段階

## 次にやりたいこと
1) Vercel Domainsで Verified になったか確認し、必要なら原因切り分けして解決
   - apex を Primary
   - www → apex にリダイレクト
2) 公開前の最終チェック（アクセス/404/OGPなど軽く）
3) README に更新フロー＋Vercel運用＋Xserver独自ドメイン手順をチェックリスト化

出力ルール：
- 迷わせない。次にVSCode/ブラウザでやることを短いチェックリストで。
- エラーがあれば：原因仮説→最短検証→修正案。
- 進捗の最後に PROJECT_STATE を更新して出力する。

# PROJECT_LOG

## 2026-01-24 — Showcase: Before/After を “ミニUI” で比較表示（スクショ不使用）
### 背景
- Showcaseに「視覚的に伝わる」実績を追加したいが、スクショは守秘/解像度/言語混在で事故りやすい。
- 画像ではなく、UI構造（階層・状態・導線）を“ミニUI”として再現し、比較できる形に変更。

### 実装内容
- ミニUIコンポーネントを追加
  - `src/components/showcase/BeforeAfterMiniUI.tsx`
  - Before/After を並べ、`一覧 / 詳細 / 絞り込み` の切替タブを実装
  - 差分強調（Highlight）機能あり
- Showcase記事を追加
  - `content/showcase/ui-before-after.mdx`
  - 記事内で `<BeforeAfterMiniUI />` を使用
- サムネ（SVG）を追加
  - `public/showcase/ui-before-after.svg`

### MDX側の対応
- MDXコンポーネント登録は `src/components/MDX.tsx` にて実施
  - `BeforeAfterMiniUI` を import し、`baseComponents` に追加
  - これで MDX内で `<BeforeAfterMiniUI />` が直接使える

### 不具合と修正
- 症状：差分強調ONで表示が「乱れる」
- 原因：Highlightが `bg-*` を持ち、UI要素の上に“塗り”が被って潰していた
- 修正：
  - Highlight を「枠線のみ（bg透明）」に変更
  - `z-20` 付与して枠/ラベルの前面表示を安定化
  - ラベルを `bg-white/90 + backdrop-blur` で可読性UP
  - 差分強調の初期状態を OFF に変更（見た目を常に綺麗に）

### 現在の見せ方（方針）
- スクショは使わず、ReactでミニUIを描画して視覚的に伝える
- “差分強調”は上品に（枠線のみ）・必要な時だけON

### 関連ファイル
- `src/components/showcase/BeforeAfterMiniUI.tsx`
- `src/components/MDX.tsx`
- `content/showcase/ui-before-after.mdx`
- `public/showcase/ui-before-after.svg`

### 動作確認
- `pnpm dev`
- `/showcase` → 該当記事を開き、表示と切替が動くこと
- 「差分を強調 ON/OFF」で崩れないこと


あなたは「ポートフォリオサイト制作専用の相棒GPT」です。以下の状態から作業を再開してください。

## 現在のプロジェクト構成
- Next.js(App Router)+TS / Tailwind v3 / MDX（next-mdx-remote/rsc + gray-matter + zod）
- SSG中心：content/ から Projects / Showcase / Playroom を生成（draft:trueは本番非表示）
- Home Updates：src/content/updates/*.mdx 追加で更新ログが増える（typeでアイコン）
- Header撤去運用：site.ui.showHeader=false（回遊はFloatingMenu + Footer）
- フォント：Noto Sans JP（--font-sans 経由）
- PageTransition：軽いフェード、reduced-motion対応
- Next.js 15.5.9（VercelのVulnerable Dependencies対応済みでビルドOK）

## 直近の実装（Showcase追加）
- スクショに頼らず、Before/After を “ミニUI” で比較表示するShowcaseを実装した
  - 追加：src/components/showcase/BeforeAfterMiniUI.tsx
  - 追加：content/showcase/ui-before-after.mdx
  - 追加：public/showcase/ui-before-after.svg
  - MDX登録：src/components/MDX.tsx の baseComponents に BeforeAfterMiniUI を追加
- 差分強調の表示崩れがあったため修正済み
  - Highlightは「枠線のみ（bg透明）」＋ z-20
  - 差分強調の初期状態はOFF

## いまの状況（独自ドメイン）
- ドメイン：miyabi2020.com（綴り注意：miaybiではない）
- Xserver DNS：
  - A @ = 216.198.79.1（※ここが怪しい可能性あり）
  - CNAME www = 3c71ebac29e1ba7b.vercel-dns-017.com
- VercelのDomainsが Verified になるのを待っている段階
- 目標：apexをPrimary、www→apexにリダイレクト

## 次にやりたいこと
1) Vercel Domainsで Verified になったか確認し、必要なら原因切り分けして解決（apex Primary / www→apex redirect）
2) 公開前の最終チェック（アクセス/404/OGPなど軽く）
3) README に「更新フロー＋Vercel運用＋Xserver独自ドメイン手順」をチェックリスト化

出力ルール：
- 迷わせない。次にVSCode/ブラウザでやることを短いチェックリストで。
- エラーがあれば：原因仮説→最短検証→修正案。
- 進捗の最後に PROJECT_STATE を更新して出力する。

## 2026-01-25 引き継ぎログ（Home更新 / Playroom拡充）

### 発生した問題と解決
- Homeの更新（MDX追加/削除）が反映されない
  - 原因: `src/app/page.tsx` に `export const dynamic = "force-static";` があり、静的固定されやすかった
  - 対応: `force-static` を削除し、更新が反映される挙動に修正

- Vercelで「pushしても本番が変わらない」
  - 原因: Production URLではなく、Preview / 別デプロイを見ていた可能性
  - 対応: Vercelのデプロイ詳細画面の「Visit」から確認 → 更新が反映されることを確認
  - メモ: メールアドレス等を `.env.local` で変えた場合はGitに入らず本番反映されないので、VercelのEnvironment Variables側で管理する

- updatesのfrontmatterバリデーションエラー
  - エラー: summary が undefined（`summary` が必須スキーマ）
  - 対応: 該当MDXに `summary` を追加（または将来的に optional + 自動生成の方針も検討）

### UI改善（ボタン統一）
- `src/components/ui/ButtonLink.tsx` を追加し、primary/secondary + サイズでボタンを統一
- Homeの Contact/Showcase ボタンを `ButtonLink` に置換
- Hero（「Miyabiとは」内のボタン）も同じ `ButtonLink` デザインに統一

### Playroom拡充（体験が主役のレイアウト方針）
- 方針: “体験が主役” のステージ（大きいデモ領域）を中心に置き、補足はケースにまとめる
- `not-prose` を使い、MDX(Prose)のタイポ影響で崩れないようにする
- Magnetic CTA / Spotlight Grid を追加（MDXでデモ表示）

### Playroom/MDXの重要仕様（詰まりポイント）
- `src/app/playroom/[slug]/page.tsx` の `<MDX components={{...}} />` 方式のため、
  - MDX内の `import` は効かないことがある
  - 使うコンポーネントは page.tsx 側の `components` に登録が必要
  - Runtime Error「Expected component ...」は未登録が原因

### Spotlight Grid の挙動修正
- 問題1: 全カードが同時に同じモーション
  - 原因: 親要素のCSS変数（--mx/--my）を全カードが参照していた
  - 対応: カード単位でCSS変数（--cx/--cy）を持ち、カード基準座標で更新

- 問題2: 背後のカードも動く
  - 原因: ステージ（親）側の追従スポットライトが全体に影響
  - 対応: 親の追従をやめ、カード自身の `onPointerMove` で更新（ホバー中のカードだけ動く）

### 軽さ・運用メモ
- 依存ライブラリ追加なしで、rAF + CSS変数で表現
- reduced-motion に配慮（動かない/安定）
- Vercelでは「Visit」からProductionを確認する運用を固定

### TODO（次回）
- Playroomコンポーネント登録の手間を減らすため registry 化（`playroomComponents` を1箇所にまとめる）
- Hero.tsx の未使用import Warning（Link未使用）を整理
- updates の `summary` 必須を維持するか、optional + 自動生成にするか決める

あなたは「ポートフォリオサイト制作専用の相棒GPT」です。
Next.js(App Router)+TS、軽く見やすく、MDXで更新しやすい運用を最優先に進めてください。

【現状】
- Vercelにデプロイ済み。更新確認は Vercelデプロイ詳細の「Visit」から行う（本番URLを見間違えると反映されないように見える）。
- Homeの更新反映問題は `src/app/page.tsx` の `export const dynamic = "force-static";` を削除して解消済み。
- ボタンは `src/components/ui/ButtonLink.tsx` を追加して統一（primary/secondary + size=lg）。HomeとHero内ボタンも同デザインに統一済み。
- Playroomを拡充中。「体験が主役」のレイアウトに寄せたい（大きいステージ、補足はケース、`not-prose` で崩れ防止）。
- Playroom詳細は `src/app/playroom/[slug]/page.tsx` で `<MDX source=... components={{...}} />` 方式。MDX内importが効かないため、使うデモコンポーネントは page.tsx 側の components map に登録が必要。未登録だと Runtime Error「Expected component ...」になる。
- SpotlightGridDemo:
  - 全カード同期の原因は親CSS変数共有。カード単位変数（--cx/--cy）に変更。
  - 背後カードも動く原因は親ステージ追従の光。親追従をやめ、カード自身のonPointerMoveで更新し「ホバー中のカードだけ動く」に修正。

【いま取り組みたいこと】
- Playroomのデモを増やしつつ、全体の見た目を「体験主役」UIに統一。
- 次にやるなら:
  1) Playroomコンポーネント登録を registry 化して追加作業を簡略化
  2) Spotlight/Magneticなどのデモを同じ“ステージ枠”パターンで統一
  3) Hero.tsxの未使用import警告整理
  4) updatesのfrontmatter（summary必須）を維持するか、optional+自動生成にするか決める

【制約】
- できるだけSSG中心で軽量に。不要ライブラリは増やさない。
- アクセシビリティ（focus-visible、reduced-motion）を崩さない。
- 迷わせない：動くものを最短で作って段階的に磨く。

上記前提で、次の改善提案と実装手順（ファイルツリー→全文コード→コマンド→確認ポイント）を提示してください。


# PROJECT_LOG（Playroom統一・運用ルール固め）

## 2026-01-XX（作業まとめ）
### 目的
- Playroomを「体験主役UI」に統一し、MDXで追加が迷わない運用を確立する。

### できたこと（確定）
- Vercel本番確認は Deploy 詳細の「Visit」を正として運用（URL見間違い対策）。
- Home更新反映問題：`src/app/page.tsx` の `export const dynamic = "force-static";` を削除して解消。
- ボタン統一：`src/components/ui/ButtonLink.tsx` を追加し、primary/secondary + size=lg で統一。
- Playroom詳細のMDXレンダリング：`src/app/playroom/[slug]/page.tsx` で `<MDX source=... components={...} />` 方式。
  - MDX内importは使えないため、使用するデモコンポは `components map`（registry）に登録必須。
- frontmatter date問題：
  - `date: 2026-01-25` は YAML が Date に解釈してZodで落ちる場合あり。
  - 対策：`date: "YYYY-MM-DD"` のようにクォートして文字列にする。
- Playroomの links 表示は恒久OFF（Playroomは体験主役のためリンク欄はノイズになりやすい）。

### Stage（最終決定・器の統一）
- 「タイトルなし」「actions右上固定」「minHeightデフォルト md」「背景はGridで統一」に決定。
- Stageは“器だけ”を統一し、中身（デモUI/ボタン）は記事ごとに自由に作れる設計。

### registry運用
- `src/components/playroom/registry.tsx` に Playroomで使うMDXコンポを集約。
- 追加作業は「コンポ作成 → registryに1行追加 → MDXで呼ぶ」に固定。
- OrbitingIconFieldのRuntime Errorが出たため、registry側の import/export 形式（default/named）を合わせる必要あり。

### ThemeToggle（成功例）
- トグルをスライドで“ぬるっと”に改善（reduced-motion対応）。
- Stageに載せて良い見た目になった。

### ArcMenuPlayground（現在の問題）
- Stageに乗せるために、ArcMenuPlaygroundの“カード枠/見出し/説明”を削り「中身だけ」に寄せる方向にした。
- ただし現在スクショでレイアウトが崩れている（メニュー位置が上に寄る等）。
- 原因仮説：Stage内で高さが確定せず、absolute配置が想定通り効かない可能性。
- 未実行の提案修正：
  - Stage側を `flex flex-col` + 子を `flex-1` にして“キャンバスの高さを確定”させる（absolute系デモ安定化）。

### 次回の最優先TODO
1. Stageに「flexで高さ確定」修正を適用してArcMenu崩れが解消するか確認。
2. ArcMenuが直ったら、既存Playroom記事を順次「frontmatter直下に <Stage> + <Demo/>」へ統一。
3. registry未登録が原因のRuntime Errorを都度潰す（使うMDXタグ=registryキーを一致させる）。

あなたは「ポートフォリオサイト制作専用の相棒GPT」です。
Next.js(App Router)+TS、軽く見やすく、MDXで更新しやすい運用を最優先。

【現状】
- Vercel本番確認は Deploy詳細の「Visit」で行う。
- Homeのforce-staticは削除済みで反映OK。
- ButtonLinkでボタンデザイン統一済み。
- Playroom詳細は <MDX source=... components={...}/> 方式（MDX内import不可）。
- Playroom詳細ページの links 表示は恒久OFF。
- frontmatterの date は必ず "YYYY-MM-DD" の文字列で書く（クォート必須）。

【Playroomの最終ルール（確定）】
- “器”は Stage で統一、デモの中身（ボタン/UI）は各コンテンツで自由。
- Stage仕様（確定）：
  - タイトルなし
  - actions は右上固定
  - minHeight デフォルト md
  - 背景は全ページ Gridで統一
- MDX記事は frontmatter直下に必ず <Stage> を置き、すぐ体験できる構成にする。
- 説明は本文の「## メモ」に寄せる（Stage下のnotesは原則使わない、必要時のみ）。
- MDXで使うコンポは必ず src/components/playroom/registry.tsx に登録（未登録は Runtime Error）。

【未解決】
- ArcMenuPlaygroundがStageに載せた状態で崩れている。

【次にやること】
1) Stageに“高さ確定（flex）”修正を入れてArcMenu崩れが直るか検証
2) 直ったら既存Playroom記事をStageに順次移行（統一）
3) registry未登録のコンポが出たら即追加してRuntime Errorを潰す
