(function(root){
'use strict';
const dimensions={drive:{id:'hcfa-x2ea040a-front',width:141,height:438,model:'HCFA SV-X2EA040A-A · 400 W servo sürücü',part:'SV-X2EA040A-A',fitMode:'contain-no-distortion',physicalFrameMm:{width:42,height:165}},motor:{id:'hcfa-x2mh040-front',width:640,height:244,model:'HCFA SV-X2MH040A-N2LN servo motor',part:'SV-X2MH040A-N2LN',fitMode:'contain-no-distortion',physicalFrameMm:{width:162.2,height:60}}};
function assets(images=root){
 const result={};
 for(const [family,spec] of Object.entries(dimensions)){
  const b64=images[family==='drive'?'DTSHCFADriveB64':'DTSHCFAMotorB64'],mime=images[family==='drive'?'DTSHCFADriveMime':'DTSHCFAMotorMime']||'image/jpeg';
  if(b64)result[spec.id]={file:'data:'+mime+';base64,'+b64,atlasWidth:spec.width,atlasHeight:spec.height,viewBox:'0 0 '+spec.width+' '+spec.height,bounds:{x:0,y:0,width:spec.width,height:spec.height},match:'exact',model:spec.model,part:spec.part,source:'Kullanıcı tarafından 2026-10-07 sağlanan HCFA ürün görseli · offline embedded WebP'};
 }
 return result;
}
function register(target,images=root){return Object.assign(target,assets(images))}
const api={assets,register};
if(typeof module==='object'&&module.exports)module.exports=api;
else register(root.CCSProductAssets||(root.CCSProductAssets={}),root);
})(typeof window==='undefined'?globalThis:window);
