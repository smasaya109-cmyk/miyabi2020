import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  href?: string;
  hrefLabel?: string;
};

export function SectionHeader({ title, description, href, hrefLabel }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-base sm:text-lg font-medium tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
        ) : null}
      </div>

      {href ? (
        <Link
          href={href}
          className="text-sm text-zinc-700 hover:text-zinc-950 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-900"
        >
          {hrefLabel ?? "View all"}
        </Link>
      ) : null}
    </div>
  );
}
