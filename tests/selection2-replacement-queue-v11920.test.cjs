const test=require('node:test');
const assert=require('node:assert/strict');
const Queue=require('../docs/SELECTION2_PRODUCT_REPLACEMENT_QUEUE_V1.19.20.json');
const Physical=require('../dist/physical-metadata.js');
const Quality=require('../dist/asset-quality.js');

test('Selection2 replacement queue matches physical promotion state',()=>{
  assert.equal(Queue.schemaVersion,1);
  const promoted=[],blocked=[];
  for(const productKey of Queue.order){
    const row=Queue.products[productKey],product=Physical.products[productKey];
    assert.ok(product,productKey);
    if(row.status==='promoted'){
      promoted.push(productKey);
      assert.equal(product.panelGeometryReady,true,productKey);
      assert.equal(row.geometry.panelGeometryReady,true,productKey);
      assert.deepEqual(row.blockers,[],productKey);
    }else blocked.push(productKey);
  }
  assert.deepEqual(promoted,Queue.order);
  assert.deepEqual(blocked,[]);
  assert.equal(Queue.section2Closure.status,'closed-complete');
});

test('Selection2 promoted visuals pass their accepted runtime visual policy gates',()=>{
  const ids=['mcb-1p','mcb-2p','mcb-3p','main-contact','thermal-magnetic','disconnect-1p','smps','fan-1p','photoeye','sinamics-v20-1p'];
  for(const id of ids){
    const m=Physical.componentMap[id],p=Physical.products[m.productKey];
    assert.equal(m.visualMatchStatus,'exact',id);
    const gate=Physical.panelGeometryGate(p,m,{id,pins:[]});
    assert.equal(gate.reasons.includes('exact-visual'),false,id);
    assert.equal(gate.reasons.includes('orthographic-front'),false,id);
  }
  const v20=Quality.promotionVisual('sinamics-v20-book',{},'mapped-sidecar');
  assert.equal(v20.ready,true);
  assert.equal(v20.descriptor.sourceAuthority,'other');
  assert.equal(v20.descriptor.provenanceStatus,'recorded');
});

test('Selection2 blocked products cannot silently satisfy panel geometry promotion',()=>{
  for(const [productKey,row] of Object.entries(Queue.products)){
    if(row.status==='promoted')continue;
    const product=Physical.products[productKey];
    assert.equal(product.panelGeometryReady,false,productKey);
    const mapping=Object.values(Physical.componentMap).find(m=>m.productKey===productKey&&m.panelEligible!==false);
    assert.ok(mapping,productKey);
    const component={id:Object.entries(Physical.componentMap).find(([,m])=>m===mapping)?.[0],pins:[{id:'probe'}]};
    const gate=Physical.panelGeometryGate(product,mapping,component);
    assert.equal(product.panelGeometryReady===true&&gate.ready,false,productKey);
  }
});


test('Selection2 candidate discovery remains historical evidence after accepted binaries close the queue',()=>{
  for(const key of Queue.order){
    const p=Queue.products[key];
    assert.equal(p.status,'promoted',key);
    assert.equal(p.geometry.panelGeometryReady,true,key);
    assert.deepEqual(p.blockers,[],key);
  }
  assert.equal(Queue.section2Closure.blocked.length,0);
});

test('Selection2 keeps technical geometry evidence separate from accepted runtime visuals',()=>{
  const p=Queue.products['siemens-5tl1163-0'];
  assert.equal(p.evidence.officialTechnicalDrawingRefresh.visualPromotionAllowed,false);
  assert.equal(p.status,'promoted');
  assert.equal(p.visual.orientation,'orthographic-front');
  assert.equal(p.visual.provenance,'verified');
});


test('Selection2 terminal-geometry closure has no remaining blocked product',()=>{
  assert.deepEqual(Queue.section2Closure.blocked,[]);
  assert.equal(Queue.products['weidmuller-2466870000'].geometry.terminalGeometry,'verified');
  assert.equal(Queue.products['sick-wtb4-3p2161'].geometry.terminalGeometry,'connectorized-external');
  assert.equal(Queue.products['rittal-3241100'].geometry.terminalGeometry,'unverified');
});


test('Selection2 queue visual and terminal states stay synchronized with runtime physical mappings',()=>{
  const cases={
    'siemens-3rt2016-1bb41':'main-contact',
    'siemens-3rv2011-1ja10':'thermal-magnetic',
    'siemens-5tl1163-0':'disconnect-1p',
    'weidmuller-2466870000':'smps',
    'rittal-3241100':'fan-1p',
    'sick-wtb4-3p2161':'photoeye',
    'siemens-6sl3210-5bb21-5uv1':'sinamics-v20-1p'
  };
  for(const [productKey,id] of Object.entries(cases)){
    const q=Queue.products[productKey],m=Physical.componentMap[id];
    assert.equal(q.visual.match,m.visualMatchStatus,productKey);
    if(q.geometry.terminalGeometry==='connectorized-external')assert.equal(m.terminalGeometryStatus,'connectorized-external',productKey);
    else assert.equal(q.geometry.terminalGeometry,m.terminalGeometryStatus,productKey);
  }
});


test('shared GitHub mirror binaries can never satisfy Selection2 exact-model promotion',()=>{
  const rt=Queue.products['siemens-3rt2016-1bb41'];
  const rv=Queue.products['siemens-3rv2011-1ja10'];
  assert.equal(rt.evidence.githubMirrorBinaryFound,true);
  assert.equal(rt.evidence.githubMirrorBinaryExactQualified,false);
  assert.match(rt.evidence.githubMirrorBinaryDisqualification,/reused|shared|family/i);
  assert.equal(rt.status,'promoted');
  assert.equal(rt.evidence.derivedFrontRuntime.sourceGitBlobSha,'c57390b9b90e0a5d751800fd257831d5890961db');

  assert.equal(rv.evidence.githubMirrorBinaryFound,true);
  assert.equal(rv.evidence.githubMirrorBinaryExactQualified,false);
  assert.match(rv.evidence.githubMirrorBinaryDisqualification,/reused|shared|family/i);
  assert.equal(rv.status,'promoted');
});


