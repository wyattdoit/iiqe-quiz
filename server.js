// IIQE 刷题应用本地预览服务器（零依赖）
const http = require('http');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
let host = '127.0.0.1';
let port = 7100;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--host' || args[i] === '-H') host = args[++i];
  else if (args[i] === '--port' || args[i] === '-p') port = parseInt(args[++i], 10);
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.join(__dirname, p);
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not Found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(port, host, () => {
  console.log(`IIQE 刷题应用已启动: http://${host}:${port}/`);
});
