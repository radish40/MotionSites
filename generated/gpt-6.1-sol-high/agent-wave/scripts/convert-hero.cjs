const {execFileSync}=require('node:child_process');
const ffmpeg=require('ffmpeg-static');
// Original supplied asset: no page, typography, or controls are embedded.
execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-i','source-hero.mp4','-vf','fps=24,scale=1920:-2','-c:v','libwebp_anim','-quality','88','-loop','0','-an','-y','hero-wave.webp'],{stdio:'inherit'});
execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-i','source-hero.mp4','-frames:v','1','-quality','85','-y','hero-poster.webp'],{stdio:'inherit'});
