"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
const STORAGE_KEY = "playroom.themeToggleDemo";

function isTheme(v: string | null): v is Theme {
  return v === "light" || v === "dark";
}

export function ThemeToggleDemo() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isTheme(saved)) setTheme(saved);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme, mounted]);

  const isDark = theme === "dark";

  // ステージ内だけに適用する “擬似テーマ”
  const vars = {
    "--demo-bg": isDark ? "#09090b" : "#ffffff",
    "--demo-fg": isDark ? "#fafafa" : "#18181b",
    "--demo-muted": isDark ? "rgba(250,250,250,0.72)" : "rgba(24,24,27,0.72)",
    "--demo-border": isDark ? "rgba(255,255,255,0.12)" : "rgba(24,24,27,0.12)",
    "--demo-card": isDark ? "rgba(255,255,255,0.06)" : "rgba(24,24,27,0.04)",
    "--demo-accent": isDark ? "#a78bfa" : "#2563eb",
  } as React.CSSProperties;

  return (
    <div className="h-full w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">

        {/* ぬるっとスライドするトグル */}
        <div
          role="radiogroup"
          aria-label="Theme"
          className="inline-flex rounded-full border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        >
          {/* inner grid（ここを基準にインジケータが横移動） */}
          <div className="relative grid grid-cols-2">
            {/* indicator */}
            <span
              aria-hidden="true"
              className={[
                "absolute inset-0 w-1/2 rounded-full bg-zinc-900",
                "shadow-sm",
                "will-change-transform",
                "transition-transform duration-300 ease-[cubic-bezier(.2,.9,.2,1)]",
                "motion-reduce:transition-none",
                isDark ? "translate-x-full" : "translate-x-0",
              ].join(" ")}
            />

            <button
              type="button"
              role="radio"
              aria-checked={!isDark}
              onClick={() => setTheme("light")}
              className={[
                "relative z-10 inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm",
                "outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                "motion-reduce:transition-none",
                !isDark
                  ? "text-white"
                  : "text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-50",
              ].join(" ")}
            >
              <Sun className="h-4 w-4" aria-hidden="true" />
              Light
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={isDark}
              onClick={() => setTheme("dark")}
              className={[
                "relative z-10 inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm",
                "outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                "motion-reduce:transition-none",
                isDark
                  ? "text-white"
                  : "text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-zinc-50",
              ].join(" ")}
            >
              <Moon className="h-4 w-4" aria-hidden="true" />
              Dark
            </button>
          </div>
        </div>
      </div>

      <div
        className="mt-5 rounded-2xl border bg-[color:var(--demo-bg)] p-5 shadow-sm"
        style={{
          ...vars,
          borderColor: "var(--demo-border)",
          color: "var(--demo-fg)",
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold">Preview</p>
            <p className="mt-1 text-sm" style={{ color: "var(--demo-muted)" }}>
              この枠内だけが {isDark ? "Dark" : "Light"} になります
            </p>
          </div>

          <span
            className="rounded-full px-3 py-1 text-xs font-medium"
            style={{
              background: "var(--demo-card)",
              border: "1px solid var(--demo-border)",
            }}
          >
            theme: {theme}
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--demo-card)",
              border: "1px solid var(--demo-border)",
            }}
          >
            <p className="text-sm font-semibold">Card A</p>
            <p className="mt-2 text-sm" style={{ color: "var(--demo-muted)" }}>
              アクセントや境界線の見え方を確認
            </p>
            <button
              type="button"
              className="mt-4 rounded-full px-4 py-2 text-sm font-medium"
              style={{
                background: "var(--demo-accent)",
                color: "#fff",
              }}
            >
              Action
            </button>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              background: "var(--demo-card)",
              border: "1px solid var(--demo-border)",
            }}
          >
            <p className="text-sm font-semibold">Card B</p>
            <p className="mt-2 text-sm" style={{ color: "var(--demo-muted)" }}>
              focus-visible のリングを確認（Tabで移動）
            </p>
            <input
              type="text"
              placeholder="Type here…"
              className="mt-4 w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              style={{ borderColor: "var(--demo-border)", color: "var(--demo-fg)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
