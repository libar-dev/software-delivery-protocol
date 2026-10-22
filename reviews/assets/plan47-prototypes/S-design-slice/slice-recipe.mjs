/* global g, params, recipes */
// Draft body of recipe 54, the design slice. Throwaway prototype evidence, never product code.
// The function below is the body: `sliceBody` is its source, wrapped so `sdp q` runs it unchanged
// with the five bindings in scope. The build would copy the function's statements into the catalog.

async function designSlice() {
  const accepts = ["pack", "specs", "members", "detail"];
  const unknownParams = Object.keys(params).filter((name) => !accepts.includes(name));
  if (unknownParams.length > 0) return { unknownParams, accepts };
  const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
  const strings = (value) => Array.isArray(value) && value.every((item) => typeof item === "string");
  const diagnostics = [];
  const bad = (scope, problem) => diagnostics.push({ scope, problem });
  const packId = params.pack;
  const specIds = params.specs;
  const subset = params.members;
  const detail = params.detail ?? false;
  if (typeof detail !== "boolean" && !strings(detail)) bad("detail", "Expected true, false or a list of member ids.");
  if ((packId !== undefined) === (specIds !== undefined)) bad("scope", "Supply exactly one of pack or specs.");
  let pack = null;
  let ids = [];
  const unresolved = [];
  if (packId !== undefined) {
    pack = typeof packId === "string" ? g.packContext(packId) : undefined;
    if (!pack) bad("pack", "Pack does not resolve.");
    else {
      for (const member of pack.members) (member.resolved ? ids : unresolved).push(member.id);
      if (subset !== undefined) {
        if (!strings(subset) || new Set(subset).size !== subset.length) bad("members", "Expected a unique ordered subset of member ids.");
        else if (subset.some((id) => !ids.includes(id))) bad("members", "Every id must be a resolved member of the Pack.");
        else ids = subset;
      }
    }
  } else if (specIds !== undefined) {
    if (!strings(specIds) || new Set(specIds).size !== specIds.length) bad("specs", "Expected an ordered list of distinct Spec ids.");
    else {
      ids = specIds;
      for (const id of ids) if (!g.specContext(id)) bad(id, "Spec does not resolve.");
    }
    if (subset !== undefined) bad("members", "members narrows only a Pack scope.");
  }
  if (diagnostics.length) return { diagnostics };

  const inSlice = new Set(ids);
  const position = new Map(ids.map((id, index) => [id, index]));
  const context = new Map(ids.map((id) => [id, g.specContext(id)]));
  const rungs = ["idea", "scoped", "defined", "ready"];
  const typed = ["refines", "dependsOn", "constrainedBy", "decidedBy"];

  // Structure inside the slice: the four typed relations between members.
  const edgeKeys = new Set();
  const edges = [];
  for (const id of ids) {
    for (const end of context.get(id).relationsOut) {
      if (end.claim !== "declared" || !typed.includes(end.type) || !inSlice.has(end.otherId) || end.otherId === id) continue;
      const key = `${id}\u0000${end.type}\u0000${end.otherId}`;
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      edges.push({ from: id, to: end.otherId, type: end.type, ...(end.reason === undefined ? {} : { reason: end.reason }) });
    }
  }
  edges.sort((a, b) => compare(a.from, b.from) || compare(a.type, b.type) || compare(a.to, b.to));
  const names = (from, to, types) => edges.some((edge) => edge.from === from && edge.to === to && types.includes(edge.type));
  const restsOn = new Map(ids.map((id) => [id, new Set()]));
  for (const edge of edges) {
    // A refines that the target answers with dependsOn, constrainedBy or decidedBy orders nothing.
    if (edge.type === "refines" && names(edge.to, edge.from, typed.slice(1))) continue;
    restsOn.get(edge.from).add(edge.to);
  }
  const restedOnBy = new Map(ids.map((id) => [id, new Set()]));
  for (const [from, targets] of restsOn) for (const to of targets) restedOnBy.get(to).add(from);

  // Strongly connected sets, with an explicit frame stack, as the statement queue finds them.
  const sorted = [...ids].sort(compare);
  const targetsOf = (id) => [...restsOn.get(id)].sort(compare);
  const order = new Map();
  const low = new Map();
  const stack = [];
  const onStack = new Set();
  const sets = [];
  const visit = (id) => { order.set(id, order.size); low.set(id, order.get(id)); stack.push(id); onStack.add(id); };
  for (const root of sorted) {
    if (order.has(root)) continue;
    visit(root);
    const frames = [{ id: root, at: 0 }];
    while (frames.length) {
      const frame = frames[frames.length - 1];
      const list = targetsOf(frame.id);
      if (frame.at < list.length) {
        const next = list[frame.at++];
        if (!order.has(next)) { visit(next); frames.push({ id: next, at: 0 }); }
        else if (onStack.has(next)) low.set(frame.id, Math.min(low.get(frame.id), order.get(next)));
        continue;
      }
      frames.pop();
      if (frames.length) {
        const parent = frames[frames.length - 1].id;
        low.set(parent, Math.min(low.get(parent), low.get(frame.id)));
      }
      if (low.get(frame.id) === order.get(frame.id)) {
        const members = [];
        let popped;
        do { popped = stack.pop(); onStack.delete(popped); members.push(popped); } while (popped !== frame.id);
        sets.push(members.sort(compare));
      }
    }
  }
  const setOf = new Map();
  sets.forEach((members, index) => { for (const id of members) setOf.set(id, index); });
  // Tarjan emits a set only after every set it rests on, so one pass in emission order assigns depth.
  const setDepth = [];
  sets.forEach((members, index) => {
    let deepest = 0;
    for (const id of members) for (const target of restsOn.get(id)) {
      const other = setOf.get(target);
      if (other !== index) deepest = Math.max(deepest, setDepth[other]);
    }
    setDepth[index] = deepest + 1;
  });
  const depthOf = (id) => setDepth[setOf.get(id)];
  const cycleThrough = (members) => {
    const inside = new Set(members);
    const start = members[0];
    const parent = new Map();
    const seen = new Set([start]);
    const queue = [start];
    while (queue.length) {
      const current = queue.shift();
      for (const next of targetsOf(current).filter((id) => inside.has(id))) {
        if (next === start) {
          const path = [start];
          for (let step = current; step !== start; step = parent.get(step)) path.splice(1, 0, step);
          return [...path, start];
        }
        if (!seen.has(next)) { seen.add(next); parent.set(next, current); queue.push(next); }
      }
    }
    return [];
  };
  const cycles = sets.filter((members) => members.length > 1).sort((a, b) => compare(a[0], b[0]))
    .map((members) => ({ members, cycle: cycleThrough(members) }));

  // Examples that refine another member fold into it for reading.
  const exampleOf = new Map();
  for (const id of ids) {
    if (context.get(id).specKind !== "example") continue;
    const parent = context.get(id).relationsOut.find((end) => end.claim === "declared" && end.type === "refines" && inSlice.has(end.otherId));
    if (parent) exampleOf.set(id, parent.otherId);
  }

  // Composed answers: rule coverage per member, the architecture map, the realization comparison,
  // the decision register and the open-question register.
  const ruleCounts = new Map();
  for (const id of ids) {
    const coverage = await recipes(34, { spec: id });
    const keyed = coverage.totals?.keyedRules ?? 0;
    ruleCounts.set(id, { total: keyed + (coverage.totals?.unkeyedRules ?? 0), keyed });
  }
  const architectureMap = await recipes(17);
  const componentRow = new Map(architectureMap.components.map((row) => [row.id, row]));
  const unitComponent = new Map();
  for (const row of architectureMap.components) for (const member of row.members) unitComponent.set(member.id, row.id);
  const componentOfUnit = (unitId) => (componentRow.has(unitId) ? unitId : unitComponent.get(unitId));
  const comparison = await recipes(43);
  const decisionRegister = await recipes(31);
  const decisionRow = new Map(decisionRegister.rows.map((row) => [row.id, row]));
  const questionRegister = await recipes(20);
  const questionsOf = new Map(questionRegister.specs.map((row) => [row.id, row.questions]));

  // Member rows.
  const members = ids.map((id) => {
    const spec = context.get(id);
    const at = rungs.indexOf(spec.statedReadiness);
    const statedNextRung = at >= 0 && at < rungs.length - 1 ? rungs[at + 1] : null;
    const components = new Set();
    for (const unit of [...spec.implementations, ...spec.references]) {
      const componentId = componentOfUnit(unit.codeId);
      if (componentId !== undefined) components.add(componentId);
    }
    const verifiers = spec.verifiers;
    const examples = verifiers.filter((verifier) => verifier.via === "example");
    return {
      id,
      title: spec.title ?? null,
      specKind: spec.specKind,
      altitude: spec.altitude,
      statedReadiness: spec.statedReadiness,
      floorReached: spec.derivedReadiness ?? "none",
      statedNextRung,
      holds: spec.statedNextRungFailures.map((failure) => ({ clauseId: failure.clauseId, description: failure.description,
        targets: (failure.targets ?? []).map((target) => ({ type: target.type, id: target.id, statedReadiness: target.statedReadiness ?? null })) })),
      depth: depthOf(id),
      restsOn: [...restsOn.get(id)].sort(compare),
      restedOnBy: [...restedOnBy.get(id)].sort(compare),
      exampleOf: exampleOf.get(id) ?? null,
      exampleMembers: ids.filter((other) => exampleOf.get(other) === id),
      design: {
        entries: spec.designColumns.entries,
        declarations: spec.designColumns.declarations,
        openQuestions: spec.designColumns.openQuestions.length,
        blockingQuestions: spec.designColumns.blockingQuestions,
        decisions: spec.designColumns.decisions.length,
      },
      rules: ruleCounts.get(id),
      examples: { total: examples.length, enabled: examples.filter((example) => example.enabled).length },
      verifiers: { total: verifiers.length, enabled: verifiers.filter((verifier) => verifier.enabled).length },
      implementedBy: spec.implementations.map((unit) => unit.codeId).sort(compare),
      referencedBy: spec.references.map((unit) => unit.codeId).sort(compare),
      components: [...components].sort(compare),
    };
  });
  const memberRow = new Map(members.map((row) => [row.id, row]));

  // The boundary over the slice's members, as Pack design builds a Pack's.
  const directions = { restsOn: new Map(), restedOnBy: new Map(), verifiedBy: new Map(), supersededBy: new Map() };
  const join = (direction, otherId, type, memberId) => {
    const row = directions[direction].get(otherId) ?? new Map();
    const list = row.get(type) ?? [];
    if (!list.includes(memberId)) list.push(memberId);
    row.set(type, list);
    directions[direction].set(otherId, row);
  };
  const isSpec = (end) => end.resolved && end.otherNodeType === "Primitive";
  for (const id of ids) {
    const spec = context.get(id);
    for (const end of spec.relationsOut) if (end.claim === "declared" && typed.includes(end.type) && isSpec(end) && !inSlice.has(end.otherId)) join("restsOn", end.otherId, end.type, id);
    for (const end of spec.relationsIn) {
      if (end.claim !== "declared" || !isSpec(end) || inSlice.has(end.otherId)) continue;
      if (typed.includes(end.type)) join("restedOnBy", end.otherId, end.type, id);
      else if (end.type === "verifies") join("verifiedBy", end.otherId, end.type, id);
      else if (end.type === "supersedes") join("supersededBy", end.otherId, end.type, id);
    }
  }
  const relationOrder = ["refines", "dependsOn", "constrainedBy", "decidedBy", "verifies", "supersedes"];
  const packMembers = new Set(pack === null ? [] : pack.members.map((member) => member.id));
  const holdsTarget = (otherId) => members.filter((row) => row.holds.some((hold) => hold.targets.some((target) => target.id === otherId))).map((row) => row.id);
  const boundaryRows = (direction) => [...directions[direction]].sort(([a], [b]) => compare(a, b)).map(([otherId, byType]) => {
    const other = g.specContext(otherId);
    return {
      id: otherId,
      title: other.title ?? null,
      specKind: other.specKind,
      statedReadiness: other.statedReadiness,
      floorReached: other.derivedReadiness ?? "none",
      implemented: other.deliveryFacts.includes("implemented"),
      via: [...byType].sort(([a], [b]) => relationOrder.indexOf(a) - relationOrder.indexOf(b))
        .map(([type, list]) => ({ type, members: [...list].sort((a, b) => position.get(a) - position.get(b)) })),
      holds: direction === "restsOn" ? holdsTarget(otherId) : [],
      ...(packMembers.has(otherId) ? { inPack: true } : {}),
    };
  });
  const boundary = Object.fromEntries(Object.keys(directions).map((direction) => [direction, boundaryRows(direction)]));

  // The architecture the slice touches: through members' bindings, through the code that satisfies
  // what the slice rests on, and through component designs among the members.
  const touched = new Map();
  const touch = (componentId) => {
    if (!touched.has(componentId)) touched.set(componentId, { satisfies: new Set(), references: new Set(), restsOn: new Set(), designs: new Set() });
    return touched.get(componentId);
  };
  const unplaced = [];
  for (const id of ids) {
    const spec = context.get(id);
    for (const [via, units] of [["satisfies", spec.implementations], ["references", spec.references]]) {
      for (const unit of units) {
        const componentId = componentOfUnit(unit.codeId);
        if (componentId === undefined) unplaced.push({ unit: unit.codeId, member: id, via });
        else touch(componentId)[via].add(id);
      }
    }
  }
  for (const row of boundary.restsOn) {
    for (const unit of g.specContext(row.id).implementations) {
      const componentId = componentOfUnit(unit.codeId);
      if (componentId !== undefined) touch(componentId).restsOn.add(row.id);
    }
  }
  const plannedRows = comparison.unrealized.filter((row) => inSlice.has(row.spec));
  for (const row of plannedRows) touch(row.componentId).designs.add(row.spec);
  for (const row of [...comparison.differing]) if (inSlice.has(row.spec)) touch(row.componentId).designs.add(row.spec);
  const planned = new Map(plannedRows.map((row) => [row.componentId, row]));
  const components = [...touched].sort(([a], [b]) => compare(a, b)).map(([componentId, reach]) => {
    const anchored = componentRow.get(componentId);
    const design = planned.get(componentId);
    const byPosition = (list) => [...list].sort((a, b) => position.get(a) - position.get(b));
    return {
      id: componentId,
      label: anchored?.label ?? null,
      layer: anchored?.layer ?? design?.layer ?? null,
      context: anchored?.context ?? design?.context ?? null,
      planned: anchored === undefined && design !== undefined,
      designs: byPosition(reach.designs),
      members: { satisfies: byPosition(reach.satisfies), references: byPosition(reach.references) },
      restsOn: [...reach.restsOn].sort(compare),
    };
  });
  const uses = [];
  for (const row of components) {
    const anchored = componentRow.get(row.id);
    for (const use of anchored?.usesCounts ?? []) if (touched.has(use.component) && use.component !== row.id) uses.push({ from: row.id, to: use.component, count: use.edges, planned: false });
    for (const target of planned.get(row.id)?.uses ?? []) if (touched.has(target)) uses.push({ from: row.id, to: target, count: null, planned: true });
  }
  uses.sort((a, b) => compare(a.from, b.from) || compare(a.to, b.to) || Number(a.planned) - Number(b.planned));
  const differing = comparison.differing.filter((row) => inSlice.has(row.spec));

  // Decisions in scope: decision members and every decision a member names through decidedBy.
  const decisionIds = new Set(ids.filter((id) => context.get(id).specKind === "decision"));
  for (const id of ids) for (const decision of context.get(id).designColumns.decisions) if (decision.resolved) decisionIds.add(decision.id);
  const decisions = [...decisionIds].sort(compare).map((decisionId) => {
    const row = decisionRow.get(decisionId);
    const spec = g.specContext(decisionId);
    return {
      id: decisionId,
      title: spec.title ?? null,
      statedReadiness: spec.statedReadiness,
      floorReached: spec.derivedReadiness ?? "none",
      member: inSlice.has(decisionId),
      shapes: (row?.shapes ?? []).filter((id) => inSlice.has(id)).sort((a, b) => position.get(a) - position.get(b)),
      refines: row?.refines ?? [],
      supersedes: row?.supersedes ?? [],
      supersededBy: row?.supersededBy ?? [],
      openQuestions: spec.designColumns.openQuestions.length,
      blockingQuestions: spec.designColumns.blockingQuestions,
    };
  });

  // Open questions in scope: members', decisions', and those of outside Specs that hold a member.
  const holdingOutside = boundary.restsOn.filter((row) => row.holds.length > 0).map((row) => row.id);
  const questionSources = [
    ...ids.map((id) => [id, "member"]),
    ...decisions.filter((row) => !row.member).map((row) => [row.id, "decision"]),
    ...holdingOutside.filter((id) => !decisionIds.has(id)).map((id) => [id, "restsOn"]),
  ];
  const questions = [];
  for (const [specId, origin] of questionSources) {
    const holdsOwn = memberRow.get(specId)?.holds.some((hold) => hold.clauseId === "no-blocking-open-questions") ?? false;
    const heldMembers = holdsTarget(specId);
    (questionsOf.get(specId) ?? []).forEach((question, index) => {
      if (origin === "restsOn" && !question.blocking) return;
      questions.push({
        address: question.key === null ? null : `${specId}#question.${question.key}`,
        spec: specId,
        origin,
        index,
        question: question.question,
        blocking: question.blocking,
        deferral: question.deferral,
        decider: question.decider,
        links: question.links,
        provisional: question.provisional,
        trigger: question.trigger,
        holds: question.blocking ? [...(holdsOwn ? [specId] : []), ...heldMembers] : [],
      });
    });
  }
  questions.sort((a, b) => Number(b.blocking) - Number(a.blocking) || b.holds.length - a.holds.length || compare(a.spec, b.spec) || a.index - b.index);

  const count = (test) => members.filter(test).length;
  const answer = {
    scope: pack === null ? { specs: ids } : { pack: packId, title: pack.title ?? null, framing: pack.framing ?? null, subset: subset !== undefined, members: ids, unresolved },
    totals: {
      members: members.length,
      exampleMembers: exampleOf.size,
      relations: edges.length,
      depth: members.reduce((deepest, row) => Math.max(deepest, row.depth), 0),
      cycles: cycles.length,
      heldBelowNextRung: count((row) => row.holds.length > 0),
      waitingForAuthor: count((row) => row.statedNextRung !== null && row.holds.length === 0),
      restsOn: boundary.restsOn.length,
      holdingOutside: holdingOutside.length,
      restedOnBy: boundary.restedOnBy.length,
      verifiedBy: boundary.verifiedBy.length,
      supersededBy: boundary.supersededBy.length,
      components: {
        touched: components.length,
        throughMembers: components.filter((row) => row.members.satisfies.length + row.members.references.length > 0).length,
        throughRestsOn: components.filter((row) => row.restsOn.length > 0).length,
        planned: components.filter((row) => row.planned).length,
      },
      componentUses: uses.length,
      decisions: decisions.length,
      decisionsBelowReady: decisions.filter((row) => row.statedReadiness !== "ready").length,
      openQuestions: questions.length,
      blockingQuestions: questions.filter((row) => row.blocking).length,
    },
    members,
    structure: { edges, cycles },
    boundary,
    architecture: { components, uses, unplaced, differing },
    decisions,
    questions,
  };
  if (detail === true) return answer;

  // The summary keeps every total and names what it leaves out.
  const selected = new Set(Array.isArray(detail) ? detail : []);
  const memberSummary = (row) => selected.has(row.id) ? row : {
    id: row.id, specKind: row.specKind, statedReadiness: row.statedReadiness, floorReached: row.floorReached,
    statedNextRung: row.statedNextRung, holds: row.holds.map((hold) => ({ clauseId: hold.clauseId, targets: hold.targets.map((target) => target.id) })), depth: row.depth, restsOn: row.restsOn, exampleOf: row.exampleOf,
    design: row.design, rules: row.rules, implementedBy: row.implementedBy.length, referencedBy: row.referencedBy.length,
  };
  return {
    ...answer,
    members: members.map(memberSummary),
    structure: { edges: edges.map(({ from, to, type }) => ({ from, to, type })), cycles },
    boundary: Object.fromEntries(Object.entries(boundary).map(([direction, rows]) => [direction, rows.map((row) => ({ id: row.id, statedReadiness: row.statedReadiness, holds: row.holds, ...(row.inPack ? { inPack: true } : {}) }))])),
    architecture: {
      ...answer.architecture,
      components: components.map((row) => ({ id: row.id, layer: row.layer, context: row.context, planned: row.planned,
        designs: row.designs.length, members: { satisfies: row.members.satisfies.length, references: row.members.references.length }, restsOn: row.restsOn.length })),
    },
    decisions: decisions.map((row) => ({ id: row.id, statedReadiness: row.statedReadiness, member: row.member, shapes: row.shapes.length })),
    questions: questions.map((row) => (row.blocking ? row : { address: row.address, spec: row.spec, index: row.index })),
    leftOut: [
      "Titles, altitudes, rested-on-by and example member lists, example and verifier counts, and unit and component ids of unselected members; unit counts kept.",
      "Relation reasons; relation types kept.",
      "Boundary titles, kinds, floors, implementation bindings and joined members; ids, stated rungs and holds kept.",
      "Component labels and the Specs that reach each component; counts kept.",
      "Decision titles, floors, refinements, supersessions and question counts.",
      "Non-blocking question text and fields; addresses kept.",
    ],
    ...(Array.isArray(detail) ? { diagnostics: detail.filter((id) => !inSlice.has(id)).map((id) => ({ id, reason: "not-member" })) } : {}),
  };
}

export const sliceBody = `return await (${designSlice.toString()})();`;
