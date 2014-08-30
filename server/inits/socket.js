var cookie = require('cookie');
var co = require('co');
module.exports = function(server,sockets,sessionDb){
	var io = require('socket.io')(server);

	io.use(function (socket,next){

		if(!socket.request.headers.cookie){
			return next();
		}
		var cookies = cookie.parse(socket.request.headers.cookie);
		var sid = cookies['lesson'];
		co(function *(){
			var session = yield sessionDb.findOne({_id:sid});
			if(!session){
				socket.emit('auth',{error:'not login'})
				return next()
			}
			socket.session = session.sess;
			sockets[session.sess.user] = socket.id;
			next()
		})();
	})

	return io;

}