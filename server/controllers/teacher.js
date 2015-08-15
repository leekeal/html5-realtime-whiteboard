

exports.lessonStatus = function *(){
	var classroom = yield this.db.classroom.findOne({teacher:this.session.user});
	if(!classroom){
		this.body = {error:'class is not exist!'};
		return;
	}

	this.body = classroom;


}