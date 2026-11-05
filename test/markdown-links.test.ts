import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  decodeHtmlReferences,
  decodeMarkdownReferences,
  referenceCounts,
} from "./helpers/character-references.js";
import {
  danglingLinks,
  linkedFragment,
  linkedPath,
  markdownAnchors,
  markdownLinkTargets,
} from "./helpers/markdown-links.js";

// Relative Markdown links in the documents an outsider reads must reach a file or directory of
// the repository, and a fragment on a link to a Markdown page must reach one of its headings or
// HTML anchors. Removing or renaming a document or a section, as the cleanup does when it
// dissolves concept documents, otherwise leaves links that dangle for every reader while the rest
// of the gate stays green. Carriers are out of scope, because the graph checks what they cite,
// and so is the v0 concept set under `docs/lineage/v0-design/`, which is restored verbatim as a
// historical exhibit. The notes written for `docs/lineage/` are checked like any other document.
// The reader in `helpers/markdown-links.ts` finds the links and anchors as the forge renders them.

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

/** True for a document the link check reads. */
function isCheckedDocument(path: string): boolean {
  if (!path.endsWith(".md") || path.endsWith(".sdp.md")) return false;
  if (["README.md", "AGENTS.md", "CONTEXT.md"].includes(path)) return true;
  if (path.startsWith("docs/")) return !path.startsWith("docs/lineage/v0-design/");
  return path.startsWith("jtbd-stories/") || path.startsWith("skills/");
}

/** A tree's paths, with every directory above them, and a reader for its files. */
interface Tree {
  readonly paths: ReadonlySet<string>;
  readonly exists: (path: string) => boolean;
  readonly read: (path: string) => string;
}

