'use strict';

(function() {

    var socket = io();
    var canvas = document.getElementById('whiteboard');
    var colors = document.getElementsByClassName('color');
    var context = canvas.getContext('2d');

    var current = {
        color: 'black'
    };

    canvas.addEventListener('mousedown', onMouseDown, false);

    for (var i = 0; i < colors.length; i++) {
        colors[i].addEventListener('click', onColorUpdate, false);
    }

    socket.on('drawing', onDrawingEvent);
    socket.on('drawAllBots', onDrawAllBotsEvent);
    socket.on('clear', onClearEvent);
    function emitBot(x, y, r, theta, color) {
            socket.emit('postbot', {
            x: x,
            y: y,
            r: r,
            theta: theta,
            color: color
        });
    }
    function drawBot(x, y, r, theta, color) {
        context.beginPath();
        console.log("drawBot", x, y, r, theta, color);
        context.arc(x, y, r, 0, Math.PI * 2);
        context.fillStyle = color;
        context.fill();
        context.closePath();
    }


    function onMouseDown(e) {
        emitBot(e.clientX, e.clientY, 10, 0, current.color, true);
    }


    function onColorUpdate(e) {
        current.color = e.target.className.split(' ')[1];
    }


    function onClearEvent() {
        var w = canvas.width;
        var h = canvas.height;
        context.clearRect(0, 0, w, h);
    }

    function onDrawAllBotsEvent(bots){
        var w = canvas.width;
        var h = canvas.height;
        context.clearRect(0, 0, w, h);
        console.log("bots",bots);
        for(var i = 0; i< bots.length; i++){
            drawBot(bots[i].x, bots[i].y, bots[i].r, bots[i].theta, bots[i].color);
        }
    }

    function onDrawingEvent(data) {

        console.log("onDraw", data);
        //drawBot(data.x, data.y, data.r, data.theta, data.color);
    }


})();
