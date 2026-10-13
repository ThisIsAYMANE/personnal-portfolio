import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {copy,skills,projects} from '../src/content.js';
import {renderPortfolio} from '../src/render.js';
import {validateContent} from '../src/routes.js';
import {createCursor} from '../src/cursor.js';
import {createHeader} from '../src/header.js';
import {environment,schedulerHarness} from './helpers/environment.mjs';
import {initialResources} from '../scripts/resource-budget.mjs';

const mouse=(env,node,x=140,y=110)=>node.dispatchEvent(new env.window.PointerEvent('pointermove',{bubbles:true,pointerType:'mouse',clientX:x,clientY:y}));
function scrollRange(env){Object.defineProperty(env.document.documentElement,'scrollHeight',{value:2844,configurable:true});}
function scroll(env,scheduler,y){globalThis.scrollY=y;env.window.dispatchEvent(new env.window.Event('scroll'));scheduler.flush();}

test('Employer copy, four capabilities and supported growth appear in both languages',()=>{
  for(const lang of ['en','fr']){
    const env=environment();try{
      env.document.querySelector('main').innerHTML=renderPortfolio(lang);
      assert.equal(env.document.querySelectorAll('[data-service]').length,4);
      assert.ok(copy[lang].servicesList.some(row=>row[0]==='DevOps & CI/CD'));
      assert.equal(env.document.querySelectorAll('.experience-growth').length,5);
      assert.ok(copy[lang].experienceList.every(row=>row[5]));
      assert.ok(env.document.querySelector('#contact').textContent.includes('2027'));
      assert.ok(env.document.querySelector('#contact').textContent.includes(lang==='en'?'engineering team':'équipe d’ingénierie'));
      assert.ok(!/open to freelance|ouvert aux projets freelance|Have a good idea|Donnons-lui vie/i.test(env.document.querySelector('main').textContent));
      assert.ok(/freelance/i.test(env.document.querySelector('#experience').textContent));
    }finally{env.restore();}
    for(const page of ['archive','case']){
      const pageEnv=environment({page,id:'cih'},lang);
      try{
        assert.equal(pageEnv.document.querySelector('.contact-note').textContent,copy[lang].contactNote);
        assert.ok(!pageEnv.document.querySelector('main').textContent.includes('Have a good idea?'));
      }finally{pageEnv.restore();}
    }
  }
});

test('New toolkit icons are real local assets and do not rewrite historical project stacks',async()=>{
  assert.equal(skills.length,24);
  const manifest=JSON.parse(await readFile(new URL('../public/icons/icon-manifest.json',import.meta.url)));
  for(const name of ['Kubernetes','Jenkins']){
    assert.ok(skills.some(row=>row[0]===name));
    const icon=manifest.icons[name];assert.ok(icon?.source&&icon.license&&icon.sha256);
    assert.ok((await readFile(new URL('../'+icon.file,import.meta.url),'utf8')).includes('<svg'));
    assert.ok(projects.every(project=>!project.stack.includes(name)));
  }
});

test('Initial resource evidence includes controllers reached through a static re-export',async()=>{
  const budget=await initialResources(fileURLToPath(new URL('../',import.meta.url)));
  assert.equal(budget.entries.filter(entry=>entry.file==='src/cursor.js').length,1);
  assert.equal(budget.entries.filter(entry=>entry.file==='src/header.js').length,1);
  assert.ok(!budget.entries.some(entry=>entry.file==='src/effects/orb.js'));
});

test('Timeline growth is optional, escaped and validated before building',()=>{
  const data=structuredClone(copy);
  data.en.experienceList=data.en.experienceList.map(row=>row.slice(0,5));
  assert.deepEqual(validateContent({projects,skills,copy:data}),[]);
  data.en.experienceList[0][5]=42;
  assert.ok(validateContent({projects,skills,copy:data}).some(error=>error.startsWith('Experience row: en')));
  data.en.experienceList[0][5]='<img src=x onerror=bad>';
  // Escaping is a template property; normal source data stays unchanged.
  const original=copy.en.experienceList[0][5];
  try{copy.en.experienceList[0][5]=data.en.experienceList[0][5];assert.ok(renderPortfolio('en').includes('&lt;img src=x onerror=bad&gt;'));}
  finally{copy.en.experienceList[0][5]=original;}
});

