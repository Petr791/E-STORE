import {
	USER_ID_STRING,
	CART_STRING,
	ERROR_PRODUCT_STRING,
} from '../constants.js';


import {
	createStorage
} from '../storage.js';
import {
	createUserModel
} from '../user/user-model.js';
//////////////////
import {
	createCartModel
} from '../cart/cart-model.js';
import {
	createCartPreviewView
} from '../cart/cart-preview-view.js';
///////////////////
import {
	createProductModel
} from './product-model.js';
import {
	createProductView
} from './product-view.js';




////////////////////////////////
let cart = {};

const storage = createStorage(USER_ID_STRING, CART_STRING);
const userModel = createUserModel();
const productModel = createProductModel();
const productView = createProductView('.js-product-box__inner', cardBtnClick, ERROR_PRODUCT_STRING);
const cartModel = createCartModel(cart);
const cartPreviewView = createCartPreviewView('.js-sidebar-cart', '.js-sidebar__total', '.js-sidebar');

/////////////////
init();

// инициализация
function init() {
	initUserID();

	//initCart();
	initProduct();

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
		// установка id пользователя 
		userModel.setUserID(userID);
		storage.setUserIDStorage(userModel.getUserID());
	}
}

// установка одного товара 
function initProduct() {
	storage.getCurrentProduct(productView.getCurrentId()).then((result) => {
		console.log(result);


		if (result === undefined || result === null) {
			console.log('Товар не пришел!');
			productView.errorProduct();
			cartPreviewView.clearPreviewCart();
		} else {
			//console.log('Товар пришел!');
			productView.notErrorProduct();
			productModel.setProduct(result);
			productView.renderProduct(productModel.getProduct());
			initCart();
		};
	});
}

function initCart() {
	if (storage.getCartStorage()) {
		// получаем корзину из сторадж
		cart = JSON.parse(storage.getCartStorage()); // без 
		cartModel.setCart(cart);

		storage.getCurrentProducts(cart).then((result) => {
			if (result === undefined) {
				console.log('массив undefined!');
				cartPreviewView.clearPreviewCart();
			} else {
				productView.notErrorProduct();
				cartModel.setCurrentProducts(result);
				initPreviewCart(cartModel.getCart());
			};
		});

	} else {
		console.log('Корзина стала пустой!');
		// обнуление корзины везде
		cart = {};
		storage.setCartStorage(cart);
		cartPreviewView.clearPreviewCart();
	}

}
// установка превью корзины
function initPreviewCart(cart) {
	// проверка 
	if (cart) {
		cartPreviewView.renderPreviewCart(cartModel.getCurrentProducts(), cart);
	} else {
		console.log('корзина пуста');
	}

}

// реагирование на событие storage
window.onstorage = event => {
	//initCart(JSON.parse(event.newValue));
	initProduct(JSON.parse(event.newValue));
}
///////////////////////////
// клик на кнопке добавить в корзину
function cardBtnClick(id) {
	//console.log(id);
	if (cart[id] == undefined) {
		//если нет в корзине такого товара
		cart[id] = 1;
		storage.setCartStorage(cart);
		cartModel.setCart(cart); //


		storage.getCurrentProducts(cart).then((result) => {
			if (result === undefined) {
				console.log('массив undefined!');
				productView.errorProduct();
			} else {
				productView.notErrorProduct();
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
		cartPreviewView.updatePreviewCartItem(currentArr, id, cart[id], '.js-sidebar-cart__quantity');
	}
}