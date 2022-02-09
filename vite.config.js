import legacy from '@vitejs/plugin-legacy';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.join(__dirname, 'src/'),

  build: {
    minify: false,
    outDir: path.join(__dirname, './dist/./'),
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src', 'index.html'),
        index2: path.resolve(__dirname, 'src', 'all-elements.html'),
      },

      output: {
        entryFileNames: `assets/js/[name].js`,
        chunkFileNames: `assets/js/[name].js`,
        assetFileNames: function (filename) {
          // console.log(filename);

          if (
            filename.name.includes('.jpg') ||
            filename.name.includes('.jpeg') ||
            filename.name.includes('.png') ||
            filename.name.includes('.webp')
          ) {
            return `assets/img/[name].[ext]`;
          } else if (filename.name.includes('.svg')) {
            return `assets/svg/[name].[ext]`;
          } else if (filename.name.includes('.css')) {
            return `assets/css/[name].[ext]`;
          } else if (
            filename.name.includes('.eot') ||
            filename.name.includes('.ttf') ||
            filename.name.includes('.woff')
          ) {
            return `assets/fonts/[name].[ext]`;
          } else {
            return `assets/[ext]/[name].[ext]`;
          }
        },
      },
    },

    // minify: false,
  },

  server: {
    open: '/index.html',
  },

  plugins: [
    /* legacy({
      targets: ['defaults', 'not IE 11'],
    }), */
  ],
});
