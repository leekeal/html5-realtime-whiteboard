
exports.register = function *(){

	var user = this._post || {};

	if(!user.username || !user.password) {
		this.body = { error:'Registration information is incomplete!' }
		return;
	}

	var result = yield this.db.users.findOne( { username: user.username } );
	console.log(result);

	if (result) {
		this.body = { error : 'Username already exists!' };
		return;
	}

	var result = yield this.db.users.insert(user);

	if (!result) {
		this.body = { error : 'System error!' };
	}

	this.body = result;

}



exports.login = function *(){
	var user = this._post || {}; 

	if(!user.username || !user.password){
		this.body = {error:'Registration information is incomplete!'}
		return; 
	}
	var result = yield this.db.users.findOne( { username: user.username } );
	if(!result){
		this.body = {error : 'username is not exists!'}
		return;
	}
	console.log(result);
	if(result.password != user.password){
		this.body = {error : 'password is wrong!'};
		return;
	}


	this.session.user = result.username;
	this.body = result;


}

exports.logout = function *(){
	this.session = null;
	this.body = "logout success" 
}


exports.list = function *(){

	this.body = 'user list' 
}

exports.status = function *(){

	if(this.session.user){
		this.body = {user:this.session.user};
	}else{
		this.body = {offline:'offline'}
	}
}










