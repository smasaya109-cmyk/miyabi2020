"use client";

import * as React from "react";

type ViewId = "list" | "detail" | "filter";

const VIEWS: Array<{ id: ViewId; label: string; caption: string }> = [
  { id: "list", label: "一覧", caption: "探す→絞る→見る の順に自然な導線へ" },
  { id: "detail", label: "詳細", caption: "情報の優先度を揃え、読みやすく" },
  { id: "filter", label: "絞り込み", caption: "状態（未適用/適用中）を迷わせない" },
];

function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

function Chip({
  active,
  tone,
  children,
}: {
  active?: boolean;
  tone: "before" | "after";
  children: React.ReactNode;
}) {
  const base = "inline-flex items-center rounded-full px-2.5 py-1 text-[11px]";
  const style =
    tone === "before"
      ? active
        ? "bg-blue-600 text-white"
        : "bg-zinc-100 text-zinc-700"
      : active
      ? "bg-emerald-700 text-white"
      : "bg-zinc-100 text-zinc-700";
  return <span className={clsx(base, style)}>{children}</span>;
}

function PillButton({
  tone,
  variant,
  children,
}: {
  tone: "before" | "after";
  variant: "primary" | "ghost" | "neutral";
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium";
  const style =
    variant === "primary"
      ? tone === "before"
        ? "bg-blue-600 text-white"
        : "bg-emerald-700 text-white"
      : variant === "ghost"
      ? tone === "before"
        ? "bg-white text-blue-700 ring-1 ring-blue-200"
        : "bg-white text-emerald-700 ring-1 ring-emerald-200"
      : "bg-white text-zinc-800 ring-1 ring-zinc-200";
  return <button className={clsx(base, style)}>{children}</button>;
}

function PhoneFrame({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "before" | "after";
  children: React.ReactNode;
}) {
  return (
    <section className="w-full max-w-[380px]">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-zinc-900">{title}</h4>
        <span
          className={clsx(
            "rounded-full px-2 py-0.5 text-[11px]",
            tone === "before"
              ? "bg-blue-50 text-blue-700"
              : "bg-emerald-50 text-emerald-700"
          )}
        >
          {tone === "before" ? "Before" : "After"}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-zinc-200">
        <div className="pointer-events-none absolute left-1/2 top-2 h-5 w-28 -translate-x-1/2 rounded-full bg-zinc-900/10" />
        <div className="relative px-4 pb-4 pt-10">{children}</div>
      </div>
    </section>
  );
}

/**
 * ✅ 修正ポイント
 * - “塗り”をやめて枠線だけに（UIが潰れない）
 * - z-indexを上げて枠線/ラベルが確実に前に出る
 * - ラベルは白背景+ぼかしで読みやすく
 */
function Highlight({
  show,
  className,
  label,
  color = "emerald",
}: {
  show: boolean;
  className: string;
  label: string;
  color?: "emerald" | "blue" | "amber";
}) {
  if (!show) return null;

  const border =
    color === "emerald"
      ? "border-emerald-500/70 text-emerald-900"
      : color === "blue"
      ? "border-blue-500/70 text-blue-900"
      : "border-amber-500/70 text-amber-900";

  return (
    <div
      className={clsx(
        "pointer-events-none absolute z-20 rounded-2xl border-2 bg-transparent",
        border,
        className
      )}
    >
      <div className="absolute -top-3 left-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold shadow-sm ring-1 ring-black/10 backdrop-blur">
        {label}
      </div>
    </div>
  );
}

function TopArea({
  tone,
  dense,
  showHighlights,
}: {
  tone: "before" | "after";
  dense?: boolean;
  showHighlights: boolean;
}) {
  const isBefore = tone === "before";
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between">
        <div className="text-[11px] text-zinc-500">9:41</div>
        <div className="flex items-center gap-1 text-[11px] text-zinc-500">
          <span>◼︎◼︎◼︎</span>
          <span>⌁</span>
          <span>▮</span>
        </div>
      </div>

      {tone === "after" && (
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-zinc-200" />
            <div className="leading-tight">
              <div className="text-[11px] text-zinc-500">こんにちは 👋</div>
              <div className="text-sm font-semibold text-zinc-900">みやび</div>
            </div>
          </div>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-zinc-200">
            🔔
          </button>
        </div>
      )}

      <div className={clsx("mt-3", dense ? "space-y-2" : "space-y-3")}>
        <div className="relative">
          <div
            className={clsx(
              "flex items-center gap-2 rounded-full px-3 py-2 ring-1",
              isBefore ? "bg-white ring-blue-200" : "bg-zinc-50 ring-zinc-200"
            )}
          >
            <span className="text-zinc-400">⌕</span>
            <span className={clsx("text-xs", isBefore ? "text-zinc-500" : "text-zinc-600")}>
              エリア・駅・物件名で検索
            </span>
            <span className="ml-auto text-zinc-400">🎙</span>
          </div>

          {isBefore && (
            <div className="mt-2 flex flex-wrap gap-2">
              <Chip tone="before">最近見た</Chip>
              <Chip tone="before">保存済み</Chip>
              <Chip tone="before">人気</Chip>
              <Chip tone="before">ランキング</Chip>
              <Chip tone="before">沿線</Chip>
              <Chip tone="before">地図</Chip>
            </div>
          )}

          <Highlight
            show={showHighlights && isBefore}
            color="amber"
            label="ノイズ：補助導線が多すぎ"
            className="inset-[-4px]"
          />
          <Highlight
            show={showHighlights && !isBefore}
            color="emerald"
            label="検索が主役"
            className="inset-[-4px]"
          />
        </div>

        <div className="relative">
          <div className="grid grid-cols-5 gap-2">
            {["マンション", "戸建て", "土地", "新築", "投資"].map((t, i) => {
              const active = !isBefore && i === 1;
              return (
                <div
                  key={t}
                  className={clsx(
                    "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] ring-1",
                    isBefore ? "bg-zinc-50 ring-zinc-200" : "bg-white ring-zinc-200",
                    active && "bg-emerald-50 ring-emerald-200"
                  )}
                >
                  <div
                    className={clsx(
                      "flex h-8 w-8 items-center justify-center rounded-full text-[12px]",
                      active
                        ? "bg-emerald-700 text-white"
                        : isBefore
                        ? "bg-white text-blue-600 ring-1 ring-blue-200"
                        : "bg-white text-zinc-500 ring-1 ring-zinc-200"
                    )}
                  >
                    ⌂
                  </div>
                  <div
                    className={clsx(
                      active ? "text-emerald-800" : isBefore ? "text-zinc-600" : "text-zinc-700"
                    )}
                  >
                    {t}
                  </div>
                </div>
              );
            })}
          </div>

          <Highlight
            show={showHighlights && isBefore}
            color="amber"
            label="状態が弱い"
            className="inset-[-4px]"
          />
          <Highlight
            show={showHighlights && !isBefore}
            color="emerald"
            label="選択状態が一目で分かる"
            className="inset-[-4px]"
          />
        </div>

        <div className="relative">
          <div className={clsx("flex items-center gap-2", dense && "flex-wrap")}>
            <PillButton tone={tone} variant="primary">
              賃貸
            </PillButton>
            <PillButton tone={tone} variant="neutral">
              売買
            </PillButton>

            {isBefore ? (
              <>
                <PillButton tone="before" variant="primary">
                  掲載する
                </PillButton>
                <PillButton tone="before" variant="neutral">
                  Sort
                </PillButton>
                <PillButton tone="before" variant="neutral">
                  Filter
                </PillButton>
              </>
            ) : (
              <div className="ml-auto flex items-center gap-2">
                <PillButton tone="after" variant="neutral">
                  並び替え
                </PillButton>
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-white">
                  ☰
                </button>
              </div>
            )}
          </div>

          <Highlight
            show={showHighlights && isBefore}
            color="amber"
            label="CTAが多すぎ"
            className="inset-[-4px]"
          />
          <Highlight
            show={showHighlights && !isBefore}
            color="emerald"
            label="行動が絞られて迷いにくい"
            className="inset-[-4px]"
          />
        </div>
      </div>
    </div>
  );
}

