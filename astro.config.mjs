import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  devToolbar: {
    enabled: false,
  },
  server: {
    host: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
