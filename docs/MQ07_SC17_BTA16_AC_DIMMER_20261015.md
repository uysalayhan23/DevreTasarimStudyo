# MQ-00 → MQ-07/MQ-05/MQ-04/MQ-03 → MQ-12 → MQ-13: SC17 TRIAC dimmer
2026-10-15 | Only repo `uysalayhan23/DevreTasarimStudyo` | branch `main`

**Status: IMPLEMENTED; 9/9 SC17 targeted isolated JS regression PASS; full Node/Windows visual acceptance NOT_RUN; MQ-00 REVIEW, not DONE.**

## Previous state and corrections
- SC17 "Triyaklı dimmer" was an unwired conceptual quiz; labels, theoretical 20 ms and alpha=90° 5 ms did not provide functional phase dimmer behavior or any validated RMS result.
- New canonical scene `electronic-switching-src-17` is a 7-wire, **software-only, isolated 12 V RMS / 50 Hz** AC circuit:
  - `AC1`: existing virtual isolated sine supply `virtual-isolated-ac-12v`, AC/RET electrical outputs.
  - `TRG1`: new separately selectable `virtual-ac-triac-trigger-v1`, AC/RET reference and signed OUT gate pulses once per *each* half-wave, adjustable 0–170° phase angle and 1–45° pulse width.
  - `RG`: software gate current-limit equivalent of 1 kΩ.
  - `Q1`: actual catalog **ST BTA16-600B** TRIAC identity, insulated TO-220AB, named/ordered manufacturer pins **MT1(1), MT2(2), G(3)**.
  - `H1`: 120 Ω virtual resistive lamp.
- Wiring: virtual AC1/AC→H1/X1, H1/X2→Q1/MT2, Q1/MT1→AC1/RET, AC1/AC→TRG1/AC, AC1/RET→TRG1/RET, TRG1/OUT→RG/1, RG/2→Q1/G. These represent simulator terminals, **not** real hardware instructions. No physical mains terminals or exposed live source were added.
- The SC16 DC latch, existing BTA16 orthographic body and all prior SC11–SC16 scene connections remain preserved.

## MQ-05 phase and RMS solver
- New `Simulation.solveSc17TriacDimmerCycle` is dispatched **only** when the SC17 lesson ID/project ID matches. Other TRIAC, SCR, IGBT, MOSFET, PWM solvers retain their original contracts.
- It calls the original `solve` for standard stability and net faults; builds real electrical net unions from the scene's wires (also junction endpoints). SC17 is invalid/fail-closed if any essential power/gate/source reference or MT1/MT2 path is missing, or terminals are improperly shorted.
- Input validation: source enabled, gate enabled, numeric 1–24 V RMS and 45–60 Hz, angle 0–170°, pulse 1–45°, valid positive resistive load, valid gate resistance and a bounded **educational virtual** holding current (0.03 A scene parameter).
- For each positive *and* negative half of a sine period, phase starts at a zero crossing. An independent signed gate pulse fires after the configured angle. Conduction persists after the gate pulse until the modeled load current falls below the illustrative holding-current threshold near the next zero crossing. No DC latch leaks across an AC zero crossing.
- Instantaneous load voltage/current are signed by polarity; an idealized 1 V illustrative conduction drop is subtracted. A full cycle is sampled at 2° resolution for the virtual load RMS (`sqrt(mean(V_load²))`). Sampled source/gate/load voltages also populate a plotted signed waveform. The right sidebar permits both angle and pulse controls; the learner panel has 0/45/90/135/170° buttons, instantaneous signed readings and a two-half graph.
- Output is a **virtual training model**, NOT manufacturer-calibrated BTA16 gate quadrants, IGT, holding-current curves, power/thermal losses, photometry, source hardware or SPICE acceptance.

## MQ-12 isolated executable evidence
The actual current GitHub source files (lesson base, 1655 curriculum, product catalog, thermal/sensor/component/contact/nodal simulation modules, orthographic renderer and target test) were loaded and executed in an isolated V8 JS environment. Peripheral runtime/UI modules were mocked. The 9 cases in `tests/qa-mq07-sc17-triac-ac-phase-v11920.test.cjs` were **9/9 PASS**:
1. Real BTA16 pin identity and 7 verified wire endpoints.
2. Orthographic insulated BTA16 body and bipolar driver front, neither displaying mechanical SHAFT/motor glyphs.
3. Positive half pulse at +90°, latch after pulse, extinction at 180°.
4. Negative half pulse at −270° (−5 V gate), negative load voltage/current and extinction at 360°.
5. 360° RMS from signed waveform, decreasing with angle, valid positive/negative gate traces.
6. Seven disconnected power, gate, reference or resistor wires all fail closed.
7. Invalid/missing source settings, unsupported 230 V, disabled trigger, bad angle/resistance fail closed.
8. STOP/`Simulation.clear` clears wave, RMS and transient state.
9. SC11–SC16 remain reachable, wired and retain prior main component identities.

Sample values at 12 V RMS 50 Hz, 120 Ω lamp, idealized 1 V drop and 0.03 A virtual hold: 0° ≈11.085 V RMS, 45° ≈10.629 V, 90° ≈7.928 V, 135° ≈3.148 V, 170°=0 V in this particular simplified virtual model. These are not physical BTA16 measurements.

The entire **1,655-lesson curriculum source loaded successfully**, but a load check is not a 1,655-lesson execution regression.

## Remaining acceptance gates (NOT_RUN, not PASS)
- Native Node `node scripts/check.cjs` and `node scripts/run-tests.cjs` in full repository checkout; Windows packed `BASLAT.bat`/`file:///` application UI and actual pin-click/wire usability.
- Independent QA of signed waveform display, sidebar controls and instrument oscilloscope attachment; manufacturer mm-scale orthographic physical geometry (catalog explicitly has `manufacturerGeometryAccepted:false`).
- Physical gate current, TRIAC quadrants, loss/thermal transients and actual RMS metrology. Never convert the virtual data into a real-world electrical safety claim.

## MQ chain, continuity and next
MQ-07 lead → MQ-05 independent waveform/net and RMS review → MQ-04 MT1/MT2/G geometry → MQ-03 renderer → MQ-10 controls → MQ-12 isolated executable evidence → MQ-13 repo continuity → MQ-00 **REVIEW**.
Only `main` and `[skip ci]` commits, **GitHub Actions not run**, no temporary branches or force-push.

Next sequential task: **SC18 — Optokuplörün çalışması**. Requires distinct LED and phototransistor sides and honest uncalibrated CTR/galvanic isolation learning behavior; preserve SC11–SC17.
