# Configuration Serveur Local

## 🌐 Votre Configuration

**Votre IP locale :** `192.168.1.12`  
**URL de l'API :** `http://192.168.1.12:8000/api`

## 📋 Étapes pour configurer votre serveur local

### 1. Démarrer votre serveur API

Assurez-vous que votre serveur API fonctionne sur le port 8000 :

```bash
# Exemple avec différents frameworks
python manage.py runserver 0.0.0.0:8000  # Django
php -S 0.0.0.0:8000                      # PHP
node server.js                           # Node.js (port 8000)
```

### 2. Endpoints requis

Votre serveur doit exposer ces endpoints :

```
POST http://192.168.1.12:8000/api/auth/login
GET  http://192.168.1.12:8000/api/games
POST http://192.168.1.12:8000/api/stadium-access/scan
```

### 3. Test de connectivité

Testez si votre serveur répond :

```bash
curl http://192.168.1.12:8000/api/games
```

### 4. Démarrer l'application React Native

```bash
npm start
```

### 5. Configurations selon l'appareil

#### 📱 Appareil physique (même WiFi) :
- L'application utilisera automatiquement `http://192.168.1.12:8000/api`

#### 📱 Émulateur Android :
- Changez l'URL dans `constants/api.ts` vers `http://10.0.2.2:8000/api`

#### 💻 Web :
- L'application utilisera `http://192.168.1.12:8000/api`

## 🔧 Format des réponses attendues

### Login (POST /auth/login)
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "1",
    "email": "agent@clubafricain.com",
    "name": "Agent Name"
  }
}
```

### Games (GET /games)
```json
{
  "success": true,
  "matches": [
    {
      "id": "1",
      "homeTeam": "Club Africain",
      "awayTeam": "Espérance Sportive",
      "date": "2025-01-15 20:00:00",
      "stadium": "Stade Olympique de Radès",
      "status": "upcoming"
    }
  ]
}
```

### Scan QR (POST /stadium-access/scan)
```json
{
  "success": true,
  "ticket": {
    "id": "1",
    "matchId": "1",
    "seatNumber": "A1",
    "isValid": true
  }
}
```

## 🚨 Dépannage

### Erreur de connexion :
1. Vérifiez que votre serveur fonctionne : `curl http://192.168.1.12:8000/api/games`
2. Vérifiez le firewall Windows
3. Vérifiez que le port 8000 est ouvert

### CORS errors :
Configurez CORS sur votre serveur pour accepter les requêtes depuis l'app mobile.

### Timeout :
Augmentez le timeout dans `API_CONFIG.TIMEOUT` si nécessaire.

## 📱 Utilisation

1. **Démarrez votre serveur API** sur le port 8000
2. **Lancez l'application** : `npm start`
3. **Scannez le QR code** avec Expo Go
4. **Testez la connexion** avec vos identifiants
5. **Vérifiez les logs** dans la console pour le débogage
