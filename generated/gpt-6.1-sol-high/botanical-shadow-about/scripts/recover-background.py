"""Reconstruct THIS design's compressed preview, never the original MP4.

Run from project root using recovery-requirements.txt in a local venv.
Mask static artwork using temporal maximum (moving shadows are lighter than
letter interiors), dilate to remove antialiased edges, then Navier-Stokes
inpaint each frame. Reverse the known overlay in sRGB. No new motion is made.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import cv2
import numpy as np
from PIL import Image, ImageSequence
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'recovery/original-preview.webp'
out = ROOT / 'recovery/frames'
out.mkdir(parents=True, exist_ok=True)
im = Image.open(source)
frames, durations = [], []
for frame in ImageSequence.Iterator(im):
    frames.append(np.array(frame.convert('RGB')))
    durations.append(frame.info.get('duration', 100))
stack = np.stack(frames)
# Temporal maximum keeps stationary ink while rejecting passing shadow edges.
lightest = np.stack([cv2.cvtColor(f, cv2.COLOR_RGB2GRAY) for f in frames]).max(axis=0)
mask = np.zeros(lightest.shape, np.uint8)
for x1, y1, x2, y2, threshold in [(183,153,458,315,170), (214,431,425,458,185)]:
    mask[y1:y2,x1:x2] = (lightest[y1:y2,x1:x2] < threshold).astype(np.uint8)*255
mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(9,9)))
# Thin divider and pin, including their antialiasing.
mask[357:398,317:323] = 255
mask[405:425,309:330] = 255
# Rounded screenshot corner artifacts, completely removed.
for ys in [slice(0,5), slice(-5,None)]:
    for xs in [slice(0,5), slice(-5,None)]: mask[ys,xs] = 255
Image.fromarray(mask).save(ROOT/'recovery/removal-mask.png')
clean_frames=[]
for i, frame in enumerate(frames):
    clean = cv2.inpaint(frame, mask, 10, cv2.INPAINT_NS)
    # Soft background: eliminate high-frequency interpolation seams in masked
    # regions without blurring the original unmasked botanical silhouettes.
    smoothed = cv2.GaussianBlur(clean,(0,0),3)
    clean[mask>0]=smoothed[mask>0]
    clean_frames.append(clean)
    unoverlaid = np.clip((clean.astype(np.float32) - .38*np.array([242,238,230]))/.62,0,255).round().astype(np.uint8)
    Image.fromarray(unoverlaid).save(out/f'{i:03d}.png')
# Inspect a recovered frame WITH the overlay re-applied, and a contact sheet.
Image.fromarray(clean_frames[0]).save(ROOT/'recovery/recovered-preview.png')
contact=Image.new('RGB',(640*2,478*2))
for index,pos in zip([0,20,40,67],[(0,0),(640,0),(0,478),(640,478)]): contact.paste(Image.fromarray(clean_frames[index]),pos)
contact.save(ROOT/'recovery/recovered-contact-sheet.png')
# Preserve variable frame timing using a concat demuxer and millisecond timebase.
concat=ROOT/'recovery/concat.txt'
concat.write_text(''.join(f"file 'frames/{i:03d}.png'\noption framerate 1000\nduration {duration/1000:.6f}\n" for i,duration in enumerate(durations))+f"file 'frames/{len(frames)-1:03d}.png'\noption framerate 1000\n")
video=ROOT/'public/assets/botanical-shadow-recovered.webm'
video.parent.mkdir(parents=True,exist_ok=True)
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-f','concat','-safe','0','-i',str(concat),'-t',f'{sum(durations)/1000:.6f}','-fps_mode','vfr','-c:v','libvpx-vp9','-b:v','0','-crf','22','-pix_fmt','yuv420p','-bsf:v','setts=duration=66',str(video)],check=True)
report={'source':'original-preview.webp','source_url':'https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/animated%20(11).webp','source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'frames':len(frames),'size':[im.width,im.height],'durations_ms':durations,'duration_seconds':sum(durations)/1000,'masked_pixels':int((mask>0).sum()),'video_sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'method':'Temporal-maximum ink mask, antialias dilation, per-frame Navier-Stokes spatial inpainting, inverse specified 38% warm overlay, VP9 variable frame timing. Original motion retained; occluded background approximated.','limitation':'Lossy recovery from compressed design preview, not the original unavailable Cloudinary MP4.'}
(ROOT/'recovery/provenance.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
