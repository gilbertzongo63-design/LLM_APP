# 🐛 Guide de Dépannage

## Problèmes Courants et Solutions

### ❌ "Cannot find module 'express'"

**Causes possibles :**
- npm install n'a pas été exécuté
- node_modules supprimé

**Solutions :**
```bash
# Option 1 : Réinstaller
npm install

# Option 2 : Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Option 3 : Vérifier npm cache
npm cache clean --force
npm install
```

---

### ❌ "Port 5000 already in use"

**Cause :** Une application utilise déjà le port

**Solutions :**

**Windows :**
```bash
# Trouver le PID
netstat -ano | findstr :5000

# Tuer le processus
taskkill /PID <PID> /F

# Ou arrêter tous les Node.js
taskkill /IM node.exe /F
```

**Linux/Mac :**
```bash
# Trouver le PID
lsof -i :5000

# Tuer le processus
kill -9 <PID>
```

**Alternative :** Changer le port
```bash
# Dans server.js
const PORT = process.env.PORT || 3001;
```

---

### ❌ "ENOENT: no such file or directory 'Resume.csv'"

**Cause :** Fichier CSV manquant

**Solutions :**

```bash
# Vérifier le fichier existe
ls src/data/Resume.csv

# Si manquant, créer un exemple
echo "ID,Category,Resume_str,Resume_html
1,IT,John Doe,<html>...</html>" > src/data/Resume.csv
```

---

### ❌ "API not responding" / "Cannot GET /api/resumes"

**Causes possibles :**
- Serveur Express n'est pas lancé
- CORS non configuré
- Mauvaise URL API

**Solutions :**

```bash
# 1. Vérifier le serveur
curl http://localhost:5000/api/health

# 2. Vérifier .env
cat .env | grep REACT_APP_API_URL

# 3. Vérifier les logs serveur
npm run server

# 4. Tester manuellelement
curl http://localhost:5000/api/resumes
```

---

### ❌ "npm ERR! code ERESOLVE"

**Cause :** Conflits de dépendances

**Solutions :**
```bash
# Option 1 : Force legacy peer deps
npm install --legacy-peer-deps

# Option 2 : Utiliser yarn
yarn install

# Option 3 : Nettoyer
rm package-lock.json
npm install
```

---

### ❌ "Expected an assignment or function call"

**Cause :** Erreur de syntaxe JavaScript

**Solutions :**

```bash
# 1. Vérifier la console
npm start

# 2. Chercher la ligne d'erreur
# → Fichier et numéro fourni dans l'erreur

# 3. Exemples courants :
# - Manque point-virgule
# - Parenthèse non fermée
# - Guillemets mal fermés
# - Oubli 'return' dans JSX
```

---

### ❌ "Cannot find module '@/components/...'"

**Cause :** Alias ou chemin d'import incorrect

**Solutions :**
```javascript
// ❌ Mauvais
import Component from '@/components/Component'

// ✅ Correct
import Component from './components/Component'
import Component from '../components/Component'
```

---

### ❌ "React is not defined"

**Cause :** Import React manquant

**Solutions :**
```javascript
// Ajouter en haut du fichier
import React from 'react';
```

---

### ❌ "SyntaxError: Unexpected token <"

**Cause :** Importing HTML/CSS comme JavaScript

**Solutions :**
```javascript
// ❌ Mauvais
import styles from './App.css'

// ✅ Correct
import './App.css'  // CSS global
import styles from './App.module.css'  // CSS Module
```

---

### ❌ "TypeError: Cannot read property 'map' of undefined"

**Cause :** Variable undefined

**Solutions :**
```javascript
// ❌ Mauvais
{data.map(item => ...)}  // data peut être undefined

// ✅ Correct
{data && data.map(item => ...)}
{Array.isArray(data) && data.map(item => ...)}
{(data || []).map(item => ...)}
```

---

### ❌ "Uncaught Error: invariant failed: browserHistory requires a DOM"

**Cause :** Problème d'initialisation React

**Solutions :**
```javascript
// Vérifier que index.js contient :
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);

// Vérifier que public/index.html contient :
<div id="root"></div>
```

---

### ❌ "CORS error: No 'Access-Control-Allow-Origin' header"

**Cause :** API n'accepte pas les requêtes cross-origin

**Solutions :**

