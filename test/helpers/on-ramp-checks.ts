/**
 * The checks every shipped skill keeps, whatever it teaches: frontmatter, disclosure, pointers,
 * citations, recipe names, commands, inline bodies and quoted counts. They hold what a tool can
 * decide of the shape `spec:consumers.shipped-protocol-corpus#rule.skillShape` states. What a
 * skill means (its hazards, the owner's rules, what sits early) is audited by a reader, never
 * pinned here as tokens, and the size limits are ceilings for editorial judgment, not targets.
 *
 * `describeOnRamp("sdp-x", { realizes })` registers them for one skill folder; the suite that
 * holds the skill's realization anchors calls it beside its behavioural tests.
 * `describeHandbook(path)` registers the content checks for a teaching file outside the skills.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, posix } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { parse } from "yaml";
import { describe, expect, it } from "vitest";

import {
  codeAnchor,
  codeAnchorId,
  ref,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";

import { evaluateBody, extract } from "../../src/index.js";
import type { ExtractionResult, GraphSchema } from "../../src/index.js";
import { recipeFiles } from "../../src/cli/build-artifacts.js";
import { SDP_HELP_TEXT, runSdpCli } from "../../src/cli/sdp.js";
import { createReader } from "../../src/reader/reader.js";
import { createCaptureOutput } from "./cli-capture.js";
import {
  danglingLinks,
  linkedPath,
  markdownAnchors,
  markdownLinkTargets,
} from "./markdown-links.js";

export interface OnRampOptions {
  /** The on-ramp Spec ids `metadata.realizes` names, in any order. */
  readonly realizes?: readonly string[];
}

const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
const catalogPath = "docs/agent-surface/recipes.md";
const readingScripts = join(repoRoot, "skills/sdp-agent-surface/scripts");
const packagePrefix = "node_modules/@libar-dev/software-delivery-protocol/";

/** The Agent Skills specification's frontmatter fields. */
const agentSkillsFields = [
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
];
const limits = {
  entryBytes: 8000,
  entryLines: 120,
  referenceBytes: 6000,
  description: 400,
};
/** The relations whose targets carry law a realized on-ramp rests on; each is cited in place. */
const lawRelations = new Set(["dependsOn", "decidedBy", "constrainedBy"]);

interface SkillFile {
  /** Repository-relative, POSIX separators. */
  readonly path: string;
  readonly text: string;
}

interface Skill {
  readonly name: string;
  readonly frontmatter: Record<string, unknown>;
  readonly entry: SkillFile;
  /** Every entry of `references/`, Markdown or not, in name order. */
  readonly references: readonly SkillFile[];
  readonly files: readonly SkillFile[];
}

function read(path: string): SkillFile {
  return { path, text: readFileSync(join(repoRoot, path), "utf8") };
}

function readSkill(name: string): Skill {
  const entry = read(`skills/${name}/SKILL.md`);
  const frontmatter = /^---\n(?<yaml>[\s\S]*?)\n---\n/u.exec(entry.text)?.groups?.yaml;
  if (frontmatter === undefined) throw new Error(`${entry.path} opens with no YAML frontmatter`);
  const folder = join(repoRoot, "skills", name, "references");
  const references = existsSync(folder)
    ? readdirSync(folder)
        .sort()
        .map((file) => read(`skills/${name}/references/${file}`))
    : [];
  return {
    name,
    frontmatter: parse(frontmatter) as Record<string, unknown>,
    entry,
    references,
    files: [entry, ...references],
  };
}

/** The Spec ids `metadata.realizes` names: one string, ids separated by spaces or commas. */
function realizedSpecs(frontmatter: Record<string, unknown>): readonly string[] {
  const metadata = frontmatter.metadata;
  const value =
    typeof metadata === "object" && metadata !== null
      ? (metadata as Record<string, unknown>).realizes
      : undefined;
  return typeof value === "string" ? value.split(/[\s,]+/u).filter((id) => id !== "") : [];
}

/** A file's text with whitespace and Markdown emphasis flattened, so wrapped clauses match. */
export function teachingText(source: string): string {
  return source.replaceAll(/[`*_]/gu, "").replaceAll(/\s+/gu, " ");
}

interface Segment {
  readonly file: string;
  readonly text: string;
  /** A line inside a fence, where a reader copies a command whole, rather than an inline span. */
  readonly fenced: boolean;
}

/**
 * A Markdown file split at its fences: the prose outside them, a fence standing as an empty line,
 * and each line inside one.
 */
function splitFences(text: string): {
  readonly prose: string;
  readonly fenced: readonly string[];
} {
  const prose: string[] = [];
  const fenced: string[] = [];
  let fence: string | undefined;
  for (const line of text.split("\n")) {
    const marker = /^\s*(?<ticks>`{3,}|~{3,})(?<info>.*)$/u.exec(line)?.groups;
    if (fence === undefined && marker?.ticks !== undefined) {
      fence = marker.ticks;
      prose.push("");
      continue;
    }
    if (fence !== undefined) {
      const closes =
        marker?.ticks !== undefined &&
        marker.ticks.startsWith(fence.charAt(0)) &&
        marker.ticks.length >= fence.length &&
        (marker.info ?? "").trim() === "";
      if (closes) fence = undefined;
      else fenced.push(line.trim());
      continue;
    }
    prose.push(line);
  }
  return { prose: prose.join("\n"), fenced };
}

