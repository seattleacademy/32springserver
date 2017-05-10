'use strict';

(function() {

    var socket = io();
    var canvas = document.getElementsByClassName('whiteboard')[0];
    var colors = document.getElementsByClassName('color');
    var context = canvas.getContext('2d');

    var current = {
        color: 'black'
    };
    var drawing = false;

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    //canvas.addEventListener('mousemove', throttle(onMouseMove, 10), false);

    for (var i = 0; i < colors.length; i++) {
        colors[i].addEventListener('click', onColorUpdate, false);
    }

    socket.on('drawing', onDrawingEvent);
    socket.on('clear', onClearEvent);

    window.addEventListener('resize', onResize, false);
    onResize();


    function drawBot(x, y, r, theta, color, emit) {
        context.beginPath();
        console.log("drawBot", x, y, r, theta, color, emit);
        context.arc(x, y, r, 0, Math.PI * 2);
        // context.moveTo(x0, y0);
        // context.lineTo(x1, y1);
        context.fillStyle = color;
        // context.lineWidth = 2;
        context.fill();
        context.closePath();

        if (!emit) {
            return; }
        // var w = canvas.width;
        // var h = canvas.height;

        socket.emit('drawing', {
            // x0: x0 / w,
            // y0: y0 / h,
            // x1: x1 / w,
            // y1: y1 / h,
            // color: color,
            x: x,
            y: y,
            r: r,
            theta: theta,
            color: color
        });
    }

    function onMouseDown(e) {
        drawing = true;
        current.x = e.clientX;
        current.y = e.clientY;
    }

    function onMouseUp(e) {
        if (!drawing) {
            return; }
        drawing = false;
        drawBot(e.clientX, e.clientY, 10, 0, current.color, true);
    }

    // function onMouseMove(e){
    //   if (!drawing) { return; }
    //   drawLine(current.x, current.y, e.clientX, e.clientY, current.color, true);
    //   current.x = e.clientX;
    //   current.y = e.clientY;
    // }

    function onColorUpdate(e) {
        current.color = e.target.className.split(' ')[1];
    }

    // limit the number of events per second
    function throttle(callback, delay) {
        var previousCall = new Date().getTime();
        return function() {
            var time = new Date().getTime();

            if ((time - previousCall) >= delay) {
                previousCall = time;
                callback.apply(null, arguments);
            }
        };
    }

    function onClearEvent() {
        var w = canvas.width;
        var h = canvas.height;
        context.clearRect(0, 0, w, h);
    }

    function onDrawingEvent(data) {

        console.log("onDraw", data);
        drawBot(data.x, data.y, data.r, data.theta, data.color);
    }

    // make the canvas fill its parent
    function onResize() {
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
    }

})();
