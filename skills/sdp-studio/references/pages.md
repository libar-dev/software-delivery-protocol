# Studio pages

Read this for the page that answers a task, or a page's path from an id. A page's recipe
(`dist/recipes/<NN>-<slug>.js`) re-runs its answer on today's graph.

<!-- prettier-ignore -->
| Task | Page | Recipe |
|-|-|-|
| The corpus by Pack, with its findings | `index.html` | 52 |
| Epics and what each holds | `capabilities.html` | 52 |
| A Spec, entry or bound file by a word | `search.html` | 23 |
| A Pack member by member | `packs/<name>.html` | 29 |
| A Pack as one design | `slices/<name>.html` | 54 |
| One Spec: footing, impact, rule coverage | `specs/<name>.html` | 21, 30, 34 |
| What comes next | `roadmap.html` | 53, 55 |
| Waiting statements and owner questions | `queue.html` | 46 |
| Open questions, decisions, declarations, design backlog | `questions.html`, `decisions.html`, `declarations.html`, `backlog.html` | 20, 31, 24, 33 |
| Designed against built components | `architecture.html` | 17, 43 |
| How far verification reaches | `tests.html` | 44 |
| Runtime evidence; every source reads as not tracked | `evidence.html` | none |
| Changes since the base | `diff.html`, only with `--base` | 35 |
| CI results beside verifier bindings | `runs.html`, only with `--runs` | 45 |
| A defined term | `glossary.html` | none |

`<name>` is the id after its namespace, each capital written `_` plus its lowercase
(`spec:consumers.spec-studio.publisher#rule.pageSet`).

Each Pack page links its export, `exports/<name>.html`: one self-contained file, every disclosure
open (`spec:consumers.spec-studio.export`).
