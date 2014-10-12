module.exports = function(Writer){


	Writer.prototype.notifyPen = function(){
		var pen = this.pen;
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
	};


	Writer.prototype.notifyMove = function(){
		var canvas = this.canvas;

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
		})
	};
}