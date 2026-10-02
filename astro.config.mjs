import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://socialkitchhen.pages.dev',
  integrations: [sitemap()],
});