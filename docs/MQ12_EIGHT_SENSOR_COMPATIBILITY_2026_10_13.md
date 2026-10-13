# MQ-12 — Eight sensor model/terminal compatibility gate (2026-10-13)

**Status: REVIEW (fail closed).** This note records read-only catalog, canonical lesson and native-solver evidence. Neither an educational title nor a three-wire physical footprint is sufficient to authorize substitution of a real sensor.

## Source and executed regressions

- Source: user-provided \`DevreTasarimStudyo-main(2).zip\` with the verified GitHub \`main\` MQ-12 source changes overlaid in the test workspace. Node.js v22; no GitHub Actions.
- **49 / 49 PASS** on the existing Node regression scenarios; **4 / 4 PASS** on the new eight-topic compatibility scenarios. The complete 53-test local run gave **53 / 53 PASS** and zero failures. These are Node/source simulation tests, not physical panel, browser UI, or manufacturer's hardware calibration.
- Full native source QA: **1,655 lessons; 722 wired**; 939 effective catalog definitions. 722 / 722 classifications: 456 CONTROLLED, 67 UNSUPPORTED_ACTUATOR, 199 PASSIVE_STABILITY_ONLY, 0 MISSING_DEFINITIONS.
- Original three-phase stability: **2,166 / 2,166 PASS**. Control-profile phases: **2,052 / 2,052 PASS**. Causal response **421 PASS / 35 REVIEW / 266 N/A**, restoration **414 PASS / 42 REVIEW / 266 N/A**.
- Batch N source QA: **1,519 / 1,519 PASS**, zero issues (525 wired, 923 reference-only, 71 references with wires).
- Repeatable gate: \`node --test tests/qa-mq12-sensor-model-compatibility-v11920.test.cjs\` and source audit \`node scripts/qa-mq12-sensor-model-compatibility-v11920.cjs\`.

## Eight canonical topic-to-product mismatches

All eight lessons still place the original inductive PNP \`proximity\` with physically connected sensor terminals **BN / BU / BK**, followed by a relay and a **lamp**. None was changed by this audit.

| Lesson ID | Physical topic in canonical title | Existing catalog alternatives | Actual alternative terminals | Action |
|---|---|---|---|---|
| \`sensor-analog-apps-src-08\` | Piezo | \`tutorial-piezo\` | +, − | REVIEW: two-terminal signal interface, not a 24 V PNP switch |
| \`sensor-analog-apps-outline-047\` | Piezo | \`tutorial-piezo\` | +, − | REVIEW: amplifier/threshold stage absent |
| \`sensor-analog-apps-outline-048\` | Weight | \`load-cell\` / \`load-cell-excitation\` | EX+, EX−, SIG+, SIG− / P, M | REVIEW: bridge excitation and signal conditioning required |
| \`sensor-analog-apps-outline-085\` | Temperature | \`sensor-ntc\`, \`sensor-pt100\`, \`arduino-lm35\` | 1,2 / A,B1,B2 / VCC,AO,GND | REVIEW: analog resistance/voltage vs digital output |
| \`sensor-analog-apps-outline-089\` | Ultrasonic + buzzer | \`ultrasonic-switch\`, \`sensor-ultrasonic-nc\`, \`sensor-ultrasonic-analog\` | BN,BU,BK,WH / BN,BU,BK / BN,BU,Q | REVIEW: NO/NC state matters; existing output is a **lamp**, not a buzzer |
| \`sensor-analog-apps-outline-105\` | Temperature choice | \`sensor-pt100\`, \`sensor-ptc\`, \`temperature-controller\` | A,B1,B2 / 1,2 / 4–17 labelled controller pins | REVIEW: calibrated controller/control output needed |
| \`sensor-analog-apps-outline-121\` | Thermal effect | \`sensor-ntc\`, \`sensor-ptc\` | 1,2 / 1,2 | REVIEW: two-terminal thermistor needs an interface |
| \`sensor-analog-apps-outline-138\` | Chemical | \`arduino-mq2\` | VCC,AO,GND | REVIEW: analog chemical sensor is not a three-wire industrial digital PNP switch |

These catalog matches identify **candidates**, not approved part replacements; physical voltage range, pin-out semantics, amplifier/PLC/relay interfacing, display/measurement goals and educational narrative all require agreement before editing locked graphs.

## Native ultrasound counterexample: terminal match is NOT enough

Use a **temporary clone only** of \`sensor-analog-apps-outline-089\`; keep BN/BU/BK connections and introduce a noncanonical simulated metal target at 1000 mm → 150 mm → 1000 mm with declared range 400 mm.

| Model | Terminals | Modeled lamp output | Native stability |
|---|---|---|---|
| \`ultrasonic-switch\` | BN,BU,BK,WH | OFF→ON→OFF | 3/3 stable |
| \`sensor-ultrasonic-nc\` | BN,BU,BK | ON→OFF→ON | 3/3 stable |

The NC product has the convenient exact three-pin footprint but **inverts** the intended demonstration. The NO candidate has a fourth terminal, and the lesson's buzzer is missing. Therefore **neither model was silently placed into the canonical scene**; these synthetic fixtures have **no physical acceptance**.

## Remaining acceptance gates

- 35 sensor lessons lack approved physical targets. Synthetic virtual targets do **not** convert them into PASS.
- Eight lesson-topic/model mismatches remain open and may overlap those 35.
- Seven native RC/RL lessons have **707 / 707 stable solver phases** but restoration remains REVIEW: four capacitive examples retain voltage because the meter's 10 MΩ path produces approximately 1,000 s discharge τ; three RL examples settle in the virtual 10-second schedule. Physical time calibration and acceptable tolerances remain unspecified.
- MQ-12's 42 distinct behavior REVIEW records and Batch N pedagogical/UI acceptance are **not closed** by this metadata/model compatibility audit.
- Canonical graphs, identity/visual materials, existing accepted lessons and the Windows \`file:///\` launcher were not modified. No CI workflows invoked; commits use \`[skip ci]\`.

**Next specialist review:** approve the appropriate physical model and instrumentation for each of eight topics (particularly the ultrasonic buzzer), map exact manufacturer terminals to a realistic pedagogical circuit, and only then propose canonical migration with source-locked regression.
