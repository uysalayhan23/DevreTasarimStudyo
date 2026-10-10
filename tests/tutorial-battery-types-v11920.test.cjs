'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
function runtime(){
 const ctx={console};ctx.globalThis=ctx;ctx.window=ctx;vm.createContext(ctx);
 for(const file of ['tutorial-lessons.js','tutorial-expanded-lessons.js','tutorial-pedagogy.js'])vm.runInContext(fs.readFileSync(path.join(root,'dist',file),'utf8'),ctx,{filename:file});
 return ctx.DTSTutorialLessons;
}

test('Pil ve akü tipleri is supplemental and preserves the official 10 DC lessons',()=>{
 const L=runtime(),official=L.lessons.filter(x=>x.topicId==='dc-circuits'),l=L.byId['dc-battery-types-rich'];
 assert.equal(official.length,10);assert.ok(l);assert.equal(l.title,'Pil ve akü tipleri');assert.equal(l.kind,'explore');
 assert.ok(!official.some(x=>x.id===l.id),'supplement must not change the 10-lesson DC list');
 assert.equal(l.project.components.length,8);assert.equal(l.project.tutorialLesson.phase,'explore');
 const c=Object.fromEntries(l.project.components.map(x=>[x.id,x]));
 assert.equal(c.ba.typeId,'tutorial-battery-alkaline');assert.equal(c.ba.cellVoltage,1.5);
 assert.equal(c.bn.typeId,'tutorial-battery-nimh');assert.equal(c.bn.cellVoltage,1.2);
 assert.equal(c.bl.typeId,'tutorial-battery-liion');assert.equal(c.bl.cellVoltage,3.7);
 assert.equal(c.bk.typeId,'tutorial-battery-leadacid');assert.equal(c.bk.cellVoltage,12);
 assert.equal(c.r1.resistance,1000);assert.equal(c.m.meterPosition,3);
 assert.equal(l.project.tutorialExplore.virtualOnly,true);assert.equal(l.project.tutorialExplore.batteryTypes.length,4);
 assert.equal(l.pedagogyReview.version,'v1.19.20-pedagogy19-battery-types-rich');
});

test('battery type visuals are dedicated functional source components',()=>{
 const tc=fs.readFileSync(path.join(root,'dist','tutorial-components.js'),'utf8'),m=fs.readFileSync(path.join(root,'dist','materials.js'),'utf8');
 for(const id of ['tutorial-battery-alkaline','tutorial-battery-nimh','tutorial-battery-liion','tutorial-battery-leadacid'])assert.ok(tc.includes(id),id);
 for(const v of ["defaultVoltage:1.5","defaultVoltage:1.2","defaultVoltage:3.7","defaultVoltage:12"])assert.ok(tc.includes(v),v);
 for(const token of ['ALKALİN','NiMH','Li-ion','KURŞUN-ASİT','battery-type-cylinder','battery-type-leadacid'])assert.ok(m.includes(token),token);
});

test('rich battery-type page includes measurement load comparison and clear navigation',()=>{
 const m=fs.readFileSync(path.join(root,'dist','tutorial-mode.js'),'utf8'),c=fs.readFileSync(path.join(root,'dist','tutorial.css'),'utf8');
 for(const token of ['PİL VE AKÜ TİPLERİ','Üç büyüklüğü birbirine karıştırma','data-battery-type-measure="ba"','data-battery-type-load="bk"','Wh = V × Ah','Pillerin paralel bağlanmasına geç','dc-battery-types-rich'])assert.ok(m.includes(token),token);
 for(const token of ['tutorial-battery-types-grid','tutorial-battery-types-metrics','tutorial-battery-types-measure','tutorial-battery-types-load','tutorial-battery-types-safety'])assert.ok(c.includes(token),token);
 assert.match(m,/tutorial-pedagogy\.js\?v=1\.19\.20-pedagogy65-lm358-output/);
});

test('battery type cache chain is current',()=>{
 const h=fs.readFileSync(path.join(root,'dist','index.html'),'utf8'),b=fs.readFileSync(path.join(root,'dist','tutorial-bootstrap.js'),'utf8');
 assert.match(h,/tutorial\.css\?rev=20261010-measure-batch-a1/);
 assert.match(h,/tutorial-components\.js\?rev=20261009-energy-rich1/);
 assert.match(h,/materials\.js\?rev=20261010-real-visuals1/);
 assert.match(h,/tutorial-bootstrap\.js\?rev=20261010-lm358-output1/);
 assert.match(b,/tutorial-mode\.js\?v=1\.19\.20-measure-batch-a1/);
});
