import Link from "next/link";
import { Container } from "@/components/Container";
import { getAllProjects } from "@/lib/content/projects";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  const ongoing = projects.filter((p) => p.status === "ongoing");
  const completed = projects.filter((p) => p.status === "completed");

  return (
    <Container>
      <section className="py-14 sm:py-16">
        <h1>Projects</h1>
        <p className="mt-4 max-w-2xl">
          MDX（content/projects）から自動生成しています。追加するだけで更新できます。
        </p>

        <div className="mt-10 grid gap-8">
          <section>
            <h2 className="text-lg sm:text-xl">Ongoing</h2>
            <div className="mt-4 grid gap-4">
              {ongoing.length === 0 ? (
                <p className="text-zinc-600">まだありません。</p>
              ) : (
                ongoing.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="card block no-underline hover:bg-zinc-50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-base font-semibold text-zinc-900">
                        {p.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="tag">{p.status}</span>
                        <span className="text-xs text-zinc-500">{p.date}</span>
                      </div>
                    </div>
                    <p className="mt-2">{p.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl">Completed</h2>
            <div className="mt-4 grid gap-4">
              {completed.length === 0 ? (
                <p className="text-zinc-600">まだありません。</p>
              ) : (
                completed.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="card block no-underline hover:bg-zinc-50"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-base font-semibold text-zinc-900">
                        {p.title}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="tag">{p.status}</span>
                        <span className="text-xs text-zinc-500">{p.date}</span>
                      </div>
                    </div>
                    <p className="mt-2">{p.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </Container>
  );
}
