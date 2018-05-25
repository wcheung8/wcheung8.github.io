/*
 * Code adapted and modified from solitaire script found here: 
 * http://mrdoob.com/lab/javascript/effects/solitaire/
 *
 */



//initialize canvas to fit screen
var canvas = document.createElement( 'canvas' );
canvas.style.position = 'absolute';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50;
canvas.style.left = "0px";
canvas.style.top = "0px";
canvas.style.position = "absolute";
document.body.appendChild(canvas);
var context = canvas.getContext('2d');

var id = 5;

//picture source
var image = document.createElement('img');
//image.src = "./assets/img/red.jpg";
image.src = "./assets/img/rainbow.jpg";
// image.src = "./assets/img/nyan.png";

// card width and height
var cwidth = 50, cwidthhalf = cwidth / 2;
var cheight = 50, cheighthalf = cheight / 2;
// var cwidth = 400, cwidthhalf = cwidth / 2;
// var cheight = 247, cheighthalf = cheight / 2;

//holder for all the elements on screen
var particles = [];
var angle = 0;

//toggleable features
var throwType = -1;
var gravity = 0.98
var gifImg = false;
var rainbow = false;
var red = true;

//particle class
var Particle = function ( id, x, y, sx, sy, type ) {

    if ( sx === 0 ) sx = 2;
    var current = id;
    var radius;
    
    if(gifImg) {
        var cx = 0;
        var cy = id * 247; //nyan height = 247
        cwidth = 400;
        cheight = 247;
        
    } else {
        var cx = 100;
        var cy = Math.floor(Math.random()*(image.height- cheight));
    }
    
    
    if(type == 0) {
        radius = cheight/2;
    } else if (type == 1) {
        radius = Math.sqrt(Math.pow(cheight,2) + Math.pow(cwidth,2));
    } else if (type == 2) {
        radius = Math.sqrt(Math.pow(cheight,2) + Math.pow(cwidth,2))/2;
    } else {
        radius = 0;
    }

    this.update = function () {

        if(rainbow) {
            current < 5 ? current ++ : current = 0;
            cy = current * (image.height)/6;
        }
        x += sx;
        y += sy;
        
        if ( x < ( - cwidthhalf ) || x > ( canvas.width + cwidthhalf ) ) {

            var index = particles.indexOf( this );
            particles.splice( index, 1 );

            return false;

        }

        if ( y > canvas.height - radius ) {

            y = canvas.height - radius;
            sy = - sy * .85;

        }

        sy += gravity;

        //0 - square
        //1 - rotating square
        //2 - circle
        //3 - eraser
        if(type == 0) {
            context.drawImage( image, cx, cy, cwidth, cheight, Math.floor( x - cwidthhalf ), Math.floor( y - cheighthalf ), cwidth, cheight);
        } else if (type == 1) {
            drawEdgeRotatedImage(image, x, y, angle, cx, cy);
            angle++;
        } else if (type == 2) {
            drawCenterRotatedImage(image, x, y, angle, cx, cy);
            angle++;
        } else {

        }


        return true;

    }

}

var throwCard = function ( x, y ) {

    id < 6 ? id ++ : id = 0;

   var particle = new Particle( id, x, y, Math.floor( Math.random() * 6 - 3 ) * 2, - Math.random() * 16, throwType );
    particles.push(particle);

}

function paint(x, y) {
    var cx = 100;
    var cy = Math.floor(Math.random()*(1248-600));
    drawCircle(image, x, y, cx, cy);

}

document.addEventListener('mousedown', function (event) {

    document.addEventListener( 'mousemove', onMouseMove, false );

}, false );

document.addEventListener('mouseup', function (event) {

    var rect = canvas.getBoundingClientRect();
    var X = (event.clientX - rect.left) / (canvas.clientWidth / canvas.width);
    var Y = (event.clientY - rect.top) / (canvas.clientHeight / canvas.height);
    X = Math.ceil(X);
    Y = Math.ceil(Y);

    if(throwType >= 3) {
        paint(X,Y);

    } else if(throwType >= 0) {
        throwCard(X,Y);
    }
    document.removeEventListener( 'mousemove', onMouseMove, false );

}, false );

