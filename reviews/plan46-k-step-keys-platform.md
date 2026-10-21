# Step keys on the platform copy

The review-fix measurement used a fresh platform copy at `b038bd4`, whose manifest pins the
Protocol at `abf532d9a2a5da536d9235215f108d6aaa723ca2`. It installed lane K's tarball with the
review fixes. The measured suites bind through `bindExample` and each runs for the document
and stock fixtures:

- `tests/pure/domain-kernel.evaluate-twice.test.ts`
- `tests/pure/domain-kernel.incremental-then-rebuild.test.ts`

The original measurement changed only the shared vocabulary and `evaluate-twice`. Its selected
suite passed at each keyed stage, but the platform-wide typecheck failed. Keying the vocabulary
made the sibling's handler stale, and rewording it withheld the sibling's contract. The table
below reproduces those failures before adapting the sibling too. Each typecheck covers the whole
platform, including every authored suite. Every generation exited 0.

| Stage | Platform `tsc` | Suites run | Test result |
| --- | --- | --- | --- |
| Unkeyed baseline | 0 errors | Both | 4 passed |
| Key vocabulary and selected example; rename selected handler once | 2 errors, TS2353 and TS7006 in the sibling | Selected | 2 passed |
| Reword vocabulary and selected example; leave selected handler unchanged | 4 errors, TS2307 and TS2345 in the sibling | Selected | 2 passed |
| Key and reword sibling too; rename its handler once | 0 errors | Both | 4 passed |
| Reword vocabulary and both keyed examples again; handlers unchanged | 0 errors | Both | 4 passed |
| Remove keys; bind both handlers once to the current skeleton | 0 errors | Both | 4 passed |
| Reword vocabulary and both unkeyed examples; handlers unchanged | 4 errors, TS2353 and TS7006 in both suites | Both | 4 failed as expected |

The keyed rewording changes the vocabulary and every example that uses it, as
`spec:carrier.step-keys#rule.rewordedStaysBound` requires. The final failures report
`bindings[step.key] is not a function` at `Given a decider starting with an initial state`.
The selected-only rewording reports one `contracts/unmatched-vocabulary-step` warning for the
untouched sibling; after updating both siblings, generation reports no contract findings.

## Reproduce

Run from the Protocol lane worktree, using a fresh copy path. The dependency copy below reuses
the earlier measurement's installed packages; it is a separate directory, then the new tarball
is installed into it. With no earlier copy, install the platform's dependencies first.

```sh
git clone -q /Users/darkomijic/dev-libar/libar-platform/.git /tmp/k46-fix-platform
git -C /tmp/k46-fix-platform checkout -q b038bd4
npm run build
npm pack --ignore-scripts --pack-destination /tmp
cp /tmp/libar-dev-software-delivery-protocol-0.0.0.tgz /tmp/plan46-k-review-fixes.tgz
cp -R /tmp/k-platform/node_modules /tmp/k46-fix-platform/node_modules
npm --prefix /tmp/k46-fix-platform install --ignore-scripts /tmp/plan46-k-review-fixes.tgz
```

The following driver performs every source edit and runs generation, the full typecheck and the
selected suites at each stage. It writes their complete output and a result table under
`/tmp/plan46-k-platform-fix-results`. The final stage deliberately exits 1 from `tsc` and Vitest;
the driver retains those exit codes as measured results.

```sh
python3 - <<'PY'
from pathlib import Path
import json, re, subprocess
copy = Path('/tmp/k46-fix-platform')
logs = Path('/tmp/plan46-k-platform-fix-results')
logs.mkdir(exist_ok=True)
old = 'a decider whose stream starts from its initial state'
worded = 'a decider beginning with its initial state'
new = 'a decider initially holding its initial state'
carriers = ['domain-kernel', 'domain-kernel.evaluate-twice', 'domain-kernel.incremental-then-rebuild']
suites = ['tests/pure/domain-kernel.evaluate-twice.test.ts', 'tests/pure/domain-kernel.incremental-then-rebuild.test.ts']
results = []
def edit_carriers(names, before, after):
    for name in names:
        p = copy / f'design/specs/kernel/{name}.sdp.md'
        text = p.read_text()
        assert before in text, (name, before)
        p.write_text(text.replace(before, after))
def edit_handler(suite, before, after):
    p = copy / suite
    text = p.read_text()
    assert before in text, (suite, before)
    p.write_text(text.replace(before, after))
def run(stage, which):
    commands = {
      'build': ['npm', '--prefix', str(copy), 'run', 'sdp:build'],
      'tsc': [str(copy / 'node_modules/.bin/tsc'), '--noEmit', '--project', str(copy / 'tsconfig.json')],
      'tests': ['npm', '--prefix', str(copy), 'run', 'test:pure', '--', *which],
    }
    row = {'stage': stage}
    for name, cmd in commands.items():
        r = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
        (logs / f'{stage}-{name}.log').write_text(r.stdout)
        row[name] = r.returncode
        if name == 'tsc':
            row['tscErrors'] = len(re.findall(r'error TS\d+:', r.stdout))
        if name == 'tests':
            row['testsSummary'] = re.sub(r'\x1b\[[0-9;]*m', '', '\n'.join(l for l in r.stdout.splitlines() if 'Tests ' in l or 'Test Files ' in l))
    results.append(row)
    (logs / 'results.json').write_text(json.dumps(results, indent=2) + '\n')
    print(json.dumps(row), flush=True)
run('01-baseline', suites)
edit_carriers(carriers[:2], 'Given ' + old, 'Given [#initialState] ' + old)
edit_handler(suites[0], '"' + old + '":', 'initialState:')
run('02-keyed-selected-only', suites[:1])
edit_carriers(carriers[:2], old, worded)
run('03-reworded-selected-only', suites[:1])
edit_carriers(carriers[2:], 'Given ' + old, 'Given [#initialState] ' + worded)
edit_handler(suites[1], '"' + old + '":', 'initialState:')
run('04-keyed-both-siblings', suites)
edit_carriers(carriers, worded, new)
run('05-reworded-both-keyed', suites)
edit_carriers(carriers, '[#initialState] ', '')
for suite in suites:
    edit_handler(suite, 'initialState:', '"' + new + '":')
run('06-unkeyed-baseline', suites)
edit_carriers(carriers, new, 'a decider starting with an initial state')
run('07-reworded-both-unkeyed', suites)
PY
```
