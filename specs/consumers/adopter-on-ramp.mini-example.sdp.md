---
id: spec:consumers.adopter-on-ramp.mini-example
kind: behavior
altitude: story
readiness: idea
relations:
  refines:
    target: spec:consumers.adopter-on-ramp
    reason: a newcomer learns the homes and grammar the on-ramps teach from a corpus small enough to read whole
---
# A newcomer learns the Protocol from one small worked corpus

The worked example beside the engine, checkout-v1, covers all eight kinds so the carriers could be designed and tested against it, which makes it a lab rather than a first read. This example specifies one small, real part of this repository, the temporal guard that keeps session handles and calendar dates out of files meant to stay true. A newcomer then learns the method on a subject that needs no invented business domain, and sees why git, not a durable file, records when something happened.

## Intent

- problem: A newcomer who opens the Protocol meets either its own corpus of several hundred Specs or a lab example built to cover every kind, and neither can be read whole before the method makes sense.
- outcome: A newcomer reads one small corpus whole, from intent to a bound test, and on one screen sees a Spec at each readiness rung, the relations between them and the facts the graph derives.

### Open questions

- [blocking #realTool] Does this repository's gate run the example's temporal guard, or does the example keep a smaller copy beside the root script?
  - decider: owner
  - provisional: the gate runs the example's guard, so one implementation exists and the example is a small package this repository uses the way an adopter would
- [non-blocking #placement] What is the example called, and where does its corpus live?
  - decider: owner
  - provisional: `examples/temporal-guard/`, with its Spec ids in a `temporal` family

## Behavior