function onMouseMove(event) {

    var rect = canvas.getBoundingClientRect();
    var X = (event.clientX - rect.left) / (canvas.clientWidth / canvas.width);
    var Y = (event.clientY - rect.top) / (canvas.clientHeight / canvas.height);
    X = Math.ceil(X);
    Y = Math.ceil(Y);

    if(throwType >= 3) {
        paint(X,Y);

    } else if(throwType >= 0) {
        throwCard(X,Y);
    }

}

document.addEventListener( 'touchstart', function ( event ) {


    for ( var i = 0; i < event.changedTouches.length; i ++ ) {

        if(throwType >= 3) {
            paint( event.changedTouches[ 0 ].pageX, event.changedTouches[ 0 ].pageY );

        } else if(throwType >= 0) {
            throwCard( event.changedTouches[ 0 ].pageX, event.changedTouches[ 0 ].pageY );
        }


    }

}, false );

document.addEventListener( 'touchmove', function ( event ) {


    for ( var i = 0; i < event.touches.length; i ++ ) {

        if(throwType >= 3) {
            paint( event.changedTouches[ 0 ].pageX, event.changedTouches[ 0 ].pageY );

        } else if(throwType >= 0) {
            throwCard( event.changedTouches[ 0 ].pageX, event.changedTouches[ 0 ].pageY );
        }

    }

}, false );

setInterval( function () {

    var i = 0, l = particles.length;

    while ( i < l ) {

        particles[i].update() ? i ++ : l --;

    }

}, 1000 / 60 );

function resize() {
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight - 50 + 'px';
};

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    particles.splice(0, particles.length);
    throwType = -1;
    $('.radio_on').removeClass('radio_on').addClass("radio_off");
}

var TO_RADIANS = Math.PI/180;

function drawCenterRotatedImage(image, x, y, angle, sx, sy) {
    // save the current co-ordinate system
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);

    // rotate around that point, converting our
    // angle from degrees to radians
    context.rotate(angle * TO_RADIANS);

    // draw it up and to the left by half the width
    // and height of the image
    context.drawImage(image, sx, sy, cwidth, cheight, -cwidth/2, -cheight/2, cwidth, cheight);

    // and restore the co-ords to how they were when we began
    context.restore();
}

function drawEdgeRotatedImage(image, x, y, angle, sx, sy) {
    // save the current co-ordinate system
    // before we screw with it
    context.save();

    // move to the middle of where we want to draw our image
    context.translate(x, y);

    // rotate around that point, converting our
    // angle from degrees to radians
    context.rotate(angle * TO_RADIANS);

    // draw it up and to the left by half the width
    // and height of the image
    context.drawImage(image, sx, sy, cwidth, cheight, 0, 0, cwidth, cheight);

    // and restore the co-ords to how they were when we began
    context.restore();
}

function drawCircle(image, x, y, sx, sy) {
    context.save();
    context.beginPath();
    context.arc(x, y, cwidth/2, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    context.drawImage(image, sx, sy, cwidth, cheight, x-cwidth/2, y-cwidth/2, cwidth, cheight);

    context.beginPath();
    context.arc(x, y, cwidth/2, 0, Math.PI * 2, true);
    context.clip();
    context.closePath();
    context.restore();
}

//TODO clean up this mess of a toggle mechanic
function toggleF0() {
    throwType = 0;
}

function toggleF1() {
    throwType = 1;
}

function toggleF2() {
    throwType = 2;
}

function setSquare() {

    cwidth = 50;
    cheight = 50;

}

function toggleF3() {
    if(gravity == .98) {
        gravity = 0;
    } else {
        gravity = .98;
    }
}

function toggleF4() {
    
    rainbow = !rainbow;
    
}

function toggleF5() {
    
    // if(red) {
    
        // image.src = "./assets/img/rainbow.jpg";
    
    // } else {
    
        // image.src = "./assets/img/red.jpg";
    
    // }
    
    // red = !red;
    
    if(cwidth == 50) {
        cwidth = 75;
        cheight = 75;
    } else {
        cwidth = 50;
        cheight = 50;
    }
    
}


