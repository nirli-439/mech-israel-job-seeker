import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'afeka';
const DATA_FILE = path.resolve('data/job-sources.json');

app.use(cors());
app.use(express.json());

// Ensure data directory and file exist
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

// GET job sources
app.get('/api/job-sources', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to read job sources.' });
  }
});

// POST job sources (admin only)
app.post('/api/job-sources', (req, res) => {
  const { password, sources } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!Array.isArray(sources)) {
    return res.status(400).json({ error: 'Invalid sources format' });
  }
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(sources, null, 2), 'utf-8');
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save job sources.' });
  }
});

app.listen(PORT, () => {
  console.log(`Fevo backend running on port ${PORT}`);
}); 