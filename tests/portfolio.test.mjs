import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {renderDocument,renderProject,escapeHTML} from '../src/render.js';
import {projects,copy,skills} from '../src/content.js';
import {scrollProgress,projectScrollTarget,effectiveReducedMotion} from '../src/motion.js';
import {createServer,parseRange} from '../scripts/serve.mjs';

test('English and French pages include all five real projects and primary actions',()=>{
 for(const lang of ['en','fr']){const html=renderDocument(lang);assert.ok(html.includes(`<html lang="${lang}">`));for(const p of projects)assert.ok(html.includes(`id="project-title-${p.id}"`));for(const id of ['about','services','experience','work','toolkit','contact'])assert.ok(html.includes(`id="${id}"`));assert.ok(html.includes('mailto:maaliaymane24@gmail.com'));assert.ok(html.includes('Aymane-Maali-EN.pdf'));assert.ok(html.includes('Aymane-Maali-FR.pdf'));assert.ok(html.includes(copy[lang].available));assert.ok(!html.includes('Atlas'));assert.ok(!html.includes('yourdomain'));}
});
test('Case studies include contributions and defer video downloads',()=>{
 for(const p of projects){for(const lang of ['en','fr']){const html=renderProject(p.id,lang);assert.ok(html.includes(p.name));assert.ok(html.includes(copy[lang].projectDetails));if(p.video){assert.ok(html.includes('preload="none"'));assert.ok(html.includes('playsinline'));assert.ok(!html.includes('autoplay'));}}}
 assert.equal(renderProject('unknown'),'');assert.equal(escapeHTML('<script>"&'), '&lt;script&gt;&quot;&amp;');
});
test('All asset references resolve to local files',async()=>{
 const paths=new Set(['assets/fonts/Rengok.ttf','assets/fonts/BROGETTA-Regular.otf','public/cv/Aymane-Maali-EN.pdf','public/cv/Aymane-Maali-FR.pdf','public/favicon.svg','public/social-preview.png']);
 for(const p of projects){paths.add(p.cover);for(const image of p.gallery)paths.add(image);if(p.video)paths.add(p.video);}
 for(const p of paths)assert.ok((await stat(new URL('../'+p,import.meta.url))).size>0,p);
});
test('Scroll choreography clamps before entry and after exit',()=>{
 assert.equal(scrollProgress(100,3000,700),0);assert.equal(scrollProgress(-1150,3000,700),.5);assert.equal(scrollProgress(-4000,3000,700),1);assert.equal(scrollProgress(0,500,700),0);assert.equal(projectScrollTarget(2,5,1000,4000),3000);
});
test('Reduced motion follows OS unless explicitly overridden',()=>{
 assert.equal(effectiveReducedMotion(null,true),true);assert.equal(effectiveReducedMotion('full',true),false);assert.equal(effectiveReducedMotion('reduced',false),true);assert.equal(effectiveReducedMotion(null,false),false);
});
test('Video ranges support seeking and reject invalid ranges',()=>{
 assert.deepEqual(parseRange('bytes=100-199',1000),{start:100,end:199});assert.deepEqual(parseRange('bytes=-100',1000),{start:900,end:999});assert.deepEqual(parseRange('bytes=900-',1000),{start:900,end:999});assert.equal(parseRange('bytes=2000-',1000),false);assert.equal(parseRange('bytes=3-1',1000),false);assert.equal(parseRange(null,1000),null);
});
test('Local server serves pages, fonts, CVs and seekable video; private files stay outside its routes',async()=>{
 const server=createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base=`http://127.0.0.1:${server.address().port}`;
 try{for(const p of ['/','/styles.css','/src/main.js','/assets/fonts/Rengok.ttf','/public/cv/Aymane-Maali-FR.pdf']){const r=await fetch(base+p);assert.equal(r.status,200,p);await r.arrayBuffer();}const video=await fetch(base+'/public/media/freebet.mp4',{headers:{Range:'bytes=0-99'}});assert.equal(video.status,206);assert.equal((await video.arrayBuffer()).byteLength,100);assert.equal((await fetch(base+'/contacts.md')).status,404);assert.equal((await fetch(base+'/public/%2e%2e/contacts.md')).status,404);}
 finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
