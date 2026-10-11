# One-click QA helper. This is not the application launcher.
# BASLAT.bat / file:/// application startup remain untouched.
$ErrorActionPreference = 'Stop'
$Utf8NoBom = [System.Text.UTF8Encoding]::new($false)
$Root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
Set-Location -LiteralPath $Root
$Stamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$Build = Join-Path $Root 'build'
$RunDir = Join-Path $Build ('qa-mq05-windows\run-' + $Stamp)
$Zip = Join-Path $Build ('QA_MQ05_SONUC_' + $Stamp + '.zip')
$Visual = Join-Path $Build 'mq05-browser'
New-Item -ItemType Directory -Path $RunDir -Force | Out-Null

$Summary = [ordered]@{
  qa='MQ-05 live simulation / meter QA'
  started_at=(Get-Date).ToString('o')
  project_root=$Root
  status='FAIL'
  node_version=$null
  node_exit_code=$null
  chromium_binary=$null
  chromium_exit_code=$null
  verification_exit_code=$null
  screenshots_expected=8
  browser_stages_expected=4
  notes=@()
}
function Note([string]$Text) {
  Write-Host ('[QA] ' + $Text)
  $Summary.notes += $Text
}
function Invoke-QA {
  param([string]$Exe,[string[]]$Argv,[string]$Label)
  $Stdout = Join-Path $RunDir ($Label+'.stdout.log')
  $Stderr = Join-Path $RunDir ($Label+'.stderr.log')
  Note ('Running '+$Label)
  $Proc = Start-Process -FilePath $Exe -ArgumentList $Argv -WorkingDirectory $Root -NoNewWindow -PassThru -RedirectStandardOutput $Stdout -RedirectStandardError $Stderr
  try { $Proc | Wait-Process -Timeout 900 -ErrorAction Stop }
  catch { try { $Proc.Kill() } catch {}; Note ($Label+' TIMEOUT 900 seconds'); return 124 }
  $Proc.Refresh()
  $Code = [int]$Proc.ExitCode
  Note ($Label+' exit='+$Code)
  if (Test-Path -LiteralPath $Stdout) { Get-Content -LiteralPath $Stdout -Tail 8 | ForEach-Object { Write-Host $_ } }
  if (Test-Path -LiteralPath $Stderr) { Get-Content -LiteralPath $Stderr -Tail 8 | ForEach-Object { Write-Host $_ } }
  return $Code
}
function Find-Chromium {
  $Candidates = @()
  if ($env:CHROME_BIN) { $Candidates += $env:CHROME_BIN }
  foreach ($Base in @($env:ProgramFiles, [Environment]::GetEnvironmentVariable('ProgramFiles(x86)'), $env:LOCALAPPDATA)) {
    if ($Base) {
      $Candidates += (Join-Path $Base 'Google\Chrome\Application\chrome.exe')
      $Candidates += (Join-Path $Base 'Microsoft\Edge\Application\msedge.exe')
      $Candidates += (Join-Path $Base 'Chromium\Application\chrome.exe')
    }
  }
  foreach ($Name in @('chrome.exe','msedge.exe','chromium.exe')) {
    $Cmd = Get-Command $Name -ErrorAction SilentlyContinue
    if ($Cmd) { $Candidates += $Cmd.Source }
  }
  foreach ($Candidate in $Candidates) {
    if ($Candidate -and (Test-Path -LiteralPath $Candidate -PathType Leaf)) { return $Candidate }
  }
  return $null
}

