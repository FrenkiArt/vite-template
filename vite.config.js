import { defineConfig } from 'vite';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
//import viteCompression from 'vite-plugin-compression';
import { VitePWA } from 'vite-plugin-pwa';
import pugPlugin from 'vite-plugin-pug';
import webfontDownload from 'vite-plugin-webfont-dl';
import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';

export default defineConfig({
  root: path.join(__dirname, '/'),
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
    // vituum(),
    /* pug({ 
      locals: {
        // Глобальные переменные для всех шаблонов
        title: 'Мой сайт',
        environment: process.env.NODE_ENV,
        version: require('./package.json').version,
      },
    }), */
    pugPlugin({
      handler: {
        pretty: true,
      },
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
      //input: ['index.pug.html'],
      input: {
        index: path.resolve(__dirname, 'index.html'),
        allelements: path.resolve(__dirname, 'all-elements.html'),
      },
      /*  
      inputzz: {
        index: path.resolve(__dirname, 'index.html'),
        allelements: path.resolve(__dirname, 'all-elements.html'),
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
