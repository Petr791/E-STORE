const titleWrapperNode = document.querySelector('.js-page__title-wrapper');
const cartTitleNode = document.querySelector('.js-cart__title');
const cartBoxInnerNode = document.querySelector('.js-cart-box__inner');
const sidebarNode = document.querySelector('.js-sidebar');

export function createCartView(selector_cart, ERROR_CART_STRING, onMinusBtnClick, onPlusBtnClick) {
	const cartNode = document.querySelector(selector_cart);
	//console.log('createCartView');
	return {
		cartNode,
		// вывод корзины
		renderCart: function (
			currentArr, cart)

		{
			this.clearCart();

			// перебираем загруженные по id товары 
			for (let item of currentArr) {
				//console.log(item.id);
				console.log(item.imgUrl);
				// передаем товар и количество 
				for (let cartId in cart) {
					//console.log(cartId);
					if (item.id === cartId) {
						let quantity = cart[cartId];
						this.createCartItem(item, this.cartNode, quantity);
					}
				}

			}
		},
		// создание карточки корзины
		createCartItem: function (item, cartListNode, quantity) {
			//console.log(item.imgUrl);
			//const imgUrl = `.${item.imgUrl}`;
			//создание элементов и их атрибутов
			const itemNode = document.createElement('li');
			itemNode.setAttribute('class', 'cart-item');
			itemNode.setAttribute('data-id', item.id);

			const imgWrapper = document.createElement('div');
			imgWrapper.setAttribute('class', 'cart-item__img-wrapper');

			const img = document.createElement('img');
			img.setAttribute('class', 'cart-item__img');
			img.setAttribute('src', item.imgUrl);
			img.setAttribute('alt', item.title);

			imgWrapper.append(img);
			itemNode.append(imgWrapper);
			//
			const cartWrapNode = document.createElement('div');
			cartWrapNode.setAttribute('class', 'cart-wrap');

			const titleNode = document.createElement('p');
			titleNode.setAttribute('class', 'cart-item__title');
			titleNode.innerHTML = item.title

			const subtitleNode = document.createElement('p');
			subtitleNode.setAttribute('class', 'cart-item__subtitle');
			subtitleNode.innerHTML = item.subtitle;

			const descShortNode = document.createElement('p');
			descShortNode.setAttribute('class', 'cart-item__desc');
			descShortNode.innerHTML = item.shortDesc;

			cartWrapNode.append(titleNode);
			cartWrapNode.append(subtitleNode);
			cartWrapNode.append(descShortNode);

			itemNode.append(cartWrapNode);
			///////////////////////////////////////


			const ratingNode = document.createElement('div');
			ratingNode.setAttribute('class', 'cart-item__rating cart-rating');

			const ratingStarsNode = document.createElement('span');
			ratingStarsNode.setAttribute('class', 'cart-rating__stars');

			const ratingNambersNode = document.createElement('span');
			ratingNambersNode.setAttribute('class', 'cart-rating__numbers');
			ratingNambersNode.innerHTML = item.rating;

			//

			ratingNode.append(ratingStarsNode);
			ratingNode.append(ratingNambersNode);
			cartWrapNode.append(ratingNode);
			//
			const cartRowNode = document.createElement('div');
			cartRowNode.setAttribute('class', 'cart-row');
			//
			const cartPriceItemNode = document.createElement('div');
			cartPriceItemNode.setAttribute('class', 'cart-row__item price-wrapper');
			cartPriceItemNode.innerHTML = '$ ';

			const priceNode = document.createElement('span');
			priceNode.setAttribute('class', 'cart-row__price');
			priceNode.innerHTML = item.price;

			const symbolNode = document.createElement('span');
			symbolNode.setAttribute('class', 'cart-row__symbol');
			symbolNode.innerHTML = 'X';

			const itemQuantityNode = document.createElement('span');
			itemQuantityNode.setAttribute('class', 'js-cart-row__quantity cart-row__quantity');
			itemQuantityNode.innerHTML = quantity;

			cartPriceItemNode.append(priceNode);
			cartPriceItemNode.append(symbolNode);
			cartPriceItemNode.append(itemQuantityNode);
			cartRowNode.append(cartPriceItemNode);
			//
			const cartBtnsItemNode = document.createElement('div');
			cartBtnsItemNode.setAttribute('class', 'cart-row__item btn-wrapper');
			//
			const minusBtnNode = document.createElement('button');
			minusBtnNode.setAttribute('class', 'js-cart-btn--minus cart-btn cart-btn--minus');
			minusBtnNode.setAttribute('type', 'button');
			minusBtnNode.setAttribute('data-id', item.id);

			minusBtnNode.onclick = () => {
				onMinusBtnClick(minusBtnNode.dataset.id); //
			}

			const cartQuantityItemNode = document.createElement('span');
			cartQuantityItemNode.setAttribute('class', 'js-cart-btn__quantity cart-btn__quantity');
			cartQuantityItemNode.innerHTML = quantity;

			const plusBtnNode = document.createElement('button');
			plusBtnNode.setAttribute('class', 'js-cart-btn--plus cart-btn cart-btn--plus');
			plusBtnNode.setAttribute('type', 'button');
			plusBtnNode.setAttribute('data-id', item.id);

			plusBtnNode.onclick = () => {
				onPlusBtnClick(plusBtnNode.dataset.id); //
			}

			cartBtnsItemNode.append(minusBtnNode);
			cartBtnsItemNode.append(cartQuantityItemNode);
			cartBtnsItemNode.append(plusBtnNode);

			cartRowNode.append(cartBtnsItemNode);
			cartWrapNode.append(cartRowNode);
			//itemNode.append(cartWrapNode);
			cartWrapNode.append(cartRowNode);
			cartListNode.append(itemNode);

		},
		// обновление количества товаров
		updateCartItem: function (
			currentArr, id, quantity, selector_1, selector_2) {

			// перебираем загруженные по id товары 
			for (let item of currentArr) {
				//console.log(item.id);
				// меняем количество товара у конкретного товара
				if (item.id === id) {
					let parent = this.cartNode;
					let specialChild = parent.querySelector(`[data-id="${item.id}"]`);
					let childPriceMultiply = specialChild.querySelector(selector_1);
					childPriceMultiply.innerHTML = quantity;

					let childBtnsItemquantity = specialChild.querySelector(selector_2);
					childBtnsItemquantity.innerHTML = quantity;
				}
			}
		},
		// очистка корзины
		clearCart: function () {
			this.cartNode.innerHTML = '';
		},
		// если корзина пуста
		emptyCart: function () {
			sidebarNode.classList.add('hide');
			cartBoxInnerNode.classList.add('hide');
			titleWrapperNode.classList.remove('hide');
			cartTitleNode.innerHTML = ERROR_CART_STRING;
		},
		// если корзина не пуста
		notEmptyCart: function () {
			titleWrapperNode.classList.add('hide');
			sidebarNode.classList.remove('hide');
			cartBoxInnerNode.classList.remove('hide');
		},

	};
}
