import type { Finding } from "../validate/contracts.js";

export interface MarkdownFrontmatter {
  readonly data: Record<string, unknown>;
  readonly id: string;
  readonly line: number;
}

export type MarkdownFrontmatterResult =
  | {
      readonly ok: true;
      readonly frontmatter: MarkdownFrontmatter;
      readonly findings: readonly Finding[];
    }
  | { readonly ok: false; readonly findings: readonly Finding[] };

export interface MarkdownBody {
  readonly data: Record<string, unknown>;
}

export type MarkdownBodyResult =
  | { readonly ok: true; readonly body: MarkdownBody; readonly findings: readonly Finding[] }
  | { readonly ok: false; readonly findings: readonly Finding[] };
