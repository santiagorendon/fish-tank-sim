var rock, rock2, c1, c2, fishImage, waterImage, waterSound, grassImage
var sandArray = []
var waterArray = []
var rockArray = []
var grassAray = []
var state = 'sand'
var canvas;
var yoff = 0;
var level1=700;
var level2=800;
var canvasHeight = 800;
var canvasWidth = 1000;

var waterLevel = 0
var sandLevel = 0
var rockLevel = 0
var grassLevel = 0

class Game{
  constructor(){
    // this.scene = 'tank';
    this.scene = 'tank';
  }
  drawStore(){
    backgroundFill(214, 253, 255);
    fill(0, 0, 0);
    textAlign(LEFT, TOP)
   .textSize(80);
    textFont(fishFont);
    textAlign(CENTER, TOP);
    text('STORE', canvasWidth/2, 10)
  }
  drawTank(){
    // FILL TANK
    drawWater();
    if (mouseIsPressed && state == 'fillingTank'){
      drawWater();
      if (waterLevel<=500){
        waterLevel +=1
      }
      // if (level2>50){
      //   if (! waterSound.isPlaying() ) { // .isPlaying() returns a boolean
      //   waterSound.play();
      // }
    // }
      level1 -= 1.5;
      level2 -= 1.5;
      var drop = new Water(mouseX, mouseY);
      waterArray.push(drop)
    }
    // DISPLAY STATS
    displayEnvironmentalStats()
    // ADD SAND
    if (mouseIsPressed && state=='sand' && mouseY >= 100){
      var tempSand = new Sand(mouseX, mouseY)
      sandArray.push(tempSand)
      if(sandLevel<=200){
        sandLevel +=1
      }
    }
    // DISPLAY CLASSES
    for(var i = sandArray.length-1; i >= 0; i--) {
      sandArray[i].display()
    }
    for(var i = rockArray.length-1; i >= 0; i--) {
      rockArray[i].display()
    }
    for(var i = waterArray.length-1; i >= 0; i--) {
      waterArray[i].display()
    }

    for(var i = grassAray.length-1; i >= 0; i--) {
      grassAray[i].display()
    }

    // DRAW TANK WALLS
    stroke(0)
    tankWalls()

    // DRAW BUTTONS
    buttonImages()

    commonFish1.draw();
  }
}
class Fish{
  constructor(type){
    this.type = type;
    this.width = 100;
    this.height = 100;
    this.x = 500;
    this.y = 500;
    this.frameDelay = 25;
    this.frameCount = 0;
    this.frame = 0;
    this.frameNum = 2;
    // create a "noise offset" to keep track of our position in Perlin Noise space
    this.xNoiseOffset = random(0,1000);
    this.yNoiseOffset = random(1000,2000);
  }
  draw(){
    this.frameCount += 1;
    if(this.frameCount >= this.frameDelay){
      this.frame = (this.frame+1)%this.frameNum //num between 0 and 1;
      this.frameCount = 0;
    }
    if(this.type === "commonFish"){
      image(commonFishImgArr[this.frame], this.x, this.y, this.width, this.height);
    }
    var xMovement = map( noise(this.xNoiseOffset), 0, 1, -1, 1 );
    var yMovement = map( noise(this.yNoiseOffset), 0, 1, -1, 10);


    this.x += xMovement;
    this.y += yMovement;
    this.x = constrain(this.x, this.width, width-this.width)
    this.y = constrain(this.y, this.height, height-this.height)

    // update our noise offset values
    this.xNoiseOffset += 0.01;
    this.yNoiseOffset += 0.01;
  }
}

function preload(){
  fishFont = loadFont('font/FISH.TTF');
  commonFishImgArr = [loadImage('images/commonFish1.png'), loadImage('images/commonFish2.png')]
  rock = loadImage('images/rock.png')
  fishImage = loadImage('images/fish.png')
  waterImage = loadImage('images/water.png')
  // waterSound = loadSound("sounds/bubbles.mp3")
  grassImage = loadImage('images/grass.png')
}

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('#container');
  canvas.style('width', '100%');
  canvas.style('height', '100%');
  game = new Game();
  commonFish1 = new Fish("commonFish");
  noiseDetail(24);

}

function draw() {
  imageMode(CENTER)
  if(game.scene === "tank"){
      game.drawTank();
  }
  else if(game.scene === "store"){
      game.drawStore();
  }
}


// ROCK CLASS
class Rock {
  constructor(x, y){
    this.x = x
    this.y = y
  }
  display(){
    image(rock, this.x, this.y, 200, 100)
    if (this.y < (height-50)){
      this.y += 1
    }
  }
}

// SAND CLASS

