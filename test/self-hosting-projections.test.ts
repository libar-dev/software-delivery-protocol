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
import { bindExample } from "@libar-dev/software-delivery-protocol/vitest";

import { boundSpecPageContract } from "../generated/contracts/consumers.binding-language-views.bound-spec-page.contract.js";
import { packMemberTableContract } from "../generated/contracts/consumers.binding-language-views.pack-member-table.contract.js";
import { dishonestDivergenceContract } from "../generated/contracts/consumers.derived-readiness-banner.dishonest-divergence.contract.js";
import { pureProjectionContract } from "../generated/contracts/consumers.design-review.pure-projection.contract.js";
import { honestHeadroomContract } from "../generated/contracts/consumers.derived-readiness-banner.honest-headroom.contract.js";
import { buildInvalidatesViewContract } from "../generated/contracts/consumers.wholesale-view-rewrite.build-invalidates-view.contract.js";
import { failedRunViewRemovedContract } from "../generated/contracts/consumers.wholesale-view-rewrite.failed-run-view-removed.contract.js";
import { lateStalePageContract } from "../generated/contracts/consumers.wholesale-view-rewrite.late-stale-page.contract.js";
import { stalePageRemovedContract } from "../generated/contracts/consumers.wholesale-view-rewrite.stale-page-removed.contract.js";
import { composedLocationContract } from "../generated/contracts/validation.diagnostic-rendering.composed-location.contract.js";
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
import { materializeExtractCorpus } from "./helpers/extract-corpus.js";
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

function projectionWorld(): ProjectionWorld {
  // The whole pipeline over a real on-disk root: nothing here hands the projection a hand-built
  // graph, because a page that is a pure function of the graph can only be read as one when the
  // graph came from the extractor the way it does in production.
  const root = materializeExtractCorpus("consumer-surface");
  temporaryRoots.add(root);

  return {
    root,
    fingerprintBefore: "",
    fingerprintAfter: "",
    specIds: [],
    packIds: [],
    warning: undefined,
    pages: undefined,
    secondPages: undefined,
  };
}

function renderedPagesOf(world: ProjectionWorld): readonly DesignReviewPage[] {
  if (world.pages === undefined) {
    throw new Error("The rendering step must run before the page set is read.");
  }

  return world.pages;
}

function localOf(id: string): string {
  return id.slice(id.indexOf(":") + 1);
}

const pureProjectionBindings = {
  "an extraction root holding a Pack, its member Specs, and one member the checks warn about": (
    world: ProjectionWorld,
  ) => {
    const derived = extract({ root: world.root });

    expect(derived.report.findings).toEqual([]);
    world.specIds = derived.graph.nodes
      .filter((node) => node.nodeType === "Primitive")
      .map((node) => node.id);
    world.packIds = derived.graph.nodes
      .filter((node) => node.nodeType === "Pack")
      .map((node) => node.id);
    expect(world.specIds.length).toBeGreaterThan(1);
    expect(world.packIds).toHaveLength(1);

    const findings = validateGraph(derived.graph).findings;

    expect(findings.filter((finding) => finding.severity === "error")).toEqual([]);
    expect(findings).toHaveLength(1);
    world.warning = findings[0];
  },
  "the Design Review renders the graph derived from that root": (world: ProjectionWorld) => {
    world.fingerprintBefore = fingerprintTree(world.root);
    world.pages = renderDesignReview(createReader(extract({ root: world.root }).graph));
    // The second run derives its own graph from the same source rather than re-using the first
    // one: a renderer that carried a timestamp, a run id, or a cached handle would diverge here
    // where a re-render off one graph object could still agree.
    world.secondPages = renderDesignReview(createReader(extract({ root: world.root }).graph));
    world.fingerprintAfter = fingerprintTree(world.root);
  },
  "the page set holds the index page {indexPage}, one page per Spec, and one page per Pack": (
    world: ProjectionWorld,
    params: { readonly indexPage: string },
  ) => {
    expect(renderedPagesOf(world).map((page) => page.path)).toEqual(
      [
        params.indexPage,
        ...world.specIds.map((id) => `spec/${localOf(id)}.md`),
        ...world.packIds.map((id) => `pack/${localOf(id)}.md`),
      ].sort(),
    );
    // The index is a page of the graph too, not a stub: every Spec is reachable from it.
    for (const id of world.specIds) {
      expect(pageOf(renderedPagesOf(world), params.indexPage)).toContain(`\`${id}\``);
    }
  },
  "the page {packPage} renders its members in context": (
    world: ProjectionWorld,
    params: { readonly packPage: string },
  ) => {
    const rendered = pageOf(renderedPagesOf(world), params.packPage);

    // In context means the aggregate reads as a review set: every member, linked, with the
    // descriptors and binding words the review is conducted in.
    for (const id of world.specIds) {
      expect(rendered).toContain(`[\`${id}\`](../spec/${localOf(id)}.md)`);
    }
    expect(rendered).toContain("| Spec | Kind | Altitude | Stated | Floor reached |");
  },
  "the page {specPage} renders the finding {findingId} as data": (
    world: ProjectionWorld,
    params: { readonly specPage: string; readonly findingId: string },
  ) => {
    const rendered = pageOf(renderedPagesOf(world), params.specPage);
    const warning = world.warning;

    expect(warning?.validatorId).toBe(params.findingId);
    expect(rendered).toContain(`\`${params.findingId}\``);
    expect(rendered).toContain(warning?.severity ?? "");
    // Rendered in context and nowhere else: the finding appears beside every node it names and
    // beside no node it does not. It is the report's data placed where it is read, never a verdict
    // the view attaches to the corpus. (The index is the whole report's aggregate, lawfully.)
    expect(warning?.subjectId).toBe(`spec:${params.specPage.slice("spec/".length, -".md".length)}`);
    const named = new Set([warning?.subjectId, warning?.relatedId]);

    for (const page of renderedPagesOf(world)) {
      if (page.path === "index.md") {
        continue;
      }

      const [directory, file] = page.path.split("/");
      const subject = `${directory === "spec" ? "spec" : "pack"}:${(file ?? "").slice(0, -".md".length)}`;

      expect(page.content.includes(`\`${params.findingId}\``), page.path).toBe(named.has(subject));
    }
  },
  "a second render from a freshly derived graph is byte-identical: {byteIdentical}": (
    world: ProjectionWorld,
    params: { readonly byteIdentical: boolean },
  ) => {
    expect(JSON.stringify(world.secondPages) === JSON.stringify(world.pages)).toBe(
      params.byteIdentical,
    );
  },
  "the render leaves the extraction root byte-identical: {rootUntouched}": (
    world: ProjectionWorld,
    params: { readonly rootUntouched: boolean },
  ) => {
    // Stores no finding, writes no canonical source: two renders later the corpus is the file
    // tree it was, with no view directory, no report, and no approval recorded anywhere.
    expect(world.fingerprintAfter === world.fingerprintBefore).toBe(params.rootUntouched);
    expect(existsSync(join(world.root, "generated"))).toBe(!params.rootUntouched);
  },
};

const pureProjectionTestAnchor = specTest({
  id: testAnchorId("test:protocol.design-review.pure-projection"),
  label: "the pure-projection point verifies the view's own law over a whole-pipeline root",
  verifies: ref("spec:consumers.design-review.pure-projection"),
});
void pureProjectionTestAnchor;

bindExample(pureProjectionContract, projectionWorld, pureProjectionBindings);

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
  packId: string;
  pages: readonly DesignReviewPage[] | undefined;
}

function bindingWorld(): BindingWorld {
  return { specId: "", bound: false, packId: "", pages: undefined };
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
  "the graph holds a pack {packId} listing that spec beside an unbound member": (
    world: BindingWorld,
    params: { readonly packId: string },
  ) => {
    world.packId = params.packId;
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
  "the pack member table repeats those binding values for the spec: {memberTableRepeats}": (
    world: BindingWorld,
    params: { readonly memberTableRepeats: boolean },
  ) => {
    expect(memberRowOf(world, world.specId).endsWith("| present | present |")).toBe(
      params.memberTableRepeats,
    );
    // The negative beside the positive: the unbound member's cells read the other word of the
    // same pair, so a table that hard-coded one value could not satisfy both rows.
    expect(memberRowOf(world, BINDING_PARENT_ID).endsWith("| none | none |")).toBe(
      params.memberTableRepeats,
    );
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

const boundSpecPageTestAnchor = specTest({
  id: testAnchorId("test:protocol.binding-language-views.bound-spec-page"),
  label: "the bound-surface point verifies the rendered binding vocabulary",
  verifies: ref("spec:consumers.binding-language-views.bound-spec-page"),
});
void boundSpecPageTestAnchor;

bindExample(boundSpecPageContract, bindingWorld, bindingLanguageBindings);

const packMemberTableTestAnchor = specTest({
  id: testAnchorId("test:protocol.binding-language-views.pack-member-table"),
  label: "the pack-member point verifies the aggregate half of the rendered binding vocabulary",
  verifies: ref("spec:consumers.binding-language-views.pack-member-table"),
});
void packMemberTableTestAnchor;

bindExample(packMemberTableContract, bindingWorld, bindingLanguageBindings);

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

function viewWorld(): ViewWorld {
  const root = mkdtempSync(join(tmpdir(), "sdp-self-hosting-view-"));
  temporaryRoots.add(root);

  return { root, stalePage: "", plantLate: false, exitCode: undefined };
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

const wholesaleRewriteBindings = {
  "an extraction root holding {corpus} and a stale view page {stalePage}": (
    world: ViewWorld,
    params: {
      readonly corpus: "one authored spec" | "one authored spec the extractor refuses";
      readonly stalePage: string;
    },
  ) => {
    mkdirSync(join(world.root, "specs"), { recursive: true });
    writeFileSync(
      join(world.root, "specs", "probe.sdp.md"),
      params.corpus === "one authored spec" ? PROBE_CARRIER : REFUSED_CARRIER,
      "utf8",
    );
    world.stalePage = params.stalePage;
  },
  "the stale page is planted {planted}": (
    world: ViewWorld,
    params: {
      readonly planted: "before the run" | "after the build has invalidated the view";
    },
  ) => {
    world.plantLate = params.planted === "after the build has invalidated the view";

    if (!world.plantLate) {
      plantStalePage(world);
    }
  },
  "the {command} command runs at that root": (
    world: ViewWorld,
    params: { readonly command: "view" | "build" },
  ) => {
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
      params.command === "view"
        ? runView(parsed, {}, hooks)
        : runBuild(parsed, {}, "build", hooks).exitCode;
  },
  "the run exits {exitCode}": (world: ViewWorld, params: { readonly exitCode: number }) => {
    expect(world.exitCode).toBe(params.exitCode);
  },
  "the view directory survives: {viewSurvives}": (
    world: ViewWorld,
    params: { readonly viewSurvives: boolean },
  ) => {
    expect(existsSync(viewPathOf(world))).toBe(params.viewSurvives);
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

const lateStalePageTestAnchor = specTest({
  id: testAnchorId("test:protocol.wholesale-view-rewrite.late-stale-page"),
  label: "the late-page point verifies that the swap itself evicts what invalidation missed",
  verifies: ref("spec:consumers.wholesale-view-rewrite.late-stale-page"),
});
void lateStalePageTestAnchor;

bindExample(lateStalePageContract, viewWorld, wholesaleRewriteBindings);

const failedRunViewRemovedTestAnchor = specTest({
  id: testAnchorId("test:protocol.wholesale-view-rewrite.failed-run-view-removed"),
  label: "the failed-run point verifies that an uncertifiable view is removed, not left readable",
  verifies: ref("spec:consumers.wholesale-view-rewrite.failed-run-view-removed"),
});
void failedRunViewRemovedTestAnchor;

bindExample(failedRunViewRemovedContract, viewWorld, wholesaleRewriteBindings);

const buildInvalidatesViewTestAnchor = specTest({
  id: testAnchorId("test:protocol.wholesale-view-rewrite.build-invalidates-view"),
  label: "the build point verifies the up-front invalidation on a command that renders no view",
  verifies: ref("spec:consumers.wholesale-view-rewrite.build-invalidates-view"),
});
void buildInvalidatesViewTestAnchor;

bindExample(buildInvalidatesViewContract, viewWorld, wholesaleRewriteBindings);

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
  "the {renderer} renderer formats that finding once per location shape": (
    world: DiagnosticWorld,
    params: { readonly renderer: "command-line" | "Design Review" },
  ) => {
    const finding = world.finding;

    if (finding === undefined) {
      throw new Error("The finding step must run before the renderer is bound to it.");
    }

    // One finding, one renderer: each outcome step below supplies a location shape and reads what
    // the real renderer composed from those structured fields alone. Both entrypoints the Spec
    // names are called directly — `formatFinding` for the command line, `renderFindings` for the
    // Design Review's table — because each is the seam its own surface renders through.
    world.render =
      params.renderer === "command-line"
        ? (location) => formatFinding({ ...finding, ...location })
        : (location) => renderFindings([{ ...finding, ...location }]).at(-1) ?? "";
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
  "the findings row carrying the file {file} and the line {line} renders {locationRow}": (
    world: DiagnosticWorld,
    params: { readonly file: string; readonly line: number; readonly locationRow: string },
  ) => {
    const rendered = renderOf(world)({ file: params.file, line: params.line });

    world.file = params.file;
    expect(rendered).toBe(params.locationRow);
    // The location cell is the only place the path appears — the message cell never carries it.
    expect(rendered.indexOf(params.file)).toBe(rendered.lastIndexOf(params.file));
  },
  "the same row carrying the file alone renders {fileOnlyRow}": (
    world: DiagnosticWorld,
    params: { readonly fileOnlyRow: string },
  ) => {
    expect(renderOf(world)({ file: world.file })).toBe(params.fileOnlyRow);
  },
  "the same row carrying neither renders {absentRow}": (
    world: DiagnosticWorld,
    params: { readonly absentRow: string },
  ) => {
    expect(renderOf(world)({})).toBe(params.absentRow);
  },
};

const composedLocationTestAnchor = specTest({
  id: testAnchorId("test:protocol.diagnostic-rendering.composed-location"),
  label: "the composed-location point verifies the one rendering rule and both degradations",
  verifies: ref("spec:validation.diagnostic-rendering.composed-location"),
});
void composedLocationTestAnchor;

bindExample(composedLocationContract, diagnosticWorld, diagnosticRenderingBindings);

const tableCellLocationTestAnchor = specTest({
  id: testAnchorId("test:protocol.diagnostic-rendering.table-cell-location"),
  label: "the table-cell point verifies the same composition rule on the Design Review's twin",
  verifies: ref("spec:validation.diagnostic-rendering.table-cell-location"),
});
void tableCellLocationTestAnchor;

bindExample(tableCellLocationContract, diagnosticWorld, diagnosticRenderingBindings);
