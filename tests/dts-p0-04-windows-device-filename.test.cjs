'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const Store=require('../dist/project-store.js');

test('P0-04 Windows device filenames are never emitted as project files',()=>{
 for(const n of ['CON','con','NUL','PRN','AUX','COM1','COM9','LPT1','LPT9','CON.txt','NUL .bak','COM¹','LPT³','CONIN$','CONOUT$'])
  assert.equal(Store.filename(n),'_'+n+'.odsdevre',n);
});
test('P0-04 ordinary names and existing sanitization stay unchanged',()=>{
 for(const [name,expected] of [['Pano A','Pano A.odsdevre'],['COM10','COM10.odsdevre'],['LPT0','LPT0.odsdevre'],['connection','connection.odsdevre'],['AUXiliary','AUXiliary.odsdevre'],['Proje-01','Proje-01.odsdevre'],['tes: t?/','tes_ t__.odsdevre'],['','Yeni Proje.odsdevre']])
  assert.equal(Store.filename(name),expected,name);
});
test('P0-04 reserved-name protection applies without changing stored identity',()=>{
 const project={projectId:'CON',name:'CON',components:[],wires:[]};
 assert.equal(Store.validate(project),project);
 assert.equal(Store.filename(project.name),'_CON.odsdevre');
 assert.equal(project.projectId,'CON');
});
