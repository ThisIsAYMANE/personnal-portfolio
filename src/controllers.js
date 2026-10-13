import {effectsConfig} from './config.js';
import {clamp,fitsGallery,listen} from './utils.js';

export function createReveals(root,getReduced){
 let observer;function refresh(){observer?.disconnect();document.documentElement.classList.toggle('motion-ready',!getReduced());const nodes=[...root.querySelectorAll('.reveal')];if(getReduced()||!('IntersectionObserver' in window)){nodes.forEach(n=>n.classList.add('visible'));return;}
 observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.06,rootMargin:'0px 0px -24px 0px'});nodes.forEach(n=>observer.observe(n));}
 refresh();return{refresh,dispose(){observer?.disconnect();}};
}
export function createDisclosures(root,getReduced,onLayout){
 const cleanups=[],states=[];
 root.querySelectorAll('[data-service]').forEach((details,index)=>{
  const summary=details.querySelector('summary'),body=details.querySelector('.service-body');let animation=null,desired=details.open,version=0;
  const settle=()=>{details.open=desired;body.style.height='';body.inert=!desired;summary.setAttribute('aria-expanded',String(desired));details.dataset.expanding='';onLayout();};
  const manual=()=>{details.dataset.manual='true';details.parentElement.dataset.manualActive=String(index);};
  const toggle=()=>{desired=!desired;manual();version++;const generation=version;const from=details.open?body.getBoundingClientRect().height:0;animation?.cancel();details.open=true;summary.setAttribute('aria-expanded',String(desired));body.inert=!desired;details.dataset.expanding=String(desired);const to=desired?body.scrollHeight:0;
   if(getReduced()||typeof body.animate!=='function'){settle();return;}
   body.style.height=`${from}px`;animation=body.animate([{height:`${from}px`},{height:`${to}px`}],{duration:effectsConfig.timings.accordion,easing:'cubic-bezier(.2,.75,.25,1)',fill:'forwards'});
   animation.finished.then(()=>{if(generation===version){animation.cancel();animation=null;settle();}}).catch(()=>{});
  };
  listen(summary,'click',e=>{e.preventDefault();toggle();},undefined,cleanups);
  listen(summary,'focus',manual,undefined,cleanups);
  summary.setAttribute('aria-expanded',String(desired));body.inert=!desired;
  states.push({reset(){version++;animation?.cancel();animation=null;settle();}});
 });
 return{reset(){states.forEach(s=>s.reset());},dispose(){cleanups.forEach(fn=>fn());states.forEach(s=>s.reset());}};
}

