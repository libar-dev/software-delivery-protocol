---
id: spec:decisions.adopted-registrars-committed
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:extraction.runnable-modules
---
# Adopted runnable registrars are committed

## Intent
- outcome: Make an authored test's generated registrar dependency reviewable and available before generation without pretending every generated registrar is source.

## Decision
- context: Runnable registrars are derived siblings of authored tests. Most remain ignored, but an authored test that imports one cannot typecheck or execute from a clean checkout unless that adopted sibling is present or generation runs first.
- decision: A registrar becomes adopted when tracked authored code imports it. Adopted registrars are committed and byte-checked against fresh generation; unadopted registrars remain ignored, regenerable output. A deterministic generated manifest owns reconciliation for both groups without turning registrar content into authored truth.
- rationale: This is hard to reverse once adopter tests depend on clean-checkout imports. It is surprising without context that one derived sibling is tracked while its unadopted peers are ignored. It is a real trade-off: committing adopted bytes adds review noise and requires a falsifiable equality gate, while ignoring them all makes authored imports depend on an unrecorded generation precondition.
- consequence: `--check-clean` refuses manifest or sibling-byte drift, preflight compares tracked worktree and Git-index bytes with independent regeneration, and stale manifest-owned siblings are removed.
- consequence: Tracking a registrar confers no delivery fact or migration claim; its `specTest` anchor remains the only verifier-binding source.
- alternative: Ignore every registrar and require generation before typecheck or test discovery; this keeps git smaller but makes an authored import unavailable in a clean checkout.
- alternative: Commit every registrar; this is mechanically simple but turns unadopted migration candidates into persistent review noise.
