// Preloaded with `--import` into a copy of the session-start hook that a test starts while it holds
// the event's lock. The first time the copy finds a lock held, this writes the file that
// `SDP_TEST_LOCK_SIGNAL` names, so the test changes the claim or releases the lock only once the
// copy waits on it. The hook itself is unchanged.

import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";

const signal = process.env.SDP_TEST_LOCK_SIGNAL;
const write = fs.writeFileSync;
let signalled = false;

fs.writeFileSync = (path, ...rest) => {
  try {
    write(path, ...rest);
  } catch (error) {
    if (
      !signalled &&
      signal !== undefined &&
      error?.code === "EEXIST" &&
      /\.lock$/u.test(String(path))
    ) {
      signalled = true;
      write(signal, "");
    }
    throw error;
  }
};
syncBuiltinESMExports();
