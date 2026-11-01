const {test}=require('node:test'),assert=require('node:assert/strict');
const Panel=require('../dist/panel.js');
const nh={id:'nh-fuse-holder',kind:'fuse-holder',w:180,h:240,pins:[]};
test('3NP1 panel footprint uses known physical dimensions without changing SVG material art',()=>{const s=Panel.spec(nh);assert.deepEqual([s.w,s.h,s.depth],[105.8,202,86.5]);});
test('unrelated generic panel fallback unchanged',()=>{const s=Panel.spec({id:'generic-sensor-xyz',kind:'sensor',w:80,h:90,pins:[]});assert.deepEqual([s.w,s.h,s.depth],[70,85,55]);});
