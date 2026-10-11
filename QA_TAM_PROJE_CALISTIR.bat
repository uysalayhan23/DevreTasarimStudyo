@echo off
setlocal EnableExtensions
title Devre Tasarim Studyosu - MQ-00 Tam Windows QA
cd /d "%~dp0"
rem This is an offline QA tool, not the BASLAT.bat application launcher.
if not exist "%~dp0scripts\qa-full-windows-v11920.ps1" (
 echo HATA: Guncel main paketinin tumunu klasore cikarin.
 exit /b 1
)
where powershell.exe >nul 2>&1
if errorlevel 1 (
 echo HATA: Windows PowerShell bulunamadi.
 exit /b 1
)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\qa-full-windows-v11920.ps1"
set "CODE=%ERRORLEVEL%"
echo.
if "%CODE%"=="0" (
 echo Node, H-L ve UT200A kabul paketleri basarili.
) else (
 echo Kalite kapilarindan en az biri gecmedi. Kanitlar ZIP icine kaydedildi.
)
echo Sonuc: build\QA_TAM_PROJE_SONUC_YYYYMMDD_HHMMSS.zip
echo Actions kullanilmaz; BASLAT.bat ve file:/// uygulama acilisi degistirilmez.
if not "%QA_TAM_PROJE_NOPAUSE%"=="1" pause
exit /b %CODE%
