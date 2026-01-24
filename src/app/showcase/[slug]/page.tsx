import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { MDX } from "@/components/MDX";
import { getAllShowcase, getShowcaseBySlug } from "@/lib/content/showcase";
import { Prose } from "@/components/Prose";

export async function generateStaticParams() {
  const items = await getAllShowcase({ includeDrafts: false });
  return items.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const s = await getShowcaseBySlug(slug, { includeDrafts: false });
  if (!s) return {};
  return { title: s.title, description: s.summary };
}

export default async function ShowcaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const item = await getShowcaseBySlug(slug, { includeDrafts: false });
  if (!item) notFound();

  return (
    <Container>
      <section className="py-14 sm:py-16">
        <h1>{item.title}</h1>
        <p className="mt-3 text-zinc-600">{item.summary}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-500">{item.date}</span>
          {item.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        {item.links?.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {item.links.map((l) => (
              <a key={l.url} className="btn" href={l.url} target="_blank" rel="noreferrer noopener">
                {l.label}
              </a>
            ))}
          </div>
        ) : null}

        <div className="mt-10">
          <Prose>
            <MDX source={item.body} />
          </Prose>
        </div>

        <div className="mt-12">
          <Link href="/showcase" className="btn">
            Showcaseへ戻る
          </Link>
        </div>
      </section>
    </Container>
  );
}
