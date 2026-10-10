(function(root){
  'use strict';
  const floating=d=>!!d&&(d.kind==='multimeter'||!!d.probeColor);
  const meterPins=d=>d?.kind==='multimeter'?['COM','V','10A']:d?.kind==='clamp-meter'?['COM','V']:[];
  function info(project,byId,w){
    let probe=null,meter=null,meterPin=null;
    for(const r of [w.from,w.to]){
      const c=project.components.find(c=>c.id===r?.c),d=c&&byId[c.typeId];
      if(d?.probeColor&&r.p==='PLUG')probe=c;
      if(meterPins(d).includes(r.p)){meter=c;meterPin=r.p}
    }
    if(!probe&&!meter)return null;
    const black=probe?byId[probe.typeId].probeColor==='black':meterPin==='COM';
    return {probe,meter,role:'MEASURE',color:black?'#111827':'#e53935'};
  }
  function socket(project,byId,r){
    const c=project.components.find(c=>c.id===r?.c),d=c&&byId[c.typeId];
    return meterPins(d).includes(r.p)?{c,p:r.p,meter:true}:d?.probeColor&&r.p==='PLUG'?{c,p:r.p,probe:true}:null;
  }
  function check(project,byId,from,to,ignoreWireId){
    const wires=project.wires.filter(w=>w.id!==ignoreWireId),equal=(a,b)=>a?.c&&a.c===b?.c&&a.p===b.p;
    for(const r of [from,to]){const s=socket(project,byId,r);if(!s)continue;
      if(wires.some(w=>equal(w.from,r)||equal(w.to,r)))return {ok:false,reason:s.probe?'Bu prob zaten bir yuvaya bağlı. Önce kabloyu ayırın veya ölçü aletinin Kırmızı prob yuvası seçimini değiştirin.':'Bu ölçü aleti yuvasına yalnızca bir prob kablosu takılabilir.'};
      if(s.meter&&byId[s.c.typeId]?.kind==='multimeter'&&s.p!=='COM'&&wires.some(w=>[w.from,w.to].some(q=>q.c===s.c.id&&q.p===(s.p==='V'?'10A':'V'))))return {ok:false,reason:'10A ve VΩmA aynı anda bağlı olamaz. Kırmızı prob yuvasından giriş değiştirin.'};
    }
    const key=r=>r?.j?'j:'+r.j:JSON.stringify([r?.c,r?.p]),parents=new Map(),find=k=>{if(!parents.has(k))parents.set(k,k);while(parents.get(k)!==k)k=parents.get(k);return k},join=(a,b)=>parents.set(find(a),find(b));
    for(const w of [...wires,{from,to}])join(key(w.from),key(w.to));
    const affected=find(key(from)),probes=new Set(),jacks=new Set();
    for(const c of project.components){const d=byId[c.typeId];if(d?.probeColor&&find(key({c:c.id,p:'PLUG'}))===affected)probes.add(c.id);for(const p of meterPins(d))if(find(key({c:c.id,p}))===affected)jacks.add(c.id+':'+p)}
    if(probes.size&&jacks.size>1)return {ok:false,reason:'Bir prob kablosu aynı anda yalnızca bir ölçü aleti yuvasına bağlanabilir.'};return {ok:true};
  }
  function repairDuplicates(project,byId){
    let count=0;const removed=new Set();
    for(const c of project.components.filter(c=>byId[c.typeId]?.probeColor)){
      const links=project.wires.map(w=>({w,m:socket(project,byId,w.from.c===c.id?w.to:w.from)})).filter(({w,m})=>m?.meter&&[w.from,w.to].some(r=>r.c===c.id&&r.p==='PLUG'));
      if(links.length<2)continue;const owner=links[0].m.c;if(!links.every(l=>l.m.c.id===owner.id))continue;
      const desired=byId[c.typeId].probeColor==='black'?'COM':byId[owner.typeId]?.kind==='clamp-meter'?'V':owner.meterPosition===9?'10A':'V',keep=links.find(l=>l.m.p===desired)||links[0];
      for(const l of links)if(l!==keep){removed.add(l.w);count++}
    }
    if(count)project.wires=project.wires.filter(w=>!removed.has(w));return count;
  }
  function movePlug(project,byId,meterId,pin){
    if(!['V','10A'].includes(pin))return {ok:false,reason:'Geçersiz ölçüm yuvası.'};
    const w=project.wires.find(w=>[w.from,w.to].some(r=>r.c===meterId&&['V','10A'].includes(r.p)));
    if(!w)return {ok:false,reason:'Önce kırmızı prob kablosunu ölçü aletine bağlayın.'};
    const end=w.from.c===meterId?'from':'to',from=end==='from'?{c:meterId,p:pin}:w.from,to=end==='to'?{c:meterId,p:pin}:w.to;
    if(w[end].p===pin)return {ok:true};const result=check(project,byId,from,to,w.id);if(!result.ok)return result;
    w[end]={c:meterId,p:pin};return {ok:true};
  }
  // A probe contact is a temporary electrical reference, never a split wire.
  function resolve(project,byId,target){
    if(target?.w){const w=project.wires.find(w=>w.id===target.w);return w&&!info(project,byId,w)?w.from:null}
    if(target?.j)return project.junctions?.some(j=>j.id===target.j)?{j:target.j}:null;
    const c=project.components.find(c=>c.id===target?.c),d=c&&byId[c.typeId];
    return d?.pins.some(p=>p.id===target.p)?{c:c.id,p:target.p}:null;
  }
  function prepare(project,byId){
    for(const c of project.components)if(byId[c.typeId]?.kind==='multimeter')delete c._redProbeJack;
    for(const w of project.wires){const lead=info(project,byId,w);if(lead){w.probeLead=true;w.color=lead.color;w.role=lead.role;w.size=w.probeSize||'6 mm²';w._lineConflict=false;if(lead.meter&&byId[lead.meter.typeId]?.kind==='multimeter'){const r=[w.from,w.to].find(r=>r.c===lead.meter.id&&['V','10A'].includes(r.p));if(r)lead.meter._redProbeJack=r.p}}else delete w.probeLead}
    for(const c of project.components)if(byId[c.typeId]?.probeColor&&c.probeTarget&&!resolve(project,byId,c.probeTarget))delete c.probeTarget;
  }
  // Two smooth cubic spans keep their exact socket endpoints. The bend is free
  // of the routing grid, obstacles and ordinary conductor lane allocation.
  function curve(a,b,offset={}){
    const start=a.pos,end=b.pos,span=Math.hypot(end.x-start.x,end.y-start.y),sag=Math.max(80,Math.min(240,span*.35)),reach=Math.max(65,Math.min(170,span*.28));
    const v=side=>({top:[0,-1],bottom:[0,1],left:[-1,0],right:[1,0]})[side]||[0,1];
    const av=v(a.side),bv=v(b.side),bend={x:(start.x+end.x)/2+(Number(offset.x)||0),y:Math.max(start.y,end.y)+sag+(Number(offset.y)||0)};
    const sign=end.x>=start.x?1:-1,tangent=Math.max(45,Math.min(160,span*.2));
    const p=(x,y)=>Number(x.toFixed(3))+' '+Number(y.toFixed(3));
    return {bend,path:'M'+p(start.x,start.y)+' C'+p(start.x+av[0]*reach,start.y+av[1]*reach)+' '+p(bend.x-sign*tangent,bend.y)+' '+p(bend.x,bend.y)+' C'+p(bend.x+sign*tangent,bend.y)+' '+p(end.x+bv[0]*reach,end.y+bv[1]*reach)+' '+p(end.x,end.y)};
  }
  function nearest(points,p){
    let total=0;const lengths=[];for(let i=1;i<points.length;i++){const n=Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y);lengths.push(n);total+=n}
    let best=null,along=0;
    for(let i=1;i<points.length;i++){
      const a=points[i-1],b=points[i],length=lengths[i-1];if(!length)continue;
      const u=Math.max(0,Math.min(1,((p.x-a.x)*(b.x-a.x)+(p.y-a.y)*(b.y-a.y))/(length*length))),point={x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u},distance=Math.hypot(p.x-point.x,p.y-point.y);
      if(!best||distance<best.distance)best={point,distance,t:(along+length*u)/total};along+=length;
    }
    return best;
  }
  function at(points,t){
    if(!points.length)return null;if(points.length===1)return points[0];
    const lengths=points.slice(1).map((p,i)=>Math.hypot(p.x-points[i].x,p.y-points[i].y));let remaining=lengths.reduce((a,b)=>a+b,0)*Math.max(0,Math.min(1,Number(t)||0));
    for(let i=0;i<lengths.length;i++){const n=lengths[i];if(remaining<=n&&n){const a=points[i],b=points[i+1],u=remaining/n;return {x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u}}remaining-=n}
    return points[points.length-1];
  }
  const api={floating,info,check,movePlug,repairDuplicates,resolve,prepare,curve,nearest,at};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSProbeLeads=api;
})(typeof window==='undefined'?globalThis:window);