/** The documents the check reads in `tree`, and the links among them that miss. */
function checkTree(tree: Tree): {
  readonly checked: readonly string[];
  readonly dangling: readonly string[];
} {
  const present = (path: string) => tree.paths.has(path) && tree.exists(path);
  const documents = new Map(
    [...tree.paths]
      .filter((path) => isCheckedDocument(path) && present(path))
      .sort()
      .map((path) => [path, tree.read(path)] as const),
  );
  const page = (path: string) =>
    /\.md$/iu.test(path) && present(path) ? tree.read(path) : undefined;
  return { checked: [...documents.keys()], dangling: danglingLinks(documents, present, page) };
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
    const { checked, dangling } = checkTree({
      paths: repositoryPaths(),
      exists: (path) => existsSync(join(repoRoot, path)),
      read: (path) => readFileSync(join(repoRoot, path), "utf8"),
    });
    for (const path of [
      "README.md",
      "AGENTS.md",
      "CONTEXT.md",
      "docs/agent-surface/recipes.md",
      "docs/concept/README.md",
      "docs/lineage/README.md",
      "jtbd-stories/README.md",
      "skills/sdp-authoring/SKILL.md",
    ]) {
      expect(checked).toContain(path);
    }
    expect(checked.filter((path) => path.startsWith("docs/lineage/v0-design/"))).toEqual([]);
    expect(dangling).toEqual([]);
  });

  it("checks the notes written for docs/lineage and skips only the restored v0 concept set", () => {
    const files = new Map([
      ["docs/lineage/README.md", "Start with [the context](./annotation-context.md#why).\n"],
      [
        "docs/lineage/annotation-context.md",
        "# Context\n\n[Gone](../../specs/decisions/gone.sdp.md)\n",
      ],
      ["docs/lineage/archived-scout.md", "[Decision](../../specs/decisions/removed.sdp.md)\n"],
      ["docs/lineage/v0-design/README.md", "[Old](../../specs/old.md)\n"],
      ["docs/lineage/v0-design/01-core-primitives.md", "[Old](./missing.md)\n"],
    ]);
    const paths = new Set<string>([".", "docs", "docs/lineage", "docs/lineage/v0-design"]);
    for (const path of files.keys()) paths.add(path);
    const { checked, dangling } = checkTree({
      paths,
      exists: (path) => paths.has(path),
      read: (path) => files.get(path) ?? "",
    });
    expect(checked).toEqual([
      "docs/lineage/README.md",
      "docs/lineage/annotation-context.md",
      "docs/lineage/archived-scout.md",
    ]);
    expect(dangling).toEqual([
      "docs/lineage/README.md:1 ./annotation-context.md#why",
      "docs/lineage/annotation-context.md:3 ../../specs/decisions/gone.sdp.md",
      "docs/lineage/archived-scout.md:1 ../../specs/decisions/removed.sdp.md",
    ]);
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

  it("skips code examples, comments and Markdown in HTML blocks, which render no link", () => {
    const documents = new Map([
      [
        "jtbd-stories/story.md",
        [
          "Intro.",
          "",
          "    [example](not-present.md)",
          "",
          "<!-- [hidden](comment-only.md) -->",
          "Text <!-- [inline](inline-comment.md) --> and \\[escaped](escaped.md). Text <!-- legacy --!> [inline abrupt](inline-abrupt-gone.md) -->. Text <!--c1--> [between comments](between-comments-gone.md) middle <!--c2--> more.",
          "",
          "<pre>",
          "[pre](pre-example.md)",
          "</pre>",
          "",
          "<details>",
          '[raw](raw-markdown.md) <a href="details-gone.md">read</a>',
          "</details>",
          "",
          "- Item:",
          "",
          "      [listed](listed-code.md)",
          "",
          "> Quote:",
          ">",
          ">     [quoted](quoted-code.md)",
          "",
          "![alt [inner](image-text.md)](image-gone.png)",
          "[outer [inner](inner-gone.md) text](outer.md)",
          '<!-- ends early --!> <a href="after-comment-gone.md">x</a> -->',
          "[after](after-gone.md)",
          "",
          "<textarea>",
          "",
          "[text](textarea-text.md)",
          "</textarea>",
          "[last](last-gone.md)",
        ].join("\n"),
      ],
    ]);
    expect(danglingLinks(documents, () => false)).toEqual([
      "jtbd-stories/story.md:6 inline-abrupt-gone.md",
      "jtbd-stories/story.md:6 between-comments-gone.md",
      "jtbd-stories/story.md:13 details-gone.md",
      "jtbd-stories/story.md:24 image-gone.png",
      "jtbd-stories/story.md:25 inner-gone.md",
      "jtbd-stories/story.md:26 after-comment-gone.md",
      "jtbd-stories/story.md:27 after-gone.md",
      "jtbd-stories/story.md:33 last-gone.md",
    ]);
  });

  it("reads an indented paragraph that continues a list item or footnote, and skips code", () => {
    const documents = new Map([
      [
        "jtbd-stories/story.md",
        [
          "1. Step.",
          "",
          "    [continued item](item-gone.md)",
          "",
          "Text[^1].",
          "",
          "[^1]: Note [first](note-gone.md).",
          "",
          "    [continued](continued-gone.md)",
          "",
          "        [code](footnote-code.md)",
        ].join("\n"),
      ],
    ]);
    expect(danglingLinks(documents, () => false)).toEqual([
      "jtbd-stories/story.md:3 item-gone.md",
      "jtbd-stories/story.md:7 note-gone.md",
      "jtbd-stories/story.md:9 continued-gone.md",
    ]);
  });

  it("decodes character references in a destination before it resolves the path", () => {
    const documents = new Map([
      [
        "jtbd-stories/story.md",
        [
          "[Kept](../docs/concept/kept&lpar;v2&rpar;.md), [Gone](../docs/concept/gone&lpar;v2&rpar;.md).",
          "[Numeric](../docs/concept/kept&#40;v2&#x29;.md), [Unknown](../docs/concept/kept&nope;.md).",
          '<a href="../docs/concept/kept&#40;v2&#41;.md">a</a> <a href="../docs/kept&lpar;.md">b</a>',
        ].join("\n"),
      ],
    ]);
    const present = new Set(["docs/concept/kept(v2).md", "docs/kept(.md"]);
    expect(danglingLinks(documents, (path) => present.has(path))).toEqual([
      "jtbd-stories/story.md:1 ../docs/concept/gone(v2).md",
      "jtbd-stories/story.md:2 ../docs/concept/kept&nope;.md",
      // The forge's HTML sanitizer knows only the HTML 4 names, so `&lpar;` stays as written.
      "jtbd-stories/story.md:3 ../docs/kept&lpar;.md",
    ]);
  });

  it("carries the HTML standard's named references and the sanitizer's HTML 4 names", () => {
    expect(referenceCounts).toEqual({ markdown: 2125, html: 253 });
    expect(
      decodeMarkdownReferences("&AMP;&CounterClockwiseContourIntegral;&nvlt;&Afr;&#0;&#xD800;"),
    ).toBe("&\u2233<\u20D2\u{1D504}\uFFFD\uFFFD");
    expect(decodeMarkdownReferences("&amp &#000000040; &nope;")).toBe("&amp &#000000040; &nope;");
    expect(decodeHtmlReferences("&eacute;&lang;&AMP;&#40&#x29")).toBe("\u00E9\u2329&AMP;()");
  });

  it("checks a fragment against the headings and HTML anchors of the Markdown page it names", () => {
    const guide = [
      "# The guide",
      "",
      "## Setup & use",
      "",
      "## Setup & use",
      "",
      "Renamed section",
      "---",
      "",
      '<a name="kept-name"></a> and <span id="kept-id"></span>',
      "",
      "```md",
      "## Not a heading",
      '<a id="not-an-anchor"></a>',
      "```",
      "",
      "[self](#setup--use-1) and [self, gone](#setup) and [top](#top)",
    ].join("\n");
    const documents = new Map([
      ["docs/guide.md", guide],
      [
        "jtbd-stories/story.md",
        [
          "[a](../docs/guide.md#the-guide) [b](../docs/guide.md#setup--use-1)",
          "[c](../docs/guide.md#setup--use-2) [d](../docs/guide.md#old-section)",
          "[e](../docs/guide.md#renamed-section) [f](../docs/guide.md#kept-name)",
          "[g](../docs/guide.md#kept-id) [h](../docs/guide.md#not-a-heading)",
          "[i](../docs/guide.md#not-an-anchor) [j](../docs/guide.md#user-content-the-guide)",
          '<a href="../docs/guide.md#setup--use">k</a> <a href="../docs/guide.md#gone">l</a>',
        ].join("\n"),
      ],
    ]);
    const present = new Set(["docs/guide.md"]);
    expect(danglingLinks(documents, (path) => present.has(path))).toEqual([
      "docs/guide.md:17 #setup",
      "jtbd-stories/story.md:2 ../docs/guide.md#setup--use-2",
      "jtbd-stories/story.md:2 ../docs/guide.md#old-section",
      "jtbd-stories/story.md:4 ../docs/guide.md#not-a-heading",
      "jtbd-stories/story.md:5 ../docs/guide.md#not-an-anchor",
      "jtbd-stories/story.md:6 ../docs/guide.md#gone",
    ]);
  });

  it("counts no heading or anchor inside an HTML comment, which renders nothing", () => {
    const page = [
      "<!-- <h2>Old</h2> -->",
      "",
      "<!--",
      "<h2>Older</h2>",
      '<a id="hidden"></a>',
      "-->",
      "",
      "<div>",
      "<h2>Kept <!-- <span>x</span> -->heading</h2>",
      "<!-- <h3>Not</h3> --><h3>After</h3>",
      "<!--><h4>Abrupt</h4>",
      "</div>",
      "",
      "[old](#old) [older](#older) [hidden](#hidden) [kept](#kept-heading) [not](#not)",
      "[after](#after) [abrupt](#abrupt)",
    ].join("\n");
    expect([...markdownAnchors(page)].sort()).toEqual(["abrupt", "after", "kept-heading"]);
    expect(danglingLinks(new Map([["docs/page.md", page]]), () => true)).toEqual([
      "docs/page.md:14 #old",
      "docs/page.md:14 #older",
      "docs/page.md:14 #hidden",
      "docs/page.md:14 #not",
    ]);
  });

  it("checks the fragment of a link that names its own page by a query", () => {
    expect(linkedPath("docs/guide.md", "?x=1#missing")).toBeUndefined();
    expect(linkedPath("docs/guide.md", "?plain=1")).toBeUndefined();
    const documents = new Map([
      [
        "docs/guide.md",
        [
          "# Kept",
          "",
          "[a](?x=1#missing) [b](?x=1#kept) [c](?plain=1#L5) [d](?x=1)",
          "[e](guide.md?x=1#missing) [f](guide.md?plain=1#L5)",
        ].join("\n"),
      ],
    ]);
    // The page's folder is present too, as it is in the repository.
    const present = new Set(["docs", "docs/guide.md"]);
    expect(danglingLinks(documents, (path) => present.has(path))).toEqual([
      "docs/guide.md:3 ?x=1#missing",
      "docs/guide.md:4 guide.md?x=1#missing",
    ]);
  });

  it("reports a fragment left behind when its heading is renamed", () => {
    const story = "See [the section](../docs/guide.md#first-steps).\n";
    const before = new Map([
      ["docs/guide.md", "# Guide\n\n## First steps\n"],
      ["jtbd-stories/story.md", story],
    ]);
    const after = new Map([
      ["docs/guide.md", "# Guide\n\n## Getting started\n"],
      ["jtbd-stories/story.md", story],
    ]);
    const present = () => true;
    expect(danglingLinks(before, present)).toEqual([]);
    expect(danglingLinks(after, present)).toEqual([
      "jtbd-stories/story.md:1 ../docs/guide.md#first-steps",
    ]);
  });

  it("derives a heading's anchor from its rendered text, as the forge does", () => {
    const anchors = markdownAnchors(
      [
        "# Café `a_b` and _emphasis_ — [linked](other.md) ![pic](p.png) &amp; <b>bold</b> **x**",
        "## snake_case stays and __init__ is strong",
        "## Ref [text][r] and [missing][nope]",
        "## Table [text][t]",
        "| Letter | Other |",
        "| --- | --- |",
        "| [t]: target.md | value |",
        "### Closing hashes ###",
        "Two",
        "lines  ",
        "===",
        "",
        '<a id="repeat"></a>',
        "",
        "## Repeat",
        "## Repeat",
        "## Repeat 1",
        "",
        "<h2>Raw <em>HTML</em></h2>",
        "",
        "[r]: target.md",
      ].join("\n"),
    );
    expect([...anchors].sort()).toEqual(
      [
        "café-a_b-and-emphasis--linked---bold-x",
        "snake_case-stays-and-init-is-strong",
        "ref-text-and-missingnope",
        "table-textt",
        "closing-hashes",
        "twolines",
        "repeat",
        "repeat-1",
        "repeat-1-1",
        "raw-html",
      ].sort(),
    );
  });

  it("decodes a percent-encoded fragment and leaves line anchors on source views unchecked", () => {
    expect(linkedFragment("guide.md#caf%C3%A9")).toBe("café");
    expect(linkedFragment("guide.md#bad%E0%A4%A")).toBe("bad%E0%A4%A");
    expect(linkedFragment("guide.md?plain=1#L10")).toBeUndefined();
    expect(linkedFragment("guide.md#")).toBeUndefined();
    expect(linkedFragment("https://example.com/a.md#x")).toBeUndefined();
    const documents = new Map([
      ["docs/guide.md", "# Café\n"],
      [
        "jtbd-stories/story.md",
        [
          "[a](../docs/guide.md#caf%C3%A9) [b](../docs/guide.md#café) [c](../docs/guide.md#Café)",
          "[d](../docs/guide.md#cafe) [e](../src/main.ts#L10) [f](../docs/guide.md?plain=1#L1)",
          "[g](../docs/missing.md#x) [h](../docs/guide.md#caf%E9)",
        ].join("\n"),
      ],
    ]);
    const present = new Set(["docs/guide.md", "src/main.ts"]);
    expect(danglingLinks(documents, (path) => present.has(path))).toEqual([
      "jtbd-stories/story.md:2 ../docs/guide.md#cafe",
      "jtbd-stories/story.md:3 ../docs/missing.md#x",
      "jtbd-stories/story.md:3 ../docs/guide.md#caf%E9",
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
