"""Render the existing code-defined sharing card from current identity content.

Only the generated sharing PNG and its manifest entry change. Original media,
fonts and CVs are never cropped, edited or rewritten by this command.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json,math,subprocess,hashlib

ROOT=Path(__file__).resolve().parent.parent

def generate_social_preview():
    export="import {contact} from './src/content.js'; import {ui} from './src/ui-copy.js'; console.log(JSON.stringify({name:contact.name,role:ui.en.role,areas:ui.en.subrole}));"
    content=json.loads(subprocess.check_output(['node','--input-type=module','-e',export],cwd=ROOT,text=True,encoding='utf8'))
    image=Image.new('RGB',(1200,630),'#09070d');pixels=image.load()
    for y in range(630):
        for x in range(1200):
            radius=math.hypot((x-915)/390,(y-290)/390)
            ring=math.exp(-abs(radius-.42)*25);halo=math.exp(-radius*3)*.28
            value=(ring*.65+halo)*max(0,min(1,(radius-.23)*15))
            pixels[x,y]=(int(9+value*130),int(7+value*65),int(13+value*175))
    draw=ImageDraw.Draw(image)
    display=ImageFont.truetype(str(ROOT/'assets/fonts/Rengok.ttf'),112)
    body=ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf',21)
    draw.text((60,63),content['role'].upper(),font=body,fill='#be91f5')
    first,_,last=content['name'].partition(' ')
    draw.text((60,155),first,font=display,fill='#f2edf6')
    draw.text((60,288),last,font=display,fill='#f2edf6')
    draw.line((60,505,1140,505),fill='#302537')
    draw.text((60,543),content['areas'],font=body,fill='#bdb3c8')
    output=ROOT/'public/social-preview.png';image.save(output,optimize=True)
    manifest=ROOT/'public/asset-manifest.json'
    if manifest.exists():
        data=json.loads(manifest.read_text(encoding='utf8'))
        entry=next(item for item in data['other'] if item['file']=='public/social-preview.png')
        entry.update({'bytes':output.stat().st_size,'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'source':'scripts/generate-social-preview.py; current src/content.js and src/ui-copy.js'})
        manifest.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print('Rendered 1200x630 sharing card with current title and four opportunity areas.')

if __name__=='__main__':generate_social_preview()
