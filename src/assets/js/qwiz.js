/**
 * QwizSlider - класс для управления многошаговыми формами (квизами)
 */
class QwizSlider {
  constructor(selector, options = {}) {
    this.form =
      typeof selector === "string"
        ? document.querySelector(selector)
        : selector;

    if (!this.form) {
      throw new Error(`QwizSlider: элемент "${selector}" не найден`);
    }

    const autoNextAttr = this.form.getAttribute("data-auto-next");
    const autoNextDelayAttr = this.form.getAttribute("data-auto-next-delay");
    const animationDurationAttr = this.form.getAttribute(
      "data-animation-duration"
    );

    this.options = {
      animationDuration: animationDurationAttr
        ? parseInt(animationDurationAttr)
        : 300,
      firstActiveSlide: 1,
      autoFocus: true,
      autoNextOnChange: autoNextAttr === "true",
      autoNextDelay: autoNextDelayAttr ? parseInt(autoNextDelayAttr) : 300,
      ...options,
    };

    this.slides = Array.from(this.form.querySelectorAll("[data-qwiz-slide]"));
    this.currentSlideIndex = 0;
    this.isAnimating = false;
    this.autoNextTimeout = null;

    this._init();
  }

  _init() {
    if (this.slides.length === 0) {
      console.warn("QwizSlider: слайды не найдены");
      return;
    }

    this._applyClasses();
    this._setInitialSlide();
    this._bindEvents();
    this._updateButtons();
  }

  _applyClasses() {
    this.form.classList.add("qwiz-wrapper");

    this.slides.forEach((slide) => {
      slide.classList.add("qwiz-slide");
    });
  }

  _setInitialSlide() {
    const activeSlide = this.slides.findIndex((slide) =>
      slide.classList.contains("active")
    );
    this.currentSlideIndex = activeSlide !== -1 ? activeSlide : 0;

    this.slides.forEach((slide, index) => {
      if (index === this.currentSlideIndex) {
        slide.classList.add("active");
        slide.style.opacity = "1";
        slide.style.visibility = "visible";
      } else {
        slide.classList.remove("active");
        slide.style.opacity = "0";
        slide.style.visibility = "hidden";
      }
    });

    if (this.options.autoFocus) {
      this._focusFirstInput(this.currentSlideIndex);
    }
  }

