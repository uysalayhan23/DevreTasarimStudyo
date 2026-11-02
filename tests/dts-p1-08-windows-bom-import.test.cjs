'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const ProgramIO=require('../dist/ladder-program-io.js');
const L=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4};
const draft=()=>L.blank();
const text=()=>ProgramIO.serialize(draft(),limits,'DTS Öğrenme');
const withBom=value=>'\uFEFF'+value;

test('P1-08 positive: exported Ladder program can be reopened without BOM',()=>{
 assert.deepEqual(ProgramIO.parse(text(),limits),draft());
});
test('P1-08 negative: Windows UTF-8 BOM .dtsladder file reopens with the same electrical program',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'dts-lad-bom-'));
 try{
  const filename=path.join(tmp,'ladder.dtsladder');
  const original=text();
  fs.writeFileSync(filename,withBom(original),'utf8');
  const raw=fs.readFileSync(filename,'utf8');
  assert.equal(fs.readFileSync(filename)[0],0xEF);
  assert.deepEqual(ProgramIO.parse(raw,limits),ProgramIO.parse(original,limits));
 }finally{fs.rmSync(tmp,{recursive:true,force:true})}
});
test('P1-08 negative: BOM and Windows CRLF remain importable without electrical changes',()=>{
 const raw=withBom(text().replace(/\n/g,'\r\n'));
 assert.deepEqual(ProgramIO.parse(raw,limits),draft());
});
test('P1-08 negative: BOM before valid imported comments retains comments and coil',()=>{
 const p=draft();p.rungs[0].comment='Giriş kilidi';
 const serialized=ProgramIO.serialize(p,limits,'PLC');
 assert.deepEqual(ProgramIO.parse(withBom(serialized),limits),p);
});
test('P1-08 positive: original whitespace-padded JSON is still accepted',()=>{
 assert.deepEqual(ProgramIO.parse(' \n'+text()+'\r\n',limits),draft());
});
test('P1-08 positive: original invalid JSON is still rejected',()=>{
 assert.throws(()=>ProgramIO.parse('{bad',limits),/JSON değil/);
});
test('P1-08 negative: BOM does not make invalid JSON importable',()=>{
 assert.throws(()=>ProgramIO.parse(withBom('{bad'),limits),/JSON değil/);
});
test('P1-08 negative: two BOM characters remain invalid',()=>{
 assert.throws(()=>ProgramIO.parse(withBom(withBom(text())),limits),/JSON değil/);
});
test('P1-08 negative: misplaced BOM after JSON whitespace is not ignored',()=>{
 assert.throws(()=>ProgramIO.parse(' \n'+withBom(text()),limits),/JSON değil/);
});
test('P1-08 negative: BOM does not bypass DTS file-format signature',()=>{
 const value=JSON.parse(text());value.format='third-party';
 assert.throws(()=>ProgramIO.parse(withBom(JSON.stringify(value)),limits),/DTS Ladder V1/);
});
test('P1-08 negative: BOM does not bypass native input limits',()=>{
 const value=JSON.parse(text());value.program.rungs[0].paths[0][0].ref='I7';
 assert.throws(()=>ProgramIO.parse(withBom(JSON.stringify(value)),limits),/Ladder programı doğrulanamadı/);
});
test('P1-08 negative: BOM does not bypass 512-KB file limit',()=>{
 const max=ProgramIO.maxBytes;
 assert.throws(()=>ProgramIO.parse(withBom(text()+' '.repeat(max)),limits),/fazla büyük/);
});
