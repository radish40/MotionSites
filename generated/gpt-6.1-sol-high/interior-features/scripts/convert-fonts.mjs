import fontverter from 'fontverter';
import { readFile, writeFile } from 'node:fs/promises';
for (const weight of ['Regular', 'Medium', 'Bold']) {
  const path = `public/fonts/NeueMontreal-${weight}`;
  await writeFile(`${path}.woff2`, await fontverter.convert(await readFile(`${path}.woff`), 'woff2'));
}
