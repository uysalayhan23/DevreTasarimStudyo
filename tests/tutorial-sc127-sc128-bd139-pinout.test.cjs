'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=x=>fs.readFileSync(path.join(__dirname,'../dist',x),'utf8');
test('SC127/128 BD139 low-side motor topology matches catalog B1 C2 E3',()=>{
 const catalog=read('arduino-library.js'),source=read('tutorial-expanded-lessons.js');
 assert.match(catalog,/part\('arduino-bd139'[\s\S]*?pinMap:\{'1':'B','2':'C','3':'E'\}/);
 const segment=source.slice(source.indexOf('function transistorProject(){'),source.indexOf('function timer555Project(){'));
 assert.ok(segment.length>100);
 for(const edge of [
  "W('r','2','q','1','R1 → BD139 B'",
  "W('q','3','ps','M','BD139 E → 0 V'",
  "W('m','-','q','2','Motor − → BD139 C'",
  "W('d','K','m','+','Diyot K → motor +'"
 ])assert.ok(segment.includes(edge),'missing catalog edge: '+edge);
 assert.ok(!segment.includes("'r','2','q','3'"),'old incorrect base pin');
 assert.ok(!segment.includes("'q','1','ps','M'"),'old incorrect emitter pin');
});
