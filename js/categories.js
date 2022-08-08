/////////// CATEGORIES FILTERING AND PAGINATION
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

/////////////// display items

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
              <img src="${img}" alt="product" loading="lazy">
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
  let itemsArr = x.map((item) => {
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
  });
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
