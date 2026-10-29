'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const Projects=require('../dist/project-store.js');
const source=fs.readFileSync(path.join(__dirname,'../dist/app.js'),'utf8');
const start=source.indexOf('  // P0-04 / P7-04: untrusted browser draft');
const end=source.indexOf('  populateWireMenu();',start);
assert.ok(start>=0&&end>start,'real startup draft recovery code is present');
const startup=source.slice(start,end);
assert.match(startup,/window\.DTSProjects\.parse\(cached\)/);
const boot=new Function('localStorage','window','byId','migrateProject','project',startup+'\nreturn project;');
const fresh=()=>({projectId:'fresh',name:'Yeni Proje',version:7,workspaceMode:'control',components:[],wires:[]});
const saved=()=>({...fresh(),projectId:'saved',name:'Kaydedilen Proje'});
function recover(raw,{blocked=false,byId={'lamp-green':{}}}={}){
  return boot({getItem(){if(blocked)throw Error('storage blocked');return raw}},
    {DTSProjects:Projects},byId,p=>({...p,restored:true}),fresh());
}
const checks=[
 ['valid draft is restored',JSON.stringify(saved()),'Kaydedilen Proje'],
 ['legacy valid draft is migrated',JSON.stringify({name:'Eski Proje',components:[],wires:[]}), 'Eski Proje'],
 ['missing draft starts clean',null,'Yeni Proje'],
 ['malformed JSON starts clean','{','Yeni Proje'],
 ['valid JSON with invalid project shape starts clean','{}','Yeni Proje'],
 ['unknown component does not enter renderer',JSON.stringify({...saved(),components:[{id:'a',typeId:'unknown-part',x:0,y:0}]}),'Yeni Proje'],
 ['unknown panel material does not enter renderer',JSON.stringify({...saved(),workspaceMode:'panel',panel:{items:[{id:'a',typeId:'unknown-part'}],wires:[],rails:[]}}),'Yeni Proje'],
 ['unsupported future project version starts clean',JSON.stringify({...saved(),version:999}),'Yeni Proje']
];
for(const [name,raw,expected] of checks)test(name,()=>{const p=recover(raw);assert.equal(p.name,expected);assert.equal(p.restored,true)});
test('blocked browser storage cannot prevent fresh startup',()=>assert.equal(recover(null,{blocked:true}).name,'Yeni Proje'));
