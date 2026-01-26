import React from "react";

type Feature = { text: string };

const features: Feature[] = [
  { text: "10,000件以上のAIプロンプト" },
  { text: "全システム無制限利用" },
  { text: "How-toガイド・徹底マニュアル" },
  { text: "カスタムプロンプト無制限" },
  { text: "生涯アップデート" },
  { text: "24時間サポート体制" },
  { text: "フォーラムでいつでも問題解決" },
];

function CrownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 8l4 4 4-7 4 7 4-4 1 12H3L4 8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7 20h10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarDot({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={
        "absolute rounded-full bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.35)] " +
        (className ?? "")
      }
      style={style}
    />
  );
}

/**
 * 宇宙背景 + ゴールドカード + 発光/枠/バッジ（軽量）
 * 追加：背景と繋がる“キラキラ層” + 下部テキスト白
 */
export function PricingCardGold() {
  return (
    <section
      className="
        not-prose relative overflow-hidden py-16 sm:py-24
        w-screen mx-[calc(50%-50vw)]
        sm:w-auto sm:mx-0
      "
    >
      {/* Background base */}
      <div className="pointer-events-none absolute inset-0 bg-[#070810]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_450px_at_30%_20%,rgba(255,205,70,0.18),rgba(0,0,0,0)),radial-gradient(700px_420px_at_70%_70%,rgba(255,255,255,0.08),rgba(0,0,0,0))]" />
      <div className="pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-yellow-400/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[-120px] top-24 h-64 w-64 rounded-full bg-yellow-300/10 blur-3xl" />

      {/* Glitter overlay (背景と繋がる“面”のキラキラ：超軽量) */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(255,255,255,0.20) 0 1px, transparent 2px),
            radial-gradient(circle at 35% 60%, rgba(255,230,160,0.22) 0 1px, transparent 2px),
            radial-gradient(circle at 55% 35%, rgba(255,255,255,0.16) 0 1px, transparent 2px),
            radial-gradient(circle at 75% 55%, rgba(255,230,160,0.18) 0 1px, transparent 2px),
            radial-gradient(circle at 85% 20%, rgba(255,255,255,0.18) 0 1px, transparent 2px)
          `,
          backgroundSize:
            "220px 220px, 260px 260px, 240px 240px, 280px 280px, 300px 300px",
          backgroundPosition: "0 0, 40px 60px, 80px 20px, 120px 90px, 160px 30px",
        }}
      />

      {/* Stars (固定配置) */}
      <div className="pointer-events-none absolute inset-0">
        <StarDot className="h-[2px] w-[2px]" style={{ left: "10%", top: "22%" }} />
        <StarDot className="h-[1px] w-[1px] opacity-70" style={{ left: "18%", top: "65%" }} />
        <StarDot className="h-[2px] w-[2px] opacity-80" style={{ left: "26%", top: "38%" }} />
        <StarDot className="h-[1px] w-[1px] opacity-60" style={{ left: "33%", top: "18%" }} />
        <StarDot className="h-[2px] w-[2px]" style={{ left: "41%", top: "58%" }} />
        <StarDot className="h-[1px] w-[1px] opacity-70" style={{ left: "48%", top: "28%" }} />
        <StarDot className="h-[2px] w-[2px] opacity-90" style={{ left: "56%", top: "14%" }} />
        <StarDot className="h-[1px] w-[1px] opacity-60" style={{ left: "63%", top: "46%" }} />
        <StarDot className="h-[2px] w-[2px]" style={{ left: "71%", top: "62%" }} />
        <StarDot className="h-[1px] w-[1px] opacity-70" style={{ left: "78%", top: "34%" }} />
        <StarDot className="h-[2px] w-[2px] opacity-85" style={{ left: "86%", top: "20%" }} />
        <StarDot className="h-[1px] w-[1px] opacity-60" style={{ left: "92%", top: "55%" }} />
      </div>

      {/* ✅ モバイルだけ左右 5% / PCは従来(px-6) */}
      <div className="relative mx-auto max-w-5xl px-[5vw] sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 backdrop-blur">
            料金
          </span>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            これひとつで全てが解決する
          </h2>
        </div>

        {/* Card */}
        <div className="mt-10 flex justify-center">
          <div className="relative w-full max-w-md">
            {/* 追加：背景とカードが“繋がる”光のベール */}
            <div className="pointer-events-none absolute -inset-24 rounded-[40px] bg-[radial-gradient(closest-side,rgba(255,220,120,0.22),rgba(0,0,0,0))] blur-2xl" />
            <div
              className="pointer-events-none absolute -inset-24 opacity-70 mix-blend-screen blur-[1px]"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 35% 25%, rgba(255,255,255,0.18) 0 1px, transparent 2px),
                  radial-gradient(circle at 70% 40%, rgba(255,230,160,0.20) 0 1px, transparent 2px),
                  radial-gradient(circle at 50% 70%, rgba(255,255,255,0.14) 0 1px, transparent 2px)
                `,
                backgroundSize: "180px 180px, 210px 210px, 240px 240px",
              }}
            />

            {/* 追加：カード周囲の“瞬き”星 */}
            <div className="pointer-events-none absolute inset-0">
              <StarDot className="h-[2px] w-[2px] animate-pulse" style={{ left: "-6%", top: "18%", animationDelay: "0.2s" }} />
              <StarDot className="h-[1px] w-[1px] opacity-80 animate-pulse" style={{ left: "-2%", top: "62%", animationDelay: "0.8s" }} />
              <StarDot className="h-[2px] w-[2px] opacity-90 animate-pulse" style={{ right: "-6%", top: "26%", animationDelay: "0.5s" }} />
              <StarDot className="h-[1px] w-[1px] opacity-80 animate-pulse" style={{ right: "-2%", top: "70%", animationDelay: "1.1s" }} />
              <StarDot className="h-[1px] w-[1px] opacity-70 animate-pulse" style={{ left: "18%", top: "-6%", animationDelay: "0.6s" }} />
              <StarDot className="h-[2px] w-[2px] opacity-85 animate-pulse" style={{ left: "70%", top: "-5%", animationDelay: "0.9s" }} />
            </div>

            {/* outer glow */}
            <div className="absolute -inset-6 rounded-[32px] bg-yellow-400/15 blur-2xl" />
            <div className="absolute -inset-2 rounded-[28px] bg-[radial-gradient(closest-side,rgba(255,225,120,0.35),rgba(0,0,0,0))] blur-xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-yellow-200/35 bg-[linear-gradient(180deg,rgba(255,214,85,0.95)_0%,rgba(202,150,10,0.92)_35%,rgba(26,20,8,0.92)_100%)] shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
              {/* subtle sparkles in card */}
              <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-soft-light">
                <div className="absolute left-6 top-10 h-20 w-20 rounded-full bg-white/20 blur-2xl" />
                <div className="absolute right-8 top-16 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute left-16 bottom-20 h-28 w-28 rounded-full bg-black/20 blur-2xl" />
              </div>

              {/* 追加：カード表面に“きらめき膜”（背景と馴染ませる） */}
              <div
                className="pointer-events-none absolute inset-0 opacity-55 mix-blend-screen"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 20% 25%, rgba(255,255,255,0.26) 0 1px, transparent 2px),
                    radial-gradient(circle at 55% 35%, rgba(255,230,160,0.22) 0 1px, transparent 2px),
                    radial-gradient(circle at 78% 65%, rgba(255,255,255,0.18) 0 1px, transparent 2px)
                  `,
                  backgroundSize: "160px 160px, 190px 190px, 220px 220px",
                }}
              />

              {/* badge */}
              <div className="absolute right-4 top-4">
                <span className="inline-flex items-center rounded-full bg-yellow-200/95 px-3 py-1 text-xs font-medium text-black shadow-sm">
                  一番お得
                </span>
              </div>

              <div className="relative p-6 sm:p-7">
                {/* header */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-white/15 text-white backdrop-blur">
                    <CrownIcon className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="text-xl font-semibold text-white">プレミアム</div>
                    <div className="mt-1 text-sm text-white/80">完全版</div>
                  </div>
                </div>

                {/* toggle (static look) */}
                <div className="mt-5 rounded-full border border-white/18 bg-white/10 p-1 backdrop-blur">
                  <div className="grid grid-cols-2 items-center gap-1">
                    <span
                      className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(180deg,#FFE37A_0%,#F7B500_100%)] px-4 py-2 text-sm font-medium text-black shadow-[0_10px_22px_rgba(0,0,0,0.25)]"
                      aria-label="月額（選択中）"
                    >
                      月額
                    </span>

                    <span className="inline-flex items-center justify-center rounded-full px-3 py-2 text-sm font-medium text-white/90 sm:px-4 whitespace-nowrap flex-nowrap">
                      <span className="whitespace-nowrap">年額</span>
                      <span className="ml-2 inline-flex shrink-0 whitespace-nowrap rounded-full bg-yellow-200/95 px-2 py-0.5 text-[10px] font-semibold leading-none text-black sm:text-[11px]">
                        30%お得
                      </span>
                    </span>
                  </div>
                </div>

                {/* price */}
                <div className="mt-6 flex items-end gap-2">
                  <div className="text-4xl font-semibold tracking-tight text-white">
                    <span className="text-white">¥19,800</span>
                    <span className="text-base font-medium text-white/75"> /月</span>
                  </div>
                </div>

                <div className="mt-5 h-px w-full bg-white/15" />

                {/* features */}
                <ul className="mt-5 space-y-3">
                  {features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-white/85">
                      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/15 text-white">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                      <span className="leading-6">{f.text}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7">
                  <button
                    type="button"
                    className="w-full rounded-full bg-[linear-gradient(180deg,#FFE37A_0%,#F7B500_100%)] px-5 py-3 text-sm font-semibold text-black shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition hover:brightness-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0c14]"
                  >
                    今すぐ購入
                  </button>
                </div>

                <p className="mt-5 text-center text-xs !text-white !opacity-100 drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]">
                  7日間無料トライアル ・ 毎週アップデート ・ いつでも解約
                </p>
              </div>

              {/* bottom border glow */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(255,215,100,0.35),rgba(0,0,0,0))]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
