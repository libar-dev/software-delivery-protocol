# Plan 30 — Gherkin carrier hardening (`.sdp.gherkin`)

> **Status:** 🔄 EXECUTING — settle the canonical Gherkin suffix as `.sdp.gherkin` (MD-28),
> harden physical description locations, closed decoration/empty-scenario grammar, and bounded
> multi-finding diagnostics; repair known declined-Gherkin current-intent drift. Commissioned
> from the plan 29 arc index; brief A consumes the settled suffix and does not reopen it.

## Context

Plan 28 realized the Gherkin carrier option (MD-27) for behavior and example Specs. Before
external adoption freezes the bare `.feature` suffix, this plan migrates the canonical carrier
to `.sdp.gherkin`, records the collision-safety versus editor-tooling trade-off as MD-28, and
hardens the one-graph reifier without broadening kind coverage or rich body syntax.

## Outcome shape

- Canonical discovery recognizes `*.sdp.gherkin` only; ordinary `.feature` is not a carrier.
- Description grammar findings report physical LF/CRLF source lines.
- Reserved-head similarity, decoration inertness, and zero-step Scenario refusal stay closed.
- Independent semantic findings accumulate deterministically (cap 100); invalid carriers
  contribute no graph nodes while healthy siblings survive.
- Self-hosted examples, frozen oracles, authoring guidance, and the green gate close the PR.

## Out of scope

Plan 29 brief A still owns kind coverage, rich Markdown/Gherkin bodies, and any default-carrier
flip. No Cucumber execution path, dual-suffix window, or second dogfooding family migration.
