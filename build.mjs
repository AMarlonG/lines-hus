// Bundles src/app.js with Three.js and inlines it into one self-contained HTML file: dist/index.html
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const result = await build({
  entryPoints: ['src/app.js'], bundle: true, format: 'iife', minify: true, write: false,
});
const js = result.outputFiles[0].text.replace(/<\/script>/g, '<\\/script>');
const html = readFileSync('src/index.template.html', 'utf8').replace('/*BUNDLE*/', () => js);
mkdirSync('dist', { recursive: true });
writeFileSync('dist/index.html', html);
console.log(`dist/index.html written (${(html.length / 1024).toFixed(0)} KB)`);
