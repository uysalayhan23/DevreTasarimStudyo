const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Audit=require('../scripts/visual-corpus-audit-v11920.cjs');

test('WP-016 visual corpus audit inventories manifests and mapped sidecars without hiding unaudited assets',()=>{
  const r=Audit.audit();
  assert.equal(r.version,'v1.19.20-visual-corpus-audit1');
  assert.equal(r.totals.records,266);
  assert.equal(r.totals.pixelAudited,264);
  assert.equal(r.totals.pixelAuditPending,2);
  assert.equal(r.totals.sourceReviewPending,52);
  assert.equal(r.totals.exactModelRisk,163);
  assert.equal(r.byManifest.plc.total,202);
  assert.equal(r.byManifest.plc.pixelAudited,202);
  assert.equal(r.byManifest.plc.pixelAuditPending,0);
  assert.equal(r.byManifest.product.total,8);
  assert.equal(r.byManifest.product.pixelAudited,8);
  assert.equal(r.byManifest.material.total,48);
  assert.equal(r.byManifest.material.pixelAudited,48);
  assert.equal(r.byManifest.material.pixelAuditPending,0);
  assert.equal(r.byManifest['mapped-sidecar'].total,8);
  assert.equal(r.byManifest['mapped-sidecar'].pixelAudited,6);
  assert.equal(r.byManifest['mapped-sidecar'].pixelAuditPending,2);
  const pending=r.queue.filter(row=>row.manifest==='mapped-sidecar'&&['ordel-top-v115','weid-front-v115'].includes(row.assetKey));
  assert.equal(pending.length,2,'new mapped sidecars remain visible, not falsely pixel-audited');
});

test('WP-016 resolved exact panel sidecars leave the audit queue while unresolved sidecars remain visible',()=>{
  const r=Audit.audit();
  for(const key of ['sinamics-v20-book','siemens-isolator-v113','siemens-thermal-v113','siemens-mcb1-v113','siemens-mcb2-v113','siemens-mcb3-v113']){
    assert.ok(r.mappedAssets.includes(key),key);
  }
  const byKey=Object.fromEntries(r.queue.map(x=>[x.manifest+':'+x.assetKey,x]));
  assert.equal(byKey['mapped-sidecar:siemens-mcb1-v113'],undefined);
  assert.equal(byKey['mapped-sidecar:siemens-mcb2-v113'],undefined);
  assert.equal(byKey['mapped-sidecar:siemens-mcb3-v113'],undefined);
  assert.equal(byKey['mapped-sidecar:sinamics-v20-book'],undefined);
});

test('WP-016 audit main writes a machine-readable queue report',()=>{
  const r=Audit.main();
  const file=path.join(__dirname,'../build/visual-corpus-audit.json');
  assert.ok(fs.existsSync(file));
  const saved=JSON.parse(fs.readFileSync(file,'utf8'));
  assert.equal(saved.totals.records,r.totals.records);
  assert.equal(saved.totals.queue,r.totals.queue);
  assert.ok(saved.queue.length>0);
});
