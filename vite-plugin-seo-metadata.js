/**
 * Vite plugin pro centralizaci společných SEO a social metadata.
 * 
 * Automaticky doplní opakující se meta tagy do všech HTML stránek,
 * zatímco page-specific tagy (title, description, canonical, og:title, og:description, og:url) zůstávají v HTML.
 */

const DEFAULT_METADATA = {
  'og:site_name': 'Lesktop',
  'og:locale': 'cs_CZ',
  'og:image': 'https://lesktop.cz/images/hero.jpg',
  'og:image:width': '1200',
  'og:image:height': '630',
  'twitter:card': 'summary_large_image',
  'twitter:image': 'https://lesktop.cz/images/hero.jpg',
};

/**
 * Vytvoří meta tag HTML string.
 */
function createMetaTag(property, content, isProperty = true) {
  const attr = isProperty ? 'property' : 'name';
  return `  <meta ${attr}="${property}" content="${escapeHtmlAttribute(content)}">`;
}

/**
 * Escape HTML atributů.
 */
function escapeHtmlAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Zkontroluje, zda meta tag už existuje v HTML.
 */
function hasMetaTag(html, property, isProperty = true) {
  const attr = isProperty ? 'property' : 'name';
  const regex = new RegExp(`<meta\\s+${attr}=(["'])${escapeRegex(property)}\\1`, 'i');
  return regex.test(html);
}

/**
 * Escape regex speciálních znaků.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Najde pozici, kam vložit společné meta tagy.
 * Hledá po posledním OG nebo Twitter tagu, nebo po og:type pokud existuje.
 */
function findInsertPosition(html) {
  // Hledáme po posledním OG nebo Twitter meta tagu
  const ogTwitterRegex = /<meta\s+(property|name)=(["'])(og:|twitter:)[^"']+\2[^>]*>/gi;
  let lastMatch = null;
  let match;
  
  while ((match = ogTwitterRegex.exec(html)) !== null) {
    lastMatch = match;
  }
  
  if (lastMatch) {
    // Vložíme po posledním OG/Twitter tagu
    return lastMatch.index + lastMatch[0].length;
  }
  
  // Pokud není žádný OG/Twitter tag, hledáme og:type
  const ogTypeRegex = /<meta\s+property=(["'])og:type\1[^>]*>/i;
  const ogTypeMatch = html.match(ogTypeRegex);
  if (ogTypeMatch) {
    return ogTypeMatch.index + ogTypeMatch[0].length;
  }
  
  // Fallback: hledáme po robots meta tagu
  const robotsRegex = /<meta\s+name=(["'])robots\1[^>]*>/i;
  const robotsMatch = html.match(robotsRegex);
  if (robotsMatch) {
    return robotsMatch.index + robotsMatch[0].length;
  }
  
  // Poslední fallback: po canonical linku
  const canonicalRegex = /<link\s+rel=(["'])canonical\1[^>]*>/i;
  const canonicalMatch = html.match(canonicalRegex);
  if (canonicalMatch) {
    return canonicalMatch.index + canonicalMatch[0].length;
  }
  
  // Pokud nic nenajdeme, vložíme před </head>
  const headCloseRegex = /<\/head>/i;
  const headCloseMatch = html.match(headCloseRegex);
  if (headCloseMatch) {
    return headCloseMatch.index;
  }
  
  return -1;
}

/**
 * Normalizuje a doplní společné meta tagy do HTML.
 */
function injectCommonMetadata(html) {
  let result = html;
  const tagsToAdd = [];
  
  // Zkontrolujeme, které tagy chybí
  for (const [property, content] of Object.entries(DEFAULT_METADATA)) {
    const isProperty = property.startsWith('og:');
    if (!hasMetaTag(result, property, isProperty)) {
      tagsToAdd.push(createMetaTag(property, content, isProperty));
    }
  }
  
  // Pokud máme tagy k přidání, najdeme pozici a vložíme je
  if (tagsToAdd.length > 0) {
    const insertPos = findInsertPosition(result);
    if (insertPos !== -1) {
      const before = result.slice(0, insertPos);
      const after = result.slice(insertPos);
      result = before + '\n' + tagsToAdd.join('\n') + after;
    }
  }
  
  return result;
}

/**
 * Vite plugin pro SEO metadata.
 */
export function seoMetadata() {
  return {
    name: 'seo-metadata',
    apply: 'build',
    generateBundle(_, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'asset' || !chunk.fileName.endsWith('.html')) continue;
        if (typeof chunk.source !== 'string') continue;
        
        // Normalizujeme a doplníme společné metadata
        chunk.source = injectCommonMetadata(chunk.source);
      }
    },
  };
}
