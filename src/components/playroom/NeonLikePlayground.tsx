"use client";

import * as React from "react";

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

function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

export default function NeonLikePlayground() {
  const reduced = usePrefersReducedMotion();

  const [liked, setLiked] = React.useState(false);
  const [burst, setBurst] = React.useState(false);
  const [burstKey, setBurstKey] = React.useState(0);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const triggerBurst = React.useCallback(() => {
    if (reduced) return;
    setBurstKey((k) => k + 1);
    setBurst(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setBurst(false), 820);
  }, [reduced]);

  const onToggle = () => {
    setLiked((prev) => {
      triggerBurst();
      return !prev;
    });
  };

  return (
    /**
     * ✅ ここが肝
     * Stage側は min-height なので h-full が効かない（%高さが解決できない）
     * → デモ側で “確定高さのキャンバス” を用意して、その中で中央寄せする
     *
     * Stage(md)の最小高：320 / 420 (sm)
     * actions reserveTop が入っても溢れないよう、少し控えめに
     */
    <div className="w-full">
      <div className="relative w-full h-[260px] sm:h-[340px] grid place-items-center">
        {/* iPhone（キャンバス中央） */}
        <div
          className={cn(
            "relative",
            "h-[240px] sm:h-[320px]",
            "aspect-[9/19.5]",
            "rounded-[44px] border border-white/10 bg-zinc-950",
            "shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
          )}
        >
          {/* outer subtle highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-[44px] ring-1 ring-white/5" />
          <div className="pointer-events-none absolute -inset-px rounded-[44px] bg-gradient-to-b from-white/6 via-transparent to-white/4 opacity-60" />

          {/* screen */}
          <div className="absolute inset-[10px] rounded-[34px] bg-black overflow-hidden ring-1 ring-white/5">
            {/* faint screen gradient */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_40%,rgba(255,0,160,0.06),rgba(0,0,0,0)_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/0 opacity-40" />

            {/* notch */}
            <div className="pointer-events-none absolute left-1/2 top-2 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-zinc-950/95 ring-1 ring-white/5" />

            {/* ✅ Likeボタン：iPhone画面のど真ん中 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* smoke（画面内でクリップ） */}
              {!reduced && burst ? (
                <div
                  key={burstKey}
                  className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  aria-hidden
                >
                  <span className="nl-smoke nl-smoke-1" />
                  <span className="nl-smoke nl-smoke-2" />
                  <span className="nl-smoke nl-smoke-3" />
                </div>
              ) : null}

              <button
                type="button"
                onClick={onToggle}
                aria-label={liked ? "Unlike" : "Like"}
                aria-pressed={liked}
                className={cn(
                  "nl-orb group relative grid place-items-center",
                  "h-16 w-16 rounded-full border",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/40"
                )}
                data-liked={liked ? "true" : "false"}
                data-burst={burst ? "true" : "false"}
              >
                <span className="nl-orb-glass absolute inset-[3px] rounded-full" />
                <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    className="nl-heart-path"
                    d="M12 21s-7.2-4.4-9.6-9.1C.6 7.4 3.2 4.2 6.8 4.2c2 0 3.6 1.1 5.2 2.8c1.6-1.7 3.2-2.8 5.2-2.8c3.6 0 6.2 3.2 4.4 7.7C19.2 16.6 12 21 12 21z"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <style>{`
            .nl-orb {
              border-color: rgba(255,255,255,0.14);
              background:
                radial-gradient(70% 70% at 30% 25%, rgba(255,255,255,0.22), rgba(255,255,255,0) 60%),
                radial-gradient(90% 90% at 65% 70%, rgba(255, 0, 140, 0.28), rgba(255, 0, 140, 0) 62%),
                rgba(255,255,255,0.06);
              box-shadow:
                0 18px 50px rgba(0,0,0,0.65),
                0 0 0 1px rgba(255,255,255,0.06);
              transition: transform 220ms ease, box-shadow 220ms ease, filter 220ms ease;
              will-change: transform;
            }
            .nl-orb:hover { transform: translateY(-1px); }
            .nl-orb:active { transform: translateY(0px) scale(0.98); }

            .nl-orb-glass{
              background:
                radial-gradient(80% 80% at 30% 25%, rgba(255,255,255,0.16), rgba(255,255,255,0) 60%),
                radial-gradient(90% 90% at 70% 80%, rgba(255, 0, 170, 0.18), rgba(255, 0, 170, 0) 62%);
            }

            .nl-heart-path{
              stroke: rgba(255,255,255,0.55);
              filter: drop-shadow(0 0 10px rgba(255,0,160,0));
              stroke-dasharray: 120;
              stroke-dashoffset: 120;
              transition: stroke 220ms ease, filter 220ms ease, stroke-dashoffset 360ms ease;
            }

            .nl-orb[data-liked="true"]{
              box-shadow:
                0 18px 50px rgba(0,0,0,0.65),
                0 0 0 1px rgba(255,255,255,0.06),
                0 0 46px rgba(255, 0, 160, 0.32),
                0 0 86px rgba(255, 0, 160, 0.18);
              filter: saturate(1.1);
            }
            .nl-orb[data-liked="true"] .nl-heart-path{
              stroke: rgba(255, 90, 205, 0.98);
              filter: drop-shadow(0 0 14px rgba(255, 0, 160, 0.6));
              stroke-dashoffset: 0;
            }

            .nl-orb[data-burst="true"]{
              animation: nl-pop 720ms cubic-bezier(0.22,1,0.36,1) both;
            }
            @keyframes nl-pop{
              0% { transform: translateY(0) scale(1); }
              22% { transform: translateY(-2px) scale(1.18); }
              55% { transform: translateY(0) scale(1.02); }
              100% { transform: translateY(0) scale(1); }
            }

            .nl-smoke{
              position: absolute;
              left: 50%;
              top: 50%;
              width: 38px;
              height: 170px;
              transform: translate(-50%, -50%);
              border-radius: 999px;
              background: linear-gradient(
                to top,
                rgba(255, 0, 160, 0.00),
                rgba(255, 0, 160, 0.18) 18%,
                rgba(255, 0, 160, 0.44) 40%,
                rgba(255, 0, 160, 0.00)
              );
              filter: blur(10px);
              mix-blend-mode: screen;
              opacity: 0;
              animation: nl-smoke-rise 900ms cubic-bezier(0.22,1,0.36,1) both;
              will-change: transform, opacity;
            }
            .nl-smoke-1{ margin-left: -18px; animation-delay: 0ms; transform: translate(-50%, -50%) rotate(-10deg); }
            .nl-smoke-2{ margin-left: 4px;  animation-delay: 80ms; transform: translate(-50%, -50%) rotate(6deg); }
            .nl-smoke-3{ margin-left: 24px; animation-delay: 150ms; transform: translate(-50%, -50%) rotate(16deg); }

            @keyframes nl-smoke-rise{
              0%   { opacity: 0; transform: translate(-50%, -50%) translate3d(0, 10px, 0) scale(0.9); }
              12%  { opacity: 0.9; }
              100% { opacity: 0; transform: translate(-50%, -50%) translate3d(0, -155px, 0) scale(1.25); }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}
