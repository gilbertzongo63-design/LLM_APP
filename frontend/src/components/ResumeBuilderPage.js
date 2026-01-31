import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ResumePreview from './ResumePreview';
import ExportButton from './ExportButton'; // Ajouter cet import
import './ResumeBuilderPage.css';

const ResumeBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const previewRef = useRef(null); // Ajouter cette ref
  
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState({
    title: '',
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    category: 'HR',
    template: 'modern',
    colorScheme: 'blue',
    font: 'Arial'
  });
  
  const [previewMode, setPreviewMode] = useState('desktop');

  useEffect(() => {
    if (id) {
      const savedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
      const existingResume = savedResumes.find(r => r.id === parseInt(id));
      if (existingResume) {
        setResumeData(existingResume);
      }
    }
  }, [id]);

  // eslint-disable-next-line no-unused-vars
  const handleFormChange = (newData) => {
    setResumeData(prev => ({ ...prev, ...newData }));
  };

  // eslint-disable-next-line no-unused-vars
  const handleTemplateSelect = (template, color, font) => {
    setResumeData(prev => ({
      ...prev,
      template,
      colorScheme: color,
      font
    }));
  };

  const handleSave = () => {
    const savedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    const resumeToSave = {
      id: id || Date.now(),
      ...resumeData,
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    
    if (id) {
      const index = savedResumes.findIndex(r => r.id === parseInt(id));
      if (index !== -1) {
        savedResumes[index] = resumeToSave;
      }
    } else {
      savedResumes.push(resumeToSave);
    }
    
    localStorage.setItem('resumes', JSON.stringify(savedResumes));
    alert(id ? 'CV mis à jour avec succès !' : 'CV créé avec succès !');
    navigate('/');
  };

  // eslint-disable-next-line no-unused-vars
  const steps = [
    { number: 1, title: 'Informations', description: 'Remplissez vos informations' },
    { number: 2, title: 'Design', description: 'Choisissez un modèle' },
    { number: 3, title: 'Aperçu', description: 'Visualisez et exportez' }
  ];

  return (
    <div className="resume-builder-page">
      {/* ... (le reste du code reste inchangé jusqu'à l'étape 3) ... */}

      {currentStep === 3 && (
        <div className="step-content">
          <div className="step-header">
            <h2>👁️ Aperçu final</h2>
            <p>Visualisez votre CV et exportez-le</p>
          </div>
          
          <div className="preview-controls">
            <div className="view-mode-selector">
              <button 
                className={`mode-btn ${previewMode === 'desktop' ? 'active' : ''}`}
                onClick={() => setPreviewMode('desktop')}
              >
                🖥️ Bureau
              </button>
              <button 
                className={`mode-btn ${previewMode === 'mobile' ? 'active' : ''}`}
                onClick={() => setPreviewMode('mobile')}
              >
                📱 Mobile
              </button>
              <button 
                className={`mode-btn ${previewMode === 'print' ? 'active' : ''}`}
                onClick={() => setPreviewMode('print')}
              >
                🖨️ Impression
              </button>
            </div>
            
            <div className="export-section">
              <ExportButton 
                elementId="resume-preview"
                resumeData={resumeData}
                filename={`CV-${resumeData.fullName || 'MonCV'}`.replace(/\s+/g, '-')}
                onExportStart={(format) => console.log(`Début export ${format}`)}
                onExportComplete={(result) => console.log('Export réussi:', result)}
                onExportError={(error) => console.error('Export échoué:', error)}
              />
            </div>
          </div>
          
          <div className="preview-container">
            {/* ID ajouté ici pour l'export */}
            <div id="resume-preview" className={`preview-wrapper ${previewMode}`}>
              <ResumePreview 
                ref={previewRef}
                data={resumeData}
                mode={previewMode}
              />
            </div>
          </div>
          
          <div className="export-tips">
            <h4>💡 Conseils pour l'export :</h4>
            <div className="tips-grid">
              <div className="tip">
                <div className="tip-icon">📄</div>
                <div className="tip-content">
                  <h5>PDF Haute Qualité</h5>
                  <p>Idéal pour l'envoi par email</p>
                </div>
              </div>
              <div className="tip">
                <div className="tip-icon">🖨️</div>
                <div className="tip-content">
                  <h5>PDF Structuré</h5>
                  <p>Optimisé pour l'impression</p>
                </div>
              </div>
              <div className="tip">
                <div className="tip-icon">📝</div>
                <div className="tip-content">
                  <h5>Document Word</h5>
                  <p>Pour modification ultérieure</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="final-actions">
            <button 
              className="action-btn edit-btn"
              onClick={() => setCurrentStep(1)}
            >
              ✏️ Modifier les informations
            </button>
            <button 
              className="action-btn design-btn"
              onClick={() => setCurrentStep(2)}
            >
              🎨 Modifier le design
            </button>
            <button 
              className="action-btn final-save-btn"
              onClick={handleSave}
            >
              ✅ Finaliser et sauvegarder
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilderPage;