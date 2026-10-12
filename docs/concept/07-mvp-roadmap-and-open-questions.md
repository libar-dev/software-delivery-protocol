# 07 — MVP Acceptance of Record

The MVP's slice plan, cut list and open questions now live where the graph keeps them: the worked example at `examples/checkout-v1`, each settled answer in the Spec that carries it, and each deferral as a blocking open question on its own Spec, read through the open-question register (recipe 20). Git holds this document's earlier text. One acceptance criterion has no carrying Spec, and it stays here.

---

## The correctness oracle stays apart from the determinism self-checks

Both exist, labeled distinctly, never conflated. The **correctness oracle**, "did the extractor produce the *right* graph", is the committed golden fixture: `test/fixtures/checkout-v1/expected-graph.json` plus the projection golden trees beside it (`expected-design-review/`, `expected-census/`, `expected-mermaid/`). They are legitimate because they live under `test/fixtures/`, never in the gitignored `generated/` (L8); their paths are repo-relative and POSIX, and binding line numbers are deliberately included, because the line *is* the binding location (`spec:extraction.derive-graph`).

The **determinism self-checks**, "is the output a pure function of the repo", live separately in the CLI tests: `--check-clean` (two independent extractions, byte-identical), delete-`generated/`-and-rebuild, and the clean-repo determinism test (the full pipeline at a different absolute path is byte-identical). Each is a self-comparison, **never** a diff against a committed `generated/` artifact (`spec:extraction.determinism`).
