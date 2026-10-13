import {effectsConfig} from './config.js';
import {clamp,listen} from './utils.js';

export function createHeader(node,getReduced,scheduler,{onChange=()=>{},now=()=>performance.now()}={}){
  const config=effectsConfig.header,cleanups=[];
  let dirty=true,hidden=false,lastY=readY(),direction=0,travel=0,holdUntil=0,keyboard=true;
  function readY(){
    const height=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight);
    return clamp(scrollY,0,Math.max(0,height-innerHeight));
  }
  function wake(){dirty=true;scheduler.wake();}
  function setHidden(next){
    if(hidden===next)return;
    hidden=next;node.classList.toggle('header-hidden',hidden);onChange();
  }
  function reset(){
    lastY=readY();direction=0;travel=0;holdUntil=0;setHidden(false);wake();
  }
  function reveal(){
    lastY=readY();direction=0;travel=0;holdUntil=now()+config.navigationHoldMs;
    setHidden(false);wake();
  }
  function tick(){
    if(!dirty)return false;
    dirty=false;const y=readY(),delta=y-lastY;lastY=y;
    node.classList.toggle('scrolled',y>30);
    node.style.setProperty('--header-duration',getReduced()?'0ms':`${config.transitionMs}ms`);
    const locked=(keyboard&&node.contains(document.activeElement))||document.querySelector('#mobile-menu[open]')||document.documentElement.classList.contains('booting');
    if(y<=config.topGuard||locked||now()<holdUntil){
      direction=0;travel=0;setHidden(false);return false;
    }
    if(!delta)return false;
    const nextDirection=Math.sign(delta);
    if(nextDirection!==direction){direction=nextDirection;travel=0;}
    travel+=Math.abs(delta);
    const threshold=direction>0?config.downThreshold:config.upThreshold;
    if(travel>=threshold){setHidden(direction>0);travel=0;}
    return false;
  }
  const remove=scheduler.add(tick);
  listen(window,'scroll',wake,{passive:true},cleanups);
  listen(window,'resize',reset,undefined,cleanups);
  listen(document,'keydown',()=>{keyboard=true;if(node.contains(document.activeElement)){node.classList.add('header-focus');reveal();}},undefined,cleanups);
  listen(document,'pointerdown',()=>{keyboard=false;node.classList.remove('header-focus');wake();},{passive:true},cleanups);
  listen(node,'focusin',()=>{node.classList.toggle('header-focus',keyboard);reveal();},undefined,cleanups);
  listen(node,'focusout',event=>{if(!node.contains(event.relatedTarget))node.classList.remove('header-focus');wake();},undefined,cleanups);
  listen(node,'click',reveal,undefined,cleanups);
  listen(node,'transitionend',event=>{if(event.propertyName==='transform')onChange();},undefined,cleanups);
  listen(document,'portfolio:layout',()=>{lastY=readY();wake();},undefined,cleanups);
  return{reset,reveal,wake,dispose(){remove();cleanups.forEach(fn=>fn());node.classList.remove('header-hidden','header-focus');node.style.removeProperty('--header-duration');}};
}
