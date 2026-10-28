'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Brief=require('../dist/component-brief.js'),Conductors=require('../dist/conductors.js');
test('16: model summary preserves device identity and numeric zero pin',()=>{
 const b=Brief.model({name:'PLC',kind:'plc',pins:[{id:0,label:0,signalType:'DI'}]},{ref:'PLC-07'});
 assert.deepEqual(b.terminals[0],{id:'0',label:'0',type:'DI'});
 assert.match(Brief.markup(b),/Cihaz: PLC-07/);
 assert.match(Brief.markup(b),/title="0 · DI">0<\/span>/);
});
test('16: component and pin text remain HTML-escaped',()=>{
 const html=Brief.markup(Brief.model({name:'x',pins:[{id:'<script>',label:'<img src=x>'}]},{ref:'<script>'}));
 assert.doesNotMatch(html,/<script>|<img/);assert.match(html,/Cihaz: &lt;script&gt;/);
});
test('16: missing component and fallback ID do not create fictional pins',()=>{
 assert.equal(Brief.model(null,{}),null);
 const html=Brief.markup(Brief.model({name:'R',pins:[]},{id:'res1'}));
 assert.match(html,/Cihaz: res1/);assert.match(html,/Toplam 0 uç/);
});
test('17: wire-size UI uses guardEdit before snapshot',()=>{
 const app=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
 assert.match(app,/\$\('#wireSize'\)\.onchange=e=>\{if\(!guardEdit\(\)\)return;if\(!snapshot\(\)\)return;/);
 assert.match(app,/Lines\.setSize\(project,wireColor,e\.target\.value\)/);
});
test('17: permitted cable size update changes matching ordinary colors, never probe or other colors',()=>{
 const p={wires:[{color:'#e53935',size:'1,5 mm²'},{color:'#e53935',size:'1,5 mm²'},{color:'#e53935',size:'6 mm²',probeLead:true},{color:'#1e88e5',size:'1,5 mm²'}]};
 Conductors.setSize(p,'#e53935','2,5 mm²');
 assert.deepEqual(p.wires.map(w=>w.size),['2,5 mm²','2,5 mm²','6 mm²','1,5 mm²']);
});
test('19: material pin and wire endpoints share normalized port geometry in source',()=>{
 const s=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
 assert.match(s,/function portPosition\(c,d,p\)\{\s*d=materialDefinition\(c,d\)/);
 assert.match(s,/const pos=portPosition\(c,d,p\),side=rotatedSide/);
});
test('offline app imports updated guarded UI',()=>{
 const h=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8');
 assert.match(h,/component-brief\.js\?rev=20261028-reference-pin0-guard1/);
 assert.match(h,/app\.js\?rev=20261028-wire-size-edit-guard1/);
});
