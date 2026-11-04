# Studio pages

Read this for the page that answers a task, or a page's path from an id. A page's recipe
(`dist/recipes/<NN>-<slug>.js`) re-runs its answer on today's graph.

| Task                                                | Page                            | Recipe                                                              |
| --------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------- |
| The corpus by Pack, with its findings               | `index.html`                    | 52, The capability map                                              |
| Epics and what each holds                           | `capabilities.html`             | 52, The capability map                                              |
| A Spec, entry or bound file by a word               | `search.html`                   | 23, Entry search                                                    |
| A Pack member by member                             | `packs/<name>.html`             | 29, Pack design                                                     |
| A Pack as one design                                | `slices/<name>.html`            | 54, The design slice                                                |
| One Spec: footing, impact, rule coverage            | `specs/<name>.html`             | 21, Dependency footing; 30, Design-change impact; 34, Rule coverage |
| What comes next                                     | `roadmap.html`                  | 53, The roadmap; 55, The roadmap memo                               |
| Waiting statements and owner questions              | `queue.html`                    | 46, The statement queue                                             |
| Open questions                                      | `questions.html`                | 20, Open-question register                                          |
| Decisions and what they decide                      | `decisions.html`                | 31, Decision register                                               |
| Pinned declarations and entry citations             | `declarations.html`             | 24, Pinned declarations; 51, Entry citations                        |
| Design backlog                                      | `backlog.html`                  | 33, The design backlog                                              |
| Designed against built components                   | `architecture.html`             | 17, Architecture map; 43, Planned against realized components       |
| How far verification reaches                        | `tests.html`                    | 44, Example-space coverage                                          |
| Runtime evidence; every source reads as not tracked | `evidence.html`                 | none                                                                |
| Changes since the base                              | `diff.html`, only with `--base` | 35, The design diff                                                 |
| CI results beside verifier bindings                 | `runs.html`, only with `--runs` | 45, Run evidence                                                    |
| A defined term                                      | `glossary.html`                 | none                                                                |

`<name>` is the id after its namespace, each capital written `_` plus its lowercase
(`spec:consumers.spec-studio.publisher#rule.pageSet`).

Each Pack page links its export, `exports/<name>.html`: one self-contained file, every disclosure
open (`spec:consumers.spec-studio.export`).
