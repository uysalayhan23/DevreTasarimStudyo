(function(root){
  'use strict';
  const Components=typeof module==='object'&&module.exports?require('./components.js'):root.CCSComponents;
  const Materials=typeof module==='object'&&module.exports?require('./materials.js'):root.CCSMaterials;
  const Norms=typeof module==='object'&&module.exports?require('./norms.js'):root.CCSNorms;
  const Labels=typeof module==='object'&&module.exports?require('./labels.js'):root.CCSLabels;
  const Sensors=typeof module==='object'&&module.exports?require('./sensors.js'):root.CCSSensors;
  const Devices=typeof module==='object'&&module.exports?require('./device-behavior.js'):root.DTSDeviceBehavior;
  const IncrementalEncoder=typeof module==='object'&&module.exports?require('./incremental-encoder.js'):root.DTSIncrementalEncoder;
  const DoldSafety=typeof module==='object'&&module.exports?require('./dold-safety.js'):root.DTSDoldSafety;
  const HCFAUI=typeof module==='object'&&module.exports?require('./hcfa-ui.js'):root.DTSHCFAUI;
  const Assemblies=typeof module==='object'&&module.exports?require('./assemblies.js'):root.DTSAssemblies;
  const GRID=10;
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const verticalSide={top:'right',right:'bottom',bottom:'left',left:'top'};
  function prepareLibrary(lib){
  lib.forEach(d=>{
    const oldW=d.w,oldH=d.h,precise=!!d.preservePinGeometry,newW=precise?oldW:Math.max(40,Math.round(oldW/20)*20),newH=precise?oldH:Math.max(40,Math.round(oldH/20)*20);
    const sourcePins=d.pins.map(p=>precise?{...p}:{...p,x:p.x===0?0:p.x===oldW?newW:Math.round(p.x/GRID)*GRID,y:p.y===0?0:p.y===oldH?newH:Math.round(p.y/GRID)*GRID});
    const source={w:newW,h:newH,pins:sourcePins};
    const horizontalPins=sourcePins.filter(p=>p.side==='left'||p.side==='right').length;
    const verticalPins=sourcePins.filter(p=>p.side==='top'||p.side==='bottom').length;
    const rotateVertical=!d.isPLC&&d.orientation==='vertical'&&horizontalPins>verticalPins;
    if(rotateVertical){
      /* AutoCAD Electrical's V* records are the 90° counterpart of H*.
         Keep the canonical geometry for the renderer, but expose a swapped
         bounding box and rotated terminal coordinates to the editor/router. */
      d._verticalTransform=true;d._geometry=source;d.w=newH;d.h=newW;
      d.pins=sourcePins.map(p=>({...p,x:newH-p.y,y:p.x,side:verticalSide[p.side]||p.side}));
    }else{d._verticalTransform=false;d.w=newW;d.h=newH;d.pins=sourcePins}
  });
  return lib;
  }
  function rotatedPoint(p,d,rotation=0){
    const cx=d.w/2,cy=d.h/2,q=((rotation%360)+360)%360/90,dx=p.x-cx,dy=p.y-cy;
    const turns=[[dx,dy],[-dy,dx],[-dx,-dy],[dy,-dx]],v=turns[q]||turns[0];
    return {x:cx+v[0],y:cy+v[1]};
  }
  function rotatedSide(side,rotation=0){
    const sides=['top','right','bottom','left'],q=((rotation%360)+360)%360/90;
    return sides[(sides.indexOf(side)+q)%4];
  }
  function referencePrefix(d){
    if(d.refPrefix)return d.refPrefix;
    if(d.isPLC||d.visualOnly)return 'PLC';
    if(['coil','timer','coil-valve','coil-pulse','coil-flasher','contactor3','contact-no','contact-nc','contact-both'].includes(d.kind)||d.kind.startsWith('delay-'))return 'K';
    if(['bjt-npn','bjt-pnp'].includes(d.kind))return 'Q';
    if(d.kind==='opamp')return 'U';
    if(d.kind.includes('motor'))return 'M';
    if(['lamp','led','buzzer','siren','flasher'].includes(d.kind))return 'H';
    if(['transformer','autotransformer','transformer-3p'].includes(d.kind))return 'T';
    if(['supply','supply3','supply-dc-plus','power24'].includes(d.kind))return 'G';
    return 'S';
  }
  function classes(d,c={},mode='iec'){
    return ['component',d.isPLC?'plc':'cade-symbol',mode==='material'?'material':'',d.interactive?'interactive':'',c._active?'active':'',c.state?'operated':'',c._pressed?'pressing':'',c._spin?'rotating':'',c._spin<0?'reverse':'',c._closed&&['sensor','detector'].includes(d.kind)?'detecting':''].filter(Boolean).join(' ');
  }
  function labelMarkup(c,key,value,base,cls='subtitle',anchor='middle',raw=false,style=''){
    const pos=Labels.position(c,key,base),lines=String(value).replace(/\r\n?/g,'\n').split('\n'),step=key==='note'?16:13;
    const body=raw?value:lines.map((s,i)=>i?'<tspan x="0" dy="'+step+'">'+esc(s||'\u00a0')+'</tspan>':esc(s||'\u00a0')).join('');
    return '<g class="label-anchor" data-label-key="'+esc(key)+'" data-base-x="'+base.x+'" data-base-y="'+base.y+'" transform="translate('+pos.x+' '+pos.y+')"><text class="'+cls+' movable-label" x="0" y="0" text-anchor="'+anchor+'"'+(style?' style="'+esc(style)+'"':'')+' aria-label="'+esc(key==='ref'?'Cihaz adı':key==='label'?'Açıklama':key==='note'?'Not':key.startsWith('pin:')?'Terminal etiketi':key)+'">'+body+'</text></g>';
  }
  function descriptionText(d,c,material){return (c.label&&c.label!==d.name?c.label:'')||(d.isPLC?d.series:material?(Components.contactSummary(c,d)||d.model):'')}
  function noteMarkup(d,c={},options={}){
    if(!c.note||c.showNote===false)return '';
    const quarter=((c.rotation||0)%180+180)%180===90,h=quarter?d.w:d.h,description=descriptionText(d,c,options.mode==='material');
    const y=d.h/2+h/2+40+(description?13*Math.max(1,String(description).split('\n').length):0)+(c.address?13:0);
    return labelMarkup(c,'note',c.note,{x:d.w/2,y},'component-note');
  }
  function markup(d,c={},options={}){
    if(!options.scaled&&Number(c.materialScale)>0&&Number(c.materialScale)!==1)return '<g class="device-scale" transform="scale('+Math.max(.25,Math.min(3,Number(c.materialScale)))+')">'+markup(d,c,{...options,scaled:true})+'</g>';
    d=Assemblies.definition(d,c,options.mode);
    const rotation=c.rotation||0,quarter=((rotation%180)+180)%180===90,material=options.mode==='material',wireBodyOnly=!!options.wireBodyOnly,wireOverlayOnly=!!options.wireOverlayOnly,norm=Norms.normalize(options.norm);
    const h=quarter?d.w:d.h,cx=d.w/2,cy=d.h/2;
    let pins='',annotations=(typeof module==='object'&&module.exports?require('./instrument-ui.js'):root.DTSInstrumentUI).readout(d,c)+Devices.markup(c,d,options.mode)+(c._damaging?'<g class="sensor-burn"><text x="0" y="70" font-size="65">🔥💥</text></g>':'');
    const label=(...args)=>labelMarkup(c,...args);
    let art;
    if(material){
      art=wireOverlayOnly?'':d._auxOnly?'':d.productVisualUrl?'<g class="real-product-photo"><rect x="2" y="2" width="'+(d.w-4)+'" height="'+(d.h-4)+'" rx="6" fill="#fff" stroke="#cbd5e1"/><image href="'+esc(d.productVisualUrl)+'" x="7" y="7" width="'+(d.w-14)+'" height="'+(d.h-14)+'" preserveAspectRatio="xMidYMid meet"/></g>':(d.hcfaDrive||d.hcfaServoMotor||d.hcfaPulseSource||d.hcfaModbusMaster)?HCFAUI.markup(c,d):(d.doldSafety||d.doldNe5021)?DoldSafety.materialMarkup(c,d):d.incrementalEncoder38mm?IncrementalEncoder.markup(c,d):Materials.markup(d,c);
      if(rotation&&!d.materialSymbol&&!d.designMaterial)art=art.replace(/<text\b([^>]*)>/g,(all,attrs)=>'<text'+attrs+' transform="rotate('+(-rotation)+' '+(attrs.match(/\bx="([^"]*)"/)?.[1]||0)+' '+(attrs.match(/\by="([^"]*)"/)?.[1]||0)+')">');
    }
    else{
      const drawing=Norms.drawing(d,c,norm);art=drawing.body;if(!['sinamics-v20-1p','abb-acs800-r5'].includes(d.id))drawing.texts.forEach(t=>annotations+=label('symbol:'+t.key,t.value,rotatedPoint(t,d,rotation),t.cls));
    }
    if(d.id==='sinamics-v20-1p'){if(!material)art='<rect x="26" y="24" width="208" height="326" rx="5" fill="#f1f4f6" stroke="#334a57"/><text x="130" y="56" text-anchor="middle" font-size="17" fill="#008f92">SINAMICS V20</text><text x="130" y="78" text-anchor="middle" font-size="11" fill="#334a57">1~ 230 V → 3~ · 1,5 kW</text>';if(!wireBodyOnly)art+=(typeof module==='object'&&module.exports?require('./v20-ui.js'):root.DTSV20UI).markup(c,material,d);if(rotation)art=art.replace(/<text\b([^>]*)>/g,(all,attrs)=>'<text'+attrs+' transform="rotate('+(-rotation)+' '+(attrs.match(/\bx="([^"]*)"/)?.[1]||0)+' '+(attrs.match(/\by="([^"]*)"/)?.[1]||0)+')">');}
    if(d.id==='abb-acs800-r5'){if(!material)art='<rect x="20" y="25" width="600" height="1300" rx="8" fill="#f2f4f2" stroke="#52645d"/><text x="320" y="190" text-anchor="middle" font-size="25" fill="#253e37">ABB ACS800 · R5</text>';art+=(typeof module==='object'&&module.exports?require('./acs800-ui.js'):root.DTSACS800UI).markup(c,material);if(rotation)art=art.replace(/<text\b([^>]*)>/g,(all,attrs)=>attrs.includes('transform=')?all:'<text'+attrs+' transform="rotate('+(-rotation)+' '+(attrs.match(/\bx="([^"]*)"/)?.[1]||0)+' '+(attrs.match(/\by="([^"]*)"/)?.[1]||0)+')">');}
    if(['motor3','motor-yd'].includes(d.kind)){
      const bx=d.w-52,by=40,points={},upper=d.kind==='motor3'?['U','V','W']:['U1','V1','W1'];
      art+='<g class="motor-terminal-board"><rect x="'+(bx-6)+'" y="'+(by-10)+'" width="52" height="60" rx="3" fill="#f1e9d4" stroke="#76674c"/>';
      [upper,['W2','U2','V2']].forEach((row,r)=>row.forEach((id,i)=>{const q={x:bx+i*18,y:by+r*28};points[id]=q;art+='<circle cx="'+q.x+'" cy="'+q.y+'" r="3" fill="#ba9653" stroke="#6a5123"/>';annotations+=label('board:'+id,id==='U'?'U1':id==='V'?'V1':id==='W'?'W1':id,rotatedPoint({x:q.x,y:q.y+11},d,rotation),'port-label','middle',false,'font-size:7px');}));
      for(const [a,b] of Components.motorLinks(c,d)){const p=points[a],q=points[b];art+='<line x1="'+p.x+'" y1="'+p.y+'" x2="'+q.x+'" y2="'+q.y+'" stroke="#d69d28" stroke-width="3"/>'}
      art+='</g>';
    }
    const v20Photo=material&&d.id==='sinamics-v20-1p';
    const v20Upper=new Set(['13','13b','14','14b','12','15','16']);
    const v20Lower=new Set(['1','2','3','4','5','6','7','8','9','10','11','17','18','19']);
    const v20Output=new Set(['U','V','W','DC-','DC+','PE2']);
    for(const p of d.pins){
      const pos=rotatedPoint(p,d,rotation),side=rotatedSide(p.side,rotation);
      const x=pos.x+(side==='left'?9:side==='right'?-9:9);
      const y=pos.y+(side==='top'?13:side==='bottom'?-7:3);
      const anchor=side==='right'?'end':'start';
      const pending=options.pending?.c===c.id&&options.pending?.p===p.id;
      const line=c._terminalLines?.[p.id],inherited=line?.freeColor?null:line;
      const terminalArt=material?(v20Photo?'':(d.arduinoOnly||d.portStyle==='hole'?'<circle class="arduino-terminal-socket" cx="'+pos.x+'" cy="'+pos.y+'" r="'+(d.portStyle==='hole'?3.5:4.5)+'"/>':Materials.screw(pos.x-4,pos.y-4,8))):'';
      const portR=v20Photo?2.6:4,hitR=v20Photo?7:9;
      const portStyle=inherited?' style="stroke:'+esc(inherited.color)+'"':v20Photo?' style="fill:rgba(255,255,255,.58);stroke:#2f3b45;stroke-width:.8"':'';
      pins+='<g data-port="'+esc(p.id)+'"'+(inherited?' data-line-role="'+esc(inherited.role)+'"':'')+' class="port-group'+(v20Photo?' v20-photo-port-group':'')+'"><title>'+esc((p.signalLabel||p.label)+(inherited?' · '+inherited.role+' · '+inherited.size:''))+'</title><circle class="port-hit" cx="'+pos.x+'" cy="'+pos.y+'" r="'+hitR+'"/>'+terminalArt +'<circle class="port '+(pending?'pending ':'')+(c._hot?.includes(p.id)?'energized':'')+(v20Photo?' v20-photo-port':'')+'" cx="'+pos.x+'" cy="'+pos.y+'" r="'+portR+'"'+portStyle+'/></g>';
      let physicalLabel=material&&p.labelOffset?rotatedPoint({x:p.x+p.labelOffset.x,y:p.y+p.labelOffset.y},d,rotation):{x,y},labelAnchor=material&&p.labelOffset?(p.labelAnchor||'middle'):anchor,labelText=material?(c.physicalLabels?.[p.id]||Components.pinLabel(c,d,p)):Norms.pinLabel(c,d,p,norm),labelStyle=[inherited?'fill:'+inherited.color:'',material&&p.labelSize?'font-size:'+p.labelSize+'px':''].filter(Boolean).join(';');
      if(material&&d.instrument==='et4420'){
        labelText=p.id;
        labelAnchor='middle';
        labelStyle=[inherited?'fill:'+inherited.color:'','font-size:4.2px'].filter(Boolean).join(';');
        const row=Number(p.terminalRow||1);
        physicalLabel=rotatedPoint({x:p.x,y:p.y+(row===1?-9:10)},d,rotation);
      }
      if(v20Photo){
        labelText=p.id==='N'?'L2/N':p.id==='PE2'?'PE':p.id;
        labelAnchor='middle';
        if(['PE','L1','N'].includes(p.id))physicalLabel={x:pos.x,y:Math.min(d.h-3,pos.y+10)},labelStyle='font-size:5.4px';
        else if(v20Upper.has(p.id))physicalLabel={x:pos.x,y:Math.max(4,pos.y-7)},labelStyle='font-size:4.2px';
        else if(v20Lower.has(p.id))physicalLabel={x:pos.x,y:Math.min(d.h-3,pos.y+9)},labelStyle='font-size:4.15px';
        else if(v20Output.has(p.id))physicalLabel={x:pos.x,y:Math.min(d.h-2,pos.y+9)},labelStyle='font-size:5px';
      }
      const hidePinLabel=d.hidePinLabels||(material&&d.hideMaterialPinLabels)||(!material&&d.hideSymbolPinLabels);
      if(!hidePinLabel)annotations+=label('pin:'+p.id,labelText,physicalLabel,'port-label',labelAnchor,false,labelStyle);
    }
    const ref=c.ref||referencePrefix(d)+'1';
    const description=descriptionText(d,c,material);
    let y=cy+h/2+20+(material?Number(d.annotationBottomOffsetScene||0):0);
    if(!d._auxOnly)annotations+=label('ref',ref,{x:cx,y},'title component-reference');
    if(description&&!d._auxOnly)annotations+=label('label',description,{x:cx,y:y+=13});
    if(c.address)annotations+=label('address',c.address,{x:cx,y:y+=13});

    if(d.kind==='motor-dahlender')annotations+=label('speed',c._active?(c._motorSpeed==='high'?'YÜKSEK DEVİR':'DÜŞÜK DEVİR'):'',{x:cx,y:y+=13},'subtitle');
    if(options.includeNote!==false)annotations+=noteMarkup(d,c,options);
    if(material&&d.brand)annotations+=label('brand',d.brand,{x:cx,y:cy-h/2-8},'subtitle material-brand');
    const rotating=(/motor|fan|generator/.test(d.kind)||d.rotating)&&d.arduinoRole!=='signal-generator'&&!d.isPLC&&!d.diagramOnly;
    if(rotating)annotations+=label('direction',directionText(c),{x:cx,y:material?cy+29:y+14},'rotation-label');
    // Every editable text lives outside the rotated geometry, including pin
    // numbers and the lettering inside a symbol. Artwork has the original pins.
    if(d._auxOnly)return pins+'<g class="component-annotations">'+annotations+'</g>';
    const geometry='<g class="component-geometry" transform="rotate('+rotation+' '+cx+' '+cy+')" fill="none" stroke-linecap="round" stroke-linejoin="round">'+(wireOverlayOnly?'':(d.transparentBody?'':'<rect class="body" width="'+d.w+'" height="'+d.h+'" rx="5"/>'))+art+'</g>';
    if(wireBodyOnly)return geometry;
    return geometry+pins+(rotating?motionMarkup(d,c,false,material?'material':'iec'):'')+Sensors.markup(c,d)+'<g class="component-annotations">'+annotations+'</g>';
  }
  const directionText=c=>c._spin?((c._spin<0?'SOL · CCW':'SAĞ · CW')+(c._motorHz!==undefined?' · '+c._motorHz.toFixed(1)+' Hz':'')):'DURDU';
  function motionMarkup(d,c={},includeLabel=true,mode='material'){
    if(!(/motor|fan|generator/.test(d.kind)||d.rotating)||d.arduinoRole==='signal-generator'||d.isPLC||d.diagramOnly)return '';
    // A direction instrument remains upright when the equipment is rotated.
    const schematic=mode!=='material';
    return '<g class="motion-indicator '+(schematic?'schematic-motion':'')+'" transform="translate('+d.w/2+' '+(d.h/2)+')" pointer-events="none"><circle class="motion-dial" r="17"/><g transform="scale('+(schematic?3.15:1)+')"><g class="rotation-indicator"><g class="rotation-arrow"><path d="M0 -11 A11 11 0 1 1 -10 -4"/><path class="rotation-head" d="M-10 -4 L-15 -6 L-11 1 Z"/></g></g></g>'+(includeLabel?'<text class="rotation-label" text-anchor="middle" y="29">'+directionText(c)+'</text>':'')+'</g>';
  }
  function preview(d,mode='iec',norm='IEC'){
    const c={ref:referencePrefix(d)+'1',label:d.name,state:mode!=='material'&&!!d.previewState,rotation:0,_active:false};
    return '<svg class="preview-svg" viewBox="'+(d.instrument?Math.min(-16,(d.w-262)/2):-16)+' -16 '+(d.instrument?Math.max(262,d.w+32):d.w+(d.reedSensor?210:Devices.analog(d)?90:32))+' '+(d.h+(d.instrument?150:d.reedSensor?90:Devices.analog(d)?145:60))+'" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><g class="'+classes(d,c,mode)+'">'+markup(d,c,{mode,norm})+'</g></svg>';
  }
  const api={prepareLibrary,markup,noteMarkup,preview,classes,rotatedPoint,rotatedSide,referencePrefix,motionMarkup,directionText};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.CCSSymbols=api;
})(typeof window==='undefined'?globalThis:window);
