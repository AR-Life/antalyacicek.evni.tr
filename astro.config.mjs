// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://antalyacicek.evni.tr',
  output: 'server',
  adapter: cloudflare(),
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en', 'ru', 'de', 'pl', 'nl', 'ro', 'cs', 'uk', 'lt'],
    routing: {
      prefixDefaultLocale: false,
    },
    fallback: {
      en: 'tr',
      ru: 'tr',
      de: 'tr',
      pl: 'tr',
      nl: 'tr',
      ro: 'tr',
      cs: 'tr',
      uk: 'tr',
      lt: 'tr',
    },
  },
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        ignored: ['**/*.db', '**/*.db-*', '**/.wrangler/**', '**/.data/**', '**/dist/**']
      }
    }
  },
});