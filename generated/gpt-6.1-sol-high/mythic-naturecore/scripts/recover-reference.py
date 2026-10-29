"""Recover independent photographic layers from this design's authorized reference.
Requires Pillow, numpy, opencv-python-headless. Source: recovery/reference.webp.
No UI/text/buttons are retained as background pixels. See recovery/README.md.
"""
from PIL import Image
import numpy as np, cv2, json
from pathlib import Path
out=Path('public/assets'); out.mkdir(exist_ok=True)
im=Image.open('recovery/reference.webp')
frames=[]
for i in range(im.n_frames):
 im.seek(i);frames.append(np.array(im.convert('RGB')))
# The actual scene is inset in the reference; exclude its presentation border.
box=(82,88,557,393);x0,y0,x1,y1=box
crops=[cv2.resize(f[y0:y1,x0:x1],None,fx=3,fy=3,interpolation=cv2.INTER_CUBIC) for f in frames]
base=crops[0];h,w=base.shape[:2]
# Mask portal interior so its independently moving world cannot affect registration.
featuremask=np.full((h,w),255,np.uint8)
cv2.rectangle(featuremask,(0,0),(w,55),0,-1)
cv2.rectangle(featuremask,(25,265),(430,555),0,-1)
cv2.rectangle(featuremask,(850,350),(w,580),0,-1)
cv2.ellipse(featuremask,(w//2+30,580),(195,400),0,0,360,0,-1)
sift=cv2.SIFT_create(nfeatures=4500,contrastThreshold=.012)
kp,ds=sift.detectAndCompute(cv2.cvtColor(base,cv2.COLOR_RGB2GRAY),featuremask)
# Remove lettering by thin local masks, not a whole-page blur.
ui=np.zeros((h,w),np.uint8)
# Thin glyph masks avoid smearing clean photographic regions behind live text.
hsv=cv2.cvtColor(base,cv2.COLOR_RGB2HSV)
white=((hsv[:,:,1]<65)&(hsv[:,:,2]>130)).astype(np.uint8)*255
for a,b,c,d in [(0,0,1425,45),(40,278,420,565),(0,857,325,915),(645,775,775,915)]:
 ui[b:d,a:c]=white[b:d,a:c]
ui=cv2.dilate(ui,np.ones((5,5),np.uint8))
cv2.rectangle(ui,(850,665),(915,750),255,-1)
cv2.rectangle(ui,(850,350),(1425,575),255,-1)
# Register clean later portal frames and collect reusable unoccluded pixels.
acc=np.zeros_like(base,dtype=np.float32);weights=np.zeros((h,w),np.float32);registrations=[]
for n in range(24,37):
 src=crops[n];k,d=sift.detectAndCompute(cv2.cvtColor(src,cv2.COLOR_RGB2GRAY),None)
 if d is None:continue
 matches=cv2.BFMatcher().knnMatch(d,ds,k=2); good=[a for a,b in matches if a.distance<.72*b.distance]
 if len(good)<8:continue
 mat,inliers=cv2.estimateAffinePartial2D(np.float32([k[m.queryIdx].pt for m in good]),np.float32([kp[m.trainIdx].pt for m in good]),method=cv2.RANSAC,ransacReprojThreshold=3)
 if mat is None:continue
 scale=float(np.linalg.norm(mat[0,:2]));registrations.append({'frame':n,'inverse_scale':scale,'inliers':int(inliers.sum())})
 if not .15<scale<.95:continue
 valid=np.full((h,w),255,np.uint8);valid[:55,:]=0;valid[-15:,:]=0;valid[:,:12]=0;valid[:,-15:]=0
 # Inset navigation, stationary cursor and remaining title/card fade.
 if n<28:
  for a,b,c,d in [(20,265,435,570),(840,345,1425,580)]:cv2.rectangle(valid,(a,b),(c,d),0,-1)
 cv2.rectangle(valid,(690,550),(775,670),0,-1)
 warped=cv2.warpAffine(src,mat,(w,h));v=cv2.warpAffine(valid,mat,(w,h),flags=cv2.INTER_NEAREST)/255
 acc+=warped*v[:,:,None];weights+=v
clean=base.copy();replace=(ui>0)&(weights>0);clean[replace]=(acc[replace]/weights[replace,None]).astype(np.uint8)
remaining=(ui>0)&(weights==0)
# Inpaint residual occlusions using surrounding pixels from this same design.
# Reconstruct the unrecoverable right card footprint with foliage sampled from
# the same image lower down, seamlessly blended; never retain card UI.
patch=cv2.resize(base[620:850,900:1420],(575,225))
clone_mask=np.full(patch.shape[:2],255,np.uint8)
clean=cv2.seamlessClone(patch,clean,clone_mask,(1137,462),cv2.NORMAL_CLONE)
remaining[350:575,850:1425]=False
clean=cv2.inpaint(clean,remaining.astype(np.uint8)*255,5,cv2.INPAINT_TELEA)
# Remove every residual title/nav pixel, including compressed dark glyph fringes.
# These areas were occluded in all usable reference frames; transplant only
# nearby photographic foliage, then blend it into the original image.
def transplant(rect, source):
 global clean
 a,b,c,d=rect; e,f,g,j=source
 patch=cv2.resize(base[f:j,e:g],(c-a,d-b))
 mask=np.full(patch.shape[:2],255,np.uint8)
 clean=cv2.seamlessClone(patch,clean,mask,((a+c)//2,(b+d)//2),cv2.NORMAL_CLONE)
transplant((30,270,425,570),(30,580,425,880))
transplant((845,345,1425,585),(1050,610,1425,885))
# Edge strips are reconstructed with adjacent foliage; no preview navigation,
# progress dots or frame border survives in the downloadable portal layer.
clean[:55]=base[55:110][::-1]
clean[850:915,:330]=cv2.resize(base[730:840,:330],(330,65))
# Portal aperture traced inside mossy stone arch (coordinates in scene crop).
# These are reference pixels, not a synthetic arch or full-page screenshot.
alpha=np.full((h,w),255,np.uint8)
angles=np.linspace(np.pi,2*np.pi,45)
pts=np.array([(197,305),(199,150)]+[(254+55*np.cos(t),150+85*np.sin(t)) for t in angles]+[(309,305)],np.float32)*3
cv2.fillPoly(alpha,[pts.astype(np.int32)],0)
alpha=cv2.GaussianBlur(alpha,(7,7),1)
# Feather the reconstructed canvas margins into the independent forest layer.
y=np.arange(h)[:,None];fade=np.minimum(np.clip(y/100,0,1),np.clip((h-1-y)/45,0,1));fade=fade*fade*(3-2*fade)
alpha=(alpha*fade).astype(np.uint8)
Image.fromarray(np.dstack([clean,alpha])).save(out/'portal-recovered.png')
# Recover world from a late frame before CTA appears; crop excludes navigation/border.
world=frames[44][108:392,130:554].copy(); mask=np.zeros(world.shape[:2],np.uint8)
cv2.rectangle(mask,(182,171),(205,199),255,-1) # visible cursor only
world=cv2.inpaint(world,mask,5,cv2.INPAINT_TELEA)
Image.fromarray(world).resize((1600,1000),Image.Resampling.LANCZOS).save(out/'world-recovered.jpg',quality=94)
# Foliage is separately cut from the clean reference portal margins. Soft leaf masks
# preserve photographic texture while allowing independent opening/parallax.
for side in ['left','right']:
 width=390
 piece=clean[:,:width].copy() if side=='left' else clean[:,-width:].copy()
 gray=cv2.cvtColor(piece,cv2.COLOR_RGB2GRAY)
 xx=np.linspace(0,1,width)[None,:]
 fade=np.clip((1-xx)/.45,0,1) if side=='left' else np.clip(xx/.45,0,1)
 a=np.tile(fade,(h,1))*255
 # Edge feather uses luminosity for natural irregular leaf silhouettes.
 edge=(xx>.55) if side=='left' else (xx<.45)
 a=a.astype(np.uint8)
 Image.fromarray(np.dstack([piece,a])).save(out/f'curtain-{side}-recovered.png')
# Ordered card art comes from frame 0. Crop out rounded corners/bottom live labels.
# Reference order is Card 3 (green arch), Card 1 (ivory arch), Card 2 (nested green doors).
for i,(a,b,c,d) in enumerate([(373,215,423,248),(432,215,483,247),(494,218,541,249)],1):
 art=frames[0][b:d,a:c]
 # The clean upper artwork is extended vertically instead of retaining baked labels.
 Image.fromarray(art).resize((360,360),Image.Resampling.LANCZOS).save(out/f'card-{i}-recovered.jpg',quality=95)
Path('recovery/recovery-report.json').write_text(json.dumps({'source_url':'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(72).webp','source_size':[640,480],'frames':len(frames),'scene_crop':box,'registrations':registrations,'portal_ui_pixels':int((ui>0).sum()),'recovered_ui_pixels':int(replace.sum()),'inpainted_ui_pixels':int(remaining.sum()),'outputs':['portal-recovered.png','world-recovered.jpg','curtain-left-recovered.png','curtain-right-recovered.png','card-1-recovered.jpg','card-2-recovered.jpg','card-3-recovered.jpg']},indent=2))
print('recovered',int(replace.sum()),'inpainted',int(remaining.sum()),'registrations',registrations)
