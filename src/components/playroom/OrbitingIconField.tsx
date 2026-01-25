"use client";

import * as React from "react";

type Bubble = {
  label: string;
  tone?: "outline" | "solid";
};

const DEFAULT_BUBBLES: Bubble[] = [
  { label: "UPC", tone: "outline" },
  { label: "ISAN", tone: "outline" },
  { label: "ISNI", tone: "outline" },
  { label: "ISMN", tone: "outline" },
  { label: "R", tone: "outline" },
  { label: "M", tone: "outline" },
  { label: "a", tone: "outline" },
  { label: "●", tone: "solid" },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * 背景の“アイコンがくるくる回る”フィールド
 * - 内→中→外の3リング（小/中/大）
 * - リングごとに回転方向を交互（右・左・右）
 * - バッジは逆回転で「向き固定」
 * - reduced-motion 対応（prefers-reduced-motion で停止）
 * - ✅ リング外周の線（輪郭）は描かない
 */
export default function OrbitingIconField({
  bubbles = DEFAULT_BUBBLES,
}: {
  bubbles?: Bubble[];
}) {
  // ✅ 内側から 小 → 中 → 大（同心円）
  const rings = React.useMemo(
    () => [
      // inner (small) : 1周目
      { radius: 86, count: 8, duration: 18, dir: "normal" as const, badge: 54, opacity: 0.28 },
      // middle (medium) : 2周目
      { radius: 142, count: 10, duration: 24, dir: "reverse" as const, badge: 60, opacity: 0.20 },
      // outer (large) : 3周目
      { radius: 210, count: 12, duration: 32, dir: "normal" as const, badge: 64, opacity: 0.14 },
    ],
    []
  );

  return (
    <section className="not-prose">
      <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-[#170b10] shadow-[0_18px_60px_rgba(0,0,0,0.18)]">
        {/* 背景グラデ（赤寄り） */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(255,70,95,0.28),transparent_62%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_12%_22%,rgba(255,120,90,0.20),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_88%_22%,rgba(255,120,90,0.18),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_30%,rgba(0,0,0,0.55)_80%)]" />
        </div>

        {/* 中央コンテンツ */}
        <div className="relative z-10 flex min-h-[420px] items-center justify-center px-6 py-16">
          <div className="text-center">
            <div className="mx-auto mb-6 h-12 w-12 rounded-full bg-white/90" />
            <h3 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Explore Playroom
            </h3>
            <button
              type="button"
              className="mt-8 rounded-full bg-rose-400/90 px-5 py-2 text-sm font-medium text-black shadow-[0_10px_30px_rgba(0,0,0,0.30)] transition hover:bg-rose-400"
            >
              Explore Playroom
            </button>
          </div>
        </div>

        {/* くるくる背景（同心円） */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {/* 中心位置：中央やや下（必要ならここだけ微調整） */}
          <div className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2">
            {rings.map((r, idx) => (
              <OrbitRing
                key={idx}
                radius={r.radius}
                count={r.count}
                duration={r.duration}
                animationDirection={r.dir}
                bubbles={bubbles}
                badgeSize={r.badge}
                opacity={r.opacity}
              />
            ))}
          </div>
        </div>

        {/* keyframes */}
        <style jsx>{`
          @keyframes oif-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes oif-counter {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
          }
          @media (prefers-reduced-motion: reduce) {
            .oif-spin, .oif-counter { animation: none !important; }
          }
        `}</style>
      </div>
    </section>
  );
}

function OrbitRing({
  radius,
  count,
  duration,
  animationDirection,
  bubbles,
  badgeSize,
  opacity,
}: {
  radius: number;
  count: number;
  duration: number;
  animationDirection: "normal" | "reverse";
  bubbles: Bubble[];
  badgeSize: number;
  opacity: number;
}) {
  // リングの外接サイズ（バッジが外にはみ出さない余白込み）
  const size = radius * 2 + badgeSize + 24;

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: size, height: size, opacity }}
    >
      {/* ✅ リング外周線は描かない（ここを削除済み） */}

      {/* rotation container */}
      <div
        className="oif-spin absolute inset-0 will-change-transform"
        style={{
          width: size,
          height: size,
          animation: `oif-spin ${duration}s linear infinite`,
          animationDirection,
        }}
      >
        {Array.from({ length: count }).map((_, i) => {
        const safeBubbles = bubbles.length ? bubbles : DEFAULT_BUBBLES;
        const first = safeBubbles[0]!;

        const angle = (360 / count) * i;
        const b = safeBubbles[i % safeBubbles.length] ?? first;
        const isSolid = b.tone === "solid";


          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px)`,
              }}
            >
              {/* counter rotate to keep upright */}
              <div
                className="oif-counter"
                style={{
                  animation: `oif-counter ${duration}s linear infinite`,
                  animationDirection, // 外側と同じdirectionで正立維持
                }}
              >
                <div
                  className={cx(
                    "grid place-items-center rounded-full",
                    "shadow-[0_10px_30px_rgba(0,0,0,0.30)]",
                    isSolid
                      ? "bg-white/16 text-white/80"
                      : "border border-white/18 bg-white/5 text-white/80"
                  )}
                  style={{ width: badgeSize, height: badgeSize }}
                >
                  <span className="text-sm font-medium tracking-wide">{b.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
