(function(root){
  'use strict';
  const Lines=typeof module==='object'&&module.exports?require('./conductors.js'):root.CCSConductors;
  const Wiring=typeof module==='object'&&module.exports?require('./panel-wiring.js'):root.DTSPanelWiring;

  const round=(n,p=2)=>Number(Number(n).toFixed(p));
  const finitePositive=v=>Number.isFinite(Number(v))&&Number(v)>0;
  // Verification labels need a syntactically grounded HTTPS host, not merely "https://".
  const sourceUrlValid=url=>typeof url==='string'&&
    /^https:\/\/(?![^/?#]*@)[a-z0-9-]+(?:\.[a-z0-9-]+)+(?::[0-9]{1,5})?(?:[/?#]|$)/i.test(url);
  const verified=e=>e?.status==='verified'&&sourceUrlValid(e.sourceUrl);
  const roleClass=role=>{
    role=String(role||'').toUpperCase();
    if(['L1','L2','L3','N','PE'].includes(role))return 'power';
    if(['SIGNAL'].includes(role))return 'signal';
    if(['+24V','0V','DC+','CONTROL'].includes(role))return 'control';
    return 'other';
  };
  function routeLength(route){
    let n=0;
    for(const section of route||[])for(let i=1;i<(section.points||[]).length;i++){
      const a=section.points[i-1],b=section.points[i];
      n+=Math.hypot((b.x||0)-(a.x||0),(b.y||0)-(a.y||0),(b.z||0)-(a.z||0));
    }
    return n;
  }
  function wireRoute(panel,byId,wire){
    try{return Wiring.routes(panel,byId,wire)||[]}catch{return []}
  }
  function bom(panel,byId){
    const itemGroups=new Map();
    for(const item of panel?.items||[]){
      const d=byId?.[item.typeId],key=item.typeId||'unknown';
      if(!itemGroups.has(key))itemGroups.set(key,{typeId:key,name:d?.name||key,quantity:0,dimensionStatus:{verified:0,approximate:0,unknown:0}});
      const row=itemGroups.get(key);row.quantity++;
      const status=item.dimensionStatus==='verified'?'verified':item.dimensionStatus==='approximate'?'approximate':'unknown';
      row.dimensionStatus[status]++;
    }
    let wireLengthMm=0;
    const wires=(panel?.wires||[]).map(w=>{
      const lengthMm=routeLength(wireRoute(panel,byId,w));wireLengthMm+=lengthMm;
      return {id:w.id,role:w.role||null,size:Lines.sizeLabel(w.size),lengthMm:round(lengthMm,1),accessoryId:w.accessoryId||null};
    });
    return {
      items:[...itemGroups.values()].sort((a,b)=>String(a.name).localeCompare(String(b.name),'tr')),
      rails:{quantity:(panel?.rails||[]).length,totalLengthMm:round((panel?.rails||[]).reduce((n,r)=>n+(Number(r.length)||0),0),1)},
      ducts:{quantity:(panel?.ducts||[]).filter(d=>!d.kind).length,totalLengthMm:round((panel?.ducts||[]).filter(d=>!d.kind).reduce((n,d)=>n+(Number(d.length)||0),0),1)},
      accessories:{quantity:(panel?.ducts||[]).filter(d=>!!d.kind).length},
      wires:{quantity:wires.length,totalLengthMm:round(wireLengthMm,1),rows:wires}
    };
  }
  function ductAudit(panel){
    const wires=panel?.wires||[];
    return (panel?.ducts||[]).filter(d=>!d.kind).map(duct=>{
      const assigned=wires.filter(w=>w.accessoryId===duct.id),classes=[...new Set(assigned.map(w=>roleClass(w.role)))].sort();
      const eng=duct.engineering||{},capacityVerified=verified(eng)&&finitePositive(eng.usableAreaMm2)&&finitePositive(eng.maxFillPct)&&Number(eng.maxFillPct)<=100;
      const wireAreas=assigned.map(w=>{
        const e=w.engineering||{},ok=verified(e)&&finitePositive(e.outerDiameterMm);
        return {wireId:w.id,verified:ok,areaMm2:ok?Math.PI*Math.pow(Number(e.outerDiameterMm),2)/4:null};
      });
      const allWireAreasKnown=wireAreas.every(x=>x.verified),usedAreaMm2=allWireAreasKnown?wireAreas.reduce((n,x)=>n+x.areaMm2,0):null;
      const fillPct=capacityVerified&&allWireAreasKnown?usedAreaMm2/Number(eng.usableAreaMm2)*100:null;
      const limit=capacityVerified?Number(eng.maxFillPct):null;
      return {
        ductId:duct.id,
        assignedWireCount:assigned.length,
        roleClasses:classes,
        segregation:{status:classes.length>1?'advisory':'ok',mixedClasses:classes.length>1,authority:'training-advisory'},
        fill:{
          status:fillPct===null?'unknown':fillPct<=limit?'ok':'violation',
          authority:fillPct===null?'insufficient-verified-data':'verified-inputs',
          usableAreaMm2:capacityVerified?Number(eng.usableAreaMm2):null,
          maxFillPct:limit,
          usedAreaMm2:usedAreaMm2===null?null:round(usedAreaMm2,2),
          fillPct:fillPct===null?null:round(fillPct,2),
          missing: [
            ...(!capacityVerified?['verified-duct-capacity']:[]),
            ...(!allWireAreasKnown?wireAreas.filter(x=>!x.verified).map(x=>'wire-outer-diameter:'+x.wireId):[])
          ]
        }
      };
    });
  }
  function turnMetrics(points){
    const turns=[];
    for(let i=1;i<(points||[]).length-1;i++){
      const a=points[i-1],b=points[i],c=points[i+1];
      const v1={x:b.x-a.x,y:b.y-a.y,z:(b.z||0)-(a.z||0)},v2={x:c.x-b.x,y:c.y-b.y,z:(c.z||0)-(b.z||0)};
      const l1=Math.hypot(v1.x,v1.y,v1.z),l2=Math.hypot(v2.x,v2.y,v2.z);if(!l1||!l2)continue;
      const dot=(v1.x*v2.x+v1.y*v2.y+v1.z*v2.z)/(l1*l2);
      if(dot>.999)continue;
      turns.push({index:i,feasibleRadiusMm:Math.min(l1,l2)/2});
    }
    return turns;
  }
  function bendAudit(panel,byId){
    return (panel?.wires||[]).map(w=>{
      const e=w.engineering||{},requirementVerified=verified(e)&&finitePositive(e.minBendRadiusMm),required=requirementVerified?Number(e.minBendRadiusMm):null;
      const sections=wireRoute(panel,byId,w);
      const geometryKnown=sections.length>0&&sections.every(section=>Array.isArray(section.points)&&
        section.points.length>=2&&section.points.every(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&
        (p.z==null||Number.isFinite(p.z))));
      const turns=geometryKnown?sections.flatMap((s,section)=>turnMetrics(s.points).map(t=>({...t,section:s.surface||section}))):[];
      const worst=turns.length?Math.min(...turns.map(t=>t.feasibleRadiusMm)):null;
      return {
        wireId:w.id,
        status:!requirementVerified||!geometryKnown?'unknown':worst===null?'ok':worst+1e-9>=required?'ok':'violation',
        authority:requirementVerified&&geometryKnown?'verified-inputs':'insufficient-verified-data',
        minBendRadiusMm:required,
        minimumFeasibleRadiusMm:worst===null?null:round(worst,2),
        turnCount:turns.length,
        missing:[...(!requirementVerified?['verified-min-bend-radius']:[]),...(!geometryKnown?['verified-panel-wire-route']:[])]
      };
    });
  }
  function rectGap(a,b){
    const dx=Math.max(0,b.x-(a.x+a.w),a.x-(b.x+b.w));
    const dy=Math.max(0,b.y-(a.y+a.h),a.y-(b.y+b.h));
    return Math.hypot(dx,dy);
  }
  const axisOverlap=(a0,a1,b0,b1)=>a0<b1&&b0<a1;
  const verifiedPanelGeometry=item=>item?.dimensionStatus==='verified'&&item?.panelGeometryStatus==='ready';
  function directionalGapDetail(panel,item,direction,filter=()=>true,includeBoundary=true){
    const items=(panel?.items||[]).filter(x=>x.id!==item.id&&(x.mount==='door')===(item.mount==='door')&&filter(x));
    const x0=Number(item.x)||0,y0=Number(item.y)||0,x1=x0+(Number(item.w)||0),y1=y0+(Number(item.h)||0);
    let boundary=null,candidates=[];
    if(direction==='up'){
      boundary=y0;
      candidates=items.filter(x=>axisOverlap(x0,x1,Number(x.x)||0,(Number(x.x)||0)+(Number(x.w)||0))&&(Number(x.y)||0)+(Number(x.h)||0)<=y0)
        .map(x=>({item:x,distance:y0-((Number(x.y)||0)+(Number(x.h)||0))}));
    }else if(direction==='down'){
      boundary=Math.max(0,(Number(panel?.height)||0)-y1);
      candidates=items.filter(x=>axisOverlap(x0,x1,Number(x.x)||0,(Number(x.x)||0)+(Number(x.w)||0))&&(Number(x.y)||0)>=y1)
        .map(x=>({item:x,distance:(Number(x.y)||0)-y1}));
    }else if(direction==='left'){
      boundary=x0;
      candidates=items.filter(x=>axisOverlap(y0,y1,Number(x.y)||0,(Number(x.y)||0)+(Number(x.h)||0))&&(Number(x.x)||0)+(Number(x.w)||0)<=x0)
        .map(x=>({item:x,distance:x0-((Number(x.x)||0)+(Number(x.w)||0))}));
    }else if(direction==='right'){
      boundary=Math.max(0,(Number(panel?.width)||0)-x1);
      candidates=items.filter(x=>axisOverlap(y0,y1,Number(x.y)||0,(Number(x.y)||0)+(Number(x.h)||0))&&(Number(x.x)||0)>=x1)
        .map(x=>({item:x,distance:(Number(x.x)||0)-x1}));
    }else return null;
    const itemMin=candidates.length?Math.min(...candidates.map(x=>x.distance)):Infinity;
    if(includeBoundary&&Number.isFinite(boundary)&&boundary<=itemMin)return {distance:boundary,source:'boundary',itemIds:[],geometryVerified:true};
    if(!Number.isFinite(itemMin))return null;
    const nearest=candidates.filter(x=>Math.abs(x.distance-itemMin)<1e-9);
    return {distance:itemMin,source:'item',itemIds:nearest.map(x=>x.item.id),geometryVerified:nearest.every(x=>verifiedPanelGeometry(x.item))};
  }
  function directionalGap(panel,item,direction,filter=()=>true,includeBoundary=true){
    return directionalGapDetail(panel,item,direction,filter,includeBoundary)?.distance??null;
  }
  function manufacturerClearanceAudit(panel){
    const rows=[];
    for(const item of panel?.items||[]){
      const base=item?.requiredClearanceMm,byVoltage=item?.requiredClearanceByVoltageMm;
      if(!base&&!byVoltage)continue;
      const evidenceOk=item.physicalDimensionStatus==='verified'&&sourceUrlValid(item.dimensionSource);
      const geometryOk=item.dimensionStatus==='verified'&&item.panelGeometryStatus==='ready';
      const row={itemId:item.id,status:'unknown',authority:evidenceOk&&geometryOk?'verified-product-and-panel-geometry':'insufficient-verified-data',sourceUrl:evidenceOk?item.dimensionSource:null,checks:[],unresolved:[],missing:[]};
      if(!evidenceOk)row.missing.push('verified-product-clearance-source');
      if(!geometryOk)row.missing.push('verified-panel-geometry');
      if(!evidenceOk||!geometryOk){
        rows.push(row);
        continue;
      }
      const check=(context,direction,required,detail)=>{
        if(!Number.isFinite(Number(required))||Number(required)<0||!detail||!Number.isFinite(Number(detail.distance)))return;
        if(detail.geometryVerified===false){
          const token='verified-neighbour-geometry'+(detail.itemIds?.length?':'+detail.itemIds.join(','):'');
          if(!row.missing.includes(token))row.missing.push(token);
          if(!row.unresolved.includes(context+':'+direction))row.unresolved.push(context+':'+direction);
          return;
        }
        const req=Number(required),avail=Number(detail.distance);
        row.checks.push({context,direction,requiredMm:req,availableMm:round(avail,2),status:avail+1e-9>=req?'ok':'violation'});
      };
      const airflow=base?.freeAirFlow||{};
      for(const direction of ['up','down','left','right'])if(Number.isFinite(Number(airflow[direction])))check('freeAirFlow',direction,airflow[direction],directionalGapDetail(panel,item,direction));
      const neighbours=base?.neighbouringSubassemblies||{};
      if(Number.isFinite(Number(neighbours.side))){
        const left=directionalGapDetail(panel,item,'left',()=>true,false),right=directionalGapDetail(panel,item,'right',()=>true,false),choices=[left,right].filter(Boolean),nearest=choices.length?choices.sort((a,b)=>a.distance-b.distance)[0]:null;
        if(nearest)check('neighbouringSubassemblies','side',neighbours.side,nearest);
      }
      const enclosure=base?.cabinetEnclosure||{};
      if(Number.isFinite(Number(enclosure.side))){
        const left=Math.max(0,Number(item.x)||0),right=Math.max(0,(Number(panel?.width)||0)-((Number(item.x)||0)+(Number(item.w)||0)));
        check('cabinetEnclosure','side',enclosure.side,{distance:Math.min(left,right),source:'boundary',itemIds:[],geometryVerified:true});
      }
      const adjacent=base?.adjacentConverters||{};
      if(Number.isFinite(Number(adjacent.side))){
        const same=x=>x.physicalProductKey&&x.physicalProductKey===item.physicalProductKey;
        const left=directionalGapDetail(panel,item,'left',same,false),right=directionalGapDetail(panel,item,'right',same,false),choices=[left,right].filter(Boolean),nearest=choices.length?choices.sort((a,b)=>a.distance-b.distance)[0]:null;
        if(nearest)check('adjacentConverters','side',adjacent.side,nearest);
      }
      for(const context of Object.keys(base||{}))if(!['freeAirFlow','neighbouringSubassemblies','cabinetEnclosure','adjacentConverters'].includes(context))row.unresolved.push(context);
      if(byVoltage)row.unresolved.push('requiredClearanceByVoltageMm');
      if(!row.checks.length&&!row.unresolved.length)row.unresolved.push('no-verifiable-clearance-check');
      row.status=row.checks.some(x=>x.status==='violation')?'violation':row.unresolved.length?'unknown':'ok';
      if(row.missing.length)row.authority='insufficient-verified-data';
      else if(row.unresolved.length)row.authority='verified-product-metadata-context-required';
      rows.push(row);
    }
    return rows;
  }

  function serviceAudit(panel){
    const items=panel?.items||[];
    return items.map(item=>{
      const e=item.engineering||{},ok=verified(e)&&finitePositive(e.serviceClearanceMm),required=ok?Number(e.serviceClearanceMm):null;
      const validBox=x=>x&&['x','y','w','h'].every(k=>Number.isFinite(x[k]))&&x.w>0&&x.h>0;
      const neighbours=items.filter(x=>x.id!==item.id&&(x.mount==='door')===(item.mount==='door'));
      const geometryKnown=Number.isFinite(panel?.width)&&Number.isFinite(panel?.height)&&
        panel.width>0&&panel.height>0&&validBox(item)&&neighbours.every(validBox);
      if(!ok||!geometryKnown)return {
        itemId:item.id,status:'unknown',authority:'insufficient-verified-data',
        requiredClearanceMm:ok?required:null,minimumAvailableMm:null,
        missing:[...(!ok?['verified-service-clearance']:[]),...(!geometryKnown?['verified-service-geometry']:[])]
      };
      const box={x:item.x,y:item.y,w:item.w,h:item.h};
      const edge=Math.min(box.x,box.y,Math.max(0,panel.width-(box.x+box.w)),Math.max(0,panel.height-(box.y+box.h)));
      const same=neighbours.map(x=>rectGap(box,x));
      const available=Math.min(edge,...same.length?same:[Infinity]);
      return {itemId:item.id,status:available+1e-9>=required?'ok':'violation',authority:'verified-inputs',requiredClearanceMm:required,minimumAvailableMm:round(available,2),missing:[]};
    });
  }
  function thermalSummary(panel){
    const items=panel?.items||[],rows=items.map(item=>{
      const e=item.engineering||{},value=e.heatLossW;
      const ok=verified(e)&&value!=null&&(typeof value!=='string'||!!value.trim())&&
        Number.isFinite(Number(value))&&Number(value)>=0;
      return {itemId:item.id,verified:ok,heatLossW:ok?Number(e.heatLossW):null};
    });
    const known=rows.filter(x=>x.verified),unknown=rows.filter(x=>!x.verified);
    return {
      status:unknown.length?'partial':'known-load-only',
      authority:'load-inventory-only',
      knownHeatLossW:round(known.reduce((n,x)=>n+x.heatLossW,0),2),
      knownItemCount:known.length,
      unknownItemCount:unknown.length,
      enclosureThermalCompliance:'unknown',
      note:'Heat-load inventory is not enclosure thermal compliance without verified enclosure dissipation/ambient data.'
    };
  }
  function audit(panel,byId,options={}){
    const bomReport=bom(panel,byId),ducts=ductAudit(panel),bends=bendAudit(panel,byId),service=serviceAudit(panel),manufacturerClearance=manufacturerClearanceAudit(panel),thermal=thermalSummary(panel);
    const closure=typeof options.doorClearance==='function'?options.doorClearance(panel):null;
    return {
      schemaVersion:1,
      mode:'advisory',
      policy:'No regulatory/compliance claim is made without verified engineering inputs.',
      bom:bomReport,
      ductAudit:ducts,
      bendAudit:bends,
      serviceAudit:service,
      manufacturerClearanceAudit:manufacturerClearance,
      thermal,
      doorClearance:closure?{status:closure.ok?'ok':'violation',authority:'panel-geometry-contract',detail:closure}:null,
      summary:{
        verifiedViolations:ducts.filter(d=>d.fill.status==='violation').length+bends.filter(b=>b.status==='violation').length+service.filter(x=>x.status==='violation').length+manufacturerClearance.filter(x=>x.status==='violation').length+(closure&&!closure.ok?1:0),
        unknownChecks:ducts.filter(d=>d.fill.status==='unknown').length+bends.filter(b=>b.status==='unknown').length+service.filter(x=>x.status==='unknown').length+manufacturerClearance.filter(x=>x.status==='unknown').length+thermal.unknownItemCount,
        segregationAdvisories:ducts.filter(d=>d.segregation.mixedClasses).length
      }
    };
  }
  const api={roleClass,routeLength,bom,ductAudit,turnMetrics,bendAudit,rectGap,directionalGapDetail,directionalGap,manufacturerClearanceAudit,serviceAudit,thermalSummary,audit};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSPanelEngineering=api;
})(typeof window==='undefined'?globalThis:window);
