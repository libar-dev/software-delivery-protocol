# Vault prototype measurements

Historical measurements transcribed from the prototype README at `76c2c8f58b73900209dfb6afa2b7652d3a4a344d`. No measurement was rerun at close.

## What it measured

Both runs read their corpus only; every file written lies under the scratch directory.

| Check | This repository at `dfeabee` plus this pass | libar-platform at `b038bd4` |
| --- | --- | --- |
| Files under `sdp/` | 721: 290 Spec notes, 339 code notes, 76 term notes, 7 Pack notes with 7 Bases, `specs.base`, `index.md` | 541: 243 Spec notes, 181 code notes, 103 term notes, 6 Pack notes with 6 Bases, `specs.base`, `index.md` |
| Two renders byte-identical | yes | yes |
| Paths distinct ignoring case | yes | yes |
| Links outside code that resolve | 4,820 of 4,820, 243 of them block links | 4,614 of 4,614, 125 of them block links |
| Properties other than `aliases` free of URL-like values | yes | yes |
| Bases inside the closed clause grammar | 8 of 8 | 7 of 7 |
| Build backlog, design backlog, nothing blocks, blocking questions, decisions: view equals source | 0, 21, 32, 8, 42, all equal | 0, 80, 221, 10, 22, all equal |
| Each Pack's Base selects its members | 7 of 7 | 6 of 6 |
| Regenerating one graph writes nothing and keeps modification times | yes | yes |
| A Spec that left the graph loses its note; an intent note and `.obsidian/` survive | yes | yes |
| A note a person wrote under `sdp/` refuses the run, which writes nothing | yes | yes |
| A generated note a person changed refuses the run and keeps the edit | yes | yes |

A render and synchronization of the platform's vault took about one second; a second run over the
same graph wrote no file.
