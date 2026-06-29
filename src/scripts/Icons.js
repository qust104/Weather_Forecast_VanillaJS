class Icons {
  static weatherIcons = {
    200:'storm',201:'storm',202:'storm',210:'storm',211:'storm',212:'storm',221:'storm',230:'storm',231:'storm',232:'storm',
    300:'rain',301:'rain',302:'rain',310:'rain',311:'rain',312:'rain',313:'rain',314:'rain',321:'rain',
    500:'rain',501:'rain',502:'rain',503:'rain',504:'rain',511:'snow',520:'rain',521:'rain',522:'rain',531:'rain',
    600:'snow',601:'snow',602:'snow',611:'snow',612:'snow',613:'snow',615:'snow',616:'snow',620:'snow',621:'snow',622:'snow',
    701:'fog',711:'fog',721:'fog',731:'fog',741:'fog',751:'fog',761:'fog',762:'fog',771:'fog',781:'fog',
    800:'sunny',801:'partly-cloudy',802:'cloudy',803:'cloudy',804:'cloudy',
  };

  getIcon(id) {
    const iconName = Icons.weatherIcons[id] || 'cloudy';
    return `<img src="assets/icons/weather/${iconName}.svg" alt="weather" class="weather-icon">`;
  }
}

export default Icons;
