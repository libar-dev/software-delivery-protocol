// The authored descriptors of the `validation` family of the self-hosting corpus —
// human transcription of intended truth, never computed from the derived graph. Extraction must
// reproduce every value here exactly; a disagreement is drift to resolve on one side or the other.

export const validationSpecs = [
  {
    id: "spec:validation.readiness-floor",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/readiness-floor.sdp.md",
    title: "Stated readiness must clear its floor",
    narrative: null,
    sections: {
      intent: {
        outcome: "Refuse a stated readiness that its authored evidence does not support.",
      },
      behavior: {
        rules: [
          "A Spec may state a readiness only when every clause in that readiness floor passes.",
          "Floors are cumulative: a stated rung is checked against its own clauses and every lower rung's, so a Spec that clears a higher rung has cleared each one beneath it.",
          "The `idea` floor has five clauses: the Spec carries a stable id, a human-readable title, a stated kind and a stated altitude, and it either states its intended outcome or declares a parent relation through `refines`.",
          "The `scoped` floor adds three clauses: the intended outcome is stated, at least one authored relation is declared, and the kind's natural evidence is present.",
          "The `defined` floor adds two clauses: the kind's natural evidence is complete, and no open question the Spec records is flagged as blocking.",
          "The `ready` floor reads the Spec's own edges through three clauses: every authored relation resolves to a known target, every resolving `refines`, `dependsOn`, `constrainedBy`, and `decidedBy` target itself states at least `defined`, and every anchor bound to the Spec resolves.",
          "A child's readiness statement is its own and may be higher than its parent's. Below `ready`, the child's floor does not read the parent's rung; at `ready`, its typed-dependency clause requires a resolving `refines` parent to state at least `defined`.",
          "The anchor clause reads the bindings that are present, so a Spec carrying no anchor clears it — the floor never demands a binding an author has not made.",
          "Only relations the Spec itself declares count toward the relation clauses; membership of a Pack is derived from the manifest and never stands in for an authored relation.",
          "Every clause except the two evidence clauses is kind-blind; what counts as a kind's natural evidence is stated in full by `spec:validation.kind-evidence`.",
          "One clause table checks the stated rung and yields derived readiness, the highest rung whose cumulative clauses all pass, which is read beside the stated rung and never overwrites it. Asked about a named rung, the evaluator yields that rung's unmet clauses; the reader uses it for the stated next rung and the floor's next rung.",
          "Given a Primitive node and a valid graph index over plain value data, evidence predicates tolerate section containers of the wrong shape and treat missing expected containers as absent evidence. An unratified kind derives no rung; an evaluation with an unratified kind or rung returns no failures, and descriptor conformance reports the invalid descriptor.",
          "The shipped clause table is the only floor any Spec is checked against; no validator reads a per-team floor setting.",
          "The floor table in `src/validate/readiness-floor.ts` is the clause set's code-level source of truth and the realizing entrypoint. The clauses stated here and the rows of that table are one law read twice, so any disagreement between them is drift to resolve on one side, never a second floor.",
        ],
        exampleSpace: {
          given: [
            'the graph holds a spec {specId:string} stating readiness {readiness:"scoped"|"defined"}',
            'the spec {defect:"declares no relation"|"records a blocking open question"}',
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the finding names the unmet floor clause {clauseId:string}",
            "the report holds {errorCount:number} errors",
          ],
        },
        ruleKeys: {
          ideaFloor: "rules[2]",
          scopedFloor: "rules[3]",
          definedFloor: "rules[4]",
          readyFloor: "rules[5]",
          floorTable: "rules[13]",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.readiness-floor.unrelated-scoped-spec",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/readiness-floor.unrelated-scoped-spec.sdp.md",
    title: "A scoped Spec with no relation names the relation clause",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the scoped rung where every clause but the relation clause is satisfied.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.unrelated-scoped"} stating readiness {readiness: "scoped"}',
              'the spec {defect: "declares no relation"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}',
              'the finding names the unmet floor clause {clauseId: "at-least-one-relation"}',
              "the report holds {errorCount: 1} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.readiness-floor.blocking-open-question",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/readiness-floor.blocking-open-question.sdp.md",
    title: "A blocking open question holds a Spec below defined",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the defined rung where a recorded open question is flagged as blocking.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.blocked-defined"} stating readiness {readiness: "defined"}',
              'the spec {defect: "records a blocking open question"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}',
              'the finding names the unmet floor clause {clauseId: "no-blocking-open-questions"}',
              "the report holds {errorCount: 1} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.kind-evidence",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/kind-evidence.sdp.md",
    title: "Each kind carries its own evidence",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "State what a Spec of each kind must show before its readiness floor accepts the evidence clauses.",
      },
      behavior: {
        rules: [
          "Each kind names its natural evidence: the `scoped` rung requires that evidence present, and the `defined` rung requires it complete wherever the kind defines a stronger form. This table is the whole kind-aware story — there is no second overlay mechanism.",
          "`behavior`, `workflow`, and `contract` share one row. Evidence is present with rules, examples, flows, or constraints — inline, or promoted onto a refining child or a `constrainedBy` constraint. Evidence is complete with rules and/or examples, inline or promoted; constraints alone do not suffice.",
          "A `rule` converges across the two rungs: its statement is its evidence, because a rule's content is its statement.",
          "An `example` shows evidence present with an examples entry, prose acceptable. It shows evidence complete with at least one structured given/when/then entry whose every used step is fully bound, the concreteness law, and belongs compatibly to any example space its parent owns.",
          "A `constraint` shows evidence present with a non-empty constraints section, and complete when every entry carries a machine-readable target.",
          "A `model` converges on non-empty terms: a vocabulary either has terms or it does not.",
          "A `decision` shows evidence present once its decision section is there — context and alternatives may precede the choice — and complete once the chosen option is written.",
          "The `contract` kind uses the behavior-family evidence row; the Contract carrier heading reifies into behavior and is not a separate typed section.",
          "Promoted evidence carries an honesty bound. A promoted child counts only when it is a `rule` or `example` Spec that itself clears its own kind's present cell, and a `constrainedBy` edge counts only when it resolves to a `constraint` Spec carrying its constraints — promotion moves content out, so an empty stub child is not a promotion and confers nothing.",
          "The rows are monotonic, promotion-neutral, and converge honestly where a kind has no stronger form; those three bounds belong to the decision this Spec is shaped by and to the carried-evidence decision, and are not restated as law here.",
          "The evidence table in `src/validate/readiness-floor.ts` is the row set's code-level source of truth and the realizing entrypoint; the rows stated here and that table are one law read twice, so any disagreement between them is drift to resolve on one side.",
        ],
        exampleSpace: {
          given: [
            'the graph holds a {kind:"behavior"|"constraint"} spec {specId:string} stating readiness {readiness:"scoped"|"defined"}',
            'its only evidence is {evidence:"a constraints entry carrying a target"|"a constraints entry with no target"|"a targeted constraints entry and an untargeted second entry"|"an empty promoted rule child"}',
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the finding names the unmet floor clause {clauseId:string}",
            "the report holds {errorCount:number} errors",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.kind-evidence.constraints-alone",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/kind-evidence.constraints-alone.sdp.md",
    title: "Constraints alone stop short of complete behavior evidence",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the behavior-family row where the only evidence is the form that clears present but not complete.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a {kind: "behavior"} spec {specId: "spec:probe.constraints-alone"} stating readiness {readiness: "defined"}',
              'its only evidence is {evidence: "a constraints entry carrying a target"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}',
              'the finding names the unmet floor clause {clauseId: "kind-evidence-complete"}',
              "the report holds {errorCount: 1} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.kind-evidence.untargeted-constraint",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/kind-evidence.untargeted-constraint.sdp.md",
    title: "A constraint without a machine-readable target is not complete",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the constraint row where the entry is present but carries no target a machine can read.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a {kind: "constraint"} spec {specId: "spec:probe.untargeted-constraint"} stating readiness {readiness: "defined"}',
              'its only evidence is {evidence: "a constraints entry with no target"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}',
              'the finding names the unmet floor clause {clauseId: "kind-evidence-complete"}',
              "the report holds {errorCount: 1} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.kind-evidence.second-entry-untargeted",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/kind-evidence.second-entry-untargeted.sdp.md",
    title: "A constraint whose second entry has no target is not complete",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the constraint row where a Spec carries two entries and only the first carries a target, so the evidence clauses read every entry.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a {kind: "constraint"} spec {specId: "spec:probe.second-entry-untargeted"} stating readiness {readiness: "defined"}',
              'its only evidence is {evidence: "a targeted constraints entry and an untargeted second entry"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}',
              'the finding names the unmet floor clause {clauseId: "kind-evidence-complete"}',
              "the report holds {errorCount: 1} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.kind-evidence.empty-promoted-child",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/kind-evidence.empty-promoted-child.sdp.md",
    title: "An empty promoted child confers no evidence",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the promoted-evidence bound where a refining child carries none of its own kind's evidence.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a {kind: "behavior"} spec {specId: "spec:probe.empty-promotion"} stating readiness {readiness: "scoped"}',
              'its only evidence is {evidence: "an empty promoted rule child"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/readiness-floor"} at severity {severity: "error"}',
              'the finding names the unmet floor clause {clauseId: "kind-evidence-present"}',
              "the report holds {errorCount: 1} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.duplicate-ids",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/duplicate-ids.sdp.md",
    title: "Duplicate carrier IDs are excluded loudly",
    narrative: null,
    sections: {
      intent: {
        outcome: "Prevent ambiguous authored identity from entering the graph.",
      },
      behavior: {
        rules: [
          "If more than one carrier declares an ID, every duplicate site receives extract/duplicate-id and no ambiguous node is derived.",
          "Over a graph from any producer, every node whose id is carried by another node receives a conformance/duplicate-ids error; the extractor separately excludes ambiguous authored carriers through extract/duplicate-id.",
        ],
        exampleSpace: {
          given: [
            "a {firstCarrier:string} carrier declares {specId:string}",
            "a {secondCarrier:string} carrier declares {specId:string}",
          ],
          when: ["the extraction root is read"],
          then: [
            "both sites report {findingId:string}",
            "no graph node is emitted for {specId:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.duplicate-ids.dual-carrier",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/duplicate-ids.dual-carrier.sdp.md",
    title: "TypeScript and Markdown duplicates are both refused",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the duplicate-ID rule across both carrier surfaces.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {firstCarrier: "TypeScript"} carrier declares {specId: "spec:fixture.duplicate"}',
              'a {secondCarrier: "Markdown"} carrier declares {specId: "spec:fixture.duplicate"}',
            ],
            when: ["the extraction root is read"],
            then: [
              'both sites report {findingId: "extract/duplicate-id"}',
              'no graph node is emitted for {specId: "spec:fixture.duplicate"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.two-check-families",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/two-check-families.sdp.md",
    title: "Validation separates well-formedness from non-pretending",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep the graph trustworthy by checking conformance and honesty without judging content quality or enforcing workflow.",
      },
      behavior: {
        rules: [
          "Every validator the Protocol ships belongs to either the conformance family, which checks meta-model well-formedness, or the honesty family, which rejects authored or overstated derived truth; a corpus's own rules belong to neither family, and `spec:validation.corpus-rules` designs how they run and report.",
          "Errors from the Protocol's validators fail the build; gaps and orphans remain informative signals rather than delivery-process gates.",
          "Types check the shape of what is authored in TypeScript, extraction checks every carrier as it reads it, and graph validators check cross-file conformance and honesty; no one layer substitutes for the others.",
          "All graph validation runs through the one derived graph path: source, extraction, graph, then checks.",
          "The two families are load-bearing, so an aggregate report spanning both states no family of its own while every finding of the Protocol's own validators names the family it came from.",
          "A validator id, once shipped, names one check for good: it is never reused or repurposed, and a new check ships under a new id.",
        ],
        exampleSpace: {
          given: [
            'the graph holds a spec {specId:string} at readiness {readiness:"idea"|"ready"}',
            "the spec declares a dependsOn relation to the absent target {targetId:string}",
          ],
          when: ["the graph is validated"],
          then: [
            "the aggregate report states no family of its own",
            'the conformance family reports {conformanceId:string} at severity {conformanceSeverity:"warning"|"error"}',
            'the honesty family reports {honestyId:string} at severity {honestySeverity:"warning"|"error"}',
          ],
        },
        ruleKeys: {
          stableIds: "rules[5]",
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.two-check-families.split-report",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/two-check-families.split-report.sdp.md",
    title: "One report carries both families and claims neither as its own",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the family split where one probe graph trips a conformance error and an informative honesty signal at once; the same dangling relation also fails the readiness floor on the ready probe, so the family assertions read by containment.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.two-check-families"} at readiness {readiness: "ready"}',
              'the spec declares a dependsOn relation to the absent target {targetId: "spec:probe.absent-dependency"}',
            ],
            when: ["the graph is validated"],
            then: [
              "the aggregate report states no family of its own",
              'the conformance family reports {conformanceId: "conformance/referential-integrity"} at severity {conformanceSeverity: "error"}',
              'the honesty family reports {honestyId: "honesty/gaps"} at severity {honestySeverity: "warning"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.referential-integrity",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/referential-integrity.sdp.md",
    title: "Every graph reference resolves",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep derived graph relationships trustworthy by refusing references to absent nodes.",
      },
      behavior: {
        rules: [
          "Every edge endpoint and every Pack model reference must resolve to a node in the derived graph; an unresolved reference is a conformance error.",
          "The finding names the unique nearest known id within edit distance two as a suggestion, and stays silent when no id is that near or two candidates tie, because resolving ambiguity silently is never the check's job.",
        ],
        exampleSpace: {
          given: [
            "the graph holds one spec {presentId:string}",
            "the spec declares a dependsOn relation to {targetId:string}",
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the finding offers the nearest-id suggestion: {suggested:boolean}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.referential-integrity.dangling-target",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/referential-integrity.dangling-target.sdp.md",
    title: "An unrelated missing target is a bare conformance error",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the unresolved-reference law where no known id is near the missing one.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds one spec {presentId: "spec:probe.create-order"}',
              'the spec declares a dependsOn relation to {targetId: "spec:probe.fulfilment-policy"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/referential-integrity"} at severity {severity: "error"}',
              "the finding offers the nearest-id suggestion: {suggested: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.referential-integrity.did-you-mean",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/referential-integrity.did-you-mean.sdp.md",
    title: "A unique near miss earns a did-you-mean suggestion",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the unresolved-reference law where exactly one known id is a near miss.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds one spec {presentId: "spec:probe.create-order"}',
              'the spec declares a dependsOn relation to {targetId: "spec:probe.create-ordr"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/referential-integrity"} at severity {severity: "error"}',
              "the finding offers the nearest-id suggestion: {suggested: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.claim-separation",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/claim-separation.sdp.md",
    title: "Graph claims and contracts stay distinct",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Preserve the graph's declared, anchored, and inferred distinctions while keeping its typed contracts lawful.",
      },
      behavior: {
        rules: [
          "Node and edge types, claims, descriptors, and relation endpoint contracts must use their ratified forms; the claim taxonomy never collapses.",
          "An unratified descriptor value fails closed: it is a conformance error, and no readiness floor is evaluated over it.",
        ],
        exampleSpace: {
          given: [
            "the graph holds a spec {specId:string}",
            'the graph carries an off-contract {element:"edge claim"|"descriptor value"} spelled {value:string}',
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the finding message states {phrase:string}",
            "the report holds {floorCount:number} readiness-floor findings",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.claim-separation.collapsed-edge-claim",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/claim-separation.collapsed-edge-claim.sdp.md",
    title: "A binding edge cannot borrow the declared claim",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the edge-contract law where a satisfies edge carries the authored claim.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.create-order"}',
              'the graph carries an off-contract {element: "edge claim"} spelled {value: "declared"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/claim-separation"} at severity {severity: "error"}',
              'the finding message states {phrase: "never collapsed"}',
              "the report holds {floorCount: 0} readiness-floor findings",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.claim-separation.unratified-descriptor",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/claim-separation.unratified-descriptor.sdp.md",
    title: "An unratified kind fails closed instead of reaching the floor",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the descriptor law where a foreign producer states a kind the model never ratified.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.create-order"}',
              'the graph carries an off-contract {element: "descriptor value"} spelled {value: "saga"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/claim-separation"} at severity {severity: "error"}',
              'the finding message states {phrase: "outside the ratified descriptor values"}',
              "the report holds {floorCount: 0} readiness-floor findings",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.verification-linkage",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/verification-linkage.sdp.md",
    title: "Example verification and oracle bindings resolve honestly",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep declared example verification bound to a resolving test anchor, and keep an oracle's expected-outcome binding resolved to its example space.",
      },
      behavior: {
        rules: [
          "A declared `verifies` from an example stands as verification evidence only when a resolving test anchor binds that example. An oracle's anchored `models` edge records expected-outcome semantics for a Spec that owns an example space and confers no delivery fact.",
          "A non-resolving trace confers no delivery fact. Which unbound declared verifiers warn is stated by `spec:validation.unbound-example-posture`; ineligible oracle bindings are reported by the oracle-linkage check.",
          "At most one expected-outcome authority may model an example space: a second resolving oracle binding on the same space is an error, because two authorities leave the modeled outcome ambiguous.",
        ],
        exampleSpace: {
          given: [
            "the graph holds a parent spec {parentId:string}",
            'a non-resolving {verifierKind:"example spec"|"oracle anchor"} named {verifierId:string} points at it',
            "the example verifier states ready",
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the parent earns the delivery fact has-verifier: {conferred:boolean}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.verification-linkage.unbound-example",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/verification-linkage.unbound-example.sdp.md",
    title: "A declared verifier no test binds confers nothing",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the verifies-linkage law where no test anchor completes the Spec-to-test trace.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a parent spec {parentId: "spec:probe.create-order"}',
              'a non-resolving {verifierKind: "example spec"} named {verifierId: "spec:probe.create-order.valid-cart"} points at it',
              "the example verifier states ready",
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/verifies-linkage"} at severity {severity: "warning"}',
              "the parent earns the delivery fact has-verifier: {conferred: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.verification-linkage.unresolved-oracle",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/verification-linkage.unresolved-oracle.sdp.md",
    title: "An oracle targeting a Spec with no example space is refused",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the oracle-linkage law where the modeled Spec owns no example space.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a parent spec {parentId: "spec:probe.order-policy"}',
              'a non-resolving {verifierKind: "oracle anchor"} named {verifierId: "oracle:probe.order-policy"} points at it',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/oracle-linkage"} at severity {severity: "error"}',
              "the parent earns the delivery fact has-verifier: {conferred: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.oracle-target-eligibility",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/oracle-target-eligibility.sdp.md",
    title: "Oracle eligibility follows example-space ownership",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let an expected-outcome oracle model any Spec whose own law defines an example space, regardless of Spec kind.",
      },
      behavior: {
        rules: [
          "Oracle target eligibility follows ownership of an example space, not a behavior-kind check.",
          "A resolving binding is an anchored `models` edge from an `oracle:` Anchor to a Spec that owns an example space.",
          "Missing targets, wrong namespaces, absent example spaces, and competing oracles are fail-closed refusals.",
          "Validators and graph readers consume the same eligibility result.",
        ],
        exampleSpace: {
          given: [
            'the oracle targets a {targetKind:"behavior"|"rule"} spec',
            "the target owns an example space: {ownsExampleSpace:boolean}",
          ],
          when: ["oracle linkage is resolved"],
          then: [
            "oracle linkage reports {findingCount:number} findings and resolving presence {oraclePresent:boolean}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.oracle-target-eligibility.rule-space-accepted",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/oracle-target-eligibility.rule-space-accepted.sdp.md",
    title: "A rule owning an example space accepts an oracle",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute kind-neutral oracle resolution for a rule that owns the vocabulary its oracle models.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the oracle targets a {targetKind: "rule"} spec',
              "the target owns an example space: {ownsExampleSpace: true}",
            ],
            when: ["oracle linkage is resolved"],
            then: [
              "oracle linkage reports {findingCount: 0} findings and resolving presence {oraclePresent: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.oracle-target-eligibility.missing-space-refused",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/oracle-target-eligibility.missing-space-refused.sdp.md",
    title: "A target without an example space refuses an oracle",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the fail-closed refusal when an otherwise valid Spec target owns no example space.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the oracle targets a {targetKind: "behavior"} spec',
              "the target owns an example space: {ownsExampleSpace: false}",
            ],
            when: ["oracle linkage is resolved"],
            then: [
              "oracle linkage reports {findingCount: 1} findings and resolving presence {oraclePresent: false}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.pack-coherence",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/pack-coherence.sdp.md",
    title: "Packs are coherent aggregates",
    narrative:
      "A Pack is a review grouping, so a coherent Pack may hold low-detail Specs without turning grouping into implementation demand.",
    sections: {
      intent: {
        outcome:
          "Keep review aggregates coherent without treating them as truth-bearing delivery artifacts.",
      },
      behavior: {
        rules: [
          "Pack membership must not repeat a Spec, and every modelRef must resolve to a model-kind Spec.",
          "Membership is counted on the derived belongsTo edges the manifest re-expresses, so a repeated manifest entry is named once per repeated member.",
          "A Pack's members list and its belongsTo edges agree: every listed member has one belongsTo edge into the Pack, and every belongsTo edge into the Pack comes from a listed member. A listed member with no edge, a listed member that is no Spec and no edge carries, and an edge from an unlisted source are each one error, in authored order, so the Pack context, a Spec's packs, and blast radius read the same membership. An edge whose source is absent or no Spec stays referential integrity's or the edge contract's finding, never a second one here.",
          "There is no duplicated-intent check on a Pack: a Pack states no system truth to duplicate, and semantic overlap among its members remains human or agent review rather than validator judgment.",
        ],
        exampleSpace: {
          given: [
            "a pack {packId:string} lists the spec {specId:string} {memberCount:number} times",
            "the pack also names that spec as a modelRef",
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the report holds {findingCount:number} pack-coherence findings",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.pack-coherence.incoherent-aggregate",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/pack-coherence.incoherent-aggregate.sdp.md",
    title: "A repeated member and a non-model modelRef are both named",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute both halves of the pack law against one incoherent aggregate.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a pack {packId: "pack:probe.checkout"} lists the spec {specId: "spec:probe.create-order"} {memberCount: 2} times',
              "the pack also names that spec as a modelRef",
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/pack-coherence"} at severity {severity: "error"}',
              "the report holds {findingCount: 2} pack-coherence findings",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.authored-honesty",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/authored-honesty.sdp.md",
    title: "Machine truth is never authored",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep derived graph truth trustworthy by rejecting any authored substitute for a derived edge or delivery fact.",
      },
      behavior: {
        rules: [
          "Specs and Packs author no derived edge or delivery fact.",
          "A Primitive node's `deliveryFacts` equals the facts the one derivation recomputes from the graph.",
        ],
        exampleSpace: {
          given: [
            "the graph holds a spec {specId:string}",
            'the spec hand-authors the delivery fact {factName:"implemented"|"has-verifier"} at {site:"a behavior section carrier"|"the node deliveryFacts array"}',
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the finding names the fact {relatedId:string} and states {phrase:string}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.authored-honesty.section-authored-fact",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/authored-honesty.section-authored-fact.sdp.md",
    title: "A delivery fact smuggled into a section is refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the authoring-shape refusal on a section carrier that names a derived fact.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.smuggled-fact"}',
              'the spec hand-authors the delivery fact {factName: "implemented"} at {site: "a behavior section carrier"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/authoring-shape"} at severity {severity: "error"}',
              'the finding names the fact {relatedId: "implemented"} and states {phrase: "derived, never authored"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.authored-honesty.unearned-stated-fact",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/authored-honesty.unearned-stated-fact.sdp.md",
    title: "A stated delivery fact no binding earns is refused",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the delivery-fact refusal where the stated array outruns the recomputed facts.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.unearned-fact"}',
              'the spec hand-authors the delivery fact {factName: "has-verifier"} at {site: "the node deliveryFacts array"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/delivery-facts"} at severity {severity: "error"}',
              'the finding names the fact {relatedId: "has-verifier"} and states {phrase: "derived, never authored"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.warn-level-signals",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/warn-level-signals.sdp.md",
    title: "Missing connective evidence warns without failing",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Surface graph conditions that need attention without turning informative delivery signals into workflow gates.",
      },
      behavior: {
        rules: [
          "Orphaned Specs and ready Specs lacking a resolving verifier are warnings, not validation errors.",
          "The gap signal excludes kind `decision`.",
          "The gap signal reads the delivery facts the one derivation recomputes from the graph, never the `deliveryFacts` a node carries, so a hand-authored fact cannot silence it.",
          "The Protocol fixes the severity of these signals; no validator reads a per-team setting.",
        ],
        exampleSpace: {
          given: [
            'the graph holds a spec {specId:string} at readiness {readiness:"idea"|"ready"}',
            'the spec declares {relations:"no relation"|"a decidedBy decision"}',
          ],
          when: ["the graph is validated"],
          then: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the report holds {errorCount:number} errors",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.warn-level-signals.orphan-signal",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/warn-level-signals.orphan-signal.sdp.md",
    title: "A disconnected Spec warns and fails nothing",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the orphan signal on a Spec no relation reaches.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.orphan-signal"} at readiness {readiness: "idea"}',
              'the spec declares {relations: "no relation"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "conformance/orphans"} at severity {severity: "warning"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.warn-level-signals.ready-gap-signal",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/warn-level-signals.ready-gap-signal.sdp.md",
    title: "A ready Spec without a verifier warns and fails nothing",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the gap signal on a connected ready Spec no verifier resolves.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.gap-signal"} at readiness {readiness: "ready"}',
              'the spec declares {relations: "a decidedBy decision"}',
            ],
            when: ["the graph is validated"],
            then: [
              'the report names {findingId: "honesty/gaps"} at severity {severity: "warning"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.diagnostic-rendering",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/diagnostic-rendering.sdp.md",
    title: "One diagnostic currency, its location composed from structured fields",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Let a reader locate any reported problem the same way, whichever producer or surface reported it.",
      },
      behavior: {
        rules: [
          "There is one diagnostic currency. Extraction, contract generation, and graph validation all report in the one finding shape, and no surface introduces a parallel report shape of its own.",
          "A finding's location lives in its own structured file and line fields, never baked into its message text, so a location is composed once by whoever renders it and is never rendered twice.",
          "The command-line rendering is the path and line, the severity in brackets, the validator id, and the message, in that order and separated by the same one-line punctuation for every finding.",
          "The location degrades by field rather than by placeholder: a file with a line renders both, a file without a line renders the path alone, and a finding carrying no file renders no location prefix at all.",
          "The Design Review renders the same currency in its findings table under the same composition rule, and shows an em dash where a finding carries no file, because a table cell cannot be absent the way a prefix can.",
        ],
        exampleSpace: {
          given: [
            'a finding naming the validator {validatorId:string} at severity {severity:"warning"|"error"} carrying the message {message:string}',
          ],
          when: [
            'the {renderer:"command-line"|"Design Review"} renderer formats that finding once per location shape',
          ],
          then: [
            "the finding carrying the file {file:string} and the line {line:number} renders {withLocation:string}",
            "the same finding carrying the file alone renders {fileOnly:string}",
            "the same finding carrying neither renders {bare:string}",
            "the findings row carrying the file {file:string} and the line {line:number} renders {locationRow:string}",
            "the same row carrying the file alone renders {fileOnlyRow:string}",
            "the same row carrying neither renders {absentRow:string}",
          ],
        },
      },
      design: {
        summaryLine:
          "`validate: <errors> errors · <warnings> warnings (conformance + honesty over the one graph)`, written once to standard output after all findings have been written to standard error.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.diagnostic-rendering.composed-location",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/diagnostic-rendering.composed-location.sdp.md",
    title: "One finding, three location shapes, one composition rule",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the composition and both degradations on one finding, so the rule is read as one law rather than three renderings.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a finding naming the validator {validatorId: "honesty/readiness-floor"} at severity {severity: "error"} carrying the message {message: "The stated rung is not earned."}',
            ],
            when: [
              'the {renderer: "command-line"} renderer formats that finding once per location shape',
            ],
            then: [
              'the finding carrying the file {file: "specs/probe.sdp.md"} and the line {line: 7} renders {withLocation: "specs/probe.sdp.md:7 — [error] honesty/readiness-floor — The stated rung is not earned."}',
              'the same finding carrying the file alone renders {fileOnly: "specs/probe.sdp.md — [error] honesty/readiness-floor — The stated rung is not earned."}',
              'the same finding carrying neither renders {bare: "[error] honesty/readiness-floor — The stated rung is not earned."}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.diagnostic-rendering.table-cell-location",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/diagnostic-rendering.table-cell-location.sdp.md",
    title: "The same three location shapes, rendered as table cells",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the one composition rule on the Design Review's findings table, where a cell cannot be absent and a message pipe would otherwise split the row.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a finding naming the validator {validatorId: "honesty/readiness-floor"} at severity {severity: "error"} carrying the message {message: "The stated rung is not earned | its floor refused it."}',
            ],
            when: [
              'the {renderer: "Design Review"} renderer formats that finding once per location shape',
            ],
            then: [
              'the findings row carrying the file {file: "specs/probe.sdp.md"} and the line {line: 7} renders {locationRow: "| error | `honesty/readiness-floor` | The stated rung is not earned \\| its floor refused it. | `specs/probe.sdp.md:7` |"}',
              'the same row carrying the file alone renders {fileOnlyRow: "| error | `honesty/readiness-floor` | The stated rung is not earned \\| its floor refused it. | `specs/probe.sdp.md` |"}',
              'the same row carrying neither renders {absentRow: "| error | `honesty/readiness-floor` | The stated rung is not earned \\| its floor refused it. | — |"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.validator-self-testing",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/validator-self-testing.sdp.md",
    title: "Every validator ships evidence in both directions",
    narrative:
      "A validator that stops firing reports nothing, and an empty report looks like a clean graph unless a test asserts the refusal. A validator that refuses every input is just as useless. Refusing and accepting inputs, one probe world per direction, tell the two failures apart, so the check families are themselves checked. No validator checks this discipline, because the Protocol's checks concern conformance and honesty, never the delivery process.\n\nAn audit keeps the discipline whole. Scattered tests can cover every check today and miss the next one, so the audit holds one probe pair per finding id in one table and fails when the table and the engine's registries disagree. Extraction refusals count: they carry the conformance family, refuse carriers in the same validation run, and go silent in the same way. The accepting probe is a near miss rather than an empty input, because an empty input passes a validator that refuses too much.",
    sections: {
      intent: {
        outcome: "Keep a validator that has silently stopped firing from reading as a clean build.",
      },
      behavior: {
        rules: [
          "Each validator ships evidence in both directions: at least one input it must report and at least one near miss it must leave unreported.",
          "The discipline is evidence over the two check families, never a check of its own; no validator checks whether another validator carries tests, and no report, graph fact or delivery fact records the audit.",
          "The audit covers every finding id a validation run can report: each graph validator's and each extraction finding's, the Markdown and Gherkin carriers' included. Contract generation and import report outside a validation run and stay outside the audit.",
          "The audit holds one probe pair per finding id: a refusing probe the id must report, and an accepting probe, a near miss that differs from the refusing probe only in the construct the check reads, that the id must leave unreported.",
          "The audit's table and the engine's registries agree exactly: a registered id without a pair, an id paired twice, a pair for an id no registry lists, a finding id written in the engine's source outside every registry, and a finding id a probe run reports outside every registry each fail the audit.",
          "The audit reads the engine's source as code, so a comment never counts and every quote form does, and it fails on a finding id it cannot read whole, such as an id prefix joined to a value at run time.",
          "The audit runs every probe through the entry a validation run uses, graph validation for a graph probe and extraction for a carrier probe, and fails for each id its refusing probe does not report and each id its accepting probe reports; it reads the finding id alone, never the message.",
          "The audit is a test in the repository's own suite, so the gate runs it on every change. It fails by naming each id at fault, writes no tracked file and no durable result, and may create and remove a temporary extraction root for a carrier probe.",
        ],
        ruleKeys: {
          bothDirections: "rules[0]",
          neverAValidator: "rules[1]",
          auditScope: "rules[2]",
          probePairs: "rules[3]",
          closedTable: "rules[4]",
          sourceReadWhole: "rules[5]",
          silentAndOvereager: "rules[6]",
          auditInGate: "rules[7]",
        },
        exampleSpace: {
          given: [
            'the audit reads {table:"the shipped probe table"|"the shipped table without one pair"|"the shipped table with one pair twice"}',
            'the check {findingId:string} behaves {behavior:"as shipped"|"silently"|"overeagerly"}',
            "the engine source also writes {extraSourceId:string}",
          ],
          when: ["the audit runs"],
          then: [
            'the audit {verdict:"passes"|"fails"}',
            'the audit names {named:string} as {list:"none"|"unpaired"|"duplicatePairs"|"unregistered"|"silent"|"overeager"}',
          ],
        },
        description:
          "The world runs the audit function on the shipped probe table, on that table without the pair for the named check, or on that table with the named check's pair written twice, over the shipped registries and the scanned source. A check that behaves silently has its findings removed from every probe's run; one that behaves overeagerly has a finding added to every probe's run. A source that also writes an id adds it to the scanned source ids, and `nothing` adds none. The named ids are joined by a comma and a space, or `nothing` when the audit names none.",
      },
      design: {
        registries:
          "`graphValidatorIds` and `extractFindingIds`; the Markdown extractor's `extract/invalid-markdown-structure`, `extract/unrecognized-heading` and `extract/invalid-frontmatter` join `extractFindingIds`, so one registry lists every extraction finding id.",
        probeEntry:
          "`{ id: string; refusing: Probe; accepting: Probe }`, with `type Probe = { graph: GraphSchema } | { carriers: Readonly<Record<string, string>> }`, a graph for a graph validator and root-relative carrier files for an extraction finding.",
        auditFunction:
          "`auditValidatorEvidence(table: readonly ProbeEntry[], run: (probe: Probe) => readonly Finding[], registered: readonly string[], source: SourceScan): AuditAnswer`, where `run` is graph validation or extraction as the probe needs, so a world can wrap it to silence one id or report it everywhere; every finding id any probe run reports outside `registered` is `unregistered`.",
        auditAnswer:
          "`{ unpaired: string[]; duplicatePairs: string[]; strayPairs: string[]; unregistered: string[]; unresolved: string[]; silent: string[]; overeager: string[] }`, each sorted in code-unit order and each id listed once; the audit passes when all seven are empty and otherwise fails with the non-empty lists in its message.",
        sourceScan:
          "`scanFindingIds(srcRoot: string): SourceScan`, with `type SourceScan = { ids: string[]; unresolved: string[] }`, reads every `.ts` file under `src/` with the TypeScript scanner, so comments are skipped. A string literal or a template literal without substitutions whose whole text matches `^(conformance|honesty|extract)/[a-z][a-z-]*$` is an id, and one outside every registry is `unregistered`. A literal whose text matches `^(conformance|honesty|extract)/[a-z-]*$` but is no whole id, or a template literal whose text before its first substitution matches it, is `unresolved`, named `<file>:<line>`. The gate suite scans the real source tree.",
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.validator-self-testing.shipped-checks-paired",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/validator-self-testing.shipped-checks-paired.sdp.md",
    title: "Every shipped check reports its refusing probe and leaves its near miss alone",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the audit over the shipped registries, probe table and source.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the audit reads {table: "the shipped probe table"}',
              'the check {findingId: "conformance/orphans"} behaves {behavior: "as shipped"}',
              'the engine source also writes {extraSourceId: "nothing"}',
            ],
            when: ["the audit runs"],
            then: [
              'the audit {verdict: "passes"}',
              'the audit names {named: "nothing"} as {list: "none"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.validator-self-testing.silent-check-named",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/validator-self-testing.silent-check-named.sdp.md",
    title: "A check that stops reporting is named silent",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the audit on a check whose findings no longer reach any run.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the audit reads {table: "the shipped probe table"}',
              'the check {findingId: "conformance/orphans"} behaves {behavior: "silently"}',
              'the engine source also writes {extraSourceId: "nothing"}',
            ],
            when: ["the audit runs"],
            then: [
              'the audit {verdict: "fails"}',
              'the audit names {named: "conformance/orphans"} as {list: "silent"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.validator-self-testing.duplicate-pair-named",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/validator-self-testing.duplicate-pair-named.sdp.md",
    title: "A check paired twice is named",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the audit on a table that holds one check's probe pair twice.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the audit reads {table: "the shipped table with one pair twice"}',
              'the check {findingId: "conformance/orphans"} behaves {behavior: "as shipped"}',
              'the engine source also writes {extraSourceId: "nothing"}',
            ],
            when: ["the audit runs"],
            then: [
              'the audit {verdict: "fails"}',
              'the audit names {named: "conformance/orphans"} as {list: "duplicatePairs"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.validator-self-testing.overeager-check-named",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/validator-self-testing.overeager-check-named.sdp.md",
    title: "A check that reports its near miss is named overeager",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the audit on a check that reports every probe it runs over.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the audit reads {table: "the shipped probe table"}',
              'the check {findingId: "conformance/orphans"} behaves {behavior: "overeagerly"}',
              'the engine source also writes {extraSourceId: "nothing"}',
            ],
            when: ["the audit runs"],
            then: [
              'the audit {verdict: "fails"}',
              'the audit names {named: "conformance/orphans"} as {list: "overeager"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.validator-self-testing.unpaired-check-named",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/validator-self-testing.unpaired-check-named.sdp.md",
    title: "A registered check without a probe pair is named unpaired",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the audit on a table that has lost one check's probe pair.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the audit reads {table: "the shipped table without one pair"}',
              'the check {findingId: "conformance/orphans"} behaves {behavior: "as shipped"}',
              'the engine source also writes {extraSourceId: "nothing"}',
            ],
            when: ["the audit runs"],
            then: [
              'the audit {verdict: "fails"}',
              'the audit names {named: "conformance/orphans"} as {list: "unpaired"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.validator-self-testing.unregistered-id-named",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/validator-self-testing.unregistered-id-named.sdp.md",
    title: "A finding id the source writes outside every registry is named",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the audit on a source that writes a finding id no registry lists.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the audit reads {table: "the shipped probe table"}',
              'the check {findingId: "conformance/orphans"} behaves {behavior: "as shipped"}',
              'the engine source also writes {extraSourceId: "conformance/unlisted-check"}',
            ],
            when: ["the audit runs"],
            then: [
              'the audit {verdict: "fails"}',
              'the audit names {named: "conformance/unlisted-check"} as {list: "unregistered"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.typed-dependency-floor",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/typed-dependency-floor.sdp.md",
    title: "A ready Spec rests only on settled dependencies",
    narrative:
      "A `decidedBy` target at `defined` is a complete decision record awaiting ratification. Requiring `ready` of that target would make a shaped Spec's `ready` statement wait on registry ratification; the floor instead lets a shaped Spec state `ready` while its decision awaits the owner.",
    sections: {
      intent: {
        problem:
          "A `ready` statement needs a settled basis across `refines`, `dependsOn`, `constrainedBy`, and `decidedBy`. Omitting any of these relations would let a Spec state `ready` while a dependency still stands below `defined`.",
        outcome:
          "Refuse a `ready` statement while any Spec it depends on, through any typed dependency, stands below `defined`.",
      },
      behavior: {
        rules: [
          "The `ready` floor's target clause reads every typed dependency the Spec declares. Each resolving `refines`, `dependsOn`, `constrainedBy`, and `decidedBy` target itself states at least `defined`. The clause reads stated readiness, so a dependent does not inherit a target's own floor failure.",
          "The threshold is `defined` for all four typed dependencies.",
          "The clause stays kind-blind and reads resolving targets only. An unresolved target remains the relation-resolution clause's failure, never a second one.",
          "A Spec naming itself as a typed dependency is read like any other resolving target, by its own stated readiness.",
          "`verifies` and `supersedes` stay outside the clause. A verifier's rung is independent of the Spec it verifies, and a replacement decision does not rest on the record it supersedes.",
          "An unsettled fact is stated the way any unsettled truth is. A constraint Spec that records a blocking open question clears at most `scoped`. When it states a rung below `defined`, a Spec bounded by it may state `defined` if its own floor clears, but cannot lawfully state `ready`.",
          "The floor keeps one target clause, `typed-dependency-targets-are-defined`, in `src/validate/readiness-floor.ts`. Its parent `spec:validation.readiness-floor` states the same target bound. A failure of the clause names every target that breaks it.",
        ],
        exampleSpace: {
          given: [
            'the typed dependency matrix {matrix:"relation-rungs"|"missing-targets"|"unsettled-fact"|"stated-readiness"}',
          ],
          when: ["the reader checks the readiness floor"],
          then: [
            "the matrix reports {targetFailures:number} target failures and {resolutionFailures:number} resolution failures and {questionFailures:number} blocking question failures",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.unbound-example-posture",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/unbound-example-posture.sdp.md",
    title: "An unbound example below ready is data, not a warning",
    narrative: null,
    sections: {
      intent: {
        problem:
          "A corpus designed before its code exists gets one verifies-linkage warning per example for a state that is honest at the rung the example states, so a real warning hides among them.",
        outcome:
          "Keep the unbound state of an example visible as data, and reserve the warning for an example that states `ready`.",
      },
      behavior: {
        rules: [
          "An example that declares `verifies` and has no resolving test anchor is named by the verifies-linkage warning only when the example states `ready`.",
          "Below `ready` the same state is data. The reader reports the example's verifier binding as declared and not enabled, the declared-versus-enabled recipe lists it, and it confers no `has-verifier`.",
          "A Spec of any other kind that declares `verifies` warns at every rung.",
          "A `ready` parent other than a `decision` keeps its gap while no resolving verifier verifies it. Once another enabled example or a direct test anchor verifies it, an unbound example below `ready` is data alone, and an unbound `ready` example keeps its own warning.",
          "The worked example shows its unbound example through its Design Review verifier bindings and the declared-versus-enabled recipe.",
        ],
        exampleSpace: {
          given: ["the verification posture matrix {matrix:string}"],
          when: ["the reader derives the verification signals"],
          then: [
            "the matrix reports {warnings:number} linkage warnings and {gaps:number} parent gaps and {oracleErrors:number} oracle errors",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.prose-mentions",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/prose-mentions.sdp.md",
    title: "Every Spec id written in prose resolves",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Refuse a prose reference to an absent Spec or entry, and report a prose reference that no declared relation backs.",
      },
      behavior: {
        rules: [
          "The validator id is `conformance/prose-mentions`, in the conformance family; it reads the graph's Primitive nodes, edges and location table and nothing else.",
          "The scanned text of a Spec is its narrative and every string value under its sections, except the `gwt-vocabulary` fence at `behavior.exampleSpace` and the `gwt` fences that are object entries of `behavior.examples`. The title is not scanned. Scan order is the narrative first, then the sections in the serialized graph's order, then entries in their authored order.",
          "A mention starts at `spec:` where the character before it, if any, is not an ASCII letter, an ASCII digit, or `-`. A backslash before ASCII punctuation is read as that punctuation, as Markdown reads an escape. The token ends at ASCII whitespace, at one of the ASCII delimiters `` ` `` `\"` `'` `(` `)` `[` `]` `{` `}` `<` `>` `|`, or at a character outside ASCII that is whitespace, U+0085 included, punctuation other than connector punctuation, a symbol, or a space, line, or paragraph separator, so every dash, ellipsis, typographic quote, and arrow ends it. Every other character stays in the token, letters, combining marks, digits, connector punctuation, control characters other than whitespace, and format, private-use, and unassigned characters among them. Trailing `.` `,` `;` `:` `!` `?` `*` `_` `~` are then removed after the prefix, so a sentence, a list, or emphasis may end in an id. When nothing remains after `spec:`, there is no mention, so a bare prefix or a placeholder such as `spec:<id>` stays prose. The whole token goes to `parseId`, so an underscore, a slash, a comma, a control character, or any character outside ASCII that stays in it refuses the whole token as malformed; the token is never cut short to the valid id before that character, and a refused token counts toward no pair. A token equal to the scanning Spec's own id is skipped.",
          "An open question's links entry is checked whole as a Spec id or entry address, under `spec:model.open-question-fields`, at path `intent.openQuestions[<i>].links[<j>]`. It uses the same malformed-token error; an otherwise parsed id outside the Spec namespace has reason `expected spec namespace`.",
          'A token that fails `parseId` is an error with the message `Mention "<token>" in "<spec>" at <path> is not a Spec id or entry address: <reason>`, where `<reason>` is the grammar\'s refusal text with its `Invalid ID "<token>": ` prefix stripped.',
          'A token whose Spec part names no Primitive node is an error with the message `Mention in "<spec>" at <path> points to missing target "<token>".`, followed by the referential-integrity nearest-id suggestion when one is unique.',
          'A token whose Spec exists and whose entry address names no key of that `design` or `ui` section, names `description` there, names a question key no open question of that Spec carries, names a rule key that Spec\'s `behavior.ruleKeys` does not carry, or names a term key that Spec\'s `model.termKeys` does not carry, is an error with the message `Mention in "<spec>" at <path> points to missing entry "<section>.<key>" of "<target>".`',
          "Errors are reported once per scanning Spec, text path, and distinct token; `subjectId` is the scanning Spec, `relatedId` the token as written, `path` the text path, and `file` the Spec's carrier. The path is `narrative` or the section path in the mention audit's form, such as `intent.openQuestions[0].question`, `behavior.rules[2]`, `design.step2`, or `model.terms.<term>`.",
          'A target Spec that exists and shares no declared `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, or `supersedes` edge with the scanning Spec, in either direction, is one warning per scanning Spec and target Spec pair, counting every location where any token names that Spec or one of its entries. The message is `Mention of "<target>" in "<spec>" at <n> locations, first at <path>, with no declared relation between them; informative only. Declare the relation that fits, or leave the mention as prose and let the warning stand when none does.` with `<n>` the count of distinct paths, written `1 location` when it is one, and `<path>` the first in scan order; `subjectId` is the scanning Spec, `relatedId` the target Spec id, `path` that first path, and `file` the Spec\'s carrier. An address on the scanning Spec\'s own id is checked for its entry and never warned.',
          "A mention error or pair warning carries `line` when the location table records the corresponding text path; `behavior.rules[<i>]` uses `rule[<i>]`, `behavior.flows[<i>]` uses `flow[<i>]`, an open question's text uses `question[<i>]`, a question field uses `question[<i>].<field>`, with each question link using the `links` row, and a Model term's definition, at `model.terms.<term>`, uses `term[<i>]`. Entries of Rule, Workflow and Contract use the same behavior paths as entries of Behavior. An unrecorded line is omitted.",
          "The warning is honest when it stands: the six relations are typed, a mention that none of them describes is lawful prose, and no author declares a relation to silence the report. Warnings never fail `sdp validate`; the mention audit recipe reports every location of every pair as data and stays the way to list them at once.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.unbound-example-posture.lower-rungs",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/unbound-example-posture.lower-rungs.sdp.md",
    title: "Below-ready examples keep declared verifier data",
    narrative: null,
    sections: {
      intent: {
        outcome: "Check all three lower rungs without enabling an unbound example.",
        assumptions: [
          "The world has three behavior parents stating `defined`, each with one unbound example child, stating `idea`, `scoped`, or `defined`. No parent or child has a test binding or oracle binding.",
          "All probes are story-altitude Specs with declared claims and an Intent outcome, with no other section evidence. Each child declares `verifies` to its resolving parent. A binding is a resolving `test:` Anchor with an anchored `verifies` edge. No other relations or anchors are present except those stated here. Outcome counts read only `conformance/verifies-linkage`, parent `honesty/gaps`, and `conformance/oracle-linkage`; other findings stay outside the counts.",
          "Every child remains a declared verifier that is not enabled. Neither child nor parent derives `has-verifier`. No linkage warning, parent gap, or oracle error appears.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ['the verification posture matrix {matrix: "lower-rungs"}'],
            when: ["the reader derives the verification signals"],
            then: [
              "the matrix reports {warnings: 0} linkage warnings and {gaps: 0} parent gaps and {oracleErrors: 0} oracle errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.unbound-example-posture.warning-cases",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/unbound-example-posture.warning-cases.sdp.md",
    title: "Ready examples and non-example verifiers keep warnings",
    narrative: null,
    sections: {
      intent: {
        outcome: "Check an unbound ready example and every non-example kind at every rung.",
        assumptions: [
          "The world has one unbound example stating `ready` and 28 non-example children, one for each pairing of behavior, workflow, rule, constraint, model, decision, and contract with `idea`, `scoped`, `defined`, and `ready`. Each child verifies its own behavior parent stating `defined`. No parent or child has a test binding or oracle binding.",
          "All probes are story-altitude Specs with declared claims and an Intent outcome, with no other section evidence. Each child declares `verifies` to its resolving parent. A binding is a resolving `test:` Anchor with an anchored `verifies` edge. No other relations or anchors are present except those stated here. Outcome counts read only `conformance/verifies-linkage`, parent `honesty/gaps`, and `conformance/oracle-linkage`; other findings stay outside the counts.",
          "Each child remains a declared verifier that is not enabled and emits one conformance warning whose subject is the child and whose related Spec is its parent. Neither child nor parent derives `has-verifier`. No parent gap or oracle error appears.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ['the verification posture matrix {matrix: "warning-cases"}'],
            when: ["the reader derives the verification signals"],
            then: [
              "the matrix reports {warnings: 29} linkage warnings and {gaps: 0} parent gaps and {oracleErrors: 0} oracle errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.unbound-example-posture.parent-traces",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/unbound-example-posture.parent-traces.sdp.md",
    title: "Parent gaps follow enabled bindings and preserve the decision exemption",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Check parent gaps with no binding, a sibling binding, and a direct binding, the decision exemption, a ready child warning, and an unresolved oracle.",
        assumptions: [
          "The world has six parents stating `ready`. Five are behaviors and one is a decision. Four example children state `defined`: one behavior parent has no binding, one has a bound `defined` example sibling, one has a direct test binding, and the decision parent has no binding. Two example children state `ready`: one is unbound beside a bound `defined` example sibling, and the other has its own resolving test binding.",
          "All probes are story-altitude Specs with declared claims and an Intent outcome, with no other section evidence. Each child declares `verifies` to its resolving parent. A binding is a resolving `test:` Anchor with an anchored `verifies` edge. No other relations or anchors are present except those stated here. Outcome counts read only `conformance/verifies-linkage`, parent `honesty/gaps`, and `conformance/oracle-linkage`; other findings stay outside the counts.",
          "The unbound children remain declared verifiers that are not enabled, with no `has-verifier`. The bound `ready` child is a declared, enabled verifier, derives `has-verifier`, and emits no linkage warning. The direct binding, either sibling binding, and the bound `ready` child each confer `has-verifier` on their parent.",
          "Only the unbound `ready` child emits a linkage warning, at warning severity in the conformance family, naming its behavior parent as the related Spec. Only the behavior parent with no binding emits a parent gap. The decision parent stays exempt.",
          "An `oracle:` Anchor declares an anchored `models` edge to the behavior parent with no binding. That parent owns no example space, so the oracle emits one error naming the oracle as subject and that parent as related Spec.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ['the verification posture matrix {matrix: "parent-traces"}'],
            when: ["the reader derives the verification signals"],
            then: [
              "the matrix reports {warnings: 1} linkage warnings and {gaps: 1} parent gaps and {oracleErrors: 1} oracle errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.typed-dependency-floor.relation-rungs",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/typed-dependency-floor.relation-rungs.sdp.md",
    title: "Every relation reads the four stated target rungs",
    narrative: null,
    sections: {
      intent: {
        outcome: "Check the relation-rungs matrix through the readiness floor.",
        assumptions: [
          "The world has 24 single-relation rule subjects stating `ready`, one for each pairing of `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, and `supersedes` with a target stating `idea`, `scoped`, `defined`, or `ready`. Every target resolves. `constrainedBy` targets are constraints; `decidedBy` and `supersedes` targets are decisions; the other targets are rules. No Spec has a blocking open question.",
          "All probes are story-altitude Specs with declared relations and an Intent outcome. Rule subjects and rule targets carry a behavior rule; constraint targets carry a statement and target; decision targets carry a written decision. Each resolving target declares `dependsOn` back to its subject. No anchors are present. The expected counts include only `honesty/readiness-floor` findings, not findings from other validators.",
          "The four included relations each fail `typed-dependency-targets-are-defined` for their `idea` and `scoped` targets, giving eight target failures. Their `defined` and `ready` boundaries pass. `verifies` and `supersedes` pass at every target rung.",
          "The world also has sixteen rule subjects stating `ready`. Each pairs `refines` or `dependsOn` with `constrainedBy` or `decidedBy`. One target states `defined` and the other states `scoped`. Each pair appears with the older relation passing and the newer relation failing, and with the older relation failing and the newer relation passing, in both declaration orders. Targets have the same kinds and evidence as the single-relation probes and declare `dependsOn` back to their subject. Every mixed subject fails `typed-dependency-targets-are-defined` once and derives `defined`, regardless of declaration order.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ['the typed dependency matrix {matrix: "relation-rungs"}'],
            when: ["the reader checks the readiness floor"],
            then: [
              "the matrix reports {targetFailures: 24} target failures and {resolutionFailures: 0} resolution failures and {questionFailures: 0} blocking question failures",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.typed-dependency-floor.missing-targets",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/typed-dependency-floor.missing-targets.sdp.md",
    title: "Missing targets fail relation resolution once",
    narrative: null,
    sections: {
      intent: {
        outcome: "Check the missing-targets matrix through the readiness floor.",
        assumptions: [
          "The world has six rule subjects stating `ready`, one for each of `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, and `supersedes`. Each subject names a missing target. No target Spec exists, so no target states a rung or declares a reverse relation. No subject has a blocking open question.",
          "All subjects are story-altitude Specs with declared relations, an Intent outcome, and a behavior rule. No anchors are present. The expected counts include only `honesty/readiness-floor` findings, not findings from other validators.",
          "Each subject fails `all-relations-resolve` once. Missing targets never add a `typed-dependency-targets-are-defined` failure, including for the four included relations.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ['the typed dependency matrix {matrix: "missing-targets"}'],
            when: ["the reader checks the readiness floor"],
            then: [
              "the matrix reports {targetFailures: 0} target failures and {resolutionFailures: 6} resolution failures and {questionFailures: 0} blocking question failures",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.typed-dependency-floor.unsettled-fact",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/typed-dependency-floor.unsettled-fact.sdp.md",
    title: "An unsettled constraint bounds ready but permits defined",
    narrative: null,
    sections: {
      intent: {
        outcome: "Check the unsettled-fact matrix through the readiness floor.",
        assumptions: [
          'The world has three rule subjects, each declaring `constrainedBy` on its own resolving constraint target. The first subject states `defined` and its target states `scoped`; the second subject states `ready` and its target states `scoped`; the third subject states `defined` and its target states `defined`. Each target carries the blocking open question "Is this fact settled?". The subjects have no blocking open questions.',
          "All probes are story-altitude Specs with declared relations and an Intent outcome. Each rule subject carries a behavior rule, and each constraint target carries a statement and target. Each resolving target declares `dependsOn` back to its subject. No anchors are present. The expected counts include only `honesty/readiness-floor` findings, not findings from other validators.",
          "All three targets derive `scoped`. The first subject lawfully states `defined`; the second fails `typed-dependency-targets-are-defined`; the third target alone fails `no-blocking-open-questions` for stating `defined`. Both subjects with `scoped` targets derive `defined`, while the third derives `ready` because the target clause reads the target's stated rung. No target is missing.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ['the typed dependency matrix {matrix: "unsettled-fact"}'],
            when: ["the reader checks the readiness floor"],
            then: [
              "the matrix reports {targetFailures: 1} target failures and {resolutionFailures: 0} resolution failures and {questionFailures: 1} blocking question failures",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.typed-dependency-floor.stated-readiness",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/typed-dependency-floor.stated-readiness.sdp.md",
    title: "Target floor failures do not propagate across dependencies",
    narrative: null,
    sections: {
      intent: {
        outcome: "Check the stated-readiness matrix through the readiness floor.",
        assumptions: [
          'The world first pairs four rule subjects stating `ready` with targets stating `defined`, one through each of `refines`, `dependsOn`, `constrainedBy`, and `decidedBy`. Each target carries the blocking open question "Is this fact settled?", derives `scoped`, and fails `no-blocking-open-questions`. Each subject still derives `ready` because the target clause reads stated readiness.',
          "The world also pairs every subject kind, `behavior`, `workflow`, `example`, `rule`, `constraint`, `model`, `decision`, and `contract`, with each of `refines`, `dependsOn`, `constrainedBy`, `decidedBy`, `verifies`, and `supersedes`, and each target rung, `idea`, `scoped`, `defined`, and `ready`. These 192 subjects all state `ready`. These pairs have no blocking open questions. Every target in both groups resolves. `constrainedBy` targets are constraints, `decidedBy` and `supersedes` targets are decisions, and the other targets are rules.",
          "All probes are story-altitude Specs with declared relations and an Intent outcome. Behavior, workflow, rule, and contract subjects carry a behavior rule; example subjects carry concrete Given, When, and Then steps; constraint subjects carry a statement and target; model subjects carry a term; decision subjects carry a written decision. Targets carry the same evidence for their kind. Each target declares `dependsOn` back to its subject. No anchors are present. The expected counts include only `honesty/readiness-floor` findings, not findings from other validators.",
          "Every subject kind fails `typed-dependency-targets-are-defined` for `idea` and `scoped` targets across the four included relations. The `defined` and `ready` boundaries pass, and `verifies` and `supersedes` pass at every target rung. No target is missing.",
        ],
      },
      behavior: {
        examples: [
          {
            given: ['the typed dependency matrix {matrix: "stated-readiness"}'],
            when: ["the reader checks the readiness floor"],
            then: [
              "the matrix reports {targetFailures: 64} target failures and {resolutionFailures: 0} resolution failures and {questionFailures: 4} blocking question failures",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.next-rung-floor.blocking-question",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "A scoped Spec held by a blocking question is told the clause",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a rule spec {specId: "spec:probe.held"} stating readiness {statedReadiness: "scoped"}',
              'the spec {structure: "records a blocking open question"}',
            ],
            when: ["the reader builds the spec's context"],
            then: [
              'the floor reached is {floorReached: "scoped"} and the next rung is {nextRung: "defined"}',
              'the next rung\'s first unmet clause is {clauseId: "no-blocking-open-questions"}',
              'that failure names the targets {targets: ""}',
              "the stated rung's floor failures number {currentFailures: 0}",
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Execute the next rung's evidence on a Spec whose `defined` floor fails on a blocking open question, where the failure names no target.",
        assumptions: [
          "The world holds two story-altitude rule Specs with an Intent outcome and one rule each. The subject declares one `refines` on the other, its parent, which states `ready`, and records one blocking open question. No anchor is present. A failure with no targets is written as an empty string.",
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/validation/next-rung-floor.blocking-question.sdp.md",
  },
  {
    id: "spec:validation.next-rung-floor",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    title: "The floor names what blocks the floor's next rung",
    narrative: null,
    sections: {
      intent: {
        problem:
          "The floor is evaluated only at the stated rung, so promotion preflight answers no unmet clause for a Spec that states `defined` and cannot state `ready`, and an author or an adopter's page walks the floor table one rung up with its own code. A failed typed-dependency clause names the clause and not the dependencies that break it, so the same page recomputes which targets stand below `defined`.",
        outcome:
          "Let the one evaluator answer for any named rung, name the floor's next rung's unmet clauses in the reader, and name the targets that fail the typed-dependency clause, so no consumer evaluates the floor a second way.",
      },
      behavior: {
        rules: [
          "The evaluator takes an optional rung to evaluate. Given one, it evaluates the cumulative clauses of every rung up to and including it; without one, it evaluates up to the stated rung. A Spec of an unratified kind, or an evaluation with no ratified rung to reach, yields no failure, and the descriptor conformance error owns that case.",
          "The floor's next rung is the rung above derived readiness: `idea` when no rung derives, and none when derived readiness is `ready`. Because derived readiness is the highest rung whose cumulative clauses all pass, the failures at the floor's next rung are that rung's own clauses, and there is at least one whenever that rung exists for a Spec of a ratified kind.",
          "The reader's Spec context carries these failures as `nextRungFailures`, beside `floorFailures` for the stated rung and `statedNextRungFailures` for the stated next rung, which `spec:consumers.pack-design` owns. All three come from the one evaluator, and `nextRungFailures` is empty when derived readiness is `ready`.",
          "A failure of the typed-dependency clause carries its targets: every distinct resolving `refines`, `dependsOn`, `constrainedBy`, or `decidedBy` target that states a rung below `defined`, or that is not a Spec, each with its relation type, its id, and its stated rung when it is a Spec. Targets sort by relation type in that order and then by id in code-unit order. No other clause carries targets.",
          "Promotion preflight reports the floor's next rung with its failures, each with its targets when it has them, and the first of them. The report is never a promotion: stating any rung stays a human's edit.",
        ],
        exampleSpace: {
          given: [
            'the graph holds a rule spec {specId:string} stating readiness {statedReadiness:"scoped"|"defined"}',
            'the spec {structure:"depends on a spec stating scoped"|"records a blocking open question"}',
          ],
          when: ["the reader builds the spec's context"],
          then: [
            'the floor reached is {floorReached:"scoped"|"defined"} and the next rung is {nextRung:"defined"|"ready"}',
            "the next rung's first unmet clause is {clauseId:string}",
            "that failure names the targets {targets:string}",
            "the stated rung's floor failures number {currentFailures:number}",
          ],
        },
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
    file: "specs/validation/next-rung-floor.sdp.md",
  },
  {
    id: "spec:validation.next-rung-floor.typed-dependency-targets",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    title: "A defined Spec resting on a scoped dependency is told which one",
    narrative: null,
    sections: {
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a rule spec {specId: "spec:probe.subject"} stating readiness {statedReadiness: "defined"}',
              'the spec {structure: "depends on a spec stating scoped"}',
            ],
            when: ["the reader builds the spec's context"],
            then: [
              'the floor reached is {floorReached: "defined"} and the next rung is {nextRung: "ready"}',
              'the next rung\'s first unmet clause is {clauseId: "typed-dependency-targets-are-defined"}',
              'that failure names the targets {targets: "dependsOn spec:probe.basis (scoped)"}',
              "the stated rung's floor failures number {currentFailures: 0}",
            ],
          },
        ],
      },
      intent: {
        outcome:
          "Execute the next rung's evidence on a Spec whose own floor clears `defined` and whose `ready` floor fails on one dependency.",
        assumptions: [
          "The world holds three story-altitude rule Specs with an Intent outcome and one rule each. The subject declares `dependsOn` on the basis Spec named in the targets, which states `scoped` and declares `refines` on a third Spec stating `idea`. No Spec records an open question and no anchor is present. A target is written as its relation type, its id, and its stated rung in parentheses.",
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
    file: "specs/validation/next-rung-floor.typed-dependency-targets.sdp.md",
  },
  {
    id: "spec:validation.superseded-decision-signal",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/superseded-decision-signal.sdp.md",
    title: "A Spec shaped by a superseded decision warns",
    narrative:
      "The original design checked lifecycle integrity. It flagged a superseded Spec that live Specs still depend on, and a deprecated decision still named by `decidedBy` (`docs/lineage/v0-design/06-extraction-and-validation.md` §6.3.4). A corpus may keep a replaced decision whose text still explains something a reader needs. Its `supersedes` edge and a shaped Spec's `decidedBy` edge then make a stale shaping relation visible in the graph, and this signal reads the two together.\n\nOnly `decidedBy` says that a ruling shapes a Spec now. A `refines` between decisions narrows a ruling for one case and stays true after the ruling it narrows is replaced, and a `dependsOn` that names a decision is not how a corpus says a ruling shapes it, so reading either would warn about relations that are not stale. When a replacement is itself replaced, the author needs the record at the end of the chain, so the warning names that record and leaves the steps between to the decision register.",
    sections: {
      intent: {
        problem:
          "A Spec can stay shaped by a decision that a later decision replaced, and nothing tells its author that the ruling it rests on has moved.",
        outcome:
          "Surface a live Spec that is still shaped by a decision another decision has superseded, as an informative warning.",
      },
      behavior: {
        rules: [
          "The signal reads two kinds of authored edge and nothing else: `decidedBy` from a Spec to a decision, and `supersedes` between decisions. A `refines`, `dependsOn` or `constrainedBy` that names a superseded decision is never read, and neither is a `refines` between decisions.",
          "A corpus may keep a replaced decision while its text explains something a reader still needs; keeping it is lawful, and a deleted decision leaves a dangling `decidedBy` that referential integrity reports and this signal does not read.",
          "A live Spec that names through `decidedBy` a decision another decision supersedes carries one warning for that pair, with the shaped Spec as its subject and the superseded decision as its related Spec; a Spec shaped by two superseded decisions carries two warnings.",
          "The warning names the decision at the end of each replacement chain: from the superseded decision the walk follows `supersedes` to the decisions that replace it, and on from each of those, and a decision it reaches that no decision supersedes is an end. Where the chain branches, the warning names every end.",
          "The walk visits each decision once. A loop is a set of decisions the walk reaches, the superseded decision included, that supersede one another in a cycle, or one decision that supersedes itself. When the walk reaches a loop, the warning says the chain of replacements closes on itself and names each decision in a loop it reaches, and no other decision it passes through; when it also reaches an end, it names the ends as well. A loop is never an error and is never followed twice.",
          "The signal reads every `supersedes` edge whatever rung either decision states, so a replacement still below `ready` is named as it stands and its rung is read where the reader looks it up.",
          "A Spec that a resolving `supersedes` edge targets is not live and carries no warning for the decisions it names. A decision that supersedes another stays live until it is itself superseded, so its own `decidedBy` relations warn as any live Spec's do, even when the walk from the decision it names reaches it.",
          "The warning never fails validation, as the orphan and gap signals never do; the Protocol fixes its severity and no setting changes it.",
          "The `supersedes` edge itself is never warned, and a superseded decision is never warned for being superseded.",
          "The signal judges no content: it never asks whether the newer ruling fits the shaped Spec, and moving the `decidedBy` to the end of the chain, or deleting the replaced record, is the author's edit.",
        ],
        ruleKeys: {
          readsDecidedBy: "rules[0]",
          keptRecordLawful: "rules[1]",
          onePerPair: "rules[2]",
          chainEnd: "rules[3]",
          closedChain: "rules[4]",
          anyRung: "rules[5]",
          liveSubjectsOnly: "rules[6]",
          informative: "rules[7]",
          noSupersedesWarning: "rules[8]",
          noContentJudgment: "rules[9]",
        },
        exampleSpace: {
          given: [
            'a {subject:"live Spec"|"superseded decision"|"replacing decision"} names the probe decision through {relation:"decidedBy"|"dependsOn"}',
            'the probe decision is replaced by {replacement:"no decision"|"one decision"|"a chain of two decisions"|"two decisions at once"|"a chain that closes on itself"|"an end and a loop at once"}',
            'every replacing decision states {replacementRung:"idea"|"ready"}',
          ],
          when: ["the graph is validated"],
          then: [
            "the report holds {warnings:number} superseded-decision warnings",
            "the warnings name {named:string}",
            "the warning is {validatorId:string} in the {family:string} family at severity {severity:string}",
            "the warning has the subject {subjectId:string} and the related Spec {relatedId:string}",
            "the warning sits at {path:string} in {file:string} on line {line:number}",
            'the warning message follows {template:"message"|"closedChainMessage"|"mixedChainMessage"}',
            "the report holds {errorCount:number} errors",
          ],
        },
        description:
          "Each world builds its graph in memory, and every probe Spec carries its kind's evidence, so only the signal moves the findings. Each probe's full id joins the `probe` family and its name, as `probe.decision-a` does. A live subject is the behavior Spec `shaped` in the file `shaped.sdp.md`, whose location table records its `decidedBy` row on line 7. A superseded subject is the decision `decision-s`, which `decision-b` supersedes, and a replacing subject is `decision-b` itself. The subject names the probe decision `decision-a`, and the replacing decisions are `decision-b`, `decision-c` and `decision-d`, which state the rung the point binds. One replacement is `decision-b` superseding `decision-a`; a chain of two adds `decision-c` superseding `decision-b`; two at once are `decision-b` and `decision-c` each superseding `decision-a`; a closed chain is `decision-b` superseding `decision-a` and `decision-a` superseding `decision-b`; an end and a loop at once are `decision-b` and `decision-c` each superseding `decision-a`, with `decision-c` and `decision-d` superseding each other. The named decisions are the ends and loop members the warnings name, full ids joined by a comma and a space in code-unit order, or `nothing` when no warning names any. The field and message steps read the one warning the point reports, and the message step fills the Design entry it names with that warning's ids.",
      },
      design: {
        validatorId:
          "`conformance/superseded-decisions`, registered as `supersededDecisions` in `graphValidatorIds`; a new id, never a reused one.",
        family:
          "`conformance`: the signal reads whether a Spec's authored relations still reach a current ruling, as the orphan signal reads whether any relation reaches a Spec.",
        severity: "`warning`, fixed by the Protocol.",
        warningFields:
          "`subjectId` is the shaped Spec, `relatedId` the superseded decision it names, `path` is `relation.decidedBy.<relatedId>`, the location table's entry for that relation, `file` is the shaped Spec's file, and `line` is that row's line, present only when the carrier recorded one.",
        message:
          '`Spec "<subjectId>" is decided by "<relatedId>", which a later decision supersedes; the chain of replacements ends at "<end>" (informative, never a gate).`, with `ends at "<end>", "<end>"` when the chain branches.',
        closedChainMessage:
          '`Spec "<subjectId>" is decided by "<relatedId>", whose chain of replacements closes on itself through "<loop-id>", "<loop-id>" (informative, never a gate).`, used when the walk reaches no end, naming each decision in a loop it reaches.',
        mixedChainMessage:
          '`Spec "<subjectId>" is decided by "<relatedId>", whose chain of replacements ends at "<end>" and also closes on itself through "<loop-id>", "<loop-id>" (informative, never a gate).`, used when the walk reaches both, with every end and every loop member listed as the other two messages list them.',
        chainWalk:
          "read the resolving, declared `supersedes` edges whose source and target are both decision Specs, and index each by its target; from the superseded decision, visit each decision reachable along those edges from target to source once; an end is a reached decision other than the start that no such edge targets; a loop member is a reached decision, the start included, in a strongly connected component of two or more decisions or with an edge to itself; ends and loop members are collected apart.",
        idOrder:
          "the ids a message lists sort in code-unit order, and the findings sort as every report's findings do.",
        skippedPairs:
          "no warning for a `decidedBy` whose target does not resolve, is not a decision, or is targeted by no `supersedes` edge the walk reads, and none for a subject a resolving `supersedes` edge targets; a subject the walk reaches is still checked.",
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.superseded-decision-signal.replaced-ruling-warns",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/superseded-decision-signal.replaced-ruling-warns.sdp.md",
    title: "A Spec shaped by a replaced decision warns once and fails nothing",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the signal on a live Spec whose decision one later decision supersedes.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {subject: "live Spec"} names the probe decision through {relation: "decidedBy"}',
              'the probe decision is replaced by {replacement: "one decision"}',
              'every replacing decision states {replacementRung: "ready"}',
            ],
            when: ["the graph is validated"],
            then: [
              "the report holds {warnings: 1} superseded-decision warnings",
              'the warnings name {named: "spec:probe.decision-b"}',
              'the warning is {validatorId: "conformance/superseded-decisions"} in the {family: "conformance"} family at severity {severity: "warning"}',
              'the warning has the subject {subjectId: "spec:probe.shaped"} and the related Spec {relatedId: "spec:probe.decision-a"}',
              'the warning sits at {path: "relation.decidedBy.spec:probe.decision-a"} in {file: "shaped.sdp.md"} on line {line: 7}',
              'the warning message follows {template: "message"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.superseded-decision-signal.chain-end-named",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/superseded-decision-signal.chain-end-named.sdp.md",
    title: "The warning names the decision at the end of a chain of replacements",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the chain walk where the replacing decision is itself replaced.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {subject: "live Spec"} names the probe decision through {relation: "decidedBy"}',
              'the probe decision is replaced by {replacement: "a chain of two decisions"}',
              'every replacing decision states {replacementRung: "ready"}',
            ],
            when: ["the graph is validated"],
            then: [
              "the report holds {warnings: 1} superseded-decision warnings",
              'the warnings name {named: "spec:probe.decision-c"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.superseded-decision-signal.branch-names-every-end",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/superseded-decision-signal.branch-names-every-end.sdp.md",
    title: "A replacement chain that branches names every end",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the chain walk where two decisions replace one.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {subject: "live Spec"} names the probe decision through {relation: "decidedBy"}',
              'the probe decision is replaced by {replacement: "two decisions at once"}',
              'every replacing decision states {replacementRung: "ready"}',
            ],
            when: ["the graph is validated"],
            then: [
              "the report holds {warnings: 1} superseded-decision warnings",
              'the warnings name {named: "spec:probe.decision-b, spec:probe.decision-c"}',
              'the warning message follows {template: "message"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.superseded-decision-signal.closed-chain-named",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/superseded-decision-signal.closed-chain-named.sdp.md",
    title: "A chain of replacements that closes on itself is named and fails nothing",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the chain walk where two decisions supersede each other.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {subject: "live Spec"} names the probe decision through {relation: "decidedBy"}',
              'the probe decision is replaced by {replacement: "a chain that closes on itself"}',
              'every replacing decision states {replacementRung: "ready"}',
            ],
            when: ["the graph is validated"],
            then: [
              "the report holds {warnings: 1} superseded-decision warnings",
              'the warnings name {named: "spec:probe.decision-a, spec:probe.decision-b"}',
              'the warning message follows {template: "closedChainMessage"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.superseded-decision-signal.end-and-loop-named",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/superseded-decision-signal.end-and-loop-named.sdp.md",
    title: "A chain of replacements that reaches an end and a loop names both",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the chain walk where one branch ends and the other closes on itself.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {subject: "live Spec"} names the probe decision through {relation: "decidedBy"}',
              'the probe decision is replaced by {replacement: "an end and a loop at once"}',
              'every replacing decision states {replacementRung: "ready"}',
            ],
            when: ["the graph is validated"],
            then: [
              "the report holds {warnings: 1} superseded-decision warnings",
              'the warnings name {named: "spec:probe.decision-b, spec:probe.decision-c, spec:probe.decision-d"}',
              'the warning message follows {template: "mixedChainMessage"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.superseded-decision-signal.live-replacement-warns",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/superseded-decision-signal.live-replacement-warns.sdp.md",
    title: "A decision still decided by the record it replaces warns",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the live-subject rule on a replacing decision that names the decision it supersedes through decidedBy.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {subject: "replacing decision"} names the probe decision through {relation: "decidedBy"}',
              'the probe decision is replaced by {replacement: "one decision"}',
              'every replacing decision states {replacementRung: "ready"}',
            ],
            when: ["the graph is validated"],
            then: [
              "the report holds {warnings: 1} superseded-decision warnings",
              'the warnings name {named: "spec:probe.decision-b"}',
              'the warning has the subject {subjectId: "spec:probe.decision-b"} and the related Spec {relatedId: "spec:probe.decision-a"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.superseded-decision-signal.dependency-unread",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/superseded-decision-signal.dependency-unread.sdp.md",
    title: "A dependency on a replaced decision raises no warning",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the signal's reach on a Spec that names a superseded decision only through dependsOn.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {subject: "live Spec"} names the probe decision through {relation: "dependsOn"}',
              'the probe decision is replaced by {replacement: "one decision"}',
              'every replacing decision states {replacementRung: "ready"}',
            ],
            when: ["the graph is validated"],
            then: [
              "the report holds {warnings: 0} superseded-decision warnings",
              'the warnings name {named: "nothing"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.superseded-decision-signal.superseded-subject-silent",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/superseded-decision-signal.superseded-subject-silent.sdp.md",
    title: "A superseded decision is not warned for the decision it names",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the live-subject rule on a decision that is itself superseded.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {subject: "superseded decision"} names the probe decision through {relation: "decidedBy"}',
              'the probe decision is replaced by {replacement: "one decision"}',
              'every replacing decision states {replacementRung: "ready"}',
            ],
            when: ["the graph is validated"],
            then: [
              "the report holds {warnings: 0} superseded-decision warnings",
              'the warnings name {named: "nothing"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.superseded-decision-signal.replacement-below-ready-named",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/superseded-decision-signal.replacement-below-ready-named.sdp.md",
    title: "A replacement still below ready is named as it stands",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the signal where the decision that supersedes the shaping decision states `idea`.",
      },
      behavior: {
        examples: [
          {
            given: [
              'a {subject: "live Spec"} names the probe decision through {relation: "decidedBy"}',
              'the probe decision is replaced by {replacement: "one decision"}',
              'every replacing decision states {replacementRung: "idea"}',
            ],
            when: ["the graph is validated"],
            then: [
              "the report holds {warnings: 1} superseded-decision warnings",
              'the warnings name {named: "spec:probe.decision-b"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.architecture-constraints",
    specKind: "rule",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/architecture-constraints.sdp.md",
    title: "Declared architecture rules are checked against anchored structure",
    narrative:
      "The original design gave architecture a validation tier of its own. Its rules said that only adapter components depend on external systems, that domain code imports no infrastructure and that layers depend in one direction; dependency-cruiser, architecture tests and lint rules ran them, and their findings joined the one report (`docs/lineage/v0-design/06-extraction-and-validation.md` §6.4). Since the architectural annotation decision, the data those rules read is in the graph with no inference: a component anchor states its layer and its context, and `uses` and `memberOf` edges are anchored. The same decision keeps the check out of the Protocol. A negative architecture constraint stays declared intent in a Spec, and a corpus that wants it enforced checks its declared `uses`, `layer` and `context` in its own gate.\n\nThe first adopter checks that a component in its `platform` context has no `uses` edge to a component in another context, resolving each end through `memberOf`. Architecture crossings, recipe 32, reports differences in context or layer and refuses nothing. The architectural annotation decision keeps architecture checks in the corpus's own gate, and the Protocol supplies the reusable graph walk.\n\nThe walk returns the edges a rule forbids as corpus findings, so one body answers a reader through `sdp q` and fails a gate when the corpus names it as a rules file; the first adopter's isolation check becomes the walk named by `sdp validate --rules` with the isolated context `platform`, and none of its own code. An edge the walk cannot decide, because a component states no layer or context or an end belongs to no component, is listed apart: a breach the anchors cannot show is a curation gap, not a finding.",
    sections: {
      intent: {
        problem:
          "A corpus that states an architecture rule in a Spec cannot have it checked by the Protocol, so each adopter writes the same walk over `uses`, `memberOf`, `layer` and `context` in its own gate.",
        outcome:
          "Check a corpus's declared architecture rules, such as a forbidden uses direction or context isolation, against the layers, contexts and uses its anchors state.",
      },
      behavior: {
        rules: [
          "The Protocol's validators never judge a corpus's architecture; an architecture rule runs as one of the corpus's own rules, the corpus's gate decides what fails, and that gate may be the corpus's own invocation of `sdp validate --rules` with the severity the rule states.",
          "A corpus states each architecture rule as intent in a `constraint` Spec that says what is forbidden and why, and keeps the rule's machine form, its forbidden layer pairs and isolated contexts, as data its corpus rule passes to the walk.",
          "The Protocol supplies the walk as a catalog recipe, recipe 42, that takes forbidden layer pairs and isolated contexts as recipe parameters, resolves each end of every anchored `uses` edge to its component, directly or through `memberOf`, and returns each edge a rule forbids with both units, both components and the rule.",
          "The walk returns the edges it forbids as corpus findings in its answer's `findings`, so the shipped recipe file runs unchanged as a rules file under `sdp validate --rules`, at the severity the corpus passes it.",
          "The walk checks two forms, forbidden layer pairs and isolated contexts. It requires no component to state a layer or a context and checks no port, route or other fact the anchors do not carry; a corpus that wants such a check writes a rule of its own.",
          "The walk reads the given rules and anchored structure only; it infers no edge from imports, reads no file path, judges no role and refuses nothing.",
          "A component that states no layer or context falls outside a rule that names one, and the walk lists the edge as unclassified rather than as a breach, as it lists an edge with an end that belongs to no component.",
          "The corpus binds a discovered TypeScript check site to its constraint Spec through a test anchor; that check invokes the corpus rule, and `has-verifier` states that the check exists while its result stays in the corpus's run.",
        ],
        exampleSpace: {
          given: [
            'a member of a component at the layer {fromLayer:"domain"|"application"} in the context {fromContext:"platform"|"orders"} that uses a member of a component at the layer {toLayer:"infrastructure"|"adapter"|"unstated"} in the context {toContext:"platform"|"orders"}',
          ],
          when: [
            'the architecture walk runs {invocation:"through sdp q"|"as a rules file named by sdp validate --rules"} with the forbidden pair domain to infrastructure and the isolated context platform',
          ],
          then: [
            "the walk reports {findings:number} findings with the rule ids {ruleIds:string}",
            "the walk lists {unclassified:number} unclassified edges",
            "the command exits {exitCode:number}",
          ],
        },
        ruleKeys: {
          walk: "rules[2]",
          walkAsRule: "rules[3]",
          forms: "rules[4]",
          unclassified: "rules[6]",
        },
      },
      design: {
        walkParams:
          'recipe 42, the architecture walk, takes `params.forbidden`, a list of `{ from, to }` pairs of layers from the closed set; `params.isolated`, a list of context tokens; and `params.severity`, `"error"` by default or `"warning"`; either list may be empty, and a pair or context given twice counts once; a parameter name outside these three returns `{ unknownParams, accepts }` alone, before any other check, as every catalog recipe answers a name it does not take; neither list given, a layer outside the set, a malformed token or another severity returns `{ diagnostics }` with no `findings`; and either answer fails the file when the walk runs as a rules file.',
        walkAnswer:
          "`{ input: { forbidden, isolated, severity }, totals: { usesEdges, resolved, findings, unclassified }, findings, unclassified }` is the answer when every parameter name is known and every value lawful, where `resolved` counts the `uses` edges whose two ends both resolve to a component; findings sort by `from`, then `to`, then rule id, and unclassified rows by `from`, then `to`; recipe 32's answer stays as it is.",
        walkBreach:
          "an anchored `uses` edge whose ends resolve to two distinct components breaks the pair `{ from, to }` when the using component states layer `from` and the used one states layer `to`, and breaks the isolation of a context when the using component states that context and the used one states another; two units of one component never break a rule, as recipe 32 never counts them as crossing.",
        walkFinding:
          "`{ validatorId, subjectId, relatedId, severity, message, from, to, fromComponent, toComponent, rule }`, a corpus finding in the shape `spec:validation.corpus-rules#design.ruleFinding` pins, where `subjectId` is the using unit `from`, `relatedId` the used unit `to`, both components are `{ id, layer, context }` with null for an unstated attribute, and `validatorId` is `forbidden-layer` with `rule: { from, to }` the pair it breaks, or `isolated-context` with `rule: { context }` the isolated context it leaves.",
        walkMessages:
          "a `forbidden-layer` message reads `<from> uses <to>: layer <from layer> uses layer <to layer> (<fromComponent id> to <toComponent id>), a forbidden pair`, and an `isolated-context` message reads `<from> uses <to>: <fromComponent id> in the isolated context <context> uses <toComponent id> in the context <other context>`.",
        walkUnclassified:
          '`unclassified` rows `{ from, to, fromComponent, toComponent, missing }` list each anchored `uses` edge the walk cannot decide while a list is non-empty: an edge with an end that belongs to no component, that end\'s component null and `missing: ["component"]`, and an edge between two distinct components where either leaves unstated an attribute a non-empty list reads, `layer` for `forbidden` and `context` for `isolated`, named in `missing`.',
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.corpus-rules",
    specKind: "behavior",
    altitude: "feature",
    readiness: "ready",
    file: "specs/validation/corpus-rules.sdp.md",
    title: "Corpus-authored rules run on the one validation path",
    narrative:
      "The original design let a team add its own rules beside the built-in validators, each with an id, a severity and the whole graph query API, run in the same pass and reported in the same output (`docs/lineage/v0-design/06-extraction-and-validation.md` §6.5). The Protocol has two check families, conformance and honesty, and every validator belongs to one of them. The architectural annotation decision sends a corpus's own rules to the corpus's own gate.\n\nThe first adopter's gate runs `sdp validate` and parses its summary line, then checks its own context isolation, entry addresses, dependency cycles, question keys, prose mentions, cited laws and Pack pages. It also parses carrier frontmatter to read kind, readiness and relations, a second read model that a graph-based corpus-rule runner would remove.\n\nA rules file holds the body `sdp q` evaluates, so a rule tried through `sdp q` runs unchanged under `sdp validate`, and a catalog recipe whose answer carries findings, such as the architecture walk, is a rules file as shipped. A rules file that needs a shipped recipe's answer calls it through `recipes` and keeps no copy of its code. The runner reads only the answer's findings, so the recipe keeps the rest of its answer for a reader. Corpus findings print after the Protocol's and are tallied on a line of their own, so a gate that reads the Protocol's summary line reads it unchanged; any error, the Protocol's or the corpus's, exits 1, and the two lines say which. Each rules file receives its own copy of what it reads, so a careless rule cannot change another rule's input and the order of the files changes only the order of the output. Its parameters are its own too: a catalog recipe answers a parameter name it does not take with that name and no findings, so parameters shared by every file would fail the walk on the names another file reads.",
    sections: {
      intent: {
        problem:
          "A corpus with rules of its own checks them off the one validation path, reading the carriers a second way and reporting in a form no Protocol surface reads.",
        outcome:
          "Let a corpus author its own graph rules and have their findings join the one validation report, so no corpus re-parses its carriers to check itself.",
      },
      behavior: {
        rules: [
          "A corpus rule is a graph body the corpus authors, given `g`, `graph`, `report`, `params` and `recipes` as a recipe body is, and returning findings that each carry a rule id, a subject, a message and a severity.",
          "A corpus rule reads the one derived graph, the Protocol's report and the `params` the operator supplies for its file, directly or through the shipped recipes it calls, and no carrier, source file or network; that is the rule author's obligation, because the runner evaluates the body with the trust `sdp q` asks and claims no sandbox.",
          "Validation runs corpus rules only from a file the operator names with `sdp validate --rules PATH`, which may repeat, and never from a file it finds in the corpus or in a configuration; it asks the trust `sdp q` already asks, to run code the operator chose.",
          "Rules files run one at a time in the order named, each to completion, after the Protocol's validators; every file receives the same Protocol report and none sees another file's findings, so the order changes only the order of the output.",
          "Each rules file receives its own copy of the graph and the report, made after the graph is written, and its own `params`, so a body that changes what it receives changes no node, edge, delivery fact or Protocol finding, and nothing another rules file receives.",
          "Each rules file receives as `params` only the parameters the operator names after its `--rules` and before the next `--rules`, or `{}` when none follow it, so no file receives a parameter meant for another.",
          "A rule id names one check within its rules file; two files may use the same id, and their findings stay apart by the file that reported them.",
          "Each corpus finding names its rule and its rules file as its source. The Protocol states none of these rules: a shipped recipe that a corpus names as a rules file checks the rule data the corpus passes it.",
          "Corpus findings stand outside the conformance and honesty families, in a section of the output labelled as the corpus's own and tallied on a summary line of their own, so the two families keep their meaning, the guardrail that checks never judge content quality or workflow keeps binding the Protocol's own validators, and no corpus finding adds to, suppresses or changes a Protocol finding or the exit reason it sets.",
          "A corpus finding carries severity `error` or `warning`. When the operator names `--rules`, an `error` corpus finding makes `sdp validate` exit nonzero and a `warning` stays informative; without `--rules` no corpus rule runs and only the Protocol's validators set the exit code.",
          "A corpus finding moves no readiness floor and reaches no other surface: not the report `sdp q` hands a body, not the reader, not the written graph, and not the Design Review or another projection.",
          "A rules file that cannot be read or does not parse, a body that throws, or an answer that is not an object with a `findings` array of well-formed findings is a rule execution failure; `sdp validate` reports it in the corpus section and exits nonzero, so a broken rule never passes as a clean run. A failed file reports none of its findings, and the other files still run.",
          "`sdp validate --watch` with `--rules` reads and runs every named rules file afresh in each cycle, after the Protocol's validators, and a create, change, delete or rename of a named rules file starts a cycle as a carrier edit does, wherever the file lives, under a directory discovery skips such as `node_modules` included.",
          "Under `--watch`, each cycle after the first reads again every file a `--params @PATH` or `KEY=@PATH` after a `--rules` names, and an edit to such a file starts a cycle, wherever the file lives; a file that cannot be read or parsed then fails only the rules file it belongs to, for that cycle, while the first cycle's read refuses the command as `paramsFlag` states.",
          "Address resolution (recipe 25) and dependency cycles (recipe 26) answer with `findings` beside the rest of their answers, as the architecture walk (recipe 42), external registers (recipe 50) and entry citations (recipe 51) do, so a corpus names any of those shipped files as a rules file, or calls it through `recipes` from a rules file of its own.",
          "When the graph does not derive, no rules file runs, and the corpus summary line says so.",
        ],
        exampleSpace: {
          given: [
            "a probe corpus the Protocol's validators find clean",
            'a first rules file that {first:"returns one error finding"|"returns one warning finding"|"returns a finding with no subject"|"empties the graph it receives"|"is rewritten to return one error finding after the first cycle under --watch"|"reads a parameter file that gains a key after the first cycle under --watch"|"reads a parameter file that stops being JSON after the first cycle under --watch"}',
            "a second rules file that returns one warning when the graph it receives holds no node",
          ],
          when: [
            "the probe corpus is validated with the rules files named by --rules in that order",
          ],
          then: [
            "the command exits {exitCode:number}",
            "the Protocol summary line reads {protocolSummary:string}",
            "the corpus summary line reads {corpusSummary:string}",
            "the second cycle's corpus summary line reads {corpusSummary:string}",
            "the watcher is still running after the second cycle: {running:boolean}",
          ],
        },
        ruleKeys: {
          readsGraphOnly: "rules[1]",
          operatorNamed: "rules[2]",
          namedOrder: "rules[3]",
          copiesPerFile: "rules[4]",
          exitCode: "rules[9]",
          neverMovesFloor: "rules[10]",
          brokenRuleFails: "rules[11]",
          watchReruns: "rules[12]",
          watchedParams: "rules[13]",
          recipesAsRules: "rules[14]",
        },
      },
      design: {
        rulesFlag:
          "`sdp validate [root] [--exclude PATH]... [--check-clean | --watch] [--rules PATH [--params JSON | --params @PATH | --params KEY=@PATH]...]...`; `--rules` and `--params` are options of `validate` alone, a `--params` before the first `--rules` is refused, one file named twice is refused, including through a symlink, and each PATH resolves from the working directory, as a `--params @PATH` file does. Diagnostics retain the path the operator named.",
        paramsFlag:
          "`--params` on `validate` takes the three forms of `sdp q --params` with the same refusals, before the graph derives; each `--params` belongs to the nearest `--rules` before it in the argument list, whatever other options stand between them; one file's parameters merge as `sdp q` merges them, a key given twice for one file is refused, two files may each take the same key, and a file with no `--params` after it receives `{}`.",
        rulesFile:
          "a rules file is UTF-8 text holding one plain JavaScript async function body, the form `sdp q` evaluates, with the bindings `g`, `graph`, `report`, `params` and `recipes`; the runner reads the text and never imports it as a module, so no file extension is required and a catalog recipe file under `dist/recipes/` is a lawful rules file.",
        ruleAnswer:
          "`{ findings: [] }`: the body returns an object whose `findings` is an array, possibly empty; the runner reads `findings` and nothing else, so the answer's other keys stay the body's own data and are never printed.",
        ruleFinding:
          '`{ validatorId, subjectId, severity, message, relatedId?, path?, file?, line? }`, where `validatorId` is the rule id, one token matching `^[a-z][a-z0-9-]*$`, so it never reads as a Protocol validator id; `subjectId` and `message` are non-empty strings; `severity` is `"error"` or `"warning"`; `relatedId` and `path` are strings; `file` is a non-empty root-relative POSIX path, with absolute paths, backslashes and traversal above the root refused, and `line` a positive integer that requires `file`; the runner ignores a finding\'s other keys.',
        corpusFinding:
          "`{ rulesFile, validatorId, subjectId, severity, message, relatedId?, path?, file?, line? }` is the corpus branch of the finding currency, where `rulesFile` is the path as the operator named it; it carries no `family`, and the Protocol's findings keep their shape.",
        corpusReport:
          "the report a run with `--rules` builds keeps the Protocol's findings unchanged in `findings` and adds `corpusFindings`, the corpus findings of each file that did not fail, in the order the files are named and then in the order returned, and `corpusFailures`, one `{ rulesFile, reason }` for each failed file in the order named, never a finding; the report a rules file receives, like the one `sdp q` hands a body, carries neither.",
        corpusSection:
          "on standard error, after every Protocol finding, each rules file in the order named prints the line `corpus rules <path>` and then its findings in the order returned, each in the one composition of location, severity in brackets, rule id and message; a failed file prints `corpus rules <path> failed: <reason>` in place of its findings.",
        corpusSummary:
          "`corpus rules: <errors> errors · <warnings> warnings · <failed> of <files> files failed (the corpus's own rules)`, written to standard output directly after the Protocol's summary line, which stays as `spec:validation.diagnostic-rendering#design.summaryLine` pins it; without `--rules` no such line prints; when the graph does not derive, no rules file runs and no Protocol summary line prints, and the corpus line, the last line on standard output, reads `corpus rules: not run, the graph did not derive`.",
        exitCodes:
          "with `--rules`, `sdp validate` exits 1 when a Protocol finding is an error, a corpus finding is an error, a rules file fails or the graph does not derive, and 0 otherwise; the two summary lines say which.",
        failureReasons:
          "`<reason>` is `cannot be read (<cause>)`, `does not parse at line <L>, column <C>: <cause>`, `threw: <message on one line>`, `returned no findings array`, followed by `; diagnostics: <the answer's diagnostics as JSON>` when the answer carries `diagnostics` or by `; unknownParams: <as JSON>; accepts: <as JSON>` when it carries `unknownParams`, `finding <N> has no lawful <field>`, with N counted from 1, or, under `--watch` after the first cycle, `its parameters cannot be read (<cause>)` when a parameter file named after its `--rules` cannot be read or parsed.",
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
  },
  {
    id: "spec:validation.corpus-rules.copies-contain-changes",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/corpus-rules.copies-contain-changes.sdp.md",
    title: "A rules file that empties its graph leaves the next file's graph whole",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the copy rule on two rules files, the first changing the graph it receives and the second reading its own.",
        assumptions: [
          "The world writes the probe corpus of the error example. The first rules file's body sets the length of `graph.nodes` and of `graph.edges` to zero and returns `{ findings: [] }`. The second rules file's body returns one warning finding when `graph.nodes` is empty and `{ findings: [] }` otherwise. The world runs `sdp validate` on the probe root with the first file, then the second, named by `--rules`, and reads the exit code and standard output.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a probe corpus the Protocol's validators find clean",
              'a first rules file that {first: "empties the graph it receives"}',
              "a second rules file that returns one warning when the graph it receives holds no node",
            ],
            when: [
              "the probe corpus is validated with the rules files named by --rules in that order",
            ],
            then: [
              "the command exits {exitCode: 0}",
              'the Protocol summary line reads {protocolSummary: "validate: 0 errors · 0 warnings (conformance + honesty over the one graph)"}',
              'the corpus summary line reads {corpusSummary: "corpus rules: 0 errors · 0 warnings · 0 of 2 files failed (the corpus\'s own rules)"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.corpus-rules.error-finding-fails",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/corpus-rules.error-finding-fails.sdp.md",
    title: "An error from a corpus rule fails validation and leaves the Protocol's line alone",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the exit rule on one rules file that returns one error finding over a corpus the Protocol finds clean.",
        assumptions: [
          'The world writes a probe corpus of two story-altitude behavior Specs stating `idea`, each with an Intent outcome, the second declaring `refines` on the first, so the Protocol\'s validators report no finding. The rules file\'s body returns `{ findings: [{ validatorId: "probe-rule", subjectId: "probe-subject", severity: "error", message: "the probe rule reports its subject" }] }`. The world runs `sdp validate` on the probe root with that file named by `--rules` and reads the exit code and standard output.',
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a probe corpus the Protocol's validators find clean",
              'a first rules file that {first: "returns one error finding"}',
            ],
            when: [
              "the probe corpus is validated with the rules files named by --rules in that order",
            ],
            then: [
              "the command exits {exitCode: 1}",
              'the Protocol summary line reads {protocolSummary: "validate: 0 errors · 0 warnings (conformance + honesty over the one graph)"}',
              'the corpus summary line reads {corpusSummary: "corpus rules: 1 errors · 0 warnings · 0 of 1 files failed (the corpus\'s own rules)"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.corpus-rules.malformed-finding-fails",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/corpus-rules.malformed-finding-fails.sdp.md",
    title: "A finding with no subject fails its rules file",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the broken-rule rule on one rules file whose only finding carries no subject.",
        assumptions: [
          'The world writes the probe corpus of the error example. The rules file\'s body returns `{ findings: [{ validatorId: "probe-rule", severity: "warning", message: "the probe rule forgets its subject" }] }`, a warning that would pass if it were well formed. The world runs `sdp validate` on the probe root with that file named by `--rules`, reads the exit code and standard output, and reads on standard error the failure line naming the first finding\'s `subjectId`.',
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a probe corpus the Protocol's validators find clean",
              'a first rules file that {first: "returns a finding with no subject"}',
            ],
            when: [
              "the probe corpus is validated with the rules files named by --rules in that order",
            ],
            then: [
              "the command exits {exitCode: 1}",
              'the Protocol summary line reads {protocolSummary: "validate: 0 errors · 0 warnings (conformance + honesty over the one graph)"}',
              'the corpus summary line reads {corpusSummary: "corpus rules: 0 errors · 0 warnings · 1 of 1 files failed (the corpus\'s own rules)"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.corpus-rules.params-edit-starts-a-cycle",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/corpus-rules.params-edit-starts-a-cycle.sdp.md",
    title: "Editing a parameter file starts a cycle that reads the new parameters",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the watched-parameters rule on a parameter file, outside the probe root, that gains a key after the first cycle.",
        assumptions: [
          'The world writes the probe corpus of the error example, a parameter file outside the probe root holding `{ "one": 1 }`, a first rules file whose body returns one warning finding for each key of its `params`, named by `--rules` and followed by `--params @PATH` naming that file, and the second rules file of the copy example. It starts the watcher as the rules-edit example does and, after the first cycle, writes `{ "one": 1, "two": 2 }` to the parameter file, then reads the second cycle\'s corpus summary line and stops the watcher.',
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a probe corpus the Protocol's validators find clean",
              'a first rules file that {first: "reads a parameter file that gains a key after the first cycle under --watch"}',
              "a second rules file that returns one warning when the graph it receives holds no node",
            ],
            when: [
              "the probe corpus is validated with the rules files named by --rules in that order",
            ],
            then: [
              "the second cycle's corpus summary line reads {corpusSummary: \"corpus rules: 0 errors · 2 warnings · 0 of 2 files failed (the corpus's own rules)\"}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.corpus-rules.rules-edit-starts-a-cycle",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/corpus-rules.rules-edit-starts-a-cycle.sdp.md",
    title: "Rewriting a rules file under node_modules starts a cycle that runs the new body",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the watch rule on a rules file that lives under a directory discovery skips and is rewritten after the first cycle.",
        assumptions: [
          "The world writes the probe corpus of the error example, a first rules file under the probe root's `node_modules/probe/` whose body returns one warning finding, and the second rules file of the copy example. It starts `sdp validate --watch` on the probe root with the two files named by `--rules` in that order, waits for the first cycle, rewrites the first file to return one error finding in place of the warning, waits for the second cycle, reads its corpus summary line and stops the watcher.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a probe corpus the Protocol's validators find clean",
              'a first rules file that {first: "is rewritten to return one error finding after the first cycle under --watch"}',
              "a second rules file that returns one warning when the graph it receives holds no node",
            ],
            when: [
              "the probe corpus is validated with the rules files named by --rules in that order",
            ],
            then: [
              "the second cycle's corpus summary line reads {corpusSummary: \"corpus rules: 1 errors · 0 warnings · 0 of 2 files failed (the corpus's own rules)\"}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.corpus-rules.unreadable-params-fail-one-file",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/corpus-rules.unreadable-params-fail-one-file.sdp.md",
    title:
      "A parameter file that stops being JSON fails only its own rules file, and the watcher runs on",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the watched-parameters rule on a parameter file that holds text that is not JSON after the first cycle.",
        assumptions: [
          "The world writes the probe corpus, parameter file and rules files of the parameter-edit example and starts the watcher as that example does. After the first cycle it writes text that is not JSON to the parameter file, waits for the second cycle, reads its corpus summary line and, on standard error, the line `corpus rules <path> failed: its parameters cannot be read (<cause>)` for the first file, then checks that the process is still running before it stops the watcher.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a probe corpus the Protocol's validators find clean",
              'a first rules file that {first: "reads a parameter file that stops being JSON after the first cycle under --watch"}',
              "a second rules file that returns one warning when the graph it receives holds no node",
            ],
            when: [
              "the probe corpus is validated with the rules files named by --rules in that order",
            ],
            then: [
              "the second cycle's corpus summary line reads {corpusSummary: \"corpus rules: 0 errors · 0 warnings · 1 of 2 files failed (the corpus's own rules)\"}",
              "the watcher is still running after the second cycle: {running: true}",
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.corpus-rules.warning-finding-informs",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/corpus-rules.warning-finding-informs.sdp.md",
    title: "A warning from a corpus rule informs and passes",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the exit rule on one rules file that returns one warning finding over a corpus the Protocol finds clean.",
        assumptions: [
          'The world writes the probe corpus of the error example. The rules file\'s body returns `{ findings: [{ validatorId: "probe-rule", subjectId: "probe-subject", severity: "warning", message: "the probe rule reports its subject" }] }`. The world runs `sdp validate` on the probe root with that file named by `--rules` and reads the exit code and standard output.',
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              "a probe corpus the Protocol's validators find clean",
              'a first rules file that {first: "returns one warning finding"}',
            ],
            when: [
              "the probe corpus is validated with the rules files named by --rules in that order",
            ],
            then: [
              "the command exits {exitCode: 0}",
              'the Protocol summary line reads {protocolSummary: "validate: 0 errors · 0 warnings (conformance + honesty over the one graph)"}',
              'the corpus summary line reads {corpusSummary: "corpus rules: 0 errors · 1 warnings · 0 of 1 files failed (the corpus\'s own rules)"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.architecture-constraints.forbidden-layer-pair",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/architecture-constraints.forbidden-layer-pair.sdp.md",
    title: "A domain member that uses an infrastructure member breaks a forbidden pair",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the walk through `sdp q` on one `uses` edge between members of two components whose layers form a forbidden pair.",
        assumptions: [
          'The world writes a probe root with no Spec and two comment-form `component:` anchors, each with one `impl:` member; the using member\'s anchor `uses` the used member. Each component states the layer and context its slots give, and the Protocol\'s validators find the root clean. The world runs the walk\'s shipped recipe file through `sdp q --json` with `params` `{ "forbidden": [{ "from": "domain", "to": "infrastructure" }], "isolated": ["platform"] }`; the rule ids are the findings\' `validatorId` values joined by a comma and a space, in answer order.',
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a member of a component at the layer {fromLayer: "domain"} in the context {fromContext: "orders"} that uses a member of a component at the layer {toLayer: "infrastructure"} in the context {toContext: "orders"}',
            ],
            when: [
              'the architecture walk runs {invocation: "through sdp q"} with the forbidden pair domain to infrastructure and the isolated context platform',
            ],
            then: [
              'the walk reports {findings: 1} findings with the rule ids {ruleIds: "forbidden-layer"}',
              "the walk lists {unclassified: 0} unclassified edges",
              "the command exits {exitCode: 0}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.architecture-constraints.isolated-context-as-rule",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/architecture-constraints.isolated-context-as-rule.sdp.md",
    title: "The walk named as a rules file fails validation on an isolation breach",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the walk's shipped recipe file, unchanged, as a rules file under `sdp validate --rules` on one `uses` edge that leaves an isolated context.",
        assumptions: [
          "The world writes the probe root of the forbidden-pair example, with the layers and contexts the slots give. It runs `sdp validate` on that root with the walk's shipped recipe file named by `--rules` and followed by `--params` with the parameters of that example. The findings are the lines in that file's corpus section, and the rule ids are their rule ids joined by a comma and a space, in output order.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a member of a component at the layer {fromLayer: "application"} in the context {fromContext: "platform"} that uses a member of a component at the layer {toLayer: "adapter"} in the context {toContext: "orders"}',
            ],
            when: [
              'the architecture walk runs {invocation: "as a rules file named by sdp validate --rules"} with the forbidden pair domain to infrastructure and the isolated context platform',
            ],
            then: [
              'the walk reports {findings: 1} findings with the rule ids {ruleIds: "isolated-context"}',
              "the command exits {exitCode: 1}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.architecture-constraints.unstated-layer-unclassified",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/architecture-constraints.unstated-layer-unclassified.sdp.md",
    title: "A component with no layer leaves its edge unclassified",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the walk through `sdp q` on one `uses` edge whose used component states no layer.",
        assumptions: [
          "The world writes the probe root of the forbidden-pair example, except that the used component's anchor states no layer, which the `unstated` value names. It runs the walk as that example does; an empty rule-id string names no finding.",
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a member of a component at the layer {fromLayer: "domain"} in the context {fromContext: "platform"} that uses a member of a component at the layer {toLayer: "unstated"} in the context {toContext: "platform"}',
            ],
            when: [
              'the architecture walk runs {invocation: "through sdp q"} with the forbidden pair domain to infrastructure and the isolated context platform',
            ],
            then: [
              'the walk reports {findings: 0} findings with the rule ids {ruleIds: ""}',
              "the walk lists {unclassified: 1} unclassified edges",
              "the command exits {exitCode: 0}",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.external-registers",
    specKind: "behavior",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/external-registers.sdp.md",
    title: "A corpus checks the register tokens its prose cites",
    narrative:
      "A corpus written against an earlier design cites that design's numbered things by token: its decisions, laws, scenarios, and the extensions the corpus itself adds. The first adopter keeps such a register as a table in its design README and checks the tokens its Specs cite against it with a script that reads the carriers a second way (`libar-platform/design/tools/check.py`). A register is the corpus's own data and never the Protocol's. A token stays prose: the carrier gains no grammar for it and the graph mints no node for it. Recipe 50 reads the tokens the Specs already hold as text, finds them by a pattern the corpus gives, checks them against a register file the corpus passes, and answers with findings, so the check runs as a rules file on the one validation path. Which registers a corpus may cite, and so which files it passes, is its owner's ruling.",
    sections: {
      intent: {
        problem:
          "A corpus that cites the tokens of an outside register checks them with a script that reads its carriers a second way, or does not check them at all.",
        outcome:
          "Check the tokens a corpus cites from an outside register against a register file it supplies, as a rules file, with no new grammar and no graph node.",
      },
      behavior: {
        rules: [
          "A register token stays prose: the carrier gains no grammar for it, the graph holds no node or edge for it, and no Protocol validator reads it.",
          "External registers, recipe 50, takes the register as data, a file the corpus passes with `--params register=@PATH`, and the pattern that finds the register's tokens in text, and reads the graph and nothing else.",
          "It reads every string entry search walks in each Spec, the narrative and every section value with the keys an author coins, open questions and their fields and example steps included, plus each Spec's title and the reason of each relation it declares; it reads no id, fixed field name, Pack manifest, file or source.",
          "Each match of the pattern in one of those strings cites the matched text as a token, at that Spec and entry.",
          "A cited token the register does not list is an `unknown-token` finding, once per citing Spec and token.",
          "A cited token the register retires is a `retired-token` finding, once per citing Spec and token.",
          "When the caller passes `uncited: true`, each token the register holds that no Spec cites is an `uncited-token` finding; a retired token is never one.",
          "The answer carries its findings, so the shipped file runs unchanged as a rules file at the severity the corpus passes; a corpus that checks several registers calls the recipe once per register through `recipes` from a rules file of its own, because one rules file is named once.",
          "The recipe reports and refuses nothing, and states no register: what an outside design may be cited for stays the corpus's own text.",
        ],
        exampleSpace: {
          given: [
            "a probe corpus whose Spec cites the tokens {cited:string}",
            "a register file that holds {held:string} and retires {retired:string}",
          ],
          when: [
            "the shipped external-registers file runs as a rules file with the pattern for E-numbers and uncited {uncited:boolean}",
          ],
          then: [
            "the command exits {exitCode:number}",
            "the corpus findings carry the rule ids {ruleIds:string}",
          ],
        },
        ruleKeys: {
          tokensStayProse: "rules[0]",
          registerAsData: "rules[1]",
          textRead: "rules[2]",
          citation: "rules[3]",
          unknownToken: "rules[4]",
          retiredToken: "rules[5]",
          uncitedToken: "rules[6]",
          asRulesFile: "rules[7]",
        },
      },
      design: {
        registerFile:
          '`{ "tokens": [token] }`, where each token is a non-empty string the register holds, or `{ "token": "<string>", "retired": <boolean> }`, retired when `retired` is true and held otherwise; other keys of the file and of a token object are the corpus\'s own and ignored, so a register may carry its own columns.',
        registerParams:
          'recipe 50 takes `params.register`, the register file\'s object, `params.pattern`, `params.severity`, `"error"` by default or `"warning"`, and `params.uncited`, `false` by default; `register` and `pattern` have no sample, and a missing or malformed parameter returns `{ diagnostics: [{ parameter, problem }] }` and no findings, which fails the file as a rules file.',
        patternParam:
          "`params.pattern` is the source of a JavaScript regular expression compiled with the flags `gu`, whose whole match is the token; a pattern that does not compile, that matches the empty string, or that fails to match each of the register's tokens whole is a diagnostic, as is a token the register lists twice.",
        registerAnswer:
          "`{ input: { pattern, severity, uncited }, totals: { specs, citations, tokens, unknown, retired, uncited }, tokens, findings }`, where `specs` counts the Specs read, `citations` the matches, `tokens` the distinct cited tokens, and the last three the findings of each rule id.",
        tokenRow:
          "`{ token, held, retired, citations, specs }` for each distinct cited token in code-unit order, where `specs` lists the citing Specs by id and an unknown token has `held` and `retired` false.",
        tokenFinding:
          "`{ validatorId, subjectId, relatedId, severity, message, file, path, line }` for `unknown-token` and `retired-token`, where `subjectId` is the citing Spec, `relatedId` the token, `file` the Spec's carrier, `path` the first citing text, in the order the title, the narrative and sections as entry search walks them, then relation reasons as authored, written `title`, a text path in the form the prose-mention check writes, such as `narrative`, `behavior.rules[2]` or `design.<key>`, or `relation.<type>.<target>`, and `line` that text's recorded line, left out when not located; findings sort by Spec id, then token.",
        tokenMessages:
          "`<spec> cites <token>, which the register does not list` for `unknown-token`, `<spec> cites <token>, which the register retires` for `retired-token`, and `<token> is held by the register and no Spec cites it` for `uncited-token`.",
        uncitedFinding:
          '`{ validatorId: "uncited-token", subjectId, severity, message }`, where `subjectId` is the token; these findings follow the others, in the register\'s order.',
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.external-registers.unknown-and-retired",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/external-registers.unknown-and-retired.sdp.md",
    title: "A cited token the register lacks or retires fails a rules run",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the register check as a rules file over a Spec that cites one held, one retired and one unlisted token.",
        assumptions: [
          'The world writes a probe corpus of two story-altitude behavior Specs stating `idea`, each with an Intent outcome, the second declaring `refines` on the first, so the Protocol\'s validators report no finding; the first Spec\'s outcome names the cited tokens in prose. It writes the register file `{ "tokens": ["E-1", "E-2", { "token": "E-7", "retired": true }] }` and runs `sdp validate` on the probe root with `dist/recipes/50-external-registers.js` named by `--rules`, followed by `--params register=@` that file and `--params` holding the pattern `\\bE-\\d+\\b` and `uncited`. The rule ids are the corpus findings\' rule ids in printed order, joined by a comma and a space.',
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe corpus whose Spec cites the tokens {cited: "E-1 E-7 E-9"}',
              'a register file that holds {held: "E-1 E-2"} and retires {retired: "E-7"}',
            ],
            when: [
              "the shipped external-registers file runs as a rules file with the pattern for E-numbers and uncited {uncited: false}",
            ],
            then: [
              "the command exits {exitCode: 1}",
              'the corpus findings carry the rule ids {ruleIds: "retired-token, unknown-token"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
  {
    id: "spec:validation.external-registers.uncited-on-request",
    specKind: "example",
    altitude: "story",
    readiness: "defined",
    file: "specs/validation/external-registers.uncited-on-request.sdp.md",
    title: "A held token no Spec cites fails a rules run only when the caller asks",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Execute the uncited check as a rules file over a Spec that cites one of two held tokens.",
        assumptions: [
          'The world writes the probe corpus of the unknown-and-retired example, its first Spec citing only the held token named below, and the register file `{ "tokens": ["E-1", "E-2"] }`, and runs the shipped file as that example does, with `uncited` true.',
        ],
      },
      behavior: {
        examples: [
          {
            given: [
              'a probe corpus whose Spec cites the tokens {cited: "E-1"}',
              'a register file that holds {held: "E-1 E-2"} and retires {retired: ""}',
            ],
            when: [
              "the shipped external-registers file runs as a rules file with the pattern for E-numbers and uncited {uncited: true}",
            ],
            then: [
              "the command exits {exitCode: 1}",
              'the corpus findings carry the rule ids {ruleIds: "uncited-token"}',
            ],
          },
        ],
      },
    },
    deliveryFacts: [],
  },
] as const;
