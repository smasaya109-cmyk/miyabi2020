"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Home as HomeIcon,
  UserRound,
  GalleryVerticalEnd,
  FlaskConical,
  Mail,
  Menu as MenuIcon,
  X as XIcon,
} from "lucide-react";

type Item = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ITEMS: Item[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/showcase", label: "Showcase", icon: GalleryVerticalEnd },
  { href: "/playroom", label: "Playroom", icon: FlaskConical },
  { href: "/about", label: "About", icon: UserRound },
  { href: "/contact", label: "Contact", icon: Mail },
];

const CLOSE_DELAY_MS = 220;

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function FloatingMenu() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = () => {
    clearCloseTimer();
    setPresent(true);
    requestAnimationFrame(() => setOpen(true));
  };

  const closeMenu = () => {
    clearCloseTimer();
    setOpen(false);
    closeTimerRef.current = window.setTimeout(() => {
      setPresent(false);
    }, CLOSE_DELAY_MS);
  };

  const toggle = () => (open ? closeMenu() : openMenu());

  // ルート変更で閉じる
  useEffect(() => {
    if (present) closeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Escで閉じる
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // フォーカス管理
  useEffect(() => {
    if (open) {
      setTimeout(() => firstItemRef.current?.focus(), 0);
    } else {
      triggerRef.current?.focus();
    }
  }, [open]);

  useEffect(() => () => clearCloseTimer(), []);

  // ===== 見た目パラメータ =====
  const radius = 126; // アイコンの広がり
  const startDeg = 210; // 左側
  const endDeg = 330; // 右側

  // アイコン配置（均等）
  const degrees = ITEMS.map((_, i) => {
    const t = ITEMS.length === 1 ? 0.5 : i / (ITEMS.length - 1);
    return startDeg + (endDeg - startDeg) * t;
  });

  // セパレータ「・」配置：隣同士の中間
  const separatorDegrees = degrees.slice(0, -1).map((deg, i) => {
    const next = degrees[i + 1] ?? deg;
    return (deg + next) / 2;
  });

  return (
    <div
      className="fixed inset-x-0 bottom-4 z-50 flex justify-center md:bottom-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* overlay（外側クリックで閉じる） */}
      {present && (
        <div
          aria-hidden="true"
          onClick={closeMenu}
          className={[
            "fixed inset-0 z-40",
            "transition-opacity duration-200 ease-out",
            open ? "opacity-100" : "opacity-0 pointer-events-none",
          ].join(" ")}
        />
      )}

      <div className="relative z-50">
        {/* セパレータ「・」 */}
        {present &&
          separatorDegrees.map((deg, i) => {
            const x = Math.round(Math.cos(degToRad(deg)) * radius);
            const y = Math.round(Math.sin(degToRad(deg)) * radius);
            return (
              <span
                key={`sep-${i}`}
                aria-hidden="true"
                className={[
                  "absolute left-1/2 top-1/2",
                  "-translate-x-1/2 -translate-y-1/2",
                  "select-none",
                  "text-[14px] leading-none",
                  "transition-[transform,opacity] duration-200 ease-out",
                  "motion-reduce:transition-none",
                  open ? "opacity-100" : "opacity-0",
                ].join(" ")}
                style={{
                  color: "var(--menu-dot)",
                  transform: open
                    ? `translate(-50%, -50%) translate(${x}px, ${y}px)`
                    : `translate(-50%, -50%) translate(0px, 0px)`,
                  transitionDelay: open
                    ? `${(i + 1) * 24}ms`
                    : `${(separatorDegrees.length - i) * 14}ms`,
                }}
              >
                ・
              </span>
            );
          })}

        {/* アイコン（穴っぽいチップ） */}
        {present &&
          ITEMS.map((item, i) => {
            const Icon = item.icon;
            const deg = degrees[i] ?? 270;
            const x = Math.round(Math.cos(degToRad(deg)) * radius);
            const y = Math.round(Math.sin(degToRad(deg)) * radius);

            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);

            const delayOpen = i * 28;
            const delayClose = (ITEMS.length - 1 - i) * 18;

            return (
              <Link
                key={item.href}
                href={item.href}
                ref={i === 0 ? firstItemRef : undefined}
                aria-label={item.label}
                title={item.label}
                onClick={closeMenu}
                className={[
                  "absolute left-1/2 top-1/2",
                  "-translate-x-1/2 -translate-y-1/2",
                  "grid h-12 w-12 place-items-center rounded-full",
                  "bg-[color:var(--menu-hole)] text-zinc-900",
                  "ring-1 ring-zinc-200/70 shadow-sm",
                  "hover:shadow-md hover:ring-zinc-300/80",
                  "dark:text-zinc-50 dark:ring-zinc-800/70",
                  "transition-[transform,opacity,box-shadow] duration-200 ease-out",
                  "motion-reduce:transition-none",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 dark:focus-visible:ring-zinc-600/40",
                  active ? "ring-zinc-400/80 dark:ring-zinc-600/60" : "",
                  open ? "opacity-100" : "opacity-0 pointer-events-none",
                ].join(" ")}
                style={{
                  transform: open
                    ? `translate(-50%, -50%) translate(${x}px, ${y}px) scale(1)`
                    : `translate(-50%, -50%) translate(0px, 0px) scale(0.72)`,
                  transitionDelay: open ? `${delayOpen}ms` : `${delayClose}ms`,
                }}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </Link>
            );
          })}

        {/* トリガー：開いてる時は「×だけ」 */}
        <button
          ref={triggerRef}
          type="button"
          onClick={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-haspopup="menu"
          aria-expanded={open}
          className={[
            "inline-flex items-center rounded-full text-sm",
            "border border-zinc-200/60 bg-white/80 text-zinc-900 shadow-sm backdrop-blur",
            "transition-[background-color,transform] duration-150 ease-out",
            "hover:bg-white active:scale-[0.98]",
            "dark:border-zinc-800/70 dark:bg-zinc-950/70 dark:text-zinc-50 dark:hover:bg-zinc-950/80",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40 dark:focus-visible:ring-zinc-600/40",
            "motion-reduce:transition-none motion-reduce:transform-none",
            open ? "p-3" : "gap-2 px-5 py-3",
          ].join(" ")}
        >
          {open ? (
            <XIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <>
              <span className="font-medium">menu</span>
              <MenuIcon className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
