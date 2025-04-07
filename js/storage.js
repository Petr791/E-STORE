import {
	initializeApp
}
from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';

import {
	getFirestore
}
from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

import {
	collection,
	addDoc,
	getDocs,
	doc,
	setDoc,
	getDoc,
	//getCollections,
	query,
	serverTimestamp,
	orderBy,
	updateDoc,
	writeBatch,
	limit

}
from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';


const firebaseConfig = {
	apiKey: "AIzaSyCUvnvumhvzXu6gOx3HkUTLYqfsfs0hNRA",
	authDomain: "e-store-5d30f.firebaseapp.com",
	projectId: "e-store-5d30f",
	storageBucket: "e-store-5d30f.firebasestorage.app",
	messagingSenderId: "573198880420",
	appId: "1:573198880420:web:3ffbdf489182fe5ee62031"
};


//////////////////////////////////////

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


export function createStorage(USER_ID_STRING, CART_STRING) {
	//console.log('createStorage');

	let testOrdersArray = [];
	return {
		userID: USER_ID_STRING,
		key: CART_STRING,
		// установка userid
		setUserIDStorage: function (userID) {
			const userIdString = JSON.stringify(userID);
			localStorage.setItem(this.userID, userIdString);

		},
		// получение userid
		getUserIDStorage: function () {
			const userIdFromStorage = JSON.parse(localStorage.getItem(this.userID));
			return userIdFromStorage;
		},
		/////////////////////////
		// страница каталога товаров

		// получение массива из базы для каталога
		getStorageProducts: async function () {
			const productsArray = [];
			const productsRef = collection(db, "products");
			const q = query(productsRef, orderBy('createdAt'), limit(9)); // лимит
			const querySnapshot = await getDocs(q);
			querySnapshot.forEach((doc) => {

				productsArray.push({
					id: doc.id,
					imgUrl: doc.data().imgUrl,
					title: doc.data().title,
					subtitle: doc.data().subtitle,
					price: doc.data().price
				});
			});
			return productsArray;
		},

		///////////////////////////////
		// страница корзины и превью корзины
		// установка корзины
		setCartStorage: function (cart) {
			localStorage.setItem(this.key, JSON.stringify(cart));
		},
		// получение корзины
		getCartStorage: function () {
			return localStorage.getItem(this.key);
		},
		// получение для превью товаров корзины по id из базы
		getCurrentProducts: async function (cart) {

			let cartArr = [];
			for (let key in cart) {
				const docRef = doc(db, "products", key);
				const docSnap = await getDoc(docRef);
				cartArr.push(docSnap.data());

				if (docSnap.exists()) {
					// console.log("Данные документа:", docSnap.data());
				} else {
					// docSnap.data() will be undefined in this case
					// console.log("Tакого документа нет!");
				}
			}
			return cartArr;
		},
		///////////////////////
		// страница товара
		getCurrentProduct: async function (productId) {
			let newProduct = null;
			const docRef = doc(db, "products", productId);
			const docSnap = await getDoc(docRef);

			if (docSnap.data() == null) {
				console.log("Tакого товара нет!");
			} else {
				newProduct = {
					id: docSnap.id,
					imgUrl: docSnap.data().imgUrl,
					title: docSnap.data().title,
					subtitle: docSnap.data().subtitle,
					price: docSnap.data().price,
					rating: docSnap.data().rating,
					shortDesc: docSnap.data().shortDesc,
					longDesc: docSnap.data().longDesc
				};

			}
			if (docSnap.exists()) {
				console.log("Данные документа:", docSnap.data());
			} else {
				// docSnap.data() will be undefined in this case
				console.log("Tакого документа нет!");
			}
			return newProduct;
		},
		/////////////////////////////////
		// страница оформления заказа

		//добавление заказа
		addOrder: async function (order) {

			const newID = order.id; // ID нового заказа
			const userId = this.getUserIDStorage();
			//console.log(userId + '--' + newID);
			const myObj = {
				userId: userId,
				id: order.id,
				address: order.adress,
				payment: order.payment,
				products: order.products,
				status: 'new',
				delevery: 6,
				createdAt: serverTimestamp()
			};

			// Получаем ссылку на документ пользователя
			const userRef = doc(db, 'users', userId);
			// Проверяем, существует ли документ пользователя
			const userDoc = await getDoc(userRef);

			if (userDoc.exists()) {
				// Если документ существует, добавляем новый документ в подколлекцию orders
				const ordersRef = collection(userRef, 'orders');
				await setDoc(doc(ordersRef, newID), myObj);
				console.log(`Документ с ID ${newID} успешно добавлен в подколлекцию orders.`);
			} else {
				// Если документ не существует, создаём его и добавляем подколлекцию orders
				await setDoc(userRef, {}); // Создаём пустой документ пользователя

				const ordersRef = collection(userRef, 'orders');
				await setDoc(doc(ordersRef, newID), myObj);
				console.log(`Документ с ID ${userId} создан. Документ с ID ${newID} добавлен в подколлекцию orders.`);
			}
		},

		////////////////////

		// страница заказа

		// получение всех  номеров заказов всех пользователей
		//*
		getStorageAllUsersOrders: async function () {

			try {
				// Массив для хранения всех ID заказов
				const allOrderIds = [];

				// Получаем все документы из коллекции users
				const usersSnapshot = await getDocs(collection(db, "users"));

				// Итерируемся по каждому документу в коллекции users
				for (const userDoc of usersSnapshot.docs) {
					const userId = userDoc.id; // ID текущего пользователя
					//console.log(`Обработка пользователя: ${userId}`);

					// Получаем коллекцию orders для каждого пользователя
					const ordersSnapshot = await getDocs(collection(db, `users/${userId}/orders`));

					// Итерируемся по каждому документу в коллекции orders
					for (const orderDoc of ordersSnapshot.docs) {
						allOrderIds.push(orderDoc.id); // Сохраняем ID заказа в общий массив
					}
				}

				return allOrderIds;

			} catch (error) {
				console.error("Ошибка при получении ID заказов:", error);
			}
			return allOrderIds;
		},
		// получение всех  номеров заказов пользователя для превью
		getStorageAllOrders: async function (currentUserID) {

			const userId = currentUserID;

			try {
				// Получаем документ пользователя с id userId
				const userDocRef = doc(db, 'users', userId);

				// Получаем коллекцию orders внутри этого документа
				const ordersCollectionRef = collection(userDocRef, 'orders');

				// Получаем все документы из коллекции orders
				const orderDocsSnapshot = await getDocs(ordersCollectionRef);

				// Создаем массив для хранения id документов
				const orderIds = [];

				// Перебираем документы, чтобы получить их id и дату создания
				orderDocsSnapshot.docs.forEach(doc => {
					orderIds.push({
						id: doc.id,
						createdAt: doc.data().createdAt
					});
				});

				// Сортируем массив по дате создания (предполагая, что у вас есть поле createdAt)
				orderIds.sort((a, b) => a.createdAt - b.createdAt);

				// Получаем только id в нужном порядке
				const sortedOrderIds = orderIds.map(order => order.id);
				return sortedOrderIds; // Возвращаем массив id в порядке создания
			} catch (error) {
				console.error("Error getting documents: ", error);
			}

		},

		////////////////////////////
		// выбранный заказ для страницы заказа
		getCurrentOrder: async function (currentOrderId, currentUserID) {

			let newOrder = null;
			const userId = currentUserID;
			const orderId = currentOrderId;

			try {
				// Ссылка на документ user1 в коллекции users
				const userRef = doc(db, "users", userId);

				// Получаем документ user1
				const userDoc = await getDoc(userRef);

				if (userDoc.exists()) {
					console.log("Документ пользователя найден:", userDoc.data());

					// Ссылка на документ order1 в коллекции orders, которая находится в user1
					const orderRef = doc(userRef, "orders", orderId);

					// Получаем документ order1
					const orderDoc = await getDoc(orderRef);

					if (orderDoc.exists()) {
						console.log("Документ заказа найден:", orderDoc.data());
						newOrder = orderDoc.data();
					} else {
						console.log("Документ заказа не найден");
					}
				} else {
					console.log("Документ пользователя не найден");
				}
			} catch (error) {
				console.error("Ошибка при получении документа:", error);
			}

			return newOrder;
			//
		}


	}
}