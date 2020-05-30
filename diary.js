let charRNN;
let textInput;
let tempSlider;
let startBtn;
let resetBtn;
let singleBtn;
let generating = false;
let totalLen = 3;
let currentLen = 0;

function setup() {
  noCanvas();
  // Create the LSTM Generator passing it the model directory
  charRNN = ml5.charRNN('./models/input', modelReady);

  // Grab the input text
  textInput = select('#textInput');
  seed = select('#textInput').elt.innerHTML;
  // const seed = select('#textInput').value();
}


async function modelReady() {
  // select('#status').html('Model Loaded');
  kickoff();
}

function kickoff() {
  setTimeout(generate, 100);
}

function resetModel() {
  charRNN.reset();
  const seed = select('#textInput').value();
  charRNN.feed(seed);
  select('#result').html(seed);
}

function generate() {
  if (generating) {
    generating = false;
  } else {
    generating = true;
    loopRNN();
  }
}


async function loopRNN() {
  while (generating) {
    await predict();
  }
}

async function predict() {
  // console.log("predict");
  let par = select('#result');
  let temperature = 0.5;
  let next = await charRNN.predict(temperature);
  await charRNN.feed(next.sample);
  par.html(par.html() + next.sample);
  if(next.sample=="."){
    currentLen++;
  }
  if(currentLen >= totalLen){
    generating = false;
  }
}
