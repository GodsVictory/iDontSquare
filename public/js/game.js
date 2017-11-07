var app;
var socket;
var id;
var player;
var mobile;
var shapes = {};

window.onload = function start() {
  PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
  app = new PIXI.Application(800, 600, {
    backgroundColor: 0xFFFFFF,
    antialias: true
  });
  document.getElementById('game').appendChild(app.view);
  openSocket();
}
