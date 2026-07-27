import { existsSync } from "node:fs";
import { join } from "node:path";

import { afterAll, expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { demandMapEntriesContract } from "../generated/contracts/consumers.agent-surface.demand-map-entries.contract.js";
import { scriptedContextBodyContract } from "../generated/contracts/consumers.agent-surface.scripted-context-body.contract.js";
import { changesetEntryContract } from "../generated/contracts/consumers.reader.changeset-entry.contract.js";
import { conceptEntryContract } from "../generated/contracts/consumers.reader.concept-entry.contract.js";
import { fileEntryContract } from "../generated/contracts/consumers.reader.file-entry.contract.js";
import { runSdpCli } from "../src/cli/sdp.js";
import { extract } from "../src/extract/index.js";
import { createReader } from "../src/reader/reader.js";
import type { BlastRadius, ConceptMatch, FileEntry, Reader } from "../src/reader/reader.js";
import { createCaptureOutput } from "./helpers/cli-capture.js";
import { materializeExtractCorpus, removeMaterializedCorpus } from "./helpers/extract-corpus.js";

/**
 * The bound executable points of the consumer family — the agent front door and the reader's entry
 * adapters, each exercised over the **whole pipeline**: a real on-disk extraction root, the real
 * extractor, the derived graph, and the production seam the consumer actually reaches through
 * (`runSdpCli` for the front door, `createReader` for the reader). Nothing here hands a consumer a
 * hand-built graph; a narrowed world would make the promotions these points carry decorative.
 *
 * The root is a committed corpus materialized per suite, never the repository root: the fixture is
 * small enough for the assertions to be read at a glance while still running the same production
 * path, and its ids are ours, so a corpus wave elsewhere cannot silently rewrite a bound point.
 * The suite names no write path, so it stays in the pooled leg.
 *
 * `test/cli-q.test.ts` and `test/reader.test.ts` stay as regression evidence: these points state
 * the laws, never every option spelling or accessor field.
 */

const corpusRoot = materializeExtractCorpus("consumer-surface");

afterAll(() => {
  removeMaterializedCorpus(corpusRoot);
});

// stdin is a real terminal-or-not decision in production; the front-door worlds answer "terminal"
// through the injected hook so the body always arrives on argv, exactly as an agent invokes it.
const terminalStdin = {
  query: {
    isStdinTty: () => true,
    readStdin: (): string => {
      throw new Error("stdin must never be read when the body is on argv");
    },
  },
};

/* ----- spec:consumers.agent-surface ----- */

interface FrontDoorWorld {
  readonly root: string;
  specId: string;
  concept: string;
  file: string;
  unrecordedFile: string;
  exitCode: number | undefined;
  stdout: string;
  stderr: string;
}

function frontDoorWorld(): FrontDoorWorld {
  return {
    root: corpusRoot,
    specId: "",
    concept: "",
    file: "",
    unrecordedFile: "",
    exitCode: undefined,
    stdout: "",
    stderr: "",
  };
}

/** The body's return, read back from the sink's own `--json` rendering — never from the reader. */
function answerOf(world: FrontDoorWorld): unknown {
  if (world.exitCode === undefined) {
    throw new Error("The scripting step must run before the answer is read.");
  }

  return JSON.parse(world.stdout) as unknown;
}

function stringAnswerOf(world: FrontDoorWorld): string {
  const answer = answerOf(world);

  if (typeof answer !== "string") {
    throw new Error(`The body returned ${typeof answer}, not the pre-shaped string it composed.`);
  }

  return answer;
}

function recordAnswerOf(world: FrontDoorWorld): Record<string, readonly string[] | string> {
  const answer = answerOf(world);

  if (typeof answer !== "object" || answer === null) {
    throw new Error("The body returned no composed record for the entry points to be read from.");
  }

  return answer as Record<string, readonly string[] | string>;
}

/**
 * The two bodies an agent would paste. They are plain JavaScript function bodies against the
 * injected `g`, composed here from the world's own bound values so the point's slots are what the
 * body actually asks about.
 */
function bodyFor(world: FrontDoorWorld, body: string): string {
  if (body === "composing that spec's verifier bindings") {
    return `
      const context = g.specContext(${JSON.stringify(world.specId)});
      return context.verifiers
        .map((verifier) => \`\${verifier.verifierId} is \${verifier.enabled ? "an enabled" : "a declared"} verifier\`)
        .join(" · ");
    `;
  }

  return `
    const blast = g.blastRadius([${JSON.stringify(world.file)}, ${JSON.stringify(world.unrecordedFile)}]);
    return {
      concept: g.findByConcept(${JSON.stringify(world.concept)}).map((match) => match.id),
      file: g.byFile(${JSON.stringify(world.file)}).specs,
      changeset: blast.impactedSpecs.map((item) => item.id),
      coverageUnknown: blast.coverageUnknown,
      symbolEntry: typeof g.bySymbol,
    };
  `;
}

const frontDoorBindings = {
  "an extraction root the front door derives in process on the invocation": (
    world: FrontDoorWorld,
  ) => {
    // The freshness half of the law made observable: the root carries no derived artifact at all,
    // so whatever the sink answers with, it derived on this invocation.
    expect(existsSync(join(world.root, "generated"))).toBe(false);
  },
  "the corpus binds the spec {specId} to one anchored verifier and one declared-only verifier": (
    world: FrontDoorWorld,
    params: { readonly specId: string },
  ) => {
    world.specId = params.specId;
  },
  "the agent holds the concept {concept}, the file {file}, and a changeset that also touches the unrecorded file {unrecordedFile}":
    (
      world: FrontDoorWorld,
      params: {
        readonly concept: string;
        readonly file: string;
        readonly unrecordedFile: string;
      },
    ) => {
      world.concept = params.concept;
      world.file = params.file;
      world.unrecordedFile = params.unrecordedFile;
    },
  "the agent scripts a body {body} through the front door": async (
    world: FrontDoorWorld,
    params: {
      readonly body:
        | "composing that spec's verifier bindings"
        | "reaching every entry point the demand map names";
    },
  ) => {
    const capture = createCaptureOutput();

    // `--json` is the exact escape the sink documents: the printed text is the body's return and
    // nothing the renderer chose, which is what "pre-shaped by the body" has to mean.
    world.exitCode = await runSdpCli(
      ["q", bodyFor(world, params.body), "--root", world.root, "--json"],
      capture.output,
      terminalStdin,
    );
    world.stdout = capture.readStdout();
    world.stderr = capture.readStderr();
  },
  "the front door exits {exitCode} with an empty error stream": (
    world: FrontDoorWorld,
    params: { readonly exitCode: number },
  ) => {
    expect(world.stderr).toBe("");
    expect(world.exitCode).toBe(params.exitCode);
  },
  "the printed answer is exactly the body's pre-shaped return {printedAnswer}": (
    world: FrontDoorWorld,
    params: { readonly printedAnswer: string },
  ) => {
    // Byte-for-byte: the sink printed the body's own value, with no banner, no envelope, and no
    // dump of the graph the body read it from.
    expect(world.stdout).toBe(`${JSON.stringify(params.printedAnswer)}\n`);
  },
  "the anchored verifier {anchoredVerifierId} decodes as enabled while the declared-only verifier {declaredVerifierId} does not":
    (
      world: FrontDoorWorld,
      params: { readonly anchoredVerifierId: string; readonly declaredVerifierId: string },
    ) => {
      const answer = stringAnswerOf(world);

      expect(answer).toContain(`${params.anchoredVerifierId} is an enabled verifier`);
      expect(answer).toContain(`${params.declaredVerifierId} is a declared verifier`);
      // The taxonomy is never collapsed: both verifiers are declared, and only one of them is
      // backed by a resolving test anchor — a decode that answered alike for both would say so here.
      expect(answer).not.toContain(`${params.declaredVerifierId} is an enabled verifier`);
    },
  "the concept entry answers with the spec {conceptSpecId}": (
    world: FrontDoorWorld,
    params: { readonly conceptSpecId: string },
  ) => {
    expect(recordAnswerOf(world).concept).toEqual([params.conceptSpecId]);
  },
  "the file entry answers with the spec {fileSpecId}": (
    world: FrontDoorWorld,
    params: { readonly fileSpecId: string },
  ) => {
    expect(recordAnswerOf(world).file).toEqual([params.fileSpecId]);
  },
  "the changeset entry answers with the impacted spec {changesetSpecId}": (
    world: FrontDoorWorld,
    params: { readonly changesetSpecId: string },
  ) => {
    const answer = recordAnswerOf(world);

    expect(answer.changeset).toEqual([params.changesetSpecId]);
    // The changeset entry's honesty half rides the same answer: the file the graph records
    // nothing at is named back to the agent rather than dropped into silence.
    expect(answer.coverageUnknown).toEqual([world.unrecordedFile]);
  },
  "the surface offers a symbol entry: {symbolEntry}": (
    world: FrontDoorWorld,
    params: { readonly symbolEntry: boolean },
  ) => {
    // Absent, not stubbed: `typeof` reports the honest absence rather than a method that would
    // answer for a substrate that does not exist.
    expect(recordAnswerOf(world).symbolEntry !== "undefined").toBe(params.symbolEntry);
  },
};

const scriptedContextBodyTestAnchor = specTest({
  id: testAnchorId("test:protocol.agent-surface.scripted-context-body"),
  label: "the scripted-body point verifies the front door's claim-decoded, pre-shaped return",
  verifies: ref("spec:consumers.agent-surface.scripted-context-body"),
});
void scriptedContextBodyTestAnchor;

bindExample(scriptedContextBodyContract, frontDoorWorld, frontDoorBindings);

const demandMapEntriesTestAnchor = specTest({
  id: testAnchorId("test:protocol.agent-surface.demand-map-entries"),
  label: "the demand-map point verifies the three entry points and the absent symbol entry",
  verifies: ref("spec:consumers.agent-surface.demand-map-entries"),
});
void demandMapEntriesTestAnchor;

bindExample(demandMapEntriesContract, frontDoorWorld, frontDoorBindings);

/* ----- spec:consumers.reader ----- */

interface ReaderWorld {
  readonly root: string;
  reader: Reader | undefined;
  concept: string;
  boundFile: string;
  unrecordedFile: string;
  matches: readonly ConceptMatch[] | undefined;
  fileEntry: FileEntry | undefined;
  blast: BlastRadius | undefined;
}

function readerWorld(): ReaderWorld {
  return {
    root: corpusRoot,
    reader: undefined,
    concept: "",
    boundFile: "",
    unrecordedFile: "",
    matches: undefined,
    fileEntry: undefined,
    blast: undefined,
  };
}

function readerOf(world: ReaderWorld): Reader {
  if (world.reader === undefined) {
    throw new Error("The reader step must run before an entry point is asked.");
  }

  return world.reader;
}

function matchesOf(world: ReaderWorld): readonly ConceptMatch[] {
  if (world.matches === undefined) {
    throw new Error("The concept entry must be asked before its matches are read.");
  }

  return world.matches;
}

function fileEntryOf(world: ReaderWorld): FileEntry {
  if (world.fileEntry === undefined) {
    throw new Error("The file entry must be asked before its answer is read.");
  }

  return world.fileEntry;
}

function blastOf(world: ReaderWorld): BlastRadius {
  if (world.blast === undefined) {
    throw new Error("The changeset entry must be asked before its blast radius is read.");
  }

  return world.blast;
}

const readerBindings = {
  "a reader built over the graph a real extraction derives from the probe root": (
    world: ReaderWorld,
  ) => {
    const derived = extract({ root: world.root });

    // The world is the whole pipeline or it is nothing: a root that did not reify cleanly would
    // let an adapter's answer be shaped by an extraction hole rather than by the adapter's law.
    expect(derived.report.findings).toEqual([]);
    world.reader = createReader(derived.graph);
  },
  "the concept {concept} appears in the corpus only inside the recorded context of {conceptSpecId}":
    (world: ReaderWorld, params: { readonly concept: string; readonly conceptSpecId: string }) => {
      world.concept = params.concept;
      // The premise the point rests on, asserted rather than assumed: the concept is nowhere in
      // the subject's id or title, so an id-and-title lookup could not have found it.
      const subject = readerOf(world)
        .specs()
        .find((spec) => spec.id === params.conceptSpecId);

      expect(subject).toBeDefined();
      expect(subject?.id.toLowerCase()).not.toContain(params.concept.toLowerCase());
      expect((subject?.title ?? "").toLowerCase()).not.toContain(params.concept.toLowerCase());
    },
  "the source file {boundFile} carries the binding {bindingId}": (
    world: ReaderWorld,
    params: { readonly boundFile: string; readonly bindingId: string },
  ) => {
    world.boundFile = params.boundFile;
    expect(readerOf(world).graph.nodes.map((node) => node.id)).toContain(params.bindingId);
  },
  "the changeset also holds the file {unrecordedFile} the graph records nothing at": (
    world: ReaderWorld,
    params: { readonly unrecordedFile: string },
  ) => {
    world.unrecordedFile = params.unrecordedFile;
    expect(
      readerOf(world).graph.nodes.filter((node) => node.file === params.unrecordedFile),
    ).toEqual([]);
  },
  "the reader answers the {entry} entry": (
    world: ReaderWorld,
    params: { readonly entry: "concept" | "file" | "changeset" },
  ) => {
    const reader = readerOf(world);

    if (params.entry === "concept") {
      world.matches = reader.findByConcept(world.concept);
      return;
    }

    if (params.entry === "file") {
      world.fileEntry = reader.byFile(world.boundFile);
      return;
    }

    world.blast = reader.blastRadius([world.boundFile, world.unrecordedFile]);
  },
  "the reader names {matchedId} as a match on the field {matchedField}": (
    world: ReaderWorld,
    params: { readonly matchedId: string; readonly matchedField: string },
  ) => {
    const match = matchesOf(world).find((entry) => entry.id === params.matchedId);

    expect(match).toBeDefined();
    // Naming the field is the half a grep cannot give: the answer says where the concept is
    // recorded, not merely that something somewhere matched.
    expect(match?.matchedIn).toEqual([params.matchedField]);
  },
  "the reader names {matchCount} matches in all": (
    world: ReaderWorld,
    params: { readonly matchCount: number },
  ) => {
    expect(matchesOf(world)).toHaveLength(params.matchCount);
  },
  "the file entry names the node {nodeId} the graph records at that path": (
    world: ReaderWorld,
    params: { readonly nodeId: string },
  ) => {
    const entry = fileEntryOf(world);

    expect(entry.path).toBe(world.boundFile);
    expect(entry.nodes.map((node) => node.id)).toEqual([params.nodeId]);
  },
  "the file entry reaches the spec {reachedSpecId} that binding names": (
    world: ReaderWorld,
    params: { readonly reachedSpecId: string },
  ) => {
    // No Spec is authored in this file at all, so the reach is the binding's and only the
    // binding's — the bridge a caller holding a source path actually needs.
    expect(fileEntryOf(world).nodes.map((node) => node.nodeType)).not.toContain("Primitive");
    expect(fileEntryOf(world).specs).toEqual([params.reachedSpecId]);
  },
  "the spec carrier {carrierFile} answers with its own spec {carrierSpecId}": (
    world: ReaderWorld,
    params: { readonly carrierFile: string; readonly carrierSpecId: string },
  ) => {
    const carrierEntry = readerOf(world).byFile(params.carrierFile);

    expect(carrierEntry.nodes.map((node) => node.id)).toEqual([params.carrierSpecId]);
    expect(carrierEntry.specs).toEqual([params.carrierSpecId]);
  },
  "the impacted specs name {impactedSpecId} through the binding {impactBindingId} at claim {impactClaim}":
    (
      world: ReaderWorld,
      params: {
        readonly impactedSpecId: string;
        readonly impactBindingId: string;
        readonly impactClaim: string;
      },
    ) => {
      const impacted = blastOf(world).impactedSpecs;

      expect(impacted.map((item) => item.id)).toEqual([params.impactedSpecId]);
      expect(impacted[0]?.reasons).toEqual([
        {
          file: world.boundFile,
          throughBinding: {
            id: params.impactBindingId,
            edgeType: "satisfies",
            claim: params.impactClaim,
          },
        },
      ]);
    },
  "the one-hop at-risk neighbors name {atRiskId} through the edge {atRiskEdge} at claim {atRiskClaim}":
    (
      world: ReaderWorld,
      params: {
        readonly atRiskId: string;
        readonly atRiskEdge: string;
        readonly atRiskClaim: string;
      },
    ) => {
      const neighbor = blastOf(world).atRisk.find((item) => item.id === params.atRiskId);

      expect(neighbor?.reasons).toEqual([
        {
          from: blastOf(world).impactedSpecs[0]?.id,
          edgeType: params.atRiskEdge,
          to: params.atRiskId,
          claim: params.atRiskClaim,
        },
      ]);
      // Every at-risk reason carries its claim, not just the one the point names.
      for (const item of blastOf(world).atRisk) {
        for (const reason of item.reasons) {
          expect(reason.claim).not.toBe(undefined);
        }
      }
    },
  "the at-risk neighbors number {atRiskCount}": (
    world: ReaderWorld,
    params: { readonly atRiskCount: number },
  ) => {
    // The changed file's own binding node is the change, never the risk, so it is absent here.
    expect(blastOf(world).atRisk.map((item) => item.id)).not.toContain("impl:orders.create-order");
    expect(blastOf(world).atRisk).toHaveLength(params.atRiskCount);
  },
  "the coverage-unknown files name {coverageUnknownFile}": (
    world: ReaderWorld,
    params: { readonly coverageUnknownFile: string },
  ) => {
    expect(blastOf(world).coverageUnknown).toContain(params.coverageUnknownFile);
    // Named, never dropped: the changeset the caller handed in is answered in full.
    expect([
      ...blastOf(world).impactedSpecs.flatMap((item) => item.reasons.map((reason) => reason.file)),
      ...blastOf(world).coverageUnknown,
    ]).toEqual(expect.arrayContaining([world.boundFile, world.unrecordedFile]));
  },
  "the coverage-unknown files number {coverageUnknownCount}": (
    world: ReaderWorld,
    params: { readonly coverageUnknownCount: number },
  ) => {
    expect(blastOf(world).coverageUnknown).toHaveLength(params.coverageUnknownCount);
  },
};

const conceptEntryTestAnchor = specTest({
  id: testAnchorId("test:protocol.reader.concept-entry"),
  label: "the concept-entry point verifies the string bridge and the field it names",
  verifies: ref("spec:consumers.reader.concept-entry"),
});
void conceptEntryTestAnchor;

bindExample(conceptEntryContract, readerWorld, readerBindings);

const fileEntryTestAnchor = specTest({
  id: testAnchorId("test:protocol.reader.file-entry"),
  label: "the file-entry point verifies both halves of the file bridge",
  verifies: ref("spec:consumers.reader.file-entry"),
});
void fileEntryTestAnchor;

bindExample(fileEntryContract, readerWorld, readerBindings);

const changesetEntryTestAnchor = specTest({
  id: testAnchorId("test:protocol.reader.changeset-entry"),
  label: "the changeset-entry point verifies impact reasons, at-risk edges, and coverage-unknown",
  verifies: ref("spec:consumers.reader.changeset-entry"),
});
void changesetEntryTestAnchor;

bindExample(changesetEntryContract, readerWorld, readerBindings);
