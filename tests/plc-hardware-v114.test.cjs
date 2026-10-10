const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Symbols=require('../dist/symbols.js'),Assemblies=require('../dist/assemblies.js'),Front=require('../dist/plc-front.js');
const scope={window:{}};vm.runInNewContext(fs.readFileSync(require.resolve('../dist/library.js'),'utf8'),scope);
const library=Symbols.prepareLibrary(JSON.parse(JSON.stringify(scope.window.COMPONENT_LIBRARY))),models=library.filter(d=>d.plcFront);
const get=part=>models.find(d=>d.part===part);
test('DVP-SE uses the five documented variants, octal addresses and separate relay commons',()=>{
 assert.deepEqual(models.filter(d=>d.plcFront.family==='delta-se').map(d=>d.part),['DVP12SE11R','DVP12SE11T','DVP26SE11R','DVP26SE11T','DVP26SE11S']);
 const small=get('DVP12SE11R'),large=get('DVP26SE11R'),npn=get('DVP26SE11T');
 assert(small.materialPins.filter(p=>['DI','DO'].includes(p.signalType)).every(p=>p.x===100));
 assert(large.materialPins.filter(p=>p.signalType==='DI').every(p=>p.x===50));
 assert(large.materialPins.filter(p=>p.signalType==='DO').every(p=>p.x===140));
 assert.equal(large.pins.find(p=>p.id==='INPUT:10').label,'X10');
 assert.equal(large.pins.find(p=>p.id==='OUTPUT-B:6').label,'C3');
 assert(!large.pins.some(p=>p.id==='OUTPUT-A:5'),'unused cavity is not a terminal');
 assert.equal(npn.pins.find(p=>p.id==='OUTPUT-B:3').label,'UP1');
 assert.equal(get('DVP26SE11S').outputType,'PNP');
 assert(Front.markup(large).includes('ALT YÜZ BAĞLANTILARI'),'auxiliary view must be explicit');
});
test('CP1E catalogue has all 66 listed CPUs and renewal-specific terminal hardware',()=>{
 const expected=[];
 for(const suffix of ['DR-A','DT-A','DT1-A','DR-D','DT-D','DT1-D'])expected.push('CP1E-E10'+suffix);
 for(const n of [14,20,30,40])expected.push('CP1E-E'+n+'DR-A');
 for(const n of [14,20,30,40,60])expected.push('CP1E-E'+n+'SDR-A');
 for(const n of [14,20,30,40,60])for(const suffix of ['DR-A','DT-A','DT1-A','DR-D','DT-D','DT1-D'])expected.push('CP1E-N'+n+suffix);
 for(const n of [30,40,60])for(const renewal of ['S','S1'])for(const suffix of ['DR-A','DT-D','DT1-D'])expected.push('CP1E-N'+n+renewal+suffix);
 for(const suffix of ['DR-A','DT-D','DT1-D'])expected.push('CP1E-NA20'+suffix);
 assert.deepEqual(models.filter(d=>d.part.startsWith('CP1E-')).map(d=>d.part).sort(),expected.sort());
 const n=get('CP1E-N30DT-D'),s=get('CP1E-N30SDT-D'),s1=get('CP1E-N30S1DT1-D');
 assert(!n.pins.some(p=>p.label==='V+'));assert(s.pins.some(p=>p.label==='V+'));assert(s.pins.some(p=>p.label==='COM(V−)'));
 assert.equal(s.materialPins.find(p=>p.id==='OUT-B:3'),undefined,'the wide common is one physical terminal');
 const rs=s1.materialPins.filter(p=>p.block==='RS485');assert.deepEqual(rs.map(p=>p.label),['A−','B+','FG']);assert.equal(new Set(rs.map(p=>p.y)).size,1);
 const na=get('CP1E-NA20DR-A');assert.deepEqual(na.io,{DI:12,DO:8,AI:2,AO:1});assert(na.pins.some(p=>p.label==='I IN1'));assert(na.pins.some(p=>p.label==='I OUT0'));
});
test('S7-1200 variants use valid 40-series order codes and differential pairs only on 1217C',()=>{
 assert.equal(models.filter(d=>d.plcFront.family==='siemens-s71200').length,13);
 const relay=get('6ES7214-1BG40-0XB0'),transistor=get('6ES7214-1AG40-0XB0');
 assert.equal(relay.pins.find(p=>p.id==='X12:7').label,'2L');assert.equal(transistor.pins.find(p=>p.id==='X12:1').label,'3L+');
 const hs=get('6ES7217-1AG40-0XB0');assert.equal(hs.pins.filter(p=>p.signalType==='DI_RETURN').length,4);assert.equal(hs.pins.filter(p=>p.signalType==='DO_RETURN').length,4);
 assert.equal(hs.pins.find(p=>p.id==='X13:18').label,'DQ b.1');
});
test('S7-1200 compact CPUs keep manufacturer-specific connector counts, order and physical rows',()=>{
 const seq=(part,row)=>get(part).plcFront.rows.find(r=>r.id===row).labels;
 assert.deepEqual(seq('6ES7211-1AE40-0XB0','X10'),['L+','M','FE','L+ sensor','M sensor','1M','DI a.0','DI a.1','DI a.2','DI a.3','DI a.4','DI a.5',null,null]);
 assert.deepEqual(seq('6ES7211-1AE40-0XB0','X11'),['2M','AI 0','AI 1']);
 assert.deepEqual(seq('6ES7211-1AE40-0XB0','X12'),['3L+','3M','DQ a.0','DQ a.1','DQ a.2','DQ a.3',null,null]);
 assert.deepEqual(seq('6ES7212-1BE40-0XB0','X12'),['1L','DQ a.0','DQ a.1','DQ a.2','DQ a.3','2L','DQ a.4','DQ a.5']);
 assert.deepEqual(seq('6ES7214-1AG40-0XB0','X12'),['3L+','3M','DQ a.0','DQ a.1','DQ a.2','DQ a.3','DQ a.4','DQ a.5','DQ a.6','DQ a.7','DQ b.0','DQ b.1']);
 assert.deepEqual(seq('6ES7215-1AG40-0XB0','X11'),['2M','AQ 0','AQ 1','3M','AI 0','AI 1']);
 assert.deepEqual(seq('6ES7215-1AG40-0XB0','X12'),['4L+','4M','DQ a.0','DQ a.1','DQ a.2','DQ a.3','DQ a.4','DQ a.5','DQ a.6','DQ a.7','DQ b.0','DQ b.1']);
 const c1215=get('6ES7215-1AG40-0XB0');assert.deepEqual(c1215.io,{DI:14,DO:10,AI:2,AO:2});
 for(const size of [1211,1212,1214,1215])for(const variant of ['A','B','H']){
  const part='6ES7'+String(size).slice(1)+'-1'+variant+(size<=1212?'E':'G')+'40-0XB0',d=get(part);
  assert(d,part);assert.equal(d.orientation,'front',part);
  const x10=d.plcFront.rows.find(r=>r.id==='X10'),x11=d.plcFront.rows.find(r=>r.id==='X11'),x12=d.plcFront.rows.find(r=>r.id==='X12');
  assert.equal(x10.side,'top');assert.equal(x11.side,'top');assert.equal(x12.side,'bottom');
  assert.equal(x10.pitch,10);assert.equal(x11.pitch,10);assert.equal(x12.pitch,10);
  assert(x11.x>x10.x+(x10.labels.length-1)*x10.pitch,'X11 must be a separate upper connector');
  const svg=Front.markup(d,{id:'front-check'});assert(svg.includes('data-projection="front"'));assert(!svg.includes('photo-plane'));
 }
});
test('GMT CPU and expansion modules retain their actual front connector banks',()=>{
 assert.equal(models.filter(d=>d.brand==='GMTCNT').length,23);
 const basic=get('GLC-196R'),analog=get('GLC-296T');assert.equal(basic.io.AI,0);assert.equal(analog.io.AI,1);
 assert(analog.materialPins.filter(p=>['DI','DO','AI','AO'].includes(p.signalType)).every(p=>p.x===130));
 assert.equal(get('GXM-16IA').materialPins.filter(p=>p.label==='COM').length,2);
 const mixed=get('GXM-42AN');assert(mixed.materialPins.find(p=>p.label==='AO0 V+').y<mixed.materialPins.find(p=>p.label==='AI0 V+').y);
 assert.deepEqual(get('GXM-20L').materialPins.slice(0,6).map(p=>p.label),['CH0 +EX','CH0 +SN','CH0 +SG','CH0 −SG','CH0 −SN','CH0 −EX']);
});
test('CP2E catalogue contains exactly the 39 manufacturer CPU order codes',()=>{
 const expected=[];for(const n of [14,20,30,40,60])for(const suffix of ['DR-A','DT-A','DR-D','DT-D','DT1-D'])expected.push('CP2E-N'+n+suffix);
 for(const n of [30,40,60])for(const suffix of ['DR-A','DT-D','DT1-D'])expected.push('CP2E-S'+n+suffix);
 for(const n of [14,20,30,40,60])expected.push('CP2E-E'+n+'DR-A');
 assert.deepEqual(models.filter(d=>d.part.startsWith('CP2E-')).map(d=>d.part).sort(),expected.sort());
 assert.equal(get('CP2E-N14DT1-A'),undefined,'nonexistent AC sourcing variant must not be invented');
});
test('W613 terminal examples preserve stagger, commons, PE, unused cavities and channel words',()=>{
 const d=get('CP2E-N14DR-A'),pin=id=>d.materialPins.find(p=>p.id===id);
 assert.equal(pin('IN-A:1').label,'L1');assert.equal(pin('IN-B:1'),undefined);assert.equal(pin('IN-B:2').label,'PE');
 assert.equal(pin('IN-A:4').label,'0.01');assert.equal(pin('IN-B:3').label,'0.00');
 assert.equal(pin('IN-B:3').x-pin('IN-A:3').x,10);
 assert.equal(pin('OUT-A:6').label,'100.05');assert.equal(pin('OUT-A:7'),undefined);
 assert.equal(d.materialPins.filter(p=>p.block.startsWith('OUT')&&p.label==='COM').length,4);
 const large=get('CP2E-N60DT1-D');
 assert.equal(large.materialPins.find(p=>p.id==='IN-A:1').label,'+');
 assert(!large.materialPins.some(p=>p.label==='FE'||p.label==='+24V'));
 assert(large.materialPins.some(p=>p.label==='2.11'));assert(large.materialPins.some(p=>p.label==='102.07'));
 assert.equal(large.outputType,'PNP');
});
test('every model has unique complete I/O, and every visual screw is its connectable endpoint',()=>{
 for(const d of models){
  const svg=Front.markup(d,{id:'check'}),byId=Object.fromEntries(d.materialPins.map(p=>[p.id,p]));
  assert.equal(new Set(d.pins.map(p=>p.id)).size,d.pins.length,d.part);
  for(const type of ['DI','DO','AI','AO'])assert.equal(d.pins.filter(p=>p.signalType===type).length,d.io[type],d.part+' '+type);
  assert.equal([...svg.matchAll(/data-plc-terminal=/g)].length,d.pins.length,d.part);
  for(const p of d.pins){const q=byId[p.id];assert(q);assert(q.x>0&&q.x<d.w&&q.y>0&&q.y<d.h);assert.equal(q.x%10,0,d.part+' '+p.id+' x-grid');assert.equal(Number.isInteger(q.y),true,d.part+' '+p.id+' y-coordinate');assert(svg.includes(`data-plc-terminal="${p.id}" cx="${q.x}" cy="${q.y}"`),d.part+' '+p.id)}
 }
});
test('all rotations connect to the front screw while preserving schematic identities',()=>{
 for(const d of models)for(const rotation of [0,90,180,270]){
  const c={id:'cpu',rotation,materialScale:1},def=Assemblies.definition(d,c,'material'),svg=Symbols.markup(d,c,{mode:'material'});
  for(const p of def.pins){const q=Symbols.rotatedPoint(p,def,rotation);assert(svg.includes(`cx="${q.x}" cy="${q.y}" r="9"`),d.part+' '+p.id)}
  assert.deepEqual(def.pins.map(p=>p.id),d.pins.map(p=>p.id));
 }
});
test('the legacy family entry retains old endpoint identities for existing projects',()=>{
 const old=library.find(d=>d.id==='plc-7-2');assert(old.superseded);assert.equal(old.plcFront,undefined);assert(old.pins.length>0);
});
