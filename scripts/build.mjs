import {mkdir,readFile,writeFile,cp,stat,readdir,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {renderDocument} from '../src/render.js';
import {projects,copy,skills,contact} from '../src/content.js';
import {validateContent,projectHref,archiveHref} from '../src/routes.js';
import {designTokens,effectsConfig} from '../src/config.js';
import {initialResources} from './resource-budget.mjs';
import {deploymentSettings,deploymentDocument} from './deployment.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),output=path.join(root,'dist');
const errors=validateContent({projects,skills,copy,contact});if(errors.length)throw Error('Content validation: '+errors.join(', '));
const deployment=deploymentSettings(),{siteURL,noindex}=deployment;
await mkdir(path.join(root,'.analysis'),{recursive:true});
// dist is this project's generated output; check its exact resolved boundary before cleaning.
if(path.dirname(output)!==root||path.basename(output)!=='dist')throw Error('Unexpected output boundary');
await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});const routes=[];
async function emit(relative,lang,options={}){
 const final=deploymentDocument(renderDocument(lang,options),relative,deployment);
 for(const base of [root,output]){const file=path.join(base,relative);await mkdir(path.dirname(file),{recursive:true});await writeFile(file,final);}
 routes.push({path:relative,language:lang,page:options.page||'home',project:options.id||null});
}
for(const lang of ['en','fr']){await emit(lang==='en'?'index.html':'fr.html',lang);await emit(archiveHref(lang),lang,{page:'archive'});for(const p of projects)await emit(projectHref(p.id,lang),lang,{page:'case',id:p.id});}
await emit('404.html','en',{page:'404'});
await cp(path.join(root,'styles.css'),path.join(output,'styles.css'));await cp(path.join(root,'src'),path.join(output,'src'),{recursive:true});
const publicFiles=new Set(['public/favicon.svg','public/social-preview.png','public/asset-manifest.json','public/media/video-manifest.json','public/cv/Aymane-Maali-EN.pdf','public/cv/Aymane-Maali-FR.pdf']);
for(const p of projects){for(const image of [p.cover,...p.gallery]){publicFiles.add(image);for(const width of [480,800,1200])publicFiles.add(`public/media/responsive/${image.split('/').pop().replace('.webp','')}-${width}.webp`);}if(p.video)publicFiles.add(p.video);}
for(const file of await readdir(path.join(root,'public/icons')))publicFiles.add('public/icons/'+file);
for(const file of publicFiles){await mkdir(path.dirname(path.join(output,file)),{recursive:true});await cp(path.join(root,file),path.join(output,file));}
await mkdir(path.join(output,'assets/fonts'),{recursive:true});for(const file of ['Rengok.ttf','BROGETTA-Regular.otf','rengok-license.txt','brogetta-license.pdf'])await cp(path.join(root,'assets/fonts',file),path.join(output,'assets/fonts',file));
await writeFile(path.join(root,'public/routes.json'),JSON.stringify(routes,null,2));await writeFile(path.join(output,'public/routes.json'),JSON.stringify(routes,null,2));
await writeFile(path.join(root,'.analysis/figma-content-v2.json'),JSON.stringify({projects,skills,copy,contact,designTokens,effectsConfig},null,2));
if(siteURL&&!noindex){const sitemap=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.filter(r=>r.page!=='404').map(r=>`<url><loc>${new URL(r.path==='index.html'?'':r.path,siteURL).href}</loc></url>`).join('')}</urlset>`;await writeFile(path.join(output,'sitemap.xml'),sitemap);}
await writeFile(path.join(output,'robots.txt'),`User-agent: *\n${noindex?'Disallow: /':'Allow: /'}\n${siteURL&&!noindex?'Sitemap: '+new URL('sitemap.xml',siteURL).href+'\n':''}`);
const budget=await initialResources(output);await writeFile(path.join(root,'.analysis/resource-budget.json'),JSON.stringify(budget,null,2));
console.log(`Built ${routes.length} static pages in ${output}`);console.log(`Static HTML/CSS/module graph/fonts: ${(budget.bytes/1024).toFixed(0)} KiB raw; ${(budget.gzipBytes/1024).toFixed(0)} KiB gzip estimate. Deferred orb/media excluded; browser transfer pending.`);
