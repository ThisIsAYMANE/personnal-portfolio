import {effectsConfig} from '../config.js';
export function prepareOrbs(root,getReduced,scheduler){
 const instances=new Map(),pending=new Set(),failed=new Set(),canvases=[...root.querySelectorAll('canvas[data-orb]')];let disposed=false,module;
 async function prepare(canvas){if(disposed||document.hidden||getReduced()||document.documentElement.classList.contains('booting')||instances.has(canvas)||pending.has(canvas)||failed.has(canvas))return;pending.add(canvas);try{module||=(await import('./orb.js'));if(disposed||document.hidden||getReduced())return;const renderer=module.createOrb(canvas,{getReduced,scheduler});if(renderer)instances.set(canvas,renderer);else failed.add(canvas);}catch{failed.add(canvas);}finally{pending.delete(canvas);}}
 const near=()=>{if(document.hidden)return;for(const canvas of canvases){const r=canvas.getBoundingClientRect();if(r.bottom>=-effectsConfig.orb.prepareMargin&&r.top<=innerHeight+effectsConfig.orb.prepareMargin)prepare(canvas);}};
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)prepare(entry.target);}),{rootMargin:`${effectsConfig.orb.prepareMargin}px`});canvases.forEach(canvas=>observer.observe(canvas));document.addEventListener('visibilitychange',near);
 return{reset(){instances.forEach(r=>r.reset());near();},dispose(){disposed=true;observer.disconnect();document.removeEventListener('visibilitychange',near);instances.forEach(r=>r.dispose());instances.clear();}};
}
