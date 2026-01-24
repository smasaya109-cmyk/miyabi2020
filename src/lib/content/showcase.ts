import { listSlugs, readMdx, sortByDateDesc, type ContentItem, type ContentItemWithBody } from "@/lib/content/_fs";
import { baseFrontmatterSchema, type BaseFrontmatter } from "@/lib/content/schemas";

const DIR = "showcase";

export type Showcase = ContentItem<BaseFrontmatter>;
export type ShowcaseWithBody = ContentItemWithBody<BaseFrontmatter>;

type Options = {
  includeDrafts?: boolean;
};

export async function getAllShowcase(options: Options = {}): Promise<Showcase[]> {
  const includeDrafts = options.includeDrafts ?? process.env.NODE_ENV !== "production";

  const slugs = await listSlugs(DIR);
  const items = await Promise.all(slugs.map((slug) => readMdx(DIR, slug, baseFrontmatterSchema)));

  const filtered = items.filter((p) => includeDrafts || !p.draft);

  return sortByDateDesc(filtered).map((item) => {
    const { body, ...rest } = item;
    void body;
    return rest;
  });
}

export async function getShowcaseBySlug(
  slug: string,
  options: Options = {}
): Promise<ShowcaseWithBody | null> {
  const includeDrafts = options.includeDrafts ?? process.env.NODE_ENV !== "production";
  try {
    const item = await readMdx(DIR, slug, baseFrontmatterSchema);
    if (!includeDrafts && item.draft) return null;
    return item;
  } catch {
    return null;
  }
}
