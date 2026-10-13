'use strict';
// Manufacturer-limit arithmetic; not a physical product wiring approval.
const Sensor={supplyMinV:18,supplyMaxV:30,maximumOutputDropV:2.5,switchLimitMA:100};
const Sounder={ratedV:24,tolerance:0.10,maximumCurrentMA:28};
function assess(supplyV=24){
 const minSounderV=Sounder.ratedV*(1-Sounder.tolerance);
 const guaranteedLowerBoundV=supplyV-Sensor.maximumOutputDropV;
 const withinSensorSupply=supplyV>=Sensor.supplyMinV&&supplyV<=Sensor.supplyMaxV;
 const currentLimitSufficient=Sounder.maximumCurrentMA<=Sensor.switchLimitMA;
 // A strict < 2.5-V output drop does NOT prove the load voltage stays at/above 21.6-V.
 const worstCaseSounderVoltageGuaranteed=withinSensorSupply&&guaranteedLowerBoundV>=minSounderV;
 return {supplyV,minSounderV,guaranteedLowerBoundV,voltageMarginV:guaranteedLowerBoundV-minSounderV,
  withinSensorSupply,currentLimitSufficient,worstCaseSounderVoltageGuaranteed,
  extraRelayCoilCurrentVerified:false,actualWiringTerminalsVerified:false,
  physicallyApproved:false,acceptance:'REVIEW'};
}
if(require.main===module)console.log(JSON.stringify(assess(),null,2));
module.exports={assess,Sensor,Sounder};
