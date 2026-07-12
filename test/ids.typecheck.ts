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

// The two anchor flavors never cross-assign: the flavor is a second branded layer over the one
// `AnchorId` brand (see `ids.ts`), so a verifying binding and an implementation binding stay
// distinct types while both remain assignable to `AnchorId`.

// @ts-expect-error a TestAnchorId slot rejects a CodeAnchorId result
const wrongFlavorTest: TestAnchorId = codeAnchorId("impl:orders.create-order-use-case");

// @ts-expect-error a CodeAnchorId slot rejects a TestAnchorId result
const wrongFlavorImpl: CodeAnchorId = testAnchorId("test:orders.create-order.valid-cart");

const widensToAnchor: AnchorId = codeAnchorId("impl:orders.create-order-use-case");

void [wrongPack, rawSpec, wrongTest, wrongImpl, wrongFlavorTest, wrongFlavorImpl, widensToAnchor];
