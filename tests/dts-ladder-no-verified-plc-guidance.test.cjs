'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const Editor=require('../dist/ladder-editor.js');
const Ladder=require('../dist/ladder-runtime.js');
function fixture(components=[],byId={}){
 const listeners={},doc={activeElement:null};
 const button={dataset:{},addEventListener(name,cb){listeners['button:'+name]=cb},focus(){doc.activeElement=this}};
 const dialog={focus(){doc.activeElement=this}};
 const overlay={hidden:true,innerHTML:'',dataset:{},addEventListener(name,cb){listeners['overlay:'+name]=cb},
  setAttribute(){},contains(){return true},querySelector(q){return q==='.dts-ladder-dialog'?dialog:null},
  querySelectorAll(){return []}};
 doc.body={appendChild(){}};
 doc.getElementById=id=>id==='dtsLadderBtn'?button:null;
 doc.createElement=()=>overlay;
 const editor={getProject:()=>({components}),byId,running:false,toast(){throw Error('Guidance must not use a disappearing toast')}};
 button.focus();
 assert.equal(Editor.init(doc,editor),true);
 return {doc,button,overlay,dialog,listeners};
}
test('Ladder button opens a persistent explanation when a project contains no PLC',()=>{
 const f=fixture();f.listeners['button:click']();
 assert.equal(f.overlay.hidden,false);
 assert.equal(f.doc.activeElement,f.dialog);
 assert.match(f.overlay.innerHTML,/Siemens CPU 1211C DC\/DC\/DC/);
 assert.match(f.overlay.innerHTML,/henüz Ladder destekli bir PLC eklenmemiş/);
 assert.doesNotMatch(f.overlay.innerHTML,/data-action="save"|data-action="toggle-sim"/);
});
test('Ladder guidance explains that an unverified PLC cannot be simulated',()=>{
 const bad={id:'unverified',isPLC:true,pins:[]};
 const f=fixture([{id:'plc',typeId:'unverified'}],{unverified:bad});
 assert.equal(globalThis.DTSLadderEditor.open(),false);
 assert.match(f.overlay.innerHTML,/bu model Ladder için henüz native doğrulanmış değil/);
});
test('Ladder guidance close control closes modal and restores trigger focus',()=>{
 const f=fixture();globalThis.DTSLadderEditor.open();
 const close={dataset:{action:'close'}};
 const target={closest:q=>q==='[data-action]'?close:null};
 f.listeners['overlay:click']({target});
 assert.equal(f.overlay.hidden,true);assert.equal(f.doc.activeElement,f.button);
});
test('malformed pin records do not crash PLC hardware discovery',()=>{
 for(const pins of [null,{},[null],['bad'],[{signalType:'DI'}]]){
  const d={id:'plc-hw-6es7211-1ae40-0xb0',isPLC:true,pins};
  const ed={getProject:()=>({components:[{id:'plc',typeId:'plc'}]}),byId:{plc:d}};
  assert.deepEqual(Editor.supported(ed),[]);
 }
});
test('unverified or absent PLC never acquires native output permission',()=>{
 assert.equal(Ladder.supportedPLC({id:'unverified',isPLC:true,pins:[]}),false);
 assert.equal(Editor.canStartLadder({plcProgram:'other'},Ladder.blank(),false,{disabled:false}),false);
});
