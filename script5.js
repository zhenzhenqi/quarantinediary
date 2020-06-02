let danmuSampleDOM = document.getElementById("txt1");
let danmuDOMlist = [];
let emosDOMlist = [];
let leftOffsets = [];
let totalDanmu = 8;
let emos = ["Q.Q", "(╯°□°）╯︵ ┻━┻", "_____", "orz", "(-_-メ)", "(°◇°)", "(-_-;)", "●～*"];


// function create

function initDanmus() {
  //put existing danmu into list
  danmuDOMlist.push(danmuSampleDOM);
  // console.log(danmuSampleDOM);

  //existing danmu's random xleft value
  leftOffsets.push(random(windowWidth + random(0, 20)));
  for (let i = 0; i < totalDanmu; i++) {
    let newDanmuDOM = danmuSampleDOM.cloneNode(true);
    // if (i % 3 != 0) {
    //   let emosIndex = Math.floor(Math.random() * Math.floor(emos.length));
    //   console.log(emosIndex);
    //   newDanmuDOM.innerHTML = "How much does it cost to fix " + emos[emosIndex] + "?";
    //   newDanmuDOM.style.color = "white";
    // }
    danmuDOMlist.push(newDanmuDOM);
    newDanmuDOM.style.top = random(20, windowHeight - 200) + "px";
    document.getElementById("danmus").appendChild(newDanmuDOM);
    leftOffsets.push(random(windowWidth + random(0, 50)));
  }
}


function initEmos() {
  for (let i = 0; i < emos.length; i++) {

    // let emosIndex = Math.floor(Math.random() * Math.floor(emos.length));
    // console.log(emosIndex);
    let newDanmuDOM = danmuSampleDOM.cloneNode(true);
    newDanmuDOM.innerHTML = "How much does it cost to fix " + emos[i] + "?";
    newDanmuDOM.style.color = "white";
    danmuDOMlist.push(newDanmuDOM);
    newDanmuDOM.style.top = random(30, windowHeight - 200) + "px";
    document.getElementById("danmus").appendChild(newDanmuDOM);
    leftOffsets.push(random(windowWidth + random(0, 50)));
  }
}


function updateDanmus() {
  for (let i = 0; i < danmuDOMlist.length; i++) {
    leftOffsets[i] -= 2;
    danmuDOMlist[i].style.left = leftOffsets[i] + "px";
    if (leftOffsets[i] < -600) {
      //reset y
      leftOffsets[i] = windowWidth;
      //reset x
      danmuDOMlist[i].style.top = random(30, windowHeight - 200) + "px";
    }
  }
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
  speed = 23;
  xpos = 28;
  ypos = 0;

  initDanmus();
  initEmos();

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
  tint(random(0, 255), 200, 100, 255);
  image(img, xpos, ypos, img.width * scale, img.height * scale);
  if (frameCount % 13 == 0) {
    // text("how much does it cost to fix everything?", random(0, windowWidth), random(0, windowHeight));
    xpos += xdir * speed;
    ypos += ydir * speed;
    speed += 1.1;
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