test('CAD portal metadata remains historical while supplied exact PROtop and V20 DXF close geometry',()=>{
  const protop=Queue.products['weidmuller-2466870000'];
  const v20=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(protop.evidence.partcommunityExactModelConfirmed,true);
  assert.equal(protop.evidence.userSuppliedDxfClosure.inferredCoordinates,false);
  assert.equal(protop.geometry.terminalGeometry,'verified');
  assert.equal(protop.geometry.panelGeometryReady,true);
  assert.equal(protop.status,'promoted');
  assert.equal(v20.geometry.terminalGeometry,'verified');
  assert.equal(v20.geometry.panelGeometryReady,true);
  assert.equal(v20.status,'promoted');
});


test('Selection2 closure snapshot stays synchronized with live product states and blocker classes',()=>{
  const snap=Queue.closureSnapshot;
  assert.ok(snap);
  assert.equal(snap.total,Queue.order.length);

  const promoted=Queue.order.filter(k=>Queue.products[k].status==='promoted');
  const blocked=Queue.order.filter(k=>Queue.products[k].status==='blocked-replacement-required');
  const invalid=Queue.order.filter(k=>!['promoted','blocked-replacement-required'].includes(Queue.products[k].status));

  assert.equal(snap.promoted,promoted.length);
  assert.equal(snap.blocked,blocked.length);
  assert.equal(snap.invalid,invalid.length);
  assert.equal(snap.total,10);
  assert.equal(snap.promoted,10);
  assert.equal(snap.blocked,0);
  assert.equal(snap.invalid,0);

  for(const key of blocked){
    assert.deepEqual(snap.blockedProducts[key],Queue.products[key].blockers,key);
  }
});


test('official raster drawings remain non-dimensional while supplied exact DXF closes PROtop and V20 geometry',()=>{
  const protop=Queue.products['weidmuller-2466870000'];
  const v20=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(protop.evidence.officialDatasheetDrawingsPageConfirmed,true);
  assert.match(protop.evidence.officialDatasheetDrawingPixelAuditResult,/electrical schematic|derating|non-dimensional/i);
  assert.equal(protop.geometry.terminalGeometry,'verified');
  assert.deepEqual(protop.blockers,[]);
  assert.equal(protop.evidence.userSuppliedDxfClosure.inferredCoordinates,false);
  assert.equal(v20.geometry.terminalGeometry,'verified');
  assert.equal(v20.blockers.includes('verified-terminal-center-mm-coordinates-required'),false);
});


test('exact PROtop and V20 CAD bytes are now validated while historical image audits remain recorded',()=>{
  const protop=Queue.products['weidmuller-2466870000'];
  const v20=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(protop.evidence.officialIndexedVisualAuditResult,'three-quarter-perspective');
  assert.equal(protop.visual.orientation,'source-image-derived-front');
  assert.equal(protop.geometry.terminalGeometry,'verified');
  assert.equal(protop.status,'promoted');
  assert.equal(v20.geometry.terminalGeometry,'verified');
  assert.equal(v20.status,'promoted');
});


test('PROtop PARTcommunity preview remains disqualified but exact repo visual plus DXF support promotion',()=>{
  const protop=Queue.products['weidmuller-2466870000'];
  assert.equal(protop.evidence.partcommunityPreviewSharedAcrossVariants,true);
  assert.equal(protop.evidence.partcommunityPreviewExactVisualQualified,false);
  assert.match(protop.evidence.partcommunityPreviewDisqualification,/shared|reused|different/i);
  assert.equal(protop.visual.provenance,'verified');
  assert.equal(protop.geometry.terminalGeometry,'verified');
  assert.equal(protop.status,'promoted');
});

test('historical PROtop DAM images remain non-orthographic while exact derived-front plus DXF close the product',()=>{
  const protop=Queue.products['weidmuller-2466870000'];
  const v20=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(protop.evidence.officialExactImageAssetPixelAudit[0].result,'three-quarter-perspective');
  assert.equal(protop.evidence.officialExactImageAssetPixelAudit[0].qualifiesOrthographicFront,false);
  assert.equal(protop.visual.orientation,'source-image-derived-front');
  assert.equal(protop.geometry.terminalGeometry,'verified');
  assert.equal(protop.status,'promoted');
  assert.equal(v20.geometry.terminalGeometry,'verified');
  assert.equal(v20.status,'promoted');
});

test('non-dimensional datasheet drawings remain historical evidence after exact CAD closure',()=>{
  const protop=Queue.products['weidmuller-2466870000'];
  const v20=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(protop.evidence.digikeyManufacturerProvidedStepConfirmed,true);
  assert.match(protop.evidence.officialDatasheetDrawingTerminalGeometryDecision,/remain-unverified|no coordinates/i);
  assert.equal(protop.evidence.userSuppliedDxfClosure.inferredCoordinates,false);
  assert.equal(protop.geometry.terminalGeometry,'verified');
  assert.equal(protop.status,'promoted');
  assert.equal(v20.evidence.rsExactPrimaryImageOrientation,'front-perspective');
  assert.equal(v20.geometry.terminalGeometry,'verified');
});

