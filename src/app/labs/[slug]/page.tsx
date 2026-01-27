import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { createMdxComponents } from "@/lib/mdx-components";
import { getAllLabSlugs, getLabBySlug } from "@/lib/labs";
import { getTocFromMdx } from "@/lib/toc";

export const dynamic = "force-static";
export const dynamicParams = false;

function isProduction() {
  return process.env.NODE_ENV === "production";
}

export async function generateStaticParams() {
  const slugs = await getAllLabSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ✅ Next.js 15系: params が Promise 扱いになるため await する
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const lab = await getLabBySlug(slug);
    if (isProduction() && lab.frontmatter.draft) return {};
    return {
      title: `${lab.frontmatter.title} | Labs`,
      description: lab.frontmatter.summary,
    };
  } catch {
    return {};
  }
}

type Toc = ReturnType<typeof getTocFromMdx>;
type TocItem = Toc[number];

type TocGroup = {
  h2: TocItem;
  h3: TocItem[];
};

function groupToc(toc: Toc): TocGroup[] {
  const groups: TocGroup[] = [];
  let current: TocGroup | null = null;

  for (const item of toc) {
    if (item.depth === 2) {
      current = { h2: item, h3: [] };
      groups.push(current);
      continue;
    }
    if (item.depth === 3) {
      if (!current) continue;
      current.h3.push(item);
    }
  }

  return groups;
}

function TocLinkRow({
  href,
  label,
  kind,
}: {
  href: string;
  label: string;
  kind: "h2" | "h3";
}) {
  return (
    <a
      href={href}
      className={cn(
        "grid grid-cols-[18px_1fr] items-start gap-x-2 rounded-lg px-2 py-1.5",
        "hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:hover:bg-neutral-900/40 dark:focus-visible:ring-neutral-700"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "mt-[6px] inline-flex h-2 w-2 items-center justify-center",
          kind === "h2"
            ? "text-neutral-500 dark:text-neutral-300"
            : "text-neutral-400 dark:text-neutral-500"
        )}
      >
        {kind === "h2" ? "●" : "↳"}
      </span>

      <span
        className={cn(
          "min-w-0 break-words underline underline-offset-4 decoration-neutral-300 hover:opacity-90 dark:decoration-neutral-700",
          kind === "h2"
            ? "text-[13px] font-medium leading-5 text-neutral-900 dark:text-neutral-100"
            : "text-[13px] leading-5 text-neutral-700 dark:text-neutral-300"
        )}
      >
        {label}
      </span>
    </a>
  );
}

function TocContent({ toc, columns }: { toc: Toc; columns: 1 | 2 }) {
  const groups = groupToc(toc);

  return (
    <div className={cn("grid gap-6", columns === 2 ? "md:grid-cols-2" : "")}>
      {groups.map((g) => (
        <div key={g.h2.id} className="min-w-0">
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-900 dark:bg-neutral-900/20">
            <TocLinkRow href={`#${g.h2.id}`} label={g.h2.value} kind="h2" />
            {g.h3.length > 0 ? (
              <div className="mt-1">
                {g.h3.map((c) => (
                  <TocLinkRow key={c.id} href={`#${c.id}`} label={c.value} kind="h3" />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function TocBox({ toc }: { toc: Toc }) {
  return (
    <div className="w-full max-w-full rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          目次
        </div>
        <div className="text-xs text-neutral-500">クリックで該当セクションへ移動</div>
      </div>
      <div className="mt-4">
        <TocContent toc={toc} columns={2} />
      </div>
    </div>
  );
}

// ✅ Next.js 15系: params が Promise 扱いになるため await する
export default async function LabDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let lab: Awaited<ReturnType<typeof getLabBySlug>>;
  try {
    lab = await getLabBySlug(slug);
  } catch {
    notFound();
  }

  if (isProduction() && lab.frontmatter.draft) {
    notFound();
  }

  const toc = getTocFromMdx(lab.content);

  const { content } = await compileMDX({
    source: lab.content,
    components: createMdxComponents(),
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return (
    <main className="mx-auto w-full max-w-[860px] overflow-x-hidden px-4 py-10">
      <nav className="mb-8 text-sm text-neutral-600 dark:text-neutral-300">
        <Link href="/labs" className="underline underline-offset-4 hover:opacity-80">
          Labs
        </Link>
        <span className="mx-2 text-neutral-400">/</span>
        <span className="text-neutral-900 dark:text-neutral-100">{lab.frontmatter.category}</span>
      </nav>

      <header className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-950">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          {lab.frontmatter.title}
        </h1>

        <p className="mt-3 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
          {lab.frontmatter.summary}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <time dateTime={lab.frontmatter.date} className="text-sm text-neutral-500">
            {lab.frontmatter.date}
          </time>

          <span className="text-neutral-300 dark:text-neutral-700">•</span>

          <span className="rounded-full bg-white px-2 py-0.5 text-[12px] font-medium text-neutral-700 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-950 dark:text-neutral-200 dark:ring-neutral-800">
            {lab.frontmatter.level}
          </span>

          {lab.frontmatter.tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-white px-2 py-0.5 text-[12px] text-neutral-600 shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-950 dark:text-neutral-300 dark:ring-neutral-800"
            >
              {t}
            </span>
          ))}

          {lab.frontmatter.draft ? (
            <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[12px] font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
              DRAFT
            </span>
          ) : null}
        </div>

        {lab.frontmatter.links.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-3">
            {lab.frontmatter.links.map((l) => (
              <a
                key={`${l.label}-${l.url}`}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm font-medium text-neutral-700 shadow-sm transition hover:opacity-80 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}
      </header>

      {toc.length > 0 ? (
        <section className="mt-8">
          {/* mobile：1ボックス */}
          <details className="md:hidden w-full max-w-full rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
            <summary className="cursor-pointer select-none text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              目次
            </summary>
            <div className="mt-4">
              <TocContent toc={toc} columns={1} />
            </div>
          </details>

          {/* desktop */}
          <div className="hidden md:block">
            <TocBox toc={toc} />
          </div>
        </section>
      ) : null}

      <article className="mt-10 min-w-0 space-y-6">{content}</article>

      <footer className="mt-14 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <Link href="/labs" className="text-sm font-medium underline underline-offset-4 hover:opacity-80">
          ← Labs一覧へ戻る
        </Link>
      </footer>
    </main>
  );
}

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}
