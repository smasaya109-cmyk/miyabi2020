// src/components/layout/SiteFooter.tsx
import Link from "next/link";
import { Home as HomeIcon } from "lucide-react";

function XLogo({ className }: { className?: string }) {
  // X（旧Twitter）ロゴのシンプルSVG（currentColorで色が乗ります）
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153Zm-1.29 19.495h2.039L6.486 3.23H4.298L17.61 20.648Z" />
    </svg>
  );
}

const links = [
  { type: "internal" as const, href: "/", label: "Home" },
  { type: "internal" as const, href: "/showcase", label: "Showcase" },
  { type: "internal" as const, href: "/playroom", label: "Playroom" },
  {
    type: "external" as const,
    href: "https://x.com/miyabi_1998_",
    label: "X",
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-zinc-200/70 dark:border-zinc-800/80">
      <div className="mx-auto max-w-3xl px-6 pt-12 pb-24 md:pb-28">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-center">
          {links.map((l, i) => (
            <span key={l.href} className="flex items-center gap-x-4">
              {/* Homeは家アイコン */}
              {l.type === "internal" && l.href === "/" ? (
                <Link
                  href="/"
                  aria-label="Home"
                  className="inline-flex items-center text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
                >
                  <HomeIcon className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Home</span>
                </Link>
              ) : l.type === "external" ? (
                // Contact → X アイコン（外部リンク）
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="X"
                  title="X"
                  className="inline-flex items-center text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
                >
                  <XLogo className="h-4 w-4" />
                  <span className="sr-only">X</span>
                </a>
              ) : (
                // Showcase / Playroom
                <Link
                  href={l.href}
                  className="text-zinc-700 underline-offset-4 hover:underline dark:text-zinc-300"
                >
                  {l.label}
                </Link>
              )}

              {i !== links.length - 1 && (
                <span className="select-none text-zinc-300 dark:text-zinc-700">
                  •
                </span>
              )}
            </span>
          ))}
        </nav>

        <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
          © {year} miyabi.com
        </p>
      </div>
    </footer>
  );
}


