import type { VaultFile } from "./sync.js";
import { noteName, notePath } from "./text.js";

const next = ["!statedNextRung.isEmpty()", "statedNextRungFailures.isEmpty()"];
export const standingViews = [
  { name: "All Specs", clauses: [] },
  {
    name: "Build backlog",
    clauses: [
      'statedReadiness == "ready"',
      'specKind != "example"',
      'specKind != "decision"',
      "implementationBinding == false",
    ],
  },
  {
    name: "Design backlog",
    clauses: [
      'statedReadiness == "defined"',
      'specKind != "example"',
      'specKind != "decision"',
      "implementationBinding == false",
    ],
  },
  { name: "Nothing blocks the next rung", clauses: next },
  { name: "Blocking questions", clauses: ["blockingQuestions > 0"] },
  { name: "Decisions", clauses: ['specKind == "decision"'] },
] as const;
const columns = {
  title: "Title",
  specKind: "Kind",
  statedReadiness: "Stated",
  derivedReadiness: "Floor reached",
  statedNextRung: "Next rung",
  statedNextRungFailures: "What holds it",
  "formula.implementation": "Implementation binding",
  "formula.verifier": "Verifier binding",
  designEntries: "Design entries",
  declarations: "Declarations",
  openQuestions: "Open questions",
  blockingQuestions: "Blocking",
};
/**
 * @sdpAnchor impl:protocol.vault-bases
 * @sdpLabel serializes standing query predicates over reader properties as Obsidian Bases
 * @sdpSatisfies spec:consumers.obsidian-vault.bases
 * @sdpComponent component:protocol.projections
 * @sdpRole projection
 */

export function renderBase(pack?: string): VaultFile {
  const views: readonly { name: string; clauses: readonly string[] }[] =
    pack === undefined
      ? standingViews
      : [
          { name: "Members", clauses: [] },
          { name: "Nothing blocks the next rung", clauses: next },
        ];
  const lines = [
    "filters:",
    "  and:",
    `    - ${JSON.stringify('file.inFolder("sdp/specs")')}`,
    ...(pack === undefined
      ? []
      : [`    - ${JSON.stringify(`packs.contains(link("${notePath(pack)}"))`)}`]),
    "formulas:",
    `  implementation: 'if(implementationBinding, "present", "none")'`,
    `  verifier: 'if(verifierBinding, "present", "none")'`,
    "properties:",
  ];
  for (const [key, label] of Object.entries(columns))
    lines.push(
      `  ${key.startsWith("formula.") ? key : `note.${key}`}:`,
      `    displayName: ${JSON.stringify(label)}`,
    );
  lines.push("views:");
  for (const view of views) {
    lines.push("  - type: table", `    name: ${JSON.stringify(view.name)}`);
    if (view.clauses.length)
      lines.push(
        "    filters:",
        "      and:",
        ...view.clauses.map((clause) => `        - ${JSON.stringify(clause)}`),
      );
    const order =
      view.clauses.length === 0
        ? ["file.name", ...Object.keys(columns)]
        : [
            "file.name",
            "title",
            ...new Set(view.clauses.map((c) => c.replace(/^!/u, "").split(/[ .]/u)[0] ?? "")),
          ];
    lines.push("    order:", ...order.map((key) => `      - ${key}`));
  }
  return {
    path: pack === undefined ? "specs.base" : `packs/${noteName(pack)}.base`,
    content: lines.join("\n") + "\n",
  };
}
