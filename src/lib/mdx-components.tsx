import Link from "next/link";
import GithubSlugger from "github-slugger";
import { type ComponentProps, type ReactNode, isValidElement } from "react";

type AnchorProps = ComponentProps<"a">;

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

function isInternalHref(href: AnchorProps["href"]) {
  return typeof href === "string" && (href.startsWith("/") || href.startsWith("#"));
}

function getNodeText(node: ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getNodeText).join("");

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getNodeText(node.props.children ?? "");
  }

  return "";
}

/**
 * HTML断片が「画面に何か表示する可能性があるか」をざっくり判定。
 * - meta/title/link だけだとプレビューは白紙になりやすいので省略する
 * - body や見出し/段落/ボックスなどがあればプレビュー対象
 */
function hasVisualHtml(code: string): boolean {
  const s = code.toLowerCase();

  if (/<body\b/.test(s)) return true;

  return /<(h1|h2|h3|p|div|main|section|article|header|footer|nav|aside|a|button|ul|ol|li|img|figure|figcaption|table|form|input|textarea|select|label|pre|code|span|strong|em)\b/.test(
    s
  );
}

function injectCssIntoHtmlDocument(doc: string, css: string) {
  const safeCss = css.trim();
  if (!safeCss) return doc;

  const styleTag = `<style>\n${safeCss}\n</style>`;

  // 1) <head> があるなら </head> の直前に挿入
  if (/<\/head>/i.test(doc)) {
    return doc.replace(/<\/head>/i, `${styleTag}\n</head>`);
  }

  // 2) <html> はあるが <head> がないケース：最低限のheadを作って挿入
  if (/<html[\s>]/i.test(doc)) {
    return doc.replace(/<html([^>]*)>/i, (m) => {
      return `${m}
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${styleTag}
  </head>`;
    });
  }

  // 3) それ以外は先頭にstyleを付ける（断片想定）
  return `${styleTag}\n${doc}`;
}

function wrapHtmlForPreview(code: string, css?: string) {
  const raw = code.trim();

  const hasDoc =
    /<!doctype/i.test(raw) || /<html[\s>]/i.test(raw) || /<head[\s>]/i.test(raw);

  if (hasDoc) {
    return css ? injectCssIntoHtmlDocument(raw, css) : raw;
  }

  const extraCss = (css ?? "").trim();

  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: light; }
      body {
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji";
        padding: 12px;
        line-height: 1.6;
        font-size: 14px;
        color: #111827;
      }
      a {
        color: inherit;
        text-decoration: underline;
        text-underline-offset: 4px;
      }
      a:hover { opacity: .8; }
      img { max-width: 100%; height: auto; display: block; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }

      /* --- demo css --- */
${extraCss ? "\n" + extraCss + "\n" : ""}
    </style>
  </head>
  <body>
${raw}
  </body>
