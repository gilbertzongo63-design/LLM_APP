import React, { useState } from 'react';
import PdfExportService from '../utils/PdfExportService';
import './CreateResumeForm.css';

const CreateResumeForm = ({ onSave, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    summary: initialData.summary || '',
    experience: initialData.experience || '',
    education: initialData.education || '',
    skills: initialData.skills || '',
    profilePhoto: initialData.profilePhoto || null,
    city: initialData.city || '',
    linkedin: initialData.linkedin || '',
    github: initialData.github || '',
    portfolio: initialData.portfolio || '',
    hasLinkedin: initialData.linkedin ? true : false,
    hasGithub: initialData.github ? true : false,
    hasPortfolio: initialData.portfolio ? true : false,
    projects: initialData.projects || '',
    certifications: initialData.certifications || '',
    languages: initialData.languages || '',
    interests: initialData.interests || '',
    category: initialData.category || 'HR'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleLink = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked,
      ...(name === 'hasLinkedin' && !checked ? { linkedin: '' } : {}),
      ...(name === 'hasGithub' && !checked ? { github: '' } : {}),
      ...(name === 'hasPortfolio' && !checked ? { portfolio: '' } : {})
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(s => s.trim());
    setFormData(prev => ({
      ...prev,
      skills: skills.join(', ')
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, profilePhoto: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const [savedResumes, setSavedResumes] = useState([]);
  const [showForm, setShowForm] = useState(false); // default: show saved list
  const [filterText, setFilterText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const loadSavedResumes = () => {
    const saved = JSON.parse(localStorage.getItem('resumes') || '[]');
    setSavedResumes(saved.reverse());
  };

  React.useEffect(() => {
    loadSavedResumes();
    // if a resume was set for edit via other UI, load it once
    try {
      const toEdit = JSON.parse(localStorage.getItem('resumeToEdit') || 'null');
      if (toEdit) {
        setFormData(prev => ({ ...prev, ...toEdit }));
        localStorage.removeItem('resumeToEdit');
        setShowForm(true);
      }
    } catch (err) {}
  }, []);

  const handleLoadSaved = (r) => {
    setFormData(prev => ({ ...prev, ...r }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSaved = (id) => {
    if (!window.confirm('Supprimer ce CV sauvegardé ?')) return;
    const stored = JSON.parse(localStorage.getItem('resumes') || '[]');
    const filtered = stored.filter(x => String(x.id) !== String(id));
    localStorage.setItem('resumes', JSON.stringify(filtered));
    setSavedResumes(filtered.reverse());
  };

  const handleExportPdf = async () => {
    // Validate required fields before exporting
    if (!formData.title || !formData.fullName || !formData.email || !formData.summary) {
      alert('Veuillez remplir les champs obligatoires : Titre du CV, Nom complet, Email et Résumé avant d\'exporter.');
      return;
    }
    try {
      const filename = `${formData.fullName || formData.title || 'cv'}.pdf`;
      await PdfExportService.generateFromData(formData, { filename });
      alert('Export PDF téléchargé.');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'export PDF: ' + (err.message || err));
    }
  };

  const handleExportDocx = async () => {
    try {
      const temp = document.createElement('div');
      temp.innerHTML = `
        <div class="cv-docx">
          <h1>${formData.fullName || ''}</h1>
          <h2>${formData.title || ''}</h2>
          <p>${formData.summary || ''}</p>
          <h3>Expérience</h3>
          <div>${formData.experience || ''}</div>
          <h3>Formation</h3>
          <div>${formData.education || ''}</div>
          <h3>Compétences</h3>
          <div>${formData.skills || ''}</div>
        </div>
      `;
      document.body.appendChild(temp);
      await PdfExportService.exportToDOCX(temp, { filename: `${formData.fullName || formData.title || 'cv'}.doc` });
      document.body.removeChild(temp);
      alert('Export DOCX téléchargé.');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l\'export DOCX: ' + (err.message || err));
    }
  };

  const isResumeExportValid = !!(formData.title && formData.fullName && formData.email && formData.summary);

  return (
    <div className="create-resume-form">
      <h2>{initialData.title ? 'Modifier le CV' : 'Créer un nouveau CV'}</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Titre du CV *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ex: CV Développeur Frontend"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Nom complet *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Catégorie *</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              <option value="HR">RH</option>
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Sales">Ventes</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Ville, Pays</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Paris, France" />
          </div>
          <div className="form-group">
            <label>Liens (LinkedIn / GitHub / Portfolio)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="checkbox" name="hasLinkedin" checked={!!formData.hasLinkedin} onChange={handleToggleLink} /> Oui
              </label>
              <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." disabled={!formData.hasLinkedin} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="checkbox" name="hasGithub" checked={!!formData.hasGithub} onChange={handleToggleLink} /> Oui
              </label>
              <input type="text" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." disabled={!formData.hasGithub} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input type="checkbox" name="hasPortfolio" checked={!!formData.hasPortfolio} onChange={handleToggleLink} /> Oui
              </label>
              <input type="text" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="https://votre-portfolio.com" disabled={!formData.hasPortfolio} />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Résumé/Profil *</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            rows="3"
            placeholder="Décrivez-vous en quelques lignes..."
            required
          />
        </div>

        <div className="form-group">
          <label>Expérience professionnelle</label>
          <textarea
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            rows="5"
            placeholder="• Poste 1 - Entreprise (Dates)
• Poste 2 - Entreprise (Dates)"
          />
        </div>

        <div className="form-group">
          <label>Formation</label>
          <textarea
            name="education"
            value={formData.education}
            onChange={handleChange}
            rows="4"
            placeholder="• Diplôme - École (Années)
• Certification - Organisme (Année)"
          />
        </div>

        <div className="form-group">
          <label>Compétences (séparées par des virgules)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleSkillsChange}
            placeholder="React, Node.js, UX Design, Gestion de projet"
          />
        </div>

        <div className="form-group">
          <label>Projets (si pertinent) - listez brièvement</label>
          <textarea name="projects" value={formData.projects} onChange={handleChange} rows="4" placeholder="Nom du projet - Objectif - Techs - Résultat" />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Certifications</label>
            <input type="text" name="certifications" value={formData.certifications} onChange={handleChange} placeholder="Ex: AWS Certified - 2023" />
          </div>
          <div className="form-group">
            <label>Langues</label>
            <input type="text" name="languages" value={formData.languages} onChange={handleChange} placeholder="Français - Courant, Anglais - Avancé" />
          </div>
        </div>

        <div className="form-group">
          <label>Centres d'intérêt (optionnel)</label>
          <input type="text" name="interests" value={formData.interests} onChange={handleChange} placeholder="Ex: Football, Photographie" />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {initialData.title ? 'Mettre à jour' : 'Créer le CV'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => onSave(formData)} title="Sauvegarder localement">
            💾 Sauvegarder
          </button>
          <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
            Annuler
          </button>
          <button type="button" className="btn-secondary" onClick={handleExportPdf} title={isResumeExportValid ? 'Exporter en PDF' : 'Veuillez remplir les champs obligatoires avant d\'exporter'} disabled={!isResumeExportValid}>
            📄 Exporter PDF
          </button>
          <button type="button" className="btn-secondary" onClick={handleExportDocx} title="Exporter en DOC">
            🗎 Exporter DOC
          </button>
        </div>
        
        {!showForm && (
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>CVs sauvegardés</h3>
              <div>
                <button type="button" className="btn-primary" onClick={() => setShowForm(true)}>Créer un nouveau CV</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input placeholder="Rechercher par nom / titre" value={filterText} onChange={e => setFilterText(e.target.value)} />
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="all">Toutes catégories</option>
                {[...new Set(savedResumes.map(s => s.category).filter(Boolean))].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button type="button" className="btn-secondary" onClick={loadSavedResumes}>Rafraîchir</button>
            </div>

            <div style={{ marginTop: 12 }}>
              {savedResumes.filter(r => {
                const text = filterText.trim().toLowerCase();
                if (filterCategory !== 'all' && r.category !== filterCategory) return false;
                if (!text) return true;
                return (r.fullName || r.title || '').toLowerCase().includes(text) || (r.skills || '').toString().toLowerCase().includes(text);
              }).map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, borderBottom: '1px solid #eee' }}>
                  <div>
                    <strong>{r.fullName || r.title}</strong><br/>
                    <small>{r.category} • {r.created ? new Date(r.created).toLocaleString() : ''}</small>
                  </div>
                  <div>
                    <button type="button" className="btn-secondary" onClick={() => handleLoadSaved(r)}>Charger</button>
                    <button type="button" className="btn-danger" style={{ marginLeft: 8 }} onClick={() => handleDeleteSaved(r.id)}>Supprimer</button>
                  </div>
                </div>
              ))}
              {savedResumes.length === 0 && <div style={{ marginTop: 8 }}>Aucun CV sauvegardé.</div>}
            </div>
          </div>
        )}

        {showForm && (
          <>
            <div className="form-group">
              <label>Photo de profil (optionnelle)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {formData.profilePhoto && (
                <div className="photo-preview">
                  <img src={formData.profilePhoto} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '50%', marginTop: 8 }} />
                </div>
              )}
            </div>
            <div style={{ marginTop: 12 }}>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Voir CVs sauvegardés</button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CreateResumeForm;