export function createScroll(root,getReduced,scheduler,onGeometry=()=>{}){
 const cleanups=[];let state=null,dirty=true,resizeTimer;
 const work=root.querySelector('#work'),scroll=work?.querySelector('.work-scroll'),stage=work?.querySelector('.work-stage'),viewport=work?.querySelector('.project-viewport'),track=work?.querySelector('.project-track');
 const panels=track?[...track.children]:[],sections=[...root.querySelectorAll('.section[id]')];
 function wake(){dirty=true;scheduler.wake();}
 function measureGeometry(){
  if(!work)return;const allowed=!getReduced()&&innerWidth>=effectsConfig.gallery.minWidth&&innerHeight>=effectsConfig.gallery.minHeight&&panels.filter(p=>p.dataset.project).length>1;
  work.classList.toggle('scroll-work',allowed);if(!allowed){scroll.style.height='';track.style.transform='';state=null;work.dataset.pinFallback=getReduced()?'motion':'viewport';wake();return;}
  const available=viewport.clientHeight;const needed=Math.max(...panels.map(p=>{
   const children=[...p.children];const sum=children.reduce((n,c)=>n+c.getBoundingClientRect().height,0);const css=getComputedStyle(p);const numeric=value=>parseFloat(value)||0;return sum+numeric(css.paddingTop)+numeric(css.paddingBottom)+Math.max(0,children.length-1)*numeric(css.gap);
  }));
  if(!fitsGallery(innerWidth,innerHeight,needed+stage.querySelector('.work-heading').offsetHeight+66,panels.length)){work.classList.remove('scroll-work');scroll.style.height='';track.style.transform='';state=null;work.dataset.pinFallback='content';wake();return;}
  const distance=Math.max(0,track.scrollWidth-viewport.clientWidth),hold=Math.round(stage.clientHeight*.22);
  if(!distance){work.classList.remove('scroll-work');scroll.style.height='';state=null;wake();return;}
  scroll.style.height=`${distance+stage.clientHeight+hold}px`;state={distance,hold,available,stageHeight:stage.clientHeight};work.dataset.pinFallback='';wake();
 }
 function measure(){measureGeometry();onGeometry();document.dispatchEvent(new window.Event('portfolio:layout'));}
 function go(index,instant=false){if(!state)return;const x=clamp(panels[index]?.offsetLeft||0,0,state.distance);const top=scroll.getBoundingClientRect().top+scrollY-effectsConfig.gallery.headerOffset;window.scrollTo({top:top+x,behavior:getReduced()||instant?'instant':'smooth'});}
 function tick(){if(!dirty)return false;dirty=false;
  if(state){const travel=clamp(-scroll.getBoundingClientRect().top+effectsConfig.gallery.headerOffset,0,state.distance);const transform=`translate3d(${-travel}px,0,0)`;if(track.style.transform!==transform){track.style.transform=transform;onGeometry();}viewport.scrollLeft=0;let active=travel>=state.distance-1?panels.length-1:panels.reduce((n,p,i)=>p.offsetLeft<=travel+viewport.clientWidth*.2?i:n,0);work.querySelectorAll('[data-project-index]').forEach((b,i)=>b.setAttribute('aria-current',String(i===active)));}
  const timeline=root.querySelector('.timeline');if(timeline){const r=timeline.getBoundingClientRect();timeline.style.setProperty('--timeline-progress',`${getReduced()?100:clamp((innerHeight*.68-r.top)/Math.max(1,r.height))*100}%`);timeline.querySelectorAll('.experience-row').forEach(row=>{const b=row.getBoundingClientRect();row.style.setProperty('--row-progress',String(getReduced()?1:clamp((innerHeight*.85-b.top)/200)));});}
  if(!getReduced()){const hero=root.querySelector('.hero');if(hero){const progress=clamp(-hero.getBoundingClientRect().top/Math.max(1,hero.offsetHeight*.85));hero.style.setProperty('--hero-exit',progress);hero.style.setProperty('--hero-glow-x',`${-progress*45}px`);}}
  const services=[...root.querySelectorAll('[data-service]')];if(services.length){const list=services[0].parentElement,r=list.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)delete list.dataset.manualActive;let nearest=list.dataset.manualActive!==undefined?services[Number(list.dataset.manualActive)]:services.reduce((best,s)=>Math.abs(s.getBoundingClientRect().top-innerHeight*.4)<Math.abs(best.getBoundingClientRect().top-innerHeight*.4)?s:best,services[0]);services.forEach(s=>s.classList.toggle('reading',s===nearest));}
  const current=sections.filter(s=>s.getBoundingClientRect().top<=innerHeight*.35).at(-1);document.querySelectorAll('[data-section-link]').forEach(a=>{const key=a.dataset.sectionLink;const category=current?.id==='services'||current?.id==='experience'?'about':current?.id==='stack'?'work':current?.id;a.setAttribute('aria-current',String(key===category));});
  return false;
 }
 const requestMeasure=()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(measure,100);};
 const remove=scheduler.add(tick);listen(window,'scroll',wake,{passive:true},cleanups);listen(window,'resize',requestMeasure,undefined,cleanups);
 listen(root,'focusin',e=>{const panel=e.target.closest?.('.project-panel');if(state&&panel){const travel=clamp(-scroll.getBoundingClientRect().top+effectsConfig.gallery.headerOffset,0,state.distance),start=panel.offsetLeft,end=start+panel.offsetWidth;viewport.scrollLeft=0;if(start<travel-1||end>travel+viewport.clientWidth+1)go(panels.indexOf(panel),true);wake();}},undefined,cleanups);
 root.querySelectorAll('[data-project-index]').forEach(b=>listen(b,'click',()=>go(Number(b.dataset.projectIndex)),undefined,cleanups));
 const resizeObserver='ResizeObserver' in window?new ResizeObserver(requestMeasure):null;if(resizeObserver&&stage){resizeObserver.observe(stage.querySelector('.work-heading'));panels.forEach(panel=>{const info=panel.querySelector('.project-info');if(info)resizeObserver.observe(info);});}
 measure();return{measure,requestMeasure,wake,dispose(){remove();clearTimeout(resizeTimer);resizeObserver?.disconnect();cleanups.forEach(fn=>fn());}};
}

export {createCursor} from './cursor.js';
