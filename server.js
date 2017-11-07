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
var score = [];
var shape;
var shapeSize = 50;

var shape = {
  x: getRandomInt(shapeSize, 800 - shapeSize),
  y: getRandomInt(shapeSize, 600 - shapeSize),
  size: shapeSize
};
io.emit('shape', shape);

io.on('connection', function(socket) {
  socket.emit('initialize', {
    id: socket.id,
    score: score,
    shape: shape
  });

  socket.on('hit', function(data) {
    var shape = {
      x: getRandomInt(shapeSize, 800 - shapeSize),
      y: getRandomInt(shapeSize, 600 - shapeSize),
      size: shapeSize
    };
    io.emit('shape', shape);

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


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
