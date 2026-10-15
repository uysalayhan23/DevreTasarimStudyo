# MQ-05 → MQ-07 / SC11 PWM–MOSFET–DC motor acceptance contract
Date: 2026-10-15. Branch: main. Status: PARTIAL / INTEGRATION BLOCKED.

## Verified source boundary
`dist/simulation.js` currently derives `motor-dc._active` from connected voltage and `_spin` from DC direction. It does not implement calibrated duty→RPM/torque/thermal behavior. `dist/tutorial-pedagogy.js` explicitly forbids numeric speed claims where a PWM motor simulator is unavailable.

## Delivered
- `dist/mq05-virtual-pwm-contract.js`: pure educational PWM gate timing evaluator with frequency, duty and time, explicit gate/power connectivity and separately supplied MOSFET-channel state; fail closed on invalid/open path.
- `tests/qa-mq05-virtual-pwm-contract-v11920.test.cjs`: 5 tests specifying 0/50/100% duty, periodicity, open path, invalid inputs and channel-open behavior.
- Deliberately returns `speedRpm:null`, `averageAppliedV:null`, `torqueNm:null`, `thermalC:null`. `idealDutyAverageV` is an algebraic ideal duty-times-source teaching value only, not a solved motor terminal voltage.

## Acceptance gates still open
1. MQ-05: integrate gate timing into a virtual source without bypassing original `Simulation.solve` and semiconductor state; demonstrate independent power vs control topology.
2. MQ-05/MQ-06: couple duty and MOSFET switching to actual motor terminal electrical state and signed direction; never derive current/speed from UI animation.
3. MQ-07: only after native solver proof, replace SC11 no-wired quiz with a canonical wired project and guided actions.
4. MQ-12: execute `node --test tests/qa-mq05-virtual-pwm-contract-v11920.test.cjs` and native full-regression in a Node-capable runtime (NOT_RUN here); negative cases broken gate, open motor path, 0/50/100 duty, off-state, floating reference.
5. MQ-13: no Actions, no force-push, `[skip ci]` and main-only fast-forward commits.
6. MQ-00: no DONE or review count decrement without independently checked evidence. Physical RPM calibration and thermal/EMF behavior remain REVIEW.

This contract is a software-only educational representation, not electrical hardware wiring guidance.
