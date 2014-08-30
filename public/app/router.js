var app = require('./app')
var tpl = app.tpl;

app.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('index', {
		url:"",
		templateUrl: app.tpl + 'index.html',
		controller: 'indexCtrl'
	})
	.state('index+#', {
		url:"/",
		templateUrl: app.tpl + 'index.html',
	})

	/*--------user-ctrls.js ---------*/

	.state('login', {
		url: '/login',
		templateUrl: app.tpl + 'login.html',
		controller: "loginCtrl"
	})
	.state('register', {
		url: '/register',
		templateUrl: tpl + 'register.html',
		controller:'registerCtrl'
	})

	/*--------lesson-ctrls.js---------*/
	.state('lesson', {
		url: '/lesson',
		templateUrl: tpl + 'lesson.html',
		controller:'lessonCtrl'
	})

	.state('lesson-teacher', {
		url: '/lesson/teacher',
		templateUrl: tpl + 'lesson-teacher.html',
		controller:'lessonTeacherCtrl'
	})

	.state('lesson-student',{
		url: '/lesson/student',
		templateUrl: tpl + 'lesson-student.html',
		controller: 'lessonStudentCtrl'
	})






	.state('teacher', {
		url: '/teacher',
		templateUrl: tpl + 'teacher.html'
	})
	.state('student', {
		url: '/student',
		templateUrl: tpl + 'student.html'
	})
	.state('whiteboard', {
		url: '/whiteboard',
		templateUrl: tpl + 'whiteboard.html',
		controller:'whiteboardCtrl'
	})
	.state('whiteboard-review', {
		url: '/whiteboard-review',
		templateUrl: tpl + 'whiteboard-review.html',
		controller:'whiteboardReviewCtrl'
	})

	.state('test', {
		url: '/test',
		templateUrl: tpl + 'test.html',
		controller:'testCtrl'
	})
});