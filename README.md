# Système de Suivi GPS

Un système complet de suivi GPS avec API backend, client web et application mobile pour le suivi et la gestion des véhicules en temps réel.

## Structure du Projet

Le projet se compose de trois composants principaux :

- **API Backend** : Serveur Node.js/Express avec base de données MongoDB
- **Client Web** : Tableau de bord basé sur React pour les administrateurs
- **Application Mobile** : Application mobile pour les utilisateurs finaux

## Prérequis

Avant d'installer ce projet, assurez-vous d'avoir installé les éléments suivants :

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)
- MongoDB (installation locale ou compte MongoDB Atlas)
- Git

## Environnements de Développement

Le projet peut fonctionner dans différents environnements de développement :

### Environnement Local

- **Base de données** : MongoDB locale ou MongoDB Atlas
- **Mode de développement** : Utilise nodemon pour le rechargement automatique
- **Variables d'environnement** : Configurées dans le fichier `.env`

### Mode Sans Base de Données

Le système est conçu pour fonctionner même sans connexion à MongoDB :
- Activé automatiquement en cas d'échec de connexion à la base de données
- Utilise une base de données en mémoire pour le stockage temporaire des données
- Idéal pour les tests rapides et le développement sans configuration de MongoDB

### Environnement de Production

- **Base de données** : MongoDB Atlas recommandée pour la production
- **Mode** : Optimisé pour les performances (NODE_ENV=production)
- **Sécurité** : Assurez-vous que toutes les variables sensibles sont correctement configurées

### Branches de Développement

- **master** : Code stable pour la production
- **fix-mongodb-connection** : Correctifs pour les problèmes de connexion MongoDB
  - Utilise une connexion directe à MongoDB (sans SRV)
  - Contourne les problèmes DNS sur macOS Monterey et versions ultérieures

## IDE et Outils de Développement

Pour développer efficacement sur ce projet, voici les IDE et outils recommandés :

### IDE Recommandés

- **Visual Studio Code** : Recommandé pour le développement complet (backend, frontend, mobile)
  - Extensions recommandées :
    - ESLint : Pour la vérification du code JavaScript
    - Prettier : Pour le formatage du code
    - MongoDB for VS Code : Pour gérer les bases de données MongoDB
    - React Developer Tools : Pour le développement React
    - Thunder Client : Pour tester les API REST

- **WebStorm** : Excellent pour le développement JavaScript/TypeScript
  - Intégration native avec Node.js et React
  - Débogage avancé

- **Cursor** : IDE basé sur l'IA, idéal pour la productivité
  - Assistance au code par IA
  - Intégration avec les outils modernes de développement

### Outils de Développement

- **Postman** : Pour tester les API REST
- **MongoDB Compass** : Interface graphique pour MongoDB
- **Docker** : Pour la conteneurisation (optionnel)
- **Git GUI** : GitKraken ou SourceTree pour la gestion visuelle de Git

### Configuration de l'IDE

Pour VS Code, créez un fichier `.vscode/settings.json` avec les configurations suivantes :

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "javascript.updateImportsOnFileMove.enabled": "always",
  "javascript.suggestionActions.enabled": true
}
```

## Installation

### 1. Cloner le Dépôt

```bash
git clone <url-du-dépôt>
cd gps-tracker
```

### 2. Installer les Dépendances du Backend

```bash
npm install
```

### 3. Configurer les Variables d'Environnement

Créez un fichier `.env` dans le répertoire racine avec les variables suivantes :

```
PORT=3000
MONGODB_URI=mongodb://nom-utilisateur:mot-de-passe@hôte:port/gps_tracker?retryWrites=true&w=majority&directConnection=true&ssl=false
JWT_SECRET=votre_clé_secrète_jwt
NODE_ENV=development

# Configurations optionnelles
SMTP_HOST=smtp.exemple.com
SMTP_PORT=587
SMTP_USER=votre_email@exemple.com
SMTP_PASS=votre_mot_de_passe_email

