const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('build'));

// Simple sample resumes (keeps API working without CSV)
const SAMPLE_RESUMES = [
  {
    id: 'sample-1',
    title: 'Développeur Frontend',
    summary: 'Développeur React spécialisé en interfaces performantes.',
    skills: ['React','TypeScript','CSS'],
    experience: '3 years',
    category: 'IT',
    fullText: 'Sample resume 1 full text',
    html: ''
  },
  {
    id: 'sample-2',
    title: 'Data Analyst Junior',
    summary: 'Analyste de données avec Excel et SQL.',
    skills: ['SQL','Python','Tableau'],
    experience: '2 years',
    category: 'Data',
    fullText: 'Sample resume 2 full text',
    html: ''
  },
  {
    id: 'sample-3',
    title: 'Chef de Projet',
    summary: 'Gestion de projets IT et coordination d\'équipes.',
    skills: ['Gestion','Agile','Communication'],
    experience: '5 years',
    category: 'Management',
    fullText: 'Sample resume 3 full text',
    html: ''
  },
  {
    id: 'sample-4',
    title: 'Designer UX',
    summary: 'Conception d\'interfaces centrées utilisateur.',
    skills: ['Figma','UX Research','Prototyping'],
    experience: '4 years',
    category: 'Design',
    fullText: 'Sample resume 4 full text',
    html: ''
  },
  {
    id: 'sample-5',
    title: 'Technicien Réseau',
    summary: 'Administration réseaux et support.',
    skills: ['TCP/IP','Firewall','Linux'],
    experience: '6 years',
    category: 'IT',
    fullText: 'Sample resume 5 full text',
    html: ''
  }
];

app.get('/api/resumes', (req, res) => {
  res.json({ success: true, count: SAMPLE_RESUMES.length, data: SAMPLE_RESUMES });
});

app.get('/api/resumes/:id', (req, res) => {
  const resume = SAMPLE_RESUMES.find(r => r.id === req.params.id);
  if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });
  res.json({ success: true, data: resume });
});

// Assistant endpoint: if a local LLM command is provided via env LLM_CMD, execute it.
// Otherwise return a simple rule-based reply (keeps app working). Configure LLM_CMD to point
// to a local CLI that accepts the prompt as an argument or use a wrapper script.
const { exec } = require('child_process');
app.post('/api/assistant', express.json(), (req, res) => {
  const prompt = req.body && req.body.prompt ? String(req.body.prompt) : '';
  if (!prompt) return res.status(400).json({ success: false, error: 'Prompt required' });

  const LLM_CMD = process.env.LLM_CMD; // e.g. path to a local wrapper script
  if (LLM_CMD) {
    // Escape double quotes in prompt
    const safePrompt = prompt.replace(/"/g, '\\"');
    const cmd = `${LLM_CMD} "${safePrompt}"`;
    exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
      if (err) {
        console.error('LLM command error:', err, stderr);
        return res.status(500).json({ success: false, error: 'LLM execution failed', details: stderr || err.message });
      }
      return res.json({ success: true, response: stdout.toString() });
    });
  } else {
    // Simple rule-based fallback (same logic as previous Assistant)
    const msg = prompt.toLowerCase();
    let reply = "Je ne suis pas sûr de comprendre votre question. Essayez: 'Créer un CV', 'Exporter', 'Compétences'.";
    if (msg.includes('créer') || msg.includes('nouveau')) reply = 'Pour créer un nouveau CV, utilisez le bouton Créer un CV.';
    if (msg.includes('compétence') || msg.includes('skill')) reply = 'Compétences exemples: React, Python, SQL, Gestion de projet.';
    if (msg.includes('exporter') || msg.includes('export')) reply = 'Utilisez le bouton Exporter en PDF depuis la carte ou l\'aperçu.';
    return res.json({ success: true, response: reply });
  }
});

// API endpoint pour obtenir un CV spécifique
// Note: the app previously attempted to read a large CSV file for individual resumes.
// That CSV is no longer tracked. Fall back to the in-memory `SAMPLE_RESUMES` for
// requests for a specific resume ID so the API works reliably for local testing.
app.get('/api/resumes/:id', (req, res) => {
  const resume = SAMPLE_RESUMES.find(r => r.id === req.params.id);
  if (!resume) return res.status(404).json({ success: false, error: 'Resume not found' });
  res.json({ success: true, data: resume });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  const buildPath = path.join(__dirname, 'build', 'index.html');
  if (fs.existsSync(buildPath)) {
    res.sendFile(buildPath);
  } else {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/resumes`);
});