</html>`;
}

function extractCodeInfoFromPre(children: ReactNode) {
  const child = Array.isArray(children) ? children[0] : children;

  if (
    !isValidElement<{
      className?: string;
      children?: ReactNode;
    }>(child)
  ) {
    return { code: null as string | null, language: null as string | null };
  }

  const className = typeof child.props.className === "string" ? child.props.className : "";
  const m = /language-([a-z0-9-]+)/i.exec(className);
  const language = m?.[1]?.toLowerCase() ?? null;

  const codeChildren = child.props.children;
  let code = "";

  if (typeof codeChildren === "string") {
    code = codeChildren;
  } else if (Array.isArray(codeChildren)) {
    code = codeChildren.map((x) => (x == null ? "" : String(x))).join("");
  } else if (codeChildren != null) {
    code = String(codeChildren);
  }

  return { code, language };
}

function prettyLang(lang: string | null) {
  if (!lang) return "CODE";
  if (lang === "js") return "JavaScript";
  if (lang === "ts") return "TypeScript";
  if (lang === "tsx") return "TSX";
  if (lang === "jsx") return "JSX";
  return lang.toUpperCase();
}

/**
 * ノート＋ペン（書いている）っぽいアイコン
 * - ボックス背景は付けない（アイコンのみ）
 */
function NotebookPenIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("h-8 w-8", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* notebook */}
      <path d="M6.5 3.5H16a2.5 2.5 0 0 1 2.5 2.5v12A2.5 2.5 0 0 1 16 20.5H6.5A2.5 2.5 0 0 1 4 18V6A2.5 2.5 0 0 1 6.5 3.5Z" />
      <path d="M7.5 7.5H14.5" />
      <path d="M7.5 10.5H14.5" />
      <path d="M7.5 13.5H12.5" />
      {/* small writing line */}
      <path d="M7.5 16.5H11" />

      {/* pen */}
      <path d="M13.7 18.3 18.7 13.3" />
      <path d="M18.1 12.7 19.6 14.2" />
      <path d="M13.3 19.6 14.1 17.9 15.8 18.7 14.1 19.5Z" />
    </svg>
  );
}

export function createMdxComponents() {
  const slugger = new GithubSlugger();

  // Labs全体で「h2の2個目以降だけ divider」
  let h2Count = 0;

  return {
    h1: (props: ComponentProps<"h1">) => {
      const text = getNodeText(props.children);
      const id = props.id ?? slugger.slug(text);

      return (
        <h1
          {...props}
          id={id}
          className={cn(
            "mt-10 scroll-mt-24 text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 first:mt-0",
            props.className
          )}
        >
          {props.children}
        </h1>
      );
    },

    h2: (props: ComponentProps<"h2">) => {
      h2Count += 1;
      const withDivider = h2Count > 1;

      const text = getNodeText(props.children);
      const id = props.id ?? slugger.slug(text);

      return (
        <h2
          {...props}
          id={id}
          className={cn(
            "scroll-mt-24 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100",
            withDivider
              ? "mt-20 border-t border-neutral-200 pt-24 dark:border-neutral-800"
              : "mt-12",
            props.className
          )}
        >
          {withDivider ? (
            <div className="-mt-8 mb-7 flex justify-center">
              <NotebookPenIcon className="text-neutral-400 dark:text-neutral-500" />
            </div>
          ) : null}

          <span className="inline-flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 text-sm text-neutral-700 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
              title="Section"
            >
              ✦
            </span>
            <span>{props.children}</span>
          </span>
        </h2>
      );
    },

    h3: (props: ComponentProps<"h3">) => {
      const text = getNodeText(props.children);
      const id = props.id ?? slugger.slug(text);

      return (
        <h3
          {...props}
          id={id}
          className={cn(
            "mt-10 scroll-mt-24 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 first:mt-0",
            props.className
          )}
        >
          {props.children}
        </h3>
      );
    },

    p: (props: ComponentProps<"p">) => (
      <p
        {...props}
        className={cn(
          "mt-4 text-[15px] leading-7 text-neutral-800 dark:text-neutral-200",
          props.className
        )}
      />
    ),

    strong: (props: ComponentProps<"strong">) => (
      <strong
        {...props}
        className={cn("font-semibold text-neutral-950 dark:text-neutral-50", props.className)}
      />
    ),

    a: ({ href, children, className, ...rest }: AnchorProps) => {
      const base =
        "font-medium underline underline-offset-4 decoration-neutral-300 hover:opacity-80 dark:decoration-neutral-700 break-words";
      if (isInternalHref(href)) {
        return (
          <Link href={href as string} className={cn(base, className)}>
            {children as ReactNode}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={cn(base, className)}
          {...rest}
        >
          {children}
        </a>
      );
    },

    ul: (props: ComponentProps<"ul">) => (
      <ul
        {...props}
        className={cn(
          "mt-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-neutral-800 dark:text-neutral-200",
          props.className
        )}
      />
    ),

    ol: (props: ComponentProps<"ol">) => (
      <ol
        {...props}
        className={cn(
          "mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-7 text-neutral-800 dark:text-neutral-200",
          props.className
        )}
      />
    ),

    li: (props: ComponentProps<"li">) => (
      <li
        {...props}
        className={cn(
          "text-[15px] leading-7 marker:text-neutral-400 dark:marker:text-neutral-500 break-words",
          props.className
        )}
      />
    ),

    blockquote: (props: ComponentProps<"blockquote">) => (
      <blockquote
        {...props}
        className={cn(
          "mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-[15px] leading-7 text-neutral-800 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200",
          props.className
        )}
      />
    ),

    img: ({ alt, ...rest }: ComponentProps<"img">) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...rest}
        alt={alt ?? ""}
        className={cn(
          "my-6 h-auto w-full max-w-full rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950",
          rest.className
        )}
      />
    ),

    table: (props: ComponentProps<"table">) => (
      <div className="mt-6 w-full max-w-full overflow-x-auto">
        <table {...props} className={cn("w-full border-collapse text-sm", props.className)} />
      </div>
    ),

    th: (props: ComponentProps<"th">) => (
      <th
        {...props}
        className={cn(
          "border border-neutral-200 bg-neutral-50 px-3 py-2 text-left font-semibold text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100",
          props.className
        )}
      />
    ),

    td: (props: ComponentProps<"td">) => (
      <td
        {...props}
        className={cn(
          "border border-neutral-200 px-3 py-2 text-neutral-800 dark:border-neutral-800 dark:text-neutral-200",
          props.className
        )}
      />
    ),

    // MDXの `---` は「線」ではなく「スペース」だけにする（divider二重回避）
    hr: () => <div aria-hidden className="my-10 md:my-12 pt-20" />,

    /**
     * ✅ 追加：HTML+CSSを渡すと、CSS込みでプレビューできるコンポーネント
     * 量産の「HTML+CSSセット」をこの形に寄せるのが一番ラク。
     */
    HtmlCssDemo: ({
      title,
      html,
      css,
      height,
    }: {
      title?: string;
      html: string;
      css: string;
      height?: number;
    }) => {
      const h = typeof height === "number" ? height : 176;
      const previewAvailable = hasVisualHtml(html);
      const srcDoc = previewAvailable ? wrapHtmlForPreview(html, css) : null;

      const CodeCard = ({
        label,
        code,
      }: {
        label: string;
        code: string;
      }) => {
        return (
          <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 shadow-sm dark:border-neutral-800">
            <div className="flex items-center justify-between border-b border-neutral-800/60 px-3 py-2">
              <span className="text-xs font-medium text-neutral-200">{label}</span>
              <span className="text-xs text-neutral-400">Code</span>
            </div>
            <pre className="w-full max-w-full overflow-x-auto p-4 text-sm leading-6 text-neutral-50">
              <code className="font-mono text-sm text-neutral-50">{code}</code>
            </pre>
          </div>
        );
      };

      return (
        <div className="mt-6 w-full min-w-0 max-w-full">
          {title ? (
            <p className="mb-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {title}
            </p>
          ) : null}

          <div className="hidden w-full min-w-0 max-w-full gap-4 md:grid md:grid-cols-2">
            <div className="grid min-w-0 gap-3">
              <CodeCard label="HTML" code={html} />
              <CodeCard label="CSS" code={css} />
            </div>

            <div className="min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200">
                  Preview
                </span>
                <span className="text-xs text-neutral-400">desktop</span>
              </div>

              {previewAvailable ? (
                <iframe
                  title="demo"
                  sandbox="allow-scripts"
                  srcDoc={srcDoc ?? ""}
                  className="w-full bg-white"
                  style={{ height: h }}
                />
              ) : (
                <div className="p-3 text-xs text-neutral-500 dark:text-neutral-400">
                  ※ 表示要素がないためプレビューは省略しました。
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <div className="grid gap-3">
              <CodeCard label="HTML" code={html} />
              <CodeCard label="CSS" code={css} />
            </div>

            {previewAvailable ? (
              <details className="mt-3 w-full max-w-full rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                <summary className="cursor-pointer select-none text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  Preview を表示
                </summary>
                <div className="mt-3 w-full max-w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <iframe
                    title="demo"
                    sandbox="allow-scripts"
                    srcDoc={srcDoc ?? ""}
                    className="w-full bg-white"
                    style={{ height: h }}
                  />
                </div>
              </details>
            ) : null}
          </div>
        </div>
      );
    },

    pre: (props: ComponentProps<"pre">) => {
      const { code, language } = extractCodeInfoFromPre(props.children);

      if (!code) {
        return (
          <pre
            {...props}
            className={cn(
              "mt-6 w-full max-w-full overflow-x-auto rounded-2xl border border-neutral-200 bg-neutral-950 p-4 text-sm leading-6 text-neutral-50 shadow-sm dark:border-neutral-800",
              props.className
            )}
          />
        );
      }

      const langLabel = prettyLang(language);
      const isHtml = language === "html";

      const previewAvailable = isHtml && hasVisualHtml(code);
      const srcDoc = previewAvailable ? wrapHtmlForPreview(code) : null;

      const CodeCard = (
        <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 shadow-sm dark:border-neutral-800">
          <div className="flex items-center justify-between border-b border-neutral-800/60 px-3 py-2">
            <span className="text-xs font-medium text-neutral-200">{langLabel}</span>
            <span className="text-xs text-neutral-400">Code</span>
          </div>
          <pre className="w-full max-w-full overflow-x-auto p-4 text-sm leading-6 text-neutral-50">
            <code className="font-mono text-sm text-neutral-50">{code}</code>
          </pre>
        </div>
      );

      if (!isHtml) {
        return <div className="mt-6 w-full min-w-0 max-w-full">{CodeCard}</div>;
      }

      if (!previewAvailable) {
        return (
          <div className="mt-6 w-full min-w-0 max-w-full">
            {CodeCard}
            <p className="mt-2 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
              ※ このHTML断片は <code className="font-mono">meta</code> /{" "}
              <code className="font-mono">title</code> など表示要素がないため、プレビューは省略しました。
            </p>
          </div>
        );
      }

      return (
        <div className="mt-6 w-full min-w-0 max-w-full">
          <div className="hidden w-full min-w-0 max-w-full gap-4 md:grid md:grid-cols-2">
            <div className="min-w-0">{CodeCard}</div>

            <div className="min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200">
                  Preview
                </span>
                <span className="text-xs text-neutral-400">desktop</span>
              </div>
              <iframe
                title="demo"
                sandbox="allow-scripts"
                srcDoc={srcDoc ?? ""}
                className="h-44 w-full bg-white"
              />
            </div>
          </div>

          <div className="md:hidden">
            {CodeCard}
            <details className="mt-3 w-full max-w-full rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
              <summary className="cursor-pointer select-none text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Preview を表示
              </summary>
              <div className="mt-3 w-full max-w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
                <iframe
                  title="demo"
                  sandbox="allow-scripts"
                  srcDoc={srcDoc ?? ""}
                  className="h-44 w-full bg-white"
                />
              </div>
            </details>
          </div>
        </div>
      );
    },

    code: ({ className, ...props }: ComponentProps<"code">) => {
      const isBlock = typeof className === "string" && className.includes("language-");
      return (
        <code
          {...props}
          className={cn(
            "font-mono",
            isBlock
              ? "text-sm text-neutral-50"
              : "rounded-md bg-neutral-100 px-1 py-0.5 text-[0.9em] text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100 break-words",
            className
          )}
        />
      );
    },

    QAToggle: ({
      q,
      children,
      defaultOpen,
    }: {
      q: string;
      children: ReactNode;
      defaultOpen?: boolean;
    }) => {
      return (
        <details
          open={defaultOpen}
          className="mt-4 w-full max-w-full rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950"
        >
          <summary className="cursor-pointer select-none text-[15px] font-semibold leading-7 text-neutral-900 dark:text-neutral-100">
            {q}
          </summary>
          <div className="mt-3 text-[15px] leading-7 text-neutral-800 dark:text-neutral-200">
            {children}
          </div>
        </details>
      );
    },
  } as const;
}
