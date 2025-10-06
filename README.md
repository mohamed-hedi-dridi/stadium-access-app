# Stadium Access - Application de Contrôle d'Accès au Stade

Application mobile développée avec React Native et Expo pour les agents de sécurité au stade du Club Africain. Cette application permet de scanner les billets QR des supporters pour contrôler l'accès au stade.

## 🚀 Fonctionnalités

- **Authentification sécurisée** : Connexion des agents avec email et mot de passe
- **Liste des matchs** : Affichage des matchs disponibles avec statuts
- **Scanner QR** : Scan des billets QR pour validation d'accès
- **Gestion des tokens** : Authentification persistante avec tokens JWT
- **Interface moderne** : Design responsive et intuitif

## 📱 Pages de l'application

### 1. Page de Connexion (`/login`)
- Formulaire de connexion avec email et mot de passe
- Validation des champs
- Gestion des erreurs de connexion
- Redirection automatique après connexion réussie

### 2. Page des Matchs (`/matches`)
- Liste des matchs avec informations détaillées
- Statuts des matchs (à venir, en cours, terminé)
- Bouton de déconnexion
- Actualisation par pull-to-refresh
- Navigation vers le scanner pour chaque match

### 3. Page de Scan QR (`/scan/[matchId]`)
- Interface de scan avec caméra
- Validation des billets QR
- Feedback visuel pour billets valides/invalides
- Gestion des autorisations caméra

## 🛠️ Technologies utilisées

- **React Native** : Framework de développement mobile
- **Expo** : Plateforme de développement et déploiement
- **TypeScript** : Langage de programmation typé
- **Expo Router** : Navigation basée sur les fichiers
- **Axios** : Client HTTP pour les appels API
- **AsyncStorage** : Stockage local des données
- **Expo Camera** : Gestion de la caméra et scan QR

## 📦 Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd stade
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer l'application**
   ```bash
   npm start
   ```

## 🔧 Configuration API

L'application utilise les endpoints suivants :

```typescript
const API_BASE_URL = 'https://test.clubafricain.site/api';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  GET_MATCHES: `${API_BASE_URL}/games`,
  SCAN_QR: `${API_BASE_URL}/stadium-access/scan`
};
```

### Endpoints utilisés :

1. **POST /auth/login**
   - Authentification des agents
   - Retourne un token JWT et les données utilisateur

2. **GET /games**
   - Récupération de la liste des matchs
   - Nécessite un token d'authentification

3. **POST /stadium-access/scan**
   - Validation des billets QR
   - Nécessite un token d'authentification

## 🏗️ Architecture

```
app/
├── _layout.tsx          # Layout principal avec navigation
├── index.tsx            # Page d'accueil (redirection)
├── login.tsx            # Page de connexion
├── matches.tsx          # Page des matchs
└── scan/
    └── [matchId].tsx    # Page de scan QR

constants/
└── api.ts               # Configuration des endpoints API

services/
└── api.ts               # Services API et types TypeScript

contexts/
└── AuthContext.tsx      # Contexte d'authentification global

utils/
└── storage.ts           # Utilitaires de stockage local
```

## 🔐 Gestion de l'authentification

L'application utilise un système d'authentification basé sur :

- **Tokens JWT** : Stockés localement avec AsyncStorage
- **Contexte React** : Gestion globale de l'état d'authentification
- **Redirection automatique** : Selon l'état de connexion
- **Persistance** : Maintien de la session entre les redémarrages

## 📱 Utilisation

1. **Connexion** : L'agent saisit ses identifiants
2. **Sélection du match** : Choix du match depuis la liste
3. **Scan des billets** : Utilisation de la caméra pour scanner les QR codes
4. **Validation** : Feedback immédiat sur la validité du billet

## 🎨 Design

L'application suit les couleurs du Club Africain :
- **Rouge principal** : `#e74c3c`
- **Interface moderne** : Cards, ombres, animations
- **Responsive** : Adaptation aux différentes tailles d'écran
- **Accessibilité** : Contraste et lisibilité optimisés

## 🚀 Déploiement

L'application peut être déployée via :

- **Expo Go** : Pour les tests de développement
- **Build Expo** : Pour la production (APK/IPA)
- **App Store/Play Store** : Distribution officielle

## 📝 Notes de développement

- L'application gère automatiquement les erreurs de réseau
- Les tokens sont automatiquement renouvelés
- Interface en français pour les agents tunisiens
- Compatible iOS et Android

## 🔄 Mises à jour futures

- [ ] Mode hors ligne avec cache
- [ ] Notifications push pour les matchs
- [ ] Statistiques de scan en temps réel
- [ ] Support multi-langues
- [ ] Mode sombre
