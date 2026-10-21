# Step keys on the platform copy

The acceptance used `spec:kernel.domain-kernel.evaluate-twice`, whose authored suite binds
through `bindExample` and runs once for each of the document and stock fixtures. All writes
were under `/tmp/k-platform`. The platform checkout was `b038bd4`, whose package manifest pins
the Protocol at `abf532d9a2a5da536d9235215f108d6aaa723ca2`. The copy installed a tarball built
from lane K before running these checks.

| Case | Handler key | Result |
| --- | --- | --- |
| Marker added to the shared vocabulary and the example | `initialState` | 2 tests passed |
| Both step texts reworded, the handler map unchanged | `initialState` | 2 tests passed |
| Marker removed, handler bound once to the current skeleton | `a decider beginning with its initial state` | 2 tests passed |
| Both unkeyed step texts reworded again, the handler map unchanged | Previous skeleton | 2 tests failed at the reworded Given step |

The expected failure was `bindings[step.key] is not a function`. Its diagnostic named the
current step, `Given a decider initially holding its initial state`. Every generation exited 0 with no errors. The keyed baseline had no warnings. Each later
build reported one `contracts/unmatched-vocabulary-step` warning for the untouched sibling,
`spec:kernel.domain-kernel.incremental-then-rebuild`, whose old Given text no longer matched the
reworded vocabulary. Only the selected example's suite was run. Other suites sharing the vocabulary need their own one-time handler-key update
when an adopter chooses to key that vocabulary step.

## Reproduce

Run these commands from the Protocol lane worktree. Use a fresh copy path if `/tmp/k-platform`
already exists.

```sh
git clone -q /Users/darkomijic/dev-libar/libar-platform/.git /tmp/k-platform
git -C /tmp/k-platform checkout -q b038bd4
npm pack --pack-destination /tmp
npm --prefix /tmp/k-platform install --ignore-scripts /tmp/libar-dev-software-delivery-protocol-0.0.0.tgz
```

Key the first Given step in the vocabulary and the selected example, and rename the handler once:

```sh
python3 - <<'PY'
from pathlib import Path
copy = Path('/tmp/k-platform')
old = 'a decider whose stream starts from its initial state'
for name in ['domain-kernel', 'domain-kernel.evaluate-twice']:
    p = copy / f'design/specs/kernel/{name}.sdp.md'
    p.write_text(p.read_text().replace('Given ' + old, 'Given [#initialState] ' + old))
p = copy / 'tests/pure/domain-kernel.evaluate-twice.test.ts'
p.write_text(p.read_text().replace('"' + old + '":', 'initialState:'))
PY
npm --prefix /tmp/k-platform run sdp:build
npm --prefix /tmp/k-platform run test:pure -- tests/pure/domain-kernel.evaluate-twice.test.ts
```

Reword the step in both carriers. The suite stays unchanged and both tests pass:

```sh
python3 - <<'PY'
from pathlib import Path
for name in ['domain-kernel', 'domain-kernel.evaluate-twice']:
    p = Path('/tmp/k-platform/design/specs/kernel') / (name + '.sdp.md')
    p.write_text(p.read_text().replace(
        'a decider whose stream starts from its initial state',
        'a decider beginning with its initial state'))
PY
npm --prefix /tmp/k-platform run sdp:build
npm --prefix /tmp/k-platform run test:pure -- tests/pure/domain-kernel.evaluate-twice.test.ts
```

Remove the marker and bind the handler once to the current skeleton. This baseline passes:

```sh
python3 - <<'PY'
from pathlib import Path
for name in ['domain-kernel', 'domain-kernel.evaluate-twice']:
    p = Path('/tmp/k-platform/design/specs/kernel') / (name + '.sdp.md')
    p.write_text(p.read_text().replace('[#initialState] ', ''))
p = Path('/tmp/k-platform/tests/pure/domain-kernel.evaluate-twice.test.ts')
p.write_text(p.read_text().replace('initialState:',
    '"a decider beginning with its initial state":'))
PY
npm --prefix /tmp/k-platform run sdp:build
npm --prefix /tmp/k-platform run test:pure -- tests/pure/domain-kernel.evaluate-twice.test.ts
```

Reword the unkeyed step without changing the suite. The last command exits 1 with two failures:

```sh
python3 - <<'PY'
from pathlib import Path
for name in ['domain-kernel', 'domain-kernel.evaluate-twice']:
    p = Path('/tmp/k-platform/design/specs/kernel') / (name + '.sdp.md')
    p.write_text(p.read_text().replace(
        'a decider beginning with its initial state',
        'a decider initially holding its initial state'))
PY
npm --prefix /tmp/k-platform run sdp:build
npm --prefix /tmp/k-platform run test:pure -- tests/pure/domain-kernel.evaluate-twice.test.ts
```
