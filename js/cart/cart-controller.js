import {
	USER_ID_STRING,
	CART_STRING,
	ERROR_CART_STRING,
	CART_TITLE_STRING,
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
} from './cart-model.js';
import {
	createCartPreviewView
} from './cart-preview-view.js';
///////////////////
import {
	createCartView
} from './cart-view.js';



////////////////////////////  ///
let cart = {};

const storage = createStorage(USER_ID_STRING, CART_STRING);
const userModel = createUserModel();
const cartModel = createCartModel(cart);
const cartView = createCartView('.js-cart', ERROR_CART_STRING, minusBtnClick, plusBtnClick);
const cartPreviewView = createCartPreviewView('.js-sidebar-cart', '.js-sidebar__sum', '.js-sidebar');
//////////////////////////

init();

// инициализация
function init() {
	initUserID();
	initCart();
	cartSum();
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

function initCart() {
	if (storage.getCartStorage()) {
		// получаем корзину из сторадж
		cart = JSON.parse(storage.getCartStorage()); // без 
		cartModel.setCart(cart);

		// получаем товары корзины по id из базы
		storage.getCurrentProducts(cart).then((result) => {
			if (result === undefined) {
				console.log('массив === undefined');
				cartView.emptyCart();
				cartPreviewView.clearPreviewCart();
			} else {
				cartView.notEmptyCart();
				cartModel.setCurrentProducts(result);
				initProductsCart(cartModel.getCart());
				initPreviewCart(cartModel.getCart());
			};
		});

	} else {
		console.log('Корзина стала пустой!');
		// обнуление корзины везде
		cart = {};
		storage.setCartStorage(cart);
		cartPreviewView.clearPreviewCart();
		cartView.emptyCart(); //
	}

}

// проверка объекта на пустоту
function isEmpty(object) {
	for (var key in object)
		if (object.hasOwnProperty(key)) return true;
	return false;
}

/*  */
// установка товаров из корзины в лист
function initProductsCart(cart) {
	if (isEmpty(cart)) {
		console.log('Корзина не пуста!');
		cartView.renderCart(cartModel.getCurrentProducts(), cart);
		cartView.notEmptyCart();
	} else {
		// если изначально пуста cart = {}
		console.log('Корзина пуста!');
		cartView.emptyCart();
		cartPreviewView.clearPreviewCart();

	}
}

// установка превью корзины
function initPreviewCart(cart) {
	if (cart) {
		cartPreviewView.renderPreviewCart(cartModel.getCurrentProducts(), cart);
		cartSum();
	} else {
		console.log('Корзина пуста! превью');
		cartPreviewView.clearPreviewCart();
		cartPreviewView.clearPreviewSum();
	}
}

// реагирование на событие storage
window.onstorage = event => {
	console.log(event);
	initCart(JSON.parse(event.newValue));
	cartSum(JSON.parse(event.newValue));
}
// клик товар плюс
function plusBtnClick(id) {
	cart[id]++;
	storage.setCartStorage(cart);
	cartModel.setCart(cart); //
	const currentArr = cartModel.getCurrentProducts();
	cartView.updateCartItem(currentArr, id, cart[id], '.js-cart-row__quantity', '.js-cart-btn__quantity');
	cartPreviewView.updatePreviewCartItem(currentArr, id, cart[id], '.js-sidebar-cart__quantity');
	cartSum();
}
// клик товар минус ?
function minusBtnClick(id) {
	if (cart[id] == 1) {
		// удаляем из корзины
		delete cart[id];
		// проверка на пустоту
		if (isEmpty(cart)) {
			console.log('Корзина не пуста!');
			storage.setCartStorage(cart);
			cartModel.setCart(cart); //
			const currentArr = cartModel.getCurrentProducts();
			cartView.renderCart(currentArr, cartModel.getCart());
			cartPreviewView.renderPreviewCart(currentArr, cartModel.getCart());
			cartSum();
		} else {
			// корзина после нажатия стала пустой  cart = {}
			console.log('Корзина стала пустой!');
			storage.setCartStorage(cart); //и для страницы товара
			cartView.emptyCart();
			cartPreviewView.clearPreviewCart();
			cartPreviewView.clearPreviewSum();

		}

	} else {
		// уменьшаем на один
		cart[id]--;
		storage.setCartStorage(cart);
		cartModel.setCart(cart); //
		const currentArr = cartModel.getCurrentProducts();
		cartView.updateCartItem(currentArr, id, cart[id], '.js-cart-row__quantity', '.js-cart-btn__quantity');
		cartPreviewView.updatePreviewCartItem(currentArr, id, cart[id], '.js-sidebar-cart__quantity');
		cartSum();
	}
}

function cartSum() {
	const sum = cartModel.getSum(cartModel.getCart());
	cartPreviewView.renderSum(sum);
}