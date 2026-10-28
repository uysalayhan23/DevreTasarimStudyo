'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/ladder-editor.js'),F=require('../dist/fbd-view.js');
function fixture(dataset,mapping={}){
 const node={dataset},calls=[],focused=[],container={contains:n=>n===node,querySelector:s=>{
  calls.push(s);return s in mapping?{disabled:mapping[s]===false,focus:()=>focused.push(s)}:null;
 }};
 return {node,container,clicked:{closest:()=>node},calls,focused};
}
test('FBD contact click focuses FBD address instead of hidden LAD field',()=>{
 const key='select[data-fbd-contact-ref="1:0:1"]',f=fixture({ladderContact:'1:0:1'},{[key]:true});
 assert.equal(E.focusDiagramOperand(f.container,f.clicked,'fbd'),true);
 assert.deepEqual(f.calls,[key]);assert.deepEqual(f.focused,[key]);
});
test('FBD coil click focuses FBD address field',()=>{
 const key='select[data-fbd-coil-field="ref"][data-r="2"]',f=fixture({ladderCoil:'2'},{[key]:true});
 assert.equal(E.focusDiagramOperand(f.container,f.clicked,'fbd'),true);
 assert.deepEqual(f.focused,[key]);
});
test('LAD contact continues focusing its original LAD operand',()=>{
 const key='select[data-field="contact-ref"][data-r="1"][data-p="0"][data-c="1"]',
 f=fixture({ladderContact:'1:0:1'},{[key]:true});
 assert.equal(E.focusDiagramOperand(f.container,f.clicked,'ladder'),true);
 assert.deepEqual(f.focused,[key]);
});
test('LAD coil continues focusing its original LAD operand',()=>{
 const key='select[data-field="coil-ref"][data-r="2"]',f=fixture({ladderCoil:'2'},{[key]:true});
 assert.equal(E.focusDiagramOperand(f.container,f.clicked,'ladder'),true);
 assert.deepEqual(f.focused,[key]);
});
test('NOP blocks with no address focus type picker in both modes',()=>{
 for(const [mode,key] of [['fbd','select[data-fbd-coil-field="type"][data-r="0"]'],['ladder','select[data-field="coil-type"][data-r="0"]']]){
  const f=fixture({ladderCoil:'0'},{[key]:true});
  assert.equal(E.focusDiagramOperand(f.container,f.clicked,mode),true);
  assert.deepEqual(f.focused,[key]);assert.equal(f.calls.length,2);
 }
});
test('invalid and oversized indices cannot be used to build selectors',()=>{
 for(const data of [{ladderContact:'-1:0:0'},{ladderContact:'0:0:"'},{ladderContact:'00:0:0'},
  {ladderContact:'9007199254740992:0:0'},{ladderCoil:'bad'},{ladderCoil:'-1'}]){
  const f=fixture(data);
  assert.equal(E.focusDiagramOperand(f.container,f.clicked,'fbd'),false);
  assert.equal(f.calls.length,0);
 }
});
test('disabled inputs and elements outside dialog do not receive focus',()=>{
 const key='select[data-fbd-contact-ref="0:0:0"]',f=fixture({ladderContact:'0:0:0'},{[key]:false});
 assert.equal(E.focusDiagramOperand(f.container,f.clicked,'fbd'),false);
 assert.equal(E.focusDiagramOperand({...f.container,contains:()=>false},f.clicked,'fbd'),false);
 assert.deepEqual(f.focused,[]);
});
test('FBD markup really exposes the addressed operand inputs',()=>{
 const rung={id:'R1',paths:[[{type:'NO',ref:'I1'}]],coil:{type:'OUT',ref:'Q1'}};
 const h=F.render(rung,{index:1,limits:{inputCount:6,outputCount:4}});
 assert.match(h,/data-fbd-contact-ref="1:0:0"/);
 assert.match(h,/data-fbd-coil-field="ref" data-r="1"/);
});
test('diagram click handler delegates to the mode-aware focus helper',()=>{
 const src=require('node:fs').readFileSync(require('node:path').join(__dirname,'../dist/ladder-editor.js'),'utf8');
 assert.match(src,/function activateDiagramTarget\(element\)\{\s*return focusDiagramOperand\(overlay,element,diagramMode\)/);
});
