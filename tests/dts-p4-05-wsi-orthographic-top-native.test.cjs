'use strict';
const {test}=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), vm=require('node:vm');
const Mat=require('../dist/materials-v111.js'), Materials=require('../dist/materials.js');
const Components=require('../dist/components.js'), Sim=require('../dist/simulation.js');
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const dict=Object.fromEntries(ctx.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));
const definition=(base,n)=>dict[n===1?base:`${base}-${n}`];
const draw=(base,n,open=[])=>Mat.markup(definition(base,n),{id:'S1',fuseOpen:open});

test('P4-05 negative: all WSI slots are perspective-free code-native top plans, no product photo/crop',()=>{
 for(const base of ['fuse-switch','fused-disconnect'])for(const n of [1,3,6]){
  const art=draw(base,n);
  assert.equal((art.match(/class="wsi-top-plan" data-view="orthographic-top" data-visual-match="representative"/g)||[]).length,n,base+n);
  assert.equal((art.match(/TEMSİLİ/g)||[]).length,n,base+n);
  assert.equal((art.match(/ÜSTTEN/g)||[]).length,n,base+n);
  assert.doesNotMatch(art,/<image|wsi-top-v111\.png|viewBox="405 70 215 1400"|preserveAspectRatio="none"|skew\(|perspective|transform="rotate/);
 }
});
test('P4-05 negative: each physical top and bottom cable center is on exact native pin position',()=>{
 for(const base of ['fuse-switch','fused-disconnect'])for(let n=1;n<=6;n++){
  const d=definition(base,n),art=draw(base,n);
  assert.equal(d.w,n*40);assert.equal(d.h,160);
  assert.equal(d.pins.length,n*2);
  for(let i=0;i<n;i++){
   const x=20+40*i;
   assert.equal(d.pins[2*i].x,x);assert.equal(d.pins[2*i].y,0);
   assert.equal(d.pins[2*i+1].x,x);assert.equal(d.pins[2*i+1].y,160);
   assert.match(art,new RegExp('data-wsi-terminal-path="'+(i+1)+'" d="M'+x+' 0V17M'+x+' 142V160"'));
  }
 }
});
test('P4-05 negative: independent open and closed states show actual visible gap without deforming housing',()=>{
 const art=draw('fuse-switch',3,[false,true,false]);
 assert.equal((art.match(/data-wsi-state="closed"/g)||[]).length,2);
 assert.equal((art.match(/data-wsi-state="open"/g)||[]).length,1);
 assert.equal((art.match(/width="38" height="148" viewBox="0 0 38 148"/g)||[]).length,3);
 assert.equal((art.match(/data-fuse-slot="[012]"/g)||[]).length,3);
 assert.match(art,/>AÇIK<\/text>/);
 assert.doesNotMatch(art,/translate\(0 -150\)|scale\(1 0\.32\)/);
});
test('P4-05 negative: original complete click and keyboard targets remain on each slot',()=>{
 const art=draw('fused-disconnect',6,[false,true]);
 for(let i=0;i<6;i++){
  assert.match(art,new RegExp('data-fuse-slot="'+i+'" role="button" tabindex="0" aria-label="'+(i+1)+'\\. sigorta '+(i===1?'kapat':'aç')+'"'));
  assert.match(art,new RegExp('data-wsi-top-slot="'+i+'"'));
 }
 assert.equal((art.match(/width="38" height="150" fill="transparent"/g)||[]).length,6);
});
test('P4-05 positive: catalog WSI visual provenance stays explicitly representative not exact',()=>{
 for(const base of ['fuse-switch','fused-disconnect'])for(const n of [1,3,6]){
  const d=definition(base,n);
  assert.equal(d.visualInfo.match,'representative');
  assert.match(d.visualInfo.model,/üstten görsel uyarlama/);
 }
});
test('P4-05 positive: fuse contacts and original Simulation.solve are unchanged by top-view drawing',()=>{
 for(const base of ['fuse-switch','fused-disconnect'])for(let n=1;n<=6;n++){
  const d=definition(base,n),c={fuseOpen:[false,true,false]};
  const original=Sim.conductingPairs(c,d,new Map(),new Set());
  assert.equal(original.length,n-(n>1?1:0));
  assert.equal((Mat.markup(d,c).match(/data-fuse-slot=/g)||[]).length,n);
 }
 const p={version:7,name:'Fuse top view native',workspaceMode:'control',components:[],wires:[],junctions:[]};
 for(const [id,typeId] of [['s','supply-dc-plus'],['f','fuse-switch-3'],['l1','lamp-green'],['l2','lamp-green'],['l3','lamp-green']])p.components.push({id,typeId,x:100,y:100});
 const add=(c,pin,to,port)=>p.wires.push({id:'w'+p.wires.length,from:{c,p:pin},to:{c:to,p:port}});
 for(let i=0;i<3;i++){add('s','P','f',String(2*i+1));add('f',String(2*i+2),'l'+(i+1),'X1');add('l'+(i+1),'X2','s','M');}
 const lib=Object.fromEntries(Object.entries(dict).map(([id,d])=>[id,d]));
 Sim.solve(p,lib);assert.deepEqual(p.components.slice(2).map(c=>Boolean(c._active)),[true,true,true]);
 p.components[1].fuseOpen={1:true};Sim.solve(p,lib);
 assert.deepEqual(p.components.slice(2).map(c=>Boolean(c._active)),[true,false,true]);
});
test('P4-05 positive: latest materials integration still returns one visual per fuse slot',()=>{
 const d=definition('fuse-switch',3),art=Materials.markup(d,{id:'S1',fuseOpen:[false,true,false]});
 assert.equal((art.match(/data-wsi-top-slot=/g)||[]).length,3);
 assert.equal((art.match(/data-fuse-slot=/g)||[]).length,3);
});
test('P4-05 positive: prior 3NP1133 top SVG and unrelated WAZ5 stay separate',()=>{
 const nh=Mat.markup(dict['nh-fuse-holder'],{id:'N1'});
 assert.match(nh,/class="nh-top-plan" data-view="top-orthographic"/);
 assert.doesNotMatch(nh,/wsi-top-plan/);
 const waz=require('../dist/materials-v115.js').markup({id:'converter-pressure',instrument:'waz5',w:35,h:184.8},{id:'W1'});
 assert.match(waz,/class="waz5-top-plan"/);
 assert.doesNotMatch(waz,/data-fuse-slot/);
});
