function Shape(id, x, y, size) {
  this.shape = new PIXI.Graphics();
  this.shape.id = id;
  this.shape.beginFill(0x000000, 1);
  this.shape.drawRect(x, y, size, size);
  app.stage.addChild(this.shape);
  this.shape.interactive = true;

  this.shape.on('pointerdown', function() {
    socket.emit('hit', {
      name: document.getElementById('name').value,
      id: this.id
    });
  });
}



Shape.prototype.getId = function() {
  return this.id;
}

Shape.prototype.getX = function() {
  return this.shape.x;
}

Shape.prototype.getY = function() {
  return this.shape.y;
}

Shape.prototype.removeshape = function() {
  this.shape.destroy();
}