class Sand {
  constructor(x, y){
      this.x = x
      this.y = y
      this.xSpeed = random(-1, 1)
      this.ySpeed = 2
      this.alpha = 255
      this.radius = random(10, 50)
  }
  display(){
      noStroke()
      fill(255,222,173,this.alpha);
      if (this.y <= height-this.radius){
        this.x += this.xSpeed
        this.y += this.ySpeed
      }
      ellipse(this.x, this.y, this.radius, this.radius)

  }
}

// GRASS CLASS
class Grass {
  constructor(x, y){
    this.x = x
    this.y = y
  }
  display(){
    image(grassImage, this.x, this.y, 100, 100)
    if (this.y < (height-50)){
      this.y += 1
    }
  }
}

// WATER CLASS
class Water {
  constructor(x, y){
      this.x = x
      this.y = y
      this.xSpeed = random(-1, 1)
      this.ySpeed = 2
      this.alpha = 255
      this.radius = random(10, 25)
  }
  display(){
      noStroke()
      fill(100,200,255,this.alpha);
      this.x += this.xSpeed
      this.y += this.ySpeed
      ellipse(this.x, this.y, this.radius, this.radius)
      this.alpha -=3
      if (this.alpha < 0){
          return 'gone'
      }
      else {
          return 'ok'
      }
  }
}


// TANK WALLS
function tankWalls() {
    strokeWeight(10)
    line(0, 0, width, 0)
    line(0, 0, 0, width)
    line(0, height, width, height)
    line(width, 0, width, height)
}

// ENVIRONMENTAL STATS
function displayEnvironmentalStats(){
  fill(0)
  var waterLevelMapped = int(map(waterLevel, 0, 500, 1, 100))
  text("Water level: " + waterLevelMapped + "%", 20, 20 )

  var sandLevelMapped = int(map(sandLevel, 0, 200, 1, 100))
  text("Sand level: " + sandLevelMapped + "%", 20, 60 )

  var rockLevelMapped = int(map(rockLevel, 0, 4, 1, 100))
  text("Rock level: " + rockLevelMapped + "%", 20, 100 )

  var grassLevelMapped = int(map(grassLevel, 0, 4, 1, 100))
  text("Grass level: " + grassLevelMapped + "%", 20, 140 )
}


// display rocks and grass
function mousePressed(){
  if (state == 'rock'){
    var tempRock = new Rock(mouseX, mouseY)
    rockArray.push(tempRock)
    if (rockLevel <=3){
      rockLevel +=1
    }
  }
  else if (state == 'grass'){
    var tempGrass = new Grass(mouseX, mouseY)
    grassAray.push(tempGrass)
    if (grassLevel <=3){
      grassLevel +=1
    }
  }
}

function backgroundFill(r, g, b){
  fill(r, g, b);
  rect(0, 0, canvasWidth, canvasHeight);
}

// MAKE THE WATER BOUNCE
function drawWater() { // https://editor.p5js.org/YiyunJia/sketches/BJz5BpgFm
  backgroundFill(254,254,255);
  fill(100,200,255,200);
  stroke(254,254,255);

  // We are going to draw a polygon out of the wave points
  beginShape();

  var xoff = 0; // Option #1: 2D Noise

  // Iterate over horizontal pixels
  for (var x = 0; x <= width; x += 10) {
      // Calculate a y value according to noise, map to

      // Option #1: 2D Noise
      var y = map(noise(xoff, yoff), 0, 1, level1, level2);


      // Set the vertex
      vertex(x, y);
      // Increment x dimension for noise
      xoff += 0.05;
  }
  // increment y dimension for noise
  yoff += 0.005;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}



// need a better way of doing this
function buttonImages(){
  clickedSand.onclick = function(){
    clickedSand.style.backgroundColor = 'black'
    clickedRock.style.backgroundColor = 'white'
    clickedGrass.style.backgroundColor = 'white'
    clickedWater.style.background = 'white'
    state = 'sand'
  }
  clickedRock.onclick = function(){
    clickedSand.style.backgroundColor = 'white'
    clickedRock.style.backgroundColor = 'black'
    clickedGrass.style.backgroundColor = 'white'
    clickedWater.style.background = 'white'
    state = 'rock'
  }
  clickedGrass.onclick = function(){
    clickedSand.style.backgroundColor = 'white'
    clickedRock.style.backgroundColor = 'white'
    clickedGrass.style.backgroundColor = 'black'
    clickedWater.style.background = 'white'
    state = 'grass'
}
  clickedWater.onclick = function(){
    clickedSand.style.backgroundColor = 'white'
    clickedRock.style.backgroundColor = 'white'
    clickedGrass.style.backgroundColor = 'white'
    clickedWater.style.background = 'black'
    state = 'fillingTank'
  }

}
