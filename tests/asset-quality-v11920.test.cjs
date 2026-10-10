const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const Quality=require('../dist/asset-quality.js');
const PLC=require('../dist/plc-assets.js');
const Products=require('../dist/product-assets.js');
const Materials=require('../dist/material-assets.js');

test('product runtime asset registry is generated from the canonical JSON manifest',()=>{
  const manifest=JSON.parse(fs.readFileSync(require.resolve('../dist/assets/products/manifest.json'),'utf8'));
  assert.deepEqual(Products,manifest);
});

test('critical product identity audit stays seven exact and one explicit family mismatch',()=>{
  const audit=Quality.audit(Products,'product');
  assert.equal(audit.total,8);
  assert.equal(audit.matchQuality.exact,7);
  assert.equal(audit.matchQuality.family,1);
  const bj=Products['autonics-bj'];
  assert.equal(bj.match,'family');
  assert.equal(bj.sourcePart,'BJ100-DDT');
  assert.equal(bj.imagePart,'BJ1M-DDT');
  assert.notEqual(bj.sourcePart,bj.imagePart);
  for(const key of ['weidmuller-pro-top','autonics-pr','rittal-fan','siemens-green-button','siemens-contactor','siemens-auxiliary','sick-photoelectric']){
    assert.equal(Products[key].match,'exact',key);
    assert.ok(Products[key].part,key);
  }
  assert.equal(Products['siemens-auxiliary'].part,'3RH2911-1FA22');
});

test('all active asset manifests receive an explicit conservative quality descriptor',()=>{
  for(const [name,manifest] of [['plc',PLC],['product',Products],['material',Materials]]){
    const described=Quality.describeManifest(manifest,name);
    assert.equal(Object.keys(described).length,Object.keys(manifest).length,name);
    for(const [key,d] of Object.entries(described)){
      assert.deepEqual(Quality.validate(d),{ok:true},name+' '+key);
      assert.ok(d.sourceStatus,'sourceStatus '+key);
      assert.ok(d.sourceAuthority,'sourceAuthority '+key);
      assert.ok(d.orientationStatus,'orientation '+key);
      assert.ok(d.matchQuality,'match '+key);
      assert.ok(['unknown','verified','restricted','permitted'].includes(d.licenseStatus),key);
      assert.ok(['recorded','partial','unknown'].includes(d.provenanceStatus),key);
      assert.equal(typeof d.license,'string',key);
      assert.equal(typeof d.usageRights,'string',key);
      assert.ok(typeof d.attributionRequired==='boolean'||d.attributionRequired==='unknown',key);
      assert.ok(d.retrievedAt===null||typeof d.retrievedAt==='string',key);
    }
  }
});

test('PLC visual source coverage stays 202 records and unknown orientation is never silently promoted',()=>{
  const audit=Quality.audit(PLC,'plc');
  assert.equal(audit.total,202);
  assert.equal(audit.invalid.length,0);
  assert.equal(audit.matchQuality.exact,88);
  assert.equal(audit.matchQuality.family,114);
  assert.equal(audit.sourceStatus.declared,202);
  assert.equal(audit.orientationStatus.unverified||0,0);
  assert.equal(audit.orientationStatus.perspective,198);
  assert.equal(audit.orientationStatus['front-perspective'],1);
  assert.equal(audit.orientationStatus['orthographic-front'],3);
  assert.equal(audit.technicalSources,0);
  assert.equal(audit.licenseUnknown,202);
  assert.equal(audit.usageRightsUnknown,202);
  assert.equal(audit.attributionUnknown,202);
  assert.equal(audit.retrievedAtMissing,202);
  assert.equal(audit.provenanceStatus.partial,202);
  assert.ok((audit.sourceAuthority.manufacturer||0)>0);
  assert.ok((audit.sourceAuthority.supplier||0)>0);
});

