import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class PdfExportService {
  static async exportToPDF(element, options = {}) {
    const {
      filename = 'document.pdf',
      format = 'a4',
      orientation = 'portrait'
    } = options;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: format
      });

      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(filename);
      
      return { success: true, filename };
      
    } catch (error) {
      console.error('Erreur PDF:', error);
      throw error;
    }
  }

  static generateFromData(data, options) {
    // Implémentation pour données structurées
    return { success: true, filename: options.filename };
  }

  static async exportToDOCX(element, options) {
    // Simuler l'export DOCX
    return { success: true, format: 'doc' };
  }
}

export default PdfExportService;