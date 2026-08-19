#!/usr/bin/env node
// Read-only Brief K census. Node, no deps.
// Prints a per-session table. Writes nothing (stdout/stderr only).
// Law: .omo/evidence/plan-37-k-measurement/definition.md
//
// Usage: node census.mjs <session.jsonl|ledger.jsonl> [more...]
// Exit 2: usage. Exit 1: missing/unreadable path. Exit 0: readable input
// (including 0 invocations, and truncated/malformed lines which are skipped
// and counted as malformed_lines).

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

const PARAM_RECIPES = new Set([3, 6, 9, 14]);
const PARAM_NAME = { 3: "id", 6: "term", 9: "id", 14: "subject" };

const INVOCATION_HEAD =
  /(?:npm|pnpm)(?:\s+run)?(?:\s+--silent)?\s+sdp:q\b|(?:npm|pnpm)\s+exec\s+sdp\s+q\b|(?:node\s+)?(?:\.\/)?dist\/cli\/sdp\.js\s+q\b|\bsdp:q\b|\bsdp\s+(?:--\s+)?q\b/;

function stripShellQuotes(command) {
  return String(command)
    .replace(/'(?:\\'|[^'])*'/g, "''")
    .replace(/"(?:\\.|[^"])*"/g, '""');
}

// A mutating verb pointed at a scratch root (an operand under /tmp) rewrites a
// throwaway graph, not the product graph or carriers — same product scoping
// the edit/write prong applies through isProductPath.
function targetsScratchRoot(statement) {
  return statement.split(/\s+/).some((token) => /^\/tmp\//.test(token));
}

function bashIsCloser(command) {
  const stripped = stripShellQuotes(command);
  const statements = stripped.split(/(?:&&|\|\||;|\n)/);
  for (const raw of statements) {
    const st = raw.trim();
    if (!st) continue;
    if (/^(?:grep|rg|echo|printf|cat|sed|awk|head|tail|less|more)\b/.test(st)) continue;
    if (/\bgit\s+commit\b/.test(st)) return true;
    // Every sdp verb below runs the build pipeline and rewrites generated/
    // artifacts (validate/view/census/mermaid/gherkin all call runBuild), or
    // authors new bytes (new). `sdp q` derives in process, writes nothing,
    // and stays a non-closer per §1.
    if (
      /\bsdp(?:\.js)?\s+(?:--\s+)?(?:new|build|validate|view|census|mermaid|gherkin)\b/.test(st) &&
      !targetsScratchRoot(st)
    ) {
      return true;
    }
    // sdp import writes carrier files unless --dry-run keeps it on stdout.
    if (
      /\bsdp(?:\.js)?\s+(?:--\s+)?import\b/.test(st) &&
      !/--dry-run\b/.test(st) &&
      !targetsScratchRoot(st)
    ) {
      return true;
    }
    if (/\b(?:npm\s+run|pnpm(?:\s+run)?)\s+(?:--silent\s+)?(?:sdp\s+--\s+)?build\b/.test(st)) {
      return true;
    }
    // Repository scripts that regenerate product bytes: generate:*, the
    // projection-suite driver, the full gate and its writing sub-gates, and
    // prettier --write. check:temporal, check:self-hosting-gates, and
    // format:check are read-only and remain non-closers.
    if (/\bgenerate:[A-Za-z0-9:_-]+/.test(st)) return true;
    if (/\bprojection-suite\.mjs\b/.test(st) && !targetsScratchRoot(st)) return true;
    if (
      /\b(?:npm\s+run|pnpm(?:\s+run)?)\s+(?:--silent\s+)?(?:check(?::self-hosting|:example)?|format)(?![\w:-])/.test(
        st,
      )
    ) {
      return true;
    }
  }
  return false;
}

function die(code, msg) {
  process.stderr.write(msg.endsWith("\n") ? msg : `${msg}\n`);
  process.exit(code);
}

function sha256(buf) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function walkFind(start, rel) {
  let dir = start;
  for (let i = 0; i < 12; i++) {
    const candidate = path.join(dir, rel);
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return null;
}

function loadCatalog() {
  const rel = path.join("docs", "agent-surface", "recipes.md");
  const catalogPath =
    walkFind(process.cwd(), rel) || walkFind(SCRIPT_DIR, rel);
  if (!catalogPath) {
    die(1, "census: cannot find docs/agent-surface/recipes.md from cwd or script dir");
  }
  const text = fs.readFileSync(catalogPath, "utf8");
  const recipes = parseCatalog(text);
  if (recipes.length !== 16) {
    die(1, `census: expected 16 catalog recipes, found ${recipes.length} in ${catalogPath}`);
  }
  return {
    path: catalogPath,
    sha256: sha256(fs.readFileSync(catalogPath)),
    recipes,
  };
}

function parseCatalog(text) {
  const heading = /^## (\d+)\.\s+/gm;
  const starts = [];
  let m;
  while ((m = heading.exec(text))) {
    starts.push({ id: Number(m[1]), index: m.index });
  }
  const recipes = [];
  for (let i = 0; i < starts.length; i++) {
    const { id, index } = starts[i];
    const end = i + 1 < starts.length ? starts[i + 1].index : text.length;
    const section = text.slice(index, end);
    const fences = [];
    const fenceRe = /```js\n([\s\S]*?)```/g;
    let f;
    while ((f = fenceRe.exec(section))) fences.push(f[1]);
    if (fences.length === 0) continue;
    // Recipe 4 (and any section with a demo fence) uses the last js fence as the identity body.
    const raw = fences[fences.length - 1];
    recipes.push({
      id,
      raw,
      canonical: canonicalizeBody(raw),
      normalized: normalizeRecipeBody(canonicalizeBody(raw), id),
    });
  }
  return recipes;
}

function canonicalizeBody(raw) {
  let s = String(raw).replace(/^\uFEFF/, "").trim();
  const wrapped =
    /^async\s*\(\s*\)\s*=>\s*\{([\s\S]*)\}$/.exec(s) ||
    /^async\s+function\s*\(\s*\)\s*\{([\s\S]*)\}$/.exec(s);
  if (wrapped) s = wrapped[1].trim();
  return s.replace(/[ \t\r\n]+/g, " ").trim();
}

function normalizeRecipeBody(canonical, recipeId) {
  if (!PARAM_RECIPES.has(recipeId)) return canonical;
  const name = PARAM_NAME[recipeId];
  const re = new RegExp(`const ${name}\\s*=\\s*(?:"(?:\\\\.|[^"])*"|'(?:\\\\.|[^'])*')`);
  return canonical.replace(re, `const ${name} = $PARAM`);
}

function matchRecipe(canonical, catalog) {
  if (!canonical) return { id: "missing", normalized: "" };
  for (const rec of catalog.recipes) {
    const left = normalizeRecipeBody(canonical, rec.id);
    if (left === rec.normalized) return { id: rec.id, normalized: left };
  }
  return { id: "unmatched", normalized: canonical };
}

function collectAssignments(command) {
  const vars = Object.create(null);
  const s = command;
  let i = 0;
  while (i < s.length) {
    const rest = s.slice(i);
    const am = /^([A-Za-z_][A-Za-z0-9_]*)=/.exec(rest);
    if (!am) {
      i += 1;
      continue;
    }
    // Only treat as assignment at statement / separator boundary.
    if (i > 0 && !/[\s;&|()]/.test(s[i - 1])) {
      i += 1;
      continue;
    }
    const name = am[1];
    let j = i + am[0].length;
    const parsed = readValue(s, j);
    vars[name] = parsed.value;
    i = parsed.end;
  }
  return vars;
}

function readValue(s, start) {
  if (start >= s.length) return { value: "", end: start };
  const q = s[start];
  if (q === "'" || q === '"') {
    let i = start + 1;
    let out = "";
    while (i < s.length) {
      const ch = s[i];
      if (q === "'" && ch === "'") {
        if (s.slice(i, i + 4) === "'\\''") {
          out += "'";
          i += 4;
          continue;
        }
        return { value: out, end: i + 1 };
      }
      if (q === '"' && ch === "\\") {
        out += s[i + 1] ?? "";
        i += 2;
        continue;
      }
      if (q === '"' && ch === '"') return { value: out, end: i + 1 };
      out += ch;
      i += 1;
    }
    return { value: out, end: s.length };
  }
  let i = start;
  while (i < s.length && !/[\s;&|]/.test(s[i])) i += 1;
  return { value: s.slice(start, i), end: i };
}

function skipWs(s, i) {
  while (i < s.length && /\s/.test(s[i])) i += 1;
  return i;
}

function readToken(s, start) {
  const i0 = skipWs(s, start);
  if (i0 >= s.length) return { raw: "", value: "", end: i0, kind: "eof" };
  const ch = s[i0];
  if (ch === "'" || ch === '"') {
    const v = readValue(s, i0);
    return { raw: s.slice(i0, v.end), value: v.value, end: v.end, kind: "quoted" };
  }
  let i = i0;
  while (i < s.length && !/\s/.test(s[i])) i += 1;
  const raw = s.slice(i0, i);
  return { raw, value: raw, end: i, kind: "word" };
}

function resolveBodyToken(token, vars) {
  const raw = token.raw;
  const value = token.value;
  if (token.kind === "eof" || raw === "") return { body: "", status: "missing" };
  if (/^\$\(/.test(raw) || /^["']\$\(/.test(raw)) {
    return { body: "", status: "unresolved", note: "command_substitution" };
  }
  const dollar = /^\$\{?([A-Za-z_][A-Za-z0-9_]*)\}?$/.exec(raw.replace(/^["']|["']$/g, ""));
  if (dollar) {
    if (Object.prototype.hasOwnProperty.call(vars, dollar[1])) {
      return { body: vars[dollar[1]], status: "ok" };
    }
    return { body: "", status: "unresolved", note: `unset:${dollar[1]}` };
  }
  if (token.kind === "quoted") return { body: value, status: "ok" };
  // Unquoted $var
  const bare = /^\$\{?([A-Za-z_][A-Za-z0-9_]*)\}?$/.exec(raw);
  if (bare) {
    if (Object.prototype.hasOwnProperty.call(vars, bare[1])) {
      return { body: vars[bare[1]], status: "ok" };
    }
    return { body: "", status: "unresolved", note: `unset:${bare[1]}` };
  }
  if (raw.startsWith("-")) return { body: "", status: "missing", note: "flags_only" };
  return { body: value, status: "ok" };
}

function findInvocationHeads(command) {
  const heads = [];
  const re = new RegExp(INVOCATION_HEAD.source, "g");
  let m;
  while ((m = re.exec(command))) {
    const before = command.slice(Math.max(0, m.index - 24), m.index);
    if (/(?:^|[\s;|&])(?:grep|rg|echo|printf|cat|sed|awk|head|tail)\s*$/.test(before)) {
      continue;
    }
    // `sdp q` inside a larger word / help text after a quote-only mention
    heads.push({ index: m.index, text: m[0], end: m.index + m[0].length });
  }
  return heads;
}

function extractInvocationsFromCommand(command) {
  const vars = collectAssignments(command);
  const heads = findInvocationHeads(command);
  const out = [];
  for (const head of heads) {
    let i = head.end;
    let flags = [];
    let bodyTok = null;
    while (i < command.length) {
      // stop at pipe/separator that starts a new statement, but allow `2>&1`
      const peek = skipWs(command, i);
      if (peek >= command.length) break;
      if (/^[;&\n]/.test(command[peek])) break;
      if (command.startsWith("||", peek) || command.startsWith("&&", peek)) break;
      if (command[peek] === "|" && command[peek + 1] !== "&") break;
      const tok = readToken(command, i);
      if (tok.kind === "eof") break;
      if (tok.raw === "--") {
        i = tok.end;
        continue;
      }
      if (tok.raw === "--json") {
        flags.push("--json");
        i = tok.end;
        continue;
      }
      if (tok.raw === "--root" || tok.raw === "--exclude") {
        const nxt = readToken(command, tok.end);
        flags.push(tok.raw, nxt.raw);
        i = nxt.end;
        continue;
      }
      if (tok.raw.startsWith("-") && tok.kind === "word") {
        flags.push(tok.raw);
        i = tok.end;
        continue;
      }
      bodyTok = tok;
      i = tok.end;
      break;
    }
    const resolved = bodyTok
      ? resolveBodyToken(bodyTok, vars)
      : { body: "", status: "missing" };
    out.push({
      runner: head.text.replace(/\s+/g, " ").trim(),
      flags,
      bodyStatus: resolved.status,
      body: resolved.body,
      note: resolved.note || "",
    });
  }
  return out.filter(isCountableInvocation);
}

function looksLikeQueryBody(body) {
  const c = canonicalizeBody(body);
  if (!c) return false;
  if (/\bg\s*\./.test(c)) return true;
  if (/\bgraph\s*\./.test(c)) return true;
  if (/\breport\s*\./.test(c)) return true;
  if (/\bJSON\.parse\s*\(\s*process\.env/.test(c)) return true;
  if (/\breturn\s*\{/.test(c)) return true;
  return false;
}

function isWrapperRunner(runner) {
  return /(?:npm|pnpm|node\s|dist\/cli\/sdp\.js)/.test(runner);
}

// Prose mentions ("fresh sdp:q readiness", "ran sdp:q") are not invocations.
// A real call has a JS body, a $var / $(...) body, or a wrapper with no recoverable body.
function isCountableInvocation(item) {
  if (item.bodyStatus === "unresolved") return true;
  if (item.bodyStatus === "missing") return isWrapperRunner(item.runner);
  if (item.bodyStatus === "ok" && looksLikeQueryBody(item.body)) return true;
  return false;
}

function isProductPath(p) {
  if (!p || typeof p !== "string") return false;
  let n = p.replace(/\\/g, "/");
  const marker = "software-delivery-protocol/";
  const idx = n.lastIndexOf(marker);
  if (idx !== -1) n = n.slice(idx + marker.length);
  n = n.replace(/^\.\//, "");
  if (n.startsWith(".omo/")) return false;
  if (n === "AGENTS.md") return true;
  if (n.startsWith("src/") || n === "src") return true;
  if (n.startsWith("specs/") || n === "specs") return true;
  if (n.startsWith("generated/") || n === "generated") return true;
  if (n.startsWith("plans/") || n === "plans") return true;
  if (n.startsWith("docs/") || n === "docs") return true;
  if (n.startsWith("test/")) return true;
  if (n.startsWith("package.json") || n === "package.json") return true;
  return false;
}

function isCloserEvent(ev) {
  if (ev.kind === "edit" || ev.kind === "write") return isProductPath(ev.path);
  if (ev.kind === "bash") return bashIsCloser(ev.command || "");
  return false;
}

function toolSuccess(result) {
  if (!result) return { success: "unknown", reason: "no_result" };
  if (result.isError === true) return { success: "no", reason: "isError" };
  const status = result.details && result.details.status;
  if (status && /^(error|failed|aborted|timeout)$/i.test(String(status))) {
    return { success: "no", reason: `status:${status}` };
  }
  return { success: "yes", reason: status ? `status:${status}` : "ok" };
}

function textFromContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  const parts = [];
  for (const c of content) {
    if (typeof c === "string") parts.push(c);
    else if (c && typeof c === "object" && typeof c.text === "string") parts.push(c.text);
  }
  return parts.join("");
}

function byteLen(s) {
  return Buffer.byteLength(String(s), "utf8");
}

async function readJsonl(filePath) {
  const stream = fs.createReadStream(filePath, { encoding: "utf8" });
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  const records = [];
  let malformed = 0;
  let lines = 0;
  for await (const line of rl) {
    lines += 1;
    if (line.trim() === "") continue;
    try {
      records.push(JSON.parse(line));
    } catch {
      malformed += 1;
    }
  }
  return { records, malformed, lines };
}

function detectKind(records) {
  for (const rec of records) {
    if (rec && typeof rec === "object") {
      if (typeof rec.event === "string" && Array.isArray(rec.commands)) return "ledger";
      if (rec.type === "session" || rec.type === "message") return "session";
    }
  }
  return "session";
}

function sessionMeta(records, filePath) {
  const sess = records.find((r) => r && r.type === "session");
  return {
    id: (sess && sess.id) || path.basename(filePath, ".jsonl"),
    cwd: (sess && sess.cwd) || "",
    started: (sess && sess.timestamp) || "",
  };
}

function censusSession(records, filePath, catalog) {
  const meta = sessionMeta(records, filePath);
  const resultsByCall = new Map();
  const timeline = [];

  for (const rec of records) {
    if (!rec || rec.type !== "message") continue;
    const msg = rec.message || {};
    const ts = rec.timestamp || msg.timestamp || "";
    if (msg.role === "toolResult") {
      resultsByCall.set(msg.toolCallId, {
        isError: msg.isError,
        details: msg.details || {},
        text: textFromContent(msg.content),
        toolName: msg.toolName,
        ts,
      });
      continue;
    }
    if (msg.role !== "assistant") continue;
    const content = msg.content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (!part || part.type !== "toolCall") continue;
      const name = part.name || "";
      const args = part.arguments || {};
      if (name === "bash") {
        timeline.push({
          kind: "bash",
          id: part.id,
          ts,
          command: args.command || args.cmd || "",
        });
      } else if (name === "edit" || name === "write" || name === "apply_patch") {
        timeline.push({
          kind: name === "write" ? "write" : "edit",
          id: part.id,
          ts,
          path: args.path || args.filePath || args.file || "",
        });
      }
    }
  }

  const invocations = [];
  for (const ev of timeline) {
    if (ev.kind !== "bash") continue;
    const extracted = extractInvocationsFromCommand(ev.command);
    if (extracted.length === 0) continue;
    const result = resultsByCall.get(ev.id);
    const ok = toolSuccess(result);
    const shared = extracted.length !== 1;
    const resultBytes = result ? byteLen(result.text) : null;
    for (const item of extracted) {
      let recipe;
      if (item.bodyStatus === "unresolved") {
        recipe = { id: "unresolved", normalized: "" };
      } else if (item.bodyStatus === "missing") {
        recipe = { id: "missing", normalized: "" };
      } else {
        recipe = matchRecipe(canonicalizeBody(item.body), catalog);
      }
      invocations.push({
        ts: ev.ts,
        toolCallId: ev.id,
        runner: item.runner,
        flags: item.flags,
        recipeId: recipe.id,
        bodyStatus: item.bodyStatus,
        bodyBytes: item.body ? byteLen(item.body) : 0,
        bodySha256: item.body ? sha256(item.body).slice(0, 16) : "",
        success: ok.success,
        successReason: ok.reason,
        outputBytes: shared || resultBytes === null ? "unknown" : resultBytes,
        toolResultBytes: resultBytes === null ? "unknown" : resultBytes,
        sharedResult: shared,
        note: item.note || "",
        preview: item.body ? canonicalizeBody(item.body).slice(0, 96) : "",
      });
    }
  }

  const windows = candidateWindows(timeline, invocations);
  const matchedIds = invocations
    .map((inv) => inv.recipeId)
    .filter((id) => typeof id === "number");
  const distinct = [...new Set(matchedIds)].sort((a, b) => a - b);

  return {
    kind: "session",
    file: filePath,
    sessionId: meta.id,
    cwd: meta.cwd,
    started: meta.started,
    invocations,
    windows,
    distinctIds: distinct,
    recipeSequence: invocations.map((inv) => inv.recipeId),
  };
}

function candidateWindows(timeline, invocations) {
  const byCall = new Map();
  for (const inv of invocations) {
    if (!byCall.has(inv.toolCallId)) byCall.set(inv.toolCallId, []);
    byCall.get(inv.toolCallId).push(inv);
  }
  const windows = [];
  let open = null;
  let seq = 0;
  for (const ev of timeline) {
    const invs = byCall.get(ev.id) || [];
    if (invs.length > 0) {
      for (const inv of invs) {
        seq += 1;
        inv.seq = seq;
        if (inv.success === "yes") {
          if (!open) {
            open = {
              index: windows.length + 1,
              openSeq: seq,
              openTs: inv.ts,
              closeSeq: null,
              closeTs: null,
              closeReason: "session-end",
              seqs: [],
            };
          }
          open.seqs.push(seq);
        }
      }
      continue;
    }
    if (open && isCloserEvent(ev)) {
      const extra = ev.path
        ? ev.path
        : ev.command
          ? ev.command.replace(/\s+/g, " ").slice(0, 80)
          : "";
      open.closeReason = extra ? `${ev.kind}:${extra}` : ev.kind;
      open.closeTs = ev.ts;
      open.closeSeq = seq;
      windows.push(open);
      open = null;
    }
  }
  if (open) windows.push(open);
  return windows.map((w) => {
    const slice = invocations.filter((inv) => w.seqs.includes(inv.seq));
    const ids = [
      ...new Set(slice.map((inv) => inv.recipeId).filter((id) => typeof id === "number")),
    ].sort((a, b) => a - b);
    return {
      ...w,
      recipeSequence: slice.map((inv) => inv.recipeId),
      distinctIds: ids,
    };
  });
}

function censusLedger(records, filePath, catalog) {
  const bySession = new Map();
  for (const rec of records) {
    if (!rec || typeof rec !== "object") continue;
    const sid = rec.session_id || rec.sessionId || "unknown-session";
    if (!bySession.has(sid)) {
      bySession.set(sid, {
        kind: "ledger",
        file: filePath,
        sessionId: sid,
        cwd: "",
        started: "",
        invocations: [],
        windows: [],
        events: 0,
      });
    }
    const bucket = bySession.get(sid);
    bucket.events += 1;
    const cmds = rec.commands || [];
    for (const cmd of cmds) {
      if (typeof cmd !== "string") continue;
      const extracted = extractInvocationsFromCommand(cmd);
      for (const item of extracted) {
        let recipe;
        if (item.bodyStatus === "unresolved") recipe = { id: "unresolved" };
        else if (item.bodyStatus === "missing") recipe = { id: "missing" };
        else recipe = matchRecipe(canonicalizeBody(item.body), catalog);
        bucket.invocations.push({
          ts: rec.event || "",
          toolCallId: "",
          runner: item.runner,
          flags: item.flags,
          recipeId: recipe.id,
          bodyStatus: item.bodyStatus,
          bodyBytes: item.body ? byteLen(item.body) : 0,
          bodySha256: item.body ? sha256(item.body).slice(0, 16) : "",
          success: rec.event === "task-completed" || rec.event === "verification-confirmed"
            ? "claimed"
            : "unknown",
          successReason: rec.event || "ledger",
          outputBytes: "unknown",
          toolResultBytes: "unknown",
          sharedResult: false,
          note: item.note || `ledger:${rec.plan || ""}:${String(rec.task || "").slice(0, 48)}`,
          preview: item.body ? canonicalizeBody(item.body).slice(0, 96) : "",
        });
      }
    }
  }
  const sessions = [];
  for (const bucket of bySession.values()) {
    bucket.invocations.forEach((inv, i) => {
      inv.seq = i + 1;
    });
    bucket.recipeSequence = bucket.invocations.map((inv) => inv.recipeId);
    bucket.distinctIds = [
      ...new Set(bucket.recipeSequence.filter((id) => typeof id === "number")),
    ].sort((a, b) => a - b);
    bucket.windows = [];
    bucket.windowNote = "ledger has no ordered mutation timeline; candidate windows unavailable";
    sessions.push(bucket);
  }
  sessions.sort((a, b) => a.sessionId.localeCompare(b.sessionId));
  return sessions;
}

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s : s + " ".repeat(n - s.length);
}

function printSession(report, catalog, extras) {
  const lines = [];
  lines.push("================================================================");
  lines.push(`kind            ${report.kind}`);
  lines.push(`file            ${report.file}`);
  lines.push(`session_id      ${report.sessionId}`);
  if (report.cwd) lines.push(`cwd             ${report.cwd}`);
  if (report.started) lines.push(`started         ${report.started}`);
  if (extras) {
    lines.push(`jsonl_lines     ${extras.lines}`);
    lines.push(`malformed_lines ${extras.malformed}`);
  }
  lines.push(`catalog         ${catalog.path}`);
  lines.push(`catalog_sha256  ${catalog.sha256}`);
  lines.push(`invocations     ${report.invocations.length}`);
  lines.push(`recipe_sequence ${report.recipeSequence.length ? report.recipeSequence.join(",") : "(none)"}`);
  lines.push(`distinct_ids    ${report.distinctIds.length ? report.distinctIds.join(",") : "(none)"}`);
  lines.push(`distinct_count  ${report.distinctIds.length}`);
  if (report.windowNote) lines.push(`windows_note    ${report.windowNote}`);
  lines.push("");
  lines.push("seq recipe     ok       out_bytes   body_bytes body_sha256     runner");
  lines.push("--- ---------- -------- ----------- ---------- --------------- ------------------------------");
  if (report.invocations.length === 0) {
    lines.push("(no sdp q / sdp:q invocations)");
  } else {
    for (const inv of report.invocations) {
      lines.push(
        [
          pad(inv.seq, 3),
          pad(inv.recipeId, 10),
          pad(inv.success, 8),
          pad(inv.outputBytes, 11),
          pad(inv.bodyBytes, 10),
          pad(inv.bodySha256, 15),
          inv.runner,
        ].join(" "),
      );
      if (inv.note || inv.preview) {
        lines.push(`    note=${inv.note || "-"} preview=${inv.preview || "-"}`);
      }
      if (inv.sharedResult) {
        lines.push(`    shared_tool_result_bytes=${inv.toolResultBytes} (per-invocation stdout not separable)`);
      }
    }
  }
  lines.push("");
  lines.push("candidate_windows:");
  if (!report.windows || report.windows.length === 0) {
    lines.push("  (none)");
  } else {
    for (const w of report.windows) {
      lines.push(
        `  W${w.index} open_seq=${w.openSeq} open_ts=${w.openTs || "-"} close=${w.closeReason}` +
          ` close_seq=${w.closeSeq ?? "end"} recipes=${w.recipeSequence.join(",") || "(none)"}` +
          ` distinct=${w.distinctIds.join(",") || "(none)"}`,
      );
    }
  }
  lines.push("================================================================");
  process.stdout.write(`${lines.join("\n")}\n`);
}

function selfCheck(catalog) {
  const records = [
    {
      type: "session",
      id: "census-self-check",
      timestamp: "1970-01-01T00:00:00.000Z",
      cwd: process.cwd(),
    },
  ];
  const calls = [];
  for (const rec of catalog.recipes) {
    const id = `tool_exact_${rec.id}`;
    calls.push({
      type: "toolCall",
      id,
      name: "bash",
      arguments: {
        command: `npm run --silent sdp:q -- '${rec.raw.replace(/'/g, "'\\''")}' --json`,
      },
    });
    records.push({
      type: "message",
      id: `res_${id}`,
      timestamp: "1970-01-01T00:00:01.000Z",
      message: {
        role: "toolResult",
        toolCallId: id,
        toolName: "bash",
        isError: false,
        details: { status: "completed" },
        content: [{ type: "text", text: `{"recipe":${rec.id}}` }],
      },
    });
  }
  const param3 = catalog.recipes.find((r) => r.id === 3).raw.replace(
    "spec:consumers.reader",
    "spec:model.core-model",
  );
  calls.push({
    type: "toolCall",
    id: "tool_param_3",
    name: "bash",
    arguments: { command: `pnpm --silent sdp:q '${param3.replace(/'/g, "'\\''")}'` },
  });
  records.push({
    type: "message",
    id: "res_param_3",
    timestamp: "1970-01-01T00:00:01.000Z",
    message: {
      role: "toolResult",
      toolCallId: "tool_param_3",
      toolName: "bash",
      isError: false,
      details: { status: "completed" },
      content: [{ type: "text", text: "{found:true}" }],
    },
  });
  records.splice(1, 0, {
    type: "message",
    id: "assistant_calls",
    timestamp: "1970-01-01T00:00:00.500Z",
    message: { role: "assistant", content: calls },
  });
  const report = censusSession(records, "<self-check>", catalog);
  printSession(report, catalog, { lines: records.length, malformed: 0 });
  const expected = catalog.recipes.map((r) => r.id).concat([3]);
  const got = report.recipeSequence;
  const same =
    got.length === expected.length && got.every((id, i) => id === expected[i]);
  if (!same) {
    die(1, `census --self-check: expected sequence ${expected.join(",")} got ${got.join(",")}`);
  }
  process.stdout.write("self-check: 16 exact catalog bodies + recipe-3 param variant matched\n");
}

async function main(argv) {
  if (argv.includes("-h") || argv.includes("--help") || argv.length === 0) {
    process.stdout.write(
      [
        "census.mjs — read-only Brief K recipe census",
        "usage: node census.mjs <session.jsonl|ledger.jsonl> [more...]",
        "       node census.mjs --self-check",
        "",
        "Writes nothing. Prints a per-session table (recipe sequence, distinct ids,",
        "output byte sizes, candidate windows). Bytes only; never tokens.",
        "",
        "malformed / truncated jsonl: each unparseable line increments malformed_lines",
        "and is skipped; exit 0 if the file itself was readable.",
        "missing path: exit 1 with a clean error on stderr.",
        "",
      ].join("\n"),
    );
    process.exit(argv.length === 0 ? 2 : 0);
  }

  const catalog = loadCatalog();
  if (argv.includes("--self-check")) {
    selfCheck(catalog);
    return;
  }
  let anyMissing = false;

  for (const arg of argv) {
    const resolved = path.resolve(arg);
    if (!fs.existsSync(resolved)) {
      process.stderr.write(`census: path does not exist: ${arg}\n`);
      anyMissing = true;
      continue;
    }
    const st = fs.statSync(resolved);
    if (!st.isFile()) {
      process.stderr.write(`census: not a file: ${arg}\n`);
      anyMissing = true;
      continue;
    }
    let parsed;
    try {
      parsed = await readJsonl(resolved);
    } catch (err) {
      process.stderr.write(`census: cannot read ${arg}: ${err.message}\n`);
      anyMissing = true;
      continue;
    }
    const kind = detectKind(parsed.records);
    if (kind === "ledger") {
      const sessions = censusLedger(parsed.records, resolved, catalog);
      process.stdout.write(
        `ledger_file ${resolved} events=${parsed.records.length} sessions_with_or_without_invocations=${sessions.length} malformed_lines=${parsed.malformed} jsonl_lines=${parsed.lines}\n`,
      );
      for (const report of sessions) {
        if (report.invocations.length === 0) continue;
        printSession(report, catalog, parsed);
      }
      const empty = sessions.filter((s) => s.invocations.length === 0).length;
      process.stdout.write(`ledger_sessions_with_zero_sdp_q ${empty}\n`);
    } else {
      const report = censusSession(parsed.records, resolved, catalog);
      printSession(report, catalog, parsed);
    }
  }

  if (anyMissing) process.exit(1);
}

main(process.argv.slice(2)).catch((err) => {
  die(1, `census: ${err && err.stack ? err.stack : err}`);
});
