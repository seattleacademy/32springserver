const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 1500;

app.use(express.static(__dirname + '/public'));
var bots = [];


function onConnection(socket) {

    function sendDriveBot(command){
        console.log("sendDriveBot",command);
        io.emit('drive', command);
    }

        socket.on('sendDriveBot', sendDriveBot);

    function postAllBots() {
        io.emit('postAllBots', bots);
    }

    function onPostBot(bot) {
        var botExists = false;
        for (var i = 0; i < bots.length; i++) {
            if (bot.name == bots[i].name) {
                botExists = true;
                for (key in bot) {
                    bots[i][key] = bot[key];
                }
            }
        }
        if (botExists == false) {
            bots.push(bot);
        }
        postAllBots();
    }

    socket.on('postbot', onPostBot);
    postAllBots();
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));
