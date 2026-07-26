import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { afterEach, expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { boundSpecPageContract } from "../generated/contracts/consumers.binding-language-views.bound-spec-page.contract.js";
import { dishonestDivergenceContract } from "../generated/contracts/consumers.derived-readiness-banner.dishonest-divergence.contract.js";
import { honestHeadroomContract } from "../generated/contracts/consumers.derived-readiness-banner.honest-headroom.contract.js";
import { stalePageRemovedContract } from "../generated/contracts/consumers.wholesale-view-rewrite.stale-page-removed.contract.js";
import { composedLocationContract } from "../generated/contracts/validation.diagnostic-rendering.composed-location.contract.js";
import {
  codeAnchor,
  codeAnchorId,
  createReader,
  refines,
  renderDesignReview,
  spec,
  specId,
  specTest as probeSpecTest,
  testAnchorId as probeTestAnchorId,
} from "../src/index.js";
import type { DesignReviewPage, Finding, SpecReadiness } from "../src/index.js";
import { formatFinding } from "../src/cli/output.js";
import { runView } from "../src/cli/validate-view-command.js";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";

/**
 * The bound executable points of the projection family: what the one read-only view renders, and
 * how the one diagnostic currency renders its location.
 *
 * Two world styles meet here. The rendering laws run over probe graphs assembled in memory and
 * rendered through the real projection seam (`renderDesignReview` over `createReader`), because a
 * page is a pure function of the graph and nothing cheaper is honest. The wholesale-rewrite law is
 * about the filesystem, so its world is a temporary extraction root carrying a planted page from an
 * earlier run — never the repository root, whose `generated/` tree no pooled test may touch.
 *
 * `test/design-review.test.ts`, `test/design-review-review-08.test.ts`, and `test/cli.test.ts` stay
 * as regression evidence: these points state the laws, never every rendered field or CLI spelling.
 */

const temporaryRoots = new Set<string>();

afterEach(() => {
  for (const root of temporaryRoots) {
    rmSync(root, { recursive: true, force: true });
  }
  temporaryRoots.clear();
});

function pageOf(pages: readonly DesignReviewPage[], path: string): string {
  const page = pages.find((entry) => entry.path === path);

  if (page === undefined) {
    throw new Error(`The rendered view is missing the page "${path}".`);
  }

  return page.content;
}

/* ----- spec:consumers.derived-readiness-banner ----- */

const BANNER_PARENT_ID = "spec:probe.banner-parent";

interface BannerWorld {
  specId: string;
  statedReadiness: SpecReadiness;
  blockingQuestion: boolean;
  pages: readonly DesignReviewPage[] | undefined;
}

function bannerWorld(): BannerWorld {
  return {
    specId: "",
    statedReadiness: "idea",
    blockingQuestion: false,
    pages: undefined,
  };
}

function bannerPage(world: BannerWorld): string {
  if (world.pages === undefined) {
    throw new Error("The rendering step must run before the page is read.");
  }

  return pageOf(world.pages, `spec/${world.specId.slice(world.specId.indexOf(":") + 1)}.md`);
}

/** The one line the banner law is read from: the blockquote the renderer pushes after the pair. */
function bannerLineOf(world: BannerWorld): string | undefined {
  return bannerPage(world)
    .split("\n")
    .find((line) => line.startsWith("> **Readiness divergence.**"));
}

const bannerBindings = {
  "the graph holds a rule spec {specId} whose stated readiness is {statedReadiness}": (
    world: BannerWorld,
    params: { readonly specId: string; readonly statedReadiness: "scoped" | "ready" },
  ) => {
    world.specId = params.specId;
    world.statedReadiness = params.statedReadiness;
  },
  "the spec {structure}": (
    world: BannerWorld,
    params: {
      readonly structure: "clears every floor clause" | "records a blocking open question";
    },
  ) => {
    world.blockingQuestion = params.structure === "records a blocking open question";
  },
  "the Design Review renders the graph": (world: BannerWorld) => {
    // The parent is `defined`, so the subject's own `ready` clauses (targets at least `defined`,
    // every relation resolving) all pass: the open question is the only clause that can refuse,
    // and the rung the page renders is the rung the floor table yielded.
    const parent = spec({
      id: specId(BANNER_PARENT_ID),
      title: "Probe parent for the readiness banner",
      kind: "behavior",
      altitude: "feature",
      readiness: "defined",
      intent: { outcome: "Terminate the probe's relation chain at a defined target." },
      behavior: { rules: ["The parent carries its own kind evidence."] },
    });
    const subject = spec({
      id: specId(world.specId),
      title: "Probe subject of the readiness banner",
      kind: "rule",
      altitude: "story",
      readiness: world.statedReadiness,
      intent: {
        outcome: "State one rung against the structure the probe carries.",
        ...(world.blockingQuestion
          ? {
              openQuestions: [
                { question: "Which rung does the probe honestly stand at?", blocking: true },
              ],
            }
          : {}),
      },
      behavior: { rules: ["A rule's statement is its own evidence."] },
      relations: [refines(specId(BANNER_PARENT_ID))],
    });

    world.pages = renderDesignReview(
      createReader(deriveFixtureGraph({ specs: [parent, subject] })),
    );
  },
  "the spec page renders the floor reached {floorReached}": (
    world: BannerWorld,
    params: { readonly floorReached: "scoped" | "ready" },
  ) => {
    // The pair renders on every page, agreeing or not — the positive statement the banner's own
    // absence is read beside, so absence is never the sole discriminator.
    expect(bannerPage(world)).toContain(
      `**Readiness:** stated \`${world.statedReadiness}\` · structural floor reached: \`${params.floorReached}\``,
    );
  },
  "the divergence banner is raised: {bannerRaised}": (
    world: BannerWorld,
    params: { readonly bannerRaised: boolean },
  ) => {
    expect(bannerLineOf(world) !== undefined).toBe(params.bannerRaised);
  },
  "the banner names the first unmet clause {clauseId}": (
    world: BannerWorld,
    params: { readonly clauseId: string },
  ) => {
    const named = /First unmet clause: `(?<clauseId>[^`]+)` — (?<description>.+)$/u.exec(
      bannerLineOf(world) ?? "the divergence banner is missing",
    );

    expect(named?.groups?.clauseId).toBe(params.clauseId);
    // The description is the clause's own words, read from the banner rather than from the table
    // the banner read: what the law requires is that the reader is told which clause refused.
    expect((named?.groups?.description ?? "").length).toBeGreaterThan(0);
  },
};

const dishonestDivergenceTestAnchor = specTest({
  id: testAnchorId("test:protocol.derived-readiness-banner.dishonest-divergence"),
  label: "the overstated-rung point verifies the banner and its first unmet clause",
  verifies: ref("spec:consumers.derived-readiness-banner.dishonest-divergence"),
});
void dishonestDivergenceTestAnchor;

bindExample(dishonestDivergenceContract, bannerWorld, bannerBindings);

const honestHeadroomTestAnchor = specTest({
  id: testAnchorId("test:protocol.derived-readiness-banner.honest-headroom"),
  label: "the understated-rung point verifies the one-direction bound on the banner",
  verifies: ref("spec:consumers.derived-readiness-banner.honest-headroom"),
});
void honestHeadroomTestAnchor;

bindExample(honestHeadroomContract, bannerWorld, bannerBindings);

/* ----- spec:consumers.binding-language-views ----- */

const BINDING_PARENT_ID = "spec:probe.binding-parent";

interface BindingWorld {
  specId: string;
  bound: boolean;
  pages: readonly DesignReviewPage[] | undefined;
}

function bindingWorld(): BindingWorld {
  return { specId: "", bound: false, pages: undefined };
}

function bindingPages(world: BindingWorld): readonly DesignReviewPage[] {
  if (world.pages === undefined) {
    throw new Error("The rendering step must run before the rendered surfaces are read.");
  }

  return world.pages;
}

function bindingPage(world: BindingWorld): string {
  return pageOf(
    bindingPages(world),
    `spec/${world.specId.slice(world.specId.indexOf(":") + 1)}.md`,
  );
}

/** The subject's row in the index table — the aggregate surface that must speak the same words. */
function indexRowOf(world: BindingWorld): string {
  const row = pageOf(bindingPages(world), "index.md")
    .split("\n")
    .find((line) => line.startsWith(`| [\`${world.specId}\`]`));

  if (row === undefined) {
    throw new Error(`The index table is missing a row for "${world.specId}".`);
  }

  return row;
}

