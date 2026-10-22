// Check the evidence artifact, not product behavior.
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const dir=path.dirname(fileURLToPath(import.meta.url));
const rows=[];
for(const f of readdirSync(dir).filter(f=>f.includes('-after-')&&f.endsWith('.html')||f==='synthetic-plans.html')){
const html=readFileSync(path.join(dir,f),'utf8');const boxes=[...html.matchAll(/<g class="node(?: planned)?" data-id="([^"]+)">[\s\S]*?<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)].map(m=>({id:m[1],x:+m[2],y:+m[3],w:+m[4],h:+m[5]}));
let routes=0;const collisions=[];
for(const m of html.matchAll(/<g class="edge" data-from="([^"]+)" data-to="([^"]+)"[^>]*><path d="([^"]+)"/g)){
routes++;const points=[...m[3].matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(p=>[+p[1],+p[2]]);
for(let i=1;i<points.length;i++)for(const box of boxes){const a=points[i-1],b=points[i];const vertical=a[0]===b[0];const hit=vertical?a[0]>box.x&&a[0]<box.x+box.w&&Math.max(Math.min(a[1],b[1]),box.y)<Math.min(Math.max(a[1],b[1]),box.y+box.h):a[1]>box.y&&a[1]<box.y+box.h&&Math.max(Math.min(a[0],b[0]),box.x)<Math.min(Math.max(a[0],b[0]),box.x+box.w);if(hit)collisions.push({from:m[1],to:m[2],box:box.id,segment:i})}
}
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);const duplicates=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
rows.push({file:f,boxes:boxes.length,routes,collisions,duplicateIds:duplicates});
}
writeFileSync(path.join(dir,'audit-results.json'),JSON.stringify(rows,null,2)+'\n');console.log(JSON.stringify({drawings:rows.length,routes:rows.reduce((n,r)=>n+r.routes,0),collisions:rows.reduce((n,r)=>n+r.collisions.length,0),duplicateIds:rows.reduce((n,r)=>n+r.duplicateIds.length,0)}));if(rows.some(r=>r.collisions.length||r.duplicateIds.length))process.exitCode=1;
