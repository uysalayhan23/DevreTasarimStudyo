'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const L=require('../dist/ladder-runtime.js'),E=require('../dist/ladder-editor.js');
const fs=require('node:fs'),path=require('node:path');
const p=L.blank(),lim={inputCount:6,outputCount:4},mem={};
const trace=L.scan(p,{I1:true},mem,0,lim).traces;
test('native scan failure hides old active contacts and coil value',()=>{
 const x=E.monitorRows(p,p,trace,true,'dts-ladder-v1',true,'Native scan failed')[0];
 assert.equal(x.active,false);assert.equal(x.value,null);assert.equal(x.pathStates,null);
 assert.equal(x.status,'PLC taraması başarısız');assert.equal(E.signalText(x),'—');
});
test('valid live scan still shows active Network without false fault',()=>{
 const x=E.monitorRows(p,p,trace,true,'dts-ladder-v1',true,null)[0];
 assert.equal(x.active,true);assert.equal(x.value,true);assert.deepEqual(x.pathStates,[true]);
 assert.equal(x.status,'AKTİF');
});
test('stopped PLC remains stopped even if previous scan had an error',()=>{
 const x=E.monitorRows(p,p,trace,false,'dts-ladder-v1',false,'Failed')[0];
 assert.equal(x.status,'Simülasyon kapalı');assert.equal(x.value,null);
});
test('empty native error does not disable a valid live program',()=>{
 const x=E.monitorRows(p,p,trace,true,'dts-ladder-v1',true,'   ')[0];
 assert.equal(x.active,true);assert.equal(x.value,true);
});
test('initial Ladder/FBD render and 300 ms updates both gate old trace bits',()=>{
 const s=fs.readFileSync(path.join(__dirname,'../dist/ladder-editor.js'),'utf8');
 assert.equal((s.match(/active\.c\._plcRuntime\?\.powered,active\.c\._dtsLadderError/g)||[]).length,2);
 assert.match(s,/const liveBits=live&&active\.c\._plcRuntime\?\.powered===true&&active\.c\._plcRuntime\?\.program===\x27dts-ladder-v1\x27&&!active\.c\._dtsLadderError/);
 assert.match(s,/const bits=shown&&active\.c\._plcRuntime\?\.powered===true&&active\.c\._plcRuntime\?\.program===\x27dts-ladder-v1\x27&&!active\.c\._dtsLadderError/);
});
test('offline editor includes updated asset revision',()=>{
 const h=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
 assert.match(h,/ladder-editor\.js\?rev=[a-zA-Z0-9_-]+/);
});
