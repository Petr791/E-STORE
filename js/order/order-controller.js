import {
	USER_ID_STRING,
	CART_STRING,
	ERROR_ORDER_STRING,
	DELIVERY_PRICE_NUMBER
} from '../constants.js';

import {
	createStorage
} from '../storage.js';
import {
	createUserModel
} from '../user/user-model.js';
//////////////////
import {
	createOrderModel
} from './order-model.js';
import {
	createOrderView
} from './order-view.js';
import {
	createOrderPreviewView
} from './order-preview-view.js';

/////////////////////////

let cart = {};
let orders = [];

const storage = createStorage(USER_ID_STRING, CART_STRING);
const userModel = createUserModel();
const orderModel = createOrderModel(orders, DELIVERY_PRICE_NUMBER);
const orderView = createOrderView('.js-order-cart', ERROR_ORDER_STRING);

init();

// инициализация
function init() {
	// получение userID
	initUserID();
	// установка выбранного заказа
	initOrder();
	//установка корзины
	initCart();
}

// установка id пользователя 
function initUserID() {
	let userID = storage.getUserIDStorage();
	// если есть userId
	if (userID) {
		userModel.setUserID(userID);
	} else {
		// если нет userId
		//userID = `${Math.random()}`;
		userID = crypto.randomUUID();
		// после нового пользователя пустая корзина
		cart = {};
		storage.setCartStorage(cart);
		// установка данных пользователя в 
		userModel.setUserID(userID);
		storage.setUserIDStorage(userModel.getUserID());
	}
}

// получение корзины из storage
function initCart() {
	if (storage.getCartStorage()) {
		cart = JSON.parse(storage.getCartStorage());
	} else {
		cart = {};
		storage.setCartStorage(cart);
		orderView.clearOrderNode();
	}
}

// установка заказа по id
function initOrder() {

	const userID = storage.getUserIDStorage();
	//все заказы пользователя
	storage.getCurrentOrder(orderView.getCurrentOrderId(), userID).then((result) => {
			//console.log('Операция завершена успешно.');
			if (result === undefined) {
				console.log('Ответ по заказу: undefined!');
			} else {
				// установка заказа
				orderModel.setCurrentOrder(result);
				// корзина из заказа(id и количество)
				//order.products
				const currentOrderCart = orderModel.getCurrentOrderCart();
				// шаг 2
				// получаем из базы массив с продуктами для вывода в заказе
				storage.getCurrentProducts(currentOrderCart).then((result) => {
					if (result === undefined || result.length === 0) {
						console.log('Проблема с загрузкой товаров из заказа!');
						orderView.errorOrder();
					} else {
						const currentUserID = userModel.getUserID();
						orderView.notErrorOrder();
						// 1)заказ , 2) userID, 3)массив с товарами из заказа
						orderView.renderOrder(orderModel.getCurrentOrder(), currentUserID, result);
						// вывод цены доставки
						renderDeliveryPrice();
						// вывод суммы товаров в корзине
						renderProductsSum(result);
						// вывод общей суммы(товары и доставка)
						renderTotalSum();
					};
				});
			};

		})
		.catch((error) => {
			console.log('Ошибка при загрузке заказа! Заказ у пользователя не найден!');
			//console.error('Ошибка при добавлении заказа:', error);
			orderView.errorOrder();
		});

}

// реагирование на событие storage
window.onstorage = event => {
	initCart(JSON.parse(event.newValue));
}

//////////////////////////////////////////////////////

// вывод цены доставки
function renderDeliveryPrice() {
	orderView.renderDeliveryPrice(orderModel.getDeliveryPrice(), '.js-sidebar-row__delivery-price');
}
//вывод суммы товаров
function renderProductsSum(result) {
	const currentOrderCart = result;
	const cartFromOrder = orderModel.getCurrentOrderCart();
	orderView.renderProductsSum(orderModel.getProductsSum(currentOrderCart, cartFromOrder), '.js-sidebar__products-sum');
}

// вывод общей суммы
function renderTotalSum() {
	orderView.renderTotalSum(orderModel.getTotalSum(), '.js-order-total__sum');
}