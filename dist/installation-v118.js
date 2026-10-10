(function(root){
  'use strict';
  const sources={
    plug:'https://online.far-electric.com.tr/en/index.php?route=product/product&product_id=255',
    holder:'https://www.elektrikdeposu.com/urun/tij-takimi-e27-duy-kaplamali',
    data:'https://online.gunsanelectric.com/urun/gunsan-visage-beyaz-tekli-data-prizi-rj45-cat6',
    phone:'https://www.monoelectric.com.tr/larissa-wood-numeris-telefon-prizi-rj11-cat3/',
    tv:'https://tumpaelektrik.com/tv-uydu-sat-prizi/viko-linerra-rollina-beyaz-tv-sat-sonlu-mekanizma',
    bell:'https://www.mutlusan.com.tr/tr/Urunler/934/zillerzil-butonlari-ve-zil-trafolari',
    button:'https://mutlusan.com.tr/tr/Urunler/230/anahtar-grubu',
    door:'https://www.mutlusan.com.tr/Upload/26022026_fiyatlistesi-1.pdf'
  };
  const book={file:'TEMEL ELEKTRİK-ELEKTRONİK_9 · Görsel 5.34',pages:'142',basis:'Açık şema · ayrı iletken ve bağlantı uçları; kullanıcı sayfa görseli'};
  const pin=(id,x,y,side)=>({id,label:id,x,y,side});
  function extend(lib){
    const byId=Object.fromEntries(lib.map(d=>[d.id,d]));
    for(const id of ['wall-commutator','wall-intermediate']){
      const d=byId[id];Object.assign(d,{installationSymbol:id,orientation:'front',pins:[pin('1',0,40,'left'),pin('3',0,80,'left'),pin('2',100,40,'right'),pin('4',100,80,'right')],symbolSource:{file:id==='wall-commutator'?'komütatör_anahtar.png':'araVaviyen_Permülatör.png',pages:'Kullanıcı görseli',basis:'Kullanıcı referansından vektör çizim; mevcut dört terminal kimliği korunur'}});
      if(id==='wall-commutator'){d.independentContacts=true;d.contacts.forEach(g=>g.independent=true)}
      else d.previewState=true;
    }
    const definitions=[
      ['bell-electronic','Elektronik Zil','buzzer',[pin('1',30,0,'top'),pin('2',70,0,'top')],'bell'],
      ['bell-push','Zil Butonu','switch-no',[pin('13',30,0,'top'),pin('14',70,0,'top')],'button'],
      ['bell-light-push','Light Buton · Çağırma','switch-no',[pin('13',30,0,'top'),pin('14',70,0,'top')],'button'],
      ['bell-push-group','Zil Buton Grubu · İkili','switch-multi',[pin('13',20,0,'top'),pin('14',50,0,'top'),pin('23',90,0,'top'),pin('24',120,0,'top')],'button'],
      ['door-release','Kapı Otomatiği','coil-valve',[pin('A1',30,0,'top'),pin('A2',70,0,'top')],'door']
    ];
    for(const [id,name,kind,pins,source] of definitions){if(byId[id])continue;const button=kind.startsWith('switch');lib.push({id,name,kind,pins,w:id==='bell-push-group'?140:100,h:100,orientation:'front',buildingOnly:true,catalogGroup:'bell-circuits',designMaterial:true,installationSymbol:id,symbolSource:book,model:'Açık şema · eğitim modeli',refPrefix:button?'B':id==='door-release'?'KO':'Z',interactive:button,controlMode:button?'momentary':undefined,independentContacts:id==='bell-push-group',contacts:id==='bell-push-group'?[{id:'a',a:'13',b:'14',normal:'NO',independent:true},{id:'b',a:'23',b:'24',normal:'NO',independent:true}]:undefined,visualInfo:{match:'representative',model:name+' · ürün biçiminden uyarlanmış 3D çizim',source:sources[source]}})}
    // Keep the old grounded variant so projects wired to PE remain valid.
    const plug=byId['plug-1p'];if(plug&&!byId['plug-1p-earthed'])lib.push({...plug,id:'plug-1p-earthed',name:'Bir Fazlı Fiş · Topraklı',pins:plug.pins.map(p=>({...p}))});
    if(plug)Object.assign(plug,{name:'Bir Fazlı Fiş · Yassı, Topraksız',model:'FAR 23200043 · 2 kutup',pins:[pin('L',20,0,'top'),pin('N',60,0,'top')],designMaterial:true,materialSymbol:false});
    for(const [id,source,model] of [['plug-1p','plug','FAR 23200043 · yassı topraksız fiş'],['lampholder-e27','holder','E27 · muhafazalı tij ve duy'],['socket-data','data','Günsan Visage · RJ45 Cat6'],['phone-socket','phone','Mono Larissa · RJ11 Cat3'],['tv-socket','tv','VİKO Linerra / Rollina · TV–SAT']]){
      const d=byId[id];if(d)Object.assign(d,{designMaterial:true,materialSymbol:false,visualInfo:{match:'representative',model:model+' · kütüphaneye uyarlanmış 3D çizim',source:sources[source]}});
    }
    return lib;
  }
  function drawing(d,c={}){
    const id=d.installationSymbol;if(!id)return null;
    const paths=[],texts=[],w=d.w,h=d.h,cx=w/2;
    const path=(s,extra='')=>paths.push('<path class="symbol" d="'+s+'" '+extra+'/>');
    const circle=(x,y,r=4)=>paths.push('<circle class="symbol" cx="'+x+'" cy="'+y+'" r="'+r+'" style="fill:white"/>');
    const wire=(p,x,y)=>path('M'+p.x+' '+p.y+'V'+y+'H'+x);
    const label=(key,value,x,y)=>texts.push({key,value,x,y,cls:'subtitle'});
    if(id==='wall-commutator'){
      for(const [i,key] of ['a','b'].entries()){const y=40+i*40,closed=c._contactStates?.[key]??!!(c.switchStates?.[key]??c.state);path('M0 '+y+'H20M80 '+y+'H100M20 '+y+'L76 '+(closed?y:y-18));circle(20,y);circle(80,y)}
      path('M48 39V63','stroke-dasharray="7 6"');
    }else if(id==='wall-intermediate'){
      circle(50,60,38);path('M0 40H32M0 80H32M68 40H100M68 80H100');
      const cross=c._contactStates?.c??!!c.state;path(cross?'M32 40L68 80M32 80L68 40':'M32 40H68M32 80H68');
      for(const x of [32,68])for(const y of [40,80])circle(x,y,4.5);
    }else if(id==='bell-electronic'){
      wire(d.pins[0],30,44);wire(d.pins[1],70,44);path('M20 44H80A30 28 0 0 1 20 44Z');
    }else if(id==='door-release'){
      wire(d.pins[0],30,40);wire(d.pins[1],70,40);path('M15 40H77V73H15ZM77 40L93 73H77');label('door-function','K.O.',46,62);
    }else{
      const group=id==='bell-push-group',light=id==='bell-light-push';
      const button=(x,a,b,key)=>{const on=c._contactStates?.[key]??(group?!!c.switchStates?.[key]:!!c.state);wire(a,x-14,42);wire(b,x+14,42);if(group)path('M'+(x-26)+' 27h52v55h-52Z');if(light)circle(x,53,31);circle(x-14,42);circle(x+14,42);path('M'+(x-20)+' '+(on?46:53)+'h40m-32 0v12m24-12v12m-29 0h34','style="stroke-width:4;stroke-linecap:butt"');};
      if(group){button(35,d.pins[0],d.pins[1],'a');button(105,d.pins[2],d.pins[3],'b');label('button-a','B1',35,94);label('button-b','B2',105,94)}else button(cx,d.pins[0],d.pins[1],'main');
    }
    if(d.independentContacts)for(const [i,key] of ['a','b'].entries()){const x=id==='wall-commutator'?12:8+i*70,y=id==='wall-commutator'?18+i*40:28;paths.push('<rect data-installation-contact="'+key+'" role="button" tabindex="0" aria-label="'+(i+1)+'. kontak" x="'+x+'" y="'+y+'" width="'+(id==='wall-commutator'?76:54)+'" height="40" fill="transparent"/>')}
    return {body:'<g data-installation-symbol="'+id+'" data-diagram="open">'+paths.join('')+'</g>',texts};
  }
  function material(d,c={}){
    const ids=['socket-data','phone-socket','tv-socket','plug-1p','lampholder-e27','bell-electronic','bell-push','bell-light-push','bell-push-group','door-release'];
    if(!ids.includes(d.id))return null;
    const id=d.id,w=d.w,h=d.h,cx=w/2,cy=h/2,g='ins-'+Array.from(c.id||id).map(s=>s.codePointAt(0).toString(16)).join('-');
    const lightColor=/^#[0-9a-f]{6}$/i.test(c.deviceColor||'')?c.deviceColor:(d.color||'#ffdc60');
    const white='url(#'+g+'-white)',metal='url(#'+g+'-metal)',dark='url(#'+g+'-dark)';
    const text=(v,x,y,size=5)=>'<text x="'+x+'" y="'+y+'" fill="#5b656b" font-size="'+size+'" font-family="Arial" text-anchor="middle">'+v+'</text>';
    const screw=(x,y)=>'<circle cx="'+x+'" cy="'+y+'" r="3" fill="'+metal+'" stroke="#758189" stroke-width=".5"/><path d="M'+(x-1.7)+' '+y+'h3.4" stroke="#5a656e" stroke-width=".7"/>';
    const frame=(x,y,bw,bh)=>'<rect x="'+(x+2)+'" y="'+(y+3)+'" width="'+bw+'" height="'+bh+'" rx="7" fill="#87949d"/><rect x="'+x+'" y="'+y+'" width="'+bw+'" height="'+bh+'" rx="7" fill="'+white+'" stroke="#c3cbd0"/><rect x="'+(x+8)+'" y="'+(y+8)+'" width="'+(bw-16)+'" height="'+(bh-16)+'" rx="4" fill="#f5f6f7" stroke="#d4d9dc"/>';
    const bellIcon=(x,y)=>'<path d="M'+(x-6)+' '+(y+4)+'q3-2 3-7q3-6 6 0q0 5 3 7zm4 3h4" fill="none" stroke="#727a80" stroke-width="1.2"/>';
    let a='';
    if(['socket-data','phone-socket','tv-socket'].includes(id)){
      a=frame(12,18,w-24,h-36);const y=cy+3;
      if(id==='tv-socket'){
        for(const [x,caption] of [[cx-14,'TV'],[cx+14,'SAT']]){a+='<circle cx="'+x+'" cy="'+y+'" r="8.5" fill="'+metal+'" stroke="#90979c"/><circle cx="'+x+'" cy="'+y+'" r="5.5" fill="#373c3e"/><circle cx="'+x+'" cy="'+y+'" r="'+(caption==='TV'?1.8:.8)+'" fill="'+(caption==='TV'?'#cdd2d5':'#111820')+'"/>'+text(caption,x,y-13,4.5);if(caption==='SAT')a+='<path d="M'+(x-7)+' '+(y-4)+'h14m-15 3h16m-16 3h16m-15 3h14" stroke="#7c858b" stroke-width=".6"/>'}
        a+=screw(cx,cy+21);
      }else{
        const pw=id==='phone-socket'?18:25,n=id==='phone-socket'?4:8;
        a+='<rect x="'+(cx-17)+'" y="'+(cy-22)+'" width="34" height="10" rx="1" fill="#fff" stroke="#e0e4e7"/><path d="M'+(cx-pw/2-2)+' '+(y-9)+'h'+(pw+4)+'v16h-'+(pw+4)+'z" fill="'+metal+'"/><path d="M'+(cx-pw/2)+' '+(y-7)+'h'+pw+'v11h-4v4h-'+(pw-8)+'v-4h-4z" fill="#26323a" stroke="#626e77" stroke-width=".8"/>';
        for(let i=0;i<n;i++)a+='<path d="M'+(cx-(n-1)*1.12+i*2.24)+' '+(y-6)+'v6" stroke="#d3ae5a" stroke-width="1"/>';
        a+=text(id==='phone-socket'?'RJ11 · CAT3':'RJ45 · CAT6',cx,cy+23,4.8);
      }
    }else if(id==='plug-1p'){
      a='<path d="M15 20h10v35H15zM55 20h10v35H55z" fill="'+metal+'" stroke="#929da3"/><path d="M13 47h54l-4 28-15 15v10H32V90L17 75Z" fill="'+dark+'" stroke="#172029"/><path d="M19 52h42l-3 20-14 14h-8L22 72Z" fill="#343a42" stroke="#5b636c"/>'+screw(cx,65)+text('FAR',cx,78,6)+'<path d="M34 89h12m-12 4h12m-12 4h12" stroke="#697179"/>';
    }else if(id==='lampholder-e27'){
      a='<path d="M'+cx+' 18V52" stroke="#c9ced1" stroke-width="5"/><path d="M'+cx+' 18V52" stroke="white" stroke-width="2"/><path d="M'+(cx-22)+' 12q22-12 44 0l8 12h-60Z" fill="'+white+'" stroke="#b1bbc2"/><ellipse cx="'+cx+'" cy="24" rx="30" ry="6" fill="'+white+'" stroke="#b5bec4"/><path d="M'+(cx-17)+' 55q17-5 34 0l8 31q-25 19-50 0Z" fill="'+white+'" stroke="#b0bac1"/><ellipse cx="'+cx+'" cy="86" rx="25" ry="12" fill="'+white+'" stroke="#9da8af"/><ellipse cx="'+cx+'" cy="87" rx="19" ry="8" fill="#6d6655"/>';
      for(let i=0;i<4;i++)a+='<path d="M'+(cx-17)+' '+(83+i*2)+'q17 9 34 0" fill="none" stroke="#bfa777" stroke-width="1.2"/>';
      a+='<ellipse cx="'+cx+'" cy="85" rx="4" ry="2" fill="#ccae68"/>'+text('E27',cx,69,6);
      if(c._active)a+='<ellipse cx="'+cx+'" cy="86" rx="24" ry="11" fill="'+lightColor+'" opacity=".4"/>';
    }else if(id==='bell-electronic'){
      a=frame(13,17,w-26,70)+'<rect x="21" y="25" width="58" height="54" rx="5" fill="'+white+'"/><path d="M29 31V71M71 31V71" stroke="#d9dfe3" stroke-width="4" stroke-linecap="round"/><path d="M28 31V71M70 31V71" stroke="#ffffff" stroke-width="1.3"/>';
      a+=text('ELEKTRONİK ZİL',cx,78,3.6);if(c._active)a+='<path d="M8 36q-8 13 0 26m84-26q8 13 0 26" fill="none" stroke="#f0a51b" stroke-width="2.5"/>';
    }else if(id==='door-release'){
      a='<path d="M10 34h70l11 8v39H10Z" fill="'+metal+'" stroke="#78848c"/><rect x="19" y="40" width="46" height="32" rx="4" fill="#afb8bf" stroke="#707d87"/><rect x="71" y="45" width="20" height="14" rx="2" fill="'+dark+'"/><rect x="'+(c._active?69:83)+'" y="48" width="14" height="8" fill="'+metal+'"/>'+screw(16,39)+screw(16,74)+screw(77,75)+text(c._active?'AÇIK':'KİLİTLİ',42,59,6);
    }else{
      const group=id==='bell-push-group';a=frame(12,23,w-24,62);
      const button=(x,key)=>{const on=group?!!c.switchStates?.[key]:!!c.state;return '<g'+(group?' data-installation-contact="'+key+'" role="button" tabindex="0" aria-label="'+(key==='a'?'Birinci':'İkinci')+' zil butonu"':'')+'><rect x="'+(x-20)+'" y="'+(on?36:33)+'" width="40" height="35" rx="3" fill="'+(on?'#d2d8dd':white)+'" stroke="#bdc6cc"/>'+bellIcon(x,51)+'<rect x="'+(x-12)+'" y="72" width="24" height="6" fill="#fff" stroke="#d0d6da" stroke-width=".5"/></g>'};
      if(group)a+=button(40,'a')+button(100,'b');else if(id==='bell-light-push')a+='<rect x="26" y="33" width="48" height="43" rx="3" fill="'+(c.state?'#d2d8dd':white)+'" stroke="#bdc6cc"/><path d="M47 55v-4c-8-7 2-16 7-8q3 4-1 8v4zm0 3h6m-5 3h4" fill="none" stroke="#859098"/>';else a+=button(cx,'main');
    }
    if(c.rotation)a=a.replace(/<text ([^>]*)>([\s\S]*?)<\/text>/g,(full,attrs,body)=>{const x=Number(attrs.match(/\bx="([^"]+)"/)?.[1]||0),y=Number(attrs.match(/\by="([^"]+)"/)?.[1]||0);return '<text '+attrs+' transform="rotate('+(-c.rotation)+' '+x+' '+y+')">'+body+'</text>'});
    return '<g class="material-layer design-material installation-material" data-material="design-'+id+'"><defs><linearGradient id="'+g+'-white" x2=".3" y2="1"><stop stop-color="#ffffff"/><stop offset=".5" stop-color="#f3f5f6"/><stop offset="1" stop-color="#ccd4da"/></linearGradient><linearGradient id="'+g+'-metal"><stop stop-color="#707f89"/><stop offset=".3" stop-color="#edf2f5"/><stop offset=".6" stop-color="#a5b0b8"/><stop offset="1" stop-color="#56636d"/></linearGradient><linearGradient id="'+g+'-dark" x2=".7" y2="1"><stop stop-color="#565e66"/><stop offset=".5" stop-color="#282e36"/><stop offset="1" stop-color="#131b24"/></linearGradient></defs>'+a+'</g>';
  }
  const api={extend,drawing,material,sources};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSInstallation=api;
})(typeof window==='undefined'?globalThis:window);
