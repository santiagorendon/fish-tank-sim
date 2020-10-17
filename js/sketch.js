var rock, rock2, c1, c2, fishImage, waterImage, waterSound, grassImage, sandImage
var sandArray = []
var waterArray = []
var rockArray = []
var grassAray = []
var state = 'sand'
var canvas;

var yoff = 0;
var level1=700;
var level2=800;


var waterLevel = 0
var sandLevel = 0
var rockLevel = 0
var grassLevel = 0



function preload(){
  rock = loadImage('images/rock.png')
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
}

function draw() {
  imageMode(CENTER)


  // FILL TANK
  drawwater();
  if (mouseIsPressed && state == 'fillingTank' && mouseY >= 200){
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

  // DISPLAY STATS
  displayEnvironmentalStats()

  displayButtons()
 



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

  // DRAW TANK WALLS
  stroke(0)
  tankWalls()


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
  constructor(x, y, buttonX, buttonY, specificButton){
    this.x = x
    this.y = y
    this.buttonX = buttonX
    this.buttonY = buttonY
    this.specificButton = specificButton
  }

  drawButton(testX, testY){
      // image(this.specificButton, this.buttonX, this.buttonY, 50, 50);
      rect(this.buttonX, this.buttonY, 50, 50)
      text(this.specificButton, this.buttonX, this.buttonY+75)
  }

  isButtonPressed(testX, testY) {

    if (testX > this.buttonX && testX < this.buttonX+50 && testY > this.buttonY && testY < this.buttonY + 50) {
      return true
      
    }
    
    // not over the button - return false
    else {
      return false;
    }
}
}


function displayButtons(){
  var GrassButton = new Button(mouseX, mouseY, 50, 50, "grass")
  GrassButton.drawButton(mouseX, mouseY);
  if (mouseIsPressed){
    var checked = GrassButton.isButtonPressed(mouseX, mouseY)
    if (checked) {
      state = 'grass'
    }
  }
  
  var RockButton = new Button(mouseX, mouseY, 100, 50, "rock")
  RockButton.drawButton(mouseX, mouseY);
  if (mouseIsPressed){
    var checked = RockButton.isButtonPressed(mouseX, mouseY)
    if (checked) {
      state = 'rock'
    }
  }

  var SandButton = new Button(mouseX, mouseY, 150, 50, "sand")
  SandButton.drawButton(mouseX, mouseY);
  if (mouseIsPressed){
    var checked = SandButton.isButtonPressed(mouseX, mouseY)
    if (checked) {
      state = 'sand'
    }
  }
  
  var WaterButton = new Button(mouseX, mouseY, 200, 50, "water")
  WaterButton.drawButton(mouseX, mouseY);
  if (mouseIsPressed){
    var checked = WaterButton.isButtonPressed(mouseX, mouseY)
    if (checked) {
      state = 'fillingTank'
    }
  }
}