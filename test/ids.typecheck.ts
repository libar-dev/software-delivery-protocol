import {
  type AnchorId,
  type ImplAnchorId,
  type PackId,
  type SpecId,
  type TestAnchorId,
  anchorId,
  implAnchorId,
  packId,
  ref,
  specId,
  testAnchorId,
} from "../src/index.js";

const spec: SpecId = ref("spec:orders.create-order.valid-cart");
const alsoSpec: SpecId = specId("spec:orders.create-order");
const pack: PackId = packId("pack:checkout-v1");
const impl: ImplAnchorId = implAnchorId("impl:orders.create-order-use-case");
const test: TestAnchorId = testAnchorId("test:orders.create-order.valid-cart");
const anchor: AnchorId = anchorId("api:orders.post");

void [spec, alsoSpec, pack, impl, test, anchor];
