# Football Manager

Application de gestion de football permettant de gérer les équipes, joueurs, matchs, compétitions et arbitres.

## Fonctionnalités

- Gestion des équipes
- Gestion des joueurs
- Programmation et suivi des matchs
- Gestion des compétitions
- Gestion des arbitres
- Interface d'administration
- Statistiques en temps réel

## Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (v14 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le repository :
```bash
git clone [url-du-repo]
cd football-manager
```

2. Installer les dépendances :
```bash
npm install
# ou
yarn install
```

3. Configurer la base de données :
- Créer une base de données PostgreSQL nommée `football_manager`
- Copier le fichier `.env.example` en `.env` et ajuster les variables d'environnement

4. Initialiser la base de données :
```bash
npx prisma migrate dev
```

## Démarrage

1. Démarrer le serveur de développement :
```bash
npm run dev
# ou
yarn dev
```

2. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Structure du projet

```
football-manager/
├── src/
│   ├── app/              # Pages de l'application
│   ├── components/       # Composants réutilisables
│   ├── lib/             # Utilitaires et configurations
│   └── styles/          # Styles globaux
├── prisma/              # Schéma et migrations de la base de données
├── public/              # Fichiers statiques
└── ...
```

## Technologies utilisées

- Next.js 13+ (App Router)
- TypeScript
- Prisma (ORM)
- PostgreSQL
- Tailwind CSS
- NextAuth.js

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/ma-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Push vers la branche (`git push origin feature/ma-fonctionnalite`)
5. Ouvrir une Pull Request

## Licence

MIT 