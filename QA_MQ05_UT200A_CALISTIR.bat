@echo off
setlocal EnableExtensions
title Devre Tasarim Studyosu - MQ-05 UT200A Fiziksel Pense Cene QA
cd /d "%~dp0"

rem QA runner only. BASLAT.bat / file:/// application launcher is unchanged.
if not exist "%~dp0scripts\qa-mq05-ut200a-windows-v11920.ps1" (
  echo HATA: QA PowerShell yardimci dosyasi bulunamadi.
  echo Guncel main ZIP arsivinin TAMAMINI bir klasore cikarin.
  set "QA_EXIT=1"
  goto :done
)

where powershell.exe >nul 2>&1
if errorlevel 1 (
  echo HATA: Windows PowerShell bulunamadi.
  set "QA_EXIT=1"
  goto :done
)

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\qa-mq05-ut200a-windows-v11920.ps1"
set "QA_EXIT=%ERRORLEVEL%"

:done
echo.
if "%QA_EXIT%"=="0" (
  echo QA basarili. build klasorundeki QA_MQ05_UT200A_SONUC_*.zip dosyasini sohbetimize yukleyin.
) else (
  echo QA tamamlanamadi. Hata gunlukleri dahil build klasorundeki QA_MQ05_UT200A_SONUC_*.zip dosyasini yukleyin.
)
echo Bu arac GitHub Actions calistirmaz. BASLAT.bat degistirilmez.
if not "%QA_MQ05_UT200A_NOPAUSE%"=="1" pause
exit /b %QA_EXIT%
