import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetch-countries';

const DEBOUNCE_DELAY = 300;

const searchInputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

searchInputEl.addEventListener(
  'input',
  debounce(onCountryInput, DEBOUNCE_DELAY)
);

function onCountryInput() {
  const name = searchInputEl.value.trim();
  if (name === '') {
    return zeroString();
  }

  fetchCountries(name)
    .then(countries => {
      zeroString();
      if (countries.length === 1) {
        countryListEl.insertAdjacentHTML(
          'beforeend',
          renderMarkupCountryList(countries)
        );
        countryInfoEl.insertAdjacentHTML(
          'beforeend',
          renderMarkupCountryInfo(countries)
        );
      } else if (countries.length >= 10) {
        alertManyLetters();
      } else {
        countryListEl.insertAdjacentHTML(
          'beforeend',
          renderMarkupCountryList(countries)
        );
      }
    })
    .catch(alertFewLetters);
}

function renderMarkupCountryList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>`;
    })
    .join('');
  return markup;
}

function renderMarkupCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `<ul class="country-info__list">
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(
              languages
            ).join(', ')}</p></li>
        </ul>`;
    })
    .join('');
  return markup;
}
function zeroString() {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';
}

function alertFewLetters() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function alertManyLetters() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}
