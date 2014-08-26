var angular = require('angular');
var whiteboard = angular.module('whiteboard', []); //创建一个angular模块

whiteboard.run(['$rootScope',function($rootScope){
	$rootScope.tpl = 'linux-web-gui/templates/'
}])

module.exports = whiteboard;