const bindingLanguageBindings = {
  "the graph holds a spec {specId} bound by {bindings}": (
    world: BindingWorld,
    params: {
      readonly specId: string;
      readonly bindings:
        | "an implementing code anchor and a verifying test anchor"
        | "no anchor at all";
    },
  ) => {
    world.specId = params.specId;
    world.bound = params.bindings === "an implementing code anchor and a verifying test anchor";
  },
  "the Design Review renders the graph": (world: BindingWorld) => {
    const parent = spec({
      id: specId(BINDING_PARENT_ID),
      title: "Probe parent for the rendered binding vocabulary",
      kind: "behavior",
      altitude: "feature",
      readiness: "defined",
      intent: { outcome: "Keep the probe connected so no orphan signal renders beside it." },
      behavior: { rules: ["The parent carries its own kind evidence."] },
    });
    const subject = spec({
      id: specId(world.specId),
      title: "Probe subject of the rendered binding vocabulary",
      kind: "behavior",
      altitude: "story",
      readiness: "idea",
      intent: { outcome: "Carry the bindings the view must describe in its own words." },
      behavior: { rules: ["The subject states one rule and lets its anchors do the rest."] },
      relations: [refines(specId(BINDING_PARENT_ID))],
    });
    // Probe anchors, built inline through the source builders rather than the package import: an
    // anchor-constant form bound to the protocol import is a real corpus binding, and these two are
    // world data the extractor must never reify.
    const anchors = world.bound
      ? [
          codeAnchor({
            id: codeAnchorId("impl:probe.bound-surface"),
            label: "binds the probe subject to code",
            satisfies: specId(world.specId),
          }),
          probeSpecTest({
            id: probeTestAnchorId("test:probe.bound-surface"),
            label: "binds the probe subject to a test entrypoint",
            verifies: specId(world.specId),
          }),
        ]
      : [];

    world.pages = renderDesignReview(
      createReader(deriveFixtureGraph({ specs: [parent, subject], anchors })),
    );
  },
  "the spec page renders the implementation binding as {implementation}": (
    world: BindingWorld,
    params: { readonly implementation: "present" | "none" },
  ) => {
    expect(bindingPage(world)).toContain(`- Implementation binding: **${params.implementation}**`);
  },
  "the spec page renders the verifier binding as {verifier}": (
    world: BindingWorld,
    params: { readonly verifier: "present" | "none" },
  ) => {
    expect(bindingPage(world)).toContain(`- Verifier binding: **${params.verifier}**`);
    // The oracle line is the third of the three existence lines, and reads the same two words.
    expect(bindingPage(world)).toContain("- Expected-outcome oracle: **none**");
  },
  "the spec page renders the runtime observation as {observation}": (
    world: BindingWorld,
    params: { readonly observation: string },
  ) => {
    expect(bindingPage(world)).toContain(`- Runtime observation: **${params.observation}**`);
  },
  "the index table repeats those binding values for the spec: {tableRepeats}": (
    world: BindingWorld,
    params: { readonly tableRepeats: boolean },
  ) => {
    const columns = indexRowOf(world).endsWith("| present | present |");

    expect(columns).toBe(params.tableRepeats);
  },
  "the internal delivery-fact name {factName} appears as rendered label text: {factNameRendered}": (
    world: BindingWorld,
    params: { readonly factName: string; readonly factNameRendered: boolean },
  ) => {
    // The probe authors none of these words itself, so every occurrence would be the renderer's.
    for (const surface of [bindingPage(world), indexRowOf(world)]) {
      expect(surface.includes(params.factName)).toBe(params.factNameRendered);
      expect(surface.includes("has-verifier")).toBe(params.factNameRendered);
    }
  },
};

