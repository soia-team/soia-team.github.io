import { defineConfig, type Plugin, type ResolvedConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

function githubPagesSpaFallback(): Plugin {
  let outputDirectory = '';

  return {
    name: 'github-pages-spa-fallback',
    apply: 'build',
    configResolved(config: ResolvedConfig) {
      outputDirectory = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      await copyFile(`${outputDirectory}/index.html`, `${outputDirectory}/404.html`);
    },
  };
}

export default defineConfig({
  plugins: [react(), githubPagesSpaFallback()],
  server: {
    host: '127.0.0.1',
    port: 4174,
  },
  preview: {
    host: '127.0.0.1',
    port: 4175,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
