# Task 2 evidence

## Diff

```diff
diff --git a/test/self-hosting-oracle/anchors.ts b/test/self-hosting-oracle/anchors.ts
index d840d77..53a6fcc 100644
--- a/test/self-hosting-oracle/anchors.ts
+++ b/test/self-hosting-oracle/anchors.ts
@@ -564,7 +564,7 @@ export const expectedAnchors = [
     target: "spec:carrier.markdown-parser.bounded-parity",
     file: "test/self-hosting-carrier.test.ts",
     constant: "boundedParityTestAnchor",
-    site: "bindExample(boundedParityContract",
+    site: "registerBoundedParity(",
   },
   {
     id: "test:protocol.gherkin-authoring.authored-fact-refused",
```

## Verification

### `npx vitest run test/self-hosting-graph.test.ts`

```text
 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  18:44:40
   Duration  2.63s (transform 572ms, setup 0ms, import 2.28s, tests 206ms, environment 0ms)
```

### `npx vitest run test/self-hosting-carrier.test.ts`

```text
 RUN  v4.1.10 /home/darkomijic/dev-libar/software-delivery-protocol

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  18:44:40
   Duration  1.07s (transform 433ms, setup 0ms, import 883ms, tests 44ms, environment 0ms)
```

### `grep -c 'bindExample(boundedParityContract' test/self-hosting-oracle/anchors.ts`

```text
0
```

The grep command returned exit status 1 because the count is zero, as required.
