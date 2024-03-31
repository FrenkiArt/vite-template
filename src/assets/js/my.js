import IMask from 'imask';
import lightGallery from 'lightgallery';
//import lgFullscreen from 'lightgallery/plugins/fullscreen';
import { Modal } from 'bootstrap/js/index.esm.js';
import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';

window.addEventListener('resize', function (e) {
  console.log(window.innerWidth);
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('input[type=tel]')) {
    telMasksTrigger();
  }

  if (document.querySelector('[data-gallary]')) {
    document.querySelectorAll('[data-gallary]').forEach((el) => {
      lightGallery(el, {
        licenseKey: '0000 0000 0000 0000',
        download: false,
        fullScreen: false,
        //plugins: [lgFullscreen],

        selector: '[data-src]',
        //selector: 'this',
      });
    });
  }

  /* const sliderSimptoms = new Swiper('.slider-simptoms', {
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    speed: 400,

    autoplay: {
      delay: 5000,
    },

    modules: [EffectFade, Autoplay],

    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
  }); */
});

function telMasksTrigger() {
  document.querySelectorAll('input[type=tel]').forEach((el) => {
    window.telArr = [];

    window.telArr.push(
      IMask(el, {
        mask: '+{7} 000 000 00 00',
        //mask: '+{7} (000) 000-00-00',
        //lazy: false, // make placeholder always visible
        //placeholderChar: '#', // defaults to '_'
      })
    );
  });
}
