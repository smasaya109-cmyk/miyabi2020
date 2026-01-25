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
  { label: "Showcase", emoji: "🖼️", onClick: () => alert("Showcase (demo)") }, // 中央
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

  // ステージ（Stage）に載せる前提：キャンバスいっぱいを使う
  const radius = 132;
  const spreadDeg = 165;

  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const firstItemRef = React.useRef<HTMLButtonElement | null>(null);

  /**
   * ✅ ここがポイント
   * `h-full` は「親がheightを“確定”している」必要がある。
   * Stageが min-height のみだと `h-full` が効かず、absolute bottom の基準が崩れる。
   *
   * 対策：このデモ側で height を確定させる。
   * - Stageが将来 `--stage-h` を提供するならそれを使う
   * - 無い場合は 420px をfallback（md相当）
   */
  const stageHeight = "var(--stage-h, 420px)";

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

  // openしたら最初のアイテムへ、closeしたらトリガーへ
  React.useEffect(() => {
    if (prefersReducedMotion) return;
    if (open) {
      setTimeout(() => firstItemRef.current?.focus(), 0);
    } else {
      setTimeout(() => triggerRef.current?.focus(), 0);
    }
  }, [open, prefersReducedMotion]);

  // 5個なら中央(index=2)が baseDeg に来る
  const baseDeg = -90;
  const startDeg = baseDeg - spreadDeg / 2;
  const stepDeg = ITEMS.length > 1 ? spreadDeg / (ITEMS.length - 1) : 0;

  const duration = prefersReducedMotion ? "duration-0" : "duration-320";
  const ease = prefersReducedMotion ? "" : "ease-[cubic-bezier(0.22,1,0.36,1)]";

  return (
    <div
      className="relative w-full overflow-visible"
      style={{ height: stageHeight }}
    >
      {/* 上：ヒント（Stageの右上actionsと被らないように中央寄せ） */}
      <div className="pointer-events-none absolute inset-x-0 top-2 text-center sm:top-3">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Tap the button ↓（Escで閉じる）
        </p>
      </div>

      {/* 下：メニュー本体（Stage内の“底”に固定） */}
      <div
        ref={menuRef}
        className="absolute inset-x-0 bottom-6 flex items-center justify-center sm:bottom-8"
      >
        {/* 基準点（中心） */}
        <div className="relative h-16 w-16">
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
                  transitionDelay: open ? `${openDelay}ms` : `${closeDelay}ms`,
                  pointerEvents: open ? "auto" : "none",
                }}
                aria-hidden={!open}
              >
                <button
                  ref={i === 0 ? firstItemRef : undefined}
                  type="button"
                  disabled={!open}
                  className={cx(
                    "block h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white text-lg shadow-sm",
                    "border-zinc-200 hover:bg-zinc-50 active:scale-[0.98]",
                    "dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900",
                    "disabled:opacity-0 disabled:pointer-events-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 dark:focus-visible:ring-zinc-600/50"
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
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cx(
              "absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white shadow-sm",
              "border-zinc-200 hover:bg-zinc-50 active:scale-[0.98]",
              "dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900",
              "transition-transform",
              prefersReducedMotion ? "duration-0" : "duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/50 dark:focus-visible:ring-zinc-600/50"
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

      {/* 下：注釈（邪魔なら消してOK） */}
      <div className="pointer-events-none absolute inset-x-0 bottom-1 text-center">
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
          ※ Playroom用デモです（リンク遷移はalert）。
        </p>
      </div>
    </div>
  );
}
