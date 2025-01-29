# Application de Gestion des Messages

Cette application Ionic/Angular permet de gérer des messages avec envoi d'emails et stockage local.

## Fonctionnalités

- Formulaire de contact avec validation
- Envoi d'emails via EmailJS
- Stockage local avec IndexedDB
- Historique des messages
- Vue détaillée des messages
- Support des pièces jointes

## Prérequis

- Node.js (v14 ou supérieur)
- npm (v6 ou supérieur)
- Ionic CLI
- Angular CLI

## Installation

1. Cloner le repository :
```bash
git clone [votre-repo]
cd eval
```

2. Installer les dépendances :
```bash
npm install
```

3. Configuration EmailJS :
- Créer un compte sur [EmailJS](https://www.emailjs.com/)
- Créer un service email
- Créer un template
- Mettre à jour les identifiants dans `src/app/services/email.service.ts`

## Développement

Lancer le serveur de développement :
```bash
ionic serve
```

## Build Production

### Web
```bash
ionic build --prod
```
Les fichiers de build seront générés dans le dossier `www/`

### Android
```bash
ionic capacitor add android
ionic capacitor copy android
ionic capacitor open android
```

### iOS
```bash
ionic capacitor add ios
ionic capacitor copy ios
ionic capacitor open ios
```

## Tests

### Tests unitaires
```bash
ng test
```

### Tests end-to-end
```bash
ng e2e
```

## Structure du Projet

```
src/
├── app/
│   ├── home/
│   │   └── form/           # Composant formulaire
│   └── services/
│       ├── database/       # Service de base de données
│       └── email/          # Service d'email
├── assets/                 # Images et ressources
└── theme/                 # Thème global
```

## Variables d'Environnement

Créer un fichier `.env` à la racine du projet :
```
EMAILJS_SERVICE_ID=votre_service_id
EMAILJS_TEMPLATE_ID=votre_template_id
EMAILJS_PUBLIC_KEY=votre_public_key
```

## Déploiement

1. Build de production :
```bash
npm run build:prod
```

2. Les fichiers de production seront dans le dossier `www/`

3. Déployer sur votre hébergeur préféré (Firebase, Vercel, etc.)

## Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## License

Ce projet est sous licence MIT.
