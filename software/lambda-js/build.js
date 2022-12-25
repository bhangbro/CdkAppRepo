const { build } = require('esbuild')

build({
  entryPoints: ['src/index.ts'],
  outdir: 'dist/src',
  platform: 'node',
  target: 'node14',
  minify: true,
  bundle: true
})