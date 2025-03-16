# Documentation de l'API GPS Tracker

Ce document détaille les endpoints disponibles dans l'API GPS Tracker, leurs paramètres et les réponses attendues.

## Base URL

```
http://localhost:3000/api
```

## Authentification

L'API utilise l'authentification JWT (JSON Web Token). Pour accéder aux endpoints protégés, vous devez inclure le token dans l'en-tête de la requête :

```
Authorization: Bearer <votre_token_jwt>
```

### Obtenir un Token

**Endpoint** : `POST /auth/login`

**Corps de la requête** :
```json
{
  "email": "utilisateur@exemple.com",
  "password": "mot_de_passe"
}
```

**Réponse** :
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "5f8d0e0b9d3e9a0017a4b0a1",
    "name": "Nom Utilisateur",
    "email": "utilisateur@exemple.com",
    "role": "admin"
  }
}
```

## Endpoints Utilisateurs

### Créer un Utilisateur

**Endpoint** : `POST /users`

**Authentification** : Requise (Admin uniquement)

**Corps de la requête** :
```json
{
  "name": "Nouvel Utilisateur",
  "email": "nouvel.utilisateur@exemple.com",
  "password": "mot_de_passe",
  "role": "user"
}
```

**Réponse** :
```json
{
  "id": "5f8d0e0b9d3e9a0017a4b0a2",
  "name": "Nouvel Utilisateur",
  "email": "nouvel.utilisateur@exemple.com",
  "role": "user",
  "createdAt": "2023-03-15T12:00:00.000Z"
}
```

### Obtenir Tous les Utilisateurs

**Endpoint** : `GET /users`

**Authentification** : Requise (Admin uniquement)

**Réponse** :
```json
[
  {
    "id": "5f8d0e0b9d3e9a0017a4b0a1",
    "name": "Nom Utilisateur",
    "email": "utilisateur@exemple.com",
    "role": "admin",
    "createdAt": "2023-03-15T12:00:00.000Z"
  },
  {
    "id": "5f8d0e0b9d3e9a0017a4b0a2",
    "name": "Nouvel Utilisateur",
    "email": "nouvel.utilisateur@exemple.com",
    "role": "user",
    "createdAt": "2023-03-15T12:00:00.000Z"
  }
]
```

### Obtenir un Utilisateur par ID

**Endpoint** : `GET /users/:id`

**Authentification** : Requise

**Réponse** :
```json
{
  "id": "5f8d0e0b9d3e9a0017a4b0a1",
  "name": "Nom Utilisateur",
  "email": "utilisateur@exemple.com",
  "role": "admin",
  "createdAt": "2023-03-15T12:00:00.000Z"
}
```

### Mettre à Jour un Utilisateur

**Endpoint** : `PUT /users/:id`

**Authentification** : Requise

**Corps de la requête** :
```json
{
  "name": "Nom Modifié",
  "email": "email.modifie@exemple.com"
}
```

**Réponse** :
```json
{
  "id": "5f8d0e0b9d3e9a0017a4b0a1",
  "name": "Nom Modifié",
  "email": "email.modifie@exemple.com",
  "role": "admin",
  "updatedAt": "2023-03-16T12:00:00.000Z"
}
```

### Supprimer un Utilisateur

**Endpoint** : `DELETE /users/:id`

**Authentification** : Requise (Admin uniquement)

**Réponse** :
```json
{
  "message": "Utilisateur supprimé avec succès"
}
```

## Endpoints Appareils

### Créer un Appareil

**Endpoint** : `POST /devices`

**Authentification** : Requise

**Corps de la requête** :
```json
{
  "deviceId": "GPS-001",
  "name": "Véhicule 1",
  "type": "vehicle",
  "description": "Camion de livraison"
}
```

**Réponse** :
```json
{
  "id": "5f8d0e0b9d3e9a0017a4b0a3",
  "deviceId": "GPS-001",
  "name": "Véhicule 1",
  "type": "vehicle",
  "description": "Camion de livraison",
  "createdAt": "2023-03-15T12:00:00.000Z",
  "owner": "5f8d0e0b9d3e9a0017a4b0a1"
}
```

### Obtenir Tous les Appareils

**Endpoint** : `GET /devices`

**Authentification** : Requise

**Réponse** :
```json
[
  {
    "id": "5f8d0e0b9d3e9a0017a4b0a3",
    "deviceId": "GPS-001",
    "name": "Véhicule 1",
    "type": "vehicle",
    "description": "Camion de livraison",
    "createdAt": "2023-03-15T12:00:00.000Z",
    "owner": "5f8d0e0b9d3e9a0017a4b0a1"
  },
  {
    "id": "5f8d0e0b9d3e9a0017a4b0a4",
    "deviceId": "GPS-002",
    "name": "Véhicule 2",
    "type": "vehicle",
    "description": "Voiture de service",
    "createdAt": "2023-03-15T12:00:00.000Z",
    "owner": "5f8d0e0b9d3e9a0017a4b0a1"
  }
]
```

### Obtenir un Appareil par ID

**Endpoint** : `GET /devices/:id`

**Authentification** : Requise

**Réponse** :
```json
{
  "id": "5f8d0e0b9d3e9a0017a4b0a3",
  "deviceId": "GPS-001",
  "name": "Véhicule 1",
  "type": "vehicle",
  "description": "Camion de livraison",
  "createdAt": "2023-03-15T12:00:00.000Z",
  "owner": "5f8d0e0b9d3e9a0017a4b0a1"
}
```

### Mettre à Jour un Appareil

**Endpoint** : `PUT /devices/:id`

**Authentification** : Requise

**Corps de la requête** :
```json
{
  "name": "Véhicule 1 - Modifié",
  "description": "Camion de livraison principal"
}
```

**Réponse** :
```json
{
  "id": "5f8d0e0b9d3e9a0017a4b0a3",
  "deviceId": "GPS-001",
  "name": "Véhicule 1 - Modifié",
  "type": "vehicle",
  "description": "Camion de livraison principal",
  "updatedAt": "2023-03-16T12:00:00.000Z",
  "owner": "5f8d0e0b9d3e9a0017a4b0a1"
}
```

### Supprimer un Appareil

**Endpoint** : `DELETE /devices/:id`

**Authentification** : Requise

**Réponse** :
```json
{
  "message": "Appareil supprimé avec succès"
}
```

## Endpoints Localisation

### Enregistrer une Position

**Endpoint** : `POST /locations`

**Authentification** : Requise

**Corps de la requête** :
```json
{
  "deviceId": "GPS-001",
  "latitude": 48.8534,
  "longitude": 2.3488,
  "speed": 60,
  "altitude": 35,
  "heading": 90,
  "accuracy": 5,
  "batteryLevel": 85,
  "timestamp": "2023-03-15T12:00:00.000Z"
}
```

**Réponse** :
```json
{
  "id": "5f8d0e0b9d3e9a0017a4b0a5",
  "device": "5f8d0e0b9d3e9a0017a4b0a3",
  "latitude": 48.8534,
  "longitude": 2.3488,
  "speed": 60,
  "altitude": 35,
  "heading": 90,
  "accuracy": 5,
  "batteryLevel": 85,
  "timestamp": "2023-03-15T12:00:00.000Z",
  "createdAt": "2023-03-15T12:00:00.000Z"
}
```

### Obtenir l'Historique des Positions d'un Appareil

**Endpoint** : `GET /locations/history/:deviceId`

**Authentification** : Requise

**Paramètres de requête** :
- `start` : Date de début (format ISO)
- `end` : Date de fin (format ISO)
- `limit` : Nombre maximum de résultats (défaut: 100)

**Exemple** : `GET /locations/history/GPS-001?start=2023-03-01T00:00:00.000Z&end=2023-03-15T23:59:59.999Z&limit=10`

**Réponse** :
```json
{
  "device": {
    "id": "5f8d0e0b9d3e9a0017a4b0a3",
    "deviceId": "GPS-001",
    "name": "Véhicule 1"
  },
  "locations": [
    {
      "id": "5f8d0e0b9d3e9a0017a4b0a5",
      "latitude": 48.8534,
      "longitude": 2.3488,
      "speed": 60,
      "timestamp": "2023-03-15T12:00:00.000Z"
    },
    {
      "id": "5f8d0e0b9d3e9a0017a4b0a6",
      "latitude": 48.8634,
      "longitude": 2.3588,
      "speed": 55,
      "timestamp": "2023-03-15T12:05:00.000Z"
    }
  ],
  "count": 2,
  "total": 2
}
```

### Obtenir la Dernière Position d'un Appareil

**Endpoint** : `GET /locations/last/:deviceId`

**Authentification** : Requise

**Réponse** :
```json
{
  "id": "5f8d0e0b9d3e9a0017a4b0a6",
  "device": {
    "id": "5f8d0e0b9d3e9a0017a4b0a3",
    "deviceId": "GPS-001",
    "name": "Véhicule 1"
  },
  "latitude": 48.8634,
  "longitude": 2.3588,
  "speed": 55,
  "altitude": 36,
  "heading": 92,
  "accuracy": 4,
  "batteryLevel": 84,
  "timestamp": "2023-03-15T12:05:00.000Z"
}
```

## Codes d'Erreur

| Code | Description |
|------|-------------|
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Non autorisé |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

## Exemples d'Utilisation avec cURL

### Authentification
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"utilisateur@exemple.com","password":"mot_de_passe"}'
```

### Obtenir Tous les Appareils
```bash
curl -X GET http://localhost:3000/api/devices \
  -H "Authorization: Bearer <votre_token_jwt>"
```

### Enregistrer une Position
```bash
curl -X POST http://localhost:3000/api/locations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <votre_token_jwt>" \
  -d '{"deviceId":"GPS-001","latitude":48.8534,"longitude":2.3488,"speed":60,"altitude":35,"heading":90,"accuracy":5,"batteryLevel":85}'
``` 