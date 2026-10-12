# MQ-12 physical compatibility QA — sensor and reactive evidence (2026-10-12)

Read-only verification using the original user-uploaded repository ZIP and native Node.js solver. **This is not an approval to alter locked/canonical lesson diagrams, or to claim physical device/UI acceptance.**

## Baselines preserved

| Gate | Verified |
| --- | --- |
| Curriculum / wired lessons | 1,655 / 722 |
| Wired classification | 722/722 (456 controlled, 67 unsupported, 199 passive, 0 missing) |
| Independent electrical stability | 2,166/2,166 PASS |
| Control-profile stability | 2,052/2,052 PASS |
| Response | 421 PASS / 35 REVIEW |
| Restoration | 414 PASS / 42 REVIEW |
| Node regression suite (38 existing + 5 new) | **43/43 PASS** |
| Batch N source QA | **1,519/1,519 PASS; 0 issues** |
| Overall MQ-12 behavior | **REVIEW** |

## 35 missing-target sensor lessons

Run `node scripts/qa-mq12-sensor-polarity-v11920.cjs` to reproduce the full per-lesson ledger.

- **35/35** currently lack a modeled physical target. Do not add a guessed metal target to all cases, and do not mark any synthetic target fixture as canonical PASS.
- **1 confirmed direct-load topology mismatch:** `dual-dc-2` feeds lamp X1 from G2.P, lamp X2 to sensor BK, common 0 V between G1 and G2. This is **NPN/sinking** topology but the placed `proximity` component defaults to **PNP/sourcing**. In a clone-only test, NPN switches the lamp OFF→ON→OFF while unchanged PNP does not. Reconcile the *physical product type* and the locked lesson connections before editing either.
- **1 explicit title/polarity conflict:** `open-collector-1` names NPN but the placed `proximity` sensor is PNP. Review intended wiring/product/title as one canonical decision.
- **8 topic/model conflicts:** lessons describing *piezo, weight, temperature/thermal, ultrasonic or chemical* sensors currently place a generic **inductive `proximity`** sensor. The detector may respond to a synthetic metal target but that does **not** demonstrate the real lesson's physical mechanism. Investigate model/template fidelity first. The 8 IDs are `sensor-analog-apps-src-08`, `sensor-analog-apps-outline-047`, `sensor-analog-apps-outline-048`, `sensor-analog-apps-outline-085`, `sensor-analog-apps-outline-089`, `sensor-analog-apps-outline-105`, `sensor-analog-apps-outline-121`, `sensor-analog-apps-outline-138`.
- These flags can overlap. Only simple **direct BK→lamp** loads with a grounded supply return are assigned a proven required PNP/NPN polarity; relay circuits and ambiguous topologies do not receive speculative polarity claims.

## Seven native RC/RL restoration reviews

Run `node scripts/qa-mq12-reactive-time-constants-v11920.cjs` to reproduce the measured values with 100 ms native numerical steps from 0 to 10 s (**707 stable solver phases**, canonical lessons unchanged).

- **4 capacitor lessons:** series charge resistor 10 kΩ and capacitor 100 µF give nominal **R·C=1 s** during charging. When the momentary button opens, the disconnected charging path does **not** imply that the capacitor is perfectly isolated: the native voltmeter model has **10 MΩ input impedance**, creating a very slow discharge path **τ ≈ 10 MΩ × 100 µF = 1,000 s**. The native numerical trace fell from approximately **7.606 V at 0.4 s** to **7.533 V at 10 s**, with measured off-state τ ≈ **1,000.05 s**. Restoration therefore correctly remains **REVIEW**, not FAIL or PASS. Previous “no discharge route” wording is superseded by this high-impedance instrument finding.
- **3 inductive lessons:** 2 H reactor and 100 Ω resistor give nominal **L/R = 0.02 s**. Their native meter currents approached zero by the 10-second window; a separate release-time tolerance and real instrument acceptance policy is still required before upgrading restoration.
- **Do not conflate:** a virtual solver sample schedule with actual hardware time calibration, or numerical stability with verified discharge safety.

## Reproduction and guardrails

```sh
node scripts/qa-mq12-sensor-polarity-v11920.cjs
node scripts/qa-mq12-reactive-time-constants-v11920.cjs
node --test tests/qa-mq12-physical-evidence-v11920.test.cjs
```

The new 5-test suite passed using the native implementation and unmodified canonical objects; combined with the prior 38 tests **43/43 PASS**. The detailed evidence is also available as a JSON report in this conversation. No GitHub Actions executed and commits use `[skip ci]`.

**Next acceptance blockers:** confirm the 8 lesson-topic sensor models, resolve `dual-dc-2` and `open-collector-1` product/diagram polarity, supply grounded physical stimuli for the 35 targets, and define suitable restoration tolerance/measurement semantics for the 7 reactive examples. Keep all 42 distinct behavior REVIEW lessons open until independently justified.
