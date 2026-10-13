export const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,n));
export const followAlpha=(delta,response=.09)=>1-Math.exp(-clamp(delta,0,.05)/response);
export function scrollProgress(top,height,viewportHeight){return height<=viewportHeight?0:clamp(-top/(height-viewportHeight));}
export function projectScrollTarget(index,count,top,distance){return top+(count>1?clamp(index/(count-1))*distance:0);}
export function effectiveReducedMotion(preference,osReduced){return preference==='reduced'||(preference!=='full'&&osReduced);}
export function taperedRows(count){
  if(count<=0)return[];if(count<=8)return[count];
  if(count>26){const length=Math.ceil(count/8),base=Math.floor(count/length);return Array.from({length},(_,i)=>base+(i<count%length?1:0));}
  const weights=[8,6,5,3].slice(0,Math.min(4,Math.ceil(count/6))),total=weights.reduce((n,v)=>n+v,0);
  const exact=weights.map(w=>w/total*count),rows=exact.map(n=>Math.min(8,Math.floor(n)));let remainder=count-rows.reduce((n,v)=>n+v,0);
  const order=exact.map((n,i)=>({i,fraction:n-Math.floor(n)})).sort((a,b)=>b.fraction-a.fraction);
  while(remainder>0)for(const {i} of order)if(rows[i]<8&&remainder>0){rows[i]++;remainder--;}
  rows.sort((a,b)=>b-a);
  return rows;
}
export function fitsGallery(width,height,panelHeight,count){return width>=1024&&height>=700&&count>1&&panelHeight<=height-160;}
export function sortedExperience(rows){return [...rows].sort((a,b)=>a[0]==='NOW'?-1:b[0]==='NOW'?1:Number(b[0])-Number(a[0]));}
export const storage={get(key){try{return localStorage.getItem(key);}catch{return null;}},set(key,value){try{localStorage.setItem(key,value);}catch{}},sessionGet(key){try{return sessionStorage.getItem(key);}catch{return null;}},sessionSet(key,value){try{sessionStorage.setItem(key,value);}catch{}}};
export function listen(target,event,fn,options,cleanups){target.addEventListener(event,fn,options);cleanups?.push(()=>target.removeEventListener(event,fn,options));}
export function createScheduler(){
  const jobs=new Set();let handle=0,last=0;
  const run=time=>{handle=0;if(document.hidden)return;const delta=last?Math.min(.05,(time-last)/1000):1/60;last=time;let alive=false;for(const fn of [...jobs])alive=Boolean(fn(time,delta))||alive;if(alive)wake();};
  function wake(){if(!handle&&!document.hidden)handle=requestAnimationFrame(run);}
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(handle);handle=0;last=0;}else{last=0;wake();}};
  document.addEventListener('visibilitychange',visibility);
  return{add(fn){jobs.add(fn);wake();return()=>jobs.delete(fn);},wake,dispose(){cancelAnimationFrame(handle);jobs.clear();document.removeEventListener('visibilitychange',visibility);}};
}
