import Link from "next/link";

type Props = {
  href: string;
  title: string;
  summary: string;
  date?: string;
  metaRight?: string; // statusなど
  tags?: string[];
};

export function EntryCard({ href, title, summary, date, metaRight, tags }: Props) {
  return (
    <Link
      href={href}
      className={[
        "no-underline block rounded-2xl border border-zinc-200/80 bg-white/60",
        "px-5 py-4 shadow-sm transition",
        "hover:bg-white hover:border-zinc-300/80 hover:shadow",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[15px] font-medium tracking-tight text-zinc-900">
          {title}
        </h3>

        {(date || metaRight) ? (
          <div className="shrink-0 text-xs text-zinc-500 text-right">
            {metaRight ? <span className="mr-2">{metaRight}</span> : null}
            {date ? <time>{date}</time> : null}
          </div>
        ) : null}
      </div>

      <p className="mt-2 text-sm leading-6 text-zinc-700">{summary}</p>

      {tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.slice(0, 6).map((t) => (
            <span
              key={t}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-700"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}

