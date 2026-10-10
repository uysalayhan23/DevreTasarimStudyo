(function(root){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function markup(d,c={}){
  const uid='acs-'+String(c.id||'preview').replace(/[^a-zA-Z0-9_-]/g,'');
  // Source photo is unchanged. Native vector geometry replaces the R6 power
  // strip with the R5 arrangement from HW p.71; connectors remain on the body.
  let s='<defs><clipPath id="'+uid+'"><path d="M310 131L322 90L349 90L365 120L668 115V78H711V113L1017 116L1036 88H1058L1066 119L1075 132L1083 972L1077 1465L291 1465L287 973Z"/></clipPath></defs><g transform="translate(12 20) scale(.76) translate(-280 -70)"><image href="assets/products/abb-acs800-reference.png" x="0" y="0" width="1367" height="1823" clip-path="url(#'+uid+')"/></g>';
  s+='<rect x="20" y="1080" width="600" height="80" fill="#b7bcb1"/><rect x="20" y="1145" width="600" height="138" rx="5" fill="#29312c" stroke="#505b57" stroke-width="3"/><rect x="20" y="1269" width="600" height="31" rx="5" fill="#a8aca5"/>';
  for(const p of d.materialPins||d.pins){if(p.block)continue;const x=p.x;
   s+='<path d="M'+(x-20)+' 1160h40v113h-40Z" fill="'+(p.id.startsWith('PE')?'#b6c97e':'#b5a57e')+'" stroke="#42463c" stroke-width="2"/><rect x="'+(x-17)+'" y="1246" width="34" height="26" rx="3" fill="#282d29"/><circle cx="'+x+'" cy="1230" r="13" fill="#76766a" stroke="#d8d3bf" stroke-width="3"/><path d="M'+(x-7)+' 1223l14 14" stroke="#343c38" stroke-width="4"/>';
  }
  s+='<text x="320" y="1330" text-anchor="middle" fill="#30423c" font-size="15">ABB ACS800-04 · R5 · 0075-3</text>';
  for(const block of ['X20','X21','X22','X23','X25','X26','X27']){const pins=(d.materialPins||d.pins).filter(p=>p.block===block);if(!pins.length)continue;const x=(pins[0].x+pins.at(-1).x)/2;
   s+='<text x="'+x+'" y="1000" fill="#152825" font-size="7" text-anchor="middle">'+block+'</text>';
  }
  if(c.acs800?.diilBridge!==false){const a=(d.materialPins||d.pins).find(p=>p.id==='X22:8'),b=(d.materialPins||d.pins).find(p=>p.id==='X22:11');if(a&&b)s+='<path class="acs800-diil-bridge" pointer-events="none" d="M'+a.x+' '+a.y+'v24h'+(b.x-a.x)+'v-24" fill="none" stroke="#e16b21" stroke-width="3"/>';
  }
  return '<g class="material-layer" data-material="abb-acs800-r5">'+s+'</g>';
 }
 const api={markup};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSACS800Art=api;
})(typeof window==='undefined'?globalThis:window);
