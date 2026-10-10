'use strict';

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.join(__dirname,'..');

test('relay material uses the user-approved Omron MY asset and short-edge A1/A2 terminals',()=>{
  const context={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const byId=Object.fromEntries(context.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));
  const relay=byId['coil-relay'];assert.ok(relay);
  assert.equal(relay.w,43);
  assert.equal(relay.h,56);
  assert.deepEqual({...relay.physicalDimensionsMm},{width:21.5,height:28,shape:'rect'});
  assert.equal(relay.materialAsset,'omron-my-relay-v11920');
  assert.equal(relay.materialPhoto,'omron-my-relay-v11920.webp');
  assert.deepEqual(relay.pins.map(p=>({id:p.id,x:p.x,y:p.y,side:p.side})),[
    {id:'A1',x:21.5,y:0,side:'top'},
    {id:'A2',x:21.5,y:56,side:'bottom'}
  ]);
  assert.equal(relay.portStyle,'hole');
  assert.equal(relay.runtimeVisualOverride,'same-canonical-asset-as-coil-relay-dc');
  assert.equal(relay.visualFitMode,'contain-no-distortion');
  const art=fs.readFileSync(path.join(root,'dist','materials-v115.js'),'utf8');
  assert.match(art,/omron-my-relay-v11920\.webp\?rev=20261008-omron7/);
  assert.match(art,/viewBox="0 0 180 240"/);
});

test('visible Röle uses the same Omron MY canonical visual as DC Röle Bobini at 21.5 x 28 mm',()=>{
  const context={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const byId=Object.fromEntries(context.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));
  const relay=byId['misc-relay'],dc=byId['coil-relay-dc'];
  assert.ok(relay);assert.ok(dc);
  assert.equal(relay.name,'Röle');
  assert.equal(relay.w,43);assert.equal(relay.h,56);
  assert.deepEqual({...relay.physicalDimensionsMm},{width:21.5,height:28,shape:'rect'});
  assert.equal(relay.materialAsset,'omron-my-relay-v11920');
  assert.equal(dc.materialAsset,'omron-my-relay-v11920');
  assert.equal(relay.materialPhoto,dc.materialPhoto);
  assert.deepEqual(relay.pins.map(p=>({id:p.id,x:p.x,y:p.y,side:p.side})),[
    {id:'A1',x:21.5,y:0,side:'top'},
    {id:'A2',x:21.5,y:56,side:'bottom'}
  ]);
  const art=fs.readFileSync(path.join(root,'dist','materials-v115.js'),'utf8');
  assert.match(art,/\['coil-relay','coil-relay-dc','misc-relay'\]/);
  assert.match(art,/omron-my-relay-v11920\.webp\?rev=20261008-omron7/);
});

test('auxiliary contact frames use the shared workspace scale',()=>{
  const context={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const byId=Object.fromEntries(context.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));
  for(const id of ['contact-no','contact-nc','contact-both']){
    const d=byId[id];assert.ok(d,id);
    assert.equal(d.w,72,id+' width');
    assert.equal(d.h,75,id+' height');
    assert.deepEqual({...d.physicalDimensionsMm},{width:36,height:37.5,shape:'rect'},id+' mm frame');
    assert.equal(d.physicalScaleSource,'workspace-space-v1:user-locked',id+' source');
    for(const p of d.pins){assert.ok(p.x>=0&&p.x<=72,id+':'+p.id+':x');assert.ok(p.y>=0&&p.y<=75,id+':'+p.id+':y');}
  }
});

test('solid-state relay uses 45 x 62 mm shared workspace frame',()=>{
  const context={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const byId=Object.fromEntries(context.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));
  const d=byId['solid-state-relay'];assert.ok(d);
  assert.equal(d.w,90);
  assert.equal(d.h,124);
  assert.deepEqual({...d.physicalDimensionsMm},{width:45,height:62,shape:'rect'});
  assert.equal(d.physicalScaleSource,'workspace-space-v1:user-locked');
  assert.equal(d.visualAssetPreserved,true);
  for(const p of d.pins){assert.ok(p.x>=0&&p.x<=90,p.id+':x');assert.ok(p.y>=0&&p.y<=124,p.id+':y');}
});

