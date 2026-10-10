const test=require('node:test');
const assert=require('node:assert/strict');
const Engineering=require('../dist/panel-engineering.js');

function basePanel(){
  return {
    width:600,height:800,depth:220,doorAngle:105,
    rails:[{id:'r1',x:40,y:150,length:400}],
    ducts:[{id:'d1',x:500,y:40,width:30,length:600,vertical:true}],
    items:[],
    wires:[]
  };
}

test('WP-015 duct fill remains unknown when physical cable/duct engineering inputs are not verified',()=>{
  const p=basePanel();
  p.wires=[
    {id:'w1',role:'L1',size:'2,5 mm²',accessoryId:'d1'},
    {id:'w2',role:'SIGNAL',size:'0,75 mm²',accessoryId:'d1'}
  ];
  const [d]=Engineering.ductAudit(p);
  assert.equal(d.fill.status,'unknown');
  assert.equal(d.fill.authority,'insufficient-verified-data');
  assert.ok(d.fill.missing.includes('verified-duct-capacity'));
  assert.ok(d.fill.missing.some(x=>x==='wire-outer-diameter:w1'));
  assert.equal(d.segregation.status,'advisory');
  assert.equal(d.segregation.authority,'training-advisory');
  assert.deepEqual(d.roleClasses,['power','signal']);
});

test('WP-015 duct fill uses explicit verified outer diameters and verified usable area only',()=>{
  const p=basePanel();
  p.ducts[0].engineering={status:'verified',sourceUrl:'https://example.invalid/duct-datasheet',usableAreaMm2:100,maxFillPct:40};
  p.wires=[
    {id:'w1',role:'L1',size:'2,5 mm²',accessoryId:'d1',engineering:{status:'verified',sourceUrl:'https://example.invalid/cable-a',outerDiameterMm:10}},
    {id:'w2',role:'N',size:'2,5 mm²',accessoryId:'d1',engineering:{status:'verified',sourceUrl:'https://example.invalid/cable-b',outerDiameterMm:5}}
  ];
  const [d]=Engineering.ductAudit(p);
  assert.equal(d.fill.status,'violation');
  assert.equal(d.fill.authority,'verified-inputs');
  assert.equal(d.fill.maxFillPct,40);
  assert.ok(d.fill.fillPct>90);
  assert.deepEqual(d.fill.missing,[]);
  assert.equal(d.segregation.mixedClasses,false);
});

test('WP-015 non-authoritative engineering metadata cannot unlock compliance result',()=>{
  const p=basePanel();
  p.ducts[0].engineering={status:'verified',sourceUrl:'not-a-url',usableAreaMm2:100,maxFillPct:40};
  p.wires=[{id:'w1',role:'L1',accessoryId:'d1',engineering:{status:'verified',sourceUrl:'https://example.invalid/cable',outerDiameterMm:3}}];
  assert.equal(Engineering.ductAudit(p)[0].fill.status,'unknown');
});

test('WP-015 bend geometry reports physical room at a turn without inventing a cable requirement',()=>{
  const turns=Engineering.turnMetrics([{x:0,y:0,z:20},{x:20,y:0,z:20},{x:20,y:30,z:20}]);
  assert.equal(turns.length,1);
  assert.equal(turns[0].feasibleRadiusMm,10);
});

test('WP-015 BOM is derived from current panel objects and does not mutate project data',()=>{
  const p=basePanel();
  p.items=[
    {id:'i1',typeId:'x',ref:'X1',x:100,y:100,w:40,h:60,depth:30,mount:'plate',dimensionStatus:'verified'},
    {id:'i2',typeId:'x',ref:'X2',x:200,y:100,w:40,h:60,depth:30,mount:'plate',dimensionStatus:'approximate'}
  ];
  const before=JSON.stringify(p);
  const report=Engineering.bom(p,{x:{id:'x',name:'Deneme cihazı',pins:[]}});
  assert.equal(report.items.length,1);
  assert.equal(report.items[0].quantity,2);
  assert.equal(report.items[0].dimensionStatus.verified,1);
  assert.equal(report.items[0].dimensionStatus.approximate,1);
  assert.equal(report.rails.quantity,1);
  assert.equal(report.ducts.quantity,1);
  assert.equal(report.wires.quantity,0);
  assert.equal(JSON.stringify(p),before);
});

test('WP-015 audit is advisory and only verified inputs may contribute verified violations',()=>{
  const p=basePanel(),before=JSON.stringify(p);
  const r=Engineering.audit(p,{}, {doorClearance:()=>({ok:true})});
  assert.equal(r.schemaVersion,1);
  assert.equal(r.mode,'advisory');
  assert.match(r.policy,/No regulatory\/compliance claim/);
  assert.equal(r.summary.verifiedViolations,0);
  assert.ok(r.summary.unknownChecks>=1);
  assert.equal(r.doorClearance.status,'ok');
  assert.equal(JSON.stringify(p),before);
});

