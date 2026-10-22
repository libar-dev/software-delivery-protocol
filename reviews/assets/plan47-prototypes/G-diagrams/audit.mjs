// Independent checks of committed evidence, including the defects raised by review.
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {shared,segmentHits} from './router-probe.mjs';
import assert from 'node:assert/strict';
import {escapeLabel} from './source-escape-probe.mjs';
assert.equal(escapeLabel('The Studio\'s `labels` keep "quotes" # < >\nnext'), 'The Studio\'s `labels` keep #quot;quotes#quot; #35; #lt; #gt; next');
assert.equal(escapeLabel('first\r\nsecond'), 'first second');
const dir=path.dirname(fileURLToPath(import.meta.url)),rows=[];
const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
for(const file of readdirSync(dir).filter(f=>f.includes('-after-')&&f.endsWith('.html')||f.startsWith('synthetic-')&&f.endsWith('.html'))){
 const html=readFileSync(path.join(dir,file),'utf8');
 const boxes=[...html.matchAll(/<g class="node(?: planned)?" data-id="([^"]+)">[\s\S]*?<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)].map(m=>({id:m[1],x:+m[2],y:+m[3],w:+m[4],h:+m[5]}));
 const labels=[...html.matchAll(/<g class="edge-label"><rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)].map(m=>({x:+m[1],y:+m[2],w:+m[3],h:+m[4]}));
 const bands=[...html.matchAll(/<text class="lane-label" x="([\d.]+)" y="([\d.]+)">([^<]+)<\/text>/g)].map(m=>({x:+m[1]-4,y:+m[2]-16,w:m[3].length*8+8,h:24}));
 const paths=[...html.matchAll(/<g class="edge" data-from="([^"]+)" data-to="([^"]+)"[^>]*><path d="([^"]+)"/g)].map(m=>({from:m[1],to:m[2],points:[...m[3].matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(p=>[+p[1],+p[2]])}));
 const segments=paths.flatMap((p,index)=>p.points.slice(1).map((b,j)=>({a:p.points[j],b,index})));
 const nodeCollisions=segments.filter(s=>boxes.some(b=>segmentHits(s.a,s.b,b))).length;
 let sharedSegments=0;for(let i=0;i<segments.length;i++)for(let j=0;j<i;j++)if(segments[i].index!==segments[j].index&&shared(segments[i].a,segments[i].b,segments[j].a,segments[j].b))sharedSegments++;
 let labelOverlap=0;for(let i=0;i<labels.length;i++){if([...boxes,...bands].some(b=>overlaps(labels[i],b)))labelOverlap++;for(let j=0;j<i;j++)if(overlaps(labels[i],labels[j]))labelOverlap++;}
 const routeLabelCollisions=segments.filter(s=>[...labels,...bands].some(r=>segmentHits(s.a,s.b,r))).length;
 const ports=paths.flatMap(p=>[p.points[0].join(','),p.points.at(-1).join(',')]),duplicatePorts=ports.length-new Set(ports).size;
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]),duplicateIds=ids.length-new Set(ids).size;
 const foldedIds=[...html.matchAll(/class="identity"[^>]*>([\s\S]*?)<\/text>/g)].filter(m=>m[1].includes('fold:')).length;
 const sourceProblems=[...html.matchAll(/<textarea([^>]*)>/g)].filter(m=>{const id=m[1].match(/id="([^"]+)"/)?.[1];return !id||!html.includes('<label for="'+id+'">')||!html.includes('<sdp-copy for="'+id+'">')}).length;
 const row={file,sourceProblems,boxes:boxes.length,routes:paths.length,nodeCollisions,sharedSegments,labelOverlap,routeLabelCollisions,duplicatePorts,duplicateIds,foldedIds,omitted:html.includes('Shown as text:')};rows.push(row);
}
writeFileSync(path.join(dir,'audit-results.json'),JSON.stringify(rows,null,2)+'\n');
const failures=rows.filter(r=>r.nodeCollisions||r.sharedSegments||r.labelOverlap||r.routeLabelCollisions||r.duplicatePorts||r.duplicateIds||r.foldedIds||r.sourceProblems||r.omitted);
console.log(JSON.stringify({drawings:rows.length,routes:rows.reduce((n,r)=>n+r.routes,0),failures},null,2));if(failures.length)process.exitCode=1;