test('Cursor interpolates visible dimensions and centre together on reversed target changes',()=>{
  const env=environment(),scheduler=schedulerHarness();
  try{
    const node=env.document.querySelector('.cursor-companion'),button=env.document.querySelector('.button');
    button.getBoundingClientRect=()=>({left:120,top:100,width:200,height:48});
    const cursor=createCursor(node,()=>false,scheduler);
    mouse(env,button);assert.equal(node.style.width,'206px');
    mouse(env,env.document.querySelector('.hero-description'),400,250);
    assert.equal(node.style.width,'206px','No independent immediate width jump before the position frame');
    scheduler.flush();const width=parseFloat(node.style.width);
    assert.ok(width>26&&width<206);
    const [,tx,ty]=node.style.transform.match(/translate3d\(([-\d.]+)px,([-\d.]+)px,0\)/);
    const cx=Number(tx)+width/2,cy=Number(ty)+parseFloat(node.style.height)/2;
    assert.ok(cx>220&&cx<400);assert.ok(cy>124&&cy<250);
    mouse(env,button);scheduler.flush();assert.ok(parseFloat(node.style.width)>width);
    for(let i=0;i<80;i++)scheduler.flush(200+i*16);
    assert.equal(node.style.width,'206px');assert.deepEqual(scheduler.flush(),[false]);
    cursor.dispose();assert.equal(scheduler.count,0);
  }finally{env.restore();}
});

test('Large disclosures and oversized buttons keep a local pointer affordance',()=>{
  const env=environment(),scheduler=schedulerHarness();
  try{
    const node=env.document.querySelector('.cursor-companion'),summary=env.document.querySelector('summary');
    summary.getBoundingClientRect=()=>({left:50,top:80,width:1000,height:190});
    const cursor=createCursor(node,()=>false,scheduler);
    mouse(env,summary.querySelector('.service-name'),70,100);
    assert.ok(node.classList.contains('disclosure'));assert.equal(node.style.width,'44px');
    assert.ok(node.style.transform.includes('translate3d(48px,78px,0)'));
    const button=env.document.querySelector('.button');button.getBoundingClientRect=()=>({left:20,top:50,width:700,height:50});
    mouse(env,button,50,70);for(let i=0;i<80;i++)scheduler.flush();
    assert.ok(node.classList.contains('navigation'));assert.equal(node.style.width,'35px');
    assert.ok(node.style.transform.includes('translate3d(32.5px,52.5px,0)'));
    cursor.dispose();
  }finally{env.restore();}
});

test('Social gaps and decorative children preserve capsule ownership',()=>{
  const env=environment(),scheduler=schedulerHarness();
  try{
    const node=env.document.querySelector('.cursor-companion'),rail=env.document.querySelector('.social-rail'),group=rail.querySelector('.social-icons');
    const cursor=createCursor(node,()=>false,scheduler);
    for(const target of [group.querySelector('a .icon'),group,group.querySelector('.rail-capsule')]){
      mouse(env,target,20,120);assert.ok(rail.classList.contains('hovered'));assert.equal(node.style.opacity,'0');
    }
    mouse(env,rail.querySelector('.rail-line'),20,300);
    assert.ok(!rail.classList.contains('hovered'));assert.equal(node.style.opacity,'1');
    cursor.dispose();
  }finally{env.restore();}
});

