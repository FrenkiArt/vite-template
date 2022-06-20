// bootstrap
import "bootstrap/scss/bootstrap-grid.scss";
//import "bootstrap/dist/js/bootstrap.min.js";

// import Swiper JS
import Swiper, { Navigation, Pagination } from "swiper";
//import Swiper from "swiper/bundle";

// import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
//import "swiper/css/bundle";

// configure Swiper to use modules
Swiper.use([Navigation, Pagination]);

window.Swiper = Swiper;

// fonts
// import './fonts/stylesheet.css';

// custom select
//import customSelect from "custom-select";
//window.customSelect = customSelect;

// my components
import "./components/template/component.scss";
import "./components/template/component.js";

// my
import "./scss/style.scss";
import "./scss/header.scss";
import "./scss/shortened.scss";
import "./scss/acc.scss";
import "./scss/pagination.scss";
import "./scss/popup.scss";
import "./scss/sections.scss";
import "./scss/links.scss";

import "./scss/footer.scss";
import "./scss/stuff.scss";
import "./scss/button.scss";
import "./scss/added-styles.scss";

import "./js/tabs.js";
import "./js/acc.js";
import "./js/shortened.js";
import "./js/popup.js";
import "./js/my.js";