test('WP-016 fourth Mitsubishi PLC pixel-audit batch stays locked',()=>{
  const expected={
    'product-plc-12-5':'orthographic-front',
    'product-plc-12-6':'orthographic-front',
    'product-plc-12-7':'perspective',
    'product-plc-12-8':'perspective',
    'product-plc-12-9':'perspective'
  };
  for(const [key,status] of Object.entries(expected)){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,status,key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
  }
});

test('WP-016 first Allen-Bradley PLC pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-13-0','product-plc-13-1','product-plc-13-2','product-plc-13-3','product-plc-13-4']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
  }
  assert.equal(PLC['product-plc-13-3'].match,'family');
  assert.equal(PLC['product-plc-13-4'].match,'family');
  assert.equal(PLC['product-plc-13-3'].imageUrl,PLC['product-plc-13-4'].imageUrl);
});

test('WP-016 second Allen-Bradley PLC pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-13-5','product-plc-13-6','product-plc-13-7','product-plc-13-8','product-plc-13-9']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
  }
  assert.equal(PLC['product-plc-13-5'].match,'family');
});

test('WP-016 third Allen-Bradley PLC pixel-audit batch stays locked',()=>{
  const expected={
    'product-plc-13-10':'perspective',
    'product-plc-13-11':'perspective',
    'product-plc-13-12':'perspective',
    'product-plc-13-13':'front-perspective',
    'product-plc-13-14':'perspective'
  };
  for(const [key,status] of Object.entries(expected)){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,status,key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
  }
});

test('WP-016 first GMT PLC pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-14-0','product-plc-14-1','product-plc-14-10','product-plc-14-11','product-plc-14-12']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
  }
});

test('WP-016 second GMT PLC pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-14-13','product-plc-14-14','product-plc-14-15','product-plc-14-16','product-plc-14-17']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
  }
});

test('WP-016 third GMT PLC pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-14-18','product-plc-14-19','product-plc-14-2','product-plc-14-20','product-plc-14-21']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
  }
});

test('WP-016 fourth GMT PLC pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-14-22','product-plc-14-3','product-plc-14-4','product-plc-14-5','product-plc-14-6']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
  }
});

test('WP-016 final GMT and first S7-300 pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-14-7','product-plc-14-8','product-plc-14-9','product-plc-2-0','product-plc-2-1']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
  }
  assert.equal(PLC['product-plc-2-0'].match,'family');
  assert.equal(PLC['product-plc-2-1'].match,'family');
});

test('WP-016 second S7-300 pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-2-10','product-plc-2-11','product-plc-2-12','product-plc-2-13','product-plc-2-14']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
    assert.equal(PLC[key].match,'family',key);
  }
});

test('WP-016 third S7-300 pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-2-2','product-plc-2-3','product-plc-2-4','product-plc-2-5','product-plc-2-6']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
    assert.equal(PLC[key].match,'family',key);
  }
});

test('WP-016 fourth S7-300 and first ET200SP pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-2-7','product-plc-2-8','product-plc-2-9','product-plc-3-0','product-plc-3-1']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
    assert.equal(PLC[key].match,'family',key);
  }
});

test('WP-016 second ET200 pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-3-10','product-plc-3-11','product-plc-3-2','product-plc-3-3','product-plc-3-4']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
    assert.equal(PLC[key].match,'family',key);
  }
});

test('WP-016 third ET200 pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-3-5','product-plc-3-6','product-plc-3-7','product-plc-3-8','product-plc-3-9']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
    assert.equal(PLC[key].match,'family',key);
  }
});

test('WP-016 first Delta PLC pixel-audit batch stays locked',()=>{
  const expected={
    'product-plc-4-0':'family',
    'product-plc-4-1':'family',
    'product-plc-4-11':'exact',
    'product-plc-4-12':'exact',
    'product-plc-4-2':'family'
  };
  for(const [key,match] of Object.entries(expected)){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
    assert.equal(PLC[key].match,match,key);
  }
});

