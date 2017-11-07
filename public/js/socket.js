function openSocket() {
  socket = io();

  socket.on('initialize', function(data) {
    document.getElementById('name').value = data.id.substr(0, 5);
    printScore(data.score);
  });

  socket.on('update', function(data) {});
  socket.on('score', function(data) {
    printScore(data);
  });
  socket.on('destroyShape', function(id) {
    shapes[id].removeshape();
    delete shapes[id];
  });
  socket.on('shape', function(shape) {
    shapes[shape.id] = new Shape(shape.id, shape.x, shape.y);
  });
};

function printScore(data) {
  document.getElementById('score').innerHTML = "";
  for (var i = 0, len = data.length; i < len; i++) {
    var name = document.createElement('p');
    name.innerHTML = data[i].name + ":&nbsp;&nbsp;&nbsp;" + data[i].score;
    document.getElementById('score').appendChild(name);
  }
}
