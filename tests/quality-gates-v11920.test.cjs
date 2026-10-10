const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Gates=require('../scripts/quality-gates-v11920.cjs');

test('WP-013 G1 separates verified terminal geometry evidence from active orthographic anchor eligibility',()=>{
  const g=Gates.g1();
  assert.ok(g.products>=5);
  assert.ok(g.mappings>=6);
  assert.ok(g.verifiedDimensions>=5);
  assert.equal(g.verifiedTerminalGeometry,8);
  assert.equal(g.activeAnchorVisualEligible,8);
  assert.equal(g.stagedTerminalGeometry,g.mappings-g.verifiedTerminalGeometry);
  assert.equal(g.digitalTwinRecords,g.mappings);
  assert.equal(g.verifiedProfiles,3);
  assert.equal(g.verifiedProfileColliders,1);
  assert.equal(g.digitalTwinInvalid,0);
});

test('WP-013 G2 asset gate validates descriptors while keeping unknown rights explicit',()=>{
  const g=Gates.g2();
  assert.equal(g.criticalProducts,8);
  assert.equal(g.criticalOrientationAudited,8);
  assert.equal(g.selection2Total,10);
  assert.equal(g.selection2Promoted,10);
  assert.equal(g.selection2Blocked,0);
  assert.equal(g.selection2Invalid,0);
  assert.ok(g.licenseUnknown>0);
  assert.ok(g.usageRightsUnknown>0);
  assert.ok(g.manifests.plc.total>=202);
});

test('WP-013 G3 tutorial/MEB gate validates every final lesson without promoting app goals to official outcomes',()=>{
  const g=Gates.g3();
  assert.ok(g.lessons>100);
  assert.equal(g.officialOutcomeVerified,0);
  assert.ok(g.sourceVerified>0);
  assert.ok(g.sourceUnverified>0);
});

test('WP-013 G4 signed-flow gate executes the solver golden suite',()=>{
  const g=Gates.g4();
  assert.equal(g.contract,'solver-derived-signed-wire-flow');
  assert.ok(g.fail===0||g.fail===null);
});

test('WP-013 master runner emits a machine-readable build report',()=>{
  const report=Gates.main();
  assert.equal(report.ok,true);
  assert.deepEqual(report.gates.map(g=>g.name),[
    'G1-physical-terminal','G2-asset-source-orientation','G3-tutorial-meb','G4-signed-flow'
  ]);
  const file=path.join(__dirname,'../build/quality-gates.json');
  assert.ok(fs.existsSync(file));
  const saved=JSON.parse(fs.readFileSync(file,'utf8'));
  assert.equal(saved.ok,true);
  assert.equal(saved.gates.length,4);
});
