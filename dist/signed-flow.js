(function(root){
  'use strict';
  const pinKey=(c,p)=>JSON.stringify([c,p]);
  const endpointKey=r=>r?.j?JSON.stringify(['junction',r.j]):pinKey(r?.c,r?.p);
  const mag=v=>Math.hypot(v?.[0]||0,v?.[1]||0);
  const add=(a,b)=>[(a?.[0]||0)+(b?.[0]||0),(a?.[1]||0)+(b?.[1]||0)];
  const scale=(v,k)=>[(v?.[0]||0)*k,(v?.[1]||0)*k];
  const addAt=(m,k,v)=>m.set(k,add(m.get(k)||[0,0],v));
  const phase={L1:0,L2:-2*Math.PI/3,L3:2*Math.PI/3};
  const twoTerminalKinds=new Set(['coil','timer','coil-valve','coil-flasher','coil-pulse','relay-protection','lamp','buzzer','siren','flasher','motor','motor-dc']);
  const threePhaseKinds=new Set(['motor3','motor-yd','motor-dahlender','motor-rotor','motor-2speed','generator','servo-motor']);

  function potential(net,c,p){
    const values=(net.at(c,p)||[]).filter(v=>!net.faultDomains?.has(v.domain)&&v.leg!=='PE');
    const v=values[0];if(!v)return null;
    if(v.type==='dc')return {v:[v.leg==='0'?0:Number(v.volts)||0,0],mode:'dc',domain:v.domain};
    if(v.type==='ac'){const a=phase[v.leg]||0,m=v.leg==='N'?0:Number(v.volts)||0;return {v:[m*Math.cos(a),m*Math.sin(a)],mode:'ac',domain:v.domain}}
    return null;
  }
  function unitBetween(net,c,a,b){
    const x=potential(net,c,a),y=potential(net,c,b);if(!x||!y||x.domain!==y.domain)return null;
    const d=[x.v[0]-y.v[0],x.v[1]-y.v[1]],m=mag(d);
    return m>1e-9?{v:scale(d,1/m),mode:x.mode}:null;
  }
  function providerPins(d){
    if(!d)return [];
    if(['supply','supply3','supply-dc-plus','supply-dc-minus'].includes(d.kind))return d.pins.filter(p=>p.id!=='PE').map(p=>p.id);
    if(d.kind==='power24')return ['P','M'];
    if(['transformer','autotransformer'].includes(d.kind))return ['3','4'];
    if(d.kind==='rectifier')return ['+','−'];
    if(d.kind==='transformer-3p')return ['T1','T2','T3'];
    if(['softstarter','vfd'].includes(d.kind))return d.kind==='vfd'?['U','V','W']:['T1','T2','T3'];
    if(d.id==='sinamics-v20-1p'||d.id==='hcfa-x2e')return ['U','V','W'];
    if(d.id==='abb-acs800-r5')return ['U2','V2','W2'];
    if(d.arduinoBoard)return ['5V','3V3','GND','GND2'].filter(id=>d.pins.some(p=>p.id===id));
    if(d.arduinoRole==='bench-supply')return ['P','M'];
    return [];
  }
  function markFallback(fallbackNodes,c,ids){for(const p of ids)fallbackNodes.add(pinKey(c.id,p))}
  function twoTerminalDemand(c,ids,net,demands,fallbackNodes){
    const u=unitBetween(net,c,ids[0],ids[1]);if(!u)return false;
    addAt(demands,pinKey(c.id,ids[0]),u.v);addAt(demands,pinKey(c.id,ids[1]),scale(u.v,-1));markFallback(fallbackNodes,c,ids);return true;
  }
  function fallbackDemand(c,d,net,demands,fallbackNodes){
    if(!c?._active||!d)return;
    if(twoTerminalKinds.has(d.kind)&&d.pins.length>=2){
      const ids=d.kind.startsWith('coil')||d.kind==='timer'||d.kind==='relay-protection'?['A1','A2']:[d.pins[0].id,d.pins[1].id];
      twoTerminalDemand(c,ids,net,demands,fallbackNodes);return;
    }
    if(d.kind==='power24'){twoTerminalDemand(c,['L','N'],net,demands,fallbackNodes);return}
    if(['transformer','autotransformer'].includes(d.kind)){twoTerminalDemand(c,['1','2'],net,demands,fallbackNodes);return}
    if(d.kind==='rectifier'){twoTerminalDemand(c,['~1','~2'],net,demands,fallbackNodes);return}
    let ids=null;
    if(d.id==='sinamics-v20-1p')ids=['L1','N'];
    else if(d.id==='hcfa-x2e')ids=['L1','L2'];
    else if(d.id==='abb-acs800-r5')ids=['U1','V1','W1'];
    else if(['softstarter','vfd','transformer-3p'].includes(d.kind))ids=['L1','L2','L3'];
    else if(threePhaseKinds.has(d.kind))ids=d.pins.filter(p=>p.id!=='PE').slice(0,3).map(p=>p.id);
    if(!ids)return;
    if(ids.length===2){twoTerminalDemand(c,ids,net,demands,fallbackNodes);return}
    const vectors=[];for(const p of ids){const x=potential(net,c,p);if(!x)return;const m=mag(x.v);if(m<1e-9)return;vectors.push(scale(x.v,1/m))}
    const mean=scale(vectors.reduce(add,[0,0]),1/vectors.length);
    vectors.forEach((v,i)=>addAt(demands,pinKey(c.id,ids[i]),add(v,scale(mean,-1))));markFallback(fallbackNodes,c,ids);
  }
  function apply(project,byId,net,options={}){
    const pairs=typeof options.pairs==='function'?options.pairs:()=>[],numeric=options.numericState;
    const demands=new Map(),fallbackNodes=new Set(),numericComponents=new Set();
    for(const w of project.wires||[])for(const k of ['_flowActive','_flowDirection','_flowMode','_flowCertainty','_flowMagnitude','_flowCurrentRe','_flowCurrentIm'])delete w[k];
    if(numeric?.terminalCurrents)for(const [k,v] of numeric.terminalCurrents){
      if(mag(v)<1e-12)continue;addAt(demands,k,v);try{numericComponents.add(JSON.parse(k)[0])}catch{}
    }
    for(const c of project.components||[]){const d=byId[c.typeId];if(!numericComponents.has(c.id))fallbackDemand(c,d,net,demands,fallbackNodes)}
    const edges=[],adj=new Map(),ensure=n=>{if(!adj.has(n))adj.set(n,[])};
    const addEdge=(u,v,wire=null)=>{if(!u||!v||u===v)return;const e={id:edges.length,u,v,wire};edges.push(e);ensure(u);ensure(v);adj.get(u).push(e);adj.get(v).push(e)};
    for(const w of project.wires||[])if(!w.mechanical&&w.role!=='MECHANICAL'&&!w.probeLead)addEdge(endpointKey(w.from),endpointKey(w.to),w);
    for(const c of project.components||[]){const d=byId[c.typeId];if(!d)continue;for(const pair of pairs(c,d)||[]){if(Array.isArray(pair)&&pair.length>=2)addEdge(pinKey(c.id,pair[0]),pinKey(c.id,pair[1]),null)}}
    const providers=new Set();for(const c of project.components||[]){const d=byId[c.typeId];for(const p of providerPins(d))providers.add(pinKey(c.id,p))}
    for(const n of [...demands.keys(),...providers])ensure(n);

    const seen=new Set(),components=[];
    for(const start of adj.keys()){if(seen.has(start))continue;const nodes=[],q=[start];seen.add(start);while(q.length){const n=q.pop();nodes.push(n);for(const e of adj.get(n)||[]){const z=e.u===n?e.v:e.u;if(!seen.has(z)){seen.add(z);q.push(z)}}}components.push(nodes)}
    const nodeComponent=new Map(),componentDirectional=new Set();
    components.forEach((nodes,ci)=>{
      nodes.forEach(n=>nodeComponent.set(n,ci));let sum=[0,0],hasFallback=false;
      for(const n of nodes){sum=add(sum,demands.get(n)||[0,0]);if(fallbackNodes.has(n))hasFallback=true}
      const ps=nodes.filter(n=>providers.has(n));
      if(ps.length&&mag(sum)>1e-12){const share=scale(sum,-1/ps.length);for(const p of ps)addAt(demands,p,share)}
      if(hasFallback)componentDirectional.add(ci);
    });

    let timer=0;const tin=new Map(),low=new Map(),bridges=new Set();
    function dfs(v,parentEdge=-1){
      tin.set(v,++timer);low.set(v,timer);
      for(const e of adj.get(v)||[]){if(e.id===parentEdge)continue;const to=e.u===v?e.v:e.u;
        if(tin.has(to))low.set(v,Math.min(low.get(v),tin.get(to)));
        else{dfs(to,e.id);low.set(v,Math.min(low.get(v),low.get(to)));if(low.get(to)>tin.get(v))bridges.add(e.id)}
      }
    }
    for(const n of adj.keys())if(!tin.has(n))dfs(n);

    const componentMode=new Map();
    function modeForEdge(e){
      const ci=nodeComponent.get(e.u);if(componentMode.has(ci))return componentMode.get(ci);let mode='dc';
      for(const n of components[ci]||[]){try{const a=JSON.parse(n);if(a[0]==='junction')continue;const c=project.components.find(x=>x.id===a[0]);if(c&&(net.at(c,a[1])||[]).some(v=>v.type==='ac')){mode='ac';break}}catch{}}
      componentMode.set(ci,mode);return mode;
    }
    function cutCurrent(e){
      const reached=new Set([e.u]),q=[e.u];
      while(q.length){const n=q.pop();for(const x of adj.get(n)||[]){if(x.id===e.id)continue;const z=x.u===n?x.v:x.u;if(!reached.has(z)){reached.add(z);q.push(z)}}}
      let s=[0,0];for(const n of reached)s=add(s,demands.get(n)||[0,0]);return scale(s,-1);
    }
    for(const e of edges){
      if(!e.wire)continue;const w=e.wire,ci=nodeComponent.get(e.u);w._flowMode=modeForEdge(e);
      if(!bridges.has(e.id)){w._flowCertainty='ambiguous';w._flowDirection=0;w._flowActive=false;continue}
      const i=cutCurrent(e),m=mag(i);w._flowActive=m>1e-9;w._flowCertainty=componentDirectional.has(ci)?'directional':'exact';
      if(!w._flowActive){w._flowDirection=0;continue}
      const axis=Math.abs(i[0])>=Math.abs(i[1])?i[0]:i[1];w._flowDirection=axis>=0?1:-1;
      if(w._flowCertainty==='exact'){w._flowMagnitude=m;w._flowCurrentRe=i[0];w._flowCurrentIm=i[1]}
    }
    return {demands,bridges,components};
  }
  const api={apply,pinKey,endpointKey};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSSignedFlow=api;
})(typeof window==='undefined'?globalThis:window);
