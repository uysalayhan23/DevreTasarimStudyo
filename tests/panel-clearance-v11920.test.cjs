const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {createApp}=require('./helpers/offline-dom.cjs');
const P=require('../dist/panel.js'),S=require('../dist/symbols.js'),C=require('../dist/catalog.js'),D=require('../dist/design-library.js'),Projects=require('../dist/project-store.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const lib=C.prepare(S.prepareLibrary(D.extend(ctx.window.COMPONENT_LIBRARY))),byId=Object.fromEntries(lib.map(d=>[d.id,d]));
const clone=o=>JSON.parse(JSON.stringify(o));
const box=(id,mount,x,y,w,h,depth,status='approximate',colliderStatus='conservative-envelope')=>({id,typeId:id,ref:id.toUpperCase(),mount,x,y,w,h,depth,dimensionStatus:status,colliderStatus});

test('existing training panel remains clear through the full 0-105 degree door sweep',()=>{
  const project=Projects.editableCopy(JSON.parse(fs.readFileSync(path.join(__dirname,'../Kaydedilen_Projeler/03_Egitim_Panosu.odsdevre'))));
  const p=P.normalize(project.panel,byId),before=JSON.stringify(p);
  const result=P.doorClearance(p,{fromAngle:0,toAngle:105});
  assert.equal(result.ok,true,result.reason);
  assert.equal(result.clearanceMm,5);
  assert.equal(JSON.stringify(p),before);
});

test('five millimetres is the accepted door-to-plate clearance boundary',()=>{
  const p=P.defaults();p.items=[
    box('plate','plate',100,100,50,50,135),
    box('door','door',100,100,50,50,60)
  ];
  const safe=P.doorClearance(p,{fromAngle:0,toAngle:0});
  assert.equal(safe.ok,true,safe.reason);
  p.items[0].depth=136;
  const blocked=P.doorClearance(p,{fromAngle:0,toAngle:0});
  assert.equal(blocked.ok,false);
  assert.equal(blocked.code,'door-sweep-collision');
  assert.equal(blocked.collision.angle,0);
  assert.equal(blocked.collision.clearanceMm,5);
  assert.equal(blocked.collision.geometryStatus,'approximate-envelope');
  assert.equal(blocked.collision.colliderStatus,'conservative-envelope');
});

test('door sweep catches an intermediate-angle collision even when the closed position is clear',()=>{
  const p=P.defaults();p.items=[
    box('plate','plate',100,100,50,50,180),
    box('door','door',30,100,50,50,60)
  ];
  assert.equal(P.doorClearance(p,{fromAngle:0,toAngle:0}).ok,true);
  const sweep=P.doorClearance(p,{fromAngle:0,toAngle:105});
  assert.equal(sweep.ok,false);
  assert.equal(sweep.code,'door-sweep-collision');
  assert.ok(sweep.collision.angle>0&&sweep.collision.angle<105,sweep.collision.angle);
  assert.match(sweep.reason,/kapanış hacmi/i);
});

test('new placement and enclosure depth changes reject a panel that cannot close',()=>{
  const p=P.defaults(),plate=box('plate','plate',100,100,50,50,180);
  p.items.push(plate);
  const candidate=box('door','door',30,100,50,50,60);
  const placement=P.check(p,candidate);
  assert.equal(placement.ok,false);
  assert.equal(placement.code,'door-sweep-collision');
  assert.equal(p.items.length,1);

  const deep=P.defaults();deep.depth=300;deep.items=[
    box('plate2','plate',100,300,50,50,140),
    box('door2','door',100,300,50,50,60)
  ];
  assert.equal(P.doorClearance(deep,{fromAngle:0,toAngle:0}).ok,true);
  const before=clone(deep);
  const resized=P.resize(deep,deep.width,deep.height,220);
  assert.equal(resized.ok,false);
  assert.equal(resized.code,'door-sweep-collision');
  assert.deepEqual(deep,before);
});

test('verified dimensions only promote the collision envelope, not the physical profile collider',()=>{
  const p=P.defaults();p.items=[
    box('plate','plate',100,100,50,50,140,'verified'),
    box('door','door',100,100,50,50,60,'verified')
  ];
  const r=P.doorClearance(p,{fromAngle:0,toAngle:0});
  assert.equal(r.ok,false);
  assert.equal(r.collision.geometryStatus,'verified-envelope');
  assert.equal(r.collision.colliderStatus,'conservative-envelope');
});

test('collision confidence becomes verified-profile only when both consumed collider profiles are present',()=>{
  const plate={...box('plate','plate',100,100,50,50,140,'verified','verified-profile'),colliderProfileXZMm:[{x:0,z:0},{x:50,z:0},{x:50,z:140},{x:0,z:140}]};
  const door={...box('door','door',100,100,50,50,60,'verified','verified-profile'),colliderProfileXZMm:[{x:0,z:0},{x:50,z:0},{x:50,z:60},{x:0,z:60}]};
  const p=P.defaults();p.items=[plate,door];
  const r=P.doorClearance(p,{fromAngle:0,toAngle:0});
  assert.equal(r.ok,false);
  assert.equal(r.collision.geometryStatus,'verified-envelope');
  assert.equal(r.collision.colliderStatus,'verified-profile');
  assert.equal(r.collision.plateProfileUsed,true);
  assert.equal(r.collision.doorProfileUsed,true);
});


test('plateSection consumes a verified CAD profile instead of the rectangular depth envelope',()=>{
  const item={...box('cad','plate',100,100,50,50,140,'verified','verified-profile'),colliderProfileXZMm:[{x:0,z:0},{x:50,z:0},{x:40,z:100},{x:10,z:100}]};
  const section=P.plateSection(item,0);
  assert.deepEqual(section,[{x:100,z:20},{x:150,z:20},{x:140,z:120},{x:110,z:120}]);
  const fallback=P.plateSection({...item,colliderStatus:'conservative-envelope'},0);
  assert.deepEqual(fallback,[{x:100,z:20},{x:150,z:20},{x:150,z:160},{x:100,z:160}]);
});

test('panel UI refuses to close a legacy layout through a sweep collision',()=>{
  const project=Projects.editableCopy(JSON.parse(fs.readFileSync(path.join(__dirname,'../Kaydedilen_Projeler/03_Egitim_Panosu.odsdevre'))));
  project.panel.items.push(
    {...box('legacy-plate','plate',100,690,50,40,180),typeId:'main-contact',ref:'COL-P'},
    {...box('legacy-door','door',30,690,50,40,60),typeId:'push-no',ref:'COL-D'}
  );
  project.panel.doorAngle=105;
  const a=createApp({project,appearance:'material'}),before=a.save().panel.doorAngle;
  const slider=a.$('#panelDoorAngle');slider.value='0';slider.emit('input',{target:slider});
  assert.equal(a.save().panel.doorAngle,before);
  assert.equal(slider.value,String(Math.round(before)));
  assert.match(a.$('#panelToggleDoor').textContent,/⚠/);
  a.$('#panelToggleDoor').click();
  assert.equal(a.save().panel.doorAngle,before);
  assert.ok(a.document.querySelectorAll('.panel-selected').length>=2);
});
