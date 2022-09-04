let grid, ctxGrid;
let graphs, ctxGraphs;
const START_MIN_REAL = -2, START_MAX_REAL = 2, START_MIN_IMAG = -2, START_MAX_IMAG = 2;
let minReal, maxReal, minImaginary, maxImaginary, conversionFactor;

// STARTING POINT
let zReal0 = 0, zImag0 = 0;
let cReal = 1, cImag = 0;

// helpers
const getComplexReal = (x) => minReal + x*conversionFactor;
const getComplexImaginary = (y) => maxImaginary - y*conversionFactor;

const getX = (real) => Math.round((real - minReal) / conversionFactor);
const getY = (imag) => Math.round((maxImaginary - imag) / conversionFactor);
const convertDistanceToPixels = (distance) => Math.round(distance / conversionFactor);

window.onload = init;

function init() {
  grid = document.getElementById('grid');
  graphs = document.getElementById('graphs');
  subscribeEventListeners();
  setWindowSize();
  drawGridLines();
  renderSeries();
}

function drawGridLines() {
  const originX = getX(0), originY = getY(0);
  ctxGrid = grid.getContext('2d');

  ctxGrid.clearRect(0, 0, grid.width, grid.height);

  ctxGrid.beginPath();

  // Y Axis
  ctxGrid.moveTo(originX, 0);
  ctxGrid.lineTo(originX, grid.height);

  // X Axis
  ctxGrid.moveTo(0, originY);
  ctxGrid.lineTo(grid.width, originY);

  ctxGrid.strokeStyle = '#000000';
  ctxGrid.lineWidth = 3;
  ctxGrid.stroke();
  
  // Draw vertical grid lines
  for(let x = Math.ceil(minReal); x <= Math.floor(maxReal); x++) {
    const xPixel = getX(x);
    ctxGrid.moveTo(xPixel, 0);
    ctxGrid.lineTo(xPixel, grid.height);
  }

  // Draw horizontal grid lines
  for(let y = Math.ceil(minImaginary); y <= Math.floor(maxImaginary); y++) {
    const yPixel = getY(y);
    ctxGrid.moveTo(0, yPixel);
    ctxGrid.lineTo(grid.width, yPixel);
  }  

  ctxGrid.lineWidth = 1;
  ctxGrid.stroke();

  circle(ctxGrid);
}

function setWindowSize() {
  grid.width = window.innerWidth;
  grid.height = window.innerHeight;
  graphs.width = window.innerWidth;
  graphs.height = window.innerHeight;

  const aspectRatio = grid.height/grid.width;

  if (aspectRatio <= 1) {
    minImaginary = START_MIN_IMAG;
    maxImaginary = START_MAX_IMAG;
    const imagWidth = maxImaginary - minImaginary;
    const realWidth = imagWidth / aspectRatio;
    minReal = realWidth / -2;
    maxReal = realWidth / 2;
  } else {
    minReal = START_MIN_REAL;
    maxReal = START_MAX_REAL;
    const realWidth = maxReal - minReal;
    const imagWidth = realWidth / aspectRatio;
    minImaginary = imagWidth / -2;
    maxImaginary = imagWidth / 2;
  }

  conversionFactor = (maxReal-minReal)/(grid.width-1);
}

// Listeners

function subscribeEventListeners() {
  let timeout;
  const delay = 250;

  window.addEventListener('resize', () => {
    clearTimeout(timeout);
    timeout = setTimeout(setWindowSize, delay);
  });

  window.addEventListener('pointermove', (e) => {
    updatePointValue(e.offsetX, e.offsetY);
  });
}

// Graphing code

const MAX_ITERATIONS = 1;

// CHANGE THIS FUNCTION FOR NEW ITERATIONS
function iterate(x, y) {
  const real = getComplexReal(x), imag = getComplexImaginary(y);

  const newReal = real * real - (imag * imag);
  const newImag = 2 * real * imag;

  // console.log('newReal: ', newReal);
  // console.log('newImag: ', newImag);
  return [getX(newReal), getY(newImag)];
}

function updatePointValue(posX, posY) {
  // console.log('Complex coordinates: ' + getComplexReal(posX) + ' + ' + getComplexImaginary(posY) + 'i');
  cReal = getComplexReal(posX);
  cImag = getComplexImaginary(posY);
  renderSeries();
}

function renderSeries() {
  ctx = graphs.getContext('2d');
  ctx.clearRect(0, 0, graphs.width, graphs.height);

  // COMMENT OUT THIS LINE TO START AT THE ORIGIN
  zReal0 = cReal, zImag0 = cImag;

  let p1x = getX(zReal0), p1y = getY(zImag0);
  let [p2x, p2y] = iterate(p1x, p1y);

  ctx.lineWidth = 1;
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#8debf7';

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(p2x, p2y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p2x, p2y, 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();

    const [nextX, nextY] = iterate(p2x, p2y);
    p1x = p2x, p1y = p2y;
    p2x = nextX, p2y = nextY
  }
}

function circle(ctx) {
  const originX = getX(0), originY = getY(0);
  ctx.beginPath()
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#0000ff'
  ctx.arc(originX, originY, convertDistanceToPixels(1), 0, 2 * Math.PI);
  ctx.stroke();
}
