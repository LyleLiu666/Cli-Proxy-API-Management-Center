import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import { execSync } from 'child_process';
import fs from 'fs';
import { formatBuildVersion } from './src/utils/buildVersion.ts';

// Get version from environment, git tag, or package.json
function getVersion(): string {
  let rawVersion = '';

  // 1. Environment variable (set by GitHub Actions)
  if (process.env.VERSION) {
    rawVersion = process.env.VERSION;
  }

  // 2. Try git tag
  if (!rawVersion) {
    try {
      const gitTag = execSync(
        'git describe --tags --exact-match 2>/dev/null || git describe --tags 2>/dev/null || echo ""',
        { encoding: 'utf8' }
      ).trim();
      if (gitTag) {
        rawVersion = gitTag;
      }
    } catch {
      // Git not available or no tags
    }
  }

  // 3. Fall back to package.json version
  if (!rawVersion) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));
      if (pkg.version && pkg.version !== '0.0.0') {
        rawVersion = pkg.version;
      }
    } catch {
      // package.json not readable
    }
  }

  let originRemoteUrl = '';
  try {
    originRemoteUrl = execSync('git config --get remote.origin.url 2>/dev/null || echo ""', {
      encoding: 'utf8',
    }).trim();
  } catch {
    // ignore missing git remote
  }

  return formatBuildVersion({
    rawVersion: rawVersion || 'dev',
    originRemoteUrl,
    forkLabel: process.env.FORK_VERSION_LABEL,
  });
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteSingleFile({
      removeViteModuleLoader: true
    })
  ],
  define: {
    __APP_VERSION__: JSON.stringify(getVersion())
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables.scss" as *;`
      }
    }
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    rolldownOptions: {
      output: {
        codeSplitting: false
      }
    }
  }
});