test('V20 physical row/order and exact DXF center geometry stay verified after exact visual promotion',()=>{
  const v20=Queue.products['siemens-6sl3210-5bb21-5uv1'];

  assert.deepEqual(v20.evidence.officialUserTerminalRows.top,
    ['13','13b','14','14b','12','15','16']);
  assert.deepEqual(v20.evidence.officialUserTerminalRows.bottom,
    ['1','2','3','4','5','6','7','8','9','10','11']);
  assert.deepEqual(v20.evidence.officialUserTerminalRows.relay,
    ['17','18','19']);
  assert.deepEqual(v20.evidence.officialPowerTerminalPhysicalLabels.mains,
    ['L1','L2/N','PE']);
  assert.deepEqual(v20.evidence.officialPowerTerminalPhysicalLabels.motorAndDc,
    ['U','V','W','DC-','DC+','PE']);
  assert.equal(v20.evidence.runtimeToOfficialPowerLabel.N,'L2/N');
  assert.equal(v20.evidence.runtimeToOfficialPowerLabel.PE2,'output PE');
  assert.equal(v20.evidence.runtimePhysicalTerminalLayoutMatch,true);
  assert.equal(v20.evidence.runtimeDuplicateTerminalMappingConfirmed['13b'],'second physical 13 / +24 V');
  assert.equal(v20.evidence.runtimeDuplicateTerminalMappingConfirmed['14b'],'second physical 14 / 0 V');

  assert.equal(v20.geometry.terminalGeometry,'verified');
  assert.equal(v20.blockers.includes('verified-terminal-center-mm-coordinates-required'),false);
  assert.match(v20.evidence.terminalGeometryQualification,/verified from exact Siemens .* DXF/i);
  assert.equal(v20.evidence.terminalGeometryVerifiedMethod,'exact-article-2d-dxf-mm-coordinate-extraction');
  assert.equal(v20.evidence.terminalGeometryToleranceMm,0.5);
  assert.equal(v20.status,'promoted');
});

test('3RT historical external image audit stays evidence-only while exact repo source enables derived-front promotion',()=>{
  const p=Queue.products['siemens-3rt2016-1bb41'];
  assert.equal(p.evidence.directSupplierImageExactMarkingVisible,true);
  assert.equal(p.evidence.directSupplierImageRepoBinaryAvailable,false);
  assert.equal(p.status,'promoted');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
  assert.equal(p.evidence.derivedFrontRuntime.result,'accepted source-image-derived-front');
  assert.equal(p.evidence.derivedFrontRuntime.terminalInferenceFromPhoto,false);
});

test('3RV user-supplied exact identity plus Siemens CAD front closes panel visual gate',()=>{
  const p=Queue.products['siemens-3rv2011-1ja10'];
  const u=p.evidence.userSuppliedClosure;
  assert.equal(u.visibleExactArticle,'3RV2011-1JA10-0BA0');
  assert.match(u.exactRealSourceSha256,/^[0-9a-f]{64}$/);
  assert.match(u.manufacturerDimensionDxfSha256,/^[0-9a-f]{64}$/);
  assert.equal(u.runtimeAsset,'dist/assets/products/siemens-3rv2011-1ja10-cad-front.svg');
  assert.equal(u.terminalInferenceFromPhoto,false);
  assert.equal(p.visual.orientation,'orthographic-front');
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
  assert.equal(p.status,'promoted');
});

test('5TL historical web candidate is superseded by the accepted user canonical front',()=>{
  const p=Queue.products['siemens-5tl1163-0'];
  assert.equal(p.status,'promoted');
  assert.equal(p.visual.orientation,'orthographic-front');
  assert.equal(p.visual.provenance,'verified');
  assert.ok(p.evidence.userSuppliedCanonicalFront);
  assert.equal(p.geometry.panelGeometryReady,true);
});

test('V20 Siemens CADGENPLUS3D route stayed inaccessible, but supplied exact DXF supersedes that geometry blocker',()=>{
  const v20=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.match(v20.evidence.siemensCadGenEndpointTemplate,/\/spice\/docuservice\/rest\/document\.spring/);
  assert.match(v20.evidence.siemensCadGenEndpointTemplate,/6SL3210-5BB21-5UV1/);
  assert.match(v20.evidence.siemensCadGenEndpointTemplate,/CADGENPLUS3D/);
  assert.match(v20.evidence.siemensCadGenEndpointDerivation,/docuservice/i);
  assert.match(v20.evidence.siemensCadGenEndpointResolutionState,/bytes remain unavailable|DNS/i);
  assert.equal(v20.geometry.terminalGeometry,'verified');
  assert.equal(v20.blockers.includes('verified-terminal-center-mm-coordinates-required'),false);
  assert.equal(v20.evidence.exactArticleDxfSha256,'323f43f81033c746e1b19740387cd3518e0c77478eecb422e2fbbc2324f91bfd');
  assert.equal(v20.status,'promoted');
});

test('3RT high-resolution external audit remains historical after repo-derived-front promotion',()=>{
  const p=Queue.products['siemens-3rt2016-1bb41'];
  assert.equal(p.evidence.directSupplierHighResolutionRetrievedViaWeb,true);
  assert.equal(p.evidence.directSupplierHighResolutionBinaryRepoTransfer,false);
  assert.equal(p.status,'promoted');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.equal(p.visual.orientation,'source-image-derived-front');
});

test('PROtop exact official CAD transport blocker is resolved by the supplied DXF package',()=>{
  const p=Queue.products['weidmuller-2466870000'];
  assert.equal(p.evidence.officialCadBinaryExistenceVerified,true);
  assert.equal(p.evidence.userSuppliedDxfClosure.archive,'2466870000_DXF.zip');
  assert.match(p.evidence.userSuppliedDxfClosure.archiveSha256,/^[0-9a-f]{64}$/);
  assert.match(p.evidence.userSuppliedDxfClosure.frontDxfSha256,/^[0-9a-f]{64}$/);
  assert.equal(p.evidence.userSuppliedDxfClosure.inferredCoordinates,false);
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
  assert.equal(p.status,'promoted');
});

