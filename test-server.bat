@echo off
echo Starting local web server...
echo.
echo Your website will open at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
python -m http.server 8000