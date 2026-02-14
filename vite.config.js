import { defineConfig } from 'vite';
import vituum from 'vituum';
import nunjucks from '@vituum/vite-plugin-nunjucks';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
// import viteCompression from 'vite-plugin-compression';
//import { VitePWA } from 'vite-plugin-pwa';
import webfontDownload from 'vite-plugin-webfont-dl';
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';

export default defineConfig({
  //root: path.join(__dirname, '/'),
  plugins: [
    webfontDownload(),
    visualizer({
      open: true,
      template: 'treemap',
      gzipSize: true,
      brotliSize: false,
    }),
    //viteCompression(),
    //VitePWA(),
    vituum(),
    nunjucks({
      root: './src', // Корневая папка для поиска шаблонов.
      // Дополнительные настройки (опционально)
      globals: {
        currentYear: new Date().getFullYear(),
        resource: { pagetitle: 'Главная', content: '<p>Привет</p>' },
      },
    }),
    VitePluginSvgSpritemap('./src/icons/*.svg', {
      // prefix: 'icon-', // Префикс для ID символов (по умолчанию 'sprite-')
    }),
  ],
  server: {
    open: true,
    cors: true,
  },

  build: {
    cssCodeSplit: true,
    sourcemap: true,
    assetsInlineLimit: 0, // Отключение инлайнинга мелких файлов
    emptyOutDir: true, // Очистка выходной директории

    rollupOptions: {
      /*  input: { 
        index: path.resolve(__dirname, 'src/templates/pages/index.njk'), 
        //allelements: path.resolve(__dirname, 'src/templates/pages/all-elements.njk'),
      }, */
      output: {
        entryFileNames: `assets/js/[name].js`,
        chunkFileNames: `assets/js/[name].js`,
        assetFileNames: (assetInfo) => {
          const ext = assetInfo.names[0].split('.').pop();
          if (
            [
              'png',
              'jpe?g',
              'jfif',
              'pjpeg',
              'pjp',
              'gif',
              'avif',
              'webp',
            ].includes(ext)
          ) {
            return `assets/img/[name].[ext]`;
          } else if (ext === 'svg') {
            return `assets/svg/[name].[ext]`;
          } else if (['css', 'scss'].includes(ext)) {
            return `assets/css/[name].[ext]`;
          } else if (['eot', 'ttf', 'otf', 'woff2?', 'woff'].includes(ext)) {
            return `assets/fonts/[name].[ext]`;
          } else {
            return `assets/[ext]/[name].[ext]`;
          }
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
