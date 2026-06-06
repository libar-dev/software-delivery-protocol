# 05 — Runtime Anchors

This document covers the **runtime composition layer**: how the actual application is wired together, how the graph extractor reads that wiring, and the architectural decision between Effect Layers (preferred) and Awilix (transitional).

The recurring concern in the input documents (especially `04.md`) was: *the architecture graph is more useful when it is grounded in the live application's dependency graph, not floating above it.* This document defines that grounding pedantically.

---

## 1. The "one runtime truth" rule

A repeated lesson: when more than one mechanism owns runtime composition, the graph becomes unreliable. Concretely:

> **Choose exactly one of: Effect Layers, Awilix, or a manual factory pattern. Never two as first-class.**

If you have a legacy Awilix codebase and are introducing Effect Layers, that is a *migration*, not a permanent two-headed runtime. The extractor handles both during migration but the validator emits warnings for any spec whose `RuntimeFacet` references both `effectLayers` and `awilixRegistrations`. (See §6 for the migration path.)

The decision impacts:

- Which extractor sub-modules are enabled (`akg.config.ts:runtimeAnchor`).
- Which marker conventions are expected in source code.
- Which runtime nodes appear in the graph (`Layer` only for one framework or `Layer` with `framework` discriminator).
- How tests are wired (Effect's `Layer.provide` for tests vs Awilix's scoped containers).

---

## 2. Fastify as the HTTP edge

Across both runtime-anchor choices, **Fastify is the HTTP/transport boundary**. It is:

- The place where HTTP requests turn into typed commands.
- The place where responses are serialised, validated, and returned.
- The place where authentication, rate limiting, and request-scoped instrumentation happens.
- The place where OpenAPI/JSON Schema validation is enforced.

It is *not*:

- A dependency injection container in itself.
- A business logic layer.
- A request-scoped state holder for domain objects.

This split is enforced by convention: `src/**/*.route.ts` files contain Fastify route definitions and *nothing else*. They invoke use cases via the chosen runtime anchor.

### 2.1 The `defineRoute` marker convention

Whether using Effect or Awilix, route declarations go through a small helper:

```ts
// @akg/runtime exports
import { defineRoute } from "@akg/runtime";
```

The helper does two things:

1. **Wraps the Fastify route registration** so the route is registered with the configured plugin/lifecycle.
2. **Is recognisable by the extractor** — `defineRoute` is a known marker for `Route` nodes.

A typical Effect-backed route:

```ts
// src/orders/create-order.route.ts
import { defineRoute } from "@akg/runtime";
import { Effect } from "effect";
import { CreateOrderUseCase } from "./create-order.layer";
import { CreateOrderRequest, CreateOrderResponse } from "./schemas";

export const createOrderRoute = defineRoute({
  id:     "api:POST:/orders",
  method: "POST",
  path:   "/orders",

  schema: {
    request:  CreateOrderRequest,        // schema:CreateOrderRequest
    response: CreateOrderResponse,       // schema:CreateOrderResponse
  },

  satisfies: ["spec:orders.create-order"],
  component: "component:orders-api",

  handler: ({ body }) =>
    Effect.gen(function* () {
      const useCase = yield* CreateOrderUseCase;
      return yield* useCase.execute(body);
    }),
});
```

The same helper with Awilix:

```ts
// src/orders/create-order.route.ts (Awilix variant)
import { defineRoute } from "@akg/runtime";

export const createOrderRoute = defineRoute({
  id:     "api:POST:/orders",
  method: "POST",
  path:   "/orders",
  schema: { request: CreateOrderRequest, response: CreateOrderResponse },
  satisfies: ["spec:orders.create-order"],
  component: "component:orders-api",
  handler: async ({ body, request }) => {
    const useCase = request.diScope.resolve("createOrderUseCase");
    return useCase.execute(body);
  },
});
```

The extractor produces an `api:POST:/orders` `Route` node from either form. The `handler` body is inspected via `ts-morph`:

- If it `yield*`s a `Context.Tag`, the graph builds an `invokes` edge to the corresponding `impl:*` (via the Effect `Tag` → `Layer.provides` chain).
- If it calls `request.diScope.resolve("...")`, the graph builds an `invokes` edge to the Awilix registration with that name (resolved against the `defineRegistrations` map).
- If it does neither, the route is "orphan" — a warning fires unless it is marked `@arch.standalone-route`.

