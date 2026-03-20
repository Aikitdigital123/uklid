import { defineConfig } from 'vite';
import webfontDownload from 'vite-plugin-webfont-dl';
import htmlPurge from 'vite-plugin-purgecss';
import { sri } from 'vite-plugin-sri3';
import { cp, mkdir, stat, readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seoMetadata } from './vite-plugin-seo-metadata.js';
import { feedbackAreas } from './vite-plugin-feedback-areas.js';

const htmlPages = [
  'index.html',
  'sluzby.html',
  'prezentace.html',
  'faq.html',
  'privacy.html',
  'terms.html',
  'impresum.html',
  'spokojenost.html',
  '404.html',
  'en/index.html',
  'en/services.html',
  'en/faq.html',
  'en/presentation.html',
  'en/terms.html',
  'en/privacy.html',
  'en/impresum.html',
  'en/feedback.html',
];

/** Base URL pro sitemap (bez koncového lomítka). */
const SITEMAP_BASE = process.env.SITEMAP_BASE || 'https://lesktop.cz';

/** priority (0–1) a changefreq pro sitemap. Při přidání nové stránky přidej záznam sem (nebo null pro vynechání ze sitemap). */
const sitemapPageConfig = {
  'index.html': { priority: 1.0, changefreq: 'weekly' },
  'sluzby.html': { priority: 0.9, changefreq: 'monthly' },
  'prezentace.html': { priority: 0.7, changefreq: 'monthly' },
  'faq.html': { priority: 0.8, changefreq: 'monthly' },
  'privacy.html': { priority: 0.5, changefreq: 'yearly' },
  'terms.html': { priority: 0.5, changefreq: 'yearly' },
  'impresum.html': { priority: 0.4, changefreq: 'yearly' },
  '404.html': null, // vynecháno ze sitemap
  'en/index.html': { priority: 1.0, changefreq: 'weekly' },
  'en/services.html': { priority: 0.9, changefreq: 'monthly' },
  'en/faq.html': { priority: 0.8, changefreq: 'monthly' },
  'en/presentation.html': { priority: 0.7, changefreq: 'monthly' },
  'en/terms.html': { priority: 0.5, changefreq: 'yearly' },
  'en/privacy.html': { priority: 0.5, changefreq: 'yearly' },
  'en/impresum.html': { priority: 0.4, changefreq: 'yearly' },
};

const staticDirs = [
  { path: '.well-known', required: false },
  { path: 'images', required: false },
  { path: 'before-after', required: false },
];

