import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const refs = {
  inputDate: document.querySelector('input#datetime-picker'),
  btnStart: document.querySelector('button[data-start]'),
  timerDay: document.querySelector('[data-days]'),
  timerHour: document.querySelector('[data-hours]'),
  timerMin: document.querySelector('[data-minutes]'),
  timerSec: document.querySelector('[data-seconds]'),
};
refs.btnStart.disabled = true;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    onInputDate(selectedDates[0]);
  },
};
flatpickr('#datetime-picker', options);
refs.btnStart.setAttribute('disabled', 'disabled');
let timeId = null;
const INTERVAL = 1000;
/** functions */

function onInputDate(selectedDates) {
  if (selectedDates <= Date.now()) {
    Notify.failure('Please choose a date in the future');
  } else {
    refs.btnStart.removeAttribute('disabled', 'true');
    onStartedTimer(selectedDates);
  }
}
function onStartedTimer(selectedDates) {
  let timerValueInMs = Date.parse(selectedDates) - Date.now();
  let objTimerValue = convertMs(timerValueInMs);
  refs.btnStart.addEventListener('click', () => {
    refs.btnStart.setAttribute('disabled', 'true');
    timeId = setInterval(() => {
      if (timerValueInMs <= 0) {
        clearInterval(timeId);
        return;
      }
      objTimerValue = convertMs(timerValueInMs);
      refs.timerDay.textContent = addLeadingZero(objTimerValue.days);
      refs.timerHour.textContent = addLeadingZero(objTimerValue.hours);
      refs.timerMin.textContent = addLeadingZero(objTimerValue.minutes);
      refs.timerSec.textContent = addLeadingZero(objTimerValue.seconds);
      timerValueInMs -= INTERVAL;
    }, INTERVAL);
  });
}
function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
