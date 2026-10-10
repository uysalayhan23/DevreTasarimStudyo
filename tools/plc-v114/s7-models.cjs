// Siemens S7-1200 System Manual V4.7 (12/2024), connector tables X10/X11/X12.
// Front physical layout is based on Siemens front elevation and the user's supplied 1211C/1212C/1214C/1215C photos.
// IMPORTANT: the example PLC controls only the visual presentation. Each CPU keeps its own manufacturer terminal count/order.
module.exports=function(){
 const records=[],signals=(p,n,start=0)=>Array.from({length:n},(_,j)=>p+' '+(start+j<8?'a.':'b.')+(start+j)%8);
 for(const size of [1211,1212,1214,1215,1217])for(const variant of size===1217?['A']:['A','B','H']){
  const ac=variant==='B',relay=variant!=='A',
   di={1211:6,1212:8,1214:14,1215:14,1217:14}[size],
   dout={1211:4,1212:6,1214:10,1215:10,1217:10}[size],
   ao=size>=1215?2:0;
  const part='6ES7'+String(size).slice(1)+'-1'+variant+(size<=1212?'E':'G')+'40-0XB0',
   model='CPU '+size+'C '+(ac?'AC':'DC')+'/DC/'+(relay?'Relay':'DC');
  const w=size<=1212?320:size===1217?580:440,h=size<=1212?360:size===1214?400:size===1215?340:400;

  let top=[ac?'L1':'L+',ac?'N':'M','FE','L+ sensor','M sensor','1M',...signals('DI',size===1217?10:di)];
  if(size===1211)top.push(null,null);
  const analog=ao?[size===1217?'3M':'2M','AQ 0','AQ 1',size===1217?'4M':'3M','AI 0','AI 1']:['2M','AI 0','AI 1'];
  let outputs=relay
    ?(size===1211?['1L',...signals('DQ',4),null,null,null]
      :size===1212?['1L',...signals('DQ',4),'2L',...signals('DQ',2,4)]
      :['1L',...signals('DQ',5),'2L',...signals('DQ',5,5)])
    :[ao?'4L+':'3L+',ao?'4M':'3M',...signals('DQ',dout)];
  if(size===1211&&!relay)outputs.push(null,null);
  if(size===1217)outputs=['5M','5M',...Array.from({length:4},(_,i)=>['DQ a.'+i+'+','DQ a.'+i+'-']).flat(),'6L+','6M',...signals('DQ',6,4)];

  let rows;
  if(size===1217){
   rows=[
    {id:'X10',side:'top',x:20,y:30,labels:top},
    {id:'X11',side:'top',x:360,y:30,labels:['2M','2M',...Array.from({length:4},(_,i)=>['DI b.'+(i+2)+'+','DI b.'+(i+2)+'-']).flat()]},
    {id:'X12',side:'bottom',x:20,y:h-30,labels:analog},
    {id:'X13',side:'bottom',x:w-20-(outputs.length-1)*20,y:h-30,labels:outputs}
   ];
  }else{
   const pitch=10,x10=30,x11=w-30-(analog.length-1)*pitch,x12=w-30-(outputs.length-1)*pitch;
   // On the real compact CPUs X10 and the gold X11 analog connector are under the upper cover;
   // X12 is under the lower cover. Connector numbering and empty cavities are retained.
   rows=[
    {id:'X10',side:'top',x:x10,y:72,pitch,labels:top},
    {id:'X11',side:'top',x:x11,y:72,pitch,labels:analog,gold:true},
    {id:'X12',side:'bottom',x:x12,y:h-72,pitch,labels:outputs}
   ];
  }

  const pins=[],materialPins=[];
  for(const row of rows)for(const [i,label] of row.labels.entries())if(label){
   const signalType=/^DI /.test(label)?(label.endsWith('-')?'DI_RETURN':'DI')
    :/^DQ /.test(label)?(label.endsWith('-')?'DO_RETURN':'DO')
    :/^AI /.test(label)?'AI':/^AQ /.test(label)?'AO':'POWER';
   const pitch=row.pitch||20,x=row.x+i*pitch,y=row.side==='top'?0:h;
   const p={id:row.id+':'+(i+1),label,side:row.side,block:row.id,terminal:i+1,signalType,x,y};
   pins.push(p);
   materialPins.push({...p,y:row.y,labelOffset:{x:0,y:row.side==='top'?12:-12},labelSize:row.pitch===10?4.2:5});
  }
  const source=size===1217
   ?'Siemens S7-1200 System Manual · CPU 1217C connector tables'
   :'Siemens S7-1200 System Manual V4.7 · CPU '+size+'C connector tables X10/X11/X12';
  records.push({
   id:'plc-hw-'+part.toLowerCase(),category:'PLC/Otomasyon',catalogGroup:'cpu',brand:'Siemens',series:'S7-1200',
   part,model:part,name:model,kind:'plc',isPLC:true,orientation:'front',w,h,pins,materialPins,documented:true,
   io:{DI:di,DO:dout,AI:2,AO:ao},powerSupply:ac?'120–240 VAC':'24 VDC',outputType:relay?'relay':'PNP',
   terminalSource:source,
   visualInfo:{match:'manufacturer-front-redraw',model:model+' · düz ön görünüş',part,source:source+' + kullanıcı tarafından yüklenen ön yüz fotoğrafları'},
   plcFront:{family:'siemens-s71200',generation:'S7-1200',variant,size,rows,sourcePages:source,forceFront:true,userReference:true}
  });
 }
 return records;
};
