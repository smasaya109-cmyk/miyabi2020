import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Prose } from "@/components/Prose";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
};

export default function AboutPage() {
  return (
    <Container>
      {/* 上下余白（幅は維持） */}
      <div className="pt-6 pb-12 sm:pb-16">
        <Prose>
          <h1>自己紹介</h1>

          <p>
            こんにちは、みやびです。日本人ですが、世界中を飛びながら働くノマドワーカーです。
          </p>

          <p>
            もともとはスポーツ漬けの毎日で、引退後にプログラミングとWebの世界に入り込みました。最初は「面白そう」から始まったのに、気づけばどっぷり。作るほどに面白くて、今でもずっと楽しく続いています。
          </p>

          <p>
            生活はわりとシンプルで、毎朝ジムに行って、カフェで作業するのが日課です。注文はだいたいエスプレッソ。場所が変わっても、このルーティンがあると落ち着いて集中できます。
          </p>

          <h2>できること</h2>

          <p>
            主に Webサイト制作 / Web開発 を中心に、企画〜実装まで対応しています。
            <br />
            「まずは相談したい」「何から決めればいいか分からない」段階でも大丈夫です。目的や状況を整理しながら、必要なものを一緒に形にしていきます。
          </p>

          <h3>対応領域の例</h3>

          <ul>
            <li>コーポレートサイト / サービスサイト / LP</li>
            <li>UI設計、導線設計、情報設計（どの情報をどう見せるか）</li>
            <li>フロントエンド実装（軽さ・見やすさ・崩れにくさ）</li>
            <li>Webアプリの機能実装（要件に合わせて）</li>
            <li>WordPress構築 / カスタマイズ（運用しやすさ重視）</li>
          </ul>

          <p>※「全部できます」よりも、目的に合わせて “やるべきことを絞る” のが得意です。</p>

          <h2>このサイトについて</h2>

          <p>
            miyabi.com は、僕の仕事や作ったものを知ってもらうために、自分で設計・実装したサイトです。
            実案件の制作例は Showcase に、試作や趣味のデザイン・実験は Playroom にまとめています。
          </p>

          <ul>
            <li>
              <strong>Showcase</strong>：要件に沿って作った制作物（目的・工夫した点も分かるように）
            </li>
            <li>
              <strong>Playroom</strong>：アイデア検証、UIの試作、遊びのアウトプット（思考のログ）
            </li>
          </ul>

          <p>
            「どんなものを作るのか」だけじゃなく、どう考えて作るのかも伝わる場所にしたくて、この形にしています。
          </p>

          <h2>進め方のイメージ</h2>

          <p>
            要件が固まっていなくてもOKです。目的と期限、それだけでもスタートできます。
            <br />
            進めるうえで大事にしているのは、次の3つです。
          </p>

          <ol>
            <li>
              <strong>軽くて見やすい構成を優先します</strong>
              <br />
              見た目だけ整っていても、重かったり迷子になったら意味がないので、
              まずは 情報の順番 / 導線 / 読みやすさを優先して提案・実装します。
            </li>

            <li>
              <strong>更新しやすい運用を前提に設計します</strong>
              <br />
              納品した瞬間が完成ではなく、運用が始まってからが本番なので、
              「誰が・どこを・どう更新するか」まで考えた作りにします。WordPressを使う場合も、運用のしやすさを軸に設計します。
            </li>

            <li>
              <strong>要件が曖昧でも“前に進む形”に落とします</strong>
              <br />
              全部を最初に決めきるより、必要なところから決めていく方が早いことも多いです。
              迷っている部分は、選択肢を整理して「判断できる状態」にしてから進めます。
            </li>
          </ol>

          <h3>ざっくりの流れ（例）</h3>

          <ol>
            <li>目的・期限・現状のヒアリング（ふわっとでOK）</li>
            <li>構成案（ページ構成 / 情報設計）→ 優先順位を整理</li>
            <li>デザイン（必要なら）→ 実装</li>
            <li>公開・運用の形に整える（更新方法も含めて）</li>
          </ol>
        </Prose>

        <div className="mt-10 flex justify-center">
          <Link
            href="/"
            className="no-underline inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50"
          >
            Homeに戻る
          </Link>
        </div>
      </div>
    </Container>
  );
}
