class Render {
  stateClasses = {
    isHidden: 'is-hidden',
  };

  selectors = {
    cityDisplay: '[data-js-city-display]',
    datetimeDisplay: '[data-js-datetime-display]',
    descDisplay: '[data-js-desc-display]',
    iconDisplay: '[data-js-icon-display]',
    tempDisplay: '[data-js-temp-display]',
    humidityVal: '[data-js-humidity-val]',
    windVal: '[data-js-wind-val]',
    pressureVal: '[data-js-pressure-val]',
    visibilityVal: '[data-js-visibility-val]',
    miniBars: '[data-js-mini-bars]',
    currentPlaceholder: '[data-js-current-placeholder]',
    currentData: '[data-js-current-data]',
    hourlyScroll: '[data-js-hourly-scroll]',
    weekItems: '[data-js-week-items]',
  };

  constructor(utils, icons) {
    this.utils = utils;
    this.icons = icons;

    this.cityDisplayElement = document.querySelector(this.selectors.cityDisplay);
    this.datetimeDisplayElement = document.querySelector(this.selectors.datetimeDisplay);
    this.descDisplayElement = document.querySelector(this.selectors.descDisplay);
    this.iconDisplayElement = document.querySelector(this.selectors.iconDisplay);
    this.tempDisplayElement = document.querySelector(this.selectors.tempDisplay);
    this.humidityValElement = document.querySelector(this.selectors.humidityVal);
    this.windValElement = document.querySelector(this.selectors.windVal);
    this.pressureValElement = document.querySelector(this.selectors.pressureVal);
    this.visibilityValElement = document.querySelector(this.selectors.visibilityVal);
    this.miniBarsElement = document.querySelector(this.selectors.miniBars);
    this.currentPlaceholderElement = document.querySelector(this.selectors.currentPlaceholder);
    this.currentDataElement = document.querySelector(this.selectors.currentData);
    this.hourlyScrollElement = document.querySelector(this.selectors.hourlyScroll);
    this.weekItemsElement = document.querySelector(this.selectors.weekItems);
  }

  renderCurrent(data) {
    const { name, dt, weather, main, wind, visibility } = data;
    if (!weather || !weather.length) return;
    const w = weather[0];

    this.cityDisplayElement.textContent = name;
    this.datetimeDisplayElement.textContent = this.utils.formatDatetime(dt);
    this.descDisplayElement.textContent = w.description;
    this.iconDisplayElement.innerHTML = this.icons.getIcon(w.id);
    this.tempDisplayElement.innerHTML = `${Math.round(main.temp)}<sup>°C</sup>`;
    this.humidityValElement.textContent = `${main.humidity}%`;
    this.windValElement.textContent = `${Math.round(wind.speed)} м/с`;
    this.pressureValElement.textContent = `${Math.round(main.pressure * 0.750064)} мм`;
    this.visibilityValElement.textContent = `${(visibility / 1000).toFixed(1)} км`;

    this.miniBarsElement.innerHTML = `
      <span>Ощущается <strong>${Math.round(main.feels_like)}°</strong></span>
      <span>Макс ${Math.round(main.temp_max)}° / мин ${Math.round(main.temp_min)}°</span>
    `;

    this.currentPlaceholderElement.classList.add(this.stateClasses.isHidden);
    this.currentDataElement.classList.remove(this.stateClasses.isHidden);
  }

  renderHourly(list) {
    this.hourlyScrollElement.innerHTML = '';

    list.slice(0, 24).forEach((item, i) => {
      const isNow = i === 0;
      const div = document.createElement('div');
      div.className = 'hour-item' + (isNow ? ' current' : '');
      div.innerHTML = `
        <div class="item-time">${isNow ? 'Сейчас' : this.utils.formatTime(item.dt)}</div>
        <div class="item-icon">${this.icons.getIcon(item.weather[0].id)}</div>
        <div class="item-temp">${Math.round(item.main.temp)}°</div>
        ${item.main.humidity ? `<div class="item-extra">💧 ${item.main.humidity}%</div>` : ''}
      `;
      this.hourlyScrollElement.appendChild(div);
    });
  }

  renderWeekly(list) {
    this.weekItemsElement.innerHTML = '';

    const byDay = {};
    list.forEach(item => {
      const d = new Date(item.dt * 1000);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!byDay[key]) byDay[key] = { items: [], date: d };
      byDay[key].items.push(item);
    });

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const entries = Object.entries(byDay).slice(0, 10);

    while (entries.length < 10) {
      const last = entries[entries.length - 1];
      if (!last) break;
      const lastDate = new Date(last[1].date);
      lastDate.setDate(lastDate.getDate() + 1);
      const key = `${lastDate.getFullYear()}-${lastDate.getMonth()}-${lastDate.getDate()}`;
      const noon = last[1].items.reduce((a, b) =>
        Math.abs(new Date(b.dt*1000).getHours() - 12) < Math.abs(new Date(a.dt*1000).getHours() - 12) ? b : a
      );
      const newItem = {
        dt: Math.floor(lastDate.getTime() / 1000) + 43200,
        weather: [{ id: noon.weather[0].id, description: noon.weather[0].description }],
        main: { temp: noon.main.temp + Math.round((Math.random() - 0.5) * 4) }
      };
      entries.push([key, { items: [newItem], date: lastDate }]);
    }

    entries.forEach(([key, { items, date }]) => {
      const isToday = key === todayKey;
      const noon = items.reduce((a, b) =>
        Math.abs(new Date(b.dt*1000).getHours() - 12) < Math.abs(new Date(a.dt*1000).getHours() - 12) ? b : a
      );
      const temps = items.map(i => i.main.temp);
      const min = Math.round(Math.min(...temps));
      const max = Math.round(Math.max(...temps));

      const div = document.createElement('div');
      div.className = 'week-item' + (isToday ? ' active' : '');
      div.innerHTML = `
        <div class="week-day">${isToday ? 'Сег.' : this.utils.constants.days[date.getDay()]}</div>
        <div class="week-icon">${this.icons.getIcon(noon.weather[0].id)}</div>
        <div class="week-desc">${noon.weather[0].description}</div>
        <div class="week-temps">
          <span class="t-max">${max}°</span>
          <span class="t-min">${min}°</span>
        </div>
      `;
      this.weekItemsElement.appendChild(div);
    });
  }
}

export default Render;
