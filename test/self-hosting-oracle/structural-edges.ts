// The accepted engine components and their authored structural edges. This is a committed oracle:
// tests compare the independently extracted graph with these reviewed declarations rather than
// deriving expected ownership or uses from source paths or imports. The accepted significant-unit
// set is owner-reviewed test state; membership edges are derived from it so they are never
// re-transcribed.

export const expectedComponentIds = [
  "component:protocol.adapters",
  "component:protocol.cli",
  "component:protocol.codegen",
  "component:protocol.extract",
  "component:protocol.graph",
  "component:protocol.import",
  "component:protocol.model",
  "component:protocol.notation",
  "component:protocol.projections",
  "component:protocol.reader",
  "component:protocol.runner",
  "component:protocol.testing",
  "component:protocol.validate",
] as const;

// These impl anchors deliberately have no component. The skill/document realization anchors live
// outside the engine source seams and therefore have no truthful owner among the accepted
// component set.
export const structuralMembershipExceptions = [
  "impl:protocol.authoring-on-ramp",
  "impl:protocol.authoring-recipes",
  "impl:protocol.delivery-session-on-ramp",
] as const;

export const acceptedArchitecturalUnits = [
  {
    unit: "src/adapters/vitest.ts#bindExample",
    anchorId: "impl:protocol.example-runner-adapter",
    componentId: "component:protocol.adapters",
  },
  {
    unit: "src/cli/build-command.ts#runBuild",
    anchorId: "impl:protocol.regenerability",
    componentId: "component:protocol.cli",
  },
  {
    unit: "src/cli/build-command.ts#runBuild",
    anchorId: "impl:protocol.wholesale-view-build-invalidation",
    componentId: "component:protocol.cli",
  },
  {
    unit: "src/cli/build-command.ts#runBuild",
    anchorId: "impl:protocol.build-pipeline-emit",
    componentId: "component:protocol.cli",
  },
  {
    unit: "src/cli/build-command.ts#runBuild",
    anchorId: "impl:protocol.extraction-determinism",
    componentId: "component:protocol.cli",
  },
  {
    unit: "src/cli/output.ts#formatFinding",
    anchorId: "impl:protocol.diagnostic-rendering-cli",
    componentId: "component:protocol.cli",
  },
  {
    unit: "src/cli/q-command.ts#runQuery",
    anchorId: "impl:protocol.build-pipeline-query",
    componentId: "component:protocol.cli",
  },
  {
    unit: "src/cli/validate-view-command.ts#runView",
    anchorId: "impl:protocol.wholesale-view-rewrite",
    componentId: "component:protocol.cli",
  },
  {
    unit: "src/cli/sdp.ts#runSdpCli",
    anchorId: "impl:protocol.agent-surface-cli",
    componentId: "component:protocol.cli",
  },
  {
    unit: "src/cli/census-command.ts#runCensus",
    anchorId: "impl:protocol.census-page-cli",
    componentId: "component:protocol.cli",
  },
  {
    unit: "src/cli/gherkin-command.ts#runGherkinView",
    anchorId: "impl:protocol.gherkin-view-cli",
    componentId: "component:protocol.cli",
  },
  {
    unit: "src/cli/mermaid-command.ts#runMermaid",
    anchorId: "impl:protocol.mermaid-view-cli",
    componentId: "component:protocol.cli",
  },
  {
    unit: "src/cli/import-command.ts#runImport",
    anchorId: "impl:protocol.sdp-import",
    componentId: "component:protocol.cli",
  },
  {
    unit: "src/cli/new-spec-command.ts#runNewSpec",
    anchorId: "impl:protocol.spec-scaffolder",
    componentId: "component:protocol.cli",
  },
  {
    unit: "src/codegen/contracts.ts#generateContracts",
    anchorId: "impl:protocol.executable-contracts",
    componentId: "component:protocol.codegen",
  },
  {
    unit: "src/codegen/contracts.ts#generateContracts",
    anchorId: "impl:protocol.runnable-modules",
    componentId: "component:protocol.codegen",
  },
  {
    unit: "src/extract/anchors.ts#ANCHOR_BUILDER_TARGET_FIELDS",
    anchorId: "impl:protocol.anchor-extraction",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/derive.ts#deriveGraph",
    anchorId: "impl:protocol.derive-graph",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/gherkin.ts#reifyGherkinCarrier",
    anchorId: "impl:protocol.gherkin-authoring",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/index.ts#ExtractOptions",
    anchorId: "impl:protocol.exclusion-surface",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/index.ts#findDuplicatedIds",
    anchorId: "impl:protocol.duplicate-id-exclusion",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/index.ts#extract",
    anchorId: "impl:protocol.extract",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/markdown-pack.ts#reifyMarkdownPack",
    anchorId: "impl:protocol.markdown-pack-authoring",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/markdown.ts#parseMarkdownFrontmatter",
    anchorId: "impl:protocol.envelope-contract",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/markdown.ts#readMarkdownBody",
    anchorId: "impl:protocol.prose-ownership",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/markdown.ts#reifyMarkdownCarrier",
    anchorId: "impl:protocol.markdown-authoring",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/markdown.ts#reifyMarkdownCarrier",
    anchorId: "impl:protocol.markdown-parser",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/discover.ts#normalizeExcludes",
    anchorId: "impl:protocol.discover-files",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/protocol-bindings.ts#protocolBindingScopeFor",
    anchorId: "impl:protocol.protocol-bindings",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/reify.ts#reifySourceFile",
    anchorId: "impl:protocol.static-reification",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/extract/carrier.ts#reifyTypeScriptCarrier",
    anchorId: "impl:protocol.carrier-reification",
    componentId: "component:protocol.extract",
  },
  {
    unit: "src/graph/oracle-bindings.ts#isResolvingOracleModel",
    anchorId: "impl:protocol.oracle-target-eligibility",
    componentId: "component:protocol.graph",
  },
  {
    unit: "src/graph/schema.ts#schemaVersion",
    anchorId: "impl:protocol.schema-version",
    componentId: "component:protocol.graph",
  },
  {
    unit: "src/graph/schema.ts#graphClaims",
    anchorId: "impl:protocol.graph-claims",
    componentId: "component:protocol.graph",
  },
  {
    unit: "src/graph/delivery-facts.ts#computeDeliveryFacts",
    anchorId: "impl:protocol.delivery-facts",
    componentId: "component:protocol.graph",
  },
  {
    unit: "src/graph/example-space.ts#resolveExampleVocabulary",
    anchorId: "impl:protocol.example-space",
    componentId: "component:protocol.graph",
  },
  {
    unit: "src/import/import.ts#importTypeScriptSpec",
    anchorId: "impl:protocol.sdp-import-core",
    componentId: "component:protocol.import",
  },
  {
    unit: "src/import/emit-markdown.ts#emitMarkdownSpec",
    anchorId: "impl:protocol.sdp-import-markdown-emit",
    componentId: "component:protocol.import",
  },
  {
    unit: "src/ids.ts#parseId",
    anchorId: "impl:protocol.stable-ids",
    componentId: "component:protocol.model",
  },
  {
    unit: "src/model/anchors.ts#specTest",
    anchorId: "impl:protocol.anchor-model",
    componentId: "component:protocol.model",
  },
  {
    unit: "src/model/descriptors.ts#SPEC_KIND_DISPLAY_LABELS",
    anchorId: "impl:protocol.spec-descriptors",
    componentId: "component:protocol.model",
  },
  {
    unit: "src/model/pack.ts#pack",
    anchorId: "impl:protocol.pack-aggregate",
    componentId: "component:protocol.model",
  },
  {
    unit: "src/model/relations.ts#supersedes",
    anchorId: "impl:protocol.spec-relations",
    componentId: "component:protocol.model",
  },
  {
    unit: "src/model/sections.ts#SpecSections",
    anchorId: "impl:protocol.spec-sections",
    componentId: "component:protocol.model",
  },
  {
    unit: "src/model/spec.ts#spec",
    anchorId: "impl:protocol.spec-primitive",
    componentId: "component:protocol.model",
  },
  {
    unit: "src/notation/slots.ts#parseSlots",
    anchorId: "impl:protocol.slot-notation",
    componentId: "component:protocol.notation",
  },
  {
    unit: "src/projections/census.ts#compareCodeUnits",
    anchorId: "impl:protocol.census-page",
    componentId: "component:protocol.projections",
  },
  {
    unit: "src/projections/design-review-context.ts#renderReadiness",
    anchorId: "impl:protocol.derived-readiness-banner",
    componentId: "component:protocol.projections",
  },
  {
    unit: "src/projections/design-review-context.ts#renderBindings",
    anchorId: "impl:protocol.binding-language-spec-page",
    componentId: "component:protocol.projections",
  },
  {
    unit: "src/projections/design-review-context.ts#renderFindings",
    anchorId: "impl:protocol.diagnostic-rendering-design-review",
    componentId: "component:protocol.projections",
  },
  {
    unit: "src/projections/design-review-pages.ts#renderPackPage",
    anchorId: "impl:protocol.binding-language-pack-table",
    componentId: "component:protocol.projections",
  },
  {
    unit: "src/projections/design-review-pages.ts#renderIndexPage",
    anchorId: "impl:protocol.binding-language-index-table",
    componentId: "component:protocol.projections",
  },
  {
    unit: "src/projections/design-review.ts#DesignReviewPage",
    anchorId: "impl:protocol.projections-model",
    componentId: "component:protocol.projections",
  },
  {
    unit: "src/projections/design-review.ts#renderDesignReview",
    anchorId: "impl:protocol.design-review",
    componentId: "component:protocol.projections",
  },
  {
    unit: "src/projections/gherkin-view.ts#CANONICAL_KINDS",
    anchorId: "impl:protocol.gherkin-view",
    componentId: "component:protocol.projections",
  },
  {
    unit: "src/projections/mermaid.ts#compareCodeUnits",
    anchorId: "impl:protocol.mermaid-view",
    componentId: "component:protocol.projections",
  },
  {
    unit: "src/reader/reader.ts#BlastRadius",
    anchorId: "impl:protocol.reader-impact",
    componentId: "component:protocol.reader",
  },
  {
    unit: "src/reader/reader.ts#createReader",
    anchorId: "impl:protocol.agent-surface",
    componentId: "component:protocol.reader",
  },
  {
    unit: "src/reader/reader.ts#createReader",
    anchorId: "impl:protocol.reader",
    componentId: "component:protocol.reader",
  },
  {
    unit: "src/runner/index.ts#planExample",
    anchorId: "impl:protocol.example-runner",
    componentId: "component:protocol.runner",
  },
  {
    unit: "src/testing/index.ts#createRunnableExample",
    anchorId: "impl:protocol.example-testing-helpers",
    componentId: "component:protocol.testing",
  },
  {
    unit: "src/validate/readiness-floor.ts#kindEvidence",
    anchorId: "impl:protocol.kind-evidence",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/readiness-floor.ts#evaluateReadinessFloor",
    anchorId: "impl:protocol.readiness-floor",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/readiness-floor.ts#evaluateReadinessFloor",
    anchorId: "impl:protocol.verifier-semantics",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/validators.ts#graphValidatorIds",
    anchorId: "impl:protocol.validation-families",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/validators.ts#checkEdgeReferentialIntegrity",
    anchorId: "impl:protocol.referential-integrity",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/validators.ts#checkClaimSeparation",
    anchorId: "impl:protocol.claim-separation",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/validators.ts#checkVerifiesLinkage",
    anchorId: "impl:protocol.verifies-linkage",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/validators.ts#checkOracleLinkage",
    anchorId: "impl:protocol.oracle-linkage",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/validators.ts#checkPackCoherence",
    anchorId: "impl:protocol.pack-coherence",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/validators.ts#checkOrphans",
    anchorId: "impl:protocol.orphan-signal",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/validators.ts#checkAuthoringShape",
    anchorId: "impl:protocol.authored-honesty-shape",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/validators.ts#checkDeliveryFacts",
    anchorId: "impl:protocol.authored-honesty-delivery-facts",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/validators.ts#checkGaps",
    anchorId: "impl:protocol.verifier-gap-signal",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/graph-index.ts#buildGraphIndex",
    anchorId: "impl:protocol.graph-index",
    componentId: "component:protocol.validate",
  },
  {
    unit: "src/validate/contracts.ts#validatorFamilies",
    anchorId: "impl:protocol.validation-contracts",
    componentId: "component:protocol.validate",
  },
] as const;

