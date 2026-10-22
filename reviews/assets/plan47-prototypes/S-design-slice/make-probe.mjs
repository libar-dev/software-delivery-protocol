// Builds the slice probe: a throwaway copy of the platform corpus with five member component designs
// and two example members added, so the slice page shows the cases neither real corpus holds yet.
// Throwaway evidence, never product code. It never edits the platform copy it reads.
//
//   node make-probe.mjs [source] [target]     # defaults: /tmp/plan47-platform -> /tmp/plan47-platform-S
//
// The probe Pack, pack:slice-probe, holds:
//   - a design whose component no anchor holds (absent);
//   - a design whose component is anchored and does not satisfy it;
//   - a design its anchor satisfies, with every declared value matching;
//   - a design its anchor satisfies, with a differing layer and differing uses;
//   - a design its anchor satisfies, with an unreadable layer;
//   - an example stated scoped with a blocking question, under a parent nothing holds (it folds);
//   - an example that also depends on an outside Spec its parent does not name (it does not fold).

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const source = process.argv[2] ?? "/tmp/plan47-platform";
const target = process.argv[3] ?? "/tmp/plan47-platform-S";
if (!existsSync(join(source, "design/specs"))) throw new Error(`No corpus at ${source}`);
rmSync(target, { recursive: true, force: true });
cpSync(source, target, { recursive: true, filter: (path) => !path.includes("/node_modules") && !path.includes("/generated") });

// The tag prefix is assembled so this file holds no tag the extractor would read.
const tag = (name) => `@${"sdp"}${name}`;
const addAfterAnchor = (file, anchorId, line) => {
  const path = join(target, file);
  const text = readFileSync(path, "utf8");
  const marker = ` * ${tag("Anchor")} ${anchorId}\n`;
  if (!text.includes(marker)) throw new Error(`No anchor ${anchorId} in ${file}`);
  writeFileSync(path, text.replace(marker, `${marker} * ${line}\n`));
};
const replaceLine = (file, before, after) => {
  const path = join(target, file);
  const text = readFileSync(path, "utf8");
  if (!text.includes(before)) throw new Error(`No line ${before} in ${file}`);
  writeFileSync(path, text.replace(before, after));
};

addAfterAnchor("src/read-model/index.ts", "component:platform.read-model", `${tag("Satisfies")} spec:probe.read-model-design`);
replaceLine("src/gate/index.ts", ` * ${tag("Satisfies")} spec:application.write-pause\n`, ` * ${tag("Satisfies")} spec:application.write-pause, spec:probe.gate-design\n`);
addAfterAnchor("src/operations/index.ts", "component:platform.operations", `${tag("Satisfies")} spec:probe.operations-design`);

const spec = (id, kind, readiness, relations, title, body) => {
  const relationLines = Object.entries(relations).flatMap(([type, list]) => [`  ${type}:`, ...list.map((item) => `    - ${item}`)]);
  return ["---", `id: ${id}`, `kind: ${kind}`, "altitude: story", `readiness: ${readiness}`, ...(relationLines.length ? ["relations:", ...relationLines] : []), "---", `# ${title}`, "", body, ""].join("\n");
};
const design = (component, values) => ["## Design", "", `- id: \`${component}\``, ...Object.entries(values).map(([key, value]) => `- ${key}: \`${value}\``)].join("\n");
const intent = (outcome) => `## Intent\n\n- actor: An engineer of the platform.\n- problem: The component is named before its design settles.\n- outcome: ${outcome}\n`;
const rule = (key, text) => `## Behavior\n\n- rule: [#${key}] ${text}\n`;

