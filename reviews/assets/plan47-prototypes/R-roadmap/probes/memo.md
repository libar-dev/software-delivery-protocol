## The next work, from the roadmap

Roadmap: The first probe roadmap `pack:probe-first`

Gamma first, though it rests on delta.

This Pack's order is reading order, not a stated priority.

### To design

| Place | Entry | Next | Why now |
| --- | --- | --- | --- |
| 3 | Alpha, a ready root `spec:probe.alpha` | `spec:probe.alpha.bare` `idea` → `scoped`, held by kind-evidence-present; `spec:probe.alpha.open` `scoped` → `defined`, held by no-blocking-open-questions; blocked by `spec:probe.alpha.open#question.openChoice` | State ready while its descendants are not. 1 of its parts ready to build now. |
| 4 | Epsilon, with a diamond `spec:probe.epsilon` | `spec:probe.epsilon.diamond` `defined` → `ready`, held by typed-dependency-targets-are-defined (`spec:probe.outside`) | Hold a descendant with a second parent. |

### To state

| Place | Entry | Earlier waiting statements | Why now |
| --- | --- | --- | --- |
| 1 | Gamma, first on the roadmap `spec:probe.gamma` | on the roadmap `spec:probe.delta` (place 2) | Rest on delta while it stands first. |
| 2 | Delta, second on the roadmap `spec:probe.delta` | No preceding waiting statement in the statement queue. | Stand second while gamma rests on it. Waited on by 1. |

### To build

No entry is ready to build.

### Waiting on the owner

- `spec:probe.gamma#question.gammaChoice`, place 1: Which gamma does the owner want?
- `spec:probe.alpha.open#question.openChoice` (blocking), place 3: Which way does the descendant go?
- State `spec:probe.delta`: it states `defined` and its floor allows `ready`; place 2
- State `spec:probe.epsilon`: it states `defined` and its floor allows `ready`; place 4
- State `spec:probe.gamma`: it states `defined` and its floor allows `ready`; place 1

### Questions without a decider

These questions have no named decider.

- `spec:probe.epsilon#question.epsilonOpen`, place 4
