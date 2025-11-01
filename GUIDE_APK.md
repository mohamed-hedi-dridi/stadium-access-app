# 📱 Comment obtenir votre APK pour tester

## 🚀 Méthode simple (recommandée)

### 1. Ouvrir PowerShell dans le dossier du projet
```powershell
# Aller dans le dossier du projet
cd D:\hedi\stadium-access-app

# Exécuter le script de build
.\build-apk.ps1
```

### 2. Ou utiliser les commandes directes
```bash
# Se connecter à Expo (si pas déjà fait)
eas login

# Générer l'APK de prévisualisation
eas build --platform android --profile preview
```

### 3. Suivre les instructions à l'écran
- Le système vous demandera de générer une clé de signature → **Répondez "Oui"**
- Le build commencera automatiquement
- Vous recevrez un lien de téléchargement

## 📍 Où trouver votre APK

### Pendant le build :
1. **Lien direct** : Vous verrez un lien comme `https://expo.dev/artifacts/...`
2. **Dashboard Expo** : Allez sur [expo.dev](https://expo.dev) → Vos projets → Stadium Access

### Après le build :
1. **Email** : Vous recevrez un email avec le lien de téléchargement
2. **Console** : Le lien s'affiche dans le terminal
3. **Expo Dashboard** : Section "Builds" de votre projet

## 📥 Télécharger et installer l'APK

### 1. Télécharger
- Cliquez sur le lien fourni
- Téléchargez le fichier `.apk`

### 2. Installer sur Android
```
Paramètres → Sécurité → Sources inconnues (ACTIVER)
```
Puis tapez sur le fichier APK téléchargé

## 🔧 Alternative : Build local rapide

Si vous voulez tester rapidement sans EAS :

```bash
# Générer un build de développement local
npx expo run:android

# L'APK sera dans : android/app/build/outputs/apk/debug/
```

## 📞 Support

Si vous avez des problèmes :
1. Vérifiez que vous êtes connecté : `eas whoami`
2. Vérifiez votre connexion internet
3. Le build peut prendre 5-15 minutes

## 🎯 Prochaines étapes

1. **Générer l'APK** avec une des méthodes ci-dessus
2. **Télécharger** depuis le lien fourni
3. **Installer** sur votre appareil Android
4. **Tester** l'application

L'APK sera disponible dans votre dashboard Expo ou par email !



