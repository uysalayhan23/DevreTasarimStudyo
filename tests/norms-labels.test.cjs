const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Symbols=require('../dist/symbols.js'),Norms=require('../dist/norms.js'),Labels=require('../dist/labels.js'),Catalog=require('../dist/catalog.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),context);
const lib=Catalog.prepare(Symbols.prepareLibrary(context.window.COMPONENT_LIBRARY)),byId=Object.fromEntries(lib.map(d=>[d.id,d]));
test('all norms and material styles preserve every existing terminal in every orientation',()=>{
  for(const d of lib)for(const rotation of [0,90,180,270]){
    const c={id:'c',ref:'K1',label:'Etiket',rotation,state:true,_active:true,_contactStates:{main:true}},before=JSON.stringify([c,d]);
    for(const norm of ['TSE','IEC','ANSI'])for(const mode of ['iec','material']){
      const m=Symbols.markup(d,c,{norm,mode});assert.ok(!/undefined|NaN|Infinity/.test(m),d.id+'/'+norm);
      if(mode==='material'&&d.id==='sinamics-v20-1p'){
        const overlay=Symbols.markup(d,c,{norm,mode,wireOverlayOnly:true});
        assert.equal((overlay.match(/class="port-group/g)||[]).length,d.pins.length);
      }else assert.equal((m.match(/class="port-group/g)||[]).length,d.pins.length);
      const visible=require('../dist/assemblies.js').definition(d,c,mode);
      assert.deepEqual(visible.pins.map(p=>p.id),d.pins.map(p=>p.id),'view changes keep terminal identities');
      for(const p of visible.pins){const q=Symbols.rotatedPoint(p,visible,rotation);assert.ok(m.includes(`cx="${q.x}" cy="${q.y}"`),d.id+'/'+norm+'/'+p.id)}
      assert.equal(JSON.stringify([c,d]),before,'Rendering must never edit the component or terminals');
    }
  }
});
test('norm choices draw actual graphic variants, and every library preview shares its canvas drawing',()=>{
  const body=(id,norm)=>Norms.drawing(byId[id],{},norm).body.replace(/data-symbol-norm="[^"]+"/g,'');
  for(const id of ['coil-contactor','mcb-1p'])assert.equal(new Set(['TSE','IEC','ANSI'].map(n=>body(id,n))).size,3,id);
  for(const id of ['contact-no','contact-nc','push-no','resistor','transformer','rectifier'])assert.notEqual(body(id,'IEC'),body(id,'ANSI'),id);
  for(const norm of ['TSE','IEC','ANSI'])for(const d of lib){
    const c={ref:Symbols.referencePrefix(d)+'1',label:d.name,state:false,rotation:0,_active:false};
    assert.ok(Symbols.preview(d,'iec',norm).includes(Symbols.markup(d,c,{mode:'iec',norm})),d.id+'/'+norm);
  }
});
test('names, notes, addresses, pin names and symbol lettering move independently at any zoom and survive rotation/save',()=>{
  const d=byId['coil-contactor'],c={id:'k',typeId:d.id,x:170,y:220,rotation:0,ref:'K1',label:'Kontaktör açıklaması kesilmeden görüntülensin',address:'Q0.0',note:'Pano 1\nFan kumandası',state:false};
  const original=JSON.stringify(c),keys=['ref','label','address','note','pin:A1','pin:A2','symbol:function'];
  keys.forEach((key,i)=>{const start=Labels.begin(c,key,{x:40,y:20},{x:300,y:400},2.5);Labels.move(c,start,{x:400+i*25,y:350-i*25})});
  const saved=JSON.parse(JSON.stringify(c));assert.equal(JSON.stringify({...saved,labelPositions:undefined}),original);
  for(const norm of ['TSE','IEC','ANSI'])for(const rotation of [0,90,180,270]){
    saved.rotation=rotation;const m=Symbols.markup(d,saved,{mode:'iec',norm});
    for(const key of keys){if(key==='symbol:function'&&norm!=='ANSI')continue;const pos=Labels.position(saved,key,{x:0,y:0});assert.match(m,new RegExp('data-label-key="'+key+'"[^>]*transform="translate\\('+pos.x+' '+pos.y+'\\)"'))}
    const textStart=m.indexOf('class="component-annotations"');assert.ok(!m.slice(textStart).includes('rotate('),'Moved text must stay upright');
    assert.ok(m.includes(c.label));assert.ok(m.includes('Fan kumandası'));
  }
  Labels.reset(saved,'ref');assert.equal(saved.labelPositions.ref,undefined);assert.ok(saved.labelPositions['pin:A1']);Labels.reset(saved);assert.equal(saved.labelPositions,undefined);
  Labels.sanitize({labelPositions:{ref:{x:Infinity,y:0},note:{x:13,y:5}}});
});
test('catalog groups every element once and area/norm/brand/family filters combine without hiding norms',()=>{
  const all=Catalog.sections(lib),ids=all.flatMap(g=>g.items.map(d=>d.id));assert.equal(new Set(ids).size,lib.length);assert.equal(ids.length,lib.length);
  assert.equal(byId['coil-contactor'].classification.group,'contactors');assert.equal(byId['contact-nc'].classification.group,'auxiliary');assert.equal(byId['push-no'].classification.group,'buttons');assert.equal(byId['lamp-green'].classification.group,'lamps');
  const filters={category:'plc',area:'automation',brand:'Siemens',series:'S7-1200',group:'digital-in'};
  const a=Catalog.sections(lib,filters).flatMap(g=>g.items.map(d=>d.name));assert.deepEqual(a,['SM 1221 DI 8','SM 1221 DI 16']);
  for(const norm of ['IEC','TSE','ANSI'])assert.deepEqual(Catalog.sections(lib,{...filters,norm}).flatMap(g=>g.items.map(d=>d.name)),a);
  const cases={'AS16AM10N-A':'digital-in','AH16ANNN':'digital-in','TM3DI16':'digital-in','TM3AI4':'analog-in','NX-SL5500':'safety','GXM-42AN 4AI/2AO':'analog-io','CP1W-CIF11':'communication'};
  for(const [name,group] of Object.entries(cases))assert.equal(lib.find(d=>d.name===name).classification.group,group,name);
});
