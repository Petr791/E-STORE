export function createOrderModel(userOrders, DELIVERY_PRICE_NUMBER) {
	//console.log('createOrderModel');
	let userOrdersIds = [];
	let currentOrder = null;
	//const deliveryPrice = 6.99;
	const deliveryPrice = DELIVERY_PRICE_NUMBER;
	let sum = null;
	let total = null;

	return {
		userOrdersIds,
		currentOrder,
		deliveryPrice,
		sum,
		total,
		/////////////////////////////////
		//для превью заказов пользователя

		// установка массива номеров заказов пользователя
		setUserOrdersIds: function (array) {
			this.userOrdersIds = array;
		},
		// получение массива номеров заказов пользователя
		getUserOrdersIds: function () {
			return this.userOrdersIds;
		},

		////////////////////////////

		// выбранный заказ
		// установка пришедшего заказа
		setCurrentOrder: function (order) {
			this.currentOrder = order;
		},
		getCurrentOrder: function () {
			//console.log(this.currentOrder);
			return this.currentOrder;
		},
		// корзина из заказа (id и количество)
		getCurrentOrderCart: function () {
			// полученный из базы заказ
			const order = this.getCurrentOrder();
			// корзина из заказа
			const orderCart = order.products;
			return orderCart;
		},
		// цена доставки
		getDeliveryPrice: function () {
			return this.deliveryPrice;
		},
		/////////////////////////
		// сумма всех товаров в заказе
		getProductsSum: function (currentOrderCart, cartFromOrder) {
			let currentSum = 0;
			const orderCart = currentOrderCart;
			for (let item of orderCart) {
				for (let cartId in cartFromOrder) {
					if (item.id == cartId) {
						const productPrice = item.price;
						const a = parseFloat(productPrice.replace(/[^0-9.,]/gim, ''));
						const b = cartFromOrder[cartId];
						const c = a * b; // тут сумма по одной позиции

						currentSum += c;
					}
				}
			}
			this.sum = currentSum.toLocaleString();
			this.total = currentSum + parseFloat(this.deliveryPrice);
			this.total = Math.trunc(this.total * 100) / 100;
			return this.sum;
		},
		// общая сумма к оплате
		getTotalSum: function () {
			return this.total;
		}

	};

};