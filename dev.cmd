@echo off
REM 로컬 미리보기 실행기.
REM
REM 왜 이 파일이 필요한가:
REM 이 PC 의 PATH 에는 C:\Program Files\nodejs (v20.18.1) 가 먼저 걸려 있고
REM Astro 는 v22.12 이상을 요구합니다. winget 으로 설치된 v24 는 뒤에 있어서
REM 그냥 `npx astro dev` 를 치면 "Node.js v20.18.1 is not supported" 로 멈춥니다.
REM 시스템 PATH 를 건드리지 않고, 이 창에서만 v24 를 앞에 세웁니다.

setlocal
set "NODE24=%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.16.0-win-x64"

if not exist "%NODE24%\node.exe" (
  echo [!] Node 24 를 찾지 못했습니다: %NODE24%
  echo     winget 으로 다시 설치하거나 이 파일의 NODE24 경로를 고치세요.
  pause
  exit /b 1
)

set "PATH=%NODE24%;%PATH%"
cd /d "%~dp0"

echo.
echo   Node  :
node -v
echo   주소  : http://localhost:4321
echo   종료  : 이 창에서 Ctrl+C
echo.

npx astro dev
