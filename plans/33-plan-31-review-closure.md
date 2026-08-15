# Plan 33 — close the plan-31 review

> **Status:** ✅ EXECUTED — every adjudicated plan-32 finding is closed, the graph and gate were
> re-measured from the final implementation, and the branch is ready for publication. Plan 32
> remains the review brief; brief E remained outside this fix pass.

## Settled choices

- A graph-validly reified code anchor survives dangling or otherwise invalid structural edges;
  graph validation reports the error while `satisfies` and its delivery fact remain intact.
- A runnable registrar invokes the scenario-level product call once, evaluates the oracle lazily
  at the first `Then`, and never calls the oracle for an incomplete point.
- Census, Mermaid, and Gherkin projections publish diagnostic output after successful extraction
  and return the validation exit code.
- The carrier-universality, structural-anchor, and adopted-registrar decisions are ratified as
  MD-29 through MD-31. Runnable modules, census, Mermaid, and Gherkin view state `ready` after
  their bindings and evidence are re-measured.

## Execution record

1. Restore structural-anchor intent/code agreement and make dangling census evidence reachable.
2. Make generated registrars reconciled, falsifiable, fail-loudly, and transactionally published.
3. Close runnable-runtime, Gherkin-lossiness, projection-publication, and verification gaps.
4. Wire every projection into repository generation/check surfaces and refresh durable guidance.
5. Run graph preflights, focused checks, and the full green gate twice; close this record with
   re-derived evidence before publishing the PR.

## Acceptance

- Canonical build backlog is empty; self-hosting extraction and validation report zero findings.
- The three new projection Specs leave the drift alarm; runnable modules and census have resolving
  implementation/verifier bindings; all four target Specs state and derive `ready`.
- Stale, divergent, orphaned, or partially written registrar output is detected or removed.
- Two consecutive `npm run check` invocations pass at the final commit candidate.
- The branch is committed in scoped logical commits, pushed without history rewriting, and opened
  as a ready-for-review PR with the final human-readable description.

## Close record — 2026-08-15

- Graph re-measurement: 156 Specs, 1 Pack, and 146 anchors derive 303 nodes and 571 edges with
  zero extraction or validation findings. The operational build backlog is empty.
- Promotion evidence: runnable modules, census, Mermaid, and Gherkin view all state and derive
  `ready`, have no floor failures, and carry resolving implementation plus verifier bindings.
  The drift alarm fell from 11 to 8 because the three implemented projection Specs no longer sit
  below `ready`.
- Generated review inspection: each promoted Spec's Design Review shows stated/floor `ready`,
  present implementation and verifier bindings, and no findings.
- Verification: `npm run check` passed twice consecutively after the implementation commit. Each
  run passed both typechecks, 763 pooled tests plus 62 isolated CLI tests (825 passed total, one
  intentional skip), self-hosting generation/checks for all four projection roots, checkout
  generation/checks, current-plan discovery, and clean-room preflight with a clean semantic diff.
- Commit structure: `fc792e4` commissioned plan 33; `421233d` implemented the adjudicated review
  closure. This close record is the third and final scoped commit.

Remaining work is deliberately forward-looking: brief E; adoption decisions for the 30 deferred
registrar families; Protocol-side `component`/`uses` authorship; and brief C's reference,
context-bundle, and Spec Studio candidates.
