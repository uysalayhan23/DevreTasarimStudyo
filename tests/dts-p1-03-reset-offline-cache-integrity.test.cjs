'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const Ladder=require('../dist/ladder-runtime.js');
const Toolbox=require('../dist/ladder-toolbox.js');
const limits={inputCount:4,outputCount:4};
const program=(type='OUT',ref='Q2')=>({version:1,rungs:[
 {id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}},
 {id:'R2',paths:[[{type:'NO',ref:'I2'}]],coil:{type,ref,
  ...(['TON','TOF','TP'].includes(type)?{presetMs:200}:{}),
  ...(['CTU','CTD'].includes(type)?{preset:2}:{})}}
]});
const apply=(src,tool,zone={r:1,kind:'coil'})=>Toolbox.apply(src,tool,zone,limits);

test('offline Edge uses a toolbox asset revision equal to the actual Git blob SHA',()=>{
 const source=fs.readFileSync(path.join(__dirname,'..','dist','ladder-toolbox.js'),'utf8');
 const html=fs.readFileSync(path.join(__dirname,'..','dist','index.html'),'utf8');
 const signature=crypto.createHash('sha1')
  .update('blob '+Buffer.byteLength(source,'utf8')+'\0').update(source,'utf8').digest('hex');
 const matches=[...html.matchAll(/src="ladder-toolbox\.js\?rev=([a-f0-9]{12})"/g)];
 assert.equal(matches.length,1,'Only one versioned Ladder palette script can load');
 assert.equal(matches[0][1],signature.slice(0,12),'Offline cached toolbox code is stale');
});
test('RESET tool retains an existing Q2 target on a valid OUT rung',()=>{
 const original=program('OUT','Q2'),before=JSON.stringify(original);
 const updated=apply(original,'RESET');
 assert.equal(updated.ok,true);
 assert.deepEqual(updated.program.rungs[1].coil,{type:'RESET',ref:'Q2'});
 assert.equal(JSON.stringify(original),before);
});
test('RESET replacing OUT Q2 does not clear unrelated energized Q1',()=>{
 const updated=apply(program('OUT','Q2'),'RESET');
 assert.equal(updated.ok,true);
 const result=Ladder.scan(updated.program,{I1:true,I2:true},{},123,limits);
 assert.equal(result.ok,true);assert.equal(result.outputs.Q1,true);
 assert.equal(result.outputs.Q2,false);
 assert.equal(result.traces[1].coil,'Q2');
});
test('RESET replacing a timer keeps its original timer address',()=>{
 const updated=apply(program('TON','T3'),'RESET');
 assert.equal(updated.ok,true);
 assert.equal(updated.program.rungs[1].coil.ref,'T3');
 assert.equal(updated.program.rungs[1].coil.type,'RESET');
});
test('invalid explicit Network index is rejected without changing saved source',()=>{
 const source=program(),original=JSON.stringify(source);
 for(const r of [undefined,null,'','01',-1,1.3,true,'0x1']){
  const out=apply(source,'RESET',{kind:'coil',r});
  assert.equal(out.ok,false,'Accepted invalid index '+String(r));
 }
 assert.equal(JSON.stringify(source),original);
});
test('contact drop zone cannot accept a RESET coil',()=>{
 const src=program(),before=JSON.stringify(src);
 const out=apply(src,'RESET',{kind:'contact',r:1,p:0,i:0});
 assert.equal(out.ok,false);assert.equal(JSON.stringify(src),before);
});
test('LAD contact append still works but explicitly null insertion fails closed',()=>{
 const src=program(),before=JSON.stringify(src);
 const good=apply(src,'NC',{kind:'contact',r:1,p:0});
 assert.equal(good.ok,true);
 assert.equal(good.program.rungs[1].paths[0].length,2);
 const bad=apply(src,'NC',{kind:'contact',r:1,p:0,i:null});
 assert.equal(bad.ok,false);
 assert.equal(JSON.stringify(src),before);
});
test('native validator accepts valid reset edits and rejects duplicate output writers',()=>{
 const src=program();
 const ok=apply(src,'RESET');
 assert.equal(ok.ok,true);
 assert.equal(Ladder.validate(ok.program,limits).ok,true);
 const bad=JSON.parse(JSON.stringify(src));bad.rungs[1].coil.ref='Q1';
 assert.equal(Ladder.validate(bad,limits).ok,false);
});
