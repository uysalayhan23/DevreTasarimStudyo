(function(root){
 'use strict';
 // Read-only structural diagnostics. Valid terminal IDs do NOT prove correct electrical behavior.
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function scan(project,byId){
  const components=new Map((project?.components||[]).filter(Boolean).map(c=>[String(c.id),c]));
  const junctions=new Set((project?.junctions||[]).map(j=>String(j.id)));
  const issues=[],wires=Array.isArray(project?.wires)?project.wires:[];
  function report(wire,kind,message){issues.push({wire:String(wire?.id||'Kablo'),kind,message})}
  function endpoint(wire,ref,side){
   if(!ref||typeof ref!=='object'){report(wire,'missing-endpoint',side+' bağlantı ucu tanımlı değil.');return false}
   if(ref.j!=null){
    if(!junctions.has(String(ref.j))){report(wire,'unknown-junction',side+' bağlantı düğümü bulunamadı: '+String(ref.j));return false}
    return true;
   }
   if(ref.c==null||ref.p==null){report(wire,'missing-pin',side+' bileşen veya terminal kimliği eksik.');return false}
   const c=components.get(String(ref.c));
   if(!c){report(wire,'missing-component',side+' bağlı bileşen bulunamadı: '+String(ref.c));return false}
   const def=byId?.[c.typeId];
   if(!def){report(wire,'unknown-catalog',side+' bileşenin katalog modeli bulunamadı: '+String(c.typeId));return false}
   if(!Array.isArray(def.pins)||!def.pins.some(p=>String(p.id)===String(ref.p))){
    report(wire,'unknown-pin',side+' terminal katalogda yok: '+String(ref.p));return false}
   return true;
  }
  for(const wire of wires){
   if(!wire||typeof wire!=='object'){report(wire,'invalid-wire','Kablo kaydı geçersiz.');continue}
   const a=endpoint(wire,wire.from,'Başlangıç'),b=endpoint(wire,wire.to,'Bitiş');
   if(a&&b&&JSON.stringify(wire.from)===JSON.stringify(wire.to))report(wire,'same-endpoint','Kablo aynı uca dönüyor; bağlantıyı kontrol edin.');
  }
  return {total:issues.length,checked:wires.length,issues:issues.slice(0,16),truncated:issues.length>16};
 }
 function markup(report){
  if(!report)return '';
  if(!report.total)return '<p class="dts-wire-audit-ok">Kayıtlı '+report.checked+' kablonun bileşen ve terminal kimlikleri tanınıyor. Bu, elektriksel doğruluk veya güvenlik kabulü değildir.</p>';
  const detail=report.issues.map(x=>'<li><strong>'+esc(x.wire)+'</strong>: '+esc(x.message)+'</li>').join('');
  return '<p><strong>'+report.total+' referans sorunu</strong> bulundu. Kablolar değiştirilmedi.</p><ul>'+detail+'</ul>'+
   (report.truncated?'<small>İlk 16 sorun gösterildi; yeniden kontrol edin.</small>':'');
 }
 const api=Object.freeze({scan,markup});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSWireDiagnostics=api;
})(typeof window==='undefined'?globalThis:window);
