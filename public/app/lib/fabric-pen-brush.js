


var PenBrush = fabric.util.createClass(fabric.PencilBrush,{
	callbacks: {},
	onMouseDown: function(pointer) {
		this._id = new Date().getTime();

		if(this.callbacks.mousedown){
			this.callbacks.mousedown(this._id,pointer)
		}
		this._prepareForDrawing(pointer);
		this._captureDrawingPath(pointer);
		this._render();
	},
	onMouseMove: function(pointer) {
		
		if(this.callbacks.mousemove){
			this.callbacks.mousemove(pointer)
		}
		this._captureDrawingPath(pointer);
		this.canvas.clearContext(this.canvas.contextTop);
		this._render();
	},

	onMouseUp: function() {
		if(this.callbacks.mouseup){
			this.callbacks.mouseup()
		}
		this._finalizeAndAddPath();
	},
	on: function(event,cb){
		this.callbacks[event] = cb;
	},
	createPath: function(pathData) {

		var path = new fabric.Path(pathData);
		path.fill = null;
		path.stroke = this.color;
		path.strokeWidth = this.width;
		path.strokeLineCap = this.strokeLineCap;
		path.strokeLineJoin = this.strokeLineJoin;

		if (this.shadow) {
			this.shadow.affectStroke = true;
			path.setShadow(this.shadow);
		}
		// add id for move roate
		path._id = this._id;
		return path;
	},
	reviewBegin: function(id,pointer){
		this._id = id;
		if(this.callbacks.mousedown){
			this.callbacks.mousedown(this._id,pointer)
		}
		this._prepareForDrawing(pointer);
		this._captureDrawingPath(pointer);
		this._render();
	},
	reviewWrite: function(pointer){
		this.onMouseMove(pointer)
	},
	reviewEnd :function(){
		this.onMouseUp()
	}
})




module.exports = PenBrush;