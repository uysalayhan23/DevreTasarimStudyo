'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Watch=require('../dist/ladder-watch.js');
const fs=require('node:fs'),path=require('node:path');
const rung=(paths,coil={type:'OUT',ref:'Q1'})=>({id:'R1',paths,coil});
const row=(pathStates,value=false)=>({active:pathStates.some(Boolean),value,pathStates,type:'OUT',count:null,preset:null,presetMs:null,elapsedMs:null});
const html=(r,t,live=true)=>Watch.rungHtml(r,t,{I1:true,I2:false,I3:true,Q1:true},live,0);
test('complete LAD branch leads and output wire are present',()=>{
 const s=html(rung([[{type:'NO',ref:'I1'}]]),row([true],true));
 assert.match(s,/dts-watch-rail left/);
 assert.match(s,/dts-watch-segment is-on start/);
 assert.match(s,/dts-watch-segment is-on tail/);
 assert.match(s,/dts-watch-rail right/);
 assert.match(s,/dts-watch-output-wire is-on/);
 assert.match(s,/dts-watch-result is-on/);
});
test('lower active branch glows on both shared vertical joins',()=>{
 const s=html(rung([[{type:'NO',ref:'I1'}],[{type:'NO',ref:'I2'}],[{type:'NO',ref:'I3'}]]),row([false,false,true],true));
 assert.equal([...s.matchAll(/dts-watch-parallel-bridge is-on/g)].length,2);
 assert.deepEqual([...s.matchAll(/class="dts-watch-path ([^"]*)" data-path="0:([0-2])"/g)].map(m=>m[1]),['','','is-on']);
});
test('upper active branch does not energize lower join',()=>{
 const s=html(rung([[{type:'NO',ref:'I1'}],[{type:'NO',ref:'I2'}]]),row([true,false],true));
 assert.match(s,/dts-watch-parallel-bridge"/);
 assert.doesNotMatch(s,/dts-watch-parallel-bridge is-on/);
});
test('timer input flows but inactive timer output has no energized glow',()=>{
 const r=rung([[{type:'NO',ref:'I1'}]],{type:'TON',ref:'T1',presetMs:200});
 const s=html(r,row([true],false));
 assert.match(s,/dts-watch-segment is-on/);
 assert.match(s,/dts-watch-result is-flowing/);
 assert.doesNotMatch(s,/dts-watch-result is-on/);
});
test('NOP does not receive an energized output line',()=>{
 const s=html(rung([[{type:'NO',ref:'I1'}]],{type:'NOP',ref:''}),row([true],false));
 assert.doesNotMatch(s,/dts-watch-output-wire is-on|dts-watch-result is-flowing|dts-watch-result is-on/);
});
test('stopped, contradictory and malformed traces never create neon',()=>{
 const r=rung([[{type:'NO',ref:'I1'}]]),good=row([true],true);
 for(const [live,trace] of [[false,good],[true,{...good,pathStates:[false]}],[true,{...good,pathStates:['true']}],[true,{...good,value:'true'}]]){
  const s=html(r,trace,live);
  assert.doesNotMatch(s,/dts-watch-path is-on|dts-watch-output-wire is-on|dts-watch-result is-on/);
 }
});
test('native watch keeps existing escaped comments safe',()=>{
 const s=html({...rung([[{type:'NO',ref:'I1'}]]),comment:'<img src=x>'},row([true],true));
 assert.doesNotMatch(s,/<img/);assert.match(s,/&lt;img/);
});
test('neon styles honor reduced motion and use shared bus',()=>{
 const css=fs.readFileSync(path.join(__dirname,'..','dist','studio.css'),'utf8');
 for(const x of ['.dts-watch-parallel-bridge.is-on::before','.dts-watch-result.is-on','@keyframes dts-watch-block-glow','@media(prefers-reduced-motion:reduce)','--watch-neon:#1986ff'])assert.ok(css.includes(x),x);
});
