var co = require('co');
module.exports = function(io,db){
	io.on('connection', function(socket){
		
		socket.emit('connected','socket connected ---> Hello ' + socket.session.user + '!')


		/*
		* create class room
		*/

		socket.on('createClass', function(data){


			var className = this.session.user + "-" + data.lessonName;
			var classroom = {
				name : className,
				lessonName : data.lessonName,
				teacher : this.session.user,
				status  : 'beging',	
			}

			co(function *(){
				try{
					var result = yield db.classroom.insert(classroom);
				}catch(err){
					console.error(err)
				}
			})();

			
		})




		socket.on('classroomList',function(){

			co(function *(){
				var classroomList = yield db.classroom.find({});
				socket.emit('classroomList',classroomList)
			})();
			

		})



		/*
		* student join to class
		*/
		socket.on('joinClass', function(data){
			var classroom = data;
			console.log(classroom)
			this.session.className = classroom.name;
			socket.join(classroom.name);
			console.log(this.session.user + ' join the classroom ' + classroom.name)

		})


		/*
		* broadcast data to student
		*/
		socket.on('whiteboard',function(data){
			console.log(data)
			socket.broadcast.to(this.session.className).emit('whiteboard',data);
		})

	});
}

