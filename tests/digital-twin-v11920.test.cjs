const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const DigitalTwin=require('../dist/digital-twin.js');
const Symbols=require('../dist/symbols.js');
const Catalog=require('../dist/catalog.js');
const Design=require('../dist/design-library.js');

const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const library=Catalog.prepare(Symbols.prepareLibrary(Design.extend(ctx.window.COMPONENT_LIBRARY)));
const byId=Object.fromEntries(library.map(d=>[d.id,d]));

test('WP-021 unified digital twin separates source-photo audit from active derived-front runtime truth',()=>{
  const component=byId['main-contact'];
  const before=JSON.stringify(component);
  const row=DigitalTwin.record(component);
  assert.deepEqual(DigitalTwin.validate(row),{ok:true});
  assert.equal(row.componentId,'main-contact');
  assert.equal(row.productKey,'siemens-3rt2016-1bb41');
  assert.equal(row.manufacturer,'Siemens');
  assert.equal(row.physical.sourceStatus,'verified');
  assert.equal(row.physical.sourceAuthority,'manufacturer');
  assert.equal(row.physical.profileStatus,'unverified');
  assert.equal(row.physical.colliderStatus,'conservative-envelope');
  assert.equal(row.visual.matchQuality,'exact');
  assert.equal(row.visual.orientationStatus,'source-image-derived-front');
  assert.equal(row.visual.policyId,'panel-visual-derived-front-v1');
  assert.equal(row.visual.sourceOrientationStatus,'front-perspective');
  assert.equal(row.visual.promotionReady,true);
  assert.deepEqual(row.visual.promotionBlockers,[]);
  assert.equal(row.terminals.geometryStatus,'verified');
  assert.equal(row.terminals.geometryMethod,'scaled-manufacturer-orthographic-drawing');
  assert.equal(row.terminals.activeAnchorVisualEligible,true);
  assert.equal(row.simulation.status,'component-runtime-mapped');
  assert.equal(typeof row.simulation.componentKind,'string');
  assert.equal(row.panel.geometryGateReady,true);
  assert.deepEqual(row.panel.geometryBlockers,[]);
  assert.equal(row.quality.physicalSourceVerified,true);
  assert.equal(row.quality.terminalGeometryVerified,true);
  assert.equal(row.quality.panelGateReady,true);
  assert.deepEqual(row.quality.blockers,[]);
  assert.equal(JSON.stringify(component),before);
});

test('Selection2 5SL6116 becomes the first fully promoted sourced orthographic panel twin',()=>{
  const row=DigitalTwin.record(byId['mcb-1p']);
  assert.deepEqual(DigitalTwin.validate(row),{ok:true});
  assert.equal(row.visual.matchQuality,'exact');
  assert.equal(row.visual.orientationStatus,'orthographic-front');
  assert.equal(row.visual.sourceAuthority,'manufacturer');
  assert.equal(row.visual.provenanceStatus,'recorded');
  assert.equal(row.visual.promotionReady,true);
  assert.deepEqual(row.visual.promotionBlockers,[]);
  assert.equal(row.terminals.geometryStatus,'verified');
  assert.equal(row.terminals.activeAnchorVisualEligible,true);
  assert.equal(row.panel.geometryGateReady,true);
  assert.equal(row.panel.promoted,true);
  assert.equal(row.panel.geometryStatus,'ready');
  assert.deepEqual(row.panel.geometryBlockers,[]);
  assert.equal(row.quality.visualPromotionReady,true);
  assert.equal(row.quality.terminalGeometryVerified,true);
  assert.equal(row.quality.panelGateReady,true);
  assert.deepEqual(row.quality.blockers,[]);
});

