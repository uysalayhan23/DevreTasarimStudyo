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
