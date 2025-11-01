@echo off
echo ========================================
echo    Stadium Access App - Build APK
echo ========================================
echo.

echo [1/3] Verification de la configuration...
eas whoami
if %errorlevel% neq 0 (
    echo ERREUR: Vous devez vous connecter a Expo
    echo Executez: eas login
    pause
    exit /b 1
)

echo.
echo [2/3] Generation de l'APK de preview...
echo Choisissez le type de build:
echo 1. Preview (recommandé pour tests)
echo 2. Development (avec dev client)
echo 3. Production
echo.
set /p choice="Votre choix (1-3): "

if "%choice%"=="1" (
    echo Generation APK Preview...
    eas build --platform android --profile preview
) else if "%choice%"=="2" (
    echo Generation APK Development...
    eas build --platform android --profile development
) else if "%choice%"=="3" (
    echo Generation APK Production...
    eas build --platform android --profile production
) else (
    echo Choix invalide
    pause
    exit /b 1
)

echo.
echo [3/3] Build termine!
echo.
echo Pour installer l'APK:
echo 1. Telechargez le fichier depuis le lien fourni
echo 2. Activez "Sources inconnues" dans les parametres Android
echo 3. Installez l'APK en le tapant
echo.
pause

