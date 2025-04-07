const titleWrapperNode = document.querySelector('.js-page__title-wrapper');
const catalogTitleNode = document.querySelector('.js-catalog__title');
const catalogBoxInnerNode = document.querySelector('.js-catalog-box__inner');
const sidebarNode = document.querySelector('.js-sidebar');

export function createCatalogView(selector_catalog_cards, cardBtnClick) {
	const catalogCardsNode = document.querySelector(selector_catalog_cards);

	return {
		catalogCardsNode,
		renderCatalog: function ({
			productsById
		}) {

			this.clearCatalogCardsNode();
			for (let item in productsById) {
				this.createProduct(productsById[item]);
			}
		},
		createProduct: function (item) {
			const productUrl = `https://petr791.github.io/E-STORE/pages/product.html?i=${item.id}`;

			//создание элементов и их атрибутов
			const itemNode = document.createElement('li');
			itemNode.setAttribute('class', 'catalog-card');
			itemNode.setAttribute('data-id', item.id);

			const link = document.createElement('a');
			link.setAttribute('class', 'catalog-card__link');
			link.setAttribute('href', productUrl);
			link.setAttribute('target', '_blank');

			const imgWrapper = document.createElement('div');
			imgWrapper.setAttribute('class', 'catalog-card__img-wrapper');

			const img = document.createElement('img');
			img.setAttribute('class', 'catalog-card__img');
			img.setAttribute('src', item.imgUrl);
			img.setAttribute('alt', item.title);

			const title = document.createElement('p');
			title.setAttribute('class', 'catalog-card__title');
			title.innerHTML = item.title;

			const subtitle = document.createElement('p');
			subtitle.setAttribute('class', 'catalog-card__subtitle');
			subtitle.innerHTML = item.subtitle;


			const bottomRow = document.createElement('div');
			bottomRow.setAttribute('class', 'catalog-card__purchase');
			const priceWrapper = document.createElement('span');
			priceWrapper.setAttribute('class', 'catalog-card__price-wrapper');
			priceWrapper.innerHTML = '$';

			const priceNode = document.createElement('span');
			priceNode.setAttribute('class', 'catalog-card__price');
			priceNode.innerHTML = item.price;


			const btnNode = document.createElement('button');
			btnNode.setAttribute('class', 'catalog-card__btn');
			btnNode.setAttribute('type', 'button');
			btnNode.setAttribute('data-id', item.id);

			link.onclick = (event) => {
				if (event.target === btnNode) {
					event.stopPropagation();
					event.preventDefault();
					//console.log('btn id: ' + btnNode.dataset.id);
					cardBtnClick(btnNode.dataset.id);
				} else {
					//console.log(event.target);
				}
			}

			itemNode.append(link);
			link.append(imgWrapper);
			imgWrapper.append(img);
			link.append(title);
			link.append(subtitle);
			link.append(bottomRow);

			bottomRow.append(priceWrapper);
			priceWrapper.append(priceNode);
			bottomRow.append(btnNode);

			//
			catalogCardsNode.append(itemNode);

		},
		clearCatalogCardsNode: function () {
			catalogCardsNode.innerHTML = '';
		},
		// если ошибка с каталогом
		errorCatalog: function (title) {
			console.log('сработала ошибка')
			// убираем блоки
			sidebarNode.classList.add('hide');
			catalogBoxInnerNode.classList.add('hide');
			catalogTitleNode.innerHTML = title;
		},
		// если нет ошибки с каталогом
		notErrorCatalog: function () {
			titleWrapperNode.classList.add('hide');
			sidebarNode.classList.remove('hide');
			catalogBoxInnerNode.classList.remove('hide');
		},
	};

}