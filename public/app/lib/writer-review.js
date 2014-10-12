module.exports = function(Writer){

	Writer.prototype.review = function(data){
		if(data.type == 'pen'){
			this.penReview(data);
			return
		}

		if(data.type == 'undo'){
			this.undo()
			return
		}

		if(data.type == 'redo'){
			this.redo()
		}

		if(data.type = 'mode'){
			this.reviewMove(data);
		}
	}

	Writer.prototype.reviewMove = function(data){
		var id = data.id
		var x = data.position.x * (this.canvas.getWidth() / data.canvas.width);
		var y = data.position.y * (this.canvas.getHeight() / data.canvas.height);

		var obj = this._objects[id]
		obj.setLeft(x);
		obj.setTop(y);
		obj.setCoords();
		this.canvas.renderAll()
	}

	Writer.prototype.penReview = function(data){
		var status = data.status;



		if(status == 'begin'){

			this.reviewScale = {
				x: this.canvas.getWidth() / data.canvas.width,
				y: this.canvas.getHeight() / data.canvas.height,
			}
			this.penColor = data.color;

			var penSizeScale = this.canvas.getWidth() * this.canvas.getHeight() / (data.canvas.width * data.canvas.height)
			this.penSize = data.size * penSizeScale;


			this.pen.reviewBegin( data.id, this.reviewPositionRisize( data.position ) );
		}else if(status == 'write'){
			this.pen.reviewWrite( this.reviewPositionRisize( data.position ) )
		}else if(status == 'end'){
			this.pen.reviewEnd()
		}
	}

	Writer.prototype.reviewPositionRisize = function(position){
		var x = position.x * this.reviewScale.x;
		var y = position.y * this.reviewScale.y;
		return new fabric.Point(x , y)

	}
	
}