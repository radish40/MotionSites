"""Recreate the unspecified chart PNG to match the DOM SVG curve, using stdlib."""
import struct,zlib
w,h=800,350
segments=[[(0,328),(210,328),(315,245),(420,207)],[(420,207),(525,169),(645,137),(800,8)]]
def point(points,t,axis):
 return sum(points[i][axis]*[1,3,3,1][i]*(1-t)**(3-i)*t**i for i in range(4))
def curve_y(x):
 points=segments[0 if x<=420 else 1];lo,hi=0,1
 for _ in range(20):
  t=(lo+hi)/2
  if point(points,t,0)<x:lo=t
  else:hi=t
 return point(points,(lo+hi)/2,1)
curve=[curve_y(x) for x in range(w)];raw=bytearray()
for y in range(h):
 raw.append(0)
 for x in range(w):
  t=x/(w-1);a=int(110*(1-y/h)) if y>=curve[x] else 0
  raw.extend((int(130+117*t),int(56+36*t),int(220-37*t),a))
def chunk(t,d):return struct.pack('!I',len(d))+t+d+struct.pack('!I',zlib.crc32(t+d)&0xffffffff)
open('src/assets/chart-fill.png','wb').write(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('!2I5B',w,h,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(raw))+chunk(b'IEND',b''))
