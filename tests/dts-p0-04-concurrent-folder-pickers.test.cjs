'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Projects=require('../dist/project-store.js');
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return {promise,resolve,reject}};
const folder=(name)=>({name});
function fixture(){
 const picks=[],data=new Map();
 const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const store=Projects.create({storage,indexedDB:null,env:{showDirectoryPicker:()=>{const d=deferred();picks.push(d);return d.promise}}});
 return {store,picks,data};
}
test('P0-04 negative: older picker finishing last must not replace newer folder',async()=>{
 const x=fixture(),old=x.store.chooseFolder(),newer=x.store.chooseFolder();
 x.picks[1].resolve(folder('NEW'));assert.deepEqual(await newer,{name:'NEW'});
 x.picks[0].resolve(folder('OLD'));assert.deepEqual(await old,{cancelled:true});
 assert.equal(x.store.folderName,'NEW');
});
test('P0-04 negative: pending picker must not override later readonly folder-file selection',async()=>{
 const x=fixture(),old=x.store.chooseFolder();
 const count=x.store.useFolderFiles([{name:'Valid.odsdevre',webkitRelativePath:'Readonly/Valid.odsdevre'}]);
 assert.equal(count,1);
 x.picks[0].resolve(folder('OLD'));assert.deepEqual(await old,{cancelled:true});
 assert.equal(x.store.folderName,'Readonly');
});
test('P0-04 negative: cancelled newer picker must not let older picker unexpectedly win',async()=>{
 const x=fixture(),old=x.store.chooseFolder(),newer=x.store.chooseFolder();
 const err=Error('cancelled');err.name='AbortError';x.picks[1].reject(err);
 assert.deepEqual(await newer,{cancelled:true});
 x.picks[0].resolve(folder('OLD'));assert.deepEqual(await old,{cancelled:true});
 assert.equal(x.store.folderName,'');
});
test('P0-04 positive: ordinary first folder picker remains functional',async()=>{
 const x=fixture(),pending=x.store.chooseFolder();x.picks[0].resolve(folder('SAVED'));
 assert.deepEqual(await pending,{name:'SAVED'});assert.equal(x.store.folderName,'SAVED');
});
test('P0-04 positive: normal later folder switch wins and remains selected',async()=>{
 const x=fixture(),first=x.store.chooseFolder();x.picks[0].resolve(folder('A'));await first;
 const second=x.store.chooseFolder();x.picks[1].resolve(folder('B'));assert.deepEqual(await second,{name:'B'});
 assert.equal(x.store.folderName,'B');
});
