(function(root){
  'use strict';
  const Design=typeof module==='object'&&module.exports?require('./design-visuals.js'):root.DTSDesignVisuals;
  const ArduinoLibrary=typeof module==='object'&&module.exports?require('./arduino-library.js'):root.DTSArduinoLibrary;
  const assets=typeof module==='object'&&module.exports?{...require('./material-assets.js'),...require('./product-assets.js'),...require('./plc-assets.js'),...require('./product-assets-v110.js')}:{...root.CCSMaterialAssets,...root.CCSProductAssets,...root.CCSPLCAssets,...root.DTSAssets110};
  const byKind={
    supply:'mains-terminal',supply3:'three-phase-terminal','supply-dc-plus':'mains-terminal','supply-dc-minus':'mains-terminal',
    power24:'din-power-supply',transformer:'transformer',autotransformer:'transformer','transformer-3p':'transformer','current-transformer':'current-transformer',
    breaker:'single-pole-breaker',breaker2:'two-pole-rcd',breaker3:'three-pole-breaker',rcd2:'two-pole-rcd',rcd4:'three-pole-breaker',
    fuse:'fuse-carrier','fuse-switch':'fuse-carrier',overload:'thermal-overload','thermal-magnetic':'motor-protection',contactor3:'power-contactor',
    'switch-no':'rotary-selector','switch-nc':'rotary-selector','switch-both':'green-pushbutton','switch-packet':'rotary-selector',selector3:'rotary-selector',selector4:'rotary-selector',
    'contact-no':'auxiliary-contact','contact-nc':'auxiliary-contact','contact-both':'changeover-contact',
    'delay-on-no':'auxiliary-contact','delay-on-nc':'auxiliary-contact','delay-off-no':'auxiliary-contact','delay-off-nc':'auxiliary-contact',
    coil:'cube-relay',timer:'din-timer','coil-flasher':'cube-relay','coil-pulse':'cube-relay','coil-valve':'solenoid-valve','relay-protection':'din-timer',
    motor:'induction-motor',motor3:'induction-motor','motor-yd':'induction-motor','motor-dahlender':'induction-motor','motor-rotor':'induction-motor','motor-dc':'induction-motor','motor-2speed':'induction-motor',generator:'generator',
    sensor:'proximity-sensor',detector:'proximity-sensor',buzzer:'beacon-buzzer',siren:'beacon-buzzer',flasher:'beacon-buzzer',
    lamp:'incandescent-bulb-off',led:'green-led-off',terminal:'terminal-block',ground:'earth-terminal','distribution-block':'distribution-bus',splice:'distribution-bus',
    'meter-a':'panel-meter','meter-v':'panel-meter','meter-ohm':'panel-meter',resistor:'power-resistor',potentiometer:'rotary-selector',capacitor:'capacitor',diode:'power-diode',rectifier:'bridge-rectifier',reactor:'reactor',
    softstarter:'vfd',vfd:'vfd','plc-io':'plc-io','device-box':'electronic-enclosure',generic:'electronic-enclosure',arrow:'electronic-enclosure'
  };
  assets['abb-acs800-r5']={file:'assets/products/abb-acs800-reference.png',atlasWidth:1367,atlasHeight:1823,bounds:{x:280,y:70,width:810,height:1680},match:'representative',model:'ACS800 R5 · RMIO / güç klemensleri kılavuza göre çizildi',source:'Kullanıcı fotoğrafı (R6 gövde referansı); ABB 3AFE68372984 Rev F s.71,76,92'};
  assets['siemens-3rv2011-user-front-v11920']={file:'assets/products/siemens-3rv2011-user-front-v11920.webp',atlasWidth:225,atlasHeight:485,bounds:{x:0,y:0,width:225,height:485},viewBox:'0 0 225 485',match:'exact',model:'Siemens 3RV2011 user-approved front',source:'user-upload · 2026-10-08',physicalFrameMm:{width:45,height:97},license:'user-supplied',licenseStatus:'user-provided-for-project'};
  assets['sinamics-v20-book']={file:'assets/products/sinamics-v20-6sl3210-5bb21-5uv1-user-front-v2.webp',atlasWidth:280,atlasHeight:496,bounds:{x:0,y:0,width:280,height:496},viewBox:'0 0 280 496',match:'exact',model:'SINAMICS V20 6SL3210-5BB21-5UV1 · 1.5 kW · FSAC',source:'user-supplied canonical orthographic front visual',imageSource:'user-upload:Siemens SINAMICS V20 Ön Paneli(1).png',retrievedAt:'2026-10-06',physicalFrameMm:{width:90.8,height:160.9},calibration:{sourcePx:{width:1086,height:1448},cropPx:{x:140,y:18,width:807,height:1430},renderPx:{width:280,height:496},method:'crop exact physical front frame; high-quality WebP resample preserving 90.8x160.9 mm aspect'},provenanceEvidence:'User explicitly selected this exact uploaded V20 front as the canonical runtime visual. Original uploaded PNG SHA-256 a9a7b7d93f82dd7e81be67d807df718f484aa0b881beb0b562f3838a1b38a9d2; runtime WebP SHA-256 c8db14a110d3df76375289d3bfb30c0b25f1eab71ea9839ab9ff72dd0ef29667. Exact article identity and terminal geometry remain independently verified by Siemens CAD/DXF.',license:'user-supplied',licenseStatus:'user-provided-for-project',usageRights:'project-use-authorized-by-user',attributionRequired:'no'};
  assets['finder80-front']={file:'assets/products/finder80-front-v19.png',atlasWidth:1070,atlasHeight:1470,bounds:{x:398,y:73,width:275,height:1325},viewBox:'398 73 275 1325',outlinePath:'M412 74H658V224H666V338H672V1080H666V1353H590V1379L546 1397H512L477 1380V1353H412V1208H405V1080H399V338H405V224H412Z',match:'representative',source:'Finder S80EN, s.3; imagegen ile önden uyarlanmış görsel'};
  assets['finder20-front']={file:'assets/products/finder20-front-v19.png',atlasWidth:1009,atlasHeight:1559,bounds:{x:366,y:39,width:275,height:1410},viewBox:'366 39 275 1410',outlinePath:'M374 40H634V215H640V340H636V1065H640V1216H635V1408H565V1446H439V1408H373V1216H369V1065H366V342H370V215H374Z',match:'representative',source:'Finder S20EN, s.3; imagegen ile önden uyarlanmış görsel'};
  assets['level-reference']={file:'assets/products/level-reference-v19.jpg',atlasWidth:170,atlasHeight:300,bounds:{x:55,y:0,width:60,height:276},viewBox:'55 0 60 276',match:'representative',source:'setateknik.com/urun/sivi-seviye-sensoru; kullanıcının istediği 0–10 V / 4–20 mA eğitim çıkışı'};
  assets['kobastar-sb2']={file:'assets/products/kobastar-sb2-v112.webp',atlasWidth:700,atlasHeight:350,bounds:{x:0,y:0,width:700,height:350},viewBox:'0 0 700 350',match:'exact',model:'Kobastar SB2',source:'https://kobastar.com/tr/product-details/sb2-lama-tip-paslanmaz-load-cell/'};
  assets['ntc-reference']={file:'assets/products/ntc-reference-v19.jpg',atlasWidth:1000,atlasHeight:1000,bounds:{x:407,y:250,width:190,height:505},viewBox:'407 250 190 505',outlinePath:'M458 268Q460 250 500 251Q539 251 539 268V349H546V474Q589 472 588 490L596 596L577 610L566 624V644L534 669V738Q506 762 472 745V668L447 650V627L425 618L408 598L413 488Q413 477 448 476V352H457Z',match:'representative',source:'kombitesisatmarket.com/universal-kombi-ntc-isi-sensoru'};
  assets['tc-reference']={file:'assets/products/tc-reference-v19.jpg',atlasWidth:1280,atlasHeight:720,bounds:{x:278,y:198,width:724,height:303},viewBox:'278 198 724 303',outlinePath:'M278 384Q280 272 370 220L430 199L481 215L530 251L550 285L600 310L626 323L628 373L651 382L996 453Q1002 459 998 473L649 412L635 418L626 450L595 452L548 438L477 456L430 490Q383 512 351 482L320 458L285 423Z',match:'representative',source:'emkoelektronik.com.tr TCK/TCKT ürün sayfası'};
  assets['ssr-reference']={file:'assets/products/ssr-reference-v19.jpg',atlasWidth:1000,atlasHeight:1000,bounds:{x:230,y:110,width:570,height:800},viewBox:'230 110 570 800',outlinePath:'M250 113H269L280 152H430L436 113H457L464 190H580L588 113H607L612 152H770L778 116H796V844L781 893H568V901H250L232 845V278Z',match:'exact',source:'biltekelektrik.com Fotek SSR-40DA'};
  assets['ptc-reference']={file:'assets/products/ptc-reference-v19.png',atlasWidth:1558,atlasHeight:877,bounds:{x:164,y:249,width:1195,height:470},viewBox:'164 249 1195 470',outlinePath:'M173 452L276 455Q227 367 414 307Q646 238 942 259Q1034 230 1205 289Q1393 325 1348 470Q1350 613 1090 671Q848 718 605 682L610 698L578 694L602 716L568 704L503 678V684Q314 632 281 527L177 523Q157 511 166 468Z M383 433Q531 353 802 360Q1060 345 1207 430Q1090 479 638 483L631 476L432 461Z',match:'exact',model:'EMKO PTC-M6L40.K1,5',source:'EMKO Temperature Sensors / Thermoresistances; Conrad üretici PDF, s.1'};
  const exact={
    'push-no':'green-pushbutton','push-nc':'red-pushbutton','push-both':'green-pushbutton','illuminated-push':'green-pushbutton',
    estop:'emergency-stop','mushroom-no':'emergency-stop','mushroom-nc':'emergency-stop',
    'limit-no':'limit-switch','limit-nc':'limit-switch',float:'float-switch',pressure:'pressure-switch','pressure-temp-switch':'pressure-switch',
    'terminal-pe':'earth-terminal','coil-contactor':'power-contactor',solenoid:'solenoid-valve',
    photoeye:'photoelectric-sensor','photo-emitter':'photoelectric-sensor','photo-receiver':'photoelectric-sensor','photo-emitter-receiver':'photoelectric-sensor',
    'touch-switch':'blue-pushbutton','operator-device':'blue-pushbutton','mechanical-control':'limit-switch','mechanical-latching':'limit-switch',
    winding:'reactor','power-receptacle':'mains-terminal','cable-marker':'terminal-block','one-line-cable-marker':'terminal-block'
  };
  function family(d,c={}){
    if(d.materialSymbol||d.designMaterial)return 'design-'+d.id;
    if(d.materialAsset)return d.materialAsset;
    if(d.isPLC){
      if(assets['product-'+d.id])return 'product-'+d.id;
      const n=d.name||'';
      if(/CM\d|CP\s*34|NOC|EN2T|AENT|ECC|CCL|ENET|ETHERNET|COMM|PN\/|PROFINET|PROFIBUS|RS[24]|DP\b/i.test(n))return 'plc-communication';
      return d.w>=140?'plc-cpu':'plc-io';
    }
    if(d.kind==='lamp')return c._active?'incandescent-bulb-on':'incandescent-bulb-off';
    return exact[d.id]||byKind[d.kind]||'electronic-enclosure';
  }
  function info(d){const photo=(typeof module==='object'&&module.exports?require('./plc-photo-data.js'):root.DTSPLCPhotoData)?.[d.id];if(photo)return {match:photo.match,model:photo.model,part:d.part||'',source:photo.source,note:photo.note};if(d.visualInfo)return d.visualInfo;if(d.isPLC||d.brandedSensor||d.materialSymbol||d.designMaterial)return {match:'representative',model:d.materialModel||d.name,part:'',source:d.terminalSource||d.productSource||'Temsili eğitim görseli'};const s=assets[family(d)]||{};return {match:s.match||'representative',model:s.model||d.materialModel||d.model,part:s.part||'',source:s.source||''}}
  function sprite(id,x,y,w,h,className='material-art',scope=''){
    const s=assets[id];if(!s)throw Error('Missing material asset: '+id);
    const clipId='product-outline-'+Array.from(scope||id).map(c=>c.codePointAt(0).toString(16)).join('-');
    const clip=s.outlinePath?'<defs><clipPath id="'+clipId+'" clipPathUnits="userSpaceOnUse"><path fill="black" d="'+s.outlinePath+'"/></clipPath></defs>':'';
    return '<svg class="'+className+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" viewBox="'+s.viewBox+'" preserveAspectRatio="xMidYMid meet" overflow="hidden" aria-hidden="true">'+clip+'<image href="'+s.file+'" width="'+s.atlasWidth+'" height="'+s.atlasHeight+'"'+(s.outlinePath?' clip-path="url(#'+clipId+')"':'')+'/></svg>';

  }
  function fitted(id,d){
    const [sx,sy,sw,sh]=assets[id].viewBox.split(' ').map(Number),scale=Math.min((d.w-16)/sw,(d.h-16)/sh);
    return {x:8+(d.w-16-sw*scale)/2,y:8+(d.h-16-sh*scale)/2,w:sw*scale,h:sh*scale,sx,sy,scale};
  }
  function controlRegion(d,id,fit){
    if(!d.interactive||['sensor','detector'].includes(d.kind))return null;
    let region=assets[id].actuator||null;
    if(!region&&/green-pushbutton|red-pushbutton/.test(id))region=[.20,.33,.60,.50,'ellipse'];
    if(!region&&id==='blue-pushbutton')region=[.22,.29,.58,.55,'ellipse'];
    if(!region&&id==='emergency-stop')region=[.17,.29,.66,.58,'ellipse'];
    if(!region&&id==='rotary-selector')region=[.40,.30,.23,.63,'rect'];
    if(!region&&id==='single-pole-breaker')region=[.25,.46,.51,.20,'rect'];
    if(!region&&id==='three-pole-breaker')region=[.08,.48,.84,.18,'rect'];
    if(!region&&id==='two-pole-rcd')region=[.63,.43,.23,.29,'rect'];
    if(!region&&id==='limit-switch')region=[.38,.10,.29,.35,'rect'];
    const diameter=Number(d.buttonActuatorDiameterScene);
    if(region&&fit&&Number.isFinite(diameter)&&diameter>0&&fit.w>0&&fit.h>0&&region[4]==='ellipse'){
      const cx=region[0]+region[2]/2,cy=region[1]+region[3]/2;
      region=[cx-diameter/(2*fit.w),cy-diameter/(2*fit.h),diameter/fit.w,diameter/fit.h,'ellipse'];
    }
    return region;
  }
  function shape(region,fit,extra=''){
    const [a,b,w,h,form]=region,x=fit.x+a*fit.w,y=fit.y+b*fit.h;
    return form==='ellipse'?'<ellipse cx="'+(x+w*fit.w/2)+'" cy="'+(y+h*fit.h/2)+'" rx="'+w*fit.w/2+'" ry="'+h*fit.h/2+'" '+extra+'/>':'<rect x="'+x+'" y="'+y+'" width="'+w*fit.w+'" height="'+h*fit.h+'" rx="2" '+extra+'/>';
  }
  const Modern=typeof module==='object'&&module.exports?require('./modern-materials.js'):root.DTSModernMaterials;
  function baseMarkup(d,c={}){
    const arduino=ArduinoLibrary?.art?.(d,c);if(arduino)return arduino;
    if(d.id==='abb-acs800-r5')return (typeof module==='object'&&module.exports?require('./acs800-art.js'):root.DTSACS800Art).markup(d,c);
    const instrument=(typeof module==='object'&&module.exports?require('./materials-v115.js'):root.DTSMaterials115)?.markup(d,c,sprite);if(instrument)return instrument;
    const plcFront=(typeof module==='object'&&module.exports?require('./plc-front.js'):root.DTSPLCFront)?.markup(d,c);if(plcFront)return plcFront;
    const photo=(typeof module==='object'&&module.exports?require('./materials-v113.js'):root.DTSMaterials113)?.markup(d,c);if(photo)return photo;
    // A single renderer guarantees identical PT100/thermocouple probe artwork.
    if(d.ptWires||d.id==='thermocouple')return '<g class="material-layer" data-material="tc-reference">'+sprite('tc-reference',8,8,d.w-16,d.h-16,'material-art','shared-probe:'+(c.id||d.id))+'</g>';
    if(d.id==='load-cell')return '<g class="material-layer" data-material="kobastar-sb2"><image href="assets/products/kobastar-sb2-v112.webp" x="0" y="30" width="'+d.w+'" height="'+d.w/2+'"/></g>';
    if(['tutorial-battery-alkaline','tutorial-battery-nimh','tutorial-battery-liion'].includes(d.id)){
      const style=d.id==='tutorial-battery-alkaline'?{band:'#d7a21b',body:'#202b34',name:'ALKALİN',sub:'BİRİNCİL · TEK KULLANIM'}:d.id==='tutorial-battery-nimh'?{band:'#4a9d6f',body:'#245c46',name:'NiMH',sub:'ŞARJ EDİLEBİLİR'}:{band:'#3b6fd8',body:'#1f3d78',name:'Li-ion',sub:'18650 · ŞARJ EDİLEBİLİR'};
      const volts=Math.max(.1,Number(c.cellVoltage??d.defaultVoltage??1.5)),label=volts.toFixed(1).replace('.',',')+' V',scope=String(c.id||d.id).replace(/[^a-zA-Z0-9_-]/g,'_'),grad='battery-type-'+scope;
      return '<g class="material-layer tutorial-battery-material battery-type-cylinder" data-material="'+d.id+'"><defs><linearGradient id="'+grad+'" x1="0" x2="1"><stop offset="0" stop-color="#cbd2d8"/><stop offset=".2" stop-color="#f7fafc"/><stop offset=".55" stop-color="#aab5bd"/><stop offset=".82" stop-color="#edf2f5"/><stop offset="1" stop-color="#87949e"/></linearGradient></defs><ellipse cx="55" cy="18" rx="30" ry="10" fill="#7d8992"/><rect x="43" y="3" width="24" height="14" rx="4" fill="#dce2e6" stroke="#56626a"/><rect x="20" y="16" width="70" height="188" rx="27" fill="url(#'+grad+')" stroke="#47545e" stroke-width="2"/><rect x="22" y="62" width="66" height="84" rx="8" fill="'+style.body+'"/><rect x="22" y="62" width="66" height="14" rx="6" fill="'+style.band+'"/><text x="55" y="96" text-anchor="middle" font-size="12" font-weight="900" fill="#fff">'+style.name+'</text><text x="55" y="119" text-anchor="middle" font-size="18" font-weight="900" fill="#fff">'+label+'</text><text x="55" y="137" text-anchor="middle" font-size="6.8" font-weight="700" fill="#e8eef2">'+style.sub+'</text><circle cx="55" cy="39" r="12" fill="#f8fafc" stroke="#8d99a3"/><text x="55" y="45" text-anchor="middle" font-size="20" font-weight="900" fill="#b42318">+</text><circle cx="55" cy="181" r="12" fill="#e9edf0" stroke="#8d99a3"/><text x="55" y="187" text-anchor="middle" font-size="20" font-weight="900" fill="#24313b">−</text><ellipse cx="55" cy="202" rx="29" ry="8" fill="#7c8790"/></g>';
    }
    if(d.id==='tutorial-battery-leadacid'){
      const volts=Math.max(.1,Number(c.cellVoltage??d.defaultVoltage??12)),label=volts.toFixed(0)+' V';
      return '<g class="material-layer tutorial-battery-material battery-type-leadacid" data-material="tutorial-battery-leadacid"><rect x="14" y="24" width="162" height="94" rx="10" fill="#2d3741" stroke="#101820" stroke-width="3"/><rect x="24" y="38" width="142" height="60" rx="6" fill="#3c4854"/><rect x="35" y="7" width="26" height="21" rx="4" fill="#b53a2d" stroke="#602019"/><rect x="129" y="7" width="26" height="21" rx="4" fill="#27333c" stroke="#11191f"/><text x="48" y="21" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">+</text><text x="142" y="21" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">−</text><text x="95" y="61" text-anchor="middle" font-size="18" font-weight="900" fill="#fff">'+label+' AKÜ</text><text x="95" y="78" text-anchor="middle" font-size="9" font-weight="800" fill="#d6e1e8">KURŞUN-ASİT</text><text x="95" y="92" text-anchor="middle" font-size="7" fill="#aebdc7">ŞARJ EDİLEBİLİR · YÜKSEK AKIM</text><rect x="73" y="17" width="44" height="8" rx="4" fill="#111820"/></g>';
    }
    if(d.id==='tutorial-battery'){
      const scope=String(c.id||d.id).replace(/[^a-zA-Z0-9_-]/g,'_'),grad='battery-shell-'+scope,volts=Math.max(.1,Number(c.cellVoltage??d.defaultVoltage??1.5)),label=volts.toFixed(1).replace('.',',')+' V';
      return '<g class="material-layer tutorial-battery-material" data-material="tutorial-battery"><defs><linearGradient id="'+grad+'" x1="0" x2="1"><stop offset="0" stop-color="#d9dee3"/><stop offset=".18" stop-color="#f7fafc"/><stop offset=".52" stop-color="#b7c0c8"/><stop offset=".78" stop-color="#eef2f5"/><stop offset="1" stop-color="#9da8b1"/></linearGradient></defs><ellipse cx="55" cy="18" rx="30" ry="10" fill="#8a949c"/><rect x="43" y="3" width="24" height="14" rx="4" fill="#d7dde1" stroke="#59636b"/><rect x="20" y="16" width="70" height="188" rx="27" fill="url(#'+grad+')" stroke="#47545e" stroke-width="2"/><rect x="22" y="64" width="66" height="78" rx="8" fill="#1f2937"/><rect x="22" y="64" width="66" height="13" rx="6" fill="#e9b949"/><text x="55" y="94" text-anchor="middle" font-size="11" font-weight="800" fill="#f8fafc">ALKALINE</text><text x="55" y="117" text-anchor="middle" font-size="18" font-weight="900" fill="#ffffff">'+label+'</text><text x="55" y="134" text-anchor="middle" font-size="8" fill="#dbe4ea">DC HÜCRE</text><circle cx="55" cy="39" r="12" fill="#f8fafc" stroke="#8d99a3"/><text x="55" y="45" text-anchor="middle" font-size="20" font-weight="900" fill="#b42318">+</text><circle cx="55" cy="181" r="12" fill="#e9edf0" stroke="#8d99a3"/><text x="55" y="187" text-anchor="middle" font-size="20" font-weight="900" fill="#24313b">−</text><ellipse cx="55" cy="202" rx="29" ry="8" fill="#7c8790"/></g>';
    }
    const latest=(typeof module==='object'&&module.exports?require('./materials-v111.js'):root.DTSMaterials111)?.markup(d,c);if(latest)return latest;
    const modern=Modern.markup(d,c,sprite);if(modern)return modern;
    if(d.materialSymbol||d.designMaterial)return Design.markup(d,c);
    if(d.id==='sensor-level-analog'){
      const handle=String(c.id||d.id).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x])),id='level-'+(c.id||d.id).replace(/[^a-zA-Z0-9_-]/g,'_'),position=Math.max(0,Math.min(100,Number(c.analogPosition??50))),y=220-position*1.4;
      return `<g class="material-layer" data-material="level-reference"><svg x="20" y="8" width="80" height="244" viewBox="55 0 60 276" overflow="visible"><defs><clipPath id="${id}-body"><path fill="black" d="M63 3H109V24H94V47H101V57H94V73H84V131H76V73H63V60H55V48H62Z M76 170H84V248H93V257H84V268H76V257H66V247H76Z"/></clipPath><clipPath id="${id}-float"><rect fill="black" x="63" y="131" width="32" height="39" rx="2"/></clipPath></defs><image href="assets/products/level-reference-v19.jpg" width="170" height="300" clip-path="url(#${id}-body)"/><path d="M80 73V250" stroke="#8b9697" stroke-width="6"/><path d="M78 73V250" stroke="#dfe9e5" stroke-width="2"/><g data-analog-handle="${handle}" style="cursor:ns-resize" transform="translate(0 ${y-131})"><image href="assets/products/level-reference-v19.jpg" width="170" height="300" clip-path="url(#${id}-float)"/></g></svg></g>`;
    }
    if(d.isPLC){
      const esc=s=>String(s||'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
      const accent={Siemens:'#009999',Delta:'#008bc9',Omron:'#1672b7',GMTCNT:'#e3ad32'}[d.brand]||'#527389';
      let body='<rect x="0" y="0" width="'+d.w+'" height="'+d.h+'" rx="5" fill="#c8cccf" stroke="#29333c" stroke-width="2"/><rect x="12" y="28" width="'+(d.w-24)+'" height="'+(d.h-56)+'" rx="3" fill="#343c43"/><rect x="12" y="28" width="'+(d.w-24)+'" height="20" fill="'+accent+'"/><text x="22" y="43" fill="white" font-size="11">'+esc(d.brand)+'</text><text x="22" y="75" fill="white" font-size="11">'+esc(d.name)+'</text>';
      if(d.io)body+='<text x="22" y="95" fill="#cbd5df" font-size="10">'+esc(Object.entries(d.io).map(([k,v])=>k+' '+v).join(' · '))+'</text>';
      body+='<circle cx="24" cy="115" r="3" fill="#64748b"/><text x="34" y="119" fill="#e0e5e9" font-size="9">RUN / STOP</text>';
      for(const p of d.pins){const x=p.x,y=p.y;body+='<rect x="'+(x-6)+'" y="'+(y-6)+'" width="12" height="12" rx="2" fill="#6a747c" stroke="#202931"/><circle cx="'+x+'" cy="'+y+'" r="3" fill="#cfd7dd"/>'}
      return '<g class="material-layer plc-front" data-material="'+family(d,c)+'">'+body+'</g>';
    }
    const id=family(d,c),inset=assets[id]?.physicalFrameMm?0:8,w=d.w-inset*2,h=d.h-inset*2;
    // Geometry is supplied by Assemblies.definition; photo-aligned pins retain
    // the same electrical identifiers as the schematic terminals.
    const scope=c.id||d.id;let result=sprite(id,inset,inset,w,h,'material-art',scope+':base');
    const fit=fitted(id,d),region=controlRegion(d,id,fit);
    if(id==='panel-meter'&&['meter-a','meter-v'].includes(d.kind)){
      const Devices=typeof module==='object'&&module.exports?require('./device-behavior.js'):root.DTSDeviceBehavior,r=Devices?.panelMeterValue?.(c,d);
      if(r&&Number.isFinite(r.value)){
        const sx=fit.x+fit.w*.19,sy=fit.y+fit.h*.295,sw=fit.w*.62,sh=fit.h*.205,value=r.value.toFixed(r.digits),font=Math.max(7,Math.min(12,sw*.22)),base=sy+sh*.70,clip='meter-screen-'+Array.from(scope).map(ch=>ch.codePointAt(0).toString(16)).join('-');
        result+='<defs><clipPath id="'+clip+'"><rect x="'+sx+'" y="'+sy+'" width="'+sw+'" height="'+sh+'" rx="2"/></clipPath></defs><g class="panel-meter-live-screen" data-panel-meter-readout="1" clip-path="url(#'+clip+')"><rect class="panel-meter-screen" x="'+sx+'" y="'+sy+'" width="'+sw+'" height="'+sh+'" rx="2"/><path class="panel-meter-screen-shine" d="M'+(sx+2)+' '+(sy+2)+'H'+(sx+sw-2)+'"/><text class="panel-meter-digits" x="'+(sx+sw*.47)+'" y="'+base+'" text-anchor="middle" font-size="'+font+'">'+value+'</text><text class="panel-meter-unit" x="'+(sx+sw*.87)+'" y="'+base+'" text-anchor="middle" font-size="'+Math.max(5.5,font*.58)+'">'+r.unit+'</text></g>';
      }
    }
    if(region){
      const key=Array.from(d.id+'|'+(c.id||'preview')).map(s=>s.codePointAt(0).toString(16)).join('-'),mask='body-'+key,clip='cap-'+key;
      const cx=fit.x+(region[0]+region[2]/2)*fit.w,cy=fit.y+(region[1]+region[3]/2)*fit.h;
      // The moving piece is the same raster cap, separated with a clip/mask.
      // Its bezel, body and electrical terminals stay fixed.
      result='<defs><mask id="'+mask+'" maskUnits="userSpaceOnUse" x="0" y="0" width="'+d.w+'" height="'+d.h+'"><rect width="'+d.w+'" height="'+d.h+'" fill="white"/>'+shape(region,fit,'fill="black"')+'</mask><clipPath id="'+clip+'">'+shape(region,fit)+'</clipPath></defs>'+shape(region,fit,'class="material-recess" fill="#12191b"')+'<g mask="url(#'+mask+')">'+result+'</g><g class="material-actuator" style="transform-origin:'+cx+'px '+cy+'px"><g clip-path="url(#'+clip+')">'+sprite(id,inset,inset,w,h,'material-art',scope+':cap')+'</g></g>';
    }
    const customColor=/^#[0-9a-f]{6}$/i.test(c.deviceColor||'')?c.deviceColor:(d.color||'#20b26b');
    if(region&&c.deviceColor&&/push|mushroom|estop|jog/.test(d.id))result=result.slice(0,-4)+shape(region,fit,'fill="'+customColor+'" fill-opacity=".8" stroke="#24313b" stroke-width="1"')+'</g>';
    if(['lamp','led','flasher'].includes(d.kind))result+='<circle class="custom-lamp-color" cx="'+(d.w/2)+'" cy="'+(d.h/2)+'" r="'+Math.min(d.w,d.h)*.23+'" fill="'+customColor+'" opacity="'+(c._active?'.85':'.28')+'"'+(c._active?' style="filter:drop-shadow(0 0 7px '+customColor+')"':'')+'/>';
    if(d.kind==='switch-packet')result+='<text class="packet-position" x="'+d.w/2+'" y="'+(d.h-24)+'" fill="#172033" font-size="14" text-anchor="middle">'+d.positions[c.position||0]+'</text>';
    if(d.kind==='contactor3'||d.id==='coil-contactor'||/contact-(no|nc|both)$/.test(d.kind)){
      const core=assets[id].core||[.30,.34,.40,.28,'rect'];
      result+=shape(core,fit,'class="material-coil-core"');
    }
    if(['sensor','detector'].includes(d.kind))result+='<circle class="material-detection" cx="'+(fit.x+fit.w*.6)+'" cy="'+(fit.y+fit.h*.3)+'" r="4"/>';
    for(const p of d.pins){
      const vector={top:[0,1],bottom:[0,-1],left:[1,0],right:[-1,0]}[p.side]||[0,0];
      result+='<line x1="'+p.x+'" y1="'+p.y+'" x2="'+(p.x+vector[0]*12)+'" y2="'+(p.y+vector[1]*12)+'" stroke="#74818c" stroke-width="2"/>';
    }
    if(d.kind!=='lamp')result+='<circle class="material-state" cx="'+(d.w-10)+'" cy="10" r="3"/>';
    return '<g class="material-layer" data-material="'+id+'">'+result+'</g>';
  }
  function screw(x,y,size){return sprite('terminal-screw',x,y,size,size,'material-terminal')}
  function markup(d,c={}){
    const art=baseMarkup(d,c);if(!art)return art;
    const relayLike=['coil','timer','coil-flasher','coil-pulse','relay-protection','ssr'].includes(d.kind)||d.id==='coil-relay'||d.id==='solid-state-relay';
    if(!relayLike)return art;
    const r=Math.max(2.5,Math.min(6,Math.min(Number(d.w)||40,Number(d.h)||40)*.055)),x=(Number(d.w)||40)-r-3,y=r+3,on=!!c._active;
    return '<g class="material-active-led-wrap" data-active="'+(on?'true':'false')+'">'+art+'<g class="material-active-led" pointer-events="none"><circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+(on?'#22c55e':'#1f2f27')+'" stroke="#0b1610" stroke-width="1"'+(on?' style="filter:drop-shadow(0 0 5px #22c55e)"':'')+'><title>'+(on?'ACTIVE':'OFF')+'</title></circle></g></g>';
  }
  const api={assets,family,info,sprite,markup,screw,fitted,controlRegion};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.CCSMaterials=api;
})(typeof window==='undefined'?globalThis:window);
