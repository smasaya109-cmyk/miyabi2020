import fs from "node:fs/promises";
import path from "node:path";

const VALID_CATEGORIES = new Set(["html", "css", "javascript"]);
const VALID_LEVELS = new Set(["beginner", "intermediate", "advanced"]);

function usage() {
  return `
Usage:
  node scripts/new-lab.mjs --category <html|css|javascript> --slug <slug> --title "<title>" [options]

Options:
  --level <beginner|intermediate|advanced>   default: beginner
  --summary "<summary>"                      default: ""
  --tags "tag1,tag2,tag3"                    default: ""
  --draft <true|false>                       default: true
  --link-label "<label>"                     default: ""
  --link-url "<url>"                         default: ""

Examples:
  node scripts/new-lab.mjs --category html --slug html-002-basic-tags --title "タグ入門"
  node scripts/new-lab.mjs --category css --slug css-001-what-is-css --title "CSSとは" --level beginner --draft true
`.trim();
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const val = argv[i + 1];
    if (!val || val.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = val;
      i += 1;
    }
  }
  return args;
}

function formatDateLocal(d) {
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function yamlString(str) {
  const s = String(str ?? "");
  const escaped = s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${escaped}"`;
}

function yamlStringArrayFromCSV(csv) {
  const raw = String(csv ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  if (raw.length === 0) return "[]";
  return `[${raw.map((t) => yamlString(t)).join(", ")}]`;
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const argv = process.argv.slice(2);

  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(usage());
    process.exit(0);
  }

  const args = parseArgs(argv);

  const category = args.category;
  const slugInput = args.slug;
  const title = args.title;

  if (!category || !slugInput || !title) {
    console.error("Missing required args.\n");
    console.error(usage());
    process.exit(1);
  }

  if (!VALID_CATEGORIES.has(category)) {
    console.error(`Invalid --category: ${category}`);
    console.error(`Valid: ${Array.from(VALID_CATEGORIES).join(", ")}`);
    process.exit(1);
  }

  const level = args.level ?? "beginner";
  if (!VALID_LEVELS.has(level)) {
    console.error(`Invalid --level: ${level}`);
    console.error(`Valid: ${Array.from(VALID_LEVELS).join(", ")}`);
    process.exit(1);
  }

  const summary = args.summary ?? "";
  const tags = args.tags ?? "";
  const draft = String(args.draft ?? "true") === "true";

  const linkLabel = args["link-label"] ?? "";
  const linkUrl = args["link-url"] ?? "";

  const slug = String(slugInput).replace(/\.mdx$/, "");
  const dir = path.join(process.cwd(), "content", "labs");
  const filePath = path.join(dir, `${slug}.mdx`);

  await fs.mkdir(dir, { recursive: true });

  if (await fileExists(filePath)) {
    console.error(`File already exists: ${filePath}`);
    process.exit(1);
  }

  const date = formatDateLocal(new Date());

  const linksYaml =
    linkLabel && linkUrl
      ? `links:\n  - label: ${yamlString(linkLabel)}\n    url: ${yamlString(linkUrl)}`
      : `links: []`;

  const template = `---
title: ${yamlString(title)}
date: ${yamlString(date)}
summary: ${yamlString(summary)}
category: ${yamlString(category)}
level: ${yamlString(level)}
tags: ${yamlStringArrayFromCSV(tags)}
draft: ${draft ? "true" : "false"}
${linksYaml}
---

## はじめに

ここに導入文。

## 例（HTMLならプレビューが自動で横に出ます）

~~~html
<h1>こんにちは</h1>
<p>これはデモです。</p>
<a href="https://example.com">リンク</a>
~~~

## 理解チェック

<QAToggle q="ここに質問1">
  ここに答え1
</QAToggle>

<QAToggle q="ここに質問2">
  ここに答え2
</QAToggle>
`;

  await fs.writeFile(filePath, template, "utf8");

  console.log(`Created: content/labs/${slug}.mdx`);
  console.log(`Tip: production では draft: true の記事は非表示になります。`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

