import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const results = [];
const { WebSocket } = globalThis;
const port=9666;
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--headless=new',`--remote-debugging-port=${port}`,'--no-first-run','--no-default-browser-check',`--user-data-dir=/tmp/plan47-A-browser-check-${process.pid}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));let target;
for(let i=0;i<30;i++){try{target=(await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t=>t.type==='page');if(target)break;}catch{ /* Chrome is still starting. */ }await sleep(100);}
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r));let id=0;const pending=new Map();ws.addEventListener('message',ev=>{const m=JSON.parse(ev.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id);}});const send=(method,params={})=>new Promise(r=>{const i=++id;pending.set(i,r);ws.send(JSON.stringify({id:i,method,params}));});
try{
 await send('Page.enable');await send('Page.bringToFront');await send('Emulation.setFocusEmulationEnabled',{enabled:true});
 for(const corpus of ['protocol','protocol-proposed','platform'])for(const width of [1440,390]){
 await send('Emulation.setDeviceMetricsOverride',{width,height:1000,deviceScaleFactor:1,mobile:width<500});await send('Page.navigate',{url:pathToFileURL(resolve(here, `${corpus}.html`)).href});await sleep(200);
 const r=await send('Runtime.evaluate',{expression:`(()=>{document.querySelectorAll('details').forEach(d=>d.open=true);const rows=[...document.querySelectorAll('tbody tr')];const ids=rows.map(r=>r.querySelector('td code').textContent);return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,rows:rows.length,unique:new Set(ids).size,missing:[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href').slice(1)).filter(id=>!document.getElementById(id)),sourceRows:rows.filter(r=>r.querySelector('.source code')).length};})()`,returnByValue:true});
 const v=r.result.result.value;results.push({corpus,width,...v});if(v.scrollWidth>v.width||v.rows!==(corpus==='protocol'?219:corpus==='protocol-proposed'?221:76)||v.unique!==v.rows||v.sourceRows!==v.rows||v.missing.length)throw Error('page structure or overflow failed');
 const extra=await send('Runtime.evaluate',{expression:`(()=>{const ids=[...document.querySelectorAll('.component-register[id]')].map(s=>s.id).filter(id=>id!=='unassigned');const sorted=[...ids].sort();const decoder=[...document.querySelectorAll('tbody tr')].find(r=>r.textContent.includes('impl:protocol.example-space-decoding'));return {componentOrder:JSON.stringify(ids)===JSON.stringify(sorted),decoderComponent:decoder?.closest('section')?.id,proposedHeading:document.querySelector('h1').textContent.includes('proposed, not applied'),roleDefinitions:[...document.querySelectorAll('.role-meaning')].some(p=>!p.textContent.includes('Omission is lawful'))};})()`,returnByValue:true});
 const ev=extra.result.result.value;if(!ev.componentOrder||ev.roleDefinitions||corpus==='protocol-proposed'&&(!ev.proposedHeading||ev.decoderComponent!=='component:protocol.reader'))throw Error('Ordering, vocabulary or proposal check failed');
 await send('Runtime.evaluate',{expression:`(()=>{const d=[...document.querySelectorAll('details')].find(d=>d.getClientRects().length);d.open=false;d.querySelector('summary').focus();})()`});await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,text:'\r',unmodifiedText:'\r'});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});
 const toggled=await send('Runtime.evaluate',{expression:`[...document.querySelectorAll('details')].find(d=>d.getClientRects().length).open`,returnByValue:true});if(toggled.result.result.value!==true)throw Error('keyboard disclosure did not open');
 }
 console.log(JSON.stringify(results));
 console.log('All three pages passed at desktop and phone widths, including native keyboard disclosures.');
}finally{ws.close();chrome.kill();}
