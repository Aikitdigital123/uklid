import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

async function ensureDir(dir) { await fs.mkdir(dir, { recursive: true }); }
async function removePathSafe(target) {
  try { await fs.rm(target, { recursive: true, force: true }); } catch {}
}

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

  for (const folder of ['images', '.well-known', 'before-after']) {
    await removePathSafe(path.join(dist, folder));
  }

  // Root files copied to dist/.
  const rootFiles = [
    'index.html',
    'sluzby.html',
    'prezentace.html',
    'privacy.html',
    'terms.html',
    'faq.html',
    'impresum.html',
    '404.html',
    'humans.txt',
    'robots.txt',
    'favicon.ico',
    'Lesktop_Cleaning_Services.pdf',
    'site.webmanifest',
    'sitemap.xml',
    'CNAME',
    '.nojekyll'
  ];

  for (const f of rootFiles) {
    await copyFileSafe(path.join(root, f), path.join(dist, f));
  }

  // Static folders.
  for (const folder of ['images', '.well-known', 'before-after']) {
    await copyDirRecursive(path.join(root, folder), path.join(dist, folder));
  }

  // Switch HTML references to production-minified assets.
  const htmlFiles = rootFiles
    .filter((fileName) => fileName.toLowerCase().endsWith('.html'))
    .map((fileName) => path.join(dist, fileName));

  const replacements = [
    ['/assets/css/style.css', '/assets/css/style.min.css'],
    ['/assets/css/legal.css', '/assets/css/legal.min.css'],
    ['/assets/css/error-pages.css', '/assets/css/error-pages.min.css'],
    ['/assets/css/pages/sluzby.css', '/assets/css/pages/sluzby.min.css'],
    ['before-after/before-after.css', '/assets/css/before-after.min.css'],
    ['/assets/js/main.js', '/assets/js/main.min.js'],
    ['/before-after/data.js', '/assets/js/before-after-data.min.js'],
    ['/before-after/gallery.js', '/assets/js/before-after-gallery.min.js']
  ];

  for (const file of htmlFiles) {
    await replaceInFile(file, replacements);
  }

  console.log('Static files prepared in dist/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
