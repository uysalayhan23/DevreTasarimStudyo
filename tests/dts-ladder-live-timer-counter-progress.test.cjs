'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js');
const E=require('../dist/ladder-editor.js');
const limits={inputCount:6,outputCount:4};
const timer=(type,ms=100)=>({version:1,rungs:[{id:'R1',
 paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:'T1',presetMs:ms}}]});
const counter=(type,preset=3)=>({version:1,rungs:[{id:'R1',
 paths:[[{type:'NO',ref:'I1'}]],coil:{type,ref:'C1',preset}}]});
const scan=(p,m,now,input)=>L.scan(p,{I1:input},m,now,limits);
const view=(p,trace,powered=true,running=true)=>E.monitorRows(p,p,[trace],running,'dts-ladder-v1',powered)[0];
test('TON live value follows actual progress and completed output',()=>{
 const p=timer('TON'),m={};
 const a=scan(p,m,0,true),b=scan(p,m,35,true),c=scan(p,m,100,true);
 assert.deepEqual([a,b,c].map(x=>x.traces[0].elapsedMs),[0,35,100]);
 assert.equal(a.traces[0].value,false);assert.equal(c.traces[0].value,true);
 assert.equal(E.signalText(view(p,b.traces[0])),'0 · TON 35/100 ms');
 assert.equal(E.signalText(view(p,c.traces[0])),'1 · TON 100/100 ms');
});
test('TON reset on inactive input hides the old elapsed time',()=>{
 const p=timer('TON'),m={};scan(p,m,0,true);scan(p,m,40,true);
 const stopped=scan(p,m,41,false);
 assert.equal(stopped.traces[0].elapsedMs,null);
 assert.equal(E.signalText(view(p,stopped.traces[0])),'0 · TON hazır');
});
test('TOF elapsed delay is measured only after input drops',()=>{
 const p=timer('TOF'),m={};const powered=scan(p,m,0,true);
 const off=scan(p,m,10,false),delay=scan(p,m,40,false),expired=scan(p,m,110,false);
 assert.equal(powered.traces[0].elapsedMs,null);
 assert.deepEqual([off,delay,expired].map(x=>x.traces[0].elapsedMs),[0,30,100]);
 assert.equal(delay.traces[0].value,true);assert.equal(expired.traces[0].value,false);
 assert.equal(E.signalText(view(p,delay.traces[0])),'1 · TOF 30/100 ms');
});
test('TP live pulse elapsed is bounded by preset without changing output',()=>{
 const p=timer('TP'),m={};scan(p,m,0,false);
 const fired=scan(p,m,1,true),during=scan(p,m,51,true),expired=scan(p,m,101,true);
 assert.deepEqual([fired,during,expired].map(x=>x.traces[0].elapsedMs),[0,50,100]);
 assert.equal(fired.traces[0].value,true);assert.equal(expired.traces[0].value,false);
 assert.equal(E.signalText(view(p,during.traces[0])),'1 · TP 50/100 ms');
});
test('CTU counter displays count relative to real preset',()=>{
 const p=counter('CTU'),m={};scan(p,m,0,false);const one=scan(p,m,1,true);
 assert.equal(one.traces[0].count,1);
 assert.equal(E.signalText(view(p,one.traces[0])),'0 · Sayaç 1/3');
});
test('CTD counter preserves initial preset and counts down',()=>{
 const p=counter('CTD'),m={};const initial=scan(p,m,0,false);
 const two=scan(p,m,1,true);
 assert.equal(initial.traces[0].count,3);assert.equal(two.traces[0].count,2);
 assert.equal(E.signalText(view(p,two.traces[0])),'0 · Sayaç 2/3');
});
test('powered-off, stopped and unsaved drafts never show live values',()=>{
 const p=timer('TON'),m={};const t=scan(p,m,0,true).traces[0];
 assert.equal(E.signalText(view(p,t,false)),'—');
 assert.equal(E.signalText(view(p,t,true,false)),'—');
 const changed=JSON.parse(JSON.stringify(p));changed.rungs[0].coil.presetMs=200;
 assert.equal(E.signalText(E.monitorRows(changed,p,[t],true,'dts-ladder-v1',true)[0]),'—');
});
test('legacy counter output and regular OUT display stay compatible',()=>{
 assert.equal(E.signalText({value:true,count:3}),'1 · Sayaç 3');
 const p={version:1,rungs:[{id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}}]};
 const t=L.scan(p,{I1:true},{},0,limits).traces[0];
 assert.equal(t.elapsedMs,undefined);
 assert.equal(E.signalText(view(p,t)),'1');
});
