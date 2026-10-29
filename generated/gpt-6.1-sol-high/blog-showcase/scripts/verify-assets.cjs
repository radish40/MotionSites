// Exercise restoration against the real project assets; always preserve originals.
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { spawnSync } = require('node:child_process');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const manifest = require('../asset-chunks/manifest.json');
const originalManifest = require('../screenshots/asset-manifest.json');
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function restore(success = true) {
  const result = spawnSync(process.execPath, [path.join(__dirname, 'restore-assets.cjs')], { cwd: root, encoding: 'utf8' });
  if (success) assert.equal(result.status, 0, result.stderr);
  else assert.notEqual(result.status, 0, 'Damaged or missing chunks must fail');
  return result;
}
const backups = [];
const report = { status: 'passed', checks: [], assets: [] };
try {
  assert.equal(manifest.assets.length, 2);
  for (const asset of manifest.assets) {
    const file = path.join(root, asset.path);
    const backup = `${file}.restore-test-backup`;
    assert(!fs.existsSync(backup), `Existing backup: ${backup}`);
    assert.equal(hash(file), asset.sha256);
    fs.renameSync(file, backup);
    backups.push({ file, backup, asset });
  }
  const restored = restore();
  console.log(restored.stdout);
  for (const { file, asset } of backups) {
    assert.equal(hash(file), asset.sha256);
    assert.equal(fs.statSync(file).size, asset.bytes);
    report.assets.push({ path: asset.path, bytes: asset.bytes, sha256: hash(file), restored_from_missing: true });
  }
  report.checks.push('Both originals renamed aside, reconstructed from chunks, and matched pre-existing original SHA256 and size.');
  const mtimes = backups.map(({ file }) => fs.statSync(file).mtimeMs);
  restore();
  assert.deepEqual(backups.map(({ file }) => fs.statSync(file).mtimeMs), mtimes);
  report.checks.push('Repeat restoration authenticates chunks and leaves valid originals untouched.');
  const chunk = path.join(root, manifest.assets[0].chunks[0].path);
  const fd = fs.openSync(chunk, 'r+');
  const byte = Buffer.alloc(1); fs.readSync(fd, byte, 0, 1, 0);
  try {
    fs.writeSync(fd, Buffer.from([byte[0] ^ 255]), 0, 1, 0);
    assert.match(restore(false).stderr, /Chunk integrity check failed/);
    assert.deepEqual(backups.map(({ file }) => fs.statSync(file).mtimeMs), mtimes);
  } finally { fs.writeSync(fd, byte, 0, 1, 0); fs.closeSync(fd); }
  report.checks.push('Corrupt chunk rejected before touching valid originals.');
  const missingChunk = chunk + '.verify-backup';
  assert(!fs.existsSync(missingChunk));
  fs.renameSync(chunk, missingChunk);
  try { assert.match(restore(false).stderr, /ENOENT/); }
  finally { fs.renameSync(missingChunk, chunk); }
  report.checks.push('Missing chunk rejected.');
  fs.writeFileSync(backups[0].file, 'damaged original');
  restore();
  assert.equal(hash(backups[0].file), backups[0].asset.sha256);
  report.checks.push('Invalid original replaced with an authenticated exact reconstruction.');
  for (const record of originalManifest) assert.equal(hash(path.join(root, record.path)), record.sha256);
  report.checks.push('All four original videos and all six font files still match the original asset manifest.');
  for (const asset of manifest.assets) for (const chunk of asset.chunks) {
    assert(chunk.bytes < 50 * 1024 * 1024);
    assert.equal(fs.statSync(path.join(root, chunk.path)).size, chunk.bytes);
    assert.equal(hash(path.join(root, chunk.path)), chunk.sha256);
  }
  report.checks.push('All six binary chunks are strictly below 50 MiB and match manifest sizes and SHA256.');
  fs.writeFileSync(path.join(root, 'screenshots/packaging-checks.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  for (const { file, backup, asset } of backups) {
    if (fs.existsSync(file) && hash(file) === asset.sha256) fs.unlinkSync(backup);
    else fs.renameSync(backup, file);
  }
}
