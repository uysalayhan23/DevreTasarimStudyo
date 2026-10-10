const {test}=require('node:test'),assert=require('node:assert/strict'),{createApp}=require('./helpers/offline-dom.cjs'),A=require('../dist/acs800.js');
function project(){const v={id:'v',typeId:A.id,x:400,y:100,ref:'U1'};A.create(v);v.acs800.reference=740;return {name:'ACS800 R5',workspaceMode:'control',components:[{id:'g',typeId:'supply-3p',x:180,y:100,ref:'G1'},v,{id:'m',typeId:'motor-3p',x:1200,y:700,ref:'M1',motorConnection:'star'}],wires:[['g','L1','v','U1'],['g','L2','v','V1'],['g','L3','v','W1'],['v','U2','m','U'],['v','V2','m','V'],['v','W2','m','W']].map(([a,b,c,d],i)=>({id:'w'+i,from:{c:a,p:b},to:{c,p:d}})),junctions:[]};}
const down=(a,node)=>{assert.ok(node);node.emit('pointerdown',{clientX:500,clientY:350});a.window.emit('pointerup',{buttons:0});},comp=(a,id)=>a.$('#scene [data-id="'+id+'"]');
test('ACS800 sidebar opens a working parameter window; live body/panel touches work and terminal touch warns',()=>{
 for(const appearance of ['iec','material']){
  const a=createApp({project:project(),appearance}),E=a.window.DTSEditor;a.$('#simulateBtn').click();down(a,comp(a,'v').querySelector('.body'));assert.equal(E.running,true);assert.equal(a.$('#acs800Settings').hidden,false);a.$('#acs800Parameters').click();assert.equal(a.$('#acs800Modal').hidden,false);assert.match(a.$('#acs800Content').textContent,/HAZIR/);
  a.$('[data-acs800-command="run"]').click();a.tick(20000);assert.equal(E.getProject().components.find(c=>c.id==='v')._acs800.hz,25);assert.match(a.$('[data-acs800-live]').textContent,/ÇALIŞIYOR/);assert.equal(E.running,true);
  a.$('[data-acs800-tab="parameters"]').click();a.$('#acs800Search').value='22.02';a.$('#acs800Search').emit('input');const input=a.$('[data-acs800-param="22.02"]');input.value='5';input.emit('change');assert.equal(E.getProject().components.find(c=>c.id==='v').acs800.params['22.02'],5);
  a.$('#acs800Search').value='99.06';a.$('#acs800Search').emit('input');const locked=a.$('[data-acs800-param="99.06"]');locked.value='100';locked.emit('change');assert.equal(locked.value,'141');assert.equal(a.$('#acs800Error').hidden,false);
  a.$('#acs800Close').click();down(a,comp(a,'v').querySelector('[data-acs800-action="stop"]'));assert.equal(E.running,true);assert.equal(E.getProject().components.find(c=>c.id==='v')._acs800.hz,0);
  down(a,comp(a,'v').querySelector('[data-port="X21:3"]'));assert.equal(E.running,true);assert.equal(a.$('#safetyModal').hidden,true);assert.match(a.$('#statusText').textContent,/canlı uygulanıyor/i);
 }
});
test('native CDP parameter button, keyboard controls and hardware jumper edits retain editor safety',()=>{
 const a=createApp({project:project(),appearance:'material'}),E=a.window.DTSEditor;a.$('#simulateBtn').click();comp(a,'v').querySelector('[data-acs800-action="run"]').emit('keydown',{key:'Enter'});a.tick(20000);assert.equal(E.getProject().components.find(c=>c.id==='v')._acs800.hz,25);
 down(a,comp(a,'v').querySelector('[data-acs800-action="params"]'));assert.equal(a.$('#acs800Modal').hidden,false);assert.ok(a.$('#acs800Search'));
 a.$('[data-acs800-tab="connections"]').click();const bridge=a.$('[data-acs800-jumper="diilBridge"]');bridge.checked=false;bridge.emit('change');assert.equal(E.running,true);assert.equal(E.getProject().components.find(c=>c.id==='v').acs800.diilBridge,true);assert.equal(a.$('#safetyModal').hidden,true);
 E.stop();bridge.checked=false;bridge.emit('change');assert.equal(E.getProject().components.find(c=>c.id==='v').acs800.diilBridge,false);a.$('#acs800Close').emit('keydown',{key:'Escape'});assert.equal(a.$('#acs800Modal').hidden,true);
});
