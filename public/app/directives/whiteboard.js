var whiteboard = require('../whiteboard');
var Writer = require('../lib/writer.js');
whiteboard.directive('whiteboard',['$rootScope',function($rootScope){
	return	{
		restrict:'C',
		scope:true,
		link:function(scope,element,attrs){
			new Writer('canvas')
		}

	}


}])






function draw(){

}