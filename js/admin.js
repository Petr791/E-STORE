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


	///////////////////////
}
//addCatalogForFirebase();