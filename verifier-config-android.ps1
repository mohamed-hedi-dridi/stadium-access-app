# Script de vérification de la configuration Android
# Stadium Access App

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    🔍 VÉRIFICATION CONFIG ANDROID" -ForegroundColor Cyan
Write-Host "    🏟️  Stadium Access App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$errors = @()
$warnings = @()

# Fonction pour ajouter une erreur
function Add-Error {
    param($message)
    $errors += $message
    Write-Host "❌ $message" -ForegroundColor Red
}

# Fonction pour ajouter un avertissement
function Add-Warning {
    param($message)
    $warnings += $message
    Write-Host "⚠️  $message" -ForegroundColor Yellow
}

# Fonction pour ajouter un succès
function Add-Success {
    param($message)
    Write-Host "✅ $message" -ForegroundColor Green
}

Write-Host "[1/8] Vérification des fichiers de configuration..." -ForegroundColor Yellow
Write-Host ""

# Vérifier les fichiers essentiels
$requiredFiles = @("app.json", "eas.json", "package.json")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Add-Success "$file trouvé"
    } else {
        Add-Error "$file manquant"
    }
}

Write-Host ""
Write-Host "[2/8] Vérification des dépendances..." -ForegroundColor Yellow
Write-Host ""

# Vérifier npm et les dépendances
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Add-Success "npm installé (v$npmVersion)"
    } else {
        Add-Error "npm non installé"
    }
} catch {
    Add-Error "npm non installé"
}

# Vérifier Expo CLI
try {
    $expoVersion = npx expo --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Add-Success "Expo CLI installé"
    } else {
        Add-Error "Expo CLI non installé"
    }
} catch {
    Add-Error "Expo CLI non installé"
}

# Vérifier EAS CLI
try {
    $easVersion = eas --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Add-Success "EAS CLI installé"
    } else {
        Add-Error "EAS CLI non installé"
    }
} catch {
    Add-Error "EAS CLI non installé"
}

Write-Host ""
Write-Host "[3/8] Vérification de la configuration app.json..." -ForegroundColor Yellow
Write-Host ""

# Lire et analyser app.json
try {
    $appConfig = Get-Content "app.json" | ConvertFrom-Json
    
    # Vérifier le package Android
    if ($appConfig.expo.android.package) {
        Add-Success "Package Android configuré: $($appConfig.expo.android.package)"
    } else {
        Add-Error "Package Android manquant"
    }
    
    # Vérifier le versionCode
    if ($appConfig.expo.android.versionCode) {
        Add-Success "Version Code: $($appConfig.expo.android.versionCode)"
    } else {
        Add-Warning "Version Code manquant"
    }
    
    # Vérifier les permissions
    if ($appConfig.expo.android.permissions) {
        $permissions = $appConfig.expo.android.permissions
        Add-Success "Permissions configurées ($($permissions.Count) permissions)"
        foreach ($perm in $permissions) {
            Write-Host "   • $perm" -ForegroundColor Gray
        }
    } else {
        Add-Warning "Aucune permission configurée"
    }
    
} catch {
    Add-Error "Erreur lors de la lecture d'app.json"
}

Write-Host ""
Write-Host "[4/8] Vérification des assets..." -ForegroundColor Yellow
Write-Host ""

# Vérifier les assets
$requiredAssets = @(
    "assets/images/icon.png",
    "assets/images/adaptive-icon.png", 
    "assets/images/splash-icon.png"
)

foreach ($asset in $requiredAssets) {
    if (Test-Path $asset) {
        Add-Success "$asset trouvé"
    } else {
        Add-Error "$asset manquant"
    }
}

Write-Host ""
Write-Host "[5/8] Vérification des plugins..." -ForegroundColor Yellow
Write-Host ""

# Vérifier les plugins
try {
    if ($appConfig.expo.plugins) {
        $plugins = $appConfig.expo.plugins
        Add-Success "Plugins configurés ($($plugins.Count) plugins)"
        foreach ($plugin in $plugins) {
            Write-Host "   • $plugin" -ForegroundColor Gray
        }
    } else {
        Add-Warning "Aucun plugin configuré"
    }
} catch {
    Add-Error "Erreur lors de la vérification des plugins"
}

Write-Host ""
Write-Host "[6/8] Vérification des scripts de build..." -ForegroundColor Yellow
Write-Host ""

# Vérifier les scripts dans package.json
try {
    $packageConfig = Get-Content "package.json" | ConvertFrom-Json
    
    if ($packageConfig.scripts."build:android") {
        Add-Success "Scripts de build configurés"
    } else {
        Add-Error "Scripts de build manquants"
    }
} catch {
    Add-Error "Erreur lors de la lecture de package.json"
}

Write-Host ""
Write-Host "[7/8] Vérification de la configuration EAS..." -ForegroundColor Yellow
Write-Host ""

# Vérifier eas.json
try {
    $easConfig = Get-Content "eas.json" | ConvertFrom-Json
    
    if ($easConfig.build) {
        $profiles = $easConfig.build.PSObject.Properties.Name
        Add-Success "Profils EAS configurés: $($profiles -join ', ')"
    } else {
        Add-Error "Configuration EAS manquante"
    }
} catch {
    Add-Error "Erreur lors de la lecture d'eas.json"
}

Write-Host ""
Write-Host "[8/8] Test de connexion Expo..." -ForegroundColor Yellow
Write-Host ""

# Vérifier la connexion Expo
try {
    $user = eas whoami 2>$null
    if ($LASTEXITCODE -eq 0) {
        Add-Success "Connecté à Expo en tant que: $user"
    } else {
        Add-Warning "Non connecté à Expo"
    }
} catch {
    Add-Warning "Non connecté à Expo"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Résumé
if ($errors.Count -eq 0) {
    Write-Host "    ✅ CONFIGURATION VALIDE !" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Votre configuration Android est correcte !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Informations de l'application :" -ForegroundColor Yellow
    Write-Host "   • Nom: $($appConfig.expo.name)" -ForegroundColor White
    Write-Host "   • Package: $($appConfig.expo.android.package)" -ForegroundColor White
    Write-Host "   • Version: $($appConfig.expo.version)" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Commandes disponibles :" -ForegroundColor Yellow
    Write-Host "   • Build Preview: npm run build:android:preview" -ForegroundColor White
    Write-Host "   • Build Development: npm run build:android:dev" -ForegroundColor White
    Write-Host "   • Build Production: npm run build:android" -ForegroundColor White
} else {
    Write-Host "    ❌ ERREURS DÉTECTÉES" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Actions recommandées :" -ForegroundColor Yellow
    foreach ($error in $errors) {
        Write-Host "   • $error" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "💡 Solutions :" -ForegroundColor Yellow
    Write-Host "   • Installez les dépendances: npm install" -ForegroundColor White
    Write-Host "   • Configurez EAS: eas init" -ForegroundColor White
    Write-Host "   • Connectez-vous: eas login" -ForegroundColor White
}

if ($warnings.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Avertissements :" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "   • $warning" -ForegroundColor White
    }
}

Write-Host ""
Read-Host "Appuyez sur Entrée pour continuer"






