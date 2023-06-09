import IMask from 'imask';

window.addEventListener('resize', function (e) {
  console.log(window.innerWidth);
});

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('input[type=tel]')) {
    telMasksTrigger();
  }
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
