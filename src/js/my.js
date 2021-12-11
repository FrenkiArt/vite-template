console.log('hello from my.js');

window.addEventListener('resize', function (e) {
  console.log(window.innerWidth);
});

if (document.querySelector('#menu-trigger')) {
  document
    .querySelector('#menu-trigger')
    .addEventListener('click', function (e) {
      this.classList.toggle('active');

      document.querySelector('#menu').classList.toggle('active');
    });
}

if (document.querySelector('#menu')) {
  document.querySelector('#menu').addEventListener('click', function (e) {
    if (window.innerWidth < 800) {
      document.querySelector('#menu-trigger').classList.toggle('active');
      document.querySelector('#menu').classList.toggle('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', function (e) {
  const swiper = new window.Swiper('.swiper', {
    //loop: true,

    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: false,
      type: 'fraction',

      formatFractionCurrent: function (number) {
        if (number < 10) {
          return '0' + number;
        } else {
          return number;
        }
      },

      formatFractionTotal: function (number) {
        if (number < 10) {
          return '0' + number;
        } else {
          return number;
        }
      },
    },

    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
});
