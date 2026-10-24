'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const lib=require('../dist/arduino-library.js');
const definition=id=>lib.components.find(x=>x.id===id);
test('SC127/128 material lead endpoints coincide with KY-004, BD139 and motor cable hotspots',()=>{
 const b=definition('arduino-button'),q=definition('arduino-bd139'),m=definition('arduino-dc-motor');
 const button=lib.art(b,{}),transistor=lib.art(q,{}),motor=lib.art(m,{});
 assert.deepEqual(b.pins.map(p=>[p.id,p.x,p.y]),[['SIG',0,20],['VCC',0,41],['GND',0,62]]);
 for(const p of b.pins)assert.ok(button.includes('M'+p.x+' '+p.y+'H12'),'KY-004 header bridge '+p.id);
 assert.deepEqual(q.pins.map(p=>[p.id,p.x,p.y]),[['1',42,116],['2',63,116],['3',84,116]]);
 assert.deepEqual(q.pinMap,{'1':'B','2':'C','3':'E'});
 for(const p of q.pins)assert.ok(transistor.includes('M'+p.x+' 72V'+p.y),'BD139 physical lead '+p.id);
 assert.deepEqual(m.pins.map(p=>[p.id,p.x,p.y]),[['+',52,112],['-',98,112]]);
 assert.ok(motor.includes('M52 86v26M98 86v26'),'DC motor copper terminals must reach y112 hotspots');
});
