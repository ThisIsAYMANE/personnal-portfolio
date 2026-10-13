import {Window} from 'happy-dom';
import {renderDocument} from '../../src/render.js';

// Controller simulation only: layout and physical browser rendering are separate QA.
export function environment(pageOptions={},lang='en'){
  const window=new Window({url:'http://127.0.0.1:5173/',settings:{disableJavaScriptEvaluation:true,disableJavaScriptFileLoading:true,disableCSSFileLoading:true,disableIframePageLoading:true}});
  window.document.write(renderDocument(lang,pageOptions));
  const matchMedia=query=>({matches:query.includes('pointer:fine'),media:query,addEventListener(){},removeEventListener(){}});
  window.matchMedia=matchMedia;window.HTMLMediaElement.prototype.pause=function(){};window.HTMLMediaElement.prototype.load=function(){};
  const old={};
  for(const [key,value] of Object.entries({window,document:window.document,Element:window.Element,location:window.location,history:window.history,localStorage:window.localStorage,sessionStorage:window.sessionStorage,matchMedia,innerWidth:390,innerHeight:844,scrollY:0,devicePixelRatio:1,requestAnimationFrame:window.requestAnimationFrame.bind(window),cancelAnimationFrame:window.cancelAnimationFrame.bind(window),getComputedStyle:window.getComputedStyle.bind(window),scrollTo:window.scrollTo.bind(window)})){
    old[key]=Object.getOwnPropertyDescriptor(globalThis,key);Object.defineProperty(globalThis,key,{value,writable:true,configurable:true});
  }
  class Observer{constructor(cb){this.cb=cb;}observe(node){if(node.tagName!=='CANVAS')this.cb([{target:node,isIntersecting:true}]);}unobserve(){}disconnect(){}}
  class Resize{observe(){}disconnect(){}}
  for(const [key,value] of Object.entries({IntersectionObserver:Observer,ResizeObserver:Resize})){
    old[key]=Object.getOwnPropertyDescriptor(globalThis,key);Object.defineProperty(globalThis,key,{value,configurable:true});window[key]=value;
  }
  return{window,document:window.document,restore(){window.happyDOM.abort();window.close();for(const [key,value] of Object.entries(old)){if(value)Object.defineProperty(globalThis,key,value);else delete globalThis[key];}}};
}

export function schedulerHarness(){
  const jobs=new Set();let wakes=0;
  return{add(fn){jobs.add(fn);return()=>jobs.delete(fn);},wake(){wakes++;},flush(time=100,delta=1/60){return [...jobs].map(fn=>fn(time,delta));},get wakes(){return wakes;},get count(){return jobs.size;}};
}
