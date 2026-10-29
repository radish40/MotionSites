"""Recover specimen-only RGBA layers from this design's authorized 640×468 animation.
Requires Pillow, numpy, opencv-python-headless. No UI crops are published.
"""
from pathlib import Path
from PIL import Image, ImageFilter
import numpy as np
import cv2
ROOT=Path(__file__).resolve().parents[1]
out=ROOT/'public/assets';out.mkdir(parents=True,exist_ok=True)
ref=Image.open(ROOT/'recovery/reference-source.webp')
def frame(i):
 ref.seek(i);return np.array(ref.convert('RGB'))
def isolate(i,box,name,poly=None,light=False):
 a=frame(i); x,y,r,b=box; a=a[y:b,x:r].copy()
 hsv=cv2.cvtColor(a,cv2.COLOR_RGB2HSV)
 if light: mask=((hsv[:,:,1]>28)&(hsv[:,:,2]>22)).astype('uint8')*255
 else: mask=((hsv[:,:,1]>25)&(hsv[:,:,2]<240)&(hsv[:,:,2]>18)).astype('uint8')*255
 if poly:
  # Recover neutral/black bone shadows adjacent to chromatic bone pixels.
  distance=cv2.distanceTransform(255-mask,cv2.DIST_L2,5)
  yy,xx=np.indices(mask.shape)
  recover=(distance<4.5)&(np.max(a,axis=2)<175)
  # The headline passes behind the jaw in frame 0; do not recover its neutral ink.
  recover &= ~((xx+x<200)&(yy+y>232)&(yy+y<285))
  mask[recover]=255
  region=np.zeros(mask.shape,np.uint8);cv2.fillPoly(region,[np.array(poly)-[x,y]],255);mask &= region
 mask=cv2.morphologyEx(mask,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
 contours,_=cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
 clean=np.zeros(mask.shape,np.uint8)
 for c in contours:
  if cv2.contourArea(c)>5:cv2.drawContours(clean,[c],-1,255,-1)
 if name=='hero-skeleton.png':
  # Explicitly remove residual printed measurements outside the anatomy.
  for l,t,r,b in [(523,299,554,313),(84,275,97,288)]:
   section=clean[max(0,t-y):b-y,max(0,l-x):r-x]
   neutral=hsv[max(0,t-y):b-y,max(0,l-x):r-x,1]<40
   section[neutral]=0
 # Retain near-black shadows within the colored bone silhouette; discard UI outside it.
 rgba=np.dstack([a,clean]); im=Image.fromarray(rgba)
 bbox=im.getbbox();im=im.crop(bbox)
 im=im.resize((im.width*3,im.height*3),Image.Resampling.LANCZOS)
 im.save(out/name)
 return im
# Frame 0 contains the complete skull; later frames show it clipped by the viewport.
hero_poly=[(16,188),(40,163),(94,143),(150,131),(170,130),(273,144),(390,153),(448,168),(506,202),(640,241),(640,298),(512,272),(579,328),(615,351),(639,392),(639,425),(606,426),(582,383),(558,348),(497,332),(461,298),(425,268),(402,295),(417,359),(407,391),(387,419),(309,426),(309,413),(344,391),(366,372),(348,307),(356,274),(376,241),(388,214),(342,245),(301,291),(261,289),(226,301),(207,296),(213,274),(241,255),(235,223),(220,193),(194,208),(185,235),(174,252),(144,270),(117,278),(73,278),(44,264),(38,238),(56,237),(58,248),(85,250),(121,230),(148,214),(153,205),(143,198),(114,211),(85,228),(50,228),(26,216),(18,203)]
hero=isolate(0,(12,125,640,430),'hero-skeleton.png',hero_poly)
isolate(45,(88,0,556,278),'pterodactyl.png',light=True)
isolate(57,(35,246,197,336),'chapter-5.png',light=True)
isolate(72,(30,256,198,331),'chapter-1.png',light=True)
# Chapter 3 is an explicitly documented equivalent using the recovered flying reptile.
Image.open(out/'pterodactyl.png').save(out/'chapter-3.png')
print('Recovered hero, pterodactyl, T. rex and mammoth; chapter 3 reuses recovered pterodactyl.')
# USGS public-domain photographic equivalents, processed locally for the dark gallery.
a=Image.open(ROOT/'recovery/ammonite.jpg').convert('RGB');a.thumbnail((676,700));arr=np.array(a)
points=np.array([(18,300),(35,230),(100,170),(210,125),(307,119),(363,140),(430,190),(463,227),(631,244),(640,278),(622,350),(603,453),(561,526),(450,572),(276,584),(140,548),(55,457),(13,348)])
mask=np.zeros(arr.shape[:2],np.uint8);cv2.fillPoly(mask,[points],255)
rgba=Image.fromarray(np.dstack([arr,mask]));rgba.crop(rgba.getbbox()).save(out/'chapter-4.png')
a=Image.open(ROOT/'recovery/trilobite.jpg').convert('RGB');a.thumbnail((1000,1000));arr=np.array(a)
mask=(np.max(arr,axis=2)>42).astype('uint8')*255
mask=cv2.morphologyEx(mask,cv2.MORPH_CLOSE,np.ones((9,9),np.uint8))
contours,_=cv2.findContours(mask,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE);mask[:]=0;cv2.drawContours(mask,[max(contours,key=cv2.contourArea)],-1,255,-1)
rgba=Image.fromarray(np.dstack([arr,mask]));rgba.crop(rgba.getbbox()).save(out/'chapter-2.png')