### 2.2 Fastify plugins map to `Component` nodes

Fastify's encapsulated plugin model already builds a DAG. The extractor treats top-level Fastify plugins (`fastify-plugin`-wrapped or `register`-mounted) as candidate `Component` nodes — *if* they are declared in `/arch/components.ts`.

The reason: the *physical* Fastify plugin tree is often noisier than the logical component model (e.g., a single plugin file may register routes for two components). By keeping the architecture component model declarative (`/arch/components.ts`) and treating the Fastify tree as one input, we avoid the trap of mistaking transport-layer structure for domain structure.

### 2.3 Fastify decorators (the framework's own concept)

Fastify decorators (`fastify.decorate(...)`, `fastify.decorateRequest(...)`) are *runtime decorations*, not Libar Omni decorators. The extractor mostly ignores them, with one exception: when a request-scoped decoration provides the chosen DI container (`request.diScope` for Awilix, `request.appRuntime` for Effect), the extractor uses it to resolve `request.X` references inside handlers.

---

## 3. Effect Layers — the recommended runtime anchor

### 3.1 Why Effect Layers fit so well

Effect's `Layer` abstraction is **literally a dependency graph constructor**. The mapping to the Libar Omni graph is one-to-one:

```
Effect concept                Libar Omni graph
─────────────────────────────────────────────────
Context.Tag                   Port (Tag node)
Layer.effect(Tag, …)          Layer node providing the Tag
yield* OtherTag inside Layer  `requires` edge from Layer to OtherTag
Effect.runPromise(prog)       handler-side invocation
Effect program's R parameter  static dependency requirement set
```

The compiler-enforced `R` parameter is the key: Effect *already* statically tracks which services a program requires. The extractor reads that information directly from the type-checker via `ts-morph`'s symbol resolution, getting structural certainty no convention-based DI can match.

### 3.2 The canonical layer-marker convention

```ts
// src/orders/create-order.layer.ts
import { Context, Effect, Layer } from "effect";
import { defineArchLayer } from "@akg/runtime";
import { OrderRepository } from "../ports/order-repository";
import { EventBus } from "../ports/event-bus";

// 1. The service interface as a Tag (Port)
export class CreateOrderUseCase extends Context.Tag("CreateOrderUseCase")<
  CreateOrderUseCase,
  {
    execute: (command: CreateOrderCommand) =>
      Effect.Effect<{ orderId: OrderId }, OrderError>;
  }
>() {}

// 2. The live layer (Layer)
export const CreateOrderUseCaseLive = defineArchLayer({
  id:         "layer:CreateOrderUseCaseLive",
  provides:   "port:CreateOrderUseCase",
  satisfies:  ["spec:orders.create-order"],
  component:  "component:orders-api",
  lifetime:   "scoped",

  layer: Layer.effect(
    CreateOrderUseCase,
    Effect.gen(function* () {
      const repo   = yield* OrderRepository;
      const events = yield* EventBus;

      return {
        execute: (command) =>
          Effect.gen(function* () {
            const order = yield* repo.create(command);
            yield* events.publish({ type: "OrderCreated", orderId: order.id });
            return { orderId: order.id };
          }),
      };
    }),
  ),
});

// 3. The test layer (Layer with testDouble target)
export const CreateOrderUseCaseTest = defineArchLayer({
  id:         "layer:CreateOrderUseCaseTest",
  provides:   "port:CreateOrderUseCase",
  satisfies:  ["spec:orders.create-order"],
  component:  "component:orders-api",
  lifetime:   "scoped",
  testDouble: "layer:CreateOrderUseCaseLive",  // points to the live counterpart

  layer: Layer.effect(
    CreateOrderUseCase,
    Effect.succeed({
      execute: () => Effect.succeed({ orderId: "order-fixture-1" as OrderId }),
    }),
  ),
});
```

The extractor reads:

