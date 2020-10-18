var rock, rock2, c1, c2, fishImage, waterImage, waterSound, grassImage, sandImage
var sandArray = []
var waterArray = []
var rockArray = []
var grassAray = []
var state, tempState
var canvas;

var yoff = 0;
var level1=700;
var level2=800;

var waterLevel = 0
var sandLevel = 0
var rockLevel = 0
var grassLevel = 0
var buttonArray


function preload(){
  rockImage = loadImage('images/rock.png')
  fishImage = loadImage('images/fish.png')
  waterImage = loadImage('images/water.png')
  waterSound = loadSound("sounds/bubbles.mp3")
  grassImage = loadImage('images/grass.png')
  sandImage = loadImage('images/sand.png')
}


function setup() {
  canvas = createCanvas(1000, 800);
  canvas.parent('#container');
  canvas.style('width', '100%');
  canvas.style('height', '100%');

  // objects and array used to hold button info
  var waterObject = {
    name: "water",
    image: waterImage
  }
  var sandObject = {
    name: "sand",
    image: sandImage
  }
  var rockObject = {
    name: "rock",
    image: rockImage
  }
  var grassObject = {
    name: "grass",
    image: grassImage
  }
  buttonArray = [waterObject, sandObject, rockObject, grassObject]
}

function draw() {
  imageMode(CENTER)

  // FILL TANK
  drawwater();
  if (mouseIsPressed && state == 'water' && mouseY >= 200){
    drawwater();
    if (waterLevel<=500){
      waterLevel +=1
    }
    if (level2>50){
      if (! waterSound.isPlaying() ) { // .isPlaying() returns a boolean
      waterSound.play();
    }
  }
    level1 -= 1.5;
    level2 -= 1.5;
    var drop = new Water(mouseX, mouseY);
    waterArray.push(drop)
  }

  // DISPLAY STATS, BUTTONS, AND TANK WALLS
  displayEnvironmentalStats()
  displayButtons()
  displayTankWalls()




  // ADD SAND
  if (mouseIsPressed && state=='sand' && mouseY >= 200){
    var tempSand = new Sand(mouseX, mouseY)
    sandArray.push(tempSand)
    if(sandLevel<=200){
      sandLevel +=1
    }
  }


  // DISPLAY CLASSES
  for (var i = sandArray.length-1; i >= 0; i--) {
    sandArray[i].display()
  }
  for (var i = rockArray.length-1; i >= 0; i--) {
    rockArray[i].display()
  }
  for (var i = waterArray.length-1; i >= 0; i--) {
    waterArray[i].display()
  }
  for (var i = grassAray.length-1; i >= 0; i--) {
    grassAray[i].display()
  }


}


// ROCK CLASS
class Rock {
  constructor(x, y){
    this.x = x
    this.y = y
  }
  display(){
    image(rockImage, this.x, this.y, 200, 100)
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
      if (this.y <= height-10){
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
function displayTankWalls() {
    stroke(0)
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
  text("Water level: " + waterLevelMapped + "%", width-120, 20 )

  var sandLevelMapped = int(map(sandLevel, 0, 200, 1, 100))
  text("Sand level: " + sandLevelMapped + "%", width-120, 60 )

  var rockLevelMapped = int(map(rockLevel, 0, 4, 1, 100))
  text("Rock level: " + rockLevelMapped + "%", width-120, 100 )

  var grassLevelMapped = int(map(grassLevel, 0, 4, 1, 100))
  text("Grass level: " + grassLevelMapped + "%", width-120, 140 )
}


// display rocks and grass
function mousePressed(){
  if (state == 'rock'&& mouseY >= 200){
    var tempRock = new Rock(mouseX, mouseY)
    rockArray.push(tempRock)
    if (rockLevel <=3){
      rockLevel +=1
    }
  }
  else if (state == 'grass' && mouseY >= 200){
    var tempGrass = new Grass(mouseX, mouseY)
    grassAray.push(tempGrass)
    if (grassLevel <=3){
      grassLevel +=1
    }
  }
}


// MAKE THE WATER BOUNCE
function drawwater() { // https://editor.p5js.org/YiyunJia/sketches/BJz5BpgFm
  background(254,254,255);
  fill(100,200,255,200);
  stroke(254,254,255);
  beginShape();  // We are going to draw a polygon out of the wave points
  var xoff = 0; // 2D Noise
  for (var x = 0; x <= width; x += 10) {  // Iterate over horizontal pixels
      var y = map(noise(xoff, yoff), 0, 1, level1, level2);
      vertex(x, y);      // Set the vertex
      xoff += 0.05;      // Increment x dimension for noise
  }
  yoff += 0.005;   // increment y dimension for noise
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
}





class Button{
  constructor(x, y){
    this.x = x
    this.y = y
    this.buttonX = 50
    this.buttonY = 50
  }

  drawButton(buttonArray, mouseX, mouseY){
      for (var i=0; i<buttonArray.length; i++){
        noFill()
        strokeWeight(1)
        stroke(0)
        rect(this.buttonX, this.buttonY, 50, 50)
        image(buttonArray[i].image, this.buttonX+25, this.buttonY+25, 25, 25)
        noStroke()
        fill(0)
        text(buttonArray[i].name, this.buttonX, this.buttonY+75)
        this.buttonX += 50
        if (mouseIsPressed && mouseX > this.buttonX-50 && mouseX < this.buttonX && mouseY > this.buttonY && mouseY < this.buttonY + 50) {
          return buttonArray[i].name
        }
      }
  }

}

function displayButtons(){
    var buttonClass = new Button(mouseX, mouseY)
    tempState = buttonClass.drawButton(buttonArray, mouseX, mouseY)
    if (tempState){
      state = tempState
    }
}