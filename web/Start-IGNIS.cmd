@echo off
setlocal
set "IGNIS_PREVIEW_ROOT=F:\ignis extra\web-build"
set "IGNIS_NODE=C:\Program Files\nodejs\node.exe"
if not exist "%IGNIS_NODE%" (
  echo Node.js was not found at the recorded workstation path. See web\README.md.
  pause
  exit /b 1
)
if not exist "%IGNIS_PREVIEW_ROOT%\.next\BUILD_ID" (
  echo The tested F-drive build is unavailable. See web\README.md to build from source.
  pause
  exit /b 1
)
cd /d "%IGNIS_PREVIEW_ROOT%"
echo Open http://127.0.0.1:3000 after the server reports Ready.
echo Keep this window open. Press Ctrl+C to stop. No deployment or inference is started.
"%IGNIS_NODE%" "node_modules\next\dist\bin\next" start -p 3000 -H 127.0.0.1
