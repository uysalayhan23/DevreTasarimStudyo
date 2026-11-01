'use strict';
const assert=require('node:assert/strict');
const {test}=require('node:test');
const {markup}=require('../dist/modern-materials.js');
const d={id:'sensor-linear-position',w:200,h:130};
function render(position){return markup(d,{id:'linear-test',analogPosition:position},null);}
function expectPosition(value,expected){const svg=render(value);assert.match(svg,new RegExp(`aria-valuenow="${expected}"`));assert.match(svg,new RegExp(`x="${100+expected*.7}"`));assert.doesNotMatch(svg,/NaN|Infinity/);}
test('P4-03 valid minimum',()=>expectPosition(0,0));
test('P4-03 valid midpoint',()=>expectPosition(50,50));
test('P4-03 valid maximum',()=>expectPosition(100,100));
test('P4-03 negative clamps',()=>expectPosition(-25,0));
test('P4-03 high clamps',()=>expectPosition(125,100));
test('P4-03 invalid string fails closed to midpoint',()=>expectPosition('invalid',50));
test('P4-03 Infinity fails closed to midpoint',()=>expectPosition(Infinity,50));
test('P4-03 NaN fails closed to midpoint',()=>expectPosition(NaN,50));
test('P4-03 missing value uses midpoint',()=>expectPosition(undefined,50));
