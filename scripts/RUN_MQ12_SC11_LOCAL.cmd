@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0.."
where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is unavailable. No tests have been run.
  exit /b 2
)
if not exist "dist\simulation.js" (
  echo ERROR: Run from a complete local repository checkout. No tests have been run.
  exit /b 2
)
set "EXITCODE=0"
echo === MQ-12 SC11 standalone PWM contract ===
node --test "tests\qa-mq05-virtual-pwm-contract-v11920.test.cjs"
if errorlevel 1 set "EXITCODE=1"
echo === MQ-12 SC11 native motor and UI ===
node --test "tests\qa-mq07-sc11-pwm-motor-v11920.test.cjs" "tests\qa-mq07-sc11-pwm-ui-v11920.test.cjs"
if errorlevel 1 set "EXITCODE=1"
echo === MQ-12 all MQ-07 regression sources ===
for %%F in (tests\qa-mq07-*.test.cjs) do (
  echo Running %%F
  node --test "%%F"
  if errorlevel 1 set "EXITCODE=1"
)
echo === MQ-12 entire 1655 lesson native audit ===
node --test "tests\qa-tutorial-1655-simulation-v11920.test.cjs"
if errorlevel 1 set "EXITCODE=1"
if "!EXITCODE!"=="0" (
 echo ALL INVOKED NODE TEST COMMANDS EXITED ZERO. Windows UI and physical acceptance remain separate.
) else (
 echo FAIL: At least one Node command reported a failing exit code. Do not claim MQ-00 acceptance.
)
exit /b !EXITCODE!
