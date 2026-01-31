import React, { useState } from 'react';
import './Assistant.css';

const Assistant = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Bonjour! Je suis votre assistant CV. Comment puis-je vous aider?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestions = [
    'Comment créer un CV?',
    'Quelles sont les meilleures compétences à ajouter?',
    'Comment exporter mon CV?',
    'Voir les modèles disponibles'
  ];

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Ajouter le message de l'utilisateur
    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Appeler l'API backend (/api/assistant)
    try {
      const resp = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: message })
      });
      const json = await resp.json();
      const botText = json && json.success ? (json.response || 'Pas de réponse') : (json.error || 'Erreur');
      const botResponse = {
        id: messages.length + 2,
        text: botText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      const botResponse = {
        id: messages.length + 2,
        text: 'Erreur de connexion à l\'assistant local.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      console.error('Assistant API error', err);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('créer') || msg.includes('nouveau')) {
      return 'Pour créer un nouveau CV, cliquez sur le bouton "Créer un CV" dans le menu principal. Vous pourrez alors remplir vos informations personnelles et choisir un modèle.';
    }
    if (msg.includes('compétence') || msg.includes('skill')) {
      return 'Les compétences clés à ajouter dépendent de votre domaine. Pour l\'IT: JavaScript, Python, React. Pour HR: Recrutement, Paie. Pour Marketing: SEO, Social Media, Analytics.';
    }
    if (msg.includes('exporter') || msg.includes('export')) {
      return 'Vous pouvez exporter votre CV en PDF en cliquant sur le bouton "Exporter" dans l\'aperçu final. Le CV sera téléchargé sur votre ordinateur.';
    }
    if (msg.includes('modèle') || msg.includes('template')) {
      return 'Nous avons plusieurs modèles disponibles: Moderne, Classique, Créatif et Minimaliste. Chacun peut être personnalisé avec des couleurs et des polices différentes.';
    }
    
    return 'Je ne suis pas sûr de comprendre votre question. Pouvez-vous reformuler? Je peux vous aider avec: créer un CV, ajouter des compétences, exporter, ou choisir un modèle.';
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  if (!isOpen) return null;

  return (
    <div className="assistant-overlay">
      <div className="assistant-container">
        <div className="assistant-header">
          <h3>🤖 Assistant CV</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="messages-container">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              <div className="message-content">
                {msg.text}
              </div>
              <span className="message-time">
                {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="message bot">
              <div className="message-content typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="suggestions">
            <p>Suggestions:</p>
            <div className="suggestions-grid">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="input-area">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            placeholder="Posez une question..."
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            disabled={isLoading || !inputValue.trim()}
            className="send-btn"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
