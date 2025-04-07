export function createProductModel() {
	;
	let product = null;
	return {
		product,
		// установка конкретного товара. запрос по id
		setProduct: function (product) {
			this.product = product;
		},
		// получение товара
		getProduct: function () {
			return this.product;
		},
	};

};