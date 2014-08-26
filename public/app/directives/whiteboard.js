var whiteboard = require('../whiteboard');
var Snap = require('snapsvg');
whiteboard.directive('whiteboard',['$rootScope',function($rootScope){
	return	{
		restrict:'C',
		scope:true,
		link:function(scope,element,attrs){
			createCanvas()
		}

	}


}])


function createCanvas(){

	snap = Snap(".canvas");
	var canvas = $(".canvas");

	var mousedown = false;
	var pathString = null;
	var firstOffset = null;
	var path = null;
	canvas.mousedown(function(){
		mousedown = true;
	})

	canvas.mouseup(function(){
		mousedown = false;
		pathString = null;
		firstOffset = null;
		path = null;
	})

	canvas.mousemove(function(event){

		if(!mousedown) return;
		var offset = {x:event.offsetX,y:event.offsetY}

		if(!firstOffset){
			pathString = 'M' + offset.x + ',' + offset.y;
			firstOffset = offset;
			return
		}
		pathString += ' L' + offset.x + ',' + offset.y;
		if(path) path.remove();
		path = snap.path(pathString);
		path.attr({stroke:"#660000",fill:"none"})
	
		

	})
}



function draw(){
	
}