test('WP-016 second Delta PLC pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-4-3','product-plc-4-4','product-plc-4-5','product-plc-4-6','product-plc-4-7']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
  }
  assert.equal(PLC['product-plc-4-6'].match,'family');
  assert.equal(PLC['product-plc-4-7'].match,'family');
  assert.equal(PLC['product-plc-4-6'].imageUrl,PLC['product-plc-4-7'].imageUrl);
});

test('WP-016 Delta analog and first AS PLC pixel-audit batch stays locked',()=>{
  const expected={
    'product-plc-4-8':'exact',
    'product-plc-5-0':'family',
    'product-plc-5-1':'family',
    'product-plc-5-10':'exact',
    'product-plc-5-2':'family'
  };
  for(const [key,match] of Object.entries(expected)){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
    assert.equal(PLC[key].match,match,key);
  }
});

test('WP-016 second AS PLC pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-5-3','product-plc-5-4','product-plc-5-5','product-plc-5-7','product-plc-5-8']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
    assert.equal(PLC[key].match,'family',key);
  }
});

test('WP-016 AS fieldbus and first AH PLC pixel-audit batch stays locked',()=>{
  const expected={
    'product-plc-5-9':'exact',
    'product-plc-6-0':'exact',
    'product-plc-6-1':'exact',
    'product-plc-6-2':'family',
    'product-plc-6-6':'family'
  };
  for(const [key,match] of Object.entries(expected)){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
    assert.equal(PLC[key].match,match,key);
  }
});

test('WP-016 second AH and first Omron PLC pixel-audit batch stays locked',()=>{
  for(const key of ['product-plc-6-7','product-plc-6-8','product-plc-6-9','product-plc-7-0','product-plc-7-1']){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
  }
  assert.equal(PLC['product-plc-6-7'].match,'family');
  assert.equal(PLC['product-plc-6-8'].match,'family');
  assert.equal(PLC['product-plc-6-9'].match,'family');
  assert.equal(PLC['product-plc-7-0'].match,'family');
  assert.equal(PLC['product-plc-7-1'].match,'family');
});

test('WP-016 second Omron PLC pixel-audit batch stays locked',()=>{
  const expected={
    'product-plc-7-2':'family',
    'product-plc-7-3':'exact',
    'product-plc-7-4':'exact',
    'product-plc-7-5':'exact',
    'product-plc-7-6':'exact'
  };
  for(const [key,match] of Object.entries(expected)){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
    assert.equal(PLC[key].match,match,key);
  }
});

test('WP-016 third Omron PLC pixel-audit batch stays locked',()=>{
  const expected={
    'product-plc-7-7':'exact',
    'product-plc-7-8':'exact',
    'product-plc-7-9':'exact',
    'product-plc-8-0':'family',
    'product-plc-8-1':'family'
  };
  for(const [key,match] of Object.entries(expected)){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
    assert.equal(PLC[key].match,match,key);
  }
});

test('WP-016 fourth Omron PLC pixel-audit batch stays locked',()=>{
  const expected={
    'product-plc-8-2':'family',
    'product-plc-8-3':'exact',
    'product-plc-8-4':'family',
    'product-plc-8-5':'family',
    'product-plc-8-6':'family'
  };
  for(const [key,match] of Object.entries(expected)){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
    assert.equal(PLC[key].match,match,key);
  }
});

