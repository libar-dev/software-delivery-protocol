const commands = {
  build: {
    name: "build",
    usage: "  sdp build [root] [--exclude PATH]... [--check-clean] [--imports PATH]",
    paragraph: `Extract every *.sdp.ts, *.sdp.md, and *.sdp.gherkin under root (default: cwd), plus
             the anchors, in the constant form or comment form, in the other *.ts/*.tsx
             source files, into <root>/generated/graph.json — then derive the
             executable contracts (per-example step contracts + per-parent space contracts)
             into <root>/generated/contracts/. Exits 1 and writes nothing on
             any hard error — the emitted artifacts are all-or-nothing. --check-clean
             additionally runs a second independent extraction + generation and fails on any
             byte divergence (the determinism self-check). Repeat --exclude PATH to omit exact
             root-relative POSIX path prefixes from both extraction surfaces. --imports PATH
             reads a TypeScript adapter configuration and writes generated/imports.json as
             external inferred input for curation, apart from the curated graph.`,
  },
  validate: {
    name: "validate",
    usage:
      "  sdp validate [root] [--exclude PATH]... [--check-clean | --watch] [--rules PATH [--params FORM]...]...",
    paragraph: `build, then run the conformance + honesty checks over the one graph (one
             validation path). A check error exits 1; warnings inform and do not fail the run.
             graph.json is still written when the checks fail — the graph is the faithful
             projection; check errors describe the repo's conformance, not the artifact.
             --watch re-runs the same validate path on carrier create/change/delete/rename
             and stays alive after findings; operator stop (SIGINT) exits 0. --watch cannot
             be combined with --check-clean. --rules PATH runs an operator-selected JavaScript
             async body with g, graph, report, params and recipes after the Protocol checks. Repeat --rules;
             each --params belongs to the preceding file, with the q grammar: JSON, @PATH or
             KEY=@PATH. Each file receives its own copies. Corpus findings print separately;
             any corpus error or failed file exits 1. --watch rereads rules and parameter files each cycle;
             edits to either start a cycle wherever they live. --rules combines with --check-clean.`,
  },
  view: {
    name: "view",
    usage: "  sdp view [root] [--exclude PATH]... [--check-clean]",
    paragraph: `validate, then generate the Design Review — the contextual read-only human view —
             into <root>/generated/design-review/ (rewritten wholesale). Findings remain data;
             exit code follows validate. --check-clean independently re-renders.`,
  },
  census: {
    name: "census",
    usage: "  sdp census [root] [--exclude PATH]... [--check-clean]",
    paragraph: `validate, then generate the taxonomy census into <root>/generated/census/ as a
             separate wholesale tmp-to-rename projection. --check-clean independently re-renders
             and refuses when the published page differs from the current projection.`,
  },
  mermaid: {
    name: "mermaid",
    usage: "  sdp mermaid [root] [--exclude PATH]... [--check-clean]",
    paragraph: `validate, then generate Mermaid diagrams into <root>/generated/mermaid/ as a
             separate wholesale tmp-to-rename projection. --check-clean independently re-renders
             and refuses when the published bytes differ from the current projection.`,
  },
  gherkin: {
    name: "gherkin",
    usage: "  sdp gherkin [root] [--exclude PATH]... [--check-clean]",
    paragraph: `validate, then generate a Gherkin-shaped READ projection of every Spec into
             <root>/generated/gherkin/ as a separate wholesale tmp-to-rename projection. The
             pages are disposable and never use .sdp.gherkin. --check-clean independently
             re-renders and refuses when the published bytes differ from the current projection.`,
  },
  studio: {
    name: "studio",
    usage: "  sdp studio [root] [--exclude PATH]... [--check-clean]",
    paragraph: `validate, then publish static Studio pages into <root>/generated/spec-studio/.
             Findings remain visible; exit code follows validate. --check-clean independently
             re-renders and refuses missing or drifted output. Pages open through file://.`,
  },
  generate: {
    name: "generate",
    usage: "  sdp generate [root] [--exclude PATH]... [--vault DIR] [--check-clean]",
    paragraph: `Validate once, then publish the Design Review, census, Mermaid diagrams, Gherkin-shaped
             view and Studio from that graph. --check-clean applies each publisher's checks,
             removing only roots that fail. --vault DIR is parsed for the vault publisher;
             synchronization is pending that publisher. --check-clean leaves the vault alone.`,
  },
  import: {
    name: "import",
    usage: "  sdp import <path...> [--dry-run]",
    paragraph: `Convert one or more *.sdp.ts files or recursively scanned roots to write-beside
             *.sdp.md documents. The TypeScript source is never deleted. --dry-run writes
             each would-be document to stdout, headed by its target path, without writing.
             Existing Markdown siblings and non-emitting carrier refusals are rendered as
             findings and never throw or overwrite. Exits 0 only when every requested source
             emits (or would emit); any finding error or operational failure exits 1. Publication
             creates atomic hard links; the target filesystem must support them (FAT/exFAT and
             some network mounts do not).`,
  },
  new: {
    name: "new spec",
    usage: "  sdp new spec PATH --id ID --kind KIND --altitude ALT --title TITLE --outcome OUTCOME",
    paragraph: `Scaffold an honest idea-rung Markdown Spec at a cwd-relative .sdp.md PATH. Always
             emits readiness: idea and relations: {}; never overwrites; never invents typed
             content. constraint emits envelope, title, and Intent only, with no twin section.`,
  },
  q: {
    name: "q",
    usage:
      "  sdp q ['<body>'] [--root PATH] [--exclude PATH]... [--params JSON | --params @PATH | --params KEY=@PATH]... [--json]",
    paragraph: `The agent front door: derive the graph under --root (default: cwd) in process, then
             evaluate the supplied body and print what it returns. The body is the single
             positional argument, or stdin when stdin is not a terminal; with neither, q refuses
             with a usage note and exits 1 rather than waiting. It is a plain JavaScript async function
             body — no import/export, no TypeScript-only syntax — and \`return\` is the output
             contract. Five bindings are injected: \`g\`, the reader over the derived graph (the
             same createReader the package exports); \`graph\`, the raw graph schema object;
             \`report\`, the validation report, so findings are queryable data rather than a
             gate — checks never gate the read path; \`params\`, the JSON object --params
             supplies, or {} without it; and \`recipes(number, parameters?)\`, which runs a shipped
             body over the same graph and report. Repeat --params with JSON objects, @PATH for a file
             holding one, or KEY=@PATH for any JSON value under a lower-camel key. Objects merge
             at the top level; a repeated key, invalid JSON or an unreadable file refuses before
             the body runs. A recipe reads its parameter from \`params\` and falls back to the
             catalog's sample. The graph is derived on every invocation, so a
             just-authored Spec is queryable immediately and no committed artifact answers in the
             graph's name; nothing is written anywhere. Output is bounded util.inspect (depth 4);
             --json prints JSON.stringify instead, unbounded. A body that throws exits 1, as does a
             graph that fails to derive.`,
  },
} as const;

