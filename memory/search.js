'use strict';

// Borrowed verbatim from begb0037admin/brief-converge's own memory/search.js,
// via agent-template. No agent-specific changes needed — the logic is
// entirely generic over whatever memory/index.json contains.

const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, 'index.json');

const STOP = new Set(
  'a an and are as at be but by do does for from has have how i in is it its of on or that the this to was what when where which who will with you your'.split(' '),
);

function tokenize(text) {
  return String(text ?? '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

function loadEntries(indexPath = INDEX_PATH) {
  const raw = fs.readFileSync(indexPath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error(`${indexPath} must contain a JSON array`);
  return parsed;
}

function entryText(entry) {
  return [entry.title, entry.fix, ...(entry.tags || [])].join(' ');
}

function buildIndex(entries) {
  const docs = entries.map((entry) => ({ entry, tokens: tokenize(entryText(entry)) }));
  const df = {};
  for (const doc of docs) {
    for (const word of new Set(doc.tokens)) df[word] = (df[word] || 0) + 1;
  }
  return { docs, df, n: docs.length };
}

function search(query, { topN = 5, entries = null, includeSuperseded = false } = {}) {
  const allEntries = entries || loadEntries();
  const active = includeSuperseded ? allEntries : allEntries.filter((e) => e.status === 'active');
  const { docs, df, n } = buildIndex(active);
  const queryTokens = [...new Set(tokenize(query))];
  if (!queryTokens.length || !n) return [];

  const scored = docs
    .map(({ entry, tokens }) => {
      let score = 0;
      for (const word of queryTokens) {
        const tf = tokens.reduce((count, t) => count + (t === word ? 1 : 0), 0);
        if (tf) score += (tf / Math.sqrt(tokens.length || 1)) * Math.log(1 + n / (df[word] || 1));
      }
      return { score, entry };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, topN);
}

function formatResult(result) {
  const { entry, score } = result;
  return [
    `id: ${entry.id}`,
    `title: ${entry.title}`,
    `fix: ${entry.fix}`,
    `confirmed_via: ${entry.confirmed_via}`,
    `date: ${entry.date}`,
    `score: ${score.toFixed(4)}`,
  ].join('\n');
}

function main() {
  const query = process.argv.slice(2).join(' ').trim();
  if (!query) {
    process.stderr.write('usage: node memory/search.js "<query>"\n');
    process.exit(1);
  }
  const results = search(query);
  if (!results.length) return;
  process.stdout.write(`${results.map(formatResult).join('\n\n')}\n`);
}

if (require.main === module) main();

module.exports = { tokenize, loadEntries, buildIndex, search, entryText };
