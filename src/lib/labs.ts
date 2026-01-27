import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

export const LabCategorySchema = z.enum(["html", "css", "javascript"]);
export type LabCategory = z.infer<typeof LabCategorySchema>;

export const LabLevelSchema = z.enum(["beginner", "intermediate", "advanced"]);
export type LabLevel = z.infer<typeof LabLevelSchema>;

const DateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");

const LabLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

export const LabFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    date: DateSchema,
    summary: z.string().min(1),
    category: LabCategorySchema,
    level: LabLevelSchema,
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    links: z.array(LabLinkSchema).default([]),
  })
  // 将来frontmatterに項目を足しても壊れにくくする
  .passthrough();

export type LabFrontmatter = z.infer<typeof LabFrontmatterSchema>;

export type Lab = {
  slug: string;
  frontmatter: LabFrontmatter;
  content: string; // frontmatter除外後のMDX本文
  filePath: string;
};

export type LabListItem = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: LabCategory;
  level: LabLevel;
  tags: string[];
  draft: boolean;
  links: { label: string; url: string }[];
};

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function labsDir() {
  return path.join(process.cwd(), "content", "labs");
}

function slugFromFilename(filename: string) {
  return filename.replace(/\.mdx?$/i, "");
}

function zodErrorToMessage(err: z.ZodError) {
  return err.issues
    .map((i) => {
      const p = i.path.length ? i.path.join(".") : "(root)";
      return `- ${p}: ${i.message}`;
    })
    .join("\n");
}

async function readLabFile(filePath: string): Promise<Lab> {
  const raw = await fs.readFile(filePath, "utf8");
  const parsed = matter(raw);

  // gray-matterのdataは unknown として扱う（any禁止）
  const dataUnknown: unknown = parsed.data;

  const frontmatterResult = LabFrontmatterSchema.safeParse(dataUnknown);
  if (!frontmatterResult.success) {
    const rel = path.relative(process.cwd(), filePath);
    const details = zodErrorToMessage(frontmatterResult.error);
    throw new Error(`Invalid frontmatter in ${rel}\n${details}`);
  }

  const frontmatter = frontmatterResult.data;
  const slug = slugFromFilename(path.basename(filePath));

  return {
    slug,
    frontmatter,
    content: parsed.content,
    filePath,
  };
}

async function listLabFiles(): Promise<string[]> {
  const dir = labsDir();
  let entries: string[];

  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }

  return entries
    .filter((f) => /\.mdx?$/i.test(f))
    .map((f) => path.join(dir, f));
}

function toListItem(lab: Lab): LabListItem {
  return {
    slug: lab.slug,
    title: lab.frontmatter.title,
    date: lab.frontmatter.date,
    summary: lab.frontmatter.summary,
    category: lab.frontmatter.category as LabCategory,
    level: lab.frontmatter.level as LabLevel,
    tags: Array.isArray(lab.frontmatter.tags) ? lab.frontmatter.tags : [],
    draft: Boolean(lab.frontmatter.draft),
    links: Array.isArray(lab.frontmatter.links) ? lab.frontmatter.links : [],
  };
}

/**
 * 一覧用：本文は不要なのでListItemで返す
 */
export async function getAllLabs(): Promise<LabListItem[]> {
  const files = await listLabFiles();
  const labs = await Promise.all(files.map((fp) => readLabFile(fp)));

  const filtered = isProduction()
    ? labs.filter((l) => !l.frontmatter.draft)
    : labs;

  const items = filtered.map(toListItem);

  // 新しい順
  items.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return items;
}

/**
 * /labs/[slug] 用：本文込み
 */
export async function getLabBySlug(slug: string): Promise<Lab> {
  const dir = labsDir();
  const tryMdx = path.join(dir, `${slug}.mdx`);
  const tryMd = path.join(dir, `${slug}.md`);

  const exists = async (p: string) => {
    try {
      await fs.access(p);
      return true;
    } catch {
      return false;
    }
  };

  const filePath = (await exists(tryMdx)) ? tryMdx : (await exists(tryMd)) ? tryMd : null;
  if (!filePath) {
    throw new Error(`Lab not found: ${slug}`);
  }

  const lab = await readLabFile(filePath);

  // productionではdraft記事を隠す（ページ側でもnotFoundしてる前提だが、二重で安全に）
  if (isProduction() && lab.frontmatter.draft) {
    throw new Error(`Lab is draft in production: ${slug}`);
  }

  return lab;
}

/**
 * generateStaticParams 用：productionではdraftを含めない
 */
export async function getAllLabSlugs(): Promise<string[]> {
  const items = await getAllLabs();
  return items.map((i) => i.slug);
}

/**
 * 一覧でカテゴリ別に分けたい時用
 */
export async function getLabsGroupedByCategory(): Promise<Record<LabCategory, LabListItem[]>> {
  const all = await getAllLabs();
  const grouped: Record<LabCategory, LabListItem[]> = {
    html: [],
    css: [],
    javascript: [],
  };

  for (const item of all) {
    grouped[item.category].push(item);
  }

  // 各カテゴリ内も新しい順（getAllLabsで既にsort済みだが念のため）
  for (const k of Object.keys(grouped) as LabCategory[]) {
    grouped[k].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }

  return grouped;
}