- The `Context.Tag("CreateOrderUseCase")` declaration → `Tag` and `Port` nodes.
- The `defineArchLayer({ id: "layer:CreateOrderUseCaseLive", provides: "port:CreateOrderUseCase", ... })` → `Layer` node and `provides` edge.
- The `Effect.gen(function* () { const repo = yield* OrderRepository; ... })` body → `requires` edges from `Layer` to `port:OrderRepository`, `port:EventBus`.
- The `testDouble` reference → a `supersedes`/`testDoubleFor` relation in the graph (used by the Spec Studio "tests" panel).

### 3.3 The `appRuntime` and Fastify wiring

A single top-level file composes the live runtime:

```ts
// src/runtime/app-runtime.ts
import { Effect, Layer, Runtime } from "effect";
import { CreateOrderUseCaseLive } from "../orders/create-order.layer";
import { PostgresOrderRepositoryLive } from "../adapters/postgres-order-repository";
import { KafkaEventBusLive } from "../adapters/kafka-event-bus";
import { ConfigLive } from "./config";
import { LoggerLive } from "./logger";

export const AppLayer = Layer.mergeAll(
  ConfigLive,
  LoggerLive,
  PostgresOrderRepositoryLive,
  KafkaEventBusLive,
  CreateOrderUseCaseLive,
);

export const appRuntime = Runtime.defaultRuntime;
// (or a configured runtime built via Layer.toRuntime(AppLayer))
```

Then Fastify integration:

```ts
// src/runtime/fastify-effect-plugin.ts
import fp from "fastify-plugin";
import { Effect } from "effect";
import { AppLayer } from "./app-runtime";

export const fastifyEffectPlugin = fp(async (app) => {
  app.decorate("runEffect", <A, E>(program: Effect.Effect<A, E, never>) =>
    Effect.runPromise(program));
});
```

Route handlers then write:

```ts
handler: ({ body }, reply) =>
  app.runEffect(
    Effect.gen(function* () {
      const useCase = yield* CreateOrderUseCase;
      return yield* useCase.execute(body);
    }).pipe(Effect.provide(AppLayer))
  ),
```

The extractor traces the `provide(AppLayer)` chain to confirm every required tag is satisfied — a *statically determinable* result. The graph validator can then enforce: *every route's program must have R = never after `provide`* (otherwise the runtime would crash at request time).

### 3.4 What Effect Layers give you over Awilix

| Concern | Effect Layers | Awilix |
|---|---|---|
| Dependency declaration | Tag + Layer + Effect type | Class + asClass + cradle |
| Compile-time missing dep | ✓ (`R` parameter) | ✗ (runtime resolution failure) |
| Lifetime types | Layer composition + scope | Lifetime enum + container scopes |
| Test substitution | `Layer.provide(TestLayer)` | `container.register({...})` |
| Async construction | Native (`Effect.gen`) | `asFunction` with promise handling |
| Errors as values | Typed `E` parameter | Throw or convention |
| Graph extraction | Yields *typed* `requires`/`provides` edges automatically | Requires convention-bound `defineRegistrations` |
| Learning curve | High | Low |

The trade-off: Effect's model is dramatically more powerful and more graph-friendly, but the team needs to be comfortable with `Effect.gen`, tagged services, and typed errors.

---

## 4. Awilix — the transitional / pragmatic anchor

### 4.1 When Awilix is the right call

- The codebase is mostly classes (`OrderService`, `OrderRepository`, etc.).
- The team has experience with classical DI.
- The product is shipping and a paradigm shift to Effect would slow it down.
- The graph value (traceability, projections, validators) is what you want first; deeper runtime typing can come later.

In that case, Awilix gives a clean dependency-graph anchor with very little overhead.

### 4.2 The `defineRegistrations` marker convention

