// Separate review candidate: preserves the existing /about page and earlier A/B/C study.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const destination = join(root, '.design-sync/.cache/preview');
mkdirSync(join(destination, 'media'), { recursive:true });
for(const file of ['about-story.html', 'about-story.css', 'about-story-notes.html']) {
  copyFileSync(join(root, 'output', file), join(destination, file));
}
copyFileSync(join(root, 'static/product_img.png'), join(destination, 'media/about-material.png'));
// Use the existing ABOUT's exact hero styles, including its responsive sizing and video crop.
// Remove only the CSS layer wrapper so candidate-wide element styles cannot override it.
const originalAboutCss = readFileSync(join(root, 'design-system/src/about.css'), 'utf8');
writeFileSync(join(destination, 'about-original-hero.css'), originalAboutCss.replace(/^@layer components\s*\{/, '').replace(/\}\s*$/, ''));
console.log('About story preview: http://localhost:8801/about-story.html');
