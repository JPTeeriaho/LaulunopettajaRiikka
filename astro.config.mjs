// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://riikkavuorijarvi.fi',

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'fi',
        locales: { fi: 'fi', en: 'en' },
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});