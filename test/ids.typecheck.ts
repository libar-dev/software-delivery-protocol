import {
  type AnchorId,
  type CodeAnchorId,
  type PackId,
  type SpecId,
  type TestAnchorId,
  anchorId,
  codeAnchorId,
  packId,
  ref,
  specId,
  testAnchorId,
} from "../src/index.js";

const spec: SpecId = ref("spec:orders.create-order.valid-cart");
const alsoSpec: SpecId = specId("spec:orders.create-order");
const pack: PackId = packId("pack:checkout-v1");
const impl: CodeAnchorId = codeAnchorId("impl:orders.create-order-use-case");
const test: TestAnchorId = testAnchorId("test:orders.create-order.valid-cart");
const anchor: AnchorId = anchorId("api:orders.post");

void [spec, alsoSpec, pack, impl, test, anchor];
