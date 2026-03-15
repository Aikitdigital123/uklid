import fs from 'node:fs/promises';
import path from 'node:path';
import postcss from 'postcss';
import atImport from 'postcss-import';
import cssnano from 'cssnano';

const root = process.cwd();

const cssJobs = [
  {
    src: path.join(root, 'assets', 'css', 'style.css'),
    outFile: path.join(root, 'dist', 'assets', 'css', 'style.min.css')
  },
  {
    src: path.join(root, 'assets', 'css', 'legal.css'),
    outFile: path.join(root, 'dist', 'assets', 'css', 'legal.min.css')
  },
  {
    src: path.join(root, 'assets', 'css', 'error-pages.css'),
    outFile: path.join(root, 'dist', 'assets', 'css', 'error-pages.min.css')
  },
  {
    src: path.join(root, 'assets', 'css', 'pages', 'sluzby.css'),
    outFile: path.join(root, 'dist', 'assets', 'css', 'pages', 'sluzby.min.css')
  },
  {
    src: path.join(root, 'before-after', 'before-after.css'),
    outFile: path.join(root, 'dist', 'assets', 'css', 'before-after.min.css')
  }
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readCssSafe(src) {
  try {
    return await fs.readFile(src, 'utf8');
  } catch {
    return '';
  }
}

async function main() {
  const plugins = [
    atImport(),
    cssnano({ preset: 'default' })
  ];

  for (const job of cssJobs) {
    await ensureDir(path.dirname(job.outFile));

    const css = await readCssSafe(job.src);

    // PurgeCSS can be added later once selectors and templates are stable.
    const result = await postcss(plugins).process(css, { from: job.src, to: job.outFile });

    await fs.writeFile(job.outFile, result.css, 'utf8');
    if (result.map) {
      await fs.writeFile(job.outFile + '.map', result.map.toString(), 'utf8');
    }

    console.log(`CSS built -> ${path.relative(root, job.outFile)}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
