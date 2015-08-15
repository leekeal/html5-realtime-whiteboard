var ctrls = require('auto-loader').load(__dirname +'/controllers')




function api(url){
	var api = '/api/'
	return api + url;
}
module.exports = function(app){


	/*------------ user ------*/
	app.post(api('register'),ctrls.user.register)
	app.post(api('login'),ctrls.user.login)
	app.get(api('logout'),ctrls.user.logout)
	app.get(api('list'),ctrls.user.list)
	app.get(api('status'),ctrls.user.status)



	/*--------- teacher --------*/
	app.get(api('teacher/lesson-status'),ctrls.teacher.lessonStatus);

}