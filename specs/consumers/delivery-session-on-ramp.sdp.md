---
id: spec:consumers.delivery-session-on-ramp
kind: behavior
altitude: story
readiness: ready
relations:
  refines: spec:consumers.authoring-on-ramp
---
# Delivery sessions route work from current graph state

## Intent
- outcome: Let an agent enter capture, design, implementation, review, or close work from current graph evidence without inventing workflow state or gates.

## Behavior
- rule: Work shapes are advisory entries over the same current graph; they are neither phases nor a required sequence, and a session may enter or revisit any shape.
- rule: Capture or refinement uses concept search, the lower ladder, and promotion preflight; design uses promotion preflight and readiness divergence.
- rule: Implementation uses the build backlog and the target Spec context; review uses the Pack backbone and warn-level signals, or the target Spec context and warn-level signals when no Pack exists.
- rule: Close uses the drift alarm and changed-file blast radius; optional slimming preserves durable law and one prose owner without claiming a universal distillation boundary.
- rule: A handoff names targets, changed files, current readiness, findings or open questions, and commands or evidence locations to re-run; it never carries an inherited verification verdict.
- rule: Every preflight informs human or agent judgment and never authorizes, blocks, scopes, or advances delivery work.
