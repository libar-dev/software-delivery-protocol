import { watchSourceAnchorContract } from "../generated/contracts/consumers.obsidian-vault.iteration.watch-source-anchor.contract.js";
import { registerWatchSourceAnchor } from "./consumers.obsidian-vault.iteration.watch-source-anchor.test.generated.js";
import { watchRewritesChangedNotesContract } from "../generated/contracts/consumers.obsidian-vault.iteration.watch-rewrites-changed-notes.contract.js";
import { registerWatchRewritesChangedNotes } from "./consumers.obsidian-vault.iteration.watch-rewrites-changed-notes.test.generated.js";
import { viewsMatchSourcesContract } from "../generated/contracts/consumers.obsidian-vault.bases.views-match-sources.contract.js";
import { registerViewsMatchSources } from "./consumers.obsidian-vault.bases.views-match-sources.test.generated.js";
import { caseCollisionRefusedContract } from "../generated/contracts/consumers.obsidian-vault.notes.case-collision-refused.contract.js";
import { termAddressLinkContract } from "../generated/contracts/consumers.obsidian-vault.notes.term-address-link.contract.js";
import { unresolvedMentionStaysContract } from "../generated/contracts/consumers.obsidian-vault.notes.unresolved-mention-stays.contract.js";
import { entryAddressLinkContract } from "../generated/contracts/consumers.obsidian-vault.notes.entry-address-link.contract.js";
import { failedExtractionRecoveredContract } from "../generated/contracts/consumers.obsidian-vault.failed-extraction-recovered.contract.js";
import { failedExtractionKeepsNotesContract } from "../generated/contracts/consumers.obsidian-vault.failed-extraction-keeps-notes.contract.js";
import { interruptedRunRecoveredContract } from "../generated/contracts/consumers.obsidian-vault.interrupted-run-recovered.contract.js";
import { vaultInBuildPathRefusedContract } from "../generated/contracts/consumers.obsidian-vault.vault-in-build-path-refused.contract.js";
import { hiddenFileRefusedContract } from "../generated/contracts/consumers.obsidian-vault.hidden-file-refused.contract.js";
import { changedNoteRefusedContract } from "../generated/contracts/consumers.obsidian-vault.changed-note-refused.contract.js";
import { unknownNoteRefusedContract } from "../generated/contracts/consumers.obsidian-vault.unknown-note-refused.contract.js";
import { personNotesSurviveContract } from "../generated/contracts/consumers.obsidian-vault.person-notes-survive.contract.js";
import { freshVaultContract } from "../generated/contracts/consumers.obsidian-vault.fresh-vault.contract.js";
import { specTest, testAnchorId, ref } from "@libar-dev/software-delivery-protocol";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { spawn } from "node:child_process";
import { expect, it } from "vitest";
import { parse } from "yaml";
import { runSdpCli } from "../src/cli/sdp.js";
import { renderVault } from "../src/projections/vault/notes.js";
import { inspectVault, temporary } from "../src/projections/vault/sync.js";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import { evaluateBody } from "../src/reader/evaluate-body.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import {
  bytes,
  carrier,
  checkLinks,
  clauseMatches,
  probe,
  put,
  readNotes,
  snapshot,
} from "./helpers/vault-probe.js";
import { specOracle, oracleAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";
import type {
  ExampleContract,
  ParamShape,
  StepBindings,
} from "@libar-dev/software-delivery-protocol/runner";
import type { RunnableExampleAdapters } from "@libar-dev/software-delivery-protocol/testing";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  ObsidianVaultConditions,
  ObsidianVaultOutcome,
} from "../generated/contracts/consumers.obsidian-vault.space.js";
import type {
  NotesConditions,
  NotesOutcome,
} from "../generated/contracts/consumers.obsidian-vault.notes.space.js";
import type {
  BasesConditions,
  BasesOutcome,
} from "../generated/contracts/consumers.obsidian-vault.bases.space.js";
import type {
  IterationConditions,
  IterationOutcome,
} from "../generated/contracts/consumers.obsidian-vault.iteration.space.js";

