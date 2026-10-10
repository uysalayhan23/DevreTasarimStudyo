const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const P=require('../dist/panel.js'),S=require('../dist/symbols.js'),Sim=require('../dist/simulation.js'),C=require('../dist/catalog.js'),W=require('../dist/workspaces.js'),Design=require('../dist/design-library.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);const lib=C.prepare(S.prepareLibrary(Design.extend(ctx.window.COMPONENT_LIBRARY))),byId=Object.fromEntries(lib.map(d=>[d.id,d]));
const example=key=>require('../dist/project-store.js').editableCopy(JSON.parse(fs.readFileSync(path.join(__dirname,'../Kaydedilen_Projeler',key+'.odsdevre'))));
test('panel mounting rejects collisions, missing rails and undersized enclosures without changing the layout',()=>{
  const p=P.defaults();const before=JSON.stringify(p);assert.equal(P.addItem(p,byId['main-contact'],100,150).ok,false);assert.equal(JSON.stringify(p),before);
  const rail=P.addRail(p,40,150,450),a=P.addItem(p,byId['main-contact'],100,150);assert.equal(a.ok,true);assert.equal(a.item.railId,rail.id);assert.equal(a.item.y+a.item.h/2,rail.y);
  const old=JSON.stringify(p);assert.equal(P.addItem(p,byId['main-contact'],100,150).ok,false);assert.equal(JSON.stringify(p),old);
  assert.equal(P.resize(p,200,200,100).ok,false);assert.equal(JSON.stringify(p),old);
  const door=P.addItem(p,byId['door-isolator-3p'],100,150,'door');assert.equal(door.ok,true);assert.equal(p.items.length,2);
  const r=P.moveRail(p,rail.id,0,50);assert.equal(r.ok,true);assert.equal(a.item.y+a.item.h/2,rail.y);assert.equal(door.item.y,120);
});
test('panel native product render preserves aspect ratio inside the physical millimetre frame',()=>{
  const square=P.aspectPlacement(100,200,45,58,90,90);
  assert.equal(square.scale,.5);
  assert.equal(square.x,100);
  assert.equal(square.y,206.5);
  assert.equal(square.width,45);
  assert.equal(square.height,45);
  assert.equal(square.anchor,'center');

  const tall=P.aspectPlacement(10,20,36,90,18,90);
  assert.equal(tall.scale,1);
  assert.equal(tall.x,19);
  assert.equal(tall.y,20);
  assert.equal(tall.width,18);
  assert.equal(tall.height,90);

  const top=P.aspectPlacement(0,0,100,100,50,25,'top');
  assert.equal(top.scale,2);
  assert.equal(top.x,0);
  assert.equal(top.y,0);
  assert.equal(top.width,100);
  assert.equal(top.height,50);

  const src=fs.readFileSync(require.resolve('../dist/panel.js'),'utf8');
  assert.match(src,/fit=native\?aspectPlacement\(x,y,w,h,d\.w,d\.h,'center'\)/);
  assert.doesNotMatch(src,/scale\(\$\{w\/d\.w\}\s+\$\{h\/d\.h\}\)/);
});

test('panel coordinates round-trip through open/closed door and multiple camera views without changing millimetres',()=>{
  const p=example('03_Egitim_Panosu').panel,before=JSON.stringify(p);
  for(const view of ['3d','plate','door'])for(const angle of [0,45,105]){
    const copy={...p,doorAngle:angle},camera=P.fit(copy,900,650,view);
    for(const surface of ['plate','door']){const matrix=P.matrix(copy,camera,surface),projected=P.project(matrix,270,410),back=P.unproject(matrix,projected.x,projected.y);assert.ok(back);assert.ok(Math.abs(back.x-270)<1e-7);assert.ok(Math.abs(back.y-410)<1e-7)}
    const svg=P.render(copy,byId,camera);assert.ok(!/NaN|undefined/.test(svg));assert.equal(svg.includes('data-panel-surface="door"'),view!=='plate');
  }assert.equal(JSON.stringify(p),before);
});
test('new building vavien circuit lights in two matching states and goes dark from either switch',()=>{
  const p=example('02_Tesisat_Vavien'),s1=p.components.find(c=>c.id==='s1'),s2=p.components.find(c=>c.id==='s2'),lamp=p.components.find(c=>c.id==='light');
  for(const a of [false,true])for(const b of [false,true]){s1.state=a;s2.state=b;const result=Sim.solve(p,byId);assert.equal(result.stable,true);assert.equal(result.shortCircuit,false);assert.equal(lamp._active,a===b,`${a}/${b}`)}
  p.wires=p.wires.filter(w=>w.to.p!=='N');Sim.solve(p,byId);assert.equal(lamp._active,false);
});
test('mode separation retains all legacy records and new materials render in every library style with unchanged pins',()=>{
  assert.ok(lib.length>=493);assert.ok(lib.filter(d=>d.isPLC).length>=208);assert.equal(W.includes(byId['coil-contactor'],'panel'),false);assert.equal(W.includes(byId['coil-contactor'],'control'),true);assert.equal(W.includes(byId['main-contact'],'panel'),true);assert.equal(lib.filter(d=>W.includes(d,'panel')).length,lib.length-1);
  for(const project of ['01_Kumanda_Muhurleme','02_Tesisat_Vavien','03_Egitim_Panosu'])for(const c of example(project).components||[])assert.ok(byId[c.typeId],c.typeId);
  for(const d of lib){assert.ok(W.includes(d,'control')||W.includes(d,'building')||d.classification.group==='panel-layout',d.id);if(d.isPLC)assert.equal(W.includes(d,'building'),false)}
  for(const d of lib.filter(d=>d.designMaterial||d.materialSymbol))for(const angle of [0,90,180,270]){
    const c={id:d.id,rotation:angle,ref:'X1',label:d.name},before=JSON.stringify(d.pins);for(const norm of ['TSE','IEC','ANSI']){
      const material=S.markup(d,c,{mode:'material',norm}),schema=S.markup(d,c,{mode:'iec',norm});assert.ok(!/NaN|undefined/.test(material+schema),d.id);
      for(const pin of d.pins){const q=S.rotatedPoint(pin,d,angle),needle=`cx="${q.x}" cy="${q.y}"`;assert.ok(material.includes(needle)&&schema.includes(needle),d.id)}
    }assert.equal(JSON.stringify(d.pins),before);
  }
});


test('logical contactor coil cannot be added as a separate physical panel device',()=>{
  const p=P.defaults();
  const rail=P.addRail(p,40,150,450);
  const rejected=P.addItem(p,byId['coil-contactor'],100,150);
  assert.equal(rejected.ok,false);
  assert.equal(rejected.primaryComponentId,'main-contact');
  assert.match(rejected.reason,/şematik parçasıdır/i);
  assert.equal(p.items.length,0);
  const physical=P.addItem(p,byId['main-contact'],100,150);
  assert.equal(physical.ok,true);
  assert.equal(physical.item.railId,rail.id);
  assert.equal(p.items.length,1);
});
