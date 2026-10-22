// usage: node capture.mjs <url> <out.png> [width] [height] [fullPage:0|1] [scrollToSelector]
import { spawn } from "node:child_process";
import { writeFileSync, readFileSync, mkdtempSync } from "node:fs";
const [url, out, w = "1440", h = "1000", full = "0", sel = ""] = process.argv.slice(2);
let port;
const profile = mkdtempSync("/tmp/plan47-G-capture-");
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", "--remote-debugging-port=0", "--no-first-run", "--no-default-browser-check",
  `--user-data-dir=${profile}`, "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50; i++) { try { port = Number(readFileSync(profile + "/DevToolsActivePort", "utf8").split("\n")[0]); const r = await fetch(`http://127.0.0.1:${port}/json/list`); const l = await r.json(); target = l.find((t) => t.type === "page"); if (target) break; } catch { /* Chrome has not started listening yet. */ } await sleep(200); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const pending = new Map();
ws.addEventListener("message", (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: +w, height: +h, deviceScaleFactor: 1, mobile: +w < 500 });
await send("Page.navigate", { url });
await sleep(1500);
if (sel) await send("Runtime.evaluate", { expression: `document.querySelector(${JSON.stringify(sel)})?.scrollIntoView({block:"start"})` });
await sleep(300);
let params = { format: "png" };
if (full === "1") {
  const m = await send("Page.getLayoutMetrics");
  const cs = m.result.cssContentSize ?? m.result.contentSize;
  params = { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: +w, height: Math.min(cs.height, 12000), scale: 1 } };
}
const shot = await send("Page.captureScreenshot", params);
writeFileSync(out, Buffer.from(shot.result.data, "base64"));
ws.close(); chrome.kill();
console.log(out);
