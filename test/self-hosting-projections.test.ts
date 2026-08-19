import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { afterEach, expect } from "vitest";

import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { boundSpecPageContract } from "../generated/contracts/consumers.binding-language-views.bound-spec-page.contract.js";
import { packMemberTableContract } from "../generated/contracts/consumers.binding-language-views.pack-member-table.contract.js";
import type {
  BindingLanguageViewsConditions,
  BindingLanguageViewsOutcome,
} from "../generated/contracts/consumers.binding-language-views.space.js";
import { dishonestDivergenceContract } from "../generated/contracts/consumers.derived-readiness-banner.dishonest-divergence.contract.js";
import { honestHeadroomContract } from "../generated/contracts/consumers.derived-readiness-banner.honest-headroom.contract.js";
import type {
  DerivedReadinessBannerConditions,
  DerivedReadinessBannerOutcome,
} from "../generated/contracts/consumers.derived-readiness-banner.space.js";
import { pureProjectionContract } from "../generated/contracts/consumers.design-review.pure-projection.contract.js";
import type {
  DesignReviewConditions,
  DesignReviewOutcome,
} from "../generated/contracts/consumers.design-review.space.js";
import { buildInvalidatesViewContract } from "../generated/contracts/consumers.wholesale-view-rewrite.build-invalidates-view.contract.js";
import { failedRunViewRemovedContract } from "../generated/contracts/consumers.wholesale-view-rewrite.failed-run-view-removed.contract.js";
import { lateStalePageContract } from "../generated/contracts/consumers.wholesale-view-rewrite.late-stale-page.contract.js";
import type {
  WholesaleViewRewriteConditions,
  WholesaleViewRewriteOutcome,
} from "../generated/contracts/consumers.wholesale-view-rewrite.space.js";
import { stalePageRemovedContract } from "../generated/contracts/consumers.wholesale-view-rewrite.stale-page-removed.contract.js";
import { composedLocationContract } from "../generated/contracts/validation.diagnostic-rendering.composed-location.contract.js";
import type {
  DiagnosticRenderingConditions,
  DiagnosticRenderingOutcome,
} from "../generated/contracts/validation.diagnostic-rendering.space.js";
import { tableCellLocationContract } from "../generated/contracts/validation.diagnostic-rendering.table-cell-location.contract.js";
import {
  codeAnchor,
  codeAnchorId,
  createReader,
  pack as probePack,
  packId as probePackId,
  refines,
  renderDesignReview,
  spec,
  specId,
  specTest as probeSpecTest,
  testAnchorId as probeTestAnchorId,
} from "../src/index.js";
import type { DesignReviewPage, Finding, SpecReadiness } from "../src/index.js";
import { runBuild } from "../src/cli/build-command.js";
import { formatFinding } from "../src/cli/output.js";
import { runView } from "../src/cli/validate-view-command.js";
import { extract } from "../src/extract/index.js";
import { renderFindings } from "../src/projections/design-review-context.js";
import { validateGraph } from "../src/validate/validators.js";
import { registerPackMemberTable } from "./consumers.binding-language-views.pack-member-table.test.generated.js";
import { registerDishonestDivergence } from "./consumers.derived-readiness-banner.dishonest-divergence.test.generated.js";
import { registerHonestHeadroom } from "./consumers.derived-readiness-banner.honest-headroom.test.generated.js";
import { registerPureProjection } from "./consumers.design-review.pure-projection.test.generated.js";
import { registerBuildInvalidatesView } from "./consumers.wholesale-view-rewrite.build-invalidates-view.test.generated.js";
import { registerFailedRunViewRemoved } from "./consumers.wholesale-view-rewrite.failed-run-view-removed.test.generated.js";
import { registerLateStalePage } from "./consumers.wholesale-view-rewrite.late-stale-page.test.generated.js";
import { registerStalePageRemoved } from "./consumers.wholesale-view-rewrite.stale-page-removed.test.generated.js";
import { paramsForStep } from "./helpers/generated-contract.js";
import { materializeExtractCorpus } from "./helpers/extract-corpus.js";
import { deriveFixtureGraph } from "./helpers/fixture-graph.js";
import { registerComposedLocation } from "./validation.diagnostic-rendering.composed-location.test.generated.js";
import { registerTableCellLocation } from "./validation.diagnostic-rendering.table-cell-location.test.generated.js";

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

function localOf(id: string): string {
  return id.slice(id.indexOf(":") + 1);
}

