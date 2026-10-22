import { schemaVersion } from "../../src/index.js";
import type { GraphEdge, GraphNode, GraphSchema, PrimitiveNode } from "../../src/index.js";

export type SliceProbe = Omit<GraphSchema, "nodes" | "edges"> & {
  nodes: GraphNode[];
  edges: GraphEdge[];
};
export const sid = (name: string) => `spec:probe.${name}`;
export const cid = (name: string) => `component:probe.${name}`;
export function primitive(name: string, extra: Partial<PrimitiveNode> = {}): PrimitiveNode {
  return {
    id: sid(name),
    nodeType: "Primitive",
    claim: "declared",
    specKind: "behavior",
    altitude: "story",
    readiness: "defined",
    title: name,
    file: `${name}.sdp.md`,
    sections: {
      intent: { outcome: "Read the probe." },
      behavior: { rules: ["Read the probe."], ruleKeys: { read: "rules[0]" } },
    },
    ...extra,
  };
}
export function link(
  from: string,
  type: GraphEdge["type"],
  to: string,
  claim: GraphEdge["claim"] = "declared",
  reason?: string,
): GraphEdge {
  return { from, type, to, claim, ...(reason === undefined ? {} : { reason }) };
}
export function component(name: string): GraphNode {
  return {
    id: cid(name),
    nodeType: "CodeNode",
    claim: "anchored",
    file: `${name}.ts`,
    line: 1,
    label: name,
    layer: "domain",
    context: "probe",
    role: "service",
  };
}
export function sliceProbe(): SliceProbe {
  return {
    schemaVersion,
    nodes: [
      primitive("base"),
      primitive("top"),
      {
        id: "pack:probe.slice",
        nodeType: "Pack",
        claim: "declared",
        title: "Probe slice",
        framing: "Read these members together.",
        file: "probe.pack.sdp.md",
        members: [sid("top"), sid("base")],
      },
    ],
    edges: [
      link(sid("top"), "dependsOn", sid("base"), "declared", "the top needs its base"),
      link(sid("top"), "belongsTo", "pack:probe.slice"),
      link(sid("base"), "belongsTo", "pack:probe.slice"),
    ],
  };
}
export function setMembers(graph: SliceProbe, names: string[]): void {
  const pack = graph.nodes.findIndex((node) => node.id === "pack:probe.slice");
  graph.nodes[pack] = {
    id: "pack:probe.slice",
    nodeType: "Pack",
    claim: "declared",
    title: "Probe slice",
    file: "probe.pack.sdp.md",
    members: names.map(sid),
  };
  graph.edges = graph.edges.filter((edge) => edge.type !== "belongsTo");
  graph.edges.push(...names.map((name) => link(sid(name), "belongsTo", "pack:probe.slice")));
}
export function designProbe(anchor: string): SliceProbe {
  const graph = sliceProbe();
  const absent = anchor === "no anchor holds";
  const unrelated = anchor === "an anchor holds without satisfying the design";
  const differs = anchor === "an anchor satisfies, with a differing layer and uses";
  const unreadable = anchor === "an anchor satisfies, with an unreadable layer";
  graph.nodes.push(
    primitive("design", {
      specKind: "model",
      sections: {
        intent: { outcome: "Design the probe component." },
        model: { terms: { probe: "The component under review." } },
        design: {
          id: "`component:probe.designed` with explanatory prose",
          layer: unreadable ? "middleware" : differs ? "application" : "domain",
          context: "probe",
          role: "service",
          uses: differs ? "component:probe.missing" : "none",
        },
      },
    }),
  );
  if (!absent) graph.nodes.push(component("designed"));
  if (!absent && !unrelated)
    graph.edges.push(link(cid("designed"), "satisfies", sid("design"), "anchored"));
  setMembers(graph, ["design"]);
  return graph;
}
