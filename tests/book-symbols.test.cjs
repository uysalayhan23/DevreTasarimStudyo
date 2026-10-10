const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const S=require('../dist/symbols.js'),C=require('../dist/components.js'),Sim=require('../dist/simulation.js'),N=require('../dist/norms.js'),Catalog=require('../dist/catalog.js');
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),ctx);
const lib=Catalog.prepare(S.prepareLibrary(ctx.window.COMPONENT_LIBRARY)),byId=Object.fromEntries(lib.map(d=>[d.id,d]));
function circuit(){
  const project={components:[],wires:[],junctions:[]};
  const add=(typeId,id,ref=id)=>{const c={id,typeId,ref,state:false};project.components.push(c);return c};
  const wire=(a,p,b,q)=>{const w={id:'w'+project.wires.length,from:{c:a.id,p},to:{c:b.id,p:q}};project.wires.push(w);return w};
  const solve=()=>Sim.solve(project,byId);return {project,add,wire,solve};
}
test('four-terminal Jog switches two independent circuits without bridging NO and NC terminals',()=>{
  const t=circuit(),s=t.add('supply-1p','ac'),dc=t.add('supply-dc-plus','dc'),j=t.add('jog-4pin','j'),on=t.add('lamp-green','on'),off=t.add('lamp-red','off');
  t.wire(s,'L',j,'13');t.wire(j,'14',on,'X1');t.wire(on,'X2',s,'N');
  t.wire(dc,'P',j,'21');t.wire(j,'22',off,'X1');t.wire(off,'X2',dc,'M');
  for(const state of [false,true,false]){j.state=state;const r=t.solve();assert.equal(r.stable,true);assert.equal(r.shortCircuit,false);assert.equal(on._active,state);assert.equal(off._active,!state)}
  C.setContactMode(t.project,j,'NC',byId,'main');t.solve();assert.equal(on._active,true);assert.equal(off._active,false);
});
test('both complementary outputs of a four-wire PNP or NPN sensor require both supply wires',()=>{
  for(const type of ['pnp','npn']){
    const t=circuit(),s=t.add('supply-dc-plus','s'),c=t.add('sensor-inductive-4wire-'+type,'b'),a=t.add('lamp-green','a'),b=t.add('lamp-red','b');
    t.wire(s,'P',c,'BN');const supply=t.wire(s,'M',c,'BU');
    t.wire(c,'BK',a,'X1');t.wire(c,'WH',b,'X1');for(const h of [a,b])t.wire(h,'X2',s,type==='pnp'?'M':'P');
    for(const state of [false,true,false]){c.state=state;assert.equal(t.solve().stable,true);assert.equal(a._active,state);assert.equal(b._active,!state);assert.equal(c._contactStates.output,state);assert.equal(c._contactStates.other,!state)}
    t.project.wires=t.project.wires.filter(w=>w!==supply);t.solve();assert.equal(a._active,false);assert.equal(b._active,false);
  }
});
test('thermal auxiliary contacts follow the named overload trip and release independently of coil references',()=>{
  const t=circuit(),s=t.add('supply-1p','s'),f=t.add('overload','f','F2'),no=t.add('thermal-contact-no','no',' f2 '),nc=t.add('thermal-contact-nc','nc','F2'),k=t.add('coil-relay','k','F2');
  const a=t.add('lamp-green','a'),b=t.add('lamp-red','b');
  t.wire(s,'L',k,'A1');t.wire(k,'A2',s,'N');t.wire(s,'L',no,'97');t.wire(no,'98',a,'X1');t.wire(s,'L',nc,'95');t.wire(nc,'96',b,'X1');for(const h of [a,b])t.wire(h,'X2',s,'N');
  for(const state of [false,true,false]){f.state=state;t.solve();assert.equal(k._active,true);assert.equal(a._active,state);assert.equal(b._active,!state)}
  no.ref='F3';f.state=true;t.solve();assert.equal(a._active,false);
});
test('three-pole packet switch passes separate phases and disconnects a real motor',()=>{
  const t=circuit(),s=t.add('supply-3p','s'),q=t.add('packet-switch-3p','q'),m=t.add('motor-3p','m');
  for(const [phase,a,b,out] of [['L1','1','2','U'],['L2','3','4','V'],['L3','5','6','W']]){t.wire(s,phase,q,a);t.wire(q,b,m,out)}
  t.solve();assert.equal(m._active,false);q.state=true;t.solve();assert.equal(m._active,true);assert.equal(m._spin,1);q.state=false;t.solve();assert.equal(m._active,false);
});
test('schematic-only analog, KNX and socket records introduce neither phantom supply nor short circuit',()=>{
  for(const id of ['knx-power','sensor-pt100','load-cell','socket-power','meter-kwh-1p','surge-arrester']){
    const t=circuit(),s=t.add('supply-1p','s'),d=t.add(id,'d'),h=t.add('lamp-green','h');
    t.wire(s,'L',h,'X1');t.wire(h,'X2',s,'N');const pins=byId[id].pins;
    t.wire(s,'L',d,pins[0].id);t.wire(s,'N',d,pins[1].id);
    const r=t.solve();assert.equal(r.blocked,false,id);assert.equal(r.stable,true,id);assert.equal(r.shortCircuit,false,id);assert.equal(h._active,true,id);assert.equal(d._active,false,id);
  }
});
test('document library records have unique IDs, valid grid terminals, shared previews and explicit source pages',()=>{
  assert.equal(new Set(lib.map(d=>d.id)).size,lib.length);
  for(const d of lib.filter(d=>d.bookSymbol)){
    assert.ok(N.reference(d,'IEC').file&&N.reference(d,'IEC').pages,d.id);
    assert.equal(new Set(d.pins.map(p=>p.id)).size,d.pins.length,d.id);
    const coords=new Set();for(const p of d.pins){
      if(d.physicalScaleSource==='workspace-space-v1:user-locked'){
        assert.ok(Number.isFinite(p.x)&&p.x>=0&&p.x<=d.w,d.id+':'+p.id+':physical-x');
        assert.ok(Number.isFinite(p.y)&&p.y>=0&&p.y<=Math.max(d.h,d.terminalEnvelopeBottomScene||d.h),d.id+':'+p.id+':physical-y');
      }else{assert.equal(p.x%10,0,d.id);assert.equal(p.y%10,0,d.id)}
      assert.ok(!coords.has(p.x+','+p.y),d.id);coords.add(p.x+','+p.y)
    }
    const c={ref:S.referencePrefix(d)+'1',label:d.name,state:false,rotation:0,_active:false};
    for(const norm of ['TSE','IEC','ANSI']){
      const m=S.markup(d,c,{mode:'iec',norm});assert.ok(m.includes('data-book-symbol="'+d.bookSymbol+'"'),d.id);assert.ok(S.preview(d,'iec',norm).includes(m),d.id);
      if(d.materialSymbol){const material=S.markup(d,c,{mode:'material',norm});assert.notEqual(material,m,d.id);assert.ok(material.includes('design-'+d.id),d.id);assert.ok(S.preview(d,'material',norm).includes(material),d.id)}
    }
    if(d.catalogGroup==='panel-layout')assert.equal(d.pins.length,0,d.id);
  }
});
