class Utils {
  stateClasses = {
    isHidden: 'hidden',
    isVisible: 'visible',
  };

  selectors = {
    loader: '[data-js-loader]',
    loaderCountdown: '[data-js-loader-countdown]',
    loaderDots: '[data-js-loader-dots]',
    errorToast: '[data-js-error-toast]',
    errorMsg: '[data-js-error-msg]',
  };

  constants = {
    days: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    months: ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'],
  };

  constructor() {
    this.loaderElement = document.querySelector(this.selectors.loader);
    this.loaderCountdownElement = document.querySelector(this.selectors.loaderCountdown);
    this.loaderDotsElement = document.querySelector(this.selectors.loaderDots);
    this.errorToastElement = document.querySelector(this.selectors.errorToast);
    this.errorMsgElement = document.querySelector(this.selectors.errorMsg);
    this.errorTimer = null;
    this.countdownTimer = null;
    this.dotsTimer = null;
    this.previousFocus = null;
    this.bindEvents();
  }

  formatTime(dt) {
    const d = new Date(dt * 1000);
    return `${d.getHours()}:00`;
  }

  formatDatetime(dt) {
    const d = new Date(dt * 1000);
    const h = String(d.getHours()).padStart(2,'0');
    const m = String(d.getMinutes()).padStart(2,'0');
    return `${this.constants.days[d.getDay()]}, ${d.getDate()} ${this.constants.months[d.getMonth()]} • ${h}:${m}`;
  }

  showLoader() {
    this.loaderElement.classList.remove(this.stateClasses.isHidden);
    this.startCountdown();
    this.animateDots();
  }

  hideLoader() {
    this.loaderElement.classList.add(this.stateClasses.isHidden);
    this.stopCountdown();
    this.stopDots();
  }

  startCountdown() {
    if (!this.loaderCountdownElement) return;
    let seconds = 0;
    this.loaderCountdownElement.textContent = `${seconds}s`;

    this.countdownTimer = setInterval(() => {
      seconds++;
      this.loaderCountdownElement.textContent = `${seconds}s`;
    }, 1000);
  }

  stopCountdown() {
    clearInterval(this.countdownTimer);
    if (!this.loaderCountdownElement) return;
    this.loaderCountdownElement.textContent = '';
  }

  animateDots() {
    if (!this.loaderDotsElement) return;
    const states = ['', '.', '..', '...'];
    let index = 0;

    this.dotsTimer = setInterval(() => {
      index = (index + 1) % states.length;
      this.loaderDotsElement.textContent = states[index];
    }, 400);
  }

  stopDots() {
    clearInterval(this.dotsTimer);
    if (!this.loaderDotsElement) return;
    this.loaderDotsElement.textContent = '...';
  }

  showError(msg, type = 'error') {
    this.previousFocus = document.activeElement;
    this.errorMsgElement.textContent = msg;
    this.errorToastElement.classList.remove('toast-warning', 'toast-error');
    if (type !== 'error') {
      this.errorToastElement.classList.add(`toast-${type}`);
    }
    this.errorToastElement.classList.add(this.stateClasses.isVisible);
    this.errorToastElement.focus();
    clearTimeout(this.errorTimer);
    this.errorTimer = setTimeout(() => this.dismissError(), 3500);
  }

  dismissError() {
    this.errorToastElement.classList.remove(this.stateClasses.isVisible);
    clearTimeout(this.errorTimer);
    this.errorTimer = null;
    if (this.previousFocus && this.previousFocus.focus) {
      this.previousFocus.focus();
    }
    this.previousFocus = null;
  }

  onErrorKeydown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.dismissError();
    }
  };

  bindEvents() {
    this.errorToastElement.addEventListener('keydown', this.onErrorKeydown);
  }
}

export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default Utils;
