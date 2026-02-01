// frontend/src/services/aiService.js
// Service pour communiquer avec l'assistant IA du backend

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

console.log('🔗 AI Service Backend URL:', BACKEND_URL);

export const getAISuggestions = async (prompt) => {
  try {
    if (!prompt || prompt.trim() === '') {
      throw new Error('Le prompt ne peut pas être vide');
    }

    const response = await fetch(`${BACKEND_URL}/api/assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Erreur de l\'assistant IA');
    }

    return {
      success: true,
      response: data.response,
      suggestions: [
        'Communication et travail d\'équipe',
        'Résolution de problèmes complexes',
        'Gestion de projet et organisation',
        'Maîtrise des outils bureautiques',
        'Adaptabilité et flexibilité',
        'Leadership et mentorat'
      ]
    };
  } catch (error) {
    console.error('❌ Erreur AI Assistant:', error);
    return {
      success: false,
      error: error.message || 'Erreur de connexion à l\'assistant IA',
      response: 'Impossible de contacter l\'assistant. Vérifiez votre connexion et que le backend est disponible.'
    };
  }
};
