'use strict';

(function() {
console.clear();
    var socket = io();
    var canvas = document.getElementById('whiteboard');
    var colors = document.getElementsByClassName('color');
    var context = canvas.getContext('2d');
    var myBot = {};
    $("body").keydown(onKeyDown);
    var delta = 10;
    function onKeyDown(e){
        console.log("keydown",e,myBot);
        if(e.key == "ArrowUp"){
            myBot.y = myBot.y - delta*Math.cos(myBot.theta*Math.PI/180);
            myBot.x = myBot.x + delta*Math.sin(myBot.theta*Math.PI/180);
        }
        if(e.key == "ArrowDown"){
            myBot.y = myBot.y + delta*Math.cos(myBot.theta*Math.PI/180);
            myBot.x = myBot.x - delta*Math.sin(myBot.theta*Math.PI/180);
        }
        if(e.key == "ArrowRight"){
            myBot.theta = myBot.theta + delta;
        } 
                if(e.key == "ArrowLeft"){
            myBot.theta = myBot.theta - delta;
        }        
       
        emitBot(myBot.x, myBot.y, myBot.r, myBot.theta, myBot.color)
    }

    var current = {
        color: 'black'
    };

    canvas.addEventListener('mousedown', onMouseDown, false);

    for (var i = 0; i < colors.length; i++) {
        colors[i].addEventListener('click', onColorUpdate, false);
    }

    socket.on('drawAllBots', onDrawAllBotsEvent);

    function emitBot(x, y, r, theta, color) {
        myBot.x = x;
        myBot.y = y;
        myBot.r = r;
        myBot.theta = theta;
        myBot.color = color;
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
        context.strokeStyle = color;
        context.stroke();
        context.closePath();
        context.moveTo(x,y);
        context.lineTo(x + r*Math.sin(theta*Math.PI/180),y-r*Math.cos(theta*Math.PI/180));
        context.stroke();

    }


    function onMouseDown(e) {
        emitBot(e.clientX, e.clientY, 10, 0, current.color);
    }


    function onColorUpdate(e) {
        current.color = e.target.className.split(' ')[1];
    }


    function onDrawAllBotsEvent(bots) {
        var w = canvas.width;
        var h = canvas.height;
        context.clearRect(0, 0, w, h);
        console.log("bots", bots);
        for (var i = 0; i < bots.length; i++) {
            drawBot(bots[i].x, bots[i].y, bots[i].r, bots[i].theta, bots[i].color);
        }
    }


})();
