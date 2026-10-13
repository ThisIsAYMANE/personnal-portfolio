import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {gzipSync} from 'node:zlib';

// Count the static import graph; lazy import() renderers and user media are separate.
export async function initialResources(directory){
 const modules=new Set();
 async function visit(relative){
  if(modules.has(relative))return;modules.add(relative);
  const source=await readFile(path.join(directory,relative),'utf8');
  const imports=[...source.matchAll(/\b(?:import\s+(?:[^;'"\n]*?\s+from\s*)?|export\s+(?:\*|\{[^}]*\})(?:\s+as\s+\w+)?\s+from\s*)['"]([^'"]+)['"]/g)];
  for(const [,specifier] of imports)if(specifier.startsWith('.'))await visit(path.posix.normalize(path.posix.join(path.posix.dirname(relative),specifier)));
 }
 await visit('src/main.js');
 const files=['index.html','styles.css',...modules,'assets/fonts/Rengok.ttf','assets/fonts/BROGETTA-Regular.otf'];
 const entries=await Promise.all(files.map(async file=>{const buffer=await readFile(path.join(directory,file));return{file,bytes:buffer.length,gzipBytes:gzipSync(buffer,{level:9}).length};}));
 return{kind:'Static resource inventory; not an observed browser waterfall',entries,bytes:entries.reduce((n,e)=>n+e.bytes,0),gzipBytes:entries.reduce((n,e)=>n+e.gzipBytes,0),fontBytes:entries.filter(e=>e.file.startsWith('assets/fonts/')).reduce((n,e)=>n+e.bytes,0),excluded:'Deferred orb module, lazy icons/images, optional/user-triggered videos, response headers and caching. Actual request order and transfer require a browser.'};
}
