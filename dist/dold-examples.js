(function(root){
'use strict';
const S=root.DTSStarterProjects;if(!S)return;
let wi=0;
const W=(a,ap,b,bp,color='#8b5a2b',role='+24V',points=[])=>({id:'dw'+(++wi),from:{c:a,p:ap},to:{c:b,p:bp},color,role,size:'1.5',points});
const C=(id,typeId,x,y,ref,label,state=false,extra={})=>({id,typeId,x,y,rotation:0,ref,label,state,address:'',note:'',...extra});
const base=(name,components,wires,workspaceMode='control')=>({version:7,workspaceMode,name,symbolNorm:'IEC',preferredAppearance:'material',components,wires,junctions:[],colorRoles:{'#8b5a2b':'+24V','#111827':'0V','#e53935':'L1','#1e88e5':'N','#43a047':'SIGNAL','#f9a825':'SIGNAL'}});
function power(cs,ws){cs.push(C('src','supply-1p',60,110,'G1','1 Faz Besleme'),C('ps','smps',250,100,'G2','230 VAC → 24 VDC'));ws.push(W('src','L','ps','L','#e53935','L1'),W('src','N','ps','N','#1e88e5','N'))}
function lampOutput(cs,ws,dev,pair=['13','14']){cs.push(C('lamp','lamp-green',1450,320,'H1','Güvenlik çıkışı aktif'));ws.push(W('ps','P',dev,pair[0]),W(dev,pair[1],'lamp','X1'),W('lamp','X2','ps','M','#111827','0V'))}
function estopExample(typeId,name,kind='bo'){
 wi=0;const cs=[],ws=[];power(cs,ws);cs.push(C('safe',typeId,700,220,'KSR1',name),C('estop','safety-estop-2nc',480,560,'S0','2 kanallı Acil Stop'),C('start','push-no',920,570,'S1','Start · basıp bırakın'));
 ws.push(W('ps','P','safe','A1'),W('ps','M','safe','A2','#111827','0V'));
 if(kind==='bn'){ws.push(W('ps','P','estop','11'),W('estop','12','safe','T12'),W('ps','P','estop','21'),W('estop','22','safe','T22'),W('safe','T11','start','13'),W('start','14','safe','T34'),W('safe','X1','safe','X2','#43a047','SIGNAL'))}
 else{ws.push(W('safe','S11','estop','11'),W('estop','12','safe','S12'),W('safe','S21','estop','21','#111827','0V'),W('estop','22','safe','S22','#111827','0V'),W('safe','S21','safe','S23','#111827','0V'),W('safe','Y1','start','13'),W('start','14','safe','Y2'),W('safe','X1','safe','X2','#43a047','SIGNAL'))}
 lampOutput(cs,ws,'safe');return base(name+' · üretici kullanım örneği',cs,ws);
}
function twoHand(typeId,name,bh=false){
 wi=0;const cs=[],ws=[];power(cs,ws);cs.push(C('safe',typeId,720,220,'KSR1',name),C('b1','safety-button-2no2nc',470,560,'S1','Sol iki-el butonu'),C('b2','safety-button-2no2nc',760,560,'S2','Sağ iki-el butonu'));
 ws.push(W('ps','P','safe','A1'),W('ps','M','safe','A2','#111827','0V'),W('safe','Y1','safe','Y2','#43a047','SIGNAL'),W('safe','S12','b1','13'),W('b1','14','safe','S11'),W('safe','S22','b2','13','#111827','0V'),W('b2','14','safe','S21','#111827','0V'));
 if(bh)ws.push(W('safe','S13','b1','21','#111827','0V'),W('b1','22','safe','S11','#111827','0V'),W('safe','S23','b2','21'),W('b2','22','safe','S21'));
 else ws.push(W('safe','S22','b1','21','#111827','0V'),W('b1','22','safe','S11','#111827','0V'),W('safe','S12','b2','21'),W('b2','22','safe','S21'));
 lampOutput(cs,ws,'safe');return base(name+' · iki el örneği',cs,ws);
}
function lgExample(typeId,name){
 wi=0;const cs=[],ws=[];power(cs,ws);cs.push(C('safe',typeId,700,220,'KSR1',name),C('guard','dold-ne5021-02',480,560,'B1','NE 5021.02 · kapı kapalı',true),C('start','push-no',900,570,'S1','Start · basıp bırakın'));
 ws.push(W('ps','P','safe','A1'),W('ps','M','safe','A2','#111827','0V'),W('safe','S11','guard','13'),W('guard','14','safe','S12'),W('safe','S21','guard','23','#111827','0V'),W('guard','24','safe','S22','#111827','0V'),W('safe','S33','start','13'),W('start','14','safe','S34'));
 lampOutput(cs,ws,'safe');return base(name+' · NE 5021 örneği',cs,ws);
}
function encoderControl(){
 wi=0;const cs=[],ws=[];power(cs,ws);cs.push(C('enc','encoder-incremental',650,250,'ENC1','38 mm A/B/Z enkoder',false,{encoderPPR:100,encoderRPM:60,encoderAuto:true}),C('la','lamp-green',1120,180,'HA','A kanalı'),C('lb','lamp-yellow',1120,330,'HB','B kanalı'),C('lz','lamp-red',1120,480,'HZ','Z indeks'));
 ws.push(W('ps','P','enc','+'),W('ps','M','enc','−','#111827','0V'));for(const [id,p] of [['la','A'],['lb','B'],['lz','Z']]){ws.push(W('ps','P',id,'X1'));ws.push(W(id,'X2','enc',p,'#43a047','SIGNAL'))}
 return base('Artımlı enkoder · 24 V NPN A/B/Z',cs,ws);
}
function encoderArduino(){
 wi=0;const code='volatile long count=0;\nvoid onA(){ if(digitalRead(2)==digitalRead(3)) count++; else count--; }\nvoid setup(){ pinMode(2,INPUT_PULLUP); pinMode(3,INPUT_PULLUP); pinMode(4,INPUT_PULLUP); attachInterrupt(digitalPinToInterrupt(2),onA,CHANGE); Serial.begin(9600); }\nvoid loop(){ Serial.println(count); delay(100); }';
 const cs=[C('uno','arduino-uno',220,280,'ARD1','Arduino UNO R3',false,{arduinoSketch:code,arduinoProgramName:'Industrial_AB_Encoder'}),C('enc','encoder-incremental',780,280,'ENC1','38 mm endüstriyel enkoder',false,{encoderPPR:360,encoderRPM:120,encoderAuto:true})];
 const ws=[W('uno','5V','enc','+','#e53935','+5V'),W('uno','GND','enc','−','#111827','GND'),W('uno','D2','enc','A','#43a047','SIGNAL'),W('uno','D3','enc','B','#43a047','SIGNAL'),W('uno','D4','enc','Z','#f9a825','SIGNAL')];
 return base('Arduino UNO + endüstriyel A/B/Z enkoder',cs,ws,'arduino');
}
Object.assign(S,{
 dold_bg5933:twoHand('dold-bg5933-22','DOLD BG 5933.22',false),
 dold_bh5933:twoHand('dold-bh5933-48','DOLD BH 5933.48',true),
 dold_bn5930:estopExample('dold-bn5930-48','DOLD BN 5930.48','bn'),
 dold_bo5988_47:estopExample('dold-bo5988-47','DOLD BO 5988.47','bo'),
 dold_bo5988_61:estopExample('dold-bo5988-61','DOLD BO 5988.61','bo'),
 dold_bo5988_62:estopExample('dold-bo5988-62','DOLD BO 5988.62','bo'),
 dold_lg5925_02:lgExample('dold-lg5925-02','DOLD LG 5925.02/920'),
 dold_lg5925_04:lgExample('dold-lg5925-04','DOLD LG 5925.04/920'),
 dold_lg5925_48:lgExample('dold-lg5925-48','DOLD LG 5925.48/920'),
 encoder_control_119:encoderControl(),encoder_arduino_119:encoderArduino()
});
})(typeof window==='undefined'?globalThis:window);
