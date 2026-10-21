import { specOracle, oracleAnchorId } from "@libar-dev/software-delivery-protocol";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, it } from "vitest";
import { specTest, testAnchorId, ref } from "@libar-dev/software-delivery-protocol";
import { unspecified } from "@libar-dev/software-delivery-protocol/runner";
import { graphValidatorIds } from "../src/validate/validators.js";
import { extractFindingIds } from "../src/extract/reify.js";
import {
  auditValidatorEvidence,
  runValidatorProbe,
  scanFindingIds,
} from "./helpers/validator-audit.js";
import type { AuditAnswer, ProbeEntry } from "./helpers/validator-audit.js";
import { validatorProbeTable } from "./helpers/validator-probes.js";
import type {
  ValidatorSelfTestingConditions,
  ValidatorSelfTestingOutcome,
} from "../generated/contracts/validation.validator-self-testing.space.js";
import { shippedChecksPairedContract } from "../generated/contracts/validation.validator-self-testing.shipped-checks-paired.contract.js";
import { registerShippedChecksPaired } from "./validation.validator-self-testing.shipped-checks-paired.test.generated.js";
import { silentCheckNamedContract } from "../generated/contracts/validation.validator-self-testing.silent-check-named.contract.js";
import { registerSilentCheckNamed } from "./validation.validator-self-testing.silent-check-named.test.generated.js";
import { overeagerCheckNamedContract } from "../generated/contracts/validation.validator-self-testing.overeager-check-named.contract.js";
import { registerOvereagerCheckNamed } from "./validation.validator-self-testing.overeager-check-named.test.generated.js";
import { unpairedCheckNamedContract } from "../generated/contracts/validation.validator-self-testing.unpaired-check-named.contract.js";
import { registerUnpairedCheckNamed } from "./validation.validator-self-testing.unpaired-check-named.test.generated.js";
import { duplicatePairNamedContract } from "../generated/contracts/validation.validator-self-testing.duplicate-pair-named.contract.js";
import { registerDuplicatePairNamed } from "./validation.validator-self-testing.duplicate-pair-named.test.generated.js";
import { unregisteredIdNamedContract } from "../generated/contracts/validation.validator-self-testing.unregistered-id-named.contract.js";
import { registerUnregisteredIdNamed } from "./validation.validator-self-testing.unregistered-id-named.test.generated.js";

const registered = [...Object.values(graphValidatorIds), ...Object.values(extractFindingIds)];
const source = scanFindingIds(fileURLToPath(new URL("../src", import.meta.url)));
interface AuditWorld {
  point: Partial<ValidatorSelfTestingConditions>;
  answer?: AuditAnswer;
}
function createWorld(point: Partial<ValidatorSelfTestingConditions>): AuditWorld {
  return { point };
}
function invoke(world: AuditWorld): void {
  const { table: tableName, findingId, behavior, extraSourceId } = world.point;
  let table: readonly ProbeEntry[] = validatorProbeTable;
  if (tableName === "the shipped table without one pair")
    table = table.filter((row) => row.id !== findingId);
  if (tableName === "the shipped table with one pair twice")
    table = [...table, ...table.filter((row) => row.id === findingId)];
  world.answer = auditValidatorEvidence(
    table,
    (probe) => {
      const findings = runValidatorProbe(probe);
      if (behavior === "silently") return findings.filter((f) => f.validatorId !== findingId);
      if (behavior === "overeagerly" && findingId !== undefined)
        return [
          ...findings,
          {
            validatorId: findingId,
            family: "conformance",
            severity: "warning",
            message: "The test wrapper made this check overeager.",
          },
        ];
      return findings;
    },
    registered,
    {
      ...source,
      ids:
        extraSourceId === "nothing" || extraSourceId === undefined
          ? source.ids
          : [...source.ids, extraSourceId],
    },
  );
}
function observe(world: AuditWorld): ValidatorSelfTestingOutcome {
  if (!world.answer) throw new Error("The audit must run before observation.");
  if (
    world.point.table === "the shipped probe table" &&
    world.point.behavior === "as shipped" &&
    world.point.extraSourceId === "nothing"
  ) {
    expect(world.answer, `Validator evidence audit: ${JSON.stringify(world.answer)}`).toEqual({
      unpaired: [],
      duplicatePairs: [],
      strayPairs: [],
      unregistered: [],
      unresolved: [],
      silent: [],
      overeager: [],
    });
  }
  return {
    kind: "the audit {verdict}",
    verdict: Object.values(world.answer).every((list) => list.length === 0) ? "passes" : "fails",
  };
}
const validatorAuditOracleAnchor = specOracle({
  id: oracleAnchorId("oracle:protocol.validator-self-testing"),
  models: ref("spec:validation.validator-self-testing"),
});
void validatorAuditOracleAnchor;

function expected(point: Partial<ValidatorSelfTestingConditions>): ValidatorSelfTestingOutcome {
  if (Object.keys(point).length !== 4) return unspecified;
  return {
    kind: "the audit {verdict}",
    verdict:
      point.table === "the shipped probe table" &&
      point.behavior === "as shipped" &&
      point.extraSourceId === "nothing"
        ? "passes"
        : "fails",
  };
}
type AuditContract =
  | typeof shippedChecksPairedContract
  | typeof silentCheckNamedContract
  | typeof overeagerCheckNamedContract
  | typeof unpairedCheckNamedContract
  | typeof duplicatePairNamedContract
  | typeof unregisteredIdNamedContract;
