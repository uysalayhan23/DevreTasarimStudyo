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


## Follow-up: native ultrasonic buzzer *clone-only* terminal validation (2026-10-13)

**Canonical scope:** \`sensor-analog-apps-outline-089\` is titled "5.3.3.Ultrasonik Sensör ve Buzzer Uygulaması" but still contains an **inductive PNP proximity sensor** and a **lamp-green** with terminals \`X1/X2\`, not a buzzer. Do not call this lesson physically accepted.

A new executable, \`scripts/qa-mq12-ultrasonic-buzzer-fixture-v11920.cjs\`, makes three **noncanonical copies only**. It replaces the virtual lamp with existing catalog \`buzzer\` (\`1/2\` terminals), contrasts existing catalog \`ultrasonic-switch\` and \`sensor-ultrasonic-nc\`, and uses synthetic 1000→150→1000 mm target distance. **The original source graph, pin identities and lesson text remain intact.**

| Clone-only native 3-phase experiment | Sensor behavior | Buzzer state | Stable phases | Acceptance |
| --- | --- | --- | --- | --- |
| \`ultrasonic-switch\`, load wires correctly remapped \`X1→1\`, \`X2→2\` | Virtual normally-open | OFF→ON→OFF | 3/3 | Noncanonical REVIEW |
| \`sensor-ultrasonic-nc\`, correct buzzer pins | Virtual normally-closed | ON→OFF→ON | 3/3 | Noncanonical REVIEW |
| \`ultrasonic-switch\`, load changed to buzzer but old \`X1/X2\` endpoints retained | Relay responds; buzzer pins disconnected | OFF→OFF→OFF | 3/3 | Wiring mismatch REVIEW |

**Native solver evidence:** in the third case the relay still shows OFF→ON→OFF while buzzer remains inactive. A mere replacement of the component \`typeId\` is insufficient; **matching terminals must be deliberately remapped** in a separately approved lesson migration.

**Source-level product uncertainty:** existing catalog \`ultrasonic-switch\` exposes **BN/BU/BK/WH** and a modeled 4-wire virtual switching output, but **does not identify an exact manufacturer's orderable part or verify that its BK/WH function matches a chosen real device**. \`sensor-ultrasonic-nc\` exposes BN/BU/BK with an NC behavior. Catalog \`buzzer\` defines terminals \`1/2\` but **does not establish exact product-rated DC voltage**. No physical product or industrial-panel acceptance is authorized by a successful virtual trace.

External manufacturer/supplier evidence reinforces fail-closed: Telemecanique Sensors model-specific ultrasonic pin diagrams show that BN/BU/BK/WH roles and NO/NC outputs can differ by article and configuration:
- https://www.telemecaniquesensors.com/us/en/product/reference/XXS30P1PM12
- https://media.distributordatasolutions.com/json_telemecanique_sensors/2023q3/documents/f15768ef19bce226eb7b26c4870d3e43fd21a4d9.pdf

Piezo/weight/temperature/chemical lesson replacements remain **unapproved** until bridge/amplifier, instrument voltage range, terminal geometry, safe interface and actual pedagogical goal are documented. Catalog-only candidates do not become accepted manufactured devices without exact references.

**Executed in the user-provided native Node workspace:** the original 54-case MQ-12/Batch N regression set plus **five** new buzzer fixture cases → **59/59 PASS**. Native lesson-source audit **1,655/1,655 PASS** (722 wired); Batch N source audit **1,519/1,519 PASS** (0 issues). The independent 722 × 3-phase solver baseline is a **stability-only PASS**, not project behavior acceptance. Overall **42 distinct behavior REVIEW** lessons remain open (35 target-unconfigured sensors, 7 reactive restoration lessons; eight topic/model conflicts overlap the sensor set). No original circuit graphs, UI, or physical product mappings changed; GitHub Actions unused and all commits \`[skip ci]\`.

**Next gate:** select an exact manufacturer model for the ultrasonic NO output, verify its terminal data against the catalogue and signal/load electrical ratings, approve a buzzer product and educational behavior, then seek a **source-locked** canonical graph migration. Until then retain \`physicalAccepted:false\`.
