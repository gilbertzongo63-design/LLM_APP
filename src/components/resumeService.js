const API_BASE = '/api';

export const resumeService = {
  // Créer un CV
  createResume: async (resumeData) => {
    try {
      const savedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
      const newResume = {
        id: Date.now().toString(),
        ...resumeData,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        summary: resumeData.summary || 'No summary available',
        skills: resumeData.skills ? resumeData.skills.split(',').map(s => s.trim()) : [],
        experience: resumeData.experience || '',
        category: resumeData.category || 'HR',
        title: resumeData.title || `CV ${resumeData.fullName || ''}`.trim()
      };
      
      savedResumes.push(newResume);
      localStorage.setItem('resumes', JSON.stringify(savedResumes));
      
      return { success: true, resume: newResume };
    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
    }
  },

  // Récupérer tous les CVs
  getAllResumes: async () => {
    try {
      // Essayer de récupérer du localStorage d'abord
      const savedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
      
      // Si aucun dans localStorage, créer des exemples
      if (savedResumes.length === 0) {
        const exampleResumes = [
          {
            id: '1',
            title: 'CV Développeur Full Stack',
            fullName: 'Jean Dupont',
            email: 'jean.dupont@email.com',
            phone: '+33 1 23 45 67 89',
            summary: 'Développeur Full Stack avec 5 ans d\'expérience en React et Node.js. Passionné par les technologies web modernes.',
            experience: '5 ans',
            skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB'],
            category: 'IT',
            created: '2024-01-15'
          },
          {
            id: '2',
            title: 'CV Responsable RH',
            fullName: 'Marie Martin',
            email: 'marie.martin@email.com',
            phone: '+33 6 12 34 56 78',
            summary: 'Responsable RH avec 8 ans d\'expérience en recrutement et gestion des talents.',
            experience: '8 ans',
            skills: ['Recrutement', 'Gestion des talents', 'Paie', 'Formation'],
            category: 'HR',
            created: '2024-01-10'
          }
        ];
        localStorage.setItem('resumes', JSON.stringify(exampleResumes));
        return exampleResumes;
      }
      
      return savedResumes;
    } catch (error) {
      console.error('Error getting resumes:', error);
      return [];
    }
  },

  // Récupérer un CV par ID
  getResumeById: async (id) => {
    try {
      const savedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
      return savedResumes.find(resume => resume.id === id) || null;
    } catch (error) {
      console.error('Error getting resume:', error);
      return null;
    }
  },

  // Mettre à jour un CV
  updateResume: async (id, resumeData) => {
    try {
      const savedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
      const index = savedResumes.findIndex(resume => resume.id === id);
      
      if (index === -1) {
        throw new Error('Resume not found');
      }
      
      const updatedResume = {
        ...savedResumes[index],
        ...resumeData,
        updated: new Date().toISOString(),
        skills: resumeData.skills ? resumeData.skills.split(',').map(s => s.trim()) : savedResumes[index].skills
      };
      
      savedResumes[index] = updatedResume;
      localStorage.setItem('resumes', JSON.stringify(savedResumes));
      
      return { success: true, resume: updatedResume };
    } catch (error) {
      console.error('Error updating resume:', error);
      throw error;
    }
  },

  // Supprimer un CV
  deleteResume: async (id) => {
    try {
      const savedResumes = JSON.parse(localStorage.getItem('resumes') || '[]');
      const filteredResumes = savedResumes.filter(resume => resume.id !== id);
      localStorage.setItem('resumes', JSON.stringify(filteredResumes));
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  },

  // Exporter en PDF
  exportToPDF: async (resumeId) => {
    try {
      const resume = await resumeService.getResumeById(resumeId);
      if (!resume) {
        throw new Error('Resume not found');
      }

      // Créer un contenu HTML pour le PDF
      const pdfContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h1>${resume.title}</h1>
          <h2>${resume.fullName}</h2>
          <p><strong>Email:</strong> ${resume.email}</p>
          <p><strong>Téléphone:</strong> ${resume.phone}</p>
          <p><strong>Catégorie:</strong> ${resume.category}</p>
          
          <h3>Résumé</h3>
          <p>${resume.summary}</p>
          
          <h3>Expérience</h3>
          <p>${resume.experience}</p>
          
          <h3>Compétences</h3>
          <ul>
            ${resume.skills.map(skill => `<li>${skill}</li>`).join('')}
          </ul>
          
          <hr>
          <p><small>Généré le ${new Date().toLocaleDateString()}</small></p>
        </div>
      `;

      return { 
        success: true, 
        content: pdfContent,
        filename: `${resume.title.replace(/\s+/g, '_')}_${Date.now()}.pdf`
      };
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  }
};

export default resumeService;