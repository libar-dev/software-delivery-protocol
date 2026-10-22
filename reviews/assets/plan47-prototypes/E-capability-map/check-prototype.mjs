// These probes check the throwaway recipe, not a product implementation.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { evaluateBody } from '../../../../dist/index.js';
import { recipeBody } from './map-recipe.mjs';
const spec=(id,altitude='feature',kind='behavior')=>({id:'spec:probe.'+id,nodeType:'Primitive',claim:'declared',specKind:kind,altitude,readiness:'idea',title:id,file:id+'.md',sections:{intent:{outcome:id},behavior:{rules:['An intended rule.']}},deliveryFacts:[]});
const edge=(from,to)=>({from:'spec:probe.'+from,to:'spec:probe.'+to,type:'refines',claim:'declared'});
const run=(nodes,edges=[],params={detail:true})=>evaluateBody(recipeBody,{graph:{schemaVersion:1,nodes,edges,locations:[],citations:[]},params});
const diamond=await run([spec('epic','epic'),spec('left'),spec('right'),spec('child','story')],[edge('left','epic'),edge('right','epic'),edge('child','left'),edge('child','right')]);
assert.equal(diamond.epics[0].rollup.specs,3);assert.equal(diamond.edges.length,4);assert.deepEqual(diamond.nodes.find(n=>n.id.endsWith('.child')).parents,['spec:probe.left','spec:probe.right']);
const cyclic=await run([spec('a'),spec('b'),spec('c')],[edge('a','b'),edge('b','a'),edge('c','a'),edge('c','missing')]);
assert.equal(cyclic.totals.unreached,3);assert.deepEqual(cyclic.unreached.roots,['spec:probe.a']);assert.equal(cyclic.cycles.length,1);assert.equal(cyclic.damage.length,1);
assert.equal((await run([])).totals.specs,0);
assert.deepEqual((await run([spec('plain')],[],{epic:'spec:probe.plain'})).diagnostics[0].parameter,'epic');
assert.deepEqual((await run([],[],{bogus:true})).unknownParams,['bogus']);
const input=JSON.parse(readFileSync(process.argv[2]??'/tmp/plan47-E/head.json','utf8'));
const fullInput={...input,params:{detail:true}};
const all=await evaluateBody(recipeBody,fullInput), selected=await evaluateBody(recipeBody,{...input,params:{epic:'spec:consumers.agent-surface',detail:true}});
assert.equal(selected.totals.specs,48);assert.equal(selected.nodes.find(n=>n.id==='spec:consumers.agent-surface').epicIds.length,2);assert.equal(selected.unreached.ids.length,0);
const projection=all.epics.find(e=>e.id==='spec:consumers.projections-model');assert.equal(new Set(projection.descendantIds).size,projection.rollup.specs);
assert.equal(JSON.stringify(await evaluateBody(recipeBody,fullInput)),JSON.stringify(all));
const summary=await evaluateBody(recipeBody,input);
assert.deepEqual(summary,await evaluateBody(recipeBody,{...input,params:{detail:false}}));
assert.deepEqual(summary.totals,all.totals);assert.deepEqual(summary.damage,all.damage);assert.deepEqual(summary.cycles,all.cycles);
assert.deepEqual(summary.epics,all.epics.map(({id,title,parentEpicIds,rollup})=>({id,title,parentEpicIds,rollup})));
assert.equal('nodes' in summary,false);assert.equal('edges' in summary,false);assert.equal('roots' in summary.unreached,false);assert.equal(summary.leftOut.length,4);
assert.deepEqual(summary.epics.find(e=>e.id==='spec:consumers.agent-surface').parentEpicIds,['spec:consumers.projections-model']);
assert.equal((await run([],[],{detail:'true'})).diagnostics[0].parameter,'detail');
const cyclicSummary=await run([spec('a'),spec('b')],[edge('a','b'),edge('b','a'),edge('a','missing')],{});
assert.equal(cyclicSummary.damage.length,1);assert.equal(cyclicSummary.cycles.length,1);assert.equal('diagnostics' in cyclicSummary,false);
const prototype = readFileSync(new URL('./protocol-head.html',import.meta.url),'utf8');
const ids=[...prototype.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
for(const n of all.nodes)assert.ok(prototype.includes(n.id),n.id+' missing from complete text');
console.log('Prototype probes passed: summary/full parity, omissions, detail refusal, nested epic parents, separate damage,  diamond, cycle, unresolved endpoint, no epics, empty corpus, parameter diagnostics, nested epic scope, unique rollup, deterministic answer, unique HTML ids, complete node text.');

if(process.argv[3]){
 const base=JSON.parse(readFileSync(process.argv[3],'utf8'));
 const before=await evaluateBody('return g.specs()',base),after=await evaluateBody('return g.specs()',input),by=new Map(after.map(s=>[s.id,s]));
 for(const old of before.filter(s=>s.statedReadiness==='ready')){assert.equal(by.get(old.id).statedReadiness,'ready',old.id);assert.equal(by.get(old.id).derivedReadiness,'ready',old.id);}
 for(const fact of ['implemented','has-verifier'])assert.deepEqual(after.filter(s=>s.deliveryFacts.includes(fact)).map(s=>s.id).sort(),before.filter(s=>s.deliveryFacts.includes(fact)).map(s=>s.id).sort(),fact);
 console.log('All previously ready statements and floors, and both binding-fact sets, are preserved.');
}