/* ----- spec:consumers.design-review ----- */

/** Path-and-content digest of a whole tree — the evidence that reading the graph wrote nothing. */
function fingerprintTree(root: string): string {
  const hash = createHash("sha256");
  const walk = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
      left.name < right.name ? -1 : left.name > right.name ? 1 : 0,
    )) {
      const path = join(directory, entry.name);
      hash.update(path);
      hash.update("\0");

      if (entry.isDirectory()) {
        walk(path);
      } else {
        hash.update(readFileSync(path));
        hash.update("\0");
      }
    }
  };
  walk(root);

  return hash.digest("hex");
}

interface ProjectionWorld {
  readonly root: string;
  fingerprintBefore: string;
  fingerprintAfter: string;
  specIds: readonly string[];
  packIds: readonly string[];
  warning: Finding | undefined;
  pages: readonly DesignReviewPage[] | undefined;
  secondPages: readonly DesignReviewPage[] | undefined;
}

function renderedPagesOf(world: ProjectionWorld): readonly DesignReviewPage[] {
  if (world.pages === undefined) {
    throw new Error("The rendering step must run before the page set is read.");
  }

  return world.pages;
}

function createProjectionWorld(_point: Partial<DesignReviewConditions>): ProjectionWorld {
  void _point;
  // The whole pipeline over a real on-disk root: nothing here hands the projection a hand-built
  // graph, because a page that is a pure function of the graph can only be read as one when the
  // graph came from the extractor the way it does in production.
  const root = materializeExtractCorpus("consumer-surface");
  temporaryRoots.add(root);

  const derived = extract({ root });
  expect(derived.report.findings).toEqual([]);
  const specIds = derived.graph.nodes
    .filter((node) => node.nodeType === "Primitive")
    .map((node) => node.id);
  const packIds = derived.graph.nodes
    .filter((node) => node.nodeType === "Pack")
    .map((node) => node.id);
  expect(specIds.length).toBeGreaterThan(1);
  expect(packIds).toHaveLength(1);

  const findings = validateGraph(derived.graph).findings;
  expect(findings.filter((finding) => finding.severity === "error")).toEqual([]);
  expect(findings).toHaveLength(1);

  return {
    root,
    fingerprintBefore: fingerprintTree(root),
    fingerprintAfter: "",
    specIds,
    packIds,
    warning: findings[0],
    pages: undefined,
    secondPages: undefined,
  };
}

function invokePureProjection(world: ProjectionWorld): void {
  world.pages = renderDesignReview(createReader(extract({ root: world.root }).graph));
  // The second run derives its own graph from the same source rather than re-using the first
  // one: a renderer that carried a timestamp, a run id, or a cached handle would diverge here
  // where a re-render off one graph object could still agree.
  world.secondPages = renderDesignReview(createReader(extract({ root: world.root }).graph));
  world.fingerprintAfter = fingerprintTree(world.root);
}

function observePureProjection(world: ProjectionWorld): DesignReviewOutcome {
  const index = renderedPagesOf(world).find((page) => page.path === "index.md");

  return {
    kind: "the page set holds the index page {indexPage}, one page per Spec, and one page per Pack",
    indexPage: index?.path ?? "",
  };
}

function expectedPureProjection(_point: Partial<DesignReviewConditions>): DesignReviewOutcome {
  void _point;
  const { indexPage } = paramsForStep(
    pureProjectionContract,
    "the page set holds the index page {indexPage}, one page per Spec, and one page per Pack",
  );

  return {
    kind: "the page set holds the index page {indexPage}, one page per Spec, and one page per Pack",
    indexPage,
  };
}

