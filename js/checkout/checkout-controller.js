import {
	USER_ID_STRING,
	CART_STRING,
	ERROR_CHECKOUT_STRING,
	POPUP_OPENED_CLASSNAME,
	BODY_FIXED_CLASSNAME,
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
	createCheckoutModel
} from './checkout-model.js';
import {
	createCheckoutView
} from './checkout-view.js';





///////////////////////
//console.log('hello checkout!');

let cart = {};

const storage = createStorage(USER_ID_STRING, CART_STRING);
const userModel = createUserModel();
const checkoutModel = createCheckoutModel(DELIVERY_PRICE_NUMBER);
const checkoutView = createCheckoutView('.js-checkout-cart', '.js-address__btn', '.js-payment__btn', '.js-checkout__btn',
	ERROR_CHECKOUT_STRING, playcingOrder, changeOrderValues, POPUP_OPENED_CLASSNAME, BODY_FIXED_CLASSNAME);
/////////////////

init();

// инициализация
function init() {
	// получение userID
	initUserID();
	// получение и вывод корзины товаров заказа
	initOrderCart(); //
	// установка значений в инпуты попапа
	setPopupValues();
	// активация кнопок
	activationBtns();
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

// вывод товаров в заказ из корзины
function initOrderCart() {
	// если есть корзина в storage
	if (storage.getCartStorage()) {

		// получаем корзину из сторадж
		cart = JSON.parse(storage.getCartStorage());

		storage.getCurrentProducts(cart).then((result) => {
			if (result === undefined) {
				console.log('Корзина пуста!');
				checkoutView.emptyCart();
			} else {
				checkoutView.notEmptyCart();
				//console.log(result);

				// установка корзины из заказа id: количество
				checkoutModel.setOrderCart(cart);
				// передача массива товаров из корзины по id
				checkoutModel.setCurrentProducts(result);
				initOrderCartItems(checkoutModel.getOrderCart());


				// вывод цены доставки
				renderDeliveryPrice();
				// вывод суммы товаров в корзине
				renderProductsSum();
				// вывод общей суммы(товары и доставка)
				renderTotalSum();
			};
		});

	} else {
		console.log('Корзина стала пустой!');
		cart = {};
		storage.setCartStorage(cart);
		checkoutView.clearCheckoutCart();
		checkoutView.emptyCart();
	}
}
///////////////////////////////////
// изменение значений адреса и оплаты
function changeOrderValues(elem) {
	checkoutView.togglePopup(elem);
}
// установка начальных значений в попап
function setPopupValues() {
	checkoutView.setInputsValues();
	checkoutView.setPaymentValue();
}

// активация кнопок
function activationBtns() {
	// кнопка размещение заказа
	checkoutView.activationPlaycingOrderBtn();
	// кнопки изменить значения адреса и оплаты
	checkoutView.activationOrderButtons();
	// реакция на клик при активном попапе
	checkoutView.popupClick(); //
	// кнопка закрыть попап
	checkoutView.closePopupBtn();
	//  попап кнопки сохранить установленные значения
	checkoutView.activationSaveBtns();
	//проверка инпутов при событии input
	checkoutView.checkFieldsWhenChanged();
}

// установка товаров из корзины в лист
function initOrderCartItems(cart) {
	if (isEmpty(cart)) {
		//console.log('Корзина не пуста!');
		const currentArr = checkoutModel.getCurrentProducts();

		checkoutView.notEmptyCart();
		checkoutView.renderOrderCart(currentArr, cart);
	} else {
		// если корзина пуста cart = {}
		console.log('Корзина пуста!');
		checkoutView.emptyCart();
	}
}
// проверка объекта на пустоту
function isEmpty(object) {
	for (var key in object)
		if (object.hasOwnProperty(key)) return true;
	return false;
}
// реагирование на событие storage
window.onstorage = event => {
	initUserID(JSON.parse(event.newValue));
	initOrderCart(JSON.parse(event.newValue));
}

//////////////////////////////////
// добавление заказа
function playcingOrder() {
	// получаем объект нового заказа из view
	const order = checkoutView.createOrder(); //

	//все заказы всех пользователей
	storage.getStorageAllUsersOrders().then((result) => {
			//console.log('Операция завершена успешно.');
			//console.log(result);

			if (result === undefined) {
				console.log('result === undefined');
			} else {
				// все номера заказов всех пользователей
				checkoutModel.setAllUsersOrderNumbers(result); //

				// устанавливаем объект заказа и создаем очередной id заказа
				checkoutModel.setOrderObj(order);
				storage.addOrder(checkoutModel.getOrderObj()).then(() => {
						console.log('Операция добавления заказа завершена успешно.');
					})
					.catch((error) => {
						console.error('Ошибка при добавлении заказа:');
						//console.error('Ошибка при добавлении заказа:', error);
					});

				// очистка корзины
				console.log('Корзина стала пустой!');
				cart = {};
				storage.setCartStorage(cart);
				// переход на страницу созданного заказа
				const id = checkoutModel.getOrderNamber();
				checkoutView.goOrderPage(id)
				initOrderCart();
				console.log('===============');

				;
			}
		})
		.catch((error) => {
			console.error('при получении номеров заказов всех пользователей');
			//console.error('Ошибка при добавлении заказа:', error);
		});

}

///////////////////////////////
// вывод цены доставки
function renderDeliveryPrice() {
	checkoutView.renderDeliveryPrice(checkoutModel.getDeliveryPrice(), '.js-sidebar-row__delivery-price');
}
//вывод суммы товаров
function renderProductsSum() {
	checkoutView.renderProductsSum(checkoutModel.getProductsSum(checkoutModel.getOrderCart()), '.js-sidebar__products-sum');
}
// вывод общей суммы
function renderTotalSum() {
	checkoutView.renderTotalSum(checkoutModel.getTotalSum(), '.js-order-total__sum');
}
