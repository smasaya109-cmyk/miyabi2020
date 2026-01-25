"use client";

import * as React from "react";

type ItemKey = "flag" | "chat" | "history";
type IconProps = { active?: boolean };

const items: { key: ItemKey; label: string; Icon: React.FC<IconProps> }[] = [
  {
    key: "flag",
    label: "Flag",
    Icon: ({ active }) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={active ? "opacity-100" : "opacity-80"}
      >
        <path d="M5 21V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M5 5h12l-2 4 2 4H5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "chat",
    label: "Chat",
    Icon: ({ active }) => (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={active ? "opacity-100" : "opacity-90"}
      >
        <path
          d="M7.5 17.5L4 20V6.5C4 5.12 5.12 4 6.5 4h11C19.88 4 21 5.12 21 6.5v7C21 14.88 19.88 16 18.5 16H9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "history",
    label: "History",
    Icon: ({ active }) => (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={active ? "opacity-100" : "opacity-80"}
      >
        <path
          d="M3 12a9 9 0 1 0 3-6.7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M3 4v5h5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 7v5l3 2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function PillDockDemo() {
  const [active, setActive] = React.useState<ItemKey>("chat");

  const activeIndex = React.useMemo(
    () => items.findIndex((i) => i.key === active),
    [active]
  );

  // 3スロット中央基準で移動：左=-1, 中=0, 右=+1
  const offsetPx = (activeIndex - 1) * 120;

  const fallback = items[0]!.Icon; // items は定数で空にならない前提
  const ActiveIcon = items[activeIndex]?.Icon ?? fallback;


  return (
    <section className="not-prose">
      <div className="rounded-2xl border border-black/5 bg-gradient-to-b from-[#f3efe9] to-[#efe8df] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.06)]">
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative h-[78px] w-[360px] rounded-full border border-white/60 bg-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur-md"
            role="tablist"
            aria-label="Pill dock"
          >
            {/* inner glow */}
            <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.06)]" />

            {/* クリック領域（3分割） */}
            <div className="absolute inset-0 grid grid-cols-3">
              {items.map(({ key, label, Icon }) => {
                const isActive = key === active;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={label}
                    onClick={() => setActive(key)}
                    className={cx(
                      "relative grid place-items-center",
                      "text-[#6b4a20]",
                      "transition",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a5a2c]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                      "active:scale-[0.99] motion-reduce:active:scale-100"
                    )}
                  >
                    {/* 下地アイコン：選択中は薄くして“主役が移動した感”を出す */}
                    <span
                      className={cx(
                        "transition-opacity duration-200 motion-reduce:transition-none",
                        isActive ? "opacity-0" : "opacity-80"
                      )}
                    >
                      <Icon active={!isActive} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* 盛り上がりボタン（これが左右に動く） */}
                <div
                className="pointer-events-none absolute left-1/2 top-1/2 transform-gpu will-change-transform
                            transition-[transform] duration-500
                            ease-[cubic-bezier(0.22,1.25,0.36,1)]
                            motion-reduce:transition-none"
                style={{
                    transform: `translate3d(-50%, -50%, 0) translate3d(${offsetPx}px, 0, 0)`,
                }}
                >

              <div
                className={cx(
                  "relative grid h-[74px] w-[74px] place-items-center rounded-[22px]",
                  "border border-white/70",
                  "bg-gradient-to-b from-[#fff8f0] to-[#efe3d6]",
                  "text-[#6b4a20]",
                  "shadow-[0_18px_40px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]"
                )}
              >
                {/* gold rim */}
                <div className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_0_0_2px_rgba(122,90,44,0.35)]" />
                <ActiveIcon active />
              </div>
            </div>
          </div>

          <div className="text-sm text-black/70">
            Selected:{" "}
            <span className="font-medium text-black/80">
              {items.find((i) => i.key === active)?.label}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
