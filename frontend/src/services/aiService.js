// frontend/src/services/aiService.js
// Service pour communiquer avec l'assistant IA du backend

const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

console.log('🔗 AI Service Backend URL:', BACKEND_URL);

// Fallback suggestions intelligentes
const getFallbackResponse = (prompt) => {
  const msg = prompt.toLowerCase();
  
  if (msg.includes('créer') || msg.includes('nouveau')) {
    return 'Pour créer un nouveau CV, utilisez le bouton "Créer un nouveau CV" dans le menu principal. Vous pourrez alors remplir vos informations personnelles et choisir un modèle parmi les modèles disponibles.';
  }
  if (msg.includes('compétence') || msg.includes('skill')) {
    return 'Les compétences clés à ajouter dépendent de votre domaine:\n• Pour l\'IT: JavaScript, Python, React, SQL\n• Pour HR: Recrutement, SIRH, Paie\n• Pour Marketing: SEO, Social Media, Analytics\n• Pour Finance: Excel, SAP, Analyse financière';
  }
  if (msg.includes('exporter') || msg.includes('export') || msg.includes('pdf')) {
    return 'Pour exporter votre CV:\n1. Remplissez le formulaire de création\n2. Cliquez sur "Exporter le CV"\n3. Choisissez le format (PDF, DOCX, etc.)';
  }
  if (msg.includes('modèle') || msg.includes('template')) {
    return 'Nous proposons 4 modèles de CV:\n• Moderne: Design contemporain pour tous les secteurs\n• Classique: Style professionnel traditionnel\n• Créatif: Parfait pour les métiers créatifs\n• Minimaliste: Épuré et sans fioritures';
  }
  if (msg.includes('lettre') || msg.includes('motivation')) {
    return 'Pour créer une lettre de motivation, utilisez l\'onglet "Créer une Lettre" dans le menu. Vous pourrez personnaliser votre lettre selon le poste visé.';
  }
  if (msg.includes('aide') || msg.includes('help') || msg.includes('comment')) {
    return 'Comment puis-je vous aider?\n• Créer un CV ✨\n• Générer une lettre de motivation 📧\n• Consulter les modèles 🎨\n• Exporter en PDF 📥\n• Trouver des compétences pertinentes 💼';
  }
  
  return 'Je suis l\'assistant CV. Comment puis-je vous aider? Vous pouvez me poser des questions sur la création de CV, les compétences à ajouter, les modèles disponibles, ou comment exporter votre CV.';
};

export const getAISuggestions = async (prompt) => {
  try {
    if (!prompt || prompt.trim() === '') {
      throw new Error('Le prompt ne peut pas être vide');
    }

    // Try to connect with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(`${BACKEND_URL}/api/assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

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
    
    // Use intelligent fallback instead of generic error
    const fallbackResponse = getFallbackResponse(prompt);
    
    return {
      success: true,  // Return true with fallback response
      response: fallbackResponse,
      fromFallback: true
    };
  }
};
