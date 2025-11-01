# Stadium Access App - Build APK Script
# PowerShell version

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Stadium Access App - Build APK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Vérification de la connexion Expo
Write-Host "[1/3] Vérification de la configuration..." -ForegroundColor Yellow
try {
    $user = eas whoami 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Non connecté"
    }
    Write-Host "✓ Connecté à Expo en tant que: $user" -ForegroundColor Green
} catch {
    Write-Host "✗ ERREUR: Vous devez vous connecter à Expo" -ForegroundColor Red
    Write-Host "Exécutez: eas login" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

Write-Host ""
Write-Host "[2/3] Génération de l'APK..." -ForegroundColor Yellow
Write-Host "Choisissez le type de build:"
Write-Host "1. Preview (recommandé pour tests)" -ForegroundColor Green
Write-Host "2. Development (avec dev client)" -ForegroundColor Blue
Write-Host "3. Production" -ForegroundColor Red
Write-Host ""

$choice = Read-Host "Votre choix (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Génération APK Preview..." -ForegroundColor Green
        eas build --platform android --profile preview
    }
    "2" {
        Write-Host "Génération APK Development..." -ForegroundColor Blue
        eas build --platform android --profile development
    }
    "3" {
        Write-Host "Génération APK Production..." -ForegroundColor Red
        eas build --platform android --profile production
    }
    default {
        Write-Host "Choix invalide" -ForegroundColor Red
        Read-Host "Appuyez sur Entrée pour continuer"
        exit 1
    }
}

Write-Host ""
Write-Host "[3/3] Build terminé!" -ForegroundColor Green
Write-Host ""
Write-Host "Pour installer l'APK:" -ForegroundColor Yellow
Write-Host "1. Téléchargez le fichier depuis le lien fourni" -ForegroundColor White
Write-Host "2. Activez 'Sources inconnues' dans les paramètres Android" -ForegroundColor White
Write-Host "3. Installez l'APK en le tapant" -ForegroundColor White
Write-Host ""
Read-Host "Appuyez sur Entrée pour continuer"