const scaffoldParagraph = `PATH is cwd-relative and must end
in .sdp.md; parent directories are created as needed. The file is never
overwritten. Readiness is always idea; relations are always empty. The kind's
typed section is a bare heading with no invented content. constraint emits
envelope, title, and Intent only, with no twin section.`;

/** A verb and the help index compose the same usage and description. */
export function verbHelpText(command: string): string | undefined {
  if (!Object.hasOwn(commands, command)) return undefined;
  const entry = commands[command as keyof typeof commands];
  return `Usage:\n${entry.usage}\n\n             ${entry.paragraph}${command === "new" ? `\n\n${scaffoldParagraph}` : ""}`;
}

export const NEW_SPEC_HELP_TEXT = verbHelpText("new") ?? "";

/**
 * @sdpAnchor impl:protocol.adopter-help
 * @sdpLabel SDP_HELP_TEXT indexes the shipped skills, recipe catalog, schema, walkthrough, glossary and specs/ by package-relative path
 * @sdpSatisfies spec:consumers.adopter-on-ramp
 * @sdpReferences spec:consumers.command-line
 * @sdpComponent component:protocol.cli
 * @sdpRole service
 */
export const SDP_HELP_TEXT =
  `sdp — Libar Software Delivery Protocol
Usage:
  sdp --help
  sdp --version
` +
  Object.values(commands)
    .map((entry) => entry.usage)
    .join("\n") +
  `

Options:
  --version  Print one line, sdp <package version> (<commit>), and exit 0. The commit is the full
             hash the build recorded beside the compiled CLI, or unknown; the CLI never runs git,
             and neither value enters the graph or any projection.

Commands:
` +
  Object.values(commands)
    .map((entry) => `  ${entry.name.padEnd(11)}${entry.paragraph}`)
    .join("\n") +
  `

Agent skills and reference:
  Shipped in the package. Paths are relative to the package directory PKG, which is
  node_modules/@libar-dev/software-delivery-protocol in an adopter and the repository root in a
  source checkout.
  .agents/skills/sdp-agent-surface/SKILL.md   the skill for reading the graph through q
  .agents/skills/sdp-authoring/SKILL.md       the skill for authoring Specs, Packs, and anchors
  .agents/skills/sdp-sessions/SKILL.md        the skill for routing a delivery session
  docs/agent-surface/recipes.md               the recipe catalog: runnable q bodies
  dist/recipes/NN-slug.js                     each catalog body as a file, run as shipped with
                                              sdp q "$(cat PKG/dist/recipes/NN-slug.js)"
  schemas/sdp-proposal-1.schema.json          the JSON Schema for a change proposal
  docs/agent-surface/upgrade-guide.md         the capability upgrade guide
  docs/agent-surface/architecture.md          the architecture walkthrough
  CONTEXT.md                                  the Protocol's glossary, which the skills and
                                              recipes use
  specs/                                      the Protocol's own Specs and Packs, which the skills
                                              and recipes cite by id
  Read a cited Protocol Spec: sdp q 'return g.specContext("spec:model.anchors")' --root PKG/specs
  That graph holds intent only. The package ships no source anchors, so its delivery facts are
  empty and its gap and verifier-linkage warnings are not evidence about what the Protocol has
  realized.`;