function assertions(world: AuditWorld, contract: AuditContract): void {
  if (!world.answer) throw new Error("The audit must run before assertions.");
  for (const step of contract.steps) {
    if (step.key === "the audit names {named} as {list}") {
      const actual =
        step.params.list === "none"
          ? Object.values(world.answer).flat()
          : world.answer[step.params.list];
      expect(actual.join(", ") || "nothing").toBe(step.params.named);
      if (step.params.list !== "none") {
        for (const [key, values] of Object.entries(world.answer))
          if (key !== step.params.list) expect(values, key).toEqual([]);
      }
    }
  }
}

const shippedChecksPairedAnchor = specTest({
  id: testAnchorId("test:protocol.validator-self-testing.shipped-checks-paired"),
  verifies: ref("spec:validation.validator-self-testing.shipped-checks-paired"),
});
void shippedChecksPairedAnchor;
registerShippedChecksPaired({
  createWorld,
  invoke,
  observe,
  expected,
  assertions: (world) => {
    assertions(world, shippedChecksPairedContract);
  },
});

const silentCheckNamedAnchor = specTest({
  id: testAnchorId("test:protocol.validator-self-testing.silent-check-named"),
  verifies: ref("spec:validation.validator-self-testing.silent-check-named"),
});
void silentCheckNamedAnchor;
registerSilentCheckNamed({
  createWorld,
  invoke,
  observe,
  expected,
  assertions: (world) => {
    assertions(world, silentCheckNamedContract);
  },
});

const overeagerCheckNamedAnchor = specTest({
  id: testAnchorId("test:protocol.validator-self-testing.overeager-check-named"),
  verifies: ref("spec:validation.validator-self-testing.overeager-check-named"),
});
void overeagerCheckNamedAnchor;
registerOvereagerCheckNamed({
  createWorld,
  invoke,
  observe,
  expected,
  assertions: (world) => {
    assertions(world, overeagerCheckNamedContract);
  },
});

const unpairedCheckNamedAnchor = specTest({
  id: testAnchorId("test:protocol.validator-self-testing.unpaired-check-named"),
  verifies: ref("spec:validation.validator-self-testing.unpaired-check-named"),
});
void unpairedCheckNamedAnchor;
registerUnpairedCheckNamed({
  createWorld,
  invoke,
  observe,
  expected,
  assertions: (world) => {
    assertions(world, unpairedCheckNamedContract);
  },
});

const duplicatePairNamedAnchor = specTest({
  id: testAnchorId("test:protocol.validator-self-testing.duplicate-pair-named"),
  verifies: ref("spec:validation.validator-self-testing.duplicate-pair-named"),
});
void duplicatePairNamedAnchor;
registerDuplicatePairNamed({
  createWorld,
  invoke,
  observe,
  expected,
  assertions: (world) => {
    assertions(world, duplicatePairNamedContract);
  },
});

const unregisteredIdNamedAnchor = specTest({
  id: testAnchorId("test:protocol.validator-self-testing.unregistered-id-named"),
  verifies: ref("spec:validation.validator-self-testing.unregistered-id-named"),
});
void unregisteredIdNamedAnchor;
registerUnregisteredIdNamed({
  createWorld,
  invoke,
  observe,
  expected,
  assertions: (world) => {
    assertions(world, unregisteredIdNamedContract);
  },
});

it("reads all literal quote forms, ignores comments, and locates incomplete ids", () => {
  const root = mkdtempSync(join(tmpdir(), "sdp-finding-scan-"));
  try {
    writeFileSync(
      join(root, "source.ts"),
      [
        '// "conformance/comment-only"',
        'const a = "extract/double";',
        "const b = 'honesty/single';",
        "const c = `conformance/template`;",
        'const d = "extract/" + part;',
        "const e = `honesty/${part}`;",
        'const regex = /"extract\\/regex-only"/;',
        'const after = `prefix ${part} tail`; const literal = "extract/after-template";',
        "const f = `extract/foo-${part}`;",
      ].join("\n"),
    );
    expect(scanFindingIds(root)).toEqual({
      ids: ["conformance/template", "extract/after-template", "extract/double", "honesty/single"],
      unresolved: ["source.ts:5", "source.ts:6", "source.ts:9"],
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

it("names stray pairs, runtime-only ids and unresolved source locations, once and sorted", () => {
  const answer = auditValidatorEvidence(
    [{ id: "extract/stray", refusing: { carriers: {} }, accepting: { carriers: {} } }],
    () => [
      {
        validatorId: "extract/runtime-only",
        family: "conformance",
        severity: "error",
        message: "A computed finding id.",
      },
    ],
    [],
    {
      ids: ["extract/source-only", "extract/source-only"],
      unresolved: ["z.ts:4", "a.ts:2", "z.ts:4"],
    },
  );
  expect(answer).toEqual({
    unpaired: [],
    duplicatePairs: [],
    strayPairs: ["extract/stray"],
    unregistered: ["extract/runtime-only", "extract/source-only"],
    unresolved: ["a.ts:2", "z.ts:4"],
    silent: ["extract/stray"],
    overeager: [],
  });
});
