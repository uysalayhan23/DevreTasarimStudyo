'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const Engineering=require('../dist/panel-engineering.js');
const verified={status:'verified',sourceUrl:'https://manufacturer.example/data-sheet'};
const item=(id,x,extra={})=>({id,typeId:'mcb',x,y:100,w:40,h:60,mount:'rail',
  dimensionStatus:'verified',panelGeometryStatus:'ready',physicalDimensionStatus:'verified',
  dimensionSource:'https://manufacturer.example/data-sheet',
  engineering:{...verified,serviceClearanceMm:5,heatLossW:1},...extra});
const panel=(items=[],wires=[])=>({width:600,height:800,depth:220,items,wires,rails:[],ducts:[]});
const noCriteria=row=>row.missing.includes('verified-manufacturer-clearance-requirements');
function summaryUI(p){
 const source=fs.readFileSync(path.join(__dirname,'../dist/panel-editor.js'),'utf8');
 const start=source.indexOf('  function engineeringSummary(p,closure){'),end=source.indexOf('  function render(properties=true){',start);
 assert.ok(start>=0&&end>start,'real panel-editor engineeringSummary must exist');
 const scope=source.slice(start,end);
 const nodes=new Map([['#panelEngineeringStatus',{textContent:'',dataset:{}}],['#panelEngineeringDetail',{textContent:''}],['#panelEngineeringReport',{innerHTML:''}]]);
 const summary=new Function('Engineering','E','P','$','esc',scope+'\nreturn engineeringSummary;')(
   Engineering,{byId:{}},{doorClearance:()=>({ok:true})},k=>nodes.get(k),s=>String(s)
 );
 summary(p,{ok:true});
 return Object.fromEntries([...nodes].map(([k,v])=>[k,v]));
}
test('P6-03 absence of manufacturer requirements is REVIEW, not an audited zero',()=>{
 const p=panel([item('A1',100),item('A2',300)]);
 const rows=Engineering.manufacturerClearanceAudit(p);
 assert.equal(rows.length,2);
 assert.equal(rows.filter(x=>x.status==='unknown').length,2);
 assert.ok(rows.every(noCriteria));
 assert.equal(Engineering.audit(p,{}).summary.unknownChecks,2);
});
test('P6-03 all other inputs verified cannot produce false green status without manufacturer requirements',()=>{
 const p=panel([item('A1',100),item('A2',300)]);
 const ui=summaryUI(p);
 assert.equal(ui['#panelEngineeringStatus'].dataset.state,'unknown');
 assert.match(ui['#panelEngineeringStatus'].textContent,/Veri eksik/);
 assert.match(ui['#panelEngineeringReport'].innerHTML,/2 cihaz için üretici montaj kriteri yok \(REVIEW\)/);
 assert.doesNotMatch(ui['#panelEngineeringStatus'].textContent,/Doğrulanmış kontrollerde ihlal yok/);
});
test('P6-03 verified manufacturer requirement keeps legitimate clearance PASS',()=>{
 const p=panel([item('A1',100,{requiredClearanceMm:{freeAirFlow:{up:20}}})]);
 const [row]=Engineering.manufacturerClearanceAudit(p);
 assert.equal(row.status,'ok');
 assert.equal(row.authority,'verified-product-and-panel-geometry');
 assert.equal(row.checks[0].requiredMm,20);
 assert.equal(row.checks[0].availableMm,100);
 assert.ok(!noCriteria(row));
});
test('P6-03 insufficient measured clearance still reports manufacturer violation',()=>{
 const p=panel([item('A1',100,{requiredClearanceMm:{freeAirFlow:{up:150}}})]);
 const result=Engineering.audit(p,{});
 assert.equal(result.manufacturerClearanceAudit[0].status,'violation');
 assert.equal(result.summary.verifiedViolations,1);
 assert.equal(summaryUI(p)['#panelEngineeringStatus'].dataset.state,'violation');
});
test('P6-03 mixed evidence shows both confirmed result and missing criteria',()=>{
 const p=panel([item('A1',100,{requiredClearanceMm:{freeAirFlow:{up:20}}}),item('A2',300)]);
 const rows=Engineering.manufacturerClearanceAudit(p);
 assert.equal(rows.length,2);
 assert.equal(rows.filter(x=>x.status==='ok').length,1);
 assert.equal(rows.filter(x=>x.status==='unknown').length,1);
 assert.equal(Engineering.audit(p,{}).summary.unknownChecks,1);
 assert.match(summaryUI(p)['#panelEngineeringReport'].innerHTML,/1 cihaz için üretici montaj kriteri yok \(REVIEW\)/);
});
test('P6-03 empty panels do not claim verified manufacturer clearance',()=>{
 const p=panel([]);
 assert.equal(Engineering.manufacturerClearanceAudit(p).length,0);
 assert.equal(Engineering.audit(p,{}).summary.verifiedViolations,0);
});
test('P6-03 empty panel shows explicitly unassessed rather than compliance',()=>{
 const ui=summaryUI(panel());
 assert.equal(ui['#panelEngineeringStatus'].dataset.state,'unknown');
 assert.match(ui['#panelEngineeringStatus'].textContent,/Denetim için cihaz\/kablo yok/);
 assert.doesNotMatch(ui['#panelEngineeringStatus'].textContent,/ihl[aâ]l yok/);
});
test('P6-03 two devices plus two unroutable wires report eight unknown checks',()=>{
 const p=panel([item('A1',100,{engineering:{}}),item('A2',300,{engineering:{}})],
  [{id:'w1',from:{c:'A1',p:'1'},to:{c:'A2',p:'2'}},{id:'w2',from:{c:'A1',p:'3'},to:{c:'A2',p:'4'}}]);
 const s=Engineering.audit(p,{}).summary;
 assert.equal(s.verifiedViolations,0);
 assert.equal(s.unknownChecks,8);
 const ui=summaryUI(p);
 assert.match(ui['#panelEngineeringStatus'].textContent,/8 kontrol doğrulanamıyor/);
 assert.match(ui['#panelEngineeringReport'].innerHTML,/2 cihaz için üretici montaj kriteri yok \(REVIEW\)/);
});
