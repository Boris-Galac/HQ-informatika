////✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅/////
//// ********** 👇🏻 MAIN JS 👇🏻 *********** ///////
////✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅/////

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
	const lines = [...e.currentTarget.children];
	lines.forEach((line) => {
		line.classList.toggle('active');
	});
	createOverlay(navMenu);
	navMenu.classList.toggle('active');
	if (!e.target.firstElementChild.classList.contains('active')) {
		overlay.remove();
	}
	overlay.addEventListener('click', (e) => {
		lines.forEach((line) => {
			line.classList.remove('active');
			hamIcon.classList.remove('active');
			navMenu.classList.remove('active');
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
	// if cart has items remove msg and show items
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
	const itemCategory = e.currentTarget.closest('li').id;
	const price = Number(
		e.target.parentElement.parentElement
			.querySelector('.price')
			.innerText.slice(0, -5)
	);
	const productName =
		e.currentTarget.parentElement.parentElement.querySelector(
			'#product-name'
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
	// if listItem cart length is more than 3 items show scroll
	showScroll();

	localStorage.setItem('data', JSON.stringify(cart));
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
	displayCheckoutItems();
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
			displayCheckoutItems();
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
	displayCheckoutItems();
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

//////// (single product html)  DISPLAY SINGLE PRODUCT

///// when user clicks on item name of product goes to local storage

const linkProduct = (e) => {
	let productName = e.target
		.closest('.product')
		.querySelector('#product-name').innerText;
	let objItem = shoppingItemsArr.find((obj) => obj.product === productName);
	localStorage.setItem('product', JSON.stringify(objItem));
};

//// display single item in wrapper

const displaySingleProduct = () => {
	let someProduct = JSON.parse(localStorage.getItem('product'));
	let product = `
   <li id="${someProduct.category}" class="product">
      <div class="product__left">
      <div class="product__img">
      <a href="single-product.html" class="product__link" onclick=linkProduct(event)>
            <img src="${someProduct.img}" alt="product" loading="lazy">
            </a>
        </div>
        <h3 class="product__price price">${someProduct.price},00 <span>€</span></h3>
      </div>
      <div class="product__right">
      <a href="categories.html">
        <div class="product__category">${someProduct.category}</div>
      </a>
        <div class="product__info">
            <div>       
                <h3 class="product__heading" id="product-name">${someProduct.product}</h3>                 
                <p class="product__description">${someProduct.description}</p>
            </div>
        </div>
        <button onclick=buyItem(event) class="buy-btn">Dodaj
            <i class="fa-solid fa-cart-shopping"></i>
        </button>
      </div>
  </li> 
      `;

	document.querySelector('.single-product__product').innerHTML = product;
};

//////// (single product html)  DISPLAY CARD in CAROUSEL

const displayCard = () => {
	const cardCarousel = shoppingItemsArr
		.map((item) => {
			const { category, img, product, description, price } = item;
			return `
    <li class="card" id=${category}>
    <div class="card__header">
    <img src="${img}" alt="laptop" class="card__img" loading="lazy">
    </div>
    <div class="card__body">
    <h2 class="card__heading" id="product-name">${product}</h2>
            <p class="card__paragraph">${description}</p>
            </div>
            <div class="card__footer">
            <div class="card__price">
            <span class="price">${price},00 €</span>
            </div>
            <button onclick=buyItem(event) class="buy-btn">Dodaj
            <i class="fa-solid fa-cart-shopping"></i>
            </button>
        </div>
        </li>
        `;
		})
		.join('');
	document.querySelector('.carousel__wrapper').innerHTML = cardCarousel;
};

////// REGISTRATION FORM

const signUp = document
	.querySelectorAll('.registration')
	.forEach((signUpBtn) => {
		signUpBtn.addEventListener('click', (e) => {
			navMenu.classList.remove('active');
			document.querySelectorAll('.ham-line').forEach((line) => {
				line.classList.remove('active');
			});
			const form = document.querySelector('.form-container');
			form.classList.add('active');
			document.querySelector('.registration-form').classList.add('active');
			document.querySelector('.form__login').classList.add('deactive');
			createOverlay(form);
		});
	});
const signIn = document.querySelectorAll('.sign-up').forEach((signInBtn) => {
	signInBtn.addEventListener('click', (e) => {
		navMenu.classList.remove('active');
		document.querySelectorAll('.ham-line').forEach((line) => {
			line.classList.remove('active');
		});
		const form = document.querySelector('.form-container');
		form.classList.add('active');
		document.querySelector('.registration-form').classList.remove('active');
		document.querySelector('.form__login').classList.remove('deactive');
		createOverlay(form);
	});
});
const regForm = document
	.querySelectorAll('.form__login-link')
	.forEach((signUp) => {
		signUp.addEventListener('click', (e) => {
			document.querySelector('.registration-form').classList.toggle('active');
			document.querySelector('.form__login').classList.toggle('deactive');
		});
	});

//// show/hide password

const showHidePass = document.querySelectorAll('#showHide').forEach((eye) => {
	eye.addEventListener('click', (e) => {
		document.querySelectorAll('.password').forEach((pass) => {
			if (pass.type === 'password') {
				pass.type = 'text';
				document.querySelectorAll('#showHide').forEach((icon) => {
					icon.classList.replace('fa-eye-slash', 'fa-eye');
				});
			} else {
				pass.type = 'password';
				document.querySelectorAll('#showHide').forEach((icon) => {
					icon.classList.replace('fa-eye', 'fa-eye-slash');
				});
			}
		});
	});
});
if (
	location.href.includes('categories.html') ||
	location.href.includes('single-product.html')
) {
	////////// CAROUSEL AUTO

	let currImg = 0;

	setInterval(() => {
		const imgContainer = document.querySelector(
			'.carousel-auto__img-container'
		);
		const img = document.querySelector(
			'.carousel-auto__img-container > img'
		).scrollWidth;
		let amountImgs = document.querySelectorAll(
			'.carousel-auto__img-container > img'
		);
		if (currImg === amountImgs.length - 1) {
			currImg = -1;
		}
		currImg++;
		imgContainer.style = `
              transition: .8s ease-in-out;
              transform: translateX(${currImg * -img}px);
          `;
	}, 4000);
}

////✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅/////
//// ********** 👇🏻 CHECKOUT HTML 👇🏻 *********** ///////
////✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅/////

/////// DISPLAY CART ITEMS IN CHECKOUT

const checkoutBnts = document.querySelectorAll('.shopping-cart__checkout');

checkoutBnts.forEach((checkoutBtn) => {
	checkoutBtn.addEventListener('click', (e) => {
		displayCheckoutItems();
	});
});
const displayCheckoutItems = () => {
	let cart = JSON.parse(localStorage.getItem('data')) || [];
	let checkoutItem = cart.map((item) => {
		let itemCart = shoppingItemsArr.find((obj) => obj.product === item.product);
		return `
    <div class="summary__body-item">
      <div class="summary__body-item-col-1">
          <img src="${itemCart.img}" alt="item">
      </div>
      <div class="summary__body-item-col-2">
          <p class="summary__item-product">${item.product}</p>
          <p class="summary__item-price">€${item.price},00</p>
      </div>
      <div class="summary__body-item-col-3">
          <form class="summary__body-item-form">
              <input type="number" name="numberItems" id="number-items" class="summary__number-items" min="0" placeholder="0" value=${
								item.item
							} onclick=amountSummaryItems(event)>
          </form>
          <strong><p class="summary__sum-items">€${
						item.item * item.price
					},00</p></strong>
      </div>
    </div>
    `;
	});
	if (location.href.includes('checkout.html')) {
		//// append cart items in checkout wrapper
		document.querySelector('.summary__body').innerHTML = checkoutItem;

		if (!cart.length)
			document.querySelector('.summary__body').innerHTML = `
        <p style="color: #fff; font-size: 1.2rem; text-align:center;">Nema artikala</p>
      `;
		total();
	}
};

const amountSummaryItems = (e) => {
	let num = Number(e.target.value);
	let nameOfProduct = e.target
		.closest('.summary__body-item')
		.querySelector('.summary__item-product').innerText;
	let priceOfItem = cart.find((obj) => obj.product === nameOfProduct);
	priceOfItem.item = num;
	let sumPriceProduct = (e.target
		.closest('.summary__body-item')
		.querySelector('.summary__sum-items').innerHTML = `€${
		num * priceOfItem.price
	},00`);

	localStorage.setItem('data', JSON.stringify(cart));
	localStorage.setItem('num', JSON.stringify(num));
	total();
	displayCartItems();
	cartIndicator();
	totalBill();
};

const total = () => {
	const subtotal = document.querySelector(
		'.payment__footer-subtotal p:nth-child(2)'
	);
	const total = document.querySelector('.payment__footer-total p:nth-child(2)');
	const totalPayBtn = document.querySelector('.payment__footer-pay');
	let totalBill = cart
		.map((obj) => obj.price * obj.item)
		.reduce((a, b) => a + b, 0);
	subtotal.innerHTML = `${totalBill}€`;
	total.innerHTML = `${totalBill}€`;
	totalPayBtn.innerHTML = `Pay ${totalBill},00 €`;
};
displayCheckoutItems();

////// PAY alert

if (location.href.includes('checkout.html')) {
	document
		.querySelector('.payment__footer-pay')
		.addEventListener('click', (e) => {
			const alertPopup = document.querySelector('.alert-filter');
			alertPopup.classList.toggle('active');
			createOverlay(alertPopup);
			return alertPopup
				.querySelector('.secondary-btn')
				.addEventListener('click', (e) => {
					alertPopup.classList.remove('active');
					overlay.remove();
				});
		});
}

///// DELIVERY PICK

const deliveries = document
	.querySelectorAll('.summary__footer-shipping-method')
	.forEach((optionDelivery) => {
		optionDelivery.addEventListener('click', (e) => {
			document.querySelectorAll('.radioBtn').forEach((btn) => {
				btn.checked = false;
			});
			optionDelivery.querySelector('.radioBtn').checked = true;
		});
	});

////✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅/////
//// ********** 👇🏻 CATEGORIES HTML 👇🏻 *********** ///////
////✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅/////

/////////// CATEGORIES FILTERING AND PAGINATION
if (location.href.includes('categories.html')) {
	const pagsWrapper = document.querySelector('.pagination__wrapper');
	const filterBtns = document.querySelectorAll('.categories__btn');

	const btnCreate = (klasa, naziv) => {
		let btn = document.createElement('button');
		btn.classList.add('pagination__btn', klasa);
		btn.innerHTML = naziv;
		pagsWrapper.append(btn);
	};

	let currentPage = 1;
	let rows = 4;

	filterBtns.forEach((btn) => {
		///// label reference link
		btn.addEventListener('click', (e) => {
			filterBtns.forEach((tab) => tab.classList.remove('active'));
			e.currentTarget.classList.add('active');
		});
		///// filter categories
		btn.addEventListener('click', (e) => {
			document.querySelectorAll('.pagination__btn').forEach((btn) => {
				btn.remove();
			});
			currentPage = 1;
			filter(e);
		});
	});

	//// filtering

	const filter = (e) => {
		const btnCategory = e.target.dataset.id;
		const menuCategory = shoppingItemsArr.filter((menuItem) => {
			if (btnCategory === menuItem.category) return menuItem;
		});
		if (btnCategory === 'all') {
			displayCategoryItems(shoppingItemsArr, currentPage);
			pagination(shoppingItemsArr);
		} else {
			displayCategoryItems(menuCategory, currentPage);
			pagination(menuCategory);
		}
	};

	/////////////// display items in categories wrapper

	let itemList = document.querySelector('.product-grid');

	const displayCategoryItems = (menuItems, pageNum) => {
		itemList.innerHTML = '';
		pageNum--;
		let itemsArr = menuItems.map((item) => {
			let = { category, img, product, description, price } = item;
			return `
        <li id="${category}" class="product">
        <div class="product__left">
        <div class="product__img">
            <a href="single-product.html" class="product__link" onclick=linkProduct(event)>
              <img src="${img}" alt="product" loading="lazy">
           </a>
          </div>
          <h3 class="product__price price">${price},00 <span>€</span></h3>
        </div>
        <div class="product__right">
           <div class="product__info">
              <div>
                  <h3 class="product__heading" id="product-name">${product}</h3>
                  <p class="product__description">${description}</p>
              </div>
          </div>
          <button onclick=buyItem(event) class="buy-btn">Dodaj
              <i class="fa-solid fa-cart-shopping"></i>
          </button>
        </div>
      </li>
    `;
		});

		// slice array and load items

		let start = rows * pageNum;
		let end = start + rows;
		let arrSliced = itemsArr.slice(start, end);
		for (let i = 0; i < arrSliced.length; i++) {
			itemList.innerHTML += arrSliced[i];
		}
	};

	///////// PAGINATION

	// general pagination

	const createPaginationBnts = () => {
		btnCreate('first', 'first');
		btnCreate(
			'prev',
			'<i class="fa-solid fa-chevron-left pagination__left-arrow"></i>'
		);
		btnCreate(
			'next',
			'<i class="fa-solid fa-chevron-right pagination__right-arrow"></i>'
		);
		btnCreate('last', 'last');
	};

	const pagination = (arr) => {
		createPaginationBnts();
		let pageLength = Math.ceil(arr.length / rows);
		const firstPg = document.querySelector('.first');
		const prevPg = document.querySelector('.prev');
		const nextPg = document.querySelector('.next');
		const lastPg = document.querySelector('.last');
		firstPg.addEventListener('click', () => {
			currentPage = 1;
			displayCategoryItems(arr, currentPage);
		});
		prevPg.addEventListener('click', () => {
			currentPage--;
			currentPage === 0 ? (currentPage = pageLength) : currentPage;
			displayCategoryItems(arr, currentPage);
		});
		nextPg.addEventListener('click', () => {
			currentPage === pageLength ? (currentPage = 1) : currentPage++;
			displayCategoryItems(arr, currentPage);
		});
		lastPg.addEventListener('click', () => {
			currentPage = pageLength;
			displayCategoryItems(arr, currentPage);
		});
	};

	pagination(shoppingItemsArr);
	displayCategoryItems(shoppingItemsArr, currentPage);

	///// CHANGE LAYOUT OF ITEMS

	const rowBtn = document.querySelector('.filter-btn-row');
	const gridBtn = document.querySelector('.filter-btn-grid');

	///// show items in row layout

	rowBtn.addEventListener('click', (e) => {
		rowBtn.classList.add('active');
		gridBtn.classList.remove('active');

		document
			.querySelectorAll('.product')
			.forEach((item) => item.classList.remove('grid'));
		document
			.querySelectorAll('.product-grid')
			.forEach((item) => item.classList.remove('grid'));
		document
			.querySelectorAll('.product__left')
			.forEach((item) => item.classList.remove('grid'));
		document
			.querySelectorAll('.product__left .product__price')
			.forEach((item) => item.classList.remove('grid'));
		document
			.querySelectorAll('.product__right')
			.forEach((item) => item.classList.remove('grid'));
		document
			.querySelectorAll('.product-grid .product__info')
			.forEach((item) => item.classList.remove('grid'));
		document
			.querySelectorAll('.product-grid .product__right')
			.forEach((item) => item.classList.remove('grid'));
		document
			.querySelectorAll('.product__img img')
			.forEach((item) => item.classList.remove('grid'));
		document
			.querySelectorAll('.buy-btn')
			.forEach((item) => item.classList.remove('grid'));
	});

	///// show items in grid layout

	gridBtn.addEventListener('click', (e) => {
		rowBtn.classList.remove('active');
		gridBtn.classList.add('active');

		document
			.querySelectorAll('.product')
			.forEach((item) => item.classList.add('grid'));
		document
			.querySelectorAll('.product-grid')
			.forEach((item) => item.classList.add('grid'));
		document
			.querySelectorAll('.product__left')
			.forEach((item) => item.classList.add('grid'));
		document
			.querySelectorAll('.product__left .product__price')
			.forEach((item) => item.classList.add('grid'));
		document
			.querySelectorAll('.product__right')
			.forEach((item) => item.classList.add('grid'));
		document
			.querySelectorAll('.product-grid .product__info')
			.forEach((item) => item.classList.add('grid'));
		document
			.querySelectorAll('.product-grid .product__right')
			.forEach((item) => item.classList.add('grid'));
		document
			.querySelectorAll('.product__img img')
			.forEach((item) => item.classList.add('grid'));
		document
			.querySelectorAll('.buy-btn')
			.forEach((item) => item.classList.add('grid'));
	});

	/////////// FILTER PRODUCTS BAR

	const filterProducts = document.getElementById('filter-bar');

	filterProducts.addEventListener('submit', (e) => {
		e.preventDefault();
		let startPrice = Number(document.getElementById('startPrice').value);
		let endPrice = Number(document.getElementById('endPrice').value);
		let brandProduct = document.getElementById('brand').value;
		/// if the values are ampty show popup msg
		if (startPrice === 0 && endPrice === 0 && brandProduct === 'all') {
			const alertPopup = document.querySelector('.alert-filter');
			alertPopup.classList.toggle('active');
			createOverlay(alertPopup);
			return alertPopup
				.querySelector('.secondary-btn')
				.addEventListener('click', (e) => {
					alertPopup.classList.remove('active');
					overlay.remove();
				});
		}
		/// filter products
		let x = shoppingItemsArr.filter((obj) => {
			if (
				obj.price >= startPrice &&
				obj.price <= endPrice &&
				brandProduct === 'all'
			) {
				return obj;
			} else if (
				startPrice === 0 &&
				endPrice === 0 &&
				brandProduct === obj.brand
			) {
				return obj;
			} else if (
				obj.price >= startPrice &&
				obj.price <= endPrice &&
				brandProduct === obj.brand
			) {
				return obj;
			}
		});

		/// show items that are filtered

		let itemsArr = x
			.map((item) => {
				let = { category, img, product, description, price } = item;
				return `
        <li id="${category}" class="product">
        <div class="product__left">
        <div class="product__img">
            <a href="single-product.html" class="product__link"  onclick=linkProduct(event)>
              <img src="${img}" alt="product" loading="lazy">
            </a>
          </div>
          <h3 class="product__price price">${price},00 <span>€</span></h3>
        </div>
        <div class="product__right">
           <div class="product__info">
              <div>
                  <h3 class="product__heading" id="product-name">${product}</h3>
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
		itemList.innerHTML = itemsArr;
		if (!itemList.firstElementChild) {
			itemList.innerHTML = `
      <p class="no-results">Nema traženih rezultata</p>
    `;
		}
		while (pagsWrapper.firstChild) {
			pagsWrapper.removeChild(pagsWrapper.lastChild);
		}
		const returnFilterBtn = document.createElement('button');
		returnFilterBtn.classList.add('secondary-btn');
		returnFilterBtn.innerText = 'Poništi filter';
		returnFilterBtn.addEventListener('click', (e) => {
			location.reload();
		});
		pagsWrapper.append(returnFilterBtn);
	});
}

////✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅/////
//// ********** 👇🏻 INDEX HTML 👇🏻 *********** ///////
////✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅/////

//////////  IMAGE CAROUSEL
if (location.href.includes('index.html')) {
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
       <a href="single-product.html" class="product__link"  onclick=linkProduct(event)>
            <img src="${img}" alt="product" loading="lazy">
            </a>
        </div>
        <h3 class="product__price price">${price},00 <span>€</span></h3>
      </div>
      <div class="product__right">
      <a href="categories.html">
        <div class="product__category">${category}</div>
      </a>
         <div class="product__info">
            <div>       
                <h3 class="product__heading" id="product-name">${product}</h3>                 
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
}

////✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅/////
//// ********** 👇🏻 SINGLE PRODUCT HTML 👇🏻 *********** ///////
////✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅/////

if (location.href.includes('single-product.html')) {
	displaySingleProduct();
	displayCard();
	/////////// (single product html) TABS

	const tabWrapper = document.querySelector('.tab__wrapper');
	const tabBtns = document.querySelectorAll('.tab__btn');
	const tabContent = document.querySelectorAll('.tab__content');

	tabWrapper.addEventListener('click', (e) => {
		const id = e.target.dataset.id;
		if (id) {
			tabBtns.forEach((btn) => {
				btn.classList.remove('active');
				e.target.classList.add('active');
			});
			tabContent.forEach((tab) => {
				tab.classList.remove('active');
				if (id === tab.id) {
					tab.classList.add('active');
				}
			});
		}
	});

	//////////// (single product html) CAROUSEL SLIDER CARDS

	const carouselLeft = document.getElementById('carouselLeft');
	const carouselRight = document.getElementById('carouselRight');
	const carouselWrapper = document.getElementById('carouselWrapper');

	carouselLeft.addEventListener('click', (e) => {
		carouselWrapper.scrollBy({
			top: 0,
			left: -200,
			behavior: 'smooth',
		});
	});
	carouselRight.addEventListener('click', (e) => {
		carouselWrapper.scrollBy({
			top: 0,
			left: 200,
			behavior: 'smooth',
		});
	});

	////// (single product html)  COMMENTING

	const addComment = document.getElementById('addComment');
	const commentSubmit = document.querySelector('.commenting__submit');
	// localStorage.getItem('notes');
	// let notesObj = [];
	const notes = localStorage.getItem('notes');
	notesObj = JSON.parse(notes);

	//// SAVING COMMENT

	addComment.addEventListener('submit', (e) => {
		e.preventDefault();
		const addTxt = document.getElementById('comment');
		notesObj.push(addTxt.value);
		localStorage.setItem('notes', JSON.stringify(notesObj));
		addTxt.value = '';
		commentSubmit.disabled = true;
		commentSubmit.classList.add('deactivated');
		showNotes();
	});
	addComment.addEventListener('keypress', (e) => {
		if (
			e.target.matches('.commenting__create-comment') &&
			commentSubmit.classList.contains('deactivated')
		) {
			commentSubmit.disabled = false;
			commentSubmit.classList.remove('deactivated');
		}
	});
	//// display the note

	const showNotes = () => {
		const notes = localStorage.getItem('notes');
		if (notes === null) {
			notesObj = [];
		} else {
			notesObj = JSON.parse(notes);
		}
		let commentHtml = '';
		notesObj.forEach((element, index) => {
			commentHtml += `
      <li class="commenting__comment">
      <div class="commenting__body">
          <h5 class="commenting__comment-title">Vaš komentar</h5>
          <p class="commenting__comment-text">
              ${element}
          </p>
      </div>
      <button id=${index} onclick=deleteComment(this.id) class="del-comment-btn">Delete comment</button>
    </li>
      `;
		});
		const commElementList = document.getElementById('comments');

		if (notesObj.length) {
			commElementList.innerHTML = commentHtml;
		} else {
			commElementList.innerHTML = `<p class="no-comments">Nema komentara.</p>`;
		}
	};

	//// delete comment

	function deleteComment(index) {
		const notes = localStorage.getItem('notes');
		if (notes === null) {
			notesObj = [];
		} else {
			notesObj = JSON.parse(notes);
		}
		notesObj.splice(index, 1);
		localStorage.setItem('notes', JSON.stringify(notesObj));
		showNotes();
	}
	showNotes();

	////// LIKE

	const likes = document.querySelectorAll('#like');
	likes.forEach((like) => {
		like.addEventListener('click', (e) => {
			likes.forEach((like) => like.classList.remove('active'));
			like.classList.toggle('active');
		});
	});
}
