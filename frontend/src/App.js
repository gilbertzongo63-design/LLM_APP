import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PdfExportService from './utils/PdfExportService';
import CreateResumeForm from './components/CreateResumeForm';
import ResumeBuilderPage from './components/ResumeBuilderPage';
import TemplateSelector from './components/TemplateSelector';
import CoverLetterBuilder from './components/CoverLetterBuilder'; // AJOUT IMPORT
import ResumeView from './components/ResumeViewer';
import Assistant from './components/Assistant';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('title');
  const [assistantOpen, setAssistantOpen] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Essayer de charger depuis l'API
      const response = await fetch(`${API_BASE_URL}/api/resumes`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        const initial = Array.isArray(data.data) ? data.data.slice(0, 5) : data.data;
        setResumes(initial);
        setFilteredResumes(initial);
      } else {
        throw new Error('Invalid API response');
      }
    } catch (err) {
      console.error('Error loading resumes from API:', err);
      setError(`Error loading resumes: ${err.message}. Please make sure the server is running on ${API_BASE_URL}`);
      
      // Fallback: charger depuis les ressources publiques si l'API échoue
      try {
        const response = await fetch('/data/Resume.csv');
        if (response.ok) {
          const csvText = await response.text();
          const parsedData = parseCSV(csvText);
          const initial = Array.isArray(parsedData) ? parsedData.slice(0, 5) : parsedData;
          setResumes(initial);
          setFilteredResumes(initial);
          setError(null);
        }
      } catch (fallbackErr) {
        console.error('Fallback CSV loading also failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ? values[index].trim() : '';
      });
      data.push(row);
    }
    
    return data.map((resume, index) => {
      const resumeText = resume.Resume_str || '';
      
      const firstLine = resumeText.split('\n').find(line => 
        line.trim() !== '' && !line.toLowerCase().includes('summary')
      );
      const title = firstLine ? firstLine.trim() : `Resume ${index + 1}`;
      
      let summary = '';
      const summaryIndex = resumeText.toLowerCase().indexOf('summary');
      if (summaryIndex !== -1) {
        const endIndex = resumeText.toLowerCase().indexOf('experience', summaryIndex);
        if (endIndex !== -1) {
          summary = resumeText.substring(summaryIndex + 7, endIndex).trim();
        } else {
          summary = resumeText.substring(summaryIndex + 7).trim();
        }
        if (summary.length > 150) {
          summary = summary.substring(0, 150) + '...';
        }
      }
      
      let experience = '';
      const expMatch = resumeText.match(/(\d+\+?\s*years?)/i);
      if (expMatch) {
        experience = expMatch[0];
      }
      
      let skills = [];
      const skillsIndex = resumeText.toLowerCase().indexOf('skills');
      if (skillsIndex !== -1) {
        const nextLine = resumeText.substring(skillsIndex).split('\n')[0];
        skills = nextLine.split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 2)
          .slice(0, 5);
      }
      
      return {
        id: resume.ID || `resume-${index}`,
        title,
        summary: summary || 'No summary available',
        skills,
        experience,
        category: resume.Category || 'HR',
        fullText: resume.Resume_str,
        html: resume.Resume_html
      };
    });
  };

  const handleSearch = () => {
    let filtered = [...resumes];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(resume =>
        resume.title.toLowerCase().includes(searchLower) ||
        resume.summary.toLowerCase().includes(searchLower) ||
        (resume.skills && resume.skills.some(skill => 
          skill.toLowerCase().includes(searchLower)
        ))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resume =>
        resume.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'experience':
          const expA = parseInt(a.experience) || 0;
          const expB = parseInt(b.experience) || 0;
          return expB - expA;
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredResumes(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('title');
    setFilteredResumes(resumes);
  };

  const getCategories = () => {
    const categories = [...new Set(resumes.map(r => r.category))];
    return categories.filter(cat => cat && cat.trim() !== '');
  };

  const handleSaveResume = (resumeData) => {
    const newResume = {
      id: Date.now(),
      ...resumeData,
      created: new Date().toISOString(),
      summary: resumeData.summary || 'No summary available',
      skills: resumeData.skills ? resumeData.skills.split(',').map(s => s.trim()) : [],
      experience: resumeData.experience || '',
      fullText: resumeData.summary,
      html: ''
    };
    setResumes([...resumes, newResume]);
    setFilteredResumes([...resumes, newResume]);
    
    const savedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
    savedResumes.push(newResume);
    localStorage.setItem('resumes', JSON.stringify(savedResumes));
    
    alert('CV créé avec succès !');
  };

  const handleSaveCoverLetter = (letterData) => {
    const savedLetters = JSON.parse(localStorage.getItem('coverLetters') || '[]');
    const newLetter = {
      id: Date.now(),
      ...letterData,
      created: new Date().toISOString()
    };
    savedLetters.push(newLetter);
    localStorage.setItem('coverLetters', JSON.stringify(savedLetters));
    alert('Lettre de motivation sauvegardée !');
  };

  useEffect(() => {
  handleSearch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [searchTerm, selectedCategory, sortBy]); // handleSearch est stable
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading resumes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <h2>⚠️ Error Loading Data</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={loadResumes} className="btn-retry">
              Retry Loading
            </button>
            <button 
              onClick={() => setError(null)} 
              className="btn-continue"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        {/* Header avec Navigation */}
        <header className="app-header">
          <div className="header-content">
            <h1>📄 Createur de CV et de Lettre de Motivation</h1>
            <p className="subtitle">Parcourez, recherchez et filtrez des CV professionnels</p>
            <nav className="main-nav">
              <Link to="/" className="nav-link">🏠 Accueil</Link>
              <Link to="/build" className="nav-link">✨ Assistant CV</Link>
              <Link to="/create" className="nav-link">📝 Créer CV Simple</Link>
              <Link to="/cover-letter" className="nav-link">📧 Lettres</Link>
              <Link to="/templates" className="nav-link">🎨 Modèles</Link>
            </nav>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-number">{resumes.length}</span>
              <span className="stat-label">CVs</span>
            </div>
            <div className="stat">
              <span className="stat-number">{getCategories().length}</span>
              <span className="stat-label">Catégories</span>
            </div>
            <div className="stat">
              <span className="stat-number">{filteredResumes.length}</span>
              <span className="stat-label">Filtrés</span>
            </div>
          </div>
        </header>

        {/* Main Content avec Routes */}
        <main className="main-content">
          <Routes>
            {/* Page d'accueil avec liste de CV */}
            <Route path="/" element={
              <>
                {/* Filters Section */}
                <section className="filters-section">
                  <div className="section-header">
                    <h2>🔍 Filter & Search</h2>
                    <div className="view-controls">
                      <button 
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                      >
                        ▦
                      </button>
                      <button 
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                        title="List View"
                      >
                        ☰
                      </button>
                    </div>
                  </div>
                  
                  <div className="filters-grid">
                    <div className="filter-group">
                      <label htmlFor="search">Search</label>
                      <input
                        id="search"
                        type="text"
                        placeholder="Search by title, skills, or keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    
                    <div className="filter-group">
                      <label htmlFor="category">Category</label>
                      <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-select"
                      >
                        <option value="all">All Categories</option>
                        {getCategories().map((cat, index) => (
                          <option key={index} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="filter-group">
                      <label htmlFor="sort">Sort By</label>
                      <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                      >
                        <option value="title">Title (A-Z)</option>
                        <option value="experience">Experience (High to Low)</option>
                        <option value="category">Category</option>
                      </select>
                    </div>
                    
                    <div className="filter-group actions">
                      <button onClick={handleReset} className="btn-reset">
                        Clear Filters
                      </button>
                    </div>
                  </div>
                  
                  <div className="results-summary">
                    <span className="results-count">
                      {filteredResumes.length} of {resumes.length} resumes found
                    </span>
                    {searchTerm && (
                      <span className="search-term">
                        for "<strong>{searchTerm}</strong>"
                      </span>
                    )}
                  </div>
                </section>

                {/* Resumes Grid/List */}
                <section className="resumes-section">
                  {filteredResumes.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🔍</div>
                      <h3>No resumes found</h3>
                      <p>Try adjusting your search terms or filters</p>
                      <button onClick={handleReset} className="btn-reset-filters">
                        Clear all filters
                      </button>
                      <div className="empty-state-actions">
                        <Link to="/build" className="create-resume-btn assistant-btn">
                          🚀 Utiliser l'Assistant CV
                        </Link>
                        <Link to="/create" className="create-resume-btn">
                          📝 Créer un CV Simple
                        </Link>
                      </div>
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="resumes-grid">
                      {filteredResumes.map((resume) => (
                        <ResumeCard 
                          key={resume.id} 
                          resume={resume} 
                          onViewDetails={() => {
                            setSelectedResume(resume);
                            setShowModal(true);
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="resumes-list">
                      {filteredResumes.map((resume) => (
                        <ResumeListItem 
                          key={resume.id} 
                          resume={resume} 
                          onViewDetails={() => {
                            setSelectedResume(resume);
                            setShowModal(true);
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Boutons d'action */}
                  {filteredResumes.length > 0 && (
                    <div className="create-resume-cta">
                      <div className="cta-buttons">
                        <Link to="/build" className="create-resume-btn assistant-btn">
                          🚀 Utiliser l'Assistant CV
                        </Link>
                        <Link to="/create" className="create-resume-btn">
                          📝 Créer un CV Simple
                        </Link>
                        <Link to="/cover-letter" className="create-resume-btn letter-btn">
                          📧 Créer une Lettre
                        </Link>
                        <Link to="/templates" className="create-resume-btn templates-btn">
                          🎨 Voir les Modèles
                        </Link>
                      </div>
                    </div>
                  )}
                </section>
              </>
            } />
            
            {/* Page Assistant CV (ResumeBuilderPage) */}
            <Route path="/build" element={<ResumeBuilderPage />} />
            <Route path="/build/:id" element={<ResumeBuilderPage />} />
            
            {/* Page création CV simple */}
            <Route path="/create" element={
              <div className="create-resume-page">
                <div className="page-header">
                  <h2>Créer un nouveau CV</h2>
                  <div className="page-header-actions">
                    <Link to="/build" className="nav-link">
                      🚀 Utiliser l'Assistant
                    </Link>
                    <Link to="/" className="back-link">← Retour à la liste</Link>
                  </div>
                </div>
                <CreateResumeForm onSave={handleSaveResume} />
              </div>
            } />
            
            {/* Page édition CV */}
            <Route path="/edit/:id" element={
              <div className="edit-resume-page">
                <div className="page-header">
                  <h2>Modifier le CV</h2>
                  <div className="page-header-actions">
                    <Link to="/" className="back-link">← Retour à la liste</Link>
                  </div>
                </div>
                <CreateResumeForm onSave={handleSaveResume} />
              </div>
            } />
            
            {/* Page visualisation CV (détails) */}
            <Route path="/view/:id" element={
              <div className="view-resume-page">
                <div className="page-header">
                  <h2>Détails du CV</h2>
                  <Link to="/" className="back-link">← Retour à la liste</Link>
                </div>
                <ResumeView />
              </div>
            } />
            
            {/* Page TemplateSelector */}
            <Route path="/templates" element={
              <div className="templates-page">
                <div className="page-header">
                  <h2>🎨 Modèles de CV</h2>
                  <div className="page-header-actions">
                    <Link to="/build" className="nav-link">
                      🚀 Créer avec Assistant
                    </Link>
                    <Link to="/" className="back-link">← Retour à la liste</Link>
                  </div>
                </div>
                <TemplateSelector 
                  selectedTemplate="modern"
                  selectedColor="blue"
                  selectedFont="Arial"
                  onSelect={(template, color, font) => {
                    alert(`Modèle sélectionné: ${template}, Couleur: ${color}, Police: ${font}`);
                    window.location.href = `/build?template=${template}&color=${color}&font=${font}`;
                  }}
                  resumeData={{
                    fullName: "Exemple Nom",
                    title: "Exemple Poste",
                    email: "exemple@email.com",
                    phone: "+33 1 23 45 67 89",
                    summary: "Ceci est un exemple de résumé professionnel."
                  }}
                />
                <div className="template-info-section">
                  <h3>Comment choisir votre modèle ?</h3>
                  <div className="template-tips">
                    <div className="tip">
                      <div className="tip-icon">💼</div>
                      <div className="tip-content">
                        <h4>Moderne / Classique</h4>
                        <p>Idéal pour les postes corporatifs, finance, management</p>
                      </div>
                    </div>
                    <div className="tip">
                      <div className="tip-icon">🎨</div>
                      <div className="tip-content">
                        <h4>Créatif</h4>
                        <p>Parfait pour design, marketing, arts, communication</p>
                      </div>
                    </div>
                    <div className="tip">
                      <div className="tip-icon">💻</div>
                      <div className="tip-content">
                        <h4>Technique</h4>
                        <p>Spécialement conçu pour développeurs, ingénieurs</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            } />
            
            {/* Page lettres de motivation - CORRIGÉ */}
            <Route path="/cover-letter" element={
              <div className="cover-letter-page">
                <div className="page-header">
                  <h2>📧 Createur de CV et de Lettre de Motivation</h2>
                  <div className="page-header-actions">
                    <Link to="/" className="back-link">← Retour à la liste</Link>
                  </div>
                </div>
                <CoverLetterBuilder onSave={handleSaveCoverLetter} />
              </div>
            } />
            
            {/* Page export/impression */}
            <Route path="/export" element={
              <div className="export-page">
                <div className="page-header">
                  <h2>📤 Exporter votre CV</h2>
                  <Link to="/" className="back-link">← Retour à la liste</Link>
                </div>
                <div className="export-options-page">
                  <h3>Options d'export disponibles</h3>
                  <p>Exportez votre CV dans différents formats selon vos besoins</p>
                  
                  <div className="export-features">
                    <div className="export-feature">
                      <div className="feature-icon">📄</div>
                      <div className="feature-content">
                        <h4>PDF Haute Qualité</h4>
                        <p>Export fidèle à l'affichage écran, parfait pour l'envoi par email</p>
                        <p className="feature-info">Disponible dans l'Assistant CV → Étape 3</p>
                      </div>
                    </div>
                    
                    <div className="export-feature">
                      <div className="feature-icon">🖨️</div>
                      <div className="feature-content">
                        <h4>PDF Optimisé pour Impression</h4>
                        <p>Format structuré avec marges adaptées à l'impression</p>
                        <p className="feature-info">Disponible dans l'Assistant CV → Étape 3</p>
                      </div>
                    </div>
                    
                    <div className="export-feature">
                      <div className="feature-icon">📝</div>
                      <div className="feature-content">
                        <h4>Document Word</h4>
                        <p>Format .doc modifiable facilement</p>
                        <p className="feature-info">Disponible dans l'Assistant CV → Étape 3</p>
                      </div>
                    </div>
                    
                    <div className="export-feature">
                      <div className="feature-icon">🖨️</div>
                      <div className="feature-content">
                        <h4>Impression Directe</h4>
                        <p>Utilisez l'impression navigateur pour un contrôle complet</p>
                        <p className="feature-info">Ctrl+P depuis n'importe quelle page</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="export-guide">
                    <h4>📋 Guide d'export :</h4>
                    <ol>
                      <li>Allez dans <strong>Assistant CV</strong> ou créez un nouveau CV</li>
                      <li>Remplissez vos informations (Étape 1)</li>
                      <li>Choisissez un modèle (Étape 2)</li>
                      <li>Dans l'Étape 3 (Aperçu), cliquez sur <strong>"Exporter le CV"</strong></li>
                      <li>Sélectionnez le format souhaité</li>
                    </ol>
                    
                    <div className="export-cta">
                      <Link to="/build" className="export-cta-btn">
                        🚀 Accéder à l'Assistant d'Export
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            } />
            
            {/* Page 404 - Page non trouvée */}
            <Route path="*" element={
              <div className="not-found-page">
                <div className="not-found-content">
                  <h1>404</h1>
                  <h2>Page non trouvée</h2>
                  <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
                  <div className="not-found-actions">
                    <Link to="/" className="action-btn">
                      🏠 Retour à l'accueil
                    </Link>
                    <Link to="/build" className="action-btn">
                      ✨ Créer un CV
                    </Link>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>

        {/* Resume Modal */}
        {showModal && selectedResume && (
          <ResumeModal
            resume={selectedResume}
            onClose={() => setShowModal(false)}
          />
        )}

        {/* Assistant Chat */}
        <Assistant 
          isOpen={assistantOpen} 
          onClose={() => setAssistantOpen(false)}
        />

        {/* Floating Assistant Button */}
        {!assistantOpen && (
          <button 
            className="floating-assistant-btn"
            onClick={() => setAssistantOpen(true)}
            title="Ouvrir l'assistant"
          >
            🤖
          </button>
        )}

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-content">
            <p className="footer-title">Resume Management System • {new Date().getFullYear()}</p>
            <p className="footer-info">
              Gestion de {resumes.length} CVs professionnels • {getCategories().length} catégories
            </p>
            <div className="footer-links">
              <Link to="/">🏠 Accueil</Link>
              <span className="separator">•</span>
              <Link to="/build">✨ Assistant CV</Link>
              <span className="separator">•</span>
              <Link to="/templates">🎨 Modèles</Link>
              <span className="separator">•</span>
              <Link to="/create">📝 Créer CV</Link>
              <span className="separator">•</span>
              <Link to="/cover-letter">📧 Lettres</Link>
              <span className="separator">•</span>
              <Link to="/export">📤 Exporter</Link>
            </div>
            <div className="footer-credits">
              <p>Système de gestion de CV professionnel • Fonctionnalités complètes</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Resume Card Component for Grid View
const ResumeCard = ({ resume, onViewDetails }) => {
  return (
    <div className="resume-card" onClick={onViewDetails}>
      <div className="card-header">
        <div className="card-title">
          <h3>{resume.title}</h3>
          <span className={`category-badge ${resume.category.toLowerCase()}`}>
            {resume.category}
          </span>
        </div>
        {resume.experience && (
          <div className="experience-badge">
            {resume.experience}
          </div>
        )}
      </div>
      
      <div className="card-body">
        <p className="summary">{resume.summary}</p>
        
        {resume.skills && resume.skills.length > 0 && (
          <div className="skills-section">
            <div className="skills-tags">
              {resume.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
              {resume.skills.length > 3 && (
                <span className="skill-tag more">+{resume.skills.length - 3}</span>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="card-footer">
        <button className="view-details-btn">
          View Details →
        </button>
        <div className="card-actions">
          <Link 
            to={`/edit/${resume.id}`} 
            className="card-action-btn edit-btn"
            onClick={(e) => e.stopPropagation()}
          >
            ✏️
          </Link>
          <Link 
            to={`/build/${resume.id}`} 
            className="card-action-btn build-btn"
            onClick={(e) => e.stopPropagation()}
          >
            🚀
          </Link>
          <button 
            className="card-action-btn pdf-btn"
            onClick={(e) => {
              e.stopPropagation();
              (async () => {
                try {
                  const filename = `${resume.title || 'cv'}-${resume.id}.pdf`;
                  await PdfExportService.generateFromData(resume, { filename });
                  alert('PDF téléchargé : ' + filename);
                } catch (err) {
                  console.error('Export PDF failed', err);
                  alert('Erreur lors de l\'export PDF: ' + (err.message || err));
                }
              })();
            }}
            title="Exporter en PDF"
          >
            📄
          </button>
        </div>
      </div>
    </div>
  );
};

// Resume List Item Component for List View
const ResumeListItem = ({ resume, onViewDetails }) => {
  return (
    <div className="resume-list-item" onClick={onViewDetails}>
      <div className="list-item-main">
        <div className="list-item-left">
          <h3 className="list-item-title">{resume.title}</h3>
          <p className="list-item-summary">{resume.summary}</p>
        </div>
        
        <div className="list-item-right">
          <div className="list-item-meta">
            <span className={`category-label ${resume.category.toLowerCase()}`}>
              {resume.category}
            </span>
            {resume.experience && (
              <span className="experience-label">
                {resume.experience}
              </span>
            )}
          </div>
          
          {resume.skills && resume.skills.length > 0 && (
            <div className="list-item-skills">
              {resume.skills.slice(0, 2).map((skill, index) => (
                <span key={index} className="skill-label">
                  {skill}
                </span>
              ))}
              {resume.skills.length > 2 && (
                <span className="skill-label more">+{resume.skills.length - 2}</span>
              )}
            </div>
          )}
          
          <div className="list-item-actions">
            <Link 
              to={`/edit/${resume.id}`} 
              className="list-action-btn edit-btn"
              onClick={(e) => e.stopPropagation()}
            >
              ✏️ Modifier
            </Link>
            <Link 
              to={`/build/${resume.id}`} 
              className="list-action-btn build-btn"
              onClick={(e) => e.stopPropagation()}
            >
              🚀 Assistant
            </Link>
            <button 
              className="list-action-btn pdf-btn"
              onClick={(e) => {
                e.stopPropagation();
                (async () => {
                  try {
                    const filename = `${resume.title || 'cv'}-${resume.id}.pdf`;
                    await PdfExportService.generateFromData(resume, { filename });
                    alert('PDF téléchargé : ' + filename);
                  } catch (err) {
                    console.error('Export PDF failed', err);
                    alert('Erreur lors de l\'export PDF: ' + (err.message || err));
                  }
                })();
              }}
            >
              📄 Exporter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Resume Modal Component
const ResumeModal = ({ resume, onClose }) => {
  const [activeTab, setActiveTab] = useState('preview');

  if (!resume) return null;
  
  const safeFullText = resume.fullText || '';
  const safeSkills = resume.skills || [];
  const safeSummary = resume.summary || 'No summary available';
  const safeTitle = resume.title || 'No Title';
  const safeCategory = resume.category || 'Unknown';
  const safeExperience = resume.experience || '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-section">
            <h2>{safeTitle}</h2>
            <div className="modal-meta">
              <span className={`modal-category ${safeCategory.toLowerCase()}`}>
                {safeCategory}
              </span>
              {safeExperience && (
                <span className="modal-experience">
                  {safeExperience} Experience
                </span>
              )}
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills
          </button>
          <button 
            className={`tab-btn ${activeTab === 'raw' ? 'active' : ''}`}
            onClick={() => setActiveTab('raw')}
          >
            Raw Text
          </button>
          <button 
            className={`tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            Actions
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'preview' && (
            <div className="tab-content preview">
              <div className="section">
                <h3>Summary</h3>
                <p>{safeSummary}</p>
              </div>
              
              <div className="section">
                <h3>Full Text Preview</h3>
                <div className="text-preview">
                  <pre>{safeFullText.substring(0, 800) || 'No text available'}...</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="tab-content skills">
              <h3>Skills & Expertise</h3>
              {safeSkills.length > 0 ? (
                <div className="skills-grid">
                  {safeSkills.map((skill, index) => (
                    <div key={index} className="skill-item">
                      {skill}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-skills">No skills listed in this resume.</p>
              )}
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="tab-content raw">
              <h3>Complete Resume Text</h3>
              <div className="raw-text-container">
                <textarea 
                  readOnly 
                  value={safeFullText || 'No text available'}
                  className="raw-textarea"
                />
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="tab-content actions">
              <h3>Actions disponibles</h3>
              <div className="action-buttons">
                <Link 
                  to={`/edit/${resume.id}`} 
                  className="action-btn modal-action-btn"
                  onClick={onClose}
                >
                  ✏️ Modifier ce CV
                </Link>
                <Link 
                  to={`/build/${resume.id}`} 
                  className="action-btn modal-action-btn assistant-btn"
                  onClick={onClose}
                >
                  🚀 Ouvrir avec l'Assistant
                </Link>
                <button 
                  className="action-btn modal-action-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(safeFullText);
                    alert('CV copié dans le presse-papier !');
                  }}
                >
                  📋 Copier le texte
                </button>
                <button 
                  className="action-btn modal-action-btn export-btn"
                  onClick={async () => {
                    try {
                      const filename = `${resume.title || 'cv'}-${resume.id}.pdf`;
                      await PdfExportService.generateFromData(resume, { filename });
                      alert('PDF téléchargé : ' + filename);
                    } catch (err) {
                      console.error('Export PDF failed', err);
                      alert('Erreur lors de l\'export PDF: ' + (err.message || err));
                    }
                  }}
                >
                  📄 Exporter en PDF
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="footer-actions">
            <button className="btn-close-modal" onClick={onClose}>
              Close
            </button>
            <button 
              className="btn-copy" 
              onClick={() => {
                navigator.clipboard.writeText(safeFullText);
                alert('Resume text copied to clipboard!');
              }}
              disabled={!safeFullText}
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;