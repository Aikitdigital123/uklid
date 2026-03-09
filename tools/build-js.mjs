import esbuild from 'esbuild';
import path from 'node:path';

const root = process.cwd();

async function main() {
  const outdir = path.join(root, 'dist', 'assets', 'js');

  await esbuild.build({
    entryPoints: [path.join(root, 'assets', 'js', 'main.bundle.js')],
    bundle: true,
    minify: true,
    sourcemap: false,
    outfile: path.join(outdir, 'main.min.js'),
    target: ['es2015'],
    format: 'iife'
  });

  await esbuild.build({
    entryPoints: [path.join(root, 'before-after', 'data.js')],
    bundle: false,
    minify: true,
    sourcemap: false,
    outfile: path.join(outdir, 'before-after-data.min.js'),
    target: ['es2015'],
    format: 'iife'
  });

  await esbuild.build({
    entryPoints: [path.join(root, 'before-after', 'gallery.js')],
    bundle: false,
    minify: true,
    sourcemap: false,
    outfile: path.join(outdir, 'before-after-gallery.min.js'),
    target: ['es2015'],
    format: 'iife'
  });

  console.log(`JS built -> ${path.relative(root, path.join(outdir, 'main.min.js'))}`);
  console.log(`JS built -> ${path.relative(root, path.join(outdir, 'before-after-data.min.js'))}`);
  console.log(`JS built -> ${path.relative(root, path.join(outdir, 'before-after-gallery.min.js'))}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
