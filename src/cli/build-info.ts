// The record the build leaves beside the compiled CLI, shared by the build step that writes it
// and `sdp --version`, which reads it. The CLI never runs git: the commit is whatever the build
// recorded, or `unknown`.

/** The file name, resolved beside the compiled CLI module (`dist/cli/` in the package). */
export const BUILD_INFO_FILE = "build-info.json";

export const UNKNOWN_COMMIT = "unknown";

/** A full Git object name: SHA-1 (40 hex digits) or SHA-256 (64). */
const fullCommitPattern = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/u;

export function isFullCommit(value: unknown): value is string {
  return typeof value === "string" && fullCommitPattern.test(value);
}

export interface BuildInfo {
  readonly commit: string;
}

export function serializeBuildInfo(info: BuildInfo): string {
  return `${JSON.stringify({ commit: info.commit })}\n`;
}

/** Any unreadable, malformed, or off-grammar record reads as `unknown`, never as a guess. */
export function parseBuildCommit(text: string): string {
  try {
    const parsed = JSON.parse(text) as unknown;
    const commit =
      typeof parsed === "object" && parsed !== null
        ? (parsed as Record<string, unknown>).commit
        : undefined;

    return isFullCommit(commit) ? commit : UNKNOWN_COMMIT;
  } catch {
    return UNKNOWN_COMMIT;
  }
}
