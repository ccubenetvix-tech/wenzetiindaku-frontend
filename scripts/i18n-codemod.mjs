// Replaces hardcoded user-facing text in src/ with i18next calls and records the
// English source strings in src/locales/en.json. French is added separately.
// Usage: node scripts/i18n-codemod.mjs [path-filter] [--dry]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(projectRoot, 'src');
const args = process.argv.slice(2);
const dry = args.includes('--dry');
const filter = args.find((a) => !a.startsWith('--'));

const enPath = path.join(root, 'locales', 'en.json');
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));

const TEXT_ATTRS = new Set(['placeholder', 'title', 'alt', 'aria-label', 'label', 'description', 'tooltip']);
const MESSAGE_PROPS = new Set(['title', 'description', 'message', 'label', 'placeholder', 'text']);
const MESSAGE_CALLS = new Set(['toast', 'alert', 'confirm', 'prompt', 'setError', 'setMessage', 'setSuccess', 'success', 'error', 'info', 'warning']);
const ENTITIES = { '&apos;': "'", '&quot;': '"', '&amp;': '&', '&nbsp;': ' ', '&copy;': '©', '&rarr;': '→', '&larr;': '←', '&middot;': '·', '&lt;': '<', '&gt;': '>', '&hellip;': '…', '&mdash;': '—', '&ndash;': '–', '&rsquo;': '’', '&lsquo;': '‘', '&rdquo;': '”', '&ldquo;': '“', '&bull;': '•' };
const decode = (s) => s.replace(/&[a-z]+;/g, (e) => ENTITIES[e] ?? e);

const looksLikeJsxText = (s) => /[A-Za-z]{2}/.test(s.trim()) && !/^\S+@\S+\.\S+$/.test(s.trim());
const looksLikeText = (s) => {
  const v = s.trim();
  if (v.length < 2 || !/[A-Za-z]{2}/.test(v)) return false;
  if (/^(https?:|mailto:|tel:|\/|#|\.|@)/.test(v)) return false;
  if (/^\S+@\S+\.\S+$/.test(v)) return false; // email
  if (/^[a-z]+([A-Z][a-z0-9]*)+$/.test(v)) return false;
  if (/^[a-z0-9_.-]+$/.test(v) && !v.includes(' ')) return false;
  if (/(^|\s)(flex|grid|text-|bg-|p[xytblr]?-\d|m[xytblr]?-\d|w-|h-\d|rounded|border|items-|justify-|gap-)/.test(v) && !/[.!?]$/.test(v)) return false;
  return true;
};

// ---------- key generation ----------
const nsFor = (rel) => {
  const parts = rel.replace(/\.(tsx?|jsx?)$/, '').split(/[\\/]/);
  const top = parts[0]; // pages | components | contexts | utils | hooks | lib
  const rest = parts.slice(1).map((p, i) => (i === parts.length - 2 ? p.charAt(0).toLowerCase() + p.slice(1) : p));
  return [top, ...rest].join('.');
};
const getAt = (obj, dotted) => dotted.split('.').reduce((o, k) => (o && typeof o === 'object' ? o[k] : undefined), obj);
const setAt = (obj, dotted, value) => {
  const ks = dotted.split('.');
  let o = obj;
  for (const k of ks.slice(0, -1)) {
    if (typeof o[k] !== 'object' || o[k] === null) o[k] = {};
    o = o[k];
  }
  o[ks.at(-1)] = value;
};
const keyFromText = (text) => {
  const words = text
    .replace(/\{\{\s*(\w+)\s*\}\}/g, ' $1 ')
    .replace(/[^A-Za-z0-9 ]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 6);
  if (!words.length) return 'text';
  const k = words.map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())).join('');
  return /^\d/.test(k) ? `n${k}` : k;
};
const allocKey = (ns, text) => {
  const nsObj = getAt(en, ns);
  if (nsObj && typeof nsObj === 'object') {
    for (const [k, v] of Object.entries(nsObj)) if (v === text) return `${ns}.${k}`; // reuse same text
  }
  const base = keyFromText(text);
  let k = base;
  for (let i = 2; getAt(en, `${ns}.${k}`) !== undefined; i++) k = `${base}${i}`;
  setAt(en, `${ns}.${k}`, text);
  return `${ns}.${k}`;
};

