import { runsPage } from "./runs-page.js";
import { architecturePage } from "./architecture-page.js";
import { testsPage } from "./tests-page.js";
import { evidencePage } from "./evidence-page.js";
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
    { path: "architecture.html", content: architecturePage({ data, path: "architecture.html" }) },
    { path: "tests.html", content: testsPage({ data, path: "tests.html" }) },
    { path: "evidence.html", content: evidencePage({ data, path: "evidence.html" }) },
    { path: "search.html", content: searchPage({ data, path: "search.html" }) },
    ...(data.recipes.all.has(45)
      ? [{ path: "runs.html", content: runsPage({ data, path: "runs.html" }) }]
      : []),
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
