// var app = require('../app');
// var Writer = require('../lib/writer.js');
// app.directive('whiteboard',['$rootScope',function($rootScope){
// 	return	{
// 		restrict:'C',
// 		scope:true,
// 		controller:'whiteboardCtrl',
// 		link:function(scope,element,attrs){

// 		},

// 	}


// }])




// app.controller('whiteboardCtrl',['$scope','$compile','$element',function($scope,$compile,$element){
// 	var writer = new Writer('canvas');

// 	// var socket = io('http://192.168.1.15:3000');
// 	// socket.on('hello', function (data) {
// 	// 	console.log(data)
// 	// 	socket.emit('hello','hello server');
// 	// });

// 	writer.progress(function(report){
// 		console.log(report)
// 	})


// }])


var app = require('../app');
var Writer = require('../lib/writer.js');
app.directive('accordion',function(){
	return {
		scope {},
		restrict : 'EA',
		replace : true,
		transclude : true,
		template :'<div>'
		+'<li ng-click="toggle()"></li>'
		+'<div ng-show></div>'
		+'</div>'

	}
})







