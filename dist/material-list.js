(function(root){
 'use strict';
 function rows(project,byId){
  const groups=new Map();
  for(const component of Array.isArray(project?.components)?project.components:[]){
   if(!component||typeof component.typeId!=='string')continue;
   const d=byId?.[component.typeId],key=component.typeId;
   let item=groups.get(key);
   if(!item){
    item={typeId:key,name:String(d?.name||'Tanımlanamayan katalog elemanı'),
      brand:String(d?.brand||''),model:String(d?.part||d?.model||''),quantity:0,references:[]};
    groups.set(key,item);
   }
   item.quantity++;
   const ref=component.ref||component.label||'';
   if(ref)item.references.push(String(ref).slice(0,64));
  }
  return [...groups.values()].sort((a,b)=>a.name.localeCompare(b.name,'tr')||a.typeId.localeCompare(b.typeId,'tr'));
 }
 function cell(value){
  const str=String(value??'').replace(/[\r\n]+/g,' ');
  const safe=/^\s*[=+\-@\t]/.test(str)?"'"+str:str;
  return '"'+safe.replace(/"/g,'""')+'"';
 }
 function csv(project,byId){
  const heading=['Katalog kimliği','Malzeme','Marka','Model','Adet','Referanslar'];
  const lines=[heading,...rows(project,byId).map(r=>[r.typeId,r.name,r.brand,r.model,r.quantity,r.references.join(' / ')])];
  return '\uFEFF'+lines.map(row=>row.map(cell).join(';')).join('\r\n')+'\r\n';
 }
 const api=Object.freeze({rows,cell,csv});
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.DTSMaterialList=api;
})(typeof window==='undefined'?globalThis:window);
