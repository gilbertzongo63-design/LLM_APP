import React, { useState } from 'react';
import './TemplateSelector.css';

const TemplateSelector = ({ 
  selectedTemplate, 
  selectedColor, 
  selectedFont,
  onSelect,
  onNext,
  resumeData 
}) => {
  const templates = [
    { id: 'modern', name: 'Moderne', icon: '⚡', description: 'Design contemporain et épuré' },
    { id: 'classic', name: 'Classique', icon: '🏛️', description: 'Style traditionnel professionnel' },
    { id: 'creative', name: 'Créatif', icon: '🎨', description: 'Parfait pour les métiers créatifs' },
    { id: 'minimal', name: 'Minimaliste', icon: '⬜', description: 'Simple et efficace' },
    { id: 'executive', name: 'Cadre', icon: '💼', description: 'Élégant pour postes senior' },
    { id: 'tech', name: 'Technique', icon: '💻', description: 'Idéal pour développeurs' }
  ];

  const colorSchemes = [
    { id: 'blue', name: 'Bleu', color: '#3498db', textColor: '#ffffff' },
    { id: 'green', name: 'Vert', color: '#27ae60', textColor: '#ffffff' },
    { id: 'purple', name: 'Violet', color: '#9b59b6', textColor: '#ffffff' },
    { id: 'dark', name: 'Sombre', color: '#2c3e50', textColor: '#ffffff' },
    { id: 'red', name: 'Rouge', color: '#e74c3c', textColor: '#ffffff' },
    { id: 'orange', name: 'Orange', color: '#e67e22', textColor: '#ffffff' }
  ];

  const fonts = [
    { id: 'Arial', name: 'Arial', family: 'Arial, sans-serif' },
    { id: 'Georgia', name: 'Georgia', family: 'Georgia, serif' },
    { id: 'Helvetica', name: 'Helvetica', family: 'Helvetica, Arial, sans-serif' },
    { id: 'Times', name: 'Times New Roman', family: 'Times New Roman, serif' },
    { id: 'Calibri', name: 'Calibri', family: 'Calibri, sans-serif' },
    { id: 'Roboto', name: 'Roboto', family: 'Roboto, sans-serif' }
  ];

  const [activeTab, setActiveTab] = useState('templates');
  const [localTemplate, setLocalTemplate] = useState(selectedTemplate);
  const [localColor, setLocalColor] = useState(selectedColor);
  const [localFont, setLocalFont] = useState(selectedFont);

  const handleApply = () => {
    onSelect(localTemplate, localColor, localFont);
    if (onNext) {
      onNext();
    }
  };

//   const previewData = {
//     ...resumeData,
//     template: localTemplate,
//     colorScheme: localColor,
//     font: localFont
//   };

  return (
    <div className="template-selector">
      <div className="selector-container">
        {/* Tabs */}
        <div className="selector-tabs">
          <button 
            className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            🎨 Modèles
          </button>
          <button 
            className={`tab-btn ${activeTab === 'colors' ? 'active' : ''}`}
            onClick={() => setActiveTab('colors')}
          >
            🎨 Couleurs
          </button>
          <button 
            className={`tab-btn ${activeTab === 'fonts' ? 'active' : ''}`}
            onClick={() => setActiveTab('fonts')}
          >
            🔤 Polices
          </button>
        </div>

        {/* Content */}
        <div className="selector-content">
          {activeTab === 'templates' && (
            <div className="templates-grid">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className={`template-card ${localTemplate === template.id ? 'selected' : ''}`}
                  onClick={() => setLocalTemplate(template.id)}
                >
                  <div className="template-icon">{template.icon}</div>
                  <div className="template-info">
                    <h4>{template.name}</h4>
                    <p>{template.description}</p>
                  </div>
                  {localTemplate === template.id && (
                    <div className="selected-badge">✓</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="colors-grid">
              {colorSchemes.map((color) => (
                <div 
                  key={color.id}
                  className={`color-card ${localColor === color.id ? 'selected' : ''}`}
                  onClick={() => setLocalColor(color.id)}
                >
                  <div 
                    className="color-preview"
                    style={{ backgroundColor: color.color }}
                  ></div>
                  <div className="color-info">
                    <h4>{color.name}</h4>
                    <div className="color-code">{color.color}</div>
                  </div>
                  {localColor === color.id && (
                    <div className="selected-badge">✓</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'fonts' && (
            <div className="fonts-list">
              {fonts.map((font) => (
                <div 
                  key={font.id}
                  className={`font-item ${localFont === font.id ? 'selected' : ''}`}
                  onClick={() => setLocalFont(font.id)}
                  style={{ fontFamily: font.family }}
                >
                  <div className="font-preview">
                    <div className="font-name">{font.name}</div>
                    <div className="font-sample">
                      Aa Bb Cc 123
                    </div>
                  </div>
                  {localFont === font.id && (
                    <div className="selected-badge">✓</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="preview-section">
          <h3>Aperçu en direct</h3>
          <div className="live-preview">
            <div className="preview-header" style={{ 
              backgroundColor: colorSchemes.find(c => c.id === localColor)?.color || '#3498db',
              color: colorSchemes.find(c => c.id === localColor)?.textColor || '#ffffff'
            }}>
              <div className="preview-title" style={{ fontFamily: fonts.find(f => f.id === localFont)?.family }}>
                {resumeData.fullName || 'Votre nom'}
              </div>
              <div className="preview-subtitle">
                {resumeData.title || 'Titre du poste'}
              </div>
            </div>
            <div className="preview-body">
              <div className="preview-section">
                <h4>Contact</h4>
                <p>{resumeData.email || 'email@exemple.com'}</p>
                <p>{resumeData.phone || '+33 1 23 45 67 89'}</p>
              </div>
              <div className="preview-section">
                <h4>Profil</h4>
                <p>{resumeData.summary || 'Résumé professionnel...'}</p>
              </div>
            </div>
          </div>
          
          <div className="template-info">
            <p><strong>Modèle :</strong> {templates.find(t => t.id === localTemplate)?.name}</p>
            <p><strong>Couleur :</strong> {colorSchemes.find(c => c.id === localColor)?.name}</p>
            <p><strong>Police :</strong> {fonts.find(f => f.id === localFont)?.name}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="selector-actions">
          <button 
            className="btn-apply"
            onClick={handleApply}
            disabled={!localTemplate || !localColor || !localFont}
          >
            ✅ Appliquer ce design
          </button>
          <button 
            className="btn-skip"
            onClick={() => {
              onSelect('modern', 'blue', 'Arial');
              if (onNext) onNext();
            }}
          >
            Passer cette étape
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;