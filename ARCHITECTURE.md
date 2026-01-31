# 🏗️ Architecture du Projet

## Vue d'ensemble

```
┌─────────────────────────────────────────────┐
│         CLIENT (React Frontend)              │
│  - React 18.2.0                             │
│  - React Router v6                          │
│  - HTML2Canvas + jsPDF                      │
└────────────┬────────────────────────────────┘
             │ HTTP/REST
             ↓
┌─────────────────────────────────────────────┐
│      API SERVER (Express Backend)            │
│  - Node.js / Express 4.18                   │
│  - CSV Parser                               │
│  - CORS Enabled                             │
└────────────┬────────────────────────────────┘
             │ File System
             ↓
┌─────────────────────────────────────────────┐
│      DATA STORAGE                            │
│  - Resume.csv (local)                       │
│  - localStorage (browser)                   │
└─────────────────────────────────────────────┘
```

## Structure des Dossiers

```
cv-application/
├── public/                          # Fichiers publics statiques
│   ├── index.html                  # Point d'entrée HTML
│   ├── favicon.ico
│   └── manifest.json               # PWA manifest
│
├── src/                            # Code source React
│   ├── components/                 # Composants React
│   │   ├── Assistant.jsx          # Chat assistant IA
│   │   ├── Assistant.css
│   │   ├── CreateResumeForm.js    # Formulaire création CV
│   │   ├── CreateResumeForm.css
│   │   ├── ResumeBuilderPage.js   # Page builder principal (3 étapes)
│   │   ├── ResumeBuilderPage.css
│   │   ├── ResumePreview.js       # Aperçu du CV
│   │   ├── ResumePreview.css
│   │   ├── TemplateSelector.js    # Sélecteur modèles
│   │   ├── TemplateSelector.css
│   │   ├── CoverLetterBuilder.js  # Générateur lettres
│   │   ├── CoverLetterBuilder.css
│   │   ├── ExportButton.js        # Bouton export PDF
│   │   ├── ExportButton.css
│   │   └── ...autres composants
│   │
│   ├── utils/                     # Utilitaires
│   │   ├── parseResumes.js        # Parser CSV
│   │   └── PdfExportService.js    # Service export PDF
│   │
│   ├── data/                      # Données
│   │   └── Resume.csv             # Base données CVs
│   │
│   ├── App.js                     # Composant principal
│   ├── App.css                    # Styles globaux
│   ├── index.js                   # Point d'entrée React
│   ├── index.css                  # Styles globaux index
│   └── .env                       # Variables environnement
│
├── server.js                      # Serveur Express
├── package.json                   # Dépendances
├── Dockerfile                     # Configuration Docker
├── docker-compose.yml             # Orchestration Docker
├── Procfile                       # Configuration Heroku
├── README.md                      # Documentation
├── QUICKSTART.md                  # Guide démarrage rapide
└── DEPLOYMENT.md                  # Guide déploiement
```

## Flux de Données

### 1. Chargement initial des CVs

```
App.js (useEffect)
    ↓
loadResumes()
    ↓
fetch('/api/resumes')
    ↓
server.js → CSV Parser
    ↓
Résumé processé
    ↓
setResumes() & setFilteredResumes()
    ↓
Rendu UI
```

### 2. Création d'un nouveau CV

```
CreateResumeForm/ResumeBuilderPage
    ↓
handleSave()
    ↓
Enregistrement localStorage
    ↓
setResumes() (local state)
    ↓
Modal de confirmation
    ↓
Navigation
```

### 3. Export PDF

```
ResumePreview
    ↓
ExportButton onClick
    ↓
html2canvas()
    ↓
jsPDF()
    ↓
download()
    ↓
Fichier sauvegardé
```

## Composants Principaux

### App.js
- **Rôle** : Composant racine
- **État** : resumes, filteredResumes, loading, error
- **Responsabilités** :
  - Chargement des CVs
  - Gestion du filtrage et recherche
  - Routing des pages

### ResumeBuilderPage.js
- **Rôle** : Interface création CV (3 étapes)
- **État** : currentStep, resumeData, previewMode
- **Étapes** :
  1. Remplir informations
  2. Choisir modèle
  3. Aperçu et export

### CreateResumeForm.js
- **Rôle** : Formulaire simple création CV
- **Champs** : Title, Name, Email, Phone, Summary, Skills, etc.
- **Fonction** : onSave callback

