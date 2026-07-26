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
      intent: { outcome: "Refuse maturity claims that their authored evidence does not support." },
      behavior: {
        rules: [
          "A Spec may state a readiness only when every clause in that readiness floor passes.",
          "The `ready` floor reads the Spec's own edges through three clauses: every authored relation resolves to a known target, every `refines` and `dependsOn` target itself stands at least `defined`, and every anchor bound to the Spec resolves.",
          "The anchor clause reads the bindings that are present, so a Spec carrying no anchor clears it — the floor never demands a binding an author has not made.",
          "The floor table in `src/validate/readiness-floor.ts` is the clause set's code-level source of truth and the realizing entrypoint; the clauses of the lower rungs are stated there and are not re-enumerated here.",
        ],
      },
    },
    deliveryFacts: ["implemented", "has-verifier"],
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
      intent: { outcome: "Prevent ambiguous authored identity from entering the graph." },
      behavior: {
        rules: [
          "If more than one carrier declares an ID, every duplicate site receives extract/duplicate-id and no ambiguous node is derived.",
        ],
        exampleSpace: {
          given: [
            "a {firstCarrier:string} carrier declares {specId:string}",
            "a {secondCarrier:string} carrier declares {specId:string}",
          ],
          when: ["the extraction root is read"],
          [["t", "hen"].join("")]: [
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
      intent: { outcome: "Execute the duplicate-ID rule across both carrier surfaces." },
      behavior: {
        examples: [
          {
            given: [
              'a {firstCarrier: "TypeScript"} carrier declares {specId: "spec:fixture.duplicate"}',
              'a {secondCarrier: "Markdown"} carrier declares {specId: "spec:fixture.duplicate"}',
            ],
            when: ["the extraction root is read"],
            [["t", "hen"].join("")]: [
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
          "Every validator belongs to either the conformance family, which checks meta-model well-formedness, or the honesty family, which rejects authored or overstated derived truth.",
          "Validation errors fail the build; gaps and orphans remain informative signals rather than delivery-process gates.",
          "Types enforce structural shape, schema validates graph payloads, and graph validators enforce cross-file conformance and honesty; no one layer substitutes for the others.",
          "All graph validation runs through the one derived graph path: source, extraction, graph, then checks.",
          "The two families are load-bearing, so an aggregate report spanning both states no family of its own while every finding names the family it came from.",
          "The realizing entrypoints are `graphValidatorIds` and `validateGraph` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            'the graph holds a spec {specId:string} at readiness {readiness:"idea"|"ready"}',
            "the spec declares a dependsOn relation to the absent target {targetId:string}",
          ],
          when: ["the graph is validated"],
          [["t", "hen"].join("")]: [
            "the aggregate report states no family of its own",
            'the conformance family reports {conformanceId:string} at severity {conformanceSeverity:"warning"|"error"}',
            'the honesty family reports {honestyId:string} at severity {honestySeverity:"warning"|"error"}',
          ],
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
            [["t", "hen"].join("")]: [
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
          "The finding names the unique nearest known id as a suggestion and stays silent when two candidates tie, because resolving ambiguity silently is never the check's job.",
          "The realizing validator entrypoint is `checkReferentialIntegrity` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            "the graph holds one spec {presentId:string}",
            "the spec declares a dependsOn relation to {targetId:string}",
          ],
          when: ["the graph is validated"],
          [["t", "hen"].join("")]: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the finding offers the nearest-id suggestion: {suggested:boolean}",
          ],
        },
      },
    },
    deliveryFacts: ["has-verifier"],
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
            [["t", "hen"].join("")]: [
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
            [["t", "hen"].join("")]: [
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
          "The realizing validator entrypoint is `checkClaimSeparation` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            "the graph holds a spec {specId:string}",
            'the graph carries an off-contract {element:"edge claim"|"descriptor value"} spelled {value:string}',
          ],
          when: ["the graph is validated"],
          [["t", "hen"].join("")]: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the finding message states {phrase:string}",
            "the report holds {floorCount:number} readiness-floor findings",
          ],
        },
      },
    },
    deliveryFacts: ["has-verifier"],
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
            [["t", "hen"].join("")]: [
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
            [["t", "hen"].join("")]: [
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
    title: "Declared verification resolves to a performing trace",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep verification relationships meaningful by requiring declared test and oracle traces to resolve to their enabled bindings.",
      },
      behavior: {
        rules: [
          "A declared verifies relation and an oracle model relation must resolve through their respective binding traces before either can stand as verification evidence.",
          "A non-resolving trace is named loudly and confers no delivery fact, because silence would read as verification the graph never earned.",
          "At most one expected-outcome authority may model an example space: a second resolving oracle binding on the same space is an error, because two authorities leave the modeled outcome ambiguous.",
          "The realizing validator entrypoints are `checkVerifiesLinkage` and `checkOracleLinkage` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            "the graph holds a parent spec {parentId:string}",
            'a non-resolving {verifierKind:"example spec"|"oracle anchor"} named {verifierId:string} points at it',
          ],
          when: ["the graph is validated"],
          [["t", "hen"].join("")]: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the parent earns the delivery fact has-verifier: {conferred:boolean}",
          ],
        },
      },
    },
    deliveryFacts: ["has-verifier"],
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
          "Execute the verifies-linkage law where no test anchor completes the spec-to-test trace.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a parent spec {parentId: "spec:probe.create-order"}',
              'a non-resolving {verifierKind: "example spec"} named {verifierId: "spec:probe.create-order.valid-cart"} points at it',
            ],
            when: ["the graph is validated"],
            [["t", "hen"].join("")]: [
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
    title: "An oracle with no example space to model confers nothing",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the oracle-linkage law where the modeled spec owns no example space.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a parent spec {parentId: "spec:probe.order-policy"}',
              'a non-resolving {verifierKind: "oracle anchor"} named {verifierId: "oracle:probe.order-policy"} points at it',
            ],
            when: ["the graph is validated"],
            [["t", "hen"].join("")]: [
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
    id: "spec:validation.pack-coherence",
    specKind: "rule",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/pack-coherence.sdp.md",
    title: "Packs are coherent aggregates",
    narrative: null,
    sections: {
      intent: {
        outcome:
          "Keep review aggregates coherent without treating them as truth-bearing delivery artifacts.",
      },
      behavior: {
        rules: [
          "Pack membership must not repeat a Spec, and every modelRef must resolve to a model-kind Spec.",
          "Membership is counted on the derived belongsTo edges the manifest re-expresses, so a repeated manifest entry is named once per repeated member.",
          "The realizing validator entrypoint is `checkPackCoherence` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            "a pack {packId:string} lists the spec {specId:string} {memberCount:number} times",
            "the pack also names that spec as a modelRef",
          ],
          when: ["the graph is validated"],
          [["t", "hen"].join("")]: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the report holds {findingCount:number} pack-coherence findings",
          ],
        },
      },
    },
    deliveryFacts: ["has-verifier"],
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
            [["t", "hen"].join("")]: [
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
          "Keep derived graph truth trustworthy by rejecting any authored substitute for machine-derived claims or facts.",
      },
      behavior: {
        rules: [
          "Specs and Packs must not author derived edges, claims, or delivery facts, and any stated delivery facts must equal the graph's recomputed facts.",
          "The realizing validator entrypoints are `checkAuthoringShape` and `checkDeliveryFacts` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            "the graph holds a spec {specId:string}",
            'the spec hand-authors the delivery fact {factName:"implemented"|"has-verifier"} at {site:"a behavior section carrier"|"the node deliveryFacts array"}',
          ],
          when: ["the graph is validated"],
          [["t", "hen"].join("")]: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the finding names the fact {relatedId:string} and states {phrase:string}",
          ],
        },
      },
    },
    deliveryFacts: ["has-verifier"],
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
            [["t", "hen"].join("")]: [
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
            [["t", "hen"].join("")]: [
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
          "The realizing validator entrypoints are `checkOrphans` and `checkGaps` in `src/validate/validators.ts`.",
        ],
        exampleSpace: {
          given: [
            'the graph holds a spec {specId:string} at readiness {readiness:"idea"|"ready"}',
            'the spec declares {relations:"no relation"|"a decidedBy decision"}',
          ],
          when: ["the graph is validated"],
          [["t", "hen"].join("")]: [
            'the report names {findingId:string} at severity {severity:"warning"|"error"}',
            "the report holds {errorCount:number} errors",
          ],
        },
      },
    },
    deliveryFacts: ["has-verifier"],
  },
  {
    id: "spec:validation.warn-level-signals.orphan-signal",
    specKind: "example",
    altitude: "story",
    readiness: "ready",
    file: "specs/validation/warn-level-signals.orphan-signal.sdp.md",
    title: "A disconnected spec warns and fails nothing",
    narrative: null,
    sections: {
      intent: { outcome: "Execute the orphan signal on a spec no relation reaches." },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.orphan-signal"} at readiness {readiness: "idea"}',
              'the spec declares {relations: "no relation"}',
            ],
            when: ["the graph is validated"],
            [["t", "hen"].join("")]: [
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
    title: "A ready spec without a verifier warns and fails nothing",
    narrative: null,
    sections: {
      intent: {
        outcome: "Execute the gap signal on a connected ready spec no verifier resolves.",
      },
      behavior: {
        examples: [
          {
            given: [
              'the graph holds a spec {specId: "spec:probe.gap-signal"} at readiness {readiness: "ready"}',
              'the spec declares {relations: "a decidedBy decision"}',
            ],
            when: ["the graph is validated"],
            [["t", "hen"].join("")]: [
              'the report names {findingId: "honesty/gaps"} at severity {severity: "warning"}',
              "the report holds {errorCount: 0} errors",
            ],
          },
        ],
      },
    },
    deliveryFacts: ["has-verifier"],
  },
] as const;
