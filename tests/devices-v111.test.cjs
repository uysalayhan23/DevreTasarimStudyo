const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const S=require('../dist/symbols.js'),C=require('../dist/components.js'),B=require('../dist/device-behavior.js'),Sim=require('../dist/simulation.js'),M=require('../dist/materials.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);const lib=S.prepareLibrary(require('../dist/design-library.js').extend(JSON.parse(JSON.stringify(ctx.window.COMPONENT_LIBRARY)))),byId=Object.fromEntries(lib.map(d=>[d.id,d]));
const {createApp}=require('./helpers/offline-dom.cjs');
function circuit(){const project={version:7,name:'v111',workspaceMode:'control',components:[],wires:[],junctions:[]};return {project,add(typeId,id,extra={}){const c={id,typeId,x:100,y:100,ref:id,...extra};project.components.push(c);return c},wire(a,p,b,q){project.wires.push({id:'w'+project.wires.length,from:{c:a.id,p},to:{c:b.id,p:q}})},solve(){return Sim.solve(project,byId,{now:0})}}}
test('PT100 2/3/4 wire variants share the probe image and only join same-end leads; thermocouple has two isolated pairs',()=>{
 for(const n of [2,3,4]){const d=byId[n===3?'sensor-pt100':'sensor-pt100-'+n+'wire'];assert.equal(d.pins.length,n);assert.equal(M.family(d),'tc-reference');assert.equal(B.output({temperature:0},d).value,100);assert.ok(Math.abs(B.output({temperature:100},d).value-138.505)<.001);const pairs=Sim.conductingPairs({},d,new Map(),new Set());assert.equal(pairs.length,n-2);assert.ok(!pairs.some(([a,b])=>a.startsWith('A')&&b.startsWith('B')));assert.ok(!/undefined|NaN/.test(S.markup(d,{},{})))}
 const tc=byId.thermocouple;assert.equal(tc.pins.length,4);assert.equal(M.family(tc),'tc-reference');assert.deepEqual(Sim.conductingPairs({},tc,new Map(),new Set()),[]);
});
test('each fused terminal disconnects its own load while adjacent terminals remain powered',()=>{
 const t=circuit(),s=t.add('supply-dc-plus','s'),f=t.add('fuse-switch-3','f'),lamps=[];
 for(let i=0;i<3;i++){const l=t.add('lamp-green','l'+i);lamps.push(l);t.wire(s,'P',f,String(2*i+1));t.wire(f,String(2*i+2),l,'X1');t.wire(l,'X2',s,'M')}
 t.solve();assert.deepEqual(lamps.map(l=>l._active),[true,true,true]);f.fuseOpen={1:true};t.solve();assert.deepEqual(lamps.map(l=>l._active),[true,false,true]);f.fuseOpen={0:true,1:true,2:true};t.solve();assert.deepEqual(lamps.map(l=>l._active),[false,false,false]);
});
test('NH holder requires each installed fuse and opening its cover isolates all three poles',()=>{
 const t=circuit(),s=t.add('supply-dc-plus','s'),f=t.add('nh-fuse-holder','f'),l=t.add('lamp-green','l');t.wire(s,'P',f,'1');t.wire(f,'2',l,'X1');t.wire(l,'X2',s,'M');t.solve();assert.equal(l._active,false);f.nhFuses={0:true};t.solve();assert.equal(l._active,true);f.state=true;t.solve();assert.equal(l._active,false);f.state=false;t.solve();assert.equal(l._active,true);
});
test('FS-R and FKV-03 respond to phase sequence, missing phase, neutral loss and FKV voltage tolerance',()=>{
 for(const id of ['phase-sequence-relay','motor-protection-relay']){const t=circuit(),s=t.add('supply-3p','s'),f=t.add(id,'f'),l=t.add('lamp-green','l');for(const p of ['L1','L2','L3','N'])t.wire(s,p,f,p);t.wire(s,'L1',f,'11');t.wire(f,'14',l,'X1');t.wire(l,'X2',s,'N');t.solve();assert.equal(l._active,true,id);[t.project.wires[0].from.p,t.project.wires[1].from.p]=['L2','L1'];t.solve();assert.equal(l._active,false,id);[t.project.wires[0].from.p,t.project.wires[1].from.p]=['L1','L2'];s.phaseEnabled={L3:false};t.solve();assert.equal(f._active,false);delete s.phaseEnabled;s.phaseVoltages={L2:100};t.solve();assert.equal(f._active,id==='phase-sequence-relay');delete s.phaseVoltages;t.project.wires.splice(3,1);t.solve();assert.equal(f._active,false)}
});
test('Metop MT031 has sixteen physical terminals, seven fixed bridges and the catalog eight-cam table',()=>{
 const d=byId['packet-star-delta'];assert.equal(d.pins.length,16);assert.equal(d.contacts.filter(g=>g.fixed).length,7);
 for(const [pos,expected] of [[0,[]],[1,[0,2,3,5,6]],[2,[0,1,2,4,6,7]]]){const states=C.contactStates({position:pos},d,false);assert.deepEqual(d.contacts.slice(0,8).flatMap((g,i)=>states[g.id]?[i]:[]),expected);assert.ok(d.contacts.filter(g=>g.fixed).every(g=>states[g.id]))}
});
test('CT converts calculated resistive AC current, ratio changes reach the actual secondary ammeter',()=>{
 const t=circuit(),s=t.add('supply-1p','s'),ct=t.add('current-transformer','ct',{ctPrimary:100,ctSecondary:5}),r=t.add('resistor','r',{resistance:23}),a=t.add('meter-ammeter','a');t.wire(s,'L',ct,'P1');t.wire(ct,'P2',r,'1');t.wire(r,'2',s,'N');t.wire(ct,'S1',a,'1');t.wire(a,'2',ct,'S2');t.solve();assert.ok(Math.abs(ct._primaryCurrent-10)<.001,ct._primaryCurrent);assert.ok(Math.abs(a._currentValue-.5)<.001,a._currentValue);ct.ctPrimary=200;t.solve();assert.ok(Math.abs(a._currentValue-.25)<.001);t.project.wires.pop();t.solve();assert.equal(ct._secondaryOpen,true);assert.ok(a._currentValue<.001);Sim.clear(t.project);assert.equal(a._currentValue,undefined);
});
test('SSR positive 24 V operates NO and NC isolated output contacts and reversed input cannot actuate',()=>{
 for(const mode of ['NO','NC']){const t=circuit(),s=t.add('supply-dc-plus','s'),f=t.add('solid-state-relay','f'),l=t.add('lamp-green','l');C.setContactMode(t.project,f,mode,byId);t.wire(s,'P',f,'1');t.wire(f,'2',l,'X1');t.wire(l,'X2',s,'M');t.solve();assert.equal(l._active,mode==='NC');t.wire(s,'P',f,'3+');t.wire(s,'M',f,'4−');t.solve();assert.equal(l._active,mode==='NO');t.project.wires.at(-1).from.p='P';t.project.wires.at(-2).from.p='M';t.solve();assert.equal(l._active,mode==='NC')}
});
test('editor variants, device scaling and fuse states persist',()=>{
 const a=createApp({appearance:'material'});a.drop('sensor-pt100',400,250);a.$('#propPtWires').value='4';a.$('#propPtWires').emit('change');assert.equal(a.save().components[0].typeId,'sensor-pt100-4wire');a.$('#propMaterialScale').value='150';a.$('#propMaterialScale').emit('change');assert.equal(a.save().components[0].materialScale,1.5);assert.ok(a.$('#scene').innerHTML.includes('scale(1.5)'));
 a.drop('door-isolator-1p',700,250);a.$('#propPoleCount').value='6';a.$('#propPoleCount').emit('change');assert.equal(a.save().components.at(-1).typeId,'door-isolator-6p');
 a.drop('fuse-switch',950,250);a.$('#propFuseCount').value='3';a.$('#propFuseCount').emit('change');const el=a.$('#scene [data-fuse-slot="1"]');el.emit('pointerdown',{button:0,clientX:1000,clientY:300});assert.equal(a.save().components.at(-1).fuseOpen[1],true);
 const saved=a.save();a.window.DTSStudio.load(saved);assert.equal(a.save().components[0].materialScale,1.5);assert.equal(a.save().components.at(-1).fuseOpen[1],true);
});
test('a connected fourth PT100 lead prevents reduction to two wires',()=>{
 const project={version:7,workspaceMode:'control',components:[{id:'pt',typeId:'sensor-pt100-4wire',x:400,y:250},{id:'r',typeId:'resistor',x:700,y:250}],wires:[{id:'w',from:{c:'pt',p:'A2'},to:{c:'r',p:'1'}}],junctions:[]};
 const a=createApp({project});a.$('.component[data-id="pt"]').emit('pointerdown',{clientX:400,clientY:250});a.window.emit('pointerup',{buttons:0,clientX:400,clientY:250});
 a.$('#propPtWires').value='2';a.$('#propPtWires').emit('change');assert.equal(a.save().components[0].typeId,'sensor-pt100-4wire');assert.equal(a.save().wires[0].from.p,'A2');
});
test('the ratio property and potentiometer knob update saved values without moving the component',()=>{
 const a=createApp({appearance:'material'});a.drop('current-transformer',300,200);a.$('#propCtRatio').value='200/5';a.$('#propCtRatio').emit('change');assert.equal(a.save().components[0].ctPrimary,200);
 a.drop('potentiometer',600,250);a.$('#propPotMax').value='100000';a.$('#propPotMax').emit('change');const before=a.save().components.at(-1),handle=a.$('#scene [data-pot-knob]');handle.emit('pointerdown',{clientX:600,clientY:300});a.window.emit('pointermove',{clientX:625,clientY:300});a.window.emit('pointerup',{buttons:0,clientX:625,clientY:300});const after=a.save().components.at(-1);assert.equal(after.potMax,100000);assert.ok(after.potentiometer>50);assert.deepEqual([after.x,after.y],[before.x,before.y]);assert.equal(a.document.querySelectorAll('#propMaterialScale').length,1);
});
test('CT rejects DC even with an unrelated AC source, and follows line-to-line AC voltage',()=>{
 const t=circuit(),s=t.add('supply-dc-plus','s'),ct=t.add('current-transformer','ct'),r=t.add('resistor','r',{resistance:24});t.add('supply-1p','unrelated');t.wire(s,'P',ct,'P1');t.wire(ct,'P2',r,'1');t.wire(r,'2',s,'M');t.solve();assert.equal(ct._primaryCurrent,0);
 const u=circuit(),ac=u.add('supply-3p','ac'),cc=u.add('current-transformer','cc'),rr=u.add('resistor','rr',{resistance:23});u.wire(ac,'L1',cc,'P1');u.wire(cc,'P2',rr,'1');u.wire(rr,'2',ac,'L2');u.solve();assert.ok(Math.abs(cc._primaryCurrent-10*Math.sqrt(3))<.002);
});
test('all v1.11 starter circuits contain valid terminals and solve',()=>{
 const scope={window:{DTSStarterProjects:{}}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/starter-v111.js'),'utf8'),scope);
 for(const p of Object.values(scope.window.DTSStarterProjects)){const defs=Object.fromEntries(p.components.map(c=>[c.id,byId[c.typeId]]));for(const w of p.wires)for(const r of [w.from,w.to])assert.ok(defs[r.c]?.pins.some(pin=>pin.id===r.p),p.name+': '+JSON.stringify(r));assert.equal(Sim.solve(p,byId,{now:0}).shortCircuit,false,p.name)}
});
test('front animations move their own actuators; audio devices use four distinct matching product images',()=>{
 for(const id of ['limit-no','limit-nc','mechanical-control','mechanical-latching'])assert.match(M.markup(byId[id],{state:true}),/roller-lever[^>]*rotate\(90/);
 assert.match(M.markup(byId['thermal-magnetic'],{state:true}),/siemens-3rv2011-1ja10-cad-front\.svg/);assert.notEqual(M.markup(byId['mcb-1p'],{state:true}),M.markup(byId['mcb-1p'],{state:false}));
 for(const [id,file] of [['speaker','speaker'],['buzzer','buzzer'],['annunciation','alarm'],['siren','siren']])assert.ok(M.markup(byId[id],{}).includes(file+'-v111.'));
 const d=byId.potentiometer;assert.ok(M.markup(d,{potentiometer:75,potMax:100000}).includes('75000 Ω'));
});