**Dans server.js (déjà configuré) :**
```javascript
const cors = require('cors');
app.use(cors());
```

**Ou restreindre à certains domaines :**
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

---

### ❌ "PDF export not working" / "Blank PDF"

**Causes possibles :**
- HTML2Canvas ne peut pas capturer les éléments
- Timeouts
- Large images

**Solutions :**

```javascript
// Augmenter le timeout
html2canvas(element, {
  scale: 2,
  useCORS: true,
  timeout: 10000,  // 10 secondes
  backgroundColor: '#ffffff'
})

// Ajouter data attributes
<div data-html2canvas-ignore="true">
  // Ne sera pas captué
</div>
```

---

### ❌ "Build fails with 'React is not defined'"

**Cause :** Version React / JSX incompatible

**Solutions :**

```bash
# Vérifier package.json
npm list react

# Mettre à jour
npm install react@latest react-dom@latest

# Ou utiliser new JSX transform
# (déjà inclus dans create-react-app)
```

---

### ❌ "Cannot GET /" en production

**Cause :** Routes React ne sont pas servies

**Solutions :**

**Dans server.js (déjà configuré) :**
```javascript
// Servir React app pour toutes les routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
```

---

### ❌ "Error: listen EADDRINUSE: address already in use"

**Même problème que port déjà utilisé**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

---

### ❌ ".env not being read"

**Cause :** Variables d'environnement non chargées

**Solutions :**

```bash
# 1. Vérifier le fichier existe
ls .env

# 2. Format correct (sans espace)
REACT_APP_API_URL=http://localhost:5000

# 3. Relancer l'app (React requiert redémarrage)
npm start

# 4. Vérifier dans navigateur (F12 > Console)
console.log(process.env.REACT_APP_API_URL)
```

---

### ❌ "Localhost not accessible from other PC"

**Cause :** Localhost = 127.0.0.1 (machine locale seulement)

**Solutions :**

```bash
# Utiliser l'IP de la machine
# Windows
ipconfig

# Linux/Mac
ifconfig

# Puis accéder depuis autre PC
http://192.168.1.100:3000
```

---

### ❌ "Docker build fails"

**Solutions :**

```bash
# 1. Vérifier Dockerfile
docker build -t cv-app . --verbose

# 2. Nettoyer
docker system prune -a

# 3. Construire sans cache
docker build -t cv-app . --no-cache

# 4. Vérifier les logs
docker build -t cv-app .
docker run -it cv-app /bin/sh
```

---

### ❌ "Heroku deployment fails"

**Solutions :**

```bash
# 1. Vérifier les logs
heroku logs --tail --app your-app

# 2. Vérifier Procfile existe
cat Procfile

# 3. Vérifier .gitignore (node_modules y est)
cat .gitignore

# 4. Déployer manuellement
git push heroku main

# 5. Vérifier les variables
heroku config --app your-app
```

---

## 📋 Checklist de Dépannage

- [ ] Node.js v14+ installé ? → `node --version`
- [ ] npm installé ? → `npm --version`
- [ ] npm install exécuté ? → `npm list | head`
- [ ] .env existe ? → `ls .env`
- [ ] Resume.csv existe ? → `ls src/data/Resume.csv`
- [ ] Ports libres ? → `netstat -ano | findstr :5000` (Windows)
- [ ] Serveur lancé ? → `npm run server`
- [ ] App lancée ? → `npm start`
- [ ] Console navigateur ? → F12
- [ ] Logs serveur ? → Terminal npm run server

---

## 🆘 Si rien ne marche

```bash
# Nuke everything and restart
rm -rf node_modules package-lock.json build
npm install
npm start

# Autre terminal
npm run server
```

---

## 📞 Informations Utiles

**Fichiers importants à vérifier :**
- `package.json` - Dépendances
- `.env` - Variables d'environnement
- `server.js` - Configuration API
- `src/App.js` - Configuration React
- `public/index.html` - HTML template

**Commandes utiles :**
```bash
npm start              # Démarrer React
npm run server         # Démarrer API
npm run dev            # Les deux
npm run build          # Build production
npm test               # Tests
npm list               # Lister dépendances
```

---

**Dernière mise à jour** : Janvier 2026

**Besoin d'aide ?** Vérifiez les logs dans la console ! 🔍
