'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const L=QA.curriculum(),defs=QA.catalog();
const cases=[
 ['01','RS flip-flop','sn74hc00n',[/11→önceki Q korunur/,/01→Q=1/,/10→Q=0/,/00→yasak/]],
 ['02','JK flip-flop','cd4027be',[/JK=00→koru/,/01→RESET/,/10→SET/,/11→TOGGLE/]],
 ['03','D flip-flop','sn74hc74n',[/Q\\(n\\+1\\)=D/,/\\/PRE ve \\/CLR aktif-düşük/]],
 ['04','T flip-flop','cd4027be',[/J=K=T/,/T=0→Q korunur/,/T=1→Q terslenir/]],
 ['05','Asenkron yukarı sayıcı','arduino-cd4017',[/asenkron ikili ripple sayaç değildir/]],
 ['06','Senkron yukarı sayıcı','arduino-cd4017',[/3-bit senkron ikili up-counter bağlantısı.*kurulmamıştır/]],
 ['07','Johnson sayıcı','arduino-cd4017',[/Johnson sayıcı/,/Q0–Q9/]],
 ['08','0-9 yukarı sayıcı','arduino-cd4017',[/mod-10/,/BCD sayaç/]],
 ['09','Ring sayıcı','arduino-cd4017',[/Johnson sayacıdır/,/halka sayaç/]],
 ['10','Kaydedici / register','arduino-74hc595',[/SHCP\\/SRCLK/,/STCP\\/RCLK/,/\\/OE/]],
 ['11','ADC uygulaması','adc0804lcn',[/8 bit/,/\\/WR–\\/RD/]],
 ['12','DAC uygulaması','dac0808lcn',[/analog akım/,/akım-gerilim dönüştürücü/]]
];
for(const [suffix,title,chip,patterns] of cases)test('SC'+(Number(suffix)+97)+' '+title+' truthful sequential reference',()=>{
 const lesson=L.byId['digital-sequential-apps-src-'+suffix];
 assert.ok(lesson);assert.equal(lesson.title,title);
 assert.equal(lesson.kind,'quiz');assert.equal(lesson.project.wires.length,0);
 assert.ok(lesson.project.components.some(c=>c.typeId===chip),chip);assert.ok(defs[chip]);
 for(const re of patterns)assert.match(lesson.explanation,re);
 assert.equal(lesson.pedagogyReview.titleTopologyIssue,'NO_WIRED_CIRCUIT');
 assert.equal(lesson.pedagogyReview.physicalAcceptance,false);
 assert.equal(lesson.pedagogyReview.independentPedagogicalAcceptance,false);
 assert.match(lesson.explanation,/Çalışan lojik devre veya zaman diyagramı simüle edilmiş değildir/);
});