test('V20 CADGENPLUS3D region variants fail at the gateway rather than from a region mismatch',()=>{
  const p=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.deepEqual(p.evidence.siemensCadGenRegionalAttempts.map(x=>x.region),['WW','DE','AT','US','CN']);
  assert.ok(p.evidence.siemensCadGenRegionalAttempts.every(x=>/gateway-url-not-accessible/.test(x.result)));
  assert.match(p.evidence.siemensCadGenRegionalConclusion,/mismatch ruled out|same document-gateway/i);
  assert.match(p.evidence.siemensIndexedStaticCadSearchResult,/no exact .*static|independently confirm exact CAD/i);
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.blockers.includes('verified-terminal-center-mm-coordinates-required'),false);
  assert.equal(p.status,'promoted');
});

test('V20 generic Siemens family dimensional drawing cannot be scaled into exact FSAC terminal centers',()=>{
  const p=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(p.evidence.officialD311FamilyDrawingCode,'G_D011_XX_00424a');
  assert.deepEqual(p.evidence.officialD311FamilyDrawingAppliesToFrames,
    ['FSAA','FSAB','FSAC','FSAD','FSA','FSB','FSC','FSD','FSE']);
  assert.deepEqual(p.evidence.officialD311FsacDimensionsMm,{
    widthA:90.8,heightB2:160.9,depthC:147,drillingWidthD:79,drillingHeightE:140
  });
  assert.equal(p.evidence.officialD311FamilyDrawingShowsTerminals,true);
  assert.equal(p.evidence.officialD311FamilyDrawingExactTerminalScalingQualified,false);
  assert.match(p.evidence.officialD311FamilyDrawingDisqualification,/same generic|multiple frame-size/i);
  assert.match(p.evidence.terminalGeometryInferencePolicy,/do not derive|exact frame\/article CAD/i);
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.blockers.includes('verified-terminal-center-mm-coordinates-required'),false);
  assert.equal(p.evidence.exactArticleDxfGeometryDecision.startsWith('verified exact-article 1:1 vector geometry'),true);
  assert.equal(p.status,'promoted');
});

test('V20 exact article DXF anchor set covers every verified runtime terminal with 0.5 mm tolerance',()=>{
  const p=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.evidence.exactArticleDxfFile,'6SL3210-5BB21-5UV1_2D_dimension_withFrame_en.DXF');
  assert.equal(p.evidence.exactArticleDxfDrawingUnit,'mm [in]');
  assert.deepEqual(p.evidence.exactArticleDxfFrontBodyFrameMm,{width:90.8,height:160.9});
  assert.equal(p.evidence.terminalGeometryToleranceMm,0.5);
  const expectedIds=['L1','N','PE','U','V','W','DC-','DC+','PE2','1','2','3','4','5','6','7','8','9','10','11','13','13b','14','14b','12','15','16','17','18','19'];
  assert.deepEqual(Object.keys(p.evidence.terminalCenterCoordinates).sort(),expectedIds.sort());
  for(const id of expectedIds){
    const a=p.evidence.terminalCenterCoordinates[id];
    assert.ok(Number.isFinite(a.x)&&Number.isFinite(a.y),id);
    assert.ok(['top','bottom','left','right'].includes(a.side),id);
  }
  assert.deepEqual(p.evidence.exactArticleDxfUserTerminalStructure.lowerRow,['1','2','3','4','5','6','7','8','9','10','11']);
  assert.deepEqual(p.evidence.exactArticleDxfUserTerminalStructure.upperSeven,['13','13b','14','14b','12','15','16']);
  assert.deepEqual(p.evidence.exactArticleDxfUserTerminalStructure.relayBlock,['17','18','19']);
});

test('user-supplied straight-on V20 image is rejected because Siemens source article is not the target 5UV1',()=>{
  const p=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(p.evidence.userSuppliedFrontImageObservedOrientation,'orthographic-front');
  assert.equal(p.evidence.userSuppliedFrontImageSingleProduct,true);
  assert.equal(p.evidence.userSuppliedFrontImageSourceArticle,'6SL3210-5BE21-5UV0');
  assert.equal(p.evidence.userSuppliedFrontImageTargetArticle,'6SL3210-5BB21-5UV1');
  assert.equal(p.evidence.userSuppliedFrontImageExactTargetMatch,false);
  assert.match(p.evidence.userSuppliedFrontImageDisqualification,/not target|different V20 variant|cannot satisfy exact target/i);
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
  assert.equal(p.status,'promoted');
});

test('official Siemens TIFF P_D011_XX_01069V is rejected because its visible nameplate is 5BB12-5UV1, not target 5BB21-5UV1',()=>{
  const p=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(p.evidence.userSuppliedSiemensTifFile,'P_D011_XX_01069V.tif');
  assert.equal(p.evidence.userSuppliedSiemensTifSha256,'028a1db783203544dd5a54ca4211fbe92b0e4c4f5992a96a680d2777e3361784');
  assert.equal(p.evidence.userSuppliedSiemensTifMetadata.artist,'Siemens AG - Industry Sector');
  assert.match(p.evidence.userSuppliedSiemensTifMetadata.rightsWebStatement,/automation\.siemens\.com\/bilddb/);
  assert.equal(p.evidence.userSuppliedSiemensTifVisibleArticle,'6SL3210-5BB12-5UV1');
  assert.equal(p.evidence.userSuppliedSiemensTifVisibleMotorPowerKw,0.25);
  assert.equal(p.evidence.userSuppliedSiemensTifTargetArticle,'6SL3210-5BB21-5UV1');
  assert.equal(p.evidence.userSuppliedSiemensTifExactTargetMatch,false);
  assert.match(p.evidence.userSuppliedSiemensTifDisqualification,/not target|0\.25 kW|three-quarter/i);
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
  assert.equal(p.status,'promoted');
});