// ---------- interpolation naming ----------
const varName = (expr, sf, used) => {
  let n = 'value';
  let e = expr;
  while (ts.isParenthesizedExpression(e) || ts.isNonNullExpression(e) || ts.isAsExpression(e)) e = e.expression;
  if (ts.isIdentifier(e)) n = e.text;
  else if (ts.isPropertyAccessExpression(e)) n = e.name.text === 'length' ? 'count' : e.name.text;
  else if (ts.isElementAccessExpression(e)) n = 'value';
  else if (ts.isCallExpression(e)) {
    const a = e.arguments[0];
    n = a ? varName(a, sf, new Set()) : 'value';
  } else if (ts.isBinaryExpression(e) && e.operatorToken.kind === ts.SyntaxKind.QuestionQuestionToken) n = varName(e.left, sf, new Set());
  n = n.replace(/[^A-Za-z0-9_]/g, '') || 'value';
  if (/^\d/.test(n)) n = `v${n}`;
  let out = n;
  for (let i = 2; used.has(out); i++) out = `${n}${i}`;
  used.add(out);
  return out;
};

// ---------- scope helpers ----------
const isFunctionLike = (n) => ts.isFunctionDeclaration(n) || ts.isArrowFunction(n) || ts.isFunctionExpression(n) || ts.isMethodDeclaration(n);
const fnName = (fn) => {
  if (ts.isFunctionDeclaration(fn) && fn.name) return fn.name.text;
  let p = fn.parent;
  while (p && ts.isCallExpression(p)) p = p.parent; // memo(() => ...), forwardRef(...)
  if (p && ts.isVariableDeclaration(p) && ts.isIdentifier(p.name)) return p.name.text;
  return null;
};
const isComponentOrHook = (fn) => {
  const n = fnName(fn);
  return !!n && (/^[A-Z]/.test(n) || /^use[A-Z]/.test(n));
};
const declaresHookT = (fn, sf) => {
  const body = fn.body;
  if (!body || !ts.isBlock(body)) return false;
  return body.statements.some((st) => ts.isVariableStatement(st) && /useTranslation\s*\(/.test(st.getText(sf)) && /\{[^}]*\bt\b[^}]*\}/.test(st.declarationList.declarations[0]?.name.getText(sf) ?? ''));
};
const bindsT = (fn, sf) => {
  if (fn.parameters?.some((p) => /\bt\b/.test(p.name.getText(sf)))) return true;
  const body = fn.body;
  if (!body || !ts.isBlock(body)) return false;
  return body.statements.some((st) => ts.isVariableStatement(st) && st.declarationList.declarations.some((d) => /(^|[{,\s])t([,}\s:]|$)/.test(d.name.getText(sf))) && !/useTranslation\s*\(/.test(st.getText(sf)));
};

// ---------- per-file transform ----------
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return ['ui', 'locales'].includes(e.name) ? [] : walk(p);
    return /\.tsx?$/.test(e.name) && !e.name.endsWith('.d.ts') && !['i18n.ts', 'format.ts'].includes(e.name) ? [p] : [];
  });

let totalReplaced = 0;
const summary = [];

