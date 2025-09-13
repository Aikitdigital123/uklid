import fs from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import atImport from 'postcss-import';
import cssnano from 'cssnano';

const root = process.cwd();
const src = path.join(root, 'assets', 'css', 'style.css');
const outDir = path.join(root, 'dist', 'assets', 'css');
const outFile = path.join(outDir, 'style.min.css');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  await ensureDir(outDir);

  // Fallback: pokud není style.css, vytvoříme prázdný obsah
  let css = '';
  try {
    css = await fs.readFile(src, 'utf8');
  } catch {
    css = '';
  }

  const plugins = [
    atImport(),
    cssnano({ preset: 'default' })
  ];

  // PurgeCSS lze přidat později (volitelně), až budeme mít stabilní HTML/JS
  // Např. přes @fullhuman/postcss-purgecss — záměrně nyní vypnuto kvůli selektorům typu body/html.

  const result = await postcss(plugins).process(css, { from: src, to: outFile });
  await fs.writeFile(outFile, result.css, 'utf8');
  if (result.map) {
    await fs.writeFile(outFile + '.map', result.map.toString(), 'utf8');
  }
  console.log(`CSS built -> ${path.relative(root, outFile)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

