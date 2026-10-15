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


## 2026-10-15 MQ-00 reopened: S1 is not a PWM source (user screenshot audit)
**Status: REOPEN / P1 material-topology mismatch. Previous SC11 `wiring` and PWM time sampling are NOT lesson acceptance.**

### Observed mismatch (MQ-07 lead / MQ-05 cross-check)
- `dist/tutorial-pedagogy.js` builds SC11 with `C('sw','push-no',...,'S1',...)` and a `G1/P → S1/13 → S1/14 → RG → Q1/G` branch.
- `dist/simulation.js` mutates the pushbutton's `state` from project-wide `mq05VirtualPwm` duty and clock. The apparent PWM function belongs to external project state, not a selectable, terminalized PWM generator material. The screenshot confirms the physical mismatch.
- Merely changing `S1` caption, graphics, or renaming `push-no` to `PWM` is explicitly **not an acceptable repair**.
- Screenshot also shows gate/probe wires and MOSFET labels overlapping; this remains a separate MQ-03/MQ-04/MQ-10 visual gate.

### Mandatory replacement contract (MQ-09/MQ-04 → MQ-05 → MQ-07)
1. Add a **dedicated PWM generator** library definition with distinct component identity and terminals `V+`, `GND`, `OUT`, not `push-no` and not a hidden tutorial-only component. Its body must visibly show PWM generator, frequency and duty; any physical model/orthographic dimensions require an identified manufacturer, else label it **virtual functional generator** rather than pretending to be a real manufacturer's device.
2. Establish `V+` and `GND` supply/reference connections and a **real solver-owned** time-varying `OUT` drive. Valid generator supply, GND return, duty/frequency and `OUT → RG → Q1/G` must determine behavior. An unpowered generator, floating ground, severed OUT or invalid duty must fail closed. Do not modify a pushbutton's state as a proxy.
3. SC11 must use `PWM1` with `G1/P → PWM1/V+`, `PWM1/GND → G1/M`, `PWM1/OUT → RG/1`, `RG/2 → Q1/G`, `RP → G1/M`; leave motor/MOSFET power path and original solver semantics intact. Place instrument and wires without overlaps.
4. Lesson guidance and rebuild steps must refer to generator terminals, not S1/13-14. PWM duty/frequency controls must modify generator properties; the generator shall be available in free-design library, not only in lesson.
5. Tests must assert **absence of S1/push-no**, generator catalog visibility/terminals, each input/output wire, 0/50/100% OFF/ON temporal response, missing supply/GND/OUT failure, invalid config, broken motor/G/D/S path, and untouched other lessons. Existing SC11 tests that assert `sw`, `mq05PwmGateSwitch` or 9 solves via an S1 proxy MUST be rewritten, not rebaselined deceptively.
6. Numeric RPM, current, average motor voltage, torque and heat are not accepted until the model genuinely computes them. A functional virtual PWM output is not a calibrated manufacturer's PWM module.
7. MQ-12 must execute relevant Node tests, 1,655-lesson regression and independent Windows `file:///` visual QA before PASS. GitHub Actions remains forbidden. MQ-13 checks unchanged locked refs, `main`, `[skip ci]`, no force push.
8. MQ-00: retain **REOPEN / NOT DONE** until every applicable G0–G8 gate has evidence. Do not infer success from documentation or schema alone.

### Sequencing and accountability
- MQ-09 lead: choose the proper catalog object and its real-vs-virtual classification.
- MQ-04 cross-check: source, reference and output terminal geometry.
- MQ-05: independent generator electrical state and solver integration, fail-closed negative cases.
- MQ-07: replace SC11 circuit and tutorial instructions only after functional electrical source exists.
- MQ-03/MQ-10: remove screenshot-visible placement and label collisions.
- MQ-12/MQ-13/MQ-00: execution evidence, repository continuity and final decision respectively.

**This entry is a source-review and concrete acceptance contract, not a claim that the replacement has been coded or tests passed.**

## 2026-10-15 SC11 PWM1 implementation checkpoint (MQ-00 OPEN)
- MQ-09: registered `virtual-pwm-generator-v1` with physical interface V+/GND/OUT, explicitly virtual rather than manufacturer-certified hardware.
- MQ-05: `Simulation.network` emits an OUT potential in its matched DC supply domain only when valid generator duty, frequency, time, V+ and GND reference are present. A plain `push-no` is no longer the SC11 source; legacy `mq05PwmGateSwitch` solver support is retained strictly for backward-compatible old projects.
- MQ-07: replaced `S1` by `PWM1` in the canonical SC11 wiring project; added supply and ground wires and connected OUT through RG to Q1/G. Lesson explanation and duty UI now use PWM1.
- MQ-12: updated SC11 native and UI test assertions. Six changed JS files successfully parsed in V8 syntax-only check through connector file reads. **Node behavioral tests, full regression, genuine browser visuals: NOT_RUN.**
- MQ-03/MQ-10: user screenshot still requires visual rerender and manual wire/label overlap audit. No screenshot acceptance yet.
- MQ-00 decision: **PARTIAL / REVIEW**, not DONE. No validated motor RPM/average current/torque/thermal model, no independent electrical numerical acceptance. Confirm browser library discovery and exact fail-closed semantics on disconnected reference before release.
- MQ-13: `main` direct UTF-8 changes, `[skip ci]`, no workflow run, no force push. 


