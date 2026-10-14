'use strict';
// Real, local Node tests only. Never treats historical logs or missing tests as PASS.
// No GitHub Actions, network access, or canonical source edits.
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const ROOT=path.resolve(__dirname,'..');
const REQUIRED=[
 'tests/qa-mq12-small-batches-v11920.test.cjs',
 'tests/qa-mq12-native-first-ten-v11920.test.cjs',
 'tests/qa-mq12-control-profiles-v11920.test.cjs',
 'tests/qa-mq12-review-targeted-v11920.test.cjs',
 'tests/qa-mq12-review-diagnostics-v11920.test.cjs',
 'tests/qa-mq12-bjt-resistive-bias-v11920.test.cjs',
 'tests/qa-mq12-dual-sensor-reactive-v11920.test.cjs',
 'tests/qa-mq12-physical-evidence-v11920.test.cjs',
 'tests/qa-mq12-sensor-canonical-reconcile-v11920.test.cjs',
 'tests/qa-mq12-sensor-review-reactive-v11920.test.cjs',
 'tests/qa-mq12-sensor-model-compatibility-v11920.test.cjs',
 'tests/qa-mq12-sensor-electrical-contract-v11920.test.cjs',
 'tests/qa-mq12-ultrasonic-buzzer-fixture-v11920.test.cjs',
 'tests/qa-mq12-interface-model-gaps-v11920.test.cjs',
 'tests/qa-mq12-analog-decision-guard-v11920.test.cjs',
 'tests/qa-mq12-sonic-headroom-v11920.test.cjs',
 'tests/qa-tutorial-722-sequential-v11920.test.cjs',
 'tests/qa-tutorial-practice-1519-v11920.test.cjs',
 'tests/tutorial-practice-guide-batch-n-v11920.test.cjs',
];
const RUNNERS=[
 'scripts/qa-mq12-small-batches-v11920.cjs',
 'scripts/qa-mq12-control-profiles-v11920.cjs',
 'scripts/qa-mq12-review-diagnostics-v11920.cjs',
 'scripts/qa-mq12-sensor-model-compatibility-v11920.cjs',
 'scripts/qa-mq12-sensor-electrical-contract-v11920.cjs',
 'scripts/qa-mq12-ultrasonic-buzzer-fixture-v11920.cjs',
 'scripts/qa-mq12-interface-model-gaps-v11920.cjs',
 'scripts/qa-mq12-analog-decision-guard-v11920.cjs',
 'scripts/qa-mq12-sonic-headroom-v11920.cjs',
];
function inventory(root=ROOT,required=REQUIRED,runners=RUNNERS){
 const missingTests=required.filter(p=>!fs.existsSync(path.join(root,p)));
 const missingRunners=runners.filter(p=>!fs.existsSync(path.join(root,p)));
 return {scope:'MQ12_EXPECTED_SOURCE_INVENTORY',requiredTests:required.length,
  availableTests:required.length-missingTests.length,requiredRunners:runners.length,
  availableRunners:runners.length-missingRunners.length,missingTests,missingRunners,
  complete:!missingTests.length&&!missingRunners.length};
}
function execute(root=ROOT){
 const check=inventory(root);
 if(!check.complete)return {...check,executed:false,passed:null,status:'INCOMPLETE'};
 const child=cp.spawnSync(process.execPath,['--test',...REQUIRED],{cwd:root,encoding:'utf8',maxBuffer:8*1024*1024});
 const output=child.stdout||'';
 const count=name=>Number(output.match(new RegExp('^# '+name+' (\\d+)','m'))?.[1]||0);
 const tests=count('tests'),passed=count('pass'),failed=count('fail');
 return {...check,executed:true,tests,passed,failed,status:child.status===0&&tests>=71&&passed===tests&&failed===0?'PASS':'REVIEW',exitCode:child.status,stderr:child.stderr||'',stdout:output};
}
if(require.main===module){
 const sourceCheck=process.argv.includes('--check');
 const checked=inventory();
 // Source completeness is necessary but NEVER proof that a regression was executed.
 const report=sourceCheck?{...checked,executed:false,passed:null,status:checked.complete?'SOURCES_PRESENT_UNTESTED':'INCOMPLETE'}:execute();
 const summary={...report};delete summary.stdout;delete summary.stderr;
 console.log(JSON.stringify(summary,null,2));
 if(report.executed&&report.stdout)process.stdout.write(report.stdout);
 // A missing source must make --check fail, not silently return a successful shell status.
 if(sourceCheck?!report.complete:report.status!=='PASS')process.exitCode=1;
}
module.exports={REQUIRED,RUNNERS,inventory,execute};
