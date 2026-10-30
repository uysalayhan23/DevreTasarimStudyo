'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const app=fs.readFileSync(path.join(__dirname,'..','dist','app.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'..','dist','index.html'),'utf8');
const start=app.indexOf('  function renderTerminalLeads(){');
const end=app.indexOf('\n  function raiseTerminalLeads()',start);
assert.ok(start>=0&&end>start,'native terminal overlay renderer exists');
const core=app.slice(start,end);
const byId={
  board:{arduinoBoard:true,w:80,h:40,pins:[{id:'A',x:0,y:0},{id:'B',x:50,y:20}]},
  plc:{instrument:'tx11',w:90,h:60,pins:[{id:'Q1',x:10,y:10},{id:'M',x:70,y:50}]},
  meter:{kind:'multimeter',w:40,h:40,pins:[]}
};
function fixture(n=2,wc=6){
  const components=Array.from({length:n},(_,i)=>({id:'c'+i,typeId:i%2?'plc':'board',x:i*100,y:0}));
  components.push({id:'meter',typeId:'meter',x:0,y:0});
  const wires=Array.from({length:wc},(_,i)=>({id:'w'+i,from:{c:'c'+(i%n),p:'A'},to:{c:'c'+((i+1)%n),p:'B'},color:i%2?'#e53935':'#000000',role:'CONTROL',probeLead:i%17===0}));
  wires.push({id:'same',from:{c:'c0',p:'A'},to:{c:'c0',p:'B'},color:'#123456',role:'SIGNAL'});
  const routes=Object.fromEntries(wires.map((w,i)=>[w.id,[{x:i*10,y:10},{x:i*10+30,y:10}]]));
  return {project:{components,wires},routes};
}
function paint(f,appearance='material'){
  const roots=[];
  const svg=(tag,attrs={})=>({tag,attrs,children:[],innerHTML:'',appendChild(child){this.children.push(child);return child}});
  const Symbols={materialScale:()=>1,terminalPosition:(c,d,p)=>({x:c.x+p.x,y:c.y+p.y})};
  const absolutePort=r=>{const c=f.project.components.find(c=>c.id===r.c),d=byId[c.typeId],p=d.pins.find(p=>p.id===r.p);return{x:c.x+(p?.x||0),y:c.y+(p?.y||0)}};
  const ctx={appearance,svg,project:f.project,byId,materialDefinition:(c,d)=>d,Symbols,absolutePort,roundedPath:p=>'M'+p.map(q=>q.x+','+q.y).join('L'),renderedWirePoints:f.routes,wireStyle:w=>'color:'+w.color,selectedWire:null,flowClass:()=>'',els:{scene:{appendChild:n=>roots.push(n)}},esc:x=>x};
  vm.runInNewContext(core+';renderTerminalLeads()',ctx,{timeout:5000});
  return roots[0];
}
function ids(layer,c){return (layer?.children||[]).filter(n=>n.attrs?.['data-terminal-overlay']===c).map(n=>n.attrs['data-wire'])}
test('native renderer preserves cable order and terminal identity',()=>{
  const f=fixture(3,100),layer=paint(f);
  for(const c of f.project.components.slice(0,3)){
    const expected=f.project.wires.filter(w=>!w.probeLead&&[w.from,w.to].some(r=>r.c===c.id)).map(w=>w.id);
    assert.deepEqual(ids(layer,c.id),expected);
  }
});
test('same-device cable renders only once and retains its color',()=>{
  const f=fixture(1,0),layer=paint(f),groups=layer.children.filter(n=>n.attrs?.['data-wire']==='same');
  assert.equal(groups.length,1);assert.equal(groups[0].attrs.style,'color:#123456');
  assert.equal(groups[0].attrs['data-terminal-overlay'],'c0');
});
test('probe cables are excluded from physical terminal overlays',()=>{
  const f=fixture(2,6),layer=paint(f);
  assert.ok(!layer.children.some(n=>n.attrs?.['data-wire']==='w0'));
});
test('missing route is skipped without inventing cable geometry',()=>{
  const f=fixture(2,6);delete f.routes.w1;
  assert.ok(!paint(f).children.some(n=>n.attrs?.['data-wire']==='w1'));
});
test('wire edits rebuild the index on the next render',()=>{
  const f=fixture(2,0);
  assert.deepEqual(ids(paint(f),'c0'),['same']);
  f.project.wires.push({id:'new',from:{c:'c0',p:'A'},to:{c:'c1',p:'B'},color:'#ff0000'});
  f.routes.new=[{x:0,y:0},{x:20,y:0}];
  assert.deepEqual(ids(paint(f),'c0'),['same','new']);
  assert.deepEqual(ids(paint(f),'c1'),['new']);
});
test('400 devices and 1600 cables do not invoke quadratic wires.filter scans',()=>{
  const f=fixture(400,1600);
  f.project.wires.filter=()=>{throw Error('quadratic full-wire scan forbidden')};
  const layer=paint(f);
  assert.ok(layer.children.length>1600);
});
test('schematic view does not add physical overlay',()=>assert.equal(paint(fixture(2,6),'iec'),undefined));
test('measurement layer still paints after terminal overlay and offline app revision is current',()=>{
  const a=app.indexOf('    renderTerminalLeads();'),b=app.indexOf('    renderMeasurementOverlay();',a);
  assert.ok(a>0&&b>a);assert.ok(html.includes('app.js?rev=20261030-terminal-overlay-index1'));
});