## 2026-10-15 PWM1 fail-closed regression follow-up
- Added a native SC11 negative-case test for physically removing `G1/P → PWM1/V+`, `PWM1/GND → G1/M`, or `PWM1/OUT → RG/1`; source-availability, PWM state and motor state must fail closed as applicable.
- Removed obsolete `project.mq05VirtualPwm` configuration from SC11 template, to avoid an unused, duplicated project-level switch-control field. The PWM1 component now owns duty and frequency. Legacy old-project switch compatibility remains in solver pending separate migration audit.
- Execution constraint: `node -v` returned `v22.16.0`, but `git ls-remote` failed because `github.com` could not resolve from the local runtime. Full authentic Node tests and Windows browser acceptance remain **NOT_RUN**; the added assertions are a regression specification, not proof of PASS.
- MQ-00 decision: **REVIEW**. Next: run the targeted native tests and full curriculum from a complete checkout, then inspect actual visible PWM1 front view, pin placement and routing in Windows. No Actions used.


## 2026-10-15 PWM1 terminal and invalid-control audit, follow-up
- MQ-04 static geometry: PWM1 definition has three independent terminals `V+` (left x=0,y=30), `GND` (left x=0,y=113) and `OUT` (right x=184,y=71) in its 184x142 scene envelope. This does **not** prove visual rendering or verified manufacturer mm dimensions; component is a **virtual functional instrument**.
- MQ-05 corrected generator validity check to reject missing, `null`, string or otherwise nonnumeric duty/frequency instead of coercing values with `Number(...)`. Legacy non-PWM lessons were not rewritten.
- MQ-12 added test assertions for envelope/terminal sides and invalid-config fail-closed cases. Tests are **NOT_RUN**, and true Chrome/Edge visual checks are **NOT_RUN**. The local environment returned Node v22.16.0 but `git ls-remote` still reports `Could not resolve host: github.com`; GitHub connector reads/writes are functional.
- MQ-00 remains **REVIEW**, G6/G7/G8 not accepted. Next verification: actual full-checkout native tests, rendered PWM1 terminal/label/hitbox alignment, actual Windows `file:///` view and wire collision inspection; do not certify only from this static test.


## 2026-10-15 MQ-03 renderer integration checkpoint
- Traced `CCSMaterials.baseMarkup` dispatch: ordinary materials previously reached the generic sprite fallback. `pwm-generator` now explicitly calls `DTSDesignVisuals.markup`, where the PWM1 dedicated front includes status LED, timing waveform, duty/frequency display and named V+/GND/OUT contacts.
- Added dedicated SVG markup regression assertions in `tests/qa-mq07-sc11-pwm-motor-v11920.test.cjs`. This tests the actual dedicated markup entrypoint and source dispatch contract, but is **NOT_RUN** in an authenticated full project checkout and is not Windows screenshot evidence.
- Screenshot before the renderer fix showed fallback blank rectangular PWM1. Pending: new Windows screenshot, verify wire-to-contact position and overlapping labels/probe cables, verify panel controls and PWM electrical tests. MQ-00 stays REVIEW. GitHub Actions remains prohibited.

## 2026-10-15 user screen recording: SC11 PWM presentation and motor-speed REVIEW
- User video (15.3 s, 1916×916) shows duty changing approximately 1% → 82% → 9%, while UT33D+ remains visually near 11.88 V and DC motor does not convey proportional speed change. This is recorded screen evidence, NOT a full electrical measurement.
- Source review: browser 'dist/app.js' passes high-resolution 'performance.now()' into the original solver; the page typically schedules a solve about every 50 ms, far slower than 1000 Hz PWM (1 ms period). Single instantaneous samples can alias and should not be presented as DCV duty average. Default Date.now() exists only for callers omitting now; it is not the browser's primary clock.
- The SC11 educational solver still lacks validated averaged motor terminal voltage/current, DC motor inertia/EMF/RPM, switching/flyback and motor calibration. The ordinary generic motor path may use nominal animation RPM; this is not measured SC11 speed. Remain REVIEW.
- Safe partial UI repair on main: separate control / 0 V / DC+ wiring roles, display ideal duty×source command average explicitly NOT as meter or motor voltage, and draw duty-proportional waveform instead of constant decorative squares. Preserve SC11 1000 Hz contract and original native solver.
- Executed in isolated JS runtime: syntax parse of three edited JS files, and SC11 visual markup checks at duty 0/50/100 with three distinct waveforms. Authentic app Node suite and Windows/Edge user-path, DMM average, motor response and MQ-12 full regression are NOT_RUN.
- **MQ-00**: PARTIAL / REVIEW. Next engineering gate is an electrically grounded PWM-period DCV reading, fail-closed gate and motor connectivity, and a clearly declared calibrated/simplified motor dynamic model with quantitative acceptance tests; no invented manufacturer RPM.

