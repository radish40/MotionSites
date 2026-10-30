import ffmpeg from 'ffmpeg-static';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
mkdirSync('public/media/hls', { recursive: true });
execFileSync(ffmpeg, ['-y', '-i', 'public/media/coast-source.mp4', '-t', '24', '-an', '-vf', 'scale=1920:-2', '-c:v', 'libx264', '-preset', 'fast', '-crf', '23', '-pix_fmt', 'yuv420p', '-g', '120', '-keyint_min', '120', '-sc_threshold', '0', '-hls_time', '4', '-hls_list_size', '0', '-hls_playlist_type', 'vod', '-hls_segment_filename', 'public/media/hls/coast-%03d.ts', 'public/media/hls/coast.m3u8'], {stdio:'inherit'});
execFileSync(ffmpeg, ['-y', '-ss', '3', '-i', 'public/media/coast-source.mp4', '-frames:v', '1', '-q:v', '3', 'public/media/poster.jpg'], {stdio:'inherit'});
