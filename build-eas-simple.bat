@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    🏟️  STADIUM ACCESS APP
echo    📱 Build APK avec EAS (Recommandé)
echo ========================================
echo.

echo [ÉTAPE 1] Vérification de la connexion Expo...
eas whoami
if %errorlevel% neq 0 (
    echo.
    echo ❌ Vous n'êtes pas connecté à Expo
    echo.
    echo 🔑 Connexion à Expo :
    eas login
    echo.
    echo ✅ Connexion réussie !
) else (
    echo ✅ Connecté à Expo
)

echo.
echo [ÉTAPE 2] Génération de l'APK avec EAS Build...
echo.
echo 🚀 Cette méthode est plus fiable que le build local
echo ⏱️  Le build prendra 5-15 minutes sur les serveurs Expo
echo.
echo ⚠️  IMPORTANT : 
echo    - Répondez "Oui" quand on vous demande de générer une clé
echo    - Gardez cette fenêtre ouverte pendant le build
echo    - Vous recevrez un lien de téléchargement à la fin
echo.

pause

echo.
echo 🔨 Démarrage du build EAS...
echo.
echo 📋 Type de build : Preview (pour tests)
echo 🌐 Plateforme : Android
echo.

eas build --platform android --profile preview

echo.
echo ========================================
echo    ✅ BUILD TERMINÉ !
echo ========================================
echo.
echo 📱 Pour installer l'APK :
echo    1. Téléchargez le fichier depuis le lien ci-dessus
echo    2. Sur Android : Paramètres → Sécurité → Sources inconnues (ACTIVER)
echo    3. Tapez sur le fichier APK téléchargé
echo.
echo 🎯 Votre APK est prêt pour les tests !
echo.
echo 📍 Vous pouvez aussi trouver l'APK sur :
echo    https://expo.dev/accounts/hedimed/projects/stade/builds
echo.
pause






