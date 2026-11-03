import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, posix } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

// Relative Markdown links in the documents an outsider reads must reach a file or directory of
// the repository. Removing or renaming a document, such as a concept document the cleanup
// dissolves, otherwise leaves links that dangle for every reader while the rest of the gate stays
// green. Carriers are out of scope, because the graph checks what they cite, and so are the
// restored lineage documents, which are verbatim historical exhibits.

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

/** True for a document the link check reads. */
function isCheckedDocument(path: string): boolean {
  if (!path.endsWith(".md") || path.endsWith(".sdp.md")) return false;
  if (["README.md", "AGENTS.md", "CONTEXT.md"].includes(path)) return true;
  if (path.startsWith("docs/")) return !path.startsWith("docs/lineage/");
  return path.startsWith("jtbd-stories/") || path.startsWith(".agents/skills/");
}

interface LinkTarget {
  readonly line: number;
  readonly target: string;
}

/** A fenced code block: opened inside `depth` blockquotes, closed by a long enough `marker` run. */
interface Fence {
  readonly marker: string;
  readonly length: number;
  readonly depth: number;
}

/** Removes up to `limit` leading blockquote markers from a line, with how many it removed. */
function unquote(line: string, limit: number): { readonly depth: number; readonly rest: string } {
  let depth = 0;
  let rest = line;
  for (let marker = /^ {0,3}> ?/u.exec(rest); marker !== null && depth < limit; depth += 1) {
    rest = rest.slice(marker[0].length);
    marker = /^ {0,3}> ?/u.exec(rest);
  }
  return { depth, rest };
}

/**
 * The document's prose, line for line: blockquote markers are removed, so a link can continue on
 * the next quoted line, and each line of a fenced code block is blank. A fence opens after any
 * blockquote or list-item markers and closes inside the same blockquote, or where that blockquote
 * ends. A backtick run with another backtick later on its line opens no fence.
 */
function proseOf(markdown: string): string {
  const prose: string[] = [];
  let fence: Fence | undefined;
  for (const line of markdown.split(/\r?\n/u)) {
    if (fence !== undefined) {
      const quoted = unquote(line, fence.depth);
      if (quoted.depth === fence.depth) {
        const close = /^\s*(`{3,}|~{3,})\s*$/u.exec(quoted.rest)?.[1];
        if (close !== undefined && close.startsWith(fence.marker) && close.length >= fence.length) {
          fence = undefined;
        }
        prose.push("");
        continue;
      }
      fence = undefined;
    }
    const { depth, rest } = unquote(line, Number.POSITIVE_INFINITY);
    const open = /^\s*(?:(?:[-+*]|\d{1,9}[.)])[ \t]+)*(`{3,}|~{3,})(.*)$/u.exec(rest);
    const run = open?.[1];
    if (run !== undefined && !(run.startsWith("`") && (open?.[2] ?? "").includes("`"))) {
      fence = { marker: run.charAt(0), length: run.length, depth };
      prose.push("");
      continue;
    }
    prose.push(rest);
  }
  return prose.join("\n");
}

/**
 * Blanks every code span, keeping line breaks. A span may wrap onto the next line of its
 * paragraph, never past a blank line or a line that opens a heading, list item or table row.
 */
function withoutCodeSpans(prose: string): string {
  return prose.replaceAll(
    /(?<!`)(`+)(?!`)(?:(?!\n[ \t]*(?:$|\n|#{1,6}(?:[ \t]|$)|\||[-+*][ \t]|\d{1,9}[.)][ \t]))[\s\S])*?(?<!`)\1(?!`)/gu,
    (span) => span.replaceAll(/[^\n]/gu, " "),
  );
}

/**
 * The targets a Markdown reader follows: inline links and images, reference definitions, and HTML
 * `href` and `src` attributes, each on the line its target starts. A destination may sit on the
 * line after its `](` or `]:`. Fenced code blocks and code spans hold no links. A target with
 * parentheses is read up to the first closing one. Indented code blocks, HTML comments and
 * backslash escapes are read as prose, so a link-shaped text inside them is checked too.
 */
function markdownLinkTargets(markdown: string): readonly LinkTarget[] {
  const prose = withoutCodeSpans(proseOf(markdown));
  const found = [
    ...prose.matchAll(/\]\([ \t]*(?:\n[ \t]*)?(<[^<>\n]*>|[^\s)]+)/dgu),
    ...prose.matchAll(/^ {0,3}\[[^\]^][^\]]*\]:[ \t]*(?:\n[ \t]*)?(<[^<>\n]*>|\S+)/dgmu),
    ...prose.matchAll(/<(?:a|img|source)\b[^>]*?\b(?:href|src)\s*=\s*["']([^"']+)["']/dgiu),
  ]
    .flatMap((match) => {
      const target = match[1];
      const offset = match.indices?.[1]?.[0];
      return target === undefined || offset === undefined ? [] : [{ offset, target }];
    })
    .sort((left, right) => left.offset - right.offset);
  const targets: LinkTarget[] = [];
  let line = 1;
  let scanned = 0;
  for (const { offset, target } of found) {
    for (let next = prose.indexOf("\n", scanned); next !== -1 && next < offset; ) {
      line += 1;
      scanned = next + 1;
      next = prose.indexOf("\n", scanned);
    }
    targets.push({ line, target });
  }
  return targets;
}

/** The repository path a target names from `from`, or undefined for an external or same-page link. */
function linkedPath(from: string, target: string): string | undefined {
  const bare = target.replace(/^<(.*)>$/u, "$1");
  if (bare === "" || bare.startsWith("#") || bare.startsWith("//")) return undefined;
  if (/^[a-z][a-z\d+.-]*:/iu.test(bare)) return undefined;
  const raw = bare.split(/[?#]/u)[0] ?? "";
  let path = raw;
  try {
    path = decodeURIComponent(raw);
  } catch {
    // A malformed escape stays as written and fails to resolve.
  }
  const joined = path.startsWith("/")
    ? posix.normalize(path.slice(1))
    : posix.join(posix.dirname(from), path);
  return joined.replace(/\/$/u, "") || ".";
}

/** Every link in `documents` whose repository path is not in `present`, as `file:line target`. */
function danglingLinks(
  documents: ReadonlyMap<string, string>,
  present: (path: string) => boolean,
): readonly string[] {
  const dangling: string[] = [];
  for (const [file, markdown] of documents) {
    for (const { line, target } of markdownLinkTargets(markdown)) {
      const path = linkedPath(file, target);
      if (path !== undefined && !present(path)) dangling.push(`${file}:${String(line)} ${target}`);
    }
  }
  return dangling;
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
      "[ref]: /root/file.md",
      "[^note]: not a link",
      "Text `[skipped](code-span.md)` and [web](https://example.com) and [here](#anchor).",
      '<a href="html/page.md">x</a> [mail](mailto:a@b.c) [q](query.md?x=1)',
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
      [1, "<with space.md>", "jtbd-stories/with space.md"],
      [2, "/root/file.md", "root/file.md"],
      [4, "https://example.com", undefined],
      [4, "#anchor", undefined],
      [5, "html/page.md", "jtbd-stories/html/page.md"],
      [5, "mailto:a@b.c", undefined],
      [5, "query.md?x=1", "jtbd-stories/query.md"],
      [10, "after.md", "jtbd-stories/after.md"],
      [13, "html/two-line.png", "jtbd-stories/html/two-line.png"],
      [16, "two-line/ref.md", "jtbd-stories/two-line/ref.md"],
      [17, "span-line.md", "jtbd-stories/span-line.md"],
      [22, "item.md", "jtbd-stories/item.md"],
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
