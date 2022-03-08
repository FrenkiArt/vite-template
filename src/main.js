// bootstrap
import 'bootstrap/scss/bootstrap-grid.scss';
import 'bootstrap/dist/js/bootstrap.min.js';

// uikit
import 'uikit/dist/css/uikit.css';
import 'uikit/dist/js/uikit.js';
import 'uikit/dist/js/uikit-icons.js';

// import Swiper JS
import Swiper, { Navigation, Pagination } from 'swiper';
// import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// configure Swiper to use modules
Swiper.use([Navigation, Pagination]);

window.Swiper = Swiper;

// fonts
// import './fonts/stylesheet.css';

// my components
import './components/template/component.scss';
import './components/template/component.js';

// my
import './scss/style.scss';
import './scss/header.scss';

import './scss/footer.scss';
import './scss/stuff.scss';
import './scss/button.scss';
import './scss/added-styles.scss';

import './js/my.js';
