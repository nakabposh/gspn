import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// DEV SERVER MUST RUN ON PORT 3000 (proxy target for container nginx)
const PORT = 3000;

// Support JSON with large body size for base64 image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoints for Cloud Run & container orchestration
app.get(['/health', '/healthz', '/_health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// Serve static assets and html files directly
app.use(express.static(__dirname, {
  extensions: ['html', 'htm']
}));

// Initialize Gemini Client
let ai = null;
try {
  ai = new GoogleGenAI();
} catch (e) {
  console.warn('GoogleGenAI initialization warning:', e.message);
}

// API endpoint for image extraction (pasted screenshots / photos of GSPN tables)
app.post('/api/extract-image', async (req, res) => {
  try {
    const { image, mimeType = 'image/jpeg', slot = 'mrng' } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    if (!ai) {
      ai = new GoogleGenAI();
    }

    // Strip data URI scheme prefix
    const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');

    const promptText = `You are an expert Samsung Service Portal (GSPN) data extractor.
Analyze this image. It contains either:
1) A GSPN service order call grid or report table (2-row or 1-row table with SO numbers, customer, model, service types).
2) A Closure Tracking Report table with categories (REF, WM, AC, MWO, CTV, AUD, DW, HHP, IT, IIDM, CC) and numbers for Morning, Flow, Workload, Current, Closed.

Extract ALL calls and rows with 100% accuracy. Do NOT miss or drop any call.
Output MUST be strict JSON matching this schema:
{
  "type": "calls_grid",
  "records": [
    {
      "no": 1,
      "so": "4443295834",
      "ascJob": "4443295834",
      "model": "AR18CY3AAGB",
      "product": "AC",
      "customer": "Customer Name",
      "city": "ERNAKULAM",
      "svcType": "IN-HOME",
      "status": "Assigned to Service Center"
    }
  ],
  "summaryRows": [
    {
      "category": "REF",
      "mrng": 0,
      "flow": 0,
      "workload": 0,
      "current": 0,
      "closed": 0,
      "closerPct": 0
    }
  ],
  "detectedCount": 0
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            },
            {
              text: promptText
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const resultText = response.text;
    const parsedData = JSON.parse(resultText);
    return res.json(parsedData);
  } catch (err) {
    console.error('Error in /api/extract-image:', err);
    return res.status(500).json({ error: err.message || 'Image processing failed' });
  }
});

// Direct file handlers for clean aliases (no redirects to avoid redirect loops)
app.get('/learning', (req, res) => {
  res.sendFile(path.join(__dirname, 'Context.html'));
});

app.get('/formats', (req, res) => {
  res.sendFile(path.join(__dirname, 'formats.html'));
});

// API endpoint for Universal Context
app.get(['/api/context', '/api/branches'], (req, res) => {
  res.sendFile(path.join(__dirname, 'context.json'));
});

// Direct file handlers for Cancellation Report
app.get(['/cancellation', '/cancellation.html', '/cancellationreport', '/cancellationreport.html', '/cancellationReport.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'cancellationReport.html'));
});

app.get('/context', (req, res) => {
  res.sendFile(path.join(__dirname, 'Context.html'));
});

// Manpower JSON API: Auto-get and save manpower details
const MANPOWER_FILE = path.join(__dirname, 'context', 'manpower.json');

app.get('/api/manpower', (req, res) => {
  try {
    if (fs.existsSync(MANPOWER_FILE)) {
      const data = fs.readFileSync(MANPOWER_FILE, 'utf8');
      return res.json({ success: true, data: JSON.parse(data), source: 'server_disk', lastModified: fs.statSync(MANPOWER_FILE).mtime });
    }
    return res.json({ success: true, data: [], source: 'empty' });
  } catch (err) {
    console.error('Error reading manpower.json:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/manpower', (req, res) => {
  try {
    const list = Array.isArray(req.body) ? req.body : (req.body.manpower || req.body.data || []);
    const dir = path.dirname(MANPOWER_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(MANPOWER_FILE, JSON.stringify(list, null, 2), 'utf8');
    return res.json({ success: true, count: list.length, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Error saving manpower.json:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Direct file handlers for SVC Information subpage of Context
app.get(['/svcinformation', '/svcinformation.html', '/svcInformation', '/svcInformation.html', '/context/svcinformation.html', '/context/svcInformation.html', '/svc-information'], (req, res) => {
  res.sendFile(path.join(__dirname, 'svcInformation.html'));
});

// Direct file handlers for SVC Closer (case-insensitive direct sendFile)
app.get(['/svc/closer', '/svc/closer.html', '/SVC/closer', '/SVC/closer.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'SVC', 'Closer.html'));
});

app.get(['/closer', '/closer.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'closer.html'));
});

// Direct file handlers for Report Maker (case-insensitive aliases)
app.get(['/reportmaker', '/reportmaker.html', '/ReportMaker', '/ReportMaker.html', '/reportmaking', '/reportmaking.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'reportMaking.html'));
});

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 Fallback for unmatched routes
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Primary listener (required for AI Studio Dev Nginx proxy on port 3000)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
  console.log(`  > Local:   http://localhost:${PORT}/`);
  console.log(`  > Network: http://0.0.0.0:${PORT}/`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} already in use, primary process active.`);
  } else {
    console.error(`Server error on port ${PORT}:`, err);
  }
});
