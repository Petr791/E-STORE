export function createCartPreviewView(selector_cart, selector_sum, selector_sidebar) {
	//console.log('createSidebarCartView');
	const sidebarCartNode = document.querySelector(selector_cart);
	const sidebarSumNode = document.querySelector(selector_sum);
	const sidebarNode = document.querySelector(selector_sidebar);

	return {
		sidebarCartNode,
		sidebarNode,
		sidebarSumNode,
		// вывод превью корзины
		renderPreviewCart: function (
			currentArr, cart) {
			this.clearPreviewCart();
			// перебираем загруженные по id товары 
			for (let item of currentArr) {
				//console.log(item.id);
				// передаем товар и количество 
				for (let cartId in cart) {
					//console.log(cartId);
					if (item.id === cartId) {
						const quantity = cart[cartId];

						this.createSidebarCartItem(item, quantity);
						const productPrice = Math.round(item.price);
						//console.log(productPrice + ' x ' + cart[cartId]);
					}
				}
			}
		},
		// создание элемента превью корзины
		createSidebarCartItem: function (item, quantity) {
			//создание элементов и их атрибутов
			const itemNode = document.createElement('li');
			itemNode.setAttribute('class', 'sidebar-cart__item');
			itemNode.setAttribute('data-id', item.id);

			const imgWrapper = document.createElement('div');
			imgWrapper.setAttribute('class', 'sidebar-cart__img-wrapper');

			const img = document.createElement('img');
			img.setAttribute('class', 'sidebar-cart__img');
			img.setAttribute('src', item.imgUrl);
			img.setAttribute('alt', item.title);

			const quantityNode = document.createElement('span');
			quantityNode.setAttribute('class', 'js-sidebar-cart__quantity sidebar-cart__quantity');
			quantityNode.innerHTML = quantity;

			itemNode.append(imgWrapper);
			imgWrapper.append(img);
			itemNode.append(quantityNode);

			this.sidebarCartNode.append(itemNode);
		},
		// обновление количества товара в превью корзины
		updatePreviewCartItem: function (
			currentArr, id, quantity, selector) {
			// перебираем загруженные по id массив товаров
			for (let item of currentArr) {
				//console.log(item.id);
				// меняем количество товара у конкретного товара
				if (item.id === id) {
					const parent = this.sidebarCartNode;
					const specialChild = parent.querySelector(`[data-id="${item.id}"]`);
					const child = specialChild.querySelector(selector);
					child.innerHTML = quantity;
				}
			}
		},
		// очистка превью корзины
		clearPreviewCart: function () {
			this.sidebarCartNode.innerHTML = '';
		},
		//вывод суммы товаров в корзине
		renderSum: function (sum) {
			this.sidebarSumNode.innerHTML = '';
			this.createSumItem(sum);
		},
		// создание node вывода суммы товаров
		createSumItem: function (sum) {
			const sumRowNode = document.createElement('p');
			sumRowNode.setAttribute('class', 'sidebar-cart__sum-row');
			const sumSpanNode = document.createElement('span');
			sumSpanNode.setAttribute('class', 'sidebar-cart__sum-sum');
			sumRowNode.innerHTML = 'Сумма: $ ';
			sumSpanNode.innerHTML = sum;
			sumRowNode.append(sumSpanNode);
			this.sidebarSumNode.append(sumRowNode);
		},
		// очистка тотал
		clearPreviewSum: function () {
			console.log('clear');
			this.sidebarSumNode.innerHTML = '';
		}
	};

}