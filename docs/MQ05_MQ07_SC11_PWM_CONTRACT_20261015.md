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


## 2026-10-15 subsequent integration checkpoint
- Native `Simulation.solve` now gates only the SC11-marked virtual switch from duty/frequency/time. The unchanged MOSFET and motor branches determine conduction and instantaneous motor energization; no RPM solver was added.
- SC11 now contains a wired virtual source, PWM switch, gate resistor, pull-down, IRF540N G/D/S, canonical `motor-dc` terminals `+` / `−`, and UT33D+ gate probes. Its initial duty is 0%; physical acceptance remains false.
- Added `tests/qa-mq07-sc11-pwm-motor-v11920.test.cjs` with duty 0/50/100%, invalid input, disconnected paths, canonical terminals, and full curriculum assertions. The previous full-regression test files may contain hardcoded 732/48 pre-SC11 expectations: rebaseline and run them before claiming MQ-12 PASS.
- **NOT_RUN**: Node test commands and Windows `file:///` QA were not executed; do not infer 5 tests pass simply because files were committed.
- **OPEN:** Tutorial Mode user-facing duty controls, average motor terminal voltage/current coupling, RPM, flyback transient modeling, thermal/EMF calibration, cross-test harmonization. MQ-00 verdict: **PARTIAL / REVIEW, not DONE**.

## 2026-10-15 MQ-12 / MQ-13 / MQ-00 follow-up
- Tutorial Mode includes 0/50/100% SC11 controls, which sample native `Simulation.solve` at 0/.25/.75 ms. They show instantaneous motor energized state only, not RPM.
- Added `tests/qa-mq07-sc11-pwm-ui-v11920.test.cjs` to specify 9 native solve calls, one render per duty selection and invalid-input rejection.
- Updated four older MQ-07 test fixtures to expect 733 wired source lessons / 47 source `NO_WIRED_CIRCUIT` review entries. This is a static rebaseline, **not evidence of a passing test suite**. The audit report counts may need reconciliation with updated definitions and fixtures.
- The connected GitHub API supports repository edits but no Node execution. The local command environment could not resolve github.com for cloning. Accordingly **node --test, full 1655 audit, Windows file:/// browser review and independent physical/pedagogical acceptance are NOT_RUN**.
- MQ-13: `main` only, no Actions calls, no force-push, each change `[skip ci]`. MQ-00 decision: **IMPLEMENTED, AWAITING EXECUTION EVIDENCE / REVIEW**. Do not mark SC11 DONE or reduce overall accepted project blockers solely from source edits.

## 2026-10-15 MQ-12 static reconciliation pass (no Actions)
- Confirmed `main` HEAD at entry: `29fd625e9cf30876c0aae1c0c27c992cb47dce42`.
- Local runtime includes Node v22.16.0, but `git ls-remote https://github.com/uysalayhan23/DevreTasarimStudyo.git` failed with "Could not resolve host: github.com"; therefore whole source tree and dependent modules could not be cloned to run the full Node suite.
- Via connected GitHub content reads, reconciled SC11-induced `732→733` wired source audits, `48→47` unresolved *NO_WIRED_CIRCUIT source-review entries*, and expanded the virtual-repair list to include SC11. Updated old tests including open-topology, batch-001-200, motor-reversal, piezo, RC/BJT, sensor-control and previous MOSFET/LDR/FET suites across this and preceding commits.
- **Important distinction:** `47` is a source-ledger count after converting SC11 to a wired lesson; the SC11 physical/Windows/independent pedagogical acceptance gate remains OPEN. Do not present it as 47 fully closed physical defects.
- No `node --test`, no full 1,655 lesson execution, and no Windows file:/// QA: **NOT_RUN**. No test has been declared PASSED on the basis of static expected-count changes. Other existing test suites may still encode former totals, so do not claim complete historical regression convergence.
- MQ-05/07: virtual native solver integration authored; MQ-12: static reconciliation only; MQ-13: main-only commits [skip ci], no force push, Actions untouched; MQ-00: **REVIEW / BLOCKED on executable evidence**.

## 2026-10-15 MQ-12 attempted executable acceptance (this turn)
- GitHub `main` was independently read and matched initial HEAD `5fe2894eab3e57597c95bdb46f4a0a74dda3f5c0`.
- Local tool `node -v` returned `v22.16.0`. A direct `git ls-remote https://github.com/uysalayhan23/DevreTasarimStudyo.git HEAD` returned `Could not resolve host: github.com`. No copy of the complete repository was present in `/mnt/data`, so locally invoking the repo's Node tests would not be an authentic complete-source execution.
- Through the authenticated GitHub connection, code-level assertions were inspected in SC11 PWM motor, SC11 UI, no-wire triage, batch-001-200 and open-topology tests. The 733 wired / 47 source-review assertions are present; an outdated historical test-description string (35 pending applications / 731 wired) was corrected to 34 / 733 without fabricating runtime results.
- MQ-05/07 source concerns remaining: PWM gate timing is implemented separately from the standalone virtual PWM contract; full integration with physical motor-current/average-terminal-voltage computation, RPM, thermal and flyback transient modelling is not proven. The educational control only reports instantaneous solve states.
- MQ-12 verdict **NOT_RUN** for actual `node --test`, SC11 UI regression, prior MQ-07 tests and full 1,655 lesson audit. **MQ-13:** `main`, `[skip ci]`, no Actions and no force-push. **MQ-00:** `REVIEW / EXECUTION BLOCKED` until genuine local test logs are available.

## 2026-10-15 MQ-12 local execution path (no GitHub Actions)
- Local Node v22.16.0 is present, but `git ls-remote` fails because `github.com` DNS is unavailable in the assistant's container. A complete project checkout could not be imported from the connector into the Node runtime; the tests were **NOT_RUN**.
- Added `scripts/RUN_MQ12_SC11_LOCAL.cmd` in `main`: it invokes the standalone PWM contract tests, SC11 native motor/UI tests, all `qa-mq07-*.test.cjs` tests, and the 1,655-lesson native suite using actual `node --test` calls, preserving a nonzero exit status on any failure. This script has **not yet been executed** and is not proof of a passing suite.
- Preconditions: complete local checkout/ZIP with `dist/`, `scripts/`, `tests/` folders; Node on PATH. Invoking the script is independent of GitHub Actions; no server is started.
- **MQ-12** actual test evidence: NOT_RUN. **MQ-13** main-only commit with `[skip ci]`, no force push, no Actions. **MQ-00** remains REVIEW / execution blocked; physical/Windows/browser acceptance remains separate even when unit tests eventually pass.
