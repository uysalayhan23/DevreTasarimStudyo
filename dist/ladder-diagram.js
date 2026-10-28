(function(root){
 'use strict';
 // Original DTS SVG ladder rendering. Diagram reflects the same V1 rung paths as native logic.
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const line=(x1,y1,x2,y2,cls='')=>'<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="'+cls+'"/>';
 const text=(x,y,value,cls='')=>'<text x="'+x+'" y="'+y+'" class="'+cls+'" text-anchor="middle">'+escape(value)+'</text>';
 function pathState(path,values){
  return Array.isArray(path)&&path.length>0&&path.every(c=>c.type==='NC'?!Boolean(values?.[c.ref]):Boolean(values?.[c.ref]));
 }
 function render(rung,options={}){
  const paths=Array.isArray(rung?.paths)?rung.paths:[],maxContacts=Math.max(1,...paths.map(p=>Array.isArray(p)?p.length:0));
  const startX=172,step=94,railLeft=32,branchX=94,joinX=Math.max(686,startX+(maxContacts-1)*step+75);
  const coilX=joinX+124,rightX=coilX+119,width=rightX+35;
  const rows=Math.max(1,paths.length),height=Math.max(172,128+(rows-1)*78),top=80;
  const live=options.live===true&&options.values&&typeof options.values==='object';
  const pathLive=paths.map(p=>live&&pathState(p,options.values));
  const energized=pathLive.some(Boolean),wireClass=energized?'dts-ladder-wire-hot':'dts-ladder-wire';
  const coil=rung?.coil||{},blocks=new Set(['TON','TOF','TP','CTU','CTD']);
  const bits=[];
  bits.push('<svg class="dts-ladder-svg" role="img" aria-label="'+escape('Network '+(Number.isInteger(options.index)?options.index+1:1)+': '+(rung?.id||'')+(live?', canlı sinyaller':'') )+'" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'" xmlns="http://www.w3.org/2000/svg">');
  bits.push('<g class="dts-ladder-rails">'+line(railLeft,31,railLeft,height-21)+line(rightX,31,rightX,height-21)+'</g>');
  bits.push(text(railLeft,20,'L1','dts-ladder-rail-label'),text(rightX,20,'L2','dts-ladder-rail-label'));
  bits.push(text(126,20,'Network '+(Number.isInteger(options.index)?options.index+1:1),'dts-ladder-net-label'));
  if(rung?.comment)bits.push(text(width/2,20,String(rung.comment).slice(0,66),'dts-ladder-comment-svg'));
  if(paths.length>1){
   bits.push(line(branchX,top,branchX,top+(paths.length-1)*78,'dts-ladder-wire'));
   bits.push(line(joinX,top,joinX,top+(paths.length-1)*78,'dts-ladder-wire'));
  }
  bits.push(line(joinX,top,coilX-(blocks.has(coil.type)?57:26),top,wireClass));
  bits.push(line(coilX+(blocks.has(coil.type)?57:26),top,rightX,top,wireClass));
  paths.forEach((path,pi)=>{
   if(!Array.isArray(path))return;
   const y=top+pi*78,cls=pathLive[pi]?'dts-ladder-wire-hot':'dts-ladder-wire';
   bits.push(line(railLeft,y,branchX,y,cls));
   let prev=branchX;
   path.forEach((contact,ci)=>{
    const x=startX+ci*step;
    bits.push(line(prev,y,x-15,y,cls));
    bits.push('<g class="dts-ladder-contact-symbol'+(pathLive[pi]?' dts-ladder-path-on':'')+'" role="button" tabindex="0" data-ladder-contact="'+(Number.isInteger(options.index)?options.index:0)+':'+pi+':'+ci+'" aria-label="'+escape((contact.ref||'?')+' '+(contact.type==='NC'?'normalde kapalı':'normalde açık')+' kontağını düzenle')+'">');
    bits.push(line(x-10,y-17,x-10,y+17,cls),line(x+10,y-17,x+10,y+17,cls));
    if(contact.type==='NC')bits.push(line(x-15,y+18,x+15,y-18,cls));
    bits.push(text(x,y-23,contact.ref||'?','dts-ladder-ref'));
    bits.push(text(x,y+33,contact.type==='NC'?'NC':'NO','dts-ladder-kind'));
    bits.push('</g>');prev=x+15;
   });
   bits.push(line(prev,y,joinX,y,cls));
  });
  if(blocks.has(coil.type)){
   bits.push('<g class="dts-ladder-function-block'+(energized?' dts-ladder-path-on':'')+'" role="button" tabindex="0" data-ladder-coil="'+(Number.isInteger(options.index)?options.index:0)+'" aria-label="'+escape((coil.type||'')+' '+(coil.ref||'')+' bloğunu düzenle')+'">');
   bits.push('<rect x="'+(coilX-57)+'" y="'+(top-31)+'" width="114" height="64" rx="2"/>');
   bits.push(text(coilX,top-10,coil.type,'dts-ladder-block-type'));
   bits.push(text(coilX,top+8,coil.ref||'?','dts-ladder-ref'));
   const preset=['TON','TOF','TP'].includes(coil.type)?String(coil.presetMs??'?')+' ms':'PV '+String(coil.preset??'?');
   bits.push(text(coilX,top+25,preset,'dts-ladder-block-detail'));
   bits.push('</g>');
  }else{
   bits.push('<g class="dts-ladder-coil-symbol'+(energized?' dts-ladder-path-on':'')+'" role="button" tabindex="0" data-ladder-coil="'+(Number.isInteger(options.index)?options.index:0)+'" aria-label="'+escape((coil.ref||'')+' bobinini düzenle')+'">');
   bits.push('<path d="M '+(coilX-19)+' '+(top-21)+' Q '+(coilX-34)+' '+top+' '+(coilX-19)+' '+(top+21)+' M '+(coilX+19)+' '+(top-21)+' Q '+(coilX+34)+' '+top+' '+(coilX+19)+' '+(top+21)+'"/>');
   bits.push(text(coilX,top-31,coil.ref||'?','dts-ladder-ref'));
   if(coil.type==='SET'||coil.type==='RESET')bits.push(text(coilX,top+4,coil.type==='SET'?'S':'R','dts-ladder-block-type'));
   bits.push('</g>');
  }
  bits.push(text(rightX-18,height-10,live?'CANLI':'ŞEMA','dts-ladder-mode-label'));
  bits.push('</svg>');
  return bits.join('');
 }
 const api=Object.freeze({render,pathState});
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.DTSLadderDiagram=api;
})(typeof window==='undefined'?globalThis:window);
