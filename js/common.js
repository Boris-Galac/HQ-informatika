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

let cart = JSON.parse(localStorage.getItem('data')) || [];
let numStorage = JSON.parse(localStorage.getItem('num')) || [];

/////////////// display items in shopping cart

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
};
// displayCartItems(numStorage);

/////////////// add items to cart and cart arr

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
    localStorage.setItem('data', JSON.stringify(cart));
    clrAll();
    displayCartItems();
    cartIndicator();
    totalBill();
  });
});

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
      localStorage.setItem('data', JSON.stringify(cart));
      displayCartItems();
      cartIndicator();
      totalBill();
    });
  });
};

/////////////// display cart number indicator of items

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
  localStorage.setItem('data', JSON.stringify(cart));
  localStorage.setItem('num', JSON.stringify(cart.length));
  displayCartItems(numStorage);
  cartIndicator();
  totalBill();
};

/////////////// total bill

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
