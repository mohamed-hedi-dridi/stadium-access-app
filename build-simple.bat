@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    🏟️  STADIUM ACCESS APP
echo    📱 Build APK Simple
echo ========================================
echo.

echo [ÉTAPE 1] Vérification des outils...
where expo >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Expo CLI non trouvé. Installation...
    npm install -g @expo/cli
)

echo.
echo [ÉTAPE 2] Génération des fichiers Android...
echo 🔨 Création des fichiers natifs Android...
npx expo prebuild --platform android --clean

echo.
echo [ÉTAPE 3] Build APK local...
echo 🚀 Génération de l'APK (cela peut prendre quelques minutes)...
cd android
call gradlew assembleDebug
cd ..

echo.
echo ========================================
echo    ✅ APK GÉNÉRÉ AVEC SUCCÈS !
echo ========================================
echo.
echo 📱 Votre APK se trouve dans :
echo    android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 📥 Pour installer :
echo    1. Copiez l'APK sur votre téléphone
echo    2. Activez "Sources inconnues" dans les paramètres Android
echo    3. Tapez sur le fichier APK
echo.
echo 🎯 APK prêt pour les tests !
echo.
pause






