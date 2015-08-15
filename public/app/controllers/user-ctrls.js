var app = require('../app');


app.controller('loginCtrl',['$rootScope','$scope','$http','$location',function($rootScope,$scope,$http,$location){
	$scope.status = 'offline';
	
	if($rootScope.user){
		$scope.status = 'online';
	}


	var model = $scope.model = {};
	var events = $scope.events = {};
	events.login = function(){
		$http.post(app.api("login"),model).success(function(data){
			if(data.error){
				$scope.errorMsg = data.error;
				return
			}
			$location.path('/')
			console.log('login success');
		})
	}
}])

app.controller('registerCtrl',['$scope','$http',function($scope,$http){
	
	var model = $scope.model = {};
	var events = $scope.events = {};
	
	events.register = function(){
		$http.post(app.api("register"),model).success(function(data){
			if(data.error){
				$scope.errorMsg = data.error;
				return
			}
			$scope.errorMsg = false;
			$scope.successMsg = true;
		})
	}
}])