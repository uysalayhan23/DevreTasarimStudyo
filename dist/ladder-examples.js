(function(root){
 'use strict';
 // Original DTS-only virtual Ladder sample programs (not Siemens .lsc examples).
 const L=typeof module==='object'&&module.exports?require('./ladder-runtime.js'):root?.DTSLadderRuntime;
 const contact=(ref,type='NO')=>({type,ref});
 const path=(...terms)=>terms;
 const rung=(id,paths,coil,comment)=>({id,paths,coil,comment});
 const definitions=[
  {id:'seal',title:'Start / Stop · Mühürleme',description:'I1 başlatır, I2 durdurur. Q1 kendini tutar.',needsInputs:2,needsOutputs:1},
  {id:'ton',title:'TON · Gecikmeli çalıştırma',description:'I1 etkin kaldıktan 1,5 saniye sonra Q1 çalışır.',needsInputs:1,needsOutputs:1},
  {id:'counter',title:'CTU · Üç darbe sayacı',description:'I1 üç kez etkinleşince Q1 çalışır; I2 sayacı sıfırlar.',needsInputs:2,needsOutputs:1},
  {id:'interlock',title:'İleri / Geri · Sanal kilitleme',description:'I1 ileri, I3 geri, I2 durdur; Q1 ile Q2 birlikte çalışmaz.',needsInputs:3,needsOutputs:2}
 ];
 function list(limits={}){
  const nIn=Number.isInteger(limits.inputCount)?limits.inputCount:16;
  const nOut=Number.isInteger(limits.outputCount)?limits.outputCount:16;
  return definitions.filter(e=>e.needsInputs<=nIn&&e.needsOutputs<=nOut).map(e=>({...e}));
 }
 function build(id,limits={}){
  let program;
  if(id==='seal'){
   program={version:1,rungs:[rung('R1',[
     path(contact('I1'),contact('I2','NC')),
     path(contact('Q1'),contact('I2','NC'))],{type:'OUT',ref:'Q1'},'Başlat, mühürle; Stop ile bırak')]};
  }else if(id==='ton'){
   program={version:1,rungs:[
    rung('R1',[path(contact('I1'))],{type:'TON',ref:'T1',presetMs:1500},'I1 geldikten 1,5 saniye say'),
    rung('R2',[path(contact('T1'))],{type:'OUT',ref:'Q1'},'Süre dolunca Q1 çalışsın')]};
  }else if(id==='counter'){
   program={version:1,rungs:[
    rung('R1',[path(contact('I1'))],{type:'CTU',ref:'C1',preset:3},'I1 yükselen kenarları say'),
    rung('R2',[path(contact('I2'))],{type:'RESET',ref:'C1'},'I2 ile sayacı sıfırla'),
    rung('R3',[path(contact('C1'))],{type:'OUT',ref:'Q1'},'Üç darbede Q1 çalışsın')]};
  }else if(id==='interlock'){
   program={version:1,rungs:[
    rung('R1',[
      path(contact('I1'),contact('I2','NC'),contact('Q2','NC')),
      path(contact('Q1'),contact('I2','NC'),contact('Q2','NC'))],
     {type:'OUT',ref:'Q1'},'İleri seçimi; geri çıkış kapalıyken çalış'),
    rung('R2',[
      path(contact('I3'),contact('I2','NC'),contact('Q1','NC')),
      path(contact('Q2'),contact('I2','NC'),contact('Q1','NC'))],
     {type:'OUT',ref:'Q2'},'Geri seçimi; ileri çıkış kapalıyken çalış')]};
  }else throw Error('Hazır Ladder örneği bulunamadı.');
  const check=L?.validate?.(program,limits);
  if(!check?.ok)throw Error('Örnek bu PLC ile uyumlu değil: '+(check?.error||'bilinmeyen hata'));
  return JSON.parse(JSON.stringify(program));
 }
 const api=Object.freeze({list,build});
 if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSLadderExamples=api;
})(typeof window==='undefined'?globalThis:window);
