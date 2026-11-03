import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { danglingLinks, linkedPath, markdownLinkTargets } from "./helpers/markdown-links.js";

// Relative Markdown links in the documents an outsider reads must reach a file or directory of
// the repository. Removing or renaming a document, such as a concept document the cleanup
// dissolves, otherwise leaves links that dangle for every reader while the rest of the gate stays
// green. Carriers are out of scope, because the graph checks what they cite, and so are the
// restored lineage documents, which are verbatim historical exhibits. The reader in
// `helpers/markdown-links.ts` finds the links as the forge's Markdown parser renders them.

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

/** True for a document the link check reads. */
function isCheckedDocument(path: string): boolean {
  if (!path.endsWith(".md") || path.endsWith(".sdp.md")) return false;
  if (["README.md", "AGENTS.md", "CONTEXT.md"].includes(path)) return true;
  if (path.startsWith("docs/")) return !path.startsWith("docs/lineage/");
  return path.startsWith("jtbd-stories/") || path.startsWith(".agents/skills/");
}

/**
 * The repository's tracked and nonignored untracked paths, with every directory above them. Names
 * compare case-sensitively, as a case-sensitive checkout and the forge resolve them.
 */
function repositoryPaths(): ReadonlySet<string> {
  const listed = spawnSync(
    "git",
    ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
    {
      cwd: repoRoot,
      encoding: "utf8",
    },
  );
  if (listed.error !== undefined || listed.status !== 0) {
    throw new Error(`git ls-files failed: ${listed.stderr}`);
  }
  const paths = new Set<string>(["."]);
  for (const file of listed.stdout.split("\0").filter((path) => path !== "")) {
    paths.add(file);
    for (
      let directory = posix.dirname(file);
      directory !== ".";
      directory = posix.dirname(directory)
    ) {
      paths.add(directory);
    }
  }
  return paths;
}

