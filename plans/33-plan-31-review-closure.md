# Plan 33 — close the plan-31 review

> **Status:** DRAFTED — execute every adjudicated plan-32 finding, re-measure the graph and
> green gate, then prepare and publish the ready plan-31 PR. Plan 32 remains the review brief;
> brief E remains outside this fix pass.

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
