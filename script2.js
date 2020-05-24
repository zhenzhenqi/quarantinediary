/*
 *Pierre MARZIN, sorting pixels by different criteria,
 *and displaying them with a tween effect
 *
 */
var rowPix=[];
var index=[];
var img=[];
var imgindex=0;
var newimg;
var pixelColor;
var scanline, column;  // vertical position
var droite, gauche, amp;
var sortingcriterium=0;
var mode, infotext, help;


var vertical=false;

function preload() {
  img = loadImage("/images/ac.jpg");
	console.log(img);
}

function setup() {
  let cnv = createCanvas(img.width, img.height);
	cnv.parent('myContainer');
	imageMode(CENTER);
  fill(0, 255, 255);
  stroke(255);
  mode="luminance";

  amp=65;
  newimg=createImage(width, height);
  newimg.loadPixels();
  for (var i=0; i<newimg.pixels.length; i++) {
    newimg.pixels[i]=255;
  }
  newimg.updatePixels();
  stroke(255, 0, 0);
}

function draw() {
	// image(img, 0, 0);
  var ratio=(1-sin(PI/2+frameCount/amp))/4;
  if (frameCount==1) {
    img.resize(width, height);
    img.loadPixels();
    image(img, width/2, height/2);

    if (vertical) {
      rowPix=[];
      sortPixV();
    } else {
      rowPix=[];
      sortPixH();
    }
  } else {
    for (var i=0; i<width; i++) {
      for (var j=0; j<height; j++) {
        if (vertical) {
          var postemp=int(map(ratio, 0, 1, j, (index[i][j])/width));//(index[i][j]-j)/width;//
          newimg.pixels[4*(i+j*width)]=[imgindex].pixels[4*(postemp*width+i)];
          newimg.pixels[4*(i+j*width)+1]=img.pixels[4*(postemp*width+i)+1];
          newimg.pixels[4*(i+j*width)+2]=img.pixels[4*(postemp*width+i)+2];
        } else {
          var postemp=int(map(ratio, 0, 1, i, (index[i][j])%width));//(index[i][j]-j)/width;//
          newimg.pixels[4*(i+j*width)]=img.pixels[4*(postemp+width*j)];
          newimg.pixels[4*(i+j*width)+1]=img.pixels[4*(postemp+width*j)+1];
          newimg.pixels[4*(i+j*width)+2]=img.pixels[4*(postemp+width*j)+2];
        }
      }
    }
    newimg.updatePixels();
    image(newimg, width/2, height/2);
    textSize(24);
    text(infotext, 10, height-40);
    rect(10, height-15, map(ratio, 0, 1, 0, width-30), 5);
  }
}
function resetIndex(){
  index=[];
  for (var i=0; i<width; i++) {
    index[i]=[];
    for (var j=0; j<height; j++) {
      index[i][j]=i+j*width;
    }
  }
}
function sortPixV() {
  resetIndex();
  for (var i=0; i<width; i++) {
    for (var j=0; j<height; j++) {
        rowPix[j]=huefromRGB(img.pixels[4*(i+j*width)]/255, img.pixels[4*(i+j*width)+1]/255, img.pixels[4*(i+j*width)+2]/255);
    }
    quicksort(rowPix, 0, height-1, i);
  }
}
function sortPixH() {
  index=[];
  for (var i=0; i<width; i++) {
    index[i]=[];
    for (var j=0; j<height; j++) {
      index[i][j]=i+j*width;
    }
  }
  for (var j=0; j<height; j++) {
    for (var i=0; i<width; i++) {
      switch(sortingcriterium) {
      case 0:
        rowPix[i]=huefromRGB(img.pixels[4*(i+j*width)]/255, img.pixels[4*(i+j*width)+1]/255, img.pixels[4*(i+j*width)+2]/255);
        break;
      case 1:
        rowPix[i]=saturationfromRGB(img.pixels[4*(i+j*width)]/255, img.pixels[4*(i+j*width)+1]/255, img.pixels[4*(i+j*width)+2]/255);
        break;
      case 2:
        rowPix[i]=luminancefromRGB(img.pixels[4*(i+j*width)]/255, img.pixels[4*(i+j*width)+1]/255, img.pixels[4*(i+j*width)+2]/255);
        break;
      case 3:
        rowPix[i]=img.pixels[4*(i+j*width)];
        break;
      case 4:
        rowPix[i]=img.pixels[4*(i+j*width)+1];
        break;
      case 5:
        rowPix[i]=img.pixels[4*(i+j*width)+2];
        break;
      }
    }
    quicksort(rowPix, 0, width-1, j);
  }
}
function quicksort(tableau, debut, fin, col) {

  if (debut<fin) {
    var indicePivot=partition(tableau, debut, fin, col);
    quicksort(tableau, debut, indicePivot-1, col);
    quicksort(tableau, indicePivot+1, fin, col);
  }
}

function partition(t, debut, fin, col) {
  var valeurPivot=t[debut];
  var indd;
  if (vertical) {
    indd=index[col][debut];
  } else indd=index[debut][col];
  var d=debut+1;
  var f=fin;
  while (d<f) {
    while (d<f&&t[f]<=valeurPivot)f--;
    while (d<f&&t[d]>=valeurPivot)d++;
    var temp=t[d];
    if (vertical) {
      var tempindex=index[col][d];
      t[d]=t[f];
      t[f]=temp;
      index[col][d]=index[col][f];
      index[col][f]=tempindex;
    } else {
      var tempindex=index[d][col];
      t[d]=t[f];
      t[f]=temp;
      index[d][col]=index[f][col];
      index[f][col]=tempindex;
    }
    droite=d;
    gauche=f;
  }
  if (t[d]<valeurPivot)d--;
  t[debut]=t[d];
  t[d]=valeurPivot;
  if (vertical) {
    index[col][debut]=index[col][d];
    index[col][d]=indd;
  } else {
    index[debut][col]=index[d][col];
    index[d][col]=indd;
  }
  droite=d;
  gauche=d;
  return d;
}
function huefromRGB(r, g, b) {
  var minv=min(r, g, b);
  var maxv=max(r, g, b);
  var h=0;
  if (maxv!=minv) {
    if (r==maxv) {
      h=(g-b)/(maxv-minv);
    } else if (g==maxv) {
      h=2.0 + (b-r)/(maxv-minv);
    } else {
      h=4.0 + (r-g)/(maxv-minv);
    }
  }
  return h;
}
function luminancefromRGB(r, g, b) {
  var minv=min([r, g, b]);
  var maxv=max(r, g, b);
  return (minv+maxv)/2;
}
function saturationfromRGB(r, g, b) {
  var minv=min(r, g, b);
  var maxv=max(r, g, b);
  var s=0;
  if (minv!=maxv)s=(minv+maxv)/2>.5?(maxv-minv)/(2.0-maxv-minv):(maxv-minv)/(maxv+minv);
  return s;
}
function mouseReleased() {
  imgindex++;
  imgindex%=6;
  img.resize(width, height);
  img.loadPixels();
  image(img, 0, 0);
  if (vertical) {
    rowPix=[];
    sortPixV();
  } else {
    rowPix=[];
    sortPixH();
  }

}
function keyPressed() {
	mode="hue";

  if (vertical) {
    rowPix=[];
    sortPixV();
  } else {
    rowPix=[];
    sortPixH();
  }
}
