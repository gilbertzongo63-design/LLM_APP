import React, { useState, useRef } from 'react';
import PdfExportService from '../utils/PdfExportService';
import './ExportButton.css';

const ExportButton = ({ 
  elementId, 
  resumeData, 
  filename = 'mon-cv',
  onExportStart,
  onExportComplete,
  onExportError 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf'); // RÉACTIVÉ
  const [showOptions, setShowOptions] = useState(false);
  
  const exportRef = useRef(null);

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      setExportFormat(format); // UTILISÉ ICI
      
      if (onExportStart) onExportStart(format);
      
      let result;
      
      if (format === 'pdf-html') {
        // Export depuis HTML (meilleure fidélité)
        const element = document.getElementById(elementId);
        if (!element) throw new Error('Élément non trouvé');
        
        result = await PdfExportService.exportToPDF(element, {
          filename: `${filename}.pdf`,
          format: 'a4',
          orientation: 'portrait'
        });
        
      } else if (format === 'pdf-data') {
        // Export depuis données structurées
        result = PdfExportService.generateFromData(resumeData, {
          filename: `${filename}.pdf`,
          template: resumeData.template || 'modern'
        });
        
      } else if (format === 'docx') {
        // Export DOCX
        const element = document.getElementById(elementId);
        if (!element) throw new Error('Élément non trouvé');
        
        result = await PdfExportService.exportToDOCX(element, {
          filename: `${filename}.doc`
        });
      }

      if (onExportComplete) onExportComplete(result);
      
      // Notification de succès
      alert(`${format.toUpperCase()} exporté avec succès !`);
      
    } catch (error) {
      console.error('Erreur d\'export:', error);
      
      if (onExportError) onExportError(error);
      
      alert(`Erreur lors de l'export: ${error.message}`);
      
    } finally {
      setIsExporting(false);
      setShowOptions(false);
    }
  };

  // Utilisez exportFormat pour afficher le format actuel si nécessaire
  const getCurrentFormatName = () => {
    const formatMap = {
      'pdf-html': 'PDF Haute Qualité',
      'pdf-data': 'PDF Structuré',
      'docx': 'Document Word'
    };
    return formatMap[exportFormat] || 'PDF';
  };

  const formats = [
    { 
      id: 'pdf-html', 
      label: 'PDF Haute Qualité', 
      description: 'Fidèle à l\'affichage écran',
      icon: '📄'
    },
    { 
      id: 'pdf-data', 
      label: 'PDF Structuré', 
      description: 'Optimisé pour l\'impression',
      icon: '🖨️'
    },
    { 
      id: 'docx', 
      label: 'Document Word', 
      description: 'Modifiable facilement',
      icon: '📝'
    }
  ];

  return (
    <div className="export-button-container" ref={exportRef}>
      <div className="export-main-button">
        <button 
          className={`export-btn ${isExporting ? 'exporting' : ''}`}
          onClick={() => setShowOptions(!showOptions)}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <span className="spinner"></span>
              Export en cours ({getCurrentFormatName()})...
            </>
          ) : (
            <>
              <span className="export-icon">📤</span>
              Exporter le CV
            </>
          )}
        </button>
        
        {/* Afficher le format sélectionné */}
        {!isExporting && exportFormat && (
          <div className="current-format">
            <small>Format: {getCurrentFormatName()}</small>
          </div>
        )}
      </div>

      {showOptions && !isExporting && (
        <div className="export-options-dropdown">
          <div className="dropdown-header">
            <h4>Format d'export</h4>
            <div className="current-format-badge">
              Actuel: {getCurrentFormatName()}
            </div>
            <button 
              className="close-dropdown"
              onClick={() => setShowOptions(false)}
            >
              ×
            </button>
          </div>
          
          <div className="format-options">
            {formats.map((format) => (
              <div 
                key={format.id}
                className={`format-option ${exportFormat === format.id ? 'selected' : ''}`}
                onClick={() => handleExport(format.id)}
              >
                <div className="format-icon">{format.icon}</div>
                <div className="format-info">
                  <div className="format-label">{format.label}</div>
                  <div className="format-desc">{format.description}</div>
                </div>
                <div className="format-action">
                  {exportFormat === format.id ? (
                    <span className="selected-badge">✓</span>
                  ) : (
                    <span className="action-arrow">→</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="export-settings">
            <div className="setting-group">
              <label>Nom du fichier:</label>
              <input 
                type="text" 
                defaultValue={filename}
                onChange={(e) => {
                  // Pour changer le filename, vous devriez utiliser un état
                  // Pour l'instant, on le garde simple
                  console.log('Nom de fichier changé:', e.target.value);
                }}
                className="filename-input"
                placeholder={filename}
              />
            </div>
            <div className="setting-group">
              <label>Inclure:</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked /> Date de génération
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked /> Pied de page
                </label>
              </div>
            </div>
          </div>
          
          <div className="dropdown-footer">
            <button 
              className="quick-export-btn"
              onClick={() => handleExport('pdf-html')}
            >
              Export rapide (PDF)
            </button>
            <button 
              className="cancel-btn"
              onClick={() => setShowOptions(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportButton;