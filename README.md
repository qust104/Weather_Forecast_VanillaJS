<div align="center">

# ☁️ WeatherGlass
### Прогноз погоды с стеклянной эстетикой

Современный одностраничный прогноз погоды с дизайном в стиле glassmorphism.  
Классовая архитектура на **Vanilla JavaScript (ES Modules)** с **REST API** и доступностью (a11y).

<p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/OpenWeatherMap-eb6e4b?style=flat&logo=openweathermap&logoColor=white" alt="OpenWeatherMap">
</p>

[🔗 **Live Demo**](https://qust104.github.io/Weather_Forecast_VanillaJS/) · [🛠 Технологии](#-технологии) · [✨ Возможности](#-ключевые-возможности)

</div>

---

## 🛠 Технологии

| Категория | Стек                                   |
|-----------|----------------------------------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+, ES Modules) |
| **API** | OpenWeatherMap (Current, Forecast, Geocoding) |
| **Нормализация** | modern-normalize |
| **Шрифты** | Manrope, DM Serif Display (Google Fonts) |
| **Архитектура** | ООП (классы), Component-based, ES Modules |

---

## ✨ Ключевые возможности

- 🌤 **Текущая погода** — температура, влажность, ветер, давление, видимость, ощущается как
- 📅 **Прогноз на 24 часа** — почасовой скролл с клавиатурной навигацией (Arrow Left/Right)
- 📆 **Прогноз на 10 дней** — группировка по дням, минимальная/максимальная температура
- 🔍 **Автокомплит городов** — debounce 300ms, race condition protection, клавиатурная навигация
- 📍 **Геолокация** — определение через WiFi/вышки, проверка разрешений перед запросом
- ⭐ **Избранное** — сохранение городов в localStorage, динамические кнопки
- 🌡 **Переключатель единиц** — °C/°F, м/с ↔ миль/ч, мм ↔ in, км ↔ мили
- ♿ **Accessibility** — ARIA landmarks, skip-link, `role`-атрибуты, `:focus-visible`, keyboard navigation
- 🎨 **Glassmorphism** — тёмная тема с акцентным цветом `#00d4aa`, анимированный фон (sky-drift)

---

## 💻 JavaScript Архитектура

### Модульная классовая структура

```
src/scripts/
├── Api.js       # CONFIG + HTTP запросы к OpenWeatherMap
├── App.js       # Оркестратор: поиск, гео, автокомплит, избранное, единицы
├── Render.js    # Рендер DOM: текущая погода, почасовой, недельный
├── Utils.js     # Утилиты: форматирование, loader, toast, debounce
├── Icons.js     # 52 SVG-иконки погоды (коды OpenWeatherMap)
├── Demo.js      # Генератор демо-данных (запасной вариант)
└── main.js      # Entry point
```

### API-слой

```javascript
// Api.js — единый метод для всех запросов
async _request(url) {
    let res;
    try { res = await fetch(url); }
    catch { throw new Error('Нет соединения с интернетом'); }
    if (!res.ok) {
        if (res.status === 404) throw new Error('Город не найден');
        throw new Error('Сервер временно недоступен');
    }
    return res.json();
}
```

### Распределение ответственности

| Класс | Обязанности |
|---|---|
| **Api** | HTTP-запросы, нормализация ошибок |
| **App** | Логика приложения, события, состояние |
| **Render** | Построение DOM, форматирование данных |
| **Utils** | Вспомогательные функции, UI (loader/toast) |
| **Icons** | Статическое маппинг кодов в SVG |
| **Demo** | Тестовые данные |

---

## 🎨 CSS

### Организация стилей

```
src/styles/
├── index.css              # Entry point (импорты)
├── base/
│   ├── variables.css      # CSS Custom Properties
│   └── globals.css        # Сброс, базовые стили, .skip-link
└── components/
    ├── search.css         # Поиск, автокомплит, быстрые города, units-btn
    ├── current.css        # Карточка текущей погоды
    ├── toast.css          # Уведомления (error/warning)
    ├── loader.css         # Full-page loader с обратным отсчётом
    └── responsive.css     # Адаптив и focus-visible
```

**Особенности:**
- ✅ CSS Custom Properties для единой дизайн-системы
- ✅ `@import` через index.css (без inline-стилей)
- ✅ Glassmorphism: `backdrop-filter: blur()`, полупрозрачные фоны
- ✅ Анимированный фон `sky-drift` (3 radial gradients)
- ✅ `prefers-reduced-motion` для accessibility
- ✅ `::before` для country badge на быстрых городах

---

## 🚀 Установка

```bash
# Клонировать репозиторий
git clone https://github.com/qust104/Weather_Forecast_VanillaJS.git
cd Weather_Forecast_VanillaJS

# Установить зависимости
npm install
```

> Откройте `src/index.html` через локальный сервер (Live Server, http-server) или откройте напрямую в браузере.

---

## 🏗 Структура проекта

```
Weather_Forecast_VanillaJS/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages CI/CD
├── node_modules/
├── src/
│   ├── index.html               # HTML-структура с data-js-* атрибутами
│   ├── scripts/
│   │   ├── Api.js               # CONFIG + HTTP-запросы
│   │   ├── App.js               # Оркестратор
│   │   ├── Render.js            # DOM-рендеринг
│   │   ├── Utils.js             # Утилиты
│   │   ├── Icons.js             # Иконки погоды
│   │   ├── Demo.js              # Демо-данные
│   │   └── main.js              # Entry point
│   └── styles/
│       ├── index.css
│       ├── base/
│       │   ├── variables.css
│       │   └── globals.css
│       └── components/
│           ├── search.css
│           ├── current.css
│           ├── toast.css
│           ├── loader.css
│           └── responsive.css
├── package.json
└── README.md
```

---

## 💎 Качество кода

- ✅ Чистая архитектура на Vanilla JavaScript
- ✅ ES Modules (`type="module"`)
- ✅ ООП с единым паттерном классов (`selectors`, `stateClasses`, `bindEvents`)
- ✅ Все селекторы через `data-js-*` (не пересекаются со стилями)
- ✅ ARIA landmarks + keyboard navigation
- ✅ Разделение ошибок: red toast (network) / amber toast (user-recoverable)
- ✅ LocalStorage для кэширования города, единиц и избранного
- ✅ CSS Custom Properties — вся дизайн-система в переменных

---

## 🌐 Browser Support

**Desktop:** Chrome, Firefox, Safari, Edge (последние 2 версии)  
**Минимальная ширина:** 960px (desktop-first)

---

## 👤 Автор

<div align="center">

🐙 GitHub: [@qust104](https://github.com/qust104)  
📧 Email: az1023415@gmail.com  
💬 Telegram: [@Ninekidoru](https://t.me/Ninekidoru)

</div>
