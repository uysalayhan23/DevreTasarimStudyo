'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),Watch=require('../dist/ladder-watch.js');
const limits={inputCount:6,outputCount:4};
const program={version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'Q1'}]],coil:{type:'OUT',ref:'Q2'}},
 {id:'R2',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}
]};
const contactClass=(html,ref)=>new RegExp('class="dts-watch-contact ([^"]+)" data-ref="'+ref+'"').exec(html)?.[1];
test('R1 cannot show future Q1 as a conducting contact before R2 writes it',()=>{
 const scan=L.scan(program,{I1:true},{},100,limits);
 assert.equal(scan.ok,true);assert.equal(scan.memory.values.Q1,true);
 assert.deepEqual(scan.traces.map(t=>t.pathStates),[[false],[true]]);
 const html=Watch.rungHtml(program.rungs[0],scan.traces[0],scan.memory.values,true,0);
 assert.equal(contactClass(html,'Q1'),'is-unknown');
 assert.doesNotMatch(html,/dts-watch-path is-on/);
});
test('a verified conducting path shows scan-time Q/M/T/C contacts even after later bit changes',()=>{
 const r={id:'R',paths:[[{type:'NO',ref:'Q1'},{type:'NO',ref:'M1'}]],coil:{type:'OUT',ref:'Q2'}};
 const trace={id:'R',active:true,pathStates:[true],value:true,type:'OUT'};
 const html=Watch.rungHtml(r,trace,{Q1:false,M1:false},true,0);
 assert.equal(contactClass(html,'Q1'),'is-on');
 assert.equal(contactClass(html,'M1'),'is-on');
 assert.match(html,/dts-watch-output-wire is-on/);
});
test('physical I contacts still show current input if a later contact blocks the path',()=>{
 const r={id:'R',paths:[[{type:'NO',ref:'I1'},{type:'NO',ref:'Q1'}]],coil:{type:'OUT',ref:'Q2'}};
 const trace={id:'R',active:false,pathStates:[false],value:false,type:'OUT'};
 const html=Watch.rungHtml(r,trace,{I1:true,Q1:true},true,0);
 assert.equal(contactClass(html,'I1'),'is-on');
 assert.equal(contactClass(html,'Q1'),'is-unknown');
 assert.doesNotMatch(html,/dts-watch-output-wire is-on/);
});
test('stopped or contradictory scan never lights contacts',()=>{
 const r={id:'R',paths:[[{type:'NO',ref:'Q1'}]],coil:{type:'OUT',ref:'Q2'}};
 const t={id:'R',active:true,pathStates:[true],value:true};
 for(const [live,trace] of [[false,t],[true,{...t,active:false}]]){
  const html=Watch.rungHtml(r,trace,{Q1:true},live,0);
  assert.doesNotMatch(html,/dts-watch-path is-on|dts-watch-result is-on|dts-watch-contact is-on/);
 }
});