test('Stationary pointer rechecks scrolling targets; geometry is cached and hiding cancels stale work',()=>{
  const env=environment(),scheduler=schedulerHarness();
  try{
    const node=env.document.querySelector('.cursor-companion'),button=env.document.querySelector('.button');let reads=0,top=100;
    button.getBoundingClientRect=()=>{reads++;return{left:120,top,width:200,height:48};};
    const cursor=createCursor(node,()=>false,scheduler);
    mouse(env,button);mouse(env,button,150,111);mouse(env,button,160,112);
    assert.equal(reads,1);
    top=98;env.document.elementFromPoint=()=>button;
    const transitioned=new env.window.Event('transitionend',{bubbles:true});Object.defineProperty(transitioned,'propertyName',{value:'transform'});button.dispatchEvent(transitioned);scheduler.flush();
    assert.equal(reads,2,'Refresh a settled hover transform without measuring every pointer frame');
    env.document.elementFromPoint=()=>env.document.querySelector('.project-visual');
    env.window.dispatchEvent(new env.window.Event('scroll'));scheduler.flush();
    assert.ok(node.classList.contains('project'));
    env.document.elementFromPoint=()=>env.document.body;
    env.window.dispatchEvent(new env.window.Event('scroll'));scheduler.flush();
    assert.ok(!node.classList.contains('project'));
    cursor.hide();const wakes=scheduler.wakes;
    env.window.dispatchEvent(new env.window.Event('scroll'));scheduler.flush();
    assert.equal(scheduler.wakes,wakes);assert.equal(node.style.opacity,'0');
    cursor.dispose();
  }finally{env.restore();}
});

test('Header thresholds tolerate direction jitter and reveal immediately for keyboard focus',()=>{
  const env=environment(),scheduler=schedulerHarness();let time=0;
  try{
    scrollRange(env);globalThis.scrollY=200;
    const node=env.document.querySelector('.site-header');
    const header=createHeader(node,()=>false,scheduler,{now:()=>time});scheduler.flush();
    for(const y of [211,212,207,214]){scroll(env,scheduler,y);assert.ok(!node.classList.contains('header-hidden'));}
    scroll(env,scheduler,223);assert.ok(node.classList.contains('header-hidden'));
    scroll(env,scheduler,220);assert.ok(node.classList.contains('header-hidden'));
    scroll(env,scheduler,215);assert.ok(!node.classList.contains('header-hidden'));
    scroll(env,scheduler,240);assert.ok(node.classList.contains('header-hidden'));
    node.querySelector('a').focus();assert.ok(!node.classList.contains('header-hidden'));
    scroll(env,scheduler,320);assert.ok(!node.classList.contains('header-hidden'));
    env.document.body.tabIndex=-1;env.document.body.focus();time=400;
    scroll(env,scheduler,340);assert.ok(node.classList.contains('header-hidden'));
    scroll(env,scheduler,50);assert.ok(!node.classList.contains('header-hidden'));
    header.dispose();assert.equal(scheduler.count,0);
  }finally{env.restore();}
});

test('Header clamps overscroll, respects menu/navigation hold and uses instant reduced-motion changes',()=>{
  const env=environment(),scheduler=schedulerHarness();let time=0;
  try{
    scrollRange(env);const node=env.document.querySelector('.site-header');
    const header=createHeader(node,()=>true,scheduler,{now:()=>time});scheduler.flush();
    assert.equal(node.style.getPropertyValue('--header-duration'),'0ms');
    scroll(env,scheduler,1900);assert.ok(node.classList.contains('header-hidden'));
    scroll(env,scheduler,2500);scroll(env,scheduler,2450);assert.ok(node.classList.contains('header-hidden'));
    scroll(env,scheduler,1989);assert.ok(!node.classList.contains('header-hidden'));
    const menu=env.document.querySelector('#mobile-menu');menu.showModal();scroll(env,scheduler,1999);
    assert.ok(!node.classList.contains('header-hidden'));menu.close();
    header.reveal();scroll(env,scheduler,2000);assert.ok(!node.classList.contains('header-hidden'));
    time=400;scroll(env,scheduler,1900);scroll(env,scheduler,1920);assert.ok(node.classList.contains('header-hidden'));
    scroll(env,scheduler,-60);scroll(env,scheduler,-40);assert.ok(!node.classList.contains('header-hidden'));
    header.dispose();const wakes=scheduler.wakes;env.window.dispatchEvent(new env.window.Event('scroll'));assert.equal(scheduler.wakes,wakes);
  }finally{env.restore();}
});

