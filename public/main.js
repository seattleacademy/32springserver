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

    function stopBot(e){
        var whichbot = $("#whichbot").val();
        socket.emit('sendDriveBot', {bot:whichbot,left:0,right:0});
    }

    $("#stopbot").click(stopBot);

    function driveBot(e){
        var whichbot = $("#whichbot").val();
        var vL = $("#vL").val();
        var vR = $("#vR").val();
        socket.emit('sendDriveBot', {bot:whichbot,left:vL,right:vR});
    }

    $("#driveBot").click(driveBot);

        function onKeyDown(e) {
        console.log("keydown", e, myBot);
                        var whichbot = $("#whichbot").val();

        if (e.key == "ArrowUp") {
            myBot.vL = 20;
            myBot.vR = 20;
            myBot.y = myBot.y - delta * Math.cos(myBot.theta * Math.PI / 180);
            myBot.x = myBot.x + delta * Math.sin(myBot.theta * Math.PI / 180);
        driveBot(e);
        socket.emit('sendDriveBot', {bot:whichbot,left:50,right:50});
        }
        if (e.key == "ArrowDown") {
            myBot.y = myBot.y + delta * Math.cos(myBot.theta * Math.PI / 180);
            myBot.x = myBot.x - delta * Math.sin(myBot.theta * Math.PI / 180);
                socket.emit('sendDriveBot', {bot:whichbot,left:-50,right:-50});

        }
        if (e.key == "ArrowRight") {
            myBot.theta = myBot.theta + delta;
            e.preventDefault();
                    socket.emit('sendDriveBot', {bot:whichbot,left:50,right:-50});

        }
        if (e.key == "ArrowLeft") {
            myBot.theta = myBot.theta - delta;
            e.preventDefault();
                    socket.emit('sendDriveBot', {bot:whichbot,left:-50,right:50});

        }
        if (e.key == "space") {
            myBot.vL = 0;
            myBot.vR = 0;
            e.preventDefault();
                    socket.emit('sendDriveBot', {bot:whichbot,left:0,right:0});

        }
        emitBot(myBot);

    }

    var current = {
        color: 'black'
    };

    canvas.addEventListener('mousedown', onMouseDown, false);

    for (var i = 0; i < colors.length; i++) {
        colors[i].addEventListener('click', onColorUpdate, false);
    }

    socket.on('postAllBots', onPostBotsEvent);

    function emitBot(bot) {
        socket.emit('postbot', bot);
    }

    function drawBot(bot) {
        context.beginPath();
        bot.name = bot.name || bot.color;
        bot.humidity = bot.humidity || "";
        bot.theta = bot.heading || bot.theta;
        //console.log("drawBot", bot.theta);
        context.arc(bot.x, bot.y, bot.r, 0, Math.PI * 2);
        context.strokeStyle = bot.color;
        context.stroke();
        context.closePath();
        context.moveTo(bot.x, bot.y);
        context.lineTo(bot.x + bot.r * Math.sin(bot.theta * Math.PI / 180), bot.y - bot.r * Math.cos(bot.theta * Math.PI / 180));
        context.stroke();
        context.font = "10px Arial";
        context.fillText(bot.name,bot.x + bot.r + 1,bot.y -bot.r -1);
        context.fillText(bot.humidity,bot.x + bot.r + 1,bot.y +bot.r +1);

    }

    function onMouseDown(e) {
        myBot.x = e.clientX;
        myBot.y = e.clientY;
        myBot.r = myBot.r || 10;
        myBot.theta = myBot.theta || 0;
        myBot.color = current.color;
        myBot.name = $("#whichbot").val();
         emitBot(myBot);
    }

    function onColorUpdate(e) {
        current.color = e.target.className.split(' ')[1];
    }

    function onPostBotsEvent(allBots) {
        bots = allBots;
       //socket.broadcast.emit("drawAllBots",bots);
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
