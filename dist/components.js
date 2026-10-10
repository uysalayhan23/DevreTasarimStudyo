(function(root){
  'use strict';
  const Sensors=typeof module==='object'&&module.exports?require('./sensors.js'):root.CCSSensors;
  const pairedKinds=new Set(['switch-both','contact-both']);
  const simpleKinds=new Set(['switch-no','switch-nc','contact-no','contact-nc','delay-on-no','delay-on-nc','delay-off-no','delay-off-nc']);
  const poleKinds=new Set(['breaker','breaker2','breaker3','rcd2','rcd4','fuse-switch','overload','thermal-magnetic','contactor3']);
  function contactGroups(d){
    if(!d||d.isPLC||d.visualOnly||d.diagramOnly)return [];
    const ids=d.pins.map(p=>p.id),k=d.kind;
    if(d.contacts)return d.contacts.map(g=>({...g}));
    const group=(id,a,b,normal,extra={})=>({id,a,b,normal,...extra});
    if(simpleKinds.has(k))return [group('main',ids[0],ids[1],k.endsWith('-nc')?'NC':'NO')];
    if(pairedKinds.has(k))return [group('main',ids[0],ids[1],'NO'),group('other',ids[0],ids[2],'NC',{inverseOf:'main'})];
    if(poleKinds.has(k)){
      const pairs=[['1','2'],['3','4'],['5','6'],['7','8']].filter(([a,b])=>ids.includes(a)&&ids.includes(b));
      if(!pairs.length&&ids.length===2)pairs.push([ids[0],ids[1]]);
      const groups=pairs.map(([a,b])=>group(a+'-'+b,a,b,k==='contactor3'?'NO':'NC'));
      if(ids.includes('95')&&ids.includes('96'))groups.push(group('aux','95','96','NC',{auxiliary:true}));
      return groups;
    }
    if(k==='selector3'||k==='selector4')return ids.slice(1).map((id,i)=>group('position-'+(i+1),ids[0],id,'NO',{position:i+1}));
    if(k==='sensor'||k==='detector')return [group('output',d.outputType==='NPN'?'BU':'BN','BK',d.defaultContactMode||'NO',{powered:true})];
    return [];
  }
  function contactMode(c,d,g){
    if(d.selectorSteps||d.rotaryIsolator||g.positions)return 'NO';
    if(d.kind==='phase-monitor'||d.kind==='nh-holder'||d.fuseSlots)return g.normal;
    if(g.inverseOf){const primary=contactGroups(d).find(x=>x.id===g.inverseOf);return contactMode(c,d,primary)==='NO'?'NC':'NO'}
    const mode=c.contactModes?.[g.id];return mode==='NO'||mode==='NC'?mode:g.normal;
  }
  function contactStates(c,d,actuated){
    return Object.fromEntries(contactGroups(d).map(g=>{
      const on=g.independent?!!(c.switchStates?.[g.id]??actuated):g.slot!==undefined?!!c.fuseOpen?.[g.slot]:g.positions?g.positions.includes(Number(c.position||0)):g.position!==undefined?Number(c.position||0)===g.position:!!actuated;
      return [g.id,g.nhSlot!==undefined?(!actuated&&!!c.nhFuses?.[g.nhSlot]):contactMode(c,d,g)==='NC'?!on:on];
    }));
  }
  function displayContactStates(c,d){
    if(c._contactStates&&Object.keys(c._contactStates).length)return c._contactStates;
    const coil=d.kind==='contactor3'||d.kind.startsWith('contact-')||d.kind.startsWith('delay-');
    return contactStates(c,d,coil?!!c._active:Sensors.actuated(c,d));
  }
  function contactSummary(c,d){
    const counts={NO:0,NC:0};for(const g of contactGroups(d).filter(g=>!g.fixed))counts[contactMode(c,d,g)]++;
    return ['NO','NC'].filter(mode=>counts[mode]).map(mode=>counts[mode]+mode).join(' + ');
  }
  function pinLabel(c,d,p){
    const groups=contactGroups(d),g=groups.find(g=>g.a===p.id||g.b===p.id);
    if(!g)return p.label;
    const mode=contactMode(c,d,g),isSecond=g.b===p.id;
    if(p.label==='NO'||p.label==='NC')return mode;
    if(groups.length===1&&['13','14','21','22'].includes(p.id))return (mode==='NO'?['13','14']:['21','22'])[isSecond?1:0];
    if(g.auxiliary)return (mode==='NO'?['97','98']:['95','96'])[isSecond?1:0];
    return p.label;
  }
  function setContactMode(project,c,mode,byId,groupId='all'){
    if(!['NO','NC'].includes(mode))return false;
    const d=byId[c.typeId];if(d.selectorSteps||d.rotaryIsolator||d.kind==='phase-monitor'||d.kind==='nh-holder'||d.fuseSlots||d.positions)return false;const groups=contactGroups(d).filter(g=>!g.inverseOf&&(groupId==='all'||g.id===groupId));
    if(!groups.length)return false;
    const changed=groups.some(g=>contactMode(c,d,g)!==mode);if(!changed)return false;
    c.contactModes={...(c.contactModes||{})};
    for(const g of groups)c.contactModes[g.id]=mode;
    c._closed=null;c._contactStates={};
    return changed;
  }
  function contactVariants(d,byId){
    if(!d||!['contact-no','contact-nc'].includes(d.kind))return [];
    return ['contact-no','contact-nc'].map(id=>byId[id]).filter(Boolean);
  }
  function deviceColor(c,d){
    return /^#[0-9a-f]{6}$/i.test(c.deviceColor||'')?c.deviceColor:(d.color||(/nc|estop/.test(d.id)?'#e5484d':'#20b26b'));
  }
  function hasColor(d){return ['lamp','led','flasher'].includes(d.kind)||d.id==='jog-4pin'||/^(push-|mushroom-|estop$|illuminated-push$)/.test(d.id)}
  function motorLinks(c,d){
    if(d.id==='motor-1p'){
      const mode=c.windingConnection||'forward';
      return mode==='external'?[]:mode==='reverse'?[['U','Z2'],['N','Z1']]:[['U','Z1'],['N','Z2']];
    }
    if(!['motor3','motor-yd'].includes(d.kind))return [];
    const upper=d.kind==='motor3'?['U','V','W']:['U1','V1','W1'];
    const mode=c.motorConnection||(d.kind==='motor3'?'star':'external');
    if(mode==='star')return [['U2','V2'],['V2','W2']];
    if(mode==='delta')return [[upper[0],'W2'],[upper[1],'U2'],[upper[2],'V2']];
    return [];
  }
  function changeContactType(project,c,typeId,byId){
    const before=byId[c.typeId],after=byId[typeId];
    if(!before||!after||!contactVariants(before,byId).some(d=>d.id===typeId)||before.id===after.id)return false;
    const pinMap=Object.fromEntries(before.pins.map((p,i)=>[p.id,after.pins[i].id]));
    for(const w of project.wires)for(const end of ['from','to']){
      const ref=w[end];if(ref?.c===c.id&&pinMap[ref.p])ref.p=pinMap[ref.p];
    }
    if(c.label===before.name)c.label=after.name;
    c.typeId=typeId;delete c.contactModes;c._closed=null;c._contactStates={};c._actuated=false;c._active=false;c._hot=[];
    return true;
  }
  const api={contactVariants,changeContactType,contactGroups,contactMode,contactStates,displayContactStates,contactSummary,pinLabel,setContactMode,deviceColor,hasColor,motorLinks};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.CCSComponents=api;
})(typeof window==='undefined'?globalThis:window);
