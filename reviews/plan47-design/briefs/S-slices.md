# Lane S: design slices

Read `/tmp/plan47-briefs/common.md` first; it applies in full. Worktree: `/tmp/plan47-wt/S` on
branch `p47/s-slices`. Report step name: `design`.

## The question

The owner: "Gen 1 prepared architecturally significant views and architectural slices for
reviewing the design of upcoming features and feature Packs: features related so that we must
review them as a whole. A key strength for iterative development: rounds of design and refinement
with gradually increasing detail, within rational limits, since some decisions belong to
implementation."

What exists: a Pack is the review aggregate; Pack design (recipe 29) and the Studio's Pack page
read it member by member, with each member's stated next rung and the Pack's boundary;
perspectives (recipe 37) select and order members for one concern; the planning slice (recipe 19)
reads one Spec's neighborhood; design-change impact (recipe 30); the context bundle (recipe 36);
the statement queue (recipe 46); planned against realized components (recipe 43). What is missing
is a view of the slice as a whole: how its members depend on each other, which components they
touch, realized or planned, which decisions and open questions bound them, and what each member
needs for its next rung. The readiness floor sets the least a rung needs; how much is enough stays
guidance in the authoring skill ("How much to write"), because an "over-designed" check would
police content quality, which the Protocol refuses.

## Do

1. **Find gen 1's shape.** Read how Architect (`~/dev-libar/architect`) and the v0 design
   (`docs/lineage/`) prepared architecturally significant views and slices for design review:
   what a slice held, how it was chosen, what a reviewer saw. Evidence only.
2. **Decide what a slice is** in the Protocol's terms, with a reason: a Pack read whole, a Pack
   narrowed by a perspective, a Spec's neighborhood widened, or something else. No new grouping
   primitive, no stage, no gate.
3. **Design the reading** in `spec:consumers.design-slice`: the answer shape of recipe 54 as keyed
   Design entries, composing the existing recipes rather than restating them; the members'
   dependency structure inside the slice and across its boundary; the components the members'
   bindings touch and the planned components their component designs name; decisions and open
   questions in scope; each member's stated next rung and what holds it; and the design columns
   that show how much design each member carries, beside its rung and never as a score.
4. **Design the page** in `spec:consumers.spec-studio.slice-page`, or say why the Pack page should
   carry it instead. Lane G designs the drawings (a dependency drawing over a set of Specs, an
   architecture drawing scoped to the components a set touches); say what you need from it.
5. **Rounds and limits.** Propose, as exact text for the authoring skill and for
   `spec:consumers.authoring-on-ramp` if it needs a rule, the guidance for gradually increasing
   detail across design rounds: what each rung's design typically settles, what belongs to
   implementation and should stay out of a Spec, and how a reviewer reads the slice view to see
   both. No check enforces it.
6. **Prototype** the slice page on `pack:roadmaps-and-slices-v1` and `pack:spec-studio-v1` in the
   Protocol's corpus, and on `pack:history-view` and `pack:application` in the platform copy, with
   screenshots.
