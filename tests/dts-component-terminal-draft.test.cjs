'use strict';
const assert=require('node:assert/strict'),{test}=require('node:test');
const Draft=require('../dist/component-terminal-draft.js');
const sample={id:'push-no',name:'Başlat',w:72,h:92,pins:[
{id:'13',label:'13',x:0,y:46,side:'left'},{id:'14',label:'14',x:72,y:46,side:'right'}]};
test('real catalogue coordinates clone without mutating original',()=>{
 const d=Draft.fromCatalog(sample);
 const next=Draft.move(d,'13',2.3,40.8);
 assert.deepEqual([next.pins[0].x,next.pins[0].y],[2.5,41]);
 assert.equal(sample.pins[0].x,0);assert.equal(d.pins[0].x,0);
});
test('invalid coordinates and duplicate pin identities are rejected',()=>{
 const d=Draft.fromCatalog(sample);
 assert.throws(()=>Draft.move(d,'13',-1,40));
 assert.throws(()=>Draft.move(d,'13',Number.POSITIVE_INFINITY,40));
 assert.throws(()=>Draft.move(d,'wrong',20,40));
 d.pins[1].id='13';assert.equal(Draft.validate(d).ok,false);
});
test('separate non-runnable draft format and escaped diagram',()=>{
 const d=Draft.fromCatalog(sample),v=JSON.parse(Draft.exportDraft(d));
 assert.equal(v.format,'dts-terminal-draft');
 assert.equal(v.sourceId,'push-no');
 assert.match(Draft.svg(d),/data-pin="13"/);
 d.name='<script>bad()</script>';assert.doesNotMatch(Draft.svg(d),/<script>/);
});
test('unsupported/missing catalogue geometries stay unavailable',()=>{
 assert.equal(Draft.canPreview({...sample,w:0}),false);
 assert.equal(Draft.canPreview({...sample,pins:[]}),false);
});
