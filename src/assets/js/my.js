import IMask from 'imask';
import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';

window.addEventListener('resize', function (e) {
  console.log(window.innerWidth);
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('input[type=tel]')) {
    telMasksTrigger();
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
