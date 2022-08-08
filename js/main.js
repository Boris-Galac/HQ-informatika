//////////  IMAGE CAROUSEL

const leftArrow = document.querySelector('.hero__left');
const rightArrow = document.querySelector('.hero__right');
if (rightArrow) {
  rightArrow.addEventListener('click', () => {
    nextSlide();
    if (auto) {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, intervalTime);
    }
  });
}
if (leftArrow) {
  leftArrow.addEventListener('click', () => {
    prevSlide();
    if (auto) {
      clearInterval(slideInterval);
      slideInterval = setInterval(prevSlide, intervalTime);
    }
  });
}
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

if (auto) {
  slideInterval = setInterval(nextSlide, intervalTime);
}

////////// COUNTDOWN

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

////////// ACCORDION

const accordionHeader = document.querySelectorAll('.accordion__header');

accordionHeader.forEach((headerTab) => {
  headerTab.addEventListener('click', (e) => {
    headerTab.nextElementSibling.classList.toggle('active');
    headerTab.lastElementChild.classList.toggle('active');
  });
});

//////////////////////////////  SHOPPING

///////// display offer items

const displayBestOffer = () => {
  const itemsArr = shoppingItemsArr
    .map((item) => {
      const { category, img, product, description, price } = item;
      return `
        <li id="${category}" class="product">
        <div class="product__left">
        <div class="product__img">
              <img src="${img}" alt="product" loading="lazy">
          </div>
          <h3 class="product__price price">${price},00 <span>€</span></h3>
        </div>
        <div class="product__right">
        <a href="categories.html">
          <div class="product__category">${category}</div>
        </a>
           <div class="product__info">
              <div>       
                  <h3 class="product__heading">${product}</h3>                 
                  <p class="product__description">${description}</p>
              </div>
          </div>
          <button onclick=buyItem(event) class="buy-btn">Dodaj
              <i class="fa-solid fa-cart-shopping"></i>
          </button>
        </div>
      </li>
    `;
    })
    .join('');
  document.querySelector('.best-offer__wrapper').innerHTML = itemsArr;
};
displayBestOffer();

////////// LOAD MORE ITEMS

const loadMoreBtn = document.querySelector('.best-offer__load-more');
let startIndex = 5;

loadMoreBtn.addEventListener('click', () => {
  const products = Array.from(
    document.querySelectorAll('.best-offer__wrapper .product')
  );

  const productsTodisplay = products.slice(startIndex, startIndex + 5);
  productsTodisplay.forEach((product) => {
    product.classList.add('active');
  });
  const items = products
    .filter((product, index) => {
      return index > 4;
    })
    .every((product) => product.classList.contains('active'));
  if (items) {
    loadMoreBtn.classList.add('deactivated');
  }
  startIndex = startIndex + 5;
});
