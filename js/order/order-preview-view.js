export function createOrderPreviewView(selector_orders, ORDER_PAGE_URL) {
	//console.log('createOrderPreviewView');
	const previewOrdersNode = document.querySelector(selector_orders);

	return {
		previewOrdersNode,
		// вывод заказов пользователя по userID
		renderPreviewOrders: function (orders) {
			//console.log(orders);
			this.clearPreviewOrders();

			const itemsNode = document.createElement('ul');
			itemsNode.setAttribute('class', 'sidebar-orders__list');
			previewOrdersNode.append(itemsNode);

			orders.forEach(item => {
				const orderUrl = `./pages/order.html?i=${item}`;
				const itemNode = document.createElement('li');
				itemNode.setAttribute('class', 'sidebar-orders__item');
				itemNode.setAttribute('data-id', item);

				const itemLinkNode = document.createElement('a');
				itemLinkNode.setAttribute('class', 'sidebar-orders__link');
				itemLinkNode.setAttribute('target', '_blank');
				itemLinkNode.setAttribute('href', orderUrl);
				itemLinkNode.innerHTML = '#' + item;

				itemNode.append(itemLinkNode);
				itemsNode.append(itemNode);
			});
		},
		//очистка превью заказов
		clearPreviewOrders: function () {
			previewOrdersNode.innerHTML = '';
		},
	};

}