test('user-supplied RS 136-8125 V20 images are rejected as 5BB17-5UV1, not target 5BB21-5UV1',()=>{
  const p=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(p.evidence.userSuppliedRs1368125StockNo,'136-8125');
  assert.equal(p.evidence.userSuppliedRs1368125SourceArticle,'6SL3210-5BB17-5UV1');
  assert.equal(p.evidence.userSuppliedRs1368125SourcePowerKw,0.75);
  assert.equal(p.evidence.userSuppliedRs1368125SourceFrame,'FSAB');
  assert.equal(p.evidence.userSuppliedRs1368125TargetArticle,'6SL3210-5BB21-5UV1');
  assert.equal(p.evidence.userSuppliedRs1368125ExactTargetMatch,false);
  assert.equal(p.evidence.userSuppliedRs1368125ObservedOrientation,'front-perspective');
  assert.equal(p.evidence.userSuppliedRs1368125Files.length,2);
  assert.match(p.evidence.userSuppliedRs1368125Disqualification,/0\.75 kW|FSAB|not target|wrong-article/i);
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
  assert.equal(p.status,'promoted');
});

test('exact RS 203-3539 and Woolars target images remain perspective and cannot close V20 visual blocker',()=>{
  const p=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(p.evidence.exactRs2033539Article,'6SL3210-5BB21-5UV1');
  assert.equal(p.evidence.exactRs2033539PrimaryImageTargetExact,true);
  assert.equal(p.evidence.exactRs2033539PrimaryImageOrientation,'front-perspective');
  assert.equal(p.evidence.exactRs2033539PrimaryImageQualifiesOrthographicFront,false);
  assert.equal(p.evidence.woolarsExactPackagingLabelArticle,'6SL3210-5BB21-5UV1');
  assert.equal(p.evidence.woolarsExactPackagingLabelVisible,true);
  assert.equal(p.evidence.woolarsProductPhotoOrientation,'perspective');
  assert.equal(p.evidence.woolarsProductPhotoQualifiesOrthographicFront,false);
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.evidence.gumrukSepetiExactTargetMatch,true);
  assert.deepEqual(p.blockers,[]);
  assert.equal(p.status,'promoted');
});

test('exact V20 eBay used listing stays candidate-only until product pixels prove article and strict front orientation',()=>{
  const p=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(p.evidence.ebayExactUsedListingTitle,'1pc used Siemens 6SL3210-5BB21-5UV1');
  assert.equal(p.evidence.ebayExactUsedListingImageSetObserved,true);
  assert.equal(p.evidence.ebayExactUsedListingPixelAuditComplete,true);
  assert.equal(p.evidence.ebayExactUsedListingVisibleArticleFromPixels,'6SL3210-5BB21-5UV1');
  assert.equal(p.evidence.ebayExactUsedListingFrontOrientation,'orthographic-front');
  assert.equal(p.evidence.ebayExactUsedListingFrontSingleProduct,true);
  assert.equal(p.evidence.ebayExactUsedListingFrontImageQualifiesOrthographicFront,true);
  assert.equal(p.evidence.ebayExactUsedListingNameplateExactTargetMatch,true);
  assert.equal(p.evidence.ebayExactUsedListingSamePhotoSetProvenance,true);
  assert.equal(p.evidence.ebayExactUsedListingSourceLevelExactVisualQualified,true);
  assert.equal(p.evidence.ebayExactUsedListingRepoBinaryAvailable,false);
  assert.match(p.evidence.ebayExactUsedListingRepoTransferFailure,/DNS|cannot yet be copied/i);
  assert.match(p.evidence.ebayExactUsedListingDecision,/source-level exact visual qualified|promotion remains blocked/i);
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.evidence.gumrukSepetiExactTargetMatch,true);
  assert.equal(p.status,'promoted');
});

test('V20 eBay source-level candidate is superseded by the repo-backed Gümrük Sepeti exact front',()=>{
  const p=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(p.evidence.ebayExactUsedListingSourceLevelExactVisualQualified,true);
  assert.equal(p.evidence.ebayExactUsedListingRepoBinaryAvailable,false);
  assert.equal(p.evidence.gumrukSepetiExactTargetMatch,true);
  assert.equal(p.evidence.gumrukSepetiSameGalleryProvenance,true);
  assert.equal(p.evidence.gumrukSepetiFrontOrientation,'orthographic-front');
  assert.equal(p.evidence.gumrukSepetiFrontSingleProduct,true);
  assert.equal(p.evidence.gumrukSepetiVisibleNameplateArticle,'6SL3210-5BB21-5UV1');
  assert.equal(p.evidence.gumrukSepetiVisibleMotorPowerKw,1.5);
  assert.equal(p.evidence.repoVisualFile,'dist/assets/products/sinamics-v20-6sl3210-5bb21-5uv1-user-front-v2.webp');
  assert.equal(p.evidence.repoVisualSha256,'c8db14a110d3df76375289d3bfb30c0b25f1eab71ea9839ab9ff72dd0ef29667');
  assert.equal(p.evidence.repoVisualGitBlobSha,'47ea4bedb7153891a2ccee88e31ad3285e59dcc3');
  assert.equal(p.evidence.repoVisualProvenanceRecorded,true);
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
  assert.equal(p.status,'promoted');
});

test('PROtop RS/TME historical evidence remains valid after exact DXF terminal closure',()=>{
  const p=Queue.products['weidmuller-2466870000'];
  assert.equal(p.evidence.rsExactManufacturerPartNo,'2466870000');
  assert.equal(p.evidence.rsExactPrimaryImageOrientation,'three-quarter-perspective');
  assert.equal(p.evidence.tmeExactDatasheetMirrorMechanicalTerminalDrawingPresent,false);
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
  assert.equal(p.status,'promoted');
});