function Promo({ tone }: { tone: "before" | "after" }) {
  const isBefore = tone === "before";
  const bg = isBefore
    ? "bg-gradient-to-r from-blue-700 to-blue-600"
    : "bg-gradient-to-r from-emerald-800 to-emerald-600";
  return (
    <div className={clsx("rounded-2xl text-white", bg, isBefore ? "p-3" : "p-4")}>
      <div className={clsx(isBefore ? "text-xs font-semibold" : "text-sm font-semibold")}>
        物件掲載をかんたんに
      </div>
      <div className={clsx("mt-1", isBefore ? "text-[10px] text-white/80" : "text-[11px] text-white/85")}>
        掲載は無料。問い合わせにつながる見せ方をサポート。
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className={clsx("rounded-full bg-white/15 px-3 py-1", isBefore ? "text-[10px]" : "text-[11px]")}>
          物件を掲載する →
        </div>
        {isBefore && (
          <div className="rounded-full bg-white/15 px-3 py-1 text-[10px]">クーポン</div>
        )}
      </div>
    </div>
  );
}

function ListingCard({ tone }: { tone: "before" | "after" }) {
  const isBefore = tone === "before";
  return (
    <div className={clsx("rounded-2xl bg-white shadow-sm ring-1 ring-zinc-200", isBefore ? "p-3" : "p-4")}>
      <div className={clsx("flex items-start gap-3", isBefore && "gap-2")}>
        <div className={clsx("rounded-xl bg-zinc-200", isBefore ? "h-14 w-16" : "h-16 w-20")} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className={clsx("truncate font-semibold text-zinc-900", isBefore ? "text-sm" : "text-base")}>
              ¥128,000 / 月
            </div>
            <span className={clsx("text-zinc-500", isBefore ? "text-[10px]" : "text-[11px]")}>
              2LDK / 45㎡
            </span>
          </div>
          <div className={clsx("mt-1 truncate text-zinc-600", isBefore ? "text-[10px]" : "text-xs")}>
            東京都 渋谷区（徒歩7分）
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Chip tone={tone} active={!isBefore}>新着</Chip>
            <Chip tone={tone}>築10年</Chip>
            {isBefore && (
              <>
                <Chip tone={tone}>ペット可</Chip>
                <Chip tone={tone}>南向き</Chip>
                <Chip tone={tone}>角部屋</Chip>
                <Chip tone={tone}>ネット無料</Chip>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={clsx("mt-3 flex items-center justify-between", isBefore && "mt-2")}>
        <button
          className={clsx(
            "rounded-full px-3 py-1.5 text-xs font-medium",
            isBefore ? "bg-white text-blue-700 ring-1 ring-blue-200" : "bg-emerald-700 text-white"
          )}
        >
          地図で見る
        </button>

        <div className="flex items-center gap-2 text-zinc-500">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100">♡</span>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100">↗</span>
          {isBefore && (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100">⋯</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ListScreen({
  tone,
  showHighlights,
}: {
  tone: "before" | "after";
  showHighlights: boolean;
}) {
  const isBefore = tone === "before";
  return (
    <>
      <TopArea tone={tone} dense={isBefore} showHighlights={showHighlights} />
      <div className="space-y-3">
        <div className="relative">
          <Promo tone={tone} />
          <Highlight
            show={showHighlights && isBefore}
            color="amber"
            label="情報も導線も詰まりがち"
            className="inset-[-4px]"
          />
          <Highlight
            show={showHighlights && !isBefore}
            color="emerald"
            label="CTAは目立つが邪魔しない"
            className="inset-[-4px]"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className={clsx("font-semibold text-zinc-900", isBefore ? "text-sm" : "text-base")}>
            おすすめ物件
          </div>
          <button className="text-xs text-zinc-500 hover:text-zinc-700">すべて見る</button>
        </div>

        {isBefore ? (
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <ListingCard tone="before" />
              <div className="pointer-events-none absolute right-2 top-2 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                人気
              </div>
            </div>
            <div className="relative">
              <ListingCard tone="before" />
              <div className="pointer-events-none absolute right-2 top-2 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                新着
              </div>
            </div>
          </div>
        ) : (
          <div className="relative">
            <ListingCard tone="after" />
            <Highlight
              show={showHighlights}
              color="emerald"
              label="読み順が自然（写真→価格→立地→条件）"
              className="inset-[-4px]"
            />
          </div>
        )}

        {tone === "after" && (
          <div className="flex items-center justify-between rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200">
            <div className="text-xs text-zinc-600">地図でざっくり見たい？</div>
            <button className="rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white">
              地図で見る →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function DetailScreen({
  tone,
  showHighlights,
}: {
  tone: "before" | "after";
  showHighlights: boolean;
}) {
  const isBefore = tone === "before";
  return (
    <>
      <TopArea tone={tone} dense={isBefore} showHighlights={showHighlights} />

      <div className="space-y-3">
        <div className={clsx("rounded-2xl bg-zinc-200", isBefore ? "p-7" : "p-10")} />

        <div className="space-y-2">
          <div className={clsx("font-semibold text-zinc-900", isBefore ? "text-base" : "text-lg")}>
            代々木の明るい2LDK
          </div>

          <div className={clsx("text-zinc-600", isBefore ? "text-xs" : "text-sm")}>
            {isBefore
              ? "駅近・日当たり・設備などの情報が同じ強さで並び、読むべき順が分かりにくい。"
              : "価格・立地・条件の順に、読みやすいまとまりで提示。"}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Chip tone={tone} active={!isBefore}>敷金0</Chip>
            <Chip tone={tone}>オートロック</Chip>
            {isBefore && (
              <>
                <Chip tone={tone}>宅配ボックス</Chip>
                <Chip tone={tone}>角部屋</Chip>
                <Chip tone={tone}>南向き</Chip>
              </>
            )}
          </div>

          <div className="relative">
            <div
              className={clsx(
                "mt-2 rounded-2xl p-4 ring-1",
                isBefore ? "bg-blue-50 ring-blue-100" : "bg-emerald-50 ring-emerald-100"
              )}
            >
              <div className="text-sm font-semibold text-zinc-900">
                {isBefore ? "問い合わせ / 内見 / 保存" : "内見予約"}
              </div>
              <div className="mt-1 text-xs text-zinc-600">
                {isBefore ? "主要アクションが並列で迷う" : "主要CTAは一箇所に集約"}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <PillButton tone={tone} variant="primary">日程を選ぶ</PillButton>
                <PillButton tone={tone} variant={isBefore ? "primary" : "neutral"}>問い合わせ</PillButton>
                {isBefore && <PillButton tone={tone} variant="primary">保存</PillButton>}
              </div>
            </div>

            <Highlight
              show={showHighlights && isBefore}
              color="amber"
              label="主要CTAが分散"
              className="inset-[-4px]"
            />
            <Highlight
              show={showHighlights && !isBefore}
              color="emerald"
              label="主要CTAを集約"
              className="inset-[-4px]"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function FilterScreen({
  tone,
  showHighlights,
}: {
  tone: "before" | "after";
  showHighlights: boolean;
}) {
  const isBefore = tone === "before";
  const dense = isBefore;

  return (
    <>
      <TopArea tone={tone} dense={dense} showHighlights={showHighlights} />
      <div className="space-y-3">
        <div className="text-sm font-semibold text-zinc-900">絞り込み</div>

        <div className={clsx("space-y-2", dense && "space-y-1.5")}>
          {[
            { label: "賃料", value: "〜 ¥150,000" },
            { label: "間取り", value: "1LDK / 2LDK" },
            { label: "駅徒歩", value: "10分以内" },
          ].map((row) => (
            <div
              key={row.label}
              className={clsx(
                "flex items-center justify-between rounded-2xl bg-white ring-1 ring-zinc-200",
                dense ? "px-3 py-2" : "px-4 py-3"
              )}
            >
              <span className="text-xs text-zinc-600">{row.label}</span>
              <span className="text-xs font-medium text-zinc-900">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="relative rounded-2xl bg-white p-3 ring-1 ring-zinc-200">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-600">こだわり条件</span>
            <span className="text-[11px] text-zinc-500">複数選択</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Chip tone={tone} active={!isBefore}>ペット可</Chip>
            <Chip tone={tone}>角部屋</Chip>
            <Chip tone={tone}>宅配ボックス</Chip>
            {isBefore && (
              <>
                <Chip tone={tone}>南向き</Chip>
                <Chip tone={tone}>ネット無料</Chip>
                <Chip tone={tone}>即入居</Chip>
              </>
            )}
          </div>

          <Highlight
            show={showHighlights && isBefore}
            color="amber"
            label="条件が増えて見づらい"
            className="inset-[-4px]"
          />
          <Highlight
            show={showHighlights && !isBefore}
            color="emerald"
            label="必要十分に整理"
            className="inset-[-4px]"
          />
        </div>

        <div className="relative flex items-center gap-2">
          <PillButton tone={tone} variant="neutral">リセット</PillButton>

          <button
            className={clsx(
              "ml-auto flex-1 rounded-full px-4 py-2 text-xs font-semibold",
              isBefore ? "bg-blue-600 text-white" : "bg-emerald-700 text-white"
            )}
          >
            条件を適用（24件）
          </button>

          {isBefore && (
            <button className="rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
              保存
            </button>
          )}

          <Highlight
            show={showHighlights && isBefore}
            color="amber"
            label="完了導線が散る"
            className="inset-[-4px]"
          />
          <Highlight
            show={showHighlights && !isBefore}
            color="emerald"
            label="完了導線が一発"
            className="inset-[-4px]"
          />
        </div>
      </div>
    </>
  );
}

function Screen({
  tone,
  view,
  showHighlights,
}: {
  tone: "before" | "after";
  view: ViewId;
  showHighlights: boolean;
}) {
  if (view === "detail") return <DetailScreen tone={tone} showHighlights={showHighlights} />;
  if (view === "filter") return <FilterScreen tone={tone} showHighlights={showHighlights} />;
  return <ListScreen tone={tone} showHighlights={showHighlights} />;
}

export function BeforeAfterMiniUI({ initialView = "list" }: { initialView?: ViewId }) {
  const [view, setView] = React.useState<ViewId>(initialView);

  // ✅ 初期状態はOFF（乱れた印象を避ける）
  const [showDiff, setShowDiff] = React.useState(false);

  return (
    <div className="not-prose">
      <div className="rounded-3xl bg-zinc-50 p-5 ring-1 ring-zinc-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-zinc-900">Before / After をミニUIで比較</div>
            <div className="mt-1 text-xs text-zinc-600">
              差分は“枠線のみ”で強調（UIが潰れません）。必要なときだけONにできます。
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDiff((v) => !v)}
              className={clsx(
                "rounded-full px-3 py-1.5 text-xs font-semibold ring-1 motion-safe:transition",
                showDiff
                  ? "bg-amber-100 text-amber-900 ring-amber-200"
                  : "bg-white text-zinc-700 ring-zinc-200 hover:bg-zinc-100"
              )}
              aria-pressed={showDiff}
              title="差分を強調"
            >
              差分を強調 {showDiff ? "ON" : "OFF"}
            </button>

            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                className={clsx(
                  "rounded-full px-3 py-1.5 text-xs font-medium ring-1 motion-safe:transition",
                  view === v.id
                    ? "bg-zinc-900 text-white ring-zinc-900"
                    : "bg-white text-zinc-700 ring-zinc-200 hover:bg-zinc-100"
                )}
                aria-pressed={view === v.id}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 text-xs text-zinc-600">{VIEWS.find((v) => v.id === view)?.caption}</div>

        <div className="mt-5 grid gap-6 lg:grid-cols-2">
          <PhoneFrame title="情報が詰まって見える / 行動が散る" tone="before">
            <Screen tone="before" view={view} showHighlights={showDiff} />
          </PhoneFrame>

          <PhoneFrame title="余白・階層・導線が整う" tone="after">
            <Screen tone="after" view={view} showHighlights={showDiff} />
          </PhoneFrame>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { title: "① 階層", text: "検索→カテゴリ→絞り込みの順で、次の行動が自然に。" },
            { title: "② 状態", text: "選択中/未選択/適用中の違いが一目で分かる。" },
            { title: "③ 主要CTA", text: "重要導線（地図・適用）を固定して迷いを減らす。" },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
              <div className="text-xs font-semibold text-zinc-900">{c.title}</div>
              <div className="mt-1 text-xs text-zinc-600">{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

