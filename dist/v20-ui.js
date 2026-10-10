(function(root){
 'use strict';
 const V=typeof module==='object'&&module.exports?require('./v20.js'):root.DTSV20;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const format=(v,d=2)=>Number(v||0).toLocaleString('tr-TR',{minimumFractionDigits:d,maximumFractionDigits:d});
 const number=(v,d=2)=>Number(v||0).toFixed(d),keyName=k=>k.replace(/\.(\d)$/,'[$1]');
 function readouts(c){const s=c._v20||{};return [
  ['r0024','Çıkış frekansı',s.hz,'Hz'],['r0025','Çıkış gerilimi',s.voltage,'V'],['r0026','DC bara',s.bus,'V'],['r0027','Motor akımı (tahmini)',s.current,'A'],['r0022','Motor devri (tahmini)',s.rpm,'dev/dk'],['r1114','Hedef frekans',s.target,'Hz'],['r0752[0]','AI1 giriş',s.ai?.[0]?.raw,[2,3].includes(V.peek(c).params['P0756.0'])?'mA':'V'],['r0752[1]','AI2 giriş',s.ai?.[1]?.raw,[2,3].includes(V.peek(c).params['P0756.1'])?'mA':'V'],['r0774','AO1 çıkış',s.ao,'mA']];}
 function markup(c,material=false,definition=null){
  if(material&&definition&&Number(definition.w)>0&&Number(definition.h)>0){
   const sx=Number(definition.w)/181.6,sy=Number(definition.h)/321.8;
   const buttons=[['stop',45.1,122.4,16.9,15.8,'Durdur'],['run',65.8,122.4,16.9,15.8,'Çalıştır'],['params',86.5,122.4,16.9,15.8,'Parametreler'],['display',107.2,122.4,16.9,15.8,'Ekran değiştir / hata onayı'],['up',128.8,87.3,16.4,15.8,'Frekansı artır'],['down',128.8,112.3,16.4,15.8,'Frekansı azalt']];
   return '<g class="v20-photo-controls" fill="transparent" stroke="none">'+buttons.map(([key,x,y,w,h,label])=>'<rect data-v20-action="'+key+'" role="button" tabindex="0" aria-label="V20 '+label+'" x="'+(x*sx)+'" y="'+(y*sy)+'" width="'+(w*sx)+'" height="'+(h*sy)+'" rx="2" pointer-events="all"/>').join('')+'</g>';
  }
  const s=c._v20||{},v=V.peek(c),read=readouts(c),at=[0,1,3,2,5][v.display||0],r=read[at],x=45,y=108,w=170,h=78;
  const state=s.fault||s.status||'ENERJİ YOK',color=s.fault?'#ff4747':s.powered?'#9eff61':'#506044';
  let result='<g class="v20-bop" font-family="Arial,sans-serif" stroke="none"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="'+(s.powered?'#bacb86':'#6c7959')+'" stroke="#475339"/>';
  result+='<text x="'+(x+w-5)+'" y="'+(y+h*.48)+'" text-anchor="end" fill="#1c2918" font-family="monospace" font-size="'+(material?19:30)+'">'+esc(s.fault||number(r[2]))+'</text><text x="'+(x+4)+'" y="'+(y+h*.73)+'" fill="#1c2918" font-size="'+(material?6:10)+'">'+esc(s.fault?V.faults[s.fault]:r[0]+' · '+r[3])+'</text><text x="'+(x+4)+'" y="'+(y+h-3)+'" fill="#1c2918" font-size="'+(material?5.5:9)+'">'+esc(state)+'</text>';
  result+='<circle class="v20-status-led '+(s.fault?'v20-fault-led':'')+'" cx="'+(material?191:225)+'" cy="'+(material?70:110)+'" r="3" fill="'+color+'"'+(s.powered?' style="filter:drop-shadow(0 0 3px '+color+')"':'')+'/>';
  const buttons=material?[['stop','O',80,120,15,16,'#f57872'],['run','I',107,120,15,16,'#72dea2'],['params','M',133,120,15,16,'#e1e7dd'],['display','OK',157,120,17,16,'#e1e7dd'],['up','▲',184,80,17,16,'#e1e7dd'],['reverse','↔',184,98,17,12,'#e1e7dd'],['down','▼',184,114,17,16,'#e1e7dd']]:[['stop','O',46,208,30,27,'#f57872'],['run','I',80,208,30,27,'#72dea2'],['params','M',114,208,30,27,'#e1e7dd'],['display','OK',148,208,30,27,'#e1e7dd'],['up','▲',185,186,26,24,'#e1e7dd'],['down','▼',185,212,26,24,'#e1e7dd'],['reverse','↔',114,245,30,24,'#e1e7dd']];
  for(const [key,text,x,y,w,h,fill] of buttons)result+='<g class="v20-key" data-v20-action="'+key+'" role="button" tabindex="0" aria-label="V20 '+({stop:'Durdur',run:'Çalıştır',params:'Parametreler',display:'Ekran değiştir / hata onayı',up:'Frekansı artır',down:'Frekansı azalt',reverse:'Yön değiştir'}[key])+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="2" fill="'+fill+'" stroke="#24332c"/><text x="'+(x+w/2)+'" y="'+(y+h*.74)+'" text-anchor="middle" fill="#11231c" font-size="'+(material?11:16)+'">'+text+'</text></g>';
  result+= '</g>';
  return result;
 }
 let owner=null,modal=null,previous=null,tab='monitor',group='Hız',search='';
 const editor=()=>root.DTSEditor;
 function command(c,key){
  if(key==='params'){show(c);return;}
  if(editor()?.snapshot(!['macro','factory'].includes(key))===false)return;const result=V.action(c,key==='display'&&c._v20?.fault?'reset':key);
  if(!result.ok)editor()?.toast(result.error);else{editor()?.render(true);editor()?.scheduleSave();}sync();
 }
 function status(c){const s=c._v20||{};return '<span class="v20-status '+(s.fault?'fault':s.running?'running':'')+'">'+esc(s.fault?s.fault+' · '+V.faults[s.fault]:s.status||'ENERJİ YOK')+'</span><span>'+(s.hz? s.hz<0?'↶ GERİ':'↷ İLERİ':'DURUŞ')+'</span>';}
 function live(c){const s=c._v20||{};return '<div class="v20-live-heading">'+status(c)+'</div><div class="v20-big-frequency">'+format(s.hz)+' <small>Hz</small></div><div class="v20-readouts">'+readouts(c).slice(1).map(([k,n,v,u])=>'<div><small>'+k+' · '+esc(n)+'</small><b>'+format(v)+' <span>'+u+'</span></b></div>').join('')+'</div><div class="v20-io">'+[1,2,3,4].map((n,i)=>'<span class="'+(s.di?.[i]?'on':'')+'">DI'+n+'</span>').join('')+'<span class="'+(s.do1?'on':'')+'">DO1</span><span class="'+(s.do2?'on':'')+'">DO2</span></div>'+(s.warning?'<p class="v20-inline-warning">'+esc(s.warning==='MOTOR YOK'?'Motor bağlantısı yok; akım 0 A.':s.warning+' · Sıcaklık / yük yüksek')+'</p>':'');}
 function setError(message){const node=modal?.querySelector('#v20Error');if(node){node.textContent=message||'';node.hidden=!message;}}
 function parameterRows(){
  const p=V.config(owner).params,query=search.toLocaleLowerCase('tr-TR');
  const level=d=>['PID','Ölçekler'].includes(d.group)?3:['Analog G/Ç','Dijital G/Ç','Sabit hızlar'].includes(d.group)?2:1;
  const list=V.parameters.filter(d=>level(d)<=p.P0003&&(!group||d.group===group)&&(!query||(d.key+' '+keyName(d.key)+' '+d.name).toLocaleLowerCase('tr-TR').includes(query)));
  return list.map(d=>'<label class="v20-param-row"><span><b>'+keyName(d.key)+'</b> '+esc(d.name)+'<small>'+(d.live?'Çalışırken ayarlanabilir':'Duruşta ayarlanır')+'</small></span>'+(d.choices?'<select data-v20-param="'+d.key+'">'+Object.entries(d.choices).map(([k,n])=>'<option value="'+k+'"'+(Number(k)===p[d.key]?' selected':'')+'>'+k+' · '+esc(n)+'</option>').join('')+'</select>':'<span class="v20-number"><input data-v20-param="'+d.key+'" type="number" min="'+d.min+'" max="'+d.max+'" step="any" value="'+p[d.key]+'"><small>'+esc(d.unit)+'</small></span>')+'</label>').join('')||'<p>Bu aralıkta parametre yok. Analog/dijital G/Ç için genişletilmiş, PID için uzman erişimini açabilirsiniz.</p><button data-v20-level>Uzman erişimini aç · P0003 = 3</button>';
 }
 const physicalRows=[['Giriş güç','PE · L1 · L2/N'],['Üst kontrol sırası','13 · 13 · 14 · 14 · 12 · 15 · 16'],['Alt kontrol sırası','1 · 2 · 3 · 4 · 5 · 6 · 7 · 8 · 9 · 10 · 11'],['Sağ röle bloğu','17 · 18 · 19'],['Çıkış / DC','U · V · W · DC− · DC+ · PE']];
 const terminals=[['L1 · L2/N','200–240 V AC tek faz besleme'],['U · V · W','Üç faz motor çıkışı · frekans ve yön sürücüden'],['PE · PE2','Koruma iletkeni'],['DC+ · DC−','Doğrultulmuş DC bara'],['1 · 10V','Potansiyometre referansı'],['2 · AI1','−10…+10 V veya 0/4–20 mA giriş'],['3 · AI2','0–10 V veya 0/4–20 mA giriş'],['4 · AO1','0/4–20 mA çıkış; 5 = ortak'],['5 · 0V','Analog / RS485 ortak'],['6 · P+ / 7 · N−','RS485 · USS / Modbus (haberleşme emüle edilmez)'],['8…11 · DI1…DI4','Programlanabilir dijital girişler'],['12 · DIC','PNP için 14 (0V), NPN için 13 (+24V)'],['13 / 13b · +24V','Dahili kontrol beslemesi · aynı terminal'],['14 / 14b · 0V','Dahili kontrol dönüşü · aynı terminal'],['15 · DO1+ / 16 · DO1−','İzole transistör çıkışı, harici DC besleme gerekir'],['17 NC · 18 NO · 19 C','DO2 kuru kontak röle çıkışı']];
 function content(){
  if(!owner)return;const v=V.config(owner),area=modal.querySelector('#v20Content');
  if(tab==='monitor')area.innerHTML='<div data-v20-live></div><div class="v20-command-bar">'+[['run','▶ Çalıştır'],['stop','■ Durdur'],['off2','OFF2'],['reverse','↔ Yön'],['reset','Hata onayı']].map(([a,n])=>'<button data-v20-command="'+a+'">'+n+'</button>').join('')+'</div><label class="v20-mop">Panel frekansı · P1040 <input data-v20-param="P1040" type="number" min="-550" max="550" step="0.1" value="'+v.params.P1040+'"> Hz</label><button data-v20-jog>Basılı tut: JOG</button><p class="property-help">P0700 = 1: panel. P0700 = 2: kablolu girişler. Yön değişiminde önce yavaşlar, ardından ters yönde hızlanır.</p><details><summary>Eğitim için motor yükü ve ortam</summary><label>Motor yükü (%) <input data-v20-environment="load" type="number" min="0" max="250" value="'+v.load+'"></label><label>Sürücü sıcaklığı (°C) <input data-v20-environment="temperature" type="number" min="-10" max="120" value="'+v.temperature+'"></label><p class="property-help">Akım ve devir eğitim için tahmin edilir. Yük artışında aşırı yük, sıcaklık artışında F4 arızasını inceleyin.</p></details>';
  if(tab==='parameters')area.innerHTML='<label>Bağlantı makrosu<select id="v20Macro"><option value="">Makro seç…</option>'+V.macros.map(([k,n])=>'<option value="'+k+'"'+(k===v.macro?' selected':'')+'>'+k+' · '+n+'</option>').join('')+'</select></label><div class="v20-param-filter"><input id="v20Search" placeholder="Parametre no veya ad ara…" value="'+esc(search)+'"><select id="v20Group"><option value="">Tüm gruplar</option>'+[...new Set(V.parameters.map(d=>d.group))].map(g=>'<option'+(g===group?' selected':'')+'>'+g+'</option>').join('')+'</select></div><div id="v20ParameterRows">'+parameterRows()+'</div><div class="v20-command-bar"><button data-v20-command="finish">P3900 = 3 · Devreye almayı bitir</button><button data-v20-command="factory">P0970 = 1 · Fabrika ayarları</button></div>';
  if(tab==='connections')area.innerHTML='<h3>6SL3210-5BB21-5UV1 · 1,5 kW</h3><p><b>Gerçek ön gövde:</b> 90,8 × 160,9 mm · terminal merkezleri exact Siemens DXF ile bağlıdır.</p><table><thead><tr><th>Fiziksel bölge</th><th>Soldan sağa terminal sırası</th></tr></thead><tbody>'+physicalRows.map(([a,b])=>'<tr><td>'+esc(a)+'</td><td>'+esc(b)+'</td></tr>').join('')+'</tbody></table><p>Cn002 için: 12 → 14, 13 → çalıştır anahtarı → 8; 13 → yön anahtarı → 9. Potun dış uçları 1 ve 5; orta ucu 2 (AI1). NPN için 12 → 13; anahtarlar girişleri 14’e çeker.</p><table><thead><tr><th>Terminal</th><th>İşlev</th></tr></thead><tbody>'+terminals.map(([a,b])=>'<tr><td>'+esc(a)+'</td><td>'+esc(b)+'</td></tr>').join('')+'</tbody></table><p>4–20 mA giriş için P0756 = 3, x1 = 4, x2 = 20. AO1’i mA kademesinde seri ölçün. 4 ile 5 arasına 500 Ω bağlarsanız direnç üzerinde 0–10 V oluşur.</p><p class="property-help">Bu model BOP, kablolu kumanda, Cn001–Cn009, V/f, rampalar, PID ve G/Ç alıştırmaları içindir. Siemens firmware’i, USS/Modbus, tüm BICO bağlantıları ve ayrıntılı PWM/motor fiziği emüle edilmez. Gerçek cihazın devreye alınmasında üretici kılavuzu esas alınır.</p>';
  modal.querySelectorAll('[data-v20-tab]').forEach(b=>{b.classList.toggle('selected',b.dataset.v20Tab===tab);b.setAttribute('aria-selected',String(b.dataset.v20Tab===tab));});sync();
 }
 function hide(){if(modal){if(owner?.v20?.jog){V.action(owner,'jog-release');editor()?.render(true);editor()?.scheduleSave();}modal.hidden=true;owner=null;previous?.focus?.();}}
 function show(c){
  owner=c;V.config(c);previous=root.document.activeElement;
  if(!modal){
   modal=root.document.createElement('div');modal.className='v20-modal';modal.id='v20Modal';modal.hidden=true;
   modal.innerHTML='<section role="dialog" aria-modal="true" aria-labelledby="v20Title" class="v20-dialog"><header><div><small>SIEMENS · SINAMICS</small><h2 id="v20Title">V20 · Parametreler ve çalışma</h2></div><button id="v20Close" aria-label="Pencereyi kapat">×</button></header><nav role="tablist"><button role="tab" data-v20-tab="monitor">Çalışma ekranı</button><button role="tab" data-v20-tab="parameters">Parametreler</button><button role="tab" data-v20-tab="connections">Bağlantı rehberi</button></nav><div id="v20Error" role="alert" hidden></div><main id="v20Content"></main><footer>Ayarlar projeyle birlikte kaydedilir. <span id="v20Owner"></span></footer></section>';
   root.document.body.appendChild(modal);
   modal.addEventListener('click',e=>{const level=e.target.closest('[data-v20-level]');if(level){if(!editor().snapshot())return;V.set(owner,'P0003',3);editor().scheduleSave();content();return;}const close=e.target.closest('#v20Close'),t=e.target.closest('[data-v20-tab]'),cmd=e.target.closest('[data-v20-command]');if(close||e.target===modal)hide();else if(t){tab=t.dataset.v20Tab;content();}else if(cmd){const key=cmd.dataset.v20Command;if(!editor().snapshot())return;const result=V.action(owner,key);setError(result.error);if(result.ok){editor().render(true);editor().scheduleSave();if(['factory','finish'].includes(key))content();sync();}}});
   modal.addEventListener('change',e=>{
    if(!owner)return;const key=e.target.dataset.v20Param,env=e.target.dataset.v20Environment;
    if(!key&&!env&&e.target.id!=='v20Macro'&&e.target.id!=='v20Group')return;
    if(e.target.id==='v20Group'){group=e.target.value;modal.querySelector('#v20ParameterRows').innerHTML=parameterRows();return;}
    if(!editor().snapshot())return;let result;
    if(key)result=V.set(owner,key,e.target.value);
    else if(env){const n=Number(e.target.value),min=env==='load'?0:-10,max=env==='load'?250:120;result=Number.isFinite(n)&&n>=min&&n<=max?{ok:true}:{ok:false,error:'Eğitim değeri izin verilen aralıkta değil.'};if(result.ok)V.config(owner)[env]=n;}
    else result=V.applyMacro(owner,e.target.value);
    setError(result.error);if(result.ok){editor().render(true);editor().scheduleSave();if(e.target.id==='v20Macro'||key?.startsWith('P0756')||key==='P0003')content();sync();}else if(key)e.target.value=V.config(owner).params[key];
   });
   modal.addEventListener('input',e=>{if(e.target.id==='v20Search'){search=e.target.value;if(search)group='';modal.querySelector('#v20Group').value=group;modal.querySelector('#v20ParameterRows').innerHTML=parameterRows();}});
   modal.addEventListener('pointerdown',e=>{if(!e.target.closest('[data-v20-jog]'))return;e.preventDefault();const jogOwner=owner;command(jogOwner,'jog');const release=()=>{command(jogOwner,'jog-release');root.removeEventListener('pointerup',release);root.removeEventListener('pointercancel',release);root.removeEventListener('blur',release);};root.addEventListener('pointerup',release);root.addEventListener('pointercancel',release);root.addEventListener('blur',release);});
   modal.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();hide();return;}if(e.key==='Tab'){const nodes=[...modal.querySelectorAll('button,input,select')].filter(n=>!n.disabled),first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&root.document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&root.document.activeElement===last){e.preventDefault();first?.focus();}}});
  }
  modal.hidden=false;modal.querySelector('#v20Owner').textContent=c.ref||'V20';setError('');content();modal.querySelector('#v20Close').focus();
 }
 function sync(){
  if(owner&&modal&&!modal.hidden){if(!editor().getProject().components.includes(owner)){hide();return;}modal.querySelectorAll('[data-v20-live]').forEach(n=>n.innerHTML=live(owner));}
  const sidebar=root.document?.querySelector('#v20SidebarStatus'),device=sidebar&&editor()?.getProject().components.find(c=>c.id===sidebar.getAttribute('data-owner'));
  if(sidebar&&device)sidebar.innerHTML=status(device)+'<b>'+format(device._v20?.hz)+' Hz</b>';
 }
 const api={markup,readouts,show,hide,sync,command};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSV20UI=api;
})(typeof window==='undefined'?globalThis:window);
