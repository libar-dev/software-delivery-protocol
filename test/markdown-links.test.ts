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

/**
 * The targets a Markdown reader follows: inline links and images, reference definitions, and HTML
 * `href` and `src` attributes. Fenced code blocks and code spans hold no links. A target with
 * unbalanced parentheses is read up to the first closing one.
 */
function markdownLinkTargets(markdown: string): readonly LinkTarget[] {
  const targets: LinkTarget[] = [];
  let fence: { readonly marker: string; readonly length: number } | undefined;
  for (const [index, raw] of markdown.split(/\r?\n/u).entries()) {
    const fenceLine = /^\s*(`{3,}|~{3,})(.*)$/u.exec(raw);
    if (fenceLine !== null) {
      const run = fenceLine[1] ?? "";
      const marker = run.charAt(0);
      if (fence === undefined) {
        fence = { marker, length: run.length };
        continue;
      }
      if (
        marker === fence.marker &&
        run.length >= fence.length &&
        /^\s*$/u.test(fenceLine[2] ?? "")
      ) {
        fence = undefined;
        continue;
      }
    }
    if (fence !== undefined) continue;
    const line = raw.replaceAll(/(`+)[^`]*?\1/gu, "");
    const found = [
      ...[...line.matchAll(/\]\(\s*(<[^>]*>|[^\s)]+)/gu)].map((match) => match[1]),
      /^ {0,3}\[[^\]^][^\]]*\]:\s*(<[^>]*>|\S+)/u.exec(line)?.[1],
      ...[
        ...line.matchAll(/<(?:a|img|source)\b[^>]*?\b(?:href|src)\s*=\s*["']([^"']+)["']/giu),
      ].map((match) => match[1]),
    ];
    for (const target of found) {
      if (target !== undefined) targets.push({ line: index + 1, target });
    }
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
      [5, "mailto:a@b.c", undefined],
      [5, "query.md?x=1", "jtbd-stories/query.md"],
      [5, "html/page.md", "jtbd-stories/html/page.md"],
      [10, "after.md", "jtbd-stories/after.md"],
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
