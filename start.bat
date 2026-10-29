@echo off
echo ========================================
echo  MK1300 V2 Ripple
echo ========================================
echo.
echo Starting local server on http://localhost:8081 ...
start /B npx -y serve -l 8081 -s . >nul 2>&1
timeout /t 3 /nobreak >nul

set CHROME=""
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set CHROME="%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set CHROME="%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" set CHROME="%LocalAppData%\Google\Chrome\Application\chrome.exe"

if %CHROME%=="" (
    echo Chrome not found. Close all Chrome/Edge windows, then run:
    echo   chrome.exe --disable-hid-blocklist http://localhost:8081
    pause
) else (
    echo Close ALL other Chrome windows first, or the flag will not apply.
    start "" %CHROME% --disable-hid-blocklist http://localhost:8081
)

echo.
echo Close the official MK1300 software before clicking Connect.
echo Press any key here to stop the server...
pause >nul
taskkill /f /im node.exe /fi "WINDOWTITLE eq serve*" >nul 2>&1
