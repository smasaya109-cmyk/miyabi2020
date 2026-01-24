import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { Container } from "@/components/Container";
import { MDX } from "@/components/MDX";
import { getAllProjects, getProjectBySlug } from "@/lib/content/projects";
import { Prose } from "@/components/Prose";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getAllProjects({ includeDrafts: false });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const p = await getProjectBySlug(slug, { includeDrafts: false });
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;

  const project = await getProjectBySlug(slug, { includeDrafts: false });
  if (!project) notFound();

  return (
    <Container>
      <section className="py-14 sm:py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1>{project.title}</h1>
            <p className="mt-3 text-zinc-600">{project.summary}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-zinc-500">{project.date}</div>
            <div className="mt-2 inline-flex">
              <span className="tag">{project.status}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>

        {project.links?.length ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.links.map((l) => (
              <a key={l.url} className="btn" href={l.url} target="_blank" rel="noreferrer noopener">
                {l.label}
              </a>
            ))}
          </div>
        ) : null}

        <div className="mt-10">
          <Prose>
            <MDX source={project.body} />
          </Prose>
        </div>

        <div className="mt-12">
          <Link href="/projects" className="btn">
            Projectsへ戻る
          </Link>
        </div>
      </section>
    </Container>
  );
}
