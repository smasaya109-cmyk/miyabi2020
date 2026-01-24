import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const UpdateSchema = z.object({
  title: z.string().min(1),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  summary: z.string().min(1),
  type: z
    .enum(["release", "feature", "fix", "design", "content", "update"])
    .optional()
    .default("update"),
  draft: z.boolean().optional(),
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url(),
      })
    )
    .optional(),
});

export type UpdateItem = z.infer<typeof UpdateSchema> & {
  slug: string;
};

const UPDATES_DIR = path.join(process.cwd(), "src", "content", "updates");

function byDateDesc(a: UpdateItem, b: UpdateItem) {
  // YYYY-MM-DD なので文字列比較でもOKだが念のためDate
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export async function getAllUpdates(): Promise<UpdateItem[]> {
  let files: string[] = [];
  try {
    files = await fs.readdir(UPDATES_DIR);
  } catch {
    // ディレクトリが無い場合でも落とさない
    return [];
  }

  const mdxFiles = files.filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
  const isProd = process.env.NODE_ENV === "production";

  const items: UpdateItem[] = [];

  for (const file of mdxFiles) {
    const fullPath = path.join(UPDATES_DIR, file);
    const raw = await fs.readFile(fullPath, "utf8");
    const { data } = matter(raw);

    const parsed = UpdateSchema.safeParse(data);
    if (!parsed.success) {
      // ビルド時に気づけるようにthrow
      throw new Error(
        `[updates] Invalid frontmatter: ${file}\n${parsed.error.toString()}`
      );
    }

    const slug = file.replace(/\.mdx?$/, "");
    const item: UpdateItem = { slug, ...parsed.data };

    if (isProd && item.draft) continue;
    items.push(item);
  }

  return items.sort(byDateDesc);
}
