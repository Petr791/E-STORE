import {
	USER_ID_STRING,
	CART_STRING,
	ORDER_PAGE_URL,
	ERROR_CATALOG_STRING,

} from '../constants.js';


import {
	createStorage
} from '../storage.js';
import {
	createUserModel
} from '../user/user-model.js';

import {
	createCartModel
} from '../cart/cart-model.js';
import {
	createCartPreviewView
} from '../cart/cart-preview-view.js';
import {
	createOrderModel
} from '../order/order-model.js';
import {
	createOrderPreviewView
} from '../order/order-preview-view.js';

import {
	createCatalogModel
} from './catalog-model.js';
import {
	createCatalogView
}
from './catalog-view.js';

/* import {
	addCatalogForFirebase
}
from '../admin.js'; */


//const adminPage = addCatalogForFirebase(oneArrayId);

let cart = {};
let orders = []; //?

const storage = createStorage(USER_ID_STRING, CART_STRING);
const userModel = createUserModel();
const catalogModel = createCatalogModel();
const catalogView = createCatalogView('.js-catalog-cards', cardBtnClick);
const cartModel = createCartModel(cart);
const cartPreviewView = createCartPreviewView('.js-sidebar-cart', '.js-sidebar__total', '.js-sidebar');
const orderModel = createOrderModel(orders);
const orderPreviewView = createOrderPreviewView('.js-sidebar-orders__wrapper', ORDER_PAGE_URL);

/////////////////////////////// */

init();

function init() {
	initUserID();
	setProducts();
	initCart();
	initOrdersPreview();
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
		//console.log(userModel.getUserID());
		storage.setUserIDStorage(userModel.getUserID());
	}
}

// загрузка и установка каталога из базы
function setProducts() {

	if (storage.getStorageProducts()) {
		storage.getStorageProducts().then((result) => {
			if (result == undefined) {
				console.log('массив пустой!');
				catalogView.errorCatalog(ERROR_CATALOG_STRING);
			} else {
				catalogView.notErrorCatalog();
				initCatalog(result);
			};
		});
	} else {
		console.log('массив пустой!');
	}
}

// установка массивов в model
function initCatalog(products) {
	catalogModel.setProducts(products);
	catalogView.renderCatalog(catalogModel.getProducts());
}

// получение корзины из storage
function initCart() {
	if (storage.getCartStorage()) {
		// получаем корзину из сторадж
		cart = JSON.parse(storage.getCartStorage());
		cartModel.setCart(cart);

		storage.getCurrentProducts(cart).then((result) => {
			if (result === undefined || result.length === 0) {
				console.log('Товары в корзине -  пусто!');
				cartPreviewView.clearPreviewCart();

			} else {
				catalogView.notErrorCatalog();
				cartModel.setCurrentProducts(result);
				initPreviewCart(cartModel.getCart());
			};
		});

	} else {
		console.log('корзина стала пустой!');
		// обнуление корзины везде
		cart = {};
		storage.setCartStorage(cart);
		cartPreviewView.clearPreviewCart();

	}

}

// установка превбю корзины
function initPreviewCart(cart) {
	if (cart) {
		cartPreviewView.renderPreviewCart(cartModel.getCurrentProducts(), cart);
	} else {
		console.log('превью корзины пустое');
	}
}

// реагирование на событие storage
window.onstorage = event => {
	initCart(JSON.parse(event.newValue));
	initUserID(JSON.parse(event.newValue));

	setTimeout(() => {
		initOrdersPreview(JSON.parse(event.newValue));
	}, 2000);
}


////////////////////
// клик на кнопке добавить в корзину
function cardBtnClick(id) {
	//console.log(id);
	if (cart[id] == undefined) {
		//если нет в корзине такого товара
		cart[id] = 1;
		storage.setCartStorage(cart)
		cartModel.setCart(cart); //

		storage.getCurrentProducts(cart).then((result) => {
			if (result === undefined || result.length === 0) {
				console.log('массив с товарами пустой!');
				catalogView.errorCatalog(ERROR_CATALOG_STRING);
			} else {
				catalogView.notErrorCatalog();
				cartModel.setCurrentProducts(result);
				const currentArr = cartModel.getCurrentProducts();
				// обновить весь лист корзины
				cartPreviewView.renderPreviewCart(currentArr, cart);

			};
		});

	} else {
		// если в корзине есть такой товар
		cart[id]++;
		storage.setCartStorage(cart);
		cartModel.setCart(cart); //
		const currentArr = cartModel.getCurrentProducts();
		//обновить только число товаров
		cartPreviewView.updatePreviewCartItem(currentArr, id, cart[id], '.js-sidebar-cart__quantity');
	}
}

// /////////////////////////////////////////

// для превью заказов
// массив номеров заказов userID пользователя
function initOrdersPreview() {
	const userID = userModel.getUserID();
	// получить все заказы пользователя
	storage.getStorageAllOrders(userID).then((result) => {
		if (result === undefined || result.length === 0) {
			console.log('массив номеров заказов пользователя пустой');
			orderPreviewView.clearPreviewOrders();
		} else {
			orderModel.setUserOrdersIds(result);
			//console.log('массив номеров заказов пользователя не пустой');
			orderPreviewView.renderPreviewOrders(result);
		};
	});

}