## 2026-10-15 SC11 native PWM phase sampling and normalized motor feedback (REVIEW)
- User-requested SC11-only implementation on `main`: `Simulation.solveSc11Cycle` calls the original electrical `solve` for the PWM period's HIGH and LOW sample instants and restores the real-time instantaneous state. This avoids drawing conclusions from a single 50 ms browser timer sample of a 1 ms PWM period.
- `highDrive` / `lowDrive` are accepted only if the real native MOSFET/motor states, PWM source supply and stable/short-circuit guards pass. Broken gate or motor paths return 0% target. No independent UI-only `motorActive` fabricated.
- SC11 visual response `_sc11SpeedPercent` models a first-order *uncalibrated teaching trend* (350 ms time constant). This is NOT measured or calibrated manufacturer RPM. SC11's generic nominal `_motorRPM` path was removed; other motor lessons remain unchanged. Animation is derived from this trend while actual `_active` remains the instantaneous solver state.
- `VG` DCV: only if native two-phase readings are finite, valid, and the V/COM cables and G/S probe targets are intact, show the period-weighted virtual `VGS` DC mean using `DTSMultimeter.format`. Never substitute the duty × supply teaching estimate or override HOLD mode. Disconnects and invalid frequency leave the computed mean unverified.
- Added `tests/qa-mq07-sc11-pwm-cycle-v11920.test.cjs` with native 0/25/50/82/100% drive, measured VGS ordering, disconnected G/D/source/motor paths, invalid duty frequency and virtual inertia behavior. The existing `scripts/run-tests.cjs` discovers all `*.test.cjs`; `scripts/RUN_MQ12_SC11_LOCAL.cmd` also has a `qa-mq07-*.test.cjs` loop.
- Executed: JavaScript syntax compilation of changed source and regression test; direct V8 execution of actual `dist/mq05-virtual-pwm-contract.js` at 0/25/50/82/100% and invalid 0 Hz (PASS). This is a **standalone timing contract test only**, not native integration regression.
- **NOT_RUN:** full native SC11 test, all newly authored `node --test` assertions, whole 1,655-lesson regression, Windows packaged file:/// review and live user playback; GitHub source access works via connector but the local runtime cannot clone due github.com DNS, and connector-backed full-runtime test orchestration reached tool-call limits.
- Next gate (MQ-12 → MQ-13 → MQ-00): run local `node --test tests/qa-mq07-sc11-pwm-cycle-v11920.test.cjs` plus existing SC11 suites, `node scripts/run-tests.cjs`, `node scripts/check.cjs` with complete repo in a Node environment; inspect the real Windows SC11 lesson. If any numeric meter/probe topology or speed trend test fails, leave REVIEW and repair before release. Real physical MOSFET/motor calibration, inductive flyback and manufacturer safety characteristics remain outside acceptance.

## 2026-10-15 SC11 probe-continuity root-cause repair — controlled native fixture PASS
- In a controlled SC11 9-component project, actual original `simulation.js` plus 18 production module dependencies yielded `q1._mq07HealthGateV ≈ 11.881188 V` at HIGH while `vg._meter.value = 0 V`. This proved the missing `PLUG↔TIP` electrical link on the tutorial test probes, not simply an aliasing issue.
- Repair: `dist/simulation.js` joins `PLUG` and `TIP` **only** when `probeColor` is present AND `sc11MeasurementProbe === true`. `dist/tutorial-pedagogy.js` opts in `vgr` and `vgb` for this scene. Other lesson probes retain existing behavior until independent approval.
- Re-executed genuine 19 production source modules in isolated V8 against explicit SC11 schematic fixture: VGS DC averages at duties 0/25/50/82/100% were **0 / 2.9700 / 5.9400 / 9.7416 / 11.8800 V** with native motor drive targets **0/25/50/82/100%**. Six disconnected control/power edges all resulted in drive target 0%; invalid Hz, missing meter leads and HOLD mode gave no fresh VGS average. Normalized inertia accelerated then decelerated; no fabricated RPM.
- `tests/qa-mq07-sc11-pwm-cycle-v11920.test.cjs` now additionally verifies that only opted-in probes conduct `PLUG↔TIP`. Evidence with exact sample values and limitations: `evidence/mq07_sc11_vgs_pwm_fixture_20261015.json`.
- **MQ-12:** controlled live native V8 fixture **PASS**; authentic `node --test` suites, actual full-product catalog / 1,655 lesson audit, `node scripts/check.cjs` and Windows `file:///dist/index.html` interactive QA **NOT_RUN**. `dist/library.js` (~1.8 MB) is unavailable through connected text fetch; container cannot resolve GitHub to clone.
- **MQ-13:** updates on `main` only with `[skip ci]`; no force-push, no workflow dispatch or Actions runs. Verification and unmet gates recorded in-repo, no duplicate backlog ID.
- **MQ-00 verdict:** **REVIEW / CONDITIONAL**. Physical manufacturer-calibrated RPM, flyback and thermal safety remain outside scope. Do not close the SC11 review item until the complete Node and Windows checks actually pass.
