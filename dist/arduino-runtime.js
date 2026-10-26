(function(root){
  'use strict';
  const Library=typeof module==='object'&&module.exports?require('./arduino-library.js'):root.DTSArduinoLibrary;
  const Examples=typeof module==='object'&&module.exports?require('./arduino-examples.js'):root.DTSArduinoExamples;
  const IncrementalEncoder=typeof module==='object'&&module.exports?require('./incremental-encoder.js'):root.DTSIncrementalEncoder;
  const clamp=(v,a,b,f=a)=>Number.isFinite(Number(v))?Math.max(a,Math.min(b,Number(v))):f;
  const uid=()=> 'arduino-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
  const sketches=Object.fromEntries((Examples?.catalog||[]).map(x=>[x.id,{name:x.title,title:x.title,code:x.code,circuit:x.circuit,compatibility:x.compatibility,simSupport:x.simSupport}]));
  sketches.blank={name:'Blank',title:'Boş Sketch',code:'void setup() {\n\n}\n\nvoid loop() {\n\n}\n',circuit:'board',compatibility:'UNO R3',simSupport:'full'};
  const strip=s=>String(s||'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/.*$/gm,'');
  const matching=(s,i,o,c)=>{let d=0,q='';for(let j=i;j<s.length;j++){const x=s[j],p=s[j-1];if(q){if(x===q&&p!=='\\')q='';continue}if(x==='"'||x==="'"){q=x;continue}if(x===o)d++;else if(x===c&&--d===0)return j}return -1};
  function body(code,name){const re=new RegExp('\\bvoid\\s+'+name+'\\s*\\([^)]*\\)\\s*\\{','m'),m=re.exec(code);if(!m)return '';const start=m.index+m[0].length,end=matching(code,start-1,'{','}');return end<0?'':code.slice(start,end)}
  const skip=(s,i)=>{while(i<s.length&&/\s/.test(s[i]))i++;return i};
  function statement(s,i){let d=0,q='';for(let j=i;j<s.length;j++){const x=s[j],p=s[j-1];if(q){if(x===q&&p!=='\\')q='';continue}if(x==='"'||x==="'"){q=x;continue}if(x==='(')d++;else if(x===')')d--;else if(x===';'&&d===0)return {text:s.slice(i,j).trim(),index:j+1};else if(x==='}'&&d===0)return {text:s.slice(i,j).trim(),index:j}}return {text:s.slice(i).trim(),index:s.length}}
  function parse(s,start=0,endChar=''){const nodes=[];let i=start;while(i<s.length){i=skip(s,i);if(endChar&&s[i]===endChar)return {nodes,index:i+1};if(i>=s.length)break;
    if(s.slice(i,i+2)==='if'&&!/\w/.test(s[i+2]||'')){i=skip(s,i+2);const pe=matching(s,i,'(',')');if(s[i]!=='('||pe<0)throw Error('if koşulu okunamadı');const condition=s.slice(i+1,pe);i=skip(s,pe+1);let yes=[],no=[];if(s[i]==='{'){const r=parse(s,i+1,'}');yes=r.nodes;i=r.index}else{const r=statement(s,i);yes=[{type:'stmt',text:r.text}];i=r.index}i=skip(s,i);if(s.slice(i,i+4)==='else'&&!/\w/.test(s[i+4]||'')){i=skip(s,i+4);if(s[i]==='{'){const r=parse(s,i+1,'}');no=r.nodes;i=r.index}else{const r=statement(s,i);no=[{type:'stmt',text:r.text}];i=r.index}}nodes.push({type:'if',expr:condition,yes,no});continue}
    if(s.slice(i,i+3)==='for'&&!/\w/.test(s[i+3]||'')){i=skip(s,i+3);const pe=matching(s,i,'(',')');if(s[i]!=='('||pe<0)throw Error('for ifadesi okunamadı');const parts=s.slice(i+1,pe).split(';');if(parts.length!==3)throw Error('for ifadesi üç bölüm içermeli');i=skip(s,pe+1);let b=[];if(s[i]==='{'){const r=parse(s,i+1,'}');b=r.nodes;i=r.index}else{const r=statement(s,i);b=[{type:'stmt',text:r.text}];i=r.index}nodes.push({type:'for',init:parts[0],cond:parts[1],inc:parts[2],body:b});continue}
    if(s.slice(i,i+5)==='while'&&!/\w/.test(s[i+5]||'')){i=skip(s,i+5);const pe=matching(s,i,'(',')');if(s[i]!=='('||pe<0)throw Error('while ifadesi okunamadı');const condition=s.slice(i+1,pe);i=skip(s,pe+1);let b=[];if(s[i]==='{'){const r=parse(s,i+1,'}');b=r.nodes;i=r.index}else{const r=statement(s,i);b=[{type:'stmt',text:r.text}];i=r.index}nodes.push({type:'while',expr:condition,body:b});continue}
    const r=statement(s,i);if(r.text)nodes.push({type:'stmt',text:r.text});i=r.index}return {nodes,index:i}}
  function compile(code){
    const clean=strip(code),sb=body(clean,'setup'),lb=body(clean,'loop'),seb=body(clean,'serialEvent');if(!sb&&!lb)throw Error('setup() veya loop() bulunamadı.');
    const splitDecls=s=>{const out=[];let start=0,d=0,q='';for(let i=0;i<=s.length;i++){const ch=s[i],prev=s[i-1];if(i===s.length||(!q&&d===0&&ch===',')){out.push(s.slice(start,i).trim());start=i+1;continue}if(q){if(ch===q&&prev!=='\\')q='';continue}if(ch==='"'||ch==="'"){q=ch;continue}if(ch==='('||ch==='['||ch==='{')d++;else if(ch===')'||ch===']'||ch==='}')d--}return out.filter(Boolean)};
    const globals=[];for(const m of clean.matchAll(/^\s*#define\s+([A-Za-z_]\w*)\s+([^\r\n/]+)\s*$/gm)){const v=m[2].trim();if(v&&!/\(|\)/.test(m[1]))globals.push({type:'stmt',text:'long '+m[1]+' = '+v})}const re=/(?:^|\n)\s*((?:(?:const|volatile)\s+)?(?:(?:unsigned\s+)?(?:int|long|short)|float|double|bool|boolean|byte|char|String))\s+([^;\n]+);/g;
    for(const m of clean.matchAll(re))for(const decl of splitDecls(m[2]))globals.push({type:'stmt',text:m[1]+' '+decl});
    const objects={};
    for(const m of clean.matchAll(/\bSoftwareSerial\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*;/g))objects[m[1]]={kind:'softwareSerial',args:m[2].split(',').map(x=>x.trim()).filter(Boolean)};
    for(const m of clean.matchAll(/\bLiquidCrystal\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*;/g))objects[m[1]]={kind:'lcd1602',args:m[2].split(',').map(x=>x.trim()).filter(Boolean)};
    for(const m of clean.matchAll(/\bLiquidCrystal_I2C\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*;/g))objects[m[1]]={kind:'lcd1602i2c',args:m[2].split(',').map(x=>x.trim()).filter(Boolean)};
    for(const m of clean.matchAll(/\bDHT\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*;/g))objects[m[1]]={kind:'dht',args:m[2].split(',').map(x=>x.trim()).filter(Boolean)};
    for(const m of clean.matchAll(/\bHX711\s+([A-Za-z_]\w*)\s*;/g))objects[m[1]]={kind:'hx711',args:[]};
    for(const m of clean.matchAll(/\bServo\s+([A-Za-z_]\w*)\s*;/g))objects[m[1]]={kind:'servo',args:[]};
    for(const m of clean.matchAll(/\bStepper\s+([A-Za-z_]\w*)\s*(?:=\s*Stepper\s*)?\(([^)]*)\)\s*;/g))objects[m[1]]={kind:'stepper',args:m[2].split(',').map(x=>x.trim()).filter(Boolean)};
    for(const m of clean.matchAll(/\bAccelStepper\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*;/g))objects[m[1]]={kind:'accelStepper',args:m[2].split(',').map(x=>x.trim()).filter(Boolean)};
    for(const m of clean.matchAll(/\bAdafruit_NeoPixel\s+([A-Za-z_]\w*)\s*(?:=\s*Adafruit_NeoPixel\s*)?\(([^)]*)\)\s*;/g))objects[m[1]]={kind:'neopixel',args:m[2].split(',').map(x=>x.trim()).filter(Boolean)};
    for(const m of clean.matchAll(/\bAdafruit_SSD1306\s+([A-Za-z_]\w*)\s*(?:=\s*Adafruit_SSD1306\s*)?\(([^)]*)\)\s*;/g))objects[m[1]]={kind:'ssd1306',args:m[2].split(',').map(x=>x.trim()).filter(Boolean)};
    const functions={};
    for(const m of clean.matchAll(/\bvoid\s+([A-Za-z_]\w*)\s*\(\s*\)\s*\{/g)){
      const name=m[1];if(['setup','loop','serialEvent'].includes(name))continue;
      const start=m.index+m[0].length,end=matching(clean,start-1,'{','}');if(end<0)continue;
      functions[name]=parse(clean.slice(start,end)).nodes;
    }
    return {source:String(code||''),setup:globals.concat(parse(sb).nodes),loop:parse(lb).nodes,serialEvent:seb?parse(seb).nodes:[],objects,functions};
  }
  const banned=/\b(?:constructor|prototype|__proto__|window|document|globalThis|Function|eval|this|localStorage|fetch)\b/;
  function pinName(v){if(typeof v==='string'&&/^A[0-5]$/.test(v))return v;const n=Number(v);if(Number.isFinite(n)){if(n>=14&&n<=19)return 'A'+(n-14);return 'D'+Math.max(0,Math.min(13,Math.round(n)))}return String(v)}
  const key=(c,p)=>c+'|'+p,jkey=j=>'J|'+j;
  function graph(project,byId){const parent=new Map(),find=x=>{if(!parent.has(x))parent.set(x,x);let y=x;while(parent.get(y)!==y)y=parent.get(y);while(parent.get(x)!==x){const n=parent.get(x);parent.set(x,y);x=n}return y},join=(a,b)=>{a=find(a);b=find(b);if(a!==b)parent.set(a,b)},ep=r=>r?.j?jkey(r.j):key(r?.c,r?.p);for(const c of project.components)for(const p of byId[c.typeId]?.pins||[])find(key(c.id,p.id));for(const j of project.junctions||[])find(jkey(j.id));for(const w of project.wires||[])join(ep(w.from),ep(w.to));for(const c of project.components){for(const p of byId[c.typeId]?.arduinoPassThrough||[])join(key(c.id,p[0]),key(c.id,p[1]));const d=byId[c.typeId];if(d?.arduinoRole==='breadboard-power'){join(key(c.id,'LGND'),key(c.id,'GND'));join(key(c.id,'RGND'),key(c.id,'GND'));if(c.hw131On!==false){const l=String(c.hw131Left??d.hw131Left??'5'),r=String(c.hw131Right??d.hw131Right??'3.3');if(l==='5')join(key(c.id,'L+'),key(c.id,'5V'));else if(l==='3.3')join(key(c.id,'L+'),key(c.id,'3V3'));if(r==='5')join(key(c.id,'R+'),key(c.id,'5V'));else if(r==='3.3')join(key(c.id,'R+'),key(c.id,'3V3'))}}}return {find,ep}}
  function attached(project,byId,g,b,p){const r=g.find(key(b.id,p)),a=[];for(const c of project.components)if(c.id!==b.id){const d=byId[c.typeId];for(const q of d?.pins||[])if(g.find(key(c.id,q.id))===r)a.push({c,d,p:q.id})}return a}
  function sensor(x,mode,ctx){const {c,d,p}=x,r=d.arduinoRole;if(r==='button')return c._pressed||c.state?1:0;if(r==='digital'&&d.id==='arduino-reed'&&c.mq07ReedDigitalModel===true&&p==='DO'&&mode==='digital'){
 const {project,byId,g,b}=ctx||{},joined=(a,ap,z,zp)=>g.find(key(a,ap))===g.find(key(z,zp));
 const powered=!!(project&&byId&&g&&b&&joined(c.id,'VCC',b.id,'5V')&&joined(c.id,'GND',b.id,'GND')&&
 project.components.some(s=>byId[s.typeId]?.arduinoRole==='bench-supply'&&Math.abs(Number(s.dcVoltage??byId[s.typeId]?.defaultVoltage??5)-5)<.01&&
 joined(c.id,'VCC',s.id,'P')&&joined(c.id,'GND',s.id,'M')));
 const near=clamp(c.reedMagnet,0,100,0)>=65,high=powered&&near;
 c._mq07ReedMagnetNear=near;c._mq07ReedPowered=powered;c._mq07ReedDO=high?1:0;
 return high?1:0;
 }if(r==='digital'&&d.id==='arduino-ir-rx-38khz'&&
 ['electronic-component-basics-outline-029','electronic-component-basics-outline-030'].includes(ctx?.project?.tutorialLesson?.id)){
 const {project,byId,g,b}=ctx,find=(id,p)=>g.find(key(id,p)),
 edge=(a,ap,z,zp)=>(project.wires||[]).some(w=>
  (w.from?.c===a&&w.from?.p===ap&&w.to?.c===z&&w.to?.p===zp)||
  (w.to?.c===a&&w.to?.p===ap&&w.from?.c===z&&w.from?.p===zp));
 const source=project.components.find(x=>x.id==='ps'&&byId[x.typeId]?.arduinoRole==='bench-supply'),
  button=project.components.find(x=>x.id==='trigger'&&x.typeId==='push-no'),
  resistor=project.components.find(x=>x.id==='irres'&&x.typeId==='arduino-resistor-220'),
  tx=project.components.find(x=>x.id==='tx'&&x.typeId==='arduino-ir-tx-38khz');
 const five=!!source&&Number(source.dcVoltage)===5;
 const powered=five&&find(c.id,'VCC')===find(source.id,'P')&&
  find(c.id,'GND')===find(source.id,'M')&&
  find(c.id,'VCC')===find(b.id,'5V')&&find(c.id,'GND')===find(b.id,'GND');
 const txWired=!!(five&&button&&resistor&&tx&&
  edge(source.id,'P',button.id,'13')&&edge(button.id,'14',resistor.id,'1')&&
  edge(resistor.id,'2',tx.id,'A')&&edge(tx.id,'K',source.id,'M'));
 const transmitting=!!(txWired&&(button.state||button._pressed));
 const beam=!!(powered&&transmitting&&tx.virtualCarrierHz===38000&&c.irBeamPresent!==false);
 c._virtualIrPowered=powered;c._virtualIrBeam=beam;
 c._virtualIrModel='idealized 38kHz, no verified optical distance or carrier';
 if(tx){tx._active=transmitting;tx._virtualIrCarrier=transmitting}
 return beam?0:1; // Active-low demodulator, fails closed.
}
 // SC709 PIR supply: a simulated sensor without 5 V and shared 0 V
 // must not assert the Arduino's digital input. Other Arduino scenes
 // preserve their existing library-model behavior.
 if(r==='digital'&&d.id==='arduino-pir'&&p==='OUT'&&mode==='digital'&&
    ctx?.project?.tutorialLesson?.id==='sensor-analog-apps-outline-059'){
   const {g,b}=ctx;
   const joined=(a,ap,z,zp)=>g.find(key(a,ap))===g.find(key(z,zp));
   const powered=joined(c.id,'VCC',b.id,'5V')&&
      joined(c.id,'GND',b.id,'GND');
   c._sc709PirPowered=powered;
   return powered&&!!c.state?1:0;
 }
 if(r==='digital')return c.state?1:0;if(r==='ne555'&&p==='OUT')return c._ne555Out?1:0;if(r==='pot')return Math.round(clamp(c.potentiometer,0,100,50)*10.23);if(r==='analog'){
  // SC471 outline only: without the real 5 V and shared GND path, the sound
  // module must not drive Arduino D2 from a simulated training value.
  // Keep all other analog sensor / canonical Arduino behaviors unchanged.
  if(d.id==='arduino-sound-sensor'&&p==='DO'&&mode==='digital'&&
     ['sensor-analog-apps-outline-053','electronic-component-basics-outline-033'].includes(ctx?.project?.tutorialLesson?.id)){
    const {project,byId,g,b}=ctx;
    const connected=(a,ap,z,zp)=>g.find(key(a,ap))===g.find(key(z,zp));
    const powered=connected(c.id,'VCC',b.id,'5V')&&
      connected(c.id,'GND',b.id,'GND')&&
      project.components.some(s=>byId[s.typeId]?.arduinoRole==='bench-supply'&&
        Math.abs(Number(s.dcVoltage??byId[s.typeId]?.defaultVoltage??5)-5)<.01&&
        connected(c.id,'VCC',s.id,'P')&&connected(c.id,'GND',s.id,'M'));
    c._sc471SoundPowered=powered;
    if(!powered)return 0;
  }
  const input=Object.prototype.hasOwnProperty.call(c,'arduinoValue')?c.arduinoValue:d.arduinoDefault;const valid=(typeof input==='number'||(typeof input==='string'&&input.trim()!==''))&&Number.isFinite(Number(input));if(!valid)return 0;const value=Math.round(Math.max(0,Math.min(1023,Number(input))));if(p==='DO'&&d.dualDigital)return value>=Number(d.arduinoThreshold??512)?1:0;return value}if(r==='temperature'&&d.id==='arduino-lm35'&&c.mq07Lm35Model===true&&p==='AO'&&mode==='analog'){
 let powered=false;
 if(ctx){
  const {project,byId,g,b}=ctx,connected=(id1,p1,id2,p2)=>g.find(key(id1,p1))===g.find(key(id2,p2));
  powered=connected(c.id,'VCC',b.id,'5V')&&connected(c.id,'GND',b.id,'GND')&&
   project.components.some(s=>byId[s.typeId]?.arduinoRole==='bench-supply'&&
    Math.abs(Number(s.dcVoltage??byId[s.typeId]?.defaultVoltage??5)-5)<.01&&
    connected(c.id,'VCC',s.id,'P')&&connected(c.id,'GND',s.id,'M'));
 }
 const input=Object.prototype.hasOwnProperty.call(c,'arduinoValue')?c.arduinoValue:d.arduinoDefault;
 const temperature=typeof input==='number'?input:(typeof input==='string'&&input.trim()!==''?Number(input):NaN);
 const valid=Number.isFinite(temperature)&&temperature>=0&&temperature<=125;
 const voltage=powered&&valid?temperature*.01:0;
 c._mq07Lm35SupplyOk=powered&&valid;c._mq07Lm35TempC=valid?temperature:null;c._mq07Lm35OutputV=voltage;
 c._mq07Lm35Fault=!valid?'LM35 sanal sıcaklık değeri geçersiz':powered?'':'LM35 sanal 5 V besleme veya ortak GND eksik';
 return Math.round(voltage/5*1023);
 }if(r==='temperature')return Math.round((clamp(c.arduinoValue,-40,125,d.arduinoDefault??25)+40)/165*1023);if(r==='joystick'){if(p==='VRX')return Math.round(clamp(c.arduinoX,0,1023,512));if(p==='VRY')return Math.round(clamp(c.arduinoY,0,1023,512));if(p==='SW')return c.state?0:1}if(r==='encoder'){if(p==='CLK')return Number(c._encoderCLK??0);if(p==='DT')return Number(c._encoderDT??0);if(p==='SW')return c.state?0:1}if(r==='industrial-encoder'){if(!c._encoderPowered)return null;return IncrementalEncoder.line(c,p)}if(r==='dht')return mode==='digital'?1:Math.round(clamp(c.arduinoHumidity,0,100,50)*10.23);if(r==='bluetooth-hc05'&&p==='STATE')return c._hc05Connected?1:0;if(r==='signal-generator'&&p==='OUT'){const v=clamp(c._signalVoltage,0,5,0);return mode==='digital'?(v>=2.5?1:0):Math.round(v/5*1023)}return null}
  const utf8Encode=s=>{const out=[];for(const ch of String(s??'')){const n=ch.codePointAt(0);if(n<128)out.push(n);else if(n<2048)out.push(192|(n>>6),128|(n&63));else if(n<65536)out.push(224|(n>>12),128|((n>>6)&63),128|(n&63));else out.push(240|(n>>18),128|((n>>12)&63),128|((n>>6)&63),128|(n&63))}return out};
  const utf8Decode=a=>{let s='',i=0,b=a||[];while(i<b.length){const x=b[i++]&255;if(x<128){s+=String.fromCodePoint(x);continue}let n=0,c=0;if((x&224)===192){n=x&31;c=1}else if((x&240)===224){n=x&15;c=2}else if((x&248)===240){n=x&7;c=3}else{s+='�';continue}let ok=true;while(c--){if(i>=b.length||(b[i]&192)!==128){ok=false;break}n=(n<<6)|(b[i++]&63)}s+=ok?String.fromCodePoint(n):'�'}return s};
  const toBytes=v=>{if(typeof Uint8Array!=='undefined'&&v instanceof Uint8Array)return [...v];if(Array.isArray(v))return v.map(x=>Number(x)&255);if(typeof v==='number')return [Number(v)&255];return utf8Encode(String(v??''))};
  const bytesToText=a=>utf8Decode(a||[]);
  const garble=(bytes,from,to)=>{from=Number(from)||0;to=Number(to)||0;if(!from||!to||from===to)return [...bytes];const ratio=Math.max(from,to)/Math.max(1,Math.min(from,to));if(ratio<1.02)return [...bytes];return [...bytes].map((b,i)=>((b*29+Math.round(from/100)+Math.round(to/100)+i*7)&255))};
  function ensureHC05(c,d={}){if(!Array.isArray(c._hc05AirRx))c._hc05AirRx=[];if(!Array.isArray(c._hc05AirTx))c._hc05AirTx=[];if(!Array.isArray(c._hc05Log))c._hc05Log=[];c.hc05Baud=Number(c.hc05Baud||d.defaultBaud||9600);c.hc05Name=c.hc05Name||d.deviceName||'HC-05';c.hc05Pin=c.hc05Pin||d.pairingPin||'1234';if(d.supportsAt===false)c.hc05AtMode=false;c._hcBluetoothRole=d.supportsAt===false?'slave':'master/slave';return c}
  const hc05WireBaud=pair=>pair?.c?.hc05AtMode?Number(pair?.d?.atBaud||38400):Number(pair?.c?.hc05Baud||pair?.d?.defaultBaud||9600);
  function hc05ForPins(project,byId,g,b,rxPin,txPin){
    rxPin=rxPin!==undefined?pinName(rxPin):null;txPin=txPin!==undefined?pinName(txPin):null;
    for(const c of project.components){const d=byId[c.typeId];if(d?.arduinoRole!=='bluetooth-hc05')continue;
      const rxOk=!rxPin||g.find(key(b.id,rxPin))===g.find(key(c.id,'TXD')),txOk=!txPin||g.find(key(b.id,txPin))===g.find(key(c.id,'RXD'));
      if(rxOk&&txOk)return {c:ensureHC05(c,d),d};
    }return null;
  }
  function hc05Command(pair,bytes){
    const c=pair.c,d=pair.d;if(!c.hc05AtMode)return false;c._hc05AtBuffer=(c._hc05AtBuffer||'')+bytesToText(bytes);if(!/[\r\n]/.test(c._hc05AtBuffer))return true;
    const lines=c._hc05AtBuffer.split(/[\r\n]+/),tail=/[\r\n]$/.test(c._hc05AtBuffer)?'':lines.pop()||'';c._hc05AtBuffer=tail;
    for(const raw of lines){const s=raw.trim();if(!s)continue;let ans='ERROR\r\n';
      if(s==='AT')ans='OK\r\n';
      else if(s==='AT+NAME?')ans='+NAME:'+c.hc05Name+'\r\nOK\r\n';
      else if(/^AT\+NAME=/.test(s)){c.hc05Name=s.slice(8).trim()||c.hc05Name;ans='OK\r\n'}
      else if(s==='AT+UART?')ans='+UART:'+c.hc05Baud+',0,0\r\nOK\r\n';
      else if(/^AT\+UART=/.test(s)){const n=parseInt(s.slice(8),10);if(Number.isFinite(n)&&n>0){c.hc05Baud=n;ans='OK\r\n'}}
      else if(s==='AT+PSWD?')ans='+PSWD:"'+c.hc05Pin+'"\r\nOK\r\n';
      else if(/^AT\+PSWD=/.test(s)){c.hc05Pin=s.slice(8).replace(/^"|"$/g,'')||c.hc05Pin;ans='OK\r\n'}
      else if(s==='AT+ROLE?')ans='+ROLE:0\r\nOK\r\n';
      c._hc05AirRx.push(...toBytes(ans));c._hc05Log.push('AT> '+s,'AT< '+ans.trim());
    }return true;
  }
  function serialObject(rt,api,name='Serial'){
    const soft=name!=='Serial';return {
      available:()=>soft?api.softAvailable(name):api.serialAvailable(),
      read:()=>soft?api.softRead(name):api.serialRead(),
      peek:()=>soft?api.softPeek(name):api.serialPeek(),
      parseInt:()=>soft?api.softParseInt(name):api.serialParseInt(),
      readString:()=>soft?api.softReadString(name):api.serialReadString(),
      readStringUntil:x=>soft?api.softReadStringUntil(name,x):api.serialReadStringUntil(x),
      availableForWrite:()=>64
    };
  }

  function expr(s,rt,io){
    s=String(s||'0').trim();
    s=s.replace(/\(\s*char\s*\)\s*([A-Za-z_]\w*(?:\.[A-Za-z_]\w*\([^()]*\)|\([^()]*\))?)/g,'__char($1)').replace(/\(\s*(?:int|long|short|byte|float|double)\s*\)\s*([A-Za-z_]\w*(?:\.[A-Za-z_]\w*\([^()]*\)|\([^()]*\))?)/g,'__num($1)');
    if(/[{}\[\]\x60;]/.test(s)||banned.test(s))throw Error('Desteklenmeyen ifade: '+s);
    const scope={...rt.vars,HIGH:1,LOW:0,INPUT:0,OUTPUT:1,INPUT_PULLUP:2,CHANGE:1,FALLING:2,RISING:3,LED_BUILTIN:13,A0:14,A1:15,A2:16,A3:17,A4:18,A5:19,DHT11:11,DHT22:22,AM2302:22,DEC:10,HEX:16,OCT:8,BIN:2,MSBFIRST:1,LSBFIRST:0,NEO_GRB:1,NEO_RGB:2,NEO_KHZ800:800000,NEO_KHZ400:400000,SSD1306_SWITCHCAPVCC:2,SSD1306_EXTERNALVCC:1,SSD1306_WHITE:1,SSD1306_BLACK:0,SSD1306_INVERSE:2,F:x=>x,Wire:{available:()=>io.wireAvailable(),read:()=>io.wireRead()},
      digitalRead:p=>io.digitalRead(p),analogRead:p=>io.analogRead(p),pulseIn:p=>io.pulseIn(p),digitalPinToInterrupt:p=>Number(p),millis:()=>Math.floor(rt.now-rt.started),micros:()=>Math.floor((rt.now-rt.started)*1000),__char:x=>String.fromCharCode(Number(x)&255),__num:x=>Number(x),
      map:(x,a,b,c,d)=>c+(Number(x)-a)*(d-c)/(b-a),constrain:(x,a,b)=>clamp(x,a,b),min:Math.min,max:Math.max,abs:Math.abs,round:Math.round,Serial:serialObject(rt,io,'Serial')};
    for(const [name,o] of Object.entries(rt.program.objects||{})){
      if(o.kind==='softwareSerial')scope[name]=serialObject(rt,io,name);
      if(o.kind==='dht')scope[name]={readTemperature:()=>io.dhtTemperature(name),readHumidity:()=>io.dhtHumidity(name)};
      if(o.kind==='hx711')scope[name]={is_ready:()=>io.hxIsReady(name),read:()=>io.hxRead(name),read_average:n=>io.hxReadAverage(name,n),get_value:n=>io.hxGetValue(name,n),get_units:n=>io.hxGetUnits(name,n)};
      if(o.kind==='neopixel')scope[name]={Color:(r,g,b)=>io.neoColor(r,g,b),numPixels:()=>io.neoNumPixels(name),getPixelColor:n=>io.neoGetPixelColor(name,n)};
      if(o.kind==='ssd1306')scope[name]={begin:(v,a)=>io.oledBegin(name,v,a),width:()=>io.oledWidth(name),height:()=>io.oledHeight(name)};
    }
    const names=Object.keys(scope),vals=names.map(k=>scope[k]);try{return Function(...names,'"use strict";return ('+s+');')(...vals)}catch{throw Error('İfade okunamadı: '+s)}
  }
  function io(project,byId,g,b,rt){
    const serial=rt.serial||(rt.serial={baud:0,rx:[],events:[],seq:0}),soft=rt.softSerial||(rt.softSerial={}),lcds=rt.lcd||(rt.lcd={}),hx=rt.hx711||(rt.hx711={}),wire=rt.wire||(rt.wire={txAddr:null,tx:[],rx:[],pointer:{},begun:false}),neos=rt.neopixels||(rt.neopixels={}),oleds=rt.oled||(rt.oled={});
    const readQueue=q=>q.length?q.shift():-1,peekQueue=q=>q.length?q[0]:-1;
    const delimCode=x=>typeof x==='number'?x&255:String(x??'\n').charCodeAt(0)&255;
    const readString=q=>{const out=q.splice(0,q.length);return bytesToText(out)};
    const readUntil=(q,d)=>{d=delimCode(d);const out=[];while(q.length){const b=q.shift();if(b===d)break;out.push(b)}return bytesToText(out)};
    const parseIntQueue=q=>{let s='';while(q.length&&!/[+\-0-9]/.test(String.fromCharCode(q[0])))q.shift();while(q.length&&/[+\-0-9]/.test(String.fromCharCode(q[0])))s+=String.fromCharCode(q.shift());const n=parseInt(s,10);return Number.isFinite(n)?n:0};
    const resolve=x=>{x=String(x??'').trim();if(/^A[0-5]$/.test(x))return x;if(/^[-+]?\d+(?:\.\d+)?$/.test(x))return Number(x);if(Object.prototype.hasOwnProperty.call(rt.vars,x))return rt.vars[x];return expr(x,rt,api)};
    const logicOnNet=net=>{for(const board of project.components){const bd=byId[board.typeId];if(!bd?.arduinoBoard)continue;if(['5V','3V3'].some(p=>g.find(key(board.id,p))===net))return 1;if(['GND','GND2'].some(p=>g.find(key(board.id,p))===net))return 0;const outs=board._arduinoRuntime?.outputs||{};for(const [p,v] of Object.entries(outs))if(g.find(key(board.id,p))===net)return Number(v)>0?1:0}return null};
    const ensureMAX485=(cc,d={})=>{if(!Array.isArray(cc._rs485AirRx))cc._rs485AirRx=[];cc._rs485ActiveUntil=cc._rs485ActiveUntil||0;cc._rs485Role='half-duplex';return cc};
    const max485ForPins=(rxPin,txPin)=>{rxPin=rxPin!==undefined?pinName(rxPin):null;txPin=txPin!==undefined?pinName(txPin):null;for(const cc of project.components){const d=byId[cc.typeId];if(d?.arduinoRole!=='rs485-max485')continue;const rxOk=!rxPin||g.find(key(b.id,rxPin))===g.find(key(cc.id,'RO')),txOk=!txPin||g.find(key(b.id,txPin))===g.find(key(cc.id,'DI'));if(rxOk&&txOk)return {c:ensureMAX485(cc,d),d,linkKind:'rs485'}}return null};
    const rs485TxEnabled=pair=>pair&&logicOnNet(g.find(key(pair.c.id,'DE')))===1;
    const rs485RxEnabled=pair=>pair&&logicOnNet(g.find(key(pair.c.id,'RE')))===0;
    const rs485Peers=pair=>project.components.filter(cc=>cc.id!==pair.c.id&&byId[cc.typeId]?.arduinoRole==='rs485-max485'&&g.find(key(cc.id,'A'))===g.find(key(pair.c.id,'A'))&&g.find(key(cc.id,'B'))===g.find(key(pair.c.id,'B')));
    const rs485Send=(pair,sourceBaud,bytes)=>{if(!rs485TxEnabled(pair))return;pair.c._rs485ActiveUntil=rt.now+180;for(const cc of rs485Peers(pair)){ensureMAX485(cc,byId[cc.typeId]);cc._rs485AirRx.push({baud:Number(sourceBaud)||9600,bytes:[...bytes]});cc._rs485ActiveUntil=rt.now+180}};
    const rs485Pull=(pair,targetBaud,q)=>{if(!rs485RxEnabled(pair)||!pair.c._rs485AirRx?.length)return;for(const ev of pair.c._rs485AirRx.splice(0))q.push(...garble(ev.bytes,ev.baud,targetBaud||ev.baud));pair.c._rs485ActiveUntil=rt.now+180};
    const ensureMAX232=cc=>{if(!Array.isArray(cc._rs232AirRx))cc._rs232AirRx=[];return cc};
    const max232ForPins=(rxPin,txPin)=>{rxPin=rxPin!==undefined?pinName(rxPin):null;txPin=txPin!==undefined?pinName(txPin):null;for(const cc of project.components){const d=byId[cc.typeId];if(d?.arduinoRole!=='rs232-max232')continue;for(const ch of [1,2]){const rxOk=!rxPin||g.find(key(b.id,rxPin))===g.find(key(cc.id,'R'+ch+'OUT')),txOk=!txPin||g.find(key(b.id,txPin))===g.find(key(cc.id,'T'+ch+'IN'));if(rxOk&&txOk)return {c:ensureMAX232(cc),d,channel:ch,linkKind:'rs232'}}}return null};
    const rs232Peers=pair=>{const outRoot=g.find(key(pair.c.id,'T'+pair.channel+'OUT')),out=[];for(const cc of project.components){if(cc.id===pair.c.id||byId[cc.typeId]?.arduinoRole!=='rs232-max232')continue;for(const ch of [1,2])if(g.find(key(cc.id,'R'+ch+'IN'))===outRoot)out.push({c:ensureMAX232(cc),channel:ch})}return out};
    const rs232Send=(pair,sourceBaud,bytes)=>{pair.c._rs232ActiveUntil=rt.now+180;for(const p of rs232Peers(pair)){p.c._rs232AirRx.push({baud:Number(sourceBaud)||9600,bytes:[...bytes]});p.c._rs232ActiveUntil=rt.now+180}};
    const rs232Pull=(pair,targetBaud,q)=>{if(!pair.c._rs232AirRx?.length)return;for(const ev of pair.c._rs232AirRx.splice(0))q.push(...garble(ev.bytes,ev.baud,targetBaud||ev.baud));pair.c._rs232ActiveUntil=rt.now+180};
    const pinLevel=(cc,p,fallback=0)=>{const net=g.find(key(cc.id,p));if(g.find(key(b.id,'5V'))===net||g.find(key(b.id,'3V3'))===net)return 1;if(g.find(key(b.id,'GND'))===net||g.find(key(b.id,'GND2'))===net)return 0;for(const [bp,v] of Object.entries(rt.outputs))if(g.find(key(b.id,bp))===net)return Number(v)>0?1:0;for(const other of project.components){if(other.id===cc.id)continue;for(const [op,v] of Object.entries(other._arduinoLogicOutputs||{}))if(g.find(key(other.id,op))===net)return Number(v)>0?1:0;if(byId[other.typeId]?.arduinoRole==='signal-generator'&&g.find(key(other.id,'OUT'))===net)return Number(other._signalVoltage)>=2.5?1:0}return fallback};
    const sameNet=(boardPin,cc,p)=>g.find(key(b.id,pinName(boardPin)))===g.find(key(cc.id,p));
    const commitMAX7219=cc=>{const word=Number(cc._max7219Shift||0)&65535,addr=(word>>8)&255,data=word&255;cc._max7219Regs=cc._max7219Regs||{};cc._max7219Regs[addr]=data;if(addr>=1&&addr<=8){cc._max7219Digits=cc._max7219Digits||Array(8).fill(0);cc._max7219Digits[addr-1]=data}cc._max7219LastAddress=addr;cc._max7219LastData=data};
    const logicWrite=(boardPin,oldValue,newValue)=>{for(const cc of project.components){const d=byId[cc.typeId],r=d?.arduinoRole;if(r==='logic-74hc595'){cc._hc595Shift=Number(cc._hc595Shift||0)&255;cc._hc595Latch=Number(cc._hc595Latch||0)&255;if(pinLevel(cc,'SRCLR',1)===0)cc._hc595Shift=0;if(sameNet(boardPin,cc,'SRCLK')&&oldValue<=0&&newValue>0)cc._hc595Shift=((cc._hc595Shift<<1)|(pinLevel(cc,'SER',0)?1:0))&255;if(sameNet(boardPin,cc,'RCLK')&&oldValue<=0&&newValue>0)cc._hc595Latch=cc._hc595Shift}else if(r==='logic-cd4017'){if(pinLevel(cc,'RESET',0)){cc._cd4017Count=0}else if(sameNet(boardPin,cc,'CLOCK')&&oldValue<=0&&newValue>0&&pinLevel(cc,'INHIBIT',0)===0)cc._cd4017Count=(Number(cc._cd4017Count||0)+1)%10}else if(r==='led-max7219'){cc._max7219Shift=Number(cc._max7219Shift||0)&65535;cc._max7219Bits=Number(cc._max7219Bits||0);if(sameNet(boardPin,cc,'CLK')&&oldValue<=0&&newValue>0&&pinLevel(cc,'LOAD',1)===0){cc._max7219Shift=((cc._max7219Shift<<1)|(pinLevel(cc,'DIN',0)?1:0))&65535;cc._max7219Bits=Math.min(16,cc._max7219Bits+1)}if(sameNet(boardPin,cc,'LOAD')&&oldValue<=0&&newValue>0){if(cc._max7219Bits>=16)commitMAX7219(cc);cc._max7219Shift=0;cc._max7219Bits=0}}}};
    const ensureMCP=cc=>{if(!cc._mcpRegs)cc._mcpRegs={0:255,1:255,12:0,13:0,18:0,19:0,20:0,21:0};return cc};
    const mcpAddress=cc=>32+(pinLevel(cc,'A0',0)?1:0)+(pinLevel(cc,'A1',0)?2:0)+(pinLevel(cc,'A2',0)?4:0);
    const mcpTarget=addr=>project.components.find(cc=>byId[cc.typeId]?.arduinoRole==='i2c-mcp23017'&&g.find(key(cc.id,'SDA'))===g.find(key(b.id,'A4'))&&g.find(key(cc.id,'SCL'))===g.find(key(b.id,'A5'))&&mcpAddress(cc)===(Number(addr)&127));
    const mcpWriteReg=(cc,reg,val)=>{cc=ensureMCP(cc);reg=Number(reg)&31;val=Number(val)&255;cc._mcpRegs[reg]=val;if(reg===18){cc._mcpRegs[20]=val}else if(reg===19){cc._mcpRegs[21]=val}else if(reg===20){cc._mcpRegs[18]=val}else if(reg===21){cc._mcpRegs[19]=val}};
    const mcpReadReg=(cc,reg)=>{cc=ensureMCP(cc);reg=Number(reg)&31;if(reg===18||reg===19){const bank=reg===18?'A':'B',dir=Number(cc._mcpRegs[reg===18?0:1]??255),olat=Number(cc._mcpRegs[reg===18?20:21]??0);let out=0;for(let i=0;i<8;i++){const bit=1<<i;if(!(dir&bit)){if(olat&bit)out|=bit}else if(pinLevel(cc,'GP'+bank+i,0))out|=bit}return out}return Number(cc._mcpRegs[reg]??0)&255};
    const pairHardware=()=>{const h=hc05ForPins(project,byId,g,b,'D0','D1');if(h)return {...h,linkKind:'hc05'};return max485ForPins('D0','D1')||max232ForPins('D0','D1')};
    const dhtTarget=name=>{const def=rt.program.objects?.[name];if(!def||def.kind!=='dht')return null;const pin=pinName(resolve(def.args[0]??2));return attached(project,byId,g,b,pin).find(x=>x.d.arduinoRole==='dht'&&x.p==='DATA')||null};
    const pullPair=(pair,targetBaud,q)=>{if(!pair)return;if(pair.linkKind==='rs485'){rs485Pull(pair,targetBaud,q);return}if(pair.linkKind==='rs232'){rs232Pull(pair,targetBaud,q);return}const m=pair.c;if(!m._hc05AirRx?.length)return;const bytes=m._hc05AirRx.splice(0,m._hc05AirRx.length);{const wire=hc05WireBaud(pair);q.push(...garble(bytes,wire,targetBaud||wire));}m._hc05ActiveUntil=rt.now+180};
    const sendPair=(pair,sourceBaud,bytes)=>{if(!pair)return;if(pair.linkKind==='rs485'){rs485Send(pair,sourceBaud,bytes);return}if(pair.linkKind==='rs232'){rs232Send(pair,sourceBaud,bytes);return}const m=pair.c,wire=hc05WireBaud(pair),converted=garble(bytes,sourceBaud||wire,wire);m._hc05ActiveUntil=rt.now+180;if(hc05Command(pair,converted))return;m._hc05AirTx.push(...converted);m._hc05Log.push('TX '+bytesToText(converted));if(m._hc05Log.length>80)m._hc05Log.splice(0,m._hc05Log.length-80)};
    const serialEvent=bytes=>{if(!serial.baud)return;serial.events.push({id:++serial.seq,baud:serial.baud,bytes:[...bytes],time:rt.now});if(serial.events.length>250)serial.events.splice(0,serial.events.length-250);sendPair(pairHardware(),serial.baud,bytes)};
    const softState=name=>{const def=rt.program.objects?.[name];if(!def||def.kind!=='softwareSerial')return null;const s=soft[name]||(soft[name]={baud:0,listening:true});s.rxPin=resolve(def.args[0]??0);s.txPin=resolve(def.args[1]??1);return s};
    const stepperState=name=>{const def=rt.program.objects?.[name];if(!def||def.kind!=='stepper')return null;const a=def.args.map(resolve),s=rt.steppers[name]||(rt.steppers[name]={stepsPerRev:Math.max(1,Number(a[0])||200),pins:a.slice(1).map(pinName),rpm:10,position:0,angle:0,coils:[0,0,0,0]});return s};
    const accelState=name=>{const def=rt.program.objects?.[name];if(!def||def.kind!=='accelStepper')return null;const a=def.args.map(resolve),s=rt.accelSteppers[name]||(rt.accelSteppers[name]={interface:Number(a[0])||1,stepPin:pinName(a[1]??2),dirPin:pinName(a[2]??3),maxSpeed:1000,acceleration:100,position:0,target:0});return s};
    const hxState=name=>{const def=rt.program.objects?.[name];if(!def||def.kind!=='hx711')return null;return hx[name]||(hx[name]={doutPin:null,sckPin:null,scale:400000,offset:0,powered:true})};
    const hxModule=name=>{const s=hxState(name);if(!s||s.doutPin==null||s.sckPin==null)return null;for(const cc of project.components){const d=byId[cc.typeId];if(d?.arduinoRole!=='hx711')continue;if(g.find(key(cc.id,'DT'))===g.find(key(b.id,s.doutPin))&&g.find(key(cc.id,'SCK'))===g.find(key(b.id,s.sckPin)))return {c:cc,d}}return null};
    const hxLoad=name=>{const h=hxModule(name);if(!h)return null;for(const cc of project.components){const d=byId[cc.typeId];if(d?.arduinoRole!=='loadcell')continue;if(['E+','E-','A+','A-'].every(p=>g.find(key(cc.id,p))===g.find(key(h.c.id,p))))return {c:cc,d,hx:h}}return null};
    const hxRaw=name=>{const x=hxLoad(name);if(!x)return 0;const kg=clamp(x.c.loadWeight,0,Number(x.d.loadCapacity||20),0),counts=Math.round(kg*Number(x.d.hx711CountsPerKg||400000));x.hx.c._hx711LoadKg=kg;x.hx.c._hx711Raw=counts;x.hx.c._active=kg>0;return counts};
    const softPair=name=>{const s=softState(name);if(!s)return null;const h=hc05ForPins(project,byId,g,b,s.rxPin,s.txPin);if(h)return {...h,linkKind:'hc05'};return max485ForPins(s.rxPin,s.txPin)||max232ForPins(s.rxPin,s.txPin)};
    const pullSoft=name=>{const s=softState(name);if(!s||!s.baud)return s;pullPair(softPair(name),s.baud,s.rx||(s.rx=[]));return s};
    const softSend=(name,bytes)=>{const s=softState(name);if(!s||!s.baud)return;sendPair(softPair(name),s.baud,bytes)};
    const lcdState=name=>{const d=rt.program.objects?.[name];if(!d||!['lcd1602','lcd1602i2c'].includes(d.kind))return null;const a=(d.args||[]).map(resolve),isI2c=d.kind==='lcd1602i2c',cols=isI2c?Number(a[1]||16):16,rows=isI2c?Number(a[2]||2):2,address=isI2c?Number(a[0]??39):null;const s=lcds[name]||(lcds[name]={cols,rows,col:0,row:0,lines:Array.from({length:rows},()=>Array(cols).fill(' ')),display:true,cursor:false,blink:false,backlight:true,address});if(isI2c){s.address=address;s.cols=cols;s.rows=rows}return s};
    const lcdMap=name=>{const d=rt.program.objects?.[name];if(!d)return [];const a=d.args.map(resolve);if(a.length===6)return [['RS',a[0]],['E',a[1]],['D4',a[2]],['D5',a[3]],['D6',a[4]],['D7',a[5]]];if(a.length===7)return [['RS',a[0]],['RW',a[1]],['E',a[2]],['D4',a[3]],['D5',a[4]],['D6',a[5]],['D7',a[6]]];if(a.length===10)return [['RS',a[0]],['E',a[1]],...Array.from({length:8},(_,i)=>['D'+i,a[i+2]])];if(a.length===11)return [['RS',a[0]],['RW',a[1]],['E',a[2]],...Array.from({length:8},(_,i)=>['D'+i,a[i+3]])];return []};
    const lcdTarget=name=>{const def=rt.program.objects?.[name];if(!def)return null;if(def.kind==='lcd1602i2c'){const state=lcdState(name),sda=g.find(key(b.id,'A4')),scl=g.find(key(b.id,'A5')),address=Number(state?.address??39);for(const cc of project.components){const d=byId[cc.typeId];if(d?.arduinoRole!=='lcd1602-i2c')continue;if(g.find(key(cc.id,'SDA'))===sda&&g.find(key(cc.id,'SCL'))===scl&&Number(cc.i2cAddress??d.i2cAddress??39)===address)return cc}const lcdPins=['VSS','VDD','VO','RS','RW','E','D0','D1','D2','D3','D4','D5','D6','D7','A','K'];for(const bp of project.components){const bd=byId[bp.typeId];if(bd?.arduinoRole!=='lcd-i2c-backpack')continue;if(g.find(key(bp.id,'SDA'))!==sda||g.find(key(bp.id,'SCL'))!==scl||Number(bp.i2cAddress??bd.i2cAddress??39)!==address)continue;for(const lcd of project.components){const ld=byId[lcd.typeId];if(ld?.arduinoRole!=='lcd1602')continue;if(lcdPins.every(p=>g.find(key(bp.id,p))===g.find(key(lcd.id,p))))return lcd}}return null}const map=lcdMap(name);for(const cc of project.components){const d=byId[cc.typeId];if(d?.arduinoRole!=='lcd1602')continue;if(map.length&&map.every(([lp,bp])=>g.find(key(cc.id,lp))===g.find(key(b.id,pinName(bp)))))return cc}return null};
    const lcdSync=name=>{const s=lcdState(name),t=lcdTarget(name);if(!s||!t)return;t._arduinoDisplayLines=s.display?s.lines.slice(0,s.rows).map(r=>r.join('').padEnd(s.cols,' ').slice(0,s.cols)):Array(s.rows).fill(' '.repeat(s.cols));t._arduinoDisplay=t._arduinoDisplayLines.join('\n');t._arduinoLcdCursor={col:s.col,row:s.row,cursor:s.cursor,blink:s.blink,display:s.display};t._arduinoLcdBacklight=s.backlight!==false;t._active=true};
    const lcdWrite=(name,value)=>{const s=lcdState(name);if(!s)return;for(const ch of String(value??'')){if(ch==='\n'){s.row=Math.min(s.rows-1,s.row+1);s.col=0;continue}if(s.row>=s.rows)break;if(s.col>=s.cols){s.row=Math.min(s.rows-1,s.row+1);s.col=0}if(!s.lines[s.row])s.lines[s.row]=Array(s.cols).fill(' ');s.lines[s.row][s.col++]=ch}lcdSync(name)};
    const neoState=name=>{const d=rt.program.objects?.[name];if(!d||d.kind!=='neopixel')return null;const n=Math.max(1,Math.round(Number(resolve(d.args?.[0]??1))||1)),pin=pinName(resolve(d.args?.[1]??6));let s=neos[name];if(!s)s=neos[name]={count:n,pin,pixels:Array(n).fill(0),shown:Array(n).fill(0),brightness:255,begun:false};s.count=n;s.pin=pin;while(s.pixels.length<n)s.pixels.push(0);while(s.shown.length<n)s.shown.push(0);s.pixels.length=n;s.shown.length=n;return s};
    const neoTarget=name=>{const s=neoState(name);if(!s)return null;const net=g.find(key(b.id,s.pin));return project.components.find(cc=>byId[cc.typeId]?.arduinoRole==='neopixel'&&g.find(key(cc.id,'DIN'))===net)||null};
    const neoUnpack=v=>({r:(Number(v)>>16)&255,g:(Number(v)>>8)&255,b:Number(v)&255});
    const neoSync=name=>{const s=neoState(name),t=neoTarget(name);if(!s||!t)return;const wired=p=>(project.wires||[]).some(w=>[w.from,w.to].some(e=>e?.c===t.id&&e?.p===p)),powered=wired('5V')&&wired('GND'),q=neoUnpack(s.shown[0]||0),k=Math.max(0,Math.min(255,Number(s.brightness)||0))/255;t._neopixelPowered=powered;t._neopixelDataPin=s.pin;t._arduinoRGB=powered?{r:Math.round(q.r*k),g:Math.round(q.g*k),b:Math.round(q.b*k)}:{r:0,g:0,b:0};t._active=powered&&Object.values(t._arduinoRGB).some(Boolean)};
    const oledState=name=>{const d=rt.program.objects?.[name];if(!d||d.kind!=='ssd1306')return null;const width=Math.max(16,Math.round(Number(resolve(d.args?.[0]??128))||128)),height=Math.max(8,Math.round(Number(resolve(d.args?.[1]??64))||64));let s=oleds[name];const cols=Math.max(1,Math.floor(width/6)),rows=Math.max(1,Math.floor(height/8));if(!s)s=oleds[name]={width,height,address:60,cursorX:0,cursorY:0,textSize:1,textColor:1,wrap:true,invert:false,begun:false,lines:Array.from({length:rows},()=>Array(cols).fill(' '))};if(s.width!==width||s.height!==height){s.width=width;s.height=height;s.lines=Array.from({length:rows},()=>Array(cols).fill(' '));s.cursorX=0;s.cursorY=0}return s};
    const oledTarget=name=>{const s=oledState(name);if(!s)return null;const sda=g.find(key(b.id,'A4')),scl=g.find(key(b.id,'A5'));return project.components.find(cc=>{const d=byId[cc.typeId];return ['oled','oled-yellow'].includes(d?.arduinoRole)&&g.find(key(cc.id,'SDA'))===sda&&g.find(key(cc.id,'SCL'))===scl&&Number(cc.i2cAddress??d.i2cAddress??60)===Number(s.address??60)})||null};
    const oledSync=name=>{const s=oledState(name),t=oledTarget(name);if(!s||!t)return false;t._arduinoDisplayLines=s.lines.map(r=>r.join('').replace(/\s+$/,'')).slice(0,Math.floor(s.height/8));t._arduinoDisplay=t._arduinoDisplayLines.join('\n');t._oledTextSize=s.textSize;t._oledInverted=!!s.invert;t._active=!!s.begun;return true};
    const oledClear=name=>{const s=oledState(name);if(!s)return;s.lines=Array.from({length:Math.max(1,Math.floor(s.height/8))},()=>Array(Math.max(1,Math.floor(s.width/6))).fill(' '));s.cursorX=0;s.cursorY=0};
    const oledWrite=(name,value,newline=false)=>{const s=oledState(name);if(!s)return;const cols=s.lines[0]?.length||21,rows=s.lines.length,size=Math.max(1,Math.round(Number(s.textSize)||1));for(const ch of String(value??'')){if(ch==='\n'){s.cursorX=0;s.cursorY+=8*size;continue}let col=Math.floor(s.cursorX/6),row=Math.floor(s.cursorY/8);if(col>=cols&&s.wrap){s.cursorX=0;s.cursorY+=8*size;col=0;row=Math.floor(s.cursorY/8)}if(row>=rows)break;if(col>=0&&col<cols)s.lines[row][col]=ch;s.cursorX+=6*size}if(newline){s.cursorX=0;s.cursorY+=8*size}};

    const api={
      digitalRead(p){const pin=pinName(p),items=attached(project,byId,g,b,pin);for(const x of items){const v=sensor(x,'digital',{project,byId,g,b});if(v===null)continue;if(x.d.openCollector){if(v===0)return 0;const pulled=rt.pinModes[pin]==='INPUT_PULLUP'||logicOnNet(g.find(key(x.c.id,x.p)))===1;x.c._encoderPullupWarning=!pulled;return pulled?1:0}return rt.pinModes[pin]==='INPUT_PULLUP'?(v?0:1):v}return rt.pinModes[pin]==='INPUT_PULLUP'?1:0},
      analogRead(p){const items=attached(project,byId,g,b,pinName(p));for(const x of items){const v=sensor(x,'analog',{project,byId,g,b});if(v!==null)return Math.round(clamp(v,0,1023))}return 0},
      pulseIn(p){const u=attached(project,byId,g,b,pinName(p)).find(x=>x.d.arduinoRole==='ultrasonic'&&x.p==='ECHO');return u?Math.round(clamp(u.c.arduinoValue,2,400,u.d.arduinoDefault??30)*58):0},
      write(p,v,pwm){const pin=pinName(p),old=Number(rt.outputs[pin]||0),next=pwm?Math.round(clamp(v,0,255)):Number(v)?255:0;rt.outputs[pin]=next;logicWrite(pin,old,next)},
      shiftOut(dataPin,clockPin,order,value){dataPin=pinName(dataPin);clockPin=pinName(clockPin);value=Number(value)&255;for(let i=0;i<8;i++){const bit=Number(order)===0?i:7-i;api.write(dataPin,(value>>bit)&1,false);api.write(clockPin,0,false);api.write(clockPin,1,false);api.write(clockPin,0,false)}},
      wireBegin(){wire.begun=true},
      wireBeginTransmission(addr){wire.txAddr=Number(addr)&127;wire.tx=[]},
      wireWrite(v){wire.tx.push(Number(v)&255);return 1},
      wireEndTransmission(){const cc=mcpTarget(wire.txAddr);if(!cc)return 2;const bytes=wire.tx.splice(0),reg=bytes.length?bytes.shift():Number(wire.pointer[wire.txAddr]||0);wire.pointer[wire.txAddr]=reg;for(let i=0;i<bytes.length;i++){mcpWriteReg(cc,reg+i,bytes[i]);wire.pointer[wire.txAddr]=(reg+i+1)&31}return 0},
      wireRequestFrom(addr,count){addr=Number(addr)&127;count=Math.max(0,Math.min(32,Number(count)||0));const cc=mcpTarget(addr);wire.rx=[];if(!cc)return 0;let reg=Number(wire.pointer[addr]||0);for(let i=0;i<count;i++)wire.rx.push(mcpReadReg(cc,(reg+i)&31));wire.pointer[addr]=(reg+count)&31;return wire.rx.length},
      wireAvailable(){return wire.rx.length},wireRead(){return wire.rx.length?wire.rx.shift():-1},
      neoColor(r,g,b){return ((Math.round(clamp(r,0,255))&255)<<16)|((Math.round(clamp(g,0,255))&255)<<8)|(Math.round(clamp(b,0,255))&255)},
      neoNumPixels(name){return neoState(name)?.count||0},neoGetPixelColor(name,n){const s=neoState(name);return s?.pixels?.[Math.max(0,Math.min((s.count||1)-1,Math.round(Number(n)||0)))]||0},
      neoBegin(name){const s=neoState(name);if(s)s.begun=true},neoSetPin(name,p){const s=neoState(name);if(s)s.pin=pinName(p)},neoSetBrightness(name,v){const s=neoState(name);if(s)s.brightness=Math.round(clamp(v,0,255))},
      neoSetPixel(name,n,args){const s=neoState(name);if(!s)return;n=Math.max(0,Math.min(s.count-1,Math.round(Number(n)||0)));s.pixels[n]=args.length>=3?api.neoColor(args[0],args[1],args[2]):(Number(args[0])>>>0)&0xFFFFFF},
      neoFill(name,color,first=0,count=0){const s=neoState(name);if(!s)return;first=Math.max(0,Math.round(Number(first)||0));count=Math.round(Number(count)||0)||s.count-first;for(let i=first;i<Math.min(s.count,first+count);i++)s.pixels[i]=(Number(color)>>>0)&0xFFFFFF},
      neoClear(name){const s=neoState(name);if(s)s.pixels.fill(0)},neoShow(name){const s=neoState(name);if(!s)return;s.shown=[...s.pixels];neoSync(name)},
      oledBegin(name,vcs,addr){const s=oledState(name);if(!s)return false;s.begun=true;s.address=Number(addr??60)&127;return !!oledTarget(name)},oledWidth(name){return oledState(name)?.width||0},oledHeight(name){return oledState(name)?.height||0},
      oledClear(name){oledClear(name)},oledSetCursor(name,x,y){const s=oledState(name);if(s){s.cursorX=Math.max(0,Number(x)||0);s.cursorY=Math.max(0,Number(y)||0)}},oledSetTextSize(name,v){const s=oledState(name);if(s)s.textSize=Math.max(1,Math.min(4,Math.round(Number(v)||1)))},oledSetTextColor(name,v){const s=oledState(name);if(s)s.textColor=Number(v)||0},oledSetTextWrap(name,v){const s=oledState(name);if(s)s.wrap=!!v},oledWrite(name,v,nl=false){oledWrite(name,v,nl)},oledDisplay(name){return oledSync(name)},oledInvert(name,v){const s=oledState(name);if(s){s.invert=!!v;oledSync(name)}},
      pinMode(p,m){rt.pinModes[pinName(p)]=Number(m)===2?'INPUT_PULLUP':Number(m)===1?'OUTPUT':String(m).toUpperCase()},
      tone(p,f,d){rt.tones[pinName(p)]={frequency:Math.max(1,Number(f)||440),until:d?rt.now+Number(d):0}},
      noTone(p){delete rt.tones[pinName(p)]},
      attachInterrupt(p,fn,mode){const pin=pinName(p);rt.interrupts[pin]={fn:String(fn),mode:Number(mode)||1,last:api.digitalRead(pin)}},
      detachInterrupt(p){delete rt.interrupts[pinName(p)]},
      setInterruptsEnabled(v){rt.interruptsEnabled=!!v},
      servoAttach(n,p){rt.servos[n]={...(rt.servos[n]||{}),pin:pinName(p),angle:rt.servos[n]?.angle??90,pulseUs:rt.servos[n]?.pulseUs??1450}},
      servoWrite(n,a){const angle=clamp(a,0,180,90);rt.servos[n]={...(rt.servos[n]||{}),angle,pulseUs:500+(angle/180)*1900}},
      servoWriteMicroseconds(n,us){const pulseUs=clamp(us,500,2400,1450),angle=(pulseUs-500)/1900*180;rt.servos[n]={...(rt.servos[n]||{}),angle,pulseUs}},
      dhtTemperature(name){const x=dhtTarget(name);return x?Number(x.c.arduinoValue??25):NaN},
      dhtHumidity(name){const x=dhtTarget(name);return x?Number(x.c.arduinoHumidity??50):NaN},
      hxBegin(name,dout,sck){const s=hxState(name);if(s){s.doutPin=pinName(dout);s.sckPin=pinName(sck);s.powered=true}},
      hxIsReady(name){const s=hxState(name);return !!(s?.powered&&hxLoad(name))},
      hxRead(name){const s=hxState(name);return s?.powered?hxRaw(name):0},
      hxReadAverage(name,times){times=Math.max(1,Math.round(Number(times)||10));let sum=0;for(let i=0;i<times;i++)sum+=api.hxRead(name);return sum/times},
      hxSetScale(name,factor){const s=hxState(name);if(s)s.scale=Math.abs(Number(factor)||400000)},
      hxTare(name,times){const s=hxState(name);if(s)s.offset=api.hxReadAverage(name,times||10)},
      hxGetValue(name,times){const s=hxState(name);return s?api.hxReadAverage(name,times||1)-Number(s.offset||0):0},
      hxGetUnits(name,times){const s=hxState(name);return s?api.hxGetValue(name,times||1)/Math.max(1e-9,Number(s.scale)||400000):0},
      hxPower(name,on){const s=hxState(name);if(s)s.powered=!!on},
      stepperSetSpeed(n,rpm){const s=stepperState(n);if(s)s.rpm=Math.max(.1,Math.abs(Number(rpm)||10))},
      stepperStep(n,count){const s=stepperState(n);if(!s)return;count=Math.trunc(Number(count)||0);s.position+=count;s.angle=((s.position/s.stepsPerRev)*360)%360;const seq=[[1,0,0,1],[1,0,0,0],[1,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,1,1],[0,0,0,1]],idx=((s.position%8)+8)%8;s.coils=seq[idx];s.pins.slice(0,4).forEach((p,i)=>rt.outputs[p]=s.coils[i]?255:0);rt.waitUntil=Math.max(rt.waitUntil,rt.now+Math.abs(count)/s.stepsPerRev*60000/s.rpm)},
      accelSetMaxSpeed(n,v){const s=accelState(n);if(s)s.maxSpeed=Math.max(1,Math.abs(Number(v)||1000))},
      accelSetAcceleration(n,v){const s=accelState(n);if(s)s.acceleration=Math.max(1,Math.abs(Number(v)||100))},
      accelMove(n,v,absolute=false){const s=accelState(n);if(!s)return;const x=Math.trunc(Number(v)||0);s.target=absolute?x:s.position+x},
      accelRunToPosition(n){const s=accelState(n);if(!s)return;const delta=s.target-s.position;s.position=s.target;rt.outputs[s.dirPin]=delta>=0?255:0;rt.outputs[s.stepPin]=0;rt.waitUntil=Math.max(rt.waitUntil,rt.now+Math.abs(delta)/Math.max(1,s.maxSpeed)*1000)},
      serialBegin(baud){serial.baud=Math.max(1,Math.round(Number(baud)||9600));if(Array.isArray(b._arduinoSerialPending)&&b._arduinoSerialPending.length){serial.rx.push(...b._arduinoSerialPending.splice(0))}},
      serialEnd(){serial.baud=0;serial.rx.length=0},
      serialWrite(v,nl=false,raw=false){if(!serial.baud)return;let bytes=raw?toBytes(v):toBytes(String(v??'')+(nl?'\r\n':''));serialEvent(bytes)},
      serialAvailable(){if(!serial.baud)return 0;pullPair(pairHardware(),serial.baud,serial.rx);return serial.rx.length},
      serialRead(){api.serialAvailable();return readQueue(serial.rx)},
      serialPeek(){api.serialAvailable();return peekQueue(serial.rx)},
      serialParseInt(){api.serialAvailable();return parseIntQueue(serial.rx)},
      serialReadString(){api.serialAvailable();return readString(serial.rx)},
      serialReadStringUntil(d){api.serialAvailable();return readUntil(serial.rx,d)},
      softBegin(name,baud){const s=softState(name);if(s)s.baud=Math.max(1,Math.round(Number(baud)||9600))},
      softEnd(name){const s=softState(name);if(s){s.baud=0;(s.rx||(s.rx=[])).length=0}},
      softListen(name){for(const s of Object.values(soft))s.listening=false;const x=softState(name);if(x)x.listening=true;return true},
      softWrite(name,v,nl=false,raw=false){const s=softState(name);if(!s?.baud)return;const bytes=raw?toBytes(v):toBytes(String(v??'')+(nl?'\r\n':''));softSend(name,bytes)},
      softAvailable(name){const s=pullSoft(name);return s?.listening===false?0:(s?.rx?.length||0)},
      softRead(name){const s=pullSoft(name);return s?.listening===false?-1:readQueue(s?.rx||[])},
      softPeek(name){const s=pullSoft(name);return s?.listening===false?-1:peekQueue(s?.rx||[])},
      softParseInt(name){const s=pullSoft(name);return s?.listening===false?0:parseIntQueue(s?.rx||[])},
      softReadString(name){const s=pullSoft(name);return s?.listening===false?'':readString(s?.rx||[])},
      softReadStringUntil(name,d){const s=pullSoft(name);return s?.listening===false?'':readUntil(s?.rx||[],d)},
      lcdBegin(name,cols,rows){const s=lcdState(name);if(!s)return;s.cols=Math.max(1,Math.min(40,Number(cols)||16));s.rows=Math.max(1,Math.min(4,Number(rows)||2));s.col=0;s.row=0;s.lines=Array.from({length:s.rows},()=>Array(s.cols).fill(' '));lcdSync(name)},
      lcdInit(name){const s=lcdState(name);if(s)api.lcdBegin(name,s.cols||16,s.rows||2)},
      lcdSetCursor(name,col,row){const s=lcdState(name);if(!s)return;s.col=Math.max(0,Math.min(s.cols-1,Number(col)||0));s.row=Math.max(0,Math.min(s.rows-1,Number(row)||0))},
      lcdPrint(name,v){lcdWrite(name,v)},
      lcdWrite(name,v){lcdWrite(name,typeof v==='number'?String.fromCharCode(v&255):v)},
      lcdClear(name){const s=lcdState(name);if(!s)return;s.lines=Array.from({length:s.rows},()=>Array(s.cols).fill(' '));s.col=0;s.row=0;lcdSync(name)},
      lcdHome(name){const s=lcdState(name);if(s){s.col=0;s.row=0;lcdSync(name)}},
      lcdDisplay(name,on){const s=lcdState(name);if(s){s.display=!!on;lcdSync(name)}},
      lcdCursor(name,on){const s=lcdState(name);if(s){s.cursor=!!on;lcdSync(name)}},
      lcdBlink(name,on){const s=lcdState(name);if(s){s.blink=!!on;lcdSync(name)}},
      lcdBacklight(name,on){const s=lcdState(name);if(s){s.backlight=!!on;lcdSync(name)}}
    };
    return api;
  }
  function splitArgs(s){const out=[];let start=0,d=0,q='';for(let i=0;i<=s.length;i++){const ch=s[i],prev=s[i-1];if(i===s.length||(!q&&d===0&&ch===',')){out.push(s.slice(start,i).trim());start=i+1;continue}if(q){if(ch===q&&prev!=='\\')q='';continue}if(ch==='"'||ch==="'"){q=ch;continue}if(ch==='(')d++;else if(ch===')')d--}return out.filter((x,i)=>x||i===0)}
  function printValue(raw,rt,api){const a=splitArgs(raw);if(!a[0])return '';let v=expr(a[0],rt,api);if(a[1]&&typeof v==='number'){const base=Number(expr(a[1],rt,api))||10;if([2,8,10,16].includes(base))v=Math.trunc(v).toString(base).toUpperCase()}return v}
  function stmt(s,rt,api){
    s=String(s||'').trim();if(!s||/^#/.test(s)||/^(?:Servo|LiquidCrystal|LiquidCrystal_I2C|SoftwareSerial|DHT|HX711|Stepper|AccelStepper|Adafruit_NeoPixel|Adafruit_SSD1306)\s+[A-Za-z_]\w*(?:\s*=\s*(?:Stepper|AccelStepper|Adafruit_NeoPixel|Adafruit_SSD1306))?\s*(?:\([^)]*\))?$/.test(s))return;let m;
    if((m=s.match(/^((?:(?:const|volatile)\s+)?(?:(?:unsigned\s+)?(?:int|long|short)|float|double|bool|boolean|byte|char|String))\s+(.+)$/))){for(const decl of splitArgs(m[2])){const dm=decl.match(/^([A-Za-z_]\w*)(?:\s*=\s*(.+))?$/);if(!dm)throw Error('Değişken tanımı okunamadı: '+decl);rt.vars[dm[1]]=dm[2]!==undefined?expr(dm[2],rt,api):0}return}
    if((m=s.match(/^([A-Za-z_]\w*)\s*(\+\+|--)$/))){rt.vars[m[1]]=Number(rt.vars[m[1]]||0)+(m[2]==='++'?1:-1);return}
    if((m=s.match(/^([A-Za-z_]\w*)\s*([+\-*/%])=\s*(.+)$/))){const av=rt.vars[m[1]]??0,bv=expr(m[3],rt,api);if(m[2]==='+'&&(typeof av==='string'||typeof bv==='string')){rt.vars[m[1]]=String(av)+String(bv);return}const a=Number(av),b=Number(bv);rt.vars[m[1]]=m[2]==='+'?a+b:m[2]==='-'?a-b:m[2]==='*'?a*b:m[2]==='/'?(b?a/b:0):(b?a%b:0);return}
    if((m=s.match(/^([A-Za-z_]\w*)\s*=\s*(.+)$/))){rt.vars[m[1]]=expr(m[2],rt,api);return}
    if((m=s.match(/^shiftOut\((.+?),\s*(.+?),\s*(.+?),\s*(.+?)\)$/))){api.shiftOut(expr(m[1],rt,api),expr(m[2],rt,api),expr(m[3],rt,api),expr(m[4],rt,api));return}
    if(/^Wire\.begin\(\)$/.test(s)){api.wireBegin();return}
    if((m=s.match(/^Wire\.beginTransmission\((.+)\)$/))){api.wireBeginTransmission(expr(m[1],rt,api));return}
    if((m=s.match(/^Wire\.write\((.+)\)$/))){api.wireWrite(expr(m[1],rt,api));return}
    if(/^Wire\.endTransmission\(\)$/.test(s)){api.wireEndTransmission();return}
    if((m=s.match(/^Wire\.requestFrom\((.+?),\s*(.+?)\)$/))){api.wireRequestFrom(expr(m[1],rt,api),expr(m[2],rt,api));return}
    if((m=s.match(/^attachInterrupt\((.+?),\s*([A-Za-z_]\w*)\s*,\s*(.+?)\)$/))){api.attachInterrupt(expr(m[1],rt,api),m[2],expr(m[3],rt,api));return}
    if((m=s.match(/^detachInterrupt\((.+)\)$/))){api.detachInterrupt(expr(m[1],rt,api));return}
    if(/^noInterrupts\(\)$/.test(s)){api.setInterruptsEnabled(false);return}
    if(/^interrupts\(\)$/.test(s)){api.setInterruptsEnabled(true);return}
    if((m=s.match(/^pinMode\((.+?),\s*(.+?)\)$/))){api.pinMode(expr(m[1],rt,api),expr(m[2],rt,api));return}
    if((m=s.match(/^digitalWrite\((.+?),\s*(.+?)\)$/))){api.write(expr(m[1],rt,api),expr(m[2],rt,api),false);return}
    if((m=s.match(/^analogWrite\((.+?),\s*(.+?)\)$/))){api.write(expr(m[1],rt,api),expr(m[2],rt,api),true);return}
    if((m=s.match(/^delay\((.+)\)$/))){rt.waitUntil=rt.now+Math.max(0,Number(expr(m[1],rt,api))||0);return 'yield'}
    if((m=s.match(/^delayMicroseconds\((.+)\)$/))){rt.waitUntil=rt.now+Math.max(0,(Number(expr(m[1],rt,api))||0)/1000);return 'yield'}
    if((m=s.match(/^tone\((.+?),\s*(.+?)(?:,\s*(.+))?\)$/))){api.tone(expr(m[1],rt,api),expr(m[2],rt,api),m[3]?expr(m[3],rt,api):0);return}
    if((m=s.match(/^noTone\((.+)\)$/))){api.noTone(expr(m[1],rt,api));return}
    if((m=s.match(/^Serial\.begin\((.+)\)$/))){api.serialBegin(expr(m[1],rt,api));return}
    if(/^Serial\.end\(\)$/.test(s)){api.serialEnd();return}
    if(/^Serial\.flush\(\)$/.test(s))return;
    if((m=s.match(/^Serial\.(print|println)\((.*)\)$/))){api.serialWrite(printValue(m[2],rt,api),m[1]==='println');return}
    if((m=s.match(/^Serial\.write\((.*)\)$/))){const a=splitArgs(m[1]);api.serialWrite(a[0]?expr(a[0],rt,api):'',false,true);return}
    if((m=s.match(/^([A-Za-z_]\w*)\.(init|begin|end|listen|print|println|write|setCursor|clear|home|display|noDisplay|cursor|noCursor|blink|noBlink|backlight|noBacklight|show|setPixelColor|setBrightness|fill|setPin|clearDisplay|setTextSize|setTextColor|setTextWrap|invertDisplay|cp437)\((.*)\)$/))){
      const name=m[1],method=m[2],args=splitArgs(m[3]),obj=rt.program.objects?.[name];
      if(obj?.kind==='dht'){if(method==='begin')return}
      if(obj?.kind==='hx711'){if(method==='begin'){api.hxBegin(name,expr(args[0]||'2',rt,api),expr(args[1]||'3',rt,api));return}}
      if(obj?.kind==='softwareSerial'){
        if(method==='begin'){api.softBegin(name,expr(args[0]||'9600',rt,api));return}
        if(method==='end'){api.softEnd(name);return}
        if(method==='listen'){api.softListen(name);return}
        if(method==='print'||method==='println'){api.softWrite(name,printValue(m[3],rt,api),method==='println');return}
        if(method==='write'){api.softWrite(name,args[0]?expr(args[0],rt,api):'',false,true);return}
      }
      if(obj?.kind==='neopixel'){
        if(method==='begin'){api.neoBegin(name);return}if(method==='show'){api.neoShow(name);return}if(method==='setPin'){api.neoSetPin(name,expr(args[0]||'6',rt,api));return}if(method==='setBrightness'){api.neoSetBrightness(name,expr(args[0]||'255',rt,api));return}if(method==='clear'){api.neoClear(name);return}if(method==='fill'){api.neoFill(name,args[0]?expr(args[0],rt,api):0,args[1]?expr(args[1],rt,api):0,args[2]?expr(args[2],rt,api):0);return}if(method==='setPixelColor'){const n=expr(args[0]||'0',rt,api),vals=args.slice(1).map(x=>expr(x,rt,api));api.neoSetPixel(name,n,vals);return}
      }
      if(obj?.kind==='ssd1306'){
        if(method==='begin'){api.oledBegin(name,args[0]?expr(args[0],rt,api):2,args[1]?expr(args[1],rt,api):60);return}if(method==='clearDisplay'){api.oledClear(name);return}if(method==='setCursor'){api.oledSetCursor(name,expr(args[0]||'0',rt,api),expr(args[1]||'0',rt,api));return}if(method==='setTextSize'){api.oledSetTextSize(name,expr(args[0]||'1',rt,api));return}if(method==='setTextColor'){api.oledSetTextColor(name,expr(args[0]||'1',rt,api));return}if(method==='setTextWrap'){api.oledSetTextWrap(name,expr(args[0]||'1',rt,api));return}if(method==='print'||method==='println'){api.oledWrite(name,printValue(m[3],rt,api),method==='println');return}if(method==='write'){api.oledWrite(name,args[0]?expr(args[0],rt,api):'',false);return}if(method==='display'){api.oledDisplay(name);return}if(method==='invertDisplay'){api.oledInvert(name,args[0]?expr(args[0],rt,api):1);return}if(method==='cp437')return;
      }
      if(['lcd1602','lcd1602i2c'].includes(obj?.kind)){
        if(method==='init'){api.lcdInit(name);return}
        if(method==='begin'){if(args.length)api.lcdBegin(name,expr(args[0]||'16',rt,api),args.length>1?expr(args[1]||'2',rt,api):2);else api.lcdInit(name);return}
        if(method==='setCursor'){api.lcdSetCursor(name,expr(args[0]||'0',rt,api),expr(args[1]||'0',rt,api));return}
        if(method==='print'||method==='println'){api.lcdPrint(name,printValue(m[3],rt,api));return}
        if(method==='write'){api.lcdWrite(name,args[0]?expr(args[0],rt,api):'');return}
        if(method==='clear'){api.lcdClear(name);return}if(method==='home'){api.lcdHome(name);return}
        if(method==='display'){api.lcdDisplay(name,true);return}if(method==='noDisplay'){api.lcdDisplay(name,false);return}
        if(method==='cursor'){api.lcdCursor(name,true);return}if(method==='noCursor'){api.lcdCursor(name,false);return}
        if(method==='blink'){api.lcdBlink(name,true);return}if(method==='noBlink'){api.lcdBlink(name,false);return}
        if(method==='backlight'){api.lcdBacklight(name,true);return}if(method==='noBacklight'){api.lcdBacklight(name,false);return}
      }
    }
    if((m=s.match(/^([A-Za-z_]\w*)\.(set_scale|tare|power_down|power_up)\((.*)\)$/))){
      const name=m[1],method=m[2],args=splitArgs(m[3]),obj=rt.program.objects?.[name];if(obj?.kind==='hx711'){
        if(method==='set_scale'){api.hxSetScale(name,args[0]?expr(args[0],rt,api):400000);return}
        if(method==='tare'){api.hxTare(name,args[0]?expr(args[0],rt,api):10);return}
        if(method==='power_down'){api.hxPower(name,false);return}
        if(method==='power_up'){api.hxPower(name,true);return}
      }
    }
    if((m=s.match(/^([A-Za-z_]\w*)\.attach\((.+)\)$/))){api.servoAttach(m[1],expr(m[2],rt,api));return}
    if((m=s.match(/^([A-Za-z_]\w*)\.(setSpeed|step|setMaxSpeed|setAcceleration|move|moveTo|runToPosition)\((.*)\)$/))){
      const name=m[1],method=m[2],arg=m[3],obj=rt.program.objects?.[name],v=arg?expr(arg,rt,api):0;
      if(obj?.kind==='stepper'){if(method==='setSpeed'){api.stepperSetSpeed(name,v);return}if(method==='step'){api.stepperStep(name,v);return}}
      if(obj?.kind==='accelStepper'){if(method==='setMaxSpeed'){api.accelSetMaxSpeed(name,v);return}if(method==='setAcceleration'){api.accelSetAcceleration(name,v);return}if(method==='move'){api.accelMove(name,v,false);return}if(method==='moveTo'){api.accelMove(name,v,true);return}if(method==='runToPosition'){api.accelRunToPosition(name);return}}
    }
    if((m=s.match(/^([A-Za-z_]\w*)\.writeMicroseconds\((.+)\)$/))){const obj=rt.program.objects?.[m[1]];if(obj?.kind==='servo'){api.servoWriteMicroseconds(m[1],expr(m[2],rt,api));return}}
    if((m=s.match(/^([A-Za-z_]\w*)\.write\((.+)\)$/))){const obj=rt.program.objects?.[m[1]];if(obj?.kind==='servo'){api.servoWrite(m[1],expr(m[2],rt,api));return}}
    if(/^return(?:\s+.+)?$/.test(s))return 'return';
    throw Error('Desteklenmeyen Arduino komutu: '+s);
  }
  function runtime(c,now){const source=c.arduinoSketch||sketches.blank.code;if(c._arduinoRuntime?.source===source)return c._arduinoRuntime;const p=compile(source),rt={source,program:p,vars:{},pinModes:{},outputs:{},tones:{},servos:{},steppers:{},accelSteppers:{},serial:{baud:0,rx:[],events:[],seq:0},softSerial:{},lcd:{},wire:{txAddr:null,tx:[],rx:[],pointer:{},begun:false},neopixels:{},oled:{},interrupts:{},interruptsEnabled:true,phase:'setup',frames:[{type:'block',nodes:p.setup,index:0}],waitUntil:0,started:now,now};c._arduinoRuntime=rt;return rt}
  function runBoard(c,project,byId,g,now){
    let rt;try{rt=runtime(c,now)}catch(e){c._arduinoError=e.message;return {active:false,error:e.message}}rt.now=now;
    for(const [p,t] of Object.entries(rt.tones))if(t.until&&now>=t.until)delete rt.tones[p];
    const api=io(project,byId,g,c,rt);const waiting=now<rt.waitUntil,framesBeforeInterrupt=rt.frames.length;
    if(rt.interruptsEnabled!==false)for(const [pin,intr] of Object.entries(rt.interrupts||{})){
      const value=api.digitalRead(pin),last=intr.last;intr.last=value;if(last===undefined||last===value)continue;
      const fire=intr.mode===1||(intr.mode===3&&last===0&&value===1)||(intr.mode===2&&last===1&&value===0),nodes=rt.program.functions?.[intr.fn];
      if(fire&&nodes?.length)rt.frames.push({type:'block',nodes,index:0,interrupt:true});
    }
    const interruptOnly=waiting&&rt.frames.length>framesBeforeInterrupt;if(waiting&&!interruptOnly)return {active:true};
    let steps=0;
    try{while(steps++<600){
      if(!rt.frames.length){rt.phase='loop';rt.frames.push({type:'block',nodes:rt.program.loop,index:0,rootLoop:true})}
      const f=rt.frames.at(-1);
      if(f.type==='for'){if(!expr(f.node.cond||'1',rt,api)){rt.frames.pop();continue}f.type='for-wait';rt.frames.push({type:'block',nodes:f.node.body,index:0,onDone:()=>{stmt(f.node.inc,rt,api);f.type='for'}});continue}
      if(f.type==='while'){if(!expr(f.node.expr||'0',rt,api)){rt.frames.pop();continue}f.type='while-wait';rt.frames.push({type:'block',nodes:f.node.body,index:0,onDone:()=>{f.type='while'}});continue}
      if(f.index>=f.nodes.length){rt.frames.pop();f.onDone?.();if(interruptOnly&&f.interrupt)break;if(f.rootLoop&&rt.program.serialEvent?.length&&api.serialAvailable()>0)rt.frames.push({type:'block',nodes:rt.program.serialEvent,index:0});continue}
      const n=f.nodes[f.index++];if(n.type==='stmt'){const result=stmt(n.text,rt,api);if(result==='yield')break;if(result==='return'){rt.frames.length=0;break}}
      else if(n.type==='if')rt.frames.push({type:'block',nodes:expr(n.expr,rt,api)?n.yes:n.no,index:0});
      else if(n.type==='for'){stmt(n.init,rt,api);rt.frames.push({type:'for',node:n})}
      else if(n.type==='while')rt.frames.push({type:'while',node:n});
    }
    c._arduinoError='';const all=(rt.serial.events||[]).flatMap(e=>e.bytes||[]);c._arduinoConsole=bytesToText(all.slice(-6000));c._arduinoSerialBaud=rt.serial.baud;return {active:true};
    }catch(e){c._arduinoError=e.message;return {active:false,error:e.message}}
  }
  function mappedOutput(project,byId,g,b,rt,c,p){const target=g.find(key(c.id,p));for(const [pin,v] of Object.entries(rt.outputs))if(g.find(key(b.id,pin))===target)return {pin,value:Number(v)||0};for(const cc of project.components)for(const [pin,v] of Object.entries(cc._arduinoLogicOutputs||{}))if(g.find(key(cc.id,pin))===target)return {pin,value:Number(v)||0,source:cc.id};return null}
  function output(project,byId,g,b,rt,c,p){const o=mappedOutput(project,byId,g,b,rt,c,p);return o&&o.value>0?o:null}
  function present(project,byId,g){const boards=project.components.filter(c=>byId[c.typeId]?.arduinoBoard),liveRoots=new Set();for(const b of boards){const rt=b._arduinoRuntime;if(!rt)continue;b._active=true;b._arduinoPins={...rt.outputs};b._arduinoStatus=b._arduinoError?'HATA':'RUN';for(const [pin,v] of Object.entries(rt.outputs))if(v>0)liveRoots.add(g.find(key(b.id,pin)));
    const logicLevel=(cc,p,fallback=0)=>{const o=mappedOutput(project,byId,g,b,rt,cc,p);if(o)return o.value>0?1:0;const net=g.find(key(cc.id,p));if(net===g.find(key(b.id,'5V'))||net===g.find(key(b.id,'3V3')))return 1;if(net===g.find(key(b.id,'GND'))||net===g.find(key(b.id,'GND2')))return 0;return fallback};
    for(const cc of project.components){const d=byId[cc.typeId],r=d?.arduinoRole;if(r==='logic-cd4511'){const bi=logicLevel(cc,'BI',1),lt=logicLevel(cc,'LT',1),le=logicLevel(cc,'LE',0),n=(logicLevel(cc,'D')<<3)|(logicLevel(cc,'C')<<2)|(logicLevel(cc,'B')<<1)|logicLevel(cc,'A');if(!le)cc._cd4511Latched=n;const digit=Number(cc._cd4511Latched??n),table=[[1,1,1,1,1,1,0],[0,1,1,0,0,0,0],[1,1,0,1,1,0,1],[1,1,1,1,0,0,1],[0,1,1,0,0,1,1],[1,0,1,1,0,1,1],[1,0,1,1,1,1,1],[1,1,1,0,0,0,0],[1,1,1,1,1,1,1],[1,1,1,1,0,1,1]],seg=!bi?[0,0,0,0,0,0,0]:!lt?[1,1,1,1,1,1,1]:(table[digit]||[0,0,0,0,0,0,0]);cc._cd4511Digit=digit;cc._arduinoLogicOutputs=Object.fromEntries(['a','b','c','d','e','f','g'].map((p,i)=>[p,seg[i]?255:0]));cc._active=seg.some(Boolean)}else if(r==='logic-74hc595'){const latch=Number(cc._hc595Latch||0),enabled=logicLevel(cc,'OE',0)===0;cc._arduinoLogicOutputs={};['QA','QB','QC','QD','QE','QF','QG','QH'].forEach((p,i)=>cc._arduinoLogicOutputs[p]=enabled&&((latch>>i)&1)?255:0);cc._arduinoLogicOutputs.QHP=(Number(cc._hc595Shift||0)&128)?255:0;cc._active=enabled&&latch!==0}else if(r==='logic-cd4017'){if(logicLevel(cc,'RESET',0))cc._cd4017Count=0;const count=Number(cc._cd4017Count||0)%10;cc._arduinoLogicOutputs={CARRY:count<5?255:0};for(let i=0;i<10;i++)cc._arduinoLogicOutputs['Q'+i]=i===count?255:0;cc._active=true}else if(r==='i2c-mcp23017'){if(!cc._mcpRegs)cc._mcpRegs={0:255,1:255,12:0,13:0,18:0,19:0,20:0,21:0};cc._arduinoLogicOutputs={};for(const bank of ['A','B']){const dir=Number(cc._mcpRegs[bank==='A'?0:1]??255),olat=Number(cc._mcpRegs[bank==='A'?20:21]??0);for(let i=0;i<8;i++)if(!(dir&(1<<i)))cc._arduinoLogicOutputs['GP'+bank+i]=(olat&(1<<i))?255:0}cc._active=true}else if(r==='led-max7219'){cc._max7219Regs=cc._max7219Regs||{};cc._max7219Digits=cc._max7219Digits||Array(8).fill(0);const enabled=Number(cc._max7219Regs[12]??0)!==0,raw=Number(cc._max7219Digits[0]||0),bits=['A','B','C','D','E','F','G','DP'];cc._arduinoLogicOutputs={DOUT:(Number(cc._max7219Shift||0)&32768)?255:0};bits.forEach((p,i)=>cc._arduinoLogicOutputs['SEG'+p]=(enabled&&((raw>>i)&1))?255:0);for(let i=0;i<8;i++)cc._arduinoLogicOutputs['DIG'+i]=(enabled&&i===0)?0:255;cc._active=enabled}else if(r==='rs232-max232'){cc._arduinoLogicOutputs={T1OUT:logicLevel(cc,'T1IN',0)?0:255,T2OUT:logicLevel(cc,'T2IN',0)?0:255,R1OUT:logicLevel(cc,'R1IN',1)?0:255,R2OUT:logicLevel(cc,'R2IN',1)?0:255};cc._active=Number(cc._rs232ActiveUntil||0)>Date.now()}}for(const c of project.components){const d=byId[c.typeId];if(!d?.arduinoPeripheral||c.id===b.id)continue;const val=p=>output(project,byId,g,b,rt,c,p),r=d.arduinoRole;if(r==='led'){const o=val('A')||val('SIG');c._arduinoOn=!!o;c._arduinoBrightness=o?.value||0;c._active=!!o}else if(r==='rgb'){c._arduinoRGB={r:val('R')?.value||0,g:val('G')?.value||0,b:val('B')?.value||0};c._active=Object.values(c._arduinoRGB).some(Boolean)}else if(r==='neopixel'){const s=Object.values(rt.neopixels||{}).find(s=>g.find(key(b.id,s.pin))===g.find(key(c.id,'DIN')));if(s){const q=s.shown?.[0]||0,k=Math.max(0,Math.min(255,Number(s.brightness)||0))/255,wired=p=>(project.wires||[]).some(w=>[w.from,w.to].some(e=>e?.c===c.id&&e?.p===p)),powered=wired('5V')&&wired('GND');c._neopixelPowered=powered;c._arduinoRGB=powered?{r:Math.round(((q>>16)&255)*k),g:Math.round(((q>>8)&255)*k),b:Math.round((q&255)*k)}:{r:0,g:0,b:0};c._active=powered&&Object.values(c._arduinoRGB).some(Boolean)}}else if(r==='buzzer'){const t=Object.entries(rt.tones).find(([pin])=>g.find(key(b.id,pin))===g.find(key(c.id,'SIG')));c._arduinoTone=t?.[1]?.frequency||(val('SIG')?440:0);c._active=!!c._arduinoTone}else if(r==='servo'){for(const s of Object.values(rt.servos))if(s.pin&&g.find(key(b.id,s.pin))===g.find(key(c.id,'SIG'))){c._arduinoServoAngle=s.angle;c._arduinoServoPulseUs=s.pulseUs;c._active=true}}else if(r==='relay'){const o=val('SIG');
 const selected=['electronic-component-basics-outline-030','electronic-component-basics-outline-033'].includes(project.tutorialLesson?.id);
 let powered=true;
 if(selected){
  const source=project.components.find(x=>x.id==='ps'&&byId[x.typeId]?.arduinoRole==='bench-supply');
  const find=(id,p)=>g.find(key(id,p));
  powered=!!source&&Number(source.dcVoltage)===5&&
   find(c.id,'VCC')===find(source.id,'P')&&find(c.id,'GND')===find(source.id,'M')&&
   find(c.id,'VCC')===find(b.id,'5V')&&find(c.id,'GND')===find(b.id,'GND');
  c._scOpticalAcousticRelayPowered=powered;
 }
 c.state=!!o&&powered;c._active=!!o&&powered}else if(r==='sevenseg'){const common=(c.sevenCommon||d.sevenCommon||'cathode'),commonPin=['GND','COM2'].find(p=>{const root=g.find(key(c.id,p));return root===g.find(key(b.id,common==='anode'?'5V':'GND'))}),segments={};for(const p of ['A','B','C','D','E','F','G','DP']){const o=mappedOutput(project,byId,g,b,rt,c,p);segments[p]=!!commonPin&&!!o&&(common==='anode'?o.value===0:o.value>0)}c._sevenSegments=segments;c._active=Object.values(segments).some(Boolean)}else if(r==='stepper'){for(const s of Object.values(rt.steppers||{})){if(s.pins?.length>=4&&['IN1','IN2','IN3','IN4'].every((p,i)=>g.find(key(c.id,p))===g.find(key(b.id,s.pins[i])))){c._arduinoStepperAngle=s.angle;c._arduinoCoils=[...s.coils];c._active=true}}}else if(r==='a4988'){const level=p=>{const o=mappedOutput(project,byId,g,b,rt,c,p);if(o)return o.value;const root=g.find(key(c.id,p));if(root===g.find(key(b.id,'5V')))return 255;if(root===g.find(key(b.id,'GND')))return 0;return null},wired=p=>(project.wires||[]).some(w=>[w.from,w.to].some(e=>e?.c===c.id&&e?.p===p)),ms=[level('MS1')>0,level('MS2')>0,level('MS3')>0],micro=({'000':1,'100':2,'010':4,'110':8,'111':16})[ms.map(x=>x?1:0).join('')]||1,en=level('EN'),sleep=level('SLEEP'),reset=level('RESET'),logicOk=(en===null||en===0)&&(sleep===null||sleep>0)&&(reset===null||reset>0),powerOk=wired('VMOT')&&wired('GNDM')&&wired('VDD')&&wired('GND');c._a4988Microstep=micro;c._a4988Enabled=logicOk&&powerOk;c._a4988PowerOk=powerOk;const accel=Object.values(rt.accelSteppers||{}).find(s=>g.find(key(b.id,s.stepPin))===g.find(key(c.id,'STEP'))&&g.find(key(b.id,s.dirPin))===g.find(key(c.id,'DIR')));if(c._a4988Enabled){if(accel&&c._a4988AccelPosition!==accel.position){const prev=Number(c._a4988AccelPosition||0),delta=accel.position-prev;c._a4988Angle=Number(c._a4988Angle||0)+delta*(360/Number(d.stepsPerRevolution||200))/micro;c._a4988AccelPosition=accel.position}else{const step=level('STEP')>0;if(step&&!c._a4988StepHigh)c._a4988Angle=Number(c._a4988Angle||0)+(level('DIR')>0?1:-1)*(360/Number(d.stepsPerRevolution||200))/micro;c._a4988StepHigh=step}}c._active=!!c._a4988Enabled;for(const m of project.components){const md=byId[m.typeId];if(md?.arduinoRole!=='stepper-nema17')continue;const pair=(a1,a2,x1,x2)=>{const r1=g.find(key(c.id,a1)),r2=g.find(key(c.id,a2)),x=g.find(key(m.id,x1)),y=g.find(key(m.id,x2));return (r1===x&&r2===y)||(r1===y&&r2===x)};if(pair('1A','1B','A1','A2')&&pair('2A','2B','B1','B2')){m._arduinoStepperAngle=Number(c._a4988Angle||0);m._active=!!c._a4988Enabled}}}else if(r==='ne555'){const level=p=>{const o=mappedOutput(project,byId,g,b,rt,c,p);if(o)return o.value;const root=g.find(key(c.id,p));if(root===g.find(key(b.id,'5V')))return 255;if(root===g.find(key(b.id,'GND')))return 0;return null},mode=c.ne555Mode||d.ne555Mode||'logic',reset=level('RESET'),trig=level('TRIG'),thres=level('THRES'),ra=Math.max(.1,Number(c.ne555RaK||1))*1000,rb=Math.max(.1,Number(c.ne555RbK||10))*1000,cap=Math.max(.001,Number(c.ne555Cuf||10))*1e-6;let out=!!c._ne555Out;if(reset===0){out=false;c._ne555PulseUntil=0}else if(mode==='astable'){const high=.693*(ra+rb)*cap*1000,low=.693*rb*cap*1000,period=Math.max(.1,high+low),epoch=Number(c._ne555Epoch??rt.now);c._ne555Epoch=epoch;out=((rt.now-epoch)%period)<high;c._ne555Frequency=1000/period;c._ne555HighMs=high;c._ne555LowMs=low}else if(mode==='monostable'){const lowTrig=trig===0,edge=lowTrig&&!c._ne555TrigLow,duration=1.1*rb*cap*1000;if(edge)c._ne555PulseUntil=rt.now+duration;out=rt.now<Number(c._ne555PulseUntil||0);c._ne555PulseMs=duration;c._ne555TrigLow=lowTrig;c._ne555Frequency=0}else{if(trig===0)out=true;else if(thres!==null&&thres>0)out=false;c._ne555Frequency=0}c._ne555Out=out;c._ne555Discharge=!out;c._active=out}else if(r==='lcd1602'||r==='lcd1602-i2c'){c._active=!!c._arduinoDisplayLines}else if(r==='bluetooth-hc05'){ensureHC05(c,d);const en=val('EN');if(en)c.hc05AtMode=true;c._active=!!c._hc05Connected||Number(c._hc05ActiveUntil||0)>Date.now()}}}for(const w of project.wires||[])if(liveRoots.has(g.find(g.ep(w.from))))w._active=true}
  const generatorVoltage=(c,d,t)=>{if(c.generatorEnabled===false)return 0;const f=Math.max(.01,Math.min(20000,Number(c.generatorFrequency??d.generatorFrequency??1000))),amp=Math.max(0,Math.min(5,Number(c.generatorAmplitude??d.generatorAmplitude??5))),low=Math.max(0,Math.min(5,Number(c.generatorOffset??d.generatorOffset??0))),high=Math.max(low,Math.min(5,low+amp)),duty=Math.max(1,Math.min(99,Number(c.generatorDuty??d.generatorDuty??50)))/100,shift=(Number(c.generatorPhaseDeg??d.generatorPhaseDeg??0)||0)/360,phase=(((t/1000*f)+shift)%1+1)%1,w=c.generatorWaveform||d.generatorWaveform||'square';let n=0;if(w==='sine')n=(Math.sin(phase*Math.PI*2)+1)/2;else if(w==='triangle')n=1-Math.abs(phase*2-1);else if(w==='sawtooth')n=phase;else n=phase<duty?1:0;return low+(high-low)*n};
  const scopePwmFrequency=pin=>['D5','D6'].includes(pin)?980:['D3','D9','D10','D11'].includes(pin)?490:0;
  const scopeFrequency=(trace,span)=>{if(!Array.isArray(trace)||trace.length<3||span<=0)return 0;const mn=Math.min(...trace),mx=Math.max(...trace),level=(mn+mx)/2;if(mx-mn<1e-4)return 0;const crossings=[];for(let i=1;i<trace.length;i++)if(trace[i-1]<level&&trace[i]>=level)crossings.push(i);if(crossings.length<2)return 0;let sum=0;for(let i=1;i<crossings.length;i++)sum+=crossings[i]-crossings[i-1];const periodSamples=sum/(crossings.length-1),dt=span/(trace.length-1);return periodSamples>0?1000/(periodSamples*dt):0};
  const scopeStats=(trace,span,known=0)=>{const a=Array.isArray(trace)&&trace.length?trace:[0],min=Math.min(...a),max=Math.max(...a),avg=a.reduce((s,v)=>s+v,0)/a.length,rms=Math.sqrt(a.reduce((s,v)=>s+v*v,0)/a.length);return {min,max,vpp:max-min,avg,rms,freq:known>0?known:scopeFrequency(a,span)}};
  function updateArduinoInstruments(project,byId,g,now){
    for(const c of project.components){const d=byId[c.typeId];if(d?.arduinoRole==='signal-generator'){const low=Math.max(0,Math.min(5,Number(c.generatorOffset??d.generatorOffset??0))),high=Math.max(low,Math.min(5,low+Math.max(0,Number(c.generatorAmplitude??d.generatorAmplitude??5))));c._signalPhase=((((now/1000*Math.max(.01,Number(c.generatorFrequency??d.generatorFrequency??1000)))+(Number(c.generatorPhaseDeg??d.generatorPhaseDeg??0)||0)/360)%1)+1)%1;c._signalVoltage=generatorVoltage(c,d,now);c._signalMin=c.generatorEnabled===false?0:low;c._signalMax=c.generatorEnabled===false?0:high;c._signalVpp=c._signalMax-c._signalMin;c._signalFrequency=c.generatorEnabled===false?0:Math.max(.01,Math.min(20000,Number(c.generatorFrequency??d.generatorFrequency??1000)));c._active=c.generatorEnabled!==false}}
    const voltageAt=(net,t)=>{for(const src of project.components){const sd=byId[src.typeId];if(!sd)continue;
      if(sd.arduinoRole==='signal-generator'&&g.find(key(src.id,'OUT'))===net)return {v:generatorVoltage(src,sd,t),f:src.generatorEnabled===false?0:Number(src.generatorFrequency??sd.generatorFrequency??1000),kind:'generator'};
      if(sd.arduinoRole==='signal-generator'&&g.find(key(src.id,'GND'))===net)return {v:0,f:0,kind:'ground'};
      if(sd.arduinoRole==='bench-supply'){if(g.find(key(src.id,'P'))===net)return {v:Math.max(0,Math.min(30,Number(src.dcVoltage??sd.defaultVoltage??5))),f:0,kind:'dc'};if(g.find(key(src.id,'M'))===net)return {v:0,f:0,kind:'ground'}}
      if(sd.arduinoRole==='analog'&&sd.pins?.some(p=>p.id==='AO')){if(g.find(key(src.id,'AO'))===net)return {v:Math.max(0,Math.min(5,Number(src.arduinoValue??sd.arduinoDefault??0)/1023*5)),f:0,kind:'analog'};if(sd.pins.some(p=>p.id==='GND')&&g.find(key(src.id,'GND'))===net)return {v:0,f:0,kind:'ground'}}
      if(sd.arduinoBoard){if(g.find(key(src.id,'5V'))===net)return {v:5,f:0,kind:'dc'};if(g.find(key(src.id,'3V3'))===net)return {v:3.3,f:0,kind:'dc'};if(g.find(key(src.id,'GND'))===net||g.find(key(src.id,'GND2'))===net)return {v:0,f:0,kind:'ground'};const rt=src._arduinoRuntime||{};for(const [p,tone] of Object.entries(rt.tones||{}))if(g.find(key(src.id,p))===net&&(!tone.until||tone.until>=rt.now)){const f=Math.max(1,Number(tone.frequency)||440),phase=(((t/1000*f)%1)+1)%1;return {v:phase<.5?5:0,f,kind:'tone'}}for(const [p,v0] of Object.entries(rt.outputs||{}))if(g.find(key(src.id,p))===net){const v=Math.max(0,Math.min(255,Number(v0)||0)),f=scopePwmFrequency(p);if(f&&v>0&&v<255){const phase=(((t/1000*f)%1)+1)%1;return {v:phase<v/255?5:0,f,kind:'pwm'}}return {v:v/255*5,f:0,kind:'dc'}}}
      for(const [p,v] of Object.entries(src._arduinoLogicOutputs||{}))if(g.find(key(src.id,p))===net)return {v:Number(v)>0?5:0,f:0,kind:'logic'}
    }return {v:0,f:0,kind:'open'}};
    for(const c of project.components){const d=byId[c.typeId];if(d?.arduinoRole!=='oscilloscope')continue;
      const span=Math.max(.05,Number(c.scopeTimeMs??d.scopeTimeMs??20)),source=(c.scopeTriggerSource||d.scopeTriggerSource||'CH1')==='CH2'?'CH2':'CH1',edge=c.scopeTriggerEdge||d.scopeTriggerEdge||'rising',mode=c.scopeTriggerMode||d.scopeTriggerMode||'auto',level=Number(c.scopeTriggerLevel??d.scopeTriggerLevel??2.5),triggerNet=g.find(key(c.id,source)),groundNet=g.find(key(c.id,'GND')),grounded=project.components.some(src=>{const sd=byId[src.typeId];if(!sd||src.id===c.id)return false;const grounds=sd.arduinoBoard?['GND','GND2','ICSP_GND','USBICSP_GND']:sd.arduinoRole==='signal-generator'?['GND']:sd.arduinoRole==='bench-supply'?['M']:sd.pins?.some(p=>p.id==='GND')?['GND']:[];return grounds.some(p=>sd.pins?.some(q=>q.id===p)&&g.find(key(src.id,p))===groundNet)}),triggerInfo=voltageAt(triggerNet,now),adaptive=Math.ceil(span/1000*Math.max(0,triggerInfo.f||0)*12),points=Math.max(80,Math.min(800,Math.max(Math.round(Number(c.scopeSamplePoints??d.scopeSamplePoints??240)),adaptive)));c._scopeGrounded=grounded;if(!grounded){c._scopeTrace1=Array(points).fill(0);c._scopeTrace2=Array(points).fill(0);c._scopeRaw1=[...c._scopeTrace1];c._scopeRaw2=[...c._scopeTrace2];c._scopeStats1=scopeStats(c._scopeTrace1,span,0);c._scopeStats2=scopeStats(c._scopeTrace2,span,0);c._scopeV1=0;c._scopeV2=0;c._scopeFrequency1=0;c._scopeFrequency2=0;c._scopeTriggered=false;c._active=true;continue}
      let start=now-span,triggered=false,triggerAt=null;
      if(mode!=='free'){const scanPoints=Math.max(240,Math.min(1200,points*2)),scanSpan=Math.max(span,200),dt=scanSpan/(scanPoints-1);let prev=voltageAt(triggerNet,now-scanSpan).v;for(let i=1;i<scanPoints;i++){const t=now-scanSpan+i*dt,cur=voltageAt(triggerNet,t).v,hit=edge==='falling'?(prev>level&&cur<=level):(prev<level&&cur>=level);if(hit){triggerAt=t;triggered=true}prev=cur}if(triggered)start=triggerAt-span*.25;else if(mode==='normal'&&Array.isArray(c._scopeTrace1)&&c._scopeTrace1.length){c._scopeTriggered=false;c._active=true;continue}}
      const make=(pin,coupling)=>{const net=g.find(key(c.id,pin)),raw=[],known=[];for(let i=0;i<points;i++){const s=voltageAt(net,start+(i/(points-1))*span);raw.push(s.v);if(s.f>0)known.push(s.f)}const mean=raw.reduce((s,v)=>s+v,0)/raw.length,trace=String(coupling||'DC').toUpperCase()==='AC'?raw.map(v=>v-mean):raw,knownFreq=known.length?known.reduce((s,v)=>s+v,0)/known.length:0;return {trace,raw,last:voltageAt(net,now),stats:scopeStats(trace,span,knownFreq)}};
      const a=make('CH1',c.scopeCoupling1??d.scopeCoupling1??'DC'),bb=make('CH2',c.scopeCoupling2??d.scopeCoupling2??'DC');c._scopeTrace1=a.trace;c._scopeTrace2=bb.trace;c._scopeRaw1=a.raw;c._scopeRaw2=bb.raw;c._scopeV1=a.last.v;c._scopeV2=bb.last.v;c._scopeFrequency1=a.stats.freq;c._scopeFrequency2=bb.stats.freq;c._scopeStats1=a.stats;c._scopeStats2=bb.stats;c._scopeTriggered=triggered;c._scopeTriggerAt=triggerAt;c._scopeStart=start;c._scopeSpan=span;c._active=true
    }
  }
  function tick(project,byId,{now=Date.now()}={}){const g=graph(project,byId),errors=[];let active=false;updateArduinoInstruments(project,byId,g,now);
  for(const c of project.components){const d=byId[c.typeId];if(!d?.incrementalEncoder38mm)continue;let status='off',volts=0;
    for(const b of project.components.filter(x=>byId[x.typeId]?.arduinoBoard)){const same=(cp,bp)=>g.find(key(c.id,cp))===g.find(key(b.id,bp)),ground=['GND','GND2'].some(p=>same('−',p)),reverse=['GND','GND2'].some(p=>same('+',p))&&same('−','5V');if(reverse){status='reversed';volts=-5;break}if(same('+','5V')&&ground){status='ok';volts=5;break}}
    if(status==='off')for(const s of project.components){const sd=byId[s.typeId];if(sd?.arduinoRole!=='bench-supply')continue;const same=(cp,sp)=>g.find(key(c.id,cp))===g.find(key(s.id,sp)),v=Number(s.dcVoltage??sd.defaultVoltage??5);if(same('+','P')&&same('−','M')&&v>=5&&v<=24){status='ok';volts=v;break}if(same('+','M')&&same('−','P')){status='reversed';volts=-v;break}}
    c._encoderSupply=status;c._encoderSupplyVoltage=volts;c._encoderPowered=status==='ok';IncrementalEncoder.state(c,d,now,true);c._active=c._encoderPowered;
  }for(const c of project.components){const d=byId[c.typeId];if(d?.arduinoRole!=='breadboard-power')continue;const wired=p=>(project.wires||[]).some(w=>[w.from,w.to].some(e=>e?.c===c.id&&e?.p===p)),source=wired('USB5V')?'USB 5V':wired('VIN')?'VIN 6.5–12 V':'Kaynak yok',l=String(c.hw131Left??d.hw131Left??'5'),r=String(c.hw131Right??d.hw131Right??'3.3'),short=(l!=='OFF'&&g.find(key(c.id,'L+'))===g.find(key(c.id,'LGND')))||(r!=='OFF'&&g.find(key(c.id,'R+'))===g.find(key(c.id,'RGND'))),powered=c.hw131On!==false&&source!=='Kaynak yok'&&!short;c._hw131Source=source;c._hw131Short=short;c._hw131Powered=powered;c._hw131Outputs={left:powered&&l!=='OFF'?Number(l):0,right:powered&&r!=='OFF'?Number(r):0,v5:powered?5:0,v33:powered?3.3:0};c._active=powered}for(const b of project.components.filter(c=>byId[c.typeId]?.arduinoBoard)){const r=runBoard(b,project,byId,g,now);active=active||r.active;if(r.error)errors.push((b.ref||'Arduino')+': '+r.error)}present(project,byId,g);updateArduinoInstruments(project,byId,g,now);return {active,errors,next:20}}
  function clear(project){for(const c of project.components){delete c._arduinoRuntime;delete c._arduinoPins;delete c._arduinoStatus;delete c._arduinoError;delete c._arduinoConsole;delete c._arduinoSerialBaud;delete c._arduinoOn;delete c._arduinoBrightness;delete c._arduinoRGB;delete c._neopixelPowered;delete c._neopixelDataPin;delete c._oledTextSize;delete c._oledInverted;delete c._arduinoTone;delete c._arduinoServoAngle;delete c._arduinoServoPulseUs;delete c._arduinoStepperAngle;delete c._arduinoCoils;delete c._a4988Microstep;delete c._a4988Enabled;delete c._a4988PowerOk;delete c._a4988Angle;delete c._a4988StepHigh;delete c._a4988AccelPosition;delete c._hw131Source;delete c._hw131Short;delete c._hw131Powered;delete c._hw131Outputs;delete c._ne555Out;delete c._ne555Discharge;delete c._ne555Frequency;delete c._ne555HighMs;delete c._ne555LowMs;delete c._ne555PulseMs;delete c._ne555PulseUntil;delete c._ne555TrigLow;delete c._ne555Epoch;delete c._arduinoDisplay;delete c._arduinoDisplayLines;delete c._arduinoLcdCursor;delete c._arduinoLcdBacklight;delete c._sevenSegments;delete c._arduinoLogicOutputs;delete c._signalVoltage;delete c._signalPhase;delete c._scopeTrace1;delete c._scopeTrace2;delete c._scopeRaw1;delete c._scopeRaw2;delete c._scopeV1;delete c._scopeV2;delete c._scopeFrequency1;delete c._scopeFrequency2;delete c._scopeStats1;delete c._scopeStats2;delete c._scopeGrounded;delete c._scopeTriggered;delete c._scopeTriggerAt;delete c._scopeStart;delete c._scopeSpan;delete c._hc595Shift;delete c._hc595Latch;delete c._cd4017Count;delete c._max7219Shift;delete c._max7219Bits;delete c._max7219Regs;delete c._max7219Digits;delete c._mcpRegs;delete c._encoderPowered;delete c._encoderSupply;delete c._encoderSupplyVoltage;delete c._encoderPullupWarning;delete c._encoderA;delete c._encoderB;delete c._encoderZ;delete c._encoderPulseHz;delete c._encoderOverspeed;delete c._encoderResponseOver;delete c._encoderLastTime}}
  function verify(code){try{const p=compile(code);return {ok:true,message:'Doğrulama başarılı · setup '+p.setup.length+' / loop '+p.loop.length+' komut'}}catch(e){return {ok:false,message:e.message}}}
  const C=(id,typeId,x,y,extra={})=>({id,typeId,x,y,rotation:0,label:Library.components.find(d=>d.id===typeId)?.name||typeId,ref:id.toUpperCase(),address:'',note:'',state:false,...extra});
  const W=(id,a,ap,b,bp,color='#d32f2f')=>({id,from:{c:a,p:ap},to:{c:b,p:bp},points:[],color,role:'SIGNAL',size:'0,75 mm²'});
  function exampleProject(k,id=uid()){
    const meta=Examples?.byId?.[k]||null,e=meta||sketches[k]||Examples?.byId?.blink||{title:'Blink',code:sketches.blank.code,circuit:'board'},repo=meta?.sourceRepo||'',path=meta?.sourcePath||'';
    const circuit=/SoftwareSerial/i.test(path)?'bluetooth':/arduino-libraries\/LiquidCrystal$/i.test(repo)?'lcd':/arduino-libraries\/Servo$/i.test(repo)?'servo':/arduino-libraries\/Stepper$/i.test(repo)?'stepper':/arduino-libraries\/SD$/i.test(repo)?'sd':/libraries\/Wire\//i.test(path)?'i2c':/libraries\/SPI\//i.test(path)?'spi':e.circuit||'board';
    const official=meta?.official?{id:meta.id,title:meta.title,category:meta.category,sourceRepo:meta.sourceRepo,sourceRef:meta.sourceRef,sourcePath:meta.sourcePath,sourceUrl:meta.sourceUrl,license:meta.license,readOnly:true}:null;
    const b=C('uno','arduino-uno',330,250,{arduinoSketch:e.code||sketches.blank.code,arduinoProgramName:e.title||e.name||k,ref:'ARD1',...(official?{arduinoOfficialExample:official}:{})});
    const p={version:7,workspaceMode:'arduino',projectId:id,name:'Arduino · '+(e.title||e.name||k),symbolNorm:'IEC',preferredAppearance:'material',components:[b],wires:[],junctions:[],colorRoles:{}};
    const add=c=>p.components.push(c),link=(a,ap,b,bp,col)=>p.wires.push(W('aw'+(p.wires.length+1),a,ap,b,bp,col));
    if(circuit==='blink'||circuit==='fade'){
      add(C('led','arduino-led',780,300));link('uno',circuit==='fade'?'D9':'D13','led','A');link('uno','GND','led','K','#263238');
    }else if(circuit==='button'){
      add(C('button','arduino-button',700,200));add(C('led','arduino-led',790,410));link('uno','D2','button','SIG','#1565c0');link('uno','5V','button','VCC');link('uno','GND','button','GND','#263238');link('uno','D13','led','A');link('uno','GND2','led','K','#263238');
    }else if(circuit==='analog'){
      add(C('pot','arduino-pot',730,300,{potentiometer:50}));link('uno','A0','pot','SIG','#ff9800');link('uno','5V','pot','VCC');link('uno','GND','pot','GND','#263238');
    }else if(circuit==='tone'){
      add(C('buzz','arduino-buzzer',750,300));link('uno','D8','buzz','SIG','#1565c0');link('uno','5V','buzz','VCC');link('uno','GND','buzz','GND','#263238');
    }else if(circuit==='ultrasonic'){
      add(C('sonar','arduino-hcsr04',740,240,{arduinoValue:30}));add(C('led','arduino-led',780,420));link('uno','D7','sonar','TRIG','#1565c0');link('uno','D6','sonar','ECHO','#00897b');link('uno','5V','sonar','VCC');link('uno','GND','sonar','GND','#263238');link('uno','D13','led','A');link('uno','GND2','led','K','#263238');
    }else if(circuit==='rgb'){
      add(C('rgb','arduino-rgb-led',750,300));link('uno','D9','rgb','R');link('uno','D10','rgb','G','#43a047');link('uno','D11','rgb','B','#1e88e5');link('uno','GND','rgb','GND','#263238');
    }else if(circuit==='servo'){
      add(C('servo','arduino-servo-sg90',760,290));add(C('pot','arduino-pot',760,430,{potentiometer:50}));link('uno','D9','servo','SIG','#ff9800');link('uno','5V','servo','VCC');link('uno','GND','servo','GND','#263238');link('uno','A0','pot','SIG','#f57c00');link('uno','5V','pot','VCC');link('uno','GND2','pot','GND','#263238');
    }else if(circuit==='lcd'){
      add(C('lcd','arduino-lcd1602',720,250));add(C('lcdpot','arduino-pot',760,430,{potentiometer:50}));
      link('uno','5V','lcd','VDD');link('uno','GND','lcd','VSS','#263238');link('uno','GND2','lcd','RW','#263238');link('uno','5V','lcd','A');link('uno','GND','lcd','K','#263238');
      link('uno','5V','lcdpot','VCC');link('uno','GND','lcdpot','GND','#263238');link('lcdpot','SIG','lcd','VO','#ff9800');
      link('uno','D12','lcd','RS','#1565c0');link('uno','D11','lcd','E','#00897b');link('uno','D5','lcd','D4');link('uno','D4','lcd','D5');link('uno','D3','lcd','D6');link('uno','D2','lcd','D7');
    }else if(circuit==='stepper'){
      add(C('stepper','arduino-stepper-28byj',740,270));link('uno','D8','stepper','IN1');link('uno','D9','stepper','IN2');link('uno','D10','stepper','IN3');link('uno','D11','stepper','IN4');link('uno','5V','stepper','VCC');link('uno','GND','stepper','GND','#263238');
    }else if(circuit==='sd'||circuit==='spi'){
      add(C('sd','arduino-sd-module',740,270));link('uno','D10','sd','CS','#1565c0');link('uno','D11','sd','MOSI','#f57c00');link('uno','D12','sd','MISO','#00897b');link('uno','D13','sd','SCK','#7b1fa2');link('uno','5V','sd','VCC');link('uno','GND','sd','GND','#263238');
    }else if(circuit==='i2c'){
      add(C('oled','arduino-oled-091-yellow',740,270));link('uno','A4','oled','SDA','#1565c0');link('uno','A5','oled','SCL','#00897b');link('uno','5V','oled','VCC');link('uno','GND','oled','GND','#263238');
    }else if(circuit==='bluetooth'){
      const bm=(e.code||'').match(/\b(?!Serial\b)[A-Za-z_]\w*\.begin\(\s*(\d+)\s*\)/),btBaud=bm?Number(bm[1]):9600;
      add(C('hc05','arduino-hc05',740,270,{hc05Baud:btBaud,hc05Name:'HC-05'}));link('uno','5V','hc05','VCC');link('uno','GND','hc05','GND','#263238');link('uno','D10','hc05','TXD','#1565c0');link('uno','D11','hc05','RXD','#f57c00');
    }else if(circuit==='breadboard'||circuit==='isp'){
      add(C('bb','arduino-breadboard',700,200,{ref:'BB1'}));link('uno','5V','bb','PT1','#d32f2f');link('uno','GND','bb','NT1','#263238');
    }
    return p;
  }
  function savedBoards(storage=root.localStorage){try{const r=JSON.parse(storage?.getItem('dts-arduino-boards')||'[]');return Array.isArray(r)?r.filter(x=>x?.id&&x?.name&&typeof x.sketch==='string'):[]}catch{return []}}
  function saveBoard(storage,data){const row={id:data.id||uid(),name:String(data.name||'Arduino Kartım').trim().slice(0,80)||'Arduino Kartım',sketch:String(data.sketch||sketches.blank.code),sourceExample:data.sourceExample||null,editable:true,updatedAt:new Date().toISOString()},rows=[row,...savedBoards(storage).filter(x=>x.id!==row.id)].slice(0,50);storage.setItem('dts-arduino-boards',JSON.stringify(rows));return row}
  function applySaved(c,row){c.arduinoBoardId=row.id;c.arduinoProgramName=row.name;c.arduinoSketch=row.sketch;c.label=row.name;c.arduinoSourceExample=row.sourceExample||c.arduinoSourceExample||null;delete c.arduinoOfficialExample;delete c._arduinoRuntime;delete c._arduinoError}
  function refresh(project,byId){present(project,byId,graph(project,byId))}
  function serialState(board,monitorBaud=9600){
    const rt=board?._arduinoRuntime,s=rt?.serial;if(!s)return {programBaud:Number(board?._arduinoSerialBaud||0),monitorBaud:Number(monitorBaud)||9600,text:'',rxCount:0,eventCount:0};
    const baud=Number(monitorBaud)||9600,text=(s.events||[]).map(e=>bytesToText(garble(e.bytes||[],e.baud||s.baud,baud))).join('').slice(-12000);
    return {programBaud:s.baud||0,monitorBaud:baud,text,rxCount:s.rx?.length||0,eventCount:s.events?.length||0};
  }
  function serialMonitorSend(board,text,ending='none',monitorBaud=9600){
    if(!board)return {ok:false,message:'Arduino kartı seçili değil.'};const endings={none:'',nl:'\n',cr:'\r',both:'\r\n'},data=String(text??'')+(endings[ending]??'');
    const rt=board._arduinoRuntime;if(!rt?.serial?.baud){board._arduinoSerialPending=board._arduinoSerialPending||[];board._arduinoSerialPending.push(...toBytes(data));return {ok:true,pending:true,count:data.length}}
    rt.serial.rx.push(...garble(toBytes(data),Number(monitorBaud)||9600,rt.serial.baud));return {ok:true,pending:false,count:data.length};
  }
  function serialClear(board){const s=board?._arduinoRuntime?.serial;if(s){s.events.length=0;s.seq=0}if(board){board._arduinoConsole=''}}
  function hc05List(project,byId){return (project?.components||[]).filter(c=>byId?.[c.typeId]?.arduinoRole==='bluetooth-hc05')}
  function hc05State(c,d={}){if(!c)return null;ensureHC05(c,d);return {id:c.id,name:c.hc05Name,baud:c.hc05Baud,activeBaud:c.hc05AtMode?Number(d.atBaud||38400):c.hc05Baud,pin:c.hc05Pin,atMode:!!c.hc05AtMode,connected:!!c._hc05Connected,rxCount:c._hc05AirRx.length,txCount:c._hc05AirTx.length,log:[...c._hc05Log].slice(-40)}}
  function hc05Receive(c,data,sourceBaud=0,d={}){if(!c)return 0;ensureHC05(c,d);const bytes=garble(toBytes(data),Number(sourceBaud)||c.hc05Baud,c.hc05Baud);c._hc05AirRx.push(...bytes);c._hc05Connected=true;c._hc05ActiveUntil=Date.now()+250;c._hc05Log.push('RX '+bytesToText(bytes));if(c._hc05Log.length>80)c._hc05Log.splice(0,c._hc05Log.length-80);return bytes.length}
  function hc05TakeTx(c,targetBaud=0,d={}){if(!c)return new Uint8Array();ensureHC05(c,d);const bytes=c._hc05AirTx.splice(0,c._hc05AirTx.length);return new Uint8Array(garble(bytes,c.hc05Baud,Number(targetBaud)||c.hc05Baud))}
  function hc05SetConnected(c,on,d={}){if(!c)return;ensureHC05(c,d);c._hc05Connected=!!on;if(!on)c._hc05ActiveUntil=0}
  const api={sketches,compile,verify,tick,refresh,clear,exampleProject,savedBoards,saveBoard,applySaved,pinName,serialState,serialMonitorSend,serialClear,hc05List,hc05State,hc05Receive,hc05TakeTx,hc05SetConnected};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSArduino=api;
})(typeof window==='undefined'?globalThis:window);
