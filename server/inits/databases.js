var Datastore = require('nedb');
var wrap = require('co-nedb');

module.exports = function(app){
	var db = {
		users : wrap(new Datastore({ filename: 'server/stores/users.json',autoload: true })),
		session: wrap(new Datastore({ filename: 'server/stores/session.json',autoload: true })),
		classroom:wrap(new Datastore({ filename: 'server/stores/classroom.json',autoload: true }))

	};
	app.use(function *(next){
		this.db = db;
		yield next;
	})
	return db;
}