```ts
// src/di/container.ts
import { asClass, asFunction, asValue, Lifetime } from "awilix";
import { defineRegistrations } from "@akg/runtime";
import { CreateOrderUseCase } from "../orders/create-order.use-case";
import { PostgresOrderRepository } from "../adapters/postgres-order-repository";
import { KafkaEventBus } from "../adapters/kafka-event-bus";

export const registrations = defineRegistrations({
  createOrderUseCase: {
    node:         "impl:CreateOrderUseCase",
    layerId:      "layer:CreateOrderUseCase",
    lifetime:     "scoped",
    registration: asClass(CreateOrderUseCase, { lifetime: Lifetime.SCOPED }),
    dependsOn:    ["impl:OrderRepository", "impl:EventBus"],
    satisfies:    ["spec:orders.create-order"],
  },

  orderRepository: {
    node:         "impl:OrderRepository",
    layerId:      "layer:OrderRepository",
    lifetime:     "singleton",
    registration: asClass(PostgresOrderRepository, { lifetime: Lifetime.SINGLETON }),
    satisfies:    ["spec:orders.create-order"],
  },

  eventBus: {
    node:         "impl:EventBus",
    layerId:      "layer:EventBus",
    lifetime:     "singleton",
    registration: asClass(KafkaEventBus, { lifetime: Lifetime.SINGLETON }),
  },
} as const);
```

The extractor reads:

- Each registration entry → an `impl:*` node and an associated `layer:*` node (with `framework: "awilix"`).
- `lifetime` → the layer's `lifetime` field.
- `dependsOn` → `requires` edges in the runtime sub-graph.
- `satisfies` → `satisfiedBy` edges from specs to the impl/layer.

### 4.3 Awilix-side validators

Awilix lacks Effect's compile-time guarantees. The graph validators compensate:

- **`awilix-strict-lifetimes`** — fails if a singleton registration's `dependsOn` includes a scoped registration (Awilix's own strict mode detects this; the validator re-checks declaratively).
- **`awilix-missing-registration`** — fails if any handler resolves a name not present in `defineRegistrations`.
- **`awilix-orphan-registration`** — warns if a registration is never resolved (likely dead code).
- **`awilix-cycle`** — fails on dependency cycles via `dependsOn`.

### 4.4 Fastify request scope

`@fastify/awilix` gives request-scoped DI via `request.diScope`. The graph treats request-scoped resolutions as edges with `metadata: { scope: "request" }` so the Spec Studio can show "this use case is scoped per request" without a separate node kind.

---

## 5. Side-by-side: the same spec wired both ways

To make the comparison concrete, here is `spec:orders.create-order` wired with Effect vs Awilix.

### 5.1 Effect (recommended target)

```ts
// src/orders/create-order.use-case.ts
import { Effect } from "effect";
import { arch } from "@akg/markers";

@arch.node({
  id:        "impl:CreateOrderUseCase",
  kind:      "implementation",
  component: "component:orders-api",
  satisfies: ["spec:orders.create-order"],
})
export class CreateOrderUseCaseImpl {
  static make = (deps: {
    repo:   { create: (c: CreateOrderCommand) => Effect.Effect<Order, OrderError> };
    events: { publish: (e: OrderEvent) => Effect.Effect<void, never> };
  }) => ({
    execute: (command: CreateOrderCommand) =>
      Effect.gen(function* () {
        const order = yield* deps.repo.create(command);
        yield* deps.events.publish({ type: "OrderCreated", orderId: order.id });
        return { orderId: order.id };
      }),
  });
}

// → layer file (3.2)
// → route file (2.1)
// → spec file (04 §1.4)
```

Graph result (annotated):

```
spec:orders.create-order
  ──satisfiedBy──> api:POST:/orders
  ──satisfiedBy──> layer:CreateOrderUseCaseLive
  ──belongsTo──── capability:order-management
  ──decidedBy───> adr:007-order-lifecycle

api:POST:/orders
  ──invokes────── (program with R = CreateOrderUseCase)
                  ──provideAll──> layer:CreateOrderUseCaseLive

layer:CreateOrderUseCaseLive
  ──provides────> port:CreateOrderUseCase
  ──requires────> port:OrderRepository
  ──requires────> port:EventBus

component:orders-api
  ──contains────> impl:CreateOrderUseCase
  ──contains────> layer:CreateOrderUseCaseLive
  ──contains────> api:POST:/orders
```

### 5.2 Awilix (transitional)

```ts
// src/orders/create-order.use-case.ts
import { arch } from "@akg/markers";

@arch.node({
  id:        "impl:CreateOrderUseCase",
  kind:      "implementation",
  component: "component:orders-api",
  satisfies: ["spec:orders.create-order"],
})
export class CreateOrderUseCase {
  constructor(private deps: {
    orderRepository: OrderRepository;
    eventBus:        EventBus;
  }) {}

  async execute(command: CreateOrderCommand): Promise<{ orderId: OrderId }> {
    const order = await this.deps.orderRepository.create(command);
    await this.deps.eventBus.publish({ type: "OrderCreated", orderId: order.id });
    return { orderId: order.id };
  }
}

// → registrations file (4.2)
// → route file (2.1, Awilix variant)
// → spec file (04 §1.4)
```

