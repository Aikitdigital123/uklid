import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

async function ensureDir(dir) { await fs.mkdir(dir, { recursive: true }); }

async function copyFileSafe(src, dest) {
  await ensureDir(path.dirname(dest));
  try { await fs.copyFile(src, dest); } catch {}
}

async function copyDirRecursive(srcDir, destDir) {
  if (!fssync.existsSync(srcDir)) return;
  await ensureDir(destDir);
  const entries = await fs.readdir(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(srcDir, e.name);
    const d = path.join(destDir, e.name);
    if (e.isDirectory()) await copyDirRecursive(s, d);
    else await copyFileSafe(s, d);
  }
}

async function replaceInFile(filePath, replacements) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    for (const [from, to] of replacements) {
      const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      content = content.replace(re, to);
    }
    await fs.writeFile(filePath, content, 'utf8');
  } catch {}
}

async function main() {
  await ensureDir(dist);

  // Kořenové soubory
  const rootFiles = [
    'index.html',
    'privacy.html',
    'terms.html',
    '404.html',
    'humans.txt',
    'robots.txt',
    'favicon.ico',
    'site.webmanifest',
    'sitemap.xml',
    'CNAME',
    '.nojekyll'
  ];
  for (const f of rootFiles) {
    await copyFileSafe(path.join(root, f), path.join(dist, f));
  }

  // Statické složky
  for (const folder of ['images', '.well-known']) {
    await copyDirRecursive(path.join(root, folder), path.join(dist, folder));
  }

  // Přepnutí odkazů na minifikované assety v HTML
  const htmlFiles = ['index.html', 'privacy.html', '404.html'].map(f => path.join(dist, f));
  for (const file of htmlFiles) {
    await replaceInFile(file, [
      ['/assets/css/style.css', '/assets/css/style.min.css'],
      ['/assets/js/main.js', '/assets/js/main.min.js']
    ]);
  }

  console.log('Static files prepared in dist/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