function assertPureProjection(world: ProjectionWorld): void {
  const { indexPage } = paramsForStep(
    pureProjectionContract,
    "the page set holds the index page {indexPage}, one page per Spec, and one page per Pack",
  );
  const { packPage } = paramsForStep(
    pureProjectionContract,
    "the page {packPage} renders its members in context",
  );
  const { specPage, findingId } = paramsForStep(
    pureProjectionContract,
    "the page {specPage} renders the finding {findingId} as data",
  );
  const { byteIdentical } = paramsForStep(
    pureProjectionContract,
    "a second render from a freshly derived graph is byte-identical: {byteIdentical}",
  );
  const { rootUntouched } = paramsForStep(
    pureProjectionContract,
    "the render leaves the extraction root byte-identical: {rootUntouched}",
  );

  expect(renderedPagesOf(world).map((page) => page.path)).toEqual(
    [
      indexPage,
      ...world.specIds.map((id) => `spec/${localOf(id)}.md`),
      ...world.packIds.map((id) => `pack/${localOf(id)}.md`),
    ].sort(),
  );
  for (const id of world.specIds) {
    expect(pageOf(renderedPagesOf(world), indexPage)).toContain(`\`${id}\``);
  }

  const packRendered = pageOf(renderedPagesOf(world), packPage);
  for (const id of world.specIds) {
    expect(packRendered).toContain(`[\`${id}\`](../spec/${localOf(id)}.md)`);
  }
  expect(packRendered).toContain("| Spec | Kind | Altitude | Stated | Floor reached |");

  const specRendered = pageOf(renderedPagesOf(world), specPage);
  const warning = world.warning;
  expect(warning?.validatorId).toBe(findingId);
  expect(specRendered).toContain(`\`${findingId}\``);
  expect(specRendered).toContain(warning?.severity ?? "");
  expect(warning?.subjectId).toBe(`spec:${specPage.slice("spec/".length, -".md".length)}`);
  const named = new Set([warning?.subjectId, warning?.relatedId]);

  for (const page of renderedPagesOf(world)) {
    if (page.path === "index.md") {
      continue;
    }

    const [directory, file] = page.path.split("/");
    const subject = `${directory === "spec" ? "spec" : "pack"}:${(file ?? "").slice(0, -".md".length)}`;

    expect(page.content.includes(`\`${findingId}\``), page.path).toBe(named.has(subject));
  }

  expect(JSON.stringify(world.secondPages) === JSON.stringify(world.pages)).toBe(byteIdentical);
  expect(world.fingerprintAfter === world.fingerprintBefore).toBe(rootUntouched);
  expect(existsSync(join(world.root, "generated"))).toBe(!rootUntouched);
}

const pureProjectionTestAnchor = specTest({
  id: testAnchorId("test:protocol.design-review.pure-projection"),
  label: "the pure-projection point verifies the view's own law over a whole-pipeline root",
  verifies: ref("spec:consumers.design-review.pure-projection"),
});
void pureProjectionTestAnchor;

registerPureProjection({
  createWorld: createProjectionWorld,
  invoke: invokePureProjection,
  observe: observePureProjection,
  expected: expectedPureProjection,
  assertions: assertPureProjection,
});

/* ----- spec:consumers.derived-readiness-banner ----- */

const BANNER_PARENT_ID = "spec:probe.banner-parent";

interface BannerWorld {
  specId: string;
  statedReadiness: SpecReadiness;
  blockingQuestion: boolean;
  pages: readonly DesignReviewPage[] | undefined;
}

