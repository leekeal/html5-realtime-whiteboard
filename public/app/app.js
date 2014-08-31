// var angular = require('angular'); //把angular通过全局加载，减少编译时间
// var angularUiRouter = require('angular-ui-router')
 

var app = angular.module('lesson', ['ui.router','colorpicker.module']); //创建一个angular模块
app.tpl = 'app/templates/';
app.api = function (url){
	var api = "/api/";
	return api + url;
}

app.run(['$rootScope',function($rootScope){
	$rootScope.tpl = app.tpl
	$rootScope.api = app.api
}])




/*
* login check
*/


app.run(['$rootScope','$http','$location',function($rootScope,$http,$location){

	$http.get(app.api('status')).success(function(data){
		if(data.user){
			$rootScope.user = data.user;
		}else{
			$location.path('login')
		}
	})

}])

app.config(['$httpProvider', function($httpProvider) {


	$httpProvider.interceptors.push('loginChecker');


}]);

app.factory('loginChecker', ['$q','$location', function($q,$location) {
	return{
		responseError: function(rejection) {
			if(rejection.status == 403){
				$location.path('login')
			}
			return $q.reject(rejection);
		}
	};
}]);















module.exports = app;