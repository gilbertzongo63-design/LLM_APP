import React from 'react';
import { useParams } from 'react-router-dom';
import './ResumeViewer.css';

const ResumeViewer = () => {
  const { id } = useParams();
  
  // Définir colors AVANT de l'utiliser
  const colors = {
    blue: { primary: '#3498db', secondary: '#2980b9', light: '#ecf0f1' },
    green: { primary: '#27ae60', secondary: '#219653', light: '#d5f4e6' },
    purple: { primary: '#9b59b6', secondary: '#8e44ad', light: '#f4ecf7' }
  };
  
  // Données d'exemple (à remplacer par vos données réelles)
  const resumeData = {
    id: id || '1',
    title: 'CV Professionnel',
    fullName: 'Marie Martin',
    email: 'marie.martin@example.com',
    phone: '+33 1 23 45 67 89',
    summary: 'Développeuse full-stack avec 4 ans d\'expérience dans le développement web. Passionnée par les technologies modernes et les bonnes pratiques de code.',
    experience: '4 ans d\'expérience',
    education: 'Master en Informatique - École Polytechnique',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'AWS'],
    category: 'IT',
    template: 'modern',
    colorScheme: 'blue',
    font: 'Arial',
    created: '2024-01-15'
  };

  // Utiliser colors maintenant qu'il est défini
  const selectedColors = colors[resumeData.colorScheme] || colors.blue;

  return (
    <div className="resume-viewer">
      <div className="viewer-header">
        <h1>👁️ Visualisateur de CV</h1>
        <p>Visualisation du CV #{id}</p>
      </div>

      <div className="viewer-container">
        {/* Aperçu du CV */}
        <div className="preview-section">
          <h2>Aperçu du CV</h2>
          <div className="cv-preview" style={{ fontFamily: resumeData.font }}>
            <div className="cv-header" style={{ backgroundColor: selectedColors.primary, color: 'white' }}>
              <h2>{resumeData.fullName}</h2>
              <p className="cv-subtitle">{resumeData.title}</p>
              <div className="cv-contact">
                {resumeData.email && <span>📧 {resumeData.email}</span>}
                {resumeData.phone && <span>📱 {resumeData.phone}</span>}
              </div>
            </div>
            
            <div className="cv-body">
              <div className="cv-left">
                {resumeData.summary && (
                  <div className="cv-section">
                    <h3 style={{ color: selectedColors.primary }}>Profil</h3>
                    <p>{resumeData.summary}</p>
                  </div>
                )}
                
                {resumeData.skills && resumeData.skills.length > 0 && (
                  <div className="cv-section">
                    <h3 style={{ color: selectedColors.primary }}>Compétences</h3>
                    <div className="skills-container">
                      {resumeData.skills.map((skill, index) => (
                        <span key={index} className="skill-tag" style={{ backgroundColor: selectedColors.light }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="cv-right">
                {resumeData.experience && (
                  <div className="cv-section">
                    <h3 style={{ color: selectedColors.primary }}>Expérience</h3>
                    <p>{resumeData.experience}</p>
                  </div>
                )}
                
                {resumeData.education && (
                  <div className="cv-section">
                    <h3 style={{ color: selectedColors.primary }}>Formation</h3>
                    <p>{resumeData.education}</p>
                  </div>
                )}
                
                {resumeData.category && (
                  <div className="cv-section">
                    <h3 style={{ color: selectedColors.primary }}>Catégorie</h3>
                    <div className="category-badge" style={{ backgroundColor: selectedColors.primary }}>
                      {resumeData.category}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="cv-footer" style={{ backgroundColor: selectedColors.light }}>
              <p>CV généré le {new Date(resumeData.created).toLocaleDateString('fr-FR')} • ID: {resumeData.id}</p>
            </div>
          </div>
        </div>

        {/* Informations techniques */}
        <div className="info-section">
          <h2>Informations techniques</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>📋 Données du CV</h3>
              <ul>
                <li><strong>ID:</strong> {resumeData.id}</li>
                <li><strong>Modèle:</strong> {resumeData.template}</li>
                <li><strong>Couleur:</strong> {resumeData.colorScheme}</li>
                <li><strong>Police:</strong> {resumeData.font}</li>
                <li><strong>Créé le:</strong> {new Date(resumeData.created).toLocaleDateString('fr-FR')}</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h3>📊 Statistiques</h3>
              <ul>
                <li><strong>Mots dans le résumé:</strong> {resumeData.summary.split(' ').length}</li>
                <li><strong>Compétences listées:</strong> {resumeData.skills.length}</li>
                <li><strong>Catégorie:</strong> {resumeData.category}</li>
                <li><strong>Longueur du CV:</strong> {resumeData.summary.length + resumeData.experience.length + resumeData.education.length} caractères</li>
              </ul>
            </div>
            
            <div className="info-card">
              <h3>⚙️ Configuration</h3>
              <ul>
                <li><strong>Template:</strong> {resumeData.template}</li>
                <li><strong>Schéma de couleurs:</strong> 
                  <span className="color-sample" style={{ backgroundColor: selectedColors.primary }}></span>
                  {resumeData.colorScheme}
                </li>
                <li><strong>Famille de police:</strong> {resumeData.font}</li>
                <li><strong>Format:</strong> A4 (210x297mm)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="actions-section">
          <h2>Actions disponibles</h2>
          <div className="action-buttons">
            <button 
              className="action-btn edit-btn"
              onClick={() => window.location.href = `/edit/${id}`}
            >
              ✏️ Modifier ce CV
            </button>
            <button 
              className="action-btn build-btn"
              onClick={() => window.location.href = `/build/${id}`}
            >
              🚀 Ouvrir avec l'Assistant
            </button>
            <button 
              className="action-btn export-btn"
              onClick={() => {
                alert('Pour exporter, ouvrez ce CV avec l\'Assistant');
                window.location.href = `/build/${id}`;
              }}
            >
              📄 Exporter en PDF
            </button>
            <button 
              className="action-btn print-btn"
              onClick={() => window.print()}
            >
              🖨️ Imprimer
            </button>
            <button 
              className="action-btn back-btn"
              onClick={() => window.location.href = '/'}
            >
              ← Retour à la liste
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;