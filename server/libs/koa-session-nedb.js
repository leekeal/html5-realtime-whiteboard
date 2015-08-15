var debug = require('debug')('koa:nedb-session');
var session = require('koa-generic-session');
var thunkify = require('thunkify');
var Datastore = require('nedb');
var wrap = require('co-nedb');

module.exports = function (options){

	var store = options.store || wrap(new Datastore());
	options.store = new nedbSession(store);
	return session(options)
}

function nedbSession(nedb){
	this.db = nedb;
	debug('Session in nedb where ' + nedb.filename)
}

nedbSession.prototype.get = function *(sid){
	var data = yield this.db.findOne({sid:sid});
	if(!data){
		debug('get session: %s', data || 'none');
		return null;
	}
	try {
		return data.sess;
	} catch (err) {
		debug('parse session error: %s', err.message);
	}

}	

nedbSession.prototype.set = function *(sid, sess, ttl) {
	console.log(ttl)
	if (typeof ttl === 'number') {
		ttl = ttl / 1000;
	}
	var session = {
		sid:sid,
		sess:sess,
		ttl:ttl,
		_id:sid
	}
	try{

		var result = yield this.db.update({_id:sid},session,{});
		if(!result){
			var data = yield this.db.insert(session);
		}
	}catch(err){
		console.error(err);
	}

	debug('SET %s complete', sid);

}

nedbSession.prototype.destroy = function *(sid, sess) {
	debug('DEL %s', sid);
	yield this.db.remove({_id:sid});
	debug('DEL %s complete', sid);
};