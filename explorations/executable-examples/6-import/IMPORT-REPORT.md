# `sdp import` — report (mock of the converter's output)

> One-way, one-time conversion: vanilla Gherkin `.feature` → SDP documents.
> The importer is a devtool (it may depend on a stock Gherkin parser); it is
> never a canonical parse path, never round-trips, and never runs in `build`
> or `validate`. Its job is a good first draft plus an honest list of what it
> could not know.

## Input → output

| Gherkin construct | Became | Mapping rule |
|---|---|---|
| `Feature:` + description | `spec:orders.create-order` (`behavior`, `feature`) | header → envelope; description → document prose |
| `Rule:` ×2 | two `rule`-kind specs refining the behavior | a Rule is a named coordinate on the one primitive |
| `Scenario:` ×2 | two `example`-kind specs refining their rule | GWT → `gwt` fence, inline values stay prose |
| `Scenario Outline:` + placeholders | the parent's **example space** (`{qty:number}`, `{price:number}`, `{total:number}`) | placeholders → slots; types **inferred** from Examples columns |
| `Examples:` rows ×2 | one example per row, each a **bound point** (`{qty: 1}` …) | a row is a point, by definition |
| `Background:` | its Given hoisted into every example's fence | Cucumber's implicit prepend made explicit |

7 documents emitted, 0 constructs dropped silently.

## Needs your attention (the importer refuses to guess)

1. **Tags `@orders @smoke`** carry no delivery meaning the envelope can state —
   listed here, not converted. If they encoded grouping, a `Pack` may absorb
   them; if they encoded lifecycle, readiness already says it better.
2. **Readiness stated at `scoped`, everywhere.** Structured GWT is present, so
   `scoped` is earned; anything higher is for the floor evaluator to confirm
   after you add intent/verification — the importer never claims what it
   cannot see.
3. **`verifies` edges: none emitted.** The importer cannot know which tests
   verify what — binding is the anchor's job, after import.
4. **Generated names are placeholders** (`order-total.case-1`). Rename to what
   each point *means* (e.g. `single-unit-cart`); IDs are yours to own.
5. **Slot types are inferred** (`number` from all-numeric columns). Confirm,
   or tighten to closed unions where the column is really an enumeration.
6. **`refines` target of the behavior spec is a placeholder** — the importer
   cannot know your altitude structure above the feature.
