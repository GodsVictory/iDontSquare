function openSocket() {
  socket = io();

  socket.on('initialize', function(data) {
    document.getElementById('name').value = data.id.substr(0, 5);
    printScore(data.score);
    for (var i = 0, len = data.shapes.length; i < len; i++) {
      var shape = data.shapes[i];
      shapes.push(new Shape(shape.id, shape.x, shape.y, shape.size));
    }
  });

  socket.on('update', function(data) {});
  socket.on('score', function(data) {
    printScore(data);
  });
  socket.on('destroyShape', function(id) {
    for (var i = 0, len = shapes.length; i < len; i++) {
      if (shapes[i].shape.id == id) {
        shapes[i].removeshape();
        shapes.splice(i, 1);
        break;
      }
    }
  });
  socket.on('shape', function(shape) {
    shapes.push(new Shape(shape.id, shape.x, shape.y, shape.size));
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
