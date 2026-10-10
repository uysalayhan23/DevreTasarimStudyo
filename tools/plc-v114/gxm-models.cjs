// GXM_TR.pdf rev.4 pp.3-19 and the model-specific manufacturer photographs.
module.exports=function(){
 const out=[],range=(n,p,start=0)=>Array.from({length:n},(_,i)=>p+(i+start)),bank=(id,y,labels)=>({id,side:'right',x:60,y,vertical:true,pitch:10,labels});
 const input=(n,start=0)=>['COM',...range(n,'IP',start)],transistor=(n,start=0)=>['−V',...range(n,'QP',start),'+V'];
 const relay4=['QP0','COM0','QP1','COM1','QP2','QP3','COM2'],relay8=[...relay4,...range(4,'QP',4),'COM3'];
 const analogIn=Array.from({length:4},(_,i)=>['AI'+i+' V+','AI'+i+' −','AI'+i+' I+']).flat();
 const analogOut=['AO0 I−','AO0 I+','AO0 V−','AO0 V+','PE','AO1 I−','AO1 I+','AO1 V−','AO1 V+'];
 const setups=[
 ['44RA',4,4,0,0,[bank('IP',20,input(4)),bank('QP',150,relay4)]],
 ['80IA',8,0,0,0,[bank('IP',20,input(8))]],
 ['08TA',0,8,0,0,[bank('QP',170,transistor(8))]],
 ['88RA',8,8,0,0,[bank('IP',20,input(8)),bank('QP',150,relay8)]],
 ['88TA',8,8,0,0,[bank('IP',20,input(8)),bank('QP',170,transistor(8))]],
 ['16IA',16,0,0,0,[bank('IP0',20,input(8)),bank('IP1',180,input(8,8))]],
 ['16TA',0,16,0,0,[bank('QP0',20,transistor(8)),bank('QP1',170,transistor(8,8))]],
 ['40AN',0,0,4,0,[bank('AI',150,analogIn)]],
 ['42AN',0,0,4,2,[bank('AO',20,analogOut),bank('AI',150,analogIn)]],
 ['02AN',0,0,0,2,[bank('AO',20,analogOut)]],
 ['06AN',0,0,0,6,[bank('AO0',20,Array.from({length:3},(_,i)=>['AO'+i+' I+','AO'+i+' −','AO'+i+' V+']).flat()),bank('AO1',180,Array.from({length:3},(_,i)=>['AO'+(i+3)+' I+','AO'+(i+3)+' −','AO'+(i+3)+' V+']).flat())]],
 ...[1,2].map(n=>[n+'0L',0,0,n,0,[bank('LOAD',n===1?210:150,Array.from({length:n},(_,i)=>['+EX','+SN','+SG','−SG','−SN','−EX'].map(x=>'CH'+i+' '+x)).flat())]]),
 ...[2,4].map(n=>[n+'0UA',0,0,n,0,[bank('TEMP',n===2?210:150,Array.from({length:n},(_,i)=>['T1','T2','T3'].map(x=>'CH'+i+' '+x)).flat())]])
 ];
 for(const [suffix,DI,DO,AI,AO,rows] of setups){
  const part='GXM-'+suffix,w=80,h=280,pins=[],materialPins=[],source='https://gmtwebfiles.ams3.cdn.digitaloceanspaces.com/GMTCNT/KULLANIM%20KLAVUZLARI/GXM_TR.pdf';
  for(const row of rows)for(const [i,label] of row.labels.entries()){
   const signalType=/^IP\d/.test(label)?'DI':/^QP\d/.test(label)?'DO':/^AI\d V\+|^CH\d (T1|\+SG)$/.test(label)?'AI':/^AO\d V\+/.test(label)?'AO':/^AI|^AO|^CH/.test(label)?'ANALOG_ALTERNATE':'POWER';
   const p={id:row.id+':'+(i+1),label,block:row.id,terminal:i+1,signalType,side:'right',x:w,y:20+pins.length*10};pins.push(p);materialPins.push({...p,x:60,y:row.y+i*10,labelOffset:{x:-22,y:2},labelSize:4.2});
  }
  const catalogGroup=DI&&DO?'digital-io':DI?'digital-in':DO?'digital-out':suffix.endsWith('L')||suffix.endsWith('UA')?'technology':AI&&AO?'analog-io':AI?'analog-in':'analog-out';
  out.push({id:'plc-hw-'+part.toLowerCase(),category:'PLC/Otomasyon',catalogGroup,brand:'GMTCNT',series:'GXM Serisi',name:part,model:part,part,kind:'plc',isPLC:true,orientation:'front',w,h,pins,materialPins,documented:true,io:{DI,DO,AI,AO},terminalSource:'GMTCNT GXM Rev.4 · s.3–19; '+part+' ürün fotoğrafı',visualInfo:{match:'representative',part,model:part+' · önden SVG uyarlama',source},plcFront:{family:'gmt-gxm',generation:'GXM',variant:suffix,rows,statusChannels:AI||AO}});
 }
 return out;
};
