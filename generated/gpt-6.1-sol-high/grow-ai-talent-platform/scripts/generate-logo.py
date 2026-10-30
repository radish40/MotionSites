"""Generate original logo approximation; no source logo was supplied."""
import struct
import zlib
from pathlib import Path
raw = bytearray()
for y in range(128):
    raw.append(0)
    for x in range(128):
        inside = (abs(x - 63.5) / 53) ** 0.58 + (abs(y - 63.5) / 53) ** 0.58 <= 1
        raw.extend((239, 240, 247, 255 if inside else 0))
def chunk(kind, data):
    return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind + data) & 0xffffffff)
output = Path(__file__).resolve().parent.parent / 'src/assets/logo.png'
output.write_bytes(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('!2I5B', 128, 128, 8, 6, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(raw)) + chunk(b'IEND', b''))
