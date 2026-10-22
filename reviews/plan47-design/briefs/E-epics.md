# Lane E: epics and the capability map

Read `/tmp/plan47-briefs/common.md` first; it applies in full. Worktree: `/tmp/plan47-wt/E` on
branch `p47/e-epics`. Report step name: `design`.

## The question

The owner: "Filtering only shows one epic, so we should organize features in epics." The model
already has the structure: `altitude` is `epic → feature → story`, and `refines` descends it. The
glossary row "capability / domain" calls the Capability Map "designed-for" and unbuilt, and
`spec:consumers.spec-studio.lenses.packs#rule.packGrouping` says the Studio draws no capability
tree. At the readiness floor, a `ready` Spec needs every `refines` parent to state at least
`defined` (`spec:validation.readiness-floor#readyFloor`), so an epic over ready features must
itself state `defined` or more.

Measured at the base: the Protocol states one epic (`spec:protocol.self-hosting`, which 14
features and decisions refine as a catch-all root); 80 features refine another feature, 168
stories a feature, 127 stories a story; 10 Specs refine nothing. Re-measure.

## Do

1. **Measure** the refinement structure on both corpora: altitude transitions, roots, depth,
   Specs with several parents, decisions and examples in the tree.
2. **Design the capability map** in `spec:consumers.capability-map`: what an entry carries (stated
   rung, floor reached, delivery facts, open and blocking questions), what an epic's row rolls up
   from its descendants (counts by rung, implemented, verified), how examples and decisions appear
   (counted, listed, or left to their parents), the answer shape of recipe 52 as keyed Design
   entries, and answers to its open questions `#multipleParents` and `#unreached`.
3. **Design the page** in `spec:consumers.spec-studio.capability-map-page`: the page, its place in
   the top navigation, the tree's drawing (lane G owns drawing kinds; say what you need), how each
   node links, and narrowing the index's Specs by epic. Propose the edit to
   `spec:consumers.spec-studio.lenses.packs#rule.packGrouping` and to the glossary row.
4. **Organize the Protocol's own features in epics** (`spec:protocol.capability-epics`): answer
   `#epicHome` with a reason; propose the epics (id, title, one-line outcome, kind) and, for every
   feature that refines no feature today or refines the self-hosting epic as a catch-all, its
   epic. Where a hub Spec already states a capability, prefer enriching it in place to `epic`
   over a new Spec; say why for each. Then author it in your worktree: the epic Specs and the
   `refines` changes, keeping every `ready` Spec's floor at `ready` (recipe 7 and recipe 11 before
   and after) and adding no warning. Each new or re-altituded epic states the honest rung its
   content clears. Say what the self-hosting epic keeps.
5. **Show the platform** what it would see: run your prototype on the platform copy (one epic).
   Propose, as exact text, what the upgrade guide (`docs/agent-surface/upgrade-guide.md`) tells
   an adopter about organizing features in epics. Do not author the platform's epics.
6. **Prototype** the capability map page on both corpora, at the Protocol's base, at your
   worktree's head (with the epics authored), and on the platform copy, with screenshots.
