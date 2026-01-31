import React from 'react';
import { useParams } from 'react-router-dom';
import './ResumeView.css';

const ResumeView = () => {
  const { id } = useParams();
  
  // Exemple de données (à remplacer par vos données réelles)
  const resumeData = {
    id: id,
    title: 'Mon CV Professionnel',
    fullName: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 1 23 45 67 89',
    summary: 'Développeur full-stack avec 5 ans d\'expérience...',
    experience: '5 ans d\'expérience',
    education: 'Master en Informatique',
    skills: 'React, Node.js, MongoDB, Docker',
    category: 'IT',
    template: 'modern',
    colorScheme: 'blue',
    font: 'Arial',
    created: new Date().toISOString()
  };

  return (
    <div className="resume-view">
      <div className="view-header">
        <h1>📄 Visualisation du CV</h1>
        <p>ID: {id}</p>
      </div>
      
      <div className="view-content">
        <div className="resume-details">
          <h2>{resumeData.title}</h2>
          
          <div className="detail-section">
            <h3>Informations personnelles</h3>
            <p><strong>Nom :</strong> {resumeData.fullName}</p>
            <p><strong>Email :</strong> {resumeData.email}</p>
            <p><strong>Téléphone :</strong> {resumeData.phone}</p>
          </div>
          
          <div className="detail-section">
            <h3>Résumé professionnel</h3>
            <p>{resumeData.summary}</p>
          </div>
          
          <div className="detail-section">
            <h3>Compétences</h3>
            <div className="skills-list">
              {resumeData.skills.split(',').map((skill, index) => (
                <span key={index} className="skill-tag">{skill.trim()}</span>
              ))}
            </div>
          </div>
          
          <div className="detail-section">
            <h3>Expérience</h3>
            <p>{resumeData.experience}</p>
          </div>
          
          <div className="detail-section">
            <h3>Formation</h3>
            <p>{resumeData.education}</p>
          </div>
        </div>
        
        <div className="view-actions">
          <button 
            className="action-btn edit-btn"
            onClick={() => window.location.href = `/edit/${id}`}
          >
            ✏️ Modifier
          </button>
          <button 
            className="action-btn export-btn"
            onClick={() => window.location.href = `/build/${id}`}
          >
            🚀 Ouvrir avec Assistant
          </button>
          <button 
            className="action-btn back-btn"
            onClick={() => window.location.href = '/'}
          >
            ← Retour
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeView;