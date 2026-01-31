# 📦 Guide de Déploiement Complet

## Options de Déploiement

### Option 1 : Vercel (Frontend) + Heroku (Backend) ⭐ Recommandé

#### Étape 1 : Préparer le Frontend pour Vercel

```bash
npm run build
```

#### Étape 2 : Créer un compte sur Vercel
- Visitez https://vercel.com
- Connectez-vous avec GitHub
- Importez votre repository

#### Étape 3 : Configurer les variables d'environnement sur Vercel
```
REACT_APP_API_URL=https://your-heroku-app.herokuapp.com
REACT_APP_ENV=production
```

#### Étape 4 : Déployer le Backend sur Heroku

```bash
# Installer Heroku CLI
# Windows: Télécharger depuis https://devcenter.heroku.com/articles/heroku-cli

# Se connecter
heroku login

# Créer une app
heroku create your-app-name

# Configurer les variables
heroku config:set REACT_APP_API_URL=https://your-app-name.herokuapp.com
heroku config:set REACT_APP_ENV=production
heroku config:set NODE_ENV=production

# Déployer
git push heroku main

# Vérifier les logs
heroku logs --tail
```

---

### Option 2 : Docker + Any VPS

#### Prérequis
- Docker installé
- VPS avec Docker (DigitalOcean, AWS, Linode, etc.)

#### Build Docker
```bash
docker build -t cv-app .
```

#### Run localement
```bash
docker run -p 5000:5000 cv-app
```

#### Déployer sur VPS
```bash
# 1. SSH sur votre VPS
ssh root@your-vps-ip

# 2. Cloner le repo
git clone https://github.com/yourname/cv-application.git
cd cv-application

# 3. Lancer avec docker-compose
docker-compose up -d

# 4. Vérifier
curl http://localhost:5000/api/health
```

---

### Option 3 : Railway.app

#### Étape 1 : Connecter votre GitHub
- Visitez https://railway.app
- Connectez votre GitHub

#### Étape 2 : Créer un nouveau projet
- Cliquez sur "New Project"
- Sélectionnez votre repository

#### Étape 3 : Configurer les variables
```
REACT_APP_API_URL=https://your-railway-app.railway.app
REACT_APP_ENV=production
```

#### Étape 4 : Déployer
- Railway déploiera automatiquement depuis `main`

---

### Option 4 : Render.com

#### Étape 1 : Créer un Web Service
- Visitez https://render.com
- Cliquez sur "New +"
- Sélectionnez "Web Service"
- Connectez votre GitHub

#### Étape 2 : Configuration
```
Build Command: npm install && npm run build
Start Command: npm run start:prod
```

#### Étape 3 : Variables d'environnement
```
REACT_APP_API_URL=https://your-app.onrender.com
REACT_APP_ENV=production
```

---

### Option 5 : AWS (Complet)

#### Frontend avec S3 + CloudFront

```bash
# 1. Build
npm run build

# 2. Créer bucket S3
aws s3 mb s3://my-cv-app

# 3. Upload
aws s3 sync build/ s3://my-cv-app --delete

# 4. Créer CloudFront distribution pour HTTPS
```

#### Backend avec Elastic Beanstalk

```bash
# 1. Installer EB CLI
pip install awsebcli

# 2. Initialiser
eb init -p "Node.js 18 running on 64bit Amazon Linux 2" cv-app

# 3. Déployer
eb create cv-app-env
eb deploy

# 4. Configurer les variables
eb setenv REACT_APP_API_URL=https://cv-app-env.elasticbeanstalk.com
```

---

## ✅ Checklist de Déploiement

- [ ] `.env` configuré avec les bonnes URLs
- [ ] `package.json` à jour
- [ ] `npm run build` fonctionne sans erreurs
- [ ] `src/data/Resume.csv` existe
- [ ] Tests en local réussis
- [ ] Git configuré et commits prêts
- [ ] Domaine custom configuré (optionnel)
- [ ] HTTPS activé
- [ ] Variables d'environnement définies
- [ ] Logs configurés
- [ ] Backup des données CSV

---

## 🔒 Sécurité en Production

### Fichier .env pour production

Ne jamais committer `.env` ! Utiliser les secrets du platform :

```bash
# Heroku
heroku config:set VARIABLE=value

# Vercel
vercel env add REACT_APP_API_URL

# GitHub Secrets (pour CI/CD)
# Settings > Secrets > New repository secret
```

### Headers de sécurité

Ajouter dans `server.js` :
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

### Rate Limiting

```bash
npm install express-rate-limit
```

---

## 📊 Monitoring

### Heroku
```bash
heroku logs --tail
heroku metrics
```

### Railway/Render
- Dashboard intégré
- Alertes email

### Docker
```bash
docker logs cv-app
docker stats cv-app
```

---

## 🔄 CI/CD avec GitHub Actions

Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Install dependencies
      run: npm install
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

---

## 🚨 Troubleshooting

### Erreur "Port déjà utilisé"
```bash
# Trouver l'app qui utilise le port
lsof -i :5000

# Tuer le processus
kill -9 <PID>
```

### API non accessible
```bash
# Vérifier la santé
curl https://your-api.com/api/health

# Vérifier les logs
heroku logs --tail
```

### Build failure
```bash
# Voir les logs détaillés
heroku logs --tail --app your-app-name

# Redéployer après correction
git push heroku main
```

---

## 📞 Support

- **Heroku Support** : https://help.heroku.com
- **Vercel Docs** : https://vercel.com/docs
- **Railway Docs** : https://docs.railway.app
- **Docker Docs** : https://docs.docker.com

---

**Dernière mise à jour** : Janvier 2026