Graph result:

```
spec:orders.create-order
  ──satisfiedBy──> api:POST:/orders
  ──satisfiedBy──> layer:CreateOrderUseCase
  ──belongsTo──── capability:order-management

api:POST:/orders
  ──invokes────── impl:CreateOrderUseCase   (resolved via request.diScope.resolve("createOrderUseCase"))

layer:CreateOrderUseCase  (framework: "awilix")
  ──provides────> impl:CreateOrderUseCase
  ──requires────> impl:OrderRepository
  ──requires────> impl:EventBus

component:orders-api
  ──contains────> impl:CreateOrderUseCase
  ──contains────> impl:OrderRepository
```

Note the subtle but important difference: in the Effect case, the graph carries the *interface* (`port:CreateOrderUseCase`) as the unit of architectural reasoning. In the Awilix case, the interface is implicit (TypeScript types), so the graph carries the *implementation* as the unit. Effect's model is more refactor-resilient — swapping `Live` for `Test` for another implementation does not change any other node's edges. With Awilix, the implementation identity is load-bearing.

`★ Insight ─────────────────────────────────────`
This is the architectural payoff of Effect that is hardest to communicate up-front: it turns the interface, not the implementation, into the unit of reasoning. The graph reflects that. Once teams see "swap `CreateOrderUseCaseLive` for `CreateOrderUseCaseTest` and the *spec→port→layer* edges remain identical", the value proposition becomes obvious. Awilix can fake it via interface types, but the runtime resolution is impl-keyed.
`─────────────────────────────────────────────────`

---

## 6. Migration path: Awilix → Effect

For teams that start with Awilix and want to migrate:

### Phase 1 — Stand up Libar Omni on Awilix

- Adopt `defineRegistrations`, `defineRoute`, `@arch.node`, `.spec.ts`.
- Get the graph green; ship the Spec Studio.
- No code changes to business logic.

### Phase 2 — Introduce Effect in one bounded context

- Pick a new feature (`spec:orders.cancel-order`) and implement it with Effect Layers.
- The graph now has both `framework: "awilix"` and `framework: "effect"` layers.
- Validators emit "mixed runtime" warnings, downgraded to info for the migrating context.

### Phase 3 — Migrate adapters

- Wrap Awilix-registered adapters (`PostgresOrderRepository`, `KafkaEventBus`) as Effect Layers that re-expose them via `Context.Tag`.
- This is mechanical and codemod-friendly.

### Phase 4 — Migrate use cases

- For each `impl:*` use case, write the corresponding `layer:*Live` Effect layer.
- Update its route handler to `yield*` the tag instead of `request.diScope.resolve`.
- Remove the Awilix registration once no references remain.

### Phase 5 — Switch the anchor

- Change `runtimeAnchor: "fastify+awilix"` to `"fastify+effect"` in `akg.config.ts`.
- Disable the Awilix extractor; delete `src/di/container.ts`.
- Effect Layers are the only runtime truth.

Throughout, the graph stays valid (just with mixed-framework warnings during phases 2-4). The Spec Studio shows migration progress as a heatmap by component.

---

## 7. Pure / functional / class-DI without Effect or Awilix

Not every team will adopt either Effect or Awilix. The system supports a "manual factory" anchor:

```ts
// src/runtime/wire.ts
import { defineWiring } from "@akg/runtime";
import { CreateOrderUseCase } from "../orders/create-order.use-case";
// ...

export const wiring = defineWiring({
  "impl:OrderRepository":      () => new PostgresOrderRepository(config.postgres),
  "impl:EventBus":             () => new KafkaEventBus(config.kafka),
  "impl:CreateOrderUseCase":   () => new CreateOrderUseCase({
    orderRepository: wiring["impl:OrderRepository"](),
    eventBus:        wiring["impl:EventBus"](),
  }),
} as const);
```

