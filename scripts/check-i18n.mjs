// Fails if:
//  - a t('key') / i18n.t('key') used in src/ is missing from en.json or fr.json
//  - en.json and fr.json don't contain exactly the same keys
//  - a French value is empty, or {{placeholders}} differ between English and French
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');
const load = (lng) => JSON.parse(fs.readFileSync(path.join(root, 'locales', `${lng}.json`), 'utf8'));
const en = load('en');
const fr = load('fr');

const flatten = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatten(v, `${prefix}${k}.`) : [[`${prefix}${k}`, v]],
  );
const enMap = new Map(flatten(en));
const frMap = new Map(flatten(fr));

// i18next plural forms: t('items', { count }) resolves items_one / items_other.
const PLURAL = /_(zero|one|two|few|many|other)$/;
const hasKey = (map, key) => map.has(key) || [...map.keys()].some((k) => k.replace(PLURAL, '') === key);

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === 'locales' ? [] : walk(p);
    return /\.(tsx?|jsx?)$/.test(e.name) ? [p] : [];
  });

const used = new Map();
for (const file of walk(root)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const m of text.matchAll(/\bt\(\s*["'`]([A-Za-z0-9_.-]+)["'`]/g)) {
    if (!used.has(m[1])) used.set(m[1], path.relative(root, file));
  }
}

const problems = [];
for (const [key, file] of used) {
  if (!hasKey(enMap, key)) problems.push(`en.json is missing "${key}" (used in ${file})`);
  if (!hasKey(frMap, key)) problems.push(`fr.json is missing "${key}" (used in ${file})`);
}

// Plural forms differ by language (French adds _many), so compare plural keys by their base name.
const vars = (s) => [...String(s).matchAll(/\{\{\s*(\w+)[^}]*\}\}/g)].map((m) => m[1]).sort().join(',');
const frValueFor = (key) => frMap.get(key) ?? (PLURAL.test(key) ? frMap.get(key.replace(PLURAL, '_other')) : undefined);
for (const [key, value] of enMap) {
  const frValue = frValueFor(key);
  if (frValue === undefined) problems.push(`fr.json is missing "${key}"`);
  else if (!String(frValue).trim()) problems.push(`fr.json has an empty value for "${key}"`);
  else if (vars(value) !== vars(frValue)) problems.push(`placeholders differ for "${key}": en {${vars(value)}} vs fr {${vars(frValue)}}`);
}
const enBases = new Set([...enMap.keys()].map((k) => k.replace(PLURAL, '')));
for (const key of frMap.keys()) if (!enBases.has(key.replace(PLURAL, ''))) problems.push(`en.json is missing "${key}" (only in fr.json)`);

if (problems.length) {
  console.error(problems.join('\n'));
  console.error(`\n${problems.length} translation problem(s).`);
  process.exit(1);
}
console.log(`i18n OK: ${enMap.size} keys in English and French, ${used.size} referenced in code.`);
