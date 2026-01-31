# CV Application - Createur de CV et de Lettre de Motivation

Une application React complète pour gérer, créer et exporter des CV professionnels avec une API backend Express.

## 🚀 Fonctionnalités

-- **📄 Visualisation de CVs** - Parcourez, recherchez et filtrez des CV professionnels
- **🔍 Recherche et Filtrage** - Recherchez par titre, compétences, catégorie
- **✨ Assistant CV** - Assistant conversationnel pour créer des CVs
- **🎨 Modèles Personnalisables** - Plusieurs templates et thèmes de couleurs
- **📧 Lettres de Motivation** - Créateur intégré pour lettres de motivation
- **📤 Export PDF** - Exportez vos CVs en haute qualité
- **💾 Stockage Local** - Sauvegarde automatique avec localStorage
- **📱 Design Responsive** - Fonctionne sur tous les appareils

## 📋 Prérequis

- **Node.js** v14 ou supérieur
- **npm** v6 ou supérieur
- Un fichier `Resume.csv` dans `src/data/`

## 🔧 Installation

### 1. Cloner le projet
```bash
cd cv-application
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration
Créer un fichier `.env` à la racine du projet :
```env
DISABLE_ESLINT_PLUGIN=true
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## 🚀 Démarrage

### Mode Développement

```bash
# Terminal 1 - Serveur Express
npm run server

# Terminal 2 - React App
npm start
```

Ou combiner les deux :
```bash
npm run dev
```

L'application est disponible à `http://localhost:3000`
L'API est disponible à `http://localhost:5000`

### Mode Production
```bash
npm run build
npm run start:prod
```

## 📡 API Endpoints

- `GET /api/resumes` - Récupère tous les CVs
- `GET /api/resumes/:id` - Récupère un CV spécifique
- `GET /api/health` - Vérification de la santé du serveur

## 🚀 Déploiement

### Frontend (Vercel/Netlify)
```bash
npm run build
```

### Backend (Heroku)
```bash
npm install -g heroku-cli
heroku login
heroku create your-app-name
git push heroku main
```

## 🐛 Dépannage

### L'API ne se connecte pas
1. Vérifiez que le serveur est lancé : `npm run server`
2. Vérifiez `REACT_APP_API_URL` dans `.env`
3. Vérifiez que le fichier `src/data/Resume.csv` existe

### Erreurs de dépendances
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Licence

MIT

---

**Version :** 0.1.0

