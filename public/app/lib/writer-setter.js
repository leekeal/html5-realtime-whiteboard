module.exports = function(Writer){
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

}