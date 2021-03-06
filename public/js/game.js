var app;
var socket;
var shape;

window.onload = function start() {
  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
  app = new PIXI.Application(window.innerWidth, window.innerHeight, {
    backgroundColor: 0xFFFFFF,
    antialias: false
  });
  document.body.appendChild(app.view);
  app.renderer.view.style.position = 'absolute';
  app.renderer.view.style.top = 0;
  app.renderer.view.style.left = 0;
  app.renderer.view.style.zIndex = 0;

  socket = io();
  socket.on('initialize', function(data) {
    document.getElementById('name').value = data.id.substr(0, 5);
    printScore(data.score);
    newShape(data.shape.id, data.shape.x, data.shape.y, data.shape.size);
  });
  socket.on('score', function(data) {
    printScore(data.score);
    document.getElementById('lastHit').innerHTML = data.lastHit;
  });
  socket.on('shape', function(shape) {
    newShape(shape.id, shape.x, shape.y, shape.size);
  });
  window.onresize = function() {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}

function printScore(data) {
  document.getElementById('score').innerHTML = "";
  for (var i = 0, len = data.length; i < len; i++) {
    var name = document.createElement('p');
    name.innerHTML = data[i].name + ":&nbsp;&nbsp;&nbsp;" + data[i].score;
    document.getElementById('score').appendChild(name);
  }
}

function newShape(id, x, y, size) {
  if (shape)
    shape.destroy();

  shape = new PIXI.Graphics();
  shape.id = id;
  shape.beginFill(0x000000, 1);
  shape.drawRect(parseFloat("." + x) * window.innerWidth, parseFloat("." + y) * window.innerHeight, size, size);
  app.stage.addChild(shape);
  shape.interactive = true;
  shape.on('pointerdown', function() {
    socket.emit('hit', {
      id: shape.id,
      name: document.getElementById('name').value
    });
  });
}
