import './css/styles.css';
import Notiflix from 'notiflix';
import countriesTpl from './templates/countries_template.hbs';
import countriesInfoTpl from './templates/countries_info_template.hbs';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';

const searchInput = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countriesInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
searchInput.focus();

Notiflix.Notify.init({
  position: 'center-top',
  width: '400px',
  fontSize: '18px',
});

let name = '';

function onSearch(e) {
  name = e.target.value.trim();

  clearInput();
  setCountries(name);
  function setCountries(name) {
    fetchCountries(name)
      .then(data => {
        const amount = data.length;
        console.log(amount);
        if (amount > 10) {
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
          return;
        }
        if (amount >= 2 && amount <= 10) {
          renderCountriesMarkup(data);
        } else {
          renderCountriesInfoMarkup(data);
        }
      })
      .catch(onFetchError);
  }
}

function onFetchError(error) {
  if (name !== '') {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  }
}

function renderCountriesMarkup(data) {
  countriesList.insertAdjacentHTML('beforeend', countriesTpl(data));
}

function renderCountriesInfoMarkup(data) {
  countriesInfo.insertAdjacentHTML('beforeend', countriesInfoTpl(data));
}

function clearInput() {
  countriesList.innerHTML = '';
  countriesInfo.innerHTML = '';
}
