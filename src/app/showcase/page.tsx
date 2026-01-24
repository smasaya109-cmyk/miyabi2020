import Link from "next/link";
import { Container } from "@/components/Container";
import { getAllShowcase } from "@/lib/content/showcase";

export const metadata = { title: "Showcase" };

export default async function ShowcasePage() {
  const items = await getAllShowcase();

  return (
    <Container>
      <section className="py-14 sm:py-16">
        <h1>Showcase</h1>
        <p className="mt-4 max-w-2xl">
          参考例まとめ（content/showcase）。依頼前の判断材料になる情報を置けます。
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((s) => (
            <Link
              key={s.slug}
              href={`/showcase/${s.slug}`}
              className="card block no-underline hover:bg-zinc-50"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-base font-semibold text-zinc-900">
                  {s.title}
                </div>
                <span className="text-xs text-zinc-500">{s.date}</span>
              </div>
              <p className="mt-2">{s.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
