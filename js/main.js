let overlay = document.createElement('div');
const createOverlay = (content) => {
  overlay.classList.add('overlay');
  document.body.append(overlay);
  overlay.addEventListener('click', (e) => {
    content.classList.remove('active');
    overlay.remove();
  });
};

// nav menu

const hamIcon = document.querySelector('.header__ham-btn');
const navMenu = document.querySelector('.nav');

hamIcon.addEventListener('click', (e) => {
  let lines = [...e.currentTarget.children];
  lines.forEach((line) => {
    line.classList.toggle('active');
  });
  navMenu.classList.toggle('active');
  createOverlay(navMenu);
  overlay.addEventListener('click', (e) => {
    lines.forEach((line) => {
      line.classList.remove('active');
    });
  });
});

// shopping cart open

let shoppingCartIcons = document.querySelectorAll('.cart-btn');
const shoppingCartMenu = document.querySelector('.shopping-cart');

shoppingCartIcons.forEach((cart) => {
  cart.addEventListener('click', (e) => {
    shoppingCartMenu.classList.toggle('active');
    createOverlay(shoppingCartMenu);
  });
});

// search

const searchBtn = document.querySelectorAll('.search-btn');
const searchWindow = document.querySelector('.search');

searchBtn.forEach((search) => {
  search.addEventListener('click', (e) => {
    searchWindow.classList.toggle('active');
    createOverlay(searchWindow);
  });
});

//  image carousel

const leftArrow = document.querySelector('.left');
const rightArrow = document.querySelector('.right');
const carouselSlider = document.querySelector('.hero__slider');
const images = document.querySelectorAll('.hero__slider-picture');

const auto = true;
const intervalTime = 5000;
let slideInterval;

const nextSlide = () => {
  const current = document.querySelector('.current');
  current.classList.remove('current');
  if (current.nextElementSibling) {
    current.nextElementSibling.classList.add('current');
  } else {
    images[0].classList.add('current');
  }
};

const prevSlide = () => {
  const current = document.querySelector('.current');
  current.classList.remove('current');
  if (current.previousElementSibling) {
    current.previousElementSibling.classList.add('current');
  } else {
    images[images.length - 1].classList.add('current');
  }
};

rightArrow.addEventListener('click', () => {
  nextSlide();
  if (auto) {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, intervalTime);
  }
});

leftArrow.addEventListener('click', () => {
  prevSlide();
  if (auto) {
    clearInterval(slideInterval);
    slideInterval = setInterval(prevSlide, intervalTime);
  }
});

if (auto) {
  slideInterval = setInterval(nextSlide, intervalTime);
}

// action countdown

const countdown = () => {
  const countDate = new Date('September 30, 2022 00:00:00').getTime();
  const currentTime = new Date().getTime();
  const gap = countDate - currentTime;

  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const textDay = Math.floor(gap / day);
  const textHour = Math.floor((gap % day) / hour);
  const textMinute = Math.floor((gap % hour) / minute);
  const textSecond = Math.floor((gap % minute) / second);

  document.querySelector('.day').innerText = textDay;
  document.querySelector('.hour').innerText = textHour;
  document.querySelector('.minute').innerText = textMinute;
  document.querySelector('.second').innerText = textSecond;
};

setInterval(countdown, 1000);

// accordion

const accordionHeader = document.querySelectorAll('.accordion__header');

accordionHeader.forEach((headerTab) => {
  headerTab.addEventListener('click', (e) => {
    headerTab.nextElementSibling.classList.toggle('active');
    headerTab.lastElementChild.classList.toggle('active');
  });
});
