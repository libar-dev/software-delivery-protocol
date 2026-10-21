import { expect } from "vitest";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { paramsForStep } from "./helpers/generated-contract.js";
import { conflictingExampleKeyWithheldContract } from "../generated/contracts/carrier.step-keys.conflicting-example-key-withheld.contract.js";
import { registerConflictingExampleKeyWithheld } from "./carrier.step-keys.conflicting-example-key-withheld.test.generated.js";
import { gherkinKeyedStepStaysBoundContract } from "../generated/contracts/carrier.step-keys.gherkin-keyed-step-stays-bound.contract.js";
import { registerGherkinKeyedStepStaysBound } from "./carrier.step-keys.gherkin-keyed-step-stays-bound.test.generated.js";
import { keyEqualToASkeletonWithheldContract } from "../generated/contracts/carrier.step-keys.key-equal-to-a-skeleton-withheld.contract.js";
import { registerKeyEqualToASkeletonWithheld } from "./carrier.step-keys.key-equal-to-a-skeleton-withheld.test.generated.js";
import { malformedMarkerRefusedContract } from "../generated/contracts/carrier.step-keys.malformed-marker-refused.contract.js";
import { registerMalformedMarkerRefused } from "./carrier.step-keys.malformed-marker-refused.test.generated.js";
import { renamedKeyBreaksContract } from "../generated/contracts/carrier.step-keys.renamed-key-breaks.contract.js";
import { registerRenamedKeyBreaks } from "./carrier.step-keys.renamed-key-breaks.test.generated.js";
import { repeatedKeyRefusedContract } from "../generated/contracts/carrier.step-keys.repeated-key-refused.contract.js";
import { registerRepeatedKeyRefused } from "./carrier.step-keys.repeated-key-refused.test.generated.js";
import { rewordedKeyedStepStaysBoundContract } from "../generated/contracts/carrier.step-keys.reworded-keyed-step-stays-bound.contract.js";
import { registerRewordedKeyedStepStaysBound } from "./carrier.step-keys.reworded-keyed-step-stays-bound.test.generated.js";
import { rewordedUnkeyedStepBreaksContract } from "../generated/contracts/carrier.step-keys.reworded-unkeyed-step-breaks.contract.js";
import { registerRewordedUnkeyedStepBreaks } from "./carrier.step-keys.reworded-unkeyed-step-breaks.test.generated.js";
import { twoKeysOnOneStepRefusedContract } from "../generated/contracts/carrier.step-keys.two-keys-on-one-step-refused.contract.js";
import { registerTwoKeysOnOneStepRefused } from "./carrier.step-keys.two-keys-on-one-step-refused.test.generated.js";
import { typescriptKeyedStepImportsKeyedContract } from "../generated/contracts/carrier.step-keys.typescript-keyed-step-imports-keyed.contract.js";
import { registerTypescriptKeyedStepImportsKeyed } from "./carrier.step-keys.typescript-keyed-step-imports-keyed.test.generated.js";
import { createStepWorld, invokeStep, assertStepWorld } from "./helpers/key-worlds.js";

const conflictingExampleKeyWithheldAnchor = specTest({
  id: testAnchorId("test:protocol.step-keys.conflicting-example-key-withheld"),
  verifies: ref("spec:carrier.step-keys.conflicting-example-key-withheld"),
});
void conflictingExampleKeyWithheldAnchor;
registerConflictingExampleKeyWithheld({
  createWorld: createStepWorld,
  invoke: invokeStep,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      conflictingExampleKeyWithheldContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        conflictingExampleKeyWithheldContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          conflictingExampleKeyWithheldContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of conflictingExampleKeyWithheldContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertStepWorld(world);
  },
});

const gherkinKeyedStepStaysBoundAnchor = specTest({
  id: testAnchorId("test:protocol.step-keys.gherkin-keyed-step-stays-bound"),
  verifies: ref("spec:carrier.step-keys.gherkin-keyed-step-stays-bound"),
});
void gherkinKeyedStepStaysBoundAnchor;
registerGherkinKeyedStepStaysBound({
  createWorld: createStepWorld,
  invoke: invokeStep,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      gherkinKeyedStepStaysBoundContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        gherkinKeyedStepStaysBoundContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          gherkinKeyedStepStaysBoundContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of gherkinKeyedStepStaysBoundContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertStepWorld(world);
  },
});

