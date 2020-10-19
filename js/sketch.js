var rock, rock2, c1, c2, fishImage, waterImage, waterSound, grassImage, sandImage
var sandArray = []
var waterArray = []
var rockArray = []
var grassAray = []
var state, tempState
var canvas;


var waterLevelMapped, grassLevelMapped, rockLevelMapped, sandLevelMapped

var yoff = 0;
var level1=700;
var level2=800;
var canvasHeight = 800;
var canvasWidth = 1000;

var waterLevel = 0
var sandLevel = 0
var rockLevel = 0
var grassLevel = 0
var buttonArray
var balance = 150

class Game{
  constructor(){
    // this.scene = 'tank';
    this.scene = 'tank';
    /* stats */
    this.stats = {background: 'rgba(221,221,221,0.95)', bar: 'rgba(132, 43, 215, 0.95)',x: 770, y: 5, w: 225, h: 300};
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
    if (mouseIsPressed && state == 'water' && mouseY >= 200){
      drawWater();
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



    // ADD SAND
    if (mouseIsPressed && state=='sand' && mouseY >= 200 && buttonArray[1].locked == false){
      var tempSand = new Sand(mouseX, mouseY)
      sandArray.push(tempSand)
      balance-=.01

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

    // DISPLAY STATS, BUTTONS, AND TANK WALLS
    //displayEnvironmentalStats()
    displayButtons()
    displayTankWalls()
    commonFish1.draw();
    commonFish1.drawStats();
  }
}

class Fish{
  constructor(type, rarity){
    this.type = type;
    this.rarity = rarity;
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
    if(this.type === "Gold Fish"){
      image(commonFishImgArr[this.frame], this.x, this.y, this.width, this.height);
    }
    var xMovement = map( noise(this.xNoiseOffset), 0, 1, -3, 3 );
    var yMovement = map( noise(this.yNoiseOffset), 0, 1, -1, 1);

    this.x += xMovement;
    this.y += yMovement;
    this.x = constrain(this.x, this.width, width-this.width)
    this.y = constrain(this.y, this.height, height-this.height)

    // update our noise offset values
    this.xNoiseOffset += 0.01;
    this.yNoiseOffset += 0.01;
  }
  drawStats(){
    fill(game.stats.background);
    strokeWeight(1);
    rect(game.stats.x ,game.stats.y ,game.stats.w ,game.stats.h );
    //stats color

    //draw label
    fill(0)
    textAlign(CENTER, TOP);
    textFont(fishFont);
    textSize(30);
    text(this.type, (game.stats.x+game.stats.x+game.stats.w)/2 ,game.stats.y+35)
    //draw icons
    fill(game.stats.bar);

    image(rarityImg, game.stats.x+40, game.stats.y+100, 100, 100);
    rect(game.stats.x+65, game.stats.y+88, 135, 25)

  }
}

function preload(){
  fishFont = loadFont('font/FISH.TTF');
  rarityImg = loadImage('images/rarity.png');
  commonFishImgArr = [loadImage('images/commonFish1.png'), loadImage('images/commonFish2.png')]
  rockImage = loadImage('images/rock.png')
  fishImage = loadImage('images/fish.png')
  waterImage = loadImage('images/water.png')
  waterSound = loadSound("sounds/bubbles.mp3")
  grassImage = loadImage('images/grass.png')
  sandImage = loadImage('images/sand.png')
}



function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('#container');
  canvas.style('width', '100%');
  canvas.style('height', '100%');
  game = new Game();
  commonFish1 = new Fish("Gold Fish", 10);
  noiseDetail(24);

  // objects and array used to hold button info

  var waterObject = new Button('waterObj', 'water', waterImage, 0, false)
  var sandObject = new Button('sandObject', 'sand', sandImage, .10, false)
  var rockObject = new Button('rockObject', 'rock', rockImage, 2.50, false)
  var grassObject = new Button('grassObject', 'grass', grassImage, 2.50, false)
  var fishObject = new Button('fishObject', 'fish', fishImage, 10, true)
  buttonArray = [waterObject, sandObject, rockObject, grassObject, fishObject]
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
   waterLevelMapped = int(map(waterLevel, 0, 500, 1, 100))
  text("Water level: " + waterLevelMapped + "%", width-120, 20 )

   sandLevelMapped = int(map(sandLevel, 0, 200, 1, 100))
  text("Sand level: " + sandLevelMapped + "%", width-120, 60 )

   rockLevelMapped = int(map(rockLevel, 0, 4, 1, 100))
  text("Rock level: " + rockLevelMapped + "%", width-120, 100 )

   grassLevelMapped = int(map(grassLevel, 0, 4, 1, 100))
  text("Grass level: " + grassLevelMapped + "%", width-120, 140 )

  balance = constrain(balance, 0, 1000000)
  text("Balance: $" + round(balance, 2), 50, 30 )
}


// display rocks and grass
function mousePressed(){
  if (state == 'rock'&& mouseY >= 200 && buttonArray[2].locked == false){
    var tempRock = new Rock(mouseX, mouseY)
    rockArray.push(tempRock)
    balance-=2.50
    if (rockLevel <=3){
      rockLevel +=1
    }
  }
  else if (state == 'grass' && mouseY >= 200 && buttonArray[3].locked == false){
    var tempGrass = new Grass(mouseX, mouseY)
    grassAray.push(tempGrass)
    balance-=2.50
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





class ToolBar{
  constructor(x, y){
    this.x = x
    this.y = y
    this.buttonX = 50
    this.buttonY = 50
  }

  draw(buttonArray, mouseX, mouseY){
      for (var i=0; i<buttonArray.length; i++){
        noFill()
        strokeWeight(1)
        stroke(0)
        rect(this.buttonX, this.buttonY, 50, 50)
        image(buttonArray[i].image, this.buttonX+25, this.buttonY+25, 25, 25)
        if (buttonArray[i].locked){
          line(this.buttonX, this.buttonY, this.buttonX+50, this.buttonY+50)
          line(this.buttonX+50, this.buttonY, this.buttonX, this.buttonY+50)
        }
        noStroke()
        fill(0)
        textSize(15);
        textAlign(LEFT, TOP)
        text(buttonArray[i].name , this.buttonX, this.buttonY+55)
        this.buttonX += 50
        if (mouseIsPressed && mouseX > this.buttonX-50 && mouseX < this.buttonX && mouseY > this.buttonY && mouseY < this.buttonY + 50) {
          return buttonArray[i].name
        }
          // disable fish until environment is set up
        if (waterLevelMapped && sandLevelMapped && rockLevelMapped && grassLevelMapped == 100){
          buttonArray[4].locked = false
        }

        if (balance < buttonArray[i].cost){
          buttonArray[i].locked = true
        }
      }
  }
}

function displayButtons(){
    var toolBar = new ToolBar(mouseX, mouseY)
    tempState = toolBar.draw(buttonArray, mouseX, mouseY)
    if (tempState){
      state = tempState
    }
}


class Button{
  constructor(objectName, name, image, cost, locked){
    this.objectName = objectName
    this.name = name
    this.image = image
    this.cost = cost
    this.locked = locked
    return this.objectName = {
      name: this.name,
      image: this.image,
      cost: this.cost,
      locked: this.locked
    }
  }
}
