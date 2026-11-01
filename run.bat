@echo off
cd /d "%~dp0"
title Profile Website
echo Starting Next.js...
echo.
npm run dev
if errorlevel 1 (
  echo.
  echo Failed to start. Press any key to close.
  pause >nul
)
