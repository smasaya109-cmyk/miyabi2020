import type { ReactNode } from "react";

type StageVariant = "plain" | "grid" | "spotlight"; // 互換のため残す（背景は常にgrid）
type StageSize = "md" | "lg";

type StageProps = {
  /** 右上固定で表示する（バッジ/小ボタンなど） */
  actions?: ReactNode;
  actionsClassName?: string;

  /** ステージ下の補足（必要な記事だけ） */
  notes?: ReactNode;

  /** 体験本体（デモの中身は自由） */
  children?: ReactNode;

  /** 互換のため残すが、背景は常にgridで統一する */
  variant?: StageVariant;

  /** ステージの最低高さ（デフォルト md） */
  minHeight?: StageSize;

  /** 外枠微調整 */
  className?: string;

  /** ステージ内微調整（padding等） */
  stageClassName?: string;

  /**
   * actions があるとき、上部に少しだけ余白を確保して被りを防ぐ
   * デフォルト: true（actionsがある場合のみ）
   */
  reserveTopForActions?: boolean;
} & Record<string, unknown>; // MDX型都合（ExtraComponents互換）

const sizeClass: Record<StageSize, string> = {
  md: "min-h-[320px] sm:min-h-[420px]",
  lg: "min-h-[420px] sm:min-h-[520px]",
};

const gridBg =
  "bg-[linear-gradient(to_right,rgba(24,24,27,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.06)_1px,transparent_1px)] bg-[size:28px_28px] dark:bg-[linear-gradient(to_right,rgba(250,250,250,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(250,250,250,0.06)_1px,transparent_1px)]";

export function Stage({
  actions,
  actionsClassName = "",
  notes,
  children,
  // variantは互換のため受け取るが、背景は常にgrid（未使用）
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant,
  minHeight = "md",
  className = "",
  stageClassName = "",
  reserveTopForActions,
}: StageProps) {
  const reserveTop = reserveTopForActions ?? Boolean(actions);

  return (
    <section className={`not-prose ${className}`} aria-label="Demo stage">
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="relative overflow-hidden rounded-2xl">
          <div
            className={[
              "relative w-full overflow-hidden p-4 sm:p-6",
              sizeClass[minHeight],
              gridBg, // ★常にgrid固定
              stageClassName,
            ].join(" ")}
          >
            {/* actions：右上固定 */}
            {actions ? (
              <div
                className={[
                  "pointer-events-auto absolute right-4 top-4 z-10",
                  actionsClassName,
                ].join(" ")}
              >
                {actions}
              </div>
            ) : null}

            {/* 中身（デモ）は自由。actions被り防止のため上部余白を少し確保 */}
            <div
              className={[
                "relative h-full w-full",
                reserveTop ? "pt-10 sm:pt-12" : "",
              ].join(" ")}
            >
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* 補足ケース（必要な記事だけ） */}
      {notes ? (
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-sm leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-200">
          {notes}
        </div>
      ) : null}
    </section>
  );
}



