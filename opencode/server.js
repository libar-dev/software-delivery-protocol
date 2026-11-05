// OpenCode's compatibility shim for the session-start hook (spec:consumers.agent-client-support).
// OpenCode runs no command hooks, so this plugin module runs the package's one script, asking for
// the text alone, the first time a top-level session reaches the model, and adds the answers to
// that session's context on each model call. It holds no answer of its own. A project names this
// folder under `plugins` in its OpenCode config.

import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("../hooks/session-start.mjs", import.meta.url));

/** The script's answers for a session in `directory`, or "" when it prints none or fails. */
export function orient(directory) {
  return new Promise((settle) => {
    // `node` from the path: inside OpenCode, `process.execPath` is OpenCode's own runtime.
    const child = execFile(
      "node",
      [script, "--text"],
      { cwd: directory, timeout: 30_000, maxBuffer: 8 * 1024 * 1024 },
      (_error, stdout) => {
        settle(String(stdout ?? "").trim());
      },
    );
    child.stdin?.end(
      JSON.stringify({ cwd: directory, hook_event_name: "SessionStart", source: "startup" }),
    );
  });
}

export default {
  id: "libar-dev.software-delivery-protocol",
  async setup(ctx) {
    const answers = new Map();
    // Each top-level session runs the script once; a subagent's session starts inside one. Calls
    // that arrive while the lookup runs share it. A lookup that fails is no answer: it is
    // forgotten, so the session's next model call asks again.
    const forSession = (sessionID) => {
      if (!answers.has(sessionID)) {
        const pending = Promise.resolve()
          .then(() => ctx.session.get({ sessionID }))
          .then((session) =>
            session?.parentID ? "" : orient(session?.location?.directory ?? process.cwd()),
          )
          .catch(() => {
            if (answers.get(sessionID) === pending) answers.delete(sessionID);
            return "";
          });
        answers.set(sessionID, pending);
      }
      return answers.get(sessionID);
    };
    await ctx.session.hook("context", async (event) => {
      const text = await forSession(event.sessionID);
      if (text !== "") event.system.push({ type: "text", text });
    });
  },
};