test('WP-021 registry and audit expose one current truth for mapped product evidence',()=>{
  const registry=DigitalTwin.registry(library);
  const audit=DigitalTwin.audit(library);
  assert.equal(Object.keys(registry).length,11);
  assert.equal(audit.mapped,11);
  assert.equal(audit.verifiedPhysical,11);
  assert.equal(audit.exactVisual,11);
  assert.equal(audit.orthographicVisual,6);
  assert.equal(audit.visualPromotionReady,11);
  assert.equal(audit.verifiedTerminalGeometry,8);
  assert.equal(audit.verifiedProfiles,3);
  assert.equal(audit.verifiedProfileColliders,1);
  assert.equal(audit.activeAnchorVisualEligible,8);
  assert.equal(audit.panelGateReady,10);
  assert.equal(audit.panelPromoted,10);
  assert.equal(audit.panelReady,10);
  for(const id of ['main-contact','mcb-1p','mcb-2p','mcb-3p','thermal-magnetic','disconnect-1p','smps','fan-1p','photoeye','sinamics-v20-1p'])assert.deepEqual(audit.blockers[id],{visual:[],panel:[]},id);
  for(const row of Object.values(registry))assert.deepEqual(DigitalTwin.validate(row),{ok:true},row.componentId);
});

test('browser loads the unified digital twin after source contracts and before panel runtime',()=>{
  const html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8');
  const physical=html.indexOf('physical-metadata.js');
  const quality=html.indexOf('asset-quality.js');
  const twin=html.indexOf('digital-twin.js');
  const panel=html.indexOf('panel.js?');
  assert.ok(physical>=0&&quality>physical&&twin>quality&&panel>twin);
});


test('3RV digital twin carries exact DXF profile evidence while collision remains conservative-envelope',()=>{
  const row=DigitalTwin.record(byId['thermal-magnetic']);
  assert.deepEqual(DigitalTwin.validate(row),{ok:true});
  assert.equal(row.physical.profileStatus,'verified');
  assert.equal(row.physical.profileMethod,'exact-article-dxf-front+left-dimensional-profile');
  assert.deepEqual(row.physical.profileBoundsMm,{width:45,height:97,depth:96.9});
  assert.equal(row.physical.profileEvidenceFiles[0].sha256,'1a498a463cf58d2406ef86cbe1f3b2dc6f0301312344c35498336f57db8178b3');
  assert.equal(row.physical.colliderStatus,'conservative-envelope');
  assert.equal(row.panel.geometryStatus,'ready');
  assert.equal(row.panel.geometryGateReady,true);
});

test('V20 digital twin is fully panel-promoted from exact front + exact CAD while collider confidence stays conservative',()=>{
  const row=DigitalTwin.record(byId['sinamics-v20-1p']);
  assert.deepEqual(DigitalTwin.validate(row),{ok:true});
  assert.equal(row.productKey,'siemens-6sl3210-5bb21-5uv1');
  assert.equal(row.physical.profileStatus,'verified');
  assert.equal(row.physical.profileMethod,'exact-article-dxf-multiview+embedded-u3d');
  assert.match(row.physical.profileSourceUrl,/6SL3210-5BB21-5UV1/);
  assert.deepEqual(row.physical.profileBoundsMm,{width:90.8,height:160.9,depth:147});
  assert.equal(row.physical.profileEvidenceFiles.length,2);
  assert.equal(row.physical.profileEvidenceFiles[0].sha256,'323f43f81033c746e1b19740387cd3518e0c77478eecb422e2fbbc2324f91bfd');
  assert.equal(row.physical.profileEvidenceFiles[1].sha256,'edefd2605c6e4e8367e834922f3ab0bee7abbcc48f1e7f3b38462d11640bc778');
  assert.equal(row.physical.profileEvidence.embedded3dSubtype,'U3D');
  assert.equal(row.physical.profileEvidence.embedded3dStreamSha256,'d3915b3bbe9f4bc48724cf66f8770afbb16b1a555c6c6047431b1c5808d9a60c');
  assert.equal(row.physical.colliderStatus,'conservative-envelope');
  assert.match(row.physical.colliderDecision,/rectangular W\/H\/depth envelope|do not claim verified-profile/i);
  assert.equal(row.visual.file,'assets/products/sinamics-v20-6sl3210-5bb21-5uv1-user-front-v2.webp');
  assert.equal(row.visual.matchQuality,'exact');
  assert.equal(row.visual.orientationStatus,'orthographic-front');
  assert.equal(row.visual.sourceAuthority,'other');
  assert.equal(row.visual.provenanceStatus,'recorded');
  assert.equal(row.visual.promotionReady,true);
  assert.deepEqual(row.visual.promotionBlockers,[]);
  assert.equal(row.terminals.geometryStatus,'verified');
  assert.equal(row.terminals.activeAnchorVisualEligible,true);
  assert.equal(row.panel.geometryStatus,'ready');
  assert.equal(row.panel.geometryGateReady,true);
  assert.equal(row.panel.promoted,true);
  assert.deepEqual(row.panel.geometryBlockers,[]);
  assert.equal(row.quality.visualPromotionReady,true);
  assert.equal(row.quality.panelGateReady,true);
  assert.deepEqual(row.quality.blockers,[]);
});