function createBannerWorld(point: Partial<DerivedReadinessBannerConditions>): BannerWorld {
  return {
    specId: point.specId ?? "",
    statedReadiness: point.statedReadiness ?? "idea",
    blockingQuestion: point.structure === "records a blocking open question",
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

function invokeBannerRender(world: BannerWorld): void {
  if (world.specId === "") {
    return;
  }

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

  world.pages = renderDesignReview(createReader(deriveFixtureGraph({ specs: [parent, subject] })));
}

function observeBannerFloor(world: BannerWorld): DerivedReadinessBannerOutcome {
  const named =
    /\*\*Readiness:\*\* stated `[^`]+` · structural floor reached: `(?<floorReached>[^`]+)`/u.exec(
      bannerPage(world),
    );
  const floorReached = named?.groups?.floorReached;

  if (floorReached !== "scoped" && floorReached !== "ready") {
    throw new Error("The spec page did not render a structural floor the banner law can read.");
  }

  return {
    kind: "the spec page renders the floor reached {floorReached}",
    floorReached,
  };
}

function expectedBannerFloor(
  point: Partial<DerivedReadinessBannerConditions>,
  contract: typeof dishonestDivergenceContract | typeof honestHeadroomContract,
): DerivedReadinessBannerOutcome {
  if (
    point.specId === undefined ||
    point.statedReadiness === undefined ||
    point.structure === undefined
  ) {
    return unspecified;
  }

  const { floorReached } = paramsForStep(
    contract,
    "the spec page renders the floor reached {floorReached}",
  );

  return {
    kind: "the spec page renders the floor reached {floorReached}",
    floorReached,
  };
}

function assertBannerPair(
  world: BannerWorld,
  contract: typeof dishonestDivergenceContract | typeof honestHeadroomContract,
): void {
  const { floorReached } = paramsForStep(
    contract,
    "the spec page renders the floor reached {floorReached}",
  );
  const { bannerRaised } = paramsForStep(
    contract,
    "the divergence banner is raised: {bannerRaised}",
  );

  expect(bannerPage(world)).toContain(
    `**Readiness:** stated \`${world.statedReadiness}\` · structural floor reached: \`${floorReached}\``,
  );
  expect(bannerLineOf(world) !== undefined).toBe(bannerRaised);
}

function assertDishonestBanner(world: BannerWorld): void {
  assertBannerPair(world, dishonestDivergenceContract);
  const { clauseId } = paramsForStep(
    dishonestDivergenceContract,
    "the banner names the first unmet clause {clauseId}",
  );
  const named = /First unmet clause: `(?<clauseId>[^`]+)` — (?<description>.+)$/u.exec(
    bannerLineOf(world) ?? "the divergence banner is missing",
  );

  expect(named?.groups?.clauseId).toBe(clauseId);
  expect((named?.groups?.description ?? "").length).toBeGreaterThan(0);
}

const dishonestDivergenceTestAnchor = specTest({
  id: testAnchorId("test:protocol.derived-readiness-banner.dishonest-divergence"),
  label: "the overstated-rung point verifies the banner and its first unmet clause",
  verifies: ref("spec:consumers.derived-readiness-banner.dishonest-divergence"),
});
void dishonestDivergenceTestAnchor;

registerDishonestDivergence({
  createWorld: createBannerWorld,
  invoke: invokeBannerRender,
  observe: observeBannerFloor,
  expected: (point) => expectedBannerFloor(point, dishonestDivergenceContract),
  assertions: assertDishonestBanner,
});

const honestHeadroomTestAnchor = specTest({
  id: testAnchorId("test:protocol.derived-readiness-banner.honest-headroom"),
  label: "the understated-rung point verifies the one-direction bound on the banner",
  verifies: ref("spec:consumers.derived-readiness-banner.honest-headroom"),
});
void honestHeadroomTestAnchor;

registerHonestHeadroom({
  createWorld: createBannerWorld,
  invoke: invokeBannerRender,
  observe: observeBannerFloor,
  expected: (point) => expectedBannerFloor(point, honestHeadroomContract),
  assertions: (world) => {
    assertBannerPair(world, honestHeadroomContract);
  },
});

/* ----- spec:consumers.binding-language-views ----- */

const BINDING_PARENT_ID = "spec:probe.binding-parent";

interface BindingWorld {
  specId: string;
  bound: boolean;
  packId: string;
  pages: readonly DesignReviewPage[] | undefined;
}

function bindingWorld(): BindingWorld {
  return { specId: "", bound: false, packId: "", pages: undefined };
}

function createBindingWorld(point: Partial<BindingLanguageViewsConditions>): BindingWorld {
  return {
    specId: point.specId ?? "",
    bound: point.bindings === "an implementing code anchor and a verifying test anchor",
    packId: point.packId ?? "",
    pages: undefined,
  };
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

/** A member's row in the pack member table — the other aggregate surface rule 5 names. */
function memberRowOf(world: BindingWorld, memberId: string): string {
  const packPage = `pack/${world.packId.slice(world.packId.indexOf(":") + 1)}.md`;
  const row = pageOf(bindingPages(world), packPage)
    .split("\n")
    .find((line) => line.startsWith(`| [\`${memberId}\`]`));

  if (row === undefined) {
    throw new Error(`The pack member table is missing a row for "${memberId}".`);
  }

  return row;
}

/** Every aggregate surface the world actually rendered, beside the spec page itself. */
function renderedSurfaces(world: BindingWorld): readonly string[] {
  return world.packId === ""
    ? [bindingPage(world), indexRowOf(world)]
    : [bindingPage(world), indexRowOf(world), memberRowOf(world, world.specId)];
}

