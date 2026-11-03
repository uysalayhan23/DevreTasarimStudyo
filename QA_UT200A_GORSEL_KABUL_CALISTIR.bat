@echo off
setlocal EnableExtensions
title DTS UT200A Edge Foto ve Pense Cene Kabul
cd /d "%~dp0"
rem This checks this local DTS folder; it does not pull from GitHub, edit the app,
rem disable browser security or trigger GitHub Actions.
set "DTS_UT200A_PHOTO_ONLY=1"
call "%~dp0QA_MQ05_UT200A_CALISTIR.bat"
exit /b %ERRORLEVEL%
