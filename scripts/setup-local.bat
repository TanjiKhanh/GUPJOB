@echo off
REM GupJob Local Development Setup Script for Windows
REM This script sets up the entire project for local development

echo.
echo ================================================
echo GupJob - Local Development Setup (Windows)
echo ================================================
echo.

REM Step 1: Start Docker containers
echo Step 1: Starting Docker containers...
echo Make sure Docker Desktop is running!
cd infra
docker-compose up -d
if %ERRORLEVEL% EQU 0 (
    echo [OK] Docker containers started successfully
) else (
    echo [ERROR] Failed to start Docker containers
    exit /b 1
)
cd ..

REM Step 2: Wait for PostgreSQL to be ready
echo.
echo Step 2: Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak

REM Step 3: Setup auth service
echo.
echo Step 3: Setting up Auth Service...
cd services\auth

REM Install dependencies
echo   - Installing dependencies...
npm install
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Dependencies installed
) else (
    echo   [ERROR] Failed to install dependencies
    exit /b 1
)

REM Generate Prisma client
echo   - Generating Prisma client...
npm run prisma:generate
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Prisma client generated
) else (
    echo   [ERROR] Failed to generate Prisma client
    exit /b 1
)

REM Run migrations
echo   - Running database migrations...
npm run prisma:dbpush
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Migrations completed
) else (
    echo   [WARNING] Failed to run migrations
)

cd ..\..

REM Step 4: Summary
echo.
echo ================================================
echo Setup Complete!
echo ================================================
echo.
echo To start the Auth service:
echo   cd services\auth
echo   npm run start:dev
echo.
echo The service will be available at:
echo   http://localhost:3000
echo.
echo Health check endpoint:
echo   http://localhost:3000/health
echo.
pause