try {
  foreach ($Required in @('dist\index.html','dist\tutorial-mode.js','scripts\browser-mq05-live-v11920.cjs',
      'scripts\qa-mq05-artifact-verify-v11920.cjs','tests\qa-mq05-windows-v11920.test.cjs')) {
    if (-not (Test-Path -LiteralPath (Join-Path $Root $Required) -PathType Leaf)) {
      throw ('Missing '+$Required+'. Extract the WHOLE current main ZIP before running this BAT.')
    }
  }
  $Node = Get-Command node.exe -ErrorAction SilentlyContinue
  if (-not $Node) { throw 'Node.js 22+ not found. Install Node.js LTS and reopen this BAT.' }
  $Version = (& $Node.Source --version | Select-Object -First 1)
  $Summary.node_version = $Version
  if ($Version -notmatch '^v(\d+)\.(\d+)\.(\d+)$' -or [int]$Matches[1] -lt 22) {
    throw ('Node.js 22+ required for Chromium CDP WebSocket; found '+$Version)
  }
  Note ('Node '+$Version)
  $Tests = @(
    'tests/current-truth-v11920.test.cjs',
    'tests/live-touch-v118.test.cjs',
    'tests/simulation-material-audit-v11920.test.cjs',
    'tests/clamp-meter-v119.test.cjs',
    'tests/instruments-v115.test.cjs',
    'tests/instruments-lines-v1152.test.cjs',
    'tests/probe-interface-v1151.test.cjs',
    'tests/tutorial-analysis-physical-probes-v11920.test.cjs',
    'tests/tutorial-control-batch-f-v11920.test.cjs',
    'tests/tutorial-motor-physical-regression-v11920.test.cjs',
    'tests/digital-twin-v11920.test.cjs',
    'tests/energy-analyzer-v11920.test.cjs',
    'tests/tutorial-measurement-batch-a-v11920.test.cjs',
    'tests/tutorial-measurement-batch-b-v11920.test.cjs',
    'tests/tutorial-measurement-batch-c-v11920.test.cjs',
    'tests/tutorial-measurement-batch-d-v11920.test.cjs',
    'tests/signed-flow-v11920.test.cjs',
    'tests/qa-mq05-windows-v11920.test.cjs'
  )
  foreach ($Test in $Tests) {
    if (-not (Test-Path -LiteralPath (Join-Path $Root $Test) -PathType Leaf)) {
      throw ('Missing Node test: '+$Test)
    }
  }
  $Summary.test_files = $Tests
  $SourceHashes = [ordered]@{}
  foreach ($SourceFile in @('dist\tutorial-mode.js','scripts\browser-mq05-live-v11920.cjs',
      'scripts\qa-mq05-artifact-verify-v11920.cjs','tests\qa-mq05-windows-v11920.test.cjs','BASLAT.bat')) {
    $SourceHashes[$SourceFile] = (Get-FileHash -LiteralPath (Join-Path $Root $SourceFile) -Algorithm SHA256).Hash.ToLowerInvariant()
  }
  [System.IO.File]::WriteAllText((Join-Path $RunDir 'source-hashes.json'),($SourceHashes | ConvertTo-Json -Depth 5),$Utf8NoBom)
  $Summary.node_exit_code = Invoke-QA -Exe $Node.Source -Argv (@('--test','--test-reporter=tap') + $Tests) -Label 'node-tests'
  if ($Summary.node_exit_code -ne 0) { throw 'Node tests FAILED. Chromium acceptance not attempted; inspect ZIP logs.' }

  $Chrome = Find-Chromium
  if (-not $Chrome) { throw 'Chrome or Microsoft Edge not found. Install Chromium-based browser and rerun.' }
  $env:CHROME_BIN = $Chrome
  $Summary.chromium_binary = $Chrome
  Note ('Chromium executable: '+$Chrome)

  # Prevent previous or partially completed PNGs from satisfying this run.
  if (Test-Path -LiteralPath $Visual) { Remove-Item -LiteralPath $Visual -Recurse -Force }
  $Summary.chromium_exit_code = Invoke-QA -Exe $Node.Source -Argv @('scripts/browser-mq05-live-v11920.cjs') -Label 'chromium-mq05'
  if ($Summary.chromium_exit_code -ne 0) { throw 'Real MQ05 Chrome interaction failed; screenshot and JSON evidence will be included.' }

  $Summary.verification_exit_code = Invoke-QA -Exe $Node.Source -Argv @('scripts/qa-mq05-artifact-verify-v11920.cjs') -Label 'artifact-verification'
  if ($Summary.verification_exit_code -ne 0) { throw 'MQ05 screenshot JSON/SHA-256 verification FAILED.' }
  $Summary.status = 'PASS'
  Note 'PASS: real Node and 4 browser stages with screenshot JSON SHA-256 verified.'
}
catch {
  $Message = $_.Exception.Message
  Note ('FAIL: '+$Message)
  Set-Content -LiteralPath (Join-Path $RunDir 'error.txt') -Value $Message -Encoding UTF8
}
finally {
  $Summary.finished_at = (Get-Date).ToString('o')
  if (Test-Path -LiteralPath $Visual) {
    Copy-Item -LiteralPath $Visual -Destination (Join-Path $RunDir 'mq05-browser') -Recurse -Force
  }
  [System.IO.File]::WriteAllText((Join-Path $RunDir 'run-summary.json'),($Summary | ConvertTo-Json -Depth 8),$Utf8NoBom)
  @(
    'Devre Tasarim Studyosu - MQ-05 canlı simülasyon QA raporu'
    ('Status: '+$Summary.status)
    ('Node exit: '+$Summary.node_exit_code)
    ('Chromium exit: '+$Summary.chromium_exit_code)
    ('JSON/PNG/SHA exit: '+$Summary.verification_exit_code)
    'PASS must be accepted only if all 3 stages exit 0 and verification.json is present.'
    'BASLAT.bat and file:/// application launcher are not modified.'
    'QA may use a temporary loopback HTTP server, only for isolated browser tests.'
  ) | Set-Content -LiteralPath (Join-Path $RunDir 'README.txt') -Encoding UTF8
  try {
    Compress-Archive -Path (Join-Path $RunDir '*') -DestinationPath $Zip -CompressionLevel Optimal -Force -ErrorAction Stop
    Write-Host ''
    Write-Host ('[QA] RESULTS ZIP: '+$Zip)
    Write-Host ('[QA] STATUS: '+$Summary.status)
    Write-Host '[QA] Upload this ZIP to the ChatGPT conversation for MQ-00 review.'
  }
  catch {
    Write-Host ('[QA] ZIP creation failed: '+$_.Exception.Message)
    Write-Host ('[QA] Uncompressed logs: '+$RunDir)
    $Summary.status='FAIL'
  }
}
if ($Summary.status -ne 'PASS') { exit 1 }
exit 0
