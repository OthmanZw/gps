# Guide d'Installation du GPS Tracker

Ce guide détaille les étapes d'installation du système GPS Tracker sur différentes plateformes.

## Prérequis Généraux

- Node.js v22.x ou supérieur
- npm ou yarn
- Git
- MongoDB (Atlas ou serveur local)

## Installation sur macOS

### 1. Installation des Outils Requis

```bash
# Installer Homebrew si ce n'est pas déjà fait
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer Node.js et npm
brew install node

# Vérifier l'installation
node --version  # Doit afficher v22.x ou supérieur
npm --version

# Installer Git si nécessaire
brew install git
```

### 2. Cloner le Projet

```bash
# Cloner le dépôt
git clone https://github.com/OthmanZw/gps.git
cd gps

# Installer les dépendances du backend
npm install

# Installer les dépendances du frontend
cd client
npm install
cd ..
```

### 3. Configuration

```bash
# Créer un fichier .env à la racine du projet
touch .env

# Éditer le fichier .env avec vos informations
echo "PORT=3000
MONGODB_URI=mongodb+srv://votre_utilisateur:votre_mot_de_passe@votre_cluster.mongodb.net/gps_tracker
JWT_SECRET=votre_secret_jwt" > .env
```

### 4. Démarrage du Projet

```bash
# Démarrer le backend (depuis la racine du projet)
npm run dev

# Dans un autre terminal, démarrer le frontend
cd client
npm run dev
```

### 5. Résolution des Problèmes Courants sur macOS

#### Problème de Port Déjà Utilisé
```bash
# Trouver le processus utilisant le port 3000
lsof -i :3000

# Tuer le processus
kill -9 <PID>
```

#### Problème de DNS
Si vous rencontrez des problèmes de connexion à MongoDB, vous pouvez configurer manuellement les serveurs DNS de Google :

```bash
# Ajouter les serveurs DNS de Google à votre configuration réseau
networksetup -setdnsservers Wi-Fi 8.8.8.8 8.8.4.4
```

## Installation sur Windows

### 1. Installation des Outils Requis

1. **Installer Node.js** :
   - Télécharger l'installateur depuis [nodejs.org](https://nodejs.org/)
   - Exécuter l'installateur et suivre les instructions
   - Vérifier l'installation en ouvrant PowerShell ou CMD :
     ```
     node --version
     npm --version
     ```

2. **Installer Git** :
   - Télécharger l'installateur depuis [git-scm.com](https://git-scm.com/download/win)
   - Exécuter l'installateur avec les options par défaut

### 2. Cloner le Projet

```powershell
# Cloner le dépôt
git clone https://github.com/OthmanZw/gps.git
cd gps

# Installer les dépendances du backend
npm install

# Installer les dépendances du frontend
cd client
npm install
cd ..
```

### 3. Configuration

1. Créer un fichier `.env` à la racine du projet
2. Ajouter les variables d'environnement suivantes :
```
PORT=3000
MONGODB_URI=mongodb+srv://votre_utilisateur:votre_mot_de_passe@votre_cluster.mongodb.net/gps_tracker
JWT_SECRET=votre_secret_jwt
```

### 4. Démarrage du Projet

```powershell
# Démarrer le backend (depuis la racine du projet)
npm run dev

# Dans un autre terminal, démarrer le frontend
cd client
npm run dev
```

### 5. Résolution des Problèmes Courants sur Windows

#### Problème de Port Déjà Utilisé
```powershell
# Trouver le processus utilisant le port 3000
netstat -ano | findstr :3000

# Tuer le processus
taskkill /PID <PID> /F
```

#### Problème de DNS
Si vous rencontrez des problèmes de connexion à MongoDB, vous pouvez configurer manuellement les serveurs DNS de Google :

1. Ouvrir le Panneau de configuration > Réseau et Internet > Connexions réseau
2. Clic droit sur votre connexion > Propriétés
3. Sélectionner "Protocole Internet version 4 (TCP/IPv4)" > Propriétés
4. Sélectionner "Utiliser les adresses de serveur DNS suivantes"
5. Serveur DNS préféré : 8.8.8.8
6. Serveur DNS auxiliaire : 8.8.4.4

## Installation avec Docker (Toutes Plateformes)

Si vous préférez utiliser Docker, voici les étapes à suivre :

### 1. Installer Docker

- **macOS** : Télécharger et installer [Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Windows** : Télécharger et installer [Docker Desktop](https://www.docker.com/products/docker-desktop)

### 2. Cloner le Projet

```bash
git clone https://github.com/OthmanZw/gps.git
cd gps
```

### 3. Créer un fichier docker-compose.yml

```yaml
version: '3'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - MONGODB_URI=mongodb+srv://votre_utilisateur:votre_mot_de_passe@votre_cluster.mongodb.net/gps_tracker
      - JWT_SECRET=votre_secret_jwt
    volumes:
      - ./:/app
      - /app/node_modules

  frontend:
    build: ./client
    ports:
      - "5173:5173"
    volumes:
      - ./client:/app
      - /app/node_modules
    depends_on:
      - backend
```

### 4. Créer un Dockerfile à la racine du projet

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
```

### 5. Créer un Dockerfile dans le dossier client

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
```

### 6. Démarrer les Conteneurs

```bash
docker-compose up
```

## Scripts Utiles

Voici quelques scripts utiles que vous pouvez ajouter à votre fichier `package.json` :

```json
"scripts": {
  "dev": "nodemon src/index.js",
  "start": "node src/index.js",
  "test": "jest",
  "lint": "eslint .",
  "client": "cd client && npm run dev",
  "dev:all": "concurrently \"npm run dev\" \"npm run client\""
}
```

Pour utiliser le script `dev:all`, vous devrez installer `concurrently` :

```bash
npm install --save-dev concurrently
```

Cela vous permettra de démarrer le backend et le frontend avec une seule commande :

```bash
npm run dev:all
``` 