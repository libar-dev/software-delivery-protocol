import { expect, it, vi } from "vitest";

vi.mock("../src/cli/output.js", () => {
  throw new Error("the library evaluator must load without the CLI component");
});

it("loads and reports parse errors without the CLI component", async () => {
  const { compileBody } = await import("../src/reader/evaluate-body.js");
  expect(() => compileBody("return {")).toThrow("the body does not parse at line 1, column 9:");
});

it("places an error whose range runs past its line at that line's end without an inspector", async () => {
  const { compileBody } = await import("../src/reader/evaluate-body.js");
  // A build without an inspector, or a permission model that withholds it, refuses the module.
  const withheld = vi.spyOn(process, "getBuiltinModule").mockImplementation(() => {
    throw new Error("the inspector is withheld");
  });
  try {
    expect(() => compileBody("return a; /* note")).toThrow(
      "the body does not parse at line 1, column 18: Invalid or unexpected token",
    );
    // A caret still places a single-line error exactly.
    expect(() => compileBody("return )")).toThrow(
      "the body does not parse at line 1, column 8: Unexpected token ')'",
    );
  } finally {
    withheld.mockRestore();
  }
});
