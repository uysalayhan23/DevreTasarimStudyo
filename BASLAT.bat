@echo off
setlocal EnableExtensions
title Devre Tasarim Studyosu v1.19.20 Baslatici

cd /d "%~dp0"
set "ROOT=%CD%\"
set "INDEX=%ROOT%dist\index.html"

if not exist "%INDEX%" (
  echo.
  echo HATA: dist\index.html bulunamadi.
  echo ZIP arsivinin icinden dogrudan calistirilamaz.
  echo ZIP dosyasini tamamen yeni ve bos bir klasore cikarin.
  echo.
  echo Beklenen dosya:
  echo   %INDEX%
  echo.
  pause
  exit /b 2
)

rem Karisik/eski paketleri tarayici acilmadan once reddet.
findstr /C:"arduino-card" "%INDEX%" >nul 2>&1 || goto :stale_package
findstr /C:"tutorial-card" "%INDEX%" >nul 2>&1 || goto :stale_package
if not exist "%ROOT%dist\studio.js" goto :stale_package
findstr /C:"window.DTSStudio" "%ROOT%dist\studio.js" >nul 2>&1 || goto :stale_package

rem Tani/smoke modu: tarayici acmadan tum paket on-kontrollerinin gectigini kanitlar.
if /I "%DTS_LAUNCHER_TEST%"=="1" (
  echo DTS_LAUNCHER_SMOKE_OK
  exit /b 0
)

echo.
echo Devre Tasarim Studyosu aciliyor...
echo.

rem Tek uygulama hedefi dogrudan dist/index.html dosyasidir.
rem Ornek: file:///C:/Users/.../Devre-Tasarim-Studyo-1.19.20/dist/index.html
set "FILEURL=file:///%INDEX:\=/%"

rem Windows .html handler (normally Edge) handles spaces and '#' in local paths.
rem Try the actual local file first; raw file URLs can mistake '#' for a fragment.
start "" "%INDEX%"
if not errorlevel 1 exit /b 0

set "BROWSER="

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined BROWSER if exist "%LocalAppData%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%LocalAppData%\Microsoft\Edge\Application\msedge.exe"

if not defined BROWSER if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined BROWSER if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set "BROWSER=%LocalAppData%\Google\Chrome\Application\chrome.exe"

if not defined BROWSER if exist "%ProgramFiles%\Mozilla Firefox\firefox.exe" set "BROWSER=%ProgramFiles%\Mozilla Firefox\firefox.exe"
if not defined BROWSER if exist "%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe" set "BROWSER=%ProgramFiles(x86)%\Mozilla Firefox\firefox.exe"

if not defined BROWSER (
  where msedge.exe >nul 2>&1
  if not errorlevel 1 set "BROWSER=msedge.exe"
)
if not defined BROWSER (
  where chrome.exe >nul 2>&1
  if not errorlevel 1 set "BROWSER=chrome.exe"
)
if not defined BROWSER (
  where firefox.exe >nul 2>&1
  if not errorlevel 1 set "BROWSER=firefox.exe"
)

if defined BROWSER (
  start "" "%BROWSER%" --new-window "%INDEX%"
  if not errorlevel 1 exit /b 0
)

rem 1. fallback: Windows'un URL protokol isleyicisi ile ayni file:/// hedefi.
rundll32.exe url.dll,FileProtocolHandler "%FILEURL%" >nul 2>&1
if not errorlevel 1 exit /b 0

rem 2. fallback: PowerShell ile dogrudan dist/index.html dosyasini ac.
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$p=[IO.Path]::GetFullPath($env:INDEX); Start-Process -FilePath $p" >nul 2>&1
if not errorlevel 1 exit /b 0

rem 3. fallback: varsayilan HTML uygulamasina dogrudan dist/index.html devri.
start "" "%INDEX%"
if not errorlevel 1 exit /b 0

goto :launch_error

:stale_package
echo.
echo HATA: Bu klasor guncel v1.19.20 dashboardu degil veya paket dosyalari karisik.
echo Lutfen ZIP arsivini yeni ve bos bir klasore Tumunu ayikla secenegiyle cikarin.
echo.
pause
exit /b 3

:launch_error
echo.
echo HATA: Uygulama otomatik olarak acilamadi.
echo.
echo Denenen hedef:
echo   %FILEURL%
echo.
echo Microsoft Edge, Google Chrome veya Firefox kurulu oldugundan emin olun.
echo Ardindan dist\index.html dosyasini dogrudan acin.
echo.
echo Bu pencere hata gorulebilsin diye acik tutuluyor.
echo.
pause
exit /b 7
