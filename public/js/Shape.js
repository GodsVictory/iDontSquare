function Shape(id, x, y) {
  this.id = id;
  this.shape = new PIXI.Graphics();
  this.shape.beginFill(0x000000, 1);
  this.shape.drawRect(x, y, 25, 25);
  app.stage.addChild(this.shape);
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
