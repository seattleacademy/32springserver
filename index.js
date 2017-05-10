const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 1500;

app.use(express.static(__dirname + '/public'));
var bots = [];


function botStatus(data) {
    var myColor = data.color;
    if (bots.length > 0) {
        for (var i = bots.length; i > 0; i--) {
            if (myColor == bots[i-1].color) {
                bots.splice(i-1);
            }
        }
    }
    bots.push(data);
    console.log("bots after push",bots);
}

function onConnection(socket) {
    function drawAllBots() {
    	socket.broadcast.emit('clear', "");
        for (i = 0; i < bots.length; i++) {
            socket.broadcast.emit('drawing', bots[i]);
        }
    }

    function onDrawing(data) {
        botStatus(data);
        drawAllBots();
    }
    socket.on('drawing', onDrawing);
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
