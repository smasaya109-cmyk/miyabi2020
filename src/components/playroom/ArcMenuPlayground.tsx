"use client";

import * as React from "react";

type Item = {
  label: string;
  emoji: string;
  onClick?: () => void;
};

const ITEMS: Item[] = [
  { label: "Home", emoji: "🏠", onClick: () => alert("Home (demo)") },
  { label: "Projects", emoji: "🧩", onClick: () => alert("Projects (demo)") },
  { label: "Showcase", emoji: "🖼️", onClick: () => alert("Showcase (demo)") }, // 中央に来る
  { label: "Playroom", emoji: "🧪", onClick: () => alert("Playroom (demo)") },
  { label: "Contact", emoji: "✉️", onClick: () => alert("Contact (demo)") },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function ArcMenuPlayground() {
  const prefersReducedMotion = usePrefersReducedMotion();

  // 5個で見た目が安定する値（必要なら微調整OK）
  const radius = 122;
  const spreadDeg = 165;

  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  // 外側クリックで閉じる
  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const el = menuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Escで閉じる
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // 5個なら中央( index=2 )が baseDeg に来る = 視覚的に“中心が合う”
  const baseDeg = -90;
  const startDeg = baseDeg - spreadDeg / 2;
  const stepDeg = ITEMS.length > 1 ? spreadDeg / (ITEMS.length - 1) : 0;

  const duration = prefersReducedMotion ? "duration-0" : "duration-320";
  const ease = prefersReducedMotion ? "" : "ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-50">
            Arc Menu Button (Demo)
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            ボタンをタップ/クリックすると、弧状にメニューが展開します。
          </p>
        </div>
        <span
          className={cx(
            "shrink-0 rounded-full border px-2 py-1 text-xs",
            "border-zinc-200 bg-zinc-50 text-zinc-600",
            "dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300"
          )}
        >
          touchable
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-zinc-50 p-4 dark:bg-zinc-900/40">
        <div className="relative mx-auto h-64 w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="absolute inset-x-0 top-5 px-5 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Tap the button ↓
            </p>
          </div>

          <div
            ref={menuRef}
            className="absolute inset-x-0 bottom-6 flex items-center justify-center"
          >
            {/* 基準点（中心） */}
            <div className="relative h-14 w-14">

              {/* Items：transform要素(外) と中心合わせ(内)を分離してズレ防止 */}
              {ITEMS.map((item, i) => {
                const deg = startDeg + stepDeg * i;
                const rad = (deg * Math.PI) / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;

                const openDelay = prefersReducedMotion ? 0 : i * 44;
                const closeDelay = prefersReducedMotion
                  ? 0
                  : (ITEMS.length - 1 - i) * 24;

                return (
                  <div
                    key={item.label}
                    className={cx(
                      "absolute left-1/2 top-1/2",
                      "transition-[transform,opacity,filter] will-change-transform",
                      duration,
                      ease
                    )}
                    style={{
                      transform: open
                        ? `translate3d(${x}px, ${y}px, 0) scale(1)`
                        : "translate3d(0px, 0px, 0) scale(0.78)",
                      opacity: open ? 1 : 0,
                      filter: open ? "blur(0px)" : "blur(2px)",
                      transitionDelay: open
                        ? `${openDelay}ms`
                        : `${closeDelay}ms`,
                      pointerEvents: open ? "auto" : "none",
                    }}
                  >
                    <button
                      type="button"
                      className={cx(
                        "block h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white text-base shadow-sm",
                        "border-zinc-200 hover:bg-zinc-50 active:scale-[0.98]",
                        "dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                      )}
                      aria-label={item.label}
                      title={item.label}
                      onClick={() => item.onClick?.()}
                    >
                      <span aria-hidden="true">{item.emoji}</span>
                    </button>
                  </div>
                );
              })}

              {/* Center button */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className={cx(
                  "absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white shadow-sm",
                  "border-zinc-200 hover:bg-zinc-50 active:scale-[0.98]",
                  "dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900",
                  "transition-transform",
                  prefersReducedMotion ? "duration-0" : "duration-200"
                )}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                <span className="relative mx-auto block h-6 w-6">
                  <span
                    className={cx(
                      "absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                      "bg-zinc-900 dark:bg-zinc-50",
                      "transition-transform",
                      prefersReducedMotion ? "duration-0" : "duration-200",
                      ease
                    )}
                    style={{
                      transform: open
                        ? "translate(-50%, -50%) rotate(45deg)"
                        : "translate(-50%, -50%) rotate(0deg)",
                    }}
                  />
                  <span
                    className={cx(
                      "absolute left-1/2 top-1/2 block h-[2px] w-5 -translate-x-1/2 -translate-y-1/2 rounded-full",
                      "bg-zinc-900 dark:bg-zinc-50",
                      "transition-transform",
                      prefersReducedMotion ? "duration-0" : "duration-200",
                      ease
                    )}
                    style={{
                      transform: open
                        ? "translate(-50%, -50%) rotate(-45deg)"
                        : "translate(-50%, -50%) rotate(90deg)",
                    }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        ※ Playroom用デモです（リンク遷移はalert）。
      </p>
    </section>
  );
}

