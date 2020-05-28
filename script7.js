var elem = document.getElementById("txt");
var elemX = window.innerHeight/2;

// window.onload = function() {
//   setInterval(frame, 500);
// };

function frame() {
      elemX = elemX-5;
      elem.style.left = elemX + "px";
      // elem.style.top = window.Width/2 + "px";
}

var img;
var xpos;
var ypos;
var xdir;
var ydir;
var speed;
var scale;
var txt;

function preload() {
  img = loadImage("/images/check.jpg");
}

function setup() {
  colorMode(HSB, 100, 255);
  rectMode(CENTER);

  stroke(255, 0, 255);

  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('myContainer');
  background(0);

  txt = new Txt();
  xdir = 1;
  ydir = 1;
  scale = 0.5;
  speed = 40;
  xpos = 28;
  ypos = 0;

}

function draw() {
  frame();

  textSize(40);
  fill(random(0, 100), 255, 120);
  stroke(255, 0, 255);
  strokeWeight(4);

  // txt.update();
  // txt.display();
  // console.log(txt);
  tint(random(0, 255), random(0, 255), random(50, 200), 50);
  image(img, xpos, ypos, img.width * scale, img.height * scale);
  if (frameCount % 19 == 0) {
    // text("how much does it cost to fix everything?", random(0, windowWidth), random(0, windowHeight));
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

class Txt {
  constructor() {
    this.xloc = windowWidth/2;
    this.yloc = windowHeight/2;
    this.msg = "this is a test";
    // let angle = random(0, 2 * PI);
    // this.xspeed = -1*random(40, 60);
    this.xspeed = -5;
    // this.yspeed = random(1, 3);
  }

  update() {
    this.xloc += this.xspeed;
    // this.y += this.yspeed;
    if (this.xloc <-100 ) this.xloc = windowWidth + 100;
  }

  display() {
    text(this.msg, this.xloc, this.yloc);
  }
}

// class Jitter {
//   constructor() {
//     this.x = random(width);
//     this.y = random(height);
//     this.diameter = random(10, 30);
//     this.speed = 1;
//   }
//
//   move() {
//     this.x += random(-this.speed, this.speed);
//     this.y += random(-this.speed, this.speed);
//   }
//
//   display() {
//     ellipse(this.x, this.y, this.diameter, this.diameter);
//   }
// }
