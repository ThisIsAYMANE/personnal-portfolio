import {qualityTiers,effectsConfig} from '../config.js';
import {clamp,followAlpha} from '../utils.js';
export function chooseQuality(width){return width<=800?2:1;}
export function shouldDowngrade(samples,threshold=.035){return samples.length>=effectsConfig.orb.downgradeSampleSize&&samples.reduce((a,b)=>a+b,0)/samples.length>threshold;}
export function qualityAtStage(tier,stage=0){const q={...qualityTiers[tier]};if(tier===3)return q;if(stage>=1){q.resolution*=.8;q.dpr=Math.max(1,q.dpr-.25);}if(stage>=2)q.particles=Math.floor(q.particles/2);if(stage>=3){q.octaves=Math.max(1,q.octaves-1);q.mesh*=.7;}return q;}
export function visibleTimeStep(now,previous){return Number.isFinite(previous)?clamp((now-previous)/1000,0,.05):0;}
export function orbPointer(x,y,bounds,canvasHeight){const nx=clamp((x-bounds.left)/Math.max(1,bounds.width)*2-1,-1,1),ny=-clamp((y-bounds.top)/Math.max(1,bounds.height)*2-1,-1,1),length=Math.max(1,Math.hypot(nx,ny)),scale=effectsConfig.orb.pointerPixels*2/Math.max(1,canvasHeight);return{x:nx/length*scale,y:ny/length*scale};}
const vertex=`attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=a_position;gl_Position=vec4(a_position,0.,1.);}`;
const fragment=`
precision PRECISION float;
varying vec2 v_uv;uniform float u_time;uniform vec2 u_resolution;uniform vec2 u_pointer;uniform int u_octaves;uniform float u_mesh;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float value=0.,amp=.5;for(int i=0;i<4;i++){if(i>=u_octaves)break;value+=amp*noise(p);p=p*2.02+vec2(9.4,12.2);amp*=.5;}return value;}
void main(){
 vec2 p=v_uv;p.x*=u_resolution.x/u_resolution.y;p-=u_pointer;
 float t=u_time*.023;float r=length(p),a=atan(p.y,p.x);
 vec2 q=vec2(fbm(p*1.8+vec2(t,-t*.6)),fbm(p*1.8+vec2(-t*.7,t*.35)+3.));
 vec2 warped=p+.16*(q-.5);float cloud=fbm(warped*3.7+vec2(t*.35,-t*.6));
 float pinkField=fbm(warped*2.2+vec2(-t*.4,t*.9)+7.);
 vec3 violet=vec3(.40,.16,.68),lavender=vec3(.72,.48,.9),pink=vec3(.77,.34,.59);
 vec3 hue=mix(violet,lavender,smoothstep(.3,.8,cloud));hue=mix(hue,pink,pinkField*.28);
 float body=exp(-r*r*3.8)*(.12+.52*cloud);float halo=exp(-r*2.7)*.08;
 float ring=exp(-abs(r-.38)*35.)*(.2+.65*fbm(vec2(a*1.8+t*.65,r*4.)));
 vec2 disk=vec2(p.x,p.y*3.+p.x*.32);float rd=length(disk);
 float acc=exp(-abs(rd-.46)*19.)*(.25+fbm(vec2(atan(disk.y,disk.x)*2.4+t,rd*6.))*.8);
 float mesh=0.;vec2 sphere=p/.59;float d=dot(sphere,sphere);
 if(d<1.){vec3 n=vec3(sphere,sqrt(max(0.,1.-d)));float tilt=t*.6+u_pointer.x*1.2;float s=sin(tilt),c=cos(tilt);vec3 rot=vec3(n.x*c+n.z*s,n.y,-n.x*s+n.z*c);float lon=atan(rot.x,rot.z),lat=asin(clamp(rot.y+u_pointer.y*.6,-1.,1.));float gx=1.-smoothstep(.02,.1,abs(sin(lon*8.)));float gy=1.-smoothstep(.02,.09,abs(sin(lat*7.)));mesh=max(gx,gy)*u_mesh*(1.-smoothstep(.8,1.,d));}
 float inner=smoothstep(.19,.27,r);vec3 light=(hue*(body+halo+acc*.8)+lavender*ring*.65+lavender*mesh)*inner;
 float fade=1.-smoothstep(.76,1.3,r);vec3 bg=vec3(.035,.027,.051);vec3 color=mix(vec3(.015,.01,.022),bg,inner)+light;
 gl_FragColor=vec4(clamp(color,0.,.88),fade);
}`;
const particleVertex=`
attribute vec4 a_particle;uniform float u_time;uniform vec2 u_resolution;uniform vec2 u_pointer;varying float v_alpha;varying float v_streak;
void main(){float a=a_particle.x+u_time*a_particle.z;float radius=a_particle.y;vec2 p=vec2(cos(a)*radius,sin(a)*radius*.78);p.y+=sin(u_time*.07+a_particle.x)*.02;p+=u_pointer;p.x/=u_resolution.x/u_resolution.y;gl_Position=vec4(p,0.,1.);gl_PointSize=a_particle.w;v_alpha=.16+.34*pow(sin(u_time*.15+a_particle.x)*.5+.5,2.);v_streak=step(5.,a_particle.w);}`;
const particleFragment=`precision mediump float;varying float v_alpha;varying float v_streak;void main(){vec2 p=gl_PointCoord-.5;p=mix(p,p*vec2(.45,2.5),v_streak);float alpha=(1.-smoothstep(.1,.48,length(p)))*v_alpha;gl_FragColor=vec4(.79,.64,.94,alpha);}`;
export function createOrb(canvas,{scheduler,getReduced,getVisible=()=>true}={}){
 let gl;try{gl=canvas.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});}catch{return null;}if(!gl)return null;
 let disposed=false,lost=false,visible=false,paused=false,motionAllowed=true,time=12,lastDraw=-Infinity,tier=chooseQuality(innerWidth),stage=0,cooldown=0;let px=0,py=0,tx=0,ty=0,canvasHeight=1;const samples=[],costs=[];const shell=canvas.closest('.orb-shell'),target=shell.closest('.skill-universe')||shell.closest('.hero');let bounds=target.getBoundingClientRect();
 const high=gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER,gl.HIGH_FLOAT);const precision=high?.precision?'highp':'mediump';
 function compile(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw Error('Shader compilation');}return s;}
 function program(v,f){const p=gl.createProgram(),vs=compile(gl.VERTEX_SHADER,v),fs=compile(gl.FRAGMENT_SHADER,f);gl.attachShader(p,vs);gl.attachShader(p,fs);gl.linkProgram(p);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(p,gl.LINK_STATUS)){gl.deleteProgram(p);throw Error('Shader linking');}return p;}
 let field,particles;
 try{field=program(vertex,fragment.replace('PRECISION',precision));particles=program(particleVertex,particleFragment);}catch{gl.getExtension('WEBGL_lose_context')?.loseContext();return null;}
 const quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const seeds=new Float32Array(32*4);for(let i=0;i<32;i++){seeds[i*4]=i*2.399963;seeds[i*4+1]=.32+.62*((i*17%31)/31);seeds[i*4+2]=.012+(i%5)*.003;seeds[i*4+3]=i%8===0?6:2+(i%3);}
 const points=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,points);gl.bufferData(gl.ARRAY_BUFFER,seeds,gl.STATIC_DRAW);
 const fields=Object.fromEntries(['u_time','u_resolution','u_pointer','u_octaves','u_mesh'].map(n=>[n,gl.getUniformLocation(field,n)]));
 const dots=Object.fromEntries(['u_time','u_resolution','u_pointer'].map(n=>[n,gl.getUniformLocation(particles,n)]));
 function resize(){if(disposed||lost)return;const r=canvas.getBoundingClientRect();canvasHeight=Math.max(1,r.height);const responsive=chooseQuality(innerWidth);tier=Math.max(tier,responsive);const q=qualityAtStage(tier,stage);const scale=Math.min(devicePixelRatio||1,q.dpr)*q.resolution;const cap=innerWidth<=800?600:1000;const ratio=Math.min(scale,cap/Math.max(1,r.width,r.height));canvas.width=Math.max(1,Math.round(r.width*ratio));canvas.height=Math.max(1,Math.round(r.height*ratio));gl.viewport(0,0,canvas.width,canvas.height);bounds=target.getBoundingClientRect();lastDraw=-Infinity;scheduler?.wake();canvas.dataset.quality=q.name;canvas.dataset.qualityStage=String(stage);}
 function draw(now,delta=.016,force=false,still=false){if(disposed||lost||document.hidden||(!force&&(paused||!visible||!getVisible())))return false;const reduced=still||!motionAllowed||getReduced?.()||tier===3;const interval=1000/(innerWidth<=800?effectsConfig.orb.compactFps:effectsConfig.orb.desktopFps);
  if(reduced&&lastDraw!==-Infinity&&!force)return false;if(!force&&now-lastDraw<interval)return !reduced;
  const step=visibleTimeStep(now,lastDraw),alpha=followAlpha(step,.35);px+=(tx-px)*alpha;py+=(ty-py)*alpha;if(!reduced)time+=step;const started=performance.now(),quality=qualityAtStage(tier,stage);
  gl.disable(gl.BLEND);gl.useProgram(field);gl.bindBuffer(gl.ARRAY_BUFFER,quad);const pos=gl.getAttribLocation(field,'a_position');gl.enableVertexAttribArray(pos);gl.vertexAttribPointer(pos,2,gl.FLOAT,false,0,0);
  gl.uniform1f(fields.u_time,reduced?12:time);gl.uniform2f(fields.u_resolution,canvas.width,canvas.height);gl.uniform2f(fields.u_pointer,reduced?0:px,reduced?0:py);gl.uniform1i(fields.u_octaves,quality.octaves);gl.uniform1f(fields.u_mesh,quality.mesh);gl.drawArrays(gl.TRIANGLES,0,6);gl.disableVertexAttribArray(pos);
  if(!reduced&&quality.particles){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(particles);gl.bindBuffer(gl.ARRAY_BUFFER,points);const attr=gl.getAttribLocation(particles,'a_particle');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,4,gl.FLOAT,false,0,0);gl.uniform1f(dots.u_time,time);gl.uniform2f(dots.u_resolution,canvas.width,canvas.height);gl.uniform2f(dots.u_pointer,px,py);gl.drawArrays(gl.POINTS,0,quality.particles);gl.disableVertexAttribArray(attr);}
  lastDraw=now;if(!reduced){samples.push(delta);costs.push((performance.now()-started)/1000);if(samples.length>effectsConfig.orb.downgradeSampleSize){samples.shift();costs.shift();}const slowFrames=shouldDowngrade(samples,innerWidth<=800?effectsConfig.orb.compactFrameSeconds:effectsConfig.orb.desktopFrameSeconds),slowSubmit=shouldDowngrade(costs,effectsConfig.orb.submitCostSeconds);if(now>cooldown&&(slowFrames||slowSubmit)&&tier<3){if(stage<3)stage++;else{tier=3;stage=0;}samples.length=costs.length=0;cooldown=now+effectsConfig.orb.cooldownSeconds*1000;resize();}}
  return !reduced;
 }
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;lastDraw=-Infinity;if(visible)scheduler?.wake();},{rootMargin:'0px'});observer.observe(canvas);
 const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);
 const setPointer=(x,y)=>{if(getReduced?.()||!motionAllowed)return;const pointer=orbPointer(x,y,bounds,canvasHeight);tx=pointer.x;ty=pointer.y;scheduler?.wake();};
 const onPointer=e=>{if(e.pointerType==='mouse'&&matchMedia('(any-hover:hover) and (any-pointer:fine)').matches)setPointer(e.clientX,e.clientY);};
 const leave=()=>{tx=0;ty=0;scheduler?.wake();},scroll=()=>{if(visible)bounds=target.getBoundingClientRect();},contextLost=e=>{e.preventDefault();lost=true;shell.classList.remove('webgl-ready');};
 target.addEventListener('pointermove',onPointer,{passive:true});target.addEventListener('pointerleave',leave);window.addEventListener('scroll',scroll,{passive:true});canvas.addEventListener('webglcontextlost',contextLost);
 const remove=scheduler?.add((now,delta)=>draw(now,delta));resize();draw(0,.016,true);shell.classList.add('webgl-ready');
 const renderer={draw,resize,setPointer,prepare(){return renderer;},start(){paused=false;lastDraw=-Infinity;scheduler?.wake();},pause(){paused=true;lastDraw=-Infinity;},setMotionAllowed(value){motionAllowed=value;tx=ty=0;lastDraw=-Infinity;scheduler?.wake();},reset(){lastDraw=-Infinity;tx=ty=0;scheduler?.wake();},renderStill(){lastDraw=-Infinity;draw(performance.now(),.016,true,true);},setVisible(value){visible=value;lastDraw=-Infinity;scheduler?.wake();},dispose(){if(disposed)return;disposed=true;remove?.();observer.disconnect();resizeObserver.disconnect();target.removeEventListener('pointermove',onPointer);target.removeEventListener('pointerleave',leave);window.removeEventListener('scroll',scroll);canvas.removeEventListener('webglcontextlost',contextLost);if(!lost){gl.deleteBuffer(quad);gl.deleteBuffer(points);gl.deleteProgram(field);gl.deleteProgram(particles);gl.getExtension('WEBGL_lose_context')?.loseContext();}}};
 return renderer;
}
