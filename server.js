const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Setup DNS servers to resolve MongoDB Atlas and other external services locally if needed
try {
  require('dns').setServers(['8.8.8.8']);
} catch (e) {
  // Ignore DNS config failure
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Handle routing for static files or admin
  let filePath = '';
  if (pathname === '/' || pathname === '/index.html') {
    filePath = path.join(__dirname, 'index.html');
  } else if (pathname === '/admin' || pathname === '/admin.html') {
    filePath = path.join(__dirname, 'admin.html');
  } else if (pathname.startsWith('/css/') || pathname.startsWith('/js/')) {
    filePath = path.join(__dirname, pathname);
  }

  // If we have a file path, serve the static file
  if (filePath) {
    // Replace URL encoded characters with their normal form (e.g. %20 -> space)
    const decodedFilePath = decodeURIComponent(filePath);
    fs.exists(decodedFilePath, (exists) => {
      if (!exists) {
        res.statusCode = 404;
        res.end('File Not Found');
        return;
      }

      // Detect content type
      let contentType = 'text/html';
      if (decodedFilePath.endsWith('.css')) contentType = 'text/css';
      else if (decodedFilePath.endsWith('.js')) contentType = 'application/javascript';

      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(decodedFilePath).pipe(res);
    });
    return;
  }

  // Handle API routing
  if (pathname.startsWith('/api/')) {
    const apiName = pathname.slice(5); // remove '/api/'
    const apiPath = path.join(__dirname, 'api', `${apiName}.js`);

    if (fs.existsSync(apiPath)) {
      // Decorate res to support Vercel serverless helper methods
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };
      res.json = (data) => {
        res.writeHead(res.statusCode || 200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
        return res;
      };

      // Decorate req
      req.query = parsedUrl.query;

      // Read request body
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        if (body) {
          try {
            req.body = JSON.parse(body);
          } catch (e) {
            req.body = body;
          }
        } else {
          req.body = {};
        }

        // Execute Vercel serverless function
        try {
          delete require.cache[require.resolve(apiPath)];
          const handler = require(apiPath);
          handler(req, res).catch(err => {
            console.error(`Error in API ${apiName}:`, err);
            res.status(500).json({ error: 'Internal Server Error: ' + err.message });
          });
        } catch (err) {
          console.error(`Failed to load API ${apiName}:`, err);
          res.status(500).json({ error: 'Failed to load API: ' + err.message });
        }
      });
      return;
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'API Endpoint Not Found' }));
      return;
    }
  }

  // Fallback to 404
  res.statusCode = 404;
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Local Development Server running at http://localhost:${PORT}`);
});
