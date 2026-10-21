import { expect } from "vitest";
import { ref, specTest, testAnchorId } from "@libar-dev/software-delivery-protocol";
import { paramsForStep } from "./helpers/generated-contract.js";
import { keyedTermResolvesContract } from "../generated/contracts/model.term-addresses.keyed-term-resolves.contract.js";
import { registerKeyedTermResolves } from "./model.term-addresses.keyed-term-resolves.test.generated.js";
import { malformedTermMarkerRefusedContract } from "../generated/contracts/model.term-addresses.malformed-term-marker-refused.contract.js";
import { registerMalformedTermMarkerRefused } from "./model.term-addresses.malformed-term-marker-refused.test.generated.js";
import { repeatedTermKeyRefusedContract } from "../generated/contracts/model.term-addresses.repeated-term-key-refused.contract.js";
import { registerRepeatedTermKeyRefused } from "./model.term-addresses.repeated-term-key-refused.test.generated.js";
import { typescriptTermImportsKeyedContract } from "../generated/contracts/model.term-addresses.typescript-term-imports-keyed.contract.js";
import { registerTypescriptTermImportsKeyed } from "./model.term-addresses.typescript-term-imports-keyed.test.generated.js";
import { unknownTermKeyRefusedContract } from "../generated/contracts/model.term-addresses.unknown-term-key-refused.contract.js";
import { registerUnknownTermKeyRefused } from "./model.term-addresses.unknown-term-key-refused.test.generated.js";
import { createTermWorld, invokeTerm, assertTermWorld } from "./helpers/key-worlds.js";

const keyedTermResolvesAnchor = specTest({
  id: testAnchorId("test:protocol.term-addresses.keyed-term-resolves"),
  verifies: ref("spec:model.term-addresses.keyed-term-resolves"),
});
void keyedTermResolvesAnchor;
registerKeyedTermResolves({
  createWorld: createTermWorld,
  invoke: invokeTerm,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      keyedTermResolvesContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        keyedTermResolvesContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          keyedTermResolvesContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of keyedTermResolvesContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertTermWorld(
      world,
      paramsForStep(
        keyedTermResolvesContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    );
  },
});

const malformedTermMarkerRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.term-addresses.malformed-term-marker-refused"),
  verifies: ref("spec:model.term-addresses.malformed-term-marker-refused"),
});
void malformedTermMarkerRefusedAnchor;
registerMalformedTermMarkerRefused({
  createWorld: createTermWorld,
  invoke: invokeTerm,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      malformedTermMarkerRefusedContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        malformedTermMarkerRefusedContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          malformedTermMarkerRefusedContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of malformedTermMarkerRefusedContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertTermWorld(
      world,
      paramsForStep(
        malformedTermMarkerRefusedContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    );
  },
});

const repeatedTermKeyRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.term-addresses.repeated-term-key-refused"),
  verifies: ref("spec:model.term-addresses.repeated-term-key-refused"),
});
void repeatedTermKeyRefusedAnchor;
registerRepeatedTermKeyRefused({
  createWorld: createTermWorld,
  invoke: invokeTerm,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      repeatedTermKeyRefusedContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        repeatedTermKeyRefusedContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          repeatedTermKeyRefusedContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of repeatedTermKeyRefusedContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertTermWorld(
      world,
      paramsForStep(
        repeatedTermKeyRefusedContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    );
  },
});

const typescriptTermImportsKeyedAnchor = specTest({
  id: testAnchorId("test:protocol.term-addresses.typescript-term-imports-keyed"),
  verifies: ref("spec:model.term-addresses.typescript-term-imports-keyed"),
});
void typescriptTermImportsKeyedAnchor;
registerTypescriptTermImportsKeyed({
  createWorld: createTermWorld,
  invoke: invokeTerm,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      typescriptTermImportsKeyedContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        typescriptTermImportsKeyedContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          typescriptTermImportsKeyedContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of typescriptTermImportsKeyedContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertTermWorld(
      world,
      paramsForStep(
        typescriptTermImportsKeyedContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    );
  },
});

const unknownTermKeyRefusedAnchor = specTest({
  id: testAnchorId("test:protocol.term-addresses.unknown-term-key-refused"),
  verifies: ref("spec:model.term-addresses.unknown-term-key-refused"),
});
void unknownTermKeyRefusedAnchor;
registerUnknownTermKeyRefused({
  createWorld: createTermWorld,
  invoke: invokeTerm,
  expected: () => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: paramsForStep(
      unknownTermKeyRefusedContract,
      "the first extraction finding's message contains {extractMessage}",
    ).extractMessage,
  }),
  observe: (world) => ({
    kind: "the first extraction finding's message contains {extractMessage}",
    extractMessage: world.extractMessage.includes(
      paramsForStep(
        unknownTermKeyRefusedContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    )
      ? paramsForStep(
          unknownTermKeyRefusedContract,
          "the first extraction finding's message contains {extractMessage}",
        ).extractMessage
      : world.extractMessage,
  }),
  assertions: (world) => {
    for (const step of unknownTermKeyRefusedContract.steps) {
      if (step.kind !== "then") continue;
      for (const [key, value] of Object.entries(step.params)) {
        if (key === "extractMessage") expect(world.extractMessage).toContain(value);
        else expect(world.answer[key], key).toEqual(value);
      }
    }
    assertTermWorld(
      world,
      paramsForStep(
        unknownTermKeyRefusedContract,
        "the first extraction finding's message contains {extractMessage}",
      ).extractMessage,
    );
  },
});
