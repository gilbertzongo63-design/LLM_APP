import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class PdfExportService {
  /**
   * Exporte un CV au format PDF
   * @param {HTMLElement} element - Élément HTML à exporter
   * @param {Object} options - Options d'export
   * @param {string} options.filename - Nom du fichier
   * @param {string} options.format - Format (A4, A3, etc.)
   * @param {string} options.orientation - Orientation (portrait, landscape)
   * @returns {Promise<void>}
   */
  static async exportToPDF(element, options = {}) {
    const {
      filename = 'cv.pdf',
      format = 'a4',
      orientation = 'portrait',
      margin = 10
    } = options;

    // Use server-side PDF endpoint via relative path for Vercel deployment
    const API_URL = '/api';
    try {
      const html = (element && element.outerHTML) ? element.outerHTML : (typeof element === 'string' ? element : document.body.outerHTML);
      const resp = await fetch(`${API_URL}/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
          body: JSON.stringify({ html, filename })
        });
        if (!resp.ok) {
          const text = await resp.text();
          throw new Error(`Server PDF generation failed: ${resp.status} ${text}`);
        }
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return { success: true, filename, server: true };
      } catch (err) {
        console.warn('Server-side PDF export failed, falling back to client-side:', err);
        // fallthrough to client-side implementation
      }
    }

    try {
      // Créer un canvas à partir de l'élément HTML
      const canvas = await html2canvas(element, {
        scale: 2, // Meilleure qualité
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculer les dimensions pour le PDF
      const pdfWidth = format === 'a4' ? 210 : 297; // mm
      const pdfHeight = format === 'a4' ? 297 : 210; // mm
      
      // Convertir pixels en mm (96 DPI)
      const pxToMm = 25.4 / 96;
      const imgWidthMm = imgWidth * pxToMm;
      const imgHeightMm = imgHeight * pxToMm;
      
      // Calculer le ratio pour adapter l'image au PDF
      let ratio = 1;
      if (imgWidthMm > pdfWidth - margin * 2) {
        ratio = (pdfWidth - margin * 2) / imgWidthMm;
      }
      if (imgHeightMm * ratio > pdfHeight - margin * 2) {
        ratio = (pdfHeight - margin * 2) / imgHeightMm;
      }
      
      const finalWidth = imgWidthMm * ratio;
      const finalHeight = imgHeightMm * ratio;
      
      // Position centrée
      const xPos = (pdfWidth - finalWidth) / 2;
      const yPos = (pdfHeight - finalHeight) / 2;

      // Créer le PDF
      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: format
      });

      // Ajouter l'image
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', xPos, yPos, finalWidth, finalHeight);

      // Télécharger le PDF via un Blob pour forcer le comportement de download
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true, filename };
      
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      throw new Error(`Échec de l'export PDF: ${error.message}`);
    }
  }

  /**
   * Exporte plusieurs pages
   */
  static async exportMultiplePages(elements, options = {}) {
    const pdf = new jsPDF({
      orientation: options.orientation || 'portrait',
      unit: 'mm',
      format: options.format || 'a4'
    });

    for (let i = 0; i < elements.length; i++) {
      const canvas = await html2canvas(elements[i], {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight) * 0.95;
      const imgWidthPdf = imgWidth * ratio;
      const imgHeightPdf = imgHeight * ratio;
      
      const x = (pdfWidth - imgWidthPdf) / 2;
      const y = (pdfHeight - imgHeightPdf) / 2;

      if (i > 0) {
        pdf.addPage();
      }
      
      pdf.addImage(imgData, 'PNG', x, y, imgWidthPdf, imgHeightPdf);
    }

    // Forcer le téléchargement via Blob
    const multiBlob = pdf.output('blob');
    const multiUrl = URL.createObjectURL(multiBlob);
    const aMulti = document.createElement('a');
    aMulti.href = multiUrl;
    aMulti.download = options.filename || 'cvs.pdf';
    document.body.appendChild(aMulti);
    aMulti.click();
    document.body.removeChild(aMulti);
    URL.revokeObjectURL(multiUrl);

    return { success: true, pageCount: elements.length };
  }

  /**
   * Génère un PDF à partir de données structurées (sans HTML)
   */
  static generateFromData(resumeData, options = {}) {
    const {
      filename = 'cv.pdf',
      template = 'modern'
    } = options;

    // If server-side endpoint configured, send minimal HTML to server for PDF generation
    const API_URL = '/api';
    try {
      const html = `
        <html><head><meta charset="utf-8"><title>${resumeData.fullName || ''}</title>
          <style>body{font-family:Arial,Helvetica,sans-serif;padding:20px}h1{color:#2c3e50}</style>
        </head><body>
          <h1>${resumeData.fullName || ''}</h1>
          <h2>${resumeData.title || ''}</h2>
          <p>${resumeData.summary || ''}</p>
          <h3>Expérience</h3><div>${resumeData.experience || ''}</div>
          <h3>Formation</h3><div>${resumeData.education || ''}</div>
          <h3>Compétences</h3><div>${Array.isArray(resumeData.skills)?resumeData.skills.join(', '):resumeData.skills||''}</div>
        </body></html>
      `;
      // perform fetch (note: generateFromData is sync originally, so return a Promise here)
      return fetch(`${API_URL}/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ html, filename })
      }).then(async resp => {
        if (!resp.ok) {
          const txt = await resp.text();
          throw new Error(`Server PDF generation failed: ${resp.status} ${txt}`);
        }
        const blob = await resp.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return { success: true, filename, server: true };
      }).catch(err => {
        console.warn('Server generateFromData failed, falling back to client:', err);
        // fall through to client-side below by not returning here
        return null;
      });
    } catch (e) {
      console.warn('Server-side generateFromData attempt failed:', e);
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configuration
    const margin = 20;
    let yPos = margin;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const contentWidth = pageWidth - margin * 2;

    // Couleurs selon le template
    const colors = {
      modern: { primary: [52, 152, 219], secondary: [44, 62, 80] },
      classic: { primary: [44, 62, 80], secondary: [52, 152, 219] },
      creative: { primary: [155, 89, 182], secondary: [142, 68, 173] }
    };

    const color = colors[template] || colors.modern;

    // En-tête
    pdf.setFillColor(...color.primary);
    pdf.rect(0, 0, pageWidth, 60, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    // Ajouter la photo si disponible (coin droit)
    if (resumeData.profilePhoto) {
      try {
        const imgWidthMm = 30; // mm
        const imgHeightMm = 30;
        const imgX = pageWidth - margin - imgWidthMm;
        const imgY = 10;
        pdf.addImage(resumeData.profilePhoto, 'PNG', imgX, imgY, imgWidthMm, imgHeightMm);
      } catch (imgErr) {
        // ignore l'image si problème
        console.warn('Impossible d\'ajouter la photo au PDF:', imgErr);
      }
    }

    pdf.text(resumeData.fullName || 'Nom Prénom', pageWidth / 2, 30, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(resumeData.title || 'Poste recherché', pageWidth / 2, 40, { align: 'center' });

    yPos = 70;

    // Informations de contact (Header details below the title)
    pdf.setTextColor(...color.secondary);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CONTACT', margin, yPos);
    pdf.setDrawColor(...color.primary);
    pdf.line(margin, yPos + 2, margin + 30, yPos + 2);
    yPos += 10;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const contactPieces = [];
    if (resumeData.phone) contactPieces.push(resumeData.phone);
    if (resumeData.email) contactPieces.push(resumeData.email);
    if (resumeData.city) contactPieces.push(resumeData.city);
    if (resumeData.linkedin) contactPieces.push('LinkedIn');
    if (resumeData.github) contactPieces.push('GitHub');
    if (resumeData.portfolio) contactPieces.push('Portfolio');

    pdf.text(contactPieces.join(' | '), margin, yPos);
    yPos += 10;

    yPos += 5;

    // Profil professionnel
    if (resumeData.summary) {
      pdf.setTextColor(...color.secondary);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROFIL', margin, yPos);
      pdf.line(margin, yPos + 2, margin + 30, yPos + 2);
      yPos += 10;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const summaryLines = pdf.splitTextToSize(resumeData.summary, contentWidth);
      pdf.text(summaryLines, margin, yPos);
      yPos += summaryLines.length * 5 + 5;
    }

    // Expériences professionnelles
    if (resumeData.experience) {
      pdf.setTextColor(...color.secondary);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EXPÉRIENCES', margin, yPos);
      pdf.line(margin, yPos + 2, margin + 50, yPos + 2);
      yPos += 10;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      const expLines = pdf.splitTextToSize(resumeData.experience, contentWidth);
      pdf.text(expLines, margin, yPos);
      yPos += expLines.length * 5 + 5;
    }

    // Compétences
    if (resumeData.skills) {
      pdf.setTextColor(...color.secondary);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('COMPÉTENCES', margin, yPos);
      pdf.line(margin, yPos + 2, margin + 45, yPos + 2);
      yPos += 10;
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      const skills = Array.isArray(resumeData.skills) ? resumeData.skills : (resumeData.skills || '').split(',').map(s => s.trim());
      let colX = margin;
      const colWidth = (contentWidth) / 2;
      skills.forEach((skill, idx) => {
        const x = colX + (idx % 2) * (colWidth);
        const y = yPos + Math.floor(idx / 2) * 6;
        pdf.text(`• ${skill}`, x, y);
      });
      yPos += Math.ceil(skills.length / 2) * 6 + 6;
    }

    // Projets
    if (resumeData.projects) {
      pdf.setTextColor(...color.secondary);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PROJETS', margin, yPos);
      pdf.line(margin, yPos + 2, margin + 40, yPos + 2);
      yPos += 10;
      pdf.setTextColor(0,0,0);
      pdf.setFontSize(10);
      const projLines = pdf.splitTextToSize(resumeData.projects, contentWidth);
      pdf.text(projLines, margin, yPos);
      yPos += projLines.length * 5 + 5;
    }

    // Certifications
    if (resumeData.certifications) {
      pdf.setTextColor(...color.secondary);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CERTIFICATIONS', margin, yPos);
      pdf.line(margin, yPos + 2, margin + 60, yPos + 2);
      yPos += 10;
      pdf.setTextColor(0,0,0);
      pdf.setFontSize(10);
      const certLines = pdf.splitTextToSize(resumeData.certifications, contentWidth);
      pdf.text(certLines, margin, yPos);
      yPos += certLines.length * 5 + 5;
    }

    // Langues
    if (resumeData.languages) {
      pdf.setTextColor(...color.secondary);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('LANGUES', margin, yPos);
      pdf.line(margin, yPos + 2, margin + 40, yPos + 2);
      yPos += 10;
      pdf.setTextColor(0,0,0);
      pdf.setFontSize(10);
      const langLines = pdf.splitTextToSize(resumeData.languages, contentWidth);
      pdf.text(langLines, margin, yPos);
      yPos += langLines.length * 5 + 5;
    }

    // Centres d'intérêt
    if (resumeData.interests) {
      pdf.setTextColor(...color.secondary);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CENTRES D\'INTÉRÊT', margin, yPos);
      pdf.line(margin, yPos + 2, margin + 80, yPos + 2);
      yPos += 10;
      pdf.setTextColor(0,0,0);
      pdf.setFontSize(10);
      const interestLines = pdf.splitTextToSize(resumeData.interests, contentWidth);
      pdf.text(interestLines, margin, yPos);
      yPos += interestLines.length * 5 + 5;
    }

    // Pied de page
    const date = new Date().toLocaleDateString('fr-FR');
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`CV généré avec Createur de CV et de Lettre de Motivation - ${date}`, pageWidth / 2, 285, { align: 'center' });

    // Télécharger via Blob
    const dataBlob = pdf.output('blob');
    const dataUrl = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(dataUrl);

    return { success: true, filename };
  }

  /**
   * Exporte en DOCX (simulation - pourrait utiliser mammoth.js)
   */
  static async exportToDOCX(element, options = {}) {
    // Note: Pour un vrai export DOCX, il faudrait installer mammoth.js
    // Cette version simule l'export et télécharge un HTML stylisé
    
    const htmlContent = element.outerHTML;
    const styledHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${options.filename || 'cv'}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .cv-header { background: #3498db; color: white; padding: 30px; }
          .section { margin: 20px 0; }
          h1, h2 { color: #2c3e50; }
        </style>
      </head>
      <body>
        ${htmlContent}
        <div class="footer">
          <p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([styledHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${options.filename || 'cv'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return { success: true, format: 'doc' };
  }
}

export default PdfExportService;