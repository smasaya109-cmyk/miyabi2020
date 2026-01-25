import Link from "next/link";
import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";
import { site } from "@/lib/site";
import { getAllUpdates } from "@/lib/updates";
import { UpdatesTimeline } from "@/components/UpdatesTimeline";
import { ButtonLink } from "@/components/ui/ButtonLink";


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
            className="group no-underline rounded-2xl border border-zinc-200/70 bg-white/60 p-6 sm:p-7 shadow-sm shadow-zinc-900/5 backdrop-blur transition hover:bg-white hover:border-zinc-300/70 hover:shadow-md hover:shadow-zinc-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <div className="text-sm font-medium tracking-tight text-zinc-950">
              Showcase
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              作れるデザインや実装例をまとめています。依頼前の参考にどうぞ。
            </p>

            {/* “ボタンっぽい”落ち着いたCTA */}
            <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm shadow-zinc-900/5 transition group-hover:border-zinc-300/70 group-hover:bg-white">
              Showcaseへ
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>

          <Link
            href="/playroom"
            className="group no-underline rounded-2xl border border-zinc-200/70 bg-white/60 p-6 sm:p-7 shadow-sm shadow-zinc-900/5 backdrop-blur transition hover:bg-white hover:border-zinc-300/70 hover:shadow-md hover:shadow-zinc-900/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <div className="text-sm font-medium tracking-tight text-zinc-950">
              Playroom
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              試作・趣味・検証など。小さく作って試したものを置いています。
            </p>

            <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm shadow-zinc-900/5 transition group-hover:border-zinc-300/70 group-hover:bg-white">
              Playroomへ
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        </div>
      </section>

      <hr className="border-zinc-200" />

      <section className="py-14 sm:py-16">
        <div className="rounded-2xl border border-zinc-200/80 bg-white/60 p-6 sm:p-7 shadow-sm shadow-zinc-900/5 backdrop-blur">
          <h2 className="text-base sm:text-lg font-medium tracking-tight text-zinc-950">
            お仕事の相談 / 連絡
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            Webサイト制作・Web開発まわりのご相談を受けています。内容が固まっていなくても大丈夫です。
          </p>

          {/* ボタン：余白増＋落ち着いた“静かな強さ” */}
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/contact" variant="primary" size="lg">
              Contactへ
              <span className="opacity-90">→</span>
            </ButtonLink>

            <ButtonLink href="/showcase" variant="secondary" size="lg">
              Showcaseを見る
              <span className="text-zinc-700">→</span>
            </ButtonLink>
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