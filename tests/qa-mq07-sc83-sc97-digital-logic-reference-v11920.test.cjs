'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),catalog=QA.catalog();
const truth={
 '01':'00→0, 01→0, 10→0, 11→1',
 '02':'00→0, 01→1, 10→1, 11→1',
 '03':'0→1, 1→0',
 '04':'/OE=0 iken Y=A; /OE=1 iken Y=Z',
 '05':'00→1, 01→1, 10→1, 11→0',
 '06':'00→1, 01→0, 10→0, 11→0',
 '07':'00→0, 01→1, 10→1, 11→0',
 '08':'00→1, 01→0, 10→0, 11→1',
 '09':'aktif düşüktür',
 '10':'seçilen tek Y hattı LOW',
 '11':'ortak katotlu',
 '12':'S2 S1 S0=000→D0',
 '13':'74HC138 kendiliğinden 1→8 tam demux değildir',
 '14':'S=A⊕B⊕Cin',
 '15':'A>B, A=B veya A<B'
};
const chips=['sn74hc08n','sn74hc32n','sn74hc04n','sn74hc125n','sn74hc00n','sn74hc02n','sn74hc86n','cd4077be',
 'sn74hc148n','sn74hc138n','arduino-cd4511','sn74hc151n','sn74hc138n','cd74hc283e','cd74hc85e'];
for(let n=1;n<=15;n++)test('SC'+(n+82)+' grounded digital reference (not live gate simulation)',()=>{
 const suffix=String(n).padStart(2,'0'),id='digital-logic-apps-src-'+suffix,lesson=L.byId[id];
 assert.ok(lesson,'missing '+id);assert.equal(lesson.kind,'quiz');assert.equal(lesson.project.wires.length,0);
 assert.ok(lesson.project.components.some(c=>c.typeId===chips[n-1]));
 for(const component of lesson.project.components)assert.ok(catalog[component.typeId],component.typeId);
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,'NO_WIRED_CIRCUIT');
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.ok(lesson.explanation.includes(truth[suffix]),id+' conceptual function');
 assert.match(lesson.explanation,/Gerçek besleme, giriş, çıkış ve gösterge bağlantısı yapılmadığından/);
 assert.ok(lesson.beginnerSteps.some(s=>s.includes('PASS verme')));
});
