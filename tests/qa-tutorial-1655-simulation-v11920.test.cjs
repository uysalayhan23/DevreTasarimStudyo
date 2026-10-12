'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
test('MQ-12 validates all 1655 lessons through real native electrical solver and material library',()=>{
 const result=QA.main();
 assert.equal(result.total,1655);
 assert.equal(result.rich,136);
 assert.equal(result.topicReviewed,1519);
 assert.equal(result.virtualPracticeGuides,1519);
 assert.ok(result.definitionCount>=700);
 assert.equal(result.referenceOnly+result.withWires,1655);
 assert.ok(result.withWires>500);
 assert.ok(result.componentsChecked>=result.withWires,'physical component coverage missing');
 assert.ok(result.wireEndpointsChecked>result.withWires*2,'physical terminal coverage missing');
 for(const key of ['missingDefinitions','invalidGuidedSteps','invalidWireEndpoints','blocked','shortCircuits','unstable','errors','duplicateIds'])
  assert.equal(result[key].length,0,key+': '+JSON.stringify(result[key].slice(0,12)));
 assert.equal(result.tested,result.withWires);
 assert.equal(result.status,'PASS');
});
