#!/usr/bin/env node
/**
 * Build a fully static export of the public site (display/exhibit mode) that
 * can be uploaded to any plain web host, such as shared cPanel hosting.
 *
 *   npm run build:static   ->  out/
 *
 * The admin area and the read/write API need a Node server, so those routes
 * are set aside for the duration of the build. JSON-LD downloads are written
 * into out/downloads/ instead of being served by API routes.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const holding = path.join(root, '.static-excluded');
const serverOnlyDirs = ['src/app/admin', 'src/app/api'];

fs.rmSync(holding, { recursive: true, force: true });
fs.mkdirSync(holding, { recursive: true });

const moved = [];
let status = 1;
try {
  for (const rel of serverOnlyDirs) {
    const from = path.join(root, rel);
    if (!fs.existsSync(from)) continue;
    const to = path.join(holding, path.basename(rel));
    fs.renameSync(from, to);
    moved.push([from, to]);
  }
  // A stale .next dir from a server build confuses the export type-checker.
  fs.rmSync(path.join(root, '.next'), { recursive: true, force: true });
  const result = spawnSync('npx', ['next', 'build'], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, OIR_STATIC: '1' },
  });
  status = result.status ?? 1;
} finally {
  for (const [from, to] of moved) fs.renameSync(to, from);
  fs.rmSync(holding, { recursive: true, force: true });
}
if (status !== 0) process.exit(status);

/* Generate JSON-LD downloads from the data directory. */
const dataDir = process.env.OIR_DATA_DIR ?? path.join(root, 'data');
const itemsDir = path.join(dataDir, 'items');
const outDir = path.join(root, 'out');
const downloadsDir = path.join(outDir, 'downloads');
fs.mkdirSync(downloadsDir, { recursive: true });

const isRecordKey = (key) => key.startsWith('oir:');
const graph = [];
const mergedContext = {};

if (fs.existsSync(itemsDir)) {
  for (const entry of fs.readdirSync(itemsDir).sort()) {
    if (!entry.endsWith('.jsonld')) continue;
    let doc;
    try {
      doc = JSON.parse(fs.readFileSync(path.join(itemsDir, entry), 'utf8'));
    } catch {
      console.warn(`Skipping unparseable item file: ${entry}`);
      continue;
    }
    const context = {};
    if (doc['@context'] && typeof doc['@context'] === 'object' && !Array.isArray(doc['@context'])) {
      for (const [prefix, ns] of Object.entries(doc['@context'])) {
        if (prefix !== 'oir' && typeof ns === 'string') context[prefix] = ns;
      }
    }
    const node = {};
    for (const [key, value] of Object.entries(doc)) {
      if (key === '@context' || isRecordKey(key)) continue;
      node[key] = value;
    }
    fs.writeFileSync(
      path.join(downloadsDir, entry),
      JSON.stringify({ '@context': context, ...node }, null, 2),
    );
    Object.assign(mergedContext, context);
    graph.push(node);
  }
}

fs.writeFileSync(
  path.join(downloadsDir, 'collection.jsonld'),
  JSON.stringify({ '@context': mergedContext, '@graph': graph }, null, 2),
);

/* Apache niceties: serve .jsonld with the right MIME type, map 404s. */
fs.writeFileSync(
  path.join(outDir, '.htaccess'),
  ['AddType application/ld+json .jsonld', 'ErrorDocument 404 /404.html', ''].join('\n'),
);

console.log(`\nStatic site written to out/ (${graph.length} JSON-LD downloads in out/downloads/).`);
console.log('Upload the CONTENTS of out/ (including .htaccess) to your web root, e.g. public_html/.');
