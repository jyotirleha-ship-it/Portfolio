@echo off
title The Digital Universe — Jyotir Leha R
echo =========================================================================
echo    THE DIGITAL UNIVERSE -- FULL-STACK WEB3 PORTFOLIO LAUNCHER
echo    Jyotir Leha R -- National Engineering College, Kovilpatti
echo =========================================================================
echo.
echo [1/2] Launching Backend API Server (Node.js + Express + Local DB / Atlas)...
start "Digital Universe API Server" cmd /k "cd /d "%~dp0backend" && node server.js"

echo [2/2] Launching Frontend Development Server (React + Vite)...
start "Digital Universe Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo =========================================================================
echo Both servers are starting up!
echo.
echo Public Portfolio : http://localhost:5173
echo Backend API      : http://localhost:5000/api
echo Health Check     : http://localhost:5000/api/health
echo Admin Control    : http://localhost:5173/#admin
echo =========================================================================
pause
