// Headless checks of the static prototype, using the same Chrome as capture.mjs.
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const port=9807;
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new',`--remote-debugging-port=${port}`,'--no-first-run','--no-default-browser-check','--user-data-dir=/tmp/plan47-E-browser-check','about:blank'],{stdio:'ignore'});
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let target;
for(let i=0;i<50;i++){try{target=(await(await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t=>t.type==='page');if(target)break;}catch{await pause(100);}}
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(resolve=>ws.addEventListener('open',resolve));
let sequence=0;const pending=new Map();ws.addEventListener('message',event=>{const m=JSON.parse(event.data);if(pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}});
const send=(method,params={})=>new Promise(resolve=>{const id=++sequence;pending.set(id,resolve);ws.send(JSON.stringify({id,method,params}));});
const read=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true})).result.result.value;
const base=new URL('.',import.meta.url).href;
const open=async url=>{await send('Page.navigate',{url});await pause(250);};
try{
 await send('Page.enable');
 for(const width of [1440,390]){
  await send('Emulation.setDeviceMetricsOverride',{width,height:1050,deviceScaleFactor:1,mobile:width<500});
  for(const name of ['protocol-base','protocol-head','platform']){
   await open(base+name+'.html');
   assert.equal(await read('document.documentElement.scrollWidth<=innerWidth'),true,name+' overflow at '+width);
   assert.equal(await read('new Set([...document.querySelectorAll("[id]")].map(e=>e.id)).size===document.querySelectorAll("[id]").length'),true);
  }
 }
 await open(base+'protocol-head-index.html?epic=spec%3Aconsumers.agent-surface#specs');
 assert.equal(await read('document.querySelectorAll(".filter-row:not([hidden])").length'),48);
 await read('document.getElementById("kind").value="example";document.getElementById("kind").dispatchEvent(new Event("change",{bubbles:true}))');
 assert.equal(await read('document.querySelectorAll(".filter-row:not([hidden])").length'),27);
 await read('document.getElementById("filters").reset()');await pause(50);
 assert.equal(await read('document.querySelectorAll(".filter-row:not([hidden])").length'),421);
 await open(base+'protocol-head-index.html?epic=missing');assert.equal(await read('document.getElementById("filter-note").textContent'),'Unknown epic filter. All Specs are shown.');
 assert.equal(await read('document.querySelectorAll(".filter-row:not([hidden])").length'),421);
 await open(base+'protocol-head-index.html?epic=none&epic=none');assert.equal(await read('document.querySelectorAll(".filter-row:not([hidden])").length'),421);
 await send('Emulation.setScriptExecutionDisabled',{value:true});await open(base+'protocol-head-index.html?epic=spec%3Aconsumers.agent-surface');
 assert.equal(await read('document.querySelectorAll(".filter-row:not([hidden])").length'),421);
 await open(base+'protocol-head.html');
 assert.equal(await read('document.querySelectorAll(".complete").length'),9);
 console.log('Browser checks passed: all corpora at 1440 and 390 without overflow; unique ids; epic filter 48 rows, intersected examples 27, reset 421; bad/repeated epic query safe; no-script index and native disclosures intact.');
}finally{ws.close();chrome.kill();}
