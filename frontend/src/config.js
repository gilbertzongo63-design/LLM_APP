// frontend/src/config.js
// Configuration centralisée pour l'API

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_KEY = process.env.REACT_APP_SERVER_API_KEY || '';

console.log('🔗 API_BASE_URL configured:', API_BASE_URL);

export { API_BASE_URL, API_KEY };
