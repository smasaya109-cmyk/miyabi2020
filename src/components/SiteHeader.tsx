"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

function SiteHeaderInner() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200/70 bg-white/70 backdrop-blur">
      <Container>
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="rounded-md text-sm font-semibold tracking-tight text-zinc-900 no-underline hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
          >
            {site.name}
          </Link>

          <nav
            aria-label="Primary"
            className="no-scrollbar -mx-2 flex gap-1 overflow-x-auto px-2 py-1"
          >
            {site.nav
              .filter((item) => !("enabled" in item) || item.enabled !== false)
              .map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "whitespace-nowrap rounded-full px-3 py-1.5 text-sm no-underline transition",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
                      active
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-700 hover:bg-zinc-100",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </nav>
        </div>
      </Container>
    </header>
  );
}

export function SiteHeader() {
  // ヘッダーを完全に消す（将来 true に戻すだけで復活）
  if (site.ui?.showHeader === false) return null;
  return <SiteHeaderInner />;
}