describe("relative Markdown links", () => {
  it("reach a repository path from every document an outsider reads", () => {
    const paths = repositoryPaths();
    const documents = new Map(
      [...paths]
        .filter((path) => isCheckedDocument(path) && existsSync(join(repoRoot, path)))
        .sort()
        .map((path) => [path, readFileSync(join(repoRoot, path), "utf8")] as const),
    );
    for (const path of [
      "README.md",
      "AGENTS.md",
      "CONTEXT.md",
      "docs/agent-surface/recipes.md",
      "docs/concept/README.md",
      "jtbd-stories/README.md",
      ".agents/skills/sdp-authoring/SKILL.md",
    ]) {
      expect(documents.has(path)).toBe(true);
    }
    expect([...documents.keys()].filter((path) => path.startsWith("docs/lineage/"))).toEqual([]);

    const present = (path: string) => paths.has(path) && existsSync(join(repoRoot, path));
    expect(danglingLinks(documents, present)).toEqual([]);
  });

  it("reads the links a Markdown reader follows and skips code and external targets", () => {
    const markdown = [
      "See [a](../docs/a.md#part), ![b](img/b.png 'title') and [c](<with space.md>).",
      "Also [p](kept(v2).md), [esc](a\\(b.md) and [amp](a&amp;b.md).",
      "",
      "[ref]: /root/file.md",
      "[^note]: not a link",
      "",
      "Text `[skipped](code-span.md)` and [web](https://example.com) and [here](#anchor).",
      '<a href="html/page.md">x</a> [mail](mailto:a@b.c) [q](query.md?x=1)',
      "",
      "```md",
      "[fenced](fenced.md)",
      "~~~",
      "````",
      "[after](after.md)",
      "A span `that wraps",
      "[onto](wrapped.md)` here, and <img alt='x'",
      '  src="html/two-line.png">.',
      "",
      "[two-line]:",
      "  two-line/ref.md",
      "",
      "```js` opens no fence: [span-line](span-line.md)",
      "- ```md",
      "  [listed](list-fence.md)",
      "  ```",
      "A stray ` backtick.",
      "- [item](item.md) with `code`",
    ].join("\n");
    const targets = markdownLinkTargets(markdown).map(({ line, target }) => [
      line,
      target,
      linkedPath("jtbd-stories/story.md", target),
    ]);
    expect(targets).toEqual([
      [1, "../docs/a.md#part", "docs/a.md"],
      [1, "img/b.png", "jtbd-stories/img/b.png"],
      [1, "with space.md", "jtbd-stories/with space.md"],
      [2, "kept(v2).md", "jtbd-stories/kept(v2).md"],
      [2, "a(b.md", "jtbd-stories/a(b.md"],
      [2, "a&b.md", "jtbd-stories/a&b.md"],
      [4, "/root/file.md", "root/file.md"],
      [7, "https://example.com", undefined],
      [7, "#anchor", undefined],
      [8, "html/page.md", "jtbd-stories/html/page.md"],
      [8, "mailto:a@b.c", undefined],
      [8, "query.md?x=1", "jtbd-stories/query.md"],
      [14, "after.md", "jtbd-stories/after.md"],
      [17, "html/two-line.png", "jtbd-stories/html/two-line.png"],
      [20, "two-line/ref.md", "jtbd-stories/two-line/ref.md"],
      [22, "span-line.md", "jtbd-stories/span-line.md"],
      [27, "item.md", "jtbd-stories/item.md"],
    ]);
  });

  it("reports a missing destination written on the line after its opening", () => {
    const documents = new Map([
      [
        "jtbd-stories/story.md",
        [
          "Intro.",
          "[Removed](",
          "  ../docs/concept/not-present.md",
          ")",
          "",
          "[gone]:",
          "  ../docs/gone.md",
          "",
          "> A quoted [link](",
          ">   ../docs/quoted-gone.md).",
        ].join("\n"),
      ],
    ]);
    expect(danglingLinks(documents, () => false)).toEqual([
      "jtbd-stories/story.md:3 ../docs/concept/not-present.md",
      "jtbd-stories/story.md:7 ../docs/gone.md",
      "jtbd-stories/story.md:10 ../docs/quoted-gone.md",
    ]);
  });

  it("skips a fenced block inside a blockquote and reads on where the fence or quote ends", () => {
    const documents = new Map([
      [
        "jtbd-stories/story.md",
        [
          "> ```md",
          "> [example](not-present.md)",
          "> ```",
          "> [after-fence](quoted-gone.md)",
          ">",
          "> > ~~~",
          "> > [nested](nested.md)",
          "> > ~~~",
          "> ~~~text",
          "> [unclosed](unclosed.md)",
          "Out of the quote, [outside](outside-gone.md).",
          "```text",
          "> ```",
          "[quoted-close](still-code.md)",
          "```",
          "[end](end-gone.md)",
        ].join("\n"),
      ],
    ]);
    expect(danglingLinks(documents, () => false)).toEqual([
      "jtbd-stories/story.md:4 quoted-gone.md",
      "jtbd-stories/story.md:11 outside-gone.md",
      "jtbd-stories/story.md:16 end-gone.md",
    ]);
  });

  it("ends a fence with its list item and opens none from a line indented as code", () => {
    const documents = new Map([
      [
        "jtbd-stories/story.md",
        [
          "- ```md",
          "  example",
          "",
          "[Removed](../docs/concept/not-present.md)",
          "",
          "Text.",
          "    ```",
          "[After](../docs/after-paragraph.md)",
          "",
          "    ```",
          "[Below](../docs/after-indented-code.md)",
          "",
          "1. Step:",
          "",
          "   ```md",
          "   [example](not-present.md)",
          "   ```",
          "",
          "- Item.",
          "",
          "      ```",
          "  [In the item](item-gone.md)",
          "",
          "```md",
          "    ```",
          "[still-code](still-code.md)",
          "```",
          "[closed](closed-gone.md)",
        ].join("\n"),
      ],
    ]);
    expect(danglingLinks(documents, () => false)).toEqual([
      "jtbd-stories/story.md:4 ../docs/concept/not-present.md",
      "jtbd-stories/story.md:8 ../docs/after-paragraph.md",
      "jtbd-stories/story.md:11 ../docs/after-indented-code.md",
      "jtbd-stories/story.md:22 item-gone.md",
      "jtbd-stories/story.md:28 closed-gone.md",
    ]);
  });

  it("opens no fence inside an HTML block and splits code spans at table cells", () => {
    const documents = new Map([
      [
        "jtbd-stories/story.md",
        [
          "<div>",
          "```",
          "</div>",
          "",
          "[after-html](html-gone.md)",
          "",
          "| `a | [cell](cell-gone.md) b` |",
          "| - | - |",
        ].join("\n"),
      ],
    ]);
    expect(danglingLinks(documents, () => false)).toEqual([
      "jtbd-stories/story.md:5 html-gone.md",
      "jtbd-stories/story.md:7 cell-gone.md",
    ]);
  });

  it("reads a destination with balanced parentheses whole", () => {
    const documents = new Map([
      [
        "jtbd-stories/story.md",
        "[Kept](../docs/concept/kept(v2).md) and [Gone](../docs/concept/gone(v2).md).\n",
      ],
    ]);
    const present = new Set(["docs/concept/kept(v2).md"]);
    expect(danglingLinks(documents, (path) => present.has(path))).toEqual([
      "jtbd-stories/story.md:1 ../docs/concept/gone(v2).md",
    ]);
  });

  it("names each link whose target is missing, with its file and line", () => {
    const documents = new Map([
      ["jtbd-stories/story.md", "One [kept](../docs/kept.md).\nTwo [gone](../docs/gone.md#x).\n"],
      ["README.md", "[up](..) [dir](docs) [case](DOCS/kept.md)\n"],
    ]);
    const present = new Set([".", "docs", "docs/kept.md", "jtbd-stories", "README.md"]);
    expect(danglingLinks(documents, (path) => present.has(path))).toEqual([
      "jtbd-stories/story.md:2 ../docs/gone.md#x",
      "README.md:1 ..",
      "README.md:1 DOCS/kept.md",
    ]);
  });
});
