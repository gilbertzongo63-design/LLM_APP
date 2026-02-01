// frontend/src/config.js
// Configuration centralisée pour l'API

// Production: utilise le backend Render
// Dev: utilise localhost
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://llm-app-1-lsgm.onrender.com' 
    : 'http://localhost:8000');

const API_KEY = process.env.REACT_APP_SERVER_API_KEY || '';

console.log('🔗 API_BASE_URL configured:', API_BASE_URL);
console.log('📌 NODE_ENV:', process.env.NODE_ENV);

export { API_BASE_URL, API_KEY };
