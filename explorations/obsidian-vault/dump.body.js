const specs = g.specs().map((n) => {
  const s = g.specContext(n.id);
  return { id: s.id, title: s.title, narrative: s.narrative, kind: s.specKind, kindLabel: s.kindDisplayLabel, altitude: s.altitude, stated: s.statedReadiness, floor: s.derivedReadiness, facts: s.deliveryFacts, file: s.file, packs: s.packs, nextRungFailures: s.statedNextRungFailures, sections: s.sections, designColumns: s.designColumns, implementations: s.implementations, references: s.references, verifiers: s.verifiers };
});
const packs = graph.nodes.filter((n) => n.nodeType === "Pack").map((n) => g.packContext(n.id));
const code = graph.nodes.filter((n) => n.nodeType === "CodeNode" || n.nodeType === "Anchor");
return { specs, packs, edges: graph.edges, code };
