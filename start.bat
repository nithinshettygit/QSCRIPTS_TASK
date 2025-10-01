@echo off
REM Due Date Adjuster Startup Script for Windows

echo Starting Due Date Adjuster...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python is not installed. Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js 16+ and try again.
    pause
    exit /b 1
)

REM Start backend
echo Starting backend server...
cd backend
python -m venv venv 2>nul
call venv\Scripts\activate.bat
pip install -r requirements.txt >nul 2>&1
start "Backend Server" cmd /k "uvicorn src.api:app --reload"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo Starting frontend server...
cd ..\frontend
npm install >nul 2>&1
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Due Date Adjuster is running!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Close the terminal windows to stop the servers.
pause
