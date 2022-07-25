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

const shopList = document.querySelector('.best-offer__wrapper');
const categoriesWrapper = document.querySelector('.product-grid');
let cart = [];

// display items

let displayItems = () => {
  shoppingItemsArr.length = 15;
  let itemsArr = shoppingItemsArr
    .map((item) => {
      let = { category, img, product, description, price } = item;
      return `
        <li id="${category}" class="product">
        <div class="product__left">
        <div class="product__img">
              <img src="${img}" alt="product" loading="lazy">
          </div>
          <h3 class="product__price price">${price},00 <span>€</span></h3>
        </div>
        <div class="product__right">
          <div class="product__category">${category}</div>
           <div class="product__info">
              <div>
                  <h3 class="product__heading">${product}</h3>
                  <p class="product__description">${description}</p>
              </div>
          </div>
          <button class="buy-btn">Dodaj
              <i class="fa-solid fa-cart-shopping"></i>
          </button>
        </div>
      </li>
    `;
    })
    .join('');
  shopList.innerHTML = itemsArr;
};
displayItems();

// add items to cart and cart arr

const cartMsg = document.querySelectorAll('.shopping-cart__cart-message');

let buyBtn = document.querySelectorAll('.buy-btn').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let itemCategory = e.currentTarget.parentElement.parentElement.id;
    let productName =
      e.currentTarget.parentElement.parentElement.querySelector(
        '.product__heading'
      ).innerText;
    cart.push({
      id: itemCategory,
      item: 1,
      product: productName,
    });
    let productBuyBtn =
      e.target.parentElement.parentElement.querySelector('.buy-btn');
    productBuyBtn.classList.add('deactivated');
    cartMsg.forEach((msg) => {
      if (cart.length) {
        msg.style = `
      display: none;
    `;
      }
    });

    clrAll();
    displayCartItems();
    cartIndicator();
    totalBill();
  });
});

// display items in shopping cart

const displayCartItems = (val) => {
  let cartItem = cart
    .map((obj) => {
      let search =
        shoppingItemsArr.find((x) => obj.product === x.product) || [];
      return `
    <li class="shopping-cart__item" id="${obj.id}">
        <p class="shopping-cart__info">
        ${search.product}
        </p>
        <h3 class="shopping-cart__price">${search.price}</h3>
        <input type="number" name="amount" value="${
          obj.item
        }" placeholder="0" min="0" id="amount" class="shopping-cart__amount" onclick=amountItems(event)>
        <h3 class="shopping-cart__overall">${obj.item * search.price},00€</h3>
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
  search.item = num;
  let priceElement = e.target.parentElement.firstElementChild.innerText;
  let arr = shoppingItemsArr.find((obj) => obj.product === priceElement);
  let totalAmount = arr.price * num;
  let total = e.target.nextElementSibling;
  total.innerHTML = `${totalAmount},00€`;
  totalBill();
};

// clear all

let shopCartBody = document.querySelectorAll('.shopping-cart__body');

const clrAll = () => {
  document.querySelectorAll('.shopping-cart__clear-all').forEach((clearBtn) => {
    // if cart has items appears body
    if (cart.length) {
      shopCartBody.forEach((cartBody) => {
        cartBody.classList.add('active');
      });
    }
    // when we click on clear btn delete cart arr and cart content
    clearBtn.addEventListener('click', (e) => {
      cart = [];
      let allChildren =
        e.target.previousElementSibling.previousElementSibling.children;
      [...allChildren] = [];
      if (!cart.length) {
        cartMsg.forEach((msg) => {
          msg.style = `
              display: block;
            `;
          shopCartBody.forEach((cartBody) => {
            cartBody.classList.remove('active');
          });
        });
        document.querySelectorAll('.buy-btn').forEach((buyBtn) => {
          buyBtn.classList.remove('deactivated');
        });
      }
      displayCartItems();
      cartIndicator();
      totalBill();
    });
  });
};

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
  let currItemHeading = currItem.firstElementChild.innerText;
  let bestOfferItems = [...shopList.children];
  let itemFromCart = cart.find((obj) => obj.product === currItemHeading);
  // show me items which are not in cart
  let removedItems = bestOfferItems.find((item) => {
    if (
      item.querySelector('.product__heading').innerText === itemFromCart.product
    ) {
      return item;
    }
  });
  removedItems.querySelector('.buy-btn').classList.remove('deactivated');
  // show in cart all items which are not targeted
  // in summary: delete target item, others leave alone
  cart = cart.filter((obj) => obj.product !== currItemHeading);
  // if cart doesnt have length:
  // hide body, show msg 'košara je prazna'
  if (!cart.length) {
    shopCartBody.forEach((cartBody) => {
      cartBody.classList.remove('active');
    });
    cartMsg.forEach((msg) => {
      msg.style = `
        display: block;
      `;
    });
  }
  cartIndicator();
  displayCartItems();
  totalBill();
};

// total bill

const totalBill = () => {
  let total = document.querySelectorAll('.shopping-cart__total');
  let x = cart
    .map((obj) => {
      let a = shoppingItemsArr.find((item) => item.product === obj.product);
      return a.price * obj.item;
    })
    .reduce((a, b) => a + b, 0);
  total.forEach((total) => (total.innerHTML = `${x}€`));
};

////////// LOAD MORE

const loadMoreBtn = document.querySelector('.best-offer__load-more');
let startIndex = 5;

loadMoreBtn.addEventListener('click', () => {
  let products = Array.from(
    document.querySelectorAll('.best-offer__wrapper .product')
  );

  let productsTodisplay = products.slice(startIndex, startIndex + 5);
  productsTodisplay.forEach((product) => {
    product.classList.add('active');
  });
  let items = products
    .filter((product, index) => {
      return index > 4;
    })
    .every((product) => product.classList.contains('active'));
  if (items) {
    loadMoreBtn.classList.add('deactivated');
  }
  startIndex = startIndex + 5;
});
