'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const {audit}=require('../scripts/qa-tutorial-pedagogical-depth-v11920.cjs');
test('full 1655 lesson scan remains REVIEW, never invents completion',()=>{
 const result=audit();
 assert.equal(result.lessons,1655);
 assert.equal(result.rich,136);
 assert.equal(result.pedagogyPending,1519);
 assert.equal(result.fullPedagogicalAcceptance,false);
 assert.equal(result.fullWindowsVisualAcceptance,false);
 assert.equal(result.status,'REVIEW');
 assert.ok(result.counts.genericSummary>0);
 assert.equal(result.counts.wiredNtcWithoutSensor,0);
 const current=QA.curriculum().byId['opamp-apps-src-08'];
 assert.ok(current.project.components.some(c=>c.typeId==='sensor-ntc'));
});
test('fake NTC and generic lesson copy are detected without accepting a source-only sample',()=>{
 const L={lessons:[{
  id:'bad-ntc',title:'NTC’li karşılaştırıcı',kind:'wiring',
  summary:'X elemanları arasındaki 12 gerçek terminal bağlantısını gösterir.',
  explanation:'Gerçek bağlantı adımları: X → Y',
  materials:[{label:'X',why:'Bu eleman ders başlığındaki gerçek işlevi doğrudan göstermek için seçildi'}],
  project:{components:[{typeId:'potentiometer'}],wires:[{}]},
  practiceGuide:{pedagogicalAcceptance:false}
 }]};
 const report=audit({L});
 assert.deepEqual(report.issues.wiredNtcWithoutSensor,['bad-ntc']);
 assert.deepEqual(report.issues.genericSummary,['bad-ntc']);
 assert.deepEqual(report.issues.genericExplanation,['bad-ntc']);
 assert.deepEqual(report.issues.genericMaterialPurpose,['bad-ntc']);
 assert.equal(report.fullPedagogicalAcceptance,false);
 assert.equal(report.status,'REVIEW');
});