const staticFiles = [
  { path: 'Lesktop_Cleaning_Services.pdf', required: true },
  { path: 'favicon.ico', required: true },
  { path: 'site.webmanifest', required: true },
  { path: 'robots.txt', required: true },
  // sitemap.xml se generuje pluginem generateSitemap z htmlPages
  { path: 'humans.txt', required: true },
  { path: 'CNAME', required: true },
  { path: 'BingSiteAuth.xml', required: true },
  { path: '.nojekyll', required: true },
];

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const JSON_LD_SCRIPT_REGEX = /<script\b[^>]*type=(["'])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi;

function normalizeBase(rawBase) {
  if (!rawBase || rawBase === '/') return '/';
  const withLeadingSlash = rawBase.startsWith('/') ? rawBase : `/${rawBase}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

function escapeHtmlAttribute(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;');
}

function collectJsonLdHashes(html) {
  const hashes = [];

  for (const match of html.matchAll(JSON_LD_SCRIPT_REGEX)) {
    const scriptContent = match[2];
    const hash = createHash('sha256').update(scriptContent, 'utf8').digest('base64');
    hashes.push(`'sha256-${hash}'`);
  }

  return hashes;
}

/**
 * CSP (Content-Security-Policy) pro build.
 * Po SRI: vlastní assety mají integrity; externí (FA) mají skip-sri a vlastní SRI v HTML.
 * Audit: script-src/style-src/font-src/connect-src/form-action zúženy na konkrétní domény;
 * img-src zpřísněno na 'self', data:, blob: a Google domény (GA/GTM tracking pixely). Při přidání dalších zdrojů obrázků doplň domény sem.
 */
function buildCspPolicy(html) {
  const jsonLdHashes = collectJsonLdHashes(html);
  const scriptSrc = ["'self'", 'https://www.googletagmanager.com', ...jsonLdHashes];
  const imgSrc = [
    "'self'",
    'data:',
    'blob:',
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    'https://www.google.com',
    'https://stats.g.doubleclick.net',
    'https://region1.google-analytics.com',
  ].join(' ');

  return [
    `default-src 'self'`,
    `base-uri 'self'`,
    `script-src ${scriptSrc.join(' ')}`,
    `style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com`,
    `font-src 'self' https://cdnjs.cloudflare.com data:`,
    `img-src ${imgSrc}`,
    `connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://stats.g.doubleclick.net https://www.googleadservices.com https://googleads.g.doubleclick.net`,
    `form-action 'self' https://api.web3forms.com`,
    `object-src 'self'`,
    `manifest-src 'self'`,
  ].join('; ');
}

function injectCspMeta() {
  return {
    name: 'inject-csp-meta',
    apply: 'build',
    generateBundle(_, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'asset' || !chunk.fileName.endsWith('.html')) continue;
        if (typeof chunk.source !== 'string') continue;

        const cspPolicy = buildCspPolicy(chunk.source);
        const cspMetaTag = `<meta http-equiv="Content-Security-Policy" content="${escapeHtmlAttribute(cspPolicy)}">`;

        if (chunk.source.includes('http-equiv="Content-Security-Policy"')) {
          chunk.source = chunk.source.replace(
            /<meta\b[^>]*http-equiv=(["'])Content-Security-Policy\1[^>]*>/i,
            cspMetaTag
          );
          continue;
        }

        chunk.source = chunk.source.replace(/<head>/i, `<head>\n  ${cspMetaTag}`);
      }
    },
  };
}

function formatCopyError(label, targetPath, error) {
  const message = error instanceof Error ? error.message : String(error);
  return `[copy-static-files] Failed to copy ${label} "${targetPath}": ${message}`;
}

async function copyStaticDir(rootDir, distDir, entry) {
  const source = resolve(rootDir, entry.path);
  const target = resolve(distDir, entry.path);

  try {
    await cp(source, target, {
      recursive: true,
      force: true,
    });
  } catch (error) {
    if (!entry.required && error && error.code === 'ENOENT') {
      console.warn(`[copy-static-files] Optional directory missing, skipping "${entry.path}".`);
      return;
    }

    throw new Error(formatCopyError('directory', entry.path, error), { cause: error });
  }
}

async function copyStaticFile(rootDir, distDir, entry) {
  const source = resolve(rootDir, entry.path);
  const target = resolve(distDir, entry.path);

  try {
    await mkdir(dirname(target), { recursive: true });
    await cp(source, target, { force: true });
  } catch (error) {
    if (!entry.required && error && error.code === 'ENOENT') {
      console.warn(`[copy-static-files] Optional file missing, skipping "${entry.path}".`);
      return;
    }

    throw new Error(formatCopyError('file', entry.path, error), { cause: error });
  }
}

function copyStaticFiles() {
  return {
    name: 'copy-static-files',
    apply: 'build',
    async writeBundle() {
      const distDir = resolve(projectRoot, 'dist');
      const rootDir = projectRoot;

      for (const dir of staticDirs) {
        await copyStaticDir(rootDir, distDir, dir);
      }

      for (const file of staticFiles) {
        await copyStaticFile(rootDir, distDir, file);
      }
    },
  };
}

function generateSitemap() {
  return {
    name: 'generate-sitemap',
    apply: 'build',
    async writeBundle() {
      const distDir = resolve(projectRoot, 'dist');
      const rootDir = projectRoot;
      const urlEntries = [];

      for (const page of htmlPages) {
        const config = sitemapPageConfig[page];
        if (config === null) continue; // 404 a další vynechané

        let pathname;
        if (page === 'index.html') {
          pathname = '';
        } else if (page === 'en/index.html') {
          pathname = 'en/';
        } else if (page.startsWith('en/')) {
          pathname = page.replace(/\.html$/, '.html');
        } else {
          pathname = page.replace(/\.html$/, '.html');
        }
        const loc = pathname ? `${SITEMAP_BASE}/${pathname}` : `${SITEMAP_BASE}/`;

        let lastmod = new Date().toISOString().slice(0, 10);
        try {
          const filePath = resolve(rootDir, page);
          const st = await stat(filePath);
          lastmod = new Date(st.mtime).toISOString().slice(0, 10);
        } catch {
          // ponechat dnešní datum
        }

        const { priority = 0.5, changefreq = 'monthly' } = config || {};
        urlEntries.push(
          `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
        );
      }

      const xml =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' +
        ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
        ' xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n' +
        urlEntries.join('\n') +
        '\n</urlset>\n';

      const { writeFile } = await import('node:fs/promises');
      await writeFile(resolve(distDir, 'sitemap.xml'), xml, 'utf8');
    },
  };
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Optimalizace obrázků v dist: assets (LCP hero, logo z Vite), images + before-after (statická kopie). */
function optimizeImages() {
  const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
  const OPTIMIZE_DIRS = ['assets', 'images', 'before-after'];

  return {
    name: 'optimize-images',
    apply: 'build',
    async writeBundle() {
      const distDir = resolve(projectRoot, 'dist');
      const sharp = (await import('sharp')).default;

      async function collectFiles(dir, acc = []) {
        let entries;
        try {
          entries = await readdir(dir, { withFileTypes: true });
        } catch (err) {
          if (err.code === 'ENOENT') return acc;
          throw err;
        }
        for (const e of entries) {
          const full = resolve(dir, e.name);
          if (e.isDirectory()) {
            await collectFiles(full, acc);
          } else if (IMAGE_EXT.test(extname(e.name))) {
            acc.push(full);
          }
        }
        return acc;
      }

      const files = [];
      for (const sub of OPTIMIZE_DIRS) {
        const dir = resolve(distDir, sub);
        files.push(...(await collectFiles(dir)));
      }

      for (const filePath of files) {
        const ext = extname(filePath).toLowerCase();
        try {
          const buf = await readFile(filePath);
          let out;
          // Respect EXIF orientation before encoding so before/after photos keep correct rotation in production.
          const image = sharp(buf).rotate();
          if (ext === '.jpg' || ext === '.jpeg') {
            out = await image.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
          } else if (ext === '.png') {
            out = await image.png({ compressionLevel: 9 }).toBuffer();
          } else if (ext === '.webp') {
            out = await image.webp({ quality: 82 }).toBuffer();
          } else {
            continue;
          }
          if (out.length < buf.length) {
            await writeFile(filePath, out);
          }
        } catch (err) {
          console.warn(`[optimize-images] Skip ${filePath}:`, err.message);
        }
      }
    },
  };
}

/** Cesty pro PurgeCSS – všechna HTML a JS, kde se objevují classy. */
const purgeContent = [
  ...htmlPages.map((p) => resolve(projectRoot, p)),
  resolve(projectRoot, 'assets/js/**/*.js'),
  resolve(projectRoot, 'before-after/**/*.js'),
];

/** Safelist: třídy z JS, Font Awesome, stavové a utility. Konzervativní – nic nerozbít. */
const purgeSafelist = {
  standard: [
    'active',
    'open',
    'show',
    'hidden',
    'menu-open',
    'js',
    'success',
    'error',
    'visible',
    'form-status-hidden',
    'form-group-hidden',
    'checkbox-item-hidden',
    'checkbox-item-reveal',
    'btn-expand-services',
    'btn-spinner',
    'back-to-top',
    'select-hidden',
    'is-loading',
    'is-expanded',
    'is-visible',
    'is-hidden',
    'is-valid',
    'is-invalid',
    'is-open',
    // EN homepage service cards: keep panel/grid classes even if PurgeCSS content scan misses a route variant.
    'services-grid',
    'service-item',
    // EN pricing cards share panel styles; keep them for production parity with dev.
    'pricing-grid',
    'price-card',
    // Feedback accordion/completion indicator classes are injected/rendered via build-time generation and JS.
    'feedback-areas',
    'area-item',
    'area-summary',
    'area-name',
    'area-summary-icon',
    'area-summary-right',
    'area-summary-check',
    'area-panel',
    /^fa-/, // Font Awesome: fa, fas, far, fab, fa-chevron-down, atd.
    /^is-/, // is-visible, is-open, atd.
    /^has-/, // případné has-* stavy
    /^js-/,  // js třída na <html>, případné js-* utility
  ],
};

export default defineConfig(() => {
  const base = normalizeBase(process.env.VITE_BASE_PATH || process.env.BASE_PATH || '/');

  return {
    base,
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: Object.fromEntries(
          htmlPages.map((page) => [page.replace(/\.html$/, ''), resolve(projectRoot, page)])
        ),
      },
    },
    plugins: [
      webfontDownload(
        [
          'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;600&display=swap',
        ],
        {
          injectAsStyleTag: true,
          minifyCss: true,
          cache: true,
          subsetsAllowed: ['latin', 'latin-ext'],
        }
      ),
      htmlPurge({
        content: purgeContent,
        safelist: purgeSafelist,
      }),
      seoMetadata(), // Centralizované SEO metadata – před injectCspMeta, aby CSP viděl finální HTML
      feedbackAreas(), // Build-time generování opakujících se feedback oblastí (bez runtime JS renderu)
      injectCspMeta(),
      copyStaticFiles(),
      generateSitemap(),
      optimizeImages(),
      sri(), // SRI pro vlastní JS/CSS assety – na konci, aby měl finální obsah
    ],
  };
});
