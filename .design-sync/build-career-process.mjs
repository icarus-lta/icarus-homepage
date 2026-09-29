import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(root, 'design-system/package.json'));
const { build } = require('esbuild');
const preview = path.join(root, '.design-sync/.cache/preview');
const out = path.join(preview, 'career-process');
mkdirSync(out, { recursive: true });
await build({ entryPoints: [path.join(root, '.design-sync/career-process.jsx')], bundle: true, format: 'iife', jsx: 'transform', target: 'es2022', minify: true, outfile: path.join(out, 'process.js') });
copyFileSync(path.join(root, '.design-sync/career-process.css'), path.join(out, 'process.css'));
const current = readFileSync(path.join(preview, 'career/index.html'), 'utf8');
const style = current.match(/href="(\/styles\.css[^\"]*)"/)[1];
const bundle = current.match(/src="(\/_ds_bundle\.js[^\"]*)"/)[1];
const version = createHash('sha256').update(readFileSync(path.join(out, 'process.js'))).update(readFileSync(path.join(out, 'process.css'))).digest('hex').slice(0, 12);
writeFileSync(path.join(out, 'index.html'), `<!doctype html><html lang="ko"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>ICARUS · 채용 절차 디자인 시안</title>
<style>html,body{margin:0;background:#060a10;color:#d8e0e9}</style>
<link rel="stylesheet" href="${style}"><link rel="stylesheet" href="/career-process/process.css?v=${version}">
<script defer src="${bundle}"></script><script defer src="/career-process/process.js?v=${version}"></script>
</head><body><div id="career-process-root"><p style="padding:100px 24px">채용 절차 시안을 불러오는 중입니다.</p></div></body></html>`);
console.log('Career process studies: http://localhost:8801/career-process/?lang=ko');
