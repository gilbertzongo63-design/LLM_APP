export const parseCSV = async () => {
  try {
    const response = await fetch('/data/Resume.csv');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    
    // Simple CSV parsing
    const lines = csvText.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
      return [];
    }
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }
    
    console.log('Parsed data:', data.length, 'records');
    return data;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error;
  }
};

export const extractResumeData = (resume) => {
  const resumeText = resume.Resume_str || '';
  
  // Get first line as title
  const firstLine = resumeText.split('\n').find(line => line.trim() !== '');
  const title = firstLine ? firstLine.trim() : 'No Title';
  
  // Extract summary (simple approach)
  let summary = '';
  const summaryMatch = resumeText.match(/Summary\s*(.*?)(?=\s*(?:Experience|Skills|Accomplishments|$))/is);
  if (summaryMatch && summaryMatch[1]) {
    summary = summaryMatch[1].trim();
    // Limit summary length
    if (summary.length > 200) {
      summary = summary.substring(0, 200) + '...';
    }
  }
  
  // Extract skills (simple approach)
  let skills = [];
  const skillsMatch = resumeText.match(/Skills\s*(.*?)(?=\s*(?:Experience|Education|$))/is);
  if (skillsMatch && skillsMatch[1]) {
    const skillsText = skillsMatch[1];
    // Split by commas and take first 5 items
    skills = skillsText.split(',')
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
      .slice(0, 5);
  }
  
  // Extract experience
  let experience = '';
  const expMatch = resumeText.match(/(\d+\+?\s*years?)/i);
  if (expMatch) {
    experience = expMatch[1];
  }
  
  return {
    id: resume.ID || Math.random().toString(36).substr(2, 9),
    title,
    summary: summary || 'No summary available',
    skills,
    experience,
    category: resume.Category || 'HR',
    fullText: resume.Resume_str,
    html: resume.Resume_html
  };
};