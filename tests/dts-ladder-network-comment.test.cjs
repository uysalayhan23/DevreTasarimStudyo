'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const L=require('../dist/ladder-runtime.js'),D=require('../dist/ladder-diagram.js');
const sample={version:1,rungs:[{id:'R1',comment:'Motor çalışma koşulu',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
test('network description belongs to saved rung, not logic value',()=>{
 assert.equal(L.validate(sample,{inputCount:2,outputCount:2}).ok,true);
 assert.equal(L.scan(sample,{I1:true},{},0,{inputCount:2,outputCount:2}).outputs.Q1,true);
 const withOther=structuredClone(sample);withOther.rungs[0].comment='Başka bir başlık';
 assert.equal(L.scan(withOther,{I1:true},{},0,{inputCount:2,outputCount:2}).outputs.Q1,true);
});
test('bounded description and escaped SVG text',()=>{
 const out=D.render(sample.rungs[0]);assert.match(out,/Motor çalışma koşulu/);
 const bad=structuredClone(sample);bad.rungs[0].comment='a'.repeat(101);
 assert.equal(L.validate(bad).ok,false);
 const injected=structuredClone(sample);injected.rungs[0].comment='<script>alert(1)</script>';
 assert.doesNotMatch(D.render(injected.rungs[0]),/<script>/);
});
