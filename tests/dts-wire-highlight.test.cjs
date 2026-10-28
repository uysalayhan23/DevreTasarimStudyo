'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const D=require('../dist/wire-diagnostics.js');
function group(id){return {dataset:{wire:id},classList:{set:new Set(),toggle(name,state){state?this.set.add(name):this.set.delete(name)},contains(name){return this.set.has(name)}}}}
test('only mismatched actual wire identifiers are highlighted',()=>{
 const groups=[group('w1'),group('w2'),group('w3')],scene={querySelectorAll:()=>groups};
 assert.equal(D.mark(scene,{issues:[{wire:'w1'},{wire:'w3'}]}),2);
 assert.equal(groups[1].classList.contains('dts-wire-audit-highlight'),false);
 assert.equal(D.mark(scene,{issues:[{wire:'w3'}]},'w3'),1);
 assert.equal(groups[0].classList.contains('dts-wire-audit-highlight'),false);
 assert.equal(D.mark(scene,{issues:[]}),0);
});
test('missing DOM group cannot be counted as found and labels are escaped',()=>{
 const scene={querySelectorAll:()=>[group('w1')]};
 assert.equal(D.mark(scene,{issues:[{wire:'deleted'}]}),0);
 const text=D.markup({total:1,checked:1,truncated:false,issues:[{wire:'<img>',message:'<script>'}]});
 assert.doesNotMatch(text,/<img>|<script>/);assert.match(text,/data-audit-wire/);
});
