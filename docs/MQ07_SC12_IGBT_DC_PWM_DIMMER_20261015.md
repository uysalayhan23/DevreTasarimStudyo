# MQ-00 / MQ-07 — SC12 IGBT/DC PWM dimmer repair checkpoint
Date: 2026-10-15. Repo: uysalayhan23/DevreTasarimStudyo, main.

## Prior and new state
- User independently confirmed SC11 MOSFET/DC motor control now runs correctly in Windows; preserve SC11 implementation and its remaining technical acceptance gates.
- SC12 title: "IGBT ile dimmer". Historical circuit was only a push-button S1 driving a virtual IGBT to switch a lamp ON/OFF. That is not a dimmer.
- SC12 project now contains a genuine catalog FGA25N120ANTD IGBT (G/C/E), terminalized functional PWM1 generator (V+/GND/OUT), independent DC source, RG/RP gate resistors and a low-voltage resistive light load with nine wires. S1 and generic virtual IGBT are gone.
- This is explicitly a **12 V virtual DC PWM dimmer experiment**, not an AC phase-angle/230 V dimmer. Real device current/thermal/switching loss/luminous flux and datasheet-grade geometry are unverified. No unsafe physical wiring instructions.
- IGBT G/E voltage is obtained from the project nodal electrical model when this training scene is active; a gate resistor does not silently prevent conduction because of purely topological evaluation.
- A SC12-only phase sampler executes the real solver in the PWM high and low windows and returns a normalized lamp energized-time ratio. The original live electrical state is restored before displaying the result.
- The teacher panel provides 0/25/50/75/100 % duty choices; PWM1 right-panel controls remain available. Material lamp brightness overlay uses the solver-derived normalized duty and does not alter general lamp physics/appearance in other lessons.

## MQ-12 isolated V8 evidence
- Current actual `dist/simulation.js` and `dist/current-model.js` were executed in a controlled JS runtime with a small, explicit circuit of the same six component types and nine connections (other external runtime modules were stubbed).
- Duty 0/25/50/75/100: stable solver, no detected short circuit; sampled energized-time results 0/25/50/75/100 respectively. At HIGH gate phase, nodal G–E ≈ 11.88 V with 1 kΩ/100 kΩ resistor divider in the virtual model.
- Connection breaks G1/P→PWM1/V+, PWM1/GND→G1/M, PWM1/OUT→RG/1, RG/2→Q1/G, H1/X2→Q1/C and Q1/E→G1/M each gave 0% energized-time and no lamp drive.
- Target native Node tests added at `tests/qa-mq07-sc12-igbt-pwm-dimmer-v11920.test.cjs`. Syntax checks passed for all six changed source/test files. The native Node script, 1,655-lesson regression and live Windows visual checks have NOT_RUN here; these are not claimed PASS.
- Preserve the exact title and explain that the implementation is a DC PWM learning variant, not AC dimmer completion.

## MQ team and acceptance
MQ-07 lead (topology/pedagogy) → MQ-05 cross-check (nodal gate voltage/phase sampler) → MQ-03 lamp feedback → MQ-12 native regression → MQ-13 main/[skip ci]/no Actions → MQ-00.
Current MQ-00 state: **REVIEW**, not DONE. Remaining: full native Node test, independent Windows interface/wire/terminal observation, visual verification of actual dimming output and physical model acceptance. Do not mark full AC phase dimmer as accepted.
