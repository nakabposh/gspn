import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Redirect learning to Context.html
app.get(['/learning', '/learning.html'], (req, res) => {
  res.redirect('/Context.html');
});

// Redirect formats to /context/formats.html
app.get(['/formats', '/formats.html'], (req, res) => {
  res.redirect('/context/formats.html');
});

// Handle /context root redirect to Context.html
app.get('/context', (req, res) => {
  res.redirect('/Context.html');
});

// Serve static assets and html files
app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));

// Fallback to index.html for root or missing routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
