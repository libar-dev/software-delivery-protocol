import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const dir=path.dirname(fileURLToPath(import.meta.url));
const jobs=[];
for(const corpus of ['protocol','platform'])for(const width of [1440,1280]){
for(const kind of ['architecture','trace','maturity'])jobs.push(['capture',`${corpus}-before-${kind}`,width]);
for(const kind of ['dependency','capability','scoped-architecture','maturity','requirement','architecture','trace'])jobs.push(['capture',`${corpus}-after-${kind}`,width]);
for(const phase of ['before','after'])for(const kind of ['architecture','trace'])jobs.push(['measure',`${corpus}-${phase}-${kind}`,width]);
}
jobs.push(['capture','synthetic-plans',1440]);
let cursor=0,failed=false;
async function worker(){while(cursor<jobs.length){const [mode,name,width]=jobs[cursor++];const script=path.join(dir,mode==='capture'?'capture.mjs':'measure.mjs');const out=path.join(dir,mode==='capture'?`${name}-${width}.png`:`metrics-${name}-${width}.json`);const args=[script,'file://'+path.join(dir,name+'.html'),out,String(width)];if(mode==='capture')args.push('1000','0');await new Promise(resolve=>{const p=spawn('node',args,{stdio:['ignore','pipe','pipe']});let errors='';p.stderr.on('data',b=>errors+=b);p.on('exit',code=>{if(code){failed=true;console.error(name,errors)}resolve()})});console.log(mode,name,width)}}
await Promise.all(Array.from({length:3},worker));if(failed)process.exitCode=1;
