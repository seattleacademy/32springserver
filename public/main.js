'use strict';

(function() {
    console.clear();
    var socket = io();
    var canvas = document.getElementById('whiteboard');
    var colors = document.getElementsByClassName('color');
    var context = canvas.getContext('2d');
    var myBot = {};
    var bots = [];
    $("body").keydown(onKeyDown);
    var delta = 10;

    function onKeyDown(e) {
        console.log("keydown", e, myBot);
        if (e.key == "ArrowUp") {
            myBot.y = myBot.y - delta * Math.cos(myBot.theta * Math.PI / 180);
            myBot.x = myBot.x + delta * Math.sin(myBot.theta * Math.PI / 180);
        }
        if (e.key == "ArrowDown") {
            myBot.y = myBot.y + delta * Math.cos(myBot.theta * Math.PI / 180);
            myBot.x = myBot.x - delta * Math.sin(myBot.theta * Math.PI / 180);
        }
        if (e.key == "ArrowRight") {
            myBot.theta = myBot.theta + delta;
            e.preventDefault();
        }
        if (e.key == "ArrowLeft") {
            myBot.theta = myBot.theta - delta;
            e.preventDefault();
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

    socket.on('postAllBots', onPostBotsEvent);

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

    function drawBot(bot) {
        context.beginPath();
        console.log("drawBot", bot);
        context.arc(bot.x, bot.y, bot.r, 0, Math.PI * 2);
        context.strokeStyle = bot.color;
        context.stroke();
        context.closePath();
        context.moveTo(bot.x, bot.y);
        context.lineTo(bot.x + bot.r * Math.sin(bot.theta * Math.PI / 180), bot.y - bot.r * Math.cos(bot.theta * Math.PI / 180));
        context.stroke();
    }

    function onMouseDown(e) {
        emitBot(e.clientX, e.clientY, 10, 0, current.color);
    }

    function onColorUpdate(e) {
        current.color = e.target.className.split(' ')[1];
    }

    function onPostBotsEvent(allBots) {
        bots = allBots;
        window.requestAnimationFrame(drawBots);
    }

    function drawBots() {
        var w = canvas.width;
        var h = canvas.height;
        context.clearRect(0, 0, w, h);
        for (var i = 0; i < bots.length; i++) {
            drawBot(bots[i]);
        }
    }

})();
