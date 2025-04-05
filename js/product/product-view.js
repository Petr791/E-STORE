const headTitle = document.querySelector('head title');
const titleWrapperNode = document.querySelector('.js-page__title-wrapper');
const productTitleNode = document.querySelector('.js-product__title');
const productBoxInnerNode = document.querySelector('.js-product-box__inner');
const sidebarNode = document.querySelector('.js-sidebar');

let params = new URLSearchParams(document.location.search);
let productId = params.get('i');
console.log(productId);

export function createProductView(selector_product_box_inner, cardBtnClick, ERROR_PRODUCT_STRING) {

	const node = document.querySelector(selector_product_box_inner);
	return {
		node,
		currentId: productId,
		// получение id товара
		getCurrentId: function () {
			return this.currentId;
		},
		// вывод товара 
		renderProduct: function (
			product
		) {
			this.clearProductNode();
			// проверка на приход товара и на id в товаре и в get-запросе
			if (product && product.id == this.currentId) {
				headTitle.innerHTML = product.title;
				const currentItem = product;
				this.createProduct(currentItem);
			} else {
				this.errorProduct()
			}
		},
		// создание товара
		createProduct: function (currentItem) {
			//const imgUrl = `.${currentItem.imgUrl}`;
			//console.log(currentItem.title)
			const topNode = document.createElement('div');
			topNode.setAttribute('class', 'product__top');

			const imgWrapper = document.createElement('div');
			imgWrapper.setAttribute('class', 'product__img-wrapper');
			const img = document.createElement('img');
			img.setAttribute('class', 'product__img');
			img.setAttribute('src', currentItem.imgUrl);
			img.setAttribute('alt', currentItem.title);
			//
			const infoNode = document.createElement('div');
			infoNode.setAttribute('class', 'product-info');

			const titleNode = document.createElement('h1');
			titleNode.setAttribute('class', 'product-info__title');
			titleNode.innerHTML = currentItem.title;

			const subtitleNode = document.createElement('p');
			subtitleNode.setAttribute('class', 'product-info__subtitle');
			subtitleNode.innerHTML = currentItem.subtitle;

			const ratingNode = document.createElement('div');
			ratingNode.setAttribute('class', 'product-info__rating product-rating');

			const ratingStarsNode = document.createElement('span');
			ratingStarsNode.setAttribute('class', 'product-rating__stars');

			const ratingNambersNode = document.createElement('span');
			ratingNambersNode.setAttribute('class', 'product-rating__numbers');
			ratingNambersNode.innerHTML = currentItem.rating;

			const priceWrapperNode = document.createElement('p');
			priceWrapperNode.setAttribute('class', 'product-info__price-wrapper');
			priceWrapperNode.innerText = '$';

			const priceNode = document.createElement('span');
			priceNode.setAttribute('class', 'product-info__price');
			priceNode.innerHTML = currentItem.price;

			const descShortNode = document.createElement('p');
			descShortNode.setAttribute('class', 'product-info__desc product-info__desc-short');
			descShortNode.innerHTML = currentItem.shortDesc;

			const infoRowNode = document.createElement('div');
			infoRowNode.setAttribute('class', 'product-info__row');

			const btnNode = document.createElement('button');
			btnNode.setAttribute('class', 'product-info__btn');
			btnNode.setAttribute('type', 'button');
			btnNode.setAttribute('data-id', currentItem.id);

			btnNode.onclick = () => {
				cardBtnClick(btnNode.dataset.id); //
			}

			const btnSpanNode = document.createElement('span');
			btnSpanNode.setAttribute('class', 'info-btn__span');
			btnSpanNode.innerHTML = 'Корзина';

			const bottomNode = document.createElement('div');
			bottomNode.setAttribute('class', 'product__bottom');

			const lineNode = document.createElement('div');
			lineNode.setAttribute('class', 'product__line');

			const descTitleNode = document.createElement('h2');
			descTitleNode.setAttribute('class', 'product-desc__title');
			descTitleNode.innerHTML = 'Описание';

			const descLongNode = document.createElement('p');
			descLongNode.setAttribute('class', 'product-desc__p');
			descLongNode.innerHTML = currentItem.longDesc;

			imgWrapper.append(img);
			infoNode.append(titleNode); //
			infoNode.append(subtitleNode);

			ratingNode.append(ratingStarsNode);
			ratingNode.append(ratingNambersNode);
			infoNode.append(ratingNode);
			priceWrapperNode.append(priceNode);
			infoNode.append(priceWrapperNode);
			infoNode.append(descShortNode);
			btnNode.append(btnSpanNode);
			infoRowNode.append(btnNode);
			infoNode.append(infoRowNode);

			topNode.append(imgWrapper);
			topNode.append(infoNode);
			///////////////
			bottomNode.append(lineNode);
			bottomNode.append(descTitleNode);
			bottomNode.append(descLongNode);
			/////////////////////
			node.append(topNode);
			node.append(bottomNode);
		},
		// очистка productNode
		clearProductNode: function () {
			node.innerHTML = '';
		},
		// если ошибка с товаром
		errorProduct: function () {
			sidebarNode.classList.add('hide');
			productBoxInnerNode.classList.add('hide');
			titleWrapperNode.classList.remove('hide');
			productTitleNode.innerHTML = ERROR_PRODUCT_STRING;

		},
		// если нет ошибки с товаром
		notErrorProduct: function () {
			titleWrapperNode.classList.add('hide');
			sidebarNode.classList.remove('hide');
			productBoxInnerNode.classList.remove('hide');
		},
	};

}
