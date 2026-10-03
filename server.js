import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Redirect clean URLs to .html files
app.get('/learning', (req, res) => {
  res.redirect('/Context.html');
});

app.get('/formats', (req, res) => {
  res.redirect('/formats.html');
});

// Handle /context root redirect to Context.html
app.get('/context', (req, res) => {
  res.redirect('/Context.html');
});

// Serve static assets and html files
app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 Fallback for unmatched routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
