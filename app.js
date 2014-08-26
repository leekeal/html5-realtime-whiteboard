var koa = require('koa');
var app = koa();
var serve = require('koa-static');
var router = require('koa-router');
var Datastore = require('nedb');
var wrap = require('co-nedb');

var koa_nedb_session = require('./server/inits/koa-session-nedb');
var sessionDb = new Datastore({ filename: 'server/stores/database.json',autoload: true });
var sessionDb = wrap(sessionDb);

app.keys = ['asdfasdfas', 'asdfasdf'];

var sockets = {};

app.use(koa_nedb_session({
	store:sessionDb,
	key:'linux-desktop',
	prefix:'', 
}));

app.use(function *(next){
	this.session.user = 'leeke'
	yield next
})
app.use(serve('./public'));
app.use(router(app));

var server = require('http').Server(app.callback());
var io = require('./server/inits/socket')(server,sockets,sessionDb);


var folderHander = require('./server/socket-ctrls/folder-handler');


var fsSocket = io.of('/fs');
fsSocket.on('connection', function (socket) {
	folderHander(socket);
});

server.listen(5000);
console.info('Now running on localhost:5000');