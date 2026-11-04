// 7. Architecture and decisions: each anchored component with its layer, units, satisfied Specs
// and uses; the direction unit-level `uses` edges run across layers; the decision register's
// totals; the decisions with the widest reach, by name. Never print recipe 17 bare: it floods.
const arch = await recipes(17);
const crossings = await recipes(32);
const register = await recipes(31);
const map = await recipes(18);
const count = (k, one, many = `${one}s`) => `${k} ${k === 1 ? one : many}`;
const short = (id) => id.replace(/^component:/, "");
const titles = new Map(map.decisions.map((d) => [d.id, d.title]));
return {
  components: arch.components.map(
    (c) =>
      `${short(c.id)} [${c.layer ?? "no layer"}] ${c.label ?? ""}: ${count(c.members.length, "unit")}, ` +
      `satisfies ${count(c.satisfiedSpecs.length, "Spec")}, uses ${c.usesOut.map(short).join(" ") || "nothing"}`,
  ),
  unresolvedUses: arch.unresolvedUses.length,
  layerDirection: crossings.totals.byLayerPair,
  decisions: register.totals,
  mostShaping: map.ranking.slice(0, 8).map((r) => `${r.fanIn} ${r.id}: ${titles.get(r.id)}`),
};
