/** Pack and Spec ids admit no underscores, so the uppercase escape remains unambiguous. */
/**
 * @sdpAnchor impl:protocol.studio-paths
 * @sdpLabel encodes uppercase id letters for collision-free Pack and Spec page paths
 * @sdpSatisfies spec:consumers.spec-studio.publisher
 * @sdpComponent component:protocol.projections
 * @sdpRole codec
 */
export function pagePath(id: string): string | null {
  const namespace = id.startsWith("spec:") ? "specs" : id.startsWith("pack:") ? "packs" : null;
  if (namespace === null) return null;
  const name = id
    .slice(id.indexOf(":") + 1)
    .replace(/[A-Z]/gu, (letter) => `_${letter.toLowerCase()}`);
  return `${namespace}/${name}.html`;
}

export function slicePath(id: string): string {
  const path = pagePath(id);
  if (path === null || !id.startsWith("pack:")) throw new Error(`Slice has no Pack path: ${id}`);
  return path.replace(/^packs\//u, "slices/");
}