const files = {
  "history-library.sdp.md": spec("spec:probe.history-library", "behavior", "scoped",
    { dependsOn: ["spec:application.history-rebuild", "spec:application.read-models"] },
    "The history library a later build adds",
    [intent("Name the component the history rebuild will live in before any code holds it."), rule("ownsRebuild", "The history library owns the paused rebuild of a history view."),
      design("component:platform.history", { layer: "application", context: "platform", uses: "component:platform.read-model, component:platform.gate, component:platform.journal" })].join("\n")),
  "audit-design.sdp.md": spec("spec:probe.audit-design", "behavior", "scoped",
    { dependsOn: ["spec:application.write-pause"] },
    "The audit library records gate changes",
    [intent("Design the audit library the gate writes to, whose anchor does not satisfy this design."), rule("recordsGate", "Every gate change writes one operator audit record."),
      design("component:platform.audit", { layer: "infrastructure", context: "platform" })].join("\n")),
  "read-model-design.sdp.md": spec("spec:probe.read-model-design", "behavior", "scoped",
    { dependsOn: ["spec:application.read-models"] },
    "The read-model library as designed",
    [intent("Design the read-model library its anchor now satisfies, every declared value matching."), rule("declaresViews", "The read-model library declares, rebuilds, writes and reads every read model."),
      design("component:platform.read-model", { layer: "application", context: "platform", uses: "component:platform.kernel, component:platform.context, component:platform.command, component:platform.gate" })].join("\n")),
  "gate-design.sdp.md": spec("spec:probe.gate-design", "behavior", "scoped",
    { dependsOn: ["spec:application.write-pause"] },
    "The maintenance gate as designed",
    [intent("Design the maintenance gate its anchor satisfies, with a layer and uses the code does not match."), rule("checksWriters", "Every writer checks the gate before it writes."),
      design("component:platform.gate", { layer: "application", context: "platform", uses: "component:platform.command, component:platform.context" })].join("\n")),
  "operations-design.sdp.md": spec("spec:probe.operations-design", "behavior", "scoped",
    { dependsOn: ["spec:command.command-pipeline"] },
    "The operations library as designed",
    [intent("Design the operations library its anchor satisfies, with a layer outside the five layers."), rule("recordsDiagnostics", "Every command writes one diagnostic record beside its outcome."),
      design("component:platform.operations", { layer: "middleware", context: "platform" })].join("\n")),
  "read-models-held-example.sdp.md": spec("spec:probe.read-models-held-example", "example", "scoped",
    { refines: ["spec:application.read-models"] },
    "A read model rebuilt while a writer waits",
    ["## Intent", "", "- outcome: A writer that meets a paused read model waits rather than fails.", "", "### Open questions", "",
      "- [blocking #waitBound] How long does a writer wait before the command is refused?", "  - decider: owner", "",
      "```gwt", "Given a read model whose generation is {state: \"building\"}", "When a command writes to it", "Then the writer {outcome: \"waits\"}", "```"].join("\n")),
  "write-pause-extra-dependency.sdp.md": spec("spec:probe.write-pause-extra-dependency", "example", "scoped",
    { refines: ["spec:application.write-pause"], dependsOn: ["spec:context.journal"] },
    "A paused scope replays the journal on resume",
    ["## Intent", "", "- outcome: A scope resumed after a pause replays the events the journal holds for it.", "",
      "```gwt", "Given a scope {state: \"paused\"} with {events: 3} events journaled", "When the scope resumes", "Then the {events: 3} events replay in journal order", "```"].join("\n")),
};
mkdirSync(join(target, "design/specs/probe"), { recursive: true });
for (const [name, text] of Object.entries(files)) writeFileSync(join(target, "design/specs/probe", name), text);

writeFileSync(join(target, "design/specs/slice-probe.pack.sdp.md"), [
  "---",
  "id: pack:slice-probe",
  "specs:",
  ...[
    "spec:decisions.d09-rebuild-online-by-default",
    "spec:application.read-models",
    "spec:probe.read-models-held-example",
    "spec:application.write-pause",
    "spec:probe.write-pause-extra-dependency",
    "spec:application.rebuild",
    "spec:application.history-rebuild",
    "spec:probe.history-library",
    "spec:probe.read-model-design",
    "spec:probe.gate-design",
    "spec:probe.audit-design",
    "spec:probe.operations-design",
  ].map((id) => `  - ${id}`),
  "---",
  "# Slice probe",
  "",
  "A probe Pack in a throwaway copy of the platform corpus. It holds a few history-view members, five member component designs, one for each way a design meets its code, and two example members, one that folds into its parent and one that does not.",
  "",
].join("\n"));
process.stdout.write(`Probe written to ${target}\n`);