test('WP-016 PLC corpus pixel-orientation audit is complete',()=>{
  const pending=Object.entries(PLC).filter(([key,record])=>Quality.descriptor(key,record,'plc').orientationAuditStatus!=='verified');
  assert.deepEqual(pending,[]);
  assert.equal(Object.keys(PLC).length,202);
  for(const key of ["product-plc-8-7","product-plc-8-8","product-plc-8-9","product-plc-9-0","product-plc-9-1","product-plc-9-10","product-plc-9-11","product-plc-9-2","product-plc-9-3","product-plc-9-4","product-plc-9-5","product-plc-9-6","product-plc-9-7","product-plc-9-8","product-plc-9-9"]){
    const d=Quality.descriptor(key,PLC[key],'plc');
    assert.equal(d.orientationStatus,'perspective',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-05',key);
  }
});

test('WP-016 material atlas pixel-orientation audit is complete',()=>{
  const audit=Quality.audit(Materials,'material');
  assert.equal(audit.total,48);
  assert.equal(audit.invalid.length,0);
  assert.equal(audit.orientationStatus['orthographic-front'],25);
  assert.equal(audit.orientationStatus['front-perspective'],11);
  assert.equal(audit.orientationStatus.side,7);
  assert.equal(audit.orientationStatus.perspective,4);
  assert.equal(audit.orientationStatus.unverified,1);
  const pending=Object.entries(Materials).filter(([key,record])=>Quality.descriptor(key,record,'material').orientationAuditStatus!=='verified');
  assert.deepEqual(pending,[]);
  const terminalScrew=Quality.descriptor('terminal-screw',Materials['terminal-screw'],'material');
  assert.equal(terminalScrew.orientationStatus,'unverified');
  assert.equal(terminalScrew.orientationAuditStatus,'verified');
  assert.equal(terminalScrew.orientationEvidence,'pixel-audit');
  assert.equal(terminalScrew.orientationAuditedAt,'2026-10-05');
});

test('Selection2 Siemens 5SL sidecars carry manufacturer provenance from embedded XMP evidence',()=>{
  const cases=[
    ['siemens-mcb1-v113','5SL6116-7'],
    ['siemens-mcb2-v113','5SL6216-7'],
    ['siemens-mcb3-v113','5SL6316-7']
  ];
  for(const [key,model] of cases){
    const d=Quality.descriptor(key,{},'mapped-sidecar');
    assert.equal(d.matchQuality,'exact',key);
    assert.equal(d.orientationStatus,'orthographic-front',key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.sourceStatus,'declared',key);
    assert.equal(d.sourceAuthority,'manufacturer',key);
    assert.equal(d.provenanceStatus,'recorded',key);
    assert.equal(d.retrievedAt,'2026-10-05',key);
    assert.equal(d.licenseStatus,'restricted',key);
    assert.equal(d.usageRights,'manufacturer-rights-reserved',key);
    assert.match(d.visualSourceUrl,new RegExp(model.replace(/-/g,'\\-')),key);
    assert.match(d.provenanceEvidence,/embedded-xmp: Siemens AG - Industry Sector/,key);
    const p=Quality.promotionVisual(key,{},'mapped-sidecar');
    assert.equal(p.ready,true,key);
    assert.deepEqual(p.reasons,[],key);
  }
});

test('visual source authority is distinct from exact product identity and technical evidence',()=>{
  const d=Quality.descriptor('siemens-contactor',Products['siemens-contactor'],'product');
  assert.equal(d.matchQuality,'exact');
  assert.equal(d.orientationStatus,'front-perspective');
  assert.equal(d.orientationAuditStatus,'verified');
  assert.equal(d.orientationEvidence,'pixel-audit');
  assert.equal(d.orientationAuditedAt,'2026-10-04');
  assert.equal(d.sourceStatus,'declared');
  assert.equal(d.sourceAuthority,'supplier');
  assert.match(d.visualSourceUrl,/tremtech\.com/);
  assert.ok(d.technicalSource);
  assert.equal(d.technicalSource.productKey,'siemens-3rt2016-1bb41');
  assert.equal(d.technicalSource.authority,'manufacturer');
  assert.equal(d.technicalSource.status,'verified');
  assert.match(d.technicalSource.url,/siemens\.com/);
  assert.notEqual(d.visualSourceUrl,d.technicalSource.url);
  assert.equal(d.licenseStatus,'unknown');
  assert.equal(d.license,'unknown');
  assert.equal(d.usageRights,'unknown');
  assert.equal(d.attributionRequired,'unknown');
  assert.equal(d.retrievedAt,null);
  assert.equal(d.provenanceStatus,'partial');
});

test('V20 mapped sidecar carries exact Gümrük Sepeti provenance and passes the strict visual gate',()=>{
  const d=Quality.descriptor('sinamics-v20-book',{},'mapped-sidecar');
  assert.equal(d.file,'assets/products/sinamics-v20-6sl3210-5bb21-5uv1-user-front-v2.webp');
  assert.equal(d.matchQuality,'exact');
  assert.equal(d.orientationStatus,'orthographic-front');
  assert.equal(d.orientationAuditStatus,'verified');
  assert.equal(d.orientationEvidence,'pixel-audit');
  assert.equal(d.sourceStatus,'declared');
  assert.equal(d.sourceAuthority,'other');
  assert.equal(d.catalogSourceAuthority,'supplier');
  assert.equal(d.provenanceStatus,'recorded');
  assert.equal(d.retrievedAt,'2026-10-06');
  assert.match(d.visualSourceUrl,/^user-upload:/);
  assert.match(d.provenanceEvidence,/user source SHA256 .* calibrated repo WebP SHA256 .* exact product identity independently verified by Siemens CAD\/DXF/i);
  assert.ok(d.technicalSource);
  assert.equal(d.technicalSource.productKey,'siemens-6sl3210-5bb21-5uv1');
  assert.equal(d.technicalSource.status,'verified');
  const p=Quality.promotionVisual('sinamics-v20-book',{},'mapped-sidecar');
  assert.equal(p.ready,true);
  assert.deepEqual(p.reasons,[]);
});


test('panel visual promotion requires an externally sourced exact pixel-audited orthographic-front image',()=>{
  const ready=Quality.promotionVisual('demo',{
    file:'assets/demo.png',
    source:'https://manufacturer.example/product',
    imageSource:'https://manufacturer.example/product-image',
    retrievedAt:'2026-10-05',
    match:'exact'
  },'test');
  // No pixel-audit record exists for demo, so it must stay blocked even with an external source.
  assert.equal(ready.ready,false);
  assert.ok(ready.reasons.includes('pixel-audited-orientation'));

  const currentMcb=Quality.promotionVisual('siemens-mcb1-v113',{},'mapped-sidecar');
  assert.equal(currentMcb.descriptor.matchQuality,'exact');
  assert.equal(currentMcb.descriptor.orientationStatus,'orthographic-front');
  assert.equal(currentMcb.descriptor.orientationAuditStatus,'verified');
  assert.equal(currentMcb.descriptor.sourceAuthority,'manufacturer');
  assert.equal(currentMcb.descriptor.provenanceStatus,'recorded');
  assert.match(currentMcb.descriptor.provenanceEvidence,/embedded-xmp: Siemens AG/);
  assert.equal(currentMcb.descriptor.licenseStatus,'restricted');
  assert.equal(currentMcb.ready,true);
  assert.deepEqual(currentMcb.reasons,[]);

  const contactor=Quality.promotionVisual('siemens-contactor',Products['siemens-contactor'],'product');
  assert.equal(contactor.ready,false);
  assert.ok(contactor.reasons.includes('orthographic-front'));
});

test('mapped sidecar assets preserve pixel-audited orientation without upgrading match or terminal evidence',()=>{
  const cases=[
    ['siemens-mcb1-v113','orthographic-front','exact'],
    ['siemens-mcb2-v113','orthographic-front','exact'],
    ['siemens-mcb3-v113','orthographic-front','exact'],
    ['siemens-isolator-v113','perspective','exact'],
    ['siemens-thermal-v113','perspective','exact'],
    ['sinamics-v20-book','orthographic-front','exact']
  ];
  for(const [key,orientation,match] of cases){
    const d=Quality.descriptor(key,{},'mapped-sidecar');
    assert.equal(d.orientationStatus,orientation,key);
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.matchQuality,match,key);
    assert.ok(d.technicalSource,key);
  }
  assert.equal(Quality.descriptor('siemens-mcb2-v113',{},'mapped-sidecar').orientationAuditStatus,'verified');
  assert.equal(Quality.descriptor('siemens-mcb3-v113',{},'mapped-sidecar').orientationAuditStatus,'verified');
});

