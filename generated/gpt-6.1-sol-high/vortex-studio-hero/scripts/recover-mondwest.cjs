// The foundry's .woff URL returns WOFF2 bytes (wOF2 signature).
// Preserve the bytes with the required .woff2 filename; no conversion necessary.
const fs=require('node:fs');
const source='https://pangrampangram.com/cdn/shop/files/PPMondwest-Regular.woff?v=7568021129578465612';
(async()=>{const response=await fetch(source);if(!response.ok)throw Error(response.status);const bytes=Buffer.from(await response.arrayBuffer());if(bytes.toString('ascii',0,4)!=='wOF2')throw Error('Unexpected font format');fs.writeFileSync('public/PPMondwest-Regular.woff2',bytes);})();
