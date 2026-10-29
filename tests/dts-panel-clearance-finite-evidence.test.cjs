'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/panel-engineering.js');
const specimen=()=>({width:600,height:800,items:[{
 id:'power',x:100,y:100,w:50,h:60,mount:'plate',dimensionStatus:'verified',
 panelGeometryStatus:'ready',physicalDimensionStatus:'verified',
 dimensionSource:'https://manufacturer.example/specs',
 requiredClearanceMm:{freeAirFlow:{up:20}}
}]});
const clearance=p=>E.manufacturerClearanceAudit(p)[0];
test('P6-03 verified labels never make missing coordinates an approved clearance',()=>{
 const p=specimen();delete p.items[0].x;
 const out=clearance(p);
 assert.equal(out.status,'unknown');assert.ok(out.missing.includes('verified-panel-geometry'));
 assert.equal(out.checks.length,0);
});
test('P6-03 null and empty dimensions do not become zero coordinates',()=>{
 for(const invalid of [null,'',NaN]){
  const p=specimen();p.items[0].x=invalid;
  assert.equal(clearance(p).status,'unknown');
 }
});
test('P6-03 malformed neighboring component cannot fabricate a safe side gap',()=>{
 const p=specimen();p.items[0].requiredClearanceMm={neighbouringSubassemblies:{side:10}};
 p.items.push({id:'near',x:null,y:100,w:40,h:50,mount:'plate'});
 assert.equal(clearance(p).status,'unknown');
});
test('P6-03 missing enclosure dimensions cannot certify manufacturer clearance',()=>{
 const p=specimen();delete p.width;
 assert.equal(clearance(p).status,'unknown');
});
test('P6-03 null and blank manufacturer measurements never certify zero clearance',()=>{
 for(const val of [null,'', '  ', 'not-measured']){
  const p=specimen();p.items[0].requiredClearanceMm.freeAirFlow.up=val;
  const out=clearance(p);
  assert.equal(out.status,'unknown');
  assert.ok(out.missing.includes('verified-clearance-measure:freeAirFlow:up'));
 }
});
test('P6-03 missing measurement on a second side does not hide behind a valid first side',()=>{
 const p=specimen();p.items[0].requiredClearanceMm.freeAirFlow.down=null;
 const out=clearance(p);
 assert.equal(out.checks.length,1);assert.equal(out.status,'unknown');
});
test('P6-03 verified numeric zero requirement remains valid',()=>{
 const p=specimen();p.items[0].requiredClearanceMm.freeAirFlow.up=0;
 const out=clearance(p);
 assert.equal(out.status,'ok');assert.equal(out.checks[0].requiredMm,0);
});
test('P6-03 measured inadequate airflow still reports a violation',()=>{
 const p=specimen();p.items[0].requiredClearanceMm.freeAirFlow.up=150;
 const out=clearance(p);
 assert.equal(out.status,'violation');assert.equal(out.checks[0].availableMm,100);
});
test('P6-03 missing unrelated manufacturer context never overrides a real violation',()=>{
 const p=specimen();p.items[0].requiredClearanceMm.freeAirFlow.up=150;
 p.items[0].requiredClearanceMm.freeAirFlow.down=null;
 const out=clearance(p);
 assert.equal(out.status,'violation');assert.ok(out.unresolved.includes('freeAirFlow:down'));
});
