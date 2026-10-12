# MQ-12 — Native solver control profile audit (2026-10-12)

Source: user-provided `DevreTasarimStudyo-main(2).zip`, compared with GitHub `main` for MQ-12 changes. Canonical lesson graphs were **cloned, never edited**. No GitHub Actions.

## Reproducibility and scope

- Native engine: `dist/simulation.js`; curriculum: `scripts/qa-tutorial-1655-simulation-v11920.cjs`.
- 1,655 lessons, 722 with wires, 939 effective catalog definitions.
- Original independent three-stage baseline `qa-tutorial-722-sequential-v11920.cjs`: **2,166 / 2,166 stable**, 0 solver failures; behavior acceptance stays **REVIEW**.
- New `qa-mq12-control-profiles-v11920.cjs`: 722/722 classification and **2,054 / 2,054 stable additional controlled stages**. Passive / unsupported lessons receive **no simulated actuation PASS**; their independent three-phase baseline was tested separately.
- New profiles include 343 START→release→STOP→release latching circuits, 77 direct toggles, 36 proximity/sensor toggles. 67 unsupported actuators and 199 passive graphs are classified, not given a fabricated response.
- Run bounded groups to avoid tool/runtime limits: `node scripts/qa-mq12-control-profiles-v11920.cjs 0 50`, then starts 50,100,...,650 (count 50), finally `700 22`. Reports written beneath `build/`.
- Conservatively compare downstream observed load / instrument state against time-matched **unactuated solver baselines**; internal control state alone is not evidence of response.

## Native results (full 722 wired lessons)

| Classification | Lessons |
|---|---:|
| CONTROLLED | 456 |
| UNSUPPORTED_ACTUATOR | 67 |
| PASSIVE_STABILITY_ONLY | 199 |
| MISSING_DEFINITIONS | 0 |
| Total | 722 |

| Controlled behavior | PASS | REVIEW | NOT_APPLICABLE |
|---|---:|---:|---:|
| Response | 383 | 73 | 266 |
| Restoration | 382 | 74 | 266 |

Across those **74 distinct REVIEW lessons**, the overlapping diagnostic tags are:
- **35** `SENSOR_STIMULUS_NOT_MODELED`: toggled sensor state alone cannot prove a physically triggered sensing event.
- **39** `NO_DOWNSTREAM_RESPONSE`, plus **38** `NO_OBSERVABLE_SINK`: missing causal evidence, sometimes by design for theory/source lessons.
- **1** `LATCH_HOLD_UNVERIFIED`: `motor-direct-power-src-04` START-release holding behavior needs targeted circuit analysis.
- 67 unsupported actuators (including Arduino-related lessons) and 199 passive circuits are **not** included in behavior PASS; these are classification counts, not simulation defects confirmed in production.

The tags overlap; do **not** add them to calculate distinct unresolved lessons.

First 10 native lessons: 8 controlled have **8/8 causal response PASS** and **8/8 restoration PASS** (latch uses STOP after START release), 2 Arduino lessons remain unsupported. Only controlled lessons were simulated in the extra profile scan; their first 10 produced 26 stable profile phases.

## Executed validation

- `node --test tests/qa-mq12-control-profiles-v11920.test.cjs tests/qa-mq12-native-first-ten-v11920.test.cjs tests/qa-mq12-small-batches-v11920.test.cjs` → **12/12 PASS**.
- `node scripts/qa-tutorial-practice-1519-v11920.cjs` → **PASS**, examined 1,519 guides, 525 wired, 923 reference-only, 71 reference-with-wires, 2,085 observations, zero issues.
- `node --test tests/tutorial-practice-guide-batch-n-v11920.test.cjs` → **3/3 PASS**.
- Original independent baseline `Legacy.audit()` → 722/722/722 stable native solves, **PASS**.

**Remaining gates:** 73 response and 74 restoration reviews (74 distinct lessons), sensor physics models, unsupported Arduino stimuli, per-part accuracy, browser pedagogy, physical device/Windows checks. Do **not** claim overall 722 behavior accepted based solely on stability or targeted profiles.

## Follow-up: targeted REVIEW reduction and fail-closed regression (2026-10-12 evening)

Re-checked using the user-uploaded canonical `DevreTasarimStudyo-main(2).zip` with Node.js v22 and the real `dist/simulation.js`. This is a virtual solver audit, **not** physical device or browser/UI acceptance.

### Updated native QA (full 722 wired lessons)

| Area | Verified after targeted correction |
| --- | ---: |
| Classification | 722/722; 456 controlled, 67 unsupported, 199 passive, 0 missing |
| Independent baseline stability | 2,166/2,166 stable, **PASS** |
| Native control-profile stability | 2,052/2,052 stable, **PASS** |
| Controlled causal response | 391 PASS, 65 REVIEW |
| Controlled restoration | 384 PASS, 72 REVIEW |
| Distinct remaining REVIEW lessons | **72** |
| General behavioral acceptance | **REVIEW** |

**Why profile phases decreased from 2,054 to 2,052:** `motor-direct-power-src-04` is a **momentary jog**, not a self-holding seal-in circuit. It should be audited in 3 phases instead of a 5-phase START/STOP latch profile. The native 5-step targeted confirmation `OFF → START ON → START released OFF → STOP OFF → STOP released OFF` was stable and the motor/coil outputs matched each step. This correction converts that lesson's restoration REVIEW into PASS without changing any canonical graph.

