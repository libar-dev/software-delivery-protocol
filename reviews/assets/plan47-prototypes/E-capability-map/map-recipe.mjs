// Throwaway draft of recipe 52. The caller supplies the Protocol's reader bindings.
export function capabilityMap({ g, graph, params }) {
  const accepts = ['epic'];
  const unknownParams = Object.keys(params).filter(k => !accepts.includes(k));
  if (unknownParams.length) return { unknownParams, accepts };
  const specs = g.specs().sort((a,b)=>a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const byId = new Map(specs.map(s=>[s.id,s]));
  if (params.epic !== undefined && (typeof params.epic !== 'string' || byId.get(params.epic)?.altitude !== 'epic')) return { diagnostics: [{ parameter:'epic', problem:'Expected a resolving epic Spec id' }] };
  const allEdges = graph.edges.filter(e=>e.type==='refines'&&e.claim==='declared');
  const edges = allEdges.filter(e=>byId.has(e.from)&&byId.has(e.to)).sort((a,b)=>a.from < b.from ? -1 : a.from > b.from ? 1 : a.to < b.to ? -1 : a.to > b.to ? 1 : 0);
  const parents = new Map(specs.map(s=>[s.id, []]));
  const children = new Map(specs.map(s=>[s.id, []]));
  for (const e of edges) {parents.get(e.from).push(e.to);children.get(e.to).push(e.from);}
  for (const list of [...parents.values(),...children.values()]) list.sort();
  const reach = root => {
    const seen = new Set(), todo = [root];
    while (todo.length) {const id=todo.pop();if(seen.has(id))continue;seen.add(id);todo.push(...children.get(id));}
    return [...seen].sort();
  };
  const epicIds=specs.filter(s=>s.altitude==='epic').map(s=>s.id);
  const reaches=new Map(epicIds.map(id=>[id,reach(id)]));
  const selected=new Set(params.epic ? reaches.get(params.epic) : specs.map(s=>s.id));
  const nodes=specs.filter(s=>selected.has(s.id)).map(s=>({id:s.id,title:s.title,specKind:s.specKind,altitude:s.altitude,statedReadiness:s.statedReadiness,floorReached:s.derivedReadiness??'none',deliveryFacts:s.deliveryFacts,questions:(g.specContext(s.id).sections?.intent?.openQuestions??[]).map((q,index)=>({index,address:q.key?`${s.id}#question.${q.key}`:null,question:q.question,blocking:q.blocking})),parents:parents.get(s.id),children:children.get(s.id),epicIds:epicIds.filter(id=>reaches.get(id).includes(s.id))}));
  const nodeById=new Map(nodes.map(n=>[n.id,n]));
  const count=(ids)=>{
    const init=keys=>Object.fromEntries(keys.map(k=>[k,0]));
    const c={specs:ids.length,byStatedReadiness:init(['idea','scoped','defined','ready']),byFloorReached:init(['none','idea','scoped','defined','ready']),byKind:init(['behavior','workflow','example','rule','constraint','model','decision','contract']),byAltitude:init(['epic','feature','story']),withImplementationBinding:0,withVerifierBinding:0,openQuestions:0,blockingQuestions:0};
    for(const id of ids){const n=nodeById.get(id);c.byStatedReadiness[n.statedReadiness]++;c.byFloorReached[n.floorReached]++;c.byKind[n.specKind]++;c.byAltitude[n.altitude]++;c.withImplementationBinding+=n.deliveryFacts.includes('implemented');c.withVerifierBinding+=n.deliveryFacts.includes('has-verifier');c.openQuestions+=n.questions.length;c.blockingQuestions+=n.questions.filter(q=>q.blocking).length;}
    return c;
  };
  // Strong components are for diagnostics and total coverage of a damaged graph.
  const components=(ids)=>{
    const allowed=new Set(ids), seen=new Set(), done=[], reverse=new Map(ids.map(id=>[id,[]]));
    for(const id of ids)for(const child of children.get(id))if(allowed.has(child))reverse.get(child).push(id);
    const visit=id=>{if(seen.has(id))return;seen.add(id);for(const c of children.get(id))if(allowed.has(c))visit(c);done.push(id);};
    ids.forEach(visit);seen.clear();const groups=[];
    const collect=(id,members)=>{if(seen.has(id))return;seen.add(id);members.push(id);reverse.get(id).forEach(p=>collect(p,members));};
    for(const id of done.reverse())if(!seen.has(id)){const members=[];collect(id,members);groups.push(members.sort());}
    return groups.sort((a,b)=>a[0]<b[0]?-1:1);
  };
  const ids=nodes.map(n=>n.id), unreached=nodes.filter(n=>!n.epicIds.length).map(n=>n.id), unreachedSet=new Set(unreached);
  const roots=components(unreached).filter(group=>!group.some(id=>parents.get(id).some(p=>unreachedSet.has(p)&&!group.includes(p)))).map(group=>group[0]).sort();
  const cycles=components(ids).filter(group=>group.length>1||children.get(group[0]).includes(group[0])).map(members=>({members}));
  const epics=epicIds.filter(id=>selected.has(id)).map(id=>{const descendantIds=reaches.get(id).filter(child=>child!==id&&selected.has(child));return {id,descendantIds,rollup:count(descendantIds)};});
  const diagnostics=allEdges.filter(e=>(!byId.has(e.from)||!byId.has(e.to))&&(!params.epic||selected.has(e.from)||selected.has(e.to))).map(e=>({code:'unresolved-refinement',from:e.from,to:e.to})).sort((a,b)=>a.from<b.from?-1:a.from>b.from?1:a.to<b.to?-1:a.to>b.to?1:0);
  return {input:{epic:params.epic??null},totals:{...count(ids),epics:epics.length,reached:ids.length-unreached.length,unreached:unreached.length},nodes,edges:edges.filter(e=>selected.has(e.from)&&selected.has(e.to)).map(e=>({from:e.from,to:e.to,claim:'declared',reason:e.reason??null})),epics,unreached:{ids:unreached,roots},cycles,diagnostics};
}
export const recipeBody = `return (${capabilityMap.toString()})({g,graph,params});`;
