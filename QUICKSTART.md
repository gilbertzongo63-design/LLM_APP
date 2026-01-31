# 🚀 Guide de Démarrage Rapide

## Installation en 5 minutes

### 1. Installer les dépendances
```bash
npm install
```

### 2. Lancer le serveur API (Terminal 1)
```bash
npm run server
```

Vous devriez voir:
```
Server running on http://localhost:5000
API available at http://localhost:5000/api/resumes
```

### 3. Lancer React App (Terminal 2)
```bash
npm start
```

L'application s'ouvrira automatiquement à `http://localhost:3000`

## ✅ Vérification

1. **L'API répond** : Visitez `http://localhost:5000/api/health`
   - Vous devriez voir : `{"status":"ok","timestamp":"..."}`

2. **Les CVs se chargent** : Allez à `http://localhost:3000`
   - Vous devriez voir une liste de CVs

3. **L'Assistant fonctionne** : Cliquez sur le 🤖 en bas à droite

## 🐛 Si ça ne marche pas

### L'API n'est pas accessible

```bash
# Vérifier que le serveur tourne
curl http://localhost:5000/api/health
```

Si ça ne marche pas :
```bash
# Arrêter tous les processus Node
taskkill /IM node.exe /F

# Réinstaller les dépendances
npm install

# Relancer
npm run server
```

### Les CVs ne se chargent pas

1. Vérifiez que `src/data/Resume.csv` existe
2. Vérifiez que `.env` contient `REACT_APP_API_URL=http://localhost:5000`
3. Ouvrez la console du navigateur (F12) pour les erreurs

### "Cannot find module 'express'"

```bash
npm install express cors csv-parser
```

## 🎯 Première utilisation

1. **Parcourir les CVs existants**
   - Utilisez les filtres pour chercher
   - Cliquez sur un CV pour voir les détails

2. **Créer votre propre CV**
   - Cliquez sur "✨ Assistant CV"
   - Remplissez vos informations
   - Choisissez un modèle
   - Exportez en PDF

3. **Créer une lettre de motivation**
   - Allez à "📧 Lettres"
   - Remplissez le formulaire
   - Sauvegardez

## 📁 Fichiers importants

- `.env` - Configuration (créez-le en copiant `.env.example`)
- `server.js` - API Express
- `src/App.js` - App principale
- `src/data/Resume.csv` - Données des CVs

## 🌐 Accès depuis un autre PC

### Sur le même réseau local

Modifiez `.env` pour utiliser votre IP :
```
REACT_APP_API_URL=http://192.168.1.100:5000
```

Lancez le serveur en écoutant sur tous les interfaces :
```bash
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000
```

## 📝 Notes

- Les CVs créés sont sauvegardés dans `localStorage` (navigateur)
- Les données du CSV ne peuvent pas être modifiées (lecture seule)
- Pour ajouter des CVs, modifiez `src/data/Resume.csv`

## 🆘 Support

1. Vérifiez le README.md pour plus de détails
2. Consultez la console du navigateur (F12) pour les erreurs
3. Vérifiez que Node.js v14+ est installé : `node --version`

---

Besoin d'aide ? Vérifiez les logs dans la console !
