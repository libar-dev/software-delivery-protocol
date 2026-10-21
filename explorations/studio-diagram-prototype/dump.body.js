// Prototype input, an `sdp q` body: the values the architecture lens and the trace graph read.
// Throwaway evidence, never product. It reads the graph only and writes nothing.
const byId = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const read = (value) =>
  typeof value === "string"
    ? (/^(`+)(?!`)([^\r\n]+?)(?<!`)\1(?!`)/u.exec(value)?.[2] ?? value).trim()
    : null;
const codeNodes = graph.nodes.filter((node) => node.nodeType === "CodeNode");
const components = codeNodes
  .filter((node) => node.id.startsWith("component:"))
  .map((node) => ({
    id: node.id,
    label: node.label ?? null,
    layer: node.layer ?? null,
    context: node.context ?? null,
    role: node.role ?? null,
    file: node.file ?? null,
    line: node.line ?? null,
  }))
  .sort((a, b) => byId(a.id, b.id));
const memberOf = graph.edges
  .filter((edge) => edge.type === "memberOf" && edge.claim === "anchored")
  .map((edge) => ({ unit: edge.from, component: edge.to }));
const units = codeNodes
  .filter((node) => !node.id.startsWith("component:"))
  .map((node) => ({
    id: node.id,
    label: node.label ?? null,
    role: node.role ?? null,
    file: node.file ?? null,
    line: node.line ?? null,
  }))
  .sort((a, b) => byId(a.id, b.id));
const uses = graph.edges
  .filter((edge) => edge.type === "uses" && edge.claim === "anchored")
  .map((edge) => ({ from: edge.from, to: edge.to }));
// Component designs no anchor realizes, as recipe 43 reads them: the planned components.
const designs = graph.nodes.filter(
  (node) =>
    node.nodeType === "Primitive" &&
    /^component:/u.test(read(node.sections?.design?.id) ?? ""),
);
const planned = designs
  .map((spec) => {
    const entries = spec.sections.design;
    const id = read(entries.id);
    const realized = graph.edges.some(
      (edge) => edge.type === "satisfies" && edge.from === id && edge.to === spec.id,
    );
    const usesValue = read(entries.uses);
    return {
      spec: spec.id,
      id,
      realized,
      layer: read(entries.layer),
      context: read(entries.context),
      uses:
        usesValue === null ? [] : usesValue === "none" ? [] : usesValue.split(",").map((item) => item.trim()),
    };
  })
  .filter((row) => !row.realized);
const authored = new Set(["refines", "dependsOn", "constrainedBy", "decidedBy", "verifies", "supersedes"]);
const relations = graph.edges
  .filter((edge) => authored.has(edge.type))
  .map((edge) => ({ from: edge.from, type: edge.type, to: edge.to, claim: edge.claim }));
const specs = g.specs().map((spec) => ({
  id: spec.id,
  title: spec.title ?? null,
  specKind: spec.specKind,
  statedReadiness: spec.statedReadiness,
  floorReached: spec.derivedReadiness ?? null,
}));
return { components, units, memberOf, uses, planned, relations, specs };
