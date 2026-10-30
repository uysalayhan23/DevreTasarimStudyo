'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Guide=require('../dist/ladder-timer-guide.js');
const Ladder=require('../dist/ladder-runtime.js');
const FBD=require('../dist/fbd-view.js');
const events={
 TON:{in:[['149.5','44'],['464.5','67']],q:[['299.5','106'],['464.5','130']],pt:['149.5','299.5']},
 TOF:{in:[['149.5','44'],['269.5','67']],q:[['149.5','106'],['419.5','130']],pt:['269.5','419.5']},
 TP:{in:[['149.5','44'],['205','67']],q:[['149.5','106'],['299.5','130']],pt:['149.5','299.5']}
};
function waveform(html,kind){
 const re=new RegExp('<path class="dts-timer-diagram-'+kind+'" d="([^"]+)"/>');
 const match=re.exec(html);assert.ok(match,'missing '+kind+' waveform');return match[1];
}
test('three independent offline SVG charts are accessible with IN Q ET, PT',()=>{
 for(const type of ['TON','TOF','TP']){
  const svg=Guide.timingDiagram(type,2000);
  assert.match(svg,new RegExp('data-timer-diagram="'+type+'"'));
  assert.match(svg,/role="img" aria-label="/);
  assert.match(svg,/<title>/);
  for(const label of ['IN','Q','ET'])assert.match(svg,new RegExp('>'+label+'<'));
  assert.match(svg,/PT = 2000 ms/);
  assert.match(svg,/Şematik|şematik/);
  assert.doesNotMatch(svg,/<image|<script|<foreignObject|onload=/i);
 }
});
test('waveform edges match TON, TOF and TP IEC timing sequences',()=>{
 for(const [type,value] of Object.entries(events)){
  const svg=Guide.timingDiagram(type,1000);
  for(const [x,y] of value.in)assert.ok(waveform(svg,'in').includes('H'+x+' V'+y),type+' IN edge '+x);
  for(const [x,y] of value.q)assert.ok(waveform(svg,'q').includes('H'+x+' V'+y),type+' Q edge '+x);
  const bracket=waveform(svg,'pt');
  assert.ok(bracket.includes('M'+value.pt[0]+' 243 H'+value.pt[1]),type+' PT bracket');
  assert.ok(waveform(svg,'et').startsWith('M82 207'));
 }
});
test('TON and TOF timelines distinguish on-delay and off-delay',()=>{
 const ton=events.TON,tof=events.TOF;
 assert.notDeepEqual(ton.q,tof.q);
 assert.equal(ton.q[0][0],ton.pt[1]); // TON Q rises after PT
 assert.equal(tof.q[1][0],tof.pt[1]); // TOF Q falls after PT
});
test('TP timeline holds Q for PT despite IN falling early',()=>{
 const tp=events.TP;
 assert.ok(Number(tp.in[1][0])<Number(tp.q[1][0]));
 assert.equal(tp.q[0][0],tp.pt[0]);
 assert.equal(tp.q[1][0],tp.pt[1]);
});
test('diagram PT label tracks configured time, never a fixed 2s',()=>{
 const html=Guide.markup({type:'TP',presetMs:875});
 assert.match(html,/PT = 875 ms/);
 assert.match(html,/875 ms/);
 assert.doesNotMatch(html,/PT = 2000 ms/);
});
test('untrusted and malformed duration never inserts an SVG attribute',()=>{
 const html=Guide.markup({type:'TON',presetMs:'"><img src=x onerror=alert(1)>'});
 assert.doesNotMatch(html,/<img|onerror=|javascript:/i);
 assert.match(html,/PT = ayarlanan süre/);
 assert.equal(Guide.timingDiagram('OUT',2000),'');
});
test('LAD and FBD share the same guide and preserve old timer behavior',()=>{
 const lad=fs.readFileSync(path.join(__dirname,'..','dist','ladder-editor.js'),'utf8');
 assert.match(lad,/TimerGuide\?\.markup\?\.\(r\.coil\)/);
 const prog={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'TOF',ref:'T1',presetMs:1500}}]};
 const rendered=FBD.render(prog.rungs[0],{index:0,limits:{inputCount:6,outputCount:4}});
 assert.match(rendered,/data-timer-diagram="TOF"/);
 assert.match(rendered,/PT = 1500 ms/);
 const state={};
 const scan=Ladder.scan(prog,{I1:true},state,20,{inputCount:6,outputCount:4});
 assert.equal(scan.ok,true);
 assert.equal(scan.memory.values.T1,true);
});
test('HTML offline assets and diagram CSS are wired correctly',()=>{
 const html=fs.readFileSync(path.join(__dirname,'..','dist','index.html'),'utf8');
 const css=fs.readFileSync(path.join(__dirname,'..','dist','studio.css'),'utf8');
 assert.ok(html.indexOf('ladder-timer-guide.js?rev=')<html.indexOf('fbd-view.js?rev='));
 for(const selector of ['.dts-timer-diagram{','.dts-timer-diagram-in{','.dts-timer-diagram-q{','.dts-timer-diagram-et{'])
  assert.ok(css.includes(selector));
});
test('original diagram is educational; Siemens IEC and DTS PT semantics are distinguished',()=>{
 const s=Guide.markup({type:'TON',presetMs:1000});
 assert.match(s,/Siemens IEC/);
 assert.match(s,/DTS sanal modelinde PT değişikliği/);
 assert.match(s,/Canlı ölçüm değildir/);
});
