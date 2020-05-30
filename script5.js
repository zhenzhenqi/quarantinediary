let danmuSampleDOM = document.getElementById("txt");
// let elemX = window.innerHeight / 2;
let danmuDOMlist = [];
let leftOffsets = [];
let danmuCount = 9;


// window.onload = function() {
//   setInterval(frame, 500);
// };

function initDanmus() {
  //put existing danmu into list
  danmuDOMlist.push(danmuSampleDOM);
  //existing danmu's random xleft value
  leftOffsets.push(random(windowWidth + random(0, 20)));
  for (let i = 0; i < danmuCount; i++) {
    let newDanmuDOM = danmuSampleDOM.cloneNode(true);
    danmuDOMlist.push(newDanmuDOM);
    newDanmuDOM.style.top = random(30, windowHeight-200) + "px";
    document.getElementById("danmus").appendChild(newDanmuDOM);
    leftOffsets.push(random(windowWidth + random(0, 583)));
  }
}

function updateDanmus() {
  for (let i = 0; i < danmuDOMlist.length; i++) {
    leftOffsets[i] -= 2;
    danmuDOMlist[i].style.left = leftOffsets[i] + "px";
    if (leftOffsets[i] < -300) {
      //reset y
      leftOffsets[i] = windowWidth;
      //reset x
      danmuDOMlist[i].style.top = random(0, windowHeight);
    }
  }

  // elemX = elemX - 5;
  // danmuDOM.style.left = elemX + "px";
  // elem.style.top = window.Width/2 + "px";
}

let img;
let xpos;
let ypos;
let xdir;
let ydir;
let speed;
let scale;
let txt;

function preload() {
  img = loadImage("/images/check.jpg");
}

function setup() {
  colorMode(HSB, 100, 255);
  rectMode(CENTER);
  background(240, 100, 100);
  // stroke(255, 0, 255);

  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent('myContainer');


  txt = new Txt();
  xdir = 1;
  ydir = 1;
  scale = 0.5;
  speed = 20;
  xpos = 28;
  ypos = 0;

  initDanmus();

}

function draw() {
  updateDanmus();

  // textSize(40);
  // fill(random(0, 100), 255, 120);
  // stroke(255, 0, 255);
  // strokeWeight(4);

  // txt.update();
  // txt.display();
  // console.log(txt);
  tint(random(0, 255), 255, 50, 255);
  image(img, xpos, ypos, img.width * scale, img.height * scale);
  if (frameCount % 13 == 0) {
    // text("how much does it cost to fix everything?", random(0, windowWidth), random(0, windowHeight));
    xpos += xdir * speed;
    ypos += ydir * speed;
    speed += 1;
  }

  if (xpos > window.width - img.width * scale | xpos < 0) {
    xdir *= -1;
  }

  if (ypos > window.height - img.height * scale | ypos < 0) {
    ydir *= -1;
  }
}

class Txt {
  constructor() {
    this.xloc = windowWidth / 2;
    this.yloc = windowHeight / 2;
    this.msg = "this is a test";
    // let angle = random(0, 2 * PI);
    // this.xspeed = -1*random(40, 60);
    this.xspeed = -5;
    // this.yspeed = random(1, 3);
  }

  update() {
    this.xloc += this.xspeed;
    // this.y += this.yspeed;
    if (this.xloc < -100) this.xloc = windowWidth + 100;
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
