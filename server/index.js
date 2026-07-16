// Simple local proxy server to keep secrets off the client.
// Usage: copy .env.example -> .env and run `npm run start:api`.

require('dotenv').config();
const http = require('http');

const PORT = process.env.API_PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const FORM_EMAIL = process.env.FORMSUBMIT_EMAIL || 'karanihmartoh@gmail.com';
const FORM_ENDPOINT = `https://formsubmit.co/${FORM_EMAIL}`;

const defaultHeaders = {
  'Access-Control-Allow-Origin': CORS_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

function setCorsHeaders(res) {
  Object.entries(defaultHeaders).forEach(([key, value]) => res.setHeader(key, value));
}

const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/submit') {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const bodyBuffer = Buffer.concat(chunks);
      const contentType = req.headers['content-type'] || 'application/x-www-form-urlencoded';

      const fetchRes = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': contentType,
          Origin: 'http://localhost:5000',
          Referer: 'http://localhost:5000/',
        },
        body: bodyBuffer,
      });

      const text = await fetchRes.text();
      res.writeHead(fetchRes.status, { 'Content-Type': 'text/plain' });
      res.end(text);
    } catch (err) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy error', details: err.message }));
    }

    return;
  }

  // Fallback for other routes
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`API proxy listening on http://localhost:${PORT}`);
});

