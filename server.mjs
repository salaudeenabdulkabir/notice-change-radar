import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8' };
const publicPaths = new Set(['/index.html', '/styles.css', '/src/app.js', '/src/compare.js', '/src/sample.js']);
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const route = pathname === '/' ? '/index.html' : pathname;
    if (!publicPaths.has(route)) { response.writeHead(404).end('Not found'); return; }
    const file = resolve(root, `.${route}`);
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' }).end(body);
  } catch { response.writeHead(404).end('Not found'); }
}).listen(port, () => console.log(`Notice Change Radar: http://localhost:${port}`));
