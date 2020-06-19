'use strict'

new WOW().init();

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const logInButton = document.querySelector("#log-in-btn");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const passInput = document.querySelector("#password");
const userName = document.querySelector("#user");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const cards = document.querySelector('.cards');
const menu = document.querySelector('.menu');
const logo = document.querySelectorAll('.logo');

let login = localStorage.getItem('delivery');

const getData = async function(url) {
  const response = await fetch(url);
  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`)
  }
  return await response.json();  
}


function toggleModal() {
  modal.classList.toggle('active')
}

function toggleModalAuth() {
  modalAuth.classList.toggle('active');
}

function authorized() {

  function logOut() {
    login = '';
    localStorage.removeItem('delivery');
    logInButton.style.display = '';
    userName.style.display = 'none';
    buttonOut.style.display = 'none';
    userName.classList.remove('active');

    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }

  console.log('авторизован');
  userName.classList.add('active');
  userName.textContent = login;

  logInButton.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
  console.log('не авторизован');

  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;
    localStorage.setItem('delivery', login);

    toggleModalAuth();
    logInButton.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    logInForm.removeEventListener('submit', logIn);
    logInForm.reset();
    checkAuth();
  }

  logInButton.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}



function createCardRestaurant(restaurant) {
  const { image, kitchen, name, price, products, stars, time_of_delivery: timeOfDelivery } = restaurant;
  
  const card = `
    <a class="card card-restaurant animate__animated wow animate__fadeInUp" data-products="${products}">
      <img src="${image}" alt="food-card" class="card-image">
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
          <div class="card-rating"><img src="/img/rating.svg" alt="rating-card" class="rating-star">${stars}</div>
          <div class="card-price">От ${price} ₽</div>
          <div class="card-category">${kitchen}</div>
        </div>
      </div>
    </a>  
  `;

  cardsRestaurants.insertAdjacentHTML('afterbegin', card);

}


function createCardGood({ description, image, name, price }) {

  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('afterbegin', `
    <img src="${image}" alt="food-card" class="card-image">
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info card-info-food">
        <span class="ingredients">${description}</span>
      </div>
    </div>
    <div class="card-footer">
      <button class="button button-primary">
        <span class="button-text">В корзину</span>
        <img src="./img/card-basket.svg" alt="card-basket" class="button-card-icon">
      </button>
      <strong class="card-price-bold">${price} ₽</strong>
    </div>
  `)

  menu.insertAdjacentElement('beforeend', card);

}

function openGoods(event) {
  const target = event.target;  
  const restaurant = target.closest('.card-restaurant');

  console.log(restaurant);

  if (restaurant) {
    console.log(`./db/${restaurant.dataset.products}`);
    
    menu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
    getData(`./db/${restaurant.dataset.products}`).then(function(data){
      data.forEach(createCardGood);  
    })
  }
}


function init() {
  getData('./db/partners.json').then(function(data){
    data.forEach(createCardRestaurant);
  })
  
  cartButton.addEventListener('click', toggleModal);
  
  close.addEventListener('click', toggleModal);
  
  cardsRestaurants.addEventListener('click', openGoods);
  logo.forEach(function (item) {
    item.addEventListener('click', function () {
      containerPromo.classList.remove('hide')
      restaurants.classList.remove('hide')
      menu.classList.add('hide')
    })
  })
  
  checkAuth();
}

init()