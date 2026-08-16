import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://shaysha-pra.github.io',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    routing: { prefixDefaultLocale: false },
  },
});
