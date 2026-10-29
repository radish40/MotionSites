#!/usr/bin/env node
// Restore exact original assets from the source package. No network or dependencies.
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { createHash, randomUUID } = require('node:crypto');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'asset-chunks/manifest.json');
function resolveFile(relative, prefix) {
  if (typeof relative !== 'string' || relative.includes('\\') ||
      path.isAbsolute(relative) || relative.split('/').includes('..') ||
      !relative.startsWith(prefix + '/')) throw new Error(`Invalid asset path: ${relative}`);
  return path.join(root, relative);
}
function validateRecord(record) {
  if (!Number.isSafeInteger(record.bytes) || record.bytes <= 0 ||
      !/^[a-f0-9]{64}$/.test(record.sha256)) throw new Error(`Invalid size/hash: ${record.path}`);
}
async function digest(file) {
  const hash = createHash('sha256');
  let bytes = 0;
  for await (const data of fs.createReadStream(file)) { hash.update(data); bytes += data.length; }
  return { bytes, sha256: hash.digest('hex') };
}
function matches(actual, expected) {
  return actual.bytes === expected.bytes && actual.sha256 === expected.sha256;
}
async function main() {
  const manifest = JSON.parse(await fsp.readFile(manifestPath, 'utf8'));
  if (manifest.version !== 1 || !Array.isArray(manifest.assets) || !manifest.assets.length)
    throw new Error('Invalid asset manifest');
  // Authenticate every chunk before changing any original, even on repeat runs.
  for (const asset of manifest.assets) {
    validateRecord(asset);
    resolveFile(asset.path, 'public/videos');
    if (!Array.isArray(asset.chunks) || !asset.chunks.length) throw new Error(`No chunks: ${asset.path}`);
    let total = 0;
    for (const chunk of asset.chunks) {
      validateRecord(chunk);
      if (chunk.bytes >= 50 * 1024 * 1024) throw new Error(`Chunk must be below 50 MiB: ${chunk.path}`);
      if (!matches(await digest(resolveFile(chunk.path, 'asset-chunks')), chunk))
        throw new Error(`Chunk integrity check failed: ${chunk.path}`);
      total += chunk.bytes;
    }
    if (total !== asset.bytes) throw new Error(`Chunk sizes do not match original: ${asset.path}`);
  }
  for (const asset of manifest.assets) {
    const target = resolveFile(asset.path, 'public/videos');
    try {
      if (matches(await digest(target), asset)) {
        console.log(`Verified ${asset.path} (${asset.bytes} bytes)`);
        continue;
      }
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    await fsp.mkdir(path.dirname(target), { recursive: true });
    // Sibling temporary file ensures rename is atomic on the same filesystem.
    const temporary = `${target}.restore-${randomUUID()}.tmp`;
    let output;
    try {
      output = await fsp.open(temporary, 'wx');
      for (const chunk of asset.chunks) {
        const hash = createHash('sha256');
        let bytes = 0;
        for await (const data of fs.createReadStream(resolveFile(chunk.path, 'asset-chunks'))) {
          hash.update(data); bytes += data.length;
          let offset = 0;
          while (offset < data.length) {
            const written = await output.write(data, offset, data.length - offset);
            if (written.bytesWritten === 0) throw new Error('Unable to write asset');
            offset += written.bytesWritten;
          }
        }
        if (!matches({ bytes, sha256: hash.digest('hex') }, chunk))
          throw new Error(`Chunk changed during restoration: ${chunk.path}`);
      }
      await output.sync();
      await output.close(); output = null;
      if (!matches(await digest(temporary), asset)) throw new Error(`Original integrity check failed: ${asset.path}`);
      await fsp.rename(temporary, target);
      console.log(`Restored ${asset.path} (${asset.bytes} bytes; SHA256 verified)`);
    } finally {
      if (output) await output.close();
      await fsp.rm(temporary, { force: true });
    }
  }
}
main().catch(error => { console.error(`Asset restoration failed: ${error.message}`); process.exitCode = 1; });
