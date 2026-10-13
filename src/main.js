import {copy,projects} from './content.js';
import {ui} from './ui-copy.js';
import {renderPortfolio,renderProject} from './render.js';
import {projectHref,archiveHref,homeHref} from './routes.js';
import {storage,effectiveReducedMotion,createScheduler} from './utils.js';
import {effectsConfig} from './config.js';
import {createReveals,createDisclosures,createScroll,createCursor} from './controllers.js';
import {createHeader} from './header.js';
import {prepareOrbs} from './effects/orb-controller.js';
const $=(s,root=document)=>root.querySelector(s),$$=(s,root=document)=>[...root.querySelectorAll(s)];
const main=$('#main'),menu=$('#mobile-menu'),caseDialog=$('#project-dialog'),page=document.body.dataset.page||'home';
const os=matchMedia('(prefers-reduced-motion:reduce)');
const explicit=new URLSearchParams(location.search).get('lang');
let language=explicit||(page!=='home'||location.pathname.includes('/fr')?document.documentElement.lang:storage.get('portfolio-language'))||document.documentElement.lang;
if(!copy[language])language='en';
let preference=storage.get('portfolio-motion'),reduced=effectiveReducedMotion(preference,os.matches),contentController=null,trigger=null;
const getReduced=()=>reduced,scheduler=createScheduler(),cursor=createCursor($('.cursor-companion'),getReduced,scheduler);
const header=createHeader($('.site-header'),getReduced,scheduler,{onChange:cursor.invalidate});
function labels(){const t=copy[language];document.documentElement.lang=language;if(page==='home'){document.title=t.pageTitle;const alternate=$('link[rel="alternate"]');if(alternate){alternate.hreflang=language==='en'?'fr':'en';alternate.href=homeHref(alternate.hreflang);}$('.site-header .brand').href='#home';}
 $$('[data-i18n]').forEach(n=>n.textContent=t[n.dataset.i18n]);$$('[data-language]').forEach(n=>n.setAttribute('aria-current',n.dataset.language===language?'page':'false'));
 $('.skip-link').textContent=t.skip;$('.resume-rail').href=`public/cv/Aymane-Maali-${language.toUpperCase()}.pdf`;$('.resume-rail').setAttribute('aria-label',ui[language].downloadPdf);
 $$('[data-motion-toggle]').forEach(n=>{n.textContent=reduced?t.motionOff:t.motionOn;n.setAttribute('aria-pressed',String(reduced));n.setAttribute('aria-label',t.motionLabel);});$$('[data-year]').forEach(n=>n.textContent=new Date().getFullYear());
}
function installContent(){contentController?.dispose();const reveals=createReveals(main,getReduced),scroll=createScroll(main,getReduced,scheduler,cursor.invalidate),services=createDisclosures(main,getReduced,()=>scroll.measure()),orbs=prepareOrbs(main,getReduced,scheduler);
 contentController={refresh(){reveals.refresh();services.reset();scroll.measure();scroll.wake();orbs.reset();},dispose(){reveals.dispose();services.dispose();scroll.dispose();orbs.dispose();},measure:scroll.measure,requestMeasure:scroll.requestMeasure};
 $$('img',main).forEach(img=>{if(img.complete&&!img.naturalWidth)mediaFailure(img);});
 $$('img',main).forEach(img=>img.addEventListener('load',scroll.requestMeasure,{once:true}));
}
function motion(){reduced=effectiveReducedMotion(preference,os.matches);document.documentElement.classList.toggle('reduced-motion',reduced);document.documentElement.classList.toggle('full-motion',!reduced);labels();contentController?.refresh();cursor.reset();header.reset();scheduler.wake();}
function forceClose(dialog){if(dialog.open)dialog.close();dialog.classList.remove('closing');document.body.classList.remove('dialog-open');$('.menu-button').setAttribute('aria-expanded','false');header.reveal();}
function closeDialog(dialog){if(!dialog.open||dialog.classList.contains('closing'))return;dialog.classList.add('closing');const finish=()=>{forceClose(dialog);if(dialog===caseDialog){const video=$('video',dialog);if(video){video.pause();$$('source',video).forEach(s=>s.removeAttribute('src'));video.removeAttribute('src');video.load();}$('#case-content').innerHTML='';trigger?.focus({preventScroll:true});}cursor.reset();};if(reduced)finish();else setTimeout(finish,effectsConfig.timings.menu);}
function openMenu(){if(menu.open)return;header.reveal();menu.showModal();document.body.classList.add('dialog-open');$('.menu-button').setAttribute('aria-expanded','true');cursor.hide();}
function openProject(id,opener){if(!projects.some(p=>p.id===id))return;header.reveal();trigger=opener;$('#case-content').innerHTML=renderProject(id,language);$('.case-full').href=projectHref(id,language);caseDialog.showModal();caseDialog.scrollTop=0;document.body.classList.add('dialog-open');cursor.hide();}
function changeLanguage(next){if(!copy[next]||next===language)return;storage.set('portfolio-language',next);
 if(page!=='home'){const path=page==='case'?projectHref(document.body.dataset.projectId,next):page==='archive'?archiveHref(next):next==='fr'?'fr.html':'index.html';location.assign(new URL(path,document.baseURI).href);return;}
 const section=$$('.section[id]',main).find(n=>{const r=n.getBoundingClientRect();return r.top<innerHeight*.45&&r.bottom>innerHeight*.45;});const old=section?.getBoundingClientRect().top;
 forceClose(menu);forceClose(caseDialog);language=next;contentController?.dispose();contentController=null;main.innerHTML=renderPortfolio(language);labels();installContent();motion();
 const desc=$('meta[name="description"]');if(desc)desc.content=copy[next].description;$('meta[property="og:title"]').content=copy[next].pageTitle;$('meta[property="og:description"]').content=copy[next].description;
 if(section){const replacement=document.getElementById(section.id);if(replacement)scrollTo({top:replacement.getBoundingClientRect().top+scrollY-old,behavior:'instant'});}
 const url=new URL(location.href);url.searchParams.set('lang',next);history.replaceState(null,'',url);cursor.reset();header.reveal();
}
function mediaFailure(node){if(node.tagName==='IMG'){const wrapper=node.closest('[data-media]');if(wrapper){node.hidden=true;wrapper.classList.add('failed');const message=wrapper.querySelector('.image-error');if(message){message.hidden=false;message.textContent=ui[language].imageFallback;}}}else{const video=node.tagName==='VIDEO'?node:node.closest?.('video');if(video){const error=video.parentElement.querySelector('.video-error');if(error){error.hidden=false;error.textContent=ui[language].videoError;}}}}
document.addEventListener('error',e=>mediaFailure(e.target),true);
document.addEventListener('click',e=>{const target=e.target instanceof Element?e.target:null;if(!target)return;
 const lang=target.closest('[data-language]');if(lang){if(e.ctrlKey||e.metaKey||e.shiftKey||e.button!==0)return;e.preventDefault();changeLanguage(lang.dataset.language);}
 if(target.closest('.menu-button'))openMenu();if(target.closest('[data-close-menu]'))closeDialog(menu);
 const menuLink=target.closest('#mobile-menu nav a');if(menuLink){forceClose(menu);cursor.reset();}
 const project=target.closest('[data-open-project]');if(project&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&e.button===0){e.preventDefault();openProject(project.dataset.openProject,project);}
 if(target.closest('.case-close'))closeDialog(caseDialog);
 if(target.closest('[data-motion-toggle]')){preference=reduced?'full':'reduced';storage.set('portfolio-motion',preference);motion();}
 if(target===caseDialog){const r=caseDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(caseDialog);}
});
for(const dialog of [menu,caseDialog]){dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog(dialog);});dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('dialog-open');$('.menu-button').setAttribute('aria-expanded',String(menu.open));header.reveal();});}
os.addEventListener('change',motion);
const visibility=()=>{document.documentElement.classList.toggle('page-hidden',document.hidden);if(document.hidden)$$('video').forEach(video=>video.pause());};
document.addEventListener('visibilitychange',visibility);visibility();
const fontLayout=()=>{contentController?.requestMeasure();cursor.invalidate();};
document.fonts?.addEventListener('loadingdone',fontLayout);
document.fonts?.ready?.then(fontLayout).catch(()=>{});
window.addEventListener('pageshow',e=>{if(e.persisted){document.documentElement.dataset.bootState='removed';document.documentElement.classList.remove('booting','loader-exiting');$$('[data-boot-inert]').forEach(n=>{n.inert=false;n.removeAttribute('data-boot-inert');});contentController?.refresh();header.reset();scheduler.wake();}});
window.addEventListener('pagehide',e=>{cursor.hide();if(!e.persisted){document.fonts?.removeEventListener('loadingdone',fontLayout);contentController?.dispose();contentController=null;cursor.dispose();header.dispose();scheduler.dispose();}});
let printStates=[];
window.addEventListener('beforeprint',()=>{printStates=$$('[data-service]').map(n=>[n,n.open]);printStates.forEach(([n])=>{n.open=true;n.querySelector('.service-body').inert=false;});});
window.addEventListener('afterprint',()=>{printStates.forEach(([n,open])=>{n.open=open;n.querySelector('.service-body').inert=!open;});printStates=[];contentController?.measure();});
async function boot(){
 if(page==='home'&&language!==document.documentElement.lang)main.innerHTML=renderPortfolio(language);
 labels();document.documentElement.classList.toggle('reduced-motion',reduced);document.documentElement.classList.toggle('full-motion',!reduced);
 const loading=document.documentElement.classList.contains('booting');if(loading){$$('header,main,.social-rail,.resume-rail,.skip-link').forEach(n=>{n.inert=true;n.dataset.bootInert='true';});main.setAttribute('aria-busy','true');}
 document.documentElement.dataset.bootState='preparing';let degraded=false,fontTimer;
 if(document.fonts){try{const ready=await Promise.race([Promise.all([document.fonts.load('16px Rengok'),document.fonts.load('16px Brogetta')]).then(()=>true),new Promise(resolve=>{fontTimer=setTimeout(()=>resolve(false),effectsConfig.loader.fontTimeoutMs);})]);degraded=!ready;}catch{degraded=true;}finally{clearTimeout(fontTimer);}}
 document.documentElement.dataset.bootState=degraded?'degraded-ready':'ready';
 installContent();clearTimeout(window.bootSafety);main.removeAttribute('aria-busy');storage.sessionSet(effectsConfig.loader.cacheKey,'true');
 document.documentElement.dataset.bootState='exiting';document.documentElement.classList.add('loader-exiting');
 const ready=()=>{document.documentElement.dataset.bootState='removed';document.documentElement.classList.remove('booting','loader-exiting');$$('[data-boot-inert]').forEach(n=>{n.inert=false;n.removeAttribute('data-boot-inert');});$('.loader')?.remove();motion();};
 if(loading&&!reduced)setTimeout(ready,effectsConfig.timings.loaderExit);else ready();
 const navigation=performance.getEntriesByType?.('navigation')[0];if(location.hash&&navigation?.type!=='back_forward')requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant'}));
}
boot().catch(error=>{document.documentElement.dataset.bootState='degraded-ready';document.documentElement.classList.remove('booting','motion-ready','loader-exiting');$$('[data-boot-inert]').forEach(n=>{n.inert=false;n.removeAttribute('data-boot-inert');});main.removeAttribute('aria-busy');console.error('Portfolio initialization failed:',error);});
