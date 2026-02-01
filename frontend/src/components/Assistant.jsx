import React, { useState } from 'react';
import { getAISuggestions } from '../services/aiService';
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

    // Appeler le service IA
    try {
      const result = await getAISuggestions(message);
      const botText = result.success 
        ? (result.response || 'Pas de réponse disponible')
        : (result.response || 'Erreur de connexion à l\'assistant');
      
      const botResponse = {
        id: messages.length + 2,
        text: botText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      console.error('❌ Assistant Error:', err);
      const botResponse = {
        id: messages.length + 2,
        text: 'Erreur de connexion à l\'assistant. Vérifiez votre connexion.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    } finally {
      setIsLoading(false);
    }
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
