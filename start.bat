@echo off
echo ========================================================
echo   Disaster Volunteering Network - Starting Up
echo ========================================================
echo.
cd backend
if not exist node_modules (
    echo [1/3] Installing dependencies...
    call npm install
) else (
    echo [1/3] Dependencies already installed.
)

echo [2/3] Checking MongoDB database and seeding if needed...
echo If you want to re-seed initial data, run: npm run seed
echo.
echo [3/3] Starting DVN Backend Server on http://localhost:5000...
start "" http://localhost:5000
node server.js
pause