The extractor reads `defineWiring` (recognised marker) and produces `Layer` nodes with `framework: "custom"`. The validation is weaker (no automatic lifetime or cycle detection), so teams must rely on `dependency-cruiser` and a small `wiring-coverage` validator that confirms every `impl:*` node has a wiring entry.

This is intended as a "minimum viable" anchor, not a recommended one.

---

## 8. Cross-cutting runtime concerns

### 8.1 Configuration

Configuration is itself a `Spec` (or set of specs) at the `contract` abstraction:

```ts
export const Config = spec({
  id: "spec:config",
  title: "Application configuration",
  kind: "interface",
  abstraction: "contract",
  readiness: "bound",

  model: {
    terms: ["AppConfig"],
  },

  bindings: {
    schemas: ["schema:AppConfig"],
    code:    ["impl:Config"],
  },

  runtime: {
    effectLayers: ["layer:ConfigLive"],
  },

  relations: [
    { type: "belongsTo", to: "capability:platform" },
  ],
});
```

The schema (typically Zod or TypeBox) is extractable as JSON Schema and emitted in `/generated/openapi.yaml` (when the runtime needs external configuration).

### 8.2 Logging

Logging follows the same pattern: a `Logger` port, a `LoggerLive` layer providing structured JSON to stdout, a `LoggerTest` layer collecting records in-memory for tests. The graph reflects the dependency: every other layer that yields `Logger` gains a `requires port:Logger` edge.

### 8.3 Tracing / OpenTelemetry

OTel instrumentation is wired through a single `layer:TracerLive` (Effect) or `tracer` registration (Awilix). The `EvidenceFacet.observedIn` on a spec references the OTel semantic-convention name; the graph's `Observation` nodes (when ingested) link back to the spec via `observedIn` edges. See `08-delivery-evidence-and-tooling.md`.

### 8.4 Database / external systems

External systems (Postgres, Stripe, Kafka) appear as `ExternalSystem` nodes. They are referenced by `RuntimeFacet.externalSystems` on specs and `dependsOn` edges from `Layer` or `Implementation` nodes. The Spec Studio renders them at the boundary of LikeC4 container diagrams.

### 8.5 Background jobs / queue handlers

A queue handler is just another `impl:*` with `@arch.handles({ event: "event:OrderCreated" })`. The graph adds an `handles` edge from the impl to the event. Background scheduler entries (`@arch.schedule({ cron: "0 * * * *" })`) become `Schedule` nodes with edges to the implementing function.

---

## 9. Choice matrix (the decision tree compressed)

```
Are you starting a new codebase?
├── Yes → Fastify + Effect Layers + Libar Omni.
└── No  → Is the codebase class-DI with Awilix-style wiring?
         ├── Yes → Fastify + Awilix + Libar Omni; plan Effect migration if desired.
         └── No  → Use the "custom" anchor with defineWiring; treat as transitional.

Is the team familiar with Effect, Tagged Effects, and typed errors?
├── Yes        → Effect from day 1.
└── No         → Awilix; introduce Effect in one bounded context once team builds confidence.

Do you need request-scoped resources (DB transactions, per-request caches)?
├── Yes        → Both Effect (Scope) and Awilix (request scope) support it; equal weight here.
└── No         → Effect's compile-time guarantees become the deciding factor.

Do you need the architecture diagrams to reflect interface-level reasoning?
├── Yes        → Effect; the graph models ports first-class.
└── No         → Awilix is fine.
```

The "one-truth" rule applies after any of these branches: pick one and stick to it.

---

## 10. What this document does *not* answer

- *Whether to use NestJS / Inversify / TypeDI instead of Effect or Awilix.* These are possible with custom extractor adapters; the design supports them but does not recommend them for new work because their decorator-heavy DI is less aligned with the "markers as static pointers" principle and their conventions are more invasive than Effect or Awilix.
- *Whether to use Hono / Express / Koa instead of Fastify.* Possible but Fastify's plugin DAG, decorator system, and schema integration are unusually well-aligned with the graph. Other servers work with adapter modules.
- *Whether to host workers / background jobs in the same process.* Orthogonal — the graph models them either way (in-process or separate runtime).

These are all valid choices; this document is opinionated about the *recommended* pairing because the input documents explicitly converged on it.
