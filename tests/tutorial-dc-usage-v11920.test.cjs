'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');

test('Doğru akım ve kullanım alanları uses the dedicated free-probe project',()=>{
 const p=fs.readFileSync(path.join(root,'dist','tutorial-pedagogy.js'),'utf8');
 assert.match(p,/function dcUsageProject\(id,title\)/);
 assert.match(p,/1 · DC kaynak · 24 V/);
 assert.match(p,/2 · Direnç yük · 100 Ω/);
 assert.match(p,/3 · Multimetre · UNI-T UT33D\+/);
 assert.match(p,/4 · Kırmızı prob/);assert.match(p,/5 · Siyah prob/);
 assert.match(p,/C\('m-red','test-probe-red'/);assert.match(p,/C\('m-black','test-probe-black'/);
 assert.match(p,/expectedCurrentA:\.24/);
 assert.match(p,/freeProbes:true/);
 assert.match(p,/l\.kind='explore'/);assert.match(p,/l\.steps=\[\]/);
 assert.match(p,/doğru akım ve kullanım alanları/);
});

test('rich DC lesson coach exposes the requested learning format',()=>{
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8');
 for(const token of ['Bu derste öğreneceksin','Devredeki elemanlar','Nasıl çalışır?','Problar serbesttir.','KISA BİLGİ · OHM KANUNU','Beklenen gözlem','Doğru akım nerelerde kullanılır?','Öğrenci görevi'])assert.ok(m.includes(token),token);
 assert.match(m,/l\.kind==='explore'\?'explore':'demo'/);
 assert.match(m,/data-tutorial-action="simulate"/);
 assert.match(m,/tutorial-pedagogy\.js\?v=1\.19\.20-pedagogy65-lm358-output/);
});

test('DC rich lesson CSS and cache chain are delivered',()=>{
 const c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8'),h=fs.readFileSync(path.join(root,'dist','index.html'),'utf8'),b=fs.readFileSync(path.join(root,'dist','tutorial-bootstrap.js'),'utf8');
 for(const token of ['tutorial-dc-probe-note','tutorial-dc-steps','tutorial-dc-law','tutorial-dc-observe','tutorial-dc-uses'])assert.ok(c.includes(token),token);
 assert.match(h,/tutorial\.css\?rev=20261010-measure-batch-c1/);
 assert.match(h,/tutorial-bootstrap\.js\?rev=20261010-measure-batch-c1/);
 assert.match(b,/tutorial-mode\.js\?v=1\.19\.20-measure-batch-c1/);
});


test('runtime curriculum resolves the exact DC usage lesson to the final explore project',()=>{
 const vm=require('node:vm');
 const ctx={console};ctx.globalThis=ctx;ctx.window=ctx;vm.createContext(ctx);
 for(const file of ['tutorial-lessons.js','tutorial-expanded-lessons.js','tutorial-pedagogy.js']){
  vm.runInContext(fs.readFileSync(path.join(root,'dist',file),'utf8'),ctx,{filename:file});
 }
 const L=ctx.DTSTutorialLessons;
 const lesson=L.lessons.find(x=>x.topicId==='dc-circuits'&&x.title.toLocaleLowerCase('tr-TR')==='doğru akım ve kullanım alanları');
 assert.ok(lesson,'exact lesson exists');
 assert.equal(lesson.id,'dc-circuits-src-01');
 assert.equal(lesson.kind,'explore');
 assert.equal(lesson.project.tutorialLesson.phase,'explore');
 assert.equal(lesson.steps.length,0);
 assert.equal(lesson.project.components.length,5);
 const byId=Object.fromEntries(lesson.project.components.map(x=>[x.id,x]));
 assert.equal(byId.g.typeId,'arduino-bench-supply');assert.equal(byId.g.dcVoltage,24);
 assert.equal(byId.r.typeId,'resistor');assert.equal(byId.r.resistance,100);
 assert.equal(byId.m.typeId,'unit-ut33d-plus');assert.equal(byId.m.meterPosition,4);
 assert.equal(byId['m-red'].typeId,'test-probe-red');assert.equal(byId['m-red'].probeTarget,undefined);
 assert.equal(byId['m-black'].typeId,'test-probe-black');assert.equal(byId['m-black'].probeTarget,undefined);
 assert.equal(lesson.project.tutorialExplore.expectedCurrentA,.24);
 assert.equal(lesson.project.tutorialExplore.freeProbes,true);
 assert.equal(lesson.pedagogyReview.version,'v1.19.20-pedagogy16-dc-rich');
});
