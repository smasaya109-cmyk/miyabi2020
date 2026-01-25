import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import type {
  ComponentPropsWithoutRef,
  ReactNode,
  ComponentType,
} from "react";

// Showcase用のミニUIコンポーネント
import { BeforeAfterMiniUI } from "@/components/showcase/BeforeAfterMiniUI";

// Playroom用のミニUIコンポーネント
import PillDockDemo from "@/components/playroom/PillDockDemo";
import OrbitingIconField from "@/components/playroom/OrbitingIconField";
import VoiceHoldTypeDemo from "@/components/playroom/VoiceHoldTypeDemo";




function isInternalHref(href: string) {
  return href.startsWith("/");
}

type AnchorProps = ComponentPropsWithoutRef<"a">;
type PreProps = ComponentPropsWithoutRef<"pre">;
type CodeProps = ComponentPropsWithoutRef<"code">;

type ExtraComponents = Record<string, ComponentType<Record<string, unknown>>>;

function cx(...v: Array<string | undefined>) {
  return v.filter(Boolean).join(" ");
}

export function MDX({
  source,
  components,
}: {
  source: string;
  components?: ExtraComponents;
}) {
  const baseComponents = {
    a: ({ href = "", children, className, ...rest }: AnchorProps) => {
      const h = typeof href === "string" ? href : "";
      const cls = cx("mdx-link", className);

      if (isInternalHref(h)) {
        return (
          <Link href={h} className={cls}>
            {children as ReactNode}
          </Link>
        );
      }

      return (
        <a
          href={h}
          className={cls}
          target="_blank"
          rel="noreferrer noopener"
          {...rest}
        >
          {children}
        </a>
      );
    },
    pre: ({ className, children, ...rest }: PreProps) => (
      <pre className={cx("mdx-pre", className)} {...rest}>
        {children}
      </pre>
    ),
    code: ({ className, children, ...rest }: CodeProps) => (
      <code className={cx("mdx-code", className)} {...rest}>
        {children}
      </code>
    ),

    // ✅ 追加：MDX内で <BeforeAfterMiniUI /> を使えるようにする
    BeforeAfterMiniUI,
    PillDockDemo,
    OrbitingIconField,
    VoiceHoldTypeDemo,
  };

  return (
    <article className="mdx">
      <MDXRemote
        source={source}
        components={{ ...baseComponents, ...components }}
      />
    </article>
  );
}

