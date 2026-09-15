/**
 * Local Web Server & API for Grade 4 Programming Homework Portal
 * Built with Node.js standard library (zero external dependencies).
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

// Helper: Read HTML header to extract student name and package details
function extractHeaderDataFromHtml(htmlContent, fallbackFileName) {
  let studentName = null;
  let packageBadge = null;
  let studentMeta = null;

  // 1. Check meta-table format (as provided in user's template)
  const tableMatch = htmlContent.match(/Student\s*Name:?\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
  if (tableMatch) {
    const extracted = tableMatch[1].replace(/<[^>]+>/g, '').trim();
    if (extracted && !extracted.includes('___')) {
      studentName = extracted;
    }
  }

  // 2. Check <header ...> ... </header>
  const headerMatch = htmlContent.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
  const headerText = headerMatch ? headerMatch[1] : htmlContent;

  if (!studentName) {
    const nameMatch = headerText.match(/<h1[^>]*class=["'][^"']*student-name[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i) ||
                      headerText.match(/class=["'][^"']*student-name[^"']*["'][^>]*>([\s\S]*?)<\/[a-z0-9]+>/i);
    if (nameMatch) {
      studentName = nameMatch[1].replace(/<[^>]+>/g, '').trim();
    }
  }

  // Fallback to title
  if (!studentName) {
    const titleMatch = htmlContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch) {
      studentName = titleMatch[1].split('-')[0].trim();
    }
  }

  return {
    file: fallbackFileName,
    studentName: studentName || fallbackFileName.replace('.html', ''),
    packageBadge: packageBadge || 'PACKAGE',
    studentMeta: studentMeta || ''
  };
}


const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalize spaces or dashes for homework folders (support both "homework 1" and "homework-1")
  pathname = pathname.replace(/\/homework\s+(\d+)/gi, '/homework-$1');

  // API Route: /api/homework/:id -> Scan homework folder and return packages with extracted header names
  if (pathname.startsWith('/api/homework/')) {
    const hwFolder = pathname.replace('/api/homework/', '').replace(/^\/+|\/+$/g, '');
    const safeHwFolder = hwFolder.replace(/[^a-zA-Z0-9-_]/g, '');
    const dirPath = path.join(__dirname, 'homework', safeHwFolder);

    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Homework folder not found' }));
      return;
    }

    try {
      const files = fs.readdirSync(dirPath);
      const packageFiles = files
        .filter(f => f.endsWith('.html') && f.toLowerCase() !== 'index.html')
        .sort((a, b) => {
          const numA = parseInt(a.replace(/\D/g, '') || '0', 10);
          const numB = parseInt(b.replace(/\D/g, '') || '0', 10);
          return numA - numB;
        });

      const packageData = packageFiles.map(file => {
        const fullFilePath = path.join(dirPath, file);
        const content = fs.readFileSync(fullFilePath, 'utf8');
        return extractHeaderDataFromHtml(content, file);
      });

      res.writeHead(200, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(packageData, null, 2));
      return;
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
      return;
    }
  }

  // Handle Root and Directory Indexes
  if (pathname === '/') {
    pathname = '/index.html';
  } else if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(__dirname, safePath);

  // If path is a directory without trailing slash, check for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>404 - Page Not Found</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 50px; background: #f8fafc; color: #334155; }
            h1 { color: #e11d48; font-size: 2.5rem; }
            a { color: #3b82f6; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>404</h1>
          <p>The requested homework page or file was not found.</p>
          <p><a href="/">Return to Main Portal Home</a></p>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Cache-Control': 'no-cache'
    });

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=============================================================`);
  console.log(`🚀 Grade 4 Elementary Programming Portal (Academic Year 26/27)`);
  console.log(`🌐 Server running at: http://0.0.0.0:${PORT}`);
  console.log(`📁 Homework folders: 1 to 16 ready with student packages`);
  console.log(`=============================================================`);
});

