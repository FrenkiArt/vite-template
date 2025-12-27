/**
 * @fileoverview Класс для создания и управления многошаговыми формами (квизами) с поддержкой анимации, валидации и автоматического перехода.
 * @author Автор не указан
 * @version 1.0.0
 */

/**
 * QwizSlider - класс для управления многошаговыми формами (квизами)
 *
 * @example
 * // Инициализация через селектор
 * const qwiz = new QwizSlider('.quiz-form', {
 *   animationDuration: 500,
 *   firstActiveSlide: 1,
 *   autoFocus: true,
 *   autoNextOnChange: true,
 *   autoNextDelay: 300
 * });
 *
 * @example
 * // Инициализация через DOM-элемент
 * const formElement = document.getElementById('quiz-form');
 * const qwiz = new QwizSlider(formElement);
 *
 * @param {string|HTMLElement} selector - CSS-селектор или HTML-элемент формы
 * @param {Object} options - Пользовательские настройки квиза
 * @param {number} [options.animationDuration=300] - Длительность анимации перехода между слайдами (в миллисекундах)
 * @param {number} [options.firstActiveSlide=1] - Номер первого активного слайда (начинается с 1)
 * @param {boolean} [options.autoFocus=true] - Автоматически фокусировать первый интерактивный элемент на слайде
 * @param {boolean} [options.autoNextOnChange=false] - Автоматически переходить к следующему слайду при изменении значения (для radio/checkbox)
 * @param {number} [options.autoNextDelay=300] - Задержка перед автоматическим переходом (в миллисекундах)
 */
class QwizSlider {
  constructor(selector, options = {}) {
    /**
     * Основной элемент формы квиза
     * @type {HTMLElement}
     * @private
     */
    this.form =
      typeof selector === 'string'
        ? document.querySelector(selector)
        : selector;

    if (!this.form) {
      throw new Error(`QwizSlider: элемент "${selector}" не найден`);
    }

    const autoNextAttr = this.form.getAttribute('data-auto-next');
    const autoNextDelayAttr = this.form.getAttribute('data-auto-next-delay');
    const animationDurationAttr = this.form.getAttribute(
      'data-animation-duration',
    );

    /**
     * Объект с настройками квиза
     * @type {Object}
     * @property {number} animationDuration - Длительность анимации
     * @property {number} firstActiveSlide - Номер первого активного слайда
     * @property {boolean} autoFocus - Автофокусировка
     * @property {boolean} autoNextOnChange - Автоматический переход при изменении
     * @property {number} autoNextDelay - Задержка автоматического перехода
     * @private
     */
    this.options = {
      animationDuration: animationDurationAttr
        ? parseInt(animationDurationAttr)
        : 300,
      firstActiveSlide: 1,
      autoFocus: true,
      autoNextOnChange: autoNextAttr === 'true',
      autoNextDelay: autoNextDelayAttr ? parseInt(autoNextDelayAttr) : 300,
      ...options,
    };

    /**
     * Массив всех слайдов квиза
     * @type {HTMLElement[]}
     * @private
     */
    this.slides = Array.from(this.form.querySelectorAll('[data-qwiz-slide]'));

    /**
     * Индекс текущего активного слайда
     * @type {number}
     * @private
     */
    this.currentSlideIndex = 0;

    /**
     * Флаг, указывающий, происходит ли в данный момент анимация
     * @type {boolean}
     * @private
     */
    this.isAnimating = false;

    /**
     * Таймер для автоматического перехода
     * @type {number|null}
     * @private
     */
    this.autoNextTimeout = null;

    this._init();
  }

  /**
   * Инициализация квиза: применение классов, установка начального слайда, привязка событий
   * @private
   */
  _init() {
    if (this.slides.length === 0) {
      console.warn('QwizSlider: слайды не найдены');
      return;
    }

    this._applyClasses();
    this._setInitialSlide();
    this._bindEvents();
    this._updateButtons();
  }

  /**
   * Применяет необходимые CSS-классы к элементам квиза
   * Добавляет обертке класс 'qwiz-wrapper', а каждому слайду - класс 'qwiz-slide'
   * @private
   */
  _applyClasses() {
    this.form.classList.add('qwiz-wrapper');

    this.slides.forEach((slide) => {
      slide.classList.add('qwiz-slide');
    });
  }

  /**
   * Устанавливает начальный активный слайд
   * Если на странице уже есть активный слайд (с классом 'active'), он будет использован
   * В противном случае активируется первый слайд
   * @private
   */
  _setInitialSlide() {
    const activeSlide = this.slides.findIndex((slide) =>
      slide.classList.contains('active'),
    );
    this.currentSlideIndex = activeSlide !== -1 ? activeSlide : 0;

    this.slides.forEach((slide, index) => {
      if (index === this.currentSlideIndex) {
        slide.classList.add('active');
        slide.style.opacity = '1';
        slide.style.visibility = 'visible';
      } else {
        slide.classList.remove('active');
        slide.style.opacity = '0';
        slide.style.visibility = 'hidden';
      }
    });

    if (this.options.autoFocus) {
      this._focusFirstInput(this.currentSlideIndex);
    }
  }

