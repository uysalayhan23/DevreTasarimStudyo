(function(root){
'use strict';
const S=root.DTSStarterProjects;if(!S)return;let n=0;
const W=(a,ap,b,bp,color='#8b5a2b',role='CONTROL')=>({id:'hw'+(++n),from:{c:a,p:ap},to:{c:b,p:bp},color,role,size:'1.5',points:[]});
const C=(id,typeId,x,y,ref,label,extra={})=>({id,typeId,x,y,rotation:0,ref,label,state:false,address:'',note:'',...extra});
const base=(name,cs,ws)=>({version:7,workspaceMode:'control',name,projectId:'hcfa-'+name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),symbolNorm:'IEC',preferredAppearance:'material',components:cs,wires:ws,junctions:[],colorRoles:{'#e53935':'L1','#1e88e5':'N','#8b5a2b':'+24V','#111827':'0V','#43a047':'SIGNAL','#7c3aed':'SIGNAL'}});
function core(name,hcfa={}){
 n=0;const cs=[
  C('ac','supply-1p',70,80,'G1','1~ 230 VAC'),
  C('dc','supply-dc-plus',70,360,'G2','24 VDC kontrol'),
  C('drv','hcfa-sv-x2ea040a-a',520,80,'SD1','SV-X2EA040A-A',{hcfa}),
  C('mot','hcfa-sv-x2mh040a-n2ln',1280,250,'M1','SV-X2MH040A-N2LN')
 ],ws=[
  W('ac','L','drv','L1','#e53935','L1'),W('ac','N','drv','L2','#1e88e5','N'),
  W('drv','U','mot','U','#e53935','MOTOR'),W('drv','V','mot','V','#f9a825','MOTOR'),W('drv','W','mot','W','#43a047','MOTOR'),
  W('drv','CN2','mot','ENC','#7c3aed','ENCODER')
 ];return {cs,ws,name};
}
function pulse(){
 const x=core('HCFA X2E · NPN pulse direction',{params:{'P00.01':0,'P00.05':0,'P00.08':10000,'P04.11':1}});
 x.cs.push(C('pto','hcfa-pulse-source',180,610,'PTO1','24 V PTO',{pulseHz:5000,pulseDirection:1}));
 x.ws.push(W('dc','P','pto','24V'),W('dc','M','pto','0V','#111827','0V'),W('dc','P','drv','CN1:35'),W('pto','PULSE','drv','CN1:43','#43a047','PULSE'),W('pto','DIR','drv','CN1:39','#7c3aed','DIRECTION'));
 return base(x.name,x.cs,x.ws);
}
function internal(){
 const x=core('HCFA X2E · 16 kademeli dahili pozisyon',{params:{'P00.01':0,'P00.05':2,'P04.01':1,'P04.02':25,'P04.11':1,'P08.00':2,'P08.04':0,'P08.06':10000,'P08.08':500,'P08.09':100}});
 x.cs.push(C('trig','push-no',220,610,'S1','Dahili pozisyon tetik'));
 x.ws.push(W('dc','P','trig','13'),W('trig','14','drv','CN1:10','#43a047','DI2'),W('dc','M','drv','CN1:11','#111827','0V'));
 return base(x.name,x.cs,x.ws);
}
function modbus(name,mode,value){
 const params={'P00.01':mode,'P09.00':1,'P09.01':2,'P09.02':1,'P09.05':2};
 if(mode===1){params['P03.00']=0;params['P03.03']=value;}
 if(mode===2){params['P03.25']=value;params['P03.27']=1500;params['P03.28']=1500;}
 if(mode===0){params['P00.05']=2;params['P08.04']=0;params['P08.06']=value;params['P08.08']=500;}
 const hcfa={params,commDI:2,commandPosition:mode===0?value:0};
 const x=core(name,hcfa);x.cs.push(C('hmi','hcfa-modbus-master',190,610,'HMI1','RS485 Modbus master'));
 x.ws.push(W('hmi','485+','drv','CN4:4','#43a047','RS485+'),W('hmi','485-','drv','CN4:5','#7c3aed','RS485-'));
 return base(name,x.cs,x.ws);
}
Object.assign(S,{
 hcfa_x2e_pulse_npn:pulse(),
 hcfa_x2e_internal_position:internal(),
 hcfa_x2e_modbus_speed:modbus('HCFA X2E · Modbus hız kontrolü',1,750),
 hcfa_x2e_modbus_torque:modbus('HCFA X2E · Modbus tork kontrolü',2,50),
 hcfa_x2e_modbus_position:modbus('HCFA X2E · Modbus pozisyon kontrolü',0,10000)
});
})(typeof window==='undefined'?globalThis:window);
