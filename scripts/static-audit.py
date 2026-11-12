from pathlib import Path
from bs4 import BeautifulSoup
from PIL import Image
root=Path(__file__).resolve().parents[1]
errors=[]
for file in sorted((root/'content').glob('*.html')):
    doc=BeautifulSoup(file.read_text(),'html.parser')
    ids=[e.get('id') for e in doc.select('[id]')]
    duplicate=sorted({x for x in ids if ids.count(x)>1})
    if duplicate:errors.append(f'{file.name}: duplicate IDs {duplicate}')
    for img in doc.select('img'):
        src=img.get('src','')
        if src.startswith('/images/'):
            asset=root/'public'/src.lstrip('/')
            if not asset.exists():errors.append(f'{file.name}: missing image {src}')
            else:
                with Image.open(asset) as im:
                    if (int(img.get('width',0)),int(img.get('height',0)))!=im.size:errors.append(f'{file.name}: dimensions mismatch {src}')
        if not img.get('alt'):errors.append(f'{file.name}: missing alt on {src}')
    for a in doc.select('a[href^="#"]'):
        fragment=a['href'][1:]
        if fragment and fragment not in ids:errors.append(f'{file.name}: missing anchor #{fragment}')
    print(f'{file.name}: {len(doc.select("img"))} images, {len(ids)} IDs, {len(doc.select("a"))} links')
print('AUDIT ERRORS:',len(errors))
for error in errors:print(' -',error)
raise SystemExit(bool(errors))