  /**
   * Привязывает обработчики событий к форме
   * - Клик по кнопкам следующего/предыдущего слайда
   * - Изменение значений полей ввода
   * - Отправка формы
   * @private
   */
  _bindEvents() {
    this.form.addEventListener('click', (e) => {
      const nextBtn = e.target.closest('[data-qwiz-btn-next]');
      if (nextBtn) {
        e.preventDefault();
        this.next();
      }
    });

    this.form.addEventListener('click', (e) => {
      const prevBtn = e.target.closest('[data-qwiz-btn-prev]');
      if (prevBtn) {
        e.preventDefault();
        this.prev();
      }
    });

    this.form.addEventListener('change', (e) => {
      this._updateButtons();

      if (this.options.autoNextOnChange) {
        const input = e.target;
        const isRadioOrCheckbox =
          input.type === 'radio' || input.type === 'checkbox';
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

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this._handleSubmit();
    });
  }

  /**
   * Показывает слайд по заданному индексу с анимацией
   * @param {number} index - Индекс слайда (начиная с 0)
   * @param {boolean} [animate=true] - Выполнять анимацию перехода
   * @returns {void}
   * @private
   */
  _showSlide(index, animate = true) {
    if (this.isAnimating || index === this.currentSlideIndex) return;

    const currentSlide = this.slides[this.currentSlideIndex];
    const nextSlide = this.slides[index];

    if (!nextSlide) return;

    this.currentSlideIndex = index;
    this._updateButtons();

    if (animate) {
      this.isAnimating = true;

      currentSlide.classList.remove('active');
      currentSlide.style.opacity = '0';

      setTimeout(() => {
        currentSlide.style.visibility = 'hidden';

        nextSlide.style.visibility = 'visible';
        nextSlide.classList.add('active');

        void nextSlide.offsetWidth;

        if (this.options.autoFocus) {
          this._focusFirstInput(index);
        }

        nextSlide.style.opacity = '1';

        setTimeout(() => {
          this.isAnimating = false;
          this._onSlideChanged(index);
        }, this.options.animationDuration);
      }, this.options.animationDuration);
    } else {
      currentSlide.classList.remove('active');
      currentSlide.style.visibility = 'hidden';
      currentSlide.style.opacity = '0';

      nextSlide.classList.add('active');
      nextSlide.style.visibility = 'visible';
      nextSlide.style.opacity = '1';

      if (this.options.autoFocus) {
        this._focusFirstInput(index);
      }

      this._onSlideChanged(index);
    }
  }

  /**
   * Фокусировка первого или выбранного инпута на слайде
   * @private
   * @param {number} index - Индекс слайда
   */
  _focusFirstInput(index) {
    const slide = this.slides[index];
    let targetInput = null;

    // Сначала проверяем, есть ли уже выбранный radio или checkbox
    const checkedInput = slide.querySelector(
      'input[type="radio"]:checked, input[type="checkbox"]:checked',
    );

    if (checkedInput) {
      // Если есть выбранный — фокусируем его
      targetInput = checkedInput;
    } else {
      // Если нет — ищем первый интерактивный элемент
      targetInput = slide.querySelector('input, textarea, select');
    }

    if (targetInput && !targetInput.disabled) {
      // Минимальная задержка для гарантии видимости
      setTimeout(() => targetInput.focus(), 10);
    }
  }

  /**
   * Генерирует пользовательское событие при смене слайда
   * @private
   * @param {number} index - Индекс нового активного слайда
   * @fires QwizSlider#qwiz:slideChanged
   */
  _onSlideChanged(index) {
    this.form.dispatchEvent(
      new CustomEvent('qwiz:slideChanged', {
        detail: {
          currentIndex: index,
          currentSlide: this.slides[index],
          totalSlides: this.slides.length,
        },
      }),
    );
  }

  /**
   * Проверяет валидность текущего слайда
   * Проверяет все обязательные поля на слайде
   * @returns {boolean} true, если слайд валиден, иначе false
   * @private
   */
  _validateCurrentSlide() {
    const currentSlide = this.slides[this.currentSlideIndex];
    const requiredInputs = currentSlide.querySelectorAll('[required]');

    if (requiredInputs.length === 0) return true;

    let isValid = false;

    requiredInputs.forEach((input) => {
      if (input.type === 'radio' || input.type === 'checkbox') {
        const name = input.name;
        const group = currentSlide.querySelectorAll(`[name="${name}"]`);
        const hasChecked = Array.from(group).some((inp) => inp.checked);
        if (hasChecked) isValid = true;
      } else {
        if (input.value.trim() !== '') isValid = true;
      }
    });

    return isValid;
  }

  /**
   * Обновляет состояние кнопок навигации (вперед/назад)
   * Блокирует кнопку "назад", если находимся на первом активном слайде
   * Блокирует кнопку "вперед", если текущий слайд не прошел валидацию
   * @private
   */
  _updateButtons() {
    const prevButtons = this.form.querySelectorAll('[data-qwiz-btn-prev]');
    const nextButtons = this.form.querySelectorAll('[data-qwiz-btn-next]');

    prevButtons.forEach((btn) => {
      btn.disabled =
        this.currentSlideIndex <= this.options.firstActiveSlide - 1;
    });

    const isValid = this._validateCurrentSlide();
    nextButtons.forEach((btn) => {
      btn.disabled = !isValid;
    });
  }

  /**
   * Переходит к следующему слайду
   * @returns {boolean} true, если переход выполнен успешно, иначе false
   */
  next() {
    if (this.isAnimating) return false;

    if (!this._validateCurrentSlide()) {
      console.warn('QwizSlider: заполните обязательные поля');
      return false;
    }

    if (this.currentSlideIndex < this.slides.length - 1) {
      this._showSlide(this.currentSlideIndex + 1);
      return true;
    }

    return false;
  }

  /**
   * Переходит к предыдущему слайду
   * @returns {boolean} true, если переход выполнен успешно, иначе false
   */
  prev() {
    if (this.isAnimating) return false;

    if (this.currentSlideIndex > this.options.firstActiveSlide - 1) {
      this._showSlide(this.currentSlideIndex - 1);
      return true;
    }

    return false;
  }

  /**
   * Переходит к слайду по индексу
   * @param {number} index - Индекс слайда (начиная с 0)
   * @param {boolean} [skipValidation=false] - Пропустить валидацию текущего слайда
   * @returns {boolean} true, если переход выполнен успешно, иначе false
   */
  goToSlide(index, skipValidation = false) {
    if (this.isAnimating) return false;

    if (index < 0 || index >= this.slides.length) {
      console.warn(`QwizSlider: недопустимый индекс слайда ${index}`);
      return false;
    }

    if (index < this.options.firstActiveSlide - 1) {
      console.warn('QwizSlider: переход к этому слайду заблокирован');
      return false;
    }

    if (!skipValidation && index > this.currentSlideIndex) {
      if (!this._validateCurrentSlide()) {
        console.warn('QwizSlider: заполните обязательные поля');
        return false;
      }
    }

    this._showSlide(index);
    return true;
  }

  /**
   * Переходит к слайду по номеру
   * @param {number} slideNumber - Номер слайда (начиная с 1)
   * @param {boolean} [skipValidation=false] - Пропустить валидацию текущего слайда
   * @returns {boolean} true, если переход выполнен успешно, иначе false
   */
  goToSlideNumber(slideNumber, skipValidation = false) {
    return this.goToSlide(slideNumber - 1, skipValidation);
  }

  /**
   * Возвращает индекс текущего слайда
   * @returns {number} Индекс текущего слайда (начиная с 0)
   */
  getCurrentSlideIndex() {
    return this.currentSlideIndex;
  }

  /**
   * Возвращает номер текущего слайда
   * @returns {number} Номер текущего слайда (начиная с 1)
   */
  getCurrentSlideNumber() {
    return this.currentSlideIndex + 1;
  }

  /**
   * Возвращает общее количество слайдов
   * @returns {number} Общее количество слайдов
   */
  getTotalSlides() {
    return this.slides.length;
  }

  /**
   * Собирает данные всех полей формы
   * @returns {Object} Объект с данными формы
   */
  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    return data;
  }

