const fs=require('node:fs'),path=require('node:path'),root=path.resolve(__dirname,'..');
const sets={
 Omron_CP_Ornekleri:['CP1E-E10DR-A','CP1E-N30S1DT1-D','CP1E-NA20DR-A','CP2E-N14DR-A','CP2E-N30DT-D','CP2E-N60DT1-D'],
 Siemens_S71200_Ornekleri:['6ES7211-1AE40-0XB0','6ES7212-1BE40-0XB0','6ES7214-1HG40-0XB0','6ES7215-1AG40-0XB0','6ES7217-1AG40-0XB0'],
 Delta_SE_Varyantlari:['DVP12SE11R','DVP12SE11T','DVP26SE11R','DVP26SE11T','DVP26SE11S'],
 GMTCNT_Ornekleri:['GLC-196R','GLC-296T','GLC-496R','GXM-16IA','GXM-42AN','GXM-20L','GXM-40UA']
};
for(const [name,parts] of Object.entries(sets)){
 const project={version:7,name:name+'_v1.14',workspaceMode:'control',components:parts.map((part,i)=>({id:'plc'+i,typeId:'plc-hw-'+part.toLowerCase(),x:120+(i%3)*700,y:100+Math.floor(i/3)*500,ref:'PLC'+(i+1),label:part,materialScale:1})),wires:[],junctions:[]};
 fs.writeFileSync(path.join(root,'Ornekler',name+'_v1.14.odsdevre'),JSON.stringify(project,null,2));
}
console.log('PLC comparison examples:',Object.keys(sets).length);
