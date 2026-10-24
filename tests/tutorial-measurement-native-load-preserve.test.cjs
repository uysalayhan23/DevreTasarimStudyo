'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dist=path.resolve(__dirname,'../dist');
const source=require('../dist/tutorial-source-outline.js');
const run=(L,name)=>vm.runInNewContext(fs.readFileSync(path.join(dist,name),'utf8'),{window:{DTSTutorialLessons:L}},{filename:name});
const clone=o=>JSON.parse(JSON.stringify(o));
const names=[3,4,5,6,7,10].map(n=>'measurement-workshop-src-'+String(n).padStart(2,'0'));
test('legacy placeholder sources retain measured UNI-T upgrade path',()=>{
 const L=clone(source);
 run(L,'tutorial-measurement-native-batch-p.js');
 assert.equal(L._nativeMeasurementBatchP,true);
 assert.notEqual(L._nativeMeasurementBatchPRichPreserved,true);
 for(const id of names){const l=L.byId[id];assert.ok(l.project.components.some(c=>/unit-|energy-analyzer|proximity/.test(c.typeId)),id);}
});
test('already-specialized UNI-T measurement sources are not destructively rebuilt',()=>{
 const L=clone(source);
 for(const name of ['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js'])run(L,name);
 const before=JSON.stringify(names.map(id=>L.byId[id]));
 run(L,'tutorial-measurement-native-batch-p.js');
 assert.equal(L._nativeMeasurementBatchP,true);assert.equal(L._nativeMeasurementBatchPRichPreserved,true);
 assert.equal(JSON.stringify(names.map(id=>L.byId[id])),before);
});
test('unknown partially changed measurement graph fails closed',()=>{
 const L=clone(source);for(const name of ['tutorial-pedagogy.js','tutorial-measurement-batch-a.js','tutorial-measurement-batch-b.js'])run(L,name);
 L.byId[names[0]].project.components=L.byId[names[0]].project.components.filter(c=>c.typeId!=='unit-ut33d-plus');
 assert.throws(()=>run(L,'tutorial-measurement-native-batch-p.js'),/Unexpected protected lesson source/);
});
