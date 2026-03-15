import { defineConfig } from 'vite';
import vituum from 'vituum';
import nunjucks from '@vituum/vite-plugin-nunjucks';
import { visualizer } from 'rollup-plugin-visualizer';
// import viteCompression from 'vite-plugin-compression';
import webfontDownload from 'vite-plugin-webfont-dl';
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';

const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'gif', 'avif', 'webp'];
const FONT_EXTS = ['eot', 'ttf', 'otf', 'woff2', 'woff'];

export default defineConfig({
  plugins: [
    webfontDownload(),
    visualizer({
      open: true,
      template: 'treemap',
      gzipSize: true,
      brotliSize: false,
    }),
    //viteCompression(),
    vituum(),
    nunjucks({
      root: './src',
      globals: {
        currentYear: new Date().getFullYear(),
      },
    }),
    VitePluginSvgSpritemap('./src/icons/*.svg', {
      // prefix: 'icon-', // Префикс для ID символов (по умолчанию 'sprite-')
    }),
  ],
  server: {
    open: true,
    cors: true,
    host: true,
  },

  build: {
    cssCodeSplit: true,
    sourcemap: true,
    assetsInlineLimit: 0, // Отключение инлайнинга мелких файлов
    emptyOutDir: true, // Очистка выходной директории

    rollupOptions: {
      output: {
        entryFileNames: `assets/js/[name].js`,
        chunkFileNames: `assets/js/[name].js`,
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.names[0].split('.').pop();

          if (IMAGE_EXTS.includes(ext)) {
            return `assets/img/[name].[ext]`;
          }
          if (ext === 'svg') {
            return `assets/svg/[name].[ext]`;
          }
          if (['css', 'scss'].includes(ext)) {
            return `assets/css/[name].[ext]`;
          }
          if (FONT_EXTS.includes(ext)) {
            return `assets/fonts/[name].[ext]`;
          }
          return `assets/[ext]/[name].[ext]`;
        },
      },
    },
    minify: false,
    cssMinify: true,
    cssMinifyOptions: {
      target: 'es2015',
    },
  },
});