function renderBindingGraph(world: BindingWorld): void {
  if (world.specId === "") {
    return;
  }

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

  // The pack lists the bound subject beside the unbound parent, so the member table has to
  // render both binding values and a shorthand cannot pass by matching one of them.
  const packs =
    world.packId === ""
      ? []
      : [
          probePack({
            id: probePackId(world.packId),
            title: "Probe aggregate for the rendered binding vocabulary",
            framing: "One bound member and one unbound member, read as one review set.",
            specs: [specId(world.specId), specId(BINDING_PARENT_ID)],
          }),
        ];

  world.pages = renderDesignReview(
    createReader(deriveFixtureGraph({ specs: [parent, subject], packs, anchors })),
  );
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
    renderBindingGraph(world);
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
    for (const surface of renderedSurfaces(world)) {
      expect(surface.includes(params.factName)).toBe(params.factNameRendered);
      expect(surface.includes("has-verifier")).toBe(params.factNameRendered);
    }
  },
};

function observePackMemberTable(world: BindingWorld): BindingLanguageViewsOutcome {
  return {
    kind: "the pack member table repeats those binding values for the spec: {memberTableRepeats}",
    memberTableRepeats: memberRowOf(world, world.specId).endsWith("| present | present |"),
  };
}

function expectedPackMemberTable(
  point: Partial<BindingLanguageViewsConditions>,
): BindingLanguageViewsOutcome {
  if (point.specId === undefined || point.bindings === undefined || point.packId === undefined) {
    return unspecified;
  }

  const { memberTableRepeats } = paramsForStep(
    packMemberTableContract,
    "the pack member table repeats those binding values for the spec: {memberTableRepeats}",
  );

  return {
    kind: "the pack member table repeats those binding values for the spec: {memberTableRepeats}",
    memberTableRepeats,
  };
}

function assertPackMemberTable(world: BindingWorld): void {
  const { memberTableRepeats } = paramsForStep(
    packMemberTableContract,
    "the pack member table repeats those binding values for the spec: {memberTableRepeats}",
  );
  const { factName, factNameRendered } = paramsForStep(
    packMemberTableContract,
    "the internal delivery-fact name {factName} appears as rendered label text: {factNameRendered}",
  );

  // The negative beside the positive: the unbound member's cells read the other word of the
  // same pair, so a table that hard-coded one value could not satisfy both rows.
  expect(memberRowOf(world, BINDING_PARENT_ID).endsWith("| none | none |")).toBe(
    memberTableRepeats,
  );

  for (const surface of renderedSurfaces(world)) {
    expect(surface.includes(factName)).toBe(factNameRendered);
    expect(surface.includes("has-verifier")).toBe(factNameRendered);
  }
}

const boundSpecPageTestAnchor = specTest({
  id: testAnchorId("test:protocol.binding-language-views.bound-spec-page"),
  label: "the bound-surface point verifies the rendered binding vocabulary",
  verifies: ref("spec:consumers.binding-language-views.bound-spec-page"),
});
void boundSpecPageTestAnchor;

// bindExample(boundSpecPageContract — refused: generated sibling requires unused packId
bindExample(boundSpecPageContract, bindingWorld, bindingLanguageBindings);

const packMemberTableTestAnchor = specTest({
  id: testAnchorId("test:protocol.binding-language-views.pack-member-table"),
  label: "the pack-member point verifies the aggregate half of the rendered binding vocabulary",
  verifies: ref("spec:consumers.binding-language-views.pack-member-table"),
});
void packMemberTableTestAnchor;

registerPackMemberTable({
  createWorld: createBindingWorld,
  invoke: renderBindingGraph,
  observe: observePackMemberTable,
  expected: expectedPackMemberTable,
  assertions: assertPackMemberTable,
});

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

/** The same shape, with an id the grammar refuses — one hard extraction error, nothing else. */
const REFUSED_CARRIER = `---
id: probe-view-subject
kind: rule
altitude: story
readiness: idea
relations: {}
---
# A carrier the extractor refuses

## Intent
- outcome: Fail extraction so the run cannot produce a current view.
`;

interface ViewWorld {
  readonly root: string;
  stalePage: string;
  plantLate: boolean;
  exitCode: number | undefined;
}

function viewPathOf(world: ViewWorld): string {
  return join(world.root, "generated", "design-review");
}

/**
 * The planted page names a subject the corpus does not hold, so nothing the run writes can
 * overwrite it: it survives only if a run is allowed to leave an earlier one's output behind.
 */
function plantStalePage(world: ViewWorld): void {
  const stalePath = join(viewPathOf(world), ...world.stalePage.split("/"));
  mkdirSync(dirname(stalePath), { recursive: true });
  writeFileSync(stalePath, "# A spec the corpus no longer holds\n", "utf8");
}

