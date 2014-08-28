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

function Writer(id,options){
    this.canvas = document.getElementById(id);
    this.ctx = canvas.getContext('2d');

    if(options && options.width && options.height){
        this.width = this.ctx.canvas.width = options.width;
        this.height = this.ctx.canvas.height = options.height;
    }else{
        this.width = this.ctx.canvas.width 
        this.height = this.ctx.canvas.height
    }


    this.left = getElementLeft(canvas);
    this.top = getElementTop(canvas);
    this.mode = 'write';

    this.addListener();
}

Writer.prototype.addListener = function(){
    var self = this;
    var canvas = this.canvas;
    var ctx = this.ctx;
    var draw = null;




    canvas.addEventListener(mousedown, function (e) {
        if(self.mode == 'write'){
            draw = new Draw(self.ctx);
            var offset = self.mouseOffset(e)
            draw.begin(offset)
            self.writeNotify('begin',offset,{width:self.width,height:self.height});

        }

    }, false);

    canvas.addEventListener(mouseup, function (e) {

        if(self.mode == 'write' && draw){
            draw.close();
            self.writeNotify('close');
            draw = null;
        }


    }, false);
    canvas.addEventListener("mouseout", function (e) {

    }, false);

    canvas.addEventListener(mousemove, function (e) {

        var offset = self.mouseOffset(e)
        if(self.mode == 'write' && draw){
            draw.show(offset);
            self.writeNotify('writing',offset);
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


Writer.prototype.setMode = function(mode){
    if(mode){
        this.mode = mode;
    }
}

Writer.prototype.setColor = function(color){
    if(color){
        this.ctx.fillStyle = color;
    }
}

Writer.prototype.writeNotify = function(stauts,offset,canvasSize){

    var report = {type:'write',stauts:stauts,offset:offset}
    if(canvasSize){
        report.canvasSize = canvasSize
    }
    this.notify(report);
}

Writer.prototype.progress = function(cb){
    this.progressCallback = cb;
}

Writer.prototype.notify = function(report){
    if(this.progressCallback){
        this.progressCallback(report);
    }
}

Writer.prototype.review = function(data){
    if(data.type == 'write')
        this.writeReview(data);
}

Writer.prototype.writeReview = function(data){
    var stauts = data.stauts;
    var offset = data.offset;

    if(stauts == 'begin'){
        this.draw = new Draw(this.ctx,data.canvasSize);
        this.draw.begin(offset)
    }
    else if(stauts == 'writing'){
        this.draw.show(offset)
    }
    else if(stauts == 'close'){
        this.draw.close();
        this.draw = null;
    }

}








function Draw(ctx,canvasSize){
    this.ctx = ctx;
    if(canvasSize){
        this.oSize = {
            width:canvasSize.width,
            height:canvasSize.height
        }
        this.width = ctx.canvas.width 
        this.height = ctx.canvas.height
    }
}

Draw.prototype.begin = function(offset){
    var ctx = this.ctx;
    ctx.beginPath();
    offset = this.resize(offset);
    ctx.moveTo(offset.x, offset.y);
}

Draw.prototype.show = function(offset){
    var ctx = this.ctx;
    offset = this.resize(offset);
    ctx.lineTo(offset.x, offset.y);
    ctx.stroke();
}

Draw.prototype.resize = function(offset){
    if(this.oSize){
        var oSize = this.oSize;
        console.log(offset)

        offset = {
            x: offset.x * (this.width/oSize.width),
            y: offset.y * (this.height/oSize.height)
        }
    }
    return offset;
}

Draw.prototype.close = function(){

}




function getElementLeft(element){
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null){
        　　　　　　actualLeft += current.offsetLeft;
        　　　　　　current = current.offsetParent;
    　　　　}
    　　　　return actualLeft;
}

function getElementTop(element){
    　　　　var actualTop = element.offsetTop;
    　　　　var current = element.offsetParent;
    　　　　while (current !== null){
        　　　　　　actualTop += current.offsetTop;
        　　　　　　current = current.offsetParent;
    　　　　}
    　　　　return actualTop;
}


