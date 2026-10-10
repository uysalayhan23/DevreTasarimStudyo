#!/usr/bin/env node
'use strict';

const fs=require('node:fs');
const path=require('node:path');
const PLC=require('../dist/plc-assets.js');
const Products=require('../dist/product-assets.js');
const Materials=require('../dist/material-assets.js');
const Physical=require('../dist/physical-metadata.js');
const Quality=require('../dist/asset-quality.js');

const ROOT=path.resolve(__dirname,'..');
const BUILD=path.join(ROOT,'build');

function item(manifestName,assetKey,record={}){
  const d=Quality.descriptor(assetKey,record,manifestName);
  return {
    manifest:manifestName,
    assetKey,
    file:d.file,
    matchQuality:d.matchQuality,
    orientationStatus:d.orientationStatus,
    orientationAuditStatus:d.orientationAuditStatus,
    sourceStatus:d.sourceStatus,
    sourceAuthority:d.sourceAuthority,
    provenanceStatus:d.provenanceStatus,
    visualSourceUrl:d.visualSourceUrl,
    technicalSourceStatus:d.technicalSourceStatus,
    technicalSourceAuthority:d.technicalSource?.authority||null,
    pixelAuditRequired:d.orientationAuditStatus!=='verified',
    sourceReviewRequired:d.sourceStatus==='missing'||d.provenanceStatus==='unknown',
    exactModelRisk:d.matchQuality!=='exact'
  };
}

function audit(){
  const manifests=[['plc',PLC],['product',Products],['material',Materials]];
  const rows=[];
  for(const [name,manifest] of manifests)for(const [key,record] of Object.entries(manifest||{}))rows.push(item(name,key,record));
  const productKeys=new Set(Object.keys(Products||{}));
  const mappedAssets=[...new Set(Object.values(Physical.componentMap||{}).map(m=>m.assetKey).filter(Boolean))];
  for(const key of mappedAssets)if(!productKeys.has(key))rows.push(item('mapped-sidecar',key,{}));

  const unique=new Map();
  for(const row of rows){
    const k=row.manifest+':'+row.assetKey;
    if(!unique.has(k))unique.set(k,row);
  }
  const all=[...unique.values()];
  const queue=all.filter(r=>r.pixelAuditRequired||r.sourceReviewRequired||r.exactModelRisk)
    .sort((a,b)=>{
      const pa=(a.manifest==='mapped-sidecar'?0:a.manifest==='product'?1:a.manifest==='plc'?2:3);
      const pb=(b.manifest==='mapped-sidecar'?0:b.manifest==='product'?1:b.manifest==='plc'?2:3);
      return pa-pb||Number(a.pixelAuditRequired)-Number(b.pixelAuditRequired)||a.assetKey.localeCompare(b.assetKey);
    });
  const count=(field,value=true)=>all.filter(r=>r[field]===value).length;
  const byManifest=Object.fromEntries([...new Set(all.map(r=>r.manifest))].map(name=>[name,{
    total:all.filter(r=>r.manifest===name).length,
    pixelAudited:all.filter(r=>r.manifest===name&&r.orientationAuditStatus==='verified').length,
    pixelAuditPending:all.filter(r=>r.manifest===name&&r.pixelAuditRequired).length,
    sourceReviewPending:all.filter(r=>r.manifest===name&&r.sourceReviewRequired).length,
    exactModelRisk:all.filter(r=>r.manifest===name&&r.exactModelRisk).length
  }]));
  return {
    version:'v1.19.20-visual-corpus-audit1',
    generatedAt:new Date().toISOString(),
    totals:{
      records:all.length,
      pixelAudited:all.length-count('pixelAuditRequired'),
      pixelAuditPending:count('pixelAuditRequired'),
      sourceReviewPending:count('sourceReviewRequired'),
      exactModelRisk:count('exactModelRisk'),
      queue:queue.length
    },
    byManifest,
    mappedAssets,
    queue
  };
}

function main(){
  const report=audit();
  fs.mkdirSync(BUILD,{recursive:true});
  fs.writeFileSync(path.join(BUILD,'visual-corpus-audit.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
  return report;
}

if(require.main===module)main();
module.exports={item,audit,main};
