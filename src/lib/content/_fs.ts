import "server-only";

import path from "path";
import { promises as fs } from "fs";
import matter from "gray-matter";
import type { z } from "zod";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function toTime(date: string) {
  // YYYY-MM-DD を UTC で解釈（ソート用）
  return new Date(`${date}T00:00:00Z`).getTime();
}

export type ContentItem<TFrontmatter> = TFrontmatter & {
  slug: string;
  _path: string;
  _time: number;
};

export type ContentItemWithBody<TFrontmatter> = ContentItem<TFrontmatter> & {
  body: string;
};

export async function listSlugs(dirName: string) {
  const dirPath = path.join(CONTENT_ROOT, dirName);
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".mdx"))
    .map((e) => e.name.replace(/\.mdx$/, ""));
}

function getDateOrThrow(
  fm: Record<string, unknown>,
  filePath: string
): string {
  const d = fm["date"];
  if (typeof d !== "string") {
    throw new Error(
      `Invalid frontmatter in ${filePath}\n` +
        `date: expected string (YYYY-MM-DD)`
    );
  }
  return d;
}

export async function readMdx<
  TSchema extends z.ZodObject<z.ZodRawShape>
>(
  dirName: string,
  slug: string,
  schema: TSchema
): Promise<ContentItemWithBody<z.infer<TSchema>>> {
  const filePath = path.join(CONTENT_ROOT, dirName, `${slug}.mdx`);

  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    throw new Error(`MDX not found: ${filePath}`);
  }

  const parsed = matter(raw);

  const result = schema.safeParse(parsed.data);
  if (!result.success) {
    const message = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid frontmatter in ${filePath}\n${message}`);
  }

  const fm = result.data; // z.infer<TSchema>

  // date は必須（ソート用）。型安全に取り出す
  const date = getDateOrThrow(fm as Record<string, unknown>, filePath);

  return {
    ...fm,
    slug,
    body: parsed.content,
    _path: filePath,
    _time: toTime(date),
  };
}

export function sortByDateDesc<T extends { _time: number }>(items: T[]) {
  return [...items].sort((a, b) => b._time - a._time);
}
