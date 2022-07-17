let overlay = document.createElement('div');
const createOverlay = (content) => {
  overlay.classList.add('overlay');
  document.body.append(overlay);
  overlay.addEventListener('click', (e) => {
    content.classList.remove('active');
    overlay.remove();
  });
};

////////// HAMBURGER MENU

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

////////// OPEN SHOPPING CART MENU

let shoppingCartIcons = document.querySelectorAll('.cart-btn');
const shoppingCartMenu = document.querySelector('.shopping-cart');

shoppingCartIcons.forEach((cart) => {
  cart.addEventListener('click', (e) => {
    shoppingCartMenu.classList.toggle('active');
    createOverlay(shoppingCartMenu);
  });
});

////////// SEARCH BAR

const searchBtn = document.querySelectorAll('.search-btn');
const searchWindow = document.querySelector('.search');

searchBtn.forEach((search) => {
  search.addEventListener('click', (e) => {
    searchWindow.classList.toggle('active');
    createOverlay(searchWindow);
  });
});

//////////  IMAGE CAROUSEL

const leftArrow = document.querySelector('.hero__left');
const rightArrow = document.querySelector('.hero__right');
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

const shopList = document.querySelector('.best-offer__wrapper');
let cart = [];
// display items

let displayItems = () => {
  let itemsArr = shoppingItemsArr
    .map((item) => {
      let = { category, img, product, description, price } = item;
      return `
        <div id="${category}" class="product">
        <div class="product__left">
        <div class="product__img">
          <a href="categories.html">
              <img src="${img}" alt="product">
              </a>
          </div>
          <h3 class="product__price price">${price},00 <span>€</span></h3>
        </div>
        <div class="product__right">
           <div class="product__info">
              <div>
                  <h3 class="product__heading">${product}</h3>
                  <p class="product__description">${description}</p>
              </div>
          </div>
          <button onclick="addToCart(${category})" class="buy-btn">Dodaj
              <i class="fa-solid fa-cart-shopping"></i>
          </button>
        </div>
      </div>
    `;
    })
    .join('');
  shopList.innerHTML = itemsArr;
};
displayItems();

// add items to cart and cart arr

let addToCart = (category) => {
  category.querySelector('.buy-btn').classList.add('activated');
  cart.push({
    id: category.id,
    item: 1,
  });
  displayCartItems();
  cartIndicator();
};

// display items in shopping cart

const displayCartItems = (val) => {
  let cartItem = cart
    .map((obj) => {
      let search = shoppingItemsArr.find((x) => obj.id === x.category) || [];
      return `
    <li class="shopping-cart__item" id="${obj.id}">
        <p class="shopping-cart__info">
        ${search.product}
        </p>
        <h3 class="shopping-cart__price">${search.price}</h3>
        <input type="number" name="amount" value=${(val =
          obj.item)} placeholder="0" min="0" id="amount" class="shopping-cart__amount" onclick=amountItems(event)>
        <h3 class="shopping-cart__overall">${val * search.price},00€</h3>
        <i onclick=removeItem(event) class="fa-solid fa-trash-can remove-icon"></i>
    </li>
    `;
    })
    .join('');

  const shopCart = document.querySelector('.shopping-cart__item-list');
  shopCart.innerHTML = cartItem;
};

displayCartItems();

// increase / decrease amount of items

const amountItems = (e) => {
  let num = Number(e.target.value);
  let search = cart.find((obj) => obj.id === e.target.parentElement.id);
  search.item += 1;
  let priceElement = e.target.nextElementSibling;
  let arr = shoppingItemsArr.find(
    (obj) => obj.category == e.target.parentElement.id
  );
  priceElement.innerHTML = `${arr.price * num},00€`;
};

// clear all

const clearAll = document
  .querySelectorAll('.shopping-cart__clear-all')
  .forEach((clearBtn) => {
    if (cart.length) {
      clearBtn.classList.add('active');
    }
    console.log(cart.length);
    clearBtn.addEventListener('click', (e) => {});
  });

// display cart number indicator of items

let cartItems = document.querySelectorAll('.header__amount-items');
const cartIndicator = () => {
  let x = cart.filter((obj) => obj.item);
  cartItems.forEach((item) => {
    item.innerHTML = x.length;
    if (x.length) {
      item.classList.add('active');
    } else return;
  });
};
cartIndicator();

// remove item

const removeItem = (e) => {
  const currItem = e.target.parentElement;
  cart = cart.filter((obj) => obj.id !== currItem.id);
  cartIndicator();
  if (cart.length === 0) {
    cartItems.forEach((item) => {
      item.classList.remove('active');
    });
  }
  displayCartItems();
};
