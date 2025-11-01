# 📱 Gestion APK Android - Stadium Access App

## 🚀 Génération d'APK Android

### Prérequis
- Compte Expo (gratuit)
- EAS CLI installé
- Projet configuré avec EAS Build

### 1. Configuration initiale

```bash
# Se connecter à Expo
eas login

# Le projet est déjà configuré avec EAS
# ID du projet: 12f7515b-a7d4-4892-bb26-abad3496460
```

### 🚀 Scripts automatisés

Pour faciliter la génération d'APK, utilisez les scripts fournis :

#### Windows (PowerShell)
```powershell
.\build-apk.ps1
```

#### Windows (Command Prompt)
```cmd
build-apk.bat
```

### 2. Génération d'APK

#### APK de développement (avec Expo Dev Client)
```bash
npm run build:android:dev
```

#### APK de prévisualisation (pour tests)
```bash
npm run build:android:preview
```

#### APK de production
```bash
npm run build:android
```

### 3. Types de builds disponibles

| Type | Commande | Usage |
|------|----------|-------|
| **Development** | `npm run build:android:dev` | Développement avec hot reload |
| **Preview** | `npm run build:android:preview` | Tests internes |
| **Production** | `npm run build:android` | Version finale |

### 4. Installation de l'APK

1. **Télécharger l'APK** depuis le lien fourni par EAS Build
2. **Activer les sources inconnues** sur l'appareil Android :
   - Paramètres → Sécurité → Sources inconnues
3. **Installer l'APK** en le tapant

### 5. Gestion des versions

#### Mise à jour du numéro de version
```json
// app.json
{
  "expo": {
    "version": "1.0.1",  // Version utilisateur
    "android": {
      "versionCode": 2   // Version technique (incrémenter à chaque build)
    }
  }
}
```

### 6. Configuration avancée

#### Permissions Android
Les permissions suivantes sont configurées :
- `CAMERA` : Pour scanner les QR codes
- `INTERNET` : Pour les appels API
- `ACCESS_NETWORK_STATE` : Pour vérifier la connectivité

#### Package name
- **Package** : `com.clubafricain.stadiumaccess`
- **Nom** : Stadium Access App

### 7. Dépannage

#### Erreur de build
```bash
# Vérifier la configuration
eas build:configure

# Nettoyer le cache
eas build --clear-cache
```

#### Problème d'installation
- Vérifier que les sources inconnues sont activées
- S'assurer que l'APK n'est pas corrompu
- Vérifier la compatibilité Android (API 21+)

### 8. Workflow recommandé

1. **Développement** : Utiliser `npm run build:android:dev`
2. **Tests** : Utiliser `npm run build:android:preview`
3. **Production** : Utiliser `npm run build:android`

### 9. Commandes utiles

```bash
# Voir l'historique des builds
eas build:list

# Annuler un build en cours
eas build:cancel [BUILD_ID]

# Voir les détails d'un build
eas build:view [BUILD_ID]
```

### 10. Coûts

- **Compte gratuit** : 30 builds/mois
- **Compte payant** : Builds illimités
- **Builds locaux** : Gratuits (nécessite Android Studio)

## 📋 Checklist avant build

- [ ] Tester l'application en mode développement
- [ ] Vérifier que l'API backend est accessible
- [ ] Mettre à jour le `versionCode` si nécessaire
- [ ] Vérifier les permissions Android
- [ ] Tester sur un appareil physique

## 🔗 Liens utiles

- [Documentation EAS Build](https://docs.expo.dev/build/introduction/)
- [Configuration Android](https://docs.expo.dev/workflow/configuration/)
- [Gestion des versions](https://docs.expo.dev/workflow/versioning/)
