# Write a carrier

For a carrier written by hand, or a refusal that stops every query; the full grammar is
`spec:carrier.markdown-body-grammar`.

```sdp.md
---
id: spec:orders.create-order
kind: behavior
altitude: feature
readiness: scoped
relations:
  refines: spec:orders.checkout
  dependsOn:
    - target: spec:orders.order-numbering
      reason: each created order takes the next number
---
# Create an order

## Intent

- outcome: A shopper turns a cart into one order.

### Open questions

- [blocking #cartLock] Does creating the order lock the cart?
  - decider: owner
  - provisional: the cart stays editable until payment

## Behavior

- rule: [#onePerCart] A cart yields at most one order.
```

One line, one entry; a question's fields, indented two spaces, are the only continuation. A
section may open with prose, except Constraints, and none follows its first entry, fence or H3.
A plain entry whose text before its first colon is one word reads as a key: reword it. A Spec
has at most one of Behavior, Rule, Workflow and Contract; leading prose sits under that section
or under Example space, never both. An example's one concrete `gwt` fence closes its Intent.

| Section                    | Entries                                                                   |
| -------------------------- | ------------------------------------------------------------------------- |
| `## Intent`                | `actor:` `problem:` `outcome:` `value:` once; `risk:`, `assumption:`      |
| `## Behavior`              | `rule:`, `flow:`                                                          |
| `## Rule`, `## Contract`   | plain entries, one rule each                                              |
| `## Workflow`              | plain entries, one flow each; `rule:`                                     |
| `## Example space`         | one `gwt-vocabulary` fence                                                |
| `## Constraints`           | `statement:` (required) `flavor:` `target:` `measurableBy:`, once         |
| `## Model`                 | `**term** — definition`, unique terms                                     |
| `## Design`, `## UI`       | `lowerCamelKey: one-line value`, unique keys                              |
| `## Decision`              | `context:` `decision:` once; `rationale:`, `alternative:`, `consequence:` |
| `## Verification — <mode>` | one criterion each; mode `manual`, `reviewed`, `contract`, `executable`   |

## Keys, questions, reasons

- The question above is `spec:<id>#question.cartLock` (`spec:model.open-question-keys`). Its
  fields are `decider:`, one lowercase kebab token such as `owner` or `product-owner`; `links:`,
  Spec ids or entry addresses such as `spec:<id>#rule.<key>`, separated by commas;
  `provisional:`; and, on a blocking question only, `trigger:`. None moves a floor
  (`spec:model.open-question-fields`).
- Key a rule that something outside the Spec cites, as `spec:<id>#rule.<key>`; the rule-key
  proposal (recipe 48, `dist/recipes/48-the-rule-key-proposal.js`) drafts keys. An example names
  the rules it exercises on its target:
  `verifies: { target: spec:<parent>, exercises: [onePerCart] }` (`spec:model.rule-keys`).
- A relation reason confers nothing (`spec:model.relation-reasons`). A decision `refines` the
  Spec whose question it settles, and that Spec names it through `decidedBy`.

## Gherkin and Packs

- A `.sdp.gherkin` file carries only `behavior` and `example` Specs, with no open questions or
  relation reasons (`spec:carrier.gherkin-authoring`).
- A Pack manifest, `*.pack.sdp.md`, takes only `id`, `specs`, `modelRefs` and `order: priority`;
  its H1 is the title, its prose the framing (`spec:carrier.markdown-pack-authoring`).
