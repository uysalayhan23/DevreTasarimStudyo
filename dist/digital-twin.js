(function(root){
  'use strict';

  const Physical=typeof module==='object'&&module.exports?require('./physical-metadata.js'):root.DTSPhysicalMetadata;
  const Quality=typeof module==='object'&&module.exports?require('./asset-quality.js'):root.DTSAssetQuality;
  const ProductAssets=typeof module==='object'&&module.exports?require('./product-assets.js'):root.CCSProductAssets;

  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  function runtimeVisualGate(mapping){
    if(!mapping||mapping.visualMatchStatus!=='exact')return {ready:false,reasons:['exact-visual']};
    const o=mapping.visualOrientationStatus,p=mapping.visualPolicyId;
    const sensor=p==='sensor-visual-flex-v1'&&['orthographic-front','front-lens','isometric','three-quarter','isometric-allowed'].includes(o);
    const derived=p==='panel-visual-derived-front-v1'&&o==='source-image-derived-front';
    if(o!=='orthographic-front'&&!sensor&&!derived)return {ready:false,reasons:['orthographic-front']};
    return {ready:true,reasons:[]};
  }

  function record(component){
    if(!component||typeof component.id!=='string'||!Physical)return null;
    const mapping=Physical.componentMap?.[component.id];
    if(!mapping)return null;
    const physical=Physical.get(component);
    if(!physical)return null;
    const product=Physical.products?.[mapping.productKey]||null;
    const assetRecord=ProductAssets?.[mapping.assetKey]||{};
    const manifest=ProductAssets?.[mapping.assetKey]?'product':'mapped-sidecar';
    const visual=Quality?.descriptor?Quality.descriptor(mapping.assetKey,assetRecord,manifest):null;
    const visualPromotion=Quality?.promotionVisual?Quality.promotionVisual(mapping.assetKey,assetRecord,manifest):null;
    const runtimeVisual=runtimeVisualGate(mapping);
    const panelSpec=Physical.panelSpec(component);
    const gate=Physical.panelGeometryGate(product,mapping,component);
    return {
      schemaVersion:1,
      componentId:component.id,
      productKey:mapping.productKey,
      manufacturer:physical.manufacturer||null,
      model:physical.model||null,
      physical:{
        widthMm:physical.widthMm,
        heightMm:physical.heightMm,
        depthMm:physical.depthMm,
        installationDepthMm:Number.isFinite(physical.installationDepthMm)?physical.installationDepthMm:null,
        sourceStatus:physical.sourceStatus,
        sourceAuthority:physical.sourceAuthority,
        sourceType:physical.sourceType||null,
        sourceUrl:physical.sourceUrl,
        mountingType:physical.mountingType,
        allowedPanelMounts:clone(physical.allowedPanelMounts||[]),
        defaultPanelMount:physical.defaultPanelMount,
        profileStatus:physical.profileStatus||'unverified',
        profileMethod:physical.profileMethod||null,
        profileSourceUrl:physical.profileSourceUrl||null,
        profileBoundsMm:clone(physical.profileBoundsMm||null),
        profileEvidenceFiles:clone(physical.profileEvidenceFiles||[]),
        profileEvidence:clone(physical.profileEvidence||null),
        colliderStatus:physical.colliderStatus||'conservative-envelope',
        colliderMethod:physical.colliderMethod||null,
        colliderProfileXZMm:clone(physical.colliderProfileXZMm||null),
        colliderDecision:physical.colliderDecision||null,
        requiredClearanceMm:clone(physical.requiredClearanceMm||null),
        requiredClearanceByVoltageMm:clone(physical.requiredClearanceByVoltageMm||null)
      },
      visual:visual?{
        assetKey:mapping.assetKey,
        file:visual.file,
        runtimeFile:mapping.visualSourceFile?('assets/products/'+mapping.visualSourceFile):visual.file,
        matchQuality:mapping.visualMatchStatus||visual.matchQuality,
        orientationStatus:mapping.visualOrientationStatus||visual.orientationStatus,
        policyId:mapping.visualPolicyId||null,
        sourceMatchQuality:visual.matchQuality,
        sourceOrientationStatus:visual.orientationStatus,
        orientationAuditStatus:visual.orientationAuditStatus,
        visualSourceUrl:visual.visualSourceUrl,
        sourceAuthority:visual.sourceAuthority,
        provenanceStatus:mapping.visualSourceStatus?'recorded':visual.provenanceStatus,
        promotionReady:runtimeVisual.ready,
        promotionBlockers:clone(runtimeVisual.reasons),
        sourcePromotionReady:!!visualPromotion?.ready,
        sourcePromotionBlockers:clone(visualPromotion?.reasons||[])
      }:{
        assetKey:mapping.assetKey,
        runtimeFile:mapping.visualSourceFile?('assets/products/'+mapping.visualSourceFile):null,
        matchQuality:mapping.visualMatchStatus||'unverified',
        orientationStatus:mapping.visualOrientationStatus||'unverified',
        policyId:mapping.visualPolicyId||null,
        promotionReady:runtimeVisual.ready,
        promotionBlockers:clone(runtimeVisual.reasons),
        sourcePromotionReady:false,
        sourcePromotionBlockers:['asset-quality-unavailable']
      },
      terminals:{
        identityStatus:physical.terminalIdentityStatus||'unverified',
        identitySourceUrl:physical.terminalIdentitySourceUrl||null,
        verifiedTerminalIds:clone(physical.verifiedTerminalIds||[]),
        geometryStatus:physical.terminalGeometryStatus||'unverified',
        geometryMethod:physical.terminalGeometryMethod||null,
        geometryToleranceMm:Number.isFinite(physical.terminalGeometryToleranceMm)?physical.terminalGeometryToleranceMm:null,
        geometrySourceUrl:physical.terminalSourceUrl||null,
        activeAnchorVisualEligible:runtimeVisual.ready&&mapping.terminalGeometryStatus==='verified'
      },
      simulation:{
        componentKind:typeof component.kind==='string'&&component.kind?component.kind:null,
        runtimeModel:typeof component.simulationModel==='string'&&component.simulationModel?component.simulationModel:null,
        status:typeof component.kind==='string'&&component.kind?'component-runtime-mapped':'unverified'
      },
      panel:{
        eligible:physical.panelEligible!==false,
        physicalRole:physical.physicalRole||'standalone',
        primaryComponentId:physical.primaryComponentId||component.id,
        geometryStatus:panelSpec?.panelGeometryStatus||'staged',
        geometryBlockers:clone(panelSpec?.panelGeometryBlockers||gate?.reasons||[]),
        geometryGateReady:!!gate?.ready,
        promoted:physical.panelEligible!==false&&product?.panelGeometryReady===true&&!!gate?.ready
      },
      quality:{
        physicalSourceVerified:physical.sourceStatus==='verified',
        visualPromotionReady:runtimeVisual.ready,
        terminalGeometryVerified:physical.terminalGeometryStatus==='verified',
        panelGateReady:!!gate?.ready,
        blockers:[...new Set([...(runtimeVisual.reasons||[]),...(panelSpec?.panelGeometryBlockers||gate?.reasons||[])])]
      }
    };
  }

  function registry(library=[]){
    const rows={};
    for(const component of library||[]){
      const row=record(component);
      if(row)rows[component.id]=row;
    }
    return rows;
  }

  function audit(library=[]){
    const rows=Object.values(registry(library));
    return {
      schemaVersion:1,
      mapped:rows.length,
      verifiedPhysical:rows.filter(x=>x.physical.sourceStatus==='verified').length,
      exactVisual:rows.filter(x=>x.visual.matchQuality==='exact').length,
      orthographicVisual:rows.filter(x=>x.visual.orientationStatus==='orthographic-front').length,
      visualPromotionReady:rows.filter(x=>x.visual.promotionReady).length,
      verifiedTerminalGeometry:rows.filter(x=>x.terminals.geometryStatus==='verified').length,
      verifiedProfiles:rows.filter(x=>x.physical.profileStatus==='verified').length,
      verifiedProfileColliders:rows.filter(x=>x.physical.colliderStatus==='verified-profile').length,
      activeAnchorVisualEligible:rows.filter(x=>x.terminals.activeAnchorVisualEligible).length,
      panelGateReady:rows.filter(x=>x.panel.geometryGateReady).length,
      panelPromoted:rows.filter(x=>x.panel.promoted).length,
      panelReady:rows.filter(x=>x.panel.geometryStatus==='ready').length,
      blockers:Object.fromEntries(rows.map(x=>[x.componentId,{
        visual:clone(x.visual.promotionBlockers||[]),
        panel:clone(x.panel.geometryBlockers||[])
      }]))
    };
  }

  function validate(row){
    if(!row||typeof row!=='object')return {ok:false,reason:'record'};
    if(row.schemaVersion!==1)return {ok:false,reason:'schemaVersion'};
    if(typeof row.componentId!=='string'||!row.componentId)return {ok:false,reason:'componentId'};
    if(typeof row.productKey!=='string'||!row.productKey)return {ok:false,reason:'productKey'};
    if(!row.physical||!['verified','partial','unverified','approximate'].includes(row.physical.sourceStatus))return {ok:false,reason:'physical'};
    if(!['verified','unverified'].includes(row.physical.profileStatus))return {ok:false,reason:'profileStatus'};
    if(!['verified-profile','conservative-envelope'].includes(row.physical.colliderStatus))return {ok:false,reason:'colliderStatus'};
    if(row.physical.colliderStatus==='verified-profile'&&row.physical.profileStatus!=='verified')return {ok:false,reason:'colliderProfileDependency'};
    if(row.physical.colliderStatus==='verified-profile'){
      if(typeof row.physical.colliderMethod!=='string'||!row.physical.colliderMethod)return {ok:false,reason:'colliderMethod'};
      if(!Array.isArray(row.physical.colliderProfileXZMm)||row.physical.colliderProfileXZMm.length<3||row.physical.colliderProfileXZMm.some(p=>!p||!Number.isFinite(p.x)||!Number.isFinite(p.z)))return {ok:false,reason:'colliderProfile'};
    }
    if(row.physical.profileStatus==='verified'){
      if(typeof row.physical.profileMethod!=='string'||!row.physical.profileMethod)return {ok:false,reason:'profileMethod'};
      if(typeof row.physical.profileSourceUrl!=='string'||!/^https:\/\//.test(row.physical.profileSourceUrl))return {ok:false,reason:'profileSourceUrl'};
      if(!row.physical.profileBoundsMm||![row.physical.profileBoundsMm.width,row.physical.profileBoundsMm.height,row.physical.profileBoundsMm.depth].every(v=>Number.isFinite(v)&&v>0))return {ok:false,reason:'profileBounds'};
      if(!Array.isArray(row.physical.profileEvidenceFiles)||!row.physical.profileEvidenceFiles.length)return {ok:false,reason:'profileEvidenceFiles'};
    }
    if(!row.visual||!Array.isArray(row.visual.promotionBlockers))return {ok:false,reason:'visual'};
    if(!row.terminals||!['verified','unverified','connectorized-external'].includes(row.terminals.geometryStatus))return {ok:false,reason:'terminals'};
    if(!row.simulation||!['component-runtime-mapped','unverified'].includes(row.simulation.status))return {ok:false,reason:'simulation'};
    if(!row.panel||!['ready','staged'].includes(row.panel.geometryStatus))return {ok:false,reason:'panel'};
    if(!row.quality||!Array.isArray(row.quality.blockers))return {ok:false,reason:'quality'};
    return {ok:true};
  }

  const api={record,registry,audit,validate};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSDigitalTwin=api;
})(typeof window==='undefined'?globalThis:window);