test('V20 exact CAD profile remains verified after visual/panel promotion while collider stays conservative',()=>{
  const p=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(p.evidence.profileCadAuditResult,'verified-exact-cad-profile');
  assert.equal(p.evidence.profileRuntimeStatus,'verified');
  assert.equal(p.evidence.colliderRuntimeStatus,'conservative-envelope');
  assert.equal(p.evidence.profileVerifiedMethod,'exact-article-dxf-multiview+embedded-u3d');
  assert.deepEqual(p.evidence.profileVerifiedBoundsMm,{width:90.8,height:160.9,depth:147});
  assert.equal(p.evidence.profileEvidenceFiles.length,2);
  assert.equal(p.evidence.profileEvidenceFiles[0].sha256,'323f43f81033c746e1b19740387cd3518e0c77478eecb422e2fbbc2324f91bfd');
  assert.equal(p.evidence.profileEvidenceFiles[1].sha256,'edefd2605c6e4e8367e834922f3ab0bee7abbcc48f1e7f3b38462d11640bc778');
  assert.equal(p.evidence.profileDxfVerification.frontLayer,'10000_FRONT');
  assert.equal(p.evidence.profileDxfVerification.rightDepthDimensionMm,147);
  assert.equal(p.evidence.profile3dVerification.pdfSubtype,'U3D');
  assert.equal(p.evidence.profile3dVerification.decodedStreamSha256,'d3915b3bbe9f4bc48724cf66f8770afbb16b1a555c6c6047431b1c5808d9a60c');
  assert.match(p.evidence.profileCadRuntimeDecision,/profileStatus is verified|colliderStatus remains conservative-envelope/i);
  assert.match(p.evidence.colliderPromotionDecision,/do not mark verified-profile/i);
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
  assert.equal(p.status,'promoted');
});

test('V20 promotion keeps Gümrük exact-identity provenance while runtime uses the user-selected calibrated front',()=>{
  const p=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  assert.equal(p.status,'promoted');
  assert.equal(p.visual.match,'exact');
  assert.equal(p.visual.orientation,'orthographic-front');
  assert.equal(p.visual.sourceAuthority,'supplier');
  assert.equal(p.visual.provenance,'recorded');
  assert.equal(p.evidence.gumrukSepetiListingNo,'357285789849');
  assert.equal(p.evidence.gumrukSepetiVisibleNameplateArticle,'6SL3210-5BB21-5UV1');
  assert.equal(p.evidence.gumrukSepetiVisibleMotorPowerKw,1.5);
  assert.equal(p.evidence.userSuppliedGumrukFrontSha256,'e6279665fe044e2b96258e6ebb3262510f63ad69b2ec0fb7736edaa934f10bad');
  assert.equal(p.evidence.userSuppliedCanonicalFrontSha256,'a9a7b7d93f82dd7e81be67d807df718f484aa0b881beb0b562f3838a1b38a9d2');
  assert.deepEqual(p.evidence.runtimeVisualCalibration.physicalFrameMm,{width:90.8,height:160.9});
  assert.deepEqual(p.evidence.runtimeVisualCalibration.renderPx,{width:280,height:496});
  assert.deepEqual(p.evidence.terminalPhysicalRows.upperControl,['13','13b','14','14b','12','15','16']);
  assert.deepEqual(p.evidence.terminalPhysicalRows.lowerControl,['1','2','3','4','5','6','7','8','9','10','11']);
  assert.deepEqual(p.evidence.terminalPhysicalRows.relay,['17','18','19']);
  assert.equal(p.evidence.repoVisualSha256,'c8db14a110d3df76375289d3bfb30c0b25f1eab71ea9839ab9ff72dd0ef29667');
  assert.equal(p.evidence.repoVisualGitBlobSha,'47ea4bedb7153891a2ccee88e31ad3285e59dcc3');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
});

test('V20 canonical sharp asset and wire-over-body contract stay synchronized with runtime metadata',()=>{
  const p=Queue.products['siemens-6sl3210-5bb21-5uv1'];
  const mapping=Physical.componentMap['sinamics-v20-1p'];
  assert.equal(p.evidence.repoVisualFile,'dist/assets/products/sinamics-v20-6sl3210-5bb21-5uv1-user-front-v2.webp');
  assert.equal(p.evidence.repoVisualSha256,'c8db14a110d3df76375289d3bfb30c0b25f1eab71ea9839ab9ff72dd0ef29667');
  assert.equal(p.evidence.repoVisualGitBlobSha,'47ea4bedb7153891a2ccee88e31ad3285e59dcc3');
  assert.equal(p.evidence.userSuppliedCanonicalFrontSha256,'a9a7b7d93f82dd7e81be67d807df718f484aa0b881beb0b562f3838a1b38a9d2');
  assert.deepEqual(p.evidence.runtimeVisualCalibration.renderPx,{width:280,height:496});
  assert.deepEqual(p.evidence.runtimeVisualCalibration.physicalFrameMm,{width:90.8,height:160.9});
  assert.equal(p.evidence.runtimeWireLayerContract,'device body/photo < wires < terminal/control interaction overlay');
  assert.equal(mapping.wireOverBody,true);
  assert.equal(mapping.visualCalibration.repoSha256,p.evidence.repoVisualSha256);
  assert.equal(mapping.visualCalibration.sourceSha256,p.evidence.userSuppliedCanonicalFrontSha256);
  assert.equal(mapping.visualCalibration.renderPixelWidth,280);
  assert.equal(mapping.visualCalibration.renderPixelHeight,496);
});

test('Selection2 has no remaining blocked repo-binary product after final closure',()=>{
  for(const key of Queue.order)assert.equal(Queue.products[key].status,'promoted',key);
  assert.deepEqual(Queue.section2Closure.blocked,[]);
});

test('Selection2 binary intake records completed canonical closures without reopening promoted products',()=>{
  const p=Queue.products['siemens-5tl1163-0'];
  assert.equal(p.status,'promoted');
  assert.ok(p.evidence.userSuppliedCanonicalFront);
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
});

