const titleWrapperNode = document.querySelector('.js-page__title-wrapper');
const checkoutTitleNode = document.querySelector('.js-checkout__title');
const checkoutBoxInnerNode = document.querySelector('.checkout-box__inner');
const sidebarNode = document.querySelector('.js-sidebar');

const bodyNode = document.querySelector('body');
const popupNode = document.querySelector('.js-order-popup');
//
const popupContentNode = document.querySelector('.js-popup__content')
const btnCloseNode = document.querySelector('.js-popup__close-btn');
//
const popupAddressNode = document.querySelector('.js-popup-address');
const popupPaymentNode = document.querySelector('.js-popup-payment');
const addressFormBtnNode = document.querySelector('.js-btn-address');
const paymentFormBtnNode = document.querySelector('.js-btn-payment');

// address nodes
const addressNameNode = document.querySelector('.js-address__name');
const addressHouseNode = document.querySelector('.js-address__line');
const addressCityNode = document.querySelector('.js-address__city');
const addressTelNode = document.querySelector('.js-address__tel');

const paymentMethodNode = document.querySelector('.js-payment__method');
// poppup form inputs
const inputNameNode = document.querySelector('#input-name');
const inputLineNode = document.querySelector('#input-line');
const inputCityNode = document.querySelector('#input-city');
const inputPhoneNode = document.querySelector('#input-phone');
// poppup form validation text node
const validationNameNode = document.querySelector('.js-popup__validation--name');
const validationLineNode = document.querySelector('.js-popup__validation--line');
const validationCityNode = document.querySelector('.js-popup__validation--city');
const validationPhoneNode = document.querySelector('.js-popup__validation--phone');


