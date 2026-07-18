# Todo 35 validation coverage check

## Generated graph

Command:

```sh
npm run generate:self-hosting
```

Output:

```text
50 specs · 1 packs · 29 anchors -> 80 nodes · 156 edges (0 errors, 0 warnings)
validate: 0 errors · 0 warnings (conformance + honesty over the one graph)
```

Graph probe:

```sh
rg -n 'spec:validation\.(referential-integrity|claim-separation|verification-linkage|pack-coherence|authored-honesty|warn-level-signals)' generated/graph.json
```

The probe found all six IDs as graph nodes and their `refines` edges.

## Eleven-check map

| Check ID | Carrying Spec | Disposition |
|---|---|---|
| `conformance/referential-integrity` | `spec:validation.referential-integrity` | one rule, `checkReferentialIntegrity` |
| `conformance/duplicate-ids` | `spec:validation.duplicate-ids` | pre-existing rule |
| `conformance/claim-separation` | `spec:validation.claim-separation` | one rule, `checkClaimSeparation` |
| `conformance/verifies-linkage` | `spec:validation.verification-linkage` | bundled with oracle linkage |
| `conformance/oracle-linkage` | `spec:validation.verification-linkage` | bundled with verifies linkage |
| `conformance/pack-coherence` | `spec:validation.pack-coherence` | one rule, `checkPackCoherence` |
| `conformance/orphans` | `spec:validation.warn-level-signals` | bundled with gaps |
| `honesty/authoring-shape` | `spec:validation.authored-honesty` | bundled with delivery facts |
| `honesty/delivery-facts` | `spec:validation.authored-honesty` | bundled with authoring shape |
| `honesty/readiness-floor` | `spec:validation.readiness-floor` | pre-existing rule |
| `honesty/gaps` | `spec:validation.warn-level-signals` | bundled with orphans |

## Entry-point probe

Command:

```sh
rg -n 'check(ReferentialIntegrity|ClaimSeparation|VerifiesLinkage|OracleLinkage|PackCoherence|AuthoringShape|DeliveryFacts|Orphans|Gaps)' specs/validation/{referential-integrity,claim-separation,verification-linkage,pack-coherence,authored-honesty,warn-level-signals}.sdp.md
```

The probe found each of the nine newly covered validator entrypoints in its carrying rule.

## Audit scripts

```text
check-carrier-rule: all surfaces agree: canonical-default carrier rule and relations distinction.
check-carrier-truth: 32 repaired claims hold; 19 corpus files scanned; 52 retained mentions classified.
check-self-hosting-gates: exit 0; temporal exit 0; G1-G8 scaffold checked.
```

## Frozen corpus checkpoint

Command:

```sh
npm test -- test/self-hosting-graph.test.ts
```

Output:

```text
Test Files  1 passed (1)
Tests       1 passed (1)
```

The checkpoint now expects 50 Specs, 1 Pack, and 29 anchors, including the six validation
carriers and their six declared refinement edges.

## Full gate

Command:

```sh
npm run check
```

Output:

```text
50 specs · 1 packs · 29 anchors -> 80 nodes · 156 edges (0 errors, 0 warnings)
Test Files  31 passed (31)
Tests       427 passed (427)
```
