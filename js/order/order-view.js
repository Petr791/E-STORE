const headTitle = document.querySelector('head title');
const orderTitleNumberNode = document.querySelector('.js-order-title__number');
const titleWrapperNode = document.querySelector('.js-page__title-wrapper');
const orderTitleNode = document.querySelector('.js-order__title');
const orderBoxInnerNode = document.querySelector('.js-order-box__inner');
const sidebarNode = document.querySelector('.js-sidebar');

// address nodes
const addressNameNode = document.querySelector('.js-order-address__name');
const addressLineNode = document.querySelector('.js-order-address__line');
const addressCityNode = document.querySelector('.js-order-address__city');
const addressTelNode = document.querySelector('.js-order-address__tel');

const paymentMethodNode = document.querySelector('.js-order-payment__method');

let params = new URLSearchParams(document.location.search);
let currentOrderId = params.get('i');

/////////////////////////////
export function createOrderView(selector_order_cart, ERROR_ORDER_STRING) {
	const orderListNode = document.querySelector(selector_order_cart);


	return {

		orderListNode,
		currentOrderId,
		// получение id заказа
		getCurrentOrderId: function () {
			//console.log(currentOrderId);
			return this.currentOrderId;
		},
		// вывод заказа
		renderOrder: function (
			currentOrder, currentUserID, cartArrayFromBase) {

			console.log(currentOrder); //заказ
			//console.log(currentOrder.userId);
			//console.log(currentUserID);
			//console.log(cartArrayFromBase);

			// проверка пользователя userID
			if (currentOrder.userId === currentUserID) {
				//проверка номера заказа в запросе и id заказа 
				if (currentOrder.id === this.currentOrderId) {
					headTitle.innerHTML = `Заказ #${this.currentOrderId}`;

					orderTitleNumberNode.innerText = this.currentOrderId;
					const addressObj = currentOrder.address;

					addressNameNode.innerText = addressObj.name;
					addressLineNode.innerText = addressObj.house;
					addressCityNode.innerText = addressObj.city;
					addressTelNode.innerText = addressObj.tel;
					paymentMethodNode.innerText = currentOrder.payment;

					// id товаров и их количество из заказа
					const cart = currentOrder.products;
					//console.log(cart);
					// товары 
					const cartArray = cartArrayFromBase;
					//console.log(cartArray);
					// корзина заказа
					// перебираем загруженные по id товары 
					for (let item of cartArray) {
						//console.log(item.id);
						// передаем товар и количество 
						for (let cartId in cart) {
							//console.log(cartId);
							if (item.id === cartId) {
								let quantity = cart[cartId];
								//console.log(cartId);
								//console.log(cart[cartId]);
								this.createOrderCartItem(item, this.orderListNode, quantity);
							}
						}
					}
				} else {
					this.errorOrder()
					console.log('Нет такого номера заказа у пользователя!')
				}
			} else {
				this.errorOrder()
				console.log('Ползователи разные!')
			}
		},
		// создание карточки корзины заказа
		createOrderCartItem: function (item, orderListNode, quantity) {
			const imgUrl = `.${item.imgUrl}`;
			//создание элементов и их атрибутов
			const itemNode = document.createElement('li');
			itemNode.setAttribute('class', 'order-cart__item');
			itemNode.setAttribute('data-id', item.id);

			const imgWrapper = document.createElement('div');
			imgWrapper.setAttribute('class', 'cart-item__img-wrapper');

			const img = document.createElement('img');
			img.setAttribute('class', 'cart-item__img');
			img.setAttribute('src', imgUrl);
			img.setAttribute('alt', item.title);

			imgWrapper.append(img);
			itemNode.append(imgWrapper);
			//
			const cartBoxNode = document.createElement('div');
			cartBoxNode.setAttribute('class', 'cart-box');

			const titleNode = document.createElement('p');
			titleNode.setAttribute('class', 'cart-item__title');
			titleNode.innerHTML = item.title;

			const subtitleNode = document.createElement('p');
			subtitleNode.setAttribute('class', 'cart-item__subtitle');
			subtitleNode.innerHTML = item.subtitle;

			const descShortNode = document.createElement('p');
			descShortNode.setAttribute('class', 'cart-item__desc');
			descShortNode.innerHTML = item.shortDesc;

			cartBoxNode.append(titleNode);
			cartBoxNode.append(subtitleNode);
			cartBoxNode.append(descShortNode);

			itemNode.append(cartBoxNode);
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
			cartBoxNode.append(ratingNode);
			//

			const cartRowNode = document.createElement('div');
			cartRowNode.setAttribute('class', 'order-cart__row');
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

			const itemSumNode = document.createElement('span');
			itemSumNode.setAttribute('class', 'js-cart-row__sum cart-row__sum');

			const a = parseFloat(item.price.replace(/[^0-9.,]/gim, ''));
			const b = quantity;
			const sum = a * b;
			itemSumNode.innerHTML = ` &nbsp=&nbsp $ ${sum}`;


			cartPriceItemNode.append(priceNode);
			cartPriceItemNode.append(symbolNode);
			cartPriceItemNode.append(itemQuantityNode);
			cartPriceItemNode.append(itemSumNode);
			cartRowNode.append(cartPriceItemNode);
			//

			cartBoxNode.append(cartRowNode);

			cartBoxNode.append(cartRowNode);
			orderListNode.append(itemNode);
			////////////////////////////////////////
		},
		// очистка корзины заказа
		clearOrderNode: function () {
			this.orderListNode.innerHTML = '';
		},
		// если ошибка с заказом
		errorOrder: function () {
			sidebarNode.classList.add('hide');
			orderBoxInnerNode.classList.add('hide');
			orderTitleNode.innerHTML = ERROR_ORDER_STRING;
			titleWrapperNode.classList.remove('hide');
		},
		// если нет ошибки с заказом
		notErrorOrder: function () {
			titleWrapperNode.classList.add('hide');
			sidebarNode.classList.remove('hide');
			orderBoxInnerNode.classList.remove('hide');
		},
		/////////////////////////////////
		// вывод цены доставки
		renderDeliveryPrice: function (price, selector_Delivery_Price) {
			const node = document.querySelector(selector_Delivery_Price);
			node.innerHTML = price;
		},
		//вывод суммы товаров
		renderProductsSum: function (sum, selector_Products_Sum) {
			const node = document.querySelector(selector_Products_Sum);
			node.innerHTML = sum;
		},
		// вывод общей суммы
		renderTotalSum: function (total, selector_Total_Sum) {
			const node = document.querySelector(selector_Total_Sum);
			node.innerHTML = total;
		},

	};
}