// 3. The Packs: every Pack with its order, members, stated-ready count, implemented members
// outside examples and decisions, verifier gaps and unresolved members.
// Teaches: the frozen join `g.packContext(id)` over the ids `g.packs()` returns
const count = (k, one, many = `${one}s`) => `${k} ${k === 1 ? one : many}`;
return g.packs().map((p) => {
  const pack = g.packContext(p.id);
  const members = pack.members.filter((m) => m.resolved);
  const work = members.filter((m) => m.specKind !== "example" && m.specKind !== "decision");
  const implemented = work.filter((m) => m.deliveryFacts.includes("implemented")).length;
  return (
    `${p.id} [${pack.order ?? "reading"}] ${p.title}: ${count(members.length, "member")}, ` +
    `${members.filter((m) => m.statedReadiness === "ready").length} stated ready, ` +
    `${implemented}/${work.length} implemented outside examples and decisions, ` +
    `${count(pack.verifierGaps.length, "verifier gap")}, ${pack.members.length - members.length} unresolved`
  );
});
