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
var shapes = [];
var shapeSize = 50;

io.on('connection', function(socket) {
  socket.emit('initialize', {
    id: socket.id,
    score: score,
    shapes: shapes
  });

  socket.on('hit', function(data) {
    for (var i = 0, len = shapes.length; i < len; i++) {
      if (shapes[i].id == data.id) {
        io.emit('destroyShape', shapes[i].id);
        shapes.splice(i, 1);
        break;
      }
    }

    var newShape = {
      id: count,
      x: getRandomInt(shapeSize, 800 - shapeSize),
      y: getRandomInt(shapeSize, 600 - shapeSize),
      size: shapeSize
    };
    shapes.push(newShape)
    io.emit('shape', newShape);
    count++;

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
  });
});

var count = 0;
var newShape = {
  id: count,
  x: getRandomInt(shapeSize, 800 - shapeSize),
  y: getRandomInt(shapeSize, 600 - shapeSize),
  size: shapeSize
};
shapes.push(newShape)
io.emit('shape', newShape);
count++;
// var tps = 2;
// const gameloop = require('node-gameloop');
// const id = gameloop.setGameLoop(function(deltaTime) {
//   var newShape = {
//     id: count,
//     x: getRandomInt(shapeSize, 800 - shapeSize),
//     y: getRandomInt(shapeSize, 600 - shapeSize),
//     size: shapeSize
//   };
//   shapes.push(newShape)
//   io.emit('shape', newShape);
//   count++;
//   if (shapes.length > 5) {
//     var remove = shapes.shift();
//     io.emit('destroyShape', remove.id);
//   }
// }, 1000 / tps);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
