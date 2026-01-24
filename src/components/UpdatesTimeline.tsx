import type { UpdateItem } from "@/lib/updates";
import {
  Rocket,
  Sparkles,
  Wrench,
  Palette,
  PenLine,
  RefreshCw,
} from "lucide-react";

function formatDate(date: string) {
  const [y, m, d] = date.split("-");
  return `${y}.${m}.${d}`;
}

const ICONS: Record<
  UpdateItem["type"],
  { Icon: React.ComponentType<{ className?: string }>; label: string }
> = {
  release: { Icon: Rocket, label: "Release" },
  feature: { Icon: Sparkles, label: "Feature" },
  fix: { Icon: Wrench, label: "Fix" },
  design: { Icon: Palette, label: "Design" },
  content: { Icon: PenLine, label: "Content" },
  update: { Icon: RefreshCw, label: "Update" },
};

export function UpdatesTimeline({ items }: { items: UpdateItem[] }) {
  if (!items.length) return null;

  return (
    <section className="py-14 sm:py-16">
      <div>
        <h2 className="text-lg font-medium tracking-tight text-zinc-950 dark:text-zinc-50">
          Updates
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          このサイトの更新ログ
        </p>
      </div>

      <ol className="relative mt-8 border-l border-zinc-200 dark:border-zinc-800">
        {items.map((u) => {
          const { Icon, label } = ICONS[u.type];

          return (
            <li key={u.slug} className="relative ml-6 pb-8 last:pb-0">
              {/* marker icon */}
              <span
                className="absolute -left-9 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-[color:var(--menu-hole)] ring-2 ring-zinc-300 dark:ring-zinc-700"
                aria-hidden="true"
                title={label}
              >
                <Icon className="h-3.5 w-3.5 text-zinc-700 dark:text-zinc-200" />
              </span>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <time className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatDate(u.date)}
                </time>

                <span className="text-xs text-zinc-300 dark:text-zinc-700">・</span>

                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {u.title}
                </h3>
              </div>

              <p className="mt-2 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {u.summary}
              </p>

              {u.links?.length ? (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {u.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-zinc-700 underline underline-offset-4 decoration-zinc-300 hover:text-zinc-950 hover:decoration-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

