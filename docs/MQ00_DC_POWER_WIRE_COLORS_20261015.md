# MQ-00 — DC supply wire-color rule · 2026-10-15

Status: IMPLEMENTED / ISOLATED QA PASS; full Windows and 1,655-lesson suite NOT_RUN.
Repository: uysalayhan23/DevreTasarimStudyo, branch: main.

## User-mandated rule
Every electrical DC+ supply terminal uses a red (#e53935) conductor; every DC− and GND supply terminal uses black (#111827). Applies on drawing new connections, reconnecting, loading an existing editable project, opening instructional circuits, restoring examples, and guided rebuilding. No GitHub Actions.

## MQ-04 + MQ-06 implementation
- dist/conductors.js now derives the fixed color from real component pin identity, not from a global color-palette selection. It propagates through the connected wiring net and overrides obsolete brown/green colors on legacy lesson wiring during normal synchronize()/initialize().
- Exact DC polarity applies to DC sources P/M, powered V+/VCC/VDD/etc and GND/0V/V−/DC−, battery or rectifier +/- outputs, BN/BU sensor supply pins, and load-cell EX+/EX− excitation.
- Signal OUT, switched motor winding terminals, differential sensor SIG+/SIG−, AC L/N/PE and dedicated multimeter probe leads do NOT become DC supply pins merely because of a +/- name or color similarity. Their preexisting electrical meaning is maintained.
- Any net shorting an actual DC+ power terminal and DC−/GND power terminal is flagged as conflicting; manual recolor to a wrong power color is rejected.
- dist/app.js chooses red/black immediately when the wire starts. The existing application migrateProject() and render() invoke Lines.initialize()/synchronize(), so on loading, restoring, undo/redo, and newly displayed examples the policy is re-applied without rewriting user-owned source files.
- dist/tutorial-mode.js normalizes lesson templates lazily at the guided-lesson boundary and aligns guided step colors with the standardized lesson wiring. No geometry/topology changed.

## Evidence and remaining gates
- tests/qa-dc-supply-wire-colors-v11920.test.cjs added.
- Six of six narrow tests PASS when executed against the current actual dist/conductors.js and dist/probe-leads.js through an isolated JavaScript harness. Scenarios: old project normalization; new/reconnected wires; incorrect manual recoloring rejection; sensor and rectifier supplies; DC polarity conflict; EX supply versus SIG terminals.
- JavaScript syntax checks: dist/conductors.js, dist/app.js, dist/tutorial-mode.js and regression test PASS.
- These isolated test results DO NOT establish full native Node test-suite results, tutorial browser visual acceptance, 1,655 lesson acceptance or Windows packaged application PASS.
- MQ-12 evidence: isolated tests only; full Node and Windows checks remain NOT_RUN.
- MQ-13: existing main, [skip ci] commits, no Actions dispatch, no force-push.
- MQ-00 decision: implemented with isolated checks; application-wide G7/G8 final acceptance still open.
