export function createCartModel(cart) {
	let currentProductsArray = null;
	let sum = null;

	return {
		cart,
		currentProductsArray,
		sum,
		// превью корзины
		setCart: function (cart) {
			this.cart = cart;
		},
		getCart: function () {
			return this.cart;
		},
		////////////////////////////
		// страница корзины
		setCurrentProducts: function (array) {
			this.currentProductsArray = array;
		},
		getCurrentProducts: function () {
			return this.currentProductsArray;
		},
		/////////////////////////
		// превью корзины. сумма товаров в корзине
		getSum: function (cart) {
			let currentSum = 0;
			const productsArr = this.getCurrentProducts();
			if (cart != null && productsArr !== null) {
				for (let item of productsArr) {
					for (let cartId in cart) {
						if (item.id == cartId) {
							const productPrice = item.price;
							let a = parseFloat(productPrice.replace(/[^0-9.,]/gim, ''));
							let b = cart[cartId];
							let c = a * b; // тут сумма по одной позиции

							currentSum += c;
						}
					}
				}
			}
			currentSum = currentSum.toLocaleString();
			this.sum = currentSum;
			return this.sum;
		},
	};

};