# Configuration MongoDB pour GPS Tracker

Ce document détaille la configuration MongoDB utilisée dans le projet GPS Tracker et explique comment résoudre les problèmes de connexion courants.

## Configuration Actuelle

Le projet utilise MongoDB Atlas comme base de données principale. La connexion est configurée dans le fichier `src/index.js` avec les paramètres suivants :

```javascript
// Configuration des serveurs DNS de Google
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Options de connexion MongoDB
const mongooseOptions = {
  serverSelectionTimeoutMS: 20000, // Timeout de 20 secondes
};

// Détection d'URL SRV pour désactiver directConnection si nécessaire
if (!process.env.MONGODB_URI.includes('+srv')) {
  mongooseOptions.directConnection = true;
}

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    console.log('Mode sans base de données activé - Utilisation de données en mémoire');
  });
```

## Problèmes Résolus

### 1. Problème de Résolution DNS

**Symptôme** : Échec de connexion à MongoDB avec des erreurs de timeout ou de résolution d'hôte.

**Solution** : Configuration explicite des serveurs DNS de Google (8.8.8.8 et 8.8.4.4) pour améliorer la résolution des noms d'hôtes MongoDB.

```javascript
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('Serveurs DNS configurés:', dns.getServers());
```

### 2. Problème avec les URLs SRV et directConnection

**Symptôme** : Échec de connexion lors de l'utilisation d'URLs SRV avec l'option `directConnection: true`.

**Solution** : Détection automatique des URLs SRV pour désactiver l'option `directConnection` lorsque nécessaire.

```javascript
// Détection d'URL SRV pour désactiver directConnection si nécessaire
if (process.env.MONGODB_URI.includes('+srv')) {
  console.log('URL SRV détectée, option directConnection désactivée');
} else {
  mongooseOptions.directConnection = true;
  console.log('Option directConnection activée');
}
```

### 3. Timeout de Connexion

**Symptôme** : Timeout lors de la tentative de connexion à MongoDB.

**Solution** : Augmentation du timeout de sélection du serveur à 20 secondes.

```javascript
const mongooseOptions = {
  serverSelectionTimeoutMS: 20000, // Timeout de 20 secondes
};
```

## Mode Fallback

En cas d'échec de connexion à MongoDB, le système passe en mode "sans base de données" et utilise des données en mémoire pour permettre un fonctionnement minimal de l'application.

```javascript
mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    console.log('Mode sans base de données activé - Utilisation de données en mémoire');
    // Logique pour utiliser des données en mémoire
  });
```

## Recommandations pour le Déploiement

1. **Utiliser MongoDB Atlas** : Pour une meilleure fiabilité et disponibilité.
2. **Configurer des Alertes** : Mettre en place des alertes pour surveiller la connexion à MongoDB.
3. **Utiliser des Variables d'Environnement** : Ne jamais coder en dur les informations de connexion.
4. **Implémenter des Retry Patterns** : Ajouter une logique de reconnexion en cas d'échec temporaire.

## Tests de Connexion

Deux scripts de test sont disponibles pour vérifier la connexion à MongoDB :

1. `test-mongodb.js` : Test de connexion basique
2. `test-mongodb-dns.js` : Test avec configuration DNS de Google

Pour exécuter ces tests :

```bash
node test-mongodb-dns.js
```

## Dépannage Avancé

### Problème : Erreur ECONNREFUSED

**Symptôme** : Erreur "Connection refused" lors de la tentative de connexion.

**Solutions possibles** :
1. Vérifier que l'adresse IP et le port sont corrects
2. Vérifier que le serveur MongoDB est en cours d'exécution
3. Vérifier les règles de pare-feu

### Problème : Erreur d'authentification

**Symptôme** : Erreur "Authentication failed" lors de la tentative de connexion.

**Solutions possibles** :
1. Vérifier que le nom d'utilisateur et le mot de passe sont corrects
2. Vérifier que l'utilisateur a les autorisations nécessaires
3. Vérifier que l'utilisateur est associé à la bonne base de données

### Problème : Erreur de certificat SSL

**Symptôme** : Erreur SSL lors de la tentative de connexion.

**Solutions possibles** :
1. Ajouter l'option `ssl=true` à l'URL de connexion
2. Ajouter l'option `tlsAllowInvalidCertificates: true` aux options de connexion (uniquement pour le développement)

## Exemples d'URLs de Connexion

### MongoDB Atlas
```
mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### MongoDB Local
```
mongodb://localhost:27017/database
```

### MongoDB avec Authentification
```
mongodb://username:password@localhost:27017/database
```

### MongoDB avec Réplica Set
```
mongodb://username:password@host1:port1,host2:port2,host3:port3/database?replicaSet=myReplicaSet
``` 