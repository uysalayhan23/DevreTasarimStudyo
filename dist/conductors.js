(function(root){
  'use strict';
  const Leads=typeof module==='object'&&module.exports?require('./probe-leads.js'):root.DTSProbeLeads;
  const defaults={'#e53935':'L1','#f97316':'L2','#f4c430':'L3','#1e88e5':'N','#16a34a':'PE','#8b5a2b':'+24V','#111827':'0V','#8b5cf6':'SIGNAL','#808080':'CONTROL','#b57b40':'DC+'};
  const colorNames={'#e53935':'Kırmızı','#f97316':'Turuncu','#f4c430':'Sarı','#1e88e5':'Mavi','#16a34a':'Yeşil','#8b5a2b':'Kahverengi','#111827':'Siyah','#8b5cf6':'Mor','#808080':'Gri','#b57b40':'Bakır','#ffffff':'Beyaz','#f472b6':'Pembe','#22d3ee':'Açık mavi','#0d9488':'Turkuaz','#1e3a8a':'Lacivert','#65a30d':'Zeytin','#fbbf24':'Kehribar','#7f1d1d':'Bordo','#c0c0c0':'Gümüş','#d6b48c':'Bej'};
  for(const c of Object.keys(colorNames))if(!defaults[c])defaults[c]='SPARE';
  const voltageOptions=['Otomatik','0 V','5 V DC','10 V DC','12 V DC','24 V DC','48 V DC','110 V DC','110 V AC','220 V AC','230 V AC','380 V AC','400 V AC','0–10 V DC','mV sinyal','4–20 mA'];
  const freePins=d=>d?.id==='load-cell'?['EX+','EX−','SIG+','SIG−']:d?.instrument==='tx11'?['EX+','EX−','S+','S−']:[];
  const sizes=['0,75 mm²','1,5 mm²','2,5 mm²','4 mm²','6 mm²','10 mm²','16 mm²'];
  const key=r=>r?.j?JSON.stringify(['j',r.j]):r?.c&&r?.p?JSON.stringify(['p',r.c,r.p]):'';
  const normalizeColor=c=>/^#[0-9a-f]{6}$/i.test(c||'')?c.toLowerCase():'#808080';
  function sizeNumber(s){const n=parseFloat(String(s||'').replace(',','.'));return Number.isFinite(n)&&n>0?Math.max(.25,Math.min(240,n)):1.5}
  const sizeLabel=s=>String(sizeNumber(s)).replace('.',',')+' mm²';
  const width=s=>2.5*Math.sqrt(sizeNumber(s)/1.5);
  // Fixed DC supply colors are determined by an electrical power TERMINAL,
  // never from generic signal +/- names or AC L/N/PE wire roles.
  const DC_POSITIVE='#e53935',DC_NEGATIVE='#111827';
  function powerTerminalPolarity(d,p){
    if(!d||!p||d.diagramOnly||d.visualOnly||p.mechanical)return null;
    const id=String(p.id||'').toUpperCase().replace(/\\s+/g,'').replace(/[−–]/g,'-');
    const kind=String(d.kind||'');
    const supply=kind.startsWith('supply-dc')||kind==='power24'||d.arduinoRole==='bench-supply'||d.excitationSource===true;
    if(supply&&id==='P')return 'positive';
    if(supply&&id==='M')return 'negative';
    if((kind==='battery'||kind==='rectifier')&&id==='+')return 'positive';
    if((kind==='battery'||kind==='rectifier')&&id==='-')return 'negative';
    if((d.id==='load-cell'||d.instrument==='tx11')&&id==='EX+')return 'positive';
    if((d.id==='load-cell'||d.instrument==='tx11')&&id==='EX-')return 'negative';
    if(['sensor','detector'].includes(kind)&&id==='BN')return 'positive';
    if(['sensor','detector'].includes(kind)&&id==='BU')return 'negative';
    if(/^(?:GND[0-9]*|AGND|DGND|PGND|SGND|0V|VSS[0-9]*|V-|DC-|PWR-|SUPPLY-)$/.test(id))return 'negative';
    if(/^(?:V\\+|VCC[0-9]*|VDD[0-9]*|VS\\+|VIN\\+?|VBAT\\+?|DC\\+|PWR\\+|SUPPLY\\+|\\+?(?:3V3|5V|12V|24V|48V))$/.test(id))return 'positive';
    return null;
  }
  function netPowerColor(project,byId,members=[]){
    const polarity=new Set();
    for(const {c,p} of members){const v=powerTerminalPolarity(byId[c?.typeId],p);if(v)polarity.add(v)}
    return polarity.size>1?'CONFLICT':polarity.has('positive')?DC_POSITIVE:polarity.has('negative')?DC_NEGATIVE:null;
  }
  function endpointPowerColor(project,byId,...refs){
    const members=[];
    for(const ref of refs){if(!ref?.c||!ref?.p)continue;
      const c=project.components.find(c=>c.id===ref.c),d=c&&byId[c.typeId],p=d?.pins?.find(p=>p.id===ref.p);
      if(c&&p)members.push({c,p});
    }
    return netPowerColor(project,byId,members);
  }
  function permanentPairs(d,c){
    if(!d||d.diagramOnly||d.isPLC||d.visualOnly)return [];
    if(d.terminalCount)return Array.from({length:d.terminalCount},(_,i)=>[String(2*i+1),String(2*i+2)]);
    if(d.id==='abb-acs800-r5')return [['PE','PE2'],['X20:2','X21:2'],['X22:7','X22:8'],...(c?.acs800?.j1!==false?[['X22:9','X22:10']]:[]),...(c?.acs800?.diilBridge!==false?[['X22:8','X22:11']]:[])];
    if(d.id==='sinamics-v20-1p')return [['13','13b'],['14','14b'],['14','5'],['PE','PE2']];
    const ids=d.pins.map(p=>p.id);
    if(['terminal','fuse','meter-a'].includes(d.kind))return ids.length>1?[[ids[0],ids[1]]]:[];
    if(['distribution-block','splice'].includes(d.kind))return ids.slice(1).map(id=>[ids[0],id]);
    if(d.kind==='current-transformer')return [['P1','P2']];
    // Switching contacts, windings, loads and semiconductor outputs separate
    // design nets. Never merge all possible contact states: a reversing starter
    // intentionally feeds U/W through different, mutually exclusive contactors.
    return [];
  }
  function sourceLines(c,d){
    if(!d||d.diagramOnly||d.isPLC||d.visualOnly)return [];
    const line=(p,role,domain)=>({ref:{c:c.id,p},role,domain});
    if(d.id==='abb-acs800-r5')return [line('X22:7','+24V','acsdi:'+c.id),line('X22:10','0V','acsdi:'+c.id),...['U2','V2','W2'].map((p,i)=>line(p,'L'+(i+1),'out:'+c.id))];
    if(d.id==='sinamics-v20-1p')return [line('13','+24V','control:'+c.id),line('14','0V','control:'+c.id),...['U','V','W'].map((p,i)=>line(p,'L'+(i+1),'out:'+c.id))];
    if(['supply','supply3'].includes(d.kind))return d.pins.map(p=>line(p.id,p.id==='L'?'L1':p.id,'mains'));
    if(String(d.kind||'').startsWith('supply-dc'))return [line('P',d.excitationSource?'DC+':'+24V','dc:'+c.id),line('M','0V','dc:'+c.id)];
    if(d.kind==='power24')return [line('P','+24V','out:'+c.id),line('M','0V','out:'+c.id)];
    if(['transformer','autotransformer'].includes(d.kind))return [line('3','L1','out:'+c.id),line('4','N','out:'+c.id)];
    if(d.kind==='rectifier')return [line('+','+24V','out:'+c.id),line('−','0V','out:'+c.id)];
    if(['transformer-3p','softstarter','vfd'].includes(d.kind))return (d.kind==='transformer-3p'?['T1','T2','T3']:d.kind==='vfd'?['U','V','W']:['T1','T2','T3']).map((p,i)=>line(p,'L'+(i+1),'out:'+c.id));
    return [];
  }
  function analyze(project,byId,options={}){
    for(const c of project.components||[]){const d=byId?.[c.typeId];if(d&&(!Array.isArray(d.pins)||d.pins.some(p=>!p||typeof p.id!=='string')))return {invalidCatalog:true,nets:new Map(),at:()=>({members:[],anchors:[],wires:[],roles:new Set(),domains:new Set(),conflict:true})};}
    const parents=new Map(),nets=new Map(),sources=[];
    const find=k=>{if(!parents.has(k))parents.set(k,k);let r=k;while(parents.get(r)!==r)r=parents.get(r);while(parents.get(k)!==k){const next=parents.get(k);parents.set(k,r);k=next}return r};
    const join=(a,b)=>{if(a&&b)parents.set(find(a),find(b))};
    for(const c of project.components){const d=byId[c.typeId];for(const p of d?.pins||[])find(key({c:c.id,p:p.id}));for(const [a,b] of permanentPairs(d,c))join(key({c:c.id,p:a}),key({c:c.id,p:b}));sources.push(...sourceLines(c,d));}
    for(const j of project.junctions||[])find(key({j:j.id}));
    const wires=project.wires.filter(w=>w.id!==options.ignoreWireId&&!w.mechanical&&w.role!=='MECHANICAL'&&!Leads.info(project,byId,w,options.componentIndex));
    for(const w of wires)join(key(w.from),key(w.to));
    function net(r){const id=find(key(r));if(!nets.has(id))nets.set(id,{id,wires:[],members:[],anchors:[],roles:new Set(),domains:new Set(),color:null,freeColor:false});return nets.get(id)}
    for(const s of sources){const n=net(s.ref);n.anchors.push(s);n.roles.add(s.role);n.domains.add(s.domain)}
    for(const c of project.components){const d=byId[c.typeId];for(const p of freePins(d))net({c:c.id,p}).freeColor=true;
      if(['sensor','detector'].includes(d?.kind))for(const p of (d.pins||[]).filter(p=>['BK','WH'].includes(p.id))){const role=(c.sensorOutput||d.outputType||'PNP')==='NPN'?'0V':'+24V',supply=net({c:c.id,p:role==='0V'?'BU':'BN'}),n=net({c:c.id,p:p.id}),a={ref:{c:c.id,p:p.id},role,designOnly:true};n.anchors.push(a);n.roles.add(role);for(const domain of supply.domains)n.domains.add(domain)}
    }
    for(const w of wires){const n=net(w.from);n.wires.push(w);if(!n.freeColor&&!n.anchors.length&&w.role&&w.role!=='FREE')n.roles.add(w.role);if(!n.color)n.color=normalizeColor(w.color)}
    for(const c of project.components)for(const p of byId[c.typeId]?.pins||[])net({c:c.id,p:p.id}).members.push({c,p});
    const at=r=>{
      const n=net(r);return {...n,role:n.roles.size===1?[...n.roles][0]:null,conflict:n.roles.size>1||n.domains.size>1};
    };
    return {at,nets};
  }
  function check(project,byId,from,to,ignoreWireId){
    // A visual snap is not an electrical connection until both endpoint IDs
    // resolve to real catalog terminals or existing junctions.
    // A visual snap is not a unique physical socket when IDs collide.
    const uniqueEndpoint=r=>{
      if(r?.j!=null)return (project.junctions||[]).filter(j=>j?.id===r.j).length===1;
      if(r?.c!=null){
        const matches=(project.components||[]).filter(c=>c?.id===r.c);
        if(matches.length!==1)return false;
        const pins=byId?.[matches[0].typeId]?.pins;
        return Array.isArray(pins)&&pins.filter(p=>p?.id===r.p).length===1;
      }
      return false;
    };
    if(!uniqueEndpoint(from)||!uniqueEndpoint(to))return {ok:false,reason:'Kablo uç kimliği tekil değil veya katalog terminali doğrulanamadı.'};
    // Damaged catalog pin arrays must never enter the electrical net analyzer.
    if(project.components.some(c=>Array.isArray(byId[c.typeId]?.pins)&&byId[c.typeId].pins.some(p=>!p||typeof p.id!=='string')))
      return {ok:false,reason:'Katalog terminal listesi eksik veya bozuk.'};
    const endpointValid=r=>!!r&&typeof r==='object'&&(
      (typeof r.j==='string'&&!!r.j&&!r.c&&!r.p&&(project.junctions||[]).some(j=>j.id===r.j))||
      (typeof r.c==='string'&&!!r.c&&typeof r.p==='string'&&!!r.p&&!r.j&&
       project.components.some(c=>c.id===r.c&&(Array.isArray(byId[c.typeId]?.pins)&&byId[c.typeId].pins.some(p=>p?.id===r.p))))
    );
    if(!endpointValid(from)||!endpointValid(to))return {ok:false,reason:'Kablo ucu geçerli bir malzeme terminaline veya ek noktasına bağlı değil.'};
    if(key(from)===key(to))return {ok:false,reason:'Kablonun iki ucu aynı terminale bağlanamaz.'};
    const socketCheck=Leads.check(project,byId,from,to,ignoreWireId);if(!socketCheck.ok)return socketCheck;
    const lead=Leads.info(project,byId,{from,to});if(lead)return {ok:true,...lead,probeLead:true};
    const graph=analyze(project,byId,{ignoreWireId});if(graph.invalidCatalog)return {ok:false,reason:'Katalog terminal listesi bozuk.'};const a=graph.at(from),b=graph.at(to);
    const provisional=n=>!n.anchors.length&&n.wires.every(w=>!w.roleBound);
    if(a.anchors.length&&provisional(b)){b.roles=new Set();b.conflict=false}
    if(b.anchors.length&&provisional(a)){a.roles=new Set();a.conflict=false}
    const members=[...a.members,...b.members],supplyRoles=new Set([...a.roles,...b.roles]);
    if(members.some(({c,p})=>{const d=byId[c.typeId];return (['sensor','detector'].includes(d.kind)&&['BN','BU'].includes(p.id))||(d.id==='sensor-level-analog'&&['+','−'].includes(p.id))||(d.id==='sensor-linear-position'&&['1','3'].includes(p.id))})&&[...supplyRoles].some(r=>!['+24V','0V','CONTROL','SIGNAL'].includes(r)))return {ok:false,reason:'Bu sensörün beslemesi yalnızca 24 VDC olabilir.'};
    const roles=new Set([...a.roles,...b.roles]),domains=new Set([...a.domains,...b.domains]);
    if(a.conflict||b.conflict||roles.size>1)return {ok:false,reason:'Farklı hatlar doğrudan bağlanamaz: '+[...roles].join(' / ')};
    if(domains.size>1)return {ok:false,reason:'Ayrı besleme kaynaklarının çıkışları doğrudan birleştirilemez.'};
    return {ok:true,role:[...roles][0]||null,a,b,freeColor:a.freeColor||b.freeColor};
  }
  function state(project){
    project.colorRoles={...defaults,...project.colorRoles};project.colorLocks={...(project.colorLocks||{})};
    project.colorPreferences={...(project.colorPreferences||{})};project.colorVoltages={...(project.colorVoltages||{})};
    project.lineColors={...(project.lineColors||{})};project.colorSizes={...(project.colorSizes||{})};
    for(const [color,role] of Object.entries(project.colorLocks))project.colorRoles[color]=role;
  }
  function releaseUnused(project,byId,componentIndex=null){
    const wires=project.wires.filter(w=>!w.mechanical&&w.role!=='MECHANICAL'&&!w.freeColor&&w.role!=='FREE'&&!Leads.info(project,byId,w,componentIndex)),used=new Set(wires.map(w=>normalizeColor(w.color)));
    for(const color of Object.keys(project.colorLocks))if(!used.has(color))delete project.colorLocks[color];
    for(const [role,color] of Object.entries(project.lineColors))if(!wires.some(w=>w.role===role&&normalizeColor(w.color)===color))delete project.lineColors[role];
  }
  function chooseColor(project,role,preferred){
    const lock=project.colorLocks||{},canonical=project.colorPreferences?.[role]||project.lineColors?.[role];
    if(canonical&&(!lock[canonical]||lock[canonical]===role))return canonical;
    const wanted=Object.entries(defaults).find(([,r])=>r===role)?.[0];
    const candidates=[project.colorRoles?.[preferred]===role?preferred:null,wanted,...Object.keys({...defaults,...project.colorRoles}),'#64748b','#db2777','#0d9488','#a16207'];
    for(const raw of candidates){if(!raw)continue;const c=normalizeColor(raw);if(!lock[c]||lock[c]===role)return c;}
    for(let n=1;n<255;n++){const c='#'+(0x303030+n*521).toString(16).padStart(6,'0');if(!lock[c]||lock[c]===role)return c;}
    throw Error('Hat için kullanılabilir renk bulunamadı.');
  }
  function bind(project,role,color){
    if(role==='MEASURE'||role==='FREE')return {ok:true,role,color};
    state(project);color=normalizeColor(color);
    if(project.colorLocks[color]&&project.colorLocks[color]!==role)return {ok:false,reason:'Bu renk '+project.colorLocks[color]+' hattına kilitli.'};
    project.colorLocks[color]=role;project.colorRoles[color]=role;project.lineColors[role]=color;return {ok:true,color,role};
  }
  function plan(project,byId,from,to,preferred,size,ignoreWireId){
    const result=check(project,byId,from,to,ignoreWireId);if(!result.ok)return result;
    if(result.probeLead)return {...result,size:'6 mm²'};
    const fixed=netPowerColor(project,byId,[...result.a.members,...result.b.members]);
    if(fixed==='CONFLICT')return {ok:false,reason:'DC+ ile DC−/GND besleme uçları doğrudan birleştirilemez.'};
    if(fixed)return {...result,role:result.role|| (fixed===DC_POSITIVE?'+24V':'0V'),color:fixed,size:sizeLabel(project.colorSizes?.[fixed]||size)};
    if(result.freeColor)return {...result,role:'FREE',color:normalizeColor(preferred),size:sizeLabel(project.colorSizes?.[preferred]||size)};
    const role=result.role||project.colorLocks?.[preferred]||project.colorRoles?.[preferred]||'CONTROL';
    const color=chooseColor(project,role,result.b.color||result.a.color||preferred);
    return {...result,role,color,size:sizeLabel(project.colorSizes?.[color]||size)};
  }
  function synchronize(project,byId,{legacy=false}={}){
    const componentIndex=new Map();for(const c of project.components)if(!componentIndex.has(c.id))componentIndex.set(c.id,c);
    Leads.prepare(project,byId,componentIndex);state(project);releaseUnused(project,byId,componentIndex);const graph=analyze(project,byId,{legacy,componentIndex}),warnings=[];if(graph.invalidCatalog){for(const w of project.wires||[])w._lineConflict=true;return [{reason:'Katalog terminal listesi bozuk.'}]}
    for(const c of project.components)c._terminalLines={};
    const ordered=[...graph.nets.values()].sort((a,b)=>b.anchors.length-a.anchors.length);
    for(const n of ordered){
      const fixed=netPowerColor(project,byId,n.members);
      if(n.roles.size>1||n.domains.size>1||fixed==='CONFLICT'){warnings.push(n);for(const w of n.wires)w._lineConflict=true;continue}
      if(!n.wires.length)continue;
      if(fixed){
        const role=[...n.roles][0]|| (fixed===DC_POSITIVE?'+24V':'0V');
        if(!project.colorSizes[fixed])project.colorSizes[fixed]=sizeLabel(n.wires.find(w=>w.size)?.size||1.5);
        const bound=!!n.anchors.length||n.wires.some(w=>w.roleBound);
        for(const w of n.wires){delete w.freeColor;w.roleBound=bound;w.color=fixed;w.role=role;w.size=project.colorSizes[fixed];w._lineConflict=false}
        for(const {c,p} of n.members)c._terminalLines[p.id]={role,color:fixed,size:project.colorSizes[fixed]};
        continue;
      }
      if(n.freeColor){for(const w of n.wires){w.color=normalizeColor(w.color);w.role='FREE';w.freeColor=true;w.roleBound=false;w.size=project.colorSizes[w.color]||sizeLabel(w.size);w._lineConflict=false}for(const {c,p} of n.members)c._terminalLines[p.id]={role:'FREE',freeColor:true,color:n.wires[0].color,size:n.wires[0].size};continue}
      for(const w of n.wires)delete w.freeColor;
      const role=[...n.roles][0]||project.colorRoles[n.color]||'CONTROL',color=chooseColor(project,role,n.color);
      bind(project,role,color);
      if(!project.colorSizes[color])project.colorSizes[color]=sizeLabel(n.wires.find(w=>w.size)?.size||1.5);
      const bound=!!n.anchors.length||n.wires.some(w=>w.roleBound);
      for(const w of n.wires){w.roleBound=bound;w.color=color;w.role=role;w.size=project.colorSizes[color];w._lineConflict=false;}
      // Derived terminal identity is rebuilt from surviving wires every time.
      // Never write the inherited name into a component's physical pin record.
      for(const {c,p} of n.members)c._terminalLines[p.id]={role,color,size:project.colorSizes[color]};
    }
    releaseUnused(project,byId,componentIndex);project.conductorVersion=1;return warnings;
  }
  function initialize(project,byId){
    const legacy=project.conductorVersion!==1;state(project);
    if(legacy){project.colorLocks={};project.lineColors={};}
    return synchronize(project,byId,{legacy});
  }
  function recolor(project,byId,wireId,color,size){
    const w=project.wires.find(w=>w.id===wireId);if(!w)return {ok:false,reason:'Kablo bulunamadı.'};
    const lead=Leads.info(project,byId,w);if(lead){w.probeSize=sizeLabel(size||w.probeSize||6);Leads.prepare(project,byId);return {ok:true,role:lead.role,color:lead.color}}
    const graph=analyze(project,byId);if(graph.invalidCatalog)return {ok:false,reason:'Katalog terminal listesi bozuk.'};
    const net=graph.at(w.from);
    const fixed=netPowerColor(project,byId,net.members);
    if(fixed==='CONFLICT')return {ok:false,reason:'DC+ ve DC−/GND polariteleri aynı hatta bağlanmış.'};
    if(fixed){if(normalizeColor(color)!==fixed)return {ok:false,reason:'DC besleme ucu sabit kablo rengi: '+(fixed===DC_POSITIVE?'kırmızı':'siyah')+'.'};
      if(size)project.colorSizes[fixed]=sizeLabel(size);synchronize(project,byId);return {ok:true,role:net.role||(fixed===DC_POSITIVE?'+24V':'0V'),color:fixed};}
    if(net.freeColor){w.color=normalizeColor(color);if(size)setSize(project,w.color,size);synchronize(project,byId);return {ok:true,role:'FREE',color:w.color}}
    const role=net.role||w.role;
    color=normalizeColor(color);if(project.colorLocks?.[color]&&project.colorLocks[color]!==role)return {ok:false,reason:'Bu renk '+project.colorLocks[color]+' hattına kilitli; '+role+' olarak atanamaz.'};
    bind(project,role,color);project.colorPreferences[role]=color;if(size)project.colorSizes[color]=sizeLabel(size);for(const wire of project.wires)if(!wire.freeColor&&!Leads.info(project,byId,wire)&&wire.role===role)wire.color=color;synchronize(project,byId);return {ok:true,role,color};
  }
  function setSize(project,color,size){state(project);color=normalizeColor(color);project.colorSizes[color]=sizeLabel(size);for(const w of project.wires)if(!w.probeLead&&w.color===color)w.size=project.colorSizes[color];}
  function configureColor(project,byId,color,role){
    state(project);color=normalizeColor(color);const old=project.colorLocks[color]||project.colorRoles[color];
    if(old!==role){delete project.colorLocks[color];delete project.lineColors[old];if(project.colorPreferences[old]===color)delete project.colorPreferences[old];project.colorLocks[color]=role;
      const oldWires=project.wires.filter(w=>!w.freeColor&&!Leads.info(project,byId,w)&&w.role===old&&w.color===color);if(oldWires.length){const replacement=chooseColor(project,old,null);project.colorPreferences[old]=replacement;bind(project,old,replacement);for(const w of oldWires)w.color=replacement}}
    project.colorRoles[color]=role;project.colorPreferences[role]=color;delete project.colorLocks[color];for(const w of project.wires)if(!w.freeColor&&!Leads.info(project,byId,w)&&w.role===role)w.color=color;
    synchronize(project,byId);return {ok:true,role,color};
  }
  function setVoltage(project,color,value){if(!voltageOptions.includes(value))return false;state(project);project.colorVoltages[normalizeColor(color)]=value;return true}
  const voltageLabel=(project,color)=>project.colorVoltages?.[color]&&project.colorVoltages[color]!=='Otomatik'?project.colorVoltages[color]:'';
  const api={colorNames,voltageOptions,freePins,configureColor,setVoltage,voltageLabel,defaults,sizes,key,sizeNumber,sizeLabel,width,sourceLines,permanentPairs,powerTerminalPolarity,endpointPowerColor,netPowerColor,DC_POSITIVE,DC_NEGATIVE,analyze,check,plan,bind,initialize,synchronize,recolor,setSize,chooseColor};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.CCSConductors=api;
})(typeof window==='undefined'?globalThis:window);
