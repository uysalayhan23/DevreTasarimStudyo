'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../dist/ladder-editor.js'),'utf8');
// Execute the actual 300 ms diagram repaint section from the installed editor.
const start=source.indexOf('      const key=JSON.stringify([!!bits,bits||{},row.active,row.value,row.pathStates]);');
assert.ok(start>=0,'Expected live-editor repaint block');
const end=source.indexOf('\n     }\n    });',start);
assert.ok(end>start,'Expected end of repaint block');
const callback=new Function('diagram','diagramMode','doc','row','bits','draw','active','limits','i',source.slice(start,end));
function fixture({mode='ladder',kind='contact',inDiagram=true,editing=false}={}){
 const doc={activeElement:null};let draws=0;
 const symbol=(k,id)=>({dataset:k==='contact'?{ladderContact:id}:{ladderCoil:id},
  matches:q=>q.includes(k==='contact'?'data-ladder-contact':'data-ladder-coil'),
  focus(){doc.activeElement=this}});
 const target={dataset:{},contact:null,coil:null,editing:null,html:'',
  contains(el){return el===this.contact||el===this.coil||el===this.editing},
  querySelector(q){return q.includes('data-ladder-contact')?this.contact:q.includes('data-ladder-coil')?this.coil:null},
  set innerHTML(v){draws++;if(this.contains(doc.activeElement))doc.activeElement=null;
   this.html=v;this.contact=symbol('contact','0:0:0');this.coil=symbol('coil','0')},get innerHTML(){return this.html}};
 target.innerHTML='INITIAL';
 const original=target[kind];
 if(editing){target.editing={matches:q=>q.includes('data-fbd-contact-ref')};doc.activeElement=target.editing}
 else doc.activeElement=inDiagram?original:{external:true};
 const repaint=(bits={I1:true})=>callback(target,mode,doc,{active:!!bits,value:!!bits,pathStates:[!!bits]},bits,
  (_r,opts)=>opts.live?'ON':'OFF',{draft:{rungs:[{}]}},()=>({}),0);
 return {doc,target,original,repaint,draws:()=>draws};
}
for(const mode of ['ladder','fbd'])for(const kind of ['contact','coil'])
 test('P1-07: preserve '+mode+' '+kind+' focus after live repaint',()=>{
  const f=fixture({mode,kind});f.repaint();
  assert.equal(f.doc.activeElement,f.target[kind]);
  assert.notEqual(f.doc.activeElement,f.original,'Real redraw must replace the DOM node');
 });
test('P1-07: power-off repaint must restore LAD contact focus and clear active markup',()=>{
 const f=fixture();f.repaint(null);assert.equal(f.doc.activeElement,f.target.contact);
 assert.equal(f.target.innerHTML,'OFF');
});
test('P1-07: do not steal unrelated focus',()=>{
 const f=fixture({inDiagram:false});const prior=f.doc.activeElement;f.repaint();assert.equal(f.doc.activeElement,prior);
});
test('P1-07: keep focused FBD select untouched while it is being edited',()=>{
 const f=fixture({mode:'fbd',editing:true});const prior=f.doc.activeElement;
 f.repaint();assert.equal(f.doc.activeElement,prior);assert.equal(f.target.innerHTML,'INITIAL');
});
