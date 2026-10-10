(function(root){
 'use strict';
 const supported=d=>['coil-pulse','coil-flasher','overload','thermal-magnetic','relay-protection'].includes(d.kind);
 function add(project,c,d,byId,uid){
  if(d.kind==='multimeter'){for(const [i,color] of ['black','red'].entries()){const probe={id:uid('probe'),typeId:'test-probe-'+color,probeFor:c.id,label:(color==='red'?'Kırmızı':'Siyah')+' prob',x:c.x+d.w+80,y:c.y+100+i*80,rotation:0};project.components.push(probe);project.wires.push({id:uid('w'),from:{c:c.id,p:i?'V':'COM'},to:{c:probe.id,p:'PLUG'},color:i?'#dc2525':'#20252a',points:[]})}return}
  if(!supported(d))return;
  const thermal=['overload','thermal-magnetic'].includes(d.kind),typeId=d.id==='voltage-protection-relay'?'protection-changeover':thermal?'thermal-contact-nc':'contact-no',def=byId[typeId];if(!def)return;
  c.auxDetached=true;
  const layout=d.kind==='coil-pulse'?[{x:50,y:30,side:'left'},{x:50,y:230,side:'left'}]:d.kind==='coil-flasher'?[{x:50,y:200,side:'bottom'},{x:70,y:200,side:'bottom'}]:null;
  project.components.push({physicalLabels:d.kind==='coil-pulse'?{'13':'1','14':'2'}:d.kind==='coil-flasher'?{'13':'15','14':'18'}:null,id:uid('aux'),typeId,ref:c.ref,label:thermal?'Koruma yardımcı kontağı':'Röle yardımcı kontağı',x:c.x+d.w+70,y:c.y,rotation:0,state:false,auxFor:c.id,companionView:'iec',auxLayout:{w:d.w,h:d.h,pins:def.pins.map((p,i)=>({...p,...(layout?.[i]||{x:def.pins.length===3?20+i*30:d.w-20,y:def.pins.length===3?d.h:(i?d.h:0),side:def.pins.length===3?'bottom':i?'bottom':'top'})}))}});
 }
 function sync(project,byId,mode){
  for(const c of project.components.filter(c=>c.auxFor)){
   const parent=project.components.find(p=>p.id===c.auxFor);if(!parent)continue;c.ref=parent.ref;
   const def=byId[c.typeId];if(def&&c.auxLayout){c.auxLayout.pins=c.auxLayout.pins.map((p,i)=>({...p,id:def.pins[i]?.id||p.id,label:def.pins[i]?.label||p.label}));
    if(parent.typeId==='coil-pulse')c.physicalLabels=Object.fromEntries(def.pins.map((p,i)=>[p.id,i?'2':'1']));
    if(parent.typeId==='coil-flasher'){const nc=c.contactModes?.main?c.contactModes.main==='NC':def.kind==='contact-nc';c.physicalLabels=Object.fromEntries(def.pins.map((p,i)=>[p.id,i?(nc?'16':'18'):'15']));c.auxLayout.pins[1].y=nc?230:200}}
   if(byId[parent.typeId]?.thermalPhoto&&c.auxLayout){const nc=(c.contactModes?.aux||def.contacts?.[0]?.normal||'NC')==='NC';c.auxLayout.w=120;c.auxLayout.h=160;c.auxLayout.pins=def.pins.map((p,i)=>({...p,x:nc?70:90,y:i?90:60,side:i?'bottom':'top'}));c.physicalLabels=Object.fromEntries(def.pins.map((p,i)=>[p.id,String((nc?95:97)+i)]))}
   if(mode==='material'){
    if(c.companionView!=='material')c.schematicPosition={x:c.x,y:c.y,rotation:c.rotation||0};
    c.x=parent.x;c.y=parent.y;c.rotation=parent.rotation||0;
   }else if(c.companionView==='material'&&c.schematicPosition)Object.assign(c,c.schematicPosition);
   c.companionView=mode;
  }
 }
 function definition(d,c,mode){
  if(c.auxFor&&mode==='material'&&c.auxLayout)return {...d,...c.auxLayout,_verticalTransform:false,_auxOnly:true,materialSymbol:false,designMaterial:false};
  if(mode==='material'&&d.materialPins)d={...d,pins:d.materialPins,_verticalTransform:false};
  if(mode==='material'&&d.instrument==='hmt'&&c.instrumentSettings?.input&&c.instrumentSettings.input!=='PT100')d={...d,pins:d.pins.map(p=>({...p,x:240-p.y,y:p.x,side:({top:'right',right:'bottom',bottom:'left',left:'top'})[p.side]}))};
  if(mode==='material'&&d.kind==='thermal-contact'&&d.thermalPhoto){const nc=(c.contactModes?.aux||d.contacts?.[0]?.normal||'NC')==='NC';d={...d,pins:d.pins.map((p,i)=>({...p,x:nc?70:90,y:i?90:60,side:i?'bottom':'top'}))}}
  if(c.auxDetached)return {...d,pins:d.pins.filter(p=>!['95','96'].includes(p.id))};
  return d;
 }
 const api={supported,add,sync,definition};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSAssemblies=api;
})(typeof window==='undefined'?globalThis:window);