test('material atlas entries without provenance are explicit missing/unknown, not guessed',()=>{
  const audit=Quality.audit(Materials,'material');
  assert.ok(audit.total>0);
  assert.equal(audit.invalid.length,0);
  assert.equal(audit.sourceStatus.missing,audit.total);
  assert.equal(audit.orientationStatus['orthographic-front'],25);
  assert.equal(audit.orientationStatus['front-perspective'],11);
  assert.equal(audit.orientationStatus.side,7);
  assert.equal(audit.orientationStatus.perspective,4);
  assert.equal(audit.orientationStatus.unverified,1);
  assert.equal(audit.licenseUnknown,audit.total);
  assert.equal(audit.usageRightsUnknown,audit.total);
  assert.equal(audit.attributionUnknown,audit.total);
  assert.equal(audit.retrievedAtMissing,audit.total);
  assert.equal(audit.provenanceStatus.unknown,audit.total);
});

test('host authority classification is conservative and does not call suppliers manufacturers',()=>{
  assert.equal(Quality.authority('https://industrial.omron.eu/x'),'manufacturer');
  assert.equal(Quality.authority('https://support.industry.siemens.com/x'),'manufacturer');
  assert.equal(Quality.authority('https://shop.ima-tec.com/x'),'supplier');
  assert.equal(Quality.authority('https://www.santaclarasystems.com/x'),'supplier');
  assert.equal(Quality.authority('https://unknown.example/x'),'other');
  assert.equal(Quality.authority(null),'other');
});

