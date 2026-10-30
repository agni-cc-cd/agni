import { marked } from "marked";

/** Render post markdown to HTML (server-side; no client JS needed). */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}
