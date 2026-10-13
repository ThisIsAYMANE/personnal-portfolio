import {readFile,writeFile,stat,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Window} from 'happy-dom';
import {createServer} from './serve.mjs';
import {initialResources} from './resource-budget.mjs';
import {projects} from '../src/content.js';
import {designTokens} from '../src/config.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),directory=path.join(root,'dist');
const routes=JSON.parse(await readFile(path.join(directory,'public/routes.json'))),errors=[],pages=[];
const server=createServer(directory);await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
try{
 for(const route of routes){
  const response=await fetch(`${base}/${route.path}`),html=await response.text();
  const window=new Window({url:`${base}/${route.path}`,settings:{disableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,disableIframePageLoading:true}});window.document.write(html);const doc=window.document;
  const record={route:route.path,http:response.status,language:doc.documentElement.lang,h1:doc.querySelectorAll('h1').length,main:doc.querySelectorAll('main').length,missingLocalReferences:[],missingAlt:doc.querySelectorAll('img:not([alt])').length,duplicateIds:[]};
  const ids=new Set();for(const node of doc.querySelectorAll('[id]')){if(ids.has(node.id))record.duplicateIds.push(node.id);ids.add(node.id);}
  for(const node of doc.querySelectorAll('[src],a[href],link[href]')){
   const attribute=node.hasAttribute('src')?'src':'href',value=node.getAttribute(attribute);if(!value||/^(data:|mailto:|tel:|https?:\/\/)/.test(value))continue;
   const url=new URL(value,doc.baseURI);if(url.origin!==base)continue;
   let relative=decodeURIComponent(url.pathname).replace(/^\//,'')||'index.html';if(relative.endsWith('/'))relative+='index.html';
   try{const info=await stat(path.join(directory,relative));if(!info.isFile())throw Error('Not a file');if(url.hash){const targetHtml=relative===route.path?html:await readFile(path.join(directory,relative),'utf8');const id=url.hash.slice(1);if(!targetHtml.includes(`id="${id}"`))throw Error('Missing anchor');}}
   catch{record.missingLocalReferences.push(value);}
  }
  if(record.http!==200||record.h1!==1||record.main!==1||record.language!==route.language||record.missingAlt||record.duplicateIds.length||record.missingLocalReferences.length)errors.push(record);
  pages.push(record);window.close();
 }
 const missing=await fetch(base+'/a-page-that-does-not-exist');const missingHtml=await missing.text();if(missing.status!==404||!missingHtml.includes('not-found')||!missingHtml.includes('<base href="/">'))errors.push('Themed 404');
 for(const project of projects.filter(p=>p.video)){const response=await fetch(`${base}/${project.video}`,{headers:{Range:'bytes=100-199'}});if(response.status!==206||(await response.arrayBuffer()).byteLength!==100)errors.push('Video range: '+project.id);}
}finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
const sha=async file=>createHash('sha256').update(await readFile(path.join(root,file))).digest('hex');
const manifest=JSON.parse(await readFile(path.join(root,'public/asset-manifest.json')));
const resumes=[];for(const lang of ['EN','FR']){const delivery=`public/cv/Aymane-Maali-${lang}.pdf`,expected=manifest.resumes.find(entry=>entry.file===delivery)?.sha256,same=Boolean(expected)&&expected===await sha(delivery)&&expected===await sha('dist/'+delivery);resumes.push({language:lang,delivery,unchanged:same,reference:'Recorded original SHA-256 in public/asset-manifest.json'});if(!same)errors.push('Résumé bytes '+lang);}
const rgb=hex=>hex.replace('#','').match(/../g).slice(0,3).map(n=>parseInt(n,16)/255);
const luminance=color=>color.map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const values=[luminance(a),luminance(b)].sort((a,b)=>b-a);return Number(((values[0]+.05)/(values[1]+.05)).toFixed(2));};
const composite=(top,bottom,alpha)=>top.map((v,i)=>v*alpha+bottom[i]*(1-alpha));
// Deliberately bound the decorative underlay as white, including a bright particle.
const maximumTile=composite(rgb('#33243a'),[1,1,1],230/255),hoverTile=composite(rgb('#21172d'),[1,1,1],245/255);
const contrastChecks=[['Body / base',rgb(designTokens.secondary),rgb(designTokens.bg)],['Muted / base',rgb(designTokens.muted),rgb(designTokens.bg)],['Primary button',rgb(designTokens.bg),rgb(designTokens.lavender)],['Skill label / brightest bounded tile',rgb(designTokens.secondary),maximumTile],['Skill hover / brightest bounded tile',rgb(designTokens.text),hoverTile]].map(([label,text,background])=>({label,ratio:contrast(text,background),normalTextTarget:4.5,passed:contrast(text,background)>=4.5}));
if(contrastChecks.some(c=>!c.passed))errors.push('Nominal/composite contrast');
const icons=JSON.parse(await readFile(path.join(directory,'public/icons/icon-manifest.json'))),videos=JSON.parse(await readFile(path.join(directory,'public/media/video-manifest.json')));
const result={created:new Date().toISOString(),kind:'Filesystem, HTTP and DOM simulation evidence; no browser rendering',passed:errors.length===0,errors,pages,resumes,icons:Object.keys(icons.icons).length,videoBytes:videos.reduce((n,v)=>n+v.bytes,0),budget:await initialResources(directory),contrast:{kind:'WCAG luminance arithmetic for specified solid/composite surfaces; complete rendered-state audit pending',checks:contrastChecks},pending:['Actual WebGL shader compilation and GPU appearance','Browser visual comparison and Figma import/prototype playback','Real phone/touch/zoom/safe-area checks','Rendered composite contrast outside these modelled surfaces','LCP/INP/CLS, browser waterfalls and GPU/thermal profiles','Print preview and output','LinkedIn in an actual browser']};
await mkdir(path.join(root,'.analysis'),{recursive:true});await writeFile(path.join(root,'.analysis/local-verification.json'),JSON.stringify(result,null,2));
console.log(`${pages.length} generated pages checked; ${errors.length} failures. ${result.icons} icons, unchanged résumés and video ranges checked.`);if(errors.length){console.error(JSON.stringify(errors,null,2));process.exitCode=1;}
