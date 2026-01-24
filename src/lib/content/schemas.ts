import { z } from "zod";

export const isoDateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD");

export const linkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url()
});

export const baseFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: isoDateString,
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).default([]),
  links: z.array(linkSchema).optional(),
  thumbnail: z.string().optional(),
  draft: z.boolean().optional(),
  pinned: z.boolean().optional()
});

export const projectFrontmatterSchema = baseFrontmatterSchema.extend({
  status: z.enum(["ongoing", "completed"])
});

export type BaseFrontmatter = z.infer<typeof baseFrontmatterSchema>;
export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>;
