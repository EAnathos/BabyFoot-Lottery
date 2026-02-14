@echo off
setlocal

set "DIST=dist"
if not exist "%DIST%" mkdir "%DIST%"

call npx tsc

call npx http-server -p 8000
