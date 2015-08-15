var koa = require('koa');
var serve = require('koa-static');
var router = require('koa-router');
var koa_nedb_session = require('./server/libs/koa-session-nedb');


var app = koa();


//init database
var db = require('./server/inits/databases')(app)


app.keys = ['asdfasdfas', 'asdfasdf'];
app.use(koa_nedb_session({
	store:db.session,
	key:'lesson',
	prefix:'', 
}));



/*
** init body
*/
var koaBody = require('koa-body')();
app.use(koaBody);
app.use(function *(next){
	this._post = this.request.body
	yield next;
});


app.use(function *(next){
	// console.log(this.session);
	if (this.url == '/' || this.url == '/api/status'){
		yield next;
	}
	else if(this.session.user) {
		if(this.url == '/api/login') {
			this.body = "online";
		}else {
			yield next;
		}
	}else {
		var url = this.url.split("/")
		if (this.url == '/api/login') {
			yield next;
		}else if (url[1] == 'api'){
			this.status = 403;
			this.body = "offline";
		}else {
			yield next;
		}

	}
})



app.use(router(app));
app.use(serve('./public'));

/*
** load controllers
*/
require('./server/router')(app);



var server = require('http').Server(app.callback());

var sockets = {};
var io = require('./server/inits/socket')(server,sockets,db.session);
require('./server/socket-ctrls/index')(io,db)

server.listen(5000);
console.info('Now running on localhost:5000');