test('browser loads WP-015 panel engineering sidecar before panel runtime',()=>{
  const html=require('node:fs').readFileSync(require.resolve('../dist/index.html'),'utf8');
  const eng=html.indexOf('panel-engineering.js');
  const panel=html.indexOf('panel.js?');
  assert.ok(eng>=0&&panel>eng);
});


test('WP-015 panel UI exposes advisory engineering summary and standard duct threading',()=>{
  const fs=require('node:fs');
  const html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8');
  const editor=fs.readFileSync(require.resolve('../dist/panel-editor.js'),'utf8');
  assert.match(html,/id="panelEngineeringSummary"/);
  assert.match(html,/Mühendislik denetimi · advisory/);
  assert.match(editor,/Engineering\.audit\(/);
  assert.match(editor,/Unknown sonuçlar uygunluk onayı değildir/);
  assert.match(editor,/const entries=panel\(\)\.ducts;/);
  assert.match(editor,/Kablo kanalı/);
});

test('WP-015 duct utilization only includes wires explicitly assigned by accessoryId',()=>{
  const p=basePanel();
  p.ducts[0].engineering={status:'verified',sourceUrl:'https://example.invalid/duct',usableAreaMm2:200,maxFillPct:50};
  p.wires=[
    {id:'assigned',role:'L1',accessoryId:'d1',engineering:{status:'verified',sourceUrl:'https://example.invalid/cable-a',outerDiameterMm:4}},
    {id:'near-but-not-assigned',role:'L1',engineering:{status:'verified',sourceUrl:'https://example.invalid/cable-b',outerDiameterMm:20}}
  ];
  const [d]=Engineering.ductAudit(p);
  assert.equal(d.assignedWireCount,1);
  assert.ok(d.fill.fillPct<10);
});


test('WP-015 manufacturer clearance audit enforces verified airflow and enclosure spacing without inventing unresolved context',()=>{
  const p=basePanel();
  p.items=[
    {id:'smps',x:100,y:40,w:35,h:130,mount:'rail',dimensionStatus:'verified',panelGeometryStatus:'ready',physicalDimensionStatus:'verified',dimensionSource:'https://example.invalid/protop',physicalProductKey:'weidmuller-2466870000',requiredClearanceMm:{freeAirFlow:{up:50,down:50},neighbouringSubassemblies:{side:10}}},
    {id:'near',x:140,y:40,w:40,h:40,mount:'rail',dimensionStatus:'verified',panelGeometryStatus:'ready'}
  ];
  const [row]=Engineering.manufacturerClearanceAudit(p);
  assert.equal(row.itemId,'smps');
  assert.equal(row.authority,'verified-product-and-panel-geometry');
  assert.equal(row.status,'violation');
  assert.ok(row.checks.some(x=>x.context==='freeAirFlow'&&x.direction==='up'&&x.requiredMm===50&&x.availableMm===40&&x.status==='violation'));
  assert.ok(row.checks.some(x=>x.context==='neighbouringSubassemblies'&&x.direction==='side'&&x.requiredMm===10&&x.availableMm===5&&x.status==='violation'));
  assert.deepEqual(row.unresolved,[]);
});

test('WP-015 manufacturer clearance audit refuses neighbour-based verdict when the nearest neighbour geometry is approximate',()=>{
  const p=basePanel();
  p.items=[
    {id:'smps',x:100,y:40,w:35,h:130,mount:'rail',dimensionStatus:'verified',panelGeometryStatus:'ready',physicalDimensionStatus:'verified',dimensionSource:'https://example.invalid/protop',physicalProductKey:'weidmuller-2466870000',requiredClearanceMm:{neighbouringSubassemblies:{side:10}}},
    {id:'near',x:140,y:40,w:40,h:40,mount:'rail',dimensionStatus:'approximate',panelGeometryStatus:'staged'}
  ];
  const [row]=Engineering.manufacturerClearanceAudit(p);
  assert.equal(row.status,'unknown');
  assert.equal(row.authority,'insufficient-verified-data');
  assert.equal(row.checks.length,0);
  assert.ok(row.unresolved.includes('neighbouringSubassemblies:side'));
  assert.ok(row.missing.some(x=>x.startsWith('verified-neighbour-geometry:near')));
});

test('WP-015 manufacturer clearance audit refuses verified verdicts on staged approximate panel geometry',()=>{
  const p=basePanel();
  p.items=[
    {id:'staged',x:100,y:40,w:60,h:125,mount:'rail',dimensionStatus:'approximate',panelGeometryStatus:'staged',physicalDimensionStatus:'verified',dimensionSource:'https://example.invalid/protop',physicalProductKey:'weidmuller-2466870000',requiredClearanceMm:{freeAirFlow:{up:50,down:50}}}
  ];
  const [row]=Engineering.manufacturerClearanceAudit(p);
  assert.equal(row.status,'unknown');
  assert.equal(row.authority,'insufficient-verified-data');
  assert.deepEqual(row.checks,[]);
  assert.ok(row.missing.includes('verified-panel-geometry'));
});

test('WP-015 manufacturer clearance audit keeps voltage/live-part dependent rules unresolved',()=>{
  const p=basePanel();
  p.items=[
    {id:'m',x:100,y:100,w:45,h:97,mount:'rail',dimensionStatus:'verified',panelGeometryStatus:'ready',physicalDimensionStatus:'verified',dimensionSource:'https://example.invalid/3rv',physicalProductKey:'siemens-3rv2011-1ja10',requiredClearanceMm:{sideBySide:{side:0}},requiredClearanceByVoltageMm:{'690':{liveParts:{side:30}}}}
  ];
  const [row]=Engineering.manufacturerClearanceAudit(p);
  assert.equal(row.status,'unknown');
  assert.equal(row.authority,'verified-product-metadata-context-required');
  assert.deepEqual(row.unresolved,['sideBySide','requiredClearanceByVoltageMm']);
  assert.equal(row.checks.length,0);
});

test('WP-015 manufacturer clearance audit checks V20 cabinet edge separately from adjacent converters',()=>{
  const p=basePanel();
  p.items=[
    {id:'v20',x:10,y:100,w:90,h:160,mount:'plate',dimensionStatus:'verified',panelGeometryStatus:'ready',physicalDimensionStatus:'verified',dimensionSource:'https://example.invalid/v20',physicalProductKey:'siemens-6sl3210-5bb21-5uv1',requiredClearanceMm:{freeAirFlow:{up:100,down:100},adjacentConverters:{side:0},cabinetEnclosure:{side:15}}}
  ];
  const [row]=Engineering.manufacturerClearanceAudit(p);
  assert.equal(row.status,'violation');
  assert.ok(row.checks.some(x=>x.context==='cabinetEnclosure'&&x.availableMm===10&&x.requiredMm===15&&x.status==='violation'));
  assert.ok(row.checks.some(x=>x.context==='freeAirFlow'&&x.direction==='up'&&x.availableMm===100&&x.status==='ok'));
});

test('WP-015 service clearance evaluates only verified manufacturer/source-backed requirement',()=>{
  const p=basePanel();
  p.items=[
    {id:'a',x:20,y:20,w:40,h:40,mount:'plate',engineering:{status:'verified',sourceUrl:'https://example.invalid/device-a',serviceClearanceMm:30}},
    {id:'b',x:70,y:20,w:40,h:40,mount:'plate'}
  ];
  const rows=Engineering.serviceAudit(p),a=rows.find(x=>x.itemId==='a'),b=rows.find(x=>x.itemId==='b');
  assert.equal(a.status,'violation');
  assert.equal(a.minimumAvailableMm,10);
  assert.equal(a.requiredClearanceMm,30);
  assert.equal(b.status,'unknown');
});

test('WP-015 thermal inventory never claims enclosure compliance from device heat-loss alone',()=>{
  const p=basePanel();
  p.items=[
    {id:'a',engineering:{status:'verified',sourceUrl:'https://example.invalid/a',heatLossW:12.5}},
    {id:'b',engineering:{status:'verified',sourceUrl:'https://example.invalid/b',heatLossW:7.5}},
    {id:'c'}
  ];
  const t=Engineering.thermalSummary(p);
  assert.equal(t.knownHeatLossW,20);
  assert.equal(t.knownItemCount,2);
  assert.equal(t.unknownItemCount,1);
  assert.equal(t.enclosureThermalCompliance,'unknown');
  assert.match(t.note,/not enclosure thermal compliance/);
});


test('WP-015 expandable report exposes BOM, duct, bend, service and thermal sections',()=>{
  const fs=require('node:fs');
  const html=fs.readFileSync(require.resolve('../dist/index.html'),'utf8');
  const editor=fs.readFileSync(require.resolve('../dist/panel-editor.js'),'utf8');
  assert.match(html,/id="panelEngineeringDetails"/);
  assert.match(html,/id="panelEngineeringReport"/);
  assert.match(editor,/BOM/);
  assert.match(editor,/Kablo kanalları/);
  assert.match(editor,/Bükülme:/);
  assert.match(editor,/Servis boşluğu:/);
  assert.match(editor,/Üretici montaj boşluğu:/);
  assert.match(editor,/manufacturerClearanceAudit/);
  assert.match(editor,/Termal envanter:/);
  assert.match(editor,/enclosure uygunluğu unknown/);
});
