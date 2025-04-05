export function createCatalogModel() {
	//console.log('createTodosModel');
	let productsById = null;

	return {
		productsById,
		setProducts: function (products) {
			//console.log(products);
			let productsByIdArray = [];
			products.forEach((item, index) => {
				productsByIdArray[index] = item;
			});
			this.productsById = productsByIdArray;
		},
		getProducts: function () {
			return {
				productsById: this.productsById
			};
		}
	};
};