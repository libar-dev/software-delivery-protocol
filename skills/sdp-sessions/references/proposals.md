# Change proposals

Read this to write review findings against Specs or apply a received proposal. The shape is
`spec:consumers.intent-composition.proposal` (`schemas/sdp-proposal-1.schema.json`); applying it is
`spec:consumers.intent-composition#rule.changedScope`.

## Write

- One proposal per review, its `base` the commit you read: the head you reviewed, or a preview's
  merge commit from its stamp. Changes run most severe first.
- An open design finding becomes an open question with `decider`, `provisional` and `links`; a
  deferral adds `trigger` (`spec:model.open-question-fields`). Findings against code or other
  files stay line comments; a review proposing no Spec edit has no proposal.
- Render the memo with the proposal memo (recipe 49, `dist/recipes/49-the-proposal-memo.js`).
  Check it as below: it is ready when the check sends nothing back.

## Receive

From the Studio or a vault, load its skill first: it confirms the base and converts links back to
addresses.

1. Know the base: the commit the reviewer read, the preview's merge commit, or the commit in the
   person's intent note. Otherwise ask.
2. Write the graph at that commit outside `generated/`, as
   `spec:consumers.design-diff#design.baseRecipe` states. The next build overwrites a graph in
   `generated/`, and the check then compares head with head.
3. Run the proposal check (recipe 38, `dist/recipes/38-the-proposal-check.js`):
   `return await recipes(38, params)` with
   `--params proposal=@proposal.json --params base=@<base graph> --json`.
4. Route each change:
   - non-empty `schemaProblems`: no change rows; return the proposal to its author;
   - `moved` not `false` (`null`: not comparable), a `scope` row with `resolvesAtHead: false`, or
     a `relationTarget` with `resolvesAtHead: false`: send the change to the person;
   - apply the rest as ordinary carrier edits through `sdp-authoring`.
5. The applying commit names the proposal's reason line and base. With commit authority, commit,
   then rebuild and stamp the Studio or rerun `sdp vault`; without it, rebuild unstamped.

Done: every change applied, sent or returned; `report` (orientation 4) holds no error.
