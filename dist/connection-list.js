(function(root){
 'use strict';
 // Read-only IEC-style connection schedule. Device/terminal IDs come from the
 // actual project and catalog; no physical/electrical correctness is inferred.
 const text=v=>typeof v==='string'?v.trim():'';
 function audit(project,byId,panelWiring){
  const schematic=Array.isArray(project?.components)?project.components:[];
  const panelItems=Array.isArray(project?.panel?.items)?project.panel.items:[];
  const panel=project?.workspaceMode==='panel'||(!schematic.length&&panelItems.length>0);
  const devices=panel?panelItems:schematic;
  const wires=panel?project?.panel?.wires:project?.wires;
  const errors=[],out=[],items=new Map(),seenWires=new Set(),junctions=new Set();
  if(!Array.isArray(wires))return {ok:false,rows:[],errors:['Kablo listesi geçersiz.']};
  for(const device of devices){
   const id=text(device?.id);
   if(!id||items.has(id)){errors.push('Eksik veya tekrarlı cihaz kimliği.');continue}
   items.set(id,device);
  }
  if(!panel){
   for(const j of project?.junctions||[]){
    const id=text(j?.id);
    if(!id||junctions.has(id))errors.push('Eksik veya tekrarlı düğüm kimliği.');
    else junctions.add(id);
   }
  }
  function endpoint(end){
   if(!end||typeof end!=='object'||Array.isArray(end))return null;
   const j=text(end.j),c=text(end.c),p=text(end.p);
   if(j){
    if(panel||c||p||!junctions.has(j))return null;
    return {id:'J:'+j,ref:'',pin:'DÜĞÜM',key:'j:'+j};
   }
   if(!c||!p||end.j!=null||!items.has(c))return null;
   const item=items.get(c),original=byId?.[item.typeId];
   const def=panel&&typeof panelWiring?.panelDefinition==='function'
    ?panelWiring.panelDefinition(original):original;
   const pin=Array.isArray(def?.pins)?def.pins.find(q=>q&&String(q.id)===p):null;
   if(!pin)return null;
   return {id:c,ref:text(item.ref),pin:p,key:'c:'+c+':'+p};
  }
  for(const wire of wires){
   if(wire?.probeLead)continue;
   const id=text(wire?.id);
   if(!id||seenWires.has(id)){errors.push('Eksik veya tekrarlı kablo kimliği.');continue}
   seenWires.add(id);
   const a=endpoint(wire.from),b=endpoint(wire.to);
   if(!a||!b||a.key===b.key){errors.push('Kablo '+id+' için terminal referansı geçersiz.');continue}
   out.push({id,fromId:a.id,fromRef:a.ref,fromPin:a.pin,toId:b.id,toRef:b.ref,toPin:b.pin,
    role:text(wire.role),color:text(wire.color),size:text(wire.size)});
  }
  return {ok:errors.length===0,rows:errors.length?[]:out.sort((a,b)=>a.id.localeCompare(b.id,'tr')),errors};
 }
 function csv(project,byId,panelWiring,cell){
  const result=audit(project,byId,panelWiring);
  if(!result.ok)throw Error('Bağlantı listesi oluşturulamadı: '+result.errors[0]);
  if(!result.rows.length)throw Error('Listelenecek devre kablosu bulunamadı.');
  if(typeof cell!=='function')throw Error('Güvenli CSV dönüştürücüsü bulunamadı.');
  const header=['Kablo ID','Başlangıç cihaz ID','Başlangıç IEC ref','Başlangıç terminal','Bitiş cihaz ID','Bitiş IEC ref','Bitiş terminal','Hat','Renk','Kesit'];
  const lines=[header,...result.rows.map(r=>[r.id,r.fromId,r.fromRef,r.fromPin,r.toId,r.toRef,r.toPin,r.role,r.color,r.size])];
  return '\uFEFF'+lines.map(row=>row.map(cell).join(';')).join('\r\n')+'\r\n';
 }
 function download(){
  const editor=root.DTSEditor,materials=root.DTSMaterialList,doc=root.document;
  if(!editor||!materials||!doc)return;
  try{
   const project=editor.getProject(),data=csv(project,editor.byId,root.DTSPanelWiring,materials.cell);
   const url=root.URL.createObjectURL(new root.Blob([data],{type:'text/csv;charset=utf-8'}));
   const a=doc.createElement('a');
   a.href=url;a.download=String(project.name||'devre').replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ_-]+/gi,'_')+'-baglanti-listesi.csv';
   doc.body.appendChild(a);
   try{a.click()}finally{a.remove();root.setTimeout(()=>root.URL.revokeObjectURL(url),1000)}
   editor.toast('Bağlantı listesi CSV olarak hazırlandı.');
  }catch(e){editor.toast(e?.message||'Bağlantı listesi oluşturulamadı.')}
 }
 const api=Object.freeze({audit,csv,download});
 if(typeof module==='object'&&module.exports)module.exports=api;
 else{root.DTSConnectionList=api;root.document?.getElementById('connectionListBtn')?.addEventListener('click',download)}
})(typeof window==='undefined'?globalThis:window);