  /**
   * Обрабатывает отправку формы
   * Генерирует событие qwiz:submit с данными формы
   * @private
   * @fires QwizSlider#qwiz:submit
   */
  _handleSubmit() {
    const formData = this.getFormData();

    this.form.dispatchEvent(
      new CustomEvent('qwiz:submit', {
        detail: { formData },
      }),
    );

    console.log('Данные формы:', formData);
  }

  /**
   * Сбрасывает форму и возвращает к первому слайду
   * Очищает все поля формы и сбрасывает таймеры
   */
  reset() {
    this.form.reset();

    if (this.autoNextTimeout) {
      clearTimeout(this.autoNextTimeout);
      this.autoNextTimeout = null;
    }

    this.goToSlide(0, true);
  }

  /**
   * Уничтожает экземпляр QwizSlider
   * Удаляет все классы, очищает стили, удаляет обработчики событий
   * Освобождает память
   */
  destroy() {
    if (this.autoNextTimeout) {
      clearTimeout(this.autoNextTimeout);
    }

    this.slides.forEach((slide) => {
      slide.classList.remove('qwiz-slide', 'active');
      slide.style.position = '';
      slide.style.top = '';
      slide.style.left = '';
      slide.style.width = '';
      slide.style.opacity = '';
      slide.style.visibility = '';
      slide.style.transition = '';
    });

    this.form.classList.remove('qwiz-wrapper');
    this.form = null;
    this.slides = null;
  }
}

/**
 * Автоматическая инициализация всех форм с атрибутом data-qwiz при загрузке DOM
 * @listens DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  const qwizForms = document.querySelectorAll('[data-qwiz]');

  qwizForms.forEach((form, index) => {
    const instance = new QwizSlider(form);

    form._qwizInstance = instance;

    const qwizId = form.getAttribute('data-qwiz') || `qwiz_${index}`;
    window[`${qwizId}`] = instance;
  });
});

/**
 * Экспорт класса QwizSlider в глобальную область видимости
 * @global
 */
window.QwizSlider = QwizSlider;
