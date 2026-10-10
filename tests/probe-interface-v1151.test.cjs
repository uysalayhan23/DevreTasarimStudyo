const {test}=require('node:test'),assert=require('node:assert/strict'),{createApp}=require('./helpers/offline-dom.cjs');
const scene=(a,id)=>a.$('#scene [data-id="'+id+'"]');
const getWire=(a,id)=>a.$('#scene [data-wire="'+id+'"] .wire');
const copy=x=>JSON.parse(JSON.stringify(x));
function connect(a,c,p,d,q){for(const [id,pin] of [[c.id,p],[d.id,q]]){scene(a,id).querySelector('[data-port="'+pin+'"]').emit('pointerdown',{clientX:300,clientY:300});a.window.emit('pointerup',{buttons:0})}}
function port(a,c,id){const B=a.window.DTSEditor.byId,d=a.window.DTSAssemblies.definition(B[c.typeId],c,'material'),q=a.window.CCSSymbols.rotatedPoint(d.pins.find(p=>p.id===id),d,c.rotation||0);return {x:c.x+q.x*(c.materialScale||1),y:c.y+q.y*(c.materialScale||1)}}
function drag(a,node,dx,dy){node.emit('pointerdown',{clientX:400,clientY:400});a.window.emit('pointermove',{clientX:400+dx,clientY:400+dy});a.window.emit('pointerup',{buttons:0,clientX:400+dx,clientY:400+dy})}
function wirePoint(path){let current,best;for(const m of path.matchAll(/([MLQ])([^MLQ]+)/g)){const nums=m[2].trim().split(/[ ,]+/).map(Number),next={x:nums.at(-2),y:nums.at(-1)};if(m[1]==='L'&&current){const length=Math.hypot(next.x-current.x,next.y-current.y);if(!best||length>best.length)best={length,x:current.x+(next.x-current.x)*.43375,y:current.y+(next.y-current.y)*.43375}}current=next}assert.ok(best?.length>30);return best}
test('live wire measurement and free meter/lead movement preserve circuit routes, parts and saved contact',()=>{
 const a=createApp({appearance:'material'});a.drop('supply-dc-plus',900,220);a.drop('lamp-green',1200,700);
 const p=a.window.DTSEditor.getProject(),[s,h]=p.components;connect(a,s,'P',h,'X1');connect(a,s,'M',h,'X2');assert.equal(p.wires.length,2);
 const ordinary=p.wires.slice(),routes=ordinary.map(w=>getWire(a,w.id).getAttribute('d')),positions=copy(p.components.map(c=>({id:c.id,x:c.x,y:c.y})));
 a.drop('unit-ut33d-plus',300,220);assert.deepEqual(ordinary.map(w=>getWire(a,w.id).getAttribute('d')),routes);
 const m=p.components.find(c=>c.typeId==='unit-ut33d-plus'),red=p.components.find(c=>c.typeId==='test-probe-red'),black=p.components.find(c=>c.typeId==='test-probe-black');m.meterPosition=4;black.probeTarget={c:s.id,p:'M'};a.window.DTSEditor.render();
 const leads=p.wires.filter(w=>w.probeLead);assert.equal(leads.length,2);assert.deepEqual(copy(leads.map(w=>w.color).sort()),['#111827','#e53935']);for(const w of leads)assert.match(getWire(a,w.id).parentNode.getAttribute('style'),/5px/);
 a.$('#simulateBtn').click();const target=wirePoint(routes[0]),tip=port(a,red,'TIP');drag(a,scene(a,red.id).querySelector('.body'),target.x-tip.x,target.y-tip.y);
 assert.equal(red.probeTarget.w,ordinary[0].id);assert.ok(red.probeTarget.t>0&&red.probeTarget.t<1);assert.equal(m._meter.value,24);assert.equal(p.wires.length,4);assert.equal(p.junctions.length,0);assert(a.$('[data-probe-contact="'+red.id+'"]'));
 const unchangedNode=getWire(a,ordinary[0].id),old={x:m.x,y:m.y};drag(a,scene(a,m.id).querySelector('.body'),235.375,95.625);
 assert.equal(m.x,old.x+235.375);assert.equal(m.y,old.y+95.625);assert.equal(getWire(a,ordinary[0].id),unchangedNode);assert.deepEqual(ordinary.map(w=>getWire(a,w.id).getAttribute('d')),routes);assert.deepEqual(copy(p.components.slice(0,2).map(c=>({id:c.id,x:c.x,y:c.y}))),positions);assert.equal(m._meter.value,24);assert.equal(a.window.DTSEditor.running,true);
 const lead=leads.find(w=>w.color==='#e53935'),before=getWire(a,lead.id).getAttribute('d'),endpoints=copy([port(a,m,'V'),port(a,red,'PLUG')]);drag(a,getWire(a,lead.id),27.25,-63.75);
 assert.deepEqual(copy(lead.flexOffset),{x:27.25,y:-63.75});assert.notEqual(getWire(a,lead.id).getAttribute('d'),before);assert.match(getWire(a,lead.id).getAttribute('d'),/C/);assert.deepEqual(copy([port(a,m,'V'),port(a,red,'PLUG')]),endpoints);assert.equal(m._meter.value,24);assert(a.$('#scene').children.at(-1).classList.contains('measurement-overlay'));
 const saved=a.save(),b=createApp({project:saved,appearance:'material'}),restored=b.save();assert.equal(restored.components.find(c=>c.id===m.id).x,m.x);assert.equal(restored.components.find(c=>c.id===red.id).probeTarget.w,ordinary[0].id);assert.deepEqual(restored.wires.find(w=>w.id===lead.id).flexOffset,{x:27.25,y:-63.75});
 drag(a,scene(a,red.id).querySelector('.body'),400,-200);assert.equal(red.probeTarget,undefined);assert.equal(m._meter.value,0);assert.equal(a.$('[data-probe-contact="'+red.id+'"]'),null);
});
test('actual L/N port gestures connect SMPS and Delete releases red for a different net',()=>{
 const a=createApp();a.drop('supply-1p',200,200);a.drop('smps',500,500);const p=a.window.DTSEditor.getProject(),[s,ps]=p.components;connect(a,s,'L',ps,'L');connect(a,s,'N',ps,'N');assert.equal(p.wires.length,2);assert.equal(ps._terminalLines.L.role,'L1');assert.equal(ps._terminalLines.N.role,'N');
 const w=p.wires.find(w=>w.role==='L1');getWire(a,w.id).emit('pointerdown',{clientX:300,clientY:300});a.window.emit('pointerup',{buttons:0});a.document.emit('keydown',{key:'Delete'});assert.equal(p.wires.length,1);assert.equal(p.colorLocks['#e53935'],undefined);assert.equal(ps._terminalLines.L,undefined);
 a.$('[data-color="#e53935"]').click();assert.equal(a.$('#wireRole').disabled,false);a.$('#wireRole').value='N';a.$('#wireRole').emit('change');assert.equal(p.colorRoles['#e53935'],'N');
 a.drop('unit-ut33d-plus',850,220);assert.equal(p.colorLocks['#e53935'],'N');assert.deepEqual(copy(p.wires.filter(w=>w.probeLead).map(w=>w.color).sort()),['#111827','#e53935']);
});
