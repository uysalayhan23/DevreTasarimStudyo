'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Symbols=require('../dist/symbols.js');
const d={id:'converter-pressure',kind:'instrument',instrument:'waz5',w:180,h:460,pins:Array.from({length:12},(_,i)=>({id:String(i+1),label:String(i+1),x:i<6?80:110,y:i%6<3?20+(i%6)*30:370+(i%6-3)*30,side:i%6<3?'top':'bottom'}))};
const read=(svg,id)=>{const m=svg.match(new RegExp('data-label-key="pin:'+id+'" data-base-x="([^\"]+)" data-base-y="([^\"]+)"[^>]*><text[^>]*text-anchor="([^\"]+)"'));assert.ok(m);return {x:Number(m[1]),y:Number(m[2]),anchor:m[3]}};
test('WAZ5 terminal labels track all twelve screw rows and face outward',()=>{
 for(const rotation of [0,90,180,270]){
  const c={id:'b1',ref:'B1',rotation},svg=Symbols.markup(d,c,{mode:'material'});
  for(const p of d.pins){const left=Number(p.id)<=6,pos=Symbols.rotatedPoint(p,d,rotation),v=read(svg,p.id);
   assert.deepEqual(v,{x:pos.x+(left?-14:14),y:pos.y+3,anchor:left?'end':'start'});
  }
 }
});
test('WAZ5 cable port coordinates remain identical to catalog geometry',()=>{
 const svg=Symbols.markup(d,{id:'b1',ref:'B1'}, {mode:'material'});
 for(const p of d.pins)assert.match(svg,new RegExp('data-port="'+p.id+'"[^>]*>.*?<circle class="port-hit" cx="'+p.x+'" cy="'+p.y+'"'));
});
