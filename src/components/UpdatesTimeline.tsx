import Link from "next/link";
import { type UpdateItem } from "@/lib/updates";
import type { ReactNode, ComponentType } from "react";

type Props = {
  items: UpdateItem[];
};

type IconProps = { className?: string };

type IconEntry = {
  Icon: ComponentType<IconProps>;
  label: string;
};

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

function isExternalLikeHref(href: string) {
  return /^(https?:\/\/|mailto:|tel:)/i.test(href);
}

function isHashHref(href: string) {
  return href.startsWith("#");
}

function SafeIcon({ Icon, className }: { Icon: IconEntry["Icon"]; className?: string }) {
  return <Icon className={className} />;
}

/** icons（依存追加なし） */
function NotebookPenIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-[15px] w-[15px]", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6.5 3.5H16a2.5 2.5 0 0 1 2.5 2.5v12A2.5 2.5 0 0 1 16 20.5H6.5A2.5 2.5 0 0 1 4 18V6A2.5 2.5 0 0 1 6.5 3.5Z" />
      <path d="M7.5 7.5H14.5" />
      <path d="M7.5 10.5H14.5" />
      <path d="M7.5 13.5H12.5" />
      <path d="M7.5 16.5H11" />
      <path d="M13.7 18.3 18.7 13.3" />
      <path d="M18.1 12.7 19.6 14.2" />
      <path d="M13.3 19.6 14.1 17.9 15.8 18.7 14.1 19.5Z" />
    </svg>
  );
}

function SparkIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-[15px] w-[15px]", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2l1.2 5.1L18 8.3l-4.8 1.2L12 14l-1.2-4.5L6 8.3l4.8-1.2L12 2Z" />
      <path d="M5 13l.7 3L9 17l-3.3 1-0.7 3-0.7-3L1 16l3.3-1 .7-3Z" />
      <path d="M19 13l.7 3L23 17l-3.3 1-.7 3-.7-3L15 16l3.3-1 .7-3Z" />
    </svg>
  );
}

function TagIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-[15px] w-[15px]", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13l-7 7-10-10V3h7l10 10Z" />
      <path d="M7.5 7.5h0.01" />
    </svg>
  );
}

function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-4 w-4", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7" />
      <path d="M10 7h7v7" />
    </svg>
  );
}

const DEFAULT_ENTRY: IconEntry = { Icon: SparkIcon, label: "Update" };

// UpdateItem.type が union でも string でも受けられるよう、Record<string, ...>
const ICONS: Record<string, IconEntry> = {
  note: { Icon: SparkIcon, label: "Note" },
  labs: { Icon: NotebookPenIcon, label: "Labs" },
  tag: { Icon: TagIcon, label: "Tag" },
};

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
      {children}
    </span>
  );
}

function LinkPill({ href, children }: { href: string; children: ReactNode }) {
  // ✅ グローバル a:hover underline があっても負けない（important）
  const base =
    "inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900 " +
    "!no-underline hover:!no-underline focus-visible:!no-underline";

  if (isHashHref(href) || isExternalLikeHref(href)) {
    const external = /^https?:\/\//i.test(href);
    return (
      <a
        href={href}
        className={base}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : undefined)}
      >
        <span>{children}</span>
        {external ? <ArrowUpRightIcon className="text-zinc-500 dark:text-zinc-400" /> : null}
      </a>
    );
  }

  return (
    <Link href={href} className={base}>
      {children}
    </Link>
  );
}

/** named export */
export function UpdatesTimeline({ items }: Props) {
  return <UpdatesTimelineInner items={items} />;
}

/** default export */
export default function UpdatesTimelineDefault({ items }: Props) {
  return <UpdatesTimelineInner items={items} />;
}

function UpdatesTimelineInner({ items }: Props) {
  if (!items || items.length === 0) {
    return (
      <div className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
        まだUpdatesはありません。
      </div>
    );
  }

  const sorted = [...items].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section className="mt-16 border-t border-zinc-200 pt-10 dark:border-zinc-800">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
          Updates
        </h2>
      </div>

      <ol className="mt-6">
        {sorted.map((u, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === sorted.length - 1;

          const entry = ICONS[String(u.type)] ?? DEFAULT_ENTRY;
          const { Icon, label } = entry;

          const lineClass = (() => {
            if (sorted.length === 1) return "";
            if (isFirst) return "top-3.5 bottom-0";
            if (isLast) return "top-0 h-3.5";
            return "top-0 bottom-0";
          })();

          return (
            <li key={u.slug} className="min-w-0">
              <div className={cn("flex gap-3", !isLast && "pb-8")}>
                {/* アイコン列 + 縦線（アイコン中心を通す） */}
                <div className="relative flex w-7 justify-center">
                  {lineClass ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute left-1/2 w-px -translate-x-1/2 bg-zinc-200 dark:bg-zinc-800",
                        lineClass
                      )}
                    />
                  ) : null}

                  <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
                    <SafeIcon Icon={Icon} />
                    <span className="sr-only">{label}</span>
                  </span>
                </div>

                {/* 内容 */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="min-w-0 truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {u.title}
                    </p>
                    <Badge>{label}</Badge>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatDate(u.date)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                    {u.summary}
                  </p>

                  {u.links && u.links.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {u.links.map((l, i) => (
                        <LinkPill key={`${u.slug}-link-${i}`} href={l.url}>
                          {l.label}
                        </LinkPill>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
