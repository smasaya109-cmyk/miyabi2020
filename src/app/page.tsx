import Link from "next/link";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { site } from "@/lib/site";
import { getAllUpdates } from "@/lib/updates";
import { UpdatesTimeline } from "@/components/UpdatesTimeline";

export const dynamic = "force-static";

export default async function HomePage() {
  const updates = await getAllUpdates();
  return (
    <Container>
      <Hero />

      <hr className="border-zinc-200" />

      <section className="py-14 sm:py-16">
        <SectionHeader
          title="Explore"
          description="制作例（Showcase）と試作（Playroom）を中心に掲載しています。"
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/showcase"
            className="no-underline rounded-2xl border border-zinc-200/80 bg-white/60 p-5 shadow-sm hover:bg-white hover:border-zinc-300/80 hover:shadow transition"
          >
            <div className="text-sm font-medium tracking-tight text-zinc-950">
              Showcase
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              作れるデザインや実装例をまとめています。依頼前の参考にどうぞ。
            </p>
            <p className="mt-3 text-sm text-zinc-700 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-900">
              Showcaseへ →
            </p>
          </Link>

          <Link
            href="/playroom"
            className="no-underline rounded-2xl border border-zinc-200/80 bg-white/60 p-5 shadow-sm hover:bg-white hover:border-zinc-300/80 hover:shadow transition"
          >
            <div className="text-sm font-medium tracking-tight text-zinc-950">
              Playroom
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              試作・趣味・検証など。小さく作って試したものを置いています。
            </p>
            <p className="mt-3 text-sm text-zinc-700 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-900">
              Playroomへ →
            </p>
          </Link>
        </div>
      </section>

      <hr className="border-zinc-200" />

      <section className="py-14 sm:py-16">
        <div className="rounded-2xl border border-zinc-200/80 bg-white/60 p-6 sm:p-7 shadow-sm">
          <h2 className="text-base sm:text-lg font-medium tracking-tight text-zinc-950">
            お仕事の相談 / 連絡
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            Webサイト制作・Web開発まわりのご相談を受けています。内容が固まっていなくても大丈夫です。
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="no-underline inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-800"
            >
              Contactへ
            </Link>
            <Link
              href="/showcase"
              className="no-underline inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50"
            >
              Showcaseを見る
            </Link>
          </div>
        </div>
      </section>

      {/* 将来復活用：site.home.showFeaturedProjects を true にしたらここに復帰させる */}
      {site.home?.showFeaturedProjects ? (
        <section className="pb-12 sm:pb-14">
          {/* ここに Featured Projects を戻す */}
        </section>
      ) : null}
      <UpdatesTimeline items={updates.slice(0, 8)} />
    </Container>
  );
}
