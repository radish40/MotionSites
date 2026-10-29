"""Isolate only pedestal/bird pixels from the authorized design reference.
Run with Pillow + NumPy; source: recovery/reference.webp. Never exports page UI.
"""
from PIL import Image,ImageDraw,ImageFilter
import numpy as np, json
im=Image.open('recovery/reference.webp');im.seek(26);frame=im.convert('RGBA')
mask=Image.new('L',im.size);d=ImageDraw.Draw(mask)
# Hand-traced silhouette of the mossy stone; source UI remains outside mask.
stone=[(186,104),(209,101),(332,101),(432,104),(439,112),(439,145),(431,167),(420,184),(424,209),(438,231),(446,249),(443,267),(433,285),(415,301),(376,322),(335,338),(303,350),(298,355),(324,363),(380,369),(414,379),(432,386),(424,396),(399,405),(352,410),(306,407),(268,400),(240,391),(223,376),(214,360),(209,340),(215,319),(233,299),(265,276),(285,254),(293,237),(291,224),(279,208),(261,196),(232,185),(210,176),(196,165),(188,150),(184,128)]
d.polygon(stone,fill=255)
# Grass/flowers are segmented by chroma within tightly bounded foreground areas.
a=np.asarray(frame).astype(float);sat=a[:,:,:3].max(2)-a[:,:,:3].min(2)
foliage=Image.new('L',im.size);fd=ImageDraw.Draw(foliage)
fd.polygon([(28,383),(60,357),(94,345),(118,303),(127,253),(143,243),(149,197),(158,193),(181,228),(208,283),(236,301),(299,357),(377,347),(406,310),(433,259),(448,218),(465,228),(480,295),(535,321),(572,341),(602,368),(596,382),(620,401),(632,432),(574,447),(460,452),(370,462),(240,452),(165,446),(126,412),(31,412)],fill=255)
fa=np.asarray(foliage).copy();fa[sat<9]=0
# Do not retain any CTA pixels.
fa[185:296,483:624]=0
ma=np.maximum(np.asarray(mask),fa).copy();ma[sat<8]=0
mask=Image.fromarray(ma).filter(ImageFilter.GaussianBlur(.25))
frame.putalpha(mask)
# Matches original 160vw slab layout: transparent margins preserve true center scale.
canvas=Image.new('RGBA',(1024,600));canvas.alpha_composite(frame,(192,-100))
canvas.save('public/assets/pedestal-recovered.png',optimize=True)
# Bird: retain only its own silhouette, not the letter behind it.
im.seek(0);frame=im.convert('RGBA');m=Image.new('L',im.size);d=ImageDraw.Draw(m)
d.polygon([(379,215),(389,210),(391,207),(398,205),(403,208),(408,211),(413,214),(418,220),(421,229),(423,237),(416,234),(412,238),(408,237),(404,236),(402,232),(399,229),(396,224),(391,220),(389,216)],fill=255)
frame.putalpha(m.filter(ImageFilter.GaussianBlur(.3)))
frame.crop((376,202,427,242)).save('public/assets/bird-recovered.png',optimize=True)
print('Recovered isolated pedestal and kingfisher; all UI excluded.')
