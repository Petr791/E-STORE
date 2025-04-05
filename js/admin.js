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

// Your web app's Firebase configuration
/* const firebaseConfig = {
	apiKey: "AIzaSyC8flbqDbNsONFstirgvD5Ri-v9Ygjke3s",
	authDomain: "e-store-6fe7e.firebaseapp.com",
	projectId: "e-store-6fe7e",
	storageBucket: "e-store-6fe7e.firebasestorage.app",
	messagingSenderId: "614303887434",
	appId: "1:614303887434:web:a2f59930baa1a9795676b3"
};
 */

const firebaseConfig = {
	apiKey: "AIzaSyCUvnvumhvzXu6gOx3HkUTLYqfsfs0hNRA",
	authDomain: "e-store-5d30f.firebaseapp.com",
	projectId: "e-store-5d30f",
	storageBucket: "e-store-5d30f.firebasestorage.app",
	messagingSenderId: "573198880420",
	appId: "1:573198880420:web:3ffbdf489182fe5ee62031"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//console.log(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
//////////////////////////////////

//console.log('all!');

//////////////////////////////

export function addCatalogForFirebase(products) {
	console.log('admin.js');

	//const app = initializeApp(firebaseConfig);
	//console.log(app);

	// Initialize Cloud Firestore and get a reference to the service
	//const db = getFirestore(app);
	//console.log(app);


	async function addData() {
		try {
			const docRef = await addDoc(collection(db, "testcol"), {
				title: 'Задача 3',
				status: 'active'

			});
			console.log("Документ записан с ID: ", docRef.id);
		} catch (e) {
			console.error("Ошибка при добавлении документа: ", e);
		}

	}


	async function getData() {

		const querySnapshot = await getDocs(collection(db, "testcol"));
		querySnapshot.forEach((doc) => {
			console.log(`${doc.id} => ${doc.data().title}`);
		});


	}

	//addData();
	//getData();
	////////////////////////////////////////


	//for (let item of myArr) {}
	// запись товаров в базу

	async function setProductsStorage(products) {

		console.log(products);
		for (let product of products) {

			try {
				const docRef = await setDoc(doc(db, "products", product.id), {
					id: product.id,
					imgUrl: product.imgUrl,
					title: product.title,
					subtitle: product.subtitle,
					price: product.price,
					rating: product.rating,
					shortDesc: product.shortDesc,
					longDesc: product.longDesc,
					createdAt: serverTimestamp()
				});
				//console.log("Document written with ID: ", docRef.id);
				console.log("Документ записан с ID: ", docRef);
			} catch (e) {
				console.error("Ошибка при добавлении документа: ", e);
			}

		}
	}


	//setProductsStorage(products);

	/******************************* */


	// получение товаров из базы для каталога
	async function getProductsStorage() {
		const productsRef = collection(db, "products");
		const q = query(productsRef, orderBy('createdAt'), limit(9)); // лимит
		//const q = query(ref, orderBy('createdAt', 'desc')); // обратная сортировка
		//const q = query(ref, orderBy('createdAt')); // вывод по дате

		const querySnapshot = await getDocs(q);
		//console.log(typeof querySnapshot);
		//console.log(querySnapshot);

		const productsArray = [];


		querySnapshot.forEach((doc) => {

			//console.log(doc.id);
			//console.log(doc.data().title);

			productsArray.push({
				id: doc.id,
				imgUrl: doc.imgUrl,
				title: doc.data().title,
				subTitle: doc.data().subTitle,
				price: doc.data().price
				//rating: doc.data().rating,
				//shortDesc: doc.data().shortDesc
			});
		});


		//const docRef = doc(db, "cities", "SF");
		//const docSnap = await getDoc(docRef);

		/* const querySnapshot = await getDocs(collection(db, "cities"));
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, " => ", doc.data());
		}); */




		/* if (querySnapshot.exists()) {
			console.log("Данные документов:", querySnapshot.data());
		} else {
			// docSnap.data() will be undefined in this case
			console.log("Tаких документов нет!");
		} */




		//return productsArray;
	}

	//getProductsStorage();
	///////////////////////////////////////////////
	let cart = JSON.parse(localStorage.getItem('cart'));
	console.log(cart);

	async function getCartItems(cart) {

		let cartArr = [];

		for (let key in cart) {

			const docRef = doc(db, "products", key);
			const docSnap = await getDoc(docRef);
			console.log(docSnap.id);
			console.log(docSnap.data());
			cartArr.push(docSnap.data());


			if (docSnap.exists()) {
				// console.log("Данные документа:", docSnap.data());
			} else {
				// docSnap.data() will be undefined in this case
				// console.log("Tакого документа нет!");
			}
		}
		console.log(cartArr);
	}

	//getCartItems(cart);
	///////////////////////////////////////////////////////




	// получение товаров из базы для каталога
	async function getAllUsers() {
		//const productsRef = collection(db, "products");
		const productsRef = collection(db, "testcol");
		const q = query(productsRef, orderBy('createdAt')); //
		//const q = query(ref, orderBy('createdAt', 'desc')); // обратная сортировка
		//const q = query(ref, orderBy('createdAt')); // вывод по дате

		const querySnapshot = await getDocs(q);
		//console.log(typeof querySnapshot);
		//console.log(querySnapshot);
		const productsArray = [];

		console.log(querySnapshot);
		querySnapshot.forEach((doc) => {

			console.log(doc.id);
			console.log(doc.data());
			//console.log(doc.data().title);

			/*   productsArray.push({
			      id: doc.id,
			      imgUrl: doc.imgUrl,
			      title: doc.data().title,
			      subTitle: doc.data().subTitle,
			      price: doc.data().price
			          //rating: doc.data().rating,
			          //shortDesc: doc.data().shortDesc
			  }); */
		});



		//*************************** */
		//const docRef = doc(db, "cities", "SF");
		//const docSnap = await getDoc(docRef);

		/* const querySnapshot = await getDocs(collection(db, "cities"));
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			console.log(doc.id, " => ", doc.data());
		}); */

	}

	// getAllUsers();



	async function getOrder() {
		const docRef = doc(db, "users", 'testid-1');
		const docSnap = await getDoc(docRef);

		console.log(docSnap.id);
		console.log(docSnap.data());
	}

	//getOrder();

	async function getUsers() {

		const querySnapshot = await getDocs(collection(db, "users"));
		querySnapshot.forEach((doc) => {
			//console.log(`${doc.id} => ${doc.data().status}`);
			console.log(`${doc.id} => userID`);
		});

	}

	//getUsers();

	/////////////////////////////////////////


	async function addOrder() {
		try {
			const docRef = await addDoc(collection(db, "users"), {
				title: 'Задача 3',
				status: 'active'

			});
			console.log("Document written with ID: ", docRef.id);
		} catch (e) {
			console.error("Error adding document: ", e);
		}
	}



	/////////////////////////////




	// Функция для добавления объекта в документ или создания нового документа
	async function addObjectToDocument(userID) {
		// Получаем ссылку на документ
		const documentRef = doc(db, "users", userID);


		/*  const obj = {
		     field3: "value1",
		     field4: "value2"
		 }; */

		/*  const orderObj = {
		     orderID: 11111111
		 }
		 const orderID = orderObj.orderID; */

		const myObj = {
			id: '11111111',
			key1: 'wwwww',
			address: {
				name: 'Tad',
				line: 'Тверская 1',
				city: 'Moscow',
				tel: '+7999999999'
			},
			cart: {
				'1001': '1',
				'1002': '2'
			},
			status: 'new',
			delevery: 6
		};





		try {
			// Используем setDoc с merge: true
			await setDoc(documentRef, myObj, {
				merge: true
			});
			console.log("Объект успешно добавлен или обновлен в документе.");
		} catch (error) {
			console.error("Ошибка при добавлении объекта в документ:", error);
		}
	}

	const userID = 'user22222'
	//addObjectToDocument(userID);

	// Пример использования
	const collectionName = "yourCollection"; // Замените на имя вашей коллекции
	const docId = "yourDocumentId"; // Замените на ID документа
	const objToAdd = {
		field1: "value1",
		field2: "value2"
	};

	//addObjectToDocument(collectionName, docId, objToAdd);

	///////////////////////

	// запись фильма в базу
	//async function setOrderStorage(movie) {
	async function setOrderStorage() {

		const myObj = {
			id: '11111111',
			key1: 'wwwww',
			address: {
				name: 'Tad',
				line: 'Тверская 1',
				city: 'Moscow',
				tel: '+7999999999'
			},
			cart: {
				'1001': '1',
				'1002': '2'
			},
			status: 'new',
			delevery: 6
		};



		try {
			await setDoc(doc(db, "users", myObj.id), {
				delevery: myObj.delevery,
				status: myObj.status,
				createdAt: serverTimestamp()
			});
			//console.log("Document written with ID: ", docRef.id);
		} catch (e) {
			console.error("Error adding document: ", e);
		}
	}


	//setOrderStorage();

	/**/ ////////////////////////////////////// */




	// Функция для добавления объекта в коллекцию orders
	async function addOrderToUser(userId, order) {
		const userDocRef = doc(db, "users", userId);

		// Проверяем, существует ли документ пользователя
		// userID пользователя
		const userDoc = await getDoc(userDocRef);

		if (userDoc.exists()) {
			// Документ существует, добавляем объект в коллекцию orders
			const ordersCollectionRef = collection(userDocRef, "orders");
			await addDoc(ordersCollectionRef, order);
			console.log("Order added to existing user:", userId);
		} else {
			// Документ не существует, создаем пользователя и добавляем orders
			await setDoc(userDocRef, {}); // Создаем пустой документ если нужно
			const ordersCollectionRef = collection(userDocRef, "orders");
			await addDoc(ordersCollectionRef, order);
			console.log("User created and order added:", userId);
		}
	}


	// Пример использования функции
	//const userId = "33333"; // ID пользователя
	const newOrder = {
		id: '100104',
		item: "Item name",
		quantity: 2,
		price: 30.00
	};

	//  addOrderToUser(userId, newOrder)
	//      .catch(error => console.error("Error adding order:", error));

	///////////////////////////////////////////////////


	async function addOrUpdateDocument() {


		const userId = "user123"; // Замените на ваш userId
		const newDocId = "100112"; // Замените на ваш newDocId
		const obj = {
			key: "value"
		}; // Объект, который вы хотите добавить



		const userDocRef = doc(db, "users", userId);
		const newDocRef = doc(userDocRef, newDocId);

		try {
			// Проверяем, существует ли документ user с таким userId
			const userDocSnapshot = await getDoc(userDocRef);

			if (userDocSnapshot.exists()) {
				// Если пользователь существует, обновляем документ
				await setDoc(newDocRef, obj);
				console.log(`Документ ${newDocId} добавлен в документ пользователя с id ${userId}`);
			} else {
				// Если пользователь не существует, создаем нового пользователя и добавляем документ
				await setDoc(userDocRef, {}); // Создаем пустой документ пользователя
				await setDoc(newDocRef, obj); // Добавляем новый документ
				console.log(`Документ пользователя с id ${userId} создан, и документ ${newDocId} добавлен`);
			}
		} catch (error) {
			console.error("Ошибка при добавлении или обновлении документа: ", error);
		}
	}

	//addOrUpdateDocument();

	// Пример использования функции
	//  const userId = "user123"; // Замените на ваш userId
	//  const newDocId = "doc456"; // Замените на ваш newDocId
	//  const data = {
	//      key: "value"
	//  }; // Объект, который вы хотите добавить

	//addOrUpdateDocument(userId, newDocId, data);
	//addOrUpdateDocument();

	///////////////////////////////////////////////////////////////







	// Функция для добавления документа
	async function addOrder(userId, orderId, orderData) {
		try {
			// Ссылка на документ пользователя
			const userDocRef = doc(db, 'users', userId);

			// Проверяем, существует ли пользователь
			const userDocSnapshot = await getDoc(userDocRef);

			if (userDocSnapshot.exists()) {
				// Документ пользователя существует
				const ordersCollectionRef = collection(userDocRef, 'orders');
				await addDoc(ordersCollectionRef, {
					id: orderId,
					...orderData
				});
				console.log('Order added to existing user');
			} else {
				// Документ пользователя не существует, создаем его
				await setDoc(userDocRef, {
					/* Вы можете указать дополнительные параметры пользователя */
				});
				console.log('User created');

				// Теперь создаем коллекцию orders и добавляем заказ
				const ordersCollectionRef = collection(userDocRef, 'orders');
				await addDoc(ordersCollectionRef, {
					id: orderId,
					...orderData
				});
				console.log('Order added to new user');
			}
		} catch (error) {
			console.error('Error adding order: ', error);
		}
	}

	// Пример использования функции
	// const userId = '1001222222'; // ID пользователя
	// const orderId = '100108'; // ID заказа
	// const orderData = {
	//    item: 'Example Item',
	//     quantity: 1
	// }; // Данные заказа

	//addOrder(userId, orderId, orderData);






	//////////////////////////////////////////////////


	async function addOrder(userId, newID, orderData) {
		// Получаем ссылку на документ пользователя
		const userRef = doc(db, 'users', userId);

		// Проверяем, существует ли документ пользователя
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			// Если документ существует, добавляем новый документ в подколлекцию orders
			const ordersRef = collection(userRef, 'orders');
			await setDoc(doc(ordersRef, newID), orderData);
			console.log(`Документ с ID ${newID} успешно добавлен в подколлекцию orders.`);
		} else {
			// Если документ не существует, создаём его и добавляем подколлекцию orders
			await setDoc(userRef, {}); // Создаём пустой документ пользователя

			const ordersRef = collection(userRef, 'orders');
			await setDoc(doc(ordersRef, newID), orderData);
			console.log(`Документ с ID ${userId} создан. Документ с ID ${newID} добавлен в подколлекцию orders.`);
		}
	}

	// Пример использования функции
	const userId = 'user126'; // ID пользователя
	const newID = '100106'; // ID нового заказа
	/* const orderData = {
        id: '100105',
        item: 'Pizza',
        quantity: 2,
        price: 20
    }; // Данные заказа
 */

	const myObj = {
		id: '111555',
		key1: 'wwwww',
		address: {
			name: 'Tad',
			line: 'Тверская 1',
			city: 'Moscow',
			tel: '+7999999999'
		},
		cart: {
			'1001': '3',
			'1002': '2'
		},
		status: 'new',
		delevery: 6,
		createdAt: serverTimestamp()
	};


	/* addOrder(userId, newID, myObj)
		.then(() => {
			console.log('Операция завершена успешно.');
		})
		.catch((error) => {
			console.error('Ошибка при добавлении заказа:', error);
		});
 */



	/////////////////////////////////////////////////////////////////
	async function getAllOrderIds() {
		try {
			// Массив для хранения всех ID заказов
			const allOrderIds = [];

			// Получаем все документы из коллекции users
			const usersSnapshot = await getDocs(collection(db, "users"));

			// Итерируемся по каждому документу в коллекции users
			for (const userDoc of usersSnapshot.docs) {
				const userId = userDoc.id; // ID текущего пользователя
				console.log(`Обработка пользователя: ${userId}`);

				// Получаем коллекцию orders для каждого пользователя
				const ordersSnapshot = await getDocs(collection(db, `users/${userId}/orders`));

				// Итерируемся по каждому документу в коллекции orders
				for (const orderDoc of ordersSnapshot.docs) {
					allOrderIds.push(orderDoc.id); // Сохраняем ID заказа в общий массив
				}
			}

			console.log("Все ID заказов:", allOrderIds);
			return allOrderIds;

		} catch (error) {
			console.error("Ошибка при получении ID заказов:", error);
		}
	}

	// Вызываем функцию
	//getAllOrderIds();
	//////////////////////////////////////////////

	async function getOrderIds() {

		const userId = '0.10205233170073291';

		try {
			// Получаем документ пользователя с id user1
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

			console.log(sortedOrderIds);

			return sortedOrderIds; // Возвращаем массив id в порядке создания
		} catch (error) {
			console.error("Error getting documents: ", error);
		}
	}

	// Вызов функции для получения id заказов
	//getOrderIds();



	// Функция для получения документа order1
	async function getOrder() {


		const userId = '0.10205233170073291';
		const orderId = '100101';



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
				} else {
					console.log("Документ заказа не найден");
				}
			} else {
				console.log("Документ пользователя не найден");
			}
		} catch (error) {
			console.error("Ошибка при получении документа:", error);
		}
	}

	// Вызов функции
	//getOrder();







	///////////////////////////////////
	// test1
	async function addData1() {
		try {
			const testRef = collection(db, "testcol");

			await setDoc(doc(testRef, "SF"), {
				name: "San Francisco",
				state: "CA",
				country: "USA",
				capital: false,
				population: 860000,
				regions: ["west_coast", "norcal"]
			});
			console.log("Document written with ID: ", testRef.id);
		} catch (e) {
			console.error("Error adding document: ", e);
		}
	}
	// test1
	async function getData1() {
		const docRef = doc(db, "testcol", "doc1");
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log("Данные документа:", docSnap.data());
		} else {
			// docSnap.data() will be undefined in this case
			console.log("Tакого документа нет!");
		}
	}

	//addData1();
	//getData1();



	///////////////////////
}
//addCatalogForFirebase();