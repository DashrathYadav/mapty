'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let form = document.querySelector('.form');
let containerWorkouts = document.querySelector('.workouts');
let inputType = document.querySelector('.form__input--type');
let inputDistance = document.querySelector('.form__input--distance');
let inputDuration = document.querySelector('.form__input--duration');
let inputCadence = document.querySelector('.form__input--cadence');
let inputElevation = document.querySelector('.form__input--elevation');

class WorkOut {
  id = Date.now();
  date = new Date();

  constructor(coords, distance, duration) {
    this.coords = coords; /// [lat,lng]
    this.distance = distance;
    this.duration = duration;
  }
}

class Cycling extends WorkOut {
  type = 'cycling';
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.getSpeed();
  }
  getSpeed() {
    this.speed = this.distance / this.duration;
  }
}

class Running extends WorkOut {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.getPace();
  }
  getPace() {
    this.pace = this.duration / this.distance;
  }
}

// const run1 = new Running([19.16073548415627, 72.88621902465822], 3, 5, 170);
// const cycle1 = new Cycling([19.16073548415627, 72.88621902465822], 10, 25, 50);
// console.log(cycle1);
// console.log(run1);

class App {
  #map;
  #eventValue;
  #workout = [];
  constructor() {
    this._getPosition();

    form.addEventListener('submit', e => {
      e.preventDefault();
      // console.log('for is submitted');
      this._newWorkout();

      form.classList.add('hidden');
    });

    inputType.addEventListener('change', e => {
      //    console.log(inputCadence);
      //    console.log(inputCadence.closest('.form__row'));
      inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
      inputElevation
        .closest('.form__row')
        .classList.toggle('form__row--hidden');
    });
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        error => {
          console.log(error, ' ,not able to find co-ordinates');
        }
      );
  }

  _loadMap(position) {
    // console.log(position);
    const { latitude, longitude } = position.coords;
    // console.log(latitude, longitude);
    const arr = [latitude, longitude];
    this.#map = L.map('map').setView(arr, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    //////  handiling touch on map
    this.#map.on('click', event => {
      // console.log('here in on event this key word is', this);
      this.#eventValue = event;

      this._showForm();
    });
  }
  _showForm() {
    form.classList.remove('hidden');
    inputDistance.focus();

    this._toggleElevationField();
  }

  _toggleElevationField() {}
  _newWorkout() {
    let type = inputType.value;
    let distance = +inputDistance.value;
    let duration = +inputDuration.value;
    let workout;

    let option;
    if (type === 'running') {
      let cadence = inputCadence.value;
      option = +cadence;
      inputCadence.value = '';
    } else if (type === 'cycling') {
      let elevation = inputElevation.value;
      option = +elevation;
      inputElevation.value = '';
    }
    inputDistance.value = inputDuration.value = '';
    //  console.log(type, distance, duration, option);
    //  console.log(typeof distance, typeof duration, typeof option);

    const Validate = function (...inputs) {
      return inputs.every(item => {
        return item > 0;
      });
    };
    //  console.log(Validate(distance, duration, option));

    if (!Validate(distance, duration, option)) {
      alert('input parameters are not valid');
      return;
    } else {
      //   console.log('valid submition');
      let { lat, lng } = this.#eventValue.latlng;
      //   console.log(lat, lng);

      if (type === 'running')
        workout = new Running([lat, lng], distance, duration, option);
      else if (type === 'cycling')
        workout = new Cycling([lat, lng], distance, duration, option);

      this._renderMarker(workout);
      this._renderList(workout);

      this.#workout.push(workout);

      type = '';
      distance = '';
      duration = '';
      option = '';
      console.log(this.#workout);
      return;
    }
  }

  _renderMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent('workout')
      .openPopup();
  }

  _renderList(workout) {
    let html = ` <li class="workout workout--${workout.type}" data-id=${
      workout.id
    }>
<h2 class="workout__title">${workout.type} on ${workout.date}</h2>
<div class="workout__details">
  <span class="workout__icon"> ${
    workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
  }</span>
  <span class="workout__value">${workout.distance}</span>
  <span class="workout__unit">km</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⏱</span>
  <span class="workout__value">${workout.duration}</span>
  <span class="workout__unit">min</span>
</div>
<div class="workout__details">
  <span class="workout__icon">⚡️</span>
  <span class="workout__value">${
    workout.type === 'running' ? workout.pace : workout.speed
  }</span>
  <span class="workout__unit">min/km</span>
</div>
<div class="workout__details">
  <span class="workout__icon"> ${
    workout.type === 'running' ? ' 🦶🏼 ' : ' ⛰ '
  }</span>
  <span class="workout__value">>${
    workout.type === 'running' ? '178 ' : '233 '
  }</span>
  <span class="workout__unit">>${
    workout.type === 'running' ? ' spm ' : ' m '
  }</span>
</div>
</li>`;

    form.insertAdjacentHTML('afterend', html);
  }
}

const app = new App();
