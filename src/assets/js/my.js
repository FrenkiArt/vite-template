// import IMask from 'imask';
//import lightGallery from 'lightgallery';
//import lgFullscreen from 'lightgallery/plugins/fullscreen';
import { Modal } from 'bootstrap/js/dist/modal';
//import Modal from 'bootstrap/js/dist/modal'

import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade, Autoplay } from 'swiper/modules';

Swiper.use([Navigation, Pagination, EffectFade, Autoplay]);

// Инициализация при загрузке DOM-дерева
document.addEventListener('DOMContentLoaded', () => {
  // initTelMasks();
  // initLightGalleries();
  initTemplateSlider();
  initTemplateSlider2();
});

// Функция инициализации масок телефонных номеров
function initTelMasks() {
  const telInputs = document.querySelectorAll('input[type=tel]');
  telInputs.forEach((el) => {
    IMask(el, {
      mask: '+{7} 000 000 00 00',
    });
  });
}

// Функция инициализации галерей изображений
function initLightGalleries() {
  const galleryElements = document.querySelectorAll('[data-gallery]');
  galleryElements.forEach((el) => {
    lightGallery(el, {
      licenseKey: '0000 0000 0000 0000',
      download: false,
      fullScreen: false,
      plugins: [lgFullscreen],
      selector: '[data-src]',
    });
  });
}

function initTemplateSlider() {
  const slider = new SwiperCore('.slider-template', {
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    speed: 400,
    autoplay: {
      delay: 5000,
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
}
function initTemplateSlider2() {
  const slider = new SwiperCore('.slider-template2', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 400,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  });
}

// Экспорт модального окна для доступа извне
window.modal = Modal;
