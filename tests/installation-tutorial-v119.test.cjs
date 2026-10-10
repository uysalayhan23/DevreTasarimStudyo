'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const Design=require('../dist/design-library.js');
const library=Design.extend(JSON.parse(JSON.stringify(ctx.window.COMPONENT_LIBRARY)));
const byId=Object.fromEntries(library.map(d=>[d.id,d]));
const Lessons=require('../dist/tutorial-lessons.js');
const Simulation=require('../dist/simulation.js');

function project(id){return JSON.parse(JSON.stringify(Lessons.lesson(id).project))}
function energizedLamps(p){return p.components.filter(c=>['lamp','led'].includes(byId[c.typeId]?.kind)&&c._active)}

test('Tesisat dersi devreleri tüm anahtar ve buton durumlarında amaçlandığı gibi çalışır',()=>{
 const single=project('button-led-3'),wallSwitch=single.components.find(c=>c.id==='b');
 Simulation.solve(single,byId);assert.equal(energizedLamps(single).length,0);
 wallSwitch.state=true;Simulation.solve(single,byId);assert.equal(energizedLamps(single).length,1);

 for(let bits=0;bits<4;bits++){
  const p=project('commutator-1'),sw=p.components.find(c=>c.id==='s');
  sw.switchStates={a:!!(bits&1),b:!!(bits&2)};Simulation.solve(p,byId);
  assert.equal(energizedLamps(p).length,Number(!!(bits&1))+Number(!!(bits&2)),`komütatör durumu ${bits}`);
 }

 for(let bits=0;bits<4;bits++){
  const p=project('two-way-1');p.components.find(c=>c.id==='s1').state=!!(bits&1);p.components.find(c=>c.id==='s2').state=!!(bits&2);
  Simulation.solve(p,byId);assert.equal(energizedLamps(p).length,(bits===0||bits===3)?1:0,`vaviyen durumu ${bits}`);
 }

 for(let bits=0;bits<8;bits++){
  const p=project('intermediate-1');
  for(const [i,id] of ['s1','sx','s2'].entries())p.components.find(c=>c.id===id).state=!!(bits&(1<<i));
  Simulation.solve(p,byId);assert.equal(energizedLamps(p).length,(bits.toString(2).replace(/0/g,'').length%2===0)?1:0,`ara vaviyen durumu ${bits}`);
 }

 for(const id of ['bells-1','bells-2','bells-3','bells-4']){
  const source=project(id),buttons=source.components.filter(c=>['bell-push','bell-light-push'].includes(c.typeId));
  for(let bits=0;bits<2**buttons.length;bits++){
   const p=project(id);buttons.forEach((button,i)=>{p.components.find(c=>c.id===button.id).state=!!(bits&(1<<i))});
   Simulation.solve(p,byId);assert.equal(!!p.components.find(c=>c.id==='z')._active,bits!==0,`${id} buton durumu ${bits}`);
  }
 }
});

test('ışıklı çağırma dersi gösterge halkasının simüle edilmediğini açıkça belirtir',()=>{
 const lesson=Lessons.lesson('bells-4');
 assert.match(lesson.summary,/görseldir.*elektriksel olarak simüle edilmez/i);
 assert.match(lesson.explanation,/ayrı terminali ve elektriksel modeli olmadığı.*simüle edilmez/i);
});
