import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { expect } from "vitest";
import { parse } from "yaml";
import { mapCodeSpans } from "../../src/projections/studio/pages/code-spans.js";

export function put(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}
export function carrier(
  id: string,
  title = "Member",
  kind = "behavior",
  readiness = "idea",
  extra = "",
  relations = "{}",
): string {
  return `---\nid: ${id}\nkind: ${kind}\naltitude: story\nreadiness: ${readiness}\nrelations: ${relations}\n---\n# ${title}\n\n## Intent\n- outcome: Read the graph.\n${extra}`;
}
export function probe(root: string, title = "Member"): void {
  put(join(root, "member.sdp.md"), carrier("spec:probe.member", title));
  put(join(root, "other.sdp.md"), carrier("spec:probe.other", "Other"));
  put(
    join(root, "probe.pack.sdp.md"),
    "---\nid: pack:probe\nspecs: [spec:probe.member, spec:probe.other]\n---\n# Probe\n",
  );
}
export function snapshot(root: string): Record<string, { content: string; mtime: number }> {
  const result: Record<string, { content: string; mtime: number }> = {};
  if (!existsSync(root)) return result;
  const walk = (folder: string): void => {
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name);
      if (entry.isDirectory()) walk(path);
      else
        result[relative(root, path)] = {
          content: readFileSync(path, "utf8"),
          mtime: statSync(path).mtimeMs,
        };
    }
  };
  walk(root);
  return result;
}
export function bytes(root: string): Record<string, string> {
  return Object.fromEntries(Object.entries(snapshot(root)).map(([p, f]) => [p, f.content]));
}
export function checkLinks(out: string): number {
  let count = 0;
  for (const [path, content] of Object.entries(bytes(join(out, "sdp")))) {
    if (!path.endsWith(".md")) continue;
    // Fenced examples and code spans are not links in Obsidian.
    const prose = content.replace(/^(`{3,})[^\n]*\n[\s\S]*?^\1\s*$/gmu, "");
    const plain = mapCodeSpans(
      prose,
      (s) => s,
      () => "",
    );
    for (const match of plain.matchAll(/(?<!\\)\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/gu)) {
      const [target = "", block] = (match[1] ?? "").split("#^");
      expect(existsSync(join(out, target)), `${path} -> ${target}`).toBe(true);
      if (block !== undefined)
        expect(readFileSync(join(out, target), "utf8"), `${path} -> ${target}#^${block}`).toMatch(
          new RegExp(` \\^${block}$`, "m"),
        );
      count++;
    }
  }
  return count;
}
export interface Note {
  readonly path: string;
  readonly props: Record<string, unknown>;
}
export function readNotes(out: string): Note[] {
  return Object.entries(bytes(join(out, "sdp")))
    .filter(([path]) => path.startsWith("specs/") && path.endsWith(".md"))
    .map(([path, content]) => ({
      path: `sdp/${path}`,
      props: parse(content.split("---\n")[1] ?? "") as Record<string, unknown>,
    }));
}
export function clauseMatches(clause: string, note: Note): boolean {
  let m = /^file\.inFolder\("([^"]+)"\)$/u.exec(clause);
  if (m) return note.path.startsWith(`${m[1] ?? ""}/`);
  m = /^(\w+)\.contains\(link\("([^"]+)"\)\)$/u.exec(clause);
  if (m) {
    const values = note.props[m[1] ?? ""],
      target = m[2] ?? "";
    return (
      Array.isArray(values) &&
      values.some((value: unknown) => typeof value === "string" && value.startsWith(`[[${target}|`))
    );
  }
  m = /^(!?)(\w+)\.isEmpty\(\)$/u.exec(clause);
  if (m) {
    const value = note.props[m[2] ?? ""];
    const empty =
      value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
    return m[1] ? !empty : empty;
  }
  m = /^(\w+) (==|!=|>) ("[^"]*"|true|false|0)$/u.exec(clause);
  if (m) {
    const left = note.props[m[1] ?? ""];
    const right: unknown = JSON.parse(m[3] ?? "null");
    return m[2] === "=="
      ? left === right
      : m[2] === "!="
        ? left !== right
        : typeof left === "number" && left > 0;
  }
  throw new Error(`not a closed filter clause: ${clause}`);
}
