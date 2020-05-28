var bg, img;
var xpos;
var ypos;
var xdir;
var ydir;
var speed;
var scale;

function preload() {
  // bg = color(255, 0 , 0);
  bg = loadImage("/images/nebula.jpg");
  img = loadImage("/images/check.jpg");
  // console.log(img);
}

function setup() {
  colorMode(HSB, 100, 255);
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('myContainer');
  // background(bg);
  background(0, 0, 0);
  xdir = 1;
  ydir = 1;
  scale = 0.5;
  speed = 40;
  xpos = 28;
  ypos = 0;
}

function draw() {
  tint(random(0, 255),random(0, 255), random(0, 255), 126);
  image(img, xpos, ypos, img.width * scale, img.height * scale);
  if (frameCount % 19 == 0) {
    xpos += xdir * speed;
    ypos += ydir * speed;
    speed += 1;
  }

  if (xpos > window.width - img.width*scale | xpos < 0) {
    xdir *= -1;
  }

  if (ypos > window.height - img.height*scale | ypos < 0) {
    ydir *= -1;
  }
}

class txt {
  constructor(_index) {
    this.xloc = windowWidth+100;
    this.yloc = random(100, windowHeight-100);
    this.index = _index;
    // let angle = random(0, 2 * PI);
    this.xspeed = random(-1, -3);
    // this.yspeed = random(1, 3);
  }

  update() {
    this.x += this.xspeed;
    // this.y += this.yspeed;
    if (this.x <-100 ) this.xloc = -100;
  }

  show() {
    noFill();
    stroke(255, 0, 0);
    strokeWeight(4);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}
