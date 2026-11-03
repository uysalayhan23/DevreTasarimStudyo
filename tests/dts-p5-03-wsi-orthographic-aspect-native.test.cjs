'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const Material=require('../dist/materials-v111.js');
const Symbols=require('../dist/symbols.js');
const Simulation=require('../dist/simulation.js');
const source=fs.readFileSync(path.join(__dirname,'../dist/library.js'),'utf8');
const context={window:{}};vm.runInNewContext(source,context);
const library=Array.from(context.window.COMPONENT_LIBRARY),byId=Object.fromEntries(library.map(d=>[d.id,d]));
const d=byId['fuse-switch-3'];
const render=(c={id:'WSI3',fuseOpen:{}})=>Material.markup(d,c);
const slots=svg=>Array.from(svg.matchAll(/<svg x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)" viewBox="([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)" preserveAspectRatio="([^"]+)"/g));
test('P5-03 WSI top-down 3-slot image preserves its original aspect ratio instead of stretching',()=>{
 const s=slots(render());assert.equal(s.length,3);
 for(const m of s){
  assert.equal(m[9],'xMidYMid meet');
  const viewport=[Number(m[3]),Number(m[4])],viewBox=[Number(m[7]),Number(m[8])];
  assert.ok(Math.abs((viewport[0]/viewBox[0])-(viewport[1]/viewBox[1]))>0.01,'original mismatch reproduced');
  const uniformScale=Math.min(viewport[0]/viewBox[0],viewport[1]/viewBox[1]);
  assert.equal(uniformScale,148/1400);
  // Full source height is visible: both physical terminal screws survive the fit.
  assert.equal(viewBox[1],1400);assert.ok(viewport[0]-uniformScale*viewBox[0]>0);
 }
 assert.doesNotMatch(render(),/preserveAspectRatio="none"/);
});
test('P5-03 WSI fuse photo crop retains stationary fuse aperture and shifted opening state',()=>{
 // meet leaves the full 1400-source-unit height visible, including both terminal screws.
 const top=70,bottom=70+1400;
 assert.ok(top<=516&&bottom>=1039,'closed fuse must remain fully visible');
 assert.ok(top<=516-150&&bottom>=1039-150,'open fuse must remain fully visible');
 const closed=render(),open=render({id:'WSI3',fuseOpen:{1:true}});
 assert.equal(slots(closed).length,3);assert.equal(slots(open).length,3);
 assert.match(closed,/data-fuse-slot="1"/);assert.match(open,/translate\(0 -150\)/);
 assert.equal((open.match(/data-fuse-slot="/g)||[]).length,3);
 assert.match(open,/data-fuse-slot="1"[^>]*role="button"/);
});
test('P5-03 WSI dimensions and six native electrical terminals stay unchanged',()=>{
 assert.deepEqual([d.w,d.h,d.fuseSlots],[120,160,3]);
 const c={x:150,y:220,rotation:90,materialScale:1.5};
 for(let i=0;i<3;i++)for(let polarity=0;polarity<2;polarity++){
  const pin=d.pins[i*2+polarity],p=Symbols.terminalPosition(c,d,pin);
  assert.equal(pin.id,String(i*2+polarity+1));
  assert.equal(pin.x,20+i*40);assert.equal(pin.y,polarity?160:0);
  assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));
 }
 assert.equal((render().match(/data-fuse-slot="/g)||[]).length,3);
});
test('P5-03 one- and six-pole WSI use identical nonstretched orthographic view and native clickable slots',()=>{
 for(const n of [1,2,3,4,5,6]){
  const def=byId[n===1?'fuse-switch':'fuse-switch-'+n];
  const markup=Material.markup(def,{id:'WSI-'+n});
  assert.equal(slots(markup).length,n);
  assert.equal((markup.match(/data-fuse-slot="/g)||[]).length,n);
  assert.doesNotMatch(markup,/preserveAspectRatio="none"/);
  assert.ok(slots(markup).every(m=>m[9]==='xMidYMid meet'));
 }
});
test('P5-03 electrical isolation still obeys each WSI pole, not the photo or crop',()=>{
 const defs=byId,supply={id:'s',typeId:'supply-dc-plus'},fuse={id:'f',typeId:'fuse-switch-3',fuseOpen:{}},lamps=[];
 const project={components:[supply,fuse],wires:[],junctions:[]};
 const wire=(a,p,b,q)=>project.wires.push({id:'w'+project.wires.length,from:{c:a.id,p},to:{c:b.id,p:q}});
 for(let i=0;i<3;i++){
  const lamp={id:'l'+i,typeId:'lamp-green'};project.components.push(lamp);lamps.push(lamp);
  wire(supply,'P',fuse,String(2*i+1));wire(fuse,String(2*i+2),lamp,'X1');wire(lamp,'X2',supply,'M');
 }
 Simulation.solve(project,defs,{now:1000});assert.deepEqual(lamps.map(l=>l._active),[true,true,true]);
 fuse.fuseOpen={1:true};Simulation.solve(project,defs,{now:1100});assert.deepEqual(lamps.map(l=>l._active),[true,false,true]);
 fuse.fuseOpen={0:true,1:true,2:true};Simulation.solve(project,defs,{now:1200});assert.deepEqual(lamps.map(l=>l._active),[false,false,false]);
});