function createViewWorld(point: Partial<WholesaleViewRewriteConditions>): ViewWorld {
  const root = mkdtempSync(join(tmpdir(), "sdp-self-hosting-view-"));
  temporaryRoots.add(root);
  const world: ViewWorld = {
    root,
    stalePage: point.stalePage ?? "",
    plantLate: point.planted === "after the build has invalidated the view",
    exitCode: undefined,
  };

  if (point.corpus === undefined) {
    return world;
  }

  mkdirSync(join(world.root, "specs"), { recursive: true });
  writeFileSync(
    join(world.root, "specs", "probe.sdp.md"),
    point.corpus === "one authored spec" ? PROBE_CARRIER : REFUSED_CARRIER,
    "utf8",
  );

  if (point.planted === "before the run") {
    plantStalePage(world);
  }

  return world;
}

function invokeViewCommand(world: ViewWorld, point: Partial<WholesaleViewRewriteConditions>): void {
  if (point.command === undefined) {
    return;
  }

  const parsed = { root: world.root, exclude: [], checkClean: false };
  // Late planting rides the extraction seam the build already declares, used here only as a
  // clock: it runs *after* the build's up-front invalidation and delegates to the real
  // extractor, so the page the run must evict is one that invalidation cannot have removed.
  const hooks = world.plantLate
    ? {
        extract: (options: Parameters<typeof extract>[0]) => {
          plantStalePage(world);

          return extract(options);
        },
      }
    : {};

  world.exitCode =
    point.command === "view"
      ? runView(parsed, {}, hooks)
      : runBuild(parsed, {}, "build", hooks).exitCode;
}

function observeViewExit(world: ViewWorld): WholesaleViewRewriteOutcome {
  if (world.exitCode === undefined) {
    throw new Error("The view command must run before its exit code is read.");
  }

  return { kind: "the run exits {exitCode}", exitCode: world.exitCode };
}

function expectedViewExit(
  point: Partial<WholesaleViewRewriteConditions>,
  contract:
    | typeof stalePageRemovedContract
    | typeof lateStalePageContract
    | typeof failedRunViewRemovedContract
    | typeof buildInvalidatesViewContract,
): WholesaleViewRewriteOutcome {
  if (
    point.corpus === undefined ||
    point.stalePage === undefined ||
    point.planted === undefined ||
    point.command === undefined
  ) {
    return unspecified;
  }

  const { exitCode } = paramsForStep(contract, "the run exits {exitCode}");

  return { kind: "the run exits {exitCode}", exitCode };
}

function assertViewSurvivals(
  world: ViewWorld,
  contract:
    | typeof stalePageRemovedContract
    | typeof lateStalePageContract
    | typeof failedRunViewRemovedContract
    | typeof buildInvalidatesViewContract,
  currentPage: string | undefined,
): void {
  const { viewSurvives } = paramsForStep(contract, "the view directory survives: {viewSurvives}");
  const { staleSurvives } = paramsForStep(contract, "the stale page survives: {staleSurvives}");
  const { temporarySurvives } = paramsForStep(
    contract,
    "a temporary view sibling survives: {temporarySurvives}",
  );

  expect(existsSync(viewPathOf(world))).toBe(viewSurvives);
  if (currentPage !== undefined) {
    expect(existsSync(join(viewPathOf(world), ...currentPage.split("/")))).toBe(true);
    expect(existsSync(join(viewPathOf(world), "spec", "probe.view-subject.md"))).toBe(true);
  }
  expect(existsSync(join(viewPathOf(world), ...world.stalePage.split("/")))).toBe(staleSurvives);
  expect(existsSync(`${viewPathOf(world)}.tmp`)).toBe(temporarySurvives);
}

const stalePageRemovedTestAnchor = specTest({
  id: testAnchorId("test:protocol.wholesale-view-rewrite.stale-page-removed"),
  label: "the stale-page point verifies the wholesale rewrite of the view directory",
  verifies: ref("spec:consumers.wholesale-view-rewrite.stale-page-removed"),
});
void stalePageRemovedTestAnchor;

registerStalePageRemoved({
  createWorld: createViewWorld,
  invoke: invokeViewCommand,
  observe: observeViewExit,
  expected: (point) => expectedViewExit(point, stalePageRemovedContract),
  assertions: (world) => {
    const { currentPage } = paramsForStep(
      stalePageRemovedContract,
      "the view holds the current page {currentPage}",
    );
    assertViewSurvivals(world, stalePageRemovedContract, currentPage);
  },
});

