// Converts the legal documents in scripts/legal/<lang>/<doc>.md into the
// `legalDocs.<doc>` section of src/locales/<lang>.json, which LegalDocument renders.
// Edit the .md files, then run `npm run legal:build`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scripts = path.dirname(fileURLToPath(import.meta.url));
const locales = path.resolve(scripts, '..', 'src', 'locales');
const DOCS = ['terms', 'vendorTerms', 'privacy', 'returns', 'faq', 'cookies'];
const LANGS = ['en', 'fr'];

// Old hardcoded page text, replaced by `legal.*`. Removed from every locale.
const LEGACY_PAGE_KEYS = ['termsOfService', 'vendorTerms', 'privacyPolicy', 'returns', 'faq', 'cookiePolicy'];

const lineType = (l) => (/^- /.test(l) ? 'ul' : /^\d+\. /.test(l) ? 'ol' : /^> /.test(l) ? 'note' : 'p');
const stripMarker = (l, type) =>
  type === 'ul' ? l.slice(2) : type === 'ol' ? l.replace(/^\d+\. /, '') : type === 'note' ? l.slice(2) : l;

// A paragraph group becomes one or more blocks: { p }, { ul: [] }, { ol: [] } or { note }.
const toBlocks = (lines) => {
  const blocks = [];
  for (const line of lines) {
    const type = lineType(line);
    const text = stripMarker(line, type);
    const last = blocks[blocks.length - 1];
    if (last && last.type === type) last.items.push(text);
    else blocks.push({ type, items: [text] });
  }
  return blocks.map(({ type, items }) =>
    type === 'ul' || type === 'ol' ? { [type]: items } : { [type]: items.join('\n') },
  );
};

const paragraphs = (lines) =>
  lines
    .join('\n')
    .split(/\n\s*\n/)
    .map((g) => g.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((g) => g.length)
    .flatMap(toBlocks);

const parse = (md) => {
  const lines = md.replace(/\r/g, '').split('\n');
  const title = lines.shift().replace(/^# /, '').trim();
  const chunks = [[]];
  for (const l of lines) {
    if (l.trim() === '---') chunks.push([]);
    else chunks[chunks.length - 1].push(l);
  }
  const [metaChunk, ...rest] = chunks.filter((c) => c.some((l) => l.trim()));
  const doc = {
    title,
    meta: metaChunk.map((l) => l.trim().replace(/^\*\*(.*)\*\*$/, '$1')).filter(Boolean),
    intro: [],
    sections: [],
    footer: [],
  };
  for (const chunk of rest) {
    const content = chunk.filter((l) => l.trim());
    if (content.every((l) => /^\*[^*].*\*$/.test(l.trim()))) {
      doc.footer.push(...content.map((l) => l.trim().slice(1, -1)));
    } else if (content[0].startsWith('## ')) {
      const start = chunk.indexOf(content[0]);
      doc.sections.push({ heading: content[0].slice(3).trim(), blocks: paragraphs(chunk.slice(start + 1)) });
    } else {
      doc.intro.push(...paragraphs(chunk));
    }
  }
  if (!doc.intro.length) delete doc.intro;
  return doc;
};

const readLocale = (lang) => JSON.parse(fs.readFileSync(path.join(locales, `${lang}.json`), 'utf8'));
const writeLocale = (lang, data) =>
  fs.writeFileSync(path.join(locales, `${lang}.json`), `${JSON.stringify(data, null, 2)}\n`);

for (const file of fs.readdirSync(locales).filter((f) => f.endsWith('.json'))) {
  const lang = file.replace('.json', '');
  const data = readLocale(lang);
  for (const key of LEGACY_PAGE_KEYS) if (data.pages) delete data.pages[key];
  if (LANGS.includes(lang)) {
    data.legalDocs = Object.fromEntries(
      DOCS.map((doc) => [doc, parse(fs.readFileSync(path.join(scripts, 'legal', lang, `${doc}.md`), 'utf8'))]),
    );
  }
  writeLocale(lang, data);
}
console.log(`legal: wrote ${DOCS.length} documents for ${LANGS.join(', ')}; removed legacy page keys.`);
