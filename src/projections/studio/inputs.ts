/**
 * @sdpAnchor impl:protocol.studio-inputs
 * @sdpLabel named base graph and run input contract
 * @sdpSatisfies spec:consumers.spec-studio.data.inputs
 * @sdpComponent component:protocol.projections
 * @sdpRole contract
 */
export interface StudioInputs {
  readonly base?: { readonly graph: unknown; readonly label: string | null };
  readonly runs: readonly unknown[];
}
