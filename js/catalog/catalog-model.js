export function createCatalogModel() {
	let productsById = null;

	return {
		productsById,
		setProducts: function (products) {
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