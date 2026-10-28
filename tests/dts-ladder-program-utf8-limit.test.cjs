'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const IO=require('../dist/ladder-program-io.js'),L=require('../dist/ladder-runtime.js');
const limits={inputCount:6,outputCount:4},program=L.blank();
const payload=extra=>JSON.stringify({format:IO.format,version:1,program,extra});
test('small UTF-8 Ladder import is accepted',()=>assert.deepEqual(IO.parse(payload('Türkçe 汉字'),limits),program));
test('multi-byte import exceeding bytes but not JS string length is rejected',()=>{
 const raw=payload('汉'.repeat(210000));
 assert.ok(raw.length<IO.maxBytes);
 assert.throws(()=>IO.parse(raw,limits),/fazla büyük/);
});
test('supplementary unicode import is rejected by real byte size',()=>{
 const raw=payload('😀'.repeat(140000));
 assert.ok(raw.length<IO.maxBytes);
 assert.throws(()=>IO.parse(raw,limits),/fazla büyük/);
});
test('oversized ASCII import is rejected',()=>assert.throws(()=>IO.parse(payload('x'.repeat(IO.maxBytes)),limits),/fazla büyük/));
test('valid offline export and import round-trip still works',()=>{
 assert.deepEqual(IO.parse(IO.serialize(program,limits),limits),program);
});
