// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://curious-shortbread-45a21e.netlify.app',
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
  }
});