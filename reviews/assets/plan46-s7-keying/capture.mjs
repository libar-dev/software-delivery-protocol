import { writeFileSync } from 'node:fs';
const base = 'http://127.0.0.1:8765/';
const targets = await (await fetch('http://127.0.0.1:9247/json/list')).json();
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, {once: true}));
let serial=0; const pending=new Map(), waiters=new Map(), external=[], errors=[];
ws.addEventListener('message', e => {
  const m=JSON.parse(e.data);
  if(m.id){const p=pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result);return;}
  if(m.method==='Network.requestWillBeSent' && !m.params.request.url.startsWith(base) && !m.params.request.url.startsWith('data:'))external.push(m.params.request.url);
  if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);
  const list=waiters.get(m.method);if(list){waiters.delete(m.method);list.forEach(f=>f(m.params));}
});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const once=n=>new Promise(r=>waiters.set(n,[...(waiters.get(n)??[]),r]));
const evaluate=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true})).result.value;
await send('Page.enable');await send('Network.enable');await send('Runtime.enable');
await send('Emulation.setScriptExecutionDisabled',{value:true});
const probe=`(()=>{const id='spec:application.generation-registry'; const row=document.getElementById(id);
return {viewport:innerWidth,page:document.documentElement.scrollWidth,
note:document.querySelector('.change-note')?.textContent??null,
keyedRows:row?[...row.querySelectorAll('.entry p')].map(e=>e.textContent):[],
changedMembers:[...document.querySelectorAll('#changed-since-base h3 + ul li')].map(e=>e.textContent),
changeSection:document.querySelector('#changed-since-base')?.textContent??null,
keyedSectionWidths:row?[...row.querySelectorAll('.entry')].map(e=>({width:e.getBoundingClientRect().width,content:e.scrollWidth})):[]};})()`;
const results={scriptDisabled:true,pages:[]};
for(const [name,path] of [
  ['diff','diff.html#spec:application.generation-registry'],
  ['spec','specs/application.generation-registry.html'],
  ['pack','packs/history-view.html#changed-since-base']]){
  for(const width of [1280,820,390]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:width===390?1600:1100,deviceScaleFactor:1,mobile:false});
    const url=new URL(path,base);url.searchParams.set('s7width',String(width));
    const loaded=once('Page.loadEventFired');await send('Page.navigate',{url:url.href});await loaded;
    const measured=await evaluate(probe);results.pages.push({name,width,...measured});
    if(width!==820){const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});writeFileSync(`/tmp/s7-shots/${name}-${width}.png`,Buffer.from(shot.data,'base64'));}
  }
}
results.external=external;results.errors=errors;
writeFileSync('/tmp/s7-shots/measure.json',JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results));ws.close();
