export const effectsConfig = Object.freeze({
  gallery:{minWidth:1024,minHeight:700,headerOffset:96,minimumCount:2},
  timings:{reveal:600,rowStagger:60,accordion:220,menu:220,loaderExit:400,ambient:28000},
  cursor:{responseSeconds:.09,diameter:26,navDiameter:35,projectDiameter:72,disclosureDiameter:44,maxButtonWidth:320,maxButtonHeight:80,boundsPadding:6,maxStretch:1.15,settleDistance:.08},
  header:{topGuard:120,downThreshold:16,upThreshold:8,transitionMs:220,navigationHoldMs:350},
  orb:{pointerPixels:10,prepareMargin:240,desktopFps:30,compactFps:20,downgradeSampleSize:90,cooldownSeconds:8,desktopFrameSeconds:.035,compactFrameSeconds:.045,submitCostSeconds:.008},
  loader:{fallbackMs:2800,fontTimeoutMs:1500,cacheKey:'portfolio-opened-v2'},
});
export const qualityTiers=[
  {name:'high',resolution:.9,dpr:1.5,octaves:4,particles:32,mesh:.05},
  {name:'balanced',resolution:.75,dpr:1.25,octaves:3,particles:20,mesh:.04},
  {name:'compact',resolution:.65,dpr:1,octaves:2,particles:10,mesh:.025},
  {name:'still',resolution:.55,dpr:1,octaves:2,particles:0,mesh:.025},
];
export const designTokens={bg:'#09070D',deep:'#050408',surface:'#141019',surfaceHover:'#21172D',text:'#F2EDF6',secondary:'#BDB3C8',muted:'#9D90AD',lavender:'#BE91F5',violet:'#8643EA',pink:'#E384CD',ice:'#DCD0FF',loader:'#EBE6EE',spacing:[4,8,12,16,20,24,32,40,48,64,80,96,128,160]};
