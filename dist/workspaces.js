(function(root){
  'use strict';
  const modes=[['control','Kumanda Devreleri Tasarımı'],['building','Tesisat ve Dağıtım Devreleri Tasarımı'],['panel','Pano Tasarımı'],['arduino','Arduino Atölyesi']];
  const normalize=value=>modes.some(([id])=>id===value)?value:'control';
  const buildingGroups=new Set(['installation','sockets','telephone','antenna','knx','energy-meters']);
  const buildingOnly=new Set(['power-receptacle','wall-light-outlet','blind-motor','surge-arrester','standard-light']);
  const sharedBuilding=new Set(['protection','sources','transformers','terminals','measurement','contactors','auxiliary','relays','timers','lamps','alarms','switches']);
  const arduinoSharedTools=new Set(['unit-ut33d-plus','test-probe-red','test-probe-black','encoder-incremental']);
  const arduinoBasic=d=>d.arduinoShared===true||arduinoSharedTools.has(d.id)||['resistor','potentiometer','capacitor','diode','rectifier','ground'].includes(d.kind)||['resistor','potentiometer','capacitor','diode','rectifier','ground'].includes(d.id);
  const physical=()=>typeof module==='object'&&module.exports?require('./physical-metadata.js'):root.DTSPhysicalMetadata;
  function includes(d,mode){
    mode=normalize(mode);const group=d.classification?.group||d.catalogGroup;
    if(mode==='panel')return physical()?.panelEligibility?.(d)?.eligible!==false;
    if(mode==='arduino')return !!(d.arduinoBoard||d.arduinoOnly||arduinoBasic(d));
    if(d.panelOnly||group==='panel-layout')return false;
    if(mode==='control'){if(d.arduinoOnly)return !!d.arduinoBoard;return !d.buildingOnly&&!buildingGroups.has(group)&&!buildingOnly.has(d.id)}
    if(d.isPLC||d.kind==='plc-io')return false;
    return !!d.buildingOnly||buildingGroups.has(group)||buildingOnly.has(d.id)||sharedBuilding.has(group)||['photoeye','photo-emitter-receiver','float','pressure'].includes(d.id);
  }
  const alphabet=(a,b)=>a.name.localeCompare(b.name,'tr',{sensitivity:'base',numeric:true});
  function favorites(storage){
    let ids;try{ids=new Set(JSON.parse(storage.getItem('dts-favorites')||'[]').filter(id=>typeof id==='string'))}catch{ids=new Set()}
    return {has:id=>ids.has(id),toggle(id){const next=new Set(ids);next.has(id)?next.delete(id):next.add(id);storage.setItem('dts-favorites',JSON.stringify([...next]));ids=next;return ids.has(id)},list:lib=>lib.filter(d=>ids.has(d.id)).sort(alphabet)};
  }
  const api={modes,normalize,arduinoSharedTools,arduinoBasic,includes,alphabet,favorites};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSWorkspaces=api;
})(typeof window==='undefined'?globalThis:window);
