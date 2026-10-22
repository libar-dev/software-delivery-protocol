// Pinned lane S/E reader probes, separate from drawing layout. Base corpora are read only.
import {execFileSync} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {sliceBody} from './slice-recipe-probe.mjs';
import {capabilityMap} from './map-recipe-probe.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const cli=path.resolve(dir,'../../../../dist/cli/sdp.js');
for(const [name,root,pack] of [
 ['protocol','/Users/darkomijic/.t3/worktrees/software-delivery-protocol/feature-roadmap-and-slices-v0','pack:spec-studio-v1'],
 ['platform','/tmp/plan47-platform','pack:history-view']
]){
 const selectedCli=name==='protocol'?path.join(root,'dist/cli/sdp.js'):cli;
 const args=[selectedCli,'q','--root',root];
 if(name==='protocol') args.push('--exclude','explorations','--exclude','examples','--exclude','test/fixtures/import/parity');
 const query=(body,params)=>JSON.parse(execFileSync('node',[...args,body,'--params',JSON.stringify(params),'--json'],{maxBuffer:16*1024*1024}));
 const slice=query(sliceBody,{pack,detail:true});
 // S's draft probe still emits optional outside pairs. Its current Spec selects touched pairs only.
 const touched=new Set(slice.architecture.components.map(c=>c.id));
 slice.architecture.uses=slice.architecture.uses.filter(e=>touched.has(e.from)&&touched.has(e.to));
 const map=query(`return (${capabilityMap.toString()})({g, graph, params});`,{detail:true});
 if(slice.diagnostics?.length||map.diagnostics?.length)throw new Error('Reader diagnostics');
 writeFileSync(path.join(dir,name+'-slice-answer.json'),JSON.stringify(slice,null,2)+'\n');
 writeFileSync(path.join(dir,name+'-map-answer.json'),JSON.stringify(map,null,2)+'\n');
 console.log(name,slice.members.length,'slice members;',map.nodes.length,'capability nodes');
}
