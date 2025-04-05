export function createUserModel() {
	//console.log('createUserModel');
	let userId = null;
	return {
		userId,
		setUserID: function (userId) {
			this.userId = userId;
		},
		getUserID: function () {
			return this.userId;
		}
	};

};