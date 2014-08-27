module.exports = Writer;

var userAgent = navigator.userAgent;
var mousedown = 'mousedown';
var mouseup = 'mouseup';
var mousemove = 'mousemove';
var mobile = false;
if (userAgent.indexOf("iPhone") > 0 || userAgent.indexOf("iPod") > 0 || userAgent.indexOf("Android") > 0) {
    mobile = true;
    mousedown = 'touchstart';
    mouseup = 'touchend';
    mousemove = 'touchmove';
}

function Writer(id){
    this.canvas = document.getElementById(id);
    this.ctx = canvas.getContext('2d');
    this.w = canvas.width;
    this.h = canvas.height;
    this.left = canvas.offsetLeft;
    this.top = canvas.offsetTop;
    this.mode = 'write';

    this.addListener();
}

Writer.prototype.addListener = function(){
    var self = this;
    var canvas = this.canvas;
    ctx = this.ctx;
    var draw = null;




    canvas.addEventListener(mousedown, function (e) {
        if(self.mode == 'write'){
            draw = new Draw(self.ctx);
            var offset = self.mouseOffset(e)
            draw.begin(offset)

        }

    }, false);

    canvas.addEventListener(mouseup, function (e) {
        if(self.mode == 'write' && draw){
            draw.close();
            draw = null;
        }


    }, false);
    canvas.addEventListener("mouseout", function (e) {

    }, false);

    canvas.addEventListener(mousemove, function (e) {
        console.log(e)

        var offset = self.mouseOffset(e)
        if(self.mode == 'write' && draw){
            draw.show(offset);
        }
    }, false);

}




Writer.prototype.mouseOffset = function(e){
    var clientX = e.clientX || e.touches[0].clientX
    var clientY = e.clientY || e.touches[0].clientY

    return {
        x: clientX - this.left,
        y: clientY - this.top,
    }
}


function Draw(ctx){
    this.ctx = ctx;
}

Draw.prototype.begin = function(offset){
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(offset.x, offset.y);
}

Draw.prototype.show = function(offset){

    var ctx = this.ctx;
    ctx.lineTo(offset.x, offset.y);
    ctx.stroke();
}

Draw.prototype.close = function(){

}


