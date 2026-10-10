#!/usr/bin/env node
'use strict';

const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {spawnSync}=require('node:child_process');

const ROOT=path.resolve(__dirname,'..');
const BUILD=path.join(ROOT,'build');
const Physical=require('../dist/physical-metadata.js');
const DigitalTwin=require('../dist/digital-twin.js');
const AssetQuality=require('../dist/asset-quality.js');
const PLC=require('../dist/plc-assets.js');
const Products=require('../dist/product-assets.js');
const Materials=require('../dist/material-assets.js');
const Curriculum=require('../dist/tutorial-curriculum.js');
const Selection2Queue=require('../docs/SELECTION2_PRODUCT_REPLACEMENT_QUEUE_V1.19.20.json');

function fail(message,details){const e=Error(message);e.details=details;throw e}
function gate(name,fn){
  try{return {name,ok:true,...fn()}}
  catch(e){return {name,ok:false,error:e.message,details:e.details||null}}
}
function finalLessons(){
  const outline=require('../dist/tutorial-source-outline.js');
  const clone=JSON.parse(JSON.stringify(outline));
  const ctx={window:{DTSTutorialLessons:clone}};
  vm.runInNewContext(fs.readFileSync(path.join(ROOT,'dist','tutorial-pedagogy.js'),'utf8'),ctx,{filename:'tutorial-pedagogy.js'});
  Curriculum.apply(ctx.window.DTSTutorialLessons);
  return ctx.window.DTSTutorialLessons;
}
function g1(){
  const invalidProducts=Object.entries(Physical.products).map(([key,v])=>({key,result:Physical.validateProduct(v)})).filter(x=>!x.result.ok);
  const invalidMappings=Object.entries(Physical.componentMap).map(([key,v])=>({key,result:Physical.validateMapping(v)})).filter(x=>!x.result.ok);
  if(invalidProducts.length||invalidMappings.length)fail('G1 physical metadata contract invalid',{invalidProducts,invalidMappings});
  const syntheticLibrary=Object.entries(Physical.componentMap).map(([id,m])=>({
    id,
    [m.assetIdentityField||'materialAsset']:m.assetIdentityValue||m.assetKey,
    materialAsset:m.assetKey,
    pins:Array.isArray(m.panelTerminals)?m.panelTerminals.map(x=>({id:x.id})):undefined
  }));
  const twinRegistry=DigitalTwin.registry(syntheticLibrary);
  const invalidTwin=Object.values(twinRegistry).map(row=>({row,result:DigitalTwin.validate(row)})).filter(x=>!x.result.ok);
  if(invalidTwin.length)fail('G1 digital twin contract invalid',invalidTwin.map(x=>({componentId:x.row.componentId,reason:x.result.reason})));
  for(const [id,m] of Object.entries(Physical.componentMap)){
    if(!Physical.products[m.productKey])fail('G1 mapping references missing product',{componentId:id,productKey:m.productKey});
    if(m.terminalGeometryStatus==='verified'&&(m.visualMatchStatus!=='exact'||!/^https:\/\//.test(String(m.terminalSourceUrl||'')))){
      fail('G1 verified terminal geometry evidence lacks exact product identity or HTTPS technical source',{componentId:id});
    }
  }
  return {
    products:Object.keys(Physical.products).length,
    mappings:Object.keys(Physical.componentMap).length,
    verifiedDimensions:Object.values(Physical.products).filter(x=>x.sourceStatus==='verified').length,
    verifiedTerminalGeometry:Object.values(Physical.componentMap).filter(x=>x.terminalGeometryStatus==='verified').length,
    activeAnchorVisualEligible:Object.values(twinRegistry).filter(x=>x.terminals.activeAnchorVisualEligible).length,
    stagedTerminalGeometry:Object.values(Physical.componentMap).filter(x=>x.terminalGeometryStatus!=='verified').length,
    verifiedProfiles:Object.values(Physical.products).filter(x=>x.profileStatus==='verified').length,
    verifiedProfileColliders:Object.values(Physical.products).filter(x=>x.colliderStatus==='verified-profile').length,
    digitalTwinRecords:Object.keys(twinRegistry).length,
    digitalTwinInvalid:invalidTwin.length
  };
}
function g2(){
  const manifests=[['plc',PLC],['product',Products],['material',Materials]];
  const audits=Object.fromEntries(manifests.map(([name,m])=>[name,AssetQuality.audit(m,name)]));
  const invalid=Object.entries(audits).flatMap(([name,a])=>a.invalid.map(x=>({manifest:name,...x})));
  if(invalid.length)fail('G2 asset quality descriptors invalid',invalid);
  const critical=Object.entries(Products).map(([key,record])=>AssetQuality.descriptor(key,record,'product'));
  const unauditedCritical=critical.filter(d=>d.orientationAuditStatus!=='verified').map(d=>d.assetKey);
  if(unauditedCritical.length)fail('G2 critical product orientation audit missing',unauditedCritical);
  const falseOrthographic=critical.filter(d=>d.orientationStatus==='orthographic-front'&&!AssetQuality.orientationAudit[d.assetKey]).map(d=>d.assetKey);
  if(falseOrthographic.length)fail('G2 orthographic claim lacks pixel audit',falseOrthographic);
  const promoted=[];
  for(const [componentId,m] of Object.entries(Physical.componentMap)){
    const p=Physical.products[m.productKey];
    if(p?.panelGeometryReady!==true)continue;
    const component={id:componentId,[m.assetIdentityField||'materialAsset']:m.assetIdentityValue||m.assetKey,materialAsset:m.assetKey,pins:Array.isArray(m.panelTerminals)?m.panelTerminals.map(x=>({id:x.id})):[]};
    const twin=DigitalTwin.record(component);
    if(!twin?.visual?.promotionReady)promoted.push({componentId,productKey:m.productKey,assetKey:m.assetKey,policyId:twin?.visual?.policyId||null,reasons:twin?.visual?.promotionBlockers||['digital-twin-visual-unavailable']});
  }
  if(promoted.length)fail('G2 panel-ready product lacks accepted sourced runtime visual policy evidence',promoted);
  const selection2Invalid=[];
  let selection2Promoted=0,selection2Blocked=0;
  for(const productKey of Selection2Queue.order||[]){
    const row=Selection2Queue.products?.[productKey],product=Physical.products[productKey];
    if(!row||!product){selection2Invalid.push({productKey,reason:!row?'queue-record':'physical-product'});continue}
    const expectedPromoted=row.status==='promoted';
    if(expectedPromoted)selection2Promoted++;else selection2Blocked++;
    if(product.panelGeometryReady!==expectedPromoted){
      selection2Invalid.push({productKey,reason:'promotion-state-mismatch',queueStatus:row.status,panelGeometryReady:product.panelGeometryReady});
    }
    if(expectedPromoted&&(!Array.isArray(row.blockers)||row.blockers.length!==0)){
      selection2Invalid.push({productKey,reason:'promoted-has-blockers',blockers:row.blockers});
    }
    if(!expectedPromoted&&(!Array.isArray(row.blockers)||row.blockers.length===0)){
      selection2Invalid.push({productKey,reason:'blocked-without-blockers'});
    }
  }
  if(selection2Invalid.length)fail('G2 Selection2 replacement queue conflicts with physical promotion truth',selection2Invalid);
  return {
    manifests:Object.fromEntries(Object.entries(audits).map(([k,a])=>[k,{total:a.total,sourceStatus:a.sourceStatus,orientationStatus:a.orientationStatus,matchQuality:a.matchQuality,provenanceStatus:a.provenanceStatus}])),
    criticalProducts:critical.length,
    criticalOrientationAudited:critical.length-unauditedCritical.length,
    panelReadyVisualPolicy:'exact-source+accepted-runtime-policy (orthographic-front | derived-front | sensor-flex)',
    selection2Total:(Selection2Queue.order||[]).length,
    selection2Promoted,
    selection2Blocked,
    selection2Invalid:selection2Invalid.length,
    licenseUnknown:Object.values(audits).reduce((n,a)=>n+a.licenseUnknown,0),
    usageRightsUnknown:Object.values(audits).reduce((n,a)=>n+a.usageRightsUnknown,0)
  };
}
function g3(){
  const L=finalLessons(),audit=Curriculum.audit(L);
  if(!Array.isArray(L.lessons)||L.lessons.length<100)fail('G3 tutorial curriculum unexpectedly small',{lessons:L.lessons?.length||0});
  if(audit.invalid.length)fail('G3 tutorial/MEB metadata invalid',audit.invalid);
  for(const l of L.lessons){
    const r=Curriculum.validateLesson(L,l);if(!r.ok)fail('G3 lesson invalid',{id:l.id,reason:r.reason});
    if(l.meb?.outcome?.status==='verified'&&(!l.meb.outcome.code||!l.meb.outcome.text))fail('G3 false verified MEB outcome',{id:l.id});
  }
  return {lessons:audit.total,sourceVerified:audit.sourceVerified,sourcePartial:audit.sourcePartial,sourceUnverified:audit.sourceUnverified,officialOutcomeVerified:audit.officialOutcomeVerified,appPrerequisites:audit.appPrerequisites};
}
function g4(){
  const r=spawnSync(process.execPath,['--test','tests/signed-flow-v11920.test.cjs'],{cwd:ROOT,encoding:'utf8',maxBuffer:4*1024*1024});
  if(r.error||r.status!==0)fail('G4 signed-flow golden tests failed',{status:r.status,error:r.error?.message||null,stdout:r.stdout?.slice(-6000)||'',stderr:r.stderr?.slice(-6000)||''});
  const text=(r.stdout||'')+'\n'+(r.stderr||'');
  const matches=[...text.matchAll(/# tests (\d+)|# pass (\d+)|# fail (\d+)/g)];
  const stats={tests:null,pass:null,fail:null};
  for(const m of matches){if(m[1])stats.tests=Number(m[1]);if(m[2])stats.pass=Number(m[2]);if(m[3])stats.fail=Number(m[3])}
  return {...stats,contract:'solver-derived-signed-wire-flow'};
}
function main(){
  const gates=[gate('G1-physical-terminal',g1),gate('G2-asset-source-orientation',g2),gate('G3-tutorial-meb',g3),gate('G4-signed-flow',g4)];
  const report={version:'v1.19.20-quality-gates1',generatedAt:new Date().toISOString(),ok:gates.every(g=>g.ok),gates};
  fs.mkdirSync(BUILD,{recursive:true});fs.writeFileSync(path.join(BUILD,'quality-gates.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
  if(!report.ok)process.exitCode=1;
  return report;
}
if(require.main===module)main();
module.exports={g1,g2,g3,g4,main,finalLessons};
