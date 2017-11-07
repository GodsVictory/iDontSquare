var express = require('express');
var app = express();
var server = require('http').createServer(app);
app.get('/', function(req, res) {
  res.sendFile(__dirname, 'public/index.html');
});
app.use(express.static('public'));
var port = process.env.PORT || 80;
server.listen(port);

var io = require('socket.io')(server);
var players = {};
var score = [];
var shapes = {};
var shapeSize = 25;

io.on('connection', function(socket) {
  socket.emit('initialize', {
    id: socket.id,
    score: score
  });
  socket.on('click', function(data) {
    for (var id in shapes) {
      if (hit(data.x, data.y, shapes[id].x, shapes[id].y)) {
        delete shapes[id];
        io.emit('destroyShape', id);

        var found = false;
        for (var i = 0, len = score.length; i < len; i++) {
          if (score[i].id == socket.id) {
            score[i].name = data.name;
            score[i].score++;
            found = true;
            if (score[i].score >= 51) {
              score = [];
            }
          }
        }
        if (!found) {
          score.push({
            id: socket.id,
            name: data.name,
            score: 1
          });
        }

        score.sort(function(a, b) {
          return b.score - a.score;
        });
        io.emit('score', score);
        break;
      }
    }
  });
});

var count = 0;
var tps = 1;
const gameloop = require('node-gameloop');
const id = gameloop.setGameLoop(function(deltaTime) {
  shapes[count] = {
    id: count,
    x: getRandomInt(shapeSize, 800 - shapeSize),
    y: getRandomInt(shapeSize, 600 - shapeSize)
  }
  io.emit('shape', shapes[count]);
  count++;
}, 1000 / tps);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hit(clickX, clickY, shapeX, shapeY) {
  if ((clickX > shapeX) && (clickX < shapeX + shapeSize) && (clickY > shapeY) && (clickY < shapeY + shapeSize)) {
    return true;
  } else {
    return false;
  }
}
