"""Repair the supplied font's OS/2 version marker using Python's standard library.

The provider declares a version 5 OS/2 table but only includes version 4 fields.
No glyph outlines or metrics are changed.
"""
import struct
from pathlib import Path

data = bytearray(Path('public/assets/black-mustang-original.ttf').read_bytes())
count = struct.unpack_from('>H', data, 4)[0]
head_offset = None
for i in range(count):
    entry = 12 + i * 16
    tag, checksum, offset, length = struct.unpack_from('>4sIII', data, entry)
    if tag == b'OS/2':
        version = struct.unpack_from('>H', data, offset)[0]
        assert version == 5 and length == 96, (version, length)
        struct.pack_into('>H', data, offset, 4)
        table = bytes(data[offset:offset + length])
        table += b'\0' * ((-len(table)) % 4)
        checksum = sum(struct.unpack('>' + 'I' * (len(table) // 4), table)) & 0xffffffff
        struct.pack_into('>I', data, entry + 4, checksum)
    if tag == b'head':
        head_offset = offset
assert head_offset is not None
struct.pack_into('>I', data, head_offset + 8, 0)
padded = bytes(data) + b'\0' * ((-len(data)) % 4)
total = sum(struct.unpack('>' + 'I' * (len(padded) // 4), padded)) & 0xffffffff
struct.pack_into('>I', data, head_offset + 8, (0xb1b0afba - total) & 0xffffffff)
Path('public/assets/black-mustang.ttf').write_bytes(data)
print('Repaired Black Mustang OS/2 table; outlines and metrics preserved.')
