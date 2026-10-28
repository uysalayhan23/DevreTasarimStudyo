'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Draft=require('../dist/component-terminal-draft.js');
const catalog={id:'switch',name:'Switch',w:80,h:90,pins:[
 {id:'13',label:'13',side:'left',x:0,y:40},
 {id:'14',label:'14',side:'right',x:80,y:40}
]};
test('missing physical terminal x coordinate never silently becomes zero',()=>{
 const x={...catalog,pins:[{...catalog.pins[0],x:null},catalog.pins[1]]};
 assert.equal(Draft.canPreview(x),false);assert.throws(()=>Draft.fromCatalog(x),/koordinat/);
});
test('empty string terminal coordinate is not interpreted as a manufacturer zero',()=>{
 const x={...catalog,pins:[{...catalog.pins[0],y:'  '},catalog.pins[1]]};
 assert.equal(Draft.canPreview(x),false);
});
test('UTF-8 byte size limit also applies to JSON with multibyte text',()=>{
 const raw=JSON.stringify({...Draft.fromCatalog(catalog),note:'é'.repeat(70000)});
 assert.ok(raw.length<Draft.maxImportBytes);
 assert.throws(()=>Draft.parseImport(raw,catalog),/128 KB/);
});
test('valid draft round trip retains both terminal positions and HOLD gates',()=>{
 const raw=Draft.exportDraft(Draft.fromCatalog(catalog));
 const parsed=Draft.parseImport(raw,catalog);
 assert.deepEqual(parsed.pins.map(x=>[x.id,x.x,x.y]),[['13',0,40],['14',80,40]]);
 assert.equal(Draft.acceptance(parsed,catalog).threeD,'HOLD');
});