const boundSpecPageTestAnchor = specTest({
  id: testAnchorId("test:protocol.binding-language-views.bound-spec-page"),
  label: "the bound-surface point verifies the rendered binding vocabulary",
  verifies: ref("spec:consumers.binding-language-views.bound-spec-page"),
});
void boundSpecPageTestAnchor;

bindExample(boundSpecPageContract, bindingWorld, bindingLanguageBindings);

/* ----- spec:consumers.wholesale-view-rewrite ----- */

const PROBE_CARRIER = `---
id: spec:probe.view-subject
kind: rule
altitude: story
readiness: idea
relations: {}
---
# The probe subject of a view run

## Intent
- outcome: Give the view one page to render over a temporary extraction root.
`;

interface ViewWorld {
  readonly root: string;
  stalePage: string;
  exitCode: number | undefined;
}

function viewWorld(): ViewWorld {
  const root = mkdtempSync(join(tmpdir(), "sdp-self-hosting-view-"));
  temporaryRoots.add(root);

  return { root, stalePage: "", exitCode: undefined };
}

function viewPathOf(world: ViewWorld): string {
  return join(world.root, "generated", "design-review");
}

const wholesaleRewriteBindings = {
  "an extraction root holding {corpus} and a stale view page {stalePage}": (
    world: ViewWorld,
    params: { readonly corpus: string; readonly stalePage: string },
  ) => {
    mkdirSync(join(world.root, "specs"), { recursive: true });
    writeFileSync(join(world.root, "specs", "probe.sdp.md"), PROBE_CARRIER, "utf8");

    // The planted page names a subject the corpus does not hold, so nothing the run writes can
    // overwrite it: it survives only if a run is allowed to leave an earlier one's output behind.
    world.stalePage = params.stalePage;
    const stalePath = join(viewPathOf(world), ...params.stalePage.split("/"));
    mkdirSync(dirname(stalePath), { recursive: true });
    writeFileSync(stalePath, "# A spec the corpus no longer holds\n", "utf8");
  },
  "the view is rendered at that root": (world: ViewWorld) => {
    world.exitCode = runView({ root: world.root, exclude: [], checkClean: false }, {}, {});
  },
  "the run exits {exitCode}": (world: ViewWorld, params: { readonly exitCode: number }) => {
    expect(world.exitCode).toBe(params.exitCode);
  },
  "the view holds the current page {currentPage}": (
    world: ViewWorld,
    params: { readonly currentPage: string },
  ) => {
    expect(existsSync(join(viewPathOf(world), ...params.currentPage.split("/")))).toBe(true);
    expect(existsSync(join(viewPathOf(world), "spec", "probe.view-subject.md"))).toBe(true);
  },
  "the stale page survives: {staleSurvives}": (
    world: ViewWorld,
    params: { readonly staleSurvives: boolean },
  ) => {
    expect(existsSync(join(viewPathOf(world), ...world.stalePage.split("/")))).toBe(
      params.staleSurvives,
    );
  },
  "a temporary view sibling survives: {temporarySurvives}": (
    world: ViewWorld,
    params: { readonly temporarySurvives: boolean },
  ) => {
    expect(existsSync(`${viewPathOf(world)}.tmp`)).toBe(params.temporarySurvives);
  },
};

