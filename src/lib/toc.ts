import GithubSlugger from "github-slugger";

export type TocItem = {
  depth: 2 | 3;
  value: string;
  id: string;
};

function stripMarkdown(input: string): string {
  let s = input;

  // code
  s = s.replace(/`([^`]+)`/g, "$1");

  // images ![alt](url) -> alt
  s = s.replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");

  // links [text](url) -> text
  s = s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // emphasis **text** *text* __text__ _text_
  s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
  s = s.replace(/\*([^*]+)\*/g, "$1");
  s = s.replace(/__([^_]+)__/g, "$1");
  s = s.replace(/_([^_]+)_/g, "$1");

  // remove remaining markdown tokens (rough)
  s = s.replace(/[#>*_~]/g, "");

  return s.trim();
}

/**
 * MDX本文から H2 / H3 の目次を抽出
 * - H2: ## Heading
 * - H3: ### Heading
 */
export function getTocFromMdx(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  slugger.reset();

  const toc: TocItem[] = [];
  const lines = source.split(/\r?\n/);

  for (const line of lines) {
    // ## heading
    const h2 = line.match(/^##\s+(.+)\s*$/);
    if (h2) {
      const raw = h2?.[1];
      if (!raw) continue;

      const value = stripMarkdown(raw);
      if (!value) continue;

      const id = slugger.slug(value);
      toc.push({ depth: 2, value, id });
      continue;
    }

    // ### heading
    const h3 = line.match(/^###\s+(.+)\s*$/);
    if (h3) {
      const raw = h3?.[1];
      if (!raw) continue;

      const value = stripMarkdown(raw);
      if (!value) continue;

      const id = slugger.slug(value);
      toc.push({ depth: 3, value, id });
      continue;
    }
  }

  return toc;
}