### TemplateSelector.js
- **Rôle** : Sélecteur modèles avec aperçu
- **Templates** : Modern, Classic, Creative, Minimal
- **Options** : Couleurs, polices, styles

### Assistant.jsx
- **Rôle** : Chat assistant conversationnel
- **Fonction** : Répondre aux questions sur CV
- **Interaction** : Messages/suggestions

### CoverLetterBuilder.js
- **Rôle** : Créateur lettres de motivation
- **Champs** : Destinataire, entreprise, message
- **Fonction** : onSave callback

## API Endpoints

```
GET /api/resumes
├─ Description: Récupère tous les CVs
├─ Réponse: { success, count, data: [{id, title, summary, ...}] }
└─ Code: 200

GET /api/resumes/:id
├─ Description: Récupère un CV spécifique
├─ Réponse: { success, data: {CSV_ROW} }
└─ Code: 200 | 404

GET /api/health
├─ Description: Vérification santé serveur
├─ Réponse: { status, timestamp }
└─ Code: 200
```

## Base de Données (Resume.csv)

```csv
ID,Category,Resume_str,Resume_html
1,IT,"John Doe Senior Dev...","\<html\>..."
2,HR,"Jane Smith HR Manager...","\<html\>..."
```

### Colonnes
- **ID** : Identifiant unique
- **Category** : IT, HR, Marketing, Finance, Sales
- **Resume_str** : Texte brut du CV
- **Resume_html** : Version HTML du CV

## Stockage

### Local Storage
```javascript
// CVs créés localement
localStorage.getItem('resumes') // [{id, title, ...}]

// Lettres de motivation
localStorage.getItem('coverLetters') // [{id, ...}]
```

### Serveur
```
src/data/Resume.csv → Lecture seule (API)
```

## Technologies

### Frontend
- **React 18.2** - UI Framework
- **React Router v6** - Navigation
- **HTML2Canvas** - Conversion HTML → Canvas
- **jsPDF** - Génération PDF
- **CSS3** - Styling

### Backend
- **Express 4.18** - Web server
- **Node.js 18+** - Runtime
- **csv-parser** - Parsing CSV
- **CORS** - Cross-origin requests

### DevOps
- **Docker** - Containerization
- **docker-compose** - Orchestration
- **Heroku** - PaaS deployment

## Performance

### Optimisations

1. **Code Splitting** : React Router lazy loading
2. **Caching** : localStorage pour CVs locaux
3. **Lazy Load Images** : Modèles templates
4. **Compression** : gzip dans Express
5. **Minification** : npm run build

### Bundle Size
```
build/static/js/main.*.js  ~150KB (gzip)
build/static/css/main.*.css ~80KB (gzip)
```

## Sécurité

### Mesures
- ✅ CORS configuré
- ✅ Validation input côté client
- ✅ Pas de données sensibles en localStorage
- ✅ Pas de requêtes non HTTPS en prod
- ✅ Headers de sécurité (X-Frame-Options, etc.)

### Recommandations
- Valider côté serveur
- Utiliser HTTPS en production
- Chiffrer données sensibles
- Implémenter rate limiting
- Audits de sécurité réguliers

## Scalabilité

### Limites actuelles
- **CVs** : Limité par RAM serveur
- **Utilisateurs** : Pas d'authentification
- **Stockage** : CSV localement

### Pour évoluer
- Ajouter base de données (MongoDB, PostgreSQL)
- Implémenter authentification (JWT, OAuth)
- Utiliser CDN pour assets statiques
- Mettre en place caching (Redis)
- Microservices pour services spécialisés

## Déploiement

### Options
1. **Vercel + Heroku** (Recommandé)
2. **Docker sur VPS**
3. **Railway.app**
4. **AWS Elastic Beanstalk + S3**
5. **DigitalOcean + App Platform**

### Environnements
```
.env.local        → Développement local
.env.development  → Environnement dev
.env.production   → Production
.env.example      → Template
```

## Monitoring

### Logs
- Express : console.log / morgan
- React : Browser DevTools
- Docker : docker logs

### Métriques
- Response time API
- CPU/Memory serveur
- Bundle size
- Erreurs JavaScript

---

**Dernière mise à jour** : Janvier 2026
