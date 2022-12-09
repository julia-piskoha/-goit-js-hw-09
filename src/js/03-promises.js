import { Notify } from 'notiflix';

const refs = {
  form: document.querySelector('.form'),
};

let timeId = null;

refs.form.addEventListener('submit', onFormSubmit);

/** functions */

function onFormSubmit(e) {
  e.preventDefault();
  clearTimeout(timeId);

  const { delay, step, amount } = e.target.elements;
  let stepValue = Number(delay.value);

  for (let i = 1; i <= amount.value; i += 1) {
    createPromise(i, stepValue)
      .then(({ position, delay }) => {
        Notify.success(`Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`Rejected promise ${position} in ${delay}ms`);
      });
    stepValue += Number(step.value);
  }

  e.currentTarget.reset();
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    timeId = setTimeout(() => {
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
