/**
 * Constants
 */
var WIDTH = 400;
var HEIGHT = 350;
var pi = Math.PI;
var upArrow = false;
var downArrow = false;
var rightArrow = false;
var leftArrow = false;
/**
 * Game elements
 */
var canvas;
var ctx;
var keystate;
var gameRunning = true;
/**
 * The player paddle
 * 
 * @type {Object}
 */
var player = {
  x: 10,
  y: 100,
  width: 20,
  height: 100,
  vel: {
    x: 0,
    y: 0
  },
  /**
   * Update the position depending on pressed keys
   */
  update: function() {
    if (upArrow) {
      this.y -= 10;
    }
    if (downArrow) {
      this.y += 10;
    }
    if (rightArrow) {
      this.x += 10;
    }
    if (leftArrow) {
      this.x -= 10;
    }
    if (this.x <= 0) {
      this.x = 0;
    }
    if (this.x+this.width >= WIDTH) {
      this.x = WIDTH-this.width;
    }
    if(this.y <= 0){
      this.y = 0;
    }
    if (this.y+this.height >= HEIGHT){
      this.y = HEIGHT-this.height;
    }
  },
  draw: function() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
};

var ball = {
  x: player.x + player.width + 10,
  y: player.y + player.height / 2,
  vel: null,
  side: 20,
  speed: 12,
  /**
   * Serves the ball towards the specified side
   * 
   * @param  {number} side 1 right
   *                       -1 left
   */
  init: function() {
    var r = Math.random() - 0.5;
    var angle = pi * r;
    this.vel = {
      x: this.speed * Math.cos(angle),
      y: this.speed * Math.sin(angle)
    }
  },
  /**
   * Update the ball position and keep it within the canvas
   */
  update: function() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    if (this.y <= 0)
    this.vel.y = this.vel.y*-1;
    if (this.y+this.side >= HEIGHT)
      this.vel.y = this.vel.y*= -1;
    if(this.x+this.side >= WIDTH)
      this.vel.x = this.vel.x*= -1;
    if(this.x > player.x && this.x < player.x + player.width && this.y > player.y && this.y < player.y + player.height){
      this.vel.x*= -1;
    }
  },
 
  /**
   * Draw the ball to the canvas
   */
  draw: function() {
    ctx.fillRect(this.x, this.y, this.side, this.side);
  }
};
/**
 * Starts the game
 */
function main() {
  canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
  document.addEventListener("keydown", function(evt) {
    if (evt.keyCode === 38) upArrow = true;
    else if (evt.keyCode === 40) downArrow = true;
    if (evt.keyCode === 39) rightArrow = true;
    else if (evt.keyCode === 37) leftArrow = true;
  });
  document.addEventListener("keyup", function(evt) {
    if (evt.keyCode === 38) upArrow = false;
    else if (evt.keyCode === 40) downArrow = false;
    if (evt.keyCode === 39) rightArrow = false;
    else if (evt.keyCode === 37) leftArrow = false;
  });
  ball.init();

  var loop = function() {
    update();
    draw();
    window.requestAnimationFrame(loop, canvas);
  };
  window.requestAnimationFrame(loop, canvas);
}

/**
 * Update all game objects
 */
function update() {
    if (gameRunning) {
      ball.update();
      player.update();
    }
  }
  /**
   * Clear canvas and draw all game objects and net
   */
function draw() {
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.save();
    ctx.fillStyle = "#fff";
    ball.draw();
    player.draw();
    //ai.draw();
    // draw the net
    var w = 4;
    var x = (WIDTH - w) * 0.5;
    var y = 0;
    var step = HEIGHT / 20; // how many net segments
    while (y < HEIGHT) {
      ctx.fillRect(x, y + step * 0.25, w, step * 0.5);
      y += step;
    }
    ctx.restore();
  }
  // start and run the game
main();