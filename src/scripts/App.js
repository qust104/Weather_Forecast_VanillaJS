import { CONFIG } from './Api.js';
import { debounce } from './Utils.js';

class App {
  stateClasses = {
    isHidden: 'is-hidden',
  };

  selectors = {
    searchBtn: '[data-js-search-btn]',
    cityInput: '[data-js-city-input]',
    hourlyScroll: '[data-js-hourly-scroll]',
    geoBtn: '[data-js-geo-btn]',
    suggestions: '[data-js-suggestions]',
    favBtn: '[data-js-fav-btn]',
    quickCities: '[data-js-quick-cities]',
  };

  constructor(api, utils, render, demo) {
    this.api = api;
    this.utils = utils;
    this.render = render;
    this.demo = demo;

    this.searchBtnElement = document.querySelector(this.selectors.searchBtn);
    this.cityInputElement = document.querySelector(this.selectors.cityInput);
    this.hourlyScrollElement = document.querySelector(this.selectors.hourlyScroll);
    this.geoBtnElement = document.querySelector(this.selectors.geoBtn);
    this.suggestionsElement = document.querySelector(this.selectors.suggestions);
    this.favBtnElement = document.querySelector(this.selectors.favBtn);
    this.quickCitiesElement = document.querySelector(this.selectors.quickCities);

    this._lastQuery = '';
    this._suggestionIndex = -1;
    this._debouncedFetch = debounce((query) => this.fetchSuggestions(query), 300);

    this.bindEvents();
    this.init();
  }

  init() {
    const saved = localStorage.getItem('weatherglass_city');
    const city = saved || CONFIG.DEFAULT_CITY;
    this.cityInputElement.value = city;
    this.search(city);
  }

  getFavorites() {
    try { return JSON.parse(localStorage.getItem('weatherglass_favorites')) || []; }
    catch { return []; }
  }

  setFavorites(favorites) {
    localStorage.setItem('weatherglass_favorites', JSON.stringify(favorites));
  }

