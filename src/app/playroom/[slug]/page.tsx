import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { MDX } from "@/components/MDX";
import { getAllPlayroom, getPlayroomBySlug } from "@/lib/content/playroom";
import { Prose } from "@/components/Prose";
import ArcMenuPlayground from "@/components/playroom/ArcMenuPlayground";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const items = await getAllPlayroom({ includeDrafts: false });
  return items.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getPlayroomBySlug(slug, { includeDrafts: false });
  if (!s) return {};
  return { title: s.title, description: s.summary };
}

export default async function PlayroomDetailPage({ params }: Props) {
  const { slug } = await params;

  const item = await getPlayroomBySlug(slug, { includeDrafts: false });
  if (!item) notFound();

  return (
    <Container>
      <section className="py-14 sm:py-16">
        <h1>{item.title}</h1>
        <p className="mt-3 text-zinc-600">{item.summary}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500">{item.date}</span>
          {item.tags?.map((t: string) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        {item.links?.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {item.links.map((l: { label: string; url: string }) => (
              <a
                key={l.url}
                className="btn"
                href={l.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}

        <div className="mt-10">
          <Prose>
            <MDX
              source={item.body}
              components={{
                ArcMenuPlayground,
              }}
            />
          </Prose>
        </div>

        <div className="mt-12">
          <Link href="/playroom" className="btn">
            Playroomへ戻る
          </Link>
        </div>
      </section>
    </Container>
  );
}
