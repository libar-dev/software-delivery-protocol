import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const repo=fileURLToPath(new URL('../../../../',import.meta.url));
const root=process.argv[2]??repo;
const body=`const specs=g.specs(), by=new Map(specs.map(s=>[s.id,s]));
const edges=graph.edges.filter(e=>e.type==='refines'&&e.claim==='declared');
const parents=id=>edges.filter(e=>e.from===id&&by.has(e.to)).map(e=>e.to);
const transitions={};for(const e of edges){const key=by.get(e.from)?.altitude+' -> '+by.get(e.to)?.altitude;transitions[key]=(transitions[key]??0)+1;}
const depth=(id,seen=new Set())=>seen.has(id)?null:Math.max(0,...parents(id).map(p=>{const d=depth(p,new Set([...seen,id]));return d===null?0:d+1}));
const reached=(id,seen=new Set())=>seen.has(id)?false:by.get(id)?.altitude==='epic'||parents(id).some(p=>reached(p,new Set([...seen,id])));
return {specs:specs.length,altitudes:Object.fromEntries(['epic','feature','story'].map(a=>[a,specs.filter(s=>s.altitude===a).length])),transitions,roots:specs.filter(s=>!parents(s.id).length).map(s=>s.id),maximumAcyclicDepth:Math.max(0,...specs.map(s=>depth(s.id))),multipleParents:specs.filter(s=>parents(s.id).length>1).map(s=>({id:s.id,parents:parents(s.id)})),reached:specs.filter(s=>reached(s.id)).length,examplesAndDecisions:['example','decision'].map(kind=>({kind,total:specs.filter(s=>s.specKind===kind).length,reached:specs.filter(s=>s.specKind===kind&&reached(s.id)).length})),epics:specs.filter(s=>s.altitude==='epic').map(s=>({id:s.id,kind:s.specKind,title:s.title,outcome:g.specContext(s.id).sections.intent?.outcome,stated:s.statedReadiness,floor:s.derivedReadiness})),divergence:await recipes(7),ladder:await recipes(11),drift:await recipes(2)};`;
process.stdout.write(execFileSync('node',[process.argv[3]??repo+'dist/cli/sdp.js','q','--root',root,...(root.includes('platform')?[]:['--exclude','explorations','--exclude','examples','--exclude','test/fixtures/import/parity']),body,'--json'],{encoding:'utf8',maxBuffer:30e6}));
