# Vite + Nunjucks Builder (vite-js-builder)

**Актуальная версия:** 2.0.0 (февраль 2026)

> Быстрый старт для вёрстки сайтов с использованием **Vite**, **Vituum** и **Nunjucks**.  
> Шаблонизатор выбран из-за его схожести с Fenom (используется в MODX Revolution), что позволяет легко переносить готовую вёрстку в CMS.  
> Проект построен на **Vituum** для удобной работы с многостраничными сайтами и компонентами.

---

## 🇷🇺 Описание на русском

## Возможности

- ⚡ Мгновенная разработка — HMR для Nunjucks, SCSS и JavaScript
- 📁 Компонентный подход — переиспользуемые блоки (header, footer, карточки и т.д.)
- 📄 Многостраничность — каждая страница в `src/pages` → отдельный HTML
- 🌐 Глобальные данные — JSON-файлы автоматически доступны в шаблонах
- 🧩 Близко к MODX — структура layouts/components/pages напоминает чанки и шаблоны
- 🎨 SCSS + автопрефиксы
- 🖼 SVG-спрайт — автоматическая сборка всех иконок
- 🔧 Prettier — форматирование кода
- 📦 Продакшн-сборка — минификация, оптимизация ассетов

---

## Установка и запуск

### 1. Клонирование

git clone https://github.com/FrenkiArt/vite-template.git your-project
cd your-project

### 2. Установка зависимостей

npm install

### 3. Запуск сервера разработки

npm run dev

После запуска откроется браузер с главной страницей. Все изменения применяются мгновенно.

### 4. Сборка для продакшена

npm run build

Готовые файлы появятся в `dist/`.

---

## Структура проекта

vite-template/
├── public/  
├── src/
│ ├── assets/  
│ │ ├── css/
│ │ │ └── main.scss
│ │ └── js/
│ │ └── main.js
│ ├── components/  
│ │ ├── header.njk
│ │ ├── footer.njk
│ │ └── sec-nav.njk
│ ├── data/  
│ │ ├── site.json
│ │ └── menu.json
│ ├── icons/  
│ │ ├── geo.svg
│ │ ├── link-arrow.svg
│ │ └── ...
│ ├── layouts/  
│ │ └── base.njk
│ └── pages/  
│ ├── index.njk
│ └── contacts.njk
├── .prettierrc.json
├── package.json
└── vite.config.js

---

## Работа с данными (JSON)

Все файлы из `src/data/` становятся глобальными переменными.

### Пример site.json

{
"siteName": "Мой питомник растений",
"phone": "+7 (123) 456-78-90"
}

### Использование в шаблоне

<header>
  <a href="/" class="logo">{{ site.siteName }}</a>
  <a href="tel:{{ site.phone }}">{{ site.phone }}</a>
</header>

---

## SVG-спрайт

Плагин @spiriit/vite-plugin-svg-spritemap собирает все SVG в `/__spritemap`.

### Использование

<svg class="sprite-icon">
  <use xlink:href="/__spritemap#sprite-geo"></use>
</svg>

### Стилизация

.sprite-icon {
width: 24px;
height: 24px;
fill: currentColor;
stroke: currentColor;
vertical-align: middle;
}

---

## Используемые технологии

- Vite
- Vituum
- Nunjucks
- SCSS
- Prettier
- rollup-plugin-visualizer
- vite-plugin-webfont-dl
- @spiriit/vite-plugin-svg-spritemap

---

## Конфигурация

Основной файл — vite.config.js.

Подключены:

- vituum()
- @vituum/vite-plugin-nunjucks
- @spiriit/vite-plugin-svg-spritemap
- visualizer()
- webfontDownload()

---

## Перенос в MODX

1. npm run build
2. Скопировать dist/ в assets/templates/
3. Заменить переменные:

Nunjucks → MODX  
{{ site.siteName }} → [[++site_name]]  
{% for item in menu.items %} → pdoMenu  
{{ resource.pagetitle }} → [[*pagetitle]]

4. Разбить страницы на шаблоны и чанки.

---

# 🇬🇧 English Description

## Features

- Instant HMR
- Component-based architecture
- Multi-page support
- Global JSON data
- MODX-friendly
- SCSS + autoprefixer
- SVG spritemap
- Prettier
- Production build

---

## Installation

git clone https://github.com/FrenkiArt/vite-template.git your-project
cd your-project
npm install
npm run dev
npm run build

---

## Working with Data (JSON)

Same as in the Russian section.

---

## SVG Spritemap

Same usage as above.

---

## Technologies Used

- Vite
- Vituum
- Nunjucks
- SCSS
- Prettier
- rollup-plugin-visualizer
- vite-plugin-webfont-dl
- @spiriit/vite-plugin-svg-spritemap

---

## Porting to MODX

Same steps as in the Russian section.

---

## 📬 Contact

Telegram: @artywork  
Repository: https://github.com/FrenkiArt/vite-template

Happy coding!
