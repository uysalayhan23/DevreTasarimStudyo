'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Fast=require('../dist/drag-preview.js');
const Select=require('../dist/selection.js');
const Sim=require('../dist/simulation.js');
const oldWindow=global.window;global.window=global;require('../dist/library.js');global.window=oldWindow;
const lib=Object.fromEntries(global.COMPONENT_LIBRARY.map(d=>[d.id,d]));
const orig=(id,typeId,x=100,y=100)=>({id,typeId,x,y});
const passive=['resistor','lamp-green','lamp-red','fuse','nh-fuse'];
const proj=(items,wires=[])=>({components:items,wires,junctions:[]});
const isLive=(p,ids)=>Fast.canPreviewLivePassives(p,ids,lib);
test('only canonical passive IDs in original 703 component catalog are accepted for live drag',()=>{
 assert.equal(global.COMPONENT_LIBRARY.length,703);
 for(const name of passive){assert.ok(lib[name],name);assert.equal(isLive(proj([orig('x',name)]),['x']),true,name)}
});
test('safe groups of passive parts are accepted without changing electrical connectivity',()=>{
 const p=proj(passive.map((typeId,i)=>orig('p'+i,typeId,100+i*50,100)));
 assert.equal(isLive(p,['p0','p1','p2','p3','p4']),true);
});
test('source, switch, sensor, motor, PLC, IC and unknown types remain on the native render path',()=>{
 for(const typeId of ['supply-dc-plus','power-switch','inductive-switch','motor-3p','plc-hw-6es7211-1ae40-0xb0','lm358p-opamp-a','unknown']){
  assert.equal(isLive(proj([orig('u',typeId)]),['u']),false,typeId);
 }
});
test('any mixed group containing unsupported item refuses partial fast preview',()=>{
 const p=proj([orig('r','resistor'),orig('m','motor-3p')]);
 assert.equal(isLive(p,['r','m']),false);
 assert.equal(isLive(p,['r','missing']),false);
 assert.equal(isLive(p,[]),false);
});
test('a multimeter anywhere in the project blocks live dragging to protect NCV spatial sensing',()=>{
 const meter=global.COMPONENT_LIBRARY.find(d=>d.kind==='multimeter');assert.ok(meter);
 const p=proj([orig('r','resistor'),orig('meter',meter.id,200,200)]);
 assert.equal(isLive(p,['r']),false);
});
test('forged unsupported catalog entries and dangerous dynamic instances are rejected',()=>{
 const altered={...lib,resistor:{...lib.resistor,kind:'sensor'}};
 assert.equal(Fast.canPreviewLivePassives(proj([orig('r','resistor')]),['r'],altered),false);
 assert.equal(isLive(proj([{...orig('r','resistor'),probeTarget:{w:'x',t:0.5}}]),['r']),false);
 assert.equal(isLive(proj([{...orig('r','resistor'),auxFor:'device'}]),['r']),false);
});
test('non-coordinate electrical outputs are unchanged by moving a resistor and signal lamp under native solver',()=>{
 const dc=orig('dc','supply-dc-plus',20,20),r={...orig('r','resistor',100,100),resistance:1000},f=orig('f','fuse',150,100),l=orig('l','lamp-red',200,100);
 const p=proj([dc,r,f,l]);
 const wire=(a,x,b,y)=>p.wires.push({id:'w'+p.wires.length,from:{c:a,p:x},to:{c:b,p:y}});
 wire('dc','P','r','1');wire('r','2','f','1');wire('f','2','l','X1');wire('l','X2','dc','M');
 const before=Sim.solve(p,lib,{now:100});assert.equal(before.stable,true);
 const outputs=()=>p.components.map(c=>({id:c.id,active:c._active,hot:c._hot}));
 const first=JSON.stringify(outputs()),connections=JSON.stringify(p.wires);
 r.x+=410;r.y+=250;l.x+=400;l.y-=40;
 const after=Sim.solve(p,lib,{now:100});assert.equal(after.stable,true);
 assert.equal(JSON.stringify(outputs()),first);assert.equal(JSON.stringify(p.wires),connections);
});
test('passive live preview updates moving group and connected SVG wire without moving other wires',()=>{
 const r=orig('r','resistor'),l=orig('l','lamp-green',180,100),untouched=orig('untouched','motor-3p',350,100);
 const wires=[{id:'w1',from:{c:'r',p:'1'},to:{c:'l',p:'X1'},points:[]},{id:'w2',from:{c:'l',p:'X2'},to:{c:'untouched',p:'U'},points:[]}];
 const p=proj([r,l,untouched],wires),ids=['r','l'];assert.equal(isLive(p,ids),true);
 const mkNode=(dataset,wire=false)=>({dataset,attrs:{},setAttribute(k,v){this.attrs[k]=v},querySelectorAll(){return wire?this.children:[]},querySelector(){return null},children:wire?[{attrs:{},setAttribute(k,v){this.attrs[k]=v}}]:[]});
 const [ra,la,na]=[mkNode({id:'r'}),mkNode({id:'l'}),mkNode({id:'untouched'})],w1=mkNode({wire:'w1'},true),w2=mkNode({wire:'w2'},true);
 const scene={querySelectorAll(q){if(q==='g.component,[data-component-backdrop],[data-note-owner]')return[ra,la,na];if(q==='[data-junction]')return[];if(q==='g[data-wire]')return[w1,w2];throw Error(q)}};
 const plan=Select.beginMove(p,ids,lib,{}),points=ref=>{const c=p.components.find(x=>x.id===ref.c),pos={x:c.x,y:c.y};return{pos,stub:{x:pos.x+10,y:pos.y},lead:[pos,{x:pos.x+10,y:pos.y}]}};
 const preview=Fast.create(scene,p,ids,plan,points,pts=>'M '+pts.map(pt=>pt.x+','+pt.y).join(' L '));assert.ok(preview);
 Select.applyMove(plan,{x:40,y:30});preview.refresh();assert.equal(ra.attrs.transform,'translate(140 130)');assert.equal(la.attrs.transform,'translate(220 130)');assert.equal(na.attrs.transform,undefined);
 assert.ok(w1.children[0].attrs.d);assert.ok(w2.children[0].attrs.d);
 Select.restore(plan);assert.equal(r.x,100);assert.equal(l.x,180);
});
test('static position-only route preview does not mutate semantic wires, pins or connector IDs',()=>{
 const wire={id:'w',from:{c:'r',p:'1'},to:{c:'l',p:'X1'},points:[{x:150,y:150}]};const p=proj([orig('r','resistor'),orig('l','lamp-green',180)], [wire]);
 assert.equal(isLive(p,['r']),true);
 const copy=JSON.stringify(p.wires);const out=Fast.route({pos:{x:100,y:100},stub:{x:110,y:100}},{pos:{x:180,y:100},stub:{x:170,y:100}},wire.points);
 assert.ok(out.length>3);assert.equal(JSON.stringify(p.wires),copy);
});
test('live passive shortcut exists only in the shared drag handler; existing supported PLC guard remains',()=>{
 const src=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8'),drag=src.slice(src.indexOf('function beginComponentDrag(c,e){'),src.indexOf('function operateInstallation('));
 assert.match(drag,/const plcLiveMove=running&&ids\.length===1/);
 assert.match(drag,/const passiveLiveMove=running&&window\.DTSDragPreview\?\.canPreviewLivePassives\?\.\(project,ids,byId\)===true/);
 assert.match(drag,/\(!running\|\|plcLiveMove\|\|passiveLiveMove\)&&window\.DTSDragPreview/);
 assert.match(drag,/if\(moved\)\{render\(\);scheduleSave\(\)\}/);
});

test('magnetic guides are drawn as noninteractive, exact coordinate SVG lines during fast dragging',()=>{
 const kids=[];
 const scene={children:kids,ownerDocument:{createElementNS(ns,tag){assert.equal(ns,'http://www.w3.org/2000/svg');assert.equal(tag,'line');return {attributes:{},setAttribute(key,value){this.attributes[key]=String(value)},remove(){kids.splice(kids.indexOf(this),1)}}}},querySelectorAll(q){assert.equal(q,'.alignment-guide');return kids.filter(c=>c.attributes.class==='alignment-guide')},appendChild(child){kids.push(child)}};
 Fast.syncGuides(scene,[{axis:'x',value:120},{axis:'y',value:270}],3200,2100);
 assert.equal(kids.length,2);assert.deepEqual(kids[0].attributes,{class:'alignment-guide',x1:'120',y1:'0',x2:'120',y2:'2100','pointer-events':'none'});
 assert.deepEqual(kids[1].attributes,{class:'alignment-guide',x1:'0',y1:'270',x2:'3200',y2:'270','pointer-events':'none'});
 Fast.syncGuides(scene,[{axis:'x',value:130}],3200,2100);assert.equal(kids.length,1);assert.equal(kids[0].attributes.x1,'130');
 Fast.syncGuides(scene,[],3200,2100);assert.equal(kids.length,0);
});
test('invalid guide geometry fails closed and untouched route stays pure',()=>{
 const kids=[],scene={ownerDocument:{createElementNS(){return {attrs:{},setAttribute(k,v){this.attrs[k]=v},remove(){kids.splice(kids.indexOf(this),1)}}}},querySelectorAll(){return kids},appendChild(n){kids.push(n)}};
 Fast.syncGuides(scene,[{axis:'x',value:NaN},{axis:'invalid',value:20},null],3200,2100);assert.equal(kids.length,0);
 assert.equal(Fast.syncGuides(null,[{axis:'x',value:20}],3200,2100),undefined);
});
test('app redraws snap guides while fast preview is active, without full circuit rerender',()=>{
 const src=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');const drag=src.slice(src.indexOf('function beginComponentDrag(c,e){'),src.indexOf('function operateInstallation('));
 assert.match(drag,/dragPreview\?dragPreview\.refresh\(\):render\(\);if\(dragPreview\)window\.DTSDragPreview\?\.syncGuides\?\.\(els\.scene,alignmentGuides,SHEET_W,SHEET_H\)/);
});
