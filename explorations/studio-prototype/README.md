# explorations/studio-prototype: the Studio's Pack page on real data

> **Exploration record, illustrative, nothing ratified.** A hand-written prototype of the Spec
> Studio's Pack page (`spec:consumers.spec-studio.pack-page`), made in the Studio's design pass so
> the owner and reviewers can react to the page before its templates are fixed. Never promote this
> code into the product: the product renders the same markup at build time.

## Open it

Open either page straight from the file system; nothing is fetched and nothing is built.

- `design-management-v1.html`: `pack:design-management-v1` from this repository, which has members
  held below their next rung.
- `history-view.html`: `pack:history-view` from the first adopter, libar-platform at `d310eb1`,
  the Pack its five reader tasks are set on.

Try a member's fragment, such as `history-view.html#spec:application.history-projection`: the card
opens. `Open all` and `Close all` act on every card and section. Narrow the window below 720 pixels
for the phone layout, where the rail follows the content.

## What it is

- `studio.css`: the shell, rung badges, cards and the phone layout, in light and dark.
- `studio.js`: one classic script in two halves. The template turns the data into markup, standing
  in for the build's page template. The elements, `sdp-expander` and `sdp-copy`, enhance that
  markup as `spec:consumers.spec-studio.page-elements` designs them.
- `data/<pack>.recipe-29.json`: recipe 29's answer with `detail: true`.
- `data/<pack>.pack-context.json`: the reader's Pack context, for what recipe 29 leaves out: the
  framing, the question fields, unit labels, verifier gaps and findings.
- `data/<pack>.js`: both answers in one classic script, because a page opened through `file://`
  cannot fetch a JSON file.

Regenerate the data from this repository's root, after `npm run build`, with `PLATFORM` set to a
clone of libar-platform:

```sh
D=explorations/studio-prototype/data
pnpm --silent sdp:q "$(cat dist/recipes/29-pack-design.js)" --params '{"pack":"pack:design-management-v1","detail":true}' --json > $D/design-management-v1.recipe-29.json
pnpm --silent sdp:q 'return g.packContext(params.pack)' --params '{"pack":"pack:design-management-v1"}' --json > $D/design-management-v1.pack-context.json
node dist/cli/sdp.js q "$(cat dist/recipes/29-pack-design.js)" --root "$PLATFORM" --params '{"pack":"pack:history-view","detail":true}' --json > $D/history-view.recipe-29.json
node dist/cli/sdp.js q 'return g.packContext(params.pack)' --root "$PLATFORM" --params '{"pack":"pack:history-view"}' --json > $D/history-view.pack-context.json
for name in design-management-v1 history-view; do
  printf 'window.SDP_PROTOTYPE = {\n"design": %s,\n"context": %s\n};\n' "$(cat $D/$name.recipe-29.json)" "$(cat $D/$name.pack-context.json)" > $D/$name.js
done
```

## Where it differs from the product

- The script renders the page; the product's build writes the markup, and the page reads without
  its script.
- Only the Pack page exists, so links to the index, search and Spec pages do not open.
- The rail lists the Pack's members and its findings; it leaves out the members that own an example
  space, which neither input carries.
- The findings count is the Pack's, where the product's rail counts the whole validation report.

## What the design pass took from it

- Recipe 29's answer alone cannot carry the page: it drops the framing, the question fields, unit
  labels, verifier gaps and findings. The data Spec renders a Pack page from the Pack context and
  recipe 29's totals instead.
- A browser refuses a module script on a page opened through `file://`, so the elements ship as one
  classic script (`spec:consumers.spec-studio.page-elements#rule.oneScript`).
- Native disclosure elements give the cards their collapse without a script; the one element the
  cards need is the one that opens the card a fragment targets.
- A phone rail that starts closed needs a script, so the rail follows the content on a phone
  instead.
- Desktop Chrome will not open a window narrower than about 500 pixels, so a phone layout is checked
  with a headless shell such as the one Playwright caches.
- Questions the owner may want to react to: the full question address inside its own member's card
  is long, and a short `question.<key>` would read faster; the summary states counts as sentences
  rather than a table.

## The two associations the reader tasks need

The first adopter's five reader tasks need two associations its graph does not hold. Both are
adopter authoring, applied when the adopter re-pins; on a copy of the platform at `d310eb1`, with
this branch's engine, validate stays at 0 errors and 12 warnings, and the summary line moves from
180 anchors, 429 nodes and 1,499 edges to 181, 430 and 1,510.

1. **OD-157 in the question it registers.** Add the register id to the citation list that closes
   the text of `spec:application.history-rebuild#question.verifyPassUnderPause`, as other questions
   cite `OD-075`: `… is the owner's (D9, Sc L2-6, OD-157)`. `findByConcept("OD-157")` and entry
   search (recipe 23) then find the question, with its address and line.
2. **A test anchor on the type-comparison suite.** At the top of `tests/types/pinned.test-d.ts`,
   bind the suite to every Spec whose pinned declarations it compares, in the form
   `tests/types/hosted-record.test-d.ts` already uses:

   ```ts
   import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";

   // Binds this suite to the Specs whose pinned declarations it compares with the code.
   const anchor = specTest({
     id: testAnchorId("test:history-view.pinned-declarations"),
     label: "compares pack:history-view's pinned declarations with the code",
     verifies: [
       ref("spec:application.history-projection"),
       ref("spec:application.projection-contract"),
       ref("spec:application.read-models"),
       ref("spec:application.rebuild"),
       ref("spec:application.write-pause"),
       ref("spec:application.generation-registry"),
       ref("spec:command.command-declaration"),
       ref("spec:command.command-pipeline"),
       ref("spec:context.event-envelope"),
       ref("spec:context.journal"),
       ref("spec:context.queries"),
     ],
   });
   void anchor;
   ```

   `spec:application.history-projection` then carries `has-verifier`, its Spec context lists the
   suite with its file and line, and `byFile` on the suite names all eleven Specs.
   The adopter's `design/README.md` states the validate summary line, which moves with the anchor.
