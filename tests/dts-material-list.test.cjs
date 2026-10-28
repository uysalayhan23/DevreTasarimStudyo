'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const BOM=require('../dist/material-list.js');
const lib={a:{name:'Röle',brand:'Örnek',part:'R1'},b:{name:'Direnç',brand:'DTS',model:'10k'}};
test('group by real catalog identity and actual project quantity',()=>{
 const rows=BOM.rows({components:[{typeId:'a',ref:'K1'},{typeId:'b',ref:'R1'},{typeId:'a',ref:'K2'}]},lib);
 assert.equal(rows.length,2);const relay=rows.find(r=>r.typeId==='a');
 assert.equal(relay.quantity,2);assert.deepEqual(relay.references,['K1','K2']);
});
test('UTF-8 BOM, Turkish names and literal cells',()=>{
 const out=BOM.csv({components:[{typeId:'a',ref:'K1'}]},lib);
 assert.equal(out.charCodeAt(0),0xfeff);assert.match(out,/Katalog kimliği/);
 assert.match(out,/Röle/);
});
test('Excel-style formula cells are escaped',()=>{
 for(const value of ['=1+1','+cmd','-SUM(1)','@SUM(2)','  =WEBSERVICE(1)'])
  assert.ok(BOM.cell(value).startsWith(String.fromCharCode(34,39)));
 assert.equal(BOM.cell('a"b'),'"a""b"');
});
test('empty projects and missing definitions are explicit, not invented',()=>{
 assert.equal(BOM.rows({components:[]},lib).length,0);
 assert.equal(BOM.rows({components:[{typeId:'missing'}]},lib)[0].name,'Tanımlanamayan katalog elemanı');
});
