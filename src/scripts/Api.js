export const CONFIG = {
  API_KEY: '8247544b8b51f10a078ce330afbb4dc4',
  BASE: 'https://api.openweathermap.org/data/2.5',
  DEFAULT_CITY: 'Москва',
  units: 'metric',
};

export default class Api {
  async _request(url) {
    let res;
    try {
      res = await fetch(url);
    } catch {
      throw new Error('Нет соединения с интернетом');
    }
    if (!res.ok) {
      if (res.status === 404) throw new Error('Город не найден');
      throw new Error('Сервер временно недоступен');
    }
    return res.json();
  }

  async fetchWeather(city) {
    const url = `${CONFIG.BASE}/weather?q=${encodeURIComponent(city)}&appid=${CONFIG.API_KEY}&units=${CONFIG.units}&lang=ru`;
    return this._request(url);
  }

  async fetchForecast(city) {
    const url = `${CONFIG.BASE}/forecast?q=${encodeURIComponent(city)}&appid=${CONFIG.API_KEY}&units=${CONFIG.units}&lang=ru&cnt=48`;
    return this._request(url);
  }

  async fetchWeatherByCoords(lat, lon) {
    const url = `${CONFIG.BASE}/weather?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${CONFIG.units}&lang=ru`;
    return this._request(url);
  }

  async fetchForecastByCoords(lat, lon) {
    const url = `${CONFIG.BASE}/forecast?lat=${lat}&lon=${lon}&appid=${CONFIG.API_KEY}&units=${CONFIG.units}&lang=ru&cnt=48`;
    return this._request(url);
  }

  async fetchCities(query) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${CONFIG.API_KEY}`;
    const r = await fetch(url);
    if (!r.ok) return [];
    return r.json();
  }
}
