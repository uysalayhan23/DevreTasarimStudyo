'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/panel-engineering.js');
const panel=()=>({width:600,height:800,items:[],wires:[],ducts:[],rails:[]});
const evidence={status:'verified',sourceUrl:'https://example.invalid/manufacturer'};
const item=(extra={})=>({id:'m',x:100,y:100,w:50,h:50,mount:'plate',dimensionStatus:'verified',
 panelGeometryStatus:'ready',physicalDimensionStatus:'verified',
 dimensionSource:'https://example.invalid/datasheet',physicalProductKey:'catalog-product',...extra});
test('P6-03 verified cable radius without a routable panel wire stays unknown',()=>{
 const p=panel();p.wires.push({id:'w1',from:{c:'missing',p:'A'},to:{c:'missing',p:'B'},
  engineering:{...evidence,minBendRadiusMm:10}});
 const [row]=E.bendAudit(p,{});
 assert.equal(row.status,'unknown');assert.equal(row.authority,'insufficient-verified-data');
 assert.ok(row.missing.includes('verified-panel-wire-route'));
});
test('P6-03 verified manufacturer clearance without usable comparison stays unknown',()=>{
 const p=panel();p.items.push(item({requiredClearanceMm:{adjacentConverters:{side:15}}}));
 const [row]=E.manufacturerClearanceAudit(p);
 assert.equal(row.status,'unknown');assert.equal(row.checks.length,0);
 assert.ok(row.unresolved.includes('no-verifiable-clearance-check'));
});
test('P6-03 measurable manufacturer clearance still diagnoses a violation',()=>{
 const p=panel();p.items.push(item({requiredClearanceMm:{freeAirFlow:{up:150}}}));
 const [row]=E.manufacturerClearanceAudit(p);
 assert.equal(row.status,'violation');assert.equal(row.checks[0].availableMm,100);
});
test('P6-03 malformed source URL cannot validate duct capacity',()=>{
 const p=panel();p.ducts.push({id:'duct',engineering:{status:'verified',sourceUrl:'https://',usableAreaMm2:100,maxFillPct:50}});
 assert.equal(E.ductAudit(p)[0].fill.status,'unknown');
});
test('P6-03 embedded URL credentials cannot validate physical cable data',()=>{
 const p=panel();p.ducts.push({id:'duct',engineering:{...evidence,usableAreaMm2:100,maxFillPct:50}});
 p.wires.push({id:'wire',accessoryId:'duct',engineering:{status:'verified',
  sourceUrl:'https://manufacturer.example@evil.example/file',outerDiameterMm:2}});
 const [row]=E.ductAudit(p);assert.equal(row.fill.status,'unknown');
 assert.ok(row.fill.missing.includes('wire-outer-diameter:wire'));
});
test('P6-03 verified zero heat loss remains valid, missing value is not zero',()=>{
 const p=panel();p.items.push({id:'zero',engineering:{...evidence,heatLossW:0}});
 p.items.push({id:'missing',engineering:{...evidence,heatLossW:null}});
 p.items.push({id:'blank',engineering:{...evidence,heatLossW:' '}});
 const result=E.thermalSummary(p);
 assert.equal(result.knownItemCount,1);assert.equal(result.knownHeatLossW,0);
 assert.equal(result.unknownItemCount,2);assert.equal(result.status,'partial');
});
test('P6-03 approved engineering source retains positive duct capacity',()=>{
 const p=panel();p.ducts.push({id:'duct',engineering:{...evidence,usableAreaMm2:100,maxFillPct:50}});
 const [row]=E.ductAudit(p);
 assert.equal(row.fill.status,'ok');assert.equal(row.fill.authority,'verified-inputs');
});

test('P6-03 incomplete panel dimensions never authorize service clearance',()=>{
 const p=panel();p.items.push({id:'partial',x:100,y:100,w:50,mount:'plate',
  engineering:{...evidence,serviceClearanceMm:10}});
 const [row]=E.serviceAudit(p);
 assert.equal(row.status,'unknown');assert.equal(row.authority,'insufficient-verified-data');
 assert.ok(row.missing.includes('verified-service-geometry'));
});
test('P6-03 measured neighbouring service space still reports a violation',()=>{
 const p=panel();p.items.push({id:'a',x:20,y:20,w:40,h:40,mount:'plate',
  engineering:{...evidence,serviceClearanceMm:30}});
 p.items.push({id:'b',x:70,y:20,w:40,h:40,mount:'plate'});
 const [row]=E.serviceAudit(p);
 assert.equal(row.status,'violation');assert.equal(row.minimumAvailableMm,10);
});
