# A Pack design pass

Read this to review a Pack's design in one pass. A pass edits no carrier; it ends in a proposal.

1. Read what changed since the last pass: the design diff (recipe 35,
   `dist/recipes/35-the-design-diff.js`), its `base` the graph written at that pass's commit and
   kept outside `generated/`, where a later build overwrites it and the diff reads "nothing
   changed". A first pass skips this.
2. For one concern, narrow the Pack with the perspective filter (recipe 37,
   `dist/recipes/37-the-perspective-filter.js`) and a `perspective` the corpus writes; the
   Protocol ships none (`spec:consumers.review-perspectives`).
3. Compose the reading with the context bundle (recipe 36,
   `dist/recipes/36-the-context-bundle.js`) within a stated `budget`, with step 2's `selected` ids
   as its `members`. `budgetExceeded: true` is a refusal, never a partial bundle
   (`spec:consumers.context-bundle`): read in parts as the reading skill's
   `references/contract.md` teaches.
4. Return the findings as one change proposal, as `proposals.md` says.

Done: the proposal check sends nothing back.
