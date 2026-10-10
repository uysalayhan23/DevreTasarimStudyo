// Regenerate the self-contained, offline instrument examples.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../..'),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'dist/library.js'),'utf8'),ctx);
const by=Object.fromEntries(ctx.window.COMPONENT_LIBRARY.map(d=>[d.id,d]));
const c=(id,typeId,x,y,extra={})=>({id,typeId,x,y,rotation:0,ref:id.toUpperCase(),label:by[typeId].name,...extra});
const supply=()=>c('g','supply-dc-plus',140,200,{ref:'24 VDC'});
const w=(a,p,b,q)=>({from:{c:a,p},to:{c:b,p:q}});
const make=(name,components,wires)=>({version:7,name,workspaceMode:'control',preferredAppearance:'material',components,wires:wires.map((v,i)=>({id:'w'+i,...v})),junctions:[]});
const examples={
 ht2115:make('Gentek_HT2_Sicaklik_ve_Nem',[
  supply(),c('b','sensor-temperature-humidity',480,240,{instrumentSettings:{temperature:20,humidity:25,measurement:'both',output:'4-20mA'},note:'20 °C → 12 mA; %25 RH → 8 mA. Özelliklerden sıcaklık, nem ve çıkış türünü değiştir.'}),
  c('it','meter-ammeter',950,160,{ref:'T · mA'}),c('irh','meter-ammeter',950,440,{ref:'RH · mA'})
 ],[w('g','P','b','+'),w('g','M','b','−'),w('b','T','it','1'),w('it','2','b','−'),w('b','RH','irh','1'),w('irh','2','b','−')]),
 waz115:make('WAZ5_0_10V_4_20mA',[
  supply(),c('b','converter-pressure',500,180,{instrumentSettings:{source:'manual',inputValue:5},note:'Giriş değerini 0–10 V arasında değiştir. 0 V → 4 mA; 5 V → 12 mA; 10 V → 20 mA.'}),c('i','meter-ammeter',960,330,{ref:'Çıkış · mA'})
 ],[w('g','P','b','4'),w('g','M','b','5'),w('b','7','i','1'),w('i','2','b','8')]),
 rtd115:make('ORDEL_HMTR_PT100_Dongusu',[
  supply(),c('b','converter-temperature',550,220,{instrumentSettings:{input:'PT100',low:0,high:100},note:'PT100: 4–5; köprü: 5–6. 50 °C → 119.397 Ω → 12 mA.'}),c('r','sensor-pt100-2wire',180,570,{temperature:50,ref:'PT100'}),c('i','meter-ammeter',1050,300,{ref:'Döngü · mA'})
 ],[w('g','P','b','2'),w('b','1','i','1'),w('i','2','g','M'),w('b','4','r','A'),w('b','5','r','B1'),w('b','5','b','6')]),
 tc115:make('ORDEL_HMTT_Termokupl_Dongusu',[
  supply(),c('b','converter-temperature',550,220,{instrumentSettings:{input:'K',low:0,high:800},note:'K tipi TC: 4(+)–5(−). 400 °C → 12 mA. Sensör ile dönüştürücü tipi aynı olmalı.'}),c('r','thermocouple',170,580,{temperature:400,coldJunction:25,thermocoupleType:'K',ref:'K TC'}),c('i','meter-ammeter',1050,300,{ref:'Döngü · mA'})
 ],[w('g','P','b','2'),w('b','1','i','1'),w('i','2','g','M'),w('b','4','r','+'),w('b','5','r','−')]),
 enda115:make('ENDA_ET4420_PT100_Kontrol',[
  supply(),c('b','temperature-controller',520,180,{instrumentSettings:{supply:'LV',input:'PT100',set:100,pb:0,filter:1,hy:2,controlOutput:'relay'},note:'Sensörü 100 °C üstüne çıkar: C/A2 rölesi ve ısıtma lambası kapanır. 98 °C altına indir: yeniden açılır.'}),c('r','sensor-pt100-2wire',170,630,{temperature:25,ref:'PT100'}),c('h','lamp-red',1090,370,{ref:'Isıtma'})
 ],[w('g','P','b','11'),w('g','M','b','12'),w('b','9','r','A'),w('b','10','r','B1'),w('b','8','b','9'),w('g','P','b','14'),w('b','15','h','X1'),w('h','X2','g','M')]),
 tx115:make('Baykon_TX11_Loadcell_Analog',[
  supply(),c('b','weighing-indicator',620,180,{instrumentSettings:{capacity:1000,spanMv:10,zeroMv:0,output:'4-20mA'},note:'250 kg → 2.5 mV → 8 mA. Yük hücresinin yük değerini değiştir.'}),c('r','load-cell',200,570,{loadWeight:250,loadCapacity:1000,ref:'1000 kg / 2 mV/V'}),c('i','meter-ammeter',1040,240,{ref:'Çıkış · mA'})
 ],[w('g','P','b','+'),w('g','M','b','−'),w('b','EX+','r','EX+'),w('b','EX−','r','EX−'),w('r','SIG+','b','S+'),w('r','SIG−','b','S−'),w('b','I','i','1'),w('i','2','b','G')]),
 meter115:make('UT33D_Hareketli_Problar',[
  c('g','supply-dc-plus',900,280,{ref:'24 VDC'}),c('m','unit-ut33d-plus',320,200,{meterPosition:4,note:'DC 200 V kademesi: 24 V. Simülasyonda prob gövdesini tutup terminale yaklaştır veya uzaklaştır. Problar boşta iken ölçüm değişir.'}),
  c('red','test-probe-red',760,297,{probeFor:'m',probeTarget:{c:'g',p:'P'},ref:'+'}),c('black','test-probe-black',852,297,{probeFor:'m',probeTarget:{c:'g',p:'M'},ref:'COM'})
 ],[w('m','V','red','PLUG'),w('m','COM','black','PLUG')]),
 lit115:make('Isikli_Buton_Bagimsiz_Lamba',[
  supply(),c('b','illuminated-push',520,260,{deviceColor:'#16a34a',note:'X1/X2 bağımsız lamba beslemesidir. Buton ışığı sürekli yanar; butona basılı tutulurken H1 yanar.'}),c('h','lamp-green',1000,360,{ref:'H1'})
 ],[w('g','P','b','13'),w('b','14','h','X1'),w('h','X2','g','M'),w('g','P','b','X1'),w('g','M','b','X2')])
};
// Align movable probe tips to the real material terminals, not guessed pixels.
const Symbols=require('../../dist/symbols.js'),Assemblies=require('../../dist/assemblies.js'),prepared=Symbols.prepareLibrary(ctx.window.COMPONENT_LIBRARY),defs=Object.fromEntries(prepared.map(d=>[d.id,d]));
const p=examples.meter115,source=p.components[0];for(const probe of p.components.filter(c=>c.probeFor)){const d=Assemblies.definition(defs[source.typeId],source,'material'),target=Symbols.rotatedPoint(d.pins.find(q=>q.id===probe.probeTarget.p),d,0);probe.x=source.x+target.x-140;probe.y=source.y+target.y-20}
for(const p of Object.values(examples))fs.writeFileSync(path.join(root,'Ornekler',p.name+'_v1.15.odsdevre'),JSON.stringify(p,null,2)+'\n');
fs.writeFileSync(path.join(root,'dist/starter-v115.js'),'Object.assign(window.DTSStarterProjects,'+JSON.stringify(examples)+');\n');
console.log(Object.keys(examples).length+' v1.15 examples generated');
