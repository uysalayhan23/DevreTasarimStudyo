(function(root){
  'use strict';
  const SCENE_UNITS_PER_MM=2;
  const WIDTH_SCENE=2800;
  const HEIGHT_SCENE=1800;
  const api=Object.freeze({
    version:'workspace-space-v1',
    sceneUnitsPerMm:SCENE_UNITS_PER_MM,
    widthScene:WIDTH_SCENE,
    heightScene:HEIGHT_SCENE,
    widthMm:WIDTH_SCENE/SCENE_UNITS_PER_MM,
    heightMm:HEIGHT_SCENE/SCENE_UNITS_PER_MM,
    gridScene:10,
    gridMm:5,
    origin:Object.freeze({x:0,y:0}),
    modes:Object.freeze(['control','building','arduino','panel']),
    sceneFromMm:mm=>Number(mm)*SCENE_UNITS_PER_MM,
    mmFromScene:scene=>Number(scene)/SCENE_UNITS_PER_MM,
    panelMmNative:true
  });
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.DTSWorkspaceSpace=api;
})(typeof window==='undefined'?globalThis:window);
