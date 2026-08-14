---
id: spec:decisions.sdp-gherkin-extension
kind: decision
altitude: feature
readiness: ready
relations:
  refines: spec:decisions.gherkin-carrier-option
  dependsOn: spec:decisions.sdp-ts-extension
---
# Canonical Gherkin carriers use `.sdp.gherkin`

## Intent
- outcome: Keep graph-aware Gherkin Specs discoverable by the Protocol without colliding with default Cucumber runner globs.

## Decision
- context: The Gherkin carrier option admits a BDD-native surface for behavior and example Specs, but does not settle the file suffix. Bare `.feature` keeps default editor and Cucumber tooling recognition, yet matches ordinary runner globs and therefore risks treating Protocol carriers as executable Cucumber tests. A compound Protocol suffix mirrors the `.sdp.ts` collision-safety law and gives discovery a unique, content-free signal.
- decision: Canonical graph-aware Gherkin Specs use the `.sdp.gherkin` suffix. Discovery is suffix-only: `.sdp.gherkin` files are Gherkin carriers, and bare `.feature` files are not. Bare `.feature` remains non-canonical territory for import sources, foreign corpora, and historical lineage, never a second live canonical surface. This ruling does not change which Spec kinds may choose Gherkin, does not flip the default carrier away from Markdown, and does not admit dual-suffix discovery or content sniffing.
- rationale: Collision safety outranks default editor recognition before external adoption freezes the suffix. Compound extensions already identify Markdown and TypeScript carriers without test-glob collisions; applying the same pattern to Gherkin keeps one discovery walk honest. Teams that want highlighting can associate `*.sdp.gherkin` with Gherkin in the editor, while Cucumber's default `*.feature` globs stay clear of Protocol carriers.
- consequence: Extractors, CLI empty-corpus diagnostics, copy rules, fixtures, and authoring guidance treat `.sdp.gherkin` as the only discovered Gherkin carrier suffix.
- consequence: Ordinary `.feature` files beside a corpus neither enter the graph nor poison extraction; they stay import-source and foreign-corpus material until an explicit import adapter says otherwise.
- consequence: Default editor and formatter recognition for bare `.feature` is not inherited; consumers configure a `*.sdp.gherkin` association when they want Gherkin highlighting or formatting.
- alternative: Keeping bare `.feature` as canonical would preserve stock Gherkin tooling out of the box, but would keep Protocol carriers inside default Cucumber globs and invite false execution of authored intent.
- alternative: Accepting both `.feature` and `.sdp.gherkin` would create a dual-suffix window, split discovery, and weaken the one-canonical-surface law the carrier rulings already enforce.
