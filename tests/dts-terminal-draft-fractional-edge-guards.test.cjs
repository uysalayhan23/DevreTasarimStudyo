'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Draft=require('../dist/component-terminal-draft.js');
const catalog=()=>({id:'prototype-fractional',name:'Fractional body',w:24.25,h:35.25,
 pins:[{id:'P1',label:'P1',side:'right',x:24.25,y:35.25}]});
test('P5-04 dragging an existing terminal to the exact fractional body corner is allowed',()=>{
 const original=catalog(),before=JSON.stringify(original);
 const d=Draft.fromCatalog(original),moved=Draft.move(d,'P1',24.25,35.25);
 assert.equal(moved.pins[0].x,24.25);assert.equal(moved.pins[0].y,35.25);
 assert.equal(JSON.stringify(original),before);assert.equal(JSON.stringify(d),JSON.stringify(Draft.fromCatalog(original)));
});
test('P5-04 regular half millimetre snapping still works inside the body',()=>{
 const d=Draft.fromCatalog(catalog()),moved=Draft.move(d,'P1',2.3,11.2);
 assert.equal(moved.pins[0].x,2.5);assert.equal(moved.pins[0].y,11);
});
test('P5-04 invalid outside-body points remain rejected, not silently clamped',()=>{
 const d=Draft.fromCatalog(catalog());
 for(const [x,y] of [[24.26,35.25],[24.25,35.26],[-.1,0],[Infinity,1]])
 assert.throws(()=>Draft.move(d,'P1',x,y));
});
test('P5-04 false manufacturer coordinate cannot be interpreted as physical zero',()=>{
 for(const axis of ['x','y']){
  const c=catalog();c.pins[0][axis]=false;
  assert.equal(Draft.canPreview(c),false);
  assert.throws(()=>Draft.fromCatalog(c),/koordinat/);
 }
});
test('P5-04 valid genuine zero and numeric string catalogue pin coordinate remain usable',()=>{
 const c=catalog();c.pins[0].x=0;c.pins[0].y='12.5';
 const d=Draft.fromCatalog(c);
 assert.equal(d.pins[0].x,0);assert.equal(d.pins[0].y,12.5);
});
test('P5-04 fractional preview roundtrip preserves acceptance gates and original identity',()=>{
 const c=catalog(),d=Draft.move(Draft.fromCatalog(c),'P1',24.25,35.25);
 const loaded=Draft.parseImport(Draft.exportDraft(d),c);
 assert.equal(loaded.pins[0].x,24.25);assert.equal(loaded.pins[0].y,35.25);
 const status=Draft.acceptance(loaded,c);
 assert.equal(status.catalog,'HOLD');assert.equal(status.native,'HOLD');assert.equal(status.threeD,'HOLD');
});
