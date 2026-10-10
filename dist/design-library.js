(function(root){
  'use strict';
  const pin=(id,x,y,side)=>({id,label:id,x,y,side});
  function extend(lib){
    const extra=[],source={file:'EET2025TA1005(1).pdf',pages:'77–80, 142, 182–190',basis:'Tesisat işlevleri ve bağlantı düzeninden uyarlanmış eğitim çizimi'};
    const add=(id,name,kind,pins,props={})=>extra.push({id,name,kind,pins,w:100,h:120,orientation:'vertical',catalogGroup:'installation',buildingOnly:true,model:'Tesisat eğitim elemanı',designMaterial:true,symbolSource:source,...props});
    add('wall-switch','Adi Anahtar','switch-no',[pin('13',50,0,'top'),pin('14',50,120,'bottom')],{interactive:true,controlMode:'toggle',refPrefix:'S'});
    add('wall-vavien','Vaviyen Anahtar','switch-both',[pin('11',50,0,'top'),pin('12',30,120,'bottom'),pin('14',70,120,'bottom')],{interactive:true,controlMode:'toggle',refPrefix:'S'});
    add('wall-commutator','Komütatör Anahtar','switch-multi',[pin('1',30,0,'top'),pin('3',70,0,'top'),pin('2',30,120,'bottom'),pin('4',70,120,'bottom')],{interactive:true,controlMode:'toggle',contacts:[{id:'a',a:'1',b:'2',normal:'NO'},{id:'b',a:'3',b:'4',normal:'NO'}],refPrefix:'S'});
    add('wall-intermediate','Ara Vaviyen · Permütatör','switch-multi',[pin('1',30,0,'top'),pin('3',70,0,'top'),pin('2',30,120,'bottom'),pin('4',70,120,'bottom')],{interactive:true,controlMode:'toggle',contacts:[{id:'a',a:'1',b:'2',normal:'NC'},{id:'b',a:'3',b:'4',normal:'NC'},{id:'c',a:'1',b:'4',normal:'NO'},{id:'d',a:'3',b:'2',normal:'NO'}],refPrefix:'S'});
    add('lampholder-e27','E27 Duy','lamp',[pin('X1',50,0,'top'),pin('X2',50,120,'bottom')],{catalogGroup:'lamps',refPrefix:'H',color:'#f5c542',model:'Ampul takılı duy · mantıksal lamba'});
    add('ceiling-light','Tavan Armatürü','lamp',[pin('X1',50,0,'top'),pin('X2',50,120,'bottom')],{catalogGroup:'lamps',refPrefix:'H',color:'#f5c542'});
    add('led-luminaire','LED Lineer Armatür','lamp',[pin('X1',50,0,'top'),pin('X2',50,120,'bottom')],{catalogGroup:'lamps',refPrefix:'H',color:'#f5c542'});
    add('earth-electrode','Topraklama Çubuğu','ground',[pin('PE',50,0,'top')],{catalogGroup:'terminals',refPrefix:'PE',diagramOnly:true});
    add('panel-din-rail','DIN Rayı · 35 mm','diagram',[],{buildingOnly:false,panelOnly:true,catalogGroup:'panel-layout',refPrefix:'R',diagramOnly:true,model:'Pano içine ray ekleyin'});
    add('panel-gland','Kablo Giriş Rekoru','diagram',[],{buildingOnly:false,panelOnly:true,catalogGroup:'panel-layout',diagramOnly:true});
    add('panel-spiral','Kablo Spirali','diagram',[],{buildingOnly:false,panelOnly:true,catalogGroup:'panel-layout',diagramOnly:true});
    add('panel-duct','Kablo Kanalı','diagram',[],{buildingOnly:false,panelOnly:true,catalogGroup:'panel-layout',refPrefix:'D',diagramOnly:true});
    for(const poles of [1,2,3,4,5,6,7,8]){
      const w=(poles+1)*20,pins=Array.from({length:poles},(_,i)=>[pin(String(i*2+1),(i+1)*20,0,'top'),pin(String(i*2+2),(i+1)*20,120,'bottom')]).flat();
      add('door-isolator-'+poles+'p',poles+' Kutuplu Aç–Kapa Şalter','switch-multi',pins,{w,buildingOnly:false,catalogGroup:'switches',refPrefix:'Q',panelMount:'door',interactive:true,controlMode:'toggle',contacts:Array.from({length:poles},(_,i)=>({id:'pole'+i,a:String(i*2+1),b:String(i*2+2),normal:'NO'})),model:poles+'P · döner kumandalı şalter',symbolSource:{file:'EET2025KP1115-pano(1).pdf',pages:'62–63',basis:'Kapak kumandası ve pano yerleşiminden uyarlanmış işlevsel gösterim'}});
    }
    for(const d of extra)if(d.id.startsWith('door-isolator-'))Object.assign(d,{w:Math.max(180,20+d.pins.length*10),h:200,orientation:'front',pins:d.pins.map((p,i)=>({...p,x:20+Math.floor(i/2)*20,y:i%2?200:0})),liveMaterial:true,materialSymbol:false,designMaterial:false,materialAsset:'selector-front-v110',rotaryIsolator:true});
    return (typeof module==='object'&&module.exports?require('./installation-v118.js'):root.DTSInstallation).extend([...lib,...extra.filter(d=>!lib.some(old=>old.id===d.id))]);
  }
  const api={extend};if(typeof module==='object'&&module.exports)module.exports=api;else root.DTSDesignLibrary=api;
})(typeof window==='undefined'?globalThis:window);
