"use client";

import * as React from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const DEFAULT_TEXT =
  "話しながら、文章が整っていく。\n" +
  "・要点は箇条書きに\n" +
  "・口調は丁寧に\n" +
  "・最後に次のアクション\n\n" +
  "（Space をホールド / スマホは長押しで進む）\n";

export default function VoiceHoldTypeDemo({
  text = DEFAULT_TEXT,
  speedMsPerChar = 26,
}: {
  text?: string;
  speedMsPerChar?: number;
}) {
  const total = text.length;

  const [holding, setHolding] = React.useState(false);
  const [count, setCount] = React.useState(0);

  // 再開しても続きから進むための基準
  const startTimeRef = React.useRef<number | null>(null);
  const startCountRef = React.useRef<number>(0);
  const rafRef = React.useRef<number | null>(null);

  const stop = React.useCallback(() => {
    setHolding(false);
    startTimeRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const start = React.useCallback(() => {
    if (count >= total) return;
    setHolding(true);
    startTimeRef.current = performance.now();
    startCountRef.current = count;
  }, [count, total]);

  const reset = React.useCallback(() => {
    stop();
    setCount(0);
  }, [stop]);

  // キーボード：Spaceホールド（ページスクロール防止）
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      if (e.repeat) return;
      start();
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      stop();
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp, { passive: false });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [start, stop]);

  // ホールド中に文字を進める（解除で停止、再ホールドで続きから）
  React.useEffect(() => {
    if (!holding) return;

    const tick = (t: number) => {
      if (startTimeRef.current == null) startTimeRef.current = t;
      const elapsed = t - startTimeRef.current;
      const next = Math.min(total, startCountRef.current + Math.floor(elapsed / speedMsPerChar));

      setCount(next);

      if (next < total) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        stop();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [holding, speedMsPerChar, stop, total]);

  const shown = text.slice(0, count);
  const progress = total === 0 ? 0 : Math.round((count / total) * 100);

  return (
    <section className="not-prose">
      {/* Glass shell */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1220] via-[#0b0b12] to-[#120612] text-white shadow-[0_22px_80px_rgba(0,0,0,0.30)]">
        {/* background lights */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-28 h-[420px] w-[420px] rounded-full bg-rose-500/25 blur-3xl" />
          <div className="absolute -right-28 top-10 h-[420px] w-[420px] rounded-full bg-cyan-400/18 blur-3xl" />
          <div className="absolute left-1/2 top-2/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-fuchsia-400/12 blur-3xl" />
          {/* subtle vignette + sheen */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_35%,rgba(255,255,255,0.08),transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/45" />
        </div>

        <div className="relative z-10 mx-auto max-w-[920px] px-6 py-12">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              {/* ✅ 見えない問題：コントラスト強化 + 微シャドウ */}
              <p className="text-xs font-semibold tracking-wider !text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.55)]">
                PLAYROOM / HOLD-TO-TYPE
              </p>


              <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                Hold to write
              </h3>

              {/* ✅ 見えない問題：ガラス下地 + コントラスト強化 */}
              <p className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-xl border border-white/12 bg-white/[0.06] px-3 py-2 text-sm !text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.45)] backdrop-blur-xl">
                PCは <KeyCap>Space</KeyCap> をホールド。スマホは右のボタンを長押し。
              </p>

            </div>

            <div className="flex items-center gap-2">
              <GlassButton onClick={reset} tone="ghost">
                Reset
              </GlassButton>

              <PressHoldButton holding={holding} onDown={start} onUp={stop} />
            </div>
          </div>

          {/* Main glass panel */}
          <div className="mt-6 rounded-3xl border border-white/12 bg-white/[0.06] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.30)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-white/70 drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]">
                Demo output
              </div>
              <div className="text-xs text-white/70 drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]">
                {progress}%
              </div>
            </div>

            {/* Output glass */}
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-xl">
              <pre className="min-h-[170px] whitespace-pre-wrap text-sm leading-6 text-white/85 drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]">
                {shown || "（Space をホールド / Press & hold で開始）"}
              </pre>

              {/* Progress (glass track) */}
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
                <div
                  className={cx(
                    "h-full rounded-full",
                    "bg-gradient-to-r from-rose-300/90 via-fuchsia-200/90 to-cyan-200/80",
                    "transition-[width] duration-200 motion-reduce:transition-none"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* ✅ 見えない問題：コントラスト強化 + 微シャドウ */}
            <p className="mt-4 text-xs !text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.50)]">
              ※ 本物の音声入力はしていません。Playroomでは「体験の気持ちよさ」だけを再現しています。
            </p>


          </div>
        </div>
      </div>
    </section>
  );
}

function KeyCap({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-white/25 bg-white/[0.08] px-2 py-1 font-mono text-[11px] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] drop-shadow-[0_1px_0_rgba(0,0,0,0.35)] backdrop-blur">
      {children}
    </span>
  );
}

function GlassButton({
  children,
  onClick,
  tone = "glass",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  tone?: "glass" | "ghost";
}) {
  const base =
    "rounded-full px-4 py-2 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

  const glass =
    "border border-white/15 bg-white/[0.08] text-white/85 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-xl hover:bg-white/[0.12] active:scale-[0.99] motion-reduce:active:scale-100";

  const ghost =
    "border border-white/12 bg-white/[0.05] text-white/80 backdrop-blur-xl hover:bg-white/[0.10]";

  return (
    <button type="button" onClick={onClick} className={cx(base, tone === "glass" ? glass : ghost)}>
      {children}
    </button>
  );
}

function PressHoldButton({
  holding,
  onDown,
  onUp,
}: {
  holding: boolean;
  onDown: () => void;
  onUp: () => void;
}) {
  return (
    <button
      type="button"
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className={cx(
        "relative rounded-full px-4 py-2 text-xs font-medium",
        "border border-white/18 backdrop-blur-xl",
        "shadow-[0_12px_34px_rgba(0,0,0,0.32)]",
        "transition active:scale-[0.99] motion-reduce:active:scale-100",
        holding
          ? "bg-white/[0.20] text-white"
          : "bg-white/[0.10] text-white/90 hover:bg-white/[0.14]"
      )}
    >
      {/* inner sheen */}
      <span className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]" />
      {/* recording-like pulse when holding */}
      <span
        className={cx(
          "pointer-events-none absolute -inset-2 rounded-full",
          holding ? "animate-pulse bg-rose-400/10" : "opacity-0"
        )}
      />
      <span className="relative drop-shadow-[0_1px_0_rgba(0,0,0,0.35)]">
        {holding ? "Holding…" : "Press & hold"}
      </span>
    </button>
  );
}
