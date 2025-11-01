# 🔧 Configuration Build Android Local

## Build local avec Android Studio

Si vous préférez générer l'APK localement sans utiliser EAS Build :

### Prérequis
- Android Studio installé
- SDK Android configuré
- Java Development Kit (JDK)

### 1. Configuration du projet

```bash
# Générer les fichiers Android natifs
npx expo run:android
```

### 2. Build APK avec Android Studio

1. Ouvrir le projet dans Android Studio
2. Aller dans `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
3. L'APK sera généré dans `android/app/build/outputs/apk/`

### 3. Build APK en ligne de commande

```bash
# Aller dans le dossier android
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease
```

### 4. Signature de l'APK

Pour un APK de production, vous devez le signer :

```bash
# Générer une clé de signature
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Signer l'APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk my-key-alias

# Optimiser l'APK
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

## Avantages des builds locaux

- ✅ Gratuit (pas de limite EAS)
- ✅ Contrôle total sur le processus
- ✅ Builds plus rapides pour les tests
- ✅ Pas besoin de compte Expo

## Inconvénients

- ❌ Configuration plus complexe
- ❌ Nécessite Android Studio
- ❌ Gestion manuelle des signatures
- ❌ Pas de distribution automatique

## Recommandation

Pour le développement et les tests, utilisez **EAS Build** (plus simple).
Pour la production, considérez les builds locaux si vous avez des besoins spécifiques.