// These authored points intentionally bind alternative subsets of the parent vocabulary.
// The registrar requires every parent dimension, so these use the lower-level step adapter.
function partialExample<P, O extends { readonly kind: string }>(
  contract: ExampleContract<string, Record<string, ParamShape>>,
  adapters: RunnableExampleAdapters<World<P>, P, O>,
): void {
  const point = Object.assign(
    {},
    ...contract.steps.filter((s) => s.kind !== "then").map((s) => s.params),
  ) as Partial<P>;
  interface Execution {
    world: World<P>;
    invoked: boolean;
    compared: boolean;
  }
  const bindings: StepBindings<Execution, string, Record<string, ParamShape>> = Object.fromEntries(
    contract.steps.map((step) => [
      step.key,
      async (execution: Execution, params: ParamShape) => {
        if (step.kind === "when" && !execution.invoked) {
          execution.invoked = true;
          await adapters.invoke(execution.world, point);
        }
        if (step.kind === "then") {
          const oracle = adapters.expected(point);
          if (oracle.kind === step.key) {
            const { kind, ...payload } = oracle;
            void kind;
            expect(params).toEqual(payload);
            expect(adapters.observe(execution.world)).toEqual(oracle);
            execution.compared = true;
          }
        }
      },
    ]),
  );
  bindExample(
    contract,
    () => ({ world: adapters.createWorld(point), invoked: false, compared: false }),
    bindings,
    async (execution) => {
      expect(execution.compared).toBe(true);
      await adapters.assertions?.(execution.world, adapters.observe(execution.world));
    },
  );
}

