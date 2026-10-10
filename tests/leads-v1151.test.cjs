const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Lines=require('../dist/conductors.js'),Leads=require('../dist/probe-leads.js'),Sim=require('../dist/simulation.js'),Symbols=require('../dist/symbols.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const by=Object.fromEntries(Symbols.prepareLibrary(ctx.window.COMPONENT_LIBRARY).map(d=>[d.id,d]));
function setup(){
 const p={components:[],wires:[],junctions:[]};Lines.initialize(p,by);let counter=0;
 const add=(typeId,id)=>{const c={typeId,id,ref:id,x:0,y:0};p.components.push(c);return c};
 const wire=(a,pin,b,q,color='#e53935')=>{const from={c:a.id,p:pin},to={c:b.id,p:q},plan=Lines.plan(p,by,from,to,color,1.5);assert.equal(plan.ok,true,plan.reason);Lines.bind(p,plan.role,plan.color);const w={id:'w'+(++counter),from,to,color:plan.color,role:plan.role,size:plan.size};p.wires.push(w);Lines.synchronize(p,by);return w};
 return {p,add,wire,solve:()=>Sim.solve(p,by)};
}
test('SMPS L/N accepts 220 VAC through provisional wiring and only powers its output after the switch closes',()=>{
 const t=setup(),s=t.add('supply-3p','s'),sw=t.add('selector-no','sw'),terminal=t.add('terminal-2','terminal'),ps=t.add('smps','ps'),lamp=t.add('lamp-green','lamp');s.phaseVoltages={L1:220,L2:220,L3:220};
 const n=t.wire(ps,'N',terminal,'1');assert.equal(n.role,'L1');assert.equal(n.roleBound,false);
 t.wire(s,'N',terminal,'2');assert.equal(n.role,'N');assert.equal(n.color,'#1e88e5');assert.equal(ps._terminalLines.N.role,'N');
 t.wire(s,'L1',sw,'13');t.wire(sw,'14',ps,'L');t.wire(ps,'P',lamp,'X1');t.wire(ps,'M',lamp,'X2');
 sw.state=false;t.solve();assert.equal(ps._active,false);assert.equal(lamp._active,false);
 sw.state=true;assert.equal(t.solve().stable,true);assert.equal(ps._active,true);assert.equal(lamp._active,true);
 assert.equal(Lines.check(t.p,by,{c:ps.id,p:'M'},{c:s.id,p:'N'}).ok,false);
 assert.equal(Lines.check(t.p,by,{c:s.id,p:'L2'},{c:ps.id,p:'N'}).ok,false);
 sw.state=false;t.solve();assert.equal(ps._active,false);assert.equal(lamp._active,false);
});
test('stale locks disappear on load, but a surviving ordinary wire keeps its color locked',()=>{
 const t=setup(),s=t.add('supply-3p','s'),a=t.add('lamp-green','a'),b=t.add('lamp-red','b');
 t.p.colorLocks={'#e53935':'L1','#808080':'PE'};t.p.lineColors={L1:'#e53935',PE:'#808080'};Lines.initialize(t.p,by);assert.deepEqual(t.p.colorLocks,{});
 const one=t.wire(s,'L1',a,'X1'),two=t.wire(s,'L1',b,'X1');t.p.wires=t.p.wires.filter(w=>w!==one);Lines.synchronize(t.p,by);assert.equal(Lines.bind(t.p,'N','#e53935').ok,false);
 t.p.wires=t.p.wires.filter(w=>w!==two);Lines.synchronize(t.p,by);assert.equal(t.p.colorLocks['#e53935'],undefined);assert.deepEqual(b._terminalLines,{});
 assert.equal(Lines.bind(t.p,'N','#e53935').ok,true);const reused=t.wire(s,'N',a,'X1');assert.equal(reused.color,'#e53935');assert.equal(reused.role,'N');
 assert.equal(Lines.recolor(t.p,by,reused.id,'#808080',6).ok,true);assert.equal(t.p.colorLocks['#e53935'],undefined);assert.equal(t.p.colorLocks['#808080'],'N');
});
test('two probes measure existing wires without modifying their routes, identities or topology',()=>{
 const t=setup(),s=t.add('supply-dc-plus','s'),h=t.add('lamp-green','h'),m=t.add('unit-ut33d-plus','m'),r=t.add('test-probe-red','r'),k=t.add('test-probe-black','k');m.meterPosition=4;
 const pos=t.wire(s,'P',h,'X1'),neg=t.wire(s,'M',h,'X2'),red=t.wire(m,'V',r,'PLUG'),black=t.wire(m,'COM',k,'PLUG');
 r.probeTarget={w:pos.id,t:.47};k.probeTarget={w:neg.id,t:.71};const before=JSON.stringify([pos.from,pos.to,pos.points,neg.from,neg.to,neg.points]);
 assert.equal(t.solve().stable,true);assert.equal(m._meter.value,24);assert.equal(t.p.wires.length,4);assert.equal(t.p.junctions.length,0);assert.equal(JSON.stringify([pos.from,pos.to,pos.points,neg.from,neg.to,neg.points]),before);
 assert.equal(red.color,'#e53935');assert.equal(black.color,'#111827');assert.equal(red.role,'MEASURE');assert.equal(t.p.colorLocks['#e53935'],undefined);assert.equal(t.p.colorLocks['#111827'],'0V');assert.equal(red.size,'6 mm²');
 Lines.setSize(t.p,'#111827',.75);assert.equal(black.size,'6 mm²');assert.equal(neg.size,'0,75 mm²');
 delete r.probeTarget;t.solve();assert.equal(m._meter.value,0);
 r.probeTarget={w:pos.id,t:.47};t.p.wires=t.p.wires.filter(w=>w!==pos);Lines.synchronize(t.p,by);assert.equal(r.probeTarget,undefined);t.solve();assert.equal(m._meter.value,0);
});
test('flexible leads use broad smooth cubics, exact endpoints and non-grid contacts',()=>{
 const a={pos:{x:12.375,y:85.125},side:'bottom'},b={pos:{x:456.25,y:220.5},side:'left'},first=Leads.curve(a,b),moved=Leads.curve(a,b,{x:27.25,y:-63.75});
 for(const curve of [first,moved]){assert.match(curve.path,/^M12\.375 85\.125 C/);assert.ok(curve.path.endsWith('456.25 220.5'));assert.equal((curve.path.match(/C/g)||[]).length,2);assert.doesNotMatch(curve.path,/[LQ]/)}
 assert.notEqual(first.path,moved.path);assert.equal(moved.bend.x-first.bend.x,27.25);
 const route=[{x:0,y:0},{x:100,y:0},{x:100,y:100}],hit=Leads.nearest(route,{x:57.375,y:3});assert.deepEqual(hit.point,{x:57.375,y:0});assert.equal(hit.distance,3);assert.deepEqual(Leads.at(route,hit.t),hit.point);
});
