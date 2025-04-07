export function createCheckoutModel(DELIVERY_PRICE_NUMBER) {
	let orderObj = {};
	let ordersArray = [];
	let cartOrder = null;
	let currentProductsArray = null;

	//const deliveryPrice = 6.99;
	const deliveryPrice = DELIVERY_PRICE_NUMBER;
	const orderStatus = 'new';
	let sum = null;
	let total = null;
	let allUsersOrderNumbers = [];

	return {
		ordersArray,
		orderObj,
		cartOrder,
		currentProductsArray,
		deliveryPrice,
		orderStatus,
		sum,
		total,
		allUsersOrderNumbers,
		orderNumber: null,
		// установка корзины из заказа (id: количество)
		setOrderCart: function (cart) {
			this.cartOrder = cart;
		},
		getOrderCart: function () {
			return this.cartOrder;
		},
		////////////////////////////
		// установка массива товаров из корзины (по id)
		setCurrentProducts: function (array) {
			this.currentProductsArray = array;
		},
		getCurrentProducts: function () {
			return this.currentProductsArray;
		},
		// 1 создание и установка объекта заказа (id и userId)
		// получение заказа из view и создание нового объекта с userId
		setOrderObj: function (order) {

			let currentOrderId = this.getMaxId();
			this.orderNumber = currentOrderId;
			//console.log('id=== ' + currentOrderId)
			currentOrderId = String(currentOrderId);

			const orderNew = {
				id: currentOrderId,
				adress: order.adress,
				payment: order.payment,
				products: this.getOrderCart(),
				delivery: this.deliveryPrice,
				status: this.orderStatus
			}
			this.orderObj = orderNew;
		},
		// возращает объект заказа для storage
		getOrderObj: function () {
			return this.orderObj;
		},
		/////////////////////////////////////
		// установка номеров заказов всех пользователей
		setAllUsersOrderNumbers: function (array) {
			this.allUsersOrderNumbers = array;
		},
		// получение номеров всех пользователей
		getAllUsersOrderNumbers: function () {
			return this.allUsersOrderNumbers;
		},
		// новый номер заказа (старый самый большой номер +1)
		getMaxId: function () {
			const arr = this.getAllUsersOrderNumbers();
			//console.log(arr);
			let maxId = 0;
			let id = 0;

			if (!arr.length) {
				id = 100101;
			} else {
				arr.forEach((number) => {
					let num = parseInt(number);
					if (num > maxId) {
						maxId = num;
					} else {
						maxId = maxId;
					}
					id = maxId + 1;
				});
			}
			return id;
		},
		////////////////////////////////
		getDeliveryPrice: function () {
			return this.deliveryPrice;
		},
		// sidebar total
		getProductsSum: function (cart) {

			let currentSum = 0;
			const myArr = this.getCurrentProducts();
			//console.log(myArr);
			for (let item of myArr) {
				for (let cartId in cart) {
					if (item.id == cartId) {
						const productPrice = item.price;
						const a = parseFloat(productPrice.replace(/[^0-9.,]/gim, ''));
						const b = cart[cartId];
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
		getTotalSum: function () {
			return this.total;
		},
		getOrderNamber: function () {
			return this.orderNumber;
		},


	}
}