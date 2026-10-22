// Read browser geometry and save screenshots. No product code is imported.
import {spawn} from 'node:child_process';
import {writeFileSync,readFileSync,mkdtempSync} from 'node:fs';
const [url,out,width='1440',selector='sdp-diagram',scroll=''] = process.argv.slice(2);
let port;const profile=mkdtempSync("/tmp/plan47-G-measure-");
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new','--remote-debugging-port=0','--no-first-run','--no-default-browser-check',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let target;
for(let i=0;i<50;i++){try{port=Number(readFileSync(profile+"/DevToolsActivePort","utf8").split("\n")[0]);target=(await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t=>t.type==='page');if(target)break}catch{ /* Chrome has not started listening yet. */ }await sleep(100)}
const ws=new WebSocket(target.webSocketDebuggerUrl); await new Promise(r=>ws.addEventListener('open',r));
let id=0; const pending=new Map();ws.addEventListener('message',ev=>{const m=JSON.parse(ev.data);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}});
const send=(method,params={})=>new Promise(r=>{const i=++id;pending.set(i,r);ws.send(JSON.stringify({id:i,method,params}))});
try{
await send('Page.enable');await send('Emulation.setDeviceMetricsOverride',{width:+width,height:1000,deviceScaleFactor:1,mobile:false});await send('Page.navigate',{url});await sleep(600);
if(scroll)await send('Runtime.evaluate',{expression:`document.querySelector(${JSON.stringify(scroll)})?.scrollIntoView({block:'start'})`});await sleep(400);
const r=await send('Runtime.evaluate',{returnByValue:true,expression:`JSON.stringify([...document.querySelectorAll(${JSON.stringify(selector)})].map(el=>{const s=el.querySelector('svg');if(!s)return null;const r=s.getBoundingClientRect(),v=s.viewBox.baseVal; const t=s.querySelector('.node text')||s.querySelector('text');return {pageUrl:location.href,viewport:innerWidth,subject:el.getAttribute('subject'),viewBoxWidth:v.width,figureWidth:el.getBoundingClientRect().width,svgWidth:r.width,scale:r.width/v.width,font:+parseFloat(getComputedStyle(t).fontSize),effectiveFont:+(parseFloat(getComputedStyle(t).fontSize)*r.width/v.width).toFixed(2),scrollWidth:el.querySelector('.diagram-scroll')?.scrollWidth,viewportWidth:el.querySelector('.diagram-scroll')?.clientWidth}}))`});
const data=JSON.parse(r.result.result.value);writeFileSync(out,JSON.stringify(data,null,2)+'\n');console.log(JSON.stringify(data));
}finally{ws.close();chrome.kill()}