test('PROtop digital twin exposes the exact DXF collider profile consumed by panel runtime',()=>{
  const row=DigitalTwin.record(byId['smps']);
  assert.deepEqual(DigitalTwin.validate(row),{ok:true});
  assert.equal(row.productKey,'weidmuller-2466870000');
  assert.equal(row.physical.profileStatus,'verified');
  assert.equal(row.physical.colliderStatus,'verified-profile');
  assert.equal(row.physical.colliderMethod,'exact-cad-top-view-convex-profile');
  assert.deepEqual(row.physical.colliderProfileXZMm,[{x:0,z:0},{x:35,z:0},{x:35,z:125},{x:0,z:125}]);
  assert.equal(row.visual.orientationStatus,'source-image-derived-front');
  assert.equal(row.visual.sourceOrientationStatus,'perspective');
  assert.equal(row.visual.policyId,'panel-visual-derived-front-v1');
  assert.equal(row.visual.promotionReady,true);
  assert.equal(row.terminals.geometryStatus,'verified');
  assert.equal(row.terminals.activeAnchorVisualEligible,true);
  assert.equal(row.panel.geometryStatus,'ready');
  assert.equal(row.panel.geometryGateReady,true);
  assert.equal(row.panel.promoted,true);
  assert.deepEqual(row.quality.blockers,[]);
});

test('digital twin profile validator stays fail-closed against unsupported collider promotion',()=>{
  const row=DigitalTwin.record(byId['sinamics-v20-1p']);
  const badProfile={...row,physical:{...row.physical,profileStatus:'maybe'}};
  assert.deepEqual(DigitalTwin.validate(badProfile),{ok:false,reason:'profileStatus'});
  const badCollider={...row,physical:{...row.physical,profileStatus:'unverified',colliderStatus:'verified-profile'}};
  assert.deepEqual(DigitalTwin.validate(badCollider),{ok:false,reason:'colliderProfileDependency'});
  const missingColliderGeometry={...row,physical:{...row.physical,colliderStatus:'verified-profile',colliderMethod:'x',colliderProfileXZMm:null}};
  assert.deepEqual(DigitalTwin.validate(missingColliderGeometry),{ok:false,reason:'colliderProfile'});
});


test('connectorized external sensor terminal geometry is valid Digital Twin truth without invented body anchors',()=>{
  const row=DigitalTwin.record(byId['photoeye']);
  assert.deepEqual(DigitalTwin.validate(row),{ok:true});
  assert.equal(row.productKey,'sick-wtb4-3p2161');
  assert.equal(row.visual.policyId,'sensor-visual-flex-v1');
  assert.equal(row.visual.promotionReady,true);
  assert.equal(row.terminals.geometryStatus,'connectorized-external');
  assert.equal(row.terminals.activeAnchorVisualEligible,false);
  assert.equal(row.panel.geometryStatus,'ready');
  assert.equal(row.panel.geometryGateReady,true);
  assert.equal(row.panel.promoted,true);
  assert.equal(row.quality.terminalGeometryVerified,false);
  assert.equal(row.quality.panelGateReady,true);
  assert.deepEqual(row.quality.blockers,[]);
});
