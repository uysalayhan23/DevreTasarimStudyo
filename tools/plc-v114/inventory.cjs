const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),scope={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'dist/library.js'),'utf8'),scope);
const assets=require(path.join(root,'dist/plc-assets.js'));
const rows=scope.window.COMPONENT_LIBRARY.filter(d=>d.isPLC&&['Siemens','Delta','Omron','GMTCNT'].includes(d.brand)&&!d.superseded).map(d=>({id:d.id,brand:d.brand,series:d.series,name:d.name,documented:!!d.documented,pinCount:d.pins.length,terminalSource:d.terminalSource||null,photo:assets['product-'+d.id.replace('-documented','')]||null,status:'pending-model-specific-verification'}));
fs.writeFileSync(path.join(__dirname,'inventory.json'),JSON.stringify(rows,null,2));console.log(JSON.stringify({models:rows.length,documented:rows.filter(d=>d.documented).length,brands:Object.fromEntries([...new Set(rows.map(d=>d.brand))].map(b=>[b,rows.filter(d=>d.brand===b).length]))}));
