import { listSlugs, readMdx, sortByDateDesc, type ContentItem, type ContentItemWithBody } from "@/lib/content/_fs";
import { projectFrontmatterSchema, type ProjectFrontmatter } from "@/lib/content/schemas";

const DIR = "projects";

export type Project = ContentItem<ProjectFrontmatter>;
export type ProjectWithBody = ContentItemWithBody<ProjectFrontmatter>;

type Options = {
  includeDrafts?: boolean;
};

export async function getAllProjects(options: Options = {}): Promise<Project[]> {
  const includeDrafts = options.includeDrafts ?? process.env.NODE_ENV !== "production";

  const slugs = await listSlugs(DIR);
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const item = await readMdx(DIR, slug, projectFrontmatterSchema);
      return item;
    })
  );

  const filtered = items.filter((p) => includeDrafts || !p.draft);

  return sortByDateDesc(filtered).map((item) => {
    const { body, ...rest } = item;
    void body;
    return rest;
  });
}

export async function getProjectBySlug(
  slug: string,
  options: Options = {}
): Promise<ProjectWithBody | null> {
  const includeDrafts = options.includeDrafts ?? process.env.NODE_ENV !== "production";
  try {
    const item = await readMdx(DIR, slug, projectFrontmatterSchema);
    if (!includeDrafts && item.draft) return null;
    return item;
  } catch {
    return null;
  }
}
