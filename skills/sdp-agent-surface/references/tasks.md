# Which recipe answers a task

| The task                                                       | Run                                                                                                        |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Pick work to build                                             | the build backlog (recipe 1); the design backlog (recipe 33) for designed, unbuilt Specs                   |
| Find code ahead of intent                                      | the drift alarm (recipe 2)                                                                                 |
| Read what a Spec guarantees and who verifies it                | Spec guarantees (recipe 3)                                                                                 |
| Review a changeset                                             | changed-file impact (recipe 4), then the mention audit (recipe 22) over its scope                          |
| Locate a term or a concept                                     | concept search (recipe 6); entry search (recipe 23) for the entry and its line                             |
| Check a Spec's stated next rung before a readiness edit        | promotion preflight (recipe 9); the lower ladder (recipe 11) across the corpus                             |
| Compare stated readiness with the floor                        | readiness divergence (recipe 7)                                                                            |
| Read warnings, gaps and verifier health                        | orphans and gaps (recipe 8); declared versus enabled verifiers (recipe 10)                                 |
| Review a Pack                                                  | the Pack review backbone (recipe 5), Pack design (recipe 29), references into a design (recipe 27)         |
| Read a Pack or a set of Specs as one design                    | the design slice (recipe 54)                                                                               |
| List open questions                                            | the open-question register (recipe 20)                                                                     |
| See what a Spec rests on                                       | dependency footing (recipe 21); dependency cycles (recipe 26)                                              |
| Change a Spec others rest on                                   | design-change impact (recipe 30); the planning slice (recipe 19)                                           |
| Check addresses written outside the Specs                      | address resolution (recipe 25)                                                                             |
| List the signatures two parties share                          | pinned declarations (recipe 24)                                                                            |
| Read a component and its reach                                 | component membership (recipe 12), uses fan-in and fan-out (recipe 13), structural neighborhood (recipe 14) |
| Measure structural and projection coverage                     | census structural coverage (recipe 15), the projection-coverage upper bound (recipe 16)                    |
| Read the architecture                                          | the architecture map (recipe 17), architecture crossings (recipe 32)                                       |
| Check a corpus's architecture rules                            | the architecture walk (recipe 42)                                                                          |
| Compare planned components with their realization              | planned against realized components (recipe 43)                                                            |
| Weigh the decisions that shape it                              | the decision map (recipe 18), the decision register (recipe 31)                                            |
| Reuse an architecture value                                    | roles, layers and contexts (recipe 28)                                                                     |
| Find keyed rules no example exercises                          | rule coverage (recipe 34)                                                                                  |
| Find example-space values no example binds                     | example-space coverage (recipe 44)                                                                         |
| Read external CI results beside verifier bindings              | run evidence (recipe 45)                                                                                   |
| See what changed since a design pass                           | the design diff (recipe 35)                                                                                |
| Compose a design pass's reading                                | the context bundle (recipe 36), the perspective filter (recipe 37)                                         |
| Apply a change proposal                                        | the proposal check (recipe 38)                                                                             |
| Render a change proposal as the memo a person reviews          | the proposal memo (recipe 49)                                                                              |
| Slim a Spec its bound code now carries                         | slimming candidates (recipe 39)                                                                            |
| Find files and components the anchors miss                     | the curation report (recipe 40)                                                                            |
| List a family of keyed values (limits, error messages, tables) | the key-family register (recipe 41)                                                                        |
| Order waiting readiness statements and owner questions         | the statement queue (recipe 46)                                                                            |
| Measure capabilities in use and where they could apply         | capability adoption (recipe 47)                                                                            |
| Propose rule keys for review                                   | the rule-key proposal (recipe 48), then the proposal check (recipe 38)                                     |
| Check prose tokens against an outside register                 | external registers (recipe 50)                                                                             |
| Find source and test lines citing an entry                     | entry citations (recipe 51)                                                                                |
| Read epic scopes and direct binding evidence                   | the capability map (recipe 52)                                                                             |
| Read upcoming work in the owner's order                        | the roadmap (recipe 53)                                                                                    |
| Render a description's forward section                         | the roadmap memo (recipe 55)                                                                               |

Choose a recipe from the task sheet, then read its numbered catalog entry for parameters,
defaults, diagnostics and answer fields. Run the shipped body unchanged, or call
`recipes(number, parameters)` to compose its answer. The catalog owns recipe contracts; carrying
Specs own law. Inspect diagnostic and omission fields before interpreting an empty result.

Reach for the files only when you need the authored prose itself — the exact words to edit.
