export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const body = req.body || {};
  const prompt = body.prompt || '';
  if (!prompt || String(prompt).trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Prompt required' });
  }

  // Optional OpenAI fallback when key is provided via Vercel env
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (OPENAI_API_KEY) {
    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 512
        })
      });
      if (!resp.ok) {
        const text = await resp.text();
        return res.status(500).json({ success: false, error: `OpenAI error: ${resp.status} ${text}` });
      }
      const data = await resp.json();
      const text = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
      return res.json({ success: true, response: text || 'No response' });
    } catch (err) {
      return res.status(500).json({ success: false, error: String(err) });
    }
  }

  // Simple rule-based fallback (works without external services)
  const msg = prompt.toLowerCase();
  let reply = "Je ne suis pas sûr de comprendre votre question. Essayez: 'Créer un CV', 'Exporter', 'Compétences'.";
  if (msg.includes('créer') || msg.includes('nouveau')) reply = 'Pour créer un nouveau CV, utilisez le bouton Créer un CV.';
  if (msg.includes('compétence') || msg.includes('skill')) reply = 'Compétences exemples: React, Python, SQL, Gestion de projet.';
  if (msg.includes('exporter') || msg.includes('export')) reply = 'Utilisez le bouton Exporter en PDF depuis la carte ou l\'aperçu.';

  return res.json({ success: true, response: reply });
}