test('browser entrypoint loads quality contract after physical metadata',()=>{
  const html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8');
  const physical=html.indexOf('physical-metadata.js'),quality=html.indexOf('asset-quality.js');
  assert.ok(physical>=0&&quality>physical);
});


test('all eight critical product images have pixel-audited non-orthographic orientation',()=>{
  const audit=Quality.audit(Products,'product');
  assert.equal(audit.total,8);
  assert.equal(audit.invalid.length,0);
  assert.equal(audit.orientationStatus.perspective,5);
  assert.equal(audit.orientationStatus['front-perspective'],3);
  assert.equal(audit.orientationStatus['orthographic-front']||0,0);
  for(const [key,record] of Object.entries(Products)){
    const d=Quality.descriptor(key,record,'product');
    assert.equal(d.orientationAuditStatus,'verified',key);
    assert.equal(d.orientationEvidence,'pixel-audit',key);
    assert.equal(d.orientationAuditedAt,'2026-10-04',key);
  }
});


test('provenance fields consume manifest evidence when supplied and never infer rights from a URL',()=>{
  const d=Quality.descriptor('demo',{
    file:'assets/demo.png',
    source:'https://example.com/product',
    retrievedAt:'2026-10-04',
    license:'Example-License-1.0',
    licenseStatus:'permitted',
    licenseSourceUrl:'https://example.com/license',
    usageRights:'redistribution-permitted-with-attribution',
    attributionRequired:true,
    attributionText:'Example Corp.'
  },'test');
  assert.deepEqual(Quality.validate(d),{ok:true});
  assert.equal(d.provenanceStatus,'recorded');
  assert.equal(d.retrievedAt,'2026-10-04');
  assert.equal(d.license,'Example-License-1.0');
  assert.equal(d.licenseStatus,'permitted');
  assert.equal(d.usageRights,'redistribution-permitted-with-attribution');
  assert.equal(d.attributionRequired,true);
  assert.equal(d.attributionText,'Example Corp.');
  assert.equal(d.licenseSourceUrl,'https://example.com/license');

  const unknown=Quality.descriptor('demo',{file:'assets/demo.png',source:'https://example.com/product'},'test');
  assert.equal(unknown.provenanceStatus,'partial');
  assert.equal(unknown.license,'unknown');
  assert.equal(unknown.licenseStatus,'unknown');
  assert.equal(unknown.usageRights,'unknown');
  assert.equal(unknown.attributionRequired,'unknown');
  assert.equal(unknown.retrievedAt,null);
});
