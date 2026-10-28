'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),Lines=require('../dist/conductors.js');
const src=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
const begin=src.indexOf('function updateWireStatus(){'),end=src.indexOf('function populateWireMenu(){',begin);
if(begin<0||end<begin)throw Error('missing wire status');
const snippet=src.slice(begin,end).trim();
const model={wires:[{id:'blue',color:'#1e88e5',role:'N',size:'2,5 mm²'},{id:'probe',color:'#1e88e5',role:'MEASURE',size:'0,75 mm²',probeLead:true}],
 colorSizes:{'#e53935':'1,5 mm²','#1e88e5':'2,5 mm²'},colorRoles:{'#e53935':'L1','#1e88e5':'N'},
 colorVoltages:{'#e53935':'24 V DC','#1e88e5':'230 V AC'},colorLocks:{}};
function view(selectedWire,wireColor){
 const controls={},dots=['#e53935','#1e88e5'].map(color=>{
  const dot={dataset:{color},active:false};
  dot.classList={toggle(name,v){dot.active=v}};
  return dot;
 });
 const $=key=>controls[key]||(controls[key]={value:'',innerHTML:'',textContent:'',disabled:false});
 const $$=()=>dots;
 const fn=new Function('project','selectedWire','wireColor','Lines','$','$$','colorNames','roleName','conductorRoles','esc',snippet+';return updateWireStatus;');
 fn(model,selectedWire,wireColor,Lines,$,$$,
 {'#e53935':'Kırmızı','#1e88e5':'Mavi'},v=>v,[['CONTROL','Kontrol'],['L1','Faz'],['N','Nötr']],v=>v)();
 return {controls,dots};
}
test('selected blue wire overrides stale red palette in all readouts',()=>{
 const {controls,dots}=view('blue','#e53935');
 assert.equal(controls['#wireSize'].value,'2,5 mm²');
 assert.equal(controls['#wireRole'].value,'N');
 assert.equal(controls['#wireVoltage'].value,'230 V AC');
 assert.equal(dots[1].active,true);assert.equal(dots[0].active,false);
});
test('no selected wire uses palette defaults without stale cable data',()=>{
 const {controls,dots}=view(null,'#e53935');
 assert.equal(controls['#wireSize'].value,'1,5 mm²');
 assert.equal(controls['#wireRole'].value,'L1');
 assert.equal(controls['#wireVoltage'].value,'24 V DC');assert.equal(dots[0].active,true);
});
test('probe keeps its own size and disables regular wire roles',()=>{
 const {controls}=view('probe','#e53935');
 assert.equal(controls['#wireSize'].value,'0,75 mm²');
 assert.equal(controls['#wireRole'].value,'MEASURE');
 assert.equal(controls['#wireRole'].disabled,true);
 assert.equal(controls['#wireVoltage'].disabled,true);
});
test('view refresh is read-only for cable saved identities and color settings',()=>{
 const before=JSON.stringify(model);view('blue','#e53935');assert.equal(JSON.stringify(model),before);
});
test('reconnect uses the selected wire color and ordinary edits keep safety gate',()=>{
 assert.match(src,/function beginReconnect\(w,end,e\)\{[\s\S]{0,200}?selectedWire=w\.id;wireColor=w\.color;setSelection/);
 assert.match(src,/\$\('#wireSize'\)\.onchange=e=>\{if\(!guardEdit\(\)\)return;if\(!snapshot\(\)\)return;/);
});
