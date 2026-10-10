// GMTCNT GLC_TR.pdf pp. 3,6-10. Dimensions: 52 x 91 mm, front elevation.
module.exports=function(){
 const records=[];
 for(const series of [196,296,396,496])for(const type of ['R','T']){
  const part='GLC-'+series+type,w=160,h=280,analog=series>196,source='https://gmtwebfiles.ams3.cdn.digitaloceanspaces.com/GMTCNT/KULLANIM%20KLAVUZLARI/GLC_TR.pdf';
  const rows=[
   {id:'IP',side:'right',x:130,y:20,vertical:true,pitch:10,labels:['COM',...Array.from({length:9},(_,i)=>'IP'+i)]},
   ...(analog?[{id:'AN',side:'right',x:130,y:120,vertical:true,pitch:10,labels:['+In','Gnd','+Out']}]:[]),
   {id:'QP',side:'right',x:130,y:160,vertical:true,pitch:10,labels:['QP0',type==='R'?'COM0':'+V0','QP1',type==='R'?'COM1':'+V1','QP2','QP3','QP4','QP5',type==='R'?'COM2':'+V2']},
   {id:'COM2',side:'left',x:60,y:90,vertical:true,pitch:10,labels:['B','A']},
   {id:'POWER',side:'bottom',x:60,y:230,vertical:true,pitch:10,labels:['+24V','Gnd','PE']}
  ];
  const pins=[],materialPins=[];let sideIndex={};
  for(const row of rows)for(const [i,label] of row.labels.entries()){
   const signalType=/^IP\d/.test(label)?'DI':/^QP\d/.test(label)?'DO':label==='+In'?'AI':label==='+Out'?'AO':row.id==='COM2'?'COM':'POWER';
   const index=sideIndex[row.side]||0;sideIndex[row.side]=index+1;
   const p={id:row.id+':'+(i+1),label,block:row.id,terminal:i+1,signalType,side:row.side,x:row.side==='right'?w:row.side==='left'?0:40+index*20,y:row.side==='bottom'?h:20+index*10};pins.push(p);
   materialPins.push({...p,x:row.x,y:row.y+i*10,labelOffset:{x:-14,y:2},labelSize:5});
  }
  records.push({id:'plc-hw-'+part.toLowerCase(),category:'PLC/Otomasyon',catalogGroup:'cpu',brand:'GMTCNT',series:'GLC Serisi',part,model:part,name:part,kind:'plc',isPLC:true,orientation:'front',w,h,pins,materialPins,documented:true,io:{DI:9,DO:6,AI:analog?1:0,AO:analog?1:0},powerSupply:'24 VDC',outputType:type==='R'?'relay':'PNP',terminalSource:'GMTCNT GLC kılavuzu · s. 6–10',productSource:source,visualInfo:{match:'representative',model:part+' · üretici ön görünüşünden SVG uyarlama',part,source},plcFront:{family:'gmt-glc',generation:'GLC',variant:type,size:series,rows,sourcePages:[3,6,7,8,9,10]}});
 }
 return records;
};
