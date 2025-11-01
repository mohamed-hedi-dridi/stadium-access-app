@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    🔍 VÉRIFICATION CONFIG ANDROID
echo    🏟️  Stadium Access App
echo ========================================
echo.

echo [1/8] Vérification des fichiers de configuration...
echo.

REM Vérifier app.json
if exist "app.json" (
    echo ✅ app.json trouvé
) else (
    echo ❌ app.json manquant
    goto :error
)

REM Vérifier eas.json
if exist "eas.json" (
    echo ✅ eas.json trouvé
) else (
    echo ❌ eas.json manquant
    goto :error
)

REM Vérifier package.json
if exist "package.json" (
    echo ✅ package.json trouvé
) else (
    echo ❌ package.json manquant
    goto :error
)

echo.
echo [2/8] Vérification des dépendances Expo...
echo.

REM Vérifier si expo est installé
npm list expo >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Expo installé
) else (
    echo ❌ Expo non installé
    goto :error
)

REM Vérifier EAS CLI
eas --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ EAS CLI installé
) else (
    echo ❌ EAS CLI non installé
    echo 💡 Installez avec: npm install -g eas-cli
    goto :error
)

echo.
echo [3/8] Vérification de la configuration app.json...
echo.

REM Vérifier le package Android
findstr /C:"com.clubafricain.stadiumaccess" app.json >nul
if %errorlevel% equ 0 (
    echo ✅ Package Android configuré
) else (
    echo ❌ Package Android manquant
    goto :error
)

REM Vérifier les permissions
findstr /C:"android.permission.CAMERA" app.json >nul
if %errorlevel% equ 0 (
    echo ✅ Permissions Android configurées
) else (
    echo ❌ Permissions Android manquantes
    goto :error
)

echo.
echo [4/8] Vérification des assets...
echo.

REM Vérifier l'icône
if exist "assets\images\icon.png" (
    echo ✅ Icône principale trouvée
) else (
    echo ❌ Icône principale manquante
    goto :error
)

REM Vérifier l'icône adaptative
if exist "assets\images\adaptive-icon.png" (
    echo ✅ Icône adaptative trouvée
) else (
    echo ❌ Icône adaptative manquante
    goto :error
)

REM Vérifier le splash screen
if exist "assets\images\splash-icon.png" (
    echo ✅ Splash screen trouvé
) else (
    echo ❌ Splash screen manquant
    goto :error
)

echo.
echo [5/8] Vérification des plugins...
echo.

REM Vérifier expo-router
findstr /C:"expo-router" app.json >nul
if %errorlevel% equ 0 (
    echo ✅ Plugin expo-router configuré
) else (
    echo ❌ Plugin expo-router manquant
    goto :error
)

echo.
echo [6/8] Vérification des scripts de build...
echo.

REM Vérifier les scripts npm
findstr /C:"build:android" package.json >nul
if %errorlevel% equ 0 (
    echo ✅ Scripts de build configurés
) else (
    echo ❌ Scripts de build manquants
    goto :error
)

echo.
echo [7/8] Vérification de la configuration EAS...
echo.

REM Vérifier les profils de build
findstr /C:"preview" eas.json >nul
if %errorlevel% equ 0 (
    echo ✅ Profils EAS configurés
) else (
    echo ❌ Profils EAS manquants
    goto :error
)

echo.
echo [8/8] Test de connexion Expo...
echo.

eas whoami >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Connecté à Expo
) else (
    echo ⚠️  Non connecté à Expo
    echo 💡 Connectez-vous avec: eas login
)

echo.
echo ========================================
echo    ✅ VÉRIFICATION TERMINÉE !
echo ========================================
echo.
echo 📋 Résumé de la configuration :
echo    • Package: com.clubafricain.stadiumaccess
echo    • Version: 1.0.0
echo    • Permissions: CAMERA, INTERNET, ACCESS_NETWORK_STATE
echo    • Plugins: expo-router
echo    • Build: APK configuré
echo.
echo 🚀 Votre configuration Android est prête !
echo    Vous pouvez maintenant générer un APK avec:
echo    npm run build:android:preview
echo.
goto :end

:error
echo.
echo ========================================
echo    ❌ ERREURS DÉTECTÉES
echo ========================================
echo.
echo 🔧 Actions recommandées :
echo    1. Vérifiez que tous les fichiers sont présents
echo    2. Installez les dépendances: npm install
echo    3. Configurez EAS: eas init
echo    4. Connectez-vous: eas login
echo.
echo 📞 Pour plus d'aide, consultez la documentation
echo.

:end
pause






