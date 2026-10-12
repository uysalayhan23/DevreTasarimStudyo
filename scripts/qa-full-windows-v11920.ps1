# Unified Windows QA only. Application BASLAT.bat stays offline file:///.
$ErrorActionPreference='Stop'
$Root=[IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
Set-Location -LiteralPath $Root
$Stamp=Get-Date -Format 'yyyyMMdd_HHmmss'
$Build=Join-Path $Root 'build'
$Dir=Join-Path $Build ('qa-full-windows\run-'+$Stamp)
$Zip=Join-Path $Build ('QA_TAM_PROJE_SONUC_'+$Stamp+'.zip')
$Utf8=[System.Text.UTF8Encoding]::new($false)
New-Item -ItemType Directory -Path $Dir -Force | Out-Null
$Report=[ordered]@{qa='Full Node + H-L 64/100 PNG + UT200A 4 PNG';started_at=(Get-Date).ToString('o');status='FAIL';node_version=$null;node_full=$null;hl64=$null;ut200a=$null;hl64_zip=$null;ut200a_zip=$null;errors=@()}
function Stage([string]$Name,[string]$Executable,[string[]]$Arguments){
 try{
  $A=Join-Path $Dir ($Name+'.stdout.log');$B=Join-Path $Dir ($Name+'.stderr.log')
  $P=Start-Process -FilePath $Executable -ArgumentList $Arguments -WorkingDirectory $Root -NoNewWindow -Wait -PassThru -RedirectStandardOutput $A -RedirectStandardError $B
  Write-Host ('[QA] '+$Name+' exit='+$P.ExitCode)
  return [int]$P.ExitCode
 }catch{$Report.errors+=($Name+': '+$_.Exception.Message);return 1}
}
function FreshZip([string]$Pattern,[datetime]$After){
 $Item=Get-ChildItem -LiteralPath $Build -Filter $Pattern -File -ErrorAction SilentlyContinue | Where-Object {$_.LastWriteTime -ge $After.AddSeconds(-1)} | Sort-Object LastWriteTime -Descending | Select-Object -First 1
 if($Item){Copy-Item -LiteralPath $Item.FullName -Destination (Join-Path $Dir $Item.Name) -Force;return $Item.Name}
 return $null
}
try{
 foreach($Item in @('BASLAT.bat','dist\index.html','dist\app.js','dist\library.js','dist\tutorial-lessons.js','dist\tutorial-mode.js','dist\tutorial-topic-review-batch-m.js','dist\project-store.js','dist\studio.js','tests\tutorial-topic-review-batch-m-v11920.test.cjs','scripts\qa-tutorial-1655-simulation-v11920.cjs','scripts\qa-tutorial-1655-dynamics-v11920.cjs','scripts\qa-tutorial-1655-transitions-v11920.cjs','scripts\qa-tutorial-722-sequential-v11920.cjs','tests\qa-tutorial-722-sequential-v11920.test.cjs','scripts\qa-tutorial-practice-1519-v11920.cjs','tests\qa-tutorial-practice-1519-v11920.test.cjs','tests\qa-tutorial-1655-transitions-v11920.test.cjs','tests\qa-tutorial-1655-transitions-failclosed-v11920.test.cjs','tests\tutorial-open-collector-stateful-v11920.test.cjs','tests\qa-tutorial-1655-dynamics-v11920.test.cjs','dist\tutorial-practice-guide-batch-n.js','tests\project-legacy-collector-pullup-v11920.test.cjs','tests\tutorial-open-collector-pulldown-v11920.test.cjs','scripts\qa-full-windows-v11920.ps1','scripts\qa-tutorial-1655-simulation-v11920.cjs','scripts\qa-hl64-windows-v11920.ps1','scripts\qa-mq05-ut200a-windows-v11920.ps1')){
  if(-not(Test-Path -LiteralPath (Join-Path $Root $Item) -PathType Leaf)){throw ('Missing file: '+$Item+'. Extract current main ZIP.')}
 }
 $N=(Get-Command node.exe -ErrorAction Stop).Source
 $V=& $N --version
 if($V -notmatch '^v(\d+)\.' -or [int]$Matches[1] -lt 22){throw ('Node 22+ required: '+$V)}
 $Hashes=[ordered]@{}
 foreach($Item in @('BASLAT.bat','dist\index.html','dist\app.js','dist\library.js','dist\tutorial-lessons.js','dist\tutorial-mode.js','dist\tutorial-topic-review-batch-m.js','dist\project-store.js','dist\studio.js','scripts\qa-full-windows-v11920.ps1','scripts\qa-hl64-windows-v11920.ps1','scripts\qa-mq05-ut200a-windows-v11920.ps1')){
  $Hashes[$Item]=(Get-FileHash -LiteralPath (Join-Path $Root $Item) -Algorithm SHA256).Hash.ToLowerInvariant()
 }
 # The full Node suite discovers ALL *.test.cjs tests. Recording only a short
 # hand-picked list would not prove which test sources were actually evaluated.
 foreach($SourceDir in @('dist','tests','scripts')){
  $Folder=Join-Path $Root $SourceDir
  if(-not(Test-Path -LiteralPath $Folder -PathType Container)){throw ('Source folder missing: '+$SourceDir)}
  $Sources=@(Get-ChildItem -LiteralPath $Folder -File | Where-Object {
   $_.Extension -in @('.js','.cjs','.css','.html','.ps1')
  })
  if($Sources.Count -lt 1){throw ('No QA source files discovered: '+$SourceDir)}
  foreach($Source in $Sources){
   $Relative=$SourceDir+'\'+$Source.Name
   $Hashes[$Relative]=(Get-FileHash -LiteralPath $Source.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
  }
 }
 $Report.hash_file_count=$Hashes.Count
 [IO.File]::WriteAllText((Join-Path $Dir 'source-hashes.json'),($Hashes|ConvertTo-Json -Depth 4),$Utf8)
 $Report.node_version=$V
 $FullSince=Get-Date
 $Report.node_full=Stage 'all-node-tests' $N @('scripts/run-tests.cjs')
 if(Test-Path -LiteralPath (Join-Path $Build 'tests.tap')){Copy-Item -LiteralPath (Join-Path $Build 'tests.tap') -Destination (Join-Path $Dir 'all-tests.tap') -Force}
 $Audit=Join-Path $Build 'qa-tutorial-1655-simulation-report.json'
 if((Test-Path -LiteralPath $Audit -PathType Leaf) -and (Get-Item -LiteralPath $Audit).LastWriteTime -ge $FullSince.AddSeconds(-1)){
  Copy-Item -LiteralPath $Audit -Destination (Join-Path $Dir 'qa-tutorial-1655-simulation-report.json') -Force
  $AuditInfo=Get-Content -LiteralPath $Audit -Raw | ConvertFrom-Json
  if($AuditInfo.status -ne 'PASS'){$Report.errors+='Full 1655 curriculum solver evidence is not PASS.'}
 }else{$Report.errors+='Fresh full 1655 curriculum solver report missing.'}
 $Behavior=Join-Path $Build 'qa-tutorial-1655-dynamics-report.json'
 if((Test-Path -LiteralPath $Behavior -PathType Leaf) -and (Get-Item -LiteralPath $Behavior).LastWriteTime -ge $FullSince.AddSeconds(-1)){
  Copy-Item -LiteralPath $Behavior -Destination (Join-Path $Dir 'qa-tutorial-1655-dynamics-report.json') -Force
  $BehaviorInfo=Get-Content -LiteralPath $Behavior -Raw | ConvertFrom-Json
  if($BehaviorInfo.status -ne 'PASS'){$Report.errors+='Native virtual ON/OFF curriculum behavior audit did not pass.'}
 }else{$Report.errors+='Fresh virtual behavior test report missing.'}

 $Transitions=Join-Path $Build 'qa-tutorial-1655-transitions-report.json'
 if((Test-Path -LiteralPath $Transitions -PathType Leaf) -and (Get-Item -LiteralPath $Transitions).LastWriteTime -ge $FullSince.AddSeconds(-1)){
  Copy-Item -LiteralPath $Transitions -Destination (Join-Path $Dir 'qa-tutorial-1655-transitions-report.json') -Force
  $TransitionInfo=Get-Content -LiteralPath $Transitions -Raw | ConvertFrom-Json
  if($TransitionInfo.status -ne 'PASS'){$Report.errors+='Stateful OFF-ON-OFF native transition audit did not pass.'}
 }else{$Report.errors+='Fresh stateful transition report missing.'}


 $Sequential=Join-Path $Build 'qa-tutorial-722-sequential-report.json'
 if((Test-Path -LiteralPath $Sequential -PathType Leaf) -and (Get-Item -LiteralPath $Sequential).LastWriteTime -ge $FullSince.AddSeconds(-1)){
  Copy-Item -LiteralPath $Sequential -Destination (Join-Path $Dir 'qa-tutorial-722-sequential-report.json') -Force
  $SeqInfo=Get-Content -LiteralPath $Sequential -Raw | ConvertFrom-Json
  if($SeqInfo.stabilityStatus -ne 'PASS'){$Report.errors+='722 sequential electrical stability did not PASS.'}
  if($SeqInfo.behaviorStatus -ne 'PASS'){$Report.errors+='722 sequential functional output coverage requires separate virtual-probe/browser QA.'}
 }else{$Report.errors+='Fresh 722 sequential solver report missing.'}

 $MultiControl=Join-Path $Build 'qa-tutorial-sequential-report.json'
 if((Test-Path -LiteralPath $MultiControl -PathType Leaf) -and (Get-Item -LiteralPath $MultiControl).LastWriteTime -ge $FullSince.AddSeconds(-1)){
  Copy-Item -LiteralPath $MultiControl -Destination (Join-Path $Dir 'qa-tutorial-sequential-report.json') -Force
  $MultiInfo=Get-Content -LiteralPath $MultiControl -Raw | ConvertFrom-Json
  if($MultiInfo.status -ne 'SOURCE_SEQUENCES_CHECKED_BEHAVIOR_ACCEPTANCE_OPEN'){$Report.errors+='Multi-control native electrical sequence regression did not complete.'}
  if($MultiInfo.faults.Count -gt 0 -or $MultiInfo.unstable.Count -gt 0 -or $MultiInfo.errors.Count -gt 0){$Report.errors+='Multi-control native electrical sequence found a fault.'}
 }else{$Report.errors+='Fresh multi-control native sequence report missing.'}

 $Pedagogy=Join-Path $Build 'qa-tutorial-practice-1519-report.json'
 if((Test-Path -LiteralPath $Pedagogy -PathType Leaf) -and (Get-Item -LiteralPath $Pedagogy).LastWriteTime -ge $FullSince.AddSeconds(-1)){
  Copy-Item -LiteralPath $Pedagogy -Destination (Join-Path $Dir 'qa-tutorial-practice-1519-report.json') -Force
  $PedagogyInfo=Get-Content -LiteralPath $Pedagogy -Raw | ConvertFrom-Json
  if($PedagogyInfo.sourceStatus -ne 'PASS'){$Report.errors+='1519 practice guide pedagogy and coach source QA did not pass.'}
 }else{$Report.errors+='Fresh 1519 practice guide QA report missing.'}

 $PsExe=(Get-Command powershell.exe -ErrorAction Stop).Source
 $At=Get-Date
 $Report.hl64=Stage 'hl64-windows' $PsExe @('-NoProfile','-ExecutionPolicy','Bypass','-File',('"'+(Join-Path $Root 'scripts\qa-hl64-windows-v11920.ps1')+'"'))
 $Report.hl64_zip=FreshZip 'QA_HL64_SONUC_*.zip' $At
 $At=Get-Date
 $Report.ut200a=Stage 'ut200a-windows' $PsExe @('-NoProfile','-ExecutionPolicy','Bypass','-File',('"'+(Join-Path $Root 'scripts\qa-mq05-ut200a-windows-v11920.ps1')+'"'))
 $Report.ut200a_zip=FreshZip 'QA_MQ05_UT200A_SONUC_*.zip' $At
 if(-not $Report.hl64_zip){$Report.errors+='Fresh H-L result ZIP missing.'}
 if(-not $Report.ut200a_zip){$Report.errors+='Fresh UT200A result ZIP missing.'}
 if($Report.node_full -eq 0 -and $Report.hl64 -eq 0 -and $Report.ut200a -eq 0 -and $Report.hl64_zip -and $Report.ut200a_zip -and $Report.errors.Count -eq 0){$Report.status='PASS'}
}catch{$Report.errors+=$_.Exception.Message}
finally{
 $Report.finished_at=(Get-Date).ToString('o')
 [IO.File]::WriteAllText((Join-Path $Dir 'run-summary.json'),($Report|ConvertTo-Json -Depth 6),$Utf8)
 try{Compress-Archive -Path (Join-Path $Dir '*') -DestinationPath $Zip -CompressionLevel Optimal -Force -ErrorAction Stop;Write-Host ('[QA] '+$Zip+' status='+$Report.status)}
 catch{Write-Host ('[QA] archive error: '+$_.Exception.Message);$Report.status='FAIL'}
}
if($Report.status -ne 'PASS'){exit 1}
exit 0