test('manufacturer datasheet binaries prove exact identity but do not bypass orthographic gate',()=>{
  for(const key of ['siemens-3rt2016-1bb41','siemens-3rv2011-1ja10']){
    const p=Queue.products[key],a=p.evidence.manufacturerEmbeddedBinaryAudit;
    assert.ok(a,key);
    assert.equal(a.exactArticleDocument,true,key);
    assert.equal(a.orthographicQualified,false,key);
    assert.match(a.orientation,/perspective/i,key);
    assert.match(a.sourceDocumentSha256,/^[0-9a-f]{64}$/,key);
    assert.match(a.embeddedImageSha256,/^[0-9a-f]{64}$/,key);
    assert.equal(a.embeddedImagePx.width,300,key);
    assert.equal(a.embeddedImagePx.height,300,key);
    if(key==='siemens-3rv2011-1ja10'){
      assert.equal(p.status,'promoted',key);
      assert.equal(p.geometry.panelGeometryReady,true,key);
    }
  }
});

test('Selection2 is closed after 3RV and PROtop promotion',()=>{
  assert.equal(Queue.products['siemens-3rv2011-1ja10'].status,'promoted');
  assert.equal(Queue.products['weidmuller-2466870000'].status,'promoted');
  assert.deepEqual(Queue.section2Closure.blocked,[]);
  assert.equal(Queue.section2Closure.status,'closed-complete');
  assert.match(Queue.section2Closure.nextExecutableStep,/Selection 2 complete/i);
});

test('PROtop supplied exact DXF bytes replace the former metadata-only fail-closed state',()=>{
  const p=Queue.products['weidmuller-2466870000'];
  const a=p.evidence.githubCadMirrorAudit,s=p.evidence.cadAcquisitionState;
  assert.equal(a.exactCadBinaryFound,false);
  assert.equal(s.exactProjectIdentityVerified,true);
  assert.equal(s.exactCadBinarySupplied,true);
  assert.equal(s.exactCadBinaryParsed,true);
  assert.equal(s.terminalCentersVerified,true);
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.equal(p.status,'promoted');
});

test('Rittal depth evidence remains explicitly unreconciled',()=>{
  const g=Queue.products['rittal-3241100'].evidence.depthReconciliationGate;
  assert.deepEqual(g.nominalFaceMm,{width:255,height:255});
  assert.equal(g.installationDepthMm,107);
  assert.equal(g.alternateOverallDepthEvidenceMm,132);
  assert.match(g.status,/requires-reconciliation/);
  assert.match(g.rule,/distinct concepts/);
});

test('5TL drawing remains geometry-only evidence while separate user visual enables promotion',()=>{
  const p=Queue.products['siemens-5tl1163-0'];
  const a=p.evidence.officialTechnicalDrawingRefresh;
  assert.equal(a.exactArticle,'5TL1163-0');
  assert.equal(a.frontWidthMm,18);
  assert.equal(a.visualPromotionAllowed,false);
  assert.match(a.role,/geometry-evidence-only/);
  assert.equal(p.status,'promoted');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.equal(p.evidence.userSuppliedCanonicalFront.orientation,'orthographic-front');
});

test('Rittal source-level front candidate is superseded by derived-front promotion',()=>{
  const p=Queue.products['rittal-3241100'];
  const a=p.evidence.newFrontCandidate;
  assert.equal(a.exactModel,'SK 3241.100');
  assert.equal(a.sourceLevelOrthographicQualified,true);
  assert.equal(a.repoBinaryAvailable,false);
  assert.equal(p.status,'promoted');
  assert.equal(p.visual.orientation,'source-image-derived-front');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.equal(p.evidence.derivedFrontPromotion.method,'front-face-crop+nonuniform-rectification');
});

test('sensor visual policy allows exact isometric views while closed SICK provenance stays accepted',()=>{
  const p=Queue.products['sick-wtb4-3p2161'],policy=Queue.visualAcceptancePolicies.sensor;
  assert.equal(policy.policyId,'sensor-visual-flex-v1');
  assert.ok(policy.allowed.includes('isometric'));
  assert.equal(p.visual.orientation,'isometric-allowed');
  assert.equal(p.visual.provenance,'verified');
  assert.deepEqual(p.blockers,[]);
  assert.equal(Physical.componentMap.photoeye.visualPolicyId,'sensor-visual-flex-v1');
  for(const key of ['siemens-3rt2016-1bb41','siemens-3rv2011-1ja10','siemens-5tl1163-0','weidmuller-2466870000','rittal-3241100'])assert.notEqual(Queue.products[key].visual.orientation,'isometric-allowed',key);
});

test('5TL user-supplied canonical front is promoted at exact physical scale',()=>{
  const p=Queue.products['siemens-5tl1163-0'];
  assert.equal(p.status,'promoted');
  assert.equal(p.visual.orientation,'orthographic-front');
  assert.equal(p.visual.provenance,'verified');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
  const a=p.evidence.userSuppliedCanonicalFront;
  assert.equal(a.repoFile,'dist/assets/products/siemens-5tl1163-0-user-front.webp');
  assert.equal(a.repoGitBlobSha,'0e06ba9ef03825cde29ecce5527a266bd37b556f');
  assert.equal(a.sha256,'a3a183eb6bf319d549536bcaac5f6a038d9a61ab843bfd168de4da8ef9e23f04');
  assert.deepEqual(a.pixels,{width:180,height:898});
  assert.deepEqual(a.physicalFrameMm,{width:18,height:89.8});
  assert.equal(a.calibration,'10 px/mm exactly; no aspect distortion');
  assert.ok(Queue.section2Closure.promoted.includes('siemens-5tl1163-0'));
  assert.equal(Queue.section2Closure.blocked.includes('siemens-5tl1163-0'),false);
});