STRIPE_SECRET_KEY=votre_clé_secrète_stripe
STRIPE_WEBHOOK_SECRET=votre_clé_secrète_webhook_stripe
```

Remplacez les valeurs d'exemple par votre configuration réelle.

#### Configuration pour Différents Environnements

##### Développement Local avec MongoDB Atlas
```
PORT=3000
MONGODB_URI=mongodb+srv://nom-utilisateur:mot-de-passe@cluster.mongodb.net/gps_tracker?retryWrites=true&w=majority&appName=NomApp
JWT_SECRET=clé_secrète_dev
NODE_ENV=development
```

##### Développement Local avec MongoDB Direct (pour contourner les problèmes DNS)
```
PORT=3000
MONGODB_URI=mongodb://nom-utilisateur:mot-de-passe@adresse-ip:27017/gps_tracker?retryWrites=true&w=majority&directConnection=true&ssl=false
JWT_SECRET=clé_secrète_dev
NODE_ENV=development
```

##### Mode Sans Base de Données
Le mode sans base de données est activé automatiquement en cas d'échec de connexion à MongoDB. Vous pouvez le forcer en utilisant une URI MongoDB invalide ou en commentant la variable MONGODB_URI.

##### Production
```
PORT=3000
MONGODB_URI=mongodb+srv://nom-utilisateur:mot-de-passe@cluster.mongodb.net/gps_tracker?retryWrites=true&w=majority
JWT_SECRET=clé_secrète_très_longue_et_complexe
NODE_ENV=production
```

### 4. Installer les Dépendances du Client Web

```bash
cd client
npm install
cd ..
```

### 5. Installer les Dépendances de l'Application Mobile

```bash
cd mobile-app
npm install
cd ..
```

## Exécution de l'Application

### Démarrer le Serveur Backend

#### Mode Développement (avec rechargement automatique)

```bash
npm run dev
```

#### Mode Production

```bash
npm start
```

Le serveur démarrera sur le port spécifié dans votre fichier `.env` (par défaut : 3000).

### Démarrer le Client Web

```bash
cd client
npm start
```

Le client web démarrera sur le port 3001 et s'ouvrira automatiquement dans votre navigateur par défaut.

### Démarrer l'Application Mobile

```bash
cd mobile-app
npm start
```

## Branches Disponibles

- **master** : Branche principale de production
- **fix-mongodb-connection** : Branche avec des correctifs pour les problèmes de connexion MongoDB

Pour basculer entre les branches :

```bash
git checkout <nom-de-la-branche>
```

## Dépannage

### Problèmes de Connexion MongoDB

Si vous rencontrez des problèmes de connexion MongoDB, essayez :

1. Vérifier votre connexion réseau
2. Vérifier les identifiants MongoDB dans le fichier `.env`
3. Basculer vers la branche `fix-mongodb-connection` :
   ```bash
   git checkout fix-mongodb-connection
   ```
4. Si vous utilisez MongoDB Atlas, assurez-vous que votre adresse IP est autorisée

### Port Déjà Utilisé

Si vous voyez une erreur comme `Error: listen EADDRINUSE: address already in use :::3000` :

1. Trouvez le processus utilisant le port :
   ```bash
   lsof -i :3000
   ```
2. Terminez le processus :
   ```bash
   kill -9 <PID>
   ```
3. Redémarrez le serveur

## Documentation de l'API

L'API fournit des points d'accès pour :

- Authentification des utilisateurs (connexion/inscription)
- Gestion des appareils
- Suivi de localisation
- Rapports et analyses

### URL de Base

`http://localhost:3000/api`

### Points d'Accès d'Authentification

- `POST /auth/register` - Inscrire un nouvel utilisateur
- `POST /auth/login` - Se connecter et obtenir un jeton JWT

### Points d'Accès des Appareils

- `GET /devices` - Obtenir tous les appareils
- `GET /devices/:id` - Obtenir un appareil par ID
- `POST /devices` - Créer un nouvel appareil
- `PUT /devices/:id` - Mettre à jour un appareil
- `DELETE /devices/:id` - Supprimer un appareil

### Points d'Accès de Localisation

- `GET /locations/:deviceId` - Obtenir les localisations d'un appareil
- `POST /locations` - Ajouter une nouvelle localisation

## Licence

ISC