test('Header transitions invalidate a cursor target and apply on archive/case layouts',()=>{
  for(const page of ['archive','case']){
    const env=environment({page,id:'cih'}),scheduler=schedulerHarness();
    try{
      scrollRange(env);const headerNode=env.document.querySelector('.site-header'),cursorNode=env.document.querySelector('.cursor-companion');
      const cursor=createCursor(cursorNode,()=>false,scheduler);
      const header=createHeader(headerNode,()=>false,scheduler,{onChange:cursor.invalidate});
      mouse(env,headerNode.querySelector('.desktop-nav a'),300,25);
      assert.ok(cursorNode.classList.contains('navigation'));
      env.document.elementFromPoint=()=>env.document.body;
      scroll(env,scheduler,200);scheduler.flush();
      assert.ok(headerNode.classList.contains('header-hidden'));assert.ok(!cursorNode.classList.contains('navigation'));
      cursor.dispose();header.dispose();
    }finally{env.restore();}
  }
});

test('Touch/mouse focus does not keep the header stuck open; keyboard access restores it',()=>{
  const env=environment(),scheduler=schedulerHarness();let time=0;
  try{
    scrollRange(env);const node=env.document.querySelector('.site-header');
    const header=createHeader(node,()=>false,scheduler,{now:()=>time});scheduler.flush();
    const link=node.querySelector('a');link.focus();scroll(env,scheduler,200);
    assert.ok(node.classList.contains('header-focus'));
    env.document.body.dispatchEvent(new env.window.PointerEvent('pointerdown',{bubbles:true,pointerType:'touch'}));
    time=400;scroll(env,scheduler,240);
    assert.equal(env.document.activeElement,link);assert.ok(node.classList.contains('header-hidden'));
    env.document.dispatchEvent(new env.window.KeyboardEvent('keydown',{bubbles:true,key:'Tab'}));
    assert.ok(!node.classList.contains('header-hidden'));assert.ok(node.classList.contains('header-focus'));
    header.dispose();
  }finally{env.restore();}
});

test('Application keeps header controls available through language, menu and back-forward restoration',async()=>{
  const env=environment(),wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  try{
    scrollRange(env);await import('../src/main.js?employer-revision-flow');await wait(40);
    const header=env.document.querySelector('.site-header');
    globalThis.scrollY=200;env.window.dispatchEvent(new env.window.Event('scroll'));await wait(40);
    assert.ok(header.classList.contains('header-hidden'));
    env.document.querySelector('[data-language="fr"]').dispatchEvent(new env.window.MouseEvent('click',{bubbles:true,button:0}));
    assert.equal(env.document.documentElement.lang,'fr');assert.ok(!header.classList.contains('header-hidden'));
    assert.equal(env.document.querySelectorAll('.experience-growth').length,5);
    env.document.querySelector('.menu-button').dispatchEvent(new env.window.MouseEvent('click',{bubbles:true}));
    assert.equal(env.document.querySelector('#mobile-menu').open,true);
    globalThis.scrollY=500;env.window.dispatchEvent(new env.window.Event('scroll'));await wait(40);
    assert.ok(!header.classList.contains('header-hidden'));
    env.document.querySelector('#mobile-menu').dispatchEvent(new env.window.Event('cancel',{cancelable:true}));await wait(240);
    assert.equal(env.document.querySelector('#mobile-menu').open,false);
    const restored=new env.window.Event('pageshow');Object.defineProperty(restored,'persisted',{value:true});env.window.dispatchEvent(restored);
    assert.ok(!header.classList.contains('header-hidden'));
    const leaving=new env.window.Event('pagehide');Object.defineProperty(leaving,'persisted',{value:false});env.window.dispatchEvent(leaving);
  }finally{env.restore();}
});