const stalePageRemovedTestAnchor = specTest({
  id: testAnchorId("test:protocol.wholesale-view-rewrite.stale-page-removed"),
  label: "the stale-page point verifies the wholesale rewrite of the view directory",
  verifies: ref("spec:consumers.wholesale-view-rewrite.stale-page-removed"),
});
void stalePageRemovedTestAnchor;

bindExample(stalePageRemovedContract, viewWorld, wholesaleRewriteBindings);

/* ----- spec:validation.diagnostic-rendering ----- */

type LocationFields = Pick<Finding, "file" | "line">;

interface DiagnosticWorld {
  finding: Finding | undefined;
  render: ((location: LocationFields) => string) | undefined;
  file: string;
}

function diagnosticWorld(): DiagnosticWorld {
  return { finding: undefined, render: undefined, file: "" };
}

function renderOf(world: DiagnosticWorld): (location: LocationFields) => string {
  if (world.render === undefined) {
    throw new Error("The formatting step must run before a rendered line is read.");
  }

  return world.render;
}

const diagnosticRenderingBindings = {
  "a finding naming the validator {validatorId} at severity {severity} carrying the message {message}":
    (
      world: DiagnosticWorld,
      params: {
        readonly validatorId: string;
        readonly severity: "warning" | "error";
        readonly message: string;
      },
    ) => {
      world.finding = {
        validatorId: params.validatorId,
        family: "honesty",
        severity: params.severity,
        message: params.message,
      };
    },
  "the command-line renderer formats that finding once per location shape": (
    world: DiagnosticWorld,
  ) => {
    const finding = world.finding;

    if (finding === undefined) {
      throw new Error("The finding step must run before the renderer is bound to it.");
    }

    // One finding, one renderer: each outcome step below supplies a location shape and reads what
    // the real command-line renderer composed from those structured fields alone.
    world.render = (location) => formatFinding({ ...finding, ...location });
  },
  "the finding carrying the file {file} and the line {line} renders {withLocation}": (
    world: DiagnosticWorld,
    params: { readonly file: string; readonly line: number; readonly withLocation: string },
  ) => {
    const rendered = renderOf(world)({ file: params.file, line: params.line });

    world.file = params.file;
    expect(rendered).toBe(`${params.withLocation}\n`);
    // The composed prefix is the only place the path appears: the message never carries it too.
    expect(rendered.indexOf(params.file)).toBe(rendered.lastIndexOf(params.file));
  },
  "the same finding carrying the file alone renders {fileOnly}": (
    world: DiagnosticWorld,
    params: { readonly fileOnly: string },
  ) => {
    expect(renderOf(world)({ file: world.file })).toBe(`${params.fileOnly}\n`);
  },
  "the same finding carrying neither renders {bare}": (
    world: DiagnosticWorld,
    params: { readonly bare: string },
  ) => {
    expect(renderOf(world)({})).toBe(`${params.bare}\n`);
  },
};

const composedLocationTestAnchor = specTest({
  id: testAnchorId("test:protocol.diagnostic-rendering.composed-location"),
  label: "the composed-location point verifies the one rendering rule and both degradations",
  verifies: ref("spec:validation.diagnostic-rendering.composed-location"),
});
void composedLocationTestAnchor;

bindExample(composedLocationContract, diagnosticWorld, diagnosticRenderingBindings);
