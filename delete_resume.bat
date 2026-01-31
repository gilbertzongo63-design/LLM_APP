@echo off
SET FILE=src\data\Resume.csv
IF EXIST "%FILE%" (
  echo Deleting %FILE% ...
  del /f /q "%FILE%"
  if %errorlevel% equ 0 (
    echo File deleted.
  ) else (
    echo Failed to delete file. You may need to remove it manually.
  )
  REM Remove from git index if present
  git rm --cached "%FILE%" >nul 2>&1 || echo Not tracked by git or git not available.
) ELSE (
  echo File not found: %FILE%
)
pause