const lateStalePageTestAnchor = specTest({
  id: testAnchorId("test:protocol.wholesale-view-rewrite.late-stale-page"),
  label: "the late-page point verifies that the swap itself evicts what invalidation missed",
  verifies: ref("spec:consumers.wholesale-view-rewrite.late-stale-page"),
});
void lateStalePageTestAnchor;

registerLateStalePage({
  createWorld: createViewWorld,
  invoke: invokeViewCommand,
  observe: observeViewExit,
  expected: (point) => expectedViewExit(point, lateStalePageContract),
  assertions: (world) => {
    const { currentPage } = paramsForStep(
      lateStalePageContract,
      "the view holds the current page {currentPage}",
    );
    assertViewSurvivals(world, lateStalePageContract, currentPage);
  },
});

const failedRunViewRemovedTestAnchor = specTest({
  id: testAnchorId("test:protocol.wholesale-view-rewrite.failed-run-view-removed"),
  label: "the failed-run point verifies that an uncertifiable view is removed, not left readable",
  verifies: ref("spec:consumers.wholesale-view-rewrite.failed-run-view-removed"),
});
void failedRunViewRemovedTestAnchor;

registerFailedRunViewRemoved({
  createWorld: createViewWorld,
  invoke: invokeViewCommand,
  observe: observeViewExit,
  expected: (point) => expectedViewExit(point, failedRunViewRemovedContract),
  assertions: (world) => {
    assertViewSurvivals(world, failedRunViewRemovedContract, undefined);
  },
});

const buildInvalidatesViewTestAnchor = specTest({
  id: testAnchorId("test:protocol.wholesale-view-rewrite.build-invalidates-view"),
  label: "the build point verifies the up-front invalidation on a command that renders no view",
  verifies: ref("spec:consumers.wholesale-view-rewrite.build-invalidates-view"),
});
void buildInvalidatesViewTestAnchor;

registerBuildInvalidatesView({
  createWorld: createViewWorld,
  invoke: invokeViewCommand,
  observe: observeViewExit,
  expected: (point) => expectedViewExit(point, buildInvalidatesViewContract),
  assertions: (world) => {
    assertViewSurvivals(world, buildInvalidatesViewContract, undefined);
  },
});

/* ----- spec:validation.diagnostic-rendering ----- */

type LocationFields = Pick<Finding, "file" | "line">;

interface DiagnosticWorld {
  finding: Finding | undefined;
  renderer: DiagnosticRenderingConditions["renderer"] | undefined;
  file: string;
  line: number;
  withLocation: string;
  fileOnly: string;
  neither: string;
}

function createDiagnosticWorld(point: Partial<DiagnosticRenderingConditions>): DiagnosticWorld {
  return {
    finding:
      point.validatorId === undefined || point.severity === undefined || point.message === undefined
        ? undefined
        : {
            validatorId: point.validatorId,
            family: "honesty",
            severity: point.severity,
            message: point.message,
          },
    renderer: point.renderer,
    file: "",
    line: 0,
    withLocation: "",
    fileOnly: "",
    neither: "",
  };
}

function renderDiagnostic(world: DiagnosticWorld, location: LocationFields): string {
  const finding = world.finding;

  if (finding === undefined || world.renderer === undefined) {
    throw new Error("The finding and renderer must be bound before a location shape is formatted.");
  }

  return world.renderer === "command-line"
    ? formatFinding({ ...finding, ...location })
    : (renderFindings([{ ...finding, ...location }]).at(-1) ?? "");
}

function invokeDiagnosticShapes(
  world: DiagnosticWorld,
  point: Partial<DiagnosticRenderingConditions>,
): void {
  if (world.finding === undefined || point.renderer === undefined) {
    return;
  }

  if (point.renderer === "command-line") {
    const composed = paramsForStep(
      composedLocationContract,
      "the finding carrying the file {file} and the line {line} renders {withLocation}",
    );
    world.file = composed.file;
    world.line = composed.line;
    world.withLocation = renderDiagnostic(world, { file: composed.file, line: composed.line });
    world.fileOnly = renderDiagnostic(world, { file: composed.file });
    world.neither = renderDiagnostic(world, {});
    return;
  }

  const table = paramsForStep(
    tableCellLocationContract,
    "the findings row carrying the file {file} and the line {line} renders {locationRow}",
  );
  world.file = table.file;
  world.line = table.line;
  world.withLocation = renderDiagnostic(world, { file: table.file, line: table.line });
  world.fileOnly = renderDiagnostic(world, { file: table.file });
  world.neither = renderDiagnostic(world, {});
}

