///////// OVERLAY

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

//////////////////// SHOPPING CART ////////////////////////

const shopCartBody = document.querySelectorAll('.shopping-cart__body');
const cartMsg = document.querySelectorAll('.shopping-cart__cart-message');

let cart = JSON.parse(localStorage.getItem('data')) || [];
let numStorage = JSON.parse(localStorage.getItem('num')) || [];
let price = JSON.parse(localStorage.getItem('price')) || [];

/////////////// display items in shopping cart

const displayCartItems = (val) => {
  let cartItem = cart
    .map((obj) => {
      let search =
        shoppingItemsArr.find((x) => obj.product === x.product) || [];
      return `
    <li class="shopping-cart__item" id="${obj.id}">
        <p class="shopping-cart__info">
        ${obj.product}
        </p>
        <h3 class="shopping-cart__price">${search.price}</h3>
        <input type="number" name="amount" value="${(val =
          obj.item)}" placeholder="0" min="0" id="amount" class="shopping-cart__amount" onclick=amountItems(event)>
        <h3 class="shopping-cart__overall">${val * search.price},00€</h3>
        <i onclick=removeItem(event) class="fa-solid fa-trash-can remove-icon"></i>
    </li>
    `;
    })
    .join('');
  const shopCart = document.querySelector('.shopping-cart__item-list');
  shopCart.innerHTML = cartItem;
  // if cart has items show items
  if (cart.length) {
    shopCartBody.forEach((body) => body.classList.add('active'));
    cartMsg.forEach((msg) => {
      if (cart.length) {
        msg.style = `
        display: none;
        `;
      }
    });
  }
};
displayCartItems(numStorage);

/////////////// add items to cart and cart arr

const buyItem = (e) => {
  const itemCategory = e.currentTarget.parentElement.parentElement.id;
  const price = Number(
    e.target.closest('.product').querySelector('.price').innerText.slice(0, -5)
  );
  const productName =
    e.currentTarget.parentElement.parentElement.querySelector(
      '.product__heading'
    ).innerText;
  cart.push({
    id: itemCategory,
    item: 1,
    price: price,
    product: productName,
  });
  const productBuyBtn =
    e.target.parentElement.parentElement.querySelector('.buy-btn');
  productBuyBtn.classList.add('deactivated');
  //// if cart has items msg should disappear
  cartMsg.forEach((msg) => {
    if (cart.length) {
      msg.style = `
        display: none;
        `;
    }
  });
  console.log(cart);
  // if listItem cart length is more than 3 items show scroll
  showScroll();

  localStorage.setItem('data', JSON.stringify(cart));
  // localStorage.setItem('price', JSON.stringify(cart));
  clrAll();
  displayCartItems();
  cartIndicator();
  totalBill();
};

/////////////// increase / decrease amount of items

const amountItems = (e) => {
  let num = Number(e.target.value);
  let search = cart.find((obj) => obj.id === e.target.parentElement.id);
  search.item = num;
  let priceElement = e.target.parentElement.firstElementChild.innerText;
  let arr = shoppingItemsArr.find((obj) => obj.product === priceElement);
  let totalAmount = arr.price * num;
  let total = e.target.nextElementSibling;
  total.innerHTML = `${totalAmount},00€`;
  localStorage.setItem('data', JSON.stringify(cart));
  localStorage.setItem('num', JSON.stringify(num));
  totalBill();
};

/////////////// clear all

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
      // delete items
      cart = [];
      // if cart have no itemsshow msg 'Košarica je prazna'
      if (!cart.length) {
        cartMsg.forEach((msg) => {
          msg.style = `
          display: block;
          `;
          // hide body (scroll btns, total, checkout btn)
          shopCartBody.forEach((cartBody) => {
            cartBody.classList.remove('active');
          });
        });
        // every buy btn need to be active to buy
        document.querySelectorAll('.buy-btn').forEach((buyBtn) => {
          buyBtn.classList.remove('deactivated');
        });
      }
      localStorage.setItem('data', JSON.stringify(cart));
      displayCartItems();
      cartIndicator();
      totalBill();
    });
  });
};
clrAll();

/////////////// display cart number indicator of items

const cartItems = document.querySelectorAll('.header__amount-items');
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

/////////////// remove item

const removeItem = (e) => {
  const currItem = e.target.parentElement;
  let currItemHeading = currItem.firstElementChild.innerText;
  //// if is item removed from cart, activate buy btn
  const itemList = document.querySelectorAll('.item-list');
  itemList.forEach((item) => {
    item.querySelectorAll('.product__heading').forEach((item) => {
      if (item.innerText === currItemHeading) {
        item
          .closest('.product')
          .querySelector('.buy-btn')
          .classList.remove('deactivated');
      }
    });
  });
  // show in cart all items which are not targeted
  // in short: delete target item, others leave alone
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
  // if listItem cart length is more than 3 items show scroll
  showScroll();

  localStorage.setItem('data', JSON.stringify(cart));
  localStorage.setItem('num', JSON.stringify(cart.length));
  displayCartItems(numStorage);
  cartIndicator();
  totalBill();
};

/////////////// total bill

const totalBill = () => {
  let total = document.querySelectorAll('.shopping-cart__total');
  let x = cart.map((obj) => obj.price * obj.item).reduce((a, b) => a + b, 0);
  total.forEach((total) => (total.innerHTML = `${x}€`));
};
totalBill();

//////////// SCROLL ITEMS IN SHOPPING CART

const scrollUp = document.querySelectorAll('.scroll-up');
const scrollDown = document.querySelectorAll('.scroll-down');

const showScroll = () => {
  if (cart.length > 3) {
    document.querySelectorAll('.shopping-cart__scroll').forEach((scroll) => {
      scroll.classList.add('active');
    });
  } else {
    document.querySelectorAll('.shopping-cart__scroll').forEach((scroll) => {
      scroll.classList.remove('active');
    });
  }
};
showScroll();

scrollUp.forEach((up) => {
  up.addEventListener('click', (e) => {
    const itemHeight = document.querySelector('.shopping-cart__item');
    const heightItem = itemHeight.scrollHeight + 8;
    up.nextElementSibling.scrollBy({
      top: -heightItem,
      left: 0,
      behavior: 'smooth',
    });
  });
});
scrollDown.forEach((down) => {
  down.addEventListener('click', (e) => {
    const itemHeight = document.querySelector('.shopping-cart__item');
    const heightItem = itemHeight.scrollHeight + 8;
    down.previousElementSibling.scrollBy({
      top: heightItem,
      left: 0,
      behavior: 'smooth',
    });
  });
});

///// SWITCH CATEGORIES FROM INDEX HTML TO CATEGORES HTML

const categoryBtns = document.querySelectorAll('.home-category-btn');
categoryBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    // console.log(e.target.dataset.id);
    location.assign('categories.html');
  });
});

////// BACK TO TOP

document.body.addEventListener('scroll', (e) => {
  const scrollBtn = document.querySelectorAll('.back-to-top');
  if (document.body.scrollTop > 250) {
    scrollBtn.forEach((btn) => {
      btn.classList.add('active');
      btn.addEventListener('click', (e) => {
        document.body.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      });
    });
  } else {
    scrollBtn.forEach((btn) => {
      btn.classList.remove('active');
    });
  }
});
