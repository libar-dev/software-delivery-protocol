import { readFileSync } from "node:fs";
import { renderStudio as render } from "../../src/projections/studio/pages/index.js";

export const renderStudio = (data: Parameters<typeof render>[0]) =>
  render(data, readFileSync(new URL("../../dist/studio/studio.css", import.meta.url), "utf8"));
