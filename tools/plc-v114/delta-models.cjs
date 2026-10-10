// Delta DVP-0360030-01 (2021-11-04), product profiles and I/O configuration.
// Underside connectors are shown in an explicitly labelled auxiliary strip;
// their screen positions are not presented as front-face screw positions.
module.exports=function(){
 const records=[],channels=(prefix,n)=>Array.from({length:n},(_,i)=>prefix+i.toString(8));
 for(const size of [12,26])for(const type of size===12?['R','T']:['R','T','S']){
  const part=`DVP${size}SE11${type}`,small=size===12,relay=type==='R',w=small?120:160,h=320,di=small?8:14,dout=small?4:12;
  const output=small?(relay?['C0','Y0','Y1','Y2','Y3',null,'SG','COM3+','COM3−']:['Y0','Y1','Y2','Y3','UP','ZP','SG','COM3+','COM3−']):(relay?['C0','Y0','Y1','Y2',null,'C1','Y3','Y4','Y5','C2','Y6','Y7','Y10',null,'C3','Y11','Y12','Y13']:['UP0','ZP0','Y0','Y1','Y2','Y3','Y4','Y5','Y6','Y7',null,'UP1','ZP1','Y10','Y11','Y12','Y13',null]);
  const rows=[{id:'INPUT',side:small?'right':'left',x:small?100:50,y:20,vertical:true,pitch:10,labels:['S/S',...channels('X',di)]},
   {id:'OUTPUT-A',side:'right',x:small?100:140,y:small?120:20,vertical:true,pitch:10,labels:output.slice(0,9)},
   ...(!small?[{id:'OUTPUT-B',side:'right',x:140,y:120,vertical:true,pitch:10,labels:output.slice(9)}]:[]),
   {id:'POWER',side:'bottom',x:20,y:300,pitch:10,auxiliary:true,labels:['24V','0V','FE']},
   {id:'COM2',side:'bottom',x:w-40,y:300,pitch:10,auxiliary:true,labels:['D+','D−','SG']}];
  const pins=[],materialPins=[],sideIndex={left:0,right:0,bottom:0};
  for(const row of rows)for(const [i,label] of row.labels.entries())if(label){
   const signalType=/^X\d/.test(label)?'DI':/^Y\d/.test(label)?'DO':row.id==='COM2'||label.startsWith('COM3')||label==='SG'?'COM':'POWER';
   const j=sideIndex[row.side]++,p={id:row.id+':'+(i+1),label,block:row.id,terminal:i+1,side:row.side,signalType,x:row.side==='left'?0:row.side==='right'?w:20+j*20,y:row.side==='bottom'?h:20+j*10};
   pins.push(p);materialPins.push({...p,x:row.x+(row.vertical?0:i*row.pitch),y:row.y+(row.vertical?i*row.pitch:0),labelOffset:row.vertical?{x:-21,y:2}:{x:0,y:12},labelSize:5,physicalFace:row.auxiliary?'underside':'front'});
  }
  const source='Delta DVP-0360030-01 · s. 1–4';
  records.push({id:'plc-hw-'+part.toLowerCase(),category:'PLC/Otomasyon',catalogGroup:'cpu',brand:'Delta',series:'DVP',part,model:part,name:part,kind:'plc',isPLC:true,orientation:'front',w,h,pins,materialPins,documented:true,io:{DI:di,DO:dout,AI:0,AO:0},powerSupply:'24 VDC',outputType:relay?'relay':type==='T'?'NPN':'PNP',terminalSource:source,productSource:'https://www.fabelec.cl/storage/products/archives/Delta_PLC_DVP_SE_I_TSE.pdf',visualInfo:{match:'representative',model:part+' · ön görünüş; alt bağlantılar ayrı şerit',part,source},plcFront:{family:'delta-se',generation:'DVP-SE',size,variant:type,rows,sourcePages:[2,3,5]}});
 }
 return records;
};