function observeComposedLocation(world: DiagnosticWorld): DiagnosticRenderingOutcome {
  return {
    kind: "the finding carrying the file {file} and the line {line} renders {withLocation}",
    file: world.file,
    line: world.line,
    withLocation: world.withLocation.replace(/\n$/u, ""),
  };
}

function expectedComposedLocation(
  point: Partial<DiagnosticRenderingConditions>,
): DiagnosticRenderingOutcome {
  if (
    point.validatorId === undefined ||
    point.severity === undefined ||
    point.message === undefined ||
    point.renderer === undefined
  ) {
    return unspecified;
  }

  const { file, line, withLocation } = paramsForStep(
    composedLocationContract,
    "the finding carrying the file {file} and the line {line} renders {withLocation}",
  );

  return {
    kind: "the finding carrying the file {file} and the line {line} renders {withLocation}",
    file,
    line,
    withLocation,
  };
}

function assertComposedLocation(world: DiagnosticWorld): void {
  const { withLocation } = paramsForStep(
    composedLocationContract,
    "the finding carrying the file {file} and the line {line} renders {withLocation}",
  );
  const { fileOnly } = paramsForStep(
    composedLocationContract,
    "the same finding carrying the file alone renders {fileOnly}",
  );
  const { bare } = paramsForStep(
    composedLocationContract,
    "the same finding carrying neither renders {bare}",
  );

  expect(world.withLocation).toBe(`${withLocation}\n`);
  expect(world.fileOnly).toBe(`${fileOnly}\n`);
  expect(world.neither).toBe(`${bare}\n`);
  expect(world.withLocation.indexOf(world.file)).toBe(world.withLocation.lastIndexOf(world.file));
}

function observeTableCellLocation(world: DiagnosticWorld): DiagnosticRenderingOutcome {
  return {
    kind: "the findings row carrying the file {file} and the line {line} renders {locationRow}",
    file: world.file,
    line: world.line,
    locationRow: world.withLocation,
  };
}

function expectedTableCellLocation(
  point: Partial<DiagnosticRenderingConditions>,
): DiagnosticRenderingOutcome {
  if (
    point.validatorId === undefined ||
    point.severity === undefined ||
    point.message === undefined ||
    point.renderer === undefined
  ) {
    return unspecified;
  }

  const { file, line, locationRow } = paramsForStep(
    tableCellLocationContract,
    "the findings row carrying the file {file} and the line {line} renders {locationRow}",
  );

  return {
    kind: "the findings row carrying the file {file} and the line {line} renders {locationRow}",
    file,
    line,
    locationRow,
  };
}

function assertTableCellLocation(world: DiagnosticWorld): void {
  const { fileOnlyRow } = paramsForStep(
    tableCellLocationContract,
    "the same row carrying the file alone renders {fileOnlyRow}",
  );
  const { absentRow } = paramsForStep(
    tableCellLocationContract,
    "the same row carrying neither renders {absentRow}",
  );

  expect(world.fileOnly).toBe(fileOnlyRow);
  expect(world.neither).toBe(absentRow);
  expect(world.withLocation.indexOf(world.file)).toBe(world.withLocation.lastIndexOf(world.file));
}

const composedLocationTestAnchor = specTest({
  id: testAnchorId("test:protocol.diagnostic-rendering.composed-location"),
  label: "the composed-location point verifies the one rendering rule and both degradations",
  verifies: ref("spec:validation.diagnostic-rendering.composed-location"),
});
void composedLocationTestAnchor;

registerComposedLocation({
  createWorld: createDiagnosticWorld,
  invoke: invokeDiagnosticShapes,
  observe: observeComposedLocation,
  expected: expectedComposedLocation,
  assertions: assertComposedLocation,
});

const tableCellLocationTestAnchor = specTest({
  id: testAnchorId("test:protocol.diagnostic-rendering.table-cell-location"),
  label: "the table-cell point verifies the same composition rule on the Design Review's twin",
  verifies: ref("spec:validation.diagnostic-rendering.table-cell-location"),
});
void tableCellLocationTestAnchor;

registerTableCellLocation({
  createWorld: createDiagnosticWorld,
  invoke: invokeDiagnosticShapes,
  observe: observeTableCellLocation,
  expected: expectedTableCellLocation,
  assertions: assertTableCellLocation,
});
