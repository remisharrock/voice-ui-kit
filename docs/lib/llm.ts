import type { InferPageType } from "fumadocs-core/source";
import path from "path";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import { source } from "./source";

const processor = remark().use(remarkMdx).use(remarkGfm);

function deriveCategoryFromPath(filePath: string): string | undefined {
  if (!filePath) return undefined;

  const normalizedPath = path.normalize(filePath);
  const pathParts = normalizedPath.split(path.sep);

  for (let i = 0; i < pathParts.length - 1; i++) {
    if (pathParts[i] === "content" && pathParts[i + 1] === "docs") {
      // If there's no subdirectory after content/docs, it's a root page
      if (i + 2 >= pathParts.length) {
        return "docs";
      }
      // If the next part is a file (has extension), it's also a root page
      if (pathParts[i + 2].includes(".")) {
        return "docs";
      }
      // Otherwise, it's a subdirectory page
      return pathParts[i + 2];
    }
  }

  return undefined;
}

export async function getLLMSummary(page: InferPageType<typeof source>) {
  const category = deriveCategoryFromPath(page.data._file?.absolutePath || "");

  const metadata = [
    `# ${page.data.title}`,
    `URL: ${page.url}`,
    page.data.description && `Description: ${page.data.description}`,
    page.data.componentName && `Component: ${page.data.componentName}`,
    page.data.componentImport &&
      `Component Import: ${page.data.componentImport}`,
    category && `Category: ${category}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `${metadata}\n`;
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await processor.process({
    path: page.data._file?.absolutePath || page.url,
    value: page.data.content,
  });

  const metadata = [
    `# ${page.data.title}`,
    `URL: ${page.url}`,
    page.data.description && `Description: ${page.data.description}`,
    page.data.componentName && `Component: ${page.data.componentName}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `${metadata}\n\n${processed.value}`;
}
