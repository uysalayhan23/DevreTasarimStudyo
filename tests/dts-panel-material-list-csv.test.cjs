'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const BOM=require('../dist/material-list.js');
const sample=()=>JSON.parse(fs.readFileSync(path.join(__dirname,'../Kaydedilen_Projeler/03_Egitim_Panosu.odsdevre'),'utf8'));
test('P7-03 real training panel exports all 15 placed parts even with no schematic components',()=>{
 const p=sample(),rows=BOM.rows(p,{});
 assert.equal(p.workspaceMode,'panel');assert.equal(p.components.length,0);
 assert.equal(rows.reduce((n,r)=>n+r.quantity,0),p.panel.items.length);
 assert.equal(rows.reduce((n,r)=>n+r.quantity,0),15);
 assert.ok(rows.some(r=>r.references.includes('K1')));
});
test('P7-03 panel export has actual CSV rows and UTF-8 BOM',()=>{
 const csv=BOM.csv(sample(),{});
 assert.equal(csv.charCodeAt(0),0xFEFF);
 assert.ok(csv.split('\r\n').length>3);
 assert.match(csv,/K1/);assert.match(csv,/Q1/);
});
test('P7-03 active workspace prevents double counting schematic and panel representations',()=>{
 const p={workspaceMode:'panel',components:[{typeId:'x',ref:'X1'}],
  panel:{items:[{typeId:'x',ref:'X1'},{typeId:'y',ref:'Y1'}]}};
 const rows=BOM.rows(p,{});
 assert.equal(rows.reduce((n,r)=>n+r.quantity,0),2);
 assert.deepEqual(rows.map(r=>r.typeId),['x','y']);
});
test('P7-03 control mode retains electrical schematic inventory instead of panel inventory',()=>{
 const p={workspaceMode:'control',components:[{typeId:'x',ref:'X1'}],
  panel:{items:[{typeId:'x',ref:'X1'},{typeId:'y',ref:'Y1'}]}};
 assert.deepEqual(BOM.rows(p,{}).map(r=>r.typeId),['x']);
});
test('P7-03 legacy panel without mode recovers placed parts when circuit is empty',()=>{
 const p={components:[],panel:{items:[{typeId:'y',ref:'Y1'}]}};
 assert.equal(BOM.rows(p,{})[0].references[0],'Y1');
});
test('P7-03 app CSV button uses BOM inventory rather than component array length',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
 const handler=source.slice(source.indexOf('function exportMaterialList(){'),source.indexOf('function exportMaterialList(){')+1300);
 assert.match(handler,/bom\.rows\(project,byId\)\.length/);
 assert.doesNotMatch(handler,/if\(!project\.components\.length\)/);
});
test('P7-03 spreadsheet formula escaping is retained for panel catalog fields',()=>{
 const project={workspaceMode:'panel',panel:{items:[{typeId:'test',ref:'=SUM(1,1)'}]}};
 const out=BOM.csv(project,{test:{name:'=1+1',brand:'@cmd',model:'Generic'}});
 assert.match(out,/"'=1\+1"/);assert.match(out,/"'@cmd"/);assert.match(out,/"'=SUM/);
});