export function createCheckoutView(selector_checkout_cart, selector_delivery, selector_payment, selector_checkout_btn, CHECKOUT_TITLE_STRING, onPlaycingOrder, onChangeOrderValues, POPUP_OPENED_CLASSNAME, BODY_FIXED_CLASSNAME) {

	const checkoutCartNode = document.querySelector(selector_checkout_cart);
	const deliveryBtnNode = document.querySelector(selector_delivery);
	const paymentBtnNode = document.querySelector(selector_payment);
	const checkoutBtnNode = document.querySelector(selector_checkout_btn);


	return {
		checkoutCartNode,
		deliveryBtnNode,
		paymentBtnNode,
		checkoutBtnNode,
		//вывод страницы заказа
		renderOrderCart: function (
			currentArr, cart) {
			this.clearCheckoutCart();

			for (let item of currentArr) {
				// передаем товар и количество 
				for (let cartId in cart) {
					if (item.id === cartId) {
						let quantity = cart[cartId];
						this.createOrderCartItem(item, checkoutCartNode, quantity);
					}
				}
			}
		},
		// создание карточки корзины заказа
		createOrderCartItem: function (item, cartListNode, quantity) {
			//создание элементов и их атрибутов
			const itemNode = document.createElement('li');
			itemNode.setAttribute('class', 'checkout-cart__item');
			itemNode.setAttribute('data-id', item.id);

			const imgWrapper = document.createElement('div');
			imgWrapper.setAttribute('class', 'cart-item__img-wrapper');

			const img = document.createElement('img');
			img.setAttribute('class', 'cart-item__img');
			img.setAttribute('src', item.imgUrl);
			img.setAttribute('alt', item.title);

			imgWrapper.append(img);
			itemNode.append(imgWrapper);
			//
			const cartBoxNode = document.createElement('div');
			cartBoxNode.setAttribute('class', 'cart-box');

			const titleNode = document.createElement('p');
			titleNode.setAttribute('class', 'cart-item__title');
			titleNode.innerHTML = item.title;

			const subtitleNode = document.createElement('p');
			subtitleNode.setAttribute('class', 'cart-item__subtitle');
			subtitleNode.innerHTML = item.subtitle;

			const descShortNode = document.createElement('p');
			descShortNode.setAttribute('class', 'cart-item__desc');
			descShortNode.innerHTML = item.shortDesc;

			cartBoxNode.append(titleNode);
			cartBoxNode.append(subtitleNode);
			cartBoxNode.append(descShortNode);

			itemNode.append(cartBoxNode);
			///////////////////////////////////////


			const ratingNode = document.createElement('div');
			ratingNode.setAttribute('class', 'cart-item__rating cart-rating');

			const ratingStarsNode = document.createElement('span');
			ratingStarsNode.setAttribute('class', 'cart-rating__stars');

			const ratingNambersNode = document.createElement('span');
			ratingNambersNode.setAttribute('class', 'cart-rating__numbers');
			ratingNambersNode.innerHTML = item.rating;

			//

			ratingNode.append(ratingStarsNode);
			ratingNode.append(ratingNambersNode);
			cartBoxNode.append(ratingNode);
			//

			const cartRowNode = document.createElement('div');
			cartRowNode.setAttribute('class', 'order-cart__row');
			//
			const cartPriceItemNode = document.createElement('div');
			cartPriceItemNode.setAttribute('class', 'cart-row__item price-wrapper');
			cartPriceItemNode.innerHTML = '$ ';

			const priceNode = document.createElement('span');
			priceNode.setAttribute('class', 'cart-row__price');
			priceNode.innerHTML = item.price;

			const symbolNode = document.createElement('span');
			symbolNode.setAttribute('class', 'cart-row__symbol');
			symbolNode.innerHTML = 'X';

			const itemQuantityNode = document.createElement('span');
			itemQuantityNode.setAttribute('class', 'js-cart-row__quantity cart-row__quantity');
			itemQuantityNode.innerHTML = quantity;

			const itemSumNode = document.createElement('span');
			itemSumNode.setAttribute('class', 'js-cart-row__sum cart-row__sum');

			const a = parseFloat(item.price.replace(/[^0-9.,]/gim, ''));
			const b = quantity;
			const sum = a * b;
			itemSumNode.innerHTML = ` &nbsp=&nbsp $ ${sum}`;


			cartPriceItemNode.append(priceNode);
			cartPriceItemNode.append(symbolNode);
			cartPriceItemNode.append(itemQuantityNode);
			cartPriceItemNode.append(itemSumNode);
			cartRowNode.append(cartPriceItemNode);
			//

			cartBoxNode.append(cartRowNode);

			cartBoxNode.append(cartRowNode);
			cartListNode.append(itemNode);

		},

		// очистка корзины заказа
		clearCheckoutCart: function () {
			this.clearCheckoutCart();
			this.checkoutCartNode.innerHTML = '';
		},
		// если корзина пуста
		emptyCart: function () {
			sidebarNode.classList.add('hide');
			checkoutBoxInnerNode.classList.add('hide');
			checkoutTitleNode.innerHTML = CHECKOUT_TITLE_STRING;
			titleWrapperNode.classList.remove('hide');
		},
		// если корзина не пуста
		notEmptyCart: function () {
			titleWrapperNode.classList.add('hide');
			sidebarNode.classList.remove('hide');
			checkoutBoxInnerNode.classList.remove('hide');
		},
		// размещение заказа
		activationPlaycingOrderBtn: function () {
			// клик на кнопке разместить
			this.checkoutBtnNode.onclick = () => {
				onPlaycingOrder();
			}
		},
		// создание заказа
		createOrder: function () {
			// получения значений
			const addressName = addressNameNode.textContent;
			const addressHouse = addressHouseNode.textContent;
			const addressCity = addressCityNode.textContent;
			const addressTel = addressTelNode.textContent;
			const paymentMethod = paymentMethodNode.textContent;

			const orderObj = {
				adress: {
					name: addressName,
					house: addressHouse,
					city: addressCity,
					tel: addressTel
				},
				payment: paymentMethod
			}
			return orderObj;
		},
		// проверка полей ввода и блокировка кнопки сохранить
		checkPopupInputsFields: function () {

			if (inputNameNode.value.trim() === '') {
				validationNameNode.classList.add('show');
				addressFormBtnNode.disabled = true;
				return false;
			} else {
				validationNameNode.classList.remove('show');
			}

			if (inputLineNode.value.trim() === '') {
				validationLineNode.classList.add('show');
				addressFormBtnNode.disabled = true;
				return false;
			} else {
				validationLineNode.classList.remove('show');
			}

			if (inputCityNode.value.trim() === '') {
				validationCityNode.classList.add('show');
				addressFormBtnNode.disabled = true;
				return false;
			} else {
				validationCityNode.classList.remove('show');
			}

			if (inputPhoneNode.value.trim() === '') {
				validationPhoneNode.classList.add('show');
				addressFormBtnNode.disabled = true;
				return false;
			} else {
				validationPhoneNode.classList.remove('show');
			}
			addressFormBtnNode.disabled = false;
			return true;
		},

		// установка значений в инпуты попапа
		setInputsValues: function () {
			inputNameNode.value = addressNameNode.textContent;
			inputLineNode.value = addressHouseNode.textContent;
			inputCityNode.value = addressCityNode.textContent;
			inputPhoneNode.value = addressTelNode.textContent;
			// проверка инпутов
			this.checkPopupInputsFields();
		},
		///////////////////////////////////////////
		// клик на кнопках изменить значения адреса и оплаты
		activationOrderButtons: function () {
			this.deliveryBtnNode.onclick = () => {
				onChangeOrderValues(event.target);
			}

			this.paymentBtnNode.onclick = (event) => {
				onChangeOrderValues(event.target);
			}
		},
		// реакция на клик при активном попапе
		popupClick: function () {
			popupNode.addEventListener('click', (event) => {
				// закрытие при клике вне popupContentNode
				const isClickOutsideContent = !event.composedPath().includes(popupContentNode)

				if (isClickOutsideContent) {
					this.togglePopup(event.target);
				}
			});
		},
		// показать и убрать попап
		togglePopup: function (elem) {
			popupNode.classList.toggle(POPUP_OPENED_CLASSNAME);
			bodyNode.classList.toggle(BODY_FIXED_CLASSNAME);

			// скрываем блоки попапа
			popupPaymentNode.classList.remove('show');
			popupAddressNode.classList.remove('show');

			if (elem.classList.contains('address__btn')) {
				// показываем блок с инпутами
				popupAddressNode.classList.add('show');
			}

			if (elem.classList.contains('payment__btn')) {
				// показываем блок с выбором оплаты
				popupPaymentNode.classList.add('show');
			}
		},
		// клик по кнопке закрыть попап
		closePopupBtn: function () {
			btnCloseNode.addEventListener('click', this.closePopup);
		},
		// закрытие попапа
		closePopup: function () {
			//console.log('close');
			popupNode.classList.toggle(POPUP_OPENED_CLASSNAME);
			bodyNode.classList.toggle(BODY_FIXED_CLASSNAME);
			popupPaymentNode.classList.remove('show');
			popupAddressNode.classList.remove('show');
		},
		// проверка инпутов при событии input
		checkFieldsWhenChanged: function () {
			inputNameNode.addEventListener('input', this.checkPopupInputsFields);
			inputLineNode.addEventListener('input', this.checkPopupInputsFields);
			inputCityNode.addEventListener('input', this.checkPopupInputsFields);
			inputPhoneNode.addEventListener('input', this.checkPopupInputsFields);
		},
		// попап кнопки сохранить установленные значения
		activationSaveBtns: function () {
			addressFormBtnNode.addEventListener('click', this.saveInputValues);
			paymentFormBtnNode.addEventListener('click', this.savePaymentValue);
		},
		// установка новых значений полей адреса
		saveInputValues: function () {
			addressNameNode.textContent = inputNameNode.value;
			addressHouseNode.textContent = inputLineNode.value;
			addressCityNode.textContent = inputCityNode.value;
			addressTelNode.textContent = inputPhoneNode.value;
			// закрытие попапа
			popupNode.classList.toggle(POPUP_OPENED_CLASSNAME);
			bodyNode.classList.toggle(BODY_FIXED_CLASSNAME);
		},
		/////////////////////////////////
		// сохранение значения способа оплаты
		savePaymentValue: function () {
			const selectedValue = document.querySelector('input[name="paymentGroup"]:checked').value;

			paymentMethodNode.innerHTML = selectedValue;
			// закрытие попапа
			popupNode.classList.toggle(POPUP_OPENED_CLASSNAME);
			bodyNode.classList.toggle(BODY_FIXED_CLASSNAME);
		},
		// первичная установка значения способа оплаты
		setPaymentValue: function () {
			const selectedValue = document.querySelector('input[name="paymentGroup"]:checked').value;
			paymentMethodNode.innerHTML = selectedValue;
		},
		/////////////////////////////////
		// вывод цены доставки
		renderDeliveryPrice: function (price, selector_Delivery_Price) {
			const node = document.querySelector(selector_Delivery_Price);
			node.innerHTML = price;
		},
		//вывод суммы товаров
		renderProductsSum: function (sum, selector_Products_Sum) {
			const node = document.querySelector(selector_Products_Sum);
			node.innerHTML = sum;
		},
		// вывод общей суммы
		renderTotalSum: function (total, selector_Total_Sum) {
			const node = document.querySelector(selector_Total_Sum);
			node.innerHTML = total;
		},
		goOrderPage: function (orderId) {
			const orderUrl = `./order.html?i=${orderId}`;
			//window.location.href = orderUrl;

			setTimeout(() => {
				window.location.href = orderUrl;
			}, 500);
		}

	};
}