  _bindEvents() {
    this.form.addEventListener("click", (e) => {
      const nextBtn = e.target.closest("[data-qwiz-btn-next]");
      if (nextBtn) {
        e.preventDefault();
        this.next();
      }
    });

    this.form.addEventListener("click", (e) => {
      const prevBtn = e.target.closest("[data-qwiz-btn-prev]");
      if (prevBtn) {
        e.preventDefault();
        this.prev();
      }
    });

    this.form.addEventListener("change", (e) => {
      this._updateButtons();

      if (this.options.autoNextOnChange) {
        const input = e.target;
        const isRadioOrCheckbox =
          input.type === "radio" || input.type === "checkbox";
        const currentSlide = this.slides[this.currentSlideIndex];
        const isInCurrentSlide = currentSlide.contains(input);

        if (isRadioOrCheckbox && isInCurrentSlide && input.checked) {
          if (this.autoNextTimeout) {
            clearTimeout(this.autoNextTimeout);
          }

          this.autoNextTimeout = setTimeout(() => {
            this.next();
            this.autoNextTimeout = null;
          }, this.options.autoNextDelay);
        }
      }
    });

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this._handleSubmit();
    });
  }

  _showSlide(index, animate = true) {
    if (this.isAnimating || index === this.currentSlideIndex) return;

    const currentSlide = this.slides[this.currentSlideIndex];
    const nextSlide = this.slides[index];

    if (!nextSlide) return;

    this.currentSlideIndex = index;
    this._updateButtons();

    if (animate) {
      this.isAnimating = true;

      currentSlide.classList.remove("active");
      currentSlide.style.opacity = "0";

      setTimeout(() => {
        currentSlide.style.visibility = "hidden";

        nextSlide.style.visibility = "visible";
        nextSlide.classList.add("active");

        void nextSlide.offsetWidth;

        if (this.options.autoFocus) {
          this._focusFirstInput(index);
        }

        nextSlide.style.opacity = "1";

        setTimeout(() => {
          this.isAnimating = false;
          this._onSlideChanged(index);
        }, this.options.animationDuration);
      }, this.options.animationDuration);
    } else {
      currentSlide.classList.remove("active");
      currentSlide.style.visibility = "hidden";
      currentSlide.style.opacity = "0";

      nextSlide.classList.add("active");
      nextSlide.style.visibility = "visible";
      nextSlide.style.opacity = "1";

      if (this.options.autoFocus) {
        this._focusFirstInput(index);
      }

      this._onSlideChanged(index);
    }
  }

  /**
   * Фокусировка первого или выбранного инпута на слайде
   * @private
   */
  _focusFirstInput(index) {
    const slide = this.slides[index];
    let targetInput = null;

    // Сначала проверяем, есть ли уже выбранный radio или checkbox
    const checkedInput = slide.querySelector(
      'input[type="radio"]:checked, input[type="checkbox"]:checked'
    );

    if (checkedInput) {
      // Если есть выбранный — фокусируем его
      targetInput = checkedInput;
    } else {
      // Если нет — ищем первый интерактивный элемент
      targetInput = slide.querySelector("input, textarea, select");
    }

    if (targetInput && !targetInput.disabled) {
      // Минимальная задержка для гарантии видимости
      setTimeout(() => targetInput.focus(), 10);
    }
  }

  _onSlideChanged(index) {
    this.form.dispatchEvent(
      new CustomEvent("qwiz:slideChanged", {
        detail: {
          currentIndex: index,
          currentSlide: this.slides[index],
          totalSlides: this.slides.length,
        },
      })
    );
  }

  _validateCurrentSlide() {
    const currentSlide = this.slides[this.currentSlideIndex];
    const requiredInputs = currentSlide.querySelectorAll("[required]");

    if (requiredInputs.length === 0) return true;

    let isValid = false;

    requiredInputs.forEach((input) => {
      if (input.type === "radio" || input.type === "checkbox") {
        const name = input.name;
        const group = currentSlide.querySelectorAll(`[name="${name}"]`);
        const hasChecked = Array.from(group).some((inp) => inp.checked);
        if (hasChecked) isValid = true;
      } else {
        if (input.value.trim() !== "") isValid = true;
      }
    });

    return isValid;
  }

  _updateButtons() {
    const prevButtons = this.form.querySelectorAll("[data-qwiz-btn-prev]");
    const nextButtons = this.form.querySelectorAll("[data-qwiz-btn-next]");

    prevButtons.forEach((btn) => {
      btn.disabled =
        this.currentSlideIndex <= this.options.firstActiveSlide - 1;
    });

    const isValid = this._validateCurrentSlide();
    nextButtons.forEach((btn) => {
      btn.disabled = !isValid;
    });
  }

  next() {
    if (this.isAnimating) return false;

    if (!this._validateCurrentSlide()) {
      console.warn("QwizSlider: заполните обязательные поля");
      return false;
    }

    if (this.currentSlideIndex < this.slides.length - 1) {
      this._showSlide(this.currentSlideIndex + 1);
      return true;
    }

    return false;
  }

  prev() {
    if (this.isAnimating) return false;

    if (this.currentSlideIndex > this.options.firstActiveSlide - 1) {
      this._showSlide(this.currentSlideIndex - 1);
      return true;
    }

    return false;
  }

  goToSlide(index, skipValidation = false) {
    if (this.isAnimating) return false;

    if (index < 0 || index >= this.slides.length) {
      console.warn(`QwizSlider: недопустимый индекс слайда ${index}`);
      return false;
    }

    if (index < this.options.firstActiveSlide - 1) {
      console.warn("QwizSlider: переход к этому слайду заблокирован");
      return false;
    }

    if (!skipValidation && index > this.currentSlideIndex) {
      if (!this._validateCurrentSlide()) {
        console.warn("QwizSlider: заполните обязательные поля");
        return false;
      }
    }

    this._showSlide(index);
    return true;
  }

  goToSlideNumber(slideNumber, skipValidation = false) {
    return this.goToSlide(slideNumber - 1, skipValidation);
  }

  getCurrentSlideIndex() {
    return this.currentSlideIndex;
  }

  getCurrentSlideNumber() {
    return this.currentSlideIndex + 1;
  }

  getTotalSlides() {
    return this.slides.length;
  }

  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  }

  _handleSubmit() {
    const formData = this.getFormData();

    this.form.dispatchEvent(
      new CustomEvent("qwiz:submit", {
        detail: { formData },
      })
    );

    console.log("Данные формы:", formData);
  }

  reset() {
    this.form.reset();

    if (this.autoNextTimeout) {
      clearTimeout(this.autoNextTimeout);
      this.autoNextTimeout = null;
    }

    this.goToSlide(0, true);
  }

  destroy() {
    if (this.autoNextTimeout) {
      clearTimeout(this.autoNextTimeout);
    }

    this.slides.forEach((slide) => {
      slide.classList.remove("qwiz-slide", "active");
      slide.style.position = "";
      slide.style.top = "";
      slide.style.left = "";
      slide.style.width = "";
      slide.style.opacity = "";
      slide.style.visibility = "";
      slide.style.transition = "";
    });

    this.form.classList.remove("qwiz-wrapper");
    this.form = null;
    this.slides = null;
  }
}

// Автоинициализация
document.addEventListener("DOMContentLoaded", () => {
  const qwizForms = document.querySelectorAll("[data-qwiz]");

  qwizForms.forEach((form, index) => {
    const instance = new QwizSlider(form);

    form._qwizInstance = instance;

    const qwizId = form.getAttribute("data-qwiz") || `qwiz_${index}`;
    window[`${qwizId}`] = instance;
  });
});

// Привязка к window для общего доступа
window.QwizSlider = QwizSlider;
