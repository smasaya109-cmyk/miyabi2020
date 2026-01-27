import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const UPDATES_DIR = path.join(process.cwd(), "src", "content", "updates");

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function isValidDateYYYYMMDD(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

/**
 * Updatesの links.url は「絶対URL」だけでなく、
 * サイト内リンク（/labs など）も使いたいので許可する。
 */
function isValidLinkUrl(value: string) {
  // internal
  if (value.startsWith("/")) return true;
  if (value.startsWith("#")) return true;

  // external
  if (/^https?:\/\//i.test(value)) return true;

  // app links
  if (/^(mailto:|tel:)/i.test(value)) return true;

  return false;
}

const UpdateLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().refine(isValidLinkUrl, { message: "Invalid URL" }),
});

/**
 * ✅ type を復活
 * UpdatesTimeline 側で `u.type` を参照して ICONS[u.type] を引くため必須。
 * 既存の type キー（例：note / release / ...）を壊さないため enum で縛らず string にする。
 * そして、過去/新規で type が無い記事も落ちないように default を付ける。
 */
const UpdateFrontmatterSchema = z.object({
  title: z.string().min(1),
  type: z.string().min(1).optional().default("note"),
  date: z.string().refine(isValidDateYYYYMMDD, { message: "Invalid date format" }),
  summary: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  draft: z.boolean().optional().default(false),
  links: z.array(UpdateLinkSchema).optional().default([]),
});

export type UpdateFrontmatter = z.infer<typeof UpdateFrontmatterSchema>;

export type UpdateItem = UpdateFrontmatter & {
  slug: string;
};

function getMdxFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort((a, b) => a.localeCompare(b));
}

function toSlug(filename: string) {
  return filename.replace(/\.mdx$/, "");
}

function compareByDateDesc(a: UpdateItem, b: UpdateItem) {
  const ta = new Date(a.date).getTime();
  const tb = new Date(b.date).getTime();
  return tb - ta;
}

export function getAllUpdates(): UpdateItem[] {
  const files = getMdxFiles(UPDATES_DIR);

  const items: UpdateItem[] = files.map((file) => {
    const fullPath = path.join(UPDATES_DIR, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(raw);

    const parsed = UpdateFrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      // ビルド/実行時に気づけるようにthrow
      throw new Error(`[updates] Invalid frontmatter: ${file}\n${parsed.error.toString()}`);
    }

    return {
      slug: toSlug(file),
      ...parsed.data,
    };
  });

  const filtered = isProduction() ? items.filter((x) => !x.draft) : items;

  return filtered.sort(compareByDateDesc);
}

export function getAllUpdateSlugs(): string[] {
  return getAllUpdates().map((x) => x.slug);
}

export function getUpdateBySlug(slug: string) {
  const file = `${slug}.mdx`;
  const fullPath = path.join(UPDATES_DIR, file);

  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  const parsed = UpdateFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`[updates] Invalid frontmatter: ${file}\n${parsed.error.toString()}`);
  }

  const item: UpdateItem = { slug, ...parsed.data };

  if (isProduction() && item.draft) return null;

  return {
    meta: item,
    content,
  };
}
