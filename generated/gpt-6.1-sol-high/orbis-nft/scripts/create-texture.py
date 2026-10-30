"""Create the subtle original grain used when /texture.png has no supplied source."""
from pathlib import Path
import random
import struct
import zlib

rng = random.Random(42)
width = height = 768
raw = b''.join(b'\0' + bytes(rng.randrange(0, 19) for _ in range(width)) for _ in range(height))

def chunk(kind, data):
    return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind + data) & 0xffffffff)

image = (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('!2I5B', width, height, 8, 0, 0, 0, 0))
         + chunk(b'IDAT', zlib.compress(raw)) + chunk(b'IEND', b''))
(Path(__file__).resolve().parent.parent / 'public' / 'texture.png').write_bytes(image)
