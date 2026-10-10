const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Physical=require('../dist/physical-metadata.js');
const Panel=require('../dist/panel.js');
const Engineering=require('../dist/panel-engineering.js');
const Wiring=require('../dist/panel-wiring.js');
const Symbols=require('../dist/symbols.js'),Catalog=require('../dist/catalog.js'),Design=require('../dist/design-library.js');

const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const library=Catalog.prepare(Symbols.prepareLibrary(Design.extend(ctx.window.COMPONENT_LIBRARY)));
const byId=Object.fromEntries(library.map(d=>[d.id,d]));

test('verified manufacturer physical metadata is preserved while each product keeps its evidence-gated panel state',()=>{
  const cases=[
    ['main-contact',{physicalW:45,physicalH:58,physicalDepth:73,asset:'siemens-contactor',mount:'rail',mountingType:'din-rail',panelStatus:'ready',clearance:{sideBySide:{forward:10,up:10,down:10,side:0},groundedParts:{forward:10,up:10,down:10,side:6},liveParts:{forward:10,up:10,down:10,side:6}}}],
    ['smps',{physicalW:35,physicalH:130,physicalDepth:125,asset:'weidmuller-pro-top',mount:'rail',mountingType:'din-rail',panelStatus:'ready',clearance:{freeAirFlow:{up:50,down:50},neighbouringSubassemblies:{side:10}}}],
    ['fan-1p',{physicalW:255,physicalH:255,physicalDepth:107,asset:'rittal-fan',mount:'door',mountingType:'door-cutout',panelStatus:'ready'}],
    ['sinamics-v20-1p',{physicalW:90.8,physicalH:160.9,physicalDepth:147,asset:'sinamics-v20-book',mount:'plate',mountingType:'mounting-plate',frameSize:'FSAC',panelStatus:'ready',clearance:{freeAirFlow:{up:100,down:100},adjacentConverters:{side:0},cabinetEnclosure:{side:15}}}],
    ['photoeye',{physicalW:16,physicalH:39.5,physicalDepth:12,asset:'sick-photoelectric',mount:'external',mountingType:'field-device',panelStatus:'ready'}]
  ];
  for(const [id,expected] of cases){
    const component=byId[id];assert.ok(component,id);
    assert.equal(component.materialAsset,expected.asset,id);
    const record=Physical.get(component);assert.ok(record,id);
    assert.equal(record.sourceStatus,'verified',id);
    assert.equal(record.sourceAuthority,'manufacturer',id);
    assert.match(record.sourceUrl,/^https:\/\//,id);
    const spec=Panel.spec(component);
    assert.equal(spec.physicalWidthMm,expected.physicalW,id);
    assert.equal(spec.physicalHeightMm,expected.physicalH,id);
    assert.equal(spec.physicalDepthMm,expected.physicalDepth,id);
    assert.equal(spec.physicalDimensionStatus,'verified',id);
    assert.equal(spec.panelGeometryStatus,expected.panelStatus||'staged',id);
    assert.equal(spec.dimensionStatus,'verified',id);
    assert.equal(spec.mount,expected.mount,id);
    assert.equal(spec.mountingType,expected.mountingType,id);
    assert.deepEqual(spec.allowedPanelMounts,[expected.mount],id);
    assert.equal(spec.physicalAsset,expected.asset,id);
    if(expected.frameSize){
      assert.equal(record.frameSize,expected.frameSize,id);
      assert.equal(spec.frameSize,expected.frameSize,id);
    }
    if(expected.clearance){
      assert.deepEqual(record.requiredClearanceMm,expected.clearance,id);
      assert.deepEqual(spec.requiredClearanceMm,expected.clearance,id);
      const before=JSON.stringify(Physical.get(component).requiredClearanceMm);
      const mutateFirstNumericLeaf=node=>{
        for(const key of Object.keys(node||{})){
          if(Number.isFinite(node[key])){node[key]=999;return true}
          if(node[key]&&typeof node[key]==='object'&&mutateFirstNumericLeaf(node[key]))return true;
        }
        return false;
      };
      assert.equal(mutateFirstNumericLeaf(spec.requiredClearanceMm),true,id);
      assert.equal(JSON.stringify(Physical.get(component).requiredClearanceMm),before,id);
    }
  }
});
test('Siemens 3RT2016 physical terminal frame is derived from the official orthographic dimensional drawing',()=>{
  const d=byId['main-contact'],record=Physical.get(d),spec=Panel.spec(d);
  assert.ok(record);
  assert.equal(record.terminalGeometryStatus,'verified');
  assert.equal(record.terminalGeometryMethod,'scaled-manufacturer-orthographic-drawing');
  assert.equal(record.terminalGeometryToleranceMm,1);
  assert.match(record.terminalSourceUrl,/^https:\/\/static\.siemens\.com\//);
  const expected={
    '1':[5,9.6,'top'],'3':[14,9.6,'top'],'5':[23,9.6,'top'],'13':[32,9.6,'top'],'A1':[41,9.6,'top'],
    '2':[5,52.1,'bottom'],'4':[14,52.1,'bottom'],'6':[23,52.1,'bottom'],'14':[32,52.1,'bottom'],'A2':[41,52.1,'bottom']
  };
  for(const [pin,[x,y,side]] of Object.entries(expected)){
    assert.deepEqual(Physical.terminalGeometryEvidence(d,pin),{pinId:pin,xMm:x,yMm:y,side,status:'verified',sourceUrl:record.terminalSourceUrl,method:'scaled-manufacturer-orthographic-drawing',toleranceMm:1},pin);
    assert.ok(Physical.terminalAnchor(d,pin),pin);
  }
  assert.equal(spec.panelGeometryStatus,'ready');
  assert.deepEqual(spec.panelGeometryBlockers,[]);
  assert.ok(!spec.panelGeometryBlockers.includes('verified-terminal-geometry'));
});

test('panel geometry promotion gate requires verified source, exact orthographic visual and terminal geometry when terminals exist',()=>{
  const product={sourceStatus:'verified'};
  const component={id:'synthetic',pins:[{id:'1'}]};
  const ready={visualMatchStatus:'exact',visualOrientationStatus:'orthographic-front',terminalGeometryStatus:'verified'};
  assert.deepEqual(Physical.panelGeometryGate(product,ready,component),{ready:true,reasons:[]});
  assert.deepEqual(Physical.panelGeometryGate(product,{...ready,terminalGeometryStatus:'unverified'},component),{ready:false,reasons:['verified-terminal-geometry']});
  assert.deepEqual(Physical.panelGeometryGate(product,{...ready,visualOrientationStatus:'perspective'},component),{ready:false,reasons:['orthographic-front']});
  assert.deepEqual(Physical.panelGeometryGate(product,{...ready,visualMatchStatus:'family'},component),{ready:false,reasons:['exact-visual']});
  assert.deepEqual(Physical.panelGeometryGate({sourceStatus:'unverified'},ready,component),{ready:false,reasons:['verified-product-dimensions']});
  assert.deepEqual(Physical.panelGeometryGate(product,{visualMatchStatus:'exact',visualOrientationStatus:'orthographic-front',terminalGeometryStatus:'unverified'},{id:'no-pins',pins:[]}),{ready:true,reasons:[]});
});

test('Siemens 5SL family and exact V20 are promoted after complete visual, product and terminal evidence',()=>{
  const mcb=Panel.spec(byId['mcb-1p']);
  assert.equal(mcb.panelGeometryStatus,'ready');
  assert.deepEqual(mcb.panelGeometryBlockers,[]);
  assert.equal(mcb.dimensionStatus,'verified');
  assert.equal(mcb.w,18);
  assert.equal(mcb.h,90);
  assert.equal(mcb.depth,76);

  const v20=Panel.spec(byId['sinamics-v20-1p']);
  assert.equal(v20.panelGeometryStatus,'ready');
  assert.deepEqual(v20.panelGeometryBlockers,[]);
  assert.equal(v20.dimensionStatus,'verified');
  assert.equal(v20.w,90.8);
  assert.equal(v20.h,160.9);
  assert.equal(v20.depth,147);
});

test('verified Siemens 5SL MCBs keep exact identity and fully promoted verified geometry',()=>{
  const cases=[
    ['mcb-1p',{modelCode:'5SL6116-7',productKey:'siemens-5sl6116-7',asset:'siemens-mcb1-v113',w:18,h:90,d:76,installD:70,orientation:'orthographic-front'}],
    ['mcb-2p',{modelCode:'5SL6216-7',productKey:'siemens-5sl6216-7',asset:'siemens-mcb2-v113',w:36,h:90,d:76,installD:70,orientation:'orthographic-front'}],
    ['mcb-3p',{modelCode:'5SL6316-7',productKey:'siemens-5sl6316-7',asset:'siemens-mcb3-v113',w:54,h:90,d:76,installD:70,orientation:'orthographic-front'}]
  ];
  for(const [id,x] of cases){
    const component=byId[id];assert.ok(component,id);
    assert.equal(component.siemensPhoto,x.modelCode,id);
    const record=Physical.get(component);assert.ok(record,id);
    assert.equal(record.productKey,x.productKey,id);
    assert.equal(record.assetKey,x.asset,id);
    assert.equal(record.visualMatchStatus,'exact',id);
    assert.equal(record.visualOrientationStatus,x.orientation,id);
    assert.equal(record.sourceAuthority,'manufacturer',id);
    assert.match(record.sourceUrl,/^https:\/\/support\.industry\.siemens\.com\//,id);
    assert.equal(record.widthMm,x.w,id);
    assert.equal(record.heightMm,x.h,id);
    assert.equal(record.depthMm,x.d,id);
    assert.equal(record.installationDepthMm,x.installD,id);
    const spec=Panel.spec(component);
    assert.equal(spec.physicalWidthMm,x.w,id);
    assert.equal(spec.physicalHeightMm,x.h,id);
    assert.equal(spec.physicalDepthMm,x.d,id);
    assert.equal(spec.panelGeometryStatus,'ready',id);
    assert.equal(spec.dimensionStatus,'verified',id);
    assert.deepEqual(spec.panelGeometryBlockers,[],id);
    assert.equal(spec.w,x.w,id);
    assert.equal(spec.h,x.h,id);
    assert.equal(spec.depth,x.d,id);
    assert.equal(spec.mount,'rail',id);
    assert.equal(spec.mountingType,'din-rail',id);
    assert.deepEqual(spec.allowedPanelMounts,['rail'],id);
    assert.equal(record.terminalGeometryStatus,'verified',id);
    assert.equal(record.terminalGeometryToleranceMm,1,id);
    if(id==='mcb-1p'){
      assert.equal(record.terminalGeometryMethod,'scaled-manufacturer-orthographic-drawing');
      assert.match(record.terminalSourceUrl,/^https:\/\/static\.siemens\.com\//);
    }else{
      assert.equal(record.terminalGeometryMethod,'manufacturer-5sl6-pole-pitch+verified-1p-y',id);
      assert.match(record.terminalSourceUrl,/^https:\/\/support\.industry\.siemens\.com\//,id);
    }
    for(const pin of component.pins)assert.ok(Physical.terminalAnchor(component,pin.id),id+':'+pin.id);
  }
});

test('verified Siemens isolator and motor-protection products use exact model identity with ready geometry',()=>{
  const cases=[
    ['disconnect-1p',{modelCode:'5TL1163-0',productKey:'siemens-5tl1163-0',asset:'siemens-isolator-v113',w:18,h:89.8,d:74.5,installD:70,identity:'verified',orientation:'orthographic-front'}],
    ['thermal-magnetic',{modelCode:'3RV2011-1JA10',productKey:'siemens-3rv2011-1ja10',asset:'siemens-thermal-v113',w:45,h:97,d:97,identity:'partial',orientation:'orthographic-front',clearance:{sideBySide:{side:0}},clearanceByVoltage:{'400':{groundedParts:{up:30,down:30,side:9},liveParts:{up:30,down:30,side:9}},'500':{groundedParts:{up:30,down:30,side:9},liveParts:{up:30,down:30,side:9}},'690':{groundedParts:{up:50,down:50,forward:0,backward:0,side:30},liveParts:{up:50,down:50,forward:0,backward:0,side:30}}}}]
  ];
  for(const [id,x] of cases){
    const component=byId[id];assert.ok(component,id);
    assert.equal(component.siemensPhoto,x.modelCode,id);
    const record=Physical.get(component);assert.ok(record,id);
    assert.equal(record.productKey,x.productKey,id);
    assert.equal(record.assetKey,x.asset,id);
    assert.equal(record.visualMatchStatus,'exact',id);
    assert.equal(record.visualOrientationStatus,x.orientation,id);
    assert.equal(record.sourceStatus,'verified',id);
    assert.equal(record.sourceAuthority,'manufacturer',id);
    assert.match(record.sourceUrl,/^https:\/\//,id);
    assert.equal(record.widthMm,x.w,id);
    assert.equal(record.heightMm,x.h,id);
    assert.equal(record.depthMm,x.d,id);
    if(x.installD!==undefined)assert.equal(record.installationDepthMm,x.installD,id);
    const spec=Panel.spec(component);
    if(x.clearance){
      assert.deepEqual(record.requiredClearanceMm,x.clearance,id);
      assert.deepEqual(spec.requiredClearanceMm,x.clearance,id);
    }
    if(x.clearanceByVoltage){
      assert.deepEqual(record.requiredClearanceByVoltageMm,x.clearanceByVoltage,id);
      assert.deepEqual(spec.requiredClearanceByVoltageMm,x.clearanceByVoltage,id);
    }
    assert.equal(record.terminalIdentityStatus,x.identity,id);
    assert.equal(record.terminalGeometryStatus,'verified',id);
    assert.equal(spec.physicalWidthMm,x.w,id);
    assert.equal(spec.physicalHeightMm,x.h,id);
    assert.equal(spec.physicalDepthMm,x.d,id);
    assert.equal(spec.panelGeometryStatus,'ready',id);
    assert.equal(spec.dimensionStatus,'verified',id);
    assert.equal(spec.mount,'rail',id);
    assert.equal(spec.mountingType,'din-rail',id);
    assert.deepEqual(spec.allowedPanelMounts,['rail'],id);
    for(const pin of component.pins){if(['95','96'].includes(pin.id)&&id==='thermal-magnetic')assert.equal(Physical.terminalAnchor(component,pin.id),null,id+':'+pin.id);else assert.ok(Physical.terminalAnchor(component,pin.id),id+':'+pin.id);}
  }
});

test('Siemens MCB terminal identities and sourced terminal geometry stay verified across the 5SL family',()=>{
  const cases=[
    ['mcb-1p',['1','2']],
    ['mcb-2p',['1','3','2','4']],
    ['mcb-3p',['1','3','5','2','4','6']]
  ];
  for(const [id,pins] of cases){
    const d=byId[id],record=Physical.get(d);assert.ok(record,id);
    assert.deepEqual(Array.from(d.pins,p=>p.id),pins,id);
    assert.equal(record.terminalIdentityStatus,'verified',id);
    assert.match(record.terminalIdentitySourceUrl,/^https:\/\/support\.industry\.siemens\.com\//,id);
    for(const pin of pins)assert.equal(Physical.terminalIdentity(d,pin).status,'verified',id+':'+pin);
    assert.equal(record.terminalGeometryStatus,'verified',id);
    for(const pin of pins)assert.ok(Physical.terminalAnchor(d,pin),id+':'+pin);
  }
});

test('Siemens 3RV terminal identity verifies only manufacturer-documented main terminals',()=>{
  const d=byId['thermal-magnetic'],record=Physical.get(d);assert.ok(record);
  const pins=Array.from(d.pins,p=>p.id);
  assert.deepEqual(pins,['1','3','5','2','4','6','95','96']);
  assert.equal(record.terminalIdentityStatus,'partial');
  assert.deepEqual(record.verifiedTerminalIds,['1','3','5','2','4','6']);
  assert.match(record.terminalIdentitySourceUrl,/^https:\/\/support\.industry\.siemens\.com\//);
  for(const pin of ['1','3','5','2','4','6']){
    assert.deepEqual(Physical.terminalIdentity(d,pin),{pinId:pin,status:'verified',sourceUrl:record.terminalIdentitySourceUrl});
    assert.ok(Physical.terminalGeometryEvidence(d,pin),pin);
    assert.ok(Physical.terminalAnchor(d,pin),pin);
  }
  for(const pin of ['95','96']){
    assert.deepEqual(Physical.terminalIdentity(d,pin),{pinId:pin,status:'unverified',sourceUrl:null});
    assert.equal(Physical.terminalGeometryEvidence(d,pin),null,pin);
    assert.equal(Physical.terminalAnchor(d,pin),null,pin);
  }
  assert.equal(record.terminalGeometryStatus,'verified');
  assert.equal(record.terminalGeometryMethod,'scaled-manufacturer-orthographic-drawing');
  assert.equal(record.terminalGeometryToleranceMm,1.5);
});

test('partial terminal identity requires HTTPS evidence and an explicit unique verified-terminal subset',()=>{
  const base={productKey:'siemens-3rv2011-1ja10',assetKey:'siemens-thermal-v113',assetIdentityField:'siemensPhoto',assetIdentityValue:'3RV2011-1JA10',visualMatchStatus:'exact',visualOrientationStatus:'orthographic-front',terminalIdentityStatus:'partial',terminalGeometryStatus:'unverified'};
  assert.deepEqual(Physical.validateMapping(base),{ok:false,reason:'terminalIdentitySourceUrl'});
  const sourced={...base,terminalIdentitySourceUrl:'https://support.industry.siemens.com/example'};
  assert.deepEqual(Physical.validateMapping(sourced),{ok:false,reason:'verifiedTerminalIds'});
  assert.deepEqual(Physical.validateMapping({...sourced,verifiedTerminalIds:['1','1']}),{ok:false,reason:'verifiedTerminalIds'});
  assert.deepEqual(Physical.validateMapping({...sourced,verifiedTerminalIds:['1','2']}),{ok:true});
});

test('verified terminal identity requires a technical HTTPS source even without geometry anchors',()=>{
  const base={productKey:'siemens-5sl6116-7',assetKey:'siemens-mcb1-v113',assetIdentityField:'siemensPhoto',assetIdentityValue:'5SL6116-7',visualMatchStatus:'exact',visualOrientationStatus:'orthographic-front',terminalIdentityStatus:'verified',terminalGeometryStatus:'unverified'};
  assert.deepEqual(Physical.validateMapping(base),{ok:false,reason:'terminalIdentitySourceUrl'});
  assert.deepEqual(Physical.validateMapping({...base,terminalIdentitySourceUrl:'https://support.industry.siemens.com/example'}),{ok:true});
});

test('Siemens MCB physical dimensions are rejected if the exact visual model identity changes',()=>{
  const source=byId['mcb-1p'];
  assert.ok(Physical.get(source));
  const wrong={...source,siemensPhoto:'5SL6116-7-WRONG'};
  assert.equal(Physical.get(wrong),null);
  const spec=Panel.spec(wrong);
  assert.equal(spec.physicalDimensionStatus,undefined);
  assert.equal(spec.dimensionStatus,'approximate');
  assert.equal(spec.dimensionSource,null);
});

test('legacy category dimensions stay explicit approximate fallbacks without invented sources',()=>{
  for(const id of ['overload','relay-1','rcd-2p']){
    const component=byId[id];if(!component)continue;
    assert.equal(Physical.get(component),null,id);
    const spec=Panel.spec(component);
    assert.equal(spec.dimensionStatus,'approximate',id);
    assert.equal(spec.dimensionAuthority,'legacy-category-fallback',id);
    assert.equal(spec.dimensionSource,null,id);
    assert.ok(spec.w>0&&spec.h>0&&spec.depth>0,id);
  }
});

test('exact dimensions are not reused when the product asset identity changes',()=>{
  const source=byId['main-contact'];
  const replacement={...source,materialAsset:'different-contactor'};
  assert.equal(Physical.get(replacement),null);
  const spec=Panel.spec(replacement);
  assert.equal(spec.dimensionStatus,'approximate');
  assert.equal(spec.dimensionSource,null);
  assert.equal(spec.physicalDimensionStatus,undefined);
});

test('WAZ5 verified physical metadata matches the shared workspace frame',()=>{
  const d=byId['converter-pressure'];assert.ok(d);
  assert.equal(d.w,35);
  assert.equal(d.h,184.8);
  const record=Physical.get(d);assert.ok(record);
  assert.equal(record.productKey,'weidmuller-8540300000');
  assert.equal(record.widthMm,17.5);
  assert.equal(record.heightMm,92.4);
  assert.equal(record.depthMm,112.4);
  assert.equal(record.sourceAuthority,'manufacturer');
  assert.match(record.sourceUrl,/8540300000\/scope\/1\/$/);
  const audit=Physical.materialScaleAudit(d);
  assert.equal(audit.status,'aspect-consistent');
  assert.deepEqual(audit.unitsPerMm,{x:2,y:2});
  assert.equal(Physical.panelEligibility(d).eligible,false);
});

test('ORDEL HMT physical scale treats 45 mm as diameter, never radius',()=>{
  const d=byId['converter-temperature'];assert.ok(d);
  assert.equal(d.materialAsset,'ordel-top-v115');
  assert.equal(d.physicalDiameterMm,45);
  assert.equal(d.physicalDepthMm,20);
  assert.equal(d.w,90);
  assert.equal(d.h,90);
  const record=Physical.get(d);assert.ok(record);
  assert.equal(record.productKey,'ordel-hmt-head-transmitter');
  assert.equal(record.widthMm,45);
  assert.equal(record.heightMm,45);
  assert.equal(record.depthMm,20);
  assert.equal(record.sourceAuthority,'manufacturer');
  assert.match(record.sourceUrl,/ordel\.com\.tr\/upload\/KK_134_3_TR_HMT-R\.pdf$/);
  const audit=Physical.materialScaleAudit(d);
  assert.equal(audit.status,'aspect-consistent');
  assert.deepEqual(audit.unitsPerMm,{x:2,y:2});
  assert.equal(Physical.panelEligibility(d).eligible,false);
});

test('physical metadata records are validated, cloned and measurable for coverage',()=>{
  const record=Physical.get(byId['smps']);
  assert.deepEqual(Physical.validateProduct(record),{ok:true});
  record.widthMm=999;
  assert.equal(Physical.get(byId['smps']).widthMm,35);
  const coverage=Physical.coverage(library);
  assert.equal(coverage.products,12);
  assert.equal(coverage.mappings,13);
  assert.equal(coverage.mapped,13);
  assert.equal(coverage.verified,13);
  assert.equal(coverage.verifiedProfiles,3);
  assert.equal(coverage.verifiedProfileColliders,1);
  assert.equal(coverage.library,library.length);
  assert.deepEqual(Physical.validateProduct({productKey:'bad',widthMm:1,heightMm:2,depthMm:0,sourceStatus:'verified',sourceAuthority:'manufacturer',sourceUrl:'https://example.invalid'}),{ok:false,reason:'dimensions'});
  assert.deepEqual(Physical.validateProduct({productKey:'bad-install-depth',widthMm:1,heightMm:2,depthMm:3,installationDepthMm:0,sourceStatus:'verified',sourceAuthority:'manufacturer',sourceUrl:'https://example.invalid',mountingType:'din-rail',allowedPanelMounts:['rail'],defaultPanelMount:'rail'}),{ok:false,reason:'installationDepth'});
  assert.deepEqual(Physical.validateProduct({productKey:'bad-clearance',widthMm:1,heightMm:2,depthMm:3,requiredClearanceMm:{sideBySide:{forward:-1}},sourceStatus:'verified',sourceAuthority:'manufacturer',sourceUrl:'https://example.invalid',mountingType:'din-rail',allowedPanelMounts:['rail'],defaultPanelMount:'rail'}),{ok:false,reason:'requiredClearance'});
  assert.deepEqual(Physical.validateProduct({productKey:'bad-voltage-clearance',widthMm:1,heightMm:2,depthMm:3,requiredClearanceByVoltageMm:{'690':{liveParts:{side:-1}}},sourceStatus:'verified',sourceAuthority:'manufacturer',sourceUrl:'https://example.invalid',mountingType:'din-rail',allowedPanelMounts:['rail'],defaultPanelMount:'rail'}),{ok:false,reason:'requiredClearanceByVoltage'});
  const profileBase={productKey:'profile-test',widthMm:1,heightMm:2,depthMm:3,sourceStatus:'verified',sourceAuthority:'manufacturer',sourceUrl:'https://example.invalid',mountingType:'mounting-plate',allowedPanelMounts:['plate'],defaultPanelMount:'plate'};
  assert.deepEqual(Physical.validateProduct({...profileBase,profileStatus:'maybe'}),{ok:false,reason:'profileStatus'});
  assert.deepEqual(Physical.validateProduct({...profileBase,profileStatus:'verified',profileMethod:'x',profileSourceUrl:'https://example.invalid/profile',profileBoundsMm:{width:1,height:2,depth:3},profileEvidenceFiles:[]}),{ok:false,reason:'profileEvidenceFiles'});
  assert.deepEqual(Physical.validateProduct({...profileBase,profileStatus:'unverified',colliderStatus:'verified-profile'}),{ok:false,reason:'colliderProfileDependency'});
  const verifiedProfile={...profileBase,profileStatus:'verified',profileMethod:'x',profileSourceUrl:'https://example.invalid/profile',profileBoundsMm:{width:1,height:2,depth:3},profileEvidenceFiles:[{file:'x.dxf',sha256:'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',role:'exact-profile'}]};
  assert.deepEqual(Physical.validateProduct({...verifiedProfile,colliderStatus:'verified-profile',colliderMethod:'x'}),{ok:false,reason:'colliderProfile'});
});


test('legacy saved panel item geometry is not silently resized by new metadata',()=>{
  const project=JSON.parse(fs.readFileSync(require.resolve('../Kaydedilen_Projeler/03_Egitim_Panosu.odsdevre'),'utf8'));
  const before=project.panel.items.map(i=>({id:i.id,typeId:i.typeId,w:i.w,h:i.h,depth:i.depth,mount:i.mount}));
  const normalized=Panel.normalize(project.panel,byId);
  const after=normalized.items.map(i=>({id:i.id,typeId:i.typeId,w:i.w,h:i.h,depth:i.depth,mount:i.mount}));
  assert.deepEqual(after,before);
});


test('component/product mapping stays separate from the verified product registry',()=>{
  assert.equal(Physical.componentMap['main-contact'].productKey,'siemens-3rt2016-1bb41');
  assert.equal(Physical.products['siemens-3rt2016-1bb41'].model,'SIRIUS 3RT2016-1BB41');
  assert.equal(Physical.products['siemens-3rt2016-1bb41'].componentId,undefined);
});


test('verified mounting contract rejects physically invalid panel surfaces',()=>{
  const p=Panel.defaults();
  const rail=Panel.addRail(p,40,150,450);

  const contact=Panel.addItem(p,byId['main-contact'],100,150);
  assert.equal(contact.ok,true);
  assert.equal(contact.item.mount,'rail');
  assert.equal(contact.item.railId,rail.id);
  assert.deepEqual(contact.item.allowedPanelMounts,['rail']);

  const wrongContact=Panel.proposal(p,{...contact.item,id:'wrong-contact'},250,250,'plate');
  assert.equal(wrongContact.ok,false);
  assert.match(wrongContact.reason,/montaj yüzeyi/i);

  const sensor=Panel.addItem(p,byId['photoeye'],100,100);
  assert.equal(sensor.ok,true);
  assert.equal(sensor.item.mount,'external');
  assert.deepEqual(sensor.item.allowedPanelMounts,['external']);

  const wrongSensor=Panel.proposal(p,{...sensor.item,id:'wrong-sensor'},100,100,'plate');
  assert.equal(wrongSensor.ok,false);
  assert.match(wrongSensor.reason,/montaj yüzeyi/i);

  const v20=Panel.addItem(p,byId['sinamics-v20-1p'],350,400);
  assert.equal(v20.ok,true);
  assert.equal(v20.item.mount,'plate');
  assert.deepEqual(v20.item.allowedPanelMounts,['plate']);
});


test('verified PROtop panel geometry activates manufacturer clearance checks',()=>{
  const p=Panel.defaults();
  Panel.addRail(p,40,150,450);
  const smps=Panel.addItem(p,byId['smps'],180,150);
  assert.equal(smps.ok,true);
  assert.deepEqual(smps.item.requiredClearanceMm,{freeAirFlow:{up:50,down:50},neighbouringSubassemblies:{side:10}});
  assert.equal(smps.item.physicalDimensionStatus,'verified');
  assert.equal(smps.item.panelGeometryStatus,'ready');
  assert.equal(smps.item.dimensionStatus,'verified');
  const [row]=Engineering.manufacturerClearanceAudit(p);
  assert.equal(row.itemId,smps.item.id);
  assert.notEqual(row.status,'unknown');
  assert.equal(row.missing.includes('verified-panel-geometry'),false);
  assert.ok(row.checks.length>0);
});

test('promoted 5SL6116 uses verified dimensions for new panel items while saved item dimensions remain stable',()=>{
  const p=Panel.defaults();
  const rail=Panel.addRail(p,40,150,450);
  const added=Panel.addItem(p,byId['mcb-1p'],100,150);
  assert.equal(added.ok,true);
  assert.equal(added.item.railId,rail.id);
  assert.equal(added.item.panelGeometryStatus,'ready');
  assert.equal(added.item.dimensionStatus,'verified');
  assert.equal(added.item.w,18);
  assert.equal(added.item.h,90);
  assert.equal(added.item.depth,76);

  const legacy=Panel.normalize({
    ...Panel.defaults(),
    rails:[{id:'r-old',x:40,y:150,length:450}],
    items:[{id:'old-mcb',typeId:'mcb-1p',ref:'QF1',mount:'rail',railId:'r-old',x:100,y:150,w:18,h:85,depth:70}]
  },byId);
  const old=legacy.items.find(x=>x.id==='old-mcb');
  assert.equal(old.w,18);
  assert.equal(old.h,85);
  assert.equal(old.depth,70);
});

test('promoted 3RT panel geometry uses verified real body dimensions for new panel layout',()=>{
  const p=Panel.defaults();
  const rail=Panel.addRail(p,40,150,450);
  const contact=Panel.addItem(p,byId['main-contact'],100,150);
  assert.equal(contact.ok,true);
  assert.equal(contact.item.railId,rail.id);
  assert.equal(contact.item.w,45);
  assert.equal(contact.item.h,58);
  assert.equal(contact.item.depth,73);
  assert.equal(contact.item.physicalWidthMm,45);
  assert.equal(contact.item.physicalHeightMm,58);
  assert.equal(contact.item.physicalDepthMm,73);
  assert.equal(contact.item.panelGeometryStatus,'ready');
  assert.equal(contact.item.dimensionStatus,'verified');
});


test('visual match and terminal geometry status stay explicit and conservative',()=>{
  assert.equal(Physical.get(byId['main-contact']).visualMatchStatus,'exact');
  assert.equal(Physical.get(byId['main-contact']).visualOrientationStatus,'source-image-derived-front');
  assert.equal(Physical.get(byId['coil-contactor']).visualOrientationStatus,'source-image-derived-front');
  assert.equal(Physical.get(byId['sinamics-v20-1p']).visualMatchStatus,'exact');
  assert.equal(Physical.get(byId['mcb-1p']).visualOrientationStatus,'orthographic-front');
  assert.equal(Physical.get(byId['disconnect-1p']).visualOrientationStatus,'orthographic-front');
  assert.equal(Physical.get(byId['thermal-magnetic']).visualOrientationStatus,'orthographic-front');
  assert.equal(Physical.get(byId['smps']).visualOrientationStatus,'source-image-derived-front');
  assert.equal(Physical.get(byId['photoeye']).visualOrientationStatus,'isometric-allowed');
  assert.equal(Physical.get(byId['fan-1p']).visualOrientationStatus,'source-image-derived-front');
  assert.equal(Physical.get(byId['sinamics-v20-1p']).visualOrientationStatus,'orthographic-front');
  for(const id of ['mcb-2p','mcb-3p'])assert.equal(Physical.get(byId[id]).visualOrientationStatus,'orthographic-front',id);
  for(const id of ['smps','fan-1p','photoeye'])assert.equal(Physical.get(byId[id]).visualMatchStatus,'exact',id);
  assert.equal(Physical.get(byId['sinamics-v20-1p']).visualMatchStatus,'exact');
  assert.equal(Physical.get(byId['sinamics-v20-1p']).terminalGeometryStatus,'verified');
  for(const id of ['mcb-1p','mcb-2p','mcb-3p']){
    assert.equal(Physical.get(byId[id]).terminalGeometryStatus,'verified',id);
    for(const pin of byId[id].pins)assert.ok(Physical.terminalAnchor(byId[id],pin.id),id+':'+pin.id);
  }
  assert.equal(Physical.get(byId['main-contact']).terminalGeometryStatus,'verified');
  assert.ok(Physical.terminalGeometryEvidence(byId['main-contact'],'1'));
  assert.ok(Physical.terminalGeometryEvidence(byId['main-contact'],'A2'));
  assert.ok(Physical.terminalAnchor(byId['main-contact'],'1'));
  assert.ok(Physical.terminalAnchor(byId['main-contact'],'A2'));
  assert.equal(Physical.get(byId['smps']).terminalGeometryStatus,'verified');
  for(const pin of byId['smps'].pins)assert.ok(Physical.terminalAnchor(byId['smps'],pin.id),'smps:'+pin.id);
  assert.equal(Physical.get(byId['fan-1p']).terminalGeometryStatus,'unverified');
  for(const pin of byId['fan-1p'].pins)assert.equal(Physical.terminalAnchor(byId['fan-1p'],pin.id),null,'fan-1p:'+pin.id);
  assert.equal(Physical.get(byId['photoeye']).terminalGeometryStatus,'connectorized-external');
  for(const pin of byId['photoeye'].pins)assert.equal(Physical.terminalAnchor(byId['photoeye'],pin.id),null,'photoeye:'+pin.id);
  for(const id of []){
    assert.equal(Physical.get(byId[id]).terminalGeometryStatus,'unverified',id);
    for(const pin of byId[id].pins)assert.equal(Physical.terminalAnchor(byId[id],pin.id),null,id+':'+pin.id);
  }
  const v20=byId['sinamics-v20-1p'];
  assert.equal(Physical.get(v20).terminalGeometryStatus,'verified');
  assert.ok(Physical.terminalGeometryEvidence(v20,'1'));
  assert.ok(Physical.terminalGeometryEvidence(v20,'PE2'));
  for(const pin of v20.pins)assert.ok(Physical.terminalAnchor(v20,pin.id),'v20-exact:'+pin.id);
  assert.equal(Physical.get(byId['disconnect-1p']).terminalGeometryStatus,'verified');
  for(const pin of byId['disconnect-1p'].pins)assert.ok(Physical.terminalAnchor(byId['disconnect-1p'],pin.id),'5tl:'+pin.id);
  assert.equal(Physical.get(byId['thermal-magnetic']).terminalGeometryStatus,'verified');
  for(const pin of byId['thermal-magnetic'].pins){if(['95','96'].includes(pin.id))assert.equal(Physical.terminalAnchor(byId['thermal-magnetic'],pin.id),null,'thermal-magnetic:'+pin.id);else assert.ok(Physical.terminalAnchor(byId['thermal-magnetic'],pin.id),'thermal-magnetic:'+pin.id);}
});

test('physical terminal anchors override schematic boundary only when panel geometry is ready',()=>{
  const original=Physical.terminalAnchor;
  try{
    Physical.terminalAnchor=(d,pinId)=>pinId==='X'?{pinId:'X',xMm:12,yMm:18,side:'left',status:'verified',sourceUrl:'https://example.invalid/terminal-drawing'}:null;
    const d={id:'synthetic',w:100,h:100,pins:[{id:'X',label:'X',x:0,y:50,side:'left'}]};
    const ready={id:'ready',x:100,y:200,w:50,h:80,depth:30,mount:'plate',panelGeometryStatus:'ready'};
    const verified=Wiring.ports(ready,d)[0];
    assert.equal(verified.x,112);
    assert.equal(verified.y,218);
    assert.equal(verified.geometryStatus,'verified');
    assert.match(verified.geometrySource,/^https:\/\//);

    const staged={...ready,id:'staged',panelGeometryStatus:'staged'};
    const fallback=Wiring.ports(staged,d)[0];
    assert.equal(fallback.x,100);
    assert.equal(fallback.y,240);
    assert.equal(fallback.geometryStatus,'approximate');
    assert.equal(fallback.geometrySource,null);
  }finally{Physical.terminalAnchor=original}
});

test('physical mapping identity field is explicit and restricted to known exact identity sources',()=>{
  const base={productKey:'siemens-5sl6116-7',assetKey:'siemens-mcb1-v113',assetIdentityField:'siemensPhoto',assetIdentityValue:'5SL6116-7',visualMatchStatus:'exact',visualOrientationStatus:'orthographic-front',terminalGeometryStatus:'unverified'};
  assert.deepEqual(Physical.validateMapping(base),{ok:true});
  assert.deepEqual(Physical.validateMapping({...base,assetIdentityField:'arbitraryField'}),{ok:false,reason:'assetIdentityField'});
  assert.deepEqual(Physical.validateMapping({...base,assetIdentityValue:''}),{ok:false,reason:'assetIdentityValue'});
});

test('verified terminal geometry evidence may come from a separate orthographic technical drawing while active anchors still require an orthographic asset',()=>{
  const mapping={productKey:'siemens-3rt2016-1bb41',assetKey:'x',visualMatchStatus:'exact',visualOrientationStatus:'front-perspective',terminalGeometryStatus:'verified',terminalSourceUrl:'https://example.invalid/drawing',terminalAnchors:{'1':{xMm:1,yMm:1,side:'top'}}};
  assert.deepEqual(Physical.validateMapping(mapping),{ok:true});
});

test('terminal geometry evidence may be verified independently from a family visual while promotion still requires exact visual',()=>{
  const mapping={productKey:'siemens-3rt2016-1bb41',assetKey:'x',visualMatchStatus:'family',visualOrientationStatus:'orthographic-front',terminalGeometryStatus:'verified',terminalSourceUrl:'https://example.invalid/drawing',terminalAnchors:{'1':{xMm:1,yMm:1,side:'top'}}};
  assert.deepEqual(Physical.validateMapping(mapping),{ok:true});
  assert.deepEqual(Physical.panelGeometryGate({sourceStatus:'verified'},mapping,{id:'synthetic',pins:[{id:'1'}]}),{ready:false,reasons:['exact-visual']});
});


test('separate terminal drawing evidence stays valid while panel promotion still rejects a non-orthographic product visual',()=>{
  const mapping={productKey:'siemens-3rt2016-1bb41',assetKey:'siemens-contactor',visualMatchStatus:'exact',visualOrientationStatus:'front-perspective',terminalGeometryStatus:'verified',terminalSourceUrl:'https://example.invalid/drawing',terminalAnchors:{'1':{xMm:1,yMm:1,side:'top'}}};
  assert.deepEqual(Physical.validateMapping(mapping),{ok:true});
  assert.deepEqual(
    Physical.panelGeometryGate({sourceStatus:'verified'},mapping,{id:'synthetic',pins:[{id:'1'}]}),
    {ready:false,reasons:['orthographic-front']}
  );
});


test('single physical contactor exposes coil and built-in auxiliary terminals without changing schematic pins',()=>{
  const d=byId['main-contact'];
  assert.deepEqual(Array.from(d.pins,p=>p.id),['1','3','5','2','4','6']);
  const pins=Physical.panelPins(d);
  assert.deepEqual(pins.map(p=>p.id),['1','3','5','13','A1','2','4','6','14','A2']);
  assert.equal(new Set(pins.map(p=>p.id)).size,10);
  assert.equal(pins.find(p=>p.id==='A1').sourceComponentId,'coil-contactor');
  assert.equal(pins.find(p=>p.id==='A2').sourcePinId,'A2');
  assert.equal(pins.find(p=>p.id==='13').terminalIdentityStatus,'verified');
  assert.match(pins.find(p=>p.id==='13').terminalIdentitySourceUrl,/^https:\/\/support\.industry\.siemens\.com\//);
  assert.deepEqual(pins.filter(p=>['1','3','5','2','4','6'].includes(p.id)).map(p=>[p.id,p.x,p.y]),[
    ['1',30,0],['3',60,0],['5',90,0],['2',30,106],['4',60,106],['6',90,106]
  ]);
  assert.ok(pins.every(p=>p.geometryStatus==='approximate'&&p.geometrySource===null));
});

test('panel wiring can use A1/A2 on the primary contactor while the logical coil stays panel-ineligible',()=>{
  const p=Panel.defaults();
  Panel.addRail(p,40,150,450);
  const contact=Panel.addItem(p,byId['main-contact'],130,150);
  assert.equal(contact.ok,true);
  const rejected=Panel.addItem(p,byId['coil-contactor'],230,150);
  assert.equal(rejected.ok,false);
  const supply=Panel.addItem(p,byId['supply-dc-plus'],20,80,'external');
  assert.equal(supply.ok,true);
  const ports=Wiring.ports(contact.item,byId['main-contact']);
  for(const id of ['A1','A2','13','14'])assert.ok(ports.some(x=>x.p===id),id);
  assert.ok(ports.every(x=>x.geometryStatus==='verified'&&/^https:\/\//.test(x.geometrySource)));
  const result=Wiring.connect(p,byId,{c:supply.item.id,p:'P'},{c:contact.item.id,p:'A1'},'#e53935','1,5 mm²');
  assert.equal(result.ok,true,result.reason);
  assert.equal(result.wire.to.p,'A1');
  assert.ok(Wiring.endpoint(p,byId,{c:contact.item.id,p:'A1'}));
});


test('WP-003 pixel audit records only inspected product orientations and keeps geometry evidence separate',()=>{
  const mcb=Physical.get(byId['mcb-1p']);
  const isolator=Physical.get(byId['disconnect-1p']);
  const motorProtection=Physical.get(byId['thermal-magnetic']);
  const smps=Physical.get(byId['smps']);
  const photoeye=Physical.get(byId['photoeye']);
  const fan=Physical.get(byId['fan-1p']);
  const v20=Physical.get(byId['sinamics-v20-1p']);
  assert.equal(mcb.visualMatchStatus,'exact');
  assert.equal(mcb.visualOrientationStatus,'orthographic-front');
  assert.equal(isolator.visualOrientationStatus,'orthographic-front');
  assert.equal(motorProtection.visualOrientationStatus,'orthographic-front');
  assert.equal(smps.visualOrientationStatus,'source-image-derived-front');
  assert.equal(photoeye.visualOrientationStatus,'isometric-allowed');
  assert.equal(fan.visualOrientationStatus,'source-image-derived-front');
  assert.equal(v20.visualOrientationStatus,'orthographic-front');
  assert.equal(smps.visualMatchStatus,'exact');
  assert.equal(photoeye.visualMatchStatus,'exact');
  assert.equal(fan.visualMatchStatus,'exact');
  assert.equal(v20.visualMatchStatus,'exact');
  assert.equal(mcb.terminalGeometryStatus,'verified');
  assert.equal(isolator.terminalGeometryStatus,'verified');
  assert.equal(motorProtection.terminalGeometryStatus,'verified');
  assert.equal(smps.terminalGeometryStatus,'verified');
  assert.equal(photoeye.terminalGeometryStatus,'connectorized-external');
  assert.equal(fan.terminalGeometryStatus,'unverified');
  assert.equal(v20.terminalGeometryStatus,'verified');
  for(const id of ['mcb-2p','mcb-3p']){
    const row=Physical.get(byId[id]);
    assert.equal(row.visualOrientationStatus,'orthographic-front',id);
    assert.equal(row.terminalGeometryStatus,'verified',id);
  }
});


test('proportion audit detects legacy saved-item scale mismatches without silently rewriting the project',()=>{
  const project=JSON.parse(fs.readFileSync(require.resolve('../Kaydedilen_Projeler/03_Egitim_Panosu.odsdevre'),'utf8'));
  const normalized=Panel.normalize(project.panel,byId);
  const audit=Panel.proportionAudit(normalized,byId);
  assert.equal(audit.ok,false);
  assert.ok(audit.mismatchCount>=4);
  const byType=Object.fromEntries(audit.mismatches.map(x=>[x.typeId,x]));
  assert.ok(byType['smps']);
  assert.ok(byType['main-contact']);
  assert.ok(byType['mcb-1p']);
  assert.ok(byType['mcb-3p']);
  assert.equal(byType['smps'].expectedMm.w,35);
  assert.equal(byType['smps'].actualMm.w,60);
  assert.equal(byType['main-contact'].expectedMm.h,58);
  assert.equal(byType['main-contact'].actualMm.h,85);
});

test('new verified-dimension items pass proportion audit even when visual or terminal geometry remains staged',()=>{
  const p=Panel.defaults();
  Panel.addRail(p,40,150,500);
  for(const [id,x] of [['main-contact',100],['smps',190],['thermal-magnetic',290],['disconnect-1p',360]]){
    const added=Panel.addItem(p,byId[id],x,150);
    assert.equal(added.ok,true,id);
  }
  const audit=Panel.proportionAudit(p,byId);
  assert.equal(audit.ok,true);
  assert.equal(audit.mismatchCount,0);
});


test('Siemens 5TL canonical front unlocks verified panel terminal anchors',()=>{
  const d=byId['disconnect-1p'],record=Physical.get(d);assert.ok(record);
  assert.deepEqual(Array.from(d.pins,p=>p.id),['1','2']);
  assert.equal(record.terminalIdentityStatus,'verified');
  assert.equal(record.terminalGeometryStatus,'verified');
  assert.equal(record.terminalGeometryMethod,'scaled-manufacturer-orthographic-drawing');
  assert.equal(record.terminalGeometryToleranceMm,2);
  const t1=Physical.terminalGeometryEvidence(d,'1'),t2=Physical.terminalGeometryEvidence(d,'2');
  assert.deepEqual({x:t1.xMm,y:t1.yMm,side:t1.side},{x:9,y:9,side:'top'});
  assert.deepEqual({x:t2.xMm,y:t2.yMm,side:t2.side},{x:9,y:80.8,side:'bottom'});
  assert.equal(record.visualOrientationStatus,'orthographic-front');
  assert.equal(record.panelGeometryReady,true);
  assert.deepEqual({x:Physical.terminalAnchor(d,'1').xMm,y:Physical.terminalAnchor(d,'1').yMm},{x:9,y:9});
  assert.deepEqual({x:Physical.terminalAnchor(d,'2').xMm,y:Physical.terminalAnchor(d,'2').yMm},{x:9,y:80.8});
});


test('control material proportion audit detects the real-scale distortions exposed by Malzeme test',()=>{
  const cases={
    'mcb-1p':{x:80/18,y:100/90},
    'mcb-2p':{x:100/36,y:100/90},
    'mcb-3p':{x:120/54,y:100/90},
    'disconnect-1p':{x:80/18,y:100/89.8},
    'thermal-magnetic':{x:140/45,y:120/97},
    'main-contact':{x:120/45,y:100/58},
    'sinamics-v20-1p':{x:260/90.8,y:380/160.9}
  };
  for(const [id,expected] of Object.entries(cases)){
    const row=Physical.materialScaleAudit(byId[id]);
    assert.equal(row.status,'distorted-aspect',id);
    assert.ok(Math.abs(row.unitsPerMm.x-expected.x)<1e-9,id+':x');
    assert.ok(Math.abs(row.unitsPerMm.y-expected.y)<1e-9,id+':y');
    assert.ok(row.aspectError>.05,id);
  }
});

test('control material scale coverage remains machine-readable and does not invent dimensions for unmapped devices',()=>{
  const rows=['mcb-1p','thermal-magnetic','sinamics-v20-1p','relay-1'].map(id=>byId[id]).filter(Boolean);
  const audit=Physical.materialScaleCoverage(rows);
  assert.equal(audit.library,rows.length);
  assert.ok(audit.verified>=3);
  assert.ok(audit.distorted>=3);
  const unmapped=byId['relay-1'];
  if(unmapped)assert.equal(Physical.materialScaleAudit(unmapped).status,'unverified-physical-dimensions');
});


test('verified material definitions use one canonical physical scene scale without mutating source definitions',()=>{
  assert.equal(Physical.MATERIAL_SCENE_UNITS_PER_MM,2);
  const cases=[
    ['main-contact',90,116],
    ['thermal-magnetic',90,194],
    ['smps',70,260],
    ['sinamics-v20-1p',181.6,321.8]
  ];
  for(const [id,w,h] of cases){
    const source=byId[id],before=JSON.stringify(source),normalized=Physical.materialDefinition(source);
    assert.notEqual(normalized,source,id);
    assert.equal(normalized.w,w,id+':w');
    assert.equal(normalized.h,h,id+':h');
    assert.equal(normalized._physicalMaterialNormalized,true,id);
    assert.equal(normalized._materialSceneUnitsPerMm,2,id);
    assert.equal(JSON.stringify(source),before,id+':source-mutated');
    assert.ok(Math.abs(normalized.w/normalized.h-Physical.get(source).widthMm/Physical.get(source).heightMm)<1e-12,id+':aspect');
  }
});

test('explicit workspace user scale lock wins over verified material-body normalization without changing panel metadata',()=>{
  for(const id of ['mcb-1p','disconnect-1p']){
    const source=byId[id],record=Physical.get(source);assert.ok(record,id);
    assert.equal(source.physicalScaleSource,'workspace-space-v1:user-locked',id);
    assert.deepEqual({...source.physicalDimensionsMm},{width:18,height:70,shape:'rect'},id);
    const normalized=Physical.materialDefinition(source);
    assert.equal(normalized.w,36,id+':w');
    assert.equal(normalized.h,140,id+':h');
    assert.equal(normalized._materialScaleSource,'workspace-space-v1:user-locked',id);
    assert.equal(record.heightMm,id==='mcb-1p'?90:89.8,id+':verified-product-height-stays-intact');
    const spec=Panel.spec(source);
    assert.equal(spec.physicalHeightMm,id==='mcb-1p'?90:89.8,id+':panel-metadata-stays-verified');
  }
});

test('material definition uses verified terminal geometry where available and proportional pins otherwise',()=>{
  const mcb=Physical.materialDefinition(byId['mcb-1p']);
  const p1=mcb.pins.find(p=>p.id==='1'),p2=mcb.pins.find(p=>p.id==='2');
  const e1=Physical.terminalGeometryEvidence(byId['mcb-1p'],'1'),e2=Physical.terminalGeometryEvidence(byId['mcb-1p'],'2');
  assert.deepEqual({x:p1.x,y:p1.y,side:p1.side},{x:e1.xMm*2,y:e1.yMm*2,side:e1.side});
  assert.deepEqual({x:p2.x,y:p2.y,side:p2.side},{x:e2.xMm*2,y:e2.yMm*2,side:e2.side});

  const smps=byId['smps'],normalized=Physical.materialDefinition(smps);
  assert.equal(Physical.get(smps).terminalGeometryStatus,'verified');
  for(const pin of normalized.pins){
    const e=Physical.terminalGeometryEvidence(smps,pin.id);
    assert.ok(e,'smps-evidence:'+pin.id);
    assert.deepEqual({x:pin.x,y:pin.y,side:pin.side},{x:e.xMm*2,y:e.yMm*2,side:e.side},'smps:'+pin.id);
  }
});

test('material normalization stays fail-closed for special or unverified definitions',()=>{
  const fake={id:'fake',w:100,h:100,pins:[],instrument:'test'};
  assert.equal(Physical.materialDefinition(fake),fake);
  const unmapped=byId['relay-1'];
  if(unmapped)assert.equal(Physical.materialDefinition(unmapped),unmapped);
});


test('normalized material layout audit reports legacy Malzeme test overlap without moving saved coordinates',()=>{
  const components=[
    {id:'s17',typeId:'mcb-1p',ref:'S17',x:600,y:230,rotation:0},
    {id:'s18',typeId:'mcb-3p',ref:'S18',x:560,y:470,rotation:0},
    {id:'s19',typeId:'mcb-2p',ref:'S19',x:660,y:470,rotation:0},
    {id:'s20',typeId:'disconnect-1p',ref:'S20',x:740,y:480,rotation:0},
    {id:'s21',typeId:'thermal-magnetic',ref:'S21',x:1360,y:480,rotation:0},
    {id:'s23',typeId:'sinamics-v20-1p',ref:'S23',x:1230,y:1030,rotation:0}
  ];
  const before=JSON.stringify(components);
  const audit=Physical.materialLayoutAudit(components,byId);
  assert.equal(audit.normalized,6);
  assert.equal(audit.ok,false);
  assert.equal(audit.overlapCount,1);
  assert.deepEqual(
    {aRef:audit.overlaps[0].aRef,bRef:audit.overlaps[0].bRef,width:audit.overlaps[0].overlapWidth,height:audit.overlaps[0].overlapHeight},
    {aRef:'S18',bRef:'S19',width:8,height:180}
  );
  assert.equal(JSON.stringify(components),before);
});

test('material layout audit stays fail-closed to verified-normalized devices only',()=>{
  const components=[
    {id:'known',typeId:'mcb-1p',ref:'S1',x:0,y:0,rotation:0},
    {id:'unknown',typeId:'relay-1',ref:'K1',x:0,y:0,rotation:0}
  ];
  const audit=Physical.materialLayoutAudit(components,byId);
  assert.equal(audit.normalized,1);
  assert.equal(audit.overlapCount,0);
  assert.equal(audit.rows[0].typeId,'mcb-1p');
});


test('exact PROtop and V20 DXF data verify every runtime terminal center',()=>{
  const smps=byId['smps'],v20=byId['sinamics-v20-1p'];
  const smpsRecord=Physical.get(smps),v20Record=Physical.get(v20);

  assert.equal(smpsRecord.terminalIdentityStatus,'verified');
  assert.equal(smpsRecord.terminalGeometryStatus,'verified');
  assert.match(smpsRecord.terminalIdentitySourceUrl,/datasheet\.weidmueller\.com/);
  for(const pin of smps.pins){
    const identity=Physical.terminalIdentity(smps,pin.id);
    assert.equal(identity.status,'verified','smps:'+pin.id);
    assert.ok(Physical.terminalGeometryEvidence(smps,pin.id),'smps:'+pin.id);
  }

  assert.equal(smpsRecord.terminalGeometryMethod,'exact-article-2d-dxf-mm-coordinate-extraction+nominal-frame-normalization');
  assert.equal(smpsRecord.terminalGeometryToleranceMm,.5);
  const smpsExpected={P:[5.7,3.8,'top'],M:[16,3.8,'top'],L:[12,124.8,'bottom'],N:[17.2,124.8,'bottom']};
  for(const pin of smps.pins){
    const e=Physical.terminalGeometryEvidence(smps,pin.id);
    assert.deepEqual([e.xMm,e.yMm,e.side],smpsExpected[pin.id],'smps-anchor:'+pin.id);
    assert.ok(Physical.terminalAnchor(smps,pin.id),'smps-anchor-active:'+pin.id);
  }

  assert.equal(v20Record.terminalIdentityStatus,'verified');
  assert.equal(v20Record.terminalGeometryStatus,'verified');
  assert.equal(v20Record.terminalGeometryMethod,'exact-article-2d-dxf-mm-coordinate-extraction');
  assert.equal(v20Record.terminalGeometryToleranceMm,.5);
  assert.match(v20Record.terminalIdentitySourceUrl,/siemens\.com|industry\.siemens\.com/);
  assert.match(v20Record.terminalSourceUrl,/mall\.industry\.siemens\.com/);
  const expected={
    PE:[18.1,4.8,'top'],L1:[36,11.3,'top'],N:[45.5,11.3,'top'],
    '13':[35.4,110.2,'bottom'],'13b':[38.9,110.2,'bottom'],'14':[42.4,110.2,'bottom'],'14b':[45.9,110.2,'bottom'],'12':[49.4,110.2,'bottom'],'15':[52.9,110.2,'bottom'],'16':[56.4,110.2,'bottom'],
    '1':[20.7,122.2,'bottom'],'2':[24.2,122.2,'bottom'],'3':[27.7,122.2,'bottom'],'4':[31.2,122.2,'bottom'],'5':[34.7,122.2,'bottom'],'6':[38.2,122.2,'bottom'],'7':[41.7,122.2,'bottom'],'8':[45.2,122.2,'bottom'],'9':[48.7,122.2,'bottom'],'10':[52.2,122.2,'bottom'],'11':[55.7,122.2,'bottom'],
    '17':[64.7,123.1,'bottom'],'18':[68.2,123.1,'bottom'],'19':[71.7,123.1,'bottom'],
    U:[21.5,148,'bottom'],V:[29.7,148,'bottom'],W:[37.9,148,'bottom'],'DC-':[46.1,148,'bottom'],'DC+':[54.3,148,'bottom'],PE2:[71.1,154.3,'bottom']
  };
  for(const pin of v20.pins){
    const identity=Physical.terminalIdentity(v20,pin.id),e=Physical.terminalGeometryEvidence(v20,pin.id);
    assert.equal(identity.status,'verified','v20:'+pin.id);
    assert.ok(e,'v20-evidence:'+pin.id);
    assert.deepEqual([e.xMm,e.yMm,e.side],expected[pin.id],'v20:'+pin.id);
    assert.ok(Physical.terminalAnchor(v20,pin.id),'exact visual activates verified anchor:'+pin.id);
  }
  const map=Physical.componentMap['sinamics-v20-1p'];
  assert.equal(map.terminalCadFrameWidthMm,90.8);
  assert.equal(map.terminalCadFrameHeightMm,160.9);
  assert.equal(map.terminalCadSourceSha256,'323f43f81033c746e1b19740387cd3518e0c77478eecb422e2fbbc2324f91bfd');
  assert.deepEqual(map.terminalPhysicalRows.inputPower,['PE','L1','N']);
  assert.deepEqual(map.terminalPhysicalRows.upperControl,['13','13b','14','14b','12','15','16']);
  assert.deepEqual(map.terminalPhysicalRows.lowerControl,['1','2','3','4','5','6','7','8','9','10','11']);
  assert.deepEqual(map.terminalPhysicalRows.relay,['17','18','19']);
  assert.deepEqual(map.terminalPhysicalRows.outputPower,['U','V','W','DC-','DC+','PE2']);
  assert.equal(map.terminalVisualOrderStatus,'verified');
  assert.equal(map.visualCalibration.physicalFrameWidthMm,90.8);
  assert.equal(map.visualCalibration.physicalFrameHeightMm,160.9);
  assert.equal(map.visualCalibration.renderPixelWidth,280);
  assert.equal(map.visualCalibration.renderPixelHeight,496);
  assert.equal(map.visualCalibration.sourceSha256,'a9a7b7d93f82dd7e81be67d807df718f484aa0b881beb0b562f3838a1b38a9d2');
  assert.equal(map.visualCalibration.repoSha256,'c8db14a110d3df76375289d3bfb30c0b25f1eab71ea9839ab9ff72dd0ef29667');
});


test('exact V20 visual activates exact DXF terminal centers in normalized material coordinates',()=>{
  const source=byId['sinamics-v20-1p'],normalized=Physical.materialDefinition(source),units=Physical.MATERIAL_SCENE_UNITS_PER_MM;
  assert.equal(Physical.get(source).terminalGeometryStatus,'verified');
  assert.equal(Physical.get(source).visualMatchStatus,'exact');
  for(const pin of normalized.pins){
    const e=Physical.terminalGeometryEvidence(source,pin.id);
    assert.ok(e,'evidence:'+pin.id);
    assert.ok(Math.abs(pin.x-e.xMm*units)<1e-9,'v20:x:'+pin.id);
    assert.ok(Math.abs(pin.y-e.yMm*units)<1e-9,'v20:y:'+pin.id);
    assert.equal(pin.side,e.side,'v20:side:'+pin.id);
  }
});


test('3RV exact Siemens DXF verifies front+left profile bounds but keeps collider conservative without top-view X/Z polygon',()=>{
  const d=byId['thermal-magnetic'],record=Physical.get(d),spec=Physical.panelSpec(d);
  assert.equal(record.profileStatus,'verified');
  assert.equal(record.profileMethod,'exact-article-dxf-front+left-dimensional-profile');
  assert.deepEqual(record.profileBoundsMm,{width:45,height:97,depth:96.9});
  assert.equal(record.profileEvidenceFiles.length,1);
  assert.equal(record.profileEvidenceFiles[0].file,'G_NSA0_XX_93051V.dxf');
  assert.equal(record.profileEvidenceFiles[0].sha256,'1a498a463cf58d2406ef86cbe1f3b2dc6f0301312344c35498336f57db8178b3');
  assert.equal(record.profileEvidence.frontLayer,'10000_FRONT');
  assert.equal(record.profileEvidence.leftLayer,'11000_LEFT');
  assert.deepEqual(record.profileEvidence.frontRawBoundsMm,{width:45,height:97});
  assert.deepEqual(record.profileEvidence.leftRawBoundsMm,{depth:96.9,height:97});
  assert.equal(record.colliderStatus,'conservative-envelope');
  assert.match(record.colliderDecision,/no exact top-view X\/Z collision polygon|conservative-envelope/i);
  assert.equal(spec.profileStatus,'verified');
  assert.equal(spec.colliderStatus,'conservative-envelope');
});

test('V20 exact CAD verifies profile evidence while collider stays conservative until runtime consumes CAD geometry',()=>{
  const d=byId['sinamics-v20-1p'];
  const record=Physical.get(d);
  const spec=Physical.panelSpec(d);
  assert.equal(record.profileStatus,'verified');
  assert.equal(record.profileMethod,'exact-article-dxf-multiview+embedded-u3d');
  assert.match(record.profileSourceUrl,/6SL3210-5BB21-5UV1/);
  assert.deepEqual(record.profileBoundsMm,{width:90.8,height:160.9,depth:147});
  assert.equal(record.profileEvidenceFiles.length,2);
  assert.deepEqual(record.profileEvidenceFiles.map(x=>x.file),[
    '6SL3210-5BB21-5UV1_2D_dimension_withFrame_en.DXF',
    '6SL3210-5BB21-5UV1_3D_en.pdf'
  ]);
  assert.equal(record.profileEvidenceFiles[0].sha256,'323f43f81033c746e1b19740387cd3518e0c77478eecb422e2fbbc2324f91bfd');
  assert.equal(record.profileEvidenceFiles[1].sha256,'edefd2605c6e4e8367e834922f3ab0bee7abbcc48f1e7f3b38462d11640bc778');
  assert.equal(record.profileEvidence.dxfFrontLayer,'10000_FRONT');
  assert.equal(record.profileEvidence.dxfRightLayer,'12000_RIGHT');
  assert.equal(record.profileEvidence.dxfBackLayer,'15000_BACK');
  assert.deepEqual(record.profileEvidence.frontDimensionMm,{width:90.8,height:160.9});
  assert.equal(record.profileEvidence.rightDepthDimensionMm,147);
  assert.equal(record.profileEvidence.embedded3dSubtype,'U3D');
  assert.equal(record.profileEvidence.embedded3dDecodedBytes,917548);
  assert.equal(record.profileEvidence.embedded3dStreamSha256,'d3915b3bbe9f4bc48724cf66f8770afbb16b1a555c6c6047431b1c5808d9a60c');
  assert.deepEqual(record.profileEvidence.embedded3dViews,['Top','Front','Right','Bottom','Back','Left','Isometric']);
  assert.equal(record.colliderStatus,'conservative-envelope');
  assert.match(record.colliderDecision,/rectangular W\/H\/depth envelope|do not claim verified-profile/i);

  assert.equal(spec.profileStatus,'verified');
  assert.equal(spec.profileMethod,'exact-article-dxf-multiview+embedded-u3d');
  assert.deepEqual(spec.profileBoundsMm,{width:90.8,height:160.9,depth:147});
  assert.equal(spec.colliderStatus,'conservative-envelope');
  assert.equal(spec.panelGeometryStatus,'ready');
  assert.deepEqual(spec.panelGeometryBlockers,[]);
});

test('V20 runtime body now uses the exact CAD front frame dimensions while collider stays conservative',()=>{
  const d=byId['sinamics-v20-1p'],spec=Panel.spec(d);
  assert.equal(spec.w,90.8);
  assert.equal(spec.h,160.9);
  assert.equal(spec.depth,147);
  assert.deepEqual(spec.profileBoundsMm,{width:90.8,height:160.9,depth:147});
  assert.equal(spec.colliderStatus,'conservative-envelope');
});

test('V20 selected front asset fills the exact physical frame without generic material inset',()=>{
  const src=fs.readFileSync(require.resolve('../dist/materials.js'),'utf8');
  assert.match(src,/atlasWidth:280,atlasHeight:496/);
  assert.match(src,/viewBox:'0 0 280 496'/);
  assert.match(src,/physicalFrameMm:\{width:90\.8,height:160\.9\}/);
  assert.match(src,/inset=assets\[id\]\?\.physicalFrameMm\?0:8/);
  assert.match(src,/c8db14a110d3df76375289d3bfb30c0b25f1eab71ea9839ab9ff72dd0ef29667/);
});

test('Selection 2 photo-backed devices opt into wire-over-body layering without changing promotion state',()=>{
  const cases=[
    ['main-contact','siemens-3rt2016-1bb41',true],
    ['thermal-magnetic','siemens-3rv2011-1ja10',true],
    ['disconnect-1p','siemens-5tl1163-0',true],
    ['smps','weidmuller-2466870000',true],
    ['fan-1p','rittal-3241100',true],
    ['photoeye','sick-wtb4-3p2161',true],
    ['sinamics-v20-1p','siemens-6sl3210-5bb21-5uv1',true]
  ];
  for(const [componentId,productKey,promoted] of cases){
    const mapping=Physical.componentMap[componentId];
    assert.ok(mapping,componentId);
    assert.equal(mapping.wireOverBody,true,componentId);
    const record=Physical.get({...require('../dist/components.js').byId?.[componentId],id:componentId,materialAsset:mapping.assetKey,siemensPhoto:mapping.assetIdentityValue});
    // get() may require the actual library object's identity fields; mapping contract itself remains authoritative here.
    assert.equal(Physical.products[productKey].panelGeometryReady,promoted,productKey);
  }
});

test('5TL canonical user front calibration is exact and distortion-free',()=>{
  const d=byId['disconnect-1p'],r=Physical.get(d);
  assert.equal(r.visualOrientationStatus,'orthographic-front');
  assert.equal(r.panelGeometryReady,true);
  assert.equal(r.visualSourceStatus,'user-supplied-canonical');
  assert.equal(r.visualSourceFile,'siemens-5tl1163-0-user-front.webp');
  assert.equal(r.visualSourceSha256,'a3a183eb6bf319d549536bcaac5f6a038d9a61ab843bfd168de4da8ef9e23f04');
  assert.deepEqual(r.visualCalibration,{sourcePixelWidth:180,sourcePixelHeight:898,renderPixelWidth:180,renderPixelHeight:898,physicalFrameWidthMm:18,physicalFrameHeightMm:89.8,unitsPerMm:10});
  const normalized=Physical.materialDefinition(d);
  assert.equal(normalized.w,36);
  assert.equal(normalized.h,179.6);
  assert.ok(Math.abs(normalized.w/normalized.h-18/89.8)<1e-12);
});

test('sensor visual policy and connectorized external geometry keep SICK panel-ready without fabricated anchors',()=>{
  const d=byId['photoeye'],r=Physical.get(d);
  assert.equal(r.visualMatchStatus,'exact');
  assert.equal(r.visualOrientationStatus,'isometric-allowed');
  assert.equal(r.visualPolicyId,'sensor-visual-flex-v1');
  assert.equal(r.visualSourceStatus,'verified-manifest-provenance');
  assert.equal(r.visualSourceFile,'sick-wtb4.jpg');
  assert.match(r.visualSourcePage,/rs-online/);
  assert.equal(r.terminalGeometryStatus,'connectorized-external');
  const gate=Physical.panelGeometryGate(Physical.products['sick-wtb4-3p2161'],Physical.componentMap.photoeye,d);
  assert.equal(gate.ready,true);
  assert.equal(gate.reasons.includes('orthographic-front'),false);
  assert.equal(gate.reasons.includes('verified-terminal-geometry'),false);
});

test('SICK connectorized external sensor is panel-ready without fabricated per-pin anchors',()=>{
  const d=byId['photoeye'],r=Physical.get(d),m=Physical.componentMap.photoeye;
  assert.ok(r);
  assert.equal(r.visualOrientationStatus,'isometric-allowed');
  assert.equal(r.connectorIdentityStatus,'verified');
  assert.equal(r.connectorType,'M8-3-pin');
  assert.deepEqual(r.connectorPinAssignment,{BN:1,BU:3,BK:4});
  assert.equal(r.connectorLocationStatus,'verified-drawing-callout');
  assert.equal(r.terminalGeometryStatus,'connectorized-external');
  assert.equal(r.panelGeometryReady,true);
  const gate=Physical.panelGeometryGate(Physical.products['sick-wtb4-3p2161'],m,d);
  assert.equal(gate.ready,true);
  assert.deepEqual(gate.reasons,[]);
  for(const pin of d.pins)assert.equal(Physical.terminalAnchor(d,pin.id),null,pin.id);
});

test('3RT exact repo source is accepted as derived-front without terminal inference',()=>{
  const d=byId['main-contact'],r=Physical.get(d),m=Physical.componentMap['main-contact'];
  assert.ok(r);
  assert.equal(r.visualOrientationStatus,'source-image-derived-front');
  assert.equal(r.visualPolicyId,'panel-visual-derived-front-v1');
  assert.equal(r.visualSourceStatus,'derived-from-exact-repo-source');
  assert.equal(r.visualSourceFile,'siemens-3rt2016-1bb41-bare.jpg');
  assert.deepEqual(r.visualDerivation,{method:'front-face-crop',sourceViewBox:'358 328 536 762',runtimeViewBox:'358 394 536 691',physicalFrameWidthMm:45,physicalFrameHeightMm:58});
  assert.equal(r.panelGeometryReady,true);
  const gate=Physical.panelGeometryGate(Physical.products['siemens-3rt2016-1bb41'],m,d);
  assert.deepEqual(gate,{ready:true,reasons:[]});
  for(const id of ['1','3','5','13','A1','2','4','6','14','A2'])assert.ok(Physical.terminalGeometryEvidence(d,id),id);
});

test('Rittal derived front keeps panel geometry ready but terminals fail-closed',()=>{
  const d=byId['fan-1p'],r=Physical.get(d);
  assert.equal(r.visualOrientationStatus,'source-image-derived-front');
  assert.equal(r.visualPolicyId,'panel-visual-derived-front-v1');
  assert.equal(r.visualSourceStatus,'derived-from-exact-repo-source');
  assert.equal(r.visualSourceFile,'rittal-3241100-derived-front.svg');
  assert.equal(r.panelGeometryReady,true);
  assert.equal(r.terminalGeometryStatus,'unverified');
  for(const pin of d.pins)assert.equal(Physical.terminalAnchor(d,pin.id),null,pin.id);
  const spec=Panel.spec(d);
  assert.equal(spec.physicalWidthMm,255);
  assert.equal(spec.physicalHeightMm,255);
  assert.equal(spec.panelGeometryStatus,'ready');
});

test('PROtop derived front, exact DXF terminals and CAD collider profile are jointly verified',()=>{
  const d=byId['smps'],r=Physical.get(d);
  assert.equal(r.visualOrientationStatus,'source-image-derived-front');
  assert.equal(r.visualPolicyId,'panel-visual-derived-front-v1');
  assert.equal(r.visualSourceStatus,'derived-from-exact-repo-source');
  assert.equal(r.visualSourceFile,'weidmuller-pro-top-2466870000-derived-front.svg');
  assert.equal(r.terminalGeometryStatus,'verified');
  assert.equal(r.panelGeometryReady,true);
  assert.equal(r.profileStatus,'verified');
  assert.equal(r.profileMethod,'exact-article-top-dxf-main-body-silhouette+nominal-frame-normalization');
  assert.deepEqual(r.profileBoundsMm,{width:35,height:130,depth:125});
  assert.equal(r.colliderStatus,'verified-profile');
  assert.equal(r.colliderMethod,'exact-cad-top-view-convex-profile');
  assert.deepEqual(r.colliderProfileXZMm,[{x:0,z:0},{x:35,z:0},{x:35,z:125},{x:0,z:125}]);
  assert.equal(r.profileEvidenceFiles[0].sha256,'e248de04fa18ab287e5bc3b1fb5ebd07e5e6de768af32ab30dff46aeae8f2f48');
  assert.equal(r.profileEvidenceFiles[1].sha256,'183feb0ba2dcc7e3adb3435035c586ebbc62e33c38dfcdc1e66f6c30baaa9a54');
  for(const pin of d.pins)assert.ok(Physical.terminalAnchor(d,pin.id),pin.id);
  const spec=Panel.spec(d);
  assert.equal(spec.panelGeometryStatus,'ready');
  assert.equal(spec.colliderStatus,'verified-profile');
  assert.deepEqual(spec.colliderProfileXZMm,r.colliderProfileXZMm);
});
