// Throwaway orthogonal router. Algorithm tuning is evidence, not a pinned product contract.
const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export function segmentHits(a,b,r){return a[0]===b[0]?a[0]>r.x&&a[0]<r.x+r.w&&Math.max(Math.min(a[1],b[1]),r.y)<Math.min(Math.max(a[1],b[1]),r.y+r.h):a[1]>r.y&&a[1]<r.y+r.h&&Math.max(Math.min(a[0],b[0]),r.x)<Math.min(Math.max(a[0],b[0]),r.x+r.w)}
export function shared(a,b,c,d){if(a[0]===b[0]&&c[0]===d[0]&&a[0]===c[0])return Math.max(Math.min(a[1],b[1]),Math.min(c[1],d[1]))<Math.min(Math.max(a[1],b[1]),Math.max(c[1],d[1]));if(a[1]===b[1]&&c[1]===d[1]&&a[1]===c[1])return Math.max(Math.min(a[0],b[0]),Math.min(c[0],d[0]))<Math.min(Math.max(a[0],b[0]),Math.max(c[0],d[0]));return false}
class Heap{a=[];push(v){let i=this.a.length;this.a.push(v);while(i){let p=(i-1)>>1;if(this.a[p][0]<=v[0])break;this.a[i]=this.a[p];i=p}this.a[i]=v}pop(){const r=this.a[0],v=this.a.pop();if(this.a.length){let i=0;while(i*2+1<this.a.length){let c=i*2+1;if(c+1<this.a.length&&this.a[c+1][0]<this.a[c][0])c++;if(this.a[c][0]>=v[0])break;this.a[i]=this.a[c];i=c}this.a[i]=v}return r}}
export function routeAll(boxes,edges,width,height,labels=[]){
 const step=8,nx=Math.ceil(width/step)+1,ny=Math.ceil(height/step)+1,N=nx*ny;
 const reserved=[...boxes.map(b=>({x:b.x-12,y:b.y-12,w:b.w+24,h:b.h+24})),...labels.map(l=>({x:l.x-4,y:l.y-16,w:l.words.length*8+8,h:24}))];
 const blocked=new Uint8Array(N);for(const r of reserved)for(let y=Math.max(0,Math.ceil(r.y/8));y<Math.min(ny,(r.y+r.h)/8);y++)for(let x=Math.max(0,Math.ceil(r.x/8));x<Math.min(nx,(r.x+r.w)/8);x++)if(x*8>r.x&&y*8>r.y)blocked[y*nx+x]=1;
 const used=new Set(),ports=new Set(),paths=[],by=new Map(boxes.map(b=>[b.id,b]));let rejected=0;
 const key=(a,b)=>a<b?a+':'+b:b+':'+a;
 const vertex=p=>p[1]/8*nx+p[0]/8;
 const point=v=>[v%nx*8,Math.floor(v/nx)*8];
 function stubFree(a,b){if(labelRects.some(r=>segmentHits(a,b,r)))return false;for(let i=0;i<paths.length;i++)for(let j=1;j<paths[i].points.length;j++)if(shared(a,b,paths[i].points[j-1],paths[i].points[j]))return false;return true}
 function port(b,other){const cx=b.x+b.w/2,cy=b.y+b.h/2,dx=other.x+other.w/2-cx,dy=other.y+other.h/2-cy;const primary=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'bottom':'top';const sides=[primary,...['bottom','top','right','left'].filter(s=>s!==primary)];for(const side of sides){const max=['top','bottom'].includes(side)?b.w:b.h;const offsets=[];for(let o=16;o<=max-16;o+=8)offsets.push(o);offsets.sort((a,c)=>Math.abs(a-max/2)-Math.abs(c-max/2)||a-c);for(const o of offsets){const p=side==='top'?[b.x+o,b.y]:side==='bottom'?[b.x+o,b.y+b.h]:side==='left'?[b.x,b.y+o]:[b.x+b.w,b.y+o];const q=[p[0]+(side==='right'?16:side==='left'?-16:0),p[1]+(side==='bottom'?16:side==='top'?-16:0)];if(q[0]<8||q[1]<8||q[0]>=width||q[1]>=height||ports.has(p.join(','))||blocked[vertex(q)]||!stubFree(p,q))continue;ports.add(p.join(','));return [p,q]}}return null}
 function occupy(points){for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=Math.sign(b[0]-a[0])*8,dy=Math.sign(b[1]-a[1])*8;let p=a;while(p[0]!==b[0]||p[1]!==b[1]){const q=[p[0]+dx,p[1]+dy];used.add(key(vertex(p),vertex(q)));p=q}}}
 const kinds=new Set(edges.map(e=>e.kind==='plans to use'?'uses':e.kind));const labelRects=[];
 function labelPath(path){if(kinds.size<=1)return;
 let placed;
 for(let j=1;j<path.points.length&&!placed;j++){const a=path.points[j-1],b=path.points[j];if(a[0]===b[0]){for(let y=Math.min(a[1],b[1])+8;y+16<=Math.max(a[1],b[1]);y+=8)for(const dx of [8,-24]){const r={x:a[0]+dx,y,w:16,h:16};if(r.x<0||r.x+r.w>width||reserved.some(o=>overlaps(r,o))||labelRects.some(o=>overlaps(r,o))||paths.some(p=>p.points.some((q,k)=>k&&segmentHits(p.points[k-1],q,r))))continue;placed=r;break}if(placed)break;continue}for(let x=Math.min(a[0],b[0])+8;x+16<=Math.max(a[0],b[0]);x+=8)for(const dy of [-24,8]){const r={x,y:a[1]+dy,w:16,h:16};if(r.y<0||reserved.some(o=>overlaps(r,o))||labelRects.some(o=>overlaps(r,o))||paths.some(p=>p.points.some((q,k)=>k&&segmentHits(p.points[k-1],q,r))))continue;placed=r;break}}
 if(!placed){rejected++;return}path.label={...placed,words:'e'+paths.length};labelRects.push(placed);for(let yy=Math.ceil(placed.y/8);yy<(placed.y+placed.h)/8;yy++)for(let xx=Math.ceil(placed.x/8);xx<(placed.x+placed.w)/8;xx++)if(xx*8>placed.x&&yy*8>placed.y)blocked[yy*nx+xx]=1;
 }
 const cmp=(a,b)=>a<b?-1:a>b?1:0;
 for(const ed of [...edges].sort((a,b)=>cmp(a.from,b.from)||cmp(a.to,b.to)||cmp(a.kind,b.kind)||cmp(a.claim,b.claim))){const a=by.get(ed.from),b=by.get(ed.to);if(!a||!b)throw Error('Missing displayed endpoint');let success=false;for(let attempt=0;attempt<100;attempt++){const ap=port(a,b),bp=port(b,a);if(!ap||!bp)break;const start=vertex(ap[1]),end=vertex(bp[1]);
 const dist=new Float64Array(N*3);dist.fill(Infinity);const prev=new Int32Array(N*3);prev.fill(-1);const heap=new Heap();let serial=0;const heuristic=v=>{const p=point(v),q=point(end);return Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])};dist[start*3+2]=0;heap.push([heuristic(start)*1000000+serial++,start*3+2]);let found=-1;
 while(heap.a.length){const [,s]=heap.pop(),v=Math.floor(s/3),dir=s%3;if(v===end){found=s;break}const x=v%nx,y=Math.floor(v/nx);for(const [w,nd]of [[x+1<nx?v+1:-1,0],[y+1<ny?v+nx:-1,1],[x>0?v-1:-1,0],[y>0?v-nx:-1,1]]){if(w<0||blocked[w]||used.has(key(v,w)))continue;const ns=w*3+nd,cost=dist[s]+8+(dir!==2&&dir!==nd?24:0);if(cost>=dist[ns])continue;dist[ns]=cost;prev[ns]=s;heap.push([(cost+heuristic(w))*1000000+serial++,ns])}}
 if(found<0)continue;const chain=[];for(let s=found;s>=0;s=prev[s])chain.push(point(Math.floor(s/3)));chain.reverse();const points=[ap[0],...chain,bp[0]];occupy(points);const simple=[points[0]];for(let i=1;i<points.length-1;i++){const p=points[i-1],q=points[i],r=points[i+1];if((p[0]===q[0]&&q[0]===r[0])||(p[1]===q[1]&&q[1]===r[1]))continue;simple.push(q)}simple.push(points.at(-1));paths.push({ed,points:simple});labelPath(paths.at(-1));success=true;break;
 }if(!success)rejected++;
 }
 return {paths,rejected,labelRects,routeFailures:edges.length-paths.length,labelFailures:paths.filter(p=>kinds.size>1&&!p.label).length};
}
