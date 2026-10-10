(function(root){
  'use strict';
  // Classification is independent of drawing norm, appearance and terminal data.
  const areas=[['all','Tüm kullanım alanları'],['control','Kumanda ve kontrol'],['motor','Motor ve hareket'],['panel','Pano ve güç dağıtımı'],['building','Tesisat ve aydınlatma'],['electronics','Elektronik'],['automation','PLC ve otomasyon'],['measurement','Ölçme ve test'],['drawing','Şema yardımcıları']];
  const groups=[
    ['installation','Tesisat planı ve buatlar'],['bell-circuits','Zil ve kapı otomatiği'],['sockets','Prizler ve fişler'],['telephone','Telefon tesisatı'],['antenna','TV ve anten tesisatı'],
    ['knx','KNX / EIB bina otomasyonu'],['panel-layout','Pano içi yerleşim simgeleri'],['energy-meters','Enerji sayaçları'],['analog-sensors','Analog sensörler ve enkoderler'],['signal-conditioning','Sinyal dönüştürücüler'],
    ['contactors','Kontaktörler ve güç kontakları'],['auxiliary','Yardımcı kontaklar'],['relays','Röleler ve bobinler'],['timers','Zaman röleleri ve kontakları'],
    ['buttons','Butonlar'],['switches','Şalterler ve seçiciler'],['lamps','Lambalar ve LED’ler'],['alarms','Sesli ve ışıklı uyarıcılar'],
    ['protection','Sigortalar ve koruma'],['sources','Beslemeler ve güç kaynakları'],['transformers','Trafolar ve reaktörler'],['motors','Motorlar ve fanlar'],['drives','Motor sürücüleri'],['actuators','Valfler ve elektromıknatıslar'],
    ['sensors','Sensörler ve sınır anahtarları'],['measurement','Ölçü aletleri'],['passives','Direnç, kondansatör ve bobin'],['semiconductors','Diyotlar, transistörler ve entegreler'],['terminals','Klemens, konnektör ve baralar'],
    ['cpu','PLC işlemcileri'],['digital-in','Dijital giriş modülleri'],['digital-out','Dijital çıkış modülleri'],['digital-io','Dijital karma I/O'],['analog-in','Analog giriş modülleri'],['analog-out','Analog çıkış modülleri'],['analog-io','Analog karma I/O'],['communication','Haberleşme ve arayüz modülleri'],['safety','Emniyet modülleri'],['technology','Sayma, sıcaklık ve tartım modülleri'],['plc-power','PLC besleme modülleri'],['plc-accessories','PLC bağlantı ve aksesuarları'],['arduino-boards','Arduino kartları'],['arduino-inputs','Arduino sensörleri ve girişler'],['arduino-outputs','Arduino çıkışları ve röleler'],['arduino-passives','Arduino pasif elemanları'],['arduino-motors','Arduino motor ve sürücüler'],['arduino-displays','Arduino ekran ve göstergeler'],['arduino-comms','Arduino haberleşme modülleri'],['arduino-modules','Arduino yardımcı modülleri'],['arduino-prototyping','Breadboard ve prototipleme'],['arduino-power','Arduino güç kaynakları'],['arduino-logic','Arduino lojik entegreleri'],['arduino-instruments','Arduino ölçüm ve test cihazları'],['arduino-semiconductors','Arduino yarı iletkenleri'],['drawing','Şema işaretleri ve kutular']
  ];
  const groupNames=Object.fromEntries(groups),order=Object.fromEntries(groups.map(([id],i)=>[id,i]));
  function plcGroup(d){
    const n=d.name.toUpperCase();
    if(/F-D[I Q]|NX-S[LI O]|NX-SOD/.test(n))return 'safety';
    if(/CPU|MICRO850|COMPACTLOGIX|CONTROLLOGIX/.test(n))return 'cpu';
    if(/GÜÇ|^(PM 1207|PS )/.test(n))return 'plc-power';
    if(/TERMINAL UNIT|BASE|BACKPLANE/.test(n))return 'plc-accessories';
    if(/RTD|SICAKLIK|LOAD CELL|COUNT|HSC|TM3TI|GXM-\d+UA/.test(n))return 'technology';
    if(/(?:DI\d*\s*\/\s*DO|\dDI\/\d[RT]O)|DVP\d+SP|CP1W-\d+EDR|^DX\d/.test(n))return 'digital-io';
    if(/AI\d*\/AO|\dAI\/\dAO|\dXA|MAD\d|^AX\d/.test(n))return 'analog-io';
    if(/\b(AI|AMI)\s?\d|\dAI\b|\dAD(?:[- ]|$)|-AD\d|-IF\d|^AI\d|TM3AI/.test(n))return 'analog-in';
    if(/\b(AO|AQ)\s?\d|\dAO\b|\dDA(?:[- ]|$)|-DA\d|-OF\d|^AO\d|TM3AQ/.test(n))return 'analog-out';
    if(/\b(DI|DDI)\s?\d|\dDI\b|-ID\d|-I[QB]\d|\dEX\/|^QX|^DI\d|AS\d+AM|AH\d+ANNN|TM3DI/.test(n))return 'digital-in';
    if(/\b(DO|DQ|DDO)\s?\d|\d[RT]O\b|-OD\d|-OB\d|\dEYT\/|^QY|^DO\d|AS\d+AN|AH\d+AP|CP1W-\d+ER|TM3DQ/.test(n))return 'digital-out';
    if(/\b(CM|CP|CSM|IM)|IM\d|ETH|E(NET|N\d|N-)|PROFI|RS\d|DNET|FCOPM|PF\d|CIF|SCU|SCM|ETN|EIP|ECC|CCL|NOC|QJ71|AENT|ECO PN/.test(n))return 'communication';
    return 'plc-accessories';
  }
  const arduinoSharedTools=new Set(['unit-ut33d-plus','unit-ut61e-plus','unit-ut200a','test-probe-red','test-probe-black','encoder-incremental']);
  const arduinoBasic=d=>d.arduinoShared===true||arduinoSharedTools.has(d.id)||['resistor','potentiometer','capacitor','diode','rectifier','ground'].includes(d.kind)||['resistor','potentiometer','capacitor','diode','rectifier','ground'].includes(d.id);
  function classification(d){
    if(['unit-ut33d-plus','unit-ut61e-plus','unit-ut200a'].includes(d.id))return {group:'measurement',areas:['control','panel','building','automation','measurement','electronics','motor']};
    if(d.arduinoGroup)return {group:d.arduinoGroup,areas:['electronics','automation','control']};
    if(['electronics-semiconductors','electronics-ics'].includes(d.catalogGroup))return {group:'semiconductors',areas:['electronics','control']};
    if(d.catalogGroup)return {group:d.catalogGroup,areas:d.diagramOnly?['drawing','panel','building','measurement','automation']:['control','panel','building','automation','measurement']};
    if(d.isPLC)return {group:plcGroup(d),areas:['automation','control','panel']};
    const k=d.kind,id=d.id;
    if(k==='plc-io')return {group:'digital-io',areas:['automation','control']};
    if(id==='coil-contactor'||k==='contactor3')return {group:'contactors',areas:['control','motor','panel','automation']};
    if(k.startsWith('contact-'))return {group:'auxiliary',areas:['control','motor','panel','automation']};
    if(k.startsWith('delay-')||k==='timer'||k==='coil-flasher'||k==='coil-pulse')return {group:'timers',areas:['control','motor','automation','building']};
    if(id==='solenoid'||k==='coil-valve')return {group:'actuators',areas:['control','automation']};
    if(k==='coil'||k==='relay-protection')return {group:'relays',areas:['control','motor','panel','electronics','automation']};
    if(k.startsWith('switch-')||k.startsWith('selector')){
      if(/push|mushroom|estop|operator-device/.test(id))return {group:'buttons',areas:['control','motor','building','automation']};
      if(/limit|float|pressure/.test(id))return {group:'sensors',areas:['control','motor','automation']};
      return {group:'switches',areas:['control','panel','building','motor']};
    }
    if(k==='sensor'||k==='detector')return {group:'sensors',areas:['automation','control','measurement']};
    if(k==='lamp'||k==='led')return {group:'lamps',areas:['control','panel','building','electronics']};
    if(['buzzer','siren','flasher'].includes(k))return {group:'alarms',areas:['control','building','automation']};
    if(/breaker|rcd|fuse|overload|thermal-magnetic/.test(k))return {group:'protection',areas:['control','motor','panel','building']};
    if(k.startsWith('supply')||k==='power24'||k==='generator')return {group:'sources',areas:['control','panel','building','electronics','automation']};
    if(k.includes('transformer')||k==='reactor')return {group:'transformers',areas:['control','panel','electronics','motor']};
    if(k.includes('motor')||d.rotating)return {group:'motors',areas:['motor','control','automation']};
    if(k==='vfd'||k==='softstarter')return {group:'drives',areas:['motor','control','automation','panel']};
    if(k.startsWith('meter-'))return {group:'measurement',areas:['measurement','electronics','panel']};
    if(['resistor','potentiometer','capacitor'].includes(k)||id==='winding')return {group:'passives',areas:['electronics','measurement']};
    if(['diode','rectifier','bjt-npn','bjt-pnp','mosfet-n','mosfet-p','igbt-n','scr','triac','diac','opamp'].includes(k)||id==='electronics')return {group:'semiconductors',areas:['electronics','control']};
    if(['terminal','ground','distribution-block','splice'].includes(k))return {group:'terminals',areas:['panel','building','control','electronics','automation']};
    return {group:'drawing',areas:['drawing','panel','control','electronics']};
  }
  function prepare(lib){return lib.map(d=>{d.classification=classification(d);return d})}
  function matches(d,f={}){
    const m=d.classification||classification(d),q=(f.query||'').trim().toLocaleLowerCase('tr');
    return d.catalogHidden!==true&&(f.category!=='electrical'||(!d.isPLC&&!d.arduinoOnly))&&(f.category!=='plc'||d.isPLC||d.kind==='plc-io'||arduinoSharedTools.has(d.id))&&(f.category!=='arduino'||d.arduinoBoard||d.arduinoOnly||arduinoBasic(d))&&
      (!f.area||f.area==='all'||m.areas.includes(f.area))&&(!f.group||f.group==='all'||m.group===f.group)&&
      (!f.brand||f.brand==='all'||d.brand===f.brand)&&(!f.series||f.series==='all'||d.series===f.series)&&
      (!q||[d.name,d.model,d.materialModel,d.brand,d.series,d.autodeskGroup,d.symbolCode,d.searchTerms,d.symbolSource?.file,groupNames[m.group],...m.areas.map(a=>Object.fromEntries(areas)[a])].filter(Boolean).join(' ').toLocaleLowerCase('tr').includes(q));
  }
  function sections(lib,f={}){
    const found=lib.filter(d=>matches(d,f));
    return groups.map(([id,title])=>({id,title,items:found.filter(d=>(d.classification||classification(d)).group===id).sort((a,b)=>(a.brand||'').localeCompare(b.brand||'','tr')||(a.series||'').localeCompare(b.series||'','tr')||a.name.localeCompare(b.name,'tr',{numeric:true}))})).filter(g=>g.items.length);
  }
  const api={areas,groups,groupNames,order,arduinoSharedTools,arduinoBasic,classification,prepare,matches,sections};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.CCSCatalog=api;
})(typeof window==='undefined'?globalThis:window);
