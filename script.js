'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    position => {
      console.log(position);
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude);
      const arr = [latitude, longitude];
      const map = L.map('map').setView(arr, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(arr)
        .addTo(map)
        .bindPopup('here is the mark where you land.')
        .openPopup();

      map.on('click', event => {
        console.log(event);
        const { lat, lng } = event.latlng;
        console.log(lat, lng);
        L.marker([lat, lng])
          .addTo(map)
          .bindPopup('here is the mark where you land.')
          .openPopup();
      });
    },
    error => {
      log(error);
    }
  );
