"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Category = "html" | "css" | "javascript";

type LabItem = {
  slug: string;
  title: string;
  summary: string;
  date: string; // YYYY-MM-DD
  tags: string[];
  level: string;
  draft?: boolean;
};

type Grouped = Record<Category, LabItem[]>;

const CATEGORY_ORDER: Category[] = ["html", "css", "javascript"];

const CATEGORY_LABEL: Record<Category, string> = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
};

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function LabsTabs({ grouped }: { grouped: Grouped }) {
  const [active, setActive] = useState<Category>("html");

  const counts = useMemo(
    () => ({
      html: grouped.html.length,
      css: grouped.css.length,
      javascript: grouped.javascript.length,
    }),
    [grouped]
  );

  const items = grouped[active];

  return (
    <section>
      {/* Tabs */}
      <div className="mb-8">
        <div role="tablist" aria-label="Labs categories" className="flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((cat) => {
            const isActive = active === cat;

            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(cat)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/60 dark:focus-visible:ring-neutral-600/60",
                  isActive
                    ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                    : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-neutral-900"
                )}
              >
                <span>{CATEGORY_LABEL[cat]}</span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px]",
                    isActive
                      ? "bg-white/15 text-white dark:bg-neutral-900/15 dark:text-neutral-900"
                      : "bg-neutral-100 text-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                  )}
                >
                  {counts[cat]}件
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {CATEGORY_LABEL[active]}
          </h2>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">{items.length}件</span>
        </div>

        {/* ✅ コンテンツが0件でも必ず表示 */}
        {items.length === 0 ? (
          <p className="text-[15px] leading-7 text-neutral-600 dark:text-neutral-400">
            まだ記事がありません。
          </p>
        ) : (
          // ✅ 1カラム縦並び
          <ul className="space-y-4">
            {items.map((lab) => (
              <li key={lab.slug}>
                <Link
                  href={`/labs/${lab.slug}`}
                  // ✅ 下線を“確実に”消す（グローバル underline 対策）
                  className={cn(
                    "group block rounded-2xl border border-neutral-200 bg-white p-5 transition",
                    "!no-underline hover:!no-underline focus-visible:!no-underline",
                    "hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-900",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/60 dark:focus-visible:ring-neutral-600/60"
                  )}
                  style={{ textDecoration: "none" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold leading-snug tracking-tight text-neutral-900 dark:text-neutral-100">
                      {lab.title}
                    </h3>
                    {lab.draft ? (
                      <span className="shrink-0 rounded-full border border-neutral-300 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:border-neutral-700 dark:text-neutral-300">
                        DRAFT
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
                    {lab.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                      {lab.level}
                    </span>

                    <time dateTime={lab.date} className="text-[11px] text-neutral-500">
                      {lab.date}
                    </time>

                    {lab.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-neutral-200 px-2 py-0.5 text-[11px] text-neutral-600 dark:border-neutral-800 dark:text-neutral-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
