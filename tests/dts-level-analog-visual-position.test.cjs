'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Compile the actual runtime branch, not a duplicated position calculation.
const source = fs.readFileSync(path.join(__dirname, '../dist/materials.js'), 'utf8');
const match = source.match(/if\(d\.id==='sensor-level-analog'\)\{([\s\S]*?)\n    \}/);
assert.ok(match, 'real level sensor visual branch exists');
const render = new Function('d', 'c', "'use strict';" + match[1]);
const device = {id:'sensor-level-analog',kind:'sensor',w:120,h:260,pins:[]};
function checkPosition(value, expectedOffset) {
  const c = {id:'sensor-level-test'};
  if (value !== undefined) c.analogPosition = value;
  const svg = render(device, c);
  assert.ok(svg.includes('data-material="level-reference"'));
  assert.ok(svg.includes('data-analog-handle="sensor-level-test"'));
  assert.ok(svg.includes('assets/products/level-reference-v19.jpg'));
  assert.ok(!/NaN|Infinity/.test(svg), 'SVG geometry must remain finite');
  const offset = Number(svg.match(/transform="translate\(0 ([^)]*)\)"/)[1]);
  assert.ok(Number.isFinite(offset));
  assert.ok(Math.abs(offset - expectedOffset) < 1e-9, `expected ${expectedOffset}, got ${offset}`);
}
const cases = [
  ['default missing position', undefined, 19],
  ['zero position', 0, 89],
  ['100 percent position', 100, -51],
  ['middle position', 50, 19],
  ['numeric string', '75', -16],
  ['negative clamped', -10, 89],
  ['above 100 clamped', 200, -51],
  ['invalid text defaults safely', 'bad-value', 19],
  ['NaN defaults safely', NaN, 19],
  ['Infinity defaults safely', Infinity, 19],
  ['negative Infinity defaults safely', -Infinity, 19]
];
for (const [name, value, expected] of cases) test(name, () => checkPosition(value, expected));
