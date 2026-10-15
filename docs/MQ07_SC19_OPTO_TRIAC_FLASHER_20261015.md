# MQ-00 / MQ-07 — SC19 Opto-triyak ile flaşör · 2026-10-15

Repo: `uysalayhan23/DevreTasarimStudyo`; only active branch `main`.
**Decision: IMPLEMENTED / targeted isolated JavaScript 9/9 PASS / MQ-00 REVIEW (NOT DONE).**

## Defect and repair
SC19 previously contained an unwired concept card. The new lesson uses:
- **DC side only:** independent 5 V virtual G1 bench supply; `T1 virtual-opto-flasher-timer-v1` with V+/GND/OUT, 2 Hz / 50% adjustable duty; `RIN` 330 Ω; identified `MOC3021` optotriac LED pin 1 anode and pin 2 cathode.
- **AC side only:** independent `AC1 virtual-isolated-ac-12v` software-only 12 V RMS / 50 Hz source; H1 120 Ω virtual resistive lamp; `ST BTA16-600B` physically identified MT1/MT2/G TRIAC; RDR 330 Ω, RG 180 Ω and RREF 10 kΩ **virtual educational** gate path.
- **Optical transfer:** MOC3021 output pins 6 (T2) and 4 (T1) belong to the AC-side trigger path, never to G1 DC wiring. G1/M and AC1/RET are separate nets. 14 canonical electrical connections; no generic fake switch, no SHAFT or rotating-device type.
- MOC3021 package is catalog-identified PDIP-6, pin labels 1/2/4/6. Special orthographic MOC3021 and timer fronts route before generic package fallback; the BTA16 insulated TO-220AB front and MT1/MT2/G from SC16 are reused, not duplicated.
- This is a **low-voltage SOFTWARE SIMULATION**. MOC3021 optical current threshold, gate trigger current, insulation withstand, transient response and manufacturer's SPICE behavior **are not calibrated/accepted**. No real AC mains, physical opto coupler insulation test or hardware wiring acceptance is asserted.

## Solver and teaching behavior
`Simulation.solveSc19OptoTriacCycle` is SC19-only and runs from `dist/app.js`. It checks the real electrical terminal-to-terminal nets (including junctions), component IDs and parameters. It explicitly rejects DC/AC crossover wiring even through resistive paths; these domains are coupled ONLY by simulated optical operation.
- Timer high drives opto input LED only if the current exceeds the virtual opto threshold. Timer low and disabled/invalid supplies are OFF; duty and frequency are controlled through right properties panel and SC19 teaching buttons.
- For each AC half-period, an isolated 12 V RMS sine, modeled resistive load, virtual 1 V on-state drop, virtual 30 mA holding current and opto output gate limit are sampled at 1° resolution. Once triggered, the BTA16's modeled current can remain ON even when the LED turns OFF mid-half, then drops below the holding threshold near the zero crossing. Both positive and negative half-wave currents have correct signs. RMS is computed from squared load waveform samples, **not** simply a slider label.
- The tutor panel displays live opto LED current, output state, two-domain isolation status, BTA16 state, AC phase, H1 RMS and source/load/gate curves, plus 0/25/50/75/100% and 1/2/4 Hz controls.
- The 16 ms UI refresh rate is limited to SC19 and existing waveform exercises; previous SC11–SC18 solver paths are preserved.

## MQ-12 targeted executed evidence
`tests/qa-mq07-sc19-opto-triac-flasher-v11920.test.cjs` — **9/9 PASS**, by executing actual GitHub lesson/catalog/simulation/render source in an isolated JS harness with unrelated external runtime dependencies replaced by explicit stubs.
1. Genuine lesson with 10 components, correct 14 wires and terminal IDs
2. MOC3021 LED ON drives both AC half-waves; zero crossing extinguishes current
3. 2 Hz/50% flashes ON/OFF; frequency and duty affect actual modeled waveform RMS
4. LED OFF within an AC half-wave cannot extinguish previously latched main current immediately
5. All 14 individual cable disconnections fail closed, no AC load RMS
6. Direct and resistor-mediated DC/AC crossover rejected
7. Disabled, malformed and insufficient LED/gate drive fail closed
8. STOP clears all opto, timer and lamp transient states
9. Both optical and timer orthographic SVG fronts render without mechanical SHAFT

Sampled ON-state 12 V RMS AC with modeled TRIAC drop: ~11.07 V RMS; timer OFF: 0 V. Positive half current positive, negative half current negative. 1,655 lesson definitions load successfully; SC19 now `kind=wiring`.

**Unexecuted gates:** full native `node scripts/run-tests.cjs`, 1,655 independent behavioral cases, Windows `file:///` browser UI and measurement lead/scope integration, manufacturer dimensional approval and physical safety acceptance. No fabricated PASS. MQ-00 remains **REVIEW**.

## Team and continuity
MQ-07 lesson topology → MQ-09 parts → MQ-04 MT1/MT2/G and opto pin validation → MQ-05 waveform / isolation solver → MQ-03/MQ-10 artwork and controls → MQ-12 target executed evidence → MQ-13 main / `[skip ci]` / no Actions → MQ-00 REVIEW.

SC11–SC18 canonical lesson source blocks remain unchanged by SC19 implementation, except shared simulator and renderer being extended with SC19-only branches. No force push, no temporary branches, no GitHub Actions.

Next curriculum item: `sensor-analog-apps-src-01` — **NTC ile sıcaklıkta çalışan devre**.