test('user scale-only lock preserves old visuals and applies requested physical dimensions',()=>{
  const context={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const byId=Object.fromEntries(context.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));

  const waz=byId['converter-pressure'];
  assert.equal(waz.w,35);
  assert.equal(waz.h,184.8);
  assert.deepEqual({...waz.physicalDimensionsMm},{width:17.5,height:92.4,depth:112.4,shape:'rect'});
  assert.equal(waz.instrument,'waz5');
  assert.equal(waz.visualAssetPreserved,true);

  const ordel=byId['converter-temperature'];
  assert.equal(ordel.w,90);
  assert.equal(ordel.h,90);
  assert.deepEqual({...ordel.physicalDimensionsMm},{width:45,height:45,depth:20,shape:'cylinder'});
  assert.equal(ordel.instrument,'hmt');
  assert.equal(ordel.visualAssetPreserved,true);

  const main=byId['main-contact'];
  assert.equal(main.w,90);
  assert.equal(main.h,116);
  assert.deepEqual({...main.physicalDimensionsMm},{width:45,height:58,depth:73,shape:'rect'});
  assert.equal(main.materialAsset,'siemens-contactor');
  assert.equal(main.visualAssetPreserved,true);
  for(const id of ['motor-starter','coil-contactor']){
    const d=byId[id];
    assert.equal(d.w,90,id+' proxy width');
    assert.equal(d.h,116,id+' proxy height');
    assert.equal(d.physicalDimensionsMm,undefined,id+' must not claim a second physical product');
    assert.equal(d.physicalScaleProxyOf,'main-contact',id+' physical proxy');
    assert.equal(d.physicalRole,'logical-part',id+' physical role');
    assert.equal(d.materialAsset,'siemens-contactor',id+' existing visual asset');
    assert.equal(d.visualAssetPreserved,true,id+' preserve lock');
  }

  const art=fs.readFileSync(path.join(root,'dist','materials-v115.js'),'utf8');
  assert.match(art,/ordel-top-v115\.png/);
  assert.match(art,/viewBox="85 75 1080 1080"/);
  assert.match(art,/weid-front-v115\.png/);
  assert.match(art,/'394 27 226 1480'/);
  assert.match(art,/photo\('weid-front-v115\.png','394 27 226 1480',0,0,d\.w,d\.h/);
  assert.doesNotMatch(art,/d\.instrument==='waz5'.*instrument-scale-only/s);
  assert.match(art,/instrument-scale-only/); // ORDEL keeps its square legacy-art wrapper.
});


test('temperature controller, thermal auxiliary contacts and relay coils use the requested shared-workspace dimensions',()=>{
  const context={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const byId=Object.fromEntries(context.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));
  const expected={
    'temperature-controller':[48,48,96,96],
    'thermal-contact-no':[46,87,92,174],
    'thermal-contact-nc':[46,87,92,174],
    'coil-relay-dc':[28,78,56,156],
    'coil-pulse':[18,70,36,140],
    'coil-timer':[18,70,36,140],
    'coil-delay-off':[18,70,36,140],
    'coil-flasher':[18,70,36,140],
    'coil-delay-on':[18,70,36,140]
  };
  for(const [id,[mmW,mmH,w,h]] of Object.entries(expected)){
    const d=byId[id];assert.ok(d,id);
    assert.equal(d.w,w,id+' width');
    assert.equal(d.h,h,id+' height');
    assert.deepEqual({...d.physicalDimensionsMm},{width:mmW,height:mmH,shape:'rect'},id+' physical frame');
    assert.equal(d.physicalScaleSource,'workspace-space-v1:user-locked',id+' source');
    assert.equal(d.visualAssetPreserved,true,id+' visual preservation');
    for(const p of d.pins){
      assert.ok(p.x>=0&&p.x<=d.w,id+':'+p.id+':x');
      assert.ok(p.y>=0&&p.y<=d.h,id+':'+p.id+':y');
    }
  }
});

test('relay and SSR material rendering exposes a simulation-driven green active LED',()=>{
  const art=fs.readFileSync(path.join(root,'dist','materials.js'),'utf8');
  assert.match(art,/material-active-led-wrap/);
  assert.match(art,/solid-state-relay/);
  assert.match(art,/c\._active/);
  assert.match(art,/#22c55e/);
});


test('button bodies use 36 x 46 mm frames and requested actuator diameters',()=>{
  const context={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const byId=Object.fromEntries(context.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));
  for(const id of ['push-no','push-both','push-nc','illuminated-push','jog-4pin']){
    const d=byId[id];assert.ok(d,id);
    assert.equal(d.w,72,id+' width');assert.equal(d.h,92,id+' height');
    assert.deepEqual({...d.physicalDimensionsMm},{width:36,height:46,shape:'rect'},id+' physical frame');
    assert.equal(d.buttonActuatorDiameterMm,29,id+' actuator mm');
    assert.equal(d.buttonActuatorDiameterScene,58,id+' actuator scene');
    for(const p of d.pins){assert.ok(p.x>=0&&p.x<=d.w,id+':'+p.id+':x');assert.ok(p.y>=0&&p.y<=d.h,id+':'+p.id+':y');}
  }
  for(const id of ['estop','mushroom-no','mushroom-nc']){
    const d=byId[id];assert.ok(d,id);
    assert.equal(d.buttonActuatorDiameterMm,40,id+' actuator mm');
    assert.equal(d.buttonActuatorDiameterScene,80,id+' actuator scene');
  }
  const art=fs.readFileSync(path.join(root,'dist','materials.js'),'utf8');
  assert.match(art,/buttonActuatorDiameterScene/);
  assert.match(art,/controlRegion\(d,id,fit\)/);
});


test('ET4420 visible face is exactly 48 x 48 mm and visual terminals use two non-overlapping bottom rows',()=>{
  const context={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const d=context.window.COMPONENT_LIBRARY.find(x=>x.id==='temperature-controller');
  assert.ok(d);
  assert.equal(d.w,96);assert.equal(d.h,96);
  assert.deepEqual({...d.physicalDimensionsMm},{width:48,height:48,shape:'rect'});
  assert.deepEqual({...d.visualFrameScene},{width:96,height:96});
  assert.deepEqual({...d.visualFrameMm},{width:48,height:48});
  assert.equal(d.terminalGeometryStatus,'bottom-row-user-locked');
  assert.equal(d.terminalRowOutsideVisual,true);
  assert.equal(d.terminalVisualRows,2);
  assert.equal(d.terminalVisualRowSize,7);
  assert.equal(d.terminalVisualLayout,'bottom-two-rows');
  assert.equal(d.pins.length,14);
  assert.ok(d.pins.every(p=>p.side==='bottom'&&p.y===d.h));
  const renderer=fs.readFileSync(path.join(root,'dist','materials-v115.js'),'utf8');
  assert.match(renderer,/photo\('enda-front-v115\.png','85 93 1085 1080',0,0,d\.w,d\.h/);
  assert.match(renderer,/data-terminal-layout="bottom-two-rows"/);
  assert.match(renderer,/data-terminal-row-size="7"/);
  assert.match(renderer,/rowSize=7/);
  assert.match(renderer,/row2Y=row1Y\+termH\+rowGap\+5/);
  assert.doesNotMatch(renderer,/bottom-single-row/);
  assert.doesNotMatch(renderer,/text\(130,248,'ARKA KLEMENSLER'/);
});

test('18 x 70 mm relay coils and one-pole devices use the shared workspace scale',()=>{
  const context={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const byId=Object.fromEntries(context.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));
  for(const id of ['coil-pulse','coil-timer','coil-flasher','coil-delay-off','coil-delay-on','disconnect-1p']){
    const d=byId[id];assert.ok(d,id);
    assert.equal(d.w,36,id+' width');
    assert.equal(d.h,140,id+' height');
    assert.deepEqual({...d.physicalDimensionsMm},{width:18,height:70,shape:'rect'},id+' physical frame');
    assert.equal(d.physicalScaleSource,'workspace-space-v1:user-locked',id+' source');
    for(const p of d.pins){assert.ok(p.x>=0&&p.x<=d.w,id+':'+p.id+':x');assert.ok(p.y>=0&&p.y<=d.h,id+':'+p.id+':y');}
  }
  const onePole=Object.values(byId).filter(d=>d.siemensPhoto==='5SL6116-7');
  assert.ok(onePole.length>0,'5SL6116-7 entry missing');
  for(const d of onePole){
    assert.equal(d.w,36,d.id+' width');assert.equal(d.h,140,d.id+' height');
    assert.deepEqual({...d.physicalDimensionsMm},{width:18,height:70,shape:'rect'});
    assert.equal(d.userVisualAsset,'siemens-5sl6116-7-user-front-v11920.webp');
    assert.equal(d.visualFitMode,'contain-no-distortion');
    assert.deepEqual({...d.runtimeVisualCalibration.sourceCanvasPx},{width:126,height:490},d.id+' source canvas');
    assert.deepEqual({...d.runtimeVisualCalibration.targetFrameMm},{width:18,height:70},d.id+' target frame');
  }
  const art=fs.readFileSync(path.join(root,'dist','materials-v113.js'),'utf8');
  assert.match(art,/siemens-5sl6116-7-user-front-v11920\.webp\?rev=20261008-5sl6116-11/);
  assert.match(art,/viewBox="0 0 126 490"/);
  const asset=fs.readFileSync(path.join(root,'dist','assets','products','siemens-5sl6116-7-user-front-v11920.webp'));
  assert.ok(asset.length>8000,'5SL6116-7 converted asset size');
  assert.equal(asset.subarray(0,4).toString('ascii'),'RIFF');
  assert.equal(asset.subarray(8,12).toString('ascii'),'WEBP');
  assert.equal(asset.subarray(12,16).toString('ascii'),'VP8X');
  const width=1+asset[24]+(asset[25]<<8)+(asset[26]<<16);
  const height=1+asset[27]+(asset[28]<<8)+(asset[29]<<16);
  assert.equal(width,126,'5SL6116-7 WebP width');
  assert.equal(height,490,'5SL6116-7 WebP height');
  assert.equal(asset.readUInt32LE(4)+8,asset.length,'5SL6116-7 RIFF declared length');
  const chunks=[];let pos=12;
  while(pos+8<=asset.length){
    const type=asset.subarray(pos,pos+4).toString('ascii');
    const size=asset.readUInt32LE(pos+4);
    const end=pos+8+size;
    assert.ok(end<=asset.length,'5SL6116-7 '+type+' chunk bounds');
    chunks.push(type);
    pos=end+(size%2);
  }
  assert.equal(pos,asset.length,'5SL6116-7 RIFF chunk coverage');
  assert.ok(chunks.includes('VP8X'),'5SL6116-7 VP8X chunk');
  assert.ok(chunks.includes('VP8 ')||chunks.includes('VP8L'),'5SL6116-7 decodable image payload chunk');
});

test('Tense FKV-03 uses the requested 23 x 60 mm shared workspace frame',()=>{
  const context={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const byId=Object.fromEntries(context.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));
  const d=byId['motor-protection-relay'];assert.ok(d);
  assert.match(d.name,/Faz Koruma Rölesi/);assert.equal(d.materialModel,'FKV-03');
  assert.equal(d.w,46);assert.equal(d.h,120);
  assert.deepEqual({...d.physicalDimensionsMm},{width:23,height:60,shape:'rect'});
  for(const p of d.pins){assert.ok(p.x>=0&&p.x<=46,p.id+':x');assert.ok(p.y>=0&&p.y<=120,p.id+':y');}
});

test('auxiliary relay remains locked to the user Omron visual at 21.5 x 28 mm',()=>{
  const context={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const d=context.window.COMPONENT_LIBRARY.find(x=>x.id==='coil-relay');assert.ok(d);
  assert.equal(d.w,43);assert.equal(d.h,56);
  assert.deepEqual({...d.physicalDimensionsMm},{width:21.5,height:28,shape:'rect'});
  assert.equal(d.materialAsset,'omron-my-relay-v11920');
  assert.equal(d.visualSourceStatus,'user-approved-upload-reaffirmed');
});


test('5SL6316-7 and 3RV2011 use the requested physical frames and user-approved 3RV visual',()=>{
  const context={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const all=context.window.COMPONENT_LIBRARY;
  const mcb=all.find(d=>d.siemensPhoto==='5SL6316-7');
  const rv=all.find(d=>d.siemensPhoto==='3RV2011-1JA10');
  assert.ok(mcb,'5SL6316-7 library entry');
  assert.equal(mcb.w,108);
  assert.equal(mcb.h,140);
  assert.deepEqual({...mcb.physicalDimensionsMm},{width:54,height:70,shape:'rect'});
  assert.equal(mcb.physicalScaleSource,'workspace-space-v1:user-locked');
  for(const p of mcb.pins){assert.ok(p.x>=0&&p.x<=mcb.w,'5SL6316 '+p.id+' x');assert.ok(p.y>=0&&p.y<=mcb.h,'5SL6316 '+p.id+' y');}

  assert.ok(rv,'3RV2011 library entry');
  assert.equal(rv.w,90);
  assert.equal(rv.h,194);
  assert.deepEqual({...rv.physicalDimensionsMm},{width:45,height:97,shape:'rect'});
  assert.equal(rv.physicalScaleSource,'workspace-space-v1:user-locked');
  assert.equal(rv.materialAsset,'siemens-3rv2011-user-front-v11920');
  assert.equal(rv.userVisualAsset,'siemens-3rv2011-user-front-v11920.webp');
  assert.equal(rv.visualSourceStatus,'user-approved-upload');
  for(const p of rv.pins){assert.ok(p.x>=0&&p.x<=rv.w,'3RV2011 '+p.id+' x');assert.ok(p.y>=0&&p.y<=rv.h,'3RV2011 '+p.id+' y');}

  const material=fs.readFileSync(path.join(root,'dist','materials.js'),'utf8');
  assert.match(material,/siemens-3rv2011-user-front-v11920\.webp/);
  assert.match(material,/physicalFrameMm:\{width:45,height:97\}/);
  const renderer=fs.readFileSync(path.join(root,'dist','materials-v113.js'),'utf8');
  assert.match(renderer,/siemens-3rv2011-user-front-v11920\.webp\?rev=20261008-3rv6/);
  assert.match(renderer,/viewBox="0 0 180 388"/);
  assert.match(renderer,/preserveAspectRatio="xMidYMid meet"/);
  const rvAsset=fs.readFileSync(path.join(root,'dist','assets','products','siemens-3rv2011-user-front-v11920.webp'));
  assert.ok(rvAsset.length>18000,'3RV2011 canonical WebP size');
  assert.equal(rvAsset.subarray(0,4).toString('ascii'),'RIFF');
  assert.equal(rvAsset.subarray(8,12).toString('ascii'),'WEBP');
  assert.equal(rvAsset.subarray(12,16).toString('ascii'),'VP8X');
  const rvWidth=1+rvAsset[24]+(rvAsset[25]<<8)+(rvAsset[26]<<16);
  const rvHeight=1+rvAsset[27]+(rvAsset[28]<<8)+(rvAsset[29]<<16);
  assert.equal(rvWidth,180,'3RV2011 WebP width');
  assert.equal(rvHeight,388,'3RV2011 WebP height');
  assert.equal(rvAsset.readUInt32LE(4)+8,rvAsset.length,'3RV2011 RIFF declared length');
  const rvChunks=[];let rvPos=12;
  while(rvPos+8<=rvAsset.length){
    const type=rvAsset.subarray(rvPos,rvPos+4).toString('ascii');
    const size=rvAsset.readUInt32LE(rvPos+4),end=rvPos+8+size;
    assert.ok(end<=rvAsset.length,'3RV2011 '+type+' chunk bounds');
    rvChunks.push(type);rvPos=end+(size%2);
  }
  assert.equal(rvPos,rvAsset.length,'3RV2011 RIFF chunk coverage');
  assert.ok(rvChunks.includes('VP8X'),'3RV2011 VP8X chunk');
  assert.ok(rvChunks.includes('VP8 ')||rvChunks.includes('VP8L'),'3RV2011 image payload chunk');
  const html=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
  assert.match(html,/materials-v113\.js\?rev=20261008-user-scale-lock13/);
});


test('ET4420 uses real two-row interactive ports without duplicate fake terminal artwork',()=>{
  const context={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const d=context.window.COMPONENT_LIBRARY.find(x=>x.id==='temperature-controller');assert.ok(d);
  assert.equal(d.w,96);assert.equal(d.h,96);assert.equal(d.pins.length,14);
  const r1=d.pins.slice(0,7),r2=d.pins.slice(7);
  assert.ok(r1.every(p=>p.y===108&&p.side==='bottom'&&p.terminalRow===1));
  assert.ok(r2.every(p=>p.y===130&&p.side==='bottom'&&p.terminalRow===2));
  assert.ok(d.pins.every(p=>p.label===p.id));
  assert.deepEqual(r1.map(p=>p.id),['4','5','6','7','8','9','10']);
  assert.deepEqual(r2.map(p=>p.id),['11','12','13','14','15','16','17']);
  assert.equal(d.annotationBottomOffsetScene,58);
  assert.equal(d.terminalVisualLayout,'bottom-two-rows-real-ports');
  const art=fs.readFileSync(path.join(root,'dist','materials-v115.js'),'utf8');
  assert.doesNotMatch(art,/et4420-terminal-rows/);
  const symbols=fs.readFileSync(path.join(root,'dist','symbols.js'),'utf8');
  assert.match(symbols,/annotationBottomOffsetScene/);
});

test('DC relay uses the user-approved Omron visual while retaining its 28 x 78 mm frame',()=>{
  const context={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),context);
  const d=context.window.COMPONENT_LIBRARY.find(x=>x.id==='coil-relay-dc');assert.ok(d);
  assert.equal(d.w,56);assert.equal(d.h,156);
  assert.deepEqual({...d.physicalDimensionsMm},{width:28,height:78,shape:'rect'});
  assert.equal(d.materialAsset,'omron-my-relay-v11920');
  assert.equal(d.materialPhoto,'omron-my-relay-v11920.webp');
  assert.deepEqual(d.materialPins.map(p=>({id:p.id,x:p.x,y:p.y,side:p.side})),[{id:'A1',x:28,y:0,side:'top'},{id:'A2',x:28,y:156,side:'bottom'}]);
  const art=fs.readFileSync(path.join(root,'dist','materials-v115.js'),'utf8');
  assert.match(art,/coil-relay-dc/);
});


test('runtime visual closure: 5SL6316, 3RV, 5TL and HCFA fit modes',()=>{
  const libCtx={window:{DTSWorkspaceSpace:{sceneUnitsPerMm:2}}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'dist','library.js'),'utf8'),libCtx);
  const all=libCtx.window.COMPONENT_LIBRARY;
  const sl=all.find(d=>d.siemensPhoto==='5SL6316-7');assert.ok(sl);
  assert.equal(sl.w,108);assert.equal(sl.h,140);
  assert.equal(sl.visualOrientationStatus,'orthographic-front');
  assert.equal(sl.visualFitMode,'contain-no-distortion');
  assert.match(sl.runtimeVisualCalibration.sourceViewBox,/0 115 594 770/);

  const tl=all.find(d=>d.siemensPhoto==='5TL1163-0');assert.ok(tl);
  assert.equal(tl.w,36);assert.equal(tl.h,140);
  assert.deepEqual({...tl.physicalDimensionsMm},{width:18,height:70,shape:'rect'});
  assert.equal(tl.physicalScaleSource,'workspace-space-v1:user-locked');
  assert.equal(tl.visualSuitabilityStatus,'user-approved-upload');
  assert.equal(tl.visualSourceStatus,'user-approved-upload');
  assert.equal(tl.visualOrientationStatus,'orthographic-front');
  assert.equal(tl.visualFitMode,'contain-no-distortion');
  assert.equal(tl.userVisualAsset,'siemens-5tl1163-0-user-front.webp');
  assert.equal(tl.materialAsset,'siemens-5tl1163-0-user-front');
  assert.deepEqual({...tl.runtimeVisualCalibration.sourceCanvasPx},{width:180,height:861});
  assert.deepEqual({...tl.runtimeVisualCalibration.targetFrameMm},{width:18,height:70});

  const rv=all.find(d=>d.siemensPhoto==='3RV2011-1JA10');assert.ok(rv);
  assert.equal(rv.w,90);assert.equal(rv.h,194);
  assert.equal(rv.userVisualAsset,'siemens-3rv2011-user-front-v11920.webp');

  const m113=fs.readFileSync(path.join(root,'dist','materials-v113.js'),'utf8');
  assert.match(m113,/siemens-3rv2011-user-front-v11920\.webp\?rev=20261008-3rv6/);
  assert.match(m113,/siemens-5tl1163-0-user-front\.webp\?rev=20261008-5tl5/);
  assert.match(m113,/viewBox="0 0 180 861"/);
  assert.match(m113,/viewBox="0 0 180 388"/);
  assert.doesNotMatch(m113,/3RV2011-1JA10'[\s\S]{0,400}siemens-3rv2011-1ja10-cad-front\.svg/);
  assert.match(m113,/d\.siemensPhoto==='5SL6316-7'/);
  assert.match(m113,/viewBox="0 115 594 770"/);

  const h=fs.readFileSync(path.join(root,'dist','hcfa-ui.js'),'utf8');
  assert.doesNotMatch(h,/preserveAspectRatio="none"/);
  assert.match(h,/data-visual-fit="contain-no-distortion"/);
  assert.match(h,/srcW=141,srcH=438/);
  assert.match(h,/srcW=640,srcH=244/);
});


test('visual runtime revisions expose the current locked material scripts and product binaries',()=>{
  const html=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
  assert.match(html,/library\.js\?rev=20261008-user-scale-lock7/);
  assert.match(html,/materials-v113\.js\?rev=20261008-user-scale-lock12/);
  assert.match(html,/materials-v115\.js\?rev=20261008-user-scale-lock7/);
  assert.match(html,/materials\.js\?rev=20261008-user-scale-lock6/);
  assert.match(html,/symbols\.js\?rev=20261008-visual-runtime4/);
  assert.match(html,/app\.js\?rev=20261008-visual-runtime4/);
  const m115=fs.readFileSync(path.join(root,'dist','materials-v115.js'),'utf8');
  assert.match(m115,/omron-my-relay-v11920\.webp\?rev=20261008-omron7/);
  const m113=fs.readFileSync(path.join(root,'dist','materials-v113.js'),'utf8');
  assert.match(m113,/siemens-5sl6116-7-user-front-v11920\.webp\?rev=20261008-5sl6116-11/);
});

test('ET4420 material labels ignore stale saved physical labels and show only terminal ids',()=>{
  const src=fs.readFileSync(path.join(root,'dist','symbols.js'),'utf8');
  assert.match(src,/material&&d\.instrument==='et4420'/);
  assert.match(src,/labelText=p\.id/);
  assert.match(src,/font-size:4\.2px/);
});


test('runtime cache keys expose the completed user-scale closure',()=>{
  const html=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
  assert.match(html,/library\.js\?rev=20261008-user-scale-lock7/);
  assert.match(html,/materials-v113\.js\?rev=20261008-user-scale-lock12/);
  assert.match(html,/materials-v115\.js\?rev=20261008-user-scale-lock7/);
  assert.doesNotMatch(html,/<script src="library\.js\?rev=20261008-visual-runtime4"><\/script>/);
});


test('5TL user canonical WebP is valid and matches the requested runtime visual',()=>{
  const asset=fs.readFileSync(path.join(root,'dist','assets','products','siemens-5tl1163-0-user-front.webp'));
  assert.ok(asset.length>30000,'5TL canonical asset size');
  assert.equal(asset.subarray(0,4).toString('ascii'),'RIFF');
  assert.equal(asset.subarray(8,12).toString('ascii'),'WEBP');
  assert.equal(asset.subarray(12,16).toString('ascii'),'VP8X');
  const width=1+asset[24]+(asset[25]<<8)+(asset[26]<<16);
  const height=1+asset[27]+(asset[28]<<8)+(asset[29]<<16);
  assert.equal(width,180,'5TL WebP width');
  assert.equal(height,861,'5TL WebP height');
  assert.equal(asset.readUInt32LE(4)+8,asset.length,'5TL RIFF declared length');
  const chunks=[];let pos=12;
  while(pos+8<=asset.length){
    const type=asset.subarray(pos,pos+4).toString('ascii');
    const size=asset.readUInt32LE(pos+4),end=pos+8+size;
    assert.ok(end<=asset.length,'5TL '+type+' chunk bounds');
    chunks.push(type);pos=end+(size%2);
  }
  assert.equal(pos,asset.length,'5TL RIFF chunk coverage');
  assert.ok(chunks.includes('VP8X'),'5TL VP8X chunk');
  assert.ok(chunks.includes('VP8 ')||chunks.includes('VP8L'),'5TL image payload chunk');
  const renderer=fs.readFileSync(path.join(root,'dist','materials-v113.js'),'utf8');
  assert.match(renderer,/siemens-5tl1163-0-user-front\.webp\?rev=20261008-5tl5/);
  assert.match(renderer,/viewBox="0 0 180 861"/);
  assert.match(renderer,/preserveAspectRatio="xMidYMid meet"/);
  const html=fs.readFileSync(path.join(root,'dist','index.html'),'utf8');
  assert.match(html,/materials-v113\.js\?rev=20261008-user-scale-lock14/);
});
