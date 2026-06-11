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

// The id-brand discipline, pinned: one brand never assigns to another, a raw string carries no
// brand, and the generic anchorId result never narrows to a flavored anchor brand — only the
// validating constructors brand.

// @ts-expect-error a PackId slot rejects a SpecId result
const wrongPack: PackId = specId("spec:orders.create-order");

// @ts-expect-error a raw string is unbranded — only specId() brands, after validating
const rawSpec: SpecId = "spec:orders.create-order";

// @ts-expect-error a TestAnchorId slot rejects a SpecId result
const wrongTest: TestAnchorId = specId("spec:orders.create-order.valid-cart");

// @ts-expect-error a CodeAnchorId slot rejects the generic anchorId result
const wrongImpl: CodeAnchorId = anchorId("api:orders.post");

void [wrongPack, rawSpec, wrongTest, wrongImpl];
