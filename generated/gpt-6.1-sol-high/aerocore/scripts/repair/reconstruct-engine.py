"""Reconstruct this design's engine from aligned preview regions, never page pixels.
Requires numpy and opencv-python-headless. Source animation is in this directory.
"""
from pathlib import Path
import json
import cv2
import numpy as np
here=Path(__file__).resolve().parent
base=cv2.imread(str(here/'frames/0.png'))
H,W=540,640
layers=[];shifts=[]
for i in [0,*range(17,34)]:
    im=cv2.imread(str(here/f'frames/{i}.png'))
    dy=0.
    if i:
        result=cv2.matchTemplate(cv2.cvtColor(im[80:465,380:416],cv2.COLOR_BGR2GRAY),cv2.cvtColor(base[360:450,380:416],cv2.COLOR_BGR2GRAY),cv2.TM_CCOEFF_NORMED)
        _,score,_,pos=cv2.minMaxLoc(result)
        y=pos[1]
        offset=0.
        if 0<y<len(result)-1:
            a,b,c=result[y-1,0],result[y,0],result[y+1,0]
            offset=float(.5*(a-c)/(a-2*b+c))
        dy=360-(80+y+offset)
    shifts.append({'frame':i,'vertical_alignment':dy})
    valid=np.ones(im.shape[:2],np.uint8)*255
    # The cursor is screen-fixed while the engine translates.
    valid[262:300,246:273]=0
    if i: valid[:48]=0 # floating navigation
    # Later frames expose the white mission section below the engine.
    if i>=28:
        for y in range(350,472):
            if np.count_nonzero(np.min(im[y],axis=1)>245)>540:
                valid[y:]=0;break
    aligned=cv2.warpAffine(im.astype(np.float32),np.float32([[1,0,0],[0,1,dy]]),(W,H),flags=cv2.INTER_LINEAR,borderValue=(255,255,255))
    mask=cv2.warpAffine(valid,np.float32([[1,0,0],[0,1,dy]]),(W,H),flags=cv2.INTER_NEAREST)
    aligned[mask<255]=np.nan
    layers.append(aligned)
stack=np.stack(layers)
# Text is white; darker registered views reveal the original underlying metal.
import warnings
with warnings.catch_warnings():
    warnings.simplefilter('ignore')
    count=np.sum(~np.isnan(stack),axis=0)
    sorted_stack=np.sort(stack,axis=0)
    indices=np.maximum(0,np.floor((count-1)*.18)).astype(int)
    recovered=np.take_along_axis(sorted_stack,indices[None],axis=0)[0]
recovered=np.nan_to_num(recovered,nan=0).clip(0,255).astype(np.uint8)
cv2.imwrite(str(here/'aligned-contact-sheet.png'),recovered)
# Trace the exact silhouette, then use color difference to clear gaps between pipes.
left=[(320,31),(300,32),(280,37),(261,46),(246,59),(237,77),(230,95),(225,127),(223,170),(222,210),(222,250),(222,290),(220,325),(216,349),(210,368),(206,392),(202,417),(199,439),(197,460),(197,483),(200,500),(209,518)]
right=[(431,518),(440,500),(444,483),(444,460),(441,439),(438,417),(434,392),(431,368),(425,349),(421,325),(418,290),(418,250),(418,210),(417,170),(416,127),(411,95),(403,77),(394,59),(379,46),(360,37),(340,32),(320,31)]
mask=np.zeros((H,W),np.uint8)
cv2.fillPoly(mask,[np.array(left+right,np.int32)],255)
# Feather only the outside edge by less than a preview pixel.
mask=cv2.GaussianBlur(mask,(3,3),.55)
# Initial preview colors give the blue exterior/background between fine hardware.
bgr=recovered.astype(float)
blue=bgr[:,:,0]-bgr[:,:,2]
bluekey=np.clip((14-blue)/9,0,1)
# Apply color key only at outer housing; don't erase cold reflections inside.
xx=np.arange(W)[None,:];yy=np.arange(H)[:,None]
outer=(xx<225)|(xx>416)
mask=(mask*np.where(outer,bluekey,1)).astype(np.uint8)
rgba=np.dstack([recovered,mask])
# Transparent canvas matches original engine wrapper proportions and top padding.
canvas=np.zeros((528,352,4),np.uint8)
canvas[8:,:,:]=rgba[:520,144:496]
# Save 2x with Lanczos; no claim of additional source detail.
canvas=cv2.resize(canvas,(704,1056),interpolation=cv2.INTER_LANCZOS4)
out=here.parent.parent/'assets/engine-reconstructed.png'
canvas[canvas[:,:,3]==0,:3]=0
cv2.imwrite(str(out),canvas)
(here/'alignment.json').write_text(json.dumps(shifts,indent=2)+'\n')
print('Saved',out,canvas.shape)
