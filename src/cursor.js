import {effectsConfig} from './config.js';
import {followAlpha,clamp,listen} from './utils.js';

// Position and displayed dimensions are committed together; CSS never animates
// a second, conflicting set of dimensions around this centre.
export function createCursor(node,getReduced,scheduler){
  const config=effectsConfig.cursor;
  const fine=matchMedia('(any-hover:hover) and (any-pointer:fine)');
  const cleanups=[],rail=document.querySelector('.social-rail');
  let enabled=false,active=false,moving=false,dirty=false,hasPointer=false;
  let target=null,type='',bounds=null,selection=false;
  let pointerX=0,pointerY=0,x=0,y=0,sx=0,sy=0;
  let width=config.diameter,height=config.diameter,wantedWidth=width,wantedHeight=height;
  const resizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(()=>invalidate()):null;

  function conceal(){
    active=false;moving=false;node.style.opacity='0';
  }
  function hide(){
    conceal();hasPointer=false;dirty=false;target=null;bounds=null;type='';
    resizeObserver?.disconnect();rail?.classList.remove('hovered');
  }
  function reset(){
    hide();enabled=fine.matches&&!getReduced();
    selection=Boolean(window.getSelection()?.toString());
    node.className='cursor-companion';
  }
  function paint(velocity=0){
    const stretch=type?1:clamp(1+velocity/220,1,config.maxStretch);
    const angle=type?0:Math.atan2(y-sy,x-sx);
    node.style.width=`${width}px`;node.style.height=`${height}px`;
    node.style.transform=`translate3d(${sx-width/2}px,${sy-height/2}px,0) rotate(${angle}rad) scale(${stretch},${1/stretch})`;
  }
  function reconcile(element,remeasure=false){
    if(!enabled||getReduced()||selection||document.hidden||document.querySelector('dialog[open]')){hide();return;}
    if(element?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"])')){hide();return;}
    // Decorative capsule and the spaces between icons belong to the same group.
    if(element?.closest?.('.social-icons')){
      conceal();target=null;bounds=null;type='';resizeObserver?.disconnect();
      rail?.classList.add('hovered');return;
    }
    rail?.classList.remove('hovered');
    let hover=element?.closest?.('a,button,summary')||null;
    if(hover&&!hover.isConnected)hover=null;
    if(hover?.closest('.site-header.header-hidden'))hover=null;
    let next='',nextBounds=null;wantedWidth=config.diameter;wantedHeight=config.diameter;
    if(hover?.dataset.cursor==='project'){
      next='project';wantedWidth=wantedHeight=config.projectDiameter;
    }else if(hover?.tagName==='SUMMARY'||hover?.dataset.cursor==='disclosure'){
      next='disclosure';wantedWidth=wantedHeight=config.disclosureDiameter;
    }else if(hover?.closest('.desktop-nav,.language-switch')){
      next='navigation';wantedWidth=wantedHeight=config.navDiameter;
    }else if(hover?.classList.contains('button')){
      const rect=!remeasure&&hover===target&&type==='button-target'&&bounds?bounds:hover.getBoundingClientRect();
      if(rect.width>0&&rect.height>0&&rect.width<=config.maxButtonWidth&&rect.height<=config.maxButtonHeight){
        next='button-target';nextBounds=rect;
        wantedWidth=rect.width+config.boundsPadding;wantedHeight=rect.height+config.boundsPadding;
      }else{
        next='navigation';wantedWidth=wantedHeight=config.navDiameter;
      }
    }
    if(hover!==target){
      resizeObserver?.disconnect();if(hover&&next==='button-target')resizeObserver?.observe(hover);
    }
    target=hover;type=next;bounds=nextBounds;node.className='cursor-companion'+(type?' '+type:'');
    x=bounds?bounds.left+bounds.width/2:pointerX;
    y=bounds?bounds.top+bounds.height/2:pointerY;
    if(!active){
      sx=x;sy=y;width=wantedWidth;height=wantedHeight;
      paint(); // No visible frame at an old position when re-entering.
      active=true;node.style.opacity='1';
    }
    moving=true;
  }
  function move(event){
    if(!enabled||event.pointerType!=='mouse'){hide();return;}
    pointerX=event.clientX;pointerY=event.clientY;hasPointer=true;dirty=false;
    reconcile(event.target);if(active)scheduler.wake();
  }
  function invalidate(){
    if(!hasPointer||!enabled)return;
    dirty=true;scheduler.wake();
  }
  function tick(time,delta){
    if(dirty){
      dirty=false;
      if(hasPointer){
        const element=document.elementFromPoint?.(pointerX,pointerY);
        if(!element){hide();return false;}
        reconcile(element,true);
      }
    }
    if(!active||!moving)return false;
    const alpha=followAlpha(delta,config.responseSeconds);
    sx+=(x-sx)*alpha;sy+=(y-sy)*alpha;
    width+=(wantedWidth-width)*alpha;height+=(wantedHeight-height)*alpha;
    const velocity=Math.hypot(x-sx,y-sy);
    moving=Math.max(velocity,Math.abs(wantedWidth-width),Math.abs(wantedHeight-height))>config.settleDistance;
    if(!moving){sx=x;sy=y;width=wantedWidth;height=wantedHeight;}
    paint(velocity);return moving;
  }
  const remove=scheduler.add(tick);
  listen(document,'pointermove',move,{passive:true},cleanups);
  listen(document,'pointerout',event=>{if(!event.relatedTarget)hide();},undefined,cleanups);
  listen(document,'pointerdown',event=>{if(event.pointerType!=='mouse')hide();},{passive:true},cleanups);
  listen(window,'blur',hide,undefined,cleanups);
  listen(document,'focusin',hide,undefined,cleanups);
  listen(document,'visibilitychange',()=>{if(document.hidden)hide();},undefined,cleanups);
  listen(document,'selectionchange',()=>{selection=Boolean(window.getSelection()?.toString());if(selection)hide();},undefined,cleanups);
  listen(window,'scroll',invalidate,{passive:true},cleanups);
  listen(window,'resize',invalidate,undefined,cleanups);
  listen(document,'portfolio:layout',invalidate,undefined,cleanups);
  listen(document,'transitionend',event=>{if(event.propertyName==='transform'&&(target===event.target||event.target?.classList?.contains('site-header')))invalidate();},undefined,cleanups);
  listen(fine,'change',reset,undefined,cleanups);
  reset();
  return{reset,hide,invalidate,dispose(){remove();hide();cleanups.forEach(fn=>fn());}};
}
