const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createApp}=require('./helpers/offline-dom.cjs'),P=require('../dist/panel.js'),W=require('../dist/panel-wiring.js'),Physical=require('../dist/physical-metadata.js'),Projects=require('../dist/project-store.js');
const S=require('../dist/symbols.js'),C=require('../dist/catalog.js'),D=require('../dist/design-library.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);const lib=C.prepare(S.prepareLibrary(D.extend(ctx.window.COMPONENT_LIBRARY))),byId=Object.fromEntries(lib.map(d=>[d.id,d]));
const example=()=>require('../dist/project-store.js').editableCopy(JSON.parse(fs.readFileSync(path.join(__dirname,'../Kaydedilen_Projeler/03_Egitim_Panosu.odsdevre')))),plain=o=>JSON.parse(JSON.stringify(o));
const item=(p,ref)=>p.items.find(i=>i.ref===ref),ref=(p,name,pin)=>({c:item(p,name).id,p:pin});
const down=(a,n,extra={})=>{assert.ok(n,'UI target exists');n.emit('pointerdown',extra);a.window.emit('pointerup',{buttons:0,...extra})};
const pin=(a,name,id)=>{const p=a.save().panel;return a.$('[data-panel-owner="'+item(p,name).id+'"][data-panel-terminal="'+id+'"]')};
function connect(p,a,ap,b,bp,color='#e53935',points=[]){const r=W.connect(p,byId,ref(p,a,ap),ref(p,b,bp),color,'1,5 mm²',points);assert.equal(r.ok,true,r.reason);return r.wire}
test('custom cable styles remain independent on a shared net after normalization and reload',()=>{
 const project=example(),p=P.normalize(project.panel,byId),a=connect(p,'Q1','2','K1','1'),b=connect(p,'K1','1','K2','A1');W.recolor(p,byId,a.id,'#ec4899',3.25);W.recolor(p,byId,b.id,'#ffffff',.5);const endpoints=JSON.stringify([a.from,a.to,b.from,b.to]);W.synchronize(p,byId);assert.equal(a.color,'#ec4899');assert.equal(b.color,'#ffffff');assert.equal(a.size,'3,25 mm²');assert.equal(b.size,'0,5 mm²');const loaded=P.normalize(JSON.parse(JSON.stringify(p)),byId);assert.deepEqual(loaded.wires.map(w=>[w.color,w.size]),p.wires.map(w=>[w.color,w.size]));assert.equal(JSON.stringify([a.from,a.to,b.from,b.to]),endpoints);assert.equal(a.role,b.role);
});
test('duct lids cover wire artwork without modifying its route or endpoints',()=>{
 const p=P.normalize(example().panel,byId);connect(p,'Q1','2','K1','1');const before=JSON.stringify(p.wires),d=p.ducts[0],camera=P.fit(p,1100,900,'plate');d.coverClosed=false;const opened=P.render(p,byId,camera);d.coverClosed=true;const closed=P.render(p,byId,camera);assert.notEqual(closed,opened);assert.equal(JSON.stringify(p.wires),before);assert.equal(W.routes(p,byId,p.wires[0]).length,1);
});
test('an attached gland steers a route and follows accessory movement while keeping terminals',()=>{
 const p=P.normalize(example().panel,byId),w=connect(p,'Q1','2','K1','1'),d={id:'gland',kind:'gland',x:200,y:260,width:30,length:50,vertical:true};p.ducts.push(d);w.accessoryId=d.id;w.points=W.accessoryPoints(d);const ends=JSON.stringify([w.from,w.to]),a=W.routes(p,byId,w);assert.ok(a.length);d.x+=40;const b=W.routes(p,byId,w);assert.ok(b.length);assert.notDeepEqual(a,b);assert.equal(JSON.stringify([w.from,w.to]),ends);assert.ok(b[0].flat.some(q=>q.x===d.x+d.width/2));
});
test('panel conductors attach to exact pins, avoid intervening devices and keep ferrules in all camera views',()=>{
  const p=P.normalize(example().panel,byId),wire=connect(p,'Q1','2','K1','1'),before=JSON.stringify(wire),a=W.endpoint(p,byId,wire.from),b=W.endpoint(p,byId,wire.to);
  // A plate-mounted obstacle forces a detour, including when both ports align.
  p.items.push({id:'obstacle',typeId:'smps',ref:'G2',x:70,y:250,w:80,h:40,depth:70,mount:'plate'});
  const route=W.routes(p,byId,wire)[0];assert.ok(route);assert.equal(route.points[0].x,a.x);assert.equal(route.points.at(-1).y,b.y);
  for(let i=1;i<route.flat.length;i++){const u=route.flat[i-1],v=route.flat[i];assert.ok(u.x===v.x||u.y===v.y);if(u.x===v.x)assert.ok(!(u.x>70&&u.x<150&&Math.max(u.y,v.y)>250&&Math.min(u.y,v.y)<290));else assert.ok(!(u.y>250&&u.y<290&&Math.max(u.x,v.x)>70&&Math.min(u.x,v.x)<150))}
  for(const view of ['plate','3d','door']){const camera=P.fit(p,1100,900,view),svg=P.render(p,byId,camera);assert.ok(!/NaN|undefined/.test(svg));assert.equal((svg.match(/class="panel-ferrule"/g)||[]).length,view==='door'?0:2);assert.equal(JSON.stringify(wire),before)}
  for(const angle of [0,45,105,120]){p.doorAngle=angle;P.render(p,byId,P.fit(p,1100,900,'3d'));assert.equal(JSON.stringify(wire),before)}
});
test('panel line identities inherit automatically, reject cross-line joins, change thickness per color, and release deleted terminals',()=>{
  const p=P.normalize(example().panel,byId),l1=connect(p,'Q1','2','K1','1');
  const branch=connect(p,'K1','1','K2','A1','#1e88e5');assert.equal(branch.role,'L1');assert.equal(branch.color,'#1e88e5');
  const dc=connect(p,'G1','P','H1','X1','#8b5a2b');assert.equal(dc.role,'+24V');assert.equal(dc.color,'#8b5a2b');
  const before=JSON.stringify(p);const rejected=W.connect(p,byId,branch.to,dc.to,'#e53935','1,5 mm²');assert.equal(rejected.ok,false);assert.equal(JSON.stringify(p),before);
  W.setSize(p,l1.color,'6 mm²');assert.equal(l1.size,'6 mm²');assert.equal(branch.size,'1,5 mm²');assert.equal(dc.size,'1,5 mm²');
  const original=plain(branch.to);W.remove(p,[branch.id],byId);assert.equal(item(p,'K2')._terminalLines.A1,undefined);
  const reconnect=W.connect(p,byId,dc.to,original,'#e53935');assert.equal(reconnect.ok,true);assert.equal(reconnect.wire.role,'+24V');
  assert.equal(W.recolor(p,byId,dc.id,l1.color,'2,5 mm²').ok,true);assert.equal(dc.color,l1.color);assert.equal(dc.role,'+24V');
});
test('panel wires survive rail and device movements, manual route save/reload, and selective deletion',()=>{
  const project=example(),p=project.panel=P.normalize(project.panel,byId),w=connect(p,'Q1','2','K1','1','#e53935',[{x:210,y:275,surface:'plate'}]),initial=W.endpoint(p,byId,w.from),saved=plain(w);
  assert.equal(P.moveRail(p,item(p,'Q1').railId,0,25).ok,true);assert.equal(W.endpoint(p,byId,w.from).y,initial.y+25);assert.deepEqual(plain(w),saved);
  const target=item(p,'K1'),beforeTo=W.endpoint(p,byId,w.to),move=P.proposal(p,target,target.x+25,target.y);assert.equal(move.ok,true);Object.assign(target,move.item);assert.equal(W.endpoint(p,byId,w.to).x,beforeTo.x+25,'verified terminal anchor follows device translation');
  const parsed=Projects.parse(JSON.stringify(Projects.clean(project)));P.normalize(parsed.panel,byId);assert.deepEqual(parsed.panel.wires,p.wires);
  P.remove(p,[item(p,'Q1').railId]);assert.equal(p.wires.length,1);assert.equal(item(p,'Q1').mount,'plate');P.remove(p,[target.id]);assert.equal(p.wires.length,0);
  const invalid=example().panel;invalid.wires=[{...saved,to:{c:item(invalid,'K1').id,p:'MISSING'}}];assert.throws(()=>P.normalize(invalid,byId),/terminal/);
});
test('door-to-plate wires keep both terminal ends during door movement and hide interior wires behind the closed door',()=>{
  const p=P.normalize(example().panel,byId),w=connect(p,'K2','A1','S1','14','#808080'),before=JSON.stringify(w);
  assert.deepEqual(W.routes(p,byId,w).map(s=>s.surface),['plate','door']);
  for(const angle of [0,60,105]){p.doorAngle=angle;const svg=P.render(p,byId,P.fit(p,1100,900,'3d'));assert.equal((svg.match(/class="panel-ferrule"/g)||[]).length,angle===0?1:2);assert.equal(svg.includes('panel-door-loom'),angle>0);assert.equal(JSON.stringify(w),before)}
});
test('panel UI connects terminals with waypoints and ferrules, cancels drafts, edits size, reconnects and undoes deletion',()=>{
  const a=createApp({project:example(),appearance:'material'});a.$('[data-panel-view="plate"]').click();
  down(a,pin(a,'Q1','2'));assert.equal(a.$('#panelCancelWire').hidden,false);
  const q=P.project(P.matrix(a.save().panel,a.window.DTSPanelEditor.camera,'plate',20),210,275);down(a,a.$('[data-panel-surface="plate"]'),{clientX:q.x,clientY:q.y});
  down(a,pin(a,'K1','1'));let w=a.save().panel.wires[0];assert.ok(w);assert.equal(w.points.length,1);assert.equal(w.points[0].x,210);assert.equal(a.$('#panelCancelWire').hidden,true);assert.equal(a.document.querySelectorAll('.panel-ferrule').length,2);
  a.$('#panelSelectedWireSize').value='4 mm²';a.$('#panelWireForm').emit('submit');assert.equal(a.save().panel.wires[0].size,'4 mm²');
  a.$('#panelReconnectTo').click();a.$('#panelCancelWire').click();assert.deepEqual(a.save().panel.wires[0].to,w.to);
  a.$('#panelReconnectTo').click();down(a,pin(a,'K2','A1'));w=a.save().panel.wires[0];assert.equal(w.to.p,'A1');assert.equal(a.save().panel.wires.length,1);
  a.$('#undoBtn').click();assert.equal(a.save().panel.wires[0].to.p,'1');a.$('#redoBtn').click();assert.equal(a.save().panel.wires[0].to.p,'A1');
  down(a,a.$('[data-panel-wire="'+w.id+'"]'));a.document.emit('keydown',{key:'Delete'});assert.equal(a.save().panel.wires.length,0);assert.equal(a.document.querySelectorAll('.panel-ferrule').length,0);a.$('#undoBtn').click();assert.equal(a.save().panel.wires.length,1);
  const saved=a.save();a.window.DTSStudio.load(saved);assert.deepEqual(a.save().panel.wires,saved.panel.wires);
  down(a,pin(a,'Q1','4'));a.document.emit('keydown',{key:'Escape'});assert.equal(a.$('#panelCancelWire').hidden,true);assert.equal(a.save().panel.wires.length,1);
});
test('adding a rail or duct immediately succeeds in crowded and small panels, selects it, and reveals the interior',()=>{
  const project=example();project.panel.rails=Array.from({length:8},(_,i)=>({id:'r'+i,x:30,y:40+i*20,length:140}));project.panel.items=[];project.panel.ducts=[{id:'full',x:20,y:20,width:160,length:160,vertical:true}];project.panel.width=project.panel.height=200;project.panel.doorAngle=0;
  const a=createApp({project,appearance:'material'});a.$('[data-panel-view="door"]').click();const p=a.save().panel;
  a.$('#panelAddRail').click();assert.equal(a.save().panel.rails.length,p.rails.length+1);assert.equal(a.window.DTSPanelEditor.camera.view,'plate');assert.ok(a.$('.panel-selected'));
  for(let i=0;i<7;i++)a.$('#panelAddDuct').click();assert.equal(a.save().panel.ducts.length,p.ducts.length+7);assert.ok(a.$('.panel-selected'));a.$('#undoBtn').click();assert.equal(a.save().panel.ducts.length,p.ducts.length+6);
});
test('panel zoom, pan, orbit and view switches keep saved cable routes byte-identical and do not enable simulation',()=>{
  const p=example();p.panel=P.normalize(p.panel,byId);connect(p.panel,'Q1','2','K1','1');const a=createApp({project:p,appearance:'material'}),before=JSON.stringify(a.save().panel.wires);
  a.$('#panelViewport').emit('wheel',{deltaY:-800,clientX:500,clientY:300});a.$('#panelOrbitRight').click();
  a.$('#panelViewport').emit('pointerdown',{button:2,clientX:100,clientY:100});a.window.emit('pointermove',{clientX:220,clientY:250});a.window.emit('pointerup',{button:2,buttons:0});
  for(const view of ['plate','door','3d']){a.$('[data-panel-view="'+view+'"]').click();assert.equal(JSON.stringify(a.save().panel.wires),before)}assert.equal(a.$('#simulateBtn').disabled,true);
});
test('every library terminal maps to the panel device boundary, including PLC I/O, and covered waypoints reroute without losing anchors',()=>{
  for(const d of lib){const spec=P.spec(d),i={id:'test',typeId:d.id,x:40,y:40,...spec};const ports=W.ports(i,d),panelPins=Physical.panelPins(d);assert.equal(ports.length,panelPins.length,d.id);for(const t of ports){assert.ok(Number.isFinite(t.x)&&Number.isFinite(t.y),d.id);if(t.geometryStatus==='verified'){assert.ok(t.x>=i.x&&t.x<=i.x+i.w&&t.y>=i.y&&t.y<=i.y+i.h,d.id)}else{assert.ok(t.x===i.x||t.x===i.x+i.w||t.y===i.y||t.y===i.y+i.h,d.id)}}}
  const p=P.normalize(example().panel,byId),w=connect(p,'Q1','2','K1','1','#e53935',[{x:200,y:275,surface:'plate'}]),saved=JSON.stringify(w);
  p.items.push({id:'new-item',typeId:'smps',ref:'G2',x:175,y:250,w:80,h:40,depth:70,mount:'plate'});
  assert.equal(W.routes(p,byId,w).length,1);assert.equal(JSON.stringify(w),saved);
});


test('panel cable horizontal and vertical segments can move independently while terminal ends stay fixed',()=>{
  const p=P.normalize(example().panel,byId),first=connect(p,'Q1','2','K1','1','#e53935'),second=connect(p,'K1','1','K2','A1','#1e88e5');
  const other=JSON.stringify(second),ends=JSON.stringify([first.from,first.to]),route=W.routes(p,byId,first)[0];
  const segments=[];for(let i=1;i<=route.flat.length-3;i++){const a=route.flat[i],b=route.flat[i+1];if(a.x===b.x||a.y===b.y)segments.push({i,a,b,vertical:a.x===b.x})}
  assert.ok(segments.length>0);
  const s=segments.sort((x,y)=>Math.hypot(y.b.x-y.a.x,y.b.y-y.a.y)-Math.hypot(x.b.x-x.a.x,x.b.y-x.a.y))[0],mid={x:(s.a.x+s.b.x)/2,y:(s.a.y+s.b.y)/2};
  const hit=W.nearestSegment(route.flat,mid,true);assert.equal(hit.segment,s.i);
  const target=s.vertical?{x:mid.x+25,y:mid.y}:{x:mid.x,y:mid.y+25},moved=W.moveSegment(p,byId,first,route.surface,hit.segment,target);
  assert.equal(moved.ok,true,moved.reason);assert.equal(JSON.stringify([first.from,first.to]),ends);assert.equal(JSON.stringify(second),other);assert.ok(first.points.length>0);
  const rerouted=W.routes(p,byId,first)[0].flat;
  assert.ok(s.vertical?rerouted.some((q,i)=>i&&q.x===P.snap(target.x)&&rerouted[i-1].x===P.snap(target.x)):rerouted.some((q,i)=>i&&q.y===P.snap(target.y)&&rerouted[i-1].y===P.snap(target.y)));
  const svg=P.render(p,byId,P.fit(p,1100,900,'plate'),new Set([first.id]));assert.match(svg,new RegExp('data-panel-wire="'+first.id+'"[^>]*data-panel-wire-surface="plate"'));
});