**Visible multimeter outputs:** `unit-ut33d-plus` carries `kind='multimeter'`, so it is a real observable sink even though it was previously excluded from `observedKinds`. Seven reactive lessons had causal multimeter readings under virtual START/RELEASE, changing their response verdict from REVIEW to PASS **without** granting a false restoration PASS. Their measurable capacitor/inductor residual state remains `REACTIVE_STATE_NOT_SETTLED` and restoration REVIEW. `measurement-workshop-src-10` has a pre-existing physical sensing target and a causal multimeter response, so both its response/restoration pass with the native modeled stimulus.

**Fail closed:** Restoration now requires **causal response as well as baseline-matched return**, preventing unchanged meter outputs from receiving restoration PASS. The 35 sensor lessons without defined target stimulus stay REVIEW. There are 31 `NO_DOWNSTREAM_RESPONSE` and 7 `REACTIVE_STATE_NOT_SETTLED` diagnostic tags; tags overlap among the **72 distinct** open lessons.

### Regression and independent baseline caveat

- Node: `node --test tests/qa-mq12-review-targeted-v11920.test.cjs tests/qa-mq12-small-batches-v11920.test.cjs tests/qa-tutorial-722-sequential-v11920.test.cjs tests/tutorial-practice-guide-batch-n-v11920.test.cjs tests/qa-tutorial-practice-1519-v11920.test.cjs` → **29/29 PASS**.
- Independent `qa-tutorial-722-sequential-v11920.cjs` still records **8 unresolved restoration reviews**, all visible in `restorationFailures`, while 2,166/2,166 electrical phases are stable. The old `node --test` harness incorrectly expected zero restoration reviews and called `main()` (which sets exit code 1 for known behavior reviews). It now calls `audit()`, ensures zero actual solver faults, and deliberately preserves unresolved restoration as REVIEW.
- Batch N: source audit **1,519/1,519 PASS**, 525 wired, 923 reference-only, 71 reference with wires, 2,085 observations. Batch N node regressions are included in the 29/29.
- All acceptance remains **REVIEW** for physical circuit realism, unsupported Arduino/sensors, and actual teaching/UI rendering; do not promote this to project-wide PASS.

No GitHub Actions were invoked. Every change was committed with `[skip ci]`.

## MQ-12 unresolved behavior investigation — read-only follow-up (2026-10-12)

Reproducible script: \`node scripts/qa-mq12-review-diagnostics-v11920.cjs\` (writes \`build/qa-mq12-review-diagnostics-v11920.json\`).
Regressions: \`tests/qa-mq12-review-diagnostics-v11920.test.cjs\`. Uses the real user-uploaded source snapshot, native solver, original canonical lessons, effective catalog, sensor detector, and probe-target resolver. Never alters canonical lesson content.

| Controlled QA gate | Native verified |
|---|---:|
| Curriculum / wired lessons | 1,655 / 722 |
| Native classification | 456 controlled, 67 unsupported, 199 passive, 0 missing |
| Independent native solver phases | 2,166/2,166 stable PASS |
| Controlled profile phases | 2,052/2,052 stable PASS |
| Causal response | 391 PASS, **65 REVIEW** |
| Restoration | 384 PASS, **72 REVIEW** |
| Distinct behavior REVIEW lessons | **72** |

**Sensor evidence, NOT acceptance**: 35 canonical lessons lack a defined sensing target. On *temporary test clones only*, assign a material compatible with the manufacturer's modeled sensor principle, move the target far→near→far, and independently compare the output against an unchanged, time-matched physical-target baseline. **35/35** detector transitions and stable solver phase sequences were observed; **34/35** produced causal downstream output and **35/35** returned to the baseline. \`dual-dc-2\` detected the virtual target but still showed no downstream response. These are *synthetic diagnostic fixtures*: the original 35 lessons **remain REVIEW** until canonical target definition and pedagogy are reviewed.

**31 no-response records**: 30 use a BJT (transistor) and have legitimate attached probe targets according to \`probe-leads.resolve\`. Do **not** misdiagnose them as disconnected multimeters. Their genuine circuit/semiconductor response still needs dedicated investigation; the 31st record overlaps the sensor set (\`dual-dc-2\`).

**7 reactive restoration records**: native runs with a longer simulated-time schedule \`[0,400,850,1500,3000,10000]\` showed stable solver phases for all seven; **three** returned to their original baseline at or before the last step, while **four** did not. This exploratory simulation is not physical-time calibration or acceptance; all seven **remain restoration REVIEW** until expected time constant, measurement tolerance, and connected probe semantics are established.

**Executed tests**: \`node --test tests/qa-mq12-review-diagnostics-v11920.test.cjs tests/qa-mq12-review-targeted-v11920.test.cjs tests/qa-mq12-small-batches-v11920.test.cjs tests/qa-tutorial-722-sequential-v11920.test.cjs tests/tutorial-practice-guide-batch-n-v11920.test.cjs tests/qa-tutorial-practice-1519-v11920.test.cjs\` → **33/33 PASS**. The standalone Batch N QA also returned **PASS**, 1,519 examined, 0 issues, 2,085 observations. No Actions, every GitHub commit \`[skip ci]\`.

These new tests distinguish proven solver behavior from hypothetical sensor stimuli, preserve all pre-existing acceptance gates, and do not promote unfinished or physically unverified lessons to PASS.
