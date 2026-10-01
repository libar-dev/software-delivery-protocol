import { expect } from "vitest";
import {
  oracleAnchorId,
  ref,
  specOracle,
  specTest,
  testAnchorId,
} from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import type {
  UnboundExamplePostureConditions,
  UnboundExamplePostureOutcome,
} from "../generated/contracts/validation.unbound-example-posture.space.js";
import { createReader, schemaVersion } from "../src/index.js";
import type { GraphEdge, GraphNode, PrimitiveNode, SpecKind, SpecReadiness } from "../src/index.js";
import { registerLowerRungs } from "./validation.unbound-example-posture.lower-rungs.test.generated.js";
import { registerWarningCases } from "./validation.unbound-example-posture.warning-cases.test.generated.js";
import { registerParentTraces } from "./validation.unbound-example-posture.parent-traces.test.generated.js";

const OUTCOME =
  "the matrix reports {warnings} linkage warnings and {gaps} parent gaps and {oracleErrors} oracle errors";
const rungs = ["idea", "scoped", "defined", "ready"] as const;
const kinds = [
  "behavior",
  "workflow",
  "rule",
  "constraint",
  "model",
  "decision",
  "contract",
] as const;
const unboundPostureOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.unbound-example-posture"),
  label: "expected verification signals by posture matrix",
  models: ref("spec:validation.unbound-example-posture"),
});
void unboundPostureOracleAnchor;

function expectedPosture(
  point: Partial<UnboundExamplePostureConditions>,
): UnboundExamplePostureOutcome {
  switch (point.matrix) {
    case "lower-rungs":
      return { kind: OUTCOME, warnings: 0, gaps: 0, oracleErrors: 0 };
    case "warning-cases":
      return { kind: OUTCOME, warnings: 29, gaps: 0, oracleErrors: 0 };
    case "parent-traces":
      return { kind: OUTCOME, warnings: 1, gaps: 1, oracleErrors: 1 };
    default:
      return unspecified;
  }
}