for (const file of walk(root)) {
  const rel = path.relative(root, file);
  if (filter && !rel.replaceAll('\\', '/').includes(filter)) continue;
  const source = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const ns = nsFor(rel);
  const edits = [];
  const hookFor = new Set(); // component functions that need `const { t } = useTranslation()`
  let needsI18nImport = false;
  let needsHookImport = false;
  const handled = new Set();

  // Decide how to call t for a JSX-rendered node: hook `t` when inside a component, else i18n.t
  const jsxCaller = (node) => {
    const chain = [];
    for (let p = node.parent; p; p = p.parent) if (isFunctionLike(p)) chain.push(p);
    if (chain.some((fn) => bindsT(fn, sf))) { needsI18nImport = true; return 'i18n.t'; }
    const withHook = chain.find((fn) => declaresHookT(fn, sf));
    if (withHook) return 't';
    const comp = [...chain].reverse().find((fn) => isComponentOrHook(fn));
    if (comp) { hookFor.add(comp); needsHookImport = true; return 't'; }
    needsI18nImport = true;
    return 'i18n.t';
  };
  const msgCaller = () => { needsI18nImport = true; return 'i18n.t'; };
  const isMessageCallee = (c) => {
    const name = c.expression.getText(sf);
    if (/^(console|logger|Sentry)\./.test(name)) return false;
    return MESSAGE_CALLS.has(name.split('.').pop());
  };

  const call = (caller, key, params) => {
    const p = params.length ? `, { ${params.map(([n, e]) => (n === e ? n : `${n}: ${e}`)).join(', ')} }` : '';
    return `${caller}('${key}'${p})`;
  };

  // Template literal -> [text with {{vars}}, params]
  const fromTemplate = (tpl) => {
    if (ts.isNoSubstitutionTemplateLiteral(tpl)) return [tpl.text, []];
    const used = new Set();
    let text = tpl.head.text;
    const params = [];
    for (const span of tpl.templateSpans) {
      const name = varName(span.expression, sf, used);
      params.push([name, span.expression.getText(sf)]);
      text += `{{${name}}}` + span.literal.text;
    }
    return [text, params];
  };
  const isStringy = (n) => ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isTemplateExpression(n);
  const stringText = (n) => (ts.isStringLiteral(n) ? [n.text, []] : fromTemplate(n));
  const insideTCall = (node) => {
    for (let p = node.parent; p; p = p.parent) {
      if (ts.isCallExpression(p) && /(^|\.)t$/.test(p.expression.getText(sf))) return true;
      if (isFunctionLike(p)) return false;
    }
    return false;
  };
  const replaceString = (n, caller) => {
    if (handled.has(n.pos)) return;
    const [raw, params] = stringText(n);
    const text = raw.replace(/\s+/g, ' ').trim();
    if (!looksLikeText(text.replace(/\{\{\w+\}\}/g, ''))) return;
    handled.add(n.pos);
    edits.push({ start: n.getStart(sf), end: n.getEnd(), text: call(caller, allocKey(ns, text), params) });
  };

  // JSX children: merge runs of text + simple expressions into one sentence
  const handleChildren = (children) => {
    let run = [];
    const flush = () => {
      if (!run.some((c) => ts.isJsxText(c) && looksLikeJsxText(decode(c.text)))) { run = []; return; }
      // trim non-significant whitespace-only edges
      while (run.length && ts.isJsxText(run[0]) && !run[0].text.trim()) run.shift();
      while (run.length && ts.isJsxText(run.at(-1)) && !run.at(-1).text.trim()) run.pop();
      const used = new Set();
      const params = [];
      let text = '';
      for (const c of run) {
        if (ts.isJsxText(c)) text += decode(c.text);
        else {
          const name = varName(c.expression, sf, used);
          params.push([name, c.expression.getText(sf)]);
          text += `{{${name}}}`;
        }
      }
      const value = text.replace(/\s+/g, ' ').trim();
      const first = run[0];
      const last = run.at(-1);
      const start = ts.isJsxText(first) ? first.pos + (first.text.length - first.text.trimStart().length) : first.getStart(sf);
      const end = ts.isJsxText(last) ? last.getEnd() - (last.text.length - last.text.trimEnd().length) : last.getEnd();
      const caller = jsxCaller(first);
      edits.push({ start, end, text: `{${call(caller, allocKey(ns, value), params)}}` });
      for (const c of run) handled.add(c.pos);
      run = [];
    };
    for (const c of children) {
      if (ts.isJsxText(c)) run.push(c);
      else if (ts.isJsxExpression(c) && c.expression && !insideTCall(c.expression) && isSimpleValue(c.expression)) run.push(c);
      else flush();
    }
    flush();
  };
  const isSimpleValue = (e) => {
    if (ts.isIdentifier(e) || ts.isPropertyAccessExpression(e) || ts.isElementAccessExpression(e) || ts.isNumericLiteral(e)) return true;
    if (ts.isCallExpression(e)) return !/(^|\.)t$/.test(e.expression.getText(sf)) && !e.getText(sf).includes('=>') && !e.getText(sf).includes('<');
    if (ts.isBinaryExpression(e)) return [ts.SyntaxKind.QuestionQuestionToken, ts.SyntaxKind.PlusToken, ts.SyntaxKind.MinusToken, ts.SyntaxKind.AsteriskToken].includes(e.operatorToken.kind) && !isStringy(e.right) && !isStringy(e.left);
    if (ts.isParenthesizedExpression(e) || ts.isNonNullExpression(e)) return isSimpleValue(e.expression);
    return false;
  };

  // --data: text inside object/array literals built in a component body, e.g.
  // const tips = [{ title: "Order early", description: "..." }]. Opt-in per file,
  // because elsewhere props like `name`/`label` can be internal identifiers.
  const NON_TEXT_PROPS = new Set(['id', 'key', 'href', 'to', 'path', 'icon', 'value', 'type', 'variant', 'className', 'color', 'slug', 'url', 'src', 'image', 'status', 'code', 'route', 'field', 'method', 'role', 'lng', 'email', 'phone']);
  const visitData = (node) => {
    if (isStringy(node) && !handled.has(node.pos) && !insideTCall(node)) {
      const p = node.parent;
      const asProp = ts.isPropertyAssignment(p) && p.initializer === node && !NON_TEXT_PROPS.has(p.name.getText(sf));
      const asItem = ts.isArrayLiteralExpression(p) && (ts.isPropertyAssignment(p.parent) || ts.isVariableDeclaration(p.parent));
      if (asProp || asItem) {
        const chain = [];
        for (let q = node.parent; q; q = q.parent) if (isFunctionLike(q)) chain.push(q);
        if (chain.some((fn) => isComponentOrHook(fn))) replaceString(node, jsxCaller(node));
      }
    }
    ts.forEachChild(node, visitData);
  };
  if (args.includes('--data')) visitData(sf);

  const visit = (node) => {
    if ((ts.isJsxElement(node) || ts.isJsxFragment(node))) handleChildren(node.children);

    if (ts.isJsxAttribute(node) && node.initializer && TEXT_ATTRS.has(node.name.getText(sf))) {
      const init = node.initializer;
      if (ts.isStringLiteral(init) && looksLikeText(init.text)) {
        handled.add(init.pos);
        edits.push({ start: init.getStart(sf), end: init.getEnd(), text: `{${call(jsxCaller(node), allocKey(ns, init.text.replace(/\s+/g, ' ').trim()), [])}}` });
      } else if (ts.isJsxExpression(init) && init.expression && isStringy(init.expression) && !insideTCall(init.expression)) {
        replaceString(init.expression, jsxCaller(node));
      }
    }

    if (isStringy(node) && !handled.has(node.pos) && !insideTCall(node)) {
      // Only climb through positions whose value is what gets rendered:
      // `c ? "A" : "B"`, `c && "A"`, `x || "A"`, `x ?? "A"`. A string compared
      // with === is a value check, not display text, and must stay untouched.
      const RESULT_OPS = [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken];
      let child = node;
      let p = node.parent;
      while (p) {
        if (ts.isParenthesizedExpression(p)) { child = p; p = p.parent; continue; }
        if (ts.isConditionalExpression(p) && p.condition !== child) { child = p; p = p.parent; continue; }
        if (ts.isBinaryExpression(p) && RESULT_OPS.includes(p.operatorToken.kind) && (p.right === child || p.operatorToken.kind !== ts.SyntaxKind.AmpersandAmpersandToken)) { child = p; p = p.parent; continue; }
        break;
      }
      // {cond ? "Yes" : "No"} rendered in JSX, or inside an attribute expression
      if (p && ts.isJsxExpression(p)) {
        const inTextAttr = ts.isJsxAttribute(p.parent) && TEXT_ATTRS.has(p.parent.name.getText(sf));
        if (!ts.isJsxAttribute(p.parent) || inTextAttr) replaceString(node, jsxCaller(node));
      }
      // toast({ title: "..." }), setError("..."), new Error("...")
      // `child` is the whole value expression (e.g. `err.message || "Failed"`), `p` what receives it.
      const prop = p && ts.isPropertyAssignment(p) && p.initializer === child && MESSAGE_PROPS.has(p.name.getText(sf));
      let inMsgCall = false;
      for (let q = p; q && !isFunctionLike(q); q = q.parent) {
        if (ts.isCallExpression(q) && isMessageCallee(q)) { inMsgCall = true; break; }
      }
      const directArg = p && ts.isCallExpression(p) && p.arguments.includes(child) && isMessageCallee(p);
      const errorArg = p && ts.isNewExpression(p) && /^(Error|TypeError)$/.test(p.expression.getText(sf)) && p.arguments?.[0] === child;
      if ((prop && inMsgCall) || directArg || errorArg) replaceString(node, msgCaller());
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);

  if (!edits.length) continue;

  // Insert `const { t } = useTranslation();` into components that need it
  for (const fn of hookFor) {
    if (declaresHookT(fn, sf)) continue;
    const body = fn.body;
    if (ts.isBlock(body)) {
      const hasUseTranslation = body.statements.find((st) => ts.isVariableStatement(st) && /useTranslation\s*\(/.test(st.getText(sf)));
      if (hasUseTranslation) {
        // e.g. `const { i18n } = useTranslation();` -> add t
        const decl = hasUseTranslation.declarationList.declarations[0].name;
        edits.push({ start: decl.getStart(sf) + 1, end: decl.getStart(sf) + 1, text: ' t,' });
      } else {
        const indent = (source.slice(0, body.statements[0]?.getStart(sf) ?? body.getStart(sf) + 1).match(/[ \t]*$/) ?? [''])[0] || '  ';
        edits.push({ start: body.getStart(sf) + 1, end: body.getStart(sf) + 1, text: `\n${indent}const { t } = useTranslation();` });
      }
    } else {
      // expression-bodied arrow component: () => (<div/>)
      edits.push({ start: body.getStart(sf), end: body.getStart(sf), text: '{\n  const { t } = useTranslation();\n  return ' });
      edits.push({ start: body.getEnd(), end: body.getEnd(), text: ';\n}' });
    }
  }

  // Imports
  const importText = sf.statements.filter(ts.isImportDeclaration).map((d) => d.getText(sf)).join('\n');
  const lastImport = sf.statements.filter(ts.isImportDeclaration).at(-1);
  const at = lastImport ? lastImport.getEnd() : 0;
  if (needsHookImport && !/\buseTranslation\b/.test(importText)) {
    const rti = sf.statements.find((s) => ts.isImportDeclaration(s) && s.moduleSpecifier.getText(sf).includes('react-i18next'));
    if (rti && rti.importClause?.namedBindings && ts.isNamedImports(rti.importClause.namedBindings)) {
      edits.push({ start: rti.importClause.namedBindings.getEnd() - 1, end: rti.importClause.namedBindings.getEnd() - 1, text: ', useTranslation ' });
    } else edits.push({ start: at, end: at, text: `\nimport { useTranslation } from "react-i18next";` });
  }
  if (needsI18nImport && !/import i18n\b/.test(importText)) {
    edits.push({ start: at, end: at, text: `\nimport i18n from "@/lib/i18n";` });
  }

  // apply edits back-to-front; drop overlaps (outer edit wins)
  edits.sort((a, b) => b.start - a.start || b.end - a.end);
  let out = source;
  let lastStart = Infinity;
  let count = 0;
  for (const e of edits) {
    if (e.start !== e.end && e.end > lastStart) continue;
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
    if (e.start !== e.end) { lastStart = e.start; count++; }
  }
  totalReplaced += count;
  summary.push(`${String(count).padStart(4)}  ${rel}`);
  if (!dry) fs.writeFileSync(file, out);
}

if (!dry) fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
console.log(summary.join('\n'));
console.log(`${dry ? '[dry] ' : ''}replaced ${totalReplaced} strings`);
