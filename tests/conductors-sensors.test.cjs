const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Lines=require('../dist/conductors.js'),Sensors=require('../dist/sensors.js'),S=require('../dist/symbols.js'),Sim=require('../dist/simulation.js'),Selection=require('../dist/selection.js'),Viewport=require('../dist/viewport.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const lib=S.prepareLibrary(ctx.window.COMPONENT_LIBRARY),byId=Object.fromEntries(lib.map(d=>[d.id,d]));
function circuit(){
  const project={components:[],wires:[],junctions:[],colorRoles:{...Lines.defaults}};Lines.initialize(project,byId);
  const add=(typeId,id,ref=id)=>{const c={typeId,id,ref,x:100,y:100,rotation:0,state:false};project.components.push(c);return c};
  const wire=(a,p,b,q,color='#e53935')=>{
    const from={c:a.id,p},to={c:b.id,p:q},style=Lines.plan(project,byId,from,to,color,1.5);assert.equal(style.ok,true,style.reason);
    Lines.bind(project,style.role,style.color);const w={id:'w'+project.wires.length,from,to,color:style.color,role:style.role,size:style.size,points:[]};project.wires.push(w);Lines.synchronize(project,byId);return w;
  };return {project,add,wire,solve:()=>Sim.solve(project,byId)};
}
test('a source determines the conductor identity in either drawing direction and overrides an unrelated palette color',()=>{
  for(const reversed of [false,true]){
    const t=circuit(),s=t.add('supply-3p','s'),h=t.add('lamp-green','h');
    const n=reversed?t.wire(h,'X2',s,'N'):t.wire(s,'N',h,'X2');
    assert.equal(n.role,'N');assert.equal(n.color,'#1e88e5');assert.equal(h._terminalLines.X2.role,'N');
    const l=reversed?t.wire(h,'X1',s,'L1','#1e88e5'):t.wire(s,'L1',h,'X1','#1e88e5');assert.equal(l.role,'L1');assert.equal(l.color,'#e53935');assert.equal(t.solve().shortCircuit,false);
  }
});
test('L1/L2/N/PE and distinct secondary supplies cannot be directly merged, including via a junction or fuse',()=>{
  const t=circuit(),s=t.add('supply-3p','s'),f=t.add('fuse','f'),a=t.add('smps','a'),b=t.add('smps','b');
  for(const p of ['L2','N','PE'])assert.equal(Lines.check(t.project,byId,{c:s.id,p:'L1'},{c:s.id,p}).ok,false);
  t.wire(s,'L1',f,'1');assert.equal(Lines.check(t.project,byId,{c:f.id,p:'2'},{c:s.id,p:'N'}).ok,false);
  t.project.junctions.push({id:'j',x:400,y:400});t.project.wires.push({id:'jwire',from:{c:s.id,p:'L1'},to:{j:'j'},color:'#e53935',role:'L1'});Lines.synchronize(t.project,byId);
  const before=JSON.stringify(t.project);assert.equal(Lines.plan(t.project,byId,{c:s.id,p:'N'},{j:'j'},'#e53935',1.5).ok,false);assert.equal(JSON.stringify(t.project),before);
  assert.equal(Lines.check(t.project,byId,{c:a.id,p:'P'},{c:b.id,p:'P'}).ok,false);
});
test('branch wires inherit the existing color and size, and deleting the last wire restores the terminal',()=>{
  const t=circuit(),s=t.add('supply-3p','s'),a=t.add('lamp-green','a'),b=t.add('lamp-red','b');const w=t.wire(s,'N',a,'X2');
  Lines.setSize(t.project,'#1e88e5',6);const branch=t.wire(a,'X2',b,'X2','#e53935');assert.equal(branch.color,'#1e88e5');assert.equal(branch.role,'N');assert.equal(branch.size,'6 mm²');
  const base=S.markup(byId[b.typeId],{...b,_terminalLines:{}});assert.notEqual(S.markup(byId[b.typeId],b),base);
  t.project.wires=t.project.wires.filter(x=>x!==branch);Lines.synchronize(t.project,byId);assert.deepEqual(b._terminalLines,{});assert.equal(S.markup(byId[b.typeId],b),base);
  const next=t.wire(s,'L2',b,'X2');assert.equal(next.role,'L2');assert.equal(next.color,'#f97316');assert.equal(w.role,'N');
});
test('a color remains locked while in use and is released after its last wire is deleted',()=>{
  const t=circuit(),s=t.add('supply-3p','s'),h=t.add('lamp-green','h');t.wire(s,'L1',h,'X1');
  assert.equal(Lines.bind(t.project,'N','#e53935').ok,false);assert.equal(t.project.colorRoles['#e53935'],'L1');
  t.project.wires=[];Lines.synchronize(t.project,byId);assert.equal(Lines.bind(t.project,'L2','#e53935').ok,true);assert.deepEqual(h._terminalLines,{});
});
test('recoloring updates the complete line while independent color thicknesses survive save/open',()=>{
  const t=circuit(),s=t.add('supply-3p','s'),a=t.add('lamp-green','a'),b=t.add('lamp-red','b');
  const x=t.wire(s,'L1',a,'X1');t.wire(s,'L1',b,'X1');t.wire(s,'N',a,'X2');t.wire(s,'N',b,'X2');
  const before=JSON.stringify(t.project);assert.equal(Lines.recolor(t.project,byId,x.id,'#1e88e5',6).ok,false);assert.equal(JSON.stringify(t.project),before);
  assert.equal(Lines.recolor(t.project,byId,x.id,'#808080',6).ok,true);Lines.setSize(t.project,'#1e88e5',.75);
  for(const w of t.project.wires){assert.equal(w.color,w.role==='L1'?'#808080':'#1e88e5');assert.equal(w.size,w.role==='L1'?'6 mm²':'0,75 mm²')}
  assert.equal(Lines.width(6)/Lines.width(1.5),2);assert.ok(Lines.width(6)>Lines.width(.75));
  const restored=JSON.parse(JSON.stringify(t.project));Lines.initialize(restored,byId);assert.deepEqual(restored.colorSizes,t.project.colorSizes);assert.equal(restored.colorLocks['#e53935'],undefined);assert.equal(restored.colorLocks['#808080'],'L1');
});
test('reconnecting excludes the detached wire but still respects a surviving line at its other end',()=>{
  const t=circuit(),s=t.add('supply-3p','s'),a=t.add('lamp-green','a'),b=t.add('lamp-red','b');const w=t.wire(s,'N',a,'X2');
  const toL1=Lines.plan(t.project,byId,{c:a.id,p:'X2'},{c:s.id,p:'L1'},'#1e88e5',1.5,w.id);assert.equal(toL1.ok,true);assert.equal(toL1.role,'L1');assert.equal(toL1.color,'#e53935');
  t.wire(a,'X2',b,'X2');assert.equal(Lines.plan(t.project,byId,{c:a.id,p:'X2'},{c:s.id,p:'L1'},'#1e88e5',1.5,w.id).ok,false);
});
test('legacy color mistakes are corrected from the actual source without changing endpoints or routes',()=>{
  const t=circuit(),s=t.add('supply-3p','s'),a=t.add('lamp-green','a');
  const p={components:t.project.components,wires:[{id:'old',from:{c:s.id,p:'N'},to:{c:a.id,p:'X2'},color:'#e53935',role:'L1',points:[{x:30,y:50}]}],junctions:[],colorRoles:{...Lines.defaults}};
  const before=JSON.stringify([p.wires[0].from,p.wires[0].to,p.wires[0].points]);Lines.initialize(p,byId);assert.equal(p.wires[0].role,'N');assert.equal(p.wires[0].color,'#1e88e5');assert.equal(JSON.stringify([p.wires[0].from,p.wires[0].to,p.wires[0].points]),before);
});
test('forward/reverse contactor wiring remains legal and the actual phase order reverses the schematic motor',()=>{
  const t=circuit(),s=t.add('supply-3p','s'),f=t.add('main-contact','f','K1'),r=t.add('main-contact','r','K2'),m=t.add('motor-3p','m');
  const sf=t.add('selector-no','sf'),sr=t.add('selector-no','sr'),kf=t.add('coil-contactor','kf','K1'),kr=t.add('coil-contactor','kr','K2');
  for(const [sw,k] of [[sf,kf],[sr,kr]]){t.wire(s,'L1',sw,'13');t.wire(sw,'14',k,'A1');t.wire(k,'A2',s,'N')}
  for(const contact of [f,r])for(const [phase,pin] of [['L1','1'],['L2','3'],['L3','5']])t.wire(s,phase,contact,pin);
  for(const [out,pf,pr] of [['U','2','6'],['V','4','4'],['W','6','2']]){t.wire(f,pf,m,out,'#808080');t.wire(r,pr,m,out,'#808080')}
  sf.state=true;t.solve();assert.equal(m._spin,1);let markup=S.markup(byId[m.typeId],m,{mode:'iec'});assert.ok(markup.includes('schematic-motion'));assert.ok(markup.includes('SAĞ · CW'));
  sf.state=false;sr.state=true;t.solve();assert.equal(m._spin,-1);markup=S.markup(byId[m.typeId],m,{mode:'iec'});assert.ok(markup.includes('SOL · CCW'));
  m.direction='ccw';t.solve();assert.equal(m._spin,1);sr.state=false;t.solve();assert.equal(m._spin,0);
});
test('targets require the correct material, distance, alignment and powered sensor output',()=>{
  for(const [id,material] of [['proximity','metal'],['capacitive-switch','plastic'],['sensor-retroreflective','reflector']]){
    const t=circuit(),s=t.add('supply-dc-plus','s'),b=t.add(id,'b'),h=t.add('lamp-green','h');
    b.sensing={target:material,range:10,distance:20,offset:0};t.wire(s,'P',b,'BN');const ret=t.wire(s,'M',b,'BU');t.wire(b,'BK',h,'X1','#8b5cf6');t.wire(h,'X2',s,'M');
    t.solve();assert.equal(h._active,false);b.sensing.distance=5;t.solve();assert.equal(h._active,true,id);
    b.sensing.offset=20;t.solve();assert.equal(h._active,false);b.sensing.offset=0;
    t.project.wires=t.project.wires.filter(w=>w!==ret);t.solve();assert.equal(h._active,false,id+' unpowered');
  }
  const d=byId.proximity;assert.equal(Sensors.detect({sensing:{target:'plastic',range:4,distance:1}},d).detected,false);
});
test('dragging a target uses millimetres independent of zoom and rotation without moving any electrical terminals',()=>{
  const d=byId.proximity;
  for(const rotation of [0,90,180,270])for(const zoom of [.25,1,2]){
    const c={x:100,y:200,rotation,sensing:{target:'metal',range:4,distance:8,offset:0}},before=JSON.stringify([c.x,c.y,c.rotation,d.pins]);
    const start=Sensors.beginDrag(c,d),worldDelta={x:-25*start.worldV.x,y:-25*start.worldV.y},camera={x:50,y:-10,zoom},a=Viewport.toWorld(camera,{x:50,y:50}),b=Viewport.toWorld(camera,{x:50+worldDelta.x*zoom,y:50+worldDelta.y*zoom});
    Sensors.drag(c,d,start,{x:b.x-a.x,y:b.y-a.y});assert.ok(Math.abs(c.sensing.distance-3)<1e-7);assert.equal(Sensors.detect(c,d).detected,true);assert.equal(JSON.stringify([c.x,c.y,c.rotation,d.pins]),before);
  }
});
test('automatic target travel crosses the detection boundary and settings survive save/open',()=>{
  const d=byId.proximity,c={sensing:{target:'metal',range:5,distance:9,offset:0,auto:true}},seen=new Set();
  for(let i=0;i<120;i++){Sensors.advance(c,d,.05);seen.add(Sensors.detect(c,d).detected);assert.ok(c.sensing.distance>=1&&c.sensing.distance<=9)}
  assert.deepEqual([...seen].sort(),[false,true]);const copy=JSON.parse(JSON.stringify(c));assert.deepEqual(Sensors.settings(copy,d),Sensors.settings(c,d));
});
test('keyboard editing is protected while a focused drawing surface accepts Delete',()=>{
  for(const tagName of ['INPUT','TEXTAREA','SELECT'])assert.equal(Selection.isEditing({tagName}),true);
  assert.equal(Selection.isEditing({tagName:'DIV',isContentEditable:true}),true);assert.equal(Selection.isEditing({tagName:'DIV',id:'viewport'}),false);assert.equal(Selection.isEditing(null),false);
});
