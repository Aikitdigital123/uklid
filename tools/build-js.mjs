import esbuild from 'esbuild';
import path from 'node:path';

const root = process.cwd();

async function main() {
  const entry = path.join(root, 'assets', 'js', 'main.bundle.js');
  const outdir = path.join(root, 'dist', 'assets', 'js');

  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    minify: true,
    sourcemap: false,
    outfile: path.join(outdir, 'main.min.js'),
    target: ['es2015'],
    format: 'iife'
  });

  console.log(`JS built -> ${path.relative(root, path.join(outdir, 'main.min.js'))}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
