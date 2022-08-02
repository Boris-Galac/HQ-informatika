//////////////////////////////  SHOPPING

/////////////// display items

const displayCategoryItems = () => {
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
  document.querySelector('.product-grid').innerHTML = itemsArr;
};
displayCategoryItems();
