export function trackedRegistrarDifferences(path, expected, worktree, index) {
  if (expected === undefined) {
    return [`${path} (tracked registrar is no longer owed)`];
  }

  const differences = [];
  if (worktree !== expected) {
    differences.push(`${path} (worktree bytes differ)`);
  }
  if (index !== expected) {
    differences.push(`${path} (Git index bytes differ)`);
  }
  return differences;
}
