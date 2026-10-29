'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','dist','studio.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'..','dist','index.html'),'utf8');
const binding=source.split(/\r?\n/).find(line=>line.includes("document.addEventListener('keydown',e=>{if(isHome"));
function run({home=false,safetyVisible=false,modal=false,key='s',ctrl=false,meta=false,alt=false,shift=false,composing=false}={}){
  assert.ok(binding,'studio keyboard handler must exist');
  let listener=null;
  const calls=[];
  const e={key,ctrlKey:ctrl,metaKey:meta,altKey:alt,shiftKey:shift,isComposing:composing,preventDefault(){this.prevented=true}};
  vm.runInNewContext(binding,{
    document:{addEventListener(name,fn){assert.equal(name,'keydown');listener=fn}},
    isHome:home,safety:{visible:safetyVisible},
    $:selector=>{assert.equal(selector,'#modal');return {hidden:!modal}},
    save:as=>calls.push(as)
  },{timeout:1000});
  assert.equal(typeof listener,'function');
  listener(e);
  return {saved:calls.length,saveAs:calls[0]===true,prevented:e.prevented===true};
}
test('P8-01 Ctrl+S saves the active editable project',()=>assert.deepEqual(run({ctrl:true}),{saved:1,saveAs:false,prevented:true}));
test('Ctrl+Shift+S requests Save As',()=>assert.deepEqual(run({ctrl:true,shift:true}),{saved:1,saveAs:true,prevented:true}));
test('Mac Meta+S still saves',()=>assert.deepEqual(run({meta:true}),{saved:1,saveAs:false,prevented:true}));
test('Ctrl+S in confirmation modal cannot save underlying project',()=>assert.deepEqual(run({ctrl:true,modal:true}),{saved:0,saveAs:false,prevented:true}));
test('Ctrl+Shift+S in confirmation modal cannot bypass confirmation',()=>assert.deepEqual(run({ctrl:true,shift:true,modal:true}),{saved:0,saveAs:false,prevented:true}));
test('Home screen shortcut is not routed to project save',()=>assert.deepEqual(run({ctrl:true,home:true}),{saved:0,saveAs:false,prevented:false}));
test('Safety overlay shortcut is not routed to project save',()=>assert.deepEqual(run({ctrl:true,safetyVisible:true}),{saved:0,saveAs:false,prevented:false}));
test('Alt+Ctrl+S is not a save shortcut',()=>assert.deepEqual(run({ctrl:true,alt:true}),{saved:0,saveAs:false,prevented:false}));
test('IME composition cannot trigger a save',()=>assert.deepEqual(run({ctrl:true,composing:true}),{saved:0,saveAs:false,prevented:false}));
test('Plain S does not save',()=>assert.deepEqual(run(),{saved:0,saveAs:false,prevented:false}));
test('Offline HTML references updated studio script revision',()=>assert.ok(html.includes('studio.js?rev=20261030-p0-open-race1')));
