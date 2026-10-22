import { expect, it, vi } from "vitest";

vi.mock("../src/cli/output.js", () => {
  throw new Error("the library evaluator must load without the CLI component");
});

it("loads and reports parse errors without the CLI component", async () => {
  const { compileBody } = await import("../src/reader/evaluate-body.js");
  expect(() => compileBody("return {")).toThrow("the body does not parse at line 1, column 9:");
});
