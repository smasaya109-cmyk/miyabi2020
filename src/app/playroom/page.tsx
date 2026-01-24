import Link from "next/link";
import { Container } from "@/components/Container";
import { getAllPlayroom } from "@/lib/content/playroom";

export const metadata = { title: "Playroom" };

export default async function PlayroomIndexPage() {
  const items = await getAllPlayroom({ includeDrafts: false });

  return (
    <Container>
      <section className="py-14 sm:py-16">
        <h1>Playroom</h1>
        <p className="mt-4 max-w-2xl">
          実験置き場（content/playroom）。軽さを壊さない小ネタを追加できます。
        </p>

        <div className="mt-10 grid gap-4">
          {items.map((s) => (
            <Link
              key={s.slug}
              href={`/playroom/${s.slug}`}
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
                {s.tags?.map((t: string) => (
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
