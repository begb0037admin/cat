'use strict';

// Borrowed verbatim from begb0037admin/brief-converge's own memory/candidate.js,
// via agent-template.

const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, 'index.json');

const FIELD_LABELS = {
  title: 'Title',
  date: 'Date',
  confirmed_via: 'Confirmed via',
  fix: 'Fix',
  tags: 'Tags',
  source_run: 'Source run',
};
const REQUIRED_FIELDS = Object.keys(FIELD_LABELS);

function fail(message) {
  process.stderr.write(`memory/candidate.js: ${message}\n`);
  process.exit(1);
}

function parseCandidate(text) {
  const lines = text.split('\n');
  const labelPattern = Object.entries(FIELD_LABELS)
    .map(([key, label]) => ({ key, re: new RegExp(`^${label}:\\s*(.*)$`) }))
    .concat([{ key: '__heading', re: /^#/ }]);

  const values = {};
  let currentKey = null;
  for (const line of lines) {
    const match = labelPattern.find(({ re }) => re.test(line));
    if (match) {
      if (match.key === '__heading') { currentKey = null; continue; }
      currentKey = match.key;
      values[currentKey] = (line.match(match.re)[1] || '').trim();
      continue;
    }
    if (currentKey === 'fix' && line.trim()) {
      values.fix = `${values.fix} ${line.trim()}`.trim();
    }
  }
  return values;
}

function validate(values) {
  const missing = REQUIRED_FIELDS.filter((key) => !values[key] || !String(values[key]).trim());
  if (missing.length) {
    return { ok: false, reason: `missing required field(s): ${missing.map((k) => FIELD_LABELS[k]).join(', ')}` };
  }
  return { ok: true };
}

function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function loadIndex() {
  if (!fs.existsSync(INDEX_PATH)) return [];
  const raw = fs.readFileSync(INDEX_PATH, 'utf8').trim();
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) throw new Error(`${INDEX_PATH} must contain a JSON array`);
  return parsed;
}

function saveIndex(entries) {
  fs.writeFileSync(INDEX_PATH, `${JSON.stringify(entries, null, 2)}\n`, 'utf8');
}

function toEntry(values) {
  return {
    id: `${values.date}-${slugify(values.title)}`,
    date: values.date,
    title: values.title,
    fix: values.fix,
    confirmed_via: values.confirmed_via,
    tags: values.tags.split(',').map((t) => t.trim()).filter(Boolean),
    source_run: values.source_run,
    status: 'active',
    superseded_by: null,
  };
}

function add(candidatePath) {
  if (!candidatePath) fail('usage: node memory/candidate.js add <path-to-candidate.md>');
  const text = fs.readFileSync(candidatePath, 'utf8');
  const values = parseCandidate(text);
  const result = validate(values);
  if (!result.ok) fail(result.reason);
  const entry = toEntry(values);
  const entries = loadIndex();
  entries.push(entry);
  saveIndex(entries);
  process.stdout.write(`memory/candidate.js: added ${entry.id}\n`);
}

function supersede(oldId, candidatePath) {
  if (!oldId || !candidatePath) fail('usage: node memory/candidate.js supersede <old-id> <path-to-new-candidate.md>');
  const text = fs.readFileSync(candidatePath, 'utf8');
  const values = parseCandidate(text);
  const result = validate(values);
  if (!result.ok) fail(result.reason);
  const entries = loadIndex();
  const oldEntry = entries.find((e) => e.id === oldId);
  if (!oldEntry) fail(`no entry found with id: ${oldId}`);
  const newEntry = toEntry(values);
  oldEntry.status = 'superseded';
  oldEntry.superseded_by = newEntry.id;
  entries.push(newEntry);
  saveIndex(entries);
  process.stdout.write(`memory/candidate.js: ${oldId} superseded by ${newEntry.id}\n`);
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (command === 'add') add(args[0]);
  else if (command === 'supersede') supersede(args[0], args[1]);
  else fail('usage: node memory/candidate.js <add|supersede> ...');
}

if (require.main === module) main();

module.exports = { parseCandidate, validate, slugify, toEntry, loadIndex, saveIndex, add, supersede };
