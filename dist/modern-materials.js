(function(root){
 'use strict';
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function markup(d,c,sprite){
  const scope=Array.from(c.id||d.id).map(x=>x.codePointAt(0).toString(16)).join('-'),w=d.w,h=d.h,cx=w/2,cy=h/2;
  if(d.id==='sensor-linear-position'){
   const p=Math.max(0,Math.min(100,Number(c.analogPosition??50))),x=100+p*.7;
   return `<g class="material-layer linear-position" data-material="design-sensor-linear-position"><rect x="10" y="40" width="85" height="40" rx="4" fill="#cbd2d9" stroke="#526474"/><path d="M15 46H90M15 74H90" stroke="#f9fbfc" stroke-width="3"/><text transform="rotate(${-Number(c.rotation||0)} 52 64)" x="52" y="64" text-anchor="middle" font-size="9" fill="#243746">LINEER POT</text><g data-analog-handle="${esc(c.id||d.id)}" role="slider" tabindex="0" aria-label="Doğrusal konum" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><path d="M90 60H${x}" stroke="#677b8b" stroke-width="9"/><path d="M90 58H${x}" stroke="#f1f5f9" stroke-width="3"/><rect x="${x}" y="48" width="16" height="24" rx="3" fill="#81919d" stroke="#314253"/><rect x="${x-4}" y="42" width="24" height="36" fill="transparent"/></g></g>`;
  }
  if(d.selectorSteps||(d.rotaryIsolator&&d.id!=='packet-switch-3p')){
   const n=d.selectorSteps||1,pos=d.selectorSteps?Math.max(0,Math.min(n,c.position||0)):(c.state?1:0),step=n<=3?90:360/(n+1),angle=pos*step,r=Math.min(w,h)/2-24;
   let art=`<rect x="12" y="${cy-w/2+12}" width="${w-24}" height="${w-24}" rx="9" fill="#0c6d72" stroke="#124f51" stroke-width="4"/><rect x="20" y="${cy-w/2+20}" width="${w-40}" height="${w-40}" rx="4" fill="#f4efdc" stroke="#365e61"/>`;
   for(let i=0;i<=n;i++){const a=i*step*Math.PI/180;art+=`<text class="selector-number" x="${cx+Math.sin(a)*r}" y="${cy-Math.cos(a)*r+4}" text-anchor="middle" font-size="${n>8?10:13}" fill="${i===pos?'#00676c':'#17292b'}" font-weight="bold">${i}</text>`}
   const clip='rotor-'+scope,scale=Math.min(w,h)/1550;
   art+=`<defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><path d="M530 327Q625 300 720 327L710 413A280 280 0 0 1 720 927L716 1165Q626 1190 535 1165L530 927A280 280 0 0 1 530 413Z"/></clipPath></defs><g class="selector-rotor" transform="translate(${cx} ${cy}) rotate(${angle}) scale(${scale}) translate(-625 -740)"><image href="assets/products/selector-front-v110.png" width="1254" height="1254" clip-path="url(#${clip})"/></g>`;
   return `<g class="material-layer" data-material="selector-front-v110" data-position="${pos}">${art}</g>`;
  }
  if(['push-maintained','power-switch','packet-switch-3p','packet-reversing-1p','packet-reversing-3p'].includes(d.id)){
   const tint=/^#[0-9a-f]{6}$/i.test(c.deviceColor||'')?c.deviceColor:null;
   const clip='lever-'+scope,mask='lever-body-'+scope,lever='M570 365Q625 346 683 369L718 414L736 932Q734 1020 677 1028H575Q518 1005 516 942L522 421Z',scale=Math.min((w-16)/718,(h-16)/930),x=(w-718*scale)/2,y=(h-930*scale)/2;
   return `<g class="material-layer" data-material="maintained-front-v110"><svg x="${x}" y="${y}" width="${718*scale}" height="${930*scale}" viewBox="268 98 718 930"><defs><clipPath id="${clip}"><path d="${lever}"/></clipPath><mask id="${mask}" maskUnits="userSpaceOnUse" x="0" y="0" width="1254" height="1254"><rect width="1254" height="1254" fill="white"/><path d="${lever}" fill="black"/></mask></defs><ellipse cx="626" cy="650" rx="305" ry="350" fill="#15191b"/><image href="assets/products/maintained-front-v110.png" width="1254" height="1254" mask="url(#${mask})"/><g class="maintained-lever" transform="rotate(${d.positions?([0,45,-45][c.position||0]||0):c.state?45:0} 626 650)"><image href="assets/products/maintained-front-v110.png" width="1254" height="1254" clip-path="url(#${clip})"/>${tint?`<path d="${lever}" fill="${tint}" opacity=".65"/><path d="M626 382V776" stroke="#f7f7ee" stroke-width="44"/>`:""}</g></svg></g>`;
  }
  return '';
 }
 const api={markup};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSModernMaterials=api;
})(typeof window==='undefined'?globalThis:window);
