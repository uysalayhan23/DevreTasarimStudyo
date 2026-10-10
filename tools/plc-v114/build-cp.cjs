// Verified terminal rows: Omron W613-E1-03, pp. 3-5, 3-9, 3-10.
// Null positions are physical NC cavities, never connectable signal pins.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
const ch=(word,bit)=>word+'.'+String(bit).padStart(2,'0');
const range=(n,fn)=>Array.from({length:n},(_,i)=>fn(i));
function cp2e(part){
 const [,generation,family,size,renewal,type,supply]=part.match(/^(CP[12]E)-(NA|[NSE])(10|14|20|30|40|60)(S1?)?(DR|DT1?)-([AD])$/),n=+size,ac=supply==='A',analog=family==='NA',di={10:6,14:8,20:12,30:18,40:24,60:36}[n],dout=n-di;
 const inputs1=[ac?'L1':'+',ac?'L2/N':'−','COM',...range(di/2,i=>ch(Math.floor(i/6),i%6*2+1))];
 const inputs2=[ac&&n>=30?'FE':null,'PE',...range(di/2,i=>ch(Math.floor(i/6),i%6*2))];
 if(n===14){inputs1.push(null,null);inputs2.push(null,null)}
 if(n===30)inputs2.push(null);
 if(analog){inputs1.push('I IN0','AG','I IN1');inputs2[0]=ac?'FE':null;inputs2.push('V IN0','COM0','V IN1','COM1')}
 let outputs1,outputs2,offset1=0,offset2=10;
 const o=i=>ch(100,i),q=(w,i)=>ch(w,i);
 if(n<=20){outputs1=[o(0),o(1),o(2),o(3),o(4),o(5),n===14?null:o(7)];outputs2=['COM','COM',null,'COM',null,'COM',n===14?null:o(6)];offset1=10;offset2=0}
 if(n===10){outputs1=[o(0),o(1),o(2),o(3)];outputs2=['COM','COM',null,'COM',null]}
 if(analog){outputs1=[ac?'+24V':null,...[0,1,2,4,5,7].map(o),null,'I OUT0'];outputs2=[ac?'0V':null,'COM','COM','COM',o(3),'COM',o(6),null,'V OUT0','COM0']}
 if(n===30){outputs1=[ac?'+24V':null,...[0,1,2,4,5,7].map(o),q(101,0),q(101,2)];outputs2=[ac?'0V':null,'COM','COM','COM',o(3),'COM',o(6),'COM',q(101,1),q(101,3)];offset1=10;offset2=0}
 if(n===40){outputs1=[ac?'+24V':null,...[0,1,2,3,4,6].map(o),...[0,1,3,4,6].map(i=>q(101,i))];outputs2=[ac?'0V':null,'COM','COM','COM','COM',o(5),o(7),'COM',q(101,2),'COM',q(101,5),q(101,7)]}
 if(n===60){outputs1=[ac?'+24V':null,...[0,1,2,4,5,7].map(o),...range(2,j=>[0,2,4,5,7].map(i=>q(101+j,i))).flat()];outputs2=[ac?'0V':null,'COM','COM','COM',o(3),'COM',o(6),...range(2,j=>['COM',q(101+j,1),q(101+j,3),'COM',q(101+j,6)]).flat()];offset1=10;offset2=0}
 const specialTransistor=!ac&&(family==='S'||renewal),merged=specialTransistor?{1:2}:{};
 if(specialTransistor){outputs1[0]='V+';outputs2[0]='V−';outputs2[1]=type==='DT1'?'COM(V+)':'COM(V−)';outputs2[2]=null}
 const w=Math.ceil(Math.max(220,inputs1.length*20+40,inputs2.length*20+50)/20)*20,h=220,outputX=w-20-Math.max(outputs1.length*20+offset1,outputs2.length*20+offset2),rows=[
  {id:'IN-A',side:'top',x:20,y:20,labels:inputs1},
  {id:'IN-B',side:'top',x:30,y:50,labels:inputs2},
  {id:'OUT-A',side:'bottom',x:outputX+offset1,y:h-50,labels:outputs1},
  {id:'OUT-B',side:'bottom',x:outputX+offset2,y:h-20,labels:outputs2,merged}
 ];
 if(renewal==='S1')rows.push({id:'RS485',side:'bottom',x:20,y:200,pitch:10,labels:['A−','B+','FG']});
 const pins=[],materialPins=[];
 for(const side of ['top','bottom','left']){
  const active=rows.filter(r=>r.side===side).flatMap(r=>r.labels.map((label,i)=>({r,label,i}))).filter(p=>p.label);
  active.forEach(({r,label,i},index)=>{
   const signalType=r.id==='RS485'?'COM':/^\d+\.\d+$/.test(label)?(side==='top'?'DI':'DO'):/^V IN/.test(label)?'AI':/^V OUT/.test(label)?'AO':/^I (IN|OUT)/.test(label)?'ANALOG_ALTERNATE':'POWER';
   const p={id:r.id+':'+(i+1),label,block:r.id,terminal:i+1,signalType,x:side==='left'?0:20+index*10,y:side==='left'?100+index*20:side==='top'?0:h,side};pins.push(p);
   materialPins.push({...p,x:r.x+(r.vertical?0:i*(r.pitch||20))+(r.merged?.[i]?10:0),y:r.y+(r.vertical?i*(r.pitch||20):0),labelOffset:{x:0,y:11},labelSize:r.pitch===10?4.5:5.5});
  });
 }
 const manual=generation==='CP1E'?'W479-E1-08':'W613-E1-03',pages=generation==='CP1E'?(n<=20&&!analog?'3-5 / 3-6':'3-10 / 3-11 / 3-12'):(n<=20?'3-5':'3-9 / 3-10 / 3-11');
 return {id:'plc-hw-'+part.toLowerCase(),category:'PLC/Otomasyon',catalogGroup:'cpu',brand:'Omron',series:'CP Serisi',name:part,model:part,part,kind:'plc',isPLC:true,orientation:'front',w,h,pins,materialPins,documented:true,
  io:{DI:di,DO:dout,AI:analog?2:0,AO:analog?1:0},powerSupply:ac?'100–240 VAC':'24 VDC',outputType:type==='DR'?'relay':type==='DT'?'NPN':'PNP',
  terminalSource:'Omron '+manual+' · '+pages,productSource:'https://www.ia.omron.com/products/family/'+(generation==='CP1E'?'2064':'3777')+'/lineup.html',
  visualInfo:{match:'representative',model:part+' · üretici ön görünüşünden SVG uyarlama',part,source:'Omron '+manual+' · '+pages},
  plcFront:{family:'omron-cp',generation,variant:family,renewal:renewal||'',size:n,rows,ports:generation==='CP2E'&&family==='N'?['ETHERNET 1A','ETHERNET 1B']:['USB',...(family!=='E'?['RS-232C']:[]),...(family==='S'||renewal==='S1'?['RS-485']:[])],sourcePages:generation==='CP1E'?[68,71,72,73,76,77,78]:[68,71,72,75,76,77]}
 };
}
const records=[];
for(const n of [14,20,30,40,60])for(const suffix of ['DR-A','DT-A','DR-D','DT-D','DT1-D'])records.push(cp2e('CP2E-N'+n+suffix));
for(const n of [30,40,60])for(const suffix of ['DR-A','DT-D','DT1-D'])records.push(cp2e('CP2E-S'+n+suffix));
for(const n of [14,20,30,40,60])records.push(cp2e('CP2E-E'+n+'DR-A'));
for(const suffix of ['DR-A','DT-A','DT1-A','DR-D','DT-D','DT1-D'])records.push(cp2e('CP1E-E10'+suffix));
for(const n of [14,20,30,40])records.push(cp2e('CP1E-E'+n+'DR-A'));
for(const n of [14,20,30,40,60])records.push(cp2e('CP1E-E'+n+'SDR-A'));
for(const n of [14,20,30,40,60])for(const suffix of ['DR-A','DT-A','DT1-A','DR-D','DT-D','DT1-D'])records.push(cp2e('CP1E-N'+n+suffix));
for(const n of [30,40,60])for(const renewal of ['S','S1'])for(const suffix of ['DR-A','DT-D','DT1-D'])records.push(cp2e('CP1E-N'+n+renewal+suffix));
for(const suffix of ['DR-A','DT-D','DT1-D'])records.push(cp2e('CP1E-NA20'+suffix));
records.push(...require('./gmt-models.cjs')());
records.push(...require('./gxm-models.cjs')());
records.push(...require('./s7-models.cjs')());
records.push(...require('./delta-models.cjs')());
fs.writeFileSync(path.join(__dirname,'cp-models.json'),JSON.stringify(records,null,2));
const libfile=path.join(root,'dist/library.js'),marker='/* BEGIN VERIFIED PLC HARDWARE */';
const existing=fs.readFileSync(libfile,'utf8').split(marker)[0].trimEnd();
fs.writeFileSync(libfile,existing+'\n'+marker+'\n(function(){\n for(const id of ["plc-4-3-documented","plc-7-0","plc-7-2",...Array.from({length:23},(_,i)=>"plc-14-"+i),...Array.from({length:5},(_,i)=>"plc-0-"+i+"-documented")]){const old=window.COMPONENT_LIBRARY.find(d=>d.id===id);if(old)old.superseded=true;}\n const records='+JSON.stringify(records)+';\n window.COMPONENT_LIBRARY.push(...records);\n})();\n/* END VERIFIED PLC HARDWARE */\n');
console.log('Verified CP variants:',records.length);
