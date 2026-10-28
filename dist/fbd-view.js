(function(root){
 'use strict';
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function render(rung,opts={}){
  const paths=Array.isArray(rung?.paths)?rung.paths:[];
  const live=opts.live===true&&Array.isArray(opts.pathStates)&&opts.pathStates.length===paths.length;
  const states=paths.map((_,i)=>live&&opts.pathStates[i]===true);
  const id=Number.isInteger(opts.index)?opts.index:0;
  const lines=paths.map((path,pi)=>{
   const contacts=path.map((c,ci)=>'<span role="button" tabindex="0" class="dts-fbd-contact" data-ladder-contact="'+id+':'+pi+':'+ci+'" aria-label="'+escape(c.ref+' kontağını düzenle')+'">'+escape(c.type==='NC'?'NOT '+c.ref:c.ref)+'</span>').join(' <span class="dts-fbd-link">━</span> ');
   return '<div class="dts-fbd-line'+(states[pi]?' dts-fbd-on':'')+'"><small>Yol '+(pi+1)+'</small>'+contacts+' <span class="dts-fbd-gate">'+(path.length>1?'AND':'PASS')+'</span></div>';
  }).join('');
  const coil=rung?.coil||{},out=live&&opts.coilValue===true;
  return '<section class="dts-fbd-view" role="group" aria-label="'+escape('FBD Network '+(id+1))+'"><header>FBD Network '+(id+1)+' · '+escape(rung?.comment||rung?.id||'')+'</header>'+lines+
   '<div class="dts-fbd-output"><span class="dts-fbd-gate">'+(paths.length>1?'OR':'DOĞRUDAN')+'</span><span class="dts-fbd-link">━</span><span class="dts-fbd-coil'+(out?' dts-fbd-on':'')+'" role="button" tabindex="0" data-ladder-coil="'+id+'" aria-label="'+escape((coil.ref||'?')+' bloğunu düzenle')+'">'+escape(coil.type||'OUT')+' · '+escape(coil.ref||'?')+'</span></div></section>';
 }
 const api=Object.freeze({render});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSFBDView=api;
})(typeof window==='undefined'?globalThis:window);
