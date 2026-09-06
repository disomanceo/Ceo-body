import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const base=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
http.createServer(async(req,res)=>{
 try{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/, '');
 const target=path.resolve(base,relative);
 if(!target.startsWith(base+path.sep)){res.writeHead(403);return res.end('Forbidden');}
 if(!(await stat(target)).isFile()){res.writeHead(404);return res.end('Not found');}
 const bytes=await readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});res.end(bytes);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(5188,'127.0.0.1',()=>console.log('Ceo-body ready: http://localhost:5188')).on('error',e=>{console.error(e.code==='EADDRINUSE'?'Port 5188 is in use. Open http://localhost:5188 if Ceo-body is already running.':e.message);process.exitCode=1;});
