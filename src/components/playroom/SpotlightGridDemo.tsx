"use client";

import { useMemo, useRef } from "react";

type Item = { title: string; desc: string };

const items: Item[] = [
  { title: "Card A", desc: "静かに光が追従する、落ち着く演出。" },
  { title: "Card B", desc: "派手じゃないのに気持ちいい。" },
  { title: "Card C", desc: "UIの“質感”だけを足す感じ。" },
  { title: "Card D", desc: "濃い影ではなく、薄い光で。" },
];

function useReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return true;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  }, []);
}

function SpotlightCard({ title, desc }: Item) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const reduceMotion = useReducedMotion();

  const setVars = (x: number, y: number) => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--cx", `${x}px`);
    el.style.setProperty("--cy", `${y}px`);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const el = cardRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    lastRef.current = { x, y };
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      if (!lastRef.current) return;
      setVars(lastRef.current.x, lastRef.current.y);
    });
  };

  const onLeave = () => {
    lastRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;

    // ✅ 離れたら中心へ戻す（残像防止）
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--cx", "50%");
    el.style.setProperty("--cy", "50%");
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/70 p-5 shadow-sm shadow-zinc-900/5 transition hover:bg-white hover:border-zinc-300/70 hover:shadow-md hover:shadow-zinc-900/10"
      style={
        {
          // ✅ ここはカード自身の変数だけ参照（親の影響を受けない）
          backgroundImage:
            "radial-gradient(420px circle at var(--cx, 50%) var(--cy, 50%), rgba(24,24,27,0.08), transparent 58%)",
        } as React.CSSProperties
      }
      data-spotlight-card="true"
    >
      <div className="text-sm font-medium tracking-tight text-zinc-950">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-700">{desc}</p>

      <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-900">
        Open <span className="transition-transform group-hover:translate-x-0.5">→</span>
      </div>
    </div>
  );
}

export function SpotlightGridDemo() {
  return (
    <div className="not-prose my-8">
      <div className="rounded-2xl border border-zinc-200/80 bg-white/60 p-5 sm:p-6 shadow-sm shadow-zinc-900/5 backdrop-blur">
        {/* ✅ ステージは“固定の上質背景”だけ（追従しない） */}
        <div className="rounded-2xl border border-zinc-200/70 bg-gradient-to-b from-zinc-50 to-zinc-100 p-6 sm:p-8 shadow-sm shadow-zinc-900/10">
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((it) => (
              <SpotlightCard key={it.title} {...it} />
            ))}
          </div>

          <div className="mt-4 text-center text-sm text-zinc-700">
            Move your cursor over the cards.
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-3">
          <p className="text-xs leading-5 text-zinc-600">
            ※「モーション軽減」では追従しません
          </p>
        </div>
      </div>
    </div>
  );
}
