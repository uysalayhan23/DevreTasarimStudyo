'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
function runtime(){
 const ctx={console};ctx.globalThis=ctx;ctx.window=ctx;vm.createContext(ctx);
 for(const file of ['tutorial-lessons.js','tutorial-expanded-lessons.js','tutorial-pedagogy.js'])vm.runInContext(fs.readFileSync(path.join(root,'dist',file),'utf8'),ctx,{filename:file});
 return ctx.DTSTutorialLessons;
}

test('Pillerin paralel bağlanması is a functional two-cell guided lesson',()=>{
 const L=runtime(),l=L.lessons.find(x=>x.topicId==='dc-circuits'&&x.title.toLocaleLowerCase('tr-TR')==='pillerin paralel bağlanması');
 assert.ok(l);assert.equal(l.id,'dc-circuits-src-04');assert.equal(l.kind,'wiring');assert.equal(l.project.tutorialLesson.phase,'demo');
 const c=Object.fromEntries(l.project.components.map(x=>[x.id,x]));
 assert.equal(c.b1.typeId,'tutorial-battery');assert.equal(c.b1.cellVoltage,1.5);
 assert.equal(c.b2.typeId,'tutorial-battery');assert.equal(c.b2.cellVoltage,1.5);
 assert.equal(c.r1.resistance,100);assert.equal(c.v1.typeId,'unit-ut33d-plus');assert.equal(c.v1.meterPosition,3);
 assert.deepEqual(JSON.parse(JSON.stringify(c['v1-red'].probeTarget)),{c:'b1',p:'+'});assert.deepEqual(JSON.parse(JSON.stringify(c['v1-black'].probeTarget)),{c:'b1',p:'−'});
 assert.equal(l.project.tutorialExplore.type,'battery-parallel');assert.equal(l.project.tutorialExplore.packVoltage,1.5);
 assert.equal(l.project.tutorialExplore.expectedCurrentA,.015);assert.equal(l.project.tutorialExplore.idealEqualCellShareA,.0075);
 assert.equal(l.steps.length,4);assert.equal(l.project.wires.filter(w=>w.probeLead).length,2);
 assert.equal(l.pedagogyReview.version,'v1.19.20-pedagogy20-battery-parallel-rich');
});

test('parallel battery wiring uses common positive and negative rails',()=>{
 const L=runtime(),l=L.byId['dc-circuits-src-04'],w=l.project.wires.filter(x=>!x.probeLead);
 const pairs=w.map(x=>[x.from.c,x.from.p,x.to.c,x.to.p].join(':'));
 assert.ok(pairs.includes('b1:+:b2:+'));
 assert.ok(pairs.includes('b1:−:b2:−'));
 assert.ok(pairs.includes('b1:+:r1:1'));
 assert.ok(pairs.includes('r1:2:b1:−'));
});

test('parallel rich coach teaches voltage current capacity and measurement',()=>{
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8'),c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 for(const token of ['Paralelde gerilim toplanmaz','1,5 V || 1,5 V = 1,5 V','15 mA','7,5 mA + 7,5 mA','data-battery-parallel-measure="rails"','Paralel devreyi kendin kur','Seri‑paralel bağlanmaya geç'])assert.ok(m.includes(token),token);
 for(const token of ['tutorial-parallel-diagram','tutorial-parallel-equations','tutorial-parallel-compare','tutorial-parallel-measure','tutorial-parallel-real','tutorial-parallel-current'])assert.ok(c.includes(token),token);
 assert.match(m,/tutorial-pedagogy\.js\?v=1\.19\.20-pedagogy65-lm358-output/);
});

test('parallel page cache chain is current',()=>{
 const h=fs.readFileSync(path.join(root,'dist','index.html'),'utf8'),b=fs.readFileSync(path.join(root,'dist','tutorial-bootstrap.js'),'utf8');
 assert.match(h,/tutorial\.css\?rev=20261010-measure-batch-c1/);
 assert.match(h,/tutorial-bootstrap\.js\?rev=20261010-measure-batch-c1/);
 assert.match(b,/tutorial-mode\.js\?v=1\.19\.20-measure-batch-c1/);
});