const keyEqualToASkeletonWithheldAnchor = specTest({
  id: testAnchorId("test:protocol.step-keys.key-equal-to-a-skeleton-withheld"),
  verifies: ref("spec:carrier.step-keys.key-equal-to-a-skeleton-withheld"),
});
void keyEqualToASkeletonWithheldAnchor;
registerKeyEqualToASkeletonWithheld({
  createWorld: createStepWorld,
  invoke: invokeStep,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      keyEqualToASkeletonWithheldContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        keyEqualToASkeletonWithheldContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          keyEqualToASkeletonWithheldContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of keyEqualToASkeletonWithheldContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertStepWorld(world);
  },
});

const malformedMarkerRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.step-keys.malformed-marker-refused"),
  verifies: ref("spec:carrier.step-keys.malformed-marker-refused"),
});
void malformedMarkerRefusedAnchor;
registerMalformedMarkerRefused({
  createWorld: createStepWorld,
  invoke: invokeStep,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      malformedMarkerRefusedContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        malformedMarkerRefusedContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          malformedMarkerRefusedContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of malformedMarkerRefusedContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertStepWorld(world);
  },
});

const renamedKeyBreaksAnchor = specTest({
  id: testAnchorId("test:protocol.step-keys.renamed-key-breaks"),
  verifies: ref("spec:carrier.step-keys.renamed-key-breaks"),
});
void renamedKeyBreaksAnchor;
registerRenamedKeyBreaks({
  createWorld: createStepWorld,
  invoke: invokeStep,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      renamedKeyBreaksContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        renamedKeyBreaksContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          renamedKeyBreaksContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of renamedKeyBreaksContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertStepWorld(world);
  },
});

const repeatedKeyRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.step-keys.repeated-key-refused"),
  verifies: ref("spec:carrier.step-keys.repeated-key-refused"),
});
void repeatedKeyRefusedAnchor;
registerRepeatedKeyRefused({
  createWorld: createStepWorld,
  invoke: invokeStep,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      repeatedKeyRefusedContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        repeatedKeyRefusedContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          repeatedKeyRefusedContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of repeatedKeyRefusedContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertStepWorld(world);
  },
});

const rewordedKeyedStepStaysBoundAnchor = specTest({
  id: testAnchorId("test:protocol.step-keys.reworded-keyed-step-stays-bound"),
  verifies: ref("spec:carrier.step-keys.reworded-keyed-step-stays-bound"),
});
void rewordedKeyedStepStaysBoundAnchor;
registerRewordedKeyedStepStaysBound({
  createWorld: createStepWorld,
  invoke: invokeStep,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      rewordedKeyedStepStaysBoundContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        rewordedKeyedStepStaysBoundContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          rewordedKeyedStepStaysBoundContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of rewordedKeyedStepStaysBoundContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertStepWorld(world);
  },
});

const rewordedUnkeyedStepBreaksAnchor = specTest({
  id: testAnchorId("test:protocol.step-keys.reworded-unkeyed-step-breaks"),
  verifies: ref("spec:carrier.step-keys.reworded-unkeyed-step-breaks"),
});
void rewordedUnkeyedStepBreaksAnchor;
registerRewordedUnkeyedStepBreaks({
  createWorld: createStepWorld,
  invoke: invokeStep,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      rewordedUnkeyedStepBreaksContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        rewordedUnkeyedStepBreaksContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          rewordedUnkeyedStepBreaksContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of rewordedUnkeyedStepBreaksContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertStepWorld(world);
  },
});

const twoKeysOnOneStepRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.step-keys.two-keys-on-one-step-refused"),
  verifies: ref("spec:carrier.step-keys.two-keys-on-one-step-refused"),
});
void twoKeysOnOneStepRefusedAnchor;
registerTwoKeysOnOneStepRefused({
  createWorld: createStepWorld,
  invoke: invokeStep,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      twoKeysOnOneStepRefusedContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        twoKeysOnOneStepRefusedContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          twoKeysOnOneStepRefusedContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of twoKeysOnOneStepRefusedContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertStepWorld(world);
  },
});

const typescriptKeyedStepImportsKeyedAnchor = specTest({
  id: testAnchorId("test:protocol.step-keys.typescript-keyed-step-imports-keyed"),
  verifies: ref("spec:carrier.step-keys.typescript-keyed-step-imports-keyed"),
});
void typescriptKeyedStepImportsKeyedAnchor;
registerTypescriptKeyedStepImportsKeyed({
  createWorld: createStepWorld,
  invoke: invokeStep,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      typescriptKeyedStepImportsKeyedContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        typescriptKeyedStepImportsKeyedContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          typescriptKeyedStepImportsKeyedContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of typescriptKeyedStepImportsKeyedContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertStepWorld(world);
  },
});
