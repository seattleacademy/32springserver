const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 1500;

app.use(express.static(__dirname + '/public'));
var bots = [];


function onConnection(socket) {
    function drawAllBots() {
        io.emit('drawAllBots', bots);
    }

    function onPostBot(bot) {
        if (bots.length > 0) { //Remove bot of same color
            for (var i = bots.length; i > 0; i--) {
                if (bot.color == bots[i - 1].color) {
                    bots.splice(i - 1);
                }
            }
        }
        bots.push(bot);
        drawAllBots();
    }

    socket.on('postbot', onPostBot);

    drawAllBots();
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
