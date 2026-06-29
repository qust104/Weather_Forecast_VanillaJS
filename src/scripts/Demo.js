class Demo {
  constructor(render, utils) {
    this.render = render;
    this.utils = utils;
  }

  load(city) {
    const now = Math.floor(Date.now()/1000);
    const demo = {
      name: city || 'Москва',
      dt: now,
      weather: [{ id: 801, description: 'облачно с прояснениями' }],
      main: { temp: 18, feels_like: 16, temp_min: 14, temp_max: 21, humidity: 68, pressure: 1013 },
      wind: { speed: 4.2 },
      visibility: 9000
    };
    this.render.renderCurrent(demo);

    const nextHour = Math.ceil(Date.now() / 3600000) * 3600;
    const nextHourSec = Math.floor(nextHour / 1000);
    const hourlyList = Array.from({length: 24}, (_, i) => ({
      dt: nextHourSec + i * 3600,
      weather: [{ id: [800,801,802,804,500][Math.floor(Math.random()*5)] }],
      main: { temp: 18 + Math.round((Math.random()-0.5)*8), humidity: 50 + Math.round(Math.random() * 40) },
      pop: Math.random() * 0.6
    }));
    this.render.renderHourly(hourlyList);

    const weekDesc = ['ясно','облачно','дождь','переменная облачность','туман'];
    const weekIds   = [800, 804, 501, 801, 701];
    const weeklyList = [];
    for (let d = 0; d < 10; d++) {
      for (let h = 0; h < 8; h++) {
        weeklyList.push({
          dt: now + d*86400 + h*10800,
          weather: [{ id: weekIds[d % 5], description: weekDesc[d % 5] }],
          main: { temp: 12 + Math.round(Math.random()*12) }
        });
      }
    }
    this.render.renderWeekly(weeklyList);
    this.utils.hideLoader();
  }
}

export default Demo;
