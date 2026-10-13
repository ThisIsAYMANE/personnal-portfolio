import http from 'node:http';
import {stat,readFile} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf','.ttf':'font/ttf','.otf':'font/otf','.mp4':'video/mp4','.txt':'text/plain; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8'};
export function parseRange(header,size){
 if(!header)return null;
 const m=/^bytes=(\d*)-(\d*)$/.exec(header);if(!m||(!m[1]&&!m[2]))return false;
 let start=m[1]?Number(m[1]):Math.max(0,size-Number(m[2]));
 let end=m[1]?(m[2]?Math.min(size-1,Number(m[2])):size-1):size-1;
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return false;
 return{start,end};
}
export function createServer(directory=root){return http.createServer(async(req,res)=>{
 const notFound=async()=>{try{const html=await readFile(path.join(directory,'404.html'));res.writeHead(404,{'Content-Type':'text/html; charset=utf-8','Content-Length':html.length,'X-Content-Type-Options':'nosniff'}).end(req.method==='HEAD'?undefined:html);}catch{res.writeHead(404).end(req.method==='HEAD'?undefined:'Not found');}};
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'}).end();return;}
  let relative=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/+/, '')||'index.html';
  if(relative.endsWith('/'))relative+='index.html';
  const permitted=['index.html','fr.html','404.html','styles.css'].includes(relative)||relative.startsWith('works/')||relative.startsWith('fr/works/')||relative.startsWith('src/')||relative.startsWith('public/')||relative.startsWith('assets/fonts/');
  const target=path.resolve(directory,relative);const rel=path.relative(directory,target);const canonical=rel.replace(/\\/g,'/');
  const canonicalAllowed=['index.html','fr.html','404.html','styles.css'].includes(canonical)||canonical.startsWith('works/')||canonical.startsWith('fr/works/')||canonical.startsWith('src/')||canonical.startsWith('public/')||canonical.startsWith('assets/fonts/');
  if(!permitted||!canonicalAllowed||rel.startsWith('..')||path.isAbsolute(rel)){await notFound();return;}
  const info=await stat(target);if(!info.isFile()){await notFound();return;}
  const headers={'Content-Type':types[path.extname(target)]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'};
  const range=parseRange(req.headers.range,info.size);
  if(range===false){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return;}
  if(range){headers['Content-Range']=`bytes ${range.start}-${range.end}/${info.size}`;headers['Content-Length']=range.end-range.start+1;res.writeHead(206,headers);}
  else{headers['Content-Length']=info.size;res.writeHead(200,headers);}
  if(req.method==='HEAD'){res.end();return;}
  const stream=createReadStream(target,range||undefined);stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
 }catch{if(!res.headersSent)await notFound();else res.destroy();}
});}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const port=Number(process.env.PORT)||5173;const server=createServer();
 server.listen(port,'127.0.0.1',()=>console.log(`Portfolio preview: http://127.0.0.1:${port}`));
 server.on('error',error=>{console.error(error.message);process.exitCode=1;});
 process.on('SIGINT',()=>server.close(()=>process.exit(0)));
}
