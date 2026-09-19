// Lists user-visible English text in src/ that bypasses i18n:
// JSX text, text-bearing JSX attributes, and toast/alert/confirm messages.
// Usage: node scripts/find-untranslated.mjs [path-filter]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'src');
const filter = process.argv.slice(2).find((a) => !a.startsWith('--'));

const TEXT_ATTRS = new Set(['placeholder', 'title', 'alt', 'aria-label', 'label', 'description', 'tooltip']);
const MESSAGE_PROPS = new Set(['title', 'description', 'message', 'label', 'placeholder', 'text']);
const MESSAGE_CALLS = new Set(['toast', 'alert', 'confirm', 'prompt', 'setError', 'setMessage', 'setSuccess']);

const looksLikeJsxText = (s) => /[A-Za-z]{2}/.test(s.trim()) && !/^\S+@\S+\.\S+$/.test(s.trim());
const looksLikeText = (s) => {
  const v = s.trim();
  if (v.length < 2 || !/[A-Za-z]{2}/.test(v)) return false;
  if (/^(https?:|mailto:|tel:|\/|#|\.|@)/.test(v)) return false;
  if (/^\S+@\S+\.\S+$/.test(v)) return false; // email addresses
  if (/^[a-z]+([A-Z][a-z0-9]*)+$/.test(v)) return false; // camelCase identifiers / i18n keys
  if (/^[a-z0-9_.-]+$/.test(v) && !v.includes(' ')) return false; // slugs, keys, css tokens
  if (/^[\w-]+(\s+[\w-:/[\]!.]+)+$/.test(v) && /(^|\s)(flex|grid|text-|bg-|p[xytblr]?-|m[xytblr]?-|w-|h-|rounded|border|items-|justify-|gap-)/.test(v)) return false; // tailwind classes
  return true;
};

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return ['ui', 'locales'].includes(e.name) ? [] : walk(p);
    return /\.tsx?$/.test(e.name) && !e.name.endsWith('.d.ts') && !p.endsWith('i18n.ts') ? [p] : [];
  });

const findings = [];
for (const file of walk(root)) {
  const rel = path.relative(root, file);
  if (filter && !rel.replaceAll('\\', '/').includes(filter)) continue;
  const sf = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const report = (node, text) => {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    findings.push({ file: rel, line: line + 1, text: text.trim().replace(/\s+/g, ' ') });
  };
  const isInsideTCall = (node) => {
    for (let p = node.parent; p; p = p.parent) {
      if (ts.isCallExpression(p)) {
        const name = p.expression.getText(sf);
        if (/(^|\.)t$/.test(name)) return true;
      }
    }
    return false;
  };
  const visit = (node) => {
    if (ts.isJsxText(node) && looksLikeJsxText(node.text)) report(node, node.text);

    if (ts.isJsxAttribute(node) && node.initializer && TEXT_ATTRS.has(node.name.getText(sf))) {
      const init = node.initializer;
      if (ts.isStringLiteral(init) && looksLikeText(init.text)) report(init, init.text);
      if (ts.isJsxExpression(init) && init.expression && (ts.isStringLiteral(init.expression) || ts.isNoSubstitutionTemplateLiteral(init.expression)) && looksLikeText(init.expression.text)) report(init, init.expression.text);
    }

    // { title: "Something", description: "..." } inside toast(...) and similar
    if (ts.isPropertyAssignment(node) && MESSAGE_PROPS.has(node.name.getText(sf))) {
      const init = node.initializer;
      if ((ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) && looksLikeText(init.text) && !isInsideTCall(init)) {
        let inMessageCall = false;
        for (let p = node.parent; p; p = p.parent) {
          if (ts.isCallExpression(p) && MESSAGE_CALLS.has(p.expression.getText(sf).split('.').pop())) { inMessageCall = true; break; }
        }
        if (inMessageCall) report(init, init.text);
      }
    }

    // toast.error("..."), alert("..."), setError("...") -- console.* is developer logging, not UI
    if (ts.isCallExpression(node) && !/^(console|logger|Sentry)\./.test(node.expression.getText(sf)) && MESSAGE_CALLS.has(node.expression.getText(sf).split('.').pop().replace(/^(success|error|info|warning)$/, 'toast'))) {
      for (const arg of node.arguments) {
        if ((ts.isStringLiteral(arg) || ts.isNoSubstitutionTemplateLiteral(arg)) && looksLikeText(arg.text)) report(arg, arg.text);
      }
    }

    // {cond ? "Yes" : "No"} / {x || "Fallback"} rendered inside JSX
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && looksLikeText(node.text) && !isInsideTCall(node)) {
      // climb only through rendered-result positions; `x === "A"` is a value check, not text
      const RESULT_OPS = [ts.SyntaxKind.AmpersandAmpersandToken, ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken];
      let child = node;
      let p = node.parent;
      while (p) {
        if (ts.isParenthesizedExpression(p)) { child = p; p = p.parent; continue; }
        if (ts.isConditionalExpression(p) && p.condition !== child) { child = p; p = p.parent; continue; }
        if (ts.isBinaryExpression(p) && RESULT_OPS.includes(p.operatorToken.kind) && (p.right === child || p.operatorToken.kind !== ts.SyntaxKind.AmpersandAmpersandToken)) { child = p; p = p.parent; continue; }
        break;
      }
      if (p && ts.isJsxExpression(p) && !ts.isJsxAttribute(p.parent)) report(node, node.text);
      // fallback text in messages: toast({ description: err.message || "Failed" }), new Error("...")
      const inMsg = (p && ts.isPropertyAssignment(p) && p.initializer === child && MESSAGE_PROPS.has(p.name.getText(sf)) && (() => { for (let q = p; q; q = q.parent) if (ts.isCallExpression(q) && MESSAGE_CALLS.has(q.expression.getText(sf).split('.').pop())) return true; return false; })())
        || (p && ts.isNewExpression(p) && /^(Error|TypeError)$/.test(p.expression.getText(sf)) && p.arguments?.[0] === child);
      if (inMsg && child !== node) report(node, node.text);
    }

    ts.forEachChild(node, visit);
  };
  visit(sf);
}

const byFile = {};
for (const f of findings) (byFile[f.file] ||= []).push(f);
const verbose = process.argv.includes('--list') || filter;
for (const [file, list] of Object.entries(byFile).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`${String(list.length).padStart(4)}  ${file}`);
  if (verbose) for (const f of list) console.log(`        ${f.line}: ${f.text.slice(0, 110)}`);
}
console.log(`TOTAL ${findings.length} untranslated strings in ${Object.keys(byFile).length} files`);
process.exitCode = findings.length ? 1 : 0;
