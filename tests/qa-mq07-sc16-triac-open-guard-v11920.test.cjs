'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const QA=require('../scripts/qa-tutorial-1655-simulation-v11920.cjs');
const source=fs.readFileSync(path.join(__dirname,'../dist/tutorial-mode.js'),'utf8');
const begin=source.indexOf('function cleanProject(l){'),end=source.indexOf('\nasync function open(id){',begin);
assert.ok(begin>=0&&end>begin,'actual open gate');
const context={clone:x=>JSON.parse(JSON.stringify(x))};vm.createContext(context);
vm.runInContext(source.slice(begin,end),context);
const lesson=QA.curriculum().byId['electronic-switching-src-16'];
test('SC16 BTA16-600B canonical TRIAC lesson opens',()=>{
 const p=context.checkedLessonProject(lesson);
 assert.ok(p.components.some(x=>x.typeId==='bta16-600b-triac'));
 assert.ok(p.wires.some(w=>w.to?.p==='MT2'));
});
test('SC16 no TRIAC must still be blocked',()=>{
 const bad=JSON.parse(JSON.stringify(lesson));
 bad.project.components=bad.project.components.filter(x=>x.typeId!=='bta16-600b-triac');
 assert.throws(()=>context.checkedLessonProject(bad),/Triyak dersi/);
});
