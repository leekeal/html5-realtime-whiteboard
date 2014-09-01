var PenBrush = require('./fabric-pen-brush');
module.exports = Writer;

require('./writer-review')(Writer);

function Writer(id,options){
	this._mode = 'pen';
	this._snapshots = [];
	this._redoSnapshots = [];
	this.options = options;
	this._objects = {};


	this.id = id;
	this.element = document.getElementById(this.id);

	
	this.initCanvas()
	this.initPen()
	this.initObject();
	this.makeSnapshot();
	this.listentObjectEvent();

}


Writer.prototype.initObject = function(){
	var canvas = this.canvas;
	canvas.on("object:added",function(event){
		// 添加原始 产生Object时候的 canvas大小，用于整体resize
		var originCanvas = {
			width: canvas.getWidth(),
			height: canvas.getHeight(),
		}
		event.target.origin = {
			canvas : originCanvas,
		};

	})
}

Writer.prototype.listentObjectEvent = function(){

	var writer = this;
	var canvas = this.canvas;
	canvas.on("object:modified",function(event){
		// writer.makeSnapshot()
	})
	canvas.on("object:rotating",function(event){
		// writer.makeSnapshot()
	})
	canvas.on("object:scaling",function(event){
		// writer.makeSnapshot()
	})

	canvas.on("object:moving",function(event){
		// notify report
		var report = {
			type : 'move',
			id : event.target._id,
		}
		report.position = {
			x: event.target.left,
			y: event.target.top,
		}
		report.canvas = {
			width:canvas.getWidth(),
			height:canvas.getHeight()
		}
		writer.notify(report);

		//makeSnapshot 
		// writer.makeSnapshot()
	})
	canvas.on("object:added",function(event){
		var id = event.target._id;
		writer._objects[id] = event.target;
		// writer.makeSnapshot()
	})
	canvas.on("object:removed",function(event){
		// writer.makeSnapshot()
	})

	canvas.on("object:selected",function(event){
		if(event.target._objects){
			var objects = event.target._objects;
			var ids = [];
			for(var i = 0; i < objects.length; i++){
				ids.push(objects[i]._id);
			}
			console.log(ids)
		}
	})
}


Writer.prototype.makeSnapshot = function(){
	if(!this._undo){
		var canvas = this.canvas;
		var snapshotJson = canvas.toJSON();

		this._snapshots.push(snapshotJson);
	}
}
Writer.prototype.undo = function(){
	this.notify({
		type:'undo',
	})

	var canvas = this.canvas;
	this._undo = true;
	var prev = this._snapshots.pop();
	canvas.loadFromJSON(prev);
	canvas.renderAll();
	this._redoSnapshots.unshift(prev);
	this._undo = false;
}

Writer.prototype.redo = function(){
	this.notify({
		type:'redo',
	})
	var canvas = this.canvas;
	this._undo = true;
	var next = this._redoSnapshots.shift();
	canvas.loadFromJSON(next);
	canvas.loadFromJSON(next);
	canvas.renderAll()
	this._snapshots.push(next);
	this._undo = false;
}

Writer.prototype.initPen = function(){
	var writer = this;
	var pen = this.pen = this.canvas.freeDrawingBrush = new PenBrush(this.canvas);

	// mouse down
	pen.on('mousedown',function(id,position){
	

		var report = {
			type : 'pen',
			position : position,
			status : 'begin',
			color : writer.penColor,
			size : writer.penSize,
			id : id,
		}
		report.canvas = {
			width : writer.canvas.getWidth(),
			height : writer.canvas.getHeight()
		}
		writer.notify(report);

	})
	// mouse move
	pen.on('mousemove',function(position){
	

		var report = {
			type : 'pen',
			position : position,
			status : 'write',
		}

		writer.notify(report);
	})
	//  mouse up
	pen.on('mouseup',function(){
		
		var report = {
			type : 'pen',
			status : 'end',
		}
		writer.notify(report);
	})


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
			console.error(error)
		}
	}
}


Writer.prototype.initCanvas = function(){

	var canvas = this.canvas = new fabric.Canvas(this.id);
	canvas.isDrawingMode = true;
	fabric.Object.prototype.transparentCorners = false;
	this.canvas.setWidth(this.options.width);
	this.canvas.setHeight(this.options.height);
}

Writer.prototype.resize = function(width,height){
	var canvas = this.canvas;
	canvas.setWidth(width);
	canvas.setHeight(height)



	var objs = canvas.getObjects();
	for(var i = 0; i < objs.length; i ++){
		var obj = objs[i]

		var scaleX = width / obj.origin.canvas.width;
		var scaleY = height / obj.origin.canvas.height;
		obj.setScaleX(scaleX)
		obj.setScaleY(scaleY)

		//  change position for reisize
		if(!obj.origin.prevCanvas){
			var x = obj.getLeft() * scaleX;
			var y = obj.getTop() * scaleY;
		}
		else{
			var x = obj.getLeft() * (width / obj.origin.prevCanvas.width)
			var y = obj.getTop() * (height / obj.origin.prevCanvas.height)
		}

		obj.setLeft(x);
		obj.setTop(y);
		obj.setCoords();

		var prevCanvas = {
			width:width,
			height:height,
		}
		obj.origin.prevCanvas = prevCanvas;

		canvas.calcOffset()
		
	}
}

Object.defineProperty(Writer.prototype, 'mode', {
	get: function() {
		return this._mode;
	},
	set: function(mode) {
		if(mode == 'pen'){
			this.canvas.isDrawingMode = true;
		}if(mode == 'select'){
			this.canvas.isDrawingMode = false;
		}
		this._mode = mode;
	}
});

// pen color
Object.defineProperty(Writer.prototype, 'penColor', {
	get: function() {
		return this.canvas.freeDrawingBrush.color
	},
	set: function(color) {
		this.canvas.freeDrawingBrush.color = color
		return this.canvas.freeDrawingBrush.color
	}
});

// pen size
Object.defineProperty(Writer.prototype, 'penSize', {
	get: function() {
		return this.canvas.freeDrawingBrush.width
	},
	set: function(size) {
		this.canvas.freeDrawingBrush.width = size
		return this.canvas.freeDrawingBrush.width
	}
});








