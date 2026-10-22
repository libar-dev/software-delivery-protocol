import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { evaluateBody, extract } from "../../src/index.js";
import type { GraphSchema } from "../../src/index.js";

export function probeSpec(
  name: string,
  readiness = "ready",
  relations = "\n  dependsOn: spec:probe.foundation",
  body = "## Behavior\n- rule: The probe has a rule.",
  kind = "behavior",
): string {
  return `---\nid: spec:probe.${name}\nkind: ${kind}\naltitude: story\nreadiness: ${readiness}\nrelations: ${relations}\n---\n# ${name}\n\n## Intent\n- outcome: Read the probe.\n\n${body}\n`;
}

export function probePack(name: string, members: readonly string[], framing = ""): string {
  return `---\nid: pack:${name}\nspecs:\n${members.map((id) => `  - spec:probe.${id}`).join("\n")}\n---\n# ${name}\n\n${framing}\n`;
}

export function implementation(name: string): string {
  return `/**\n * @sdpAnchor impl:probe.${name}\n * @sdpSatisfies spec:probe.${name}\n */\n`;
}

/** Parse real carriers; add the Pack field carried by the parallel schema change. */
export function probeGraph(
  files: Record<string, string>,
  priority: readonly string[] = ["probe"],
): GraphSchema {
  const root = mkdtempSync(join(tmpdir(), "sdp-roadmap-"));
  try {
    files = {
      "foundation.sdp.md": probeSpec(
        "foundation",
        "ready",
        "\n  refines: spec:probe.foundation-rule",
        "## Decision\n- context: The probe has settled footing.\n- decision: Keep the footing.",
        "decision",
      ),
      "foundation-rule.sdp.md": probeSpec(
        "foundation-rule",
        "ready",
        "\n  decidedBy: spec:probe.foundation",
      ),
      ...files,
    };
    for (const [name, content] of Object.entries(files)) writeFileSync(join(root, name), content);
    const { graph, report } = extract({ root });
    const findings = report.findings;
    if (findings.some((finding) => finding.severity === "error")) {
      throw new Error(JSON.stringify(findings));
    }
    return {
      ...graph,
      nodes: graph.nodes.map((node) =>
        node.nodeType === "Pack" && priority.includes(node.id.slice(5))
          ? { ...node, order: "priority" as const }
          : node,
      ),
    };
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

export interface QuestionRow {
  address: string | null;
  spec: string;
  index: number;
  question: string;
  blocking: boolean;
  decider: string | null;
  provisional: string | null;
  places?: number[];
}
export interface WorkRow {
  id: string;
  need: string;
  statedReadiness: string;
  floorReached: string;
  statedNextRung: string | null;
  holdsNextRung: { clause: string; targets: string[] }[];
  drift: boolean;
}
export interface EntryRow extends Omit<WorkRow, "drift"> {
  place: number;
  title: string;
  work: Record<string, number>;
  workRows: WorkRow[];
  buildNow: string[];
  blockingQuestions: QuestionRow[];
  decisions: { id: string; blockingQuestions: QuestionRow[] }[];
  restsOn: {
    id: string;
    via: string;
    from: string[];
    need: string;
    holdsReady: boolean;
    onRoadmap: number | null;
  }[];
  restedOnBy: { id: string; via: string; need: string; onRoadmap: number | null }[];
  earlierStatements: { id: string; where: string; onRoadmap: number | null }[];
  packs: string[];
  sharesScopeWith: number[];
}
export interface Roadmap {
  pack: string;
  order: string;
  totals: Record<string, number>;
  entries: EntryRow[];
  apart: { place: number; id: string; need: string }[];
  waiting: {
    questions: QuestionRow[];
    withoutDecider: QuestionRow[];
    statements: { id: string; places: number[] }[];
  };
}
export interface RoadmapAnswer {
  decider: string;
  roadmaps: Roadmap[];
  diagnostics?: { parameter: string; problem: string }[];
}
export async function roadmap(
  graph: GraphSchema,
  params: Record<string, unknown> = {},
): Promise<RoadmapAnswer> {
  return (await evaluateBody("return recipes(53, params)", { graph, params })) as RoadmapAnswer;
}
export async function memo(
  graph: GraphSchema,
  params: Record<string, unknown> = {},
): Promise<{ diagnostics: { parameter: string; problem: string }[]; memo: string | null }> {
  return (await evaluateBody("return recipes(55, params)", { graph, params })) as {
    diagnostics: { parameter: string; problem: string }[];
    memo: string | null;
  };
}

export const workStates = [
  "is ready and implemented throughout",
  "has one part ready and not implemented",
  "has one part below ready whose floor reaches ready",
  "has one part below ready whose floor stops short",
  "has one part implemented below ready",
  "has a ready root and one descendant without its kind's evidence",
  "has a ready root and one descendant held by a blocking question",
  "has one descendant that also refines a Spec outside the roadmap",
] as const;

export function workGraph(state: string): GraphSchema {
  const files: Record<string, string> = {
    "pack.sdp.md": probePack("probe", ["root"]),
    "root.sdp.md": probeSpec("root"),
    "root.ts": implementation("root"),
  };
  let readiness = "ready";
  let relations = "\n  refines: spec:probe.root";
  let body: string | undefined;
  if (state === workStates[2]) readiness = "defined";
  if (state === workStates[3] || state === workStates[4] || state === workStates[6]) {
    readiness = "scoped";
    body = "## Behavior\n- rule: The probe has a rule.";
  }
  if (state === workStates[5]) {
    readiness = "scoped";
    body = "";
  }
  files["part.sdp.md"] = probeSpec("part", readiness, relations, body);
  if (state === workStates[3] || state === workStates[4] || state === workStates[6]) {
    files["part.sdp.md"] = files["part.sdp.md"].replace(
      "\n\n## Behavior",
      "\n\n### Open questions\n- [blocking #choice] Settle the probe.\n\n## Behavior",
    );
  }
  if (state === workStates[0] || state === workStates[4]) files["part.ts"] = implementation("part");
  if (state === workStates[7]) {
    relations = "\n  refines: [spec:probe.root, spec:probe.outside]";
    files["part.sdp.md"] = probeSpec("part", "defined", relations);
    files["outside.sdp.md"] = probeSpec("outside", "scoped");
  }
  return probeGraph(files);
}
