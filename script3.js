let charRNN;
let textInput;
let tempSlider;
let startBtn;
let resetBtn;
let singleBtn;
let generating = false;

function setup() {
  noCanvas();
  // Create the LSTM Generator passing it the model directory
  charRNN = ml5.charRNN('./models/bejamin/', modelReady);
  // Grab the DOM elements
  textInput = select('#textInput');
  startBtn = select('#start');
  resetBtn = select('#reset');
  singleBtn = select('#single');

  // DOM element events
  startBtn.mousePressed(generate);
  resetBtn.mousePressed(resetModel);
  // singleBtn.mousePressed(predict);
}

function windowResized() {
  resizeCanvas(windowWidth, canvasHeight);
}

async function modelReady() {
  // select('#status').html('Model Loaded');
  resetModel();
}

function resetModel() {
  charRNN.reset();
  const seed = select('#textInput').elt.innerHTML;
  // console.log(seed);
  var result = charRNN.feed(seed);
  console.log(result);
  select('#result').html(seed);
}

function generate() {
  if (generating) {
    generating = false;
    startBtn.html('Start');
  } else {
    generating = true;
    startBtn.html('Pause');
    loopRNN();
  }
}

async function loopRNN() {
  while (generating) {
    await predict();
  }
}

async function predict() {
  let par = select('#result');
  let temperature = 0.5;
  let next = await charRNN.predict(temperature);
  await charRNN.feed(next.sample);
  par.html(par.html() + next.sample);
}