interface Trace {
  parent: string;
  child: string;
  enabled: boolean;
  childEnabled: boolean;
  warning: boolean;
  gap: boolean;
}
interface World {
  nodes: GraphNode[];
  edges: GraphEdge[];
  traces: Trace[];
  reader?: ReturnType<typeof createReader>;
}
function primitive(id: string, kind: SpecKind, readiness: SpecReadiness): PrimitiveNode {
  return {
    id,
    nodeType: "Primitive",
    claim: "declared",
    specKind: kind,
    altitude: "story",
    readiness,
    title: id,
    file: "specs/probe.sdp.md",
    sections: { intent: { outcome: "Probe verification signals." } },
  };
}
function bind(world: World, target: string): void {
  const id = `test:probe.${target.slice(5)}`;
  world.nodes.push({
    id,
    nodeType: "Anchor",
    claim: "anchored",
    file: "test/probe.test.ts",
    line: 1,
  });
  world.edges.push({ from: id, to: target, type: "verifies", claim: "anchored" });
}
function trace(
  world: World,
  name: string,
  kind: SpecKind,
  rung: SpecReadiness,
  parentRung: SpecReadiness = "defined",
  binding: "none" | "sibling" | "direct" | "self" = "none",
  parentKind: SpecKind = "behavior",
): void {
  const parent = `spec:probe.${name}`;
  const child = `${parent}.verifier`;
  world.nodes.push(primitive(parent, parentKind, parentRung), primitive(child, kind, rung));
  world.edges.push({ from: child, to: parent, type: "verifies", claim: "declared" });
  if (binding === "direct") bind(world, parent);
  if (binding === "self") bind(world, child);
  if (binding === "sibling") {
    const sibling = `${parent}.sibling`;
    world.nodes.push(primitive(sibling, "example", "defined"));
    world.edges.push({ from: sibling, to: parent, type: "verifies", claim: "declared" });
    bind(world, sibling);
  }
  world.traces.push({
    parent,
    child,
    enabled: binding !== "none",
    childEnabled: binding === "self",
    warning: kind !== "example" || (rung === "ready" && binding !== "self"),
    gap: parentRung === "ready" && parentKind !== "decision" && binding === "none",
  });
}
function createWorld(point: Partial<UnboundExamplePostureConditions>): World {
  const world: World = { nodes: [], edges: [], traces: [] };
  switch (point.matrix) {
    case "lower-rungs":
      for (const rung of rungs.slice(0, 3)) trace(world, rung, "example", rung);
      break;
    case "warning-cases":
      trace(world, "ready-example", "example", "ready");
      for (const kind of kinds)
        for (const rung of rungs) trace(world, `${kind}-${rung}`, kind, rung);
      break;
    case "parent-traces":
      trace(world, "no-binding", "example", "defined", "ready");
      trace(world, "sibling-binding", "example", "defined", "ready", "sibling");
      trace(world, "direct-binding", "example", "defined", "ready", "direct");
      trace(world, "ready-child", "example", "ready", "ready", "sibling");
      trace(world, "bound-ready-child", "example", "ready", "ready", "self");
      trace(world, "decision-parent", "example", "defined", "ready", "none", "decision");
      world.nodes.push({
        id: "oracle:probe.no-space",
        nodeType: "Anchor",
        claim: "anchored",
        file: "test/probe.test.ts",
        line: 2,
      });
      world.edges.push({
        from: "oracle:probe.no-space",
        to: "spec:probe.no-binding",
        type: "models",
        claim: "anchored",
      });
      break;
    default:
      throw new Error(`Unknown matrix: ${String(point.matrix)}`);
  }
  return world;
}
function invoke(world: World): void {
  world.reader = createReader({ schemaVersion, nodes: world.nodes, edges: world.edges });
}
function observe(world: World): UnboundExamplePostureOutcome {
  const reader = world.reader;
  if (reader === undefined) throw new Error("The posture matrix requires a reader.");
  const findings = reader.findings();
  const linkage = findings.filter((f) => f.validatorId === "conformance/verifies-linkage");
  const parentIds = new Set(world.traces.map((t) => t.parent));
  const gaps = findings.filter(
    (f) => f.validatorId === "honesty/gaps" && parentIds.has(f.subjectId ?? ""),
  );
  const oracleErrors = findings.filter((f) => f.validatorId === "conformance/oracle-linkage");
  for (const entry of world.traces) {
    const parent = reader.specContext(entry.parent);
    const child = reader.specContext(entry.child);
    expect(child?.deliveryFacts.includes("has-verifier")).toBe(entry.childEnabled);
    const declared = parent?.verifiers.find((v) => v.verifierId === entry.child);
    expect(declared).toMatchObject({
      via: "example",
      claim: "declared",
      enabled: entry.childEnabled,
    });
    expect(parent?.deliveryFacts.includes("has-verifier")).toBe(entry.enabled);
    const childWarnings = linkage.filter((f) => f.subjectId === entry.child);
    expect(childWarnings).toHaveLength(entry.warning ? 1 : 0);
    for (const warning of childWarnings) expect(warning.relatedId).toBe(entry.parent);
    expect(gaps.filter((f) => f.subjectId === entry.parent)).toHaveLength(entry.gap ? 1 : 0);
  }
  for (const finding of linkage)
    expect(finding).toMatchObject({ severity: "warning", family: "conformance" });
  for (const finding of gaps)
    expect(finding).toMatchObject({ severity: "warning", family: "honesty" });
  for (const finding of oracleErrors)
    expect(finding).toMatchObject({
      severity: "error",
      subjectId: "oracle:probe.no-space",
      relatedId: "spec:probe.no-binding",
    });
  return {
    kind: OUTCOME,
    warnings: linkage.length,
    gaps: gaps.length,
    oracleErrors: oracleErrors.length,
  };
}
const adapters = { createWorld, invoke, observe, expected: expectedPosture };
const lowerRungsTestAnchor = specTest({
  id: testAnchorId("test:protocol.unbound-example-posture.lower-rungs"),
  label: "verifies declared-only examples below ready",
  verifies: ref("spec:validation.unbound-example-posture.lower-rungs"),
});
void lowerRungsTestAnchor;
registerLowerRungs(adapters);
const warningCasesTestAnchor = specTest({
  id: testAnchorId("test:protocol.unbound-example-posture.warning-cases"),
  label: "verifies ready and wrong-kind linkage warnings",
  verifies: ref("spec:validation.unbound-example-posture.warning-cases"),
});
void warningCasesTestAnchor;
registerWarningCases(adapters);
const parentTracesTestAnchor = specTest({
  id: testAnchorId("test:protocol.unbound-example-posture.parent-traces"),
  label: "verifies parent gaps and unchanged oracle signals",
  verifies: ref("spec:validation.unbound-example-posture.parent-traces"),
});
void parentTracesTestAnchor;
registerParentTraces(adapters);
