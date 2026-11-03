(function(root){
 'use strict';
 // Original product photographs remain intact on disk. SVG clips isolate only moving parts.
 const image=(file,w,h,extra='')=>`<image href="assets/products/${file}" width="${w}" height="${h}" ${extra}/>`;
 const safe=s=>String(s||'preview').replace(/[^a-z0-9_-]/gi,'');
 function markup(d,c={}){
  const id='photo113-'+safe(c.id||d.id),on=!!c.state,w=d.w,h=d.h;
  let a='';
  if(d.reedSensor){
   a=`<svg x="5" y="5" width="${w-10}" height="${h-10}" viewBox="87 0 324 327"><defs><clipPath id="${id}"><path d="M92 236L211 128L273 163L305 101L336 41L370 2H410L363 43L333 80L308 139L281 178L300 191L295 224L179 324L95 283Z"/></clipPath></defs>${image('reed-mr228b-v113.jpg',500,500,`clip-path="url(#${id})"`)}</svg>`;
  }else if(['limit-no','limit-nc','mechanical-control','mechanical-latching'].includes(d.id)){
   const lever='M595 534L591 431L600 348L625 269L629 211L630 141L650 96L686 61L734 49L817 55L850 95L860 146L850 222L820 270L766 309L745 365L741 494L718 558L672 594L631 582Z';
   const body='M377 1047L348 577L370 566L370 420L411 386L470 363L561 369L601 382L605 526L641 586L718 565L721 679L752 692L743 1068L531 1181Z';
   a=`<svg x="5" y="3" width="${w-10}" height="${h-6}" viewBox="340 40 525 1150" overflow="visible"><defs><clipPath id="${id}-body"><path d="${body}"/></clipPath><clipPath id="${id}-lever"><path d="${lever}"/></clipPath></defs>${image('limit-sem121-v113.jpg',1200,1200,`clip-path="url(#${id}-body)"`)}<g class="roller-lever" transform="rotate(${on?90:0} 660 502)">${image('limit-sem121-v113.jpg',1200,1200,`clip-path="url(#${id}-lever)"`)}<path d="${lever}" fill="transparent"/></g></svg>`;
  }else if(d.siemensPhoto){
   if(d.siemensPhoto==='3RV2011-1JA10'){
    const stateOverlay=on?'<rect x="128" y="181" width="38.4" height="17.6" rx="2.4" fill="#2f7d3b" opacity=".88"/><text x="147.2" y="193.6" font-size="8.8" font-weight="700" text-anchor="middle" fill="white">I ON</text>':'';
    a=`<svg x="0" y="0" width="${w}" height="${h}" viewBox="0 0 180 388" preserveAspectRatio="xMidYMid meet" overflow="visible"><defs><clipPath id="${id}-body"><rect x="2" y="2" width="176" height="384" rx="5"/></clipPath></defs>${image('siemens-3rv2011-user-front-v11920.webp?rev=20261008-3rv6',180,388,`clip-path="url(#${id}-body)"`)}${stateOverlay}</svg>`;
   }else if(d.siemensPhoto==='5TL1163-0'){
    const stateOverlay=on?'<rect x="47" y="479" width="86" height="40" rx="2" fill="#2f7d3b" opacity=".94"/><text x="90" y="506" font-size="19" font-weight="700" text-anchor="middle" fill="white">I ON</text>':'';
    a=`<svg x="0" y="0" width="${w}" height="${h}" viewBox="0 0 180 861" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="${id}-body"><rect x="2" y="2" width="176" height="857" rx="5"/></clipPath></defs>${image('siemens-5tl1163-0-user-front.webp?rev=20261008-5tl5',180,861,`clip-path="url(#${id}-body)"`)}${stateOverlay}</svg>`;
   }else if(d.siemensPhoto==='5SL6116-7'){
    const stateOverlay=on?'<rect x="47" y="390" width="66" height="34" rx="3" fill="#2f7d3b" opacity=".90"/><text x="80" y="413" font-size="16" font-weight="700" text-anchor="middle" fill="white">I ON</text>':'';
    a=`<svg x="0" y="0" width="${w}" height="${h}" viewBox="0 0 126 490" preserveAspectRatio="xMidYMid meet" overflow="visible"><defs><clipPath id="${id}-body"><rect x="2" y="2" width="122" height="486" rx="4"/></clipPath></defs>${image('siemens-5sl6116-7-user-front-v11920.webp?rev=20261008-5sl6116-11',126,490,`clip-path="url(#${id}-body)"`)}${stateOverlay}</svg>`;
   }else if(d.siemensPhoto==='5SL6316-7'){
    const stateOverlay=on?'<rect x="55" y="526" width="484" height="54" rx="4" fill="#2f7d3b" opacity=".30"/><text x="297" y="563" font-size="22" font-weight="700" text-anchor="middle" fill="#17361b">I ON</text>':'';
    const exactLabel='<g pointer-events="none"><rect x="18" y="178" width="150" height="118" rx="3" fill="rgba(255,255,255,.82)"/><text x="30" y="205" font-size="20" font-weight="700" fill="#009999">SIEMENS</text><text x="30" y="230" font-size="18" fill="#333">5SL6316-7</text><text x="30" y="252" font-size="17" fill="#333">MCB · C16</text><text x="30" y="274" font-size="15" fill="#555">~400V · 6kA</text></g>';
    a=`<svg x="0" y="0" width="${w}" height="${h}" viewBox="0 115 594 770" preserveAspectRatio="xMidYMid meet" overflow="visible"><defs><clipPath id="${id}-body"><rect x="10" y="120" width="574" height="760" rx="8"/></clipPath></defs>${image('siemens-mcb3-v113.png',594,1000,`clip-path="url(#${id}-body)"`)}${exactLabel}${stateOverlay}</svg>`;
   }else{
    const n=d.siemensPhoto==='5SL6316-7'?3:d.siemensPhoto==='5SL6216-7'?2:1,iw=[0,211,403,594][n],file='siemens-mcb'+n+'-v113.png';
    let windows='';for(let i=0;i<n;i++)windows+=`<rect x="${61+192*i}" y="550" width="89" height="134" fill="#303c40"/>`;
    a=`<svg x="5" y="5" width="${w-10}" height="${h-10}" viewBox="0 0 ${iw} 1000" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="${id}-body"><rect x="8" y="8" width="${iw-16}" height="984" rx="6"/></clipPath><clipPath id="${id}"><rect x="20" y="684" width="${iw-40}" height="61"/></clipPath></defs>${image(file,iw,1000,`clip-path="url(#${id}-body)"`)}${windows}<rect x="20" y="684" width="${iw-40}" height="61" fill="#d4d8d7"/><g class="breaker-lever" transform="translate(0 ${on?0:-100})">${image(file,iw,1000,`clip-path="url(#${id})"`)}</g><text x="${iw/2}" y="${on?590:700}" font-size="28" text-anchor="middle" fill="${on?'#acd8ac':'#b52121'}">${on?'0 OFF':'I ON'}</text></svg>`;
   }
  }
  return a?`<g class="material-layer material-v113" data-material="photo-${d.id}">${a}</g>`:'';
 }
 const api={markup};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSMaterials113=api;
})(typeof window==='undefined'?globalThis:window);
