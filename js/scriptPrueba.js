/* eslint-disable linebreak-style */
let minutes = 0;
let seconds = 50;
let miliseconds = 0;

const update = (elemId, value) => {
  const elem = document.getElementById(elemId);
  elem.textContent = `${value}`.length === 1 ? `0${value}` : value;
};

const startCounter = () => {
  setInterval(() => {
    if (miliseconds === 0) {
      seconds += 1;
      seconds = seconds === 60 ? 0 : seconds;
      update('seconds', seconds);
      if (seconds === 0) {
        minutes += 1;
        minutes = minutes === 60 ? 0 : minutes;
        update('minutes', minutes);
      }
    }
    miliseconds += 1;
    miliseconds = miliseconds > 99 ? 0 : miliseconds;
    update('miliseconds', miliseconds);
  }, 10);
};

const addItems = () => {
  const mainDiv = document.getElementById('load-bar');
  for (let i = 0; i < 20; i += 1) {
    const elem = document.createElement('div');
    elem.id = `div-${i}`;
    mainDiv.appendChild(elem);
  }

  let actualDiv = 0;
  const interval = setInterval(() => {
    if (actualDiv === 19) clearInterval(interval);
    document.getElementById(`div-${actualDiv}`).style.backgroundColor = '#F7C9F3';
    actualDiv += 1;
  }, 100);
};