/**
 * Every line inside a fence, and every inline code span with its wrapped lines joined: the places
 * a skill writes a command, a path, a skill name or a body.
 */
function codeSegments(file: SkillFile): readonly Segment[] {
  const { prose, fenced } = splitFences(file.text);
  const segments: Segment[] = fenced.map((text) => ({
    file: file.path,
    text,
    fenced: true,
  }));
  const flat = prose.replaceAll(/\s+/gu, " ");
  for (const match of flat.matchAll(/(?<ticks>`+)(?<code>.+?)\k<ticks>/gu)) {
    segments.push({
      file: file.path,
      text: (match.groups?.code ?? "").trim(),
      fenced: false,
    });
  }
  return segments;
}

/** A path-like token with the shell and prose punctuation around it removed. */
function bareToken(token: string): string {
  return token.replace(/^(?:\$\(cat\s*|["'(])+/u, "").replace(/[)"',.;:]+$/u, "");
}

interface Invocation {
  readonly file: string;
  readonly segment: string;
  /** A public verb (`q`, `new spec`, …) or `orient`, the reading skill's orientation runner. */
  readonly verb: string;
  /** True when the reading runner (`q.mjs`, or `pnpm --silent sdp:q`, which runs it) is called. */
  readonly runner: boolean;
  /** True for `pnpm --silent sdp:q`, the form that runs only in the Protocol checkout. */
  readonly checkout: boolean;
  /** What follows the verb, up to the first command separator. */
  readonly rest: string;
}

/** The `sdp <verb>` usage line of every public verb, keyed by the verb. */
function usageLines(): ReadonlyMap<string, string> {
  const usage = SDP_HELP_TEXT.slice(
    SDP_HELP_TEXT.indexOf("Usage:"),
    SDP_HELP_TEXT.indexOf("Options:"),
  );
  const lines = new Map<string, string>();
  for (const match of usage.matchAll(/^ {2}sdp (?<verb>[a-z][\w-]*(?: spec)?)(?<rest>.*)$/gmu)) {
    const verb = match.groups?.verb;
    if (verb !== undefined) lines.set(verb, match[0]);
  }
  return lines;
}

/** The usage line a reading script states in its header: `orient.mjs`, or `q.mjs`, the runner. */
function scriptUsage(script: "orient" | "q"): string {
  const header = readFileSync(join(readingScripts, `${script}.mjs`), "utf8");
  return (
    new RegExp(String.raw`^\/\/\s+node scripts\/${script}\.mjs .*$`, "mu").exec(header)?.[0] ?? ""
  );
}

/**
 * What follows a verb, up to its first command separator (`&&`, `||`, `|` or `;`) outside quotes,
 * so an operator inside a quoted body stays part of the body.
 */
function firstCommand(rest: string): string {
  let quote: string | undefined;
  for (let index = 0; index < rest.length; index += 1) {
    const char = rest.charAt(index);
    if (quote !== undefined) {
      if (char === quote) quote = undefined;
      else if (char === "\\" && quote === '"') index += 1;
    } else if (char === "'" || char === '"') quote = char;
    else if (char === "\\") index += 1;
    else if (/^\s(?:&&|\|\||\||;)\s/u.test(rest.slice(index))) return rest.slice(0, index);
  }
  return rest;
}

/** The commands a segment runs: the reading runners, `pnpm --silent sdp:q` and `sdp <verb>`. */
function invocations(segment: Segment, verbs: ReadonlyMap<string, string>): Invocation[] {
  const found: Invocation[] = [];
  const add = (verb: string, rest: string, runner = false, checkout = false) => {
    found.push({
      file: segment.file,
      segment: segment.text,
      verb,
      runner,
      checkout,
      rest: firstCommand(rest),
    });
  };
  for (const match of segment.text.matchAll(
    /(?:^|\s)(?<form>pnpm --silent sdp:q|node \S*\bq\.mjs)(?<rest>(?:\s.*)?)$/gu,
  )) {
    add("q", match.groups?.rest ?? "", true, match.groups?.form?.startsWith("pnpm") === true);
  }
  for (const match of segment.text.matchAll(/(?:^|\s)node \S*\borient\.mjs(?<rest>(?:\s.*)?)$/gu)) {
    add("orient", match.groups?.rest ?? "");
  }
  for (const match of segment.text.matchAll(
    /(?:^|[\s(])sdp (?<first>[a-z][\w-]*)(?: (?<second>[a-z][\w-]*))?(?<rest>.*)$/gu,
  )) {
    const { first = "", second, rest = "" } = match.groups ?? {};
    const two = second === undefined ? undefined : `${first} ${second}`;
    if (two !== undefined && verbs.has(two)) add(two, rest);
    else add(first, `${second === undefined ? "" : ` ${second}`}${rest}`);
  }
  return found;
}

/** The flags an invocation passes, quoted bodies and parameter values left out. */
function flagsOf(rest: string): readonly string[] {
  const unquoted = rest.replaceAll(/'[^']*'/gu, "''").replaceAll(/"[^"]*"/gu, '""');
  return [...unquoted.matchAll(/(?<![\w-])--[a-z][a-z-]*/gu)].map((match) => match[0]);
}

/**
 * The graph a call derives: `checkout` for `pnpm --silent sdp:q`, which runs only in the Protocol
 * checkout; `protocol` for the runner's `--protocol` or a `--root` naming the package's `specs/`,
 * which in a project hold the Protocol's own Specs as intent only; `project` for every other call,
 * which reads the corpus at the working directory, the checkout here and an adopter's elsewhere.
 */
type RootSelection = "checkout" | "protocol" | "project";

function rootSelection(call: Invocation): RootSelection {
  if (call.checkout) return "checkout";
  const root = /--root(?:\s+|=)(?<path>\S+)/u.exec(call.rest)?.groups?.path ?? "";
  const shippedSpecs = root.replace(/\/$/u, "").endsWith(`${packagePrefix}specs`);
  return flagsOf(call.rest).includes("--protocol") || shippedSpecs ? "protocol" : "project";
}

interface TaughtBody {
  readonly file: string;
  readonly body: string;
  readonly params: Record<string, unknown> | undefined;
  readonly root: RootSelection;
}

/**
 * The `sdp q` bodies a skill teaches with their inline `--params` and root selection, a shipped
 * recipe file standing in for its catalog body. A placeholder body or subject, or parameters read
 * from a file, cannot run as written and is left to the reader. A quoted body that does not close
 * is `unparsed`: no check could run it.
 */
function taughtBodies(
  calls: readonly Invocation[],
  shipped: ReadonlyMap<string, string>,
): { readonly bodies: TaughtBody[]; readonly unparsed: string[] } {
  const bodies: TaughtBody[] = [];
  const unparsed: string[] = [];
  for (const call of calls.filter((entry) => entry.verb === "q")) {
    const rest = call.rest.trim();
    const quoted = /^'(?<body>[^']*)'/u.exec(rest)?.groups?.body;
    const file = /^"\$\(cat (?<path>[^)]+)\)"/u.exec(rest)?.groups?.path;
    const body =
      quoted ?? (file === undefined ? undefined : shipped.get(posix.basename(file))?.trimEnd());
    if (body === undefined && /^['"]/u.test(rest) && file === undefined) {
      unparsed.push(`${call.file}: ${call.segment}`);
      continue;
    }
    if (body === undefined || /^<[\w -]+>$/u.test(body)) continue;
    const values = [...rest.matchAll(/--params(?:\s+|=)(?<value>'[^']*'|\S+)/gu)].map(
      (match) => match.groups?.value ?? "",
    );
    if (values.some((value) => !value.startsWith("'") || value.includes("<"))) continue;
    const params =
      values.length === 0
        ? undefined
        : (Object.assign(
            {},
            ...values.map((value) => JSON.parse(value.slice(1, -1)) as Record<string, unknown>),
          ) as Record<string, unknown>);
    bodies.push({ file: call.file, body, params, root: rootSelection(call) });
  }
  return { bodies, unparsed };
}

/** The bodies a teaching text's commands carry, and the quoted ones no check could read. */
export function taughtQueryBodies(text: string): {
  readonly bodies: readonly string[];
  readonly unparsed: readonly string[];
} {
  const verbs = usageLines();
  const { bodies, unparsed } = taughtBodies(
    codeSegments({ path: "probe.md", text }).flatMap((segment) => invocations(segment, verbs)),
    new Map(),
  );
  return { bodies: bodies.map((taught) => taught.body), unparsed };
}

let checkoutExtraction: ExtractionResult | undefined;
let exampleExtraction: ExtractionResult | undefined;
let shippedExtraction: ExtractionResult | undefined;

/** The exclusions the reading runner applies to this checkout, read from the runner itself. */
async function checkoutExclusions(): Promise<readonly string[]> {
  const runner = (await import(pathToFileURL(join(readingScripts, "q.mjs")).href)) as {
    sourceCheckoutExclusions: readonly string[];
  };
  return runner.sourceCheckoutExclusions;
}

async function checkoutGraph(): Promise<ExtractionResult> {
  checkoutExtraction ??= extract({
    root: repoRoot,
    exclude: [...(await checkoutExclusions())],
  });
  return checkoutExtraction;
}

function exampleGraph(): ExtractionResult {
  exampleExtraction ??= extract({
    root: join(repoRoot, "examples/checkout-v1"),
  });
  return exampleExtraction;
}

/**
 * The Protocol's Specs as the package ships them: the graph an adopter's citations resolve in,
 * and the one `--protocol` selects in a project.
 */
function packageExtraction(): ExtractionResult {
  shippedExtraction ??= extract({ root: join(repoRoot, "specs") });
  return shippedExtraction;
}

function packageGraph(): GraphSchema {
  return packageExtraction().graph;
}

/** Runs a body through the real `sdp q` argv seam over a prepared extraction. */
async function runBody(
  body: string,
  params: Record<string, unknown> | undefined,
  extraction: ExtractionResult,
): Promise<{
  readonly exitCode: number;
  readonly stderr: string;
  readonly answer: unknown;
}> {
  const capture = createCaptureOutput();
  const exitCode = await runSdpCli(
    [
      "q",
      body,
      "--root",
      repoRoot,
      "--json",
      ...(params === undefined ? [] : ["--params", JSON.stringify(params)]),
    ],
    capture.output,
    {
      query: {
        extract: () => extraction,
        isStdinTty: () => true,
        readStdin: () => {
          throw new Error("a taught body reaches the sink on argv");
        },
      },
    },
  );
  const stdout = capture.readStdout();
  return {
    exitCode,
    stderr: capture.readStderr(),
    answer: stdout === "" ? undefined : (JSON.parse(stdout) as unknown),
  };
}

/**
 * A taught body's answer that is no answer: a refused parameter, a subject the graph lacks, a
 * refusal that answers with its diagnostics alone, or a list whose every row is one of those.
 */
export function emptyHanded(answer: unknown): string | undefined {
  if (Array.isArray(answer)) {
    const rows = answer.map(emptyHanded);
    return rows.length > 0 && rows.every((row) => row !== undefined)
      ? `every row: ${rows[0] ?? ""}`
      : undefined;
  }
  if (typeof answer !== "object" || answer === null) return undefined;
  const record = answer as Record<string, unknown>;
  if ("unknownParams" in record) return "unknownParams";
  if (record.found === false) return "found: false";
  const keys = Object.keys(record);
  if (keys.length === 1 && Array.isArray(record.diagnostics) && record.diagnostics.length > 0)
    return "diagnostics";
  return undefined;
}

/** True when a `files` entry of package.json packs the path or something beneath it. */
function packed(path: string, patterns: readonly string[]): boolean {
  const directory =
    existsSync(join(repoRoot, path)) && statSync(join(repoRoot, path)).isDirectory();
  return patterns.some((pattern) => {
    const base = pattern.replace(/\/\*\*(?:\/\*[^/]*)?$/u, "");
    if (base === pattern) return pattern === path || (directory && pattern.startsWith(`${path}/`));
    if (path === base || (directory && base.startsWith(`${path}/`))) return true;
    if (!path.startsWith(`${base}/`)) return false;
    const suffix = /\/\*\*\/\*(?<ext>\.[\w.]+)$/u.exec(pattern)?.groups?.ext;
    return suffix === undefined || directory || path.endsWith(suffix);
  });
}

/**
 * The catalog's size, in digits or in words up to ninety-nine, followed within three words by
 * `recipes`: a quoted size goes stale when the catalog grows. Any other count is a subset, such as
 * "five shipped recipes", and passes. A number that names recipes, after `recipe` or `recipes` or
 * after another such number through a list or range joiner, is the recipe's own number.
 */
export function catalogSizePattern(size: number): RegExp {
  const ones = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = ["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const ten = tens[Math.floor(size / 10) - 2];
  const one = ones[(size % 10) - 1];
  const word =
    size >= 1 && size < 20
      ? ones[size - 1]
      : ten === undefined
        ? undefined
        : one === undefined
          ? ten
          : String.raw`${ten}[- ]${one}`;
  const spelled = [String(size), ...(word === undefined ? [] : [word])].join("|");
  const recipeOwnNumber = String.raw`(?<!\brecipes?\s+(?:\d+\s*(?:,|-|–|to|and|or)\s*)*)`;
  return new RegExp(
    `${recipeOwnNumber}\\b(?:${spelled})\\b(?:\\s+[\\w-]+){0,3}?\\s+recipes\\b`,
    "iu",
  );
}

/**
 * Where `text` puts a recipe's number beside another recipe's catalog title: after the number
 * ("recipe 21, The roadmap") or before it ("the design slice (recipe 29)"). Any other words
 * after "recipe N, " pass, capitalized or not. Whitespace in `text` is already flattened.
 */
export function misnamedRecipes(
  text: string,
  headings: ReadonlyMap<number, string>,
): readonly string[] {
  const byLength = [...headings].sort((left, right) => right[1].length - left[1].length);
  const misses: string[] = [];
  for (const match of text.matchAll(/\brecipe (?<ordinal>\d+), (?<after>[^,.;:()]+)/giu)) {
    const after = (match.groups?.after ?? "").toLowerCase();
    const named = byLength.find(([, title]) => after.startsWith(title.toLowerCase()));
    if (named !== undefined && named[0] !== Number(match.groups?.ordinal)) {
      misses.push(`"${match[0]}" names recipe ${String(named[0])}`);
    }
  }
  for (const match of text.matchAll(/(?<before>[\p{L}\p{N} -]+) \(recipe (?<ordinal>\d+)\)/giu)) {
    const before = (match.groups?.before ?? "").toLowerCase();
    const named = byLength.find(([, title]) => before.endsWith(title.toLowerCase()));
    if (named !== undefined && named[0] !== Number(match.groups?.ordinal)) {
      misses.push(`"${match[0]}" names recipe ${String(named[0])}`);
    }
  }
  return misses;
}

/**
 * True for a copied command line that starts with a bare `sdp`, which may be macOS's unrelated
 * binary. `npx sdp <verb>` and `pnpm exec sdp <verb>` run the project's installed package.
 */
export function bareInvocation(line: string): boolean {
  return /^sdp\b/u.test(line);
}

/** The catalog's numbered headings: each recipe's number and name. */
export function catalogHeadings(): ReadonlyMap<number, string> {
  const catalog = readFileSync(join(repoRoot, catalogPath), "utf8");
  return new Map(
    [...catalog.matchAll(/^## (?<ordinal>\d+)\. (?<title>.+)$/gmu)].map((match) => [
      Number(match.groups?.ordinal),
      (match.groups?.title ?? "").trim(),
    ]),
  );
}

/**
 * What the content checks read: the files taken as one teaching text, where `<skill-dir>/` paths
 * resolve, the on-ramp Specs whose law must be cited, and whether the files ship in the package.
 */
interface Teaching {
  readonly files: readonly SkillFile[];
  /** The skill folder `<skill-dir>/` stands for; a file outside the skills has none. */
  readonly skillName?: string;
  /** The on-ramp Specs whose `dependsOn`, `decidedBy` and `constrainedBy` targets are cited. */
  readonly realized: readonly string[];
  /** A shipped file names only package files that ship; a checkout file names what exists here. */
  readonly shipped: boolean;
}

// The checks below are the executable suite that asserts the shape every shipped skill keeps in its
// documents, so they carry the skill shape's realization anchor (`spec:model.anchors`, document
// realization). The skill is the deliverable; its Markdown files are pieces of it.
const skillShapeImplementationAnchor = codeAnchor({
  id: codeAnchorId("impl:protocol.skill-shape"),
  label: "asserts realization of the shape every shipped skill document keeps",
  satisfies: ref("spec:consumers.shipped-protocol-corpus"),
});
void skillShapeImplementationAnchor;

const skillShapeTestAnchor = specTest({
  id: testAnchorId("test:protocol.skill-shape"),
  label: "skill-shape checks verify every shipped skill against the shared shape",
  verifies: ref("spec:consumers.shipped-protocol-corpus"),
});
void skillShapeTestAnchor;

/** Registers the generic checks for one skill folder under `skills/`. */
export function describeOnRamp(skillName: string, options: OnRampOptions = {}): void {
  describe(`the ${skillName} skill's shape`, () => {
    // G1: a client skips a skill whose frontmatter it cannot read.
    it("carries Agent Skills frontmatter named for its folder and names the Specs it realizes", () => {
      const { frontmatter } = readSkill(skillName);
      const description = frontmatter.description;
      const compatibility = frontmatter.compatibility;
      const metadata = frontmatter.metadata;

      expect(
        Object.keys(frontmatter).filter((field) => !agentSkillsFields.includes(field)),
      ).toEqual([]);
      expect(frontmatter.name).toBe(skillName);
      expect(skillName).toMatch(/^(?!.*--)[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/u);
      expect(typeof description).toBe("string");
      expect(String(description).trim()).not.toBe("");
      expect(String(description).length).toBeLessThanOrEqual(limits.description);
      expect(typeof compatibility === "string" ? compatibility.length : 0).toBeLessThanOrEqual(500);
      // Agent Skills metadata maps string keys to string values.
      expect(
        Object.values(typeof metadata === "object" && metadata !== null ? metadata : {}).every(
          (value) => typeof value === "string",
        ),
      ).toBe(true);
      const realized = realizedSpecs(frontmatter);
      expect(realized.length).toBeGreaterThan(0);
      if (options.realizes !== undefined) {
        expect([...realized].sort()).toEqual([...options.realizes].sort());
      }
    });

    // G3: steps and early hazards stay in SKILL.md; each branch's material sits one level below.
    it("keeps SKILL.md short and discloses each reference one level below it", () => {
      const { entry, references } = readSkill(skillName);
      const bytes = (file: SkillFile) => Buffer.byteLength(file.text, "utf8");
      const entryLinks = markdownLinkTargets(entry.text)
        .map(({ target }) => linkedPath(entry.path, target))
        .filter((path) => path !== undefined);

      expect(bytes(entry)).toBeLessThanOrEqual(limits.entryBytes);
      expect(entry.text.split("\n").length).toBeLessThanOrEqual(limits.entryLines);
      // Links stay inside the plugin: this skill's references, or a sibling skill's files.
      expect(entryLinks.filter((path) => !path.startsWith("skills/"))).toEqual([]);
      for (const reference of references) {
        expect({
          reference: reference.path,
          markdown: reference.path.endsWith(".md"),
        }).toEqual({
          reference: reference.path,
          markdown: true,
        });
        expect({
          reference: reference.path,
          bytes: bytes(reference) <= limits.referenceBytes,
        }).toEqual({ reference: reference.path, bytes: true });
        // An unlinked reference is unreachable from the skill a client loads.
        expect({
          reference: reference.path,
          linked: entryLinks.includes(reference.path),
        }).toEqual({ reference: reference.path, linked: true });
      }
    });

    describeContentChecks(() => {
      const { files, frontmatter } = readSkill(skillName);
      return { files, skillName, realized: realizedSpecs(frontmatter), shipped: true };
    });
  });
}

/**
 * Registers the content checks for a teaching file outside the skills, such as the handbook: its
 * pointers, citations, recipe names, commands, inline bodies and quoted counts.
 */
export function describeHandbook(path: string): void {
  describe(`the ${path} handbook's content`, () => {
    describeContentChecks(() => ({ files: [read(path)], realized: [], shipped: false }));
  });
}

/** The checks a skill and a handbook share: G4 to G8 and G11. */
function describeContentChecks(teaching: () => Teaching): void {
  // G4: a pointer that misses leaves the disclosed material unreachable, and nothing reports it.
  it("resolves every link, sibling-skill path, skill name and package file it names", () => {
    const { files, skillName, shipped } = teaching();
    const patterns = (
      JSON.parse(readFileSync(join(repoRoot, "package.json"), "utf8")) as {
        files: string[];
      }
    ).files;
    const exists = (path: string) => existsSync(join(repoRoot, path));
    const misses: string[] = [
      ...danglingLinks(new Map(files.map((file) => [file.path, file.text])), exists, (path) =>
        /\.md$/iu.test(path) && exists(path)
          ? readFileSync(join(repoRoot, path), "utf8")
          : undefined,
      ),
    ];

    for (const segment of files.flatMap(codeSegments)) {
      if (
        /^sdp-[a-z]+(?:-[a-z]+)*$/u.test(segment.text) &&
        !exists(`skills/${segment.text}/SKILL.md`)
      ) {
        misses.push(`${segment.file}: skill ${segment.text}`);
      }
      for (const raw of segment.text.split(/\s+/u).map(bareToken)) {
        // `<skill-dir>` stands for the calling skill's own directory, as the reading skill defines it.
        const token = raw.replace(/^<skill-dir>\//u, "");
        if (
          raw !== token &&
          !token.startsWith("../") &&
          (skillName === undefined || !exists(`skills/${skillName}/${token}`))
        ) {
          misses.push(`${segment.file}: skill path ${raw}`);
        }
        const sibling = /^\.\.\/(?<skill>sdp-[a-z-]+)\/(?<path>\S+)$/u.exec(token)?.groups;
        if (
          sibling !== undefined &&
          !exists(`skills/${sibling.skill ?? ""}/${sibling.path ?? ""}`)
        ) {
          misses.push(`${segment.file}: sibling path ${token}`);
        }
        const named = token.startsWith(packagePrefix) ? token.slice(packagePrefix.length) : token;
        const packageFile =
          /^(?:CONTEXT\.md|plugin\.json|(?:docs|dist|schemas|specs)(?:\/[^\s<>*#]*)?)(?:#[^\s<>*#]+)?$/u;
        if (named.includes("<") || !packageFile.test(named)) continue;
        const [file = named, fragment] = named.split("#");
        const path = file.replace(/\/$/u, "");
        if (!exists(path) || (shipped && !packed(path, patterns))) {
          misses.push(`${segment.file}: package file ${token}`);
        } else if (fragment !== undefined && /\.md$/iu.test(path)) {
          // A category or entry of the catalog, or a section of another page, by its anchor.
          const anchors = markdownAnchors(readFileSync(join(repoRoot, path), "utf8"));
          if (!anchors.has(fragment) && !anchors.has(fragment.toLowerCase()))
            misses.push(`${segment.file}: package anchor ${token}`);
        }
      }
    }
    expect(misses).toEqual([]);
  });

  // G5: a stale citation sends the reader to law that is gone; an uncited relation target is law
  // the skill no longer teaches in place. Fenced carriers and anchors are syntax examples, and
  // their ids name an example domain.
  it("cites only Specs and entry addresses that resolve, among them every law its on-ramps rest on", async () => {
    const { files, realized } = teaching();
    const cited = [
      ...new Set(
        [
          ...files
            .map((file) => splitFences(file.text).prose)
            .join("\n")
            .matchAll(/spec:[a-z][a-z0-9-]*(?:\.[a-z0-9-]+)*(?:#[a-z]+\.[A-Za-z0-9]+)?/gu),
        ].map((match) => match[0]),
      ),
    ];
    const ids = [...new Set(cited.map((reference) => reference.split("#")[0] ?? reference))];
    const addresses = cited.filter((reference) => reference.includes("#"));
    const graph = packageGraph();
    const reader = createReader(graph);

    expect(ids.filter((id) => reader.specContext(id) === undefined)).toEqual([]);
    if (addresses.length > 0) {
      const resolution = (await evaluateBody("return recipes(25, params)", {
        graph,
        params: { addresses },
      })) as { rows: { address: string; resolves: boolean }[] };
      expect(resolution.rows.filter((row) => !row.resolves).map((row) => row.address)).toEqual([]);
      expect(resolution.rows).toHaveLength(addresses.length);
    }
    const law = graph.edges
      .filter((edge) => realized.includes(edge.from) && lawRelations.has(edge.type))
      .map((edge) => edge.to);
    expect([...new Set(law)].filter((id) => !ids.includes(id))).toEqual([]);
  });

  // G6: a wrong number runs another recipe and reads its answer as this one's.
  it("names recipes and orientation answers by their catalog numbers, names and files", () => {
    const { files } = teaching();
    const headings = catalogHeadings();
    const shippedNames = new Set(
      recipeFiles(readFileSync(join(repoRoot, catalogPath), "utf8")).map((file) => file.fileName),
    );
    const answers = readdirSync(join(readingScripts, "orientation")).filter((name) =>
      /^\d{2}-[a-z0-9-]+\.js$/u.test(name),
    ).length;
    const misses: string[] = [];

    for (const file of files) {
      const text = file.text.replaceAll(/\s+/gu, " ");
      const miss = (what: string) => misses.push(`${file.path}: ${what}`);
      for (const match of text.matchAll(
        /\brecipes? (?<list>\d+(?:(?:,| and| or| to|-|–) ?\d+)*)/giu,
      )) {
        for (const ordinal of (match.groups?.list ?? "").match(/\d+/gu) ?? []) {
          if (!headings.has(Number(ordinal))) miss(`recipe ${ordinal} is not in the catalog`);
        }
      }
      for (const match of text.matchAll(/\brecipes\((?<ordinal>\d+)/gu)) {
        if (!headings.has(Number(match.groups?.ordinal)))
          miss(`recipes(${match.groups?.ordinal ?? ""})`);
      }
      for (const misnamed of misnamedRecipes(text, headings)) miss(misnamed);
      for (const match of text.matchAll(/\bdist\/recipes\/(?<name>[^\s`'")<]+\.js)/gu)) {
        if (!shippedNames.has(match.groups?.name ?? ""))
          miss(`dist/recipes/${match.groups?.name ?? ""}`);
      }
      for (const match of text.matchAll(/(?:\borientation|--only) (?<ordinal>\d+)/giu)) {
        const ordinal = Number(match.groups?.ordinal);
        if (ordinal < 1 || ordinal > answers) miss(`orientation ${String(ordinal)}`);
      }
    }
    // A recipe a taught body runs is named by its shipped file, so the agent can run that file
    // (`spec:consumers.shipped-protocol-corpus#rule.skillShape`). Whether a prose mention tells
    // the agent to run a recipe is left to the reader.
    const shippedFiles = new Set(
      files.flatMap((file) =>
        [...file.text.matchAll(/\bdist\/recipes\/(?<ordinal>\d+)-/gu)].map((match) =>
          Number(match.groups?.ordinal),
        ),
      ),
    );
    for (const segment of files.flatMap(codeSegments)) {
      for (const match of segment.text.matchAll(/\brecipes\((?<ordinal>\d+)/gu)) {
        if (!shippedFiles.has(Number(match.groups?.ordinal)))
          misses.push(`${segment.file}: recipes(${match.groups?.ordinal ?? ""}) without its file`);
      }
    }
    expect(misses).toEqual([]);
  });

  // G7: an unknown flag fails late or silently; a bare `sdp` runs another program; a body in
  // double quotes is shell-expanded before the sink sees it; a checkout form without the
  // fixture exclusions derives another graph.
  it("invokes only public verbs and their flags through a runner, bodies quoted as data", async () => {
    const { files } = teaching();
    const verbs = usageLines();
    const orient = scriptUsage("orient");
    const runner = scriptUsage("q");
    const exclusions = await checkoutExclusions();
    const misses: string[] = [];

    for (const segment of files.flatMap(codeSegments)) {
      // A copied line runs as written, and `sdp` alone may be macOS's unrelated binary.
      if (segment.fenced && bareInvocation(segment.text)) {
        misses.push(`${segment.file}: bare invocation ${segment.text}`);
      }
      if (/(?:sdp:q|\bq\.mjs|\bsdp q) "(?!\$\(cat )/u.test(segment.text)) {
        misses.push(`${segment.file}: double-quoted body ${segment.text}`);
      }
      for (const call of invocations(segment, verbs)) {
        // The runner takes its own flags (`--protocol`) beside the `sdp q` it wraps.
        const usage =
          call.verb === "orient"
            ? orient
            : call.runner
              ? `${runner} ${verbs.get("q") ?? ""}`
              : verbs.get(call.verb);
        if (usage === undefined) {
          misses.push(`${call.file}: unknown verb sdp ${call.verb}`);
          continue;
        }
        for (const flag of flagsOf(call.rest)) {
          if (flag !== "--help" && !new RegExp(`${flag}(?![a-z-])`, "u").test(usage)) {
            misses.push(`${call.file}: ${call.verb} takes no ${flag}`);
          }
        }
        // This checkout's own `sdp` script at its root needs the runner's fixture exclusions.
        if (segment.text.startsWith("pnpm --silent sdp ") && /\s\.(?:\s|$)/u.test(call.rest)) {
          for (const path of exclusions) {
            if (!call.rest.includes(`--exclude ${path}`)) {
              misses.push(`${call.file}: checkout form lacks --exclude ${path}`);
            }
          }
        }
      }
    }
    expect(misses).toEqual([]);
  });

  // G8: a taught body that no longer runs teaches nothing, and no reader notices; one that runs
  // only over the corpus its writer had open fails the reader who copies it elsewhere.
  it("runs every inline body it teaches over the graph its call selects", async () => {
    const { files } = teaching();
    const verbs = usageLines();
    const shipped = new Map(
      recipeFiles(readFileSync(join(repoRoot, catalogPath), "utf8")).map((file) => [
        file.fileName,
        file.content,
      ]),
    );
    const { bodies, unparsed } = taughtBodies(
      files.flatMap(codeSegments).flatMap((segment) => invocations(segment, verbs)),
      shipped,
    );
    expect(unparsed).toEqual([]);
    const checkout = await checkoutGraph();
    const failures: unknown[] = [];

    for (const taught of bodies) {
      // Each call runs over the graph its root selection derives. A project's call runs here and
      // in an adopter, where the worked example stands in for the adopter's corpus, so a subject
      // it names must live there; only the checkout's own form may name the checkout's Specs.
      const corpora: [string, ExtractionResult][] =
        taught.root === "checkout"
          ? [["checkout", checkout]]
          : taught.root === "protocol"
            ? [["shipped specs", packageExtraction()]]
            : taught.params === undefined
              ? [
                  ["checkout", checkout],
                  ["checkout-v1", exampleGraph()],
                ]
              : [["checkout-v1", exampleGraph()]];
      for (const [corpus, extraction] of corpora) {
        const run = await runBody(taught.body, taught.params, extraction);
        const empty = emptyHanded(run.answer);
        if (run.exitCode !== 0 || empty !== undefined) {
          failures.push({
            file: taught.file,
            corpus,
            body: taught.body,
            exitCode: run.exitCode,
            empty,
            stderr: run.stderr,
          });
        }
      }
    }
    expect(failures).toEqual([]);
  }, 120_000);

  // G11: a derived count quoted in prose goes stale and is read as truth.
  it("quotes no recipe-catalog size", () => {
    const { files } = teaching();
    const size = catalogHeadings().size;
    const sizeStatement = catalogSizePattern(size);
    const wholeRange = new RegExp(`\\brecipes 1 ?(?:-|–|to) ?${String(size)}\\b`, "iu");
    for (const file of files) {
      const text = teachingText(file.text);
      expect({
        file: file.path,
        stated: sizeStatement.exec(text)?.[0] ?? null,
      }).toEqual({
        file: file.path,
        stated: null,
      });
      expect({
        file: file.path,
        wholeRange: wholeRange.exec(text)?.[0] ?? null,
      }).toEqual({
        file: file.path,
        wholeRange: null,
      });
    }
  });
}
