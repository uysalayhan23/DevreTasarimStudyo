'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),catalog=QA.catalog();
const titles=[
 'Bant geçiren aktif filtre','Bant durduran aktif filtre','FM verici','FM alıcı',
 'Ön yükselteç','Mikser','Bas-tiz kontrol','Eko','VU metre',
 '14 W ses yükselteci','100 W ses yükselteci'
];
for(let i=0;i<titles.length;i++)test('SC'+(72+i)+' accurate reference scope for '+titles[i],()=>{
 const id='oscillator-filter-apps-src-'+String(i+20);
 const l=L.byId[id];assert.ok(l,id);assert.equal(l.title,titles[i]);
 assert.equal(l.kind,'quiz');assert.equal(l.project.wires.length,0);
 assert.ok(l.project.components.length>=1);
 for(const c of l.project.components)assert.ok(catalog[c.typeId],c.typeId);
 assert.equal(l.pedagogyReview.titleTopologyIssue,'NO_WIRED_CIRCUIT');
 assert.equal(l.pedagogyReview.titleTopologyStatus,'REVIEW');
 assert.equal(l.pedagogyReview.physicalAcceptance,false);
 assert.equal(l.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.match(l.explanation,/yoktur|ölçülmedi|simüle edilmez|değildir/i);
 assert.ok(l.beginnerSteps.some(s=>/elektriksel PASS/.test(s)));
});
for(const id of ['oscillator-filter-apps-src-29','oscillator-filter-apps-src-30']){
 test(id+' LM358 is not falsely claimed to drive loudspeaker power',()=>{
  const lesson=L.byId[id];assert.ok(lesson.project.components.some(c=>c.typeId==='lm358p-dip8'));
  assert.match(lesson.explanation,/LM358.*tek başına süren güç katı değildir/);
 });
}