test('non-sensor panel hardware may use source-image-derived-front but never raw isometric runtime visuals',()=>{
  const policy=Queue.visualAcceptancePolicies.standardPanelHardware;
  assert.equal(policy.policyId,'panel-visual-derived-front-v1');
  assert.ok(policy.allowed.includes('source-image-derived-front'));
  assert.ok(policy.disallowed.includes('isometric-runtime-for-non-sensor'));
  assert.ok(policy.disallowed.includes('terminal-coordinate-inference-from-rectified-photo'));
  for(const key of ['siemens-3rt2016-1bb41','siemens-3rv2011-1ja10']){
    const p=Queue.products[key];
    assert.equal(p.evidence.visualPolicy.policyId,'panel-visual-derived-front-v1',key);
    assert.equal(p.evidence.visualPolicy.sourceImageDerivationAllowed,true,key);
    assert.equal(p.evidence.visualPolicy.runtimeMustBeFrontFacing,true,key);
    assert.equal(p.evidence.visualPolicy.terminalGeometryMustRemainIndependent,true,key);
  }
});

test('3RV source resolution no longer blocks on native-front-only acquisition',()=>{
  const p=Queue.products['siemens-3rv2011-1ja10'];
  const plan=p.evidence.visualResolutionPlan;
  assert.equal(plan.preferredSource.exactModel,'3RV2011-1JA10');
  assert.equal(plan.fallback.allowed,true);
  assert.match(plan.fallback.rule,/rectify/i);
  assert.match(plan.runtimeTarget,/source-image-derived-front|orthographic-front/);
});

test('SICK exact repo visual and connector interface close all panel blockers',()=>{
  const p=Queue.products['sick-wtb4-3p2161'];
  assert.equal(p.status,'promoted');
  assert.equal(p.visual.orientation,'isometric-allowed');
  assert.equal(p.visual.provenance,'verified');
  assert.equal(p.geometry.terminalGeometry,'connectorized-external');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
  assert.equal(p.evidence.currentRuntimeVisual.policyResult,'accepted-under-sensor-visual-flex-v1');
});

test('SICK connectorized external interface closes final geometry gate',()=>{
  const p=Queue.products['sick-wtb4-3p2161'];
  assert.equal(p.status,'promoted');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.equal(p.geometry.terminalGeometry,'connectorized-external');
  assert.deepEqual(p.blockers,[]);
  const c=p.evidence.connectorInterface;
  assert.equal(c.connector,'M8, 3-pin');
  assert.deepEqual(c.pinAssignment,{BN:1,BU:3,BK:4});
  assert.deepEqual(c.functions,{1:'+ (L+)',3:'- (M)',4:'Q'});
  assert.equal(c.connectionCallout,'8 = Connection');
  assert.match(c.panelInterpretation,/no fabricated per-conductor body terminal centers/);
  assert.ok(Queue.section2Closure.promoted.includes('sick-wtb4-3p2161'));
  assert.equal(Queue.section2Closure.blocked.includes('sick-wtb4-3p2161'),false);
});

test('3RT derived-front promotion is locked to the exact repo source',()=>{
  const p=Queue.products['siemens-3rt2016-1bb41'];
  assert.equal(p.status,'promoted');
  assert.equal(p.visual.orientation,'source-image-derived-front');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
  const d=p.evidence.derivedFrontRuntime;
  assert.equal(d.policyId,'panel-visual-derived-front-v1');
  assert.equal(d.sourceRepoFile,'dist/assets/products/siemens-3rt2016-1bb41-bare.jpg');
  assert.equal(d.sourceGitBlobSha,'c57390b9b90e0a5d751800fd257831d5890961db');
  assert.deepEqual(d.runtimeViewBox,{x:358,y:394,width:536,height:691});
  assert.deepEqual(d.physicalFrameMm,{width:45,height:58});
  assert.equal(d.terminalInferenceFromPhoto,false);
  assert.ok(Queue.section2Closure.promoted.includes('siemens-3rt2016-1bb41'));
  assert.equal(Queue.section2Closure.blocked.includes('siemens-3rt2016-1bb41'),false);
});

test('Rittal derived front uses exact repo source without inferring terminals',()=>{
  const p=Queue.products['rittal-3241100'],d=p.evidence.derivedFrontPromotion;
  assert.equal(p.status,'promoted');
  assert.equal(p.visual.orientation,'source-image-derived-front');
  assert.equal(d.sourceRepoFile,'dist/assets/products/rittal-3241100.jpg');
  assert.deepEqual(d.physicalFrameMm,{width:255,height:255});
  assert.match(d.decision,/terminal geometry remains unverified/i);
  assert.equal(p.geometry.terminalGeometry,'unverified');
  assert.equal(p.geometry.panelGeometryReady,true);
  assert.deepEqual(p.blockers,[]);
});

test('PROtop derived front and exact DXF jointly close all Selection2 blockers',()=>{
  const p=Queue.products['weidmuller-2466870000'];
  assert.equal(p.status,'promoted');
  assert.equal(p.visual.orientation,'source-image-derived-front');
  assert.equal(p.visual.provenance,'verified');
  assert.deepEqual(p.blockers,[]);
  assert.equal(p.geometry.terminalGeometry,'verified');
  assert.equal(p.geometry.panelGeometryReady,true);
  const d=p.evidence.derivedFrontClosure;
  assert.equal(d.sourceRepoFile,'dist/assets/products/weidmuller-pro-top-2466870000.jpg');
  assert.equal(d.sourceGitBlobSha,'fadb5328acca6ade71426fe877748985d7fe2313');
  assert.deepEqual(d.physicalFrameMm,{width:35,height:130});
  assert.equal(p.evidence.userSuppliedDxfClosure.inferredCoordinates,false);
});
