import type { StudioData } from "../data.js";
import { pagePath } from "../paths.js";
import { indexPage } from "./index-page.js";
import { packPage } from "./pack-page.js";
import { specPage } from "./spec-page.js";
import { searchPage } from "./search-page.js";

export interface StudioPage {
  readonly path: string;
  readonly content: string;
}

export function renderStudio(data: StudioData): readonly StudioPage[] {
  return [
    { path: "index.html", content: indexPage({ data, path: "index.html" }) },
    { path: "search.html", content: searchPage({ data, path: "search.html" }) },
    ...data.packs.map(({ context, totals }) => {
      const path = pagePath(context.id);
      if (path === null) throw new Error(`Pack has no Studio path: ${context.id}`);
      return { path, content: packPage({ data, path }, context, totals) };
    }),
    ...data.specs.map((spec) => {
      const path = pagePath(spec.id);
      if (path === null) throw new Error(`Spec has no Studio path: ${spec.id}`);
      return { path, content: specPage({ data, path }, spec) };
    }),
  ];
}
