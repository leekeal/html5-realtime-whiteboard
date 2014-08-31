"use strict";
// var Snap = require('snapsvg')



module.exports = Writer;

function Writer(selector,options){
	
	this.selector = selector;

	this.scale = {};
	this._mode = 'pen';
	this.snapshot = [];
	this.undoSnapshot = []
	this.options = options || {}
	this.children = [];

	this.options.pen = {
		fill: "none",
		stroke: "#000",
		strokeWidth: 1,
	};
	this.stroke = null; /* Is drawing the path*/
	this.init()
}







Writer.prototype.init = function(){
	this.paper = Snap(this.selector);


	this.paper.attr({
		width:this.options.width,
		height:this.options.height,
	})

	this.addListener();
}
/*
** addListener
*/
Writer.prototype.addListener = function(){
	var writer = this;
	var element = $(this.selector);
	// touch support
	if('createTouch' in document){
		var mousedown = 'touchstart';
		var mouseup = 'touchend';
		var mousemove = 'touchmove'
	}else{
		var mousedown = 'mousedown';
		var mouseup = 'mouseup';
		var mousemove = 'mousemove'
	}


	element.on(mousedown,function(event){

		var offset = writer.mouseOffset(event);


		if(writer.mode == 'pen'){
			writer.stroke = new Stroke(writer, offset);
		}

	})



	element.on(mouseup,function(event){


		if(writer.mode == 'pen' && writer.stroke){
			writer.children.push(writer.stroke.path);
			writer.stroke.end();
			writer.stroke = null;
			writer.makeSnapshot()
		}
	})


	element.on(mousemove,function(event){
		var offset = writer.mouseOffset(event);


		if(writer.mode == 'pen' && writer.stroke){
			writer.stroke.write(offset); 
		}

	})

}


Object.defineProperty(Writer.prototype, 'mode', {
	get: function() {
		return this._mode;
	},
	set: function(mode) {
		if(mode == 'select'){
			this.openDrag()
		}else{
			this.closeDrag();
		}
		this._mode = mode;
	}
});

Writer.prototype.openDrag = function(){
	var children = this.children;
	for(var i = 0; i < children.length; i++){
		var child = children[i]
		child.drag();
	}
}

Writer.prototype.closeDrag = function(){
	var children = this.children;
	for(var i = 0; i < children.length; i++){
		var child = children[i]
		child.undrag();
	}
}

Writer.prototype.makeSnapshot = function(){
	var paperSnapshot = $(this.selector).clone();
	this.snapshot.push(paperSnapshot);
	this.undoSnapshot = [];
}



Writer.prototype.undo = function(){
	var prev = this.snapshot.pop();
	if(prev){
		this.undoSnapshot.unshift(prev);
		$(this.selector).replaceWith(prev)
		this.init()
	}
	
}

Writer.prototype.repeat = function(){
	var next = this.undoSnapshot.shift();
	if(next){
		this.snapshot.push(next);
		$(this.selector).replaceWith(next)
		this.init()
	}
}



Writer.prototype.resize = function(width,height){


	// var children = this.paper.selectAll()
	var children = this.children;
	for(var i = 0; i < children.length; i++){
		var child = children[i]

		var windowChangeScale = {
			x : width / child.attr('paperWidth'),
			y : height / child.attr('paperHeight')
		}
		var m = new Snap.Matrix();

		m.scale(windowChangeScale.x, windowChangeScale.y)

		child.transform(m);
	}
	this.width(width);
	this.height(height);
	
	
}

Writer.prototype.mouseOffset = function(event){
	var offset = {};

	var elementOffset = $(this.selector).offset()

	if('createTouch' in document){ /*touch support*/
		var touchClineX = event.originalEvent.touches[0].clientX;
		var touchClineY = event.originalEvent.touches[0].clientY;
		

		offset.x = touchClineX - elementOffset.left;
		offset.y = touchClineY - elementOffset.top;
	}else{	
		// offset.x = event.offsetX;
		// offset.y =event.offsetY;

		offset.x = event.clientX - elementOffset.left;
		offset.y = event.clientY - elementOffset.top;
	}

	return offset;

}

Writer.prototype.set = function(name,value){
	if(name && value){
		this[name] = value;
	}
	else{
		console.error('parameter is conrrect')
	}
}



Writer.prototype.pen = function(attr,value){
	if(!attr || !value){

		console.error('parameter is conrrect')
		return
	}
	
	if(attr == 'size'){
		this.options.pen.strokeWidth = value;
	}
	if(attr == 'color'){
		this.options.pen.stroke = value;
	}
}


Writer.prototype.strokeNotify = function(stauts,offset,pen,paperSize){

	var report = {type:'pen',stauts:stauts,offset:offset}
	if(pen){
		report.pen = pen
	}
	if(paperSize){
		report.paperSize = paperSize
	}

	this.notify(report);
}

Writer.prototype.progress = function(cb){
	this.progressCallback = cb;
}

Writer.prototype.notify = function(report){
	if(this.progressCallback){
		try{
			this.progressCallback(report);
		}
		catch(error){
			throw error;
		}
	}
}



//  Writer review
Writer.prototype.review = function(data){
	if(data.type == 'pen')
		this.penReview(data);
}




Writer.prototype.penReview = function(data){


	var stauts = data.stauts;

	var offset = this.reviewOffsetResize(data);

	if(stauts == 'begin'){
		data.pen.strokeWidth = data.pen.strokeWidth * this.width() * this.height() / (data.paperSize.width * data.paperSize.height)
		this.options.pen = data.pen;
		this.stroke = new Stroke(this, offset);
	}
	else if(stauts == 'write'){
		this.stroke.write(offset);
	}
	else if(stauts == 'close'){
		this.stroke.end();
		this.stroke = null;
	}

}

Writer.prototype.width = function(width){
	if(width){
		this.paper.attr({ 'width' : width })
	}
	return this.paper.attr('width');
}
Writer.prototype.height = function(height){
	if(height){
		this.paper.attr({ height : height })
	}
	return this.paper.attr('height');
}

Writer.prototype.reviewOffsetResize = function(data){

	if(data.paperSize){
		this.scale.width = this.width() / data.paperSize.width;
		this.scale.height = this.height() / data.paperSize.height;
	}

	if(data.offset){
		offset = {
			x: data.offset.x * this.scale.width,
			y: data.offset.y * this.scale.height
		}
	}


	return offset;
}






/*
** one stroke
*/
function Stroke(writer,offset){
	this.writer = writer;
	this.paper = writer.paper;
	this.pathString = null;

	this.pathString = 'M' + offset.x + ',' + offset.y + ' ';
	this.path = this.paper.path(this.pathString);


	this.path.attr(writer.options.pen);

	// set paper size to path for resize
	this.path.attr({ 
		paperWidth: writer.width(),
		paperHeight: writer.height()
	})

	var paperSize = {
		width : this.writer.width(),
		height : this.writer.height(),
	}
	this.writer.strokeNotify('begin',offset,writer.options.pen,paperSize)
}

Stroke.prototype.write = function(offset){
	
	this.pathString += 'L' + offset.x + ',' +offset.y + ' ';
	this.path.attr({ 
		d: this.pathString 
	})
	this.writer.strokeNotify('write',offset)

}

Stroke.prototype.end = function(){
	this.writer.strokeNotify('end')
}









