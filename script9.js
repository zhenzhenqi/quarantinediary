var blobs = []

function setup() {
  var cnv = createCanvas(800, 800);
  cnv.parent('myContainer');
	colorMode(HSB);
  for (i = 0; i < 18; i++) blobs.push(new Blob(width/2,height/2));
}

function draw() {
  background(0);
  loadPixels();
  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      let sum = 0;
      for (i = 0; i < blobs.length; i++) {
				//let d = dist(x,y,blobs[i].x,blobs[i].y);//too heavy...
      	let xdif = x - blobs[i].x;
				let ydif = y - blobs[i].y;
      	let d = sqrt((xdif * xdif) + (ydif * ydif));
        sum += 10 * blobs[i].r*10 / d;
      }
			if(sum > 230  && sum <255){
				set(x, y, color(map(sum,230,255,0,255), 0, 255));
			}

    }
  }
  updatePixels();

  for (i = 0; i < blobs.length; i++) {
    blobs[i].update();
		//blobs[i].show();
  }
}


class Blob {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    let angle = random(0, 2 * PI);
    this.xspeed = random(2, 5) * Math.cos(angle);
    this.yspeed = random(2, 5) * Math.sin(angle);
    this.r = random(12, 24);
  }

  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;
    if (this.x > width*0.8 || this.x < width*0.2) this.xspeed *= -1;
    if (this.y > height*0.8 || this.y <  height*0.2) this.yspeed *= -1;
  }

  show() {
		fill(255,0,255);
		noStroke();
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }
}
