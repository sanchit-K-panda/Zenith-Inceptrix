@echo off
REM Smart Academic Dashboard - Quick Start Script for Windows
REM This script automates the setup process

setlocal enabledelayedexpansion

echo ================================
echo Smart Academic Dashboard Setup
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ^^! Node.js is not installed. Please install Node.js 16 or higher.
    echo Visit: https://nodejs.org/
    exit /b 1
)

echo Node.js found: 
node --version

echo npm found:
npm --version
echo.

REM Setup Backend
echo Step 1: Setting up Backend...
cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file with defaults...
    copy .env.example .env
)

REM Seed database
echo Seeding database with demo data...
call npm run seed

echo Backend setup complete!
echo.

REM Setup Frontend
echo Step 2: Setting up Frontend...
cd ..\frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Create .env.local file if it doesn't exist
if not exist ".env.local" (
    echo Creating .env.local file...
    copy .env.local.example .env.local
)

echo Frontend setup complete!
echo.

REM Display instructions
echo ================================
echo Setup Complete!
echo ================================
echo.
echo To run the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo Demo Credentials:
echo   Student:  student1@dashboard.com / Student@123
echo   Teacher:  teacher1@dashboard.com / Teacher@123
echo   Parent:   parent1@dashboard.com / Parent@123
echo.
echo Documentation:
echo   Backend:  backend\README.md
echo   Frontend: frontend\README.md
echo   Project:  README.md
echo.
pause