  renderFavorites() {
    const favorites = this.getFavorites();
    this.quickCitiesElement.innerHTML = '';
    if (!favorites.length) return;

    favorites.forEach(city => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.city = city;
      btn.setAttribute('data-js-quick-city', '');

      btn.textContent = city;
      btn.addEventListener('click', () => this.search(city));
      this.quickCitiesElement.appendChild(btn);
    });
  }

  updateFavBtn() {
    const city = this.cityInputElement.value.trim();
    const favorites = this.getFavorites();
    if (favorites.includes(city)) {
      this.favBtnElement.classList.add('is-fav');
      this.favBtnElement.setAttribute('aria-label', 'Удалить из избранного');
      this.favBtnElement.setAttribute('title', 'Удалить из избранного');
    } else {
      this.favBtnElement.classList.remove('is-fav');
      this.favBtnElement.setAttribute('aria-label', 'Добавить в избранное');
      this.favBtnElement.setAttribute('title', 'Добавить в избранное');
    }
  }

  onFavClick = () => {
    const city = this.cityInputElement.value.trim();
    if (!city) return;
    const favorites = this.getFavorites();
    const idx = favorites.indexOf(city);
    if (idx >= 0) {
      favorites.splice(idx, 1);
    } else {
      favorites.push(city);
    }
    this.setFavorites(favorites);
    this.renderFavorites();
    this.updateFavBtn();
  };

  fetchSuggestions = async (query) => {
    if (query.length < 2) {
      this.closeSuggestions();
      return;
    }
    this._lastQuery = query;
    const cities = await this.api.fetchCities(query);
    if (this._lastQuery !== query) return;
    if (!cities || !cities.length) {
      this.closeSuggestions();
      return;
    }
    this.renderSuggestions(cities);
  };

  renderSuggestions(cities) {
    this.suggestionsElement.innerHTML = '';
    cities.forEach((city) => {
      const displayName = city.local_names?.ru || city.name;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'suggestion-item';
      btn.setAttribute('role', 'option');
      btn.dataset.name = displayName;
      btn.textContent = `${displayName}, ${city.country}`;
      btn.addEventListener('click', () => {
        this.search(displayName);
        this.closeSuggestions();
      });
      this.suggestionsElement.appendChild(btn);
    });
    this._suggestionIndex = -1;
    this.suggestionsElement.classList.remove(this.stateClasses.isHidden);
  }

  closeSuggestions() {
    this.suggestionsElement.classList.add(this.stateClasses.isHidden);
    this.suggestionsElement.innerHTML = '';
    this._suggestionIndex = -1;
  }

  onSearchBtnClick = () => {
    this.search();
  };

  onCityInput = () => {
    const query = this.cityInputElement.value.trim();
    if (query.length < 2) {
      this.closeSuggestions();
      return;
    }
    this._debouncedFetch(query);
  };

  onCityInputKeydown = (e) => {
    const open = !this.suggestionsElement.classList.contains(this.stateClasses.isHidden);
    const items = this.suggestionsElement.querySelectorAll('.suggestion-item');

    if (e.key === 'ArrowDown' && open && items.length) {
      e.preventDefault();
      this._suggestionIndex = Math.min(this._suggestionIndex + 1, items.length - 1);
      this._highlightSuggestion(items);
    } else if (e.key === 'ArrowUp' && open && items.length) {
      e.preventDefault();
      this._suggestionIndex = Math.max(this._suggestionIndex - 1, 0);
      this._highlightSuggestion(items);
    } else if (e.key === 'Enter' && open && this._suggestionIndex >= 0) {
      e.preventDefault();
      const selected = items[this._suggestionIndex];
      if (selected) {
        this.search(selected.dataset.name);
        this.closeSuggestions();
      }
    } else if (e.key === 'Enter') {
      this.search();
    } else if (e.key === 'Escape') {
      this.closeSuggestions();
    }
  };

  onCityInputBlur = () => {
    setTimeout(() => this.closeSuggestions(), 200);
  };

  onGeoBtnClick = async () => {
    if (!navigator.geolocation || typeof navigator.geolocation.getCurrentPosition !== 'function') {
      this.utils.showError('Геолокация не поддерживается браузером');
      return;
    }

    try {
      const perm = await navigator.permissions.query({ name: 'geolocation' });
      if (perm.state === 'denied') {
        this.utils.showError('Геолокация заблокирована. Разрешите в настройках браузера', 'warning');
        return;
      }
    } catch {}

    this.utils.showLoader();

    try {
      const pos = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 5000,
          enableHighAccuracy: false,
        });
      });

      const { latitude: lat, longitude: lon } = pos.coords;
      const [current, forecast] = await Promise.all([
        this.api.fetchWeatherByCoords(lat, lon),
        this.api.fetchForecastByCoords(lat, lon)
      ]);
      this.cityInputElement.value = current.name;
      this.render.renderCurrent(current);
      this.render.renderHourly(forecast.list);
      this.render.renderWeekly(forecast.list);
      localStorage.setItem('weatherglass_city', current.name);
      this.renderFavorites();
      this.updateFavBtn();
      this.cityInputElement.focus();
    } catch(e) {
      if (e.code === 1) {
        this.utils.showError('Геолокация заблокирована. Разрешите в настройках браузера', 'warning');
      } else {
        this.utils.showError('Геолокация недоступна на устройстве', 'warning');
      }
    } finally {
      this.utils.hideLoader();
    }
  };

  _highlightSuggestion(items) {
    items.forEach((item, i) => {
      item.classList.toggle('active', i === this._suggestionIndex);
    });
  }

  onHourlyScrollKeydown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.hourlyScrollElement.scrollBy({ left: 200, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.hourlyScrollElement.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  bindEvents() {
    this.searchBtnElement.addEventListener('click', this.onSearchBtnClick);
    this.cityInputElement.addEventListener('input', this.onCityInput);
    this.cityInputElement.addEventListener('keydown', this.onCityInputKeydown);
    this.cityInputElement.addEventListener('blur', this.onCityInputBlur);
    this.hourlyScrollElement.addEventListener('keydown', this.onHourlyScrollKeydown);
    this.geoBtnElement.addEventListener('click', this.onGeoBtnClick);
    this.favBtnElement.addEventListener('click', this.onFavClick);
  }

  async search(city) {
    this.closeSuggestions();
    if (!city) { city = this.cityInputElement.value.trim(); }
    if (!city) return;
    this.cityInputElement.value = city;

    this.utils.showLoader();
    try {
      const [current, forecast] = await Promise.all([
        this.api.fetchWeather(city),
        this.api.fetchForecast(city)
      ]);
      this.render.renderCurrent(current);
      this.render.renderHourly(forecast.list);
      this.render.renderWeekly(forecast.list);
      localStorage.setItem('weatherglass_city', this.cityInputElement.value);
      this.renderFavorites();
      this.updateFavBtn();
      this.cityInputElement.focus();
    } catch(e) {
      const type = e.message === 'Город не найден' ? 'warning' : 'error';
      this.utils.showError(e.message, type);
    } finally {
      this.utils.hideLoader();
    }
  }
}

export default App;
