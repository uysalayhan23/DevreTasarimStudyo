# MQ-00 → MQ-07 → MQ-05 → MQ-03/MQ-10 → MQ-12 → MQ-13: SC15 review
2026-10-15 · repo `uysalayhan23/DevreTasarimStudyo` · branch `main`

**Acceptance: IMPLEMENTED / targeted isolated V8 tests 6/6 PASS / full native Node + Windows QA NOT_RUN / MQ-00 REVIEW (NOT DONE).**

## Why the previous lesson did not work
SC15 ("Tristörün AC’de çalışması") was a reference-only `quiz` with no wiring and no AC waveform solver. The general network solver largely represents AC voltages as steady phasors. A physical SCR requires a time-dependent gate event, single-direction conduction, positive half-wave holding current and current extinction on approaching the zero crossing. A pushbutton or a static SCR symbol cannot implement this.

## New software-only virtual circuit (MQ-07, MQ-09)
- `AC1` = `virtual-isolated-ac-12v`, 12 V RMS / 50 Hz (configurable 1–24 V RMS, 50/60 Hz); **no mains terminals**, manufacturer-like physical dimensions not asserted.
- `TRG1` = `virtual-ac-scr-trigger-v1`, AC/RET zero-crossing phase reference, OUT gate pulse, angle default 90°, pulse width default 25°. This is a separate user-selectable, terminalized electrical part, **not a motor or a hidden switch**.
- `RG` = resistive 1 kΩ gate path, `Q1` = library ST TYN612RG SCR with physical A/K/G terminal names, `H1` = 120 Ω virtual lamp.
- Seven canonical wires: AC1/AC→H1/X1→H1/X2→Q1/A, Q1/K→AC1/RET; AC1/AC→TRG1/AC, AC1/RET→TRG1/RET, TRG1/OUT→RG/1→RG/2→Q1/G. App teaching UI now exposes 0/45/90/135/170° angle choices.
- Two explicit orthographic instrument fronts and right-sidebar configuration controls were added; the material render dispatch occurs **before generic fallbacks**. No SHAFT terminals or motor rotation indicators. Existing PWM1, SC11 and SC12 wiring and their renderers were not changed.

## Native electrical SC15 phase solver (MQ-05)
- `Simulation.solveSc15AcCycle` delegates ordinary validation to `solve` and adds a narrowly scoped positive half-wave solver only for SC15. It reads actual wires (also supports junction nets), validated RMS/frequency/phase inputs, virtual gate pulse width, 120 Ω resistive load and `holdingCurrent` of the real product catalog definition.
- For 50 Hz, instantaneous sine source voltage is `sqrt(2) × 12 × sin(2πft)`. The gate pulse is synchronized to the user-selected positive half-wave angle. The SCR is allowed to carry positive load current only after firing and above its virtual holding threshold; conduction clears approaching 180° and cannot continue through the negative half. The 360° waveform and 2-degree-sampled output RMS are calculated from phase and load model, not copied from a slider.
- Source, phase trigger, lamp and SCR expose simulated transient states. The lesson graph shows source sine, gate pulse and load waveform; normal 50 ms static simulator cadence is replaced by 16 ms when SC15 runs.
- **Not a manufacturer SPICE or physical gate-current/thermal model**. RMS is an idealized virtual educational output. No promise of a physically calibrated oscilloscope connection, shock-safe hardware isolation, or live 230 V operation.

## Execution evidence (MQ-12)
Actual GitHub `main` file text was loaded and executed in an isolated JavaScript environment:
- `dist/tutorial-lessons.js`, `tutorial-expanded-lessons.js`, `tutorial-source-outline.js`, `tutorial-pedagogy.js`: the 1,655-lesson curriculum loaded successfully.
- An existing old SC12 catalog reconciliation erroneously required the virtual IGBT even after SC12 was rebuilt using FGA25N120ANTD. It was corrected to preserve the already-manufacturer-coded SC12 circuit; this fixed an actual fatal tutorial loader error discovered during SC15 checks.
- Six cases in `tests/qa-mq07-sc15-ac-scr-phase-v11920.test.cjs` ran through an isolated V8 test harness against the actual curriculum, actual product definitions, and original `simulation.js`, `current-model.js`, component/contact/thermal/sensor source, with unrelated runtime peripherals stubbed: **6/6 PASS**.
- Positive-half waveform: 90° gate high, SCR ON; at 120° gate low but SCR still conducts; at 180° it is OFF; 225°, 270° and 359° negative half OFF. 360° periodic continuation checked.
- Angle/RMS values for nominal 12 V RMS: 0° ≈7.84 V, 45° ≈7.52 V, 90° ≈5.61 V, 135° ≈2.23 V, 170° =0 V (below model holding threshold).
- Seven independently broken supply/reference/gate/load wires: seven fail-closed cases, no lamp output. Invalid 230 V source setting, frequency, gate angle/pulse, disabled source/trigger and zero load resistance are rejected.
- Both material fronts generated nonempty SVG with correct titles, no SHAFT marker, and JS source files parsed successfully.

## Unclosed acceptance
Full Node test runner, independent 1,655 lesson runtime regression, packaged Windows `file:///` application, terminal-hitbox/wire-label visual observation and manual scope interaction have **NOT_RUN** here. Do **not** mark SC15 or global G7/G8 DONE from source/static/isolated evidence. In particular, verify SC15 training-panel waveform and angle input in a real browser.

MQ-13 repository continuity: commits on existing `main`, `[skip ci]`, no force-push, no temporary branch, GitHub Actions not run.

MQ-00 final: **REVIEW**. Next sequential task: SC16 — Triyakın DC’de çalışması; preserve user-confirmed SC11 and the SC12–SC15 electrical teaching contracts.
