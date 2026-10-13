export function projectHref(id,lang='en'){return lang==='fr'?`fr/works/${id}/index.html`:`works/${id}/index.html`;}
export function archiveHref(lang='en'){return lang==='fr'?'fr/works/index.html':'works/index.html';}
export function homeHref(lang='en'){return lang==='fr'?'fr.html':'index.html';}
export function languageHref(lang,page='home',id){const destination=page==='case'&&id?projectHref(id,lang):page==='archive'?archiveHref(lang):homeHref(lang);return destination+'?lang='+lang;}
export function responsiveSource(path,width){return `public/media/responsive/${path.split('/').pop().replace(/\.webp$/,'')}-${width}.webp`;}
export function validateContent({projects,skills,copy,contact}){
  const errors=[];const ids=new Set();
  if(contact){if(!contact.name||!/^\S+@\S+\.\S+$/.test(contact.email||''))errors.push('Profile name/email');for(const key of ['linkedin','github','instagram','whatsapp'])if(!contact[key]?.startsWith('https://'))errors.push('Contact URL: '+key);}
  for(const p of projects){if(ids.has(p.id)||!/^[a-z0-9-]+$/.test(p.id))errors.push('Project id: '+p.id);ids.add(p.id);for(const lang of ['en','fr'])for(const field of ['title','summary','details','role','status','category'])if(!p[field]?.[lang])errors.push(`${p.id}.${field}.${lang}`);if(!p.cover||!p.stack?.length)errors.push(p.id+'.assets');if(p.repo&&!p.repo.startsWith('https://'))errors.push(p.id+'.repo');}
  for(const lang of ['en','fr']){
    const data=copy[lang];
    if(!data?.servicesList?.length||!data?.experienceList?.length){errors.push('Language content: '+lang);continue;}
    data.servicesList.forEach((row,index)=>{if(!Array.isArray(row)||row.slice(0,3).length!==3||row.slice(0,3).some(value=>typeof value!=='string'||!value.trim())||!Array.isArray(row[3])||!row[3].length||row[3].some(value=>typeof value!=='string'||!value.trim()))errors.push(`Service row: ${lang}.${index}`);});
    data.experienceList.forEach((row,index)=>{if(!Array.isArray(row)||row.length<5||row.length>6||row.slice(0,5).some(value=>typeof value!=='string'||!value.trim())||(row[5]!==undefined&&typeof row[5]!=='string'))errors.push(`Experience row: ${lang}.${index}`);if(row?.[5]&&!data.growthLabel)errors.push('Growth label: '+lang);});
  }
  if(new Set(skills.map(s=>s[0])).size!==skills.length)errors.push('Duplicate skills');
  return errors;
}
