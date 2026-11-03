'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../dist/studio.js'),'utf8');
function element(){return {hidden:false,innerHTML:'',textContent:'',dataset:{},disabled:false,style:{},classList:{add(){},remove(){},toggle(){}},querySelector(){return null},querySelectorAll(){return []},addEventListener(){},appendChild(){},setAttribute(){},contains(){return true},focus(){}}}
async function render(diskId,rows){
 const nodes=new Map();const find=k=>{if(!nodes.has(k))nodes.set(k,element());return nodes.get(k)};
 const current={projectId:'new',name:'Now',components:[],wires:[],workspaceMode:'control'};
 const store={
   scan:async()=>({entries:[{key:'disk.odsdevre',name:'disk.odsdevre',project:{projectId:diskId,name:'Disk',workspaceMode:'control'}}],warnings:[],permissionNeeded:false}),
   list:()=>rows.map(id=>({id,name:'Draft '+id,workspaceMode:'control'})),
   restoreFolder:async()=>false,
   get:async()=>null
 };
 const E={getProject:()=>current,toast(){}};
 const Projects={create:()=>store,isProtected:()=>false,clean:p=>JSON.parse(JSON.stringify(p))};
 const window={DTSEditor:E,DTSWorkspaces:{modes:[['control','Kumanda']],normalize:s=>s},DTSProjects:Projects,
   DTSSafety:{create:()=>({visible:false,show(){}}),showOnStart:()=>false},DTSDashboardOpenRequests:{create:()=>({begin:()=>1,invalidate(){},isCurrent:()=>true})},
   DTSStarterProjects:{},addEventListener(){}};
 const document={querySelector:find,querySelectorAll:()=>[],addEventListener(){},createElement:element,body:element()};
 const localStorage={getItem:()=>null,setItem(){}};
 vm.runInNewContext(source,{window,document,localStorage,console,Date,JSON,Promise,setTimeout}, {filename:'studio.js'});
 await window.DTSStudio.ready;
 return find('#projectCards').innerHTML;
}
function n(html,type){return (html.match(new RegExp('data-project-source="'+type+'"','g'))||[]).length}
test('P0-04 legacy numeric disk ID aliases draft text ID and shows one disk card',async()=>{
 const html=await render(7,['7','other']);
 assert.equal(n(html,'disk'),1); assert.equal(n(html,'draft'),1);
 assert.match(html,/Draft other/); assert.doesNotMatch(html,/Draft 7/);
});
test('P0-04 string disk ID matches the same string draft ID',async()=>{
 const html=await render('7',['7','other']);
 assert.equal(n(html,'disk'),1); assert.equal(n(html,'draft'),1);
});
test('P0-04 distinct leading-zero ID remains a different project',async()=>{
 const html=await render(7,['07']);
 assert.equal(n(html,'disk'),1);assert.equal(n(html,'draft'),1);
});
test('P0-04 numeric zero remains compatible with text zero',async()=>{
 const html=await render(0,['0','other']);
 assert.equal(n(html,'disk'),1);assert.equal(n(html,'draft'),1);
});
test('P0-04 missing disk project ID does not alias any valid draft',async()=>{
 const html=await render(null,['other','null']);
 assert.equal(n(html,'disk'),1);assert.equal(n(html,'draft'),2);
});