interface Contract {
  readonly steps: readonly {
    readonly kind: string;
    readonly params: Readonly<Record<string, unknown>>;
  }[];
}
interface World<P> {
  readonly point: Partial<P>;
  answer: Record<string, unknown>;
}
const world = <P>(point: Partial<P>): World<P> => ({ point, answer: {} });
function assertThens(
  c: Contract,
  actual: Record<string, unknown>,
  expected: Record<string, unknown>,
): void {
  for (const step of c.steps.filter((s) => s.kind === "then"))
    for (const [key, value] of Object.entries(step.params)) {
      expect(actual[key], key).toEqual(expected[key]);
      expect(value, key).toEqual(expected[key]);
    }
}
const vaultOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.vault"),
  models: ref("spec:consumers.obsidian-vault"),
});
void vaultOracle;
function vaultExpected(p: Partial<ObsidianVaultConditions>): Record<string, unknown> {
  const extra: string = p.extra ?? "";
  const refused =
    extra.includes("inside the generated folder") || extra === "a generated note a person changed";
  const hidden = extra.includes("temporary");
  return {
    exitCode: Number(
      refused || p.out !== undefined || p.change === "has a carrier the extractor refuses",
    ),
    memberNote: refused || p.change !== "leaves the corpus",
    personFilesKept: true,
    linksResolve: true,
    byteIdentical: true,
    matchesFresh: true,
    indexWarns: p.change === "has a carrier the extractor refuses",
    listMatches: true,
    placement: "overlapping a path the build owns",
    refusedPath: hidden
      ? "sdp/specs/probe/.spec.probe.member.md.sdp-tmp"
      : extra === "a generated note a person changed"
        ? "sdp/specs/probe/spec.probe.member.md"
        : "sdp/specs/probe/mine.md",
    refusal: extra === "a generated note a person changed" ? "changed" : "unknown",
  };
}
const vaultAdapters = (contract: Contract) => ({
  createWorld: world<ObsidianVaultConditions>,
  async invoke(w: World<ObsidianVaultConditions>) {
    const root = mkdtempSync(join(tmpdir(), "sdp-vault-example-"));
    const fresh = mkdtempSync(join(tmpdir(), "sdp-vault-fresh-"));
    try {
      probe(root);
      const out = join(root, w.point.out ?? "generated/obsidian-vault");
      const run = async () => {
        const c = createCaptureOutput();
        const exitCode = await runSdpCli(["vault", root, "--out", out], c.output);
        return { exitCode, stderr: c.readStderr() };
      };
      if (w.point.generated !== "nothing") expect((await run()).exitCode).toBe(0);
      const person = new Map<string, string>();
      const add = (path: string, content: string) => {
        put(join(out, path), content);
        person.set(path, content);
      };
      if (w.point.extra?.startsWith("an intent")) {
        add("intent/pass.md", "Read this exact intent.\n");
        add(".obsidian/app.json", "{}\n");
      }
      if (w.point.extra === "a note a person wrote inside the generated folder")
        add("sdp/specs/probe/mine.md", "Mine.\n");
      if (w.point.extra?.includes("temporary"))
        add("sdp/specs/probe/.spec.probe.member.md.sdp-tmp", "Mine, not a temporary.\n");
      if (w.point.extra === "a generated note a person changed")
        add("sdp/specs/probe/spec.probe.member.md", "My changes.\n");
      if (w.point.generated === "the files a run whose extraction failed left") {
        put(join(root, "member.sdp.md"), "---\ninvalid: true\n---\n# Broken\n");
        expect((await run()).exitCode).toBe(1);
        probe(root);
      }
      if (w.point.change === "leaves the corpus") {
        rmSync(join(root, "member.sdp.md"));
        put(
          join(root, "probe.pack.sdp.md"),
          "---\nid: pack:probe\nspecs: [spec:probe.other]\n---\n# Probe\n",
        );
      }
      if (w.point.change === "changes its title") probe(root, "Changed");
      if (w.point.change === "has a carrier the extractor refuses")
        put(join(root, "member.sdp.md"), "---\ninvalid: true\n---\n# Broken\n");
      if (w.point.generated === "the files a run stopped at its first rename left") {
        const capture = createCaptureOutput();
        expect(
          await runSdpCli(["vault", root], capture.output, {
            vaultRename() {
              throw new Error("injected first rename failure");
            },
          }),
        ).toBe(1);
        expect(inspectVault(out).list.files["specs/probe/spec.probe.member.md"]).toHaveLength(2);
        expect(inspectVault(out).temporaries).toEqual([
          "specs/probe/.spec.probe.member.md.sdp-tmp",
        ]);
      }
      const prior = bytes(join(out, "sdp"));
      const result = await run();
      w.answer = {
        exitCode: result.exitCode,
        personFilesKept: [...person].every(
          ([p, content]) => readFileSync(join(out, p), "utf8") === content,
        ),
        memberNote: existsSync(join(out, "sdp/specs/probe/spec.probe.member.md")),
      };
      if (result.exitCode === 1 && !result.stderr.includes("extract")) {
        const match = /sdp vault: (sdp\/.*?) .*\((unknown|changed)\)/u.exec(result.stderr);
        w.answer.refusedPath = match?.[1];
        w.answer.refusal = match?.[2];
        if (w.point.out)
          w.answer.placement = result.stderr.includes("overlaps")
            ? "overlapping a path the build owns"
            : "inside the extraction";
      }
      if (w.point.change !== "has a carrier the extractor refuses" && result.exitCode === 0) {
        w.answer.linksResolve = checkLinks(out) > 0;
        const first = snapshot(join(out, "sdp"));
        expect((await run()).exitCode).toBe(0);
        w.answer.byteIdentical = isDeepStrictEqual(first, snapshot(join(out, "sdp")));
        const graph = extract({ root }).graph;
        const state = inspectVault(out);
        // Fresh synchronization is independent of prior list history.
        const { synchronizeVault } = await import("../src/projections/vault/sync.js");
        synchronizeVault(fresh, renderVault(graph));
        w.answer.matchesFresh = isDeepStrictEqual(
          bytes(join(out, "sdp")),
          bytes(join(fresh, "sdp")),
        );
        expect(state.temporaries).toEqual([]);
      } else if (
        w.point.extra?.includes("inside the generated folder") ||
        w.point.extra === "a generated note a person changed"
      )
        expect(bytes(join(out, "sdp"))).toEqual(prior);
      if (existsSync(join(out, "sdp/index.md")))
        w.answer.indexWarns = readFileSync(join(out, "sdp/index.md"), "utf8").startsWith(
          "> [!warning]",
        );
      if (w.point.change === "has a carrier the extractor refuses") {
        inspectVault(out);
        w.answer.listMatches = true;
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
      rmSync(fresh, { recursive: true, force: true });
    }
  },
  observe: (w: World<ObsidianVaultConditions>): ObsidianVaultOutcome => ({
    kind: "the run exits {exitCode}",
    exitCode: Number(w.answer.exitCode),
  }),
  expected: (p: Partial<ObsidianVaultConditions>): ObsidianVaultOutcome =>
    p.generated === undefined
      ? unspecified
      : { kind: "the run exits {exitCode}", exitCode: Number(vaultExpected(p).exitCode) },
  assertions: (w: World<ObsidianVaultConditions>) => {
    assertThens(contract, w.answer, vaultExpected(w.point));
  },
});
const notesOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.vault-notes"),
  models: ref("spec:consumers.obsidian-vault.notes"),
});
void notesOracle;
function notesExpected(p: Partial<NotesConditions>): Record<string, unknown> {
  const mention = p.mention ?? "";
  const rendered = mention.endsWith(".missing")
    ? mention
    : `[[sdp/specs/probe/spec.probe.target.md#^${p.termKey ? "term-limit" : "design-limit"}|${mention}]]`;
  return {
    exitCode: 1,
    named: "spec:probe.Member and spec:probe.member",
    nothingWritten: true,
    notePath: "sdp/specs/probe/spec.probe.source.md",
    rendered,
    termNotePath: "sdp/terms/term.probe.target.limit.md",
    blockId: "term-limit",
    alias: "spec:probe.source",
    plainProperties: true,
  };
}
const notesAdapters = (contract: Contract) => ({
  createWorld: world<NotesConditions>,
  async invoke(w: World<NotesConditions>) {
    const root = mkdtempSync(join(tmpdir(), "sdp-vault-notes-"));
    try {
      if (w.point.first) {
        put(join(root, "first.sdp.md"), carrier(w.point.first));
        put(join(root, "second.sdp.md"), carrier(w.point.second ?? ""));
      } else {
        put(
          join(root, "source.sdp.md"),
          carrier(w.point.source ?? "").replace(
            "## Intent",
            `Mention ${w.point.mention ?? ""}.\n\n## Intent`,
          ),
        );
        put(
          join(root, "target.sdp.md"),
          carrier(
            "spec:probe.target",
            "Target",
            w.point.termKey ? "model" : "behavior",
            "idea",
            w.point.termKey
              ? "\n## Model\n- **limit** — [#limit] A bound.\n"
              : "\n## Design\n- limit: The bound.\n",
          ),
        );
      }
      const c = createCaptureOutput();
      const exitCode = await runSdpCli(["vault", root], c.output);
      const out = join(root, "generated/obsidian-vault");
      if (w.point.first)
        w.answer = {
          exitCode,
          named: c.readStderr().includes("spec:probe.Member and spec:probe.member")
            ? "spec:probe.Member and spec:probe.member"
            : "",
          nothingWritten: Object.keys(bytes(join(out, "sdp"))).length === 0,
        };
      else {
        const path = "sdp/specs/probe/spec.probe.source.md";
        const content = readFileSync(join(out, path), "utf8");
        const mentionLine = content.split("\n").find((line) => line.startsWith("Mention ")) ?? "";
        w.answer = {
          notePath: path,
          rendered: mentionLine.slice("Mention ".length, -1),
          alias:
            readNotes(out).find((n) => n.path === path)?.props.aliases instanceof Array
              ? (readNotes(out).find((n) => n.path === path)?.props.aliases as unknown[])[0]
              : "",
          plainProperties: readNotes(out).every((n) =>
            Object.entries(n.props).every(
              ([key, value]) =>
                key === "aliases" ||
                !/"(?:spec|pack|impl|api|component|test|oracle):[^\s"]*"/u.exec(
                  JSON.stringify(value),
                ),
            ),
          ),
        };
        if (w.point.termKey) {
          w.answer.termNotePath = existsSync(join(out, "sdp/terms/term.probe.target.limit.md"))
            ? "sdp/terms/term.probe.target.limit.md"
            : "";
          w.answer.blockId = readFileSync(
            join(out, "sdp/specs/probe/spec.probe.target.md"),
            "utf8",
          ).includes(" ^term-limit")
            ? "term-limit"
            : "";
        }
        checkLinks(out);
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
  observe: (w: World<NotesConditions>): NotesOutcome =>
    w.point.first
      ? { kind: "the run exits {exitCode}", exitCode: Number(w.answer.exitCode) }
      : { kind: "the mention renders as {rendered}", rendered: String(w.answer.rendered) },
  expected: (p: Partial<NotesConditions>): NotesOutcome =>
    p.first
      ? { kind: "the run exits {exitCode}", exitCode: 1 }
      : p.mention
        ? { kind: "the mention renders as {rendered}", rendered: String(notesExpected(p).rendered) }
        : unspecified,
  assertions: (w: World<NotesConditions>) => {
    assertThens(contract, w.answer, notesExpected(w.point));
  },
});
const basesOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.vault-bases"),
  models: ref("spec:consumers.obsidian-vault.bases"),
});
void basesOracle;
interface Base {
  filters: { and: string[] };
  views: { name: string; filters?: { and: string[] } }[];
}
const basesAdapters = (contract: Contract) => ({
  createWorld: world<BasesConditions>,
  async invoke(w: World<BasesConditions>) {
    const root = mkdtempSync(join(tmpdir(), "sdp-vault-bases-"));
    try {
      const ids = ["ready", "defined", "scoped", "blocked", "decision", "idea"].map(
        (name) => `spec:probe.${name}`,
      );
      for (const name of ["ready", "defined", "scoped", "blocked", "decision", "idea"]) {
        const readiness =
          name === "ready"
            ? "ready"
            : name === "defined"
              ? "defined"
              : name === "idea"
                ? "idea"
                : "scoped";
        const extra =
          name === "blocked"
            ? "\n### Open questions\n- [blocking #hold] Who decides?\n\n## Behavior\n- rule: Keep the graph.\n"
            : name === "decision"
              ? "\n## Decision\n- context: A real choice.\n- decision: Keep it.\n"
              : (name === "idea"
                  ? "\n### Open questions\n- [non-blocking #later] A question for later.\n"
                  : "") + "\n## Behavior\n- rule: Keep the graph.\n\n## Design\n- shape: A note.\n";
        put(
          join(root, `${name}.sdp.md`),
          carrier(
            `spec:probe.${name}`,
            name,
            name === "decision" ? "decision" : "behavior",
            readiness,
            extra,
            "{dependsOn: spec:probe.defined}",
          ),
        );
      }
      put(
        join(root, "probe.pack.sdp.md"),
        `---\nid: pack:probe\nspecs: ${JSON.stringify(ids)}\n---\n# Probe\n`,
      );
      const capture = createCaptureOutput();
      expect(await runSdpCli(["vault", root], capture.output), capture.readStderr()).toBe(0);
      const graph = extract({ root }).graph,
        reader = createReader(graph);
      const out = join(root, "generated/obsidian-vault"),
        notes = readNotes(out);
      expect(notes).toHaveLength(w.point.members ?? -1);
      const base = parse(readFileSync(join(out, "sdp/specs.base"), "utf8")) as Base;
      const pack = parse(readFileSync(join(out, "sdp/packs/pack.probe.base"), "utf8")) as Base;
      const recipe = async (number: number): Promise<Record<string, unknown>> =>
        evaluateBody(`return recipes(${number});`, { graph }) as Promise<Record<string, unknown>>;
      const backlog = await recipe(1),
        design = await recipe(33),
        questions = await recipe(20),
        decisions = await recipe(31);
      const collect = (v: unknown): string[] => {
        if (Array.isArray(v)) return v.flatMap(collect);
        if (typeof v === "object" && v !== null) {
          const r = v as Record<string, unknown>;
          if (typeof r.id === "string" && r.id.startsWith("spec:")) return [r.id];
          return Object.values(r).flatMap(collect);
        }
        return [];
      };
      // The recipe's primary row collection is selected explicitly, not its counters or exclusions.
      const selections = new Map<string, string[]>([
        ["All Specs", reader.specs().map((s) => s.id)],
        ["Build backlog", collect(backlog.byFamily)],
        ["Design backlog", collect(design.rows)],
        [
          "Nothing blocks the next rung",
          reader
            .specs()
            .filter((s) => {
              const c = reader.specContext(s.id);
              return c?.statedNextRung !== undefined && c.statedNextRungFailures.length === 0;
            })
            .map((s) => s.id),
        ],
        [
          "Blocking questions",
          (questions.specs as { id: string; questions: { blocking: boolean }[] }[])
            .filter((row) => row.questions.some((question) => question.blocking))
            .map((row) => row.id),
        ],
        ["Decisions", collect(decisions.rows)],
      ]);
      // Closed filters are evaluated from the bytes on disk, separately from their sources.
      for (const view of base.views) {
        const selected = notes
          .filter((n) =>
            [...base.filters.and, ...(view.filters?.and ?? [])].every((clause) =>
              clauseMatches(clause, n),
            ),
          )
          .map((n) => String((n.props.aliases as string[])[0]))
          .sort();
        const wanted = [...new Set(selections.get(view.name) ?? [])].sort();
        expect(
          selected,
          `${view.name}; recipe shapes ${JSON.stringify({ backlog, design, questions, decisions })}`,
        ).toEqual(wanted);
      }
      for (const view of pack.views)
        for (const n of notes)
          for (const clause of [...pack.filters.and, ...(view.filters?.and ?? [])])
            clauseMatches(clause, n);
      const members = notes
        .filter((n) => pack.filters.and.every((c) => clauseMatches(c, n)))
        .map((n) => String((n.props.aliases as string[])[0]));
      w.answer = {
        viewsMatch: true,
        packMatches: isDeepStrictEqual(members.sort(), ids.sort()),
        closedClauses: true,
      };
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  },
  observe: (w: World<BasesConditions>): BasesOutcome => ({
    kind: "each standing view of the corpus Base selects the Specs its source selects: {viewsMatch}",
    viewsMatch: w.answer.viewsMatch === true,
  }),
  expected: (p: Partial<BasesConditions>): BasesOutcome =>
    p.members === undefined
      ? unspecified
      : {
          kind: "each standing view of the corpus Base selects the Specs its source selects: {viewsMatch}",
          viewsMatch: true,
        },
  assertions: (w: World<BasesConditions>) => {
    assertThens(contract, w.answer, { viewsMatch: true, packMatches: true, closedClauses: true });
  },
});
const iterationOracle = specOracle({
  id: oracleAnchorId("oracle:protocol.vault-iteration"),
  models: ref("spec:consumers.obsidian-vault.iteration"),
});
void iterationOracle;
const iterationAdapters = (contract: Contract) => ({
  createWorld: world<IterationConditions>,
  async invoke(w: World<IterationConditions>) {
    const root = mkdtempSync(join(tmpdir(), "sdp-vault-watch-"));
    probe(root);
    const child = spawn(process.execPath, [resolve("dist/cli/sdp.js"), "vault", root, "--watch"], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "",
      stderr = "";
    child.stdout.on("data", (b: Buffer) => {
      stdout += b.toString();
    });
    child.stderr.on("data", (b: Buffer) => {
      stderr += b.toString();
    });
    const waitFor = (ready: () => boolean) =>
      new Promise<void>((resolve, reject) => {
        const start = Date.now();
        const tick = () => {
          if (ready()) {
            resolve();
            return;
          }
          if (child.exitCode !== null || Date.now() - start > 4000) {
            reject(new Error(`vault watch did not rerun: ${stdout}\n${stderr}`));
            return;
          }
          setTimeout(tick, 10);
        };
        tick();
      });
    const out = join(root, "generated/obsidian-vault/sdp");
    const stopped = new Promise<number | null>((resolve) => child.once("exit", resolve));
    try {
      await waitFor(() => stdout.includes("/obsidian-vault/sdp ("));
      const before = snapshot(out);
      if (w.point.edit === "a title change in its carrier")
        put(join(root, "member.sdp.md"), carrier("spec:probe.member", "Changed"));
      else
        put(
          join(root, "source.ts"),
          "/**\n * @sdpAnchor impl:probe.member\n * @sdpSatisfies spec:probe.member\n */\nexport const member = true;\n",
        );
      await waitFor(() => {
        const content = readFileSync(join(out, "specs/probe/spec.probe.member.md"), "utf8");
        return w.point.edit === "a title change in its carrier"
          ? content.includes("# Changed")
          : content.includes("Implementation binding: present");
      });
      const after = snapshot(out);
      const content = readFileSync(join(out, "specs/probe/spec.probe.member.md"), "utf8");
      const alive = child.exitCode === null;
      put(join(out, temporary("specs/probe/spec.probe.member.md")), content);
      expect(inspectVault(join(root, "generated/obsidian-vault")).temporaries).toHaveLength(1);
      child.kill("SIGINT");
      const exitCode = await stopped;
      w.answer = {
        shown: content.includes("# Changed"),
        bindingShown: content.includes("Implementation binding: present"),
        othersUntouched:
          alive &&
          Object.entries(before).every(
            ([path, file]) =>
              after[path]?.content !== file.content || after[path].mtime === file.mtime,
          ),
        exitCode,
      };
      expect(inspectVault(join(root, "generated/obsidian-vault")).temporaries).toEqual([]);
    } finally {
      if (child.exitCode === null) child.kill("SIGKILL");
      await stopped;
      rmSync(root, { recursive: true, force: true });
    }
  },
  observe: (w: World<IterationConditions>): IterationOutcome => ({
    kind: "the watch process stays alive and exits {exitCode} on SIGINT",
    exitCode: Number(w.answer.exitCode),
  }),
  expected: (p: Partial<IterationConditions>): IterationOutcome =>
    p.edit === undefined
      ? unspecified
      : { kind: "the watch process stays alive and exits {exitCode} on SIGINT", exitCode: 0 },
  assertions: (w: World<IterationConditions>) => {
    assertThens(contract, w.answer, {
      shown: true,
      bindingShown: true,
      othersUntouched: true,
      exitCode: 0,
    });
  },
});
it("keeps incomplete oracle points unspecified", () => {
  expect(vaultAdapters({ steps: [] }).expected({})).toEqual(unspecified);
  expect(notesAdapters({ steps: [] }).expected({})).toEqual(unspecified);
  expect(basesAdapters({ steps: [] }).expected({})).toEqual(unspecified);
  expect(iterationAdapters({ steps: [] }).expected({})).toEqual(unspecified);
});

const freshVaultAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.fresh-vault"),
  verifies: ref("spec:consumers.obsidian-vault.fresh-vault"),
});
void freshVaultAnchor;
partialExample(freshVaultContract, vaultAdapters(freshVaultContract));

const personNotesSurviveAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.person-notes-survive"),
  verifies: ref("spec:consumers.obsidian-vault.person-notes-survive"),
});
void personNotesSurviveAnchor;
partialExample(personNotesSurviveContract, vaultAdapters(personNotesSurviveContract));

const unknownNoteRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.unknown-note-refused"),
  verifies: ref("spec:consumers.obsidian-vault.unknown-note-refused"),
});
void unknownNoteRefusedAnchor;
partialExample(unknownNoteRefusedContract, vaultAdapters(unknownNoteRefusedContract));

const changedNoteRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.changed-note-refused"),
  verifies: ref("spec:consumers.obsidian-vault.changed-note-refused"),
});
void changedNoteRefusedAnchor;
partialExample(changedNoteRefusedContract, vaultAdapters(changedNoteRefusedContract));

const hiddenFileRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.hidden-file-refused"),
  verifies: ref("spec:consumers.obsidian-vault.hidden-file-refused"),
});
void hiddenFileRefusedAnchor;
partialExample(hiddenFileRefusedContract, vaultAdapters(hiddenFileRefusedContract));

const vaultInBuildPathRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.vault-in-build-path-refused"),
  verifies: ref("spec:consumers.obsidian-vault.vault-in-build-path-refused"),
});
void vaultInBuildPathRefusedAnchor;
partialExample(vaultInBuildPathRefusedContract, vaultAdapters(vaultInBuildPathRefusedContract));

const interruptedRunRecoveredAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.interrupted-run-recovered"),
  verifies: ref("spec:consumers.obsidian-vault.interrupted-run-recovered"),
});
void interruptedRunRecoveredAnchor;
partialExample(interruptedRunRecoveredContract, vaultAdapters(interruptedRunRecoveredContract));

const failedExtractionKeepsNotesAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.failed-extraction-keeps-notes"),
  verifies: ref("spec:consumers.obsidian-vault.failed-extraction-keeps-notes"),
});
void failedExtractionKeepsNotesAnchor;
partialExample(
  failedExtractionKeepsNotesContract,
  vaultAdapters(failedExtractionKeepsNotesContract),
);

const failedExtractionRecoveredAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.failed-extraction-recovered"),
  verifies: ref("spec:consumers.obsidian-vault.failed-extraction-recovered"),
});
void failedExtractionRecoveredAnchor;
partialExample(failedExtractionRecoveredContract, vaultAdapters(failedExtractionRecoveredContract));

const entryAddressLinkAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.notes.entry-address-link"),
  verifies: ref("spec:consumers.obsidian-vault.notes.entry-address-link"),
});
void entryAddressLinkAnchor;
partialExample(entryAddressLinkContract, notesAdapters(entryAddressLinkContract));

const unresolvedMentionStaysAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.notes.unresolved-mention-stays"),
  verifies: ref("spec:consumers.obsidian-vault.notes.unresolved-mention-stays"),
});
void unresolvedMentionStaysAnchor;
partialExample(unresolvedMentionStaysContract, notesAdapters(unresolvedMentionStaysContract));

const termAddressLinkAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.notes.term-address-link"),
  verifies: ref("spec:consumers.obsidian-vault.notes.term-address-link"),
});
void termAddressLinkAnchor;
partialExample(termAddressLinkContract, notesAdapters(termAddressLinkContract));

const caseCollisionRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.notes.case-collision-refused"),
  verifies: ref("spec:consumers.obsidian-vault.notes.case-collision-refused"),
});
void caseCollisionRefusedAnchor;
partialExample(caseCollisionRefusedContract, notesAdapters(caseCollisionRefusedContract));

const viewsMatchSourcesAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.bases.views-match-sources"),
  verifies: ref("spec:consumers.obsidian-vault.bases.views-match-sources"),
});
void viewsMatchSourcesAnchor;
registerViewsMatchSources(basesAdapters(viewsMatchSourcesContract));

const watchRewritesChangedNotesAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.iteration.watch-rewrites-changed-notes"),
  verifies: ref("spec:consumers.obsidian-vault.iteration.watch-rewrites-changed-notes"),
});
void watchRewritesChangedNotesAnchor;
registerWatchRewritesChangedNotes(iterationAdapters(watchRewritesChangedNotesContract));

const watchSourceAnchorAnchor = specTest({
  id: testAnchorId("test:protocol.consumers.obsidian-vault.iteration.watch-source-anchor"),
  verifies: ref("spec:consumers.obsidian-vault.iteration.watch-source-anchor"),
});
void watchSourceAnchorAnchor;
registerWatchSourceAnchor(iterationAdapters(watchSourceAnchorContract));
