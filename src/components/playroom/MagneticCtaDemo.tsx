"use client";

import { useEffect, useMemo, useRef } from "react";
import { ButtonLink } from "@/components/ui/ButtonLink";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function MagneticCtaDemo() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const btnWrapRef = useRef<HTMLDivElement | null>(null);

  const reduceMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return (
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
    );
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const stage = stageRef.current;
    const btnWrap = btnWrapRef.current;
    if (!stage || !btnWrap) return;

    let raf = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let hovering = false;

    const strength = 0.22; // 控えめ（落ち着く）
    const radius = 160; // 体験ゾーン広め（触りやすい）

    const animate = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      btnWrap.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      raf = requestAnimationFrame(animate);
    };

    const onEnter = () => {
      hovering = true;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(animate);
    };

    const onLeave = () => {
      hovering = false;
      targetX = 0;
      targetY = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (!hovering) return;

      const rect = btnWrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist > radius) {
        targetX = 0;
        targetY = 0;
        return;
      }

      const t = 1 - dist / radius;
      targetX = clamp(dx * strength * t, -20, 20);
      targetY = clamp(dy * strength * t, -16, 16);
    };

    // キーボード操作時は安定優先（動かさない）
    const onFocusIn = () => {
      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
      btnWrap.style.transform = "translate3d(0,0,0)";
    };

    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("focusin", onFocusIn);

    return () => {
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("focusin", onFocusIn);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    // ✅ ここが重要：MDX/Proseの影響を受けない
    <div className="not-prose my-8">
      <div className="rounded-2xl border border-zinc-200/80 bg-white/60 p-5 sm:p-6 shadow-sm shadow-zinc-900/5 backdrop-blur">
        {/* 体験が主役：ステージを上に */}
        <div
          ref={stageRef}
          className="rounded-2xl border border-zinc-200/70 bg-gradient-to-b from-zinc-50 to-zinc-100 p-8 sm:p-10 shadow-sm shadow-zinc-900/10"
        >
          <div className="mx-auto flex min-h-[180px] sm:min-h-[220px] items-center justify-center">
            <div ref={btnWrapRef} className="will-change-transform inline-block">
              <ButtonLink href="/contact" variant="primary" size="lg">
                く〜るくるします <span className="opacity-90">→</span>
              </ButtonLink>
            </div>
          </div>

          {/* ステージ下の一言（Selected: みたいな置き方） */}
          <div className="mt-4 text-center text-sm text-zinc-700">
            Try hovering around the button.
          </div>
        </div>

        {/* 補足は “ケース” にまとめる（主役を邪魔しない） */}
        <div className="mt-4 rounded-2xl border border-zinc-200/70 bg-white/70 px-4 py-3">
          <p className="text-xs leading-5 text-zinc-600">
            ※「設定 &gt; モーション軽減」では動きません
          </p>
          <p className="text-xs leading-5 text-zinc-600">
            ※パソコンでお試し下さい。
          </p>
        </div>
      </div>
    </div>
  );
}
