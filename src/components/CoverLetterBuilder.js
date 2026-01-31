import React, { useState, useEffect } from 'react';
import PdfExportService from '../utils/PdfExportService';
import './CoverLetterBuilder.css';

const CoverLetterBuilder = () => {
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientTitle: '',
    companyName: '',
    companyAddress: '',
    position: '',
    introduction: '',
    body: '',
    conclusion: '',
    senderName: '',
    senderContact: '',
    template: 'professional',
    date: new Date().toLocaleDateString('fr-FR')
  });

  const templates = [
    { id: 'professional', name: 'Professionnel', icon: '💼' },
    { id: 'modern', name: 'Moderne', icon: '⚡' },
    { id: 'creative', name: 'Créatif', icon: '🎨' },
    { id: 'academic', name: 'Académique', icon: '📚' }
  ];

  const [showSaved, setShowSaved] = useState(true);
  const [savedLetters, setSavedLetters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [letterFilter, setLetterFilter] = useState('');

  useEffect(() => {
    if (showSaved) loadSavedItems();
  }, [showSaved]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateSelect = (templateId) => {
    setFormData(prev => ({ ...prev, template: templateId }));
  };

  const handleSave = () => {
    const letters = JSON.parse(localStorage.getItem('coverLetters') || '[]');
    const newLetter = {
      id: Date.now(),
      ...formData,
      created: new Date().toISOString()
    };
    letters.push(newLetter);
    localStorage.setItem('coverLetters', JSON.stringify(letters));
    setSavedLetters(letters.reverse());
    alert('Lettre sauvegardée !');
  };

  const loadSavedItems = () => {
    const letters = JSON.parse(localStorage.getItem('coverLetters') || '[]');
    setSavedLetters(letters.reverse());
  };

  const handleDeleteLetter = (id) => {
    if (!confirm('Supprimer cette lettre ?')) return;
    const stored = JSON.parse(localStorage.getItem('coverLetters') || '[]');
    const filtered = stored.filter(l => String(l.id) !== String(id));
    localStorage.setItem('coverLetters', JSON.stringify(filtered));
    setSavedLetters(filtered.reverse());
  };

  const handleExport = async () => {
    // Validate required fields before exporting
    if (!formData.senderName || !(formData.introduction || formData.body)) {
      alert('Veuillez renseigner votre nom et le contenu de la lettre (introduction ou corps) avant d\'exporter.');
      return;
    }
    const element = document.getElementById('letter-preview');
    if (element) {
      try {
        await PdfExportService.exportToPDF(element, {
          filename: `Lettre-${formData.senderName || 'Motivation'}.pdf`
        });
        alert('Lettre exportée en PDF avec succès !');
      } catch (error) {
        alert('Erreur d\'export: ' + (error && error.message ? error.message : error));
      }
    } else {
      alert('Élément de prévisualisation non trouvé');
    }
  };

  const isExportValid = !!(formData.senderName && (formData.introduction || formData.body));

  const generateLetter = () => {
    return `
      <div class="letter-template-${formData.template}">
        <div class="letter-header">
          <div class="sender-info">
            <strong>${formData.senderName}</strong><br/>
            ${formData.senderContact}
          </div>
          <div class="date">${formData.date}</div>
        </div>
        
        <div class="recipient-info">
          ${formData.recipientName}<br/>
          ${formData.recipientTitle}<br/>
          ${formData.companyName}<br/>
          ${formData.companyAddress}
        </div>
        
        <div class="letter-body">
          <p><strong>Objet : Candidature au poste de ${formData.position}</strong></p>
          
          <p>${formData.recipientName ? `Madame, Monsieur ${formData.recipientName},` : 'Madame, Monsieur,'}</p>
          
          <p>${formData.introduction}</p>
          
          <p>${formData.body}</p>
          
          <p>${formData.conclusion}</p>
          
          <p>Je vous prie d'agréer, ${formData.recipientName ? `Madame, Monsieur ${formData.recipientName},` : 'Madame, Monsieur,'} l'expression de mes salutations distinguées.</p>
          
          <p>${formData.senderName}</p>
        </div>
      </div>
    `;
  };

  return (
    <div className="cover-letter-builder">
      <div className="builder-header">
        <h1>✉️ Createur de CV et de Lettre de Motivation</h1>
        <p>Rédigez une lettre personnalisée pour accompagner votre CV</p>
        <div style={{ marginLeft: 16, display: 'flex', gap: 8 }}>
          <button className="action-btn" onClick={() => { setShowSaved(true); setShowForm(false); loadSavedItems(); }}>Voir lettres sauvegardées</button>
          <button className="action-btn" onClick={() => { setShowForm(true); setShowSaved(false); }}>Créer une nouvelle lettre</button>
        </div>
      </div>

      <div className="builder-container">
        {showForm && (
          <div className="form-section">
            <div className="form-group">
              <label>Destinataire</label>
              <input
                type="text"
                name="recipientName"
                placeholder="Nom du destinataire"
                value={formData.recipientName}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Titre/Fonction</label>
                <input
                  type="text"
                  name="recipientTitle"
                  placeholder="Directeur des Ressources Humaines"
                  value={formData.recipientTitle}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Poste visé</label>
                <input
                  type="text"
                  name="position"
                  placeholder="Développeur Frontend"
                  value={formData.position}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Entreprise</label>
              <input
                type="text"
                name="companyName"
                placeholder="Nom de l'entreprise"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Adresse de l'entreprise</label>
              <textarea
                name="companyAddress"
                placeholder="Adresse complète"
                value={formData.companyAddress}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Votre présentation</label>
              <textarea
                name="introduction"
                placeholder="Je me permets de vous adresser ma candidature..."
                value={formData.introduction}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Corps de la lettre</label>
              <textarea
                name="body"
                placeholder="Mes compétences en... Mon expérience dans..."
                value={formData.body}
                onChange={handleChange}
                rows="6"
              />
            </div>

            <div className="form-group">
              <label>Conclusion</label>
              <textarea
                name="conclusion"
                placeholder="Dans l'attente de vous rencontrer..."
                value={formData.conclusion}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Votre nom</label>
                <input
                  type="text"
                  name="senderName"
                  placeholder="Votre nom complet"
                  value={formData.senderName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Vos coordonnées</label>
                <input
                  type="text"
                  name="senderContact"
                  placeholder="Email · Téléphone"
                  value={formData.senderContact}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}

        <div className="preview-section">
          {showForm ? (
            <>
              <div className="preview-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="template-selector">
                  <h4>Modèles :</h4>
                  <div className="template-buttons">
                    {templates.map(template => (
                      <button
                        key={template.id}
                        className={`template-btn ${formData.template === template.id ? 'active' : ''}`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        {template.icon} {template.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="action-btn save-btn" onClick={handleSave}>💾 Sauvegarder</button>
                  <button
                    className="action-btn export-btn"
                    onClick={handleExport}
                    disabled={!isExportValid}
                    title={!isExportValid ? 'Renseignez votre nom et le contenu de la lettre pour exporter' : 'Exporter en PDF'}
                  >📄 Exporter PDF</button>
                  <button className="action-btn print-btn" onClick={() => window.print()}>🖨️ Imprimer</button>
                </div>
              </div>

              <div id="letter-preview" className="letter-preview" style={{ marginTop: 12 }}>
                <div dangerouslySetInnerHTML={{ __html: generateLetter() }} />
              </div>
            </>
          ) : (
            showSaved && (
              <div className="saved-items" style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4>Lettres sauvegardées</h4>
                  <div>
                    <button className="btn-secondary" onClick={loadSavedItems}>Rafraîchir</button>
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <input placeholder="Rechercher par poste/entreprise/auteur" value={letterFilter} onChange={e => setLetterFilter(e.target.value)} style={{ width: '100%', padding: 8 }} />
                </div>
                <div style={{ marginTop: 12 }}>
                  {savedLetters.filter(l => {
                    const q = (letterFilter || '').trim().toLowerCase();
                    if (!q) return true;
                    return (l.position || '').toLowerCase().includes(q) || (l.companyName || '').toLowerCase().includes(q) || (l.senderName || '').toLowerCase().includes(q);
                  }).map(l => (
                    <div key={l.id} style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{l.position || 'Lettre'}</strong><br/>
                        <small>{l.companyName || ''} • {new Date(l.created).toLocaleString()}</small>
                      </div>
                      <div>
                        <button className="btn-secondary" onClick={() => { setFormData(prev => ({ ...prev, ...l })); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Charger</button>
                        <button className="btn-secondary" style={{ marginLeft: 8 }} onClick={() => {
                          if (!l.senderName || !(l.introduction || l.body)) {
                            alert('Impossibile d\'exporter : le nom de l\'auteur et le contenu de la lettre sont requis.');
                            return;
                          }
                          const temp = document.createElement('div');
                          temp.innerHTML = `
                            <div><strong>Objet :</strong> Candidature au poste de ${l.position || ''}</div>
                            <div>${l.introduction || ''}</div>
                            <div>${l.body || ''}</div>
                            <div>${l.conclusion || ''}</div>
                          `;
                          document.body.appendChild(temp);
                          PdfExportService.exportToPDF(temp, { filename: `Lettre-${l.senderName || 'motivation'}.pdf` }).finally(() => document.body.removeChild(temp));
                        }}>Télécharger PDF</button>
                        <button className="btn-danger" style={{ marginLeft: 8 }} onClick={() => handleDeleteLetter(l.id)}>Supprimer</button>
                      </div>
                    </div>
                  ))}
                  {savedLetters.length === 0 && <div>Aucune lettre sauvegardée.</div>}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterBuilder;