export const expectedMemberOfEdges = acceptedArchitecturalUnits.map((row) => [
  row.anchorId,
  row.componentId,
]);

// Helpers with no honest satisfies target of their own. Coverage rides the nearest honest
// realization that consumes them; these rows never mint an anchor.
export const coarseGrainCoverage = [
  {
    unit: "src/cli/validate-watch.ts#runValidateWatch",
    coveredBy: "impl:protocol.agent-surface-cli",
    componentId: "component:protocol.cli",
    rationale: "src/cli/sdp.ts#runSdpCli value-calls runValidateWatch",
  },
  {
    unit: "src/import/markdown-fidelity.ts#assertMarkdownEmissionFidelity",
    coveredBy: "impl:protocol.sdp-import-markdown-emit",
    componentId: "component:protocol.import",
    rationale:
      "src/import/emit-markdown.ts#emitMarkdownSpec value-calls assertMarkdownEmissionFidelity",
  },
  {
    unit: "src/import/data-access.ts#importData",
    coveredBy: "impl:protocol.sdp-import-markdown-emit",
    componentId: "component:protocol.import",
    rationale: "src/import/emit-markdown.ts#emitMarkdownSpec value-calls importData",
  },
  {
    unit: "src/import/data-access.ts#importText",
    coveredBy: "impl:protocol.sdp-import-markdown-emit",
    componentId: "component:protocol.import",
    rationale: "src/import/emit-markdown.ts#emitMarkdownSpec value-calls importText",
  },
  {
    unit: "src/import/data-access.ts#importTexts",
    coveredBy: "impl:protocol.sdp-import-markdown-emit",
    componentId: "component:protocol.import",
    rationale: "src/import/emit-markdown.ts#emitMarkdownSpec value-calls importTexts",
  },
  {
    unit: "src/import/data-access.ts#targetsForRelationType",
    coveredBy: "impl:protocol.sdp-import-markdown-emit",
    componentId: "component:protocol.import",
    rationale: "src/import/emit-markdown.ts#emitMarkdownSpec value-calls targetsForRelationType",
  },
] as const;

// A uses edge tracks real imports (value or type) from another component's source files; imports
// that exist only to author the anchors themselves (the stable-id and anchor-builder modules)
// confer no edge. The convention is stated in spec:protocol.structural-self-binding.
export const expectedUsesEdges = [
  ["component:protocol.adapters", "component:protocol.runner"],
  ["component:protocol.cli", "component:protocol.codegen"],
  ["component:protocol.cli", "component:protocol.extract"],
  ["component:protocol.cli", "component:protocol.graph"],
  ["component:protocol.cli", "component:protocol.import"],
  ["component:protocol.cli", "component:protocol.model"],
  ["component:protocol.cli", "component:protocol.projections"],
  ["component:protocol.cli", "component:protocol.reader"],
  ["component:protocol.cli", "component:protocol.validate"],
  ["component:protocol.codegen", "component:protocol.graph"],
  ["component:protocol.codegen", "component:protocol.notation"],
  ["component:protocol.codegen", "component:protocol.validate"],
  ["component:protocol.extract", "component:protocol.graph"],
  ["component:protocol.extract", "component:protocol.model"],
  ["component:protocol.extract", "component:protocol.notation"],
  ["component:protocol.extract", "component:protocol.validate"],
  ["component:protocol.graph", "component:protocol.model"],
  ["component:protocol.graph", "component:protocol.notation"],
  ["component:protocol.import", "component:protocol.extract"],
  ["component:protocol.import", "component:protocol.validate"],
  ["component:protocol.projections", "component:protocol.extract"],
  ["component:protocol.projections", "component:protocol.graph"],
  ["component:protocol.projections", "component:protocol.model"],
  ["component:protocol.projections", "component:protocol.notation"],
  ["component:protocol.projections", "component:protocol.reader"],
  ["component:protocol.projections", "component:protocol.validate"],
  ["component:protocol.reader", "component:protocol.graph"],
  ["component:protocol.reader", "component:protocol.model"],
  ["component:protocol.reader", "component:protocol.validate"],
  ["component:protocol.runner", "component:protocol.notation"],
  ["component:protocol.testing", "component:protocol.adapters"],
  ["component:protocol.testing", "component:protocol.runner"],
  ["component:protocol.validate", "component:protocol.graph"],
  ["component:protocol.validate", "component:protocol.model"],
  ["component:protocol.validate", "component:protocol.notation"],
] as const;
