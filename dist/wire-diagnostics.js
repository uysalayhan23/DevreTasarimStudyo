(function(root){
 'use strict';
 // Read-only structural diagnostics. Valid terminal IDs do NOT prove correct electrical behavior.
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // Endpoint identity does not depend on object key insertion order or UI metadata.
 function sameEndpoint(a,b){
  if(!a||!b)return false;
  if(a.j!=null||b.j!=null)return a.j!=null&&b.j!=null&&String(a.j)===String(b.j);
  return a.c!=null&&b.c!=null&&a.p!=null&&b.p!=null&&
   String(a.c)===String(b.c)&&String(a.p)===String(b.p);
 }
 function scan(project,byId){
  const componentRows=(Array.isArray(project?.components)?project.components:[]).filter(c=>c&&typeof c==='object');
  const components=new Map(componentRows.filter(c=>c.id!=null&&String(c.id).trim()).map(c=>[String(c.id),c]));
  const junctionRows=(Array.isArray(project?.junctions)?project.junctions:[]).filter(j=>j&&j.id!=null&&String(j.id).trim());
  const junctions=new Set(junctionRows.map(j=>String(j.id)));
  const issues=[],wires=Array.isArray(project?.wires)?project.wires:[];
  const seenComponents=new Set(),seenJunctions=new Set();
  for(const c of componentRows){const id=c.id==null?'':String(c.id);if(!id.trim())issues.push({wire:'Bileşen',kind:'missing-component-id',message:'Bileşen kimliği eksik.'});else if(seenComponents.has(id))issues.push({wire:'Bileşen',kind:'duplicate-component-id',message:'Tekrarlı bileşen kimliği: '+id});else seenComponents.add(id)}
  for(const j of junctionRows){const id=String(j.id);if(seenJunctions.has(id))issues.push({wire:'Düğüm',kind:'duplicate-junction-id',message:'Tekrarlı bağlantı düğümü kimliği: '+id});else seenJunctions.add(id)}
  function report(wire,kind,message){issues.push({wire:String(wire?.id||'Kablo'),kind,message})}
  function endpoint(wire,ref,side){
   if(!ref||typeof ref!=='object'){report(wire,'missing-endpoint',side+' bağlantı ucu tanımlı değil.');return false}
   if(ref.j!=null&&(ref.c!=null||ref.p!=null)){
    report(wire,'ambiguous-endpoint',side+' bağlantı ucu hem düğüm hem bileşen terminali gösteriyor.');
    return false;
   }
   if(ref.j!=null){
    if(!junctions.has(String(ref.j))){report(wire,'unknown-junction',side+' bağlantı düğümü bulunamadı: '+String(ref.j));return false}
    return true;
   }
   if(ref.c==null||ref.p==null){report(wire,'missing-pin',side+' bileşen veya terminal kimliği eksik.');return false}
   const c=components.get(String(ref.c));
   if(!c){report(wire,'missing-component',side+' bağlı bileşen bulunamadı: '+String(ref.c));return false}
   const def=byId?.[c.typeId];
   if(!def){report(wire,'unknown-catalog',side+' bileşenin katalog modeli bulunamadı: '+String(c.typeId));return false}
   if(!Array.isArray(def.pins)||!def.pins.some(p=>p&&p.id!=null&&String(p.id)===String(ref.p))){
    report(wire,'unknown-pin',side+' terminal katalogda yok: '+String(ref.p));return false}
   return true;
  }
  const seenWireIds=new Set();
  for(const wire of wires){
   if(!wire||typeof wire!=='object'){report(wire,'invalid-wire','Kablo kaydı geçersiz.');continue}
   const wireId=wire.id==null?'':String(wire.id);
   if(!wireId.trim())report(wire,'missing-wire-id','Kablo kimliği eksik; benzersiz kablo kimliği gereklidir.');
   else if(seenWireIds.has(wireId))report(wire,'duplicate-wire-id','Aynı kablo kimliği birden fazla kez kullanılmış: '+wireId);
   else seenWireIds.add(wireId);
   const a=endpoint(wire,wire.from,'Başlangıç'),b=endpoint(wire,wire.to,'Bitiş');
   if(a&&b&&sameEndpoint(wire.from,wire.to))report(wire,'same-endpoint','Kablo aynı uca dönüyor; bağlantıyı kontrol edin.');
  }
  return {total:issues.length,checked:wires.length,issues:issues.slice(0,16),truncated:issues.length>16};
 }
 function markup(report){
  if(!report)return '';
  if(!report.total)return '<p class="dts-wire-audit-ok">Kayıtlı '+report.checked+' kablonun bileşen ve terminal kimlikleri tanınıyor. Bu, elektriksel doğruluk veya güvenlik kabulü değildir.</p>';
  const detail=report.issues.map(x=>'<li><button type="button" data-audit-wire="'+esc(x.wire)+'" title="Şemada kabloyu işaretle">'+esc(x.wire)+'</button>: '+esc(x.message)+'</li>').join('');
  return '<p><strong>'+report.total+' referans sorunu</strong> bulundu. Kablolar değiştirilmedi.</p><ul>'+detail+'</ul>'+
   (report.truncated?'<small>İlk 16 sorun gösterildi; yeniden kontrol edin.</small>':'');
 }
 // Visually mark only current DOM wire groups; leave wire color, endpoints and native solver untouched.
 function mark(scene,report,onlyWire=null){
  if(!scene||typeof scene.querySelectorAll!=='function')return 0;
  const ids=new Set((report?.issues||[]).map(i=>String(i.wire)));
  let marked=0;
  for(const group of scene.querySelectorAll('[data-wire]')){
   const visible=ids.has(String(group.dataset?.wire))&&
    (onlyWire===null||String(group.dataset.wire)===String(onlyWire));
   group.classList.toggle('dts-wire-audit-highlight',visible);
   if(visible)marked++;
  }
  return marked;
 }
 const api=Object.freeze({scan,markup,mark,sameEndpoint});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSWireDiagnostics=api;
})(typeof window==='undefined'?